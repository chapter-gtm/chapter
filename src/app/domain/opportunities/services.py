from __future__ import annotations

import difflib
import structlog
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import ColumnElement, insert, select, or_, and_, not_, func, text
from advanced_alchemy.filters import SearchFilter, LimitOffset
from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from advanced_alchemy.filters import CollectionFilter
from uuid_utils.compat import uuid4

from app.lib.utils import get_domain, get_domain_from_email
from app.lib.schema import CamelizedBaseStruct, OpportunityStage, Location, WorkExperience
from app.lib.pdl import search_person_details
from app.db.models import Opportunity, OpportunityAuditLog, JobPost, Person
from .repositories import OpportunityRepository, OpportunityAuditLogRepository, ICPRepository
from .utils import extract_context_from_job_post

from app.db.models import (
    Opportunity,
    OpportunityAuditLog,
    opportunity_person_relation,
    opportunity_job_post_relation,
    ICP,
    Person,
)

from app.domain.people.schemas import PersonCreate
from app.domain.people.services import PersonService

if TYPE_CHECKING:
    from collections.abc import Iterable
    from uuid import UUID

    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.service import ModelDictT
    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.service import ModelDictT
    from msgspec import Struct
    from sqlalchemy.orm import InstrumentedAttribute

__all__ = ("OpportunityService", "OpportunityAuditLogService", "ICPService")
logger = structlog.get_logger()


class OpportunityAuditLogService(SQLAlchemyAsyncRepositoryService[Opportunity]):
    """OpportunityAuditLog Service."""

    repository_type = OpportunityAuditLogRepository
    match_fields = ["id"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: OpportunityRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type


class OpportunityService(SQLAlchemyAsyncRepositoryService[Opportunity]):
    """Opportunity Service."""

    repository_type = OpportunityRepository
    match_fields = ["name"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: OpportunityRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type

    async def get_opportunities(
        self,
        *filters: FilterTypes,
        tenant_id: UUID,
        **kwargs: Any,
    ) -> tuple[list[Opportunity], int]:
        """Get all opportunities for a tenant."""
        return await self.repository.get_opportunities(*filters, tenant_id=tenant_id, **kwargs)

    async def get_opportunity(
        self,
        opportunity_id: UUID,
        tenant_id: UUID,
        **kwargs: Any,
    ) -> tuple[list[Opportunity], int]:
        """Get opportunity details."""
        return await self.repository.get_opportunity(opportunity_id=opportunity_id, tenant_id=tenant_id, **kwargs)

    async def update(
        self,
        data: ModelDictT[Opportunity],
        item_id: Any | None = None,
        *,
        id_attribute: str | InstrumentedAttribute[Any] | None = None,
        load: LoadSpec | None = None,
        execution_options: dict[str, Any] | None = None,
        attribute_names: Iterable[str] | None = None,
        with_for_update: bool | None = None,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> Opportunity:
        """Wrap repository update operation.

        Returns:
            Updated representation.
        """
        obj = await super().update(
            data=data,
            item_id=item_id,
            attribute_names=attribute_names,
            id_attribute=id_attribute,
            load=load,
            execution_options=execution_options,
            with_for_update=with_for_update,
            auto_commit=auto_commit,
            auto_expunge=auto_expunge,
            auto_refresh=auto_refresh,
        )
        return obj

    async def create(
        self,
        data: ModelDictT[Opportunity],
        *,
        load: LoadSpec | None = None,
        execution_options: dict[str, Any] | None = None,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> Opportunity:
        """Create a new opportunity."""
        contact_ids: list[UUID] = []
        job_post_ids: list[UUID] = []
        if isinstance(data, dict):
            contact_ids = data.pop("contact_ids", [])
            job_post_ids = data.pop("job_post_ids", [])
        data = await self.to_model(data, "create")
        obj = await super().create(
            data=data,
            load=load,
            execution_options=execution_options,
            auto_commit=auto_commit,
            auto_expunge=True,
            auto_refresh=False,
        )

        # Add associated contacts
        for contact_id in contact_ids:
            stmt = insert(opportunity_person_relation).values(
                opportunity_id=obj.id, person_id=contact_id, tenant_id=obj.tenant_id
            )
            await self.repository.session.execute(stmt)

        # Add associated job posts
        for job_post_id in job_post_ids:
            stmt = insert(opportunity_job_post_relation).values(
                opportunity_id=obj.id, job_post_id=job_post_id, tenant_id=obj.tenant_id
            )
            await self.repository.session.execute(stmt)

        return data

    async def scan(
        self,
        tenant_ids: list[str] | None = None,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> Opportunity:
        """Generate opportunity from criteria."""
        icp_service = ICPService(session=self.repository.session)
        # TDOD: Filter for tenant_ids
        icps = await icp_service.list()

        opportunities_found = 0
        for icp in icps:
            if tenant_ids and str(icp.tenant_id) not in tenant_ids:
                continue

            # TODO: Add created_at after <timestamp> filter
            tool_stack_or_conditions = [JobPost.tools.contains([{"name": name}]) for name in icp.tool.include]
            tool_stack_not_conditions = [not_(JobPost.tools.contains([{"name": name} for name in icp.tool.exclude]))]

            # TODO: Case-insensetive match and filter on tool certainty
            if icp.tool.exclude:
                job_posts_statement = (
                    select(JobPost)
                    .where(
                        and_(
                            or_(
                                *tool_stack_or_conditions,
                            ),
                            *tool_stack_not_conditions,
                        )
                    )
                    .execution_options(populate_existing=True)
                )
            else:
                job_posts_statement = (
                    select(JobPost)
                    .where(
                        or_(
                            *tool_stack_or_conditions,
                        ),
                    )
                    .execution_options(populate_existing=True)
                )

            job_post_results = await self.repository.session.execute(statement=job_posts_statement)
            opportunities_audit_log_service = OpportunityAuditLogService(session=self.repository.session)
            for result in job_post_results:
                job_post = result[0]
                try:
                    if not job_post.company:
                        logger.warn(
                            "Skipping job because no company associated with job post",
                            job_post_id=job_post.id,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    # Filter for company size but skip if the information is missing
                    if icp.company.headcount_min and (
                        not job_post.company.headcount or job_post.company.headcount < icp.company.headcount_min
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            company_headcount=job_post.company.headcount,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    if icp.company.headcount_max and (
                        not job_post.company.headcount or job_post.company.headcount > icp.company.headcount_max
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            company_headcount=job_post.company.headcount,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    # Filter for org size but skip if the information is missing
                    if icp.company.org_size.engineering_min and (
                        not job_post.company.org_size
                        or not job_post.company.org_size.engineering
                        or job_post.company.org_size.engineering < icp.company.org_size.engineering_min
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            org_size=job_post.company.org_size,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    if icp.company.org_size.engineering_max and (
                        not job_post.company.org_size
                        or not job_post.company.org_size.engineering
                        or job_post.company.org_size.engineering > icp.company.org_size.engineering_max
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            org_size=job_post.company.org_size,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    # Filter for funding stage but don't skip if the information is missing
                    if icp.company.funding and (
                        job_post.company.last_funding
                        and job_post.company.last_funding.round_name.value not in icp.company.funding
                    ):
                        logger.info(
                            "Job because criteria does not match, but continuing further",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            funding_round=job_post.company.last_funding,
                            tenant_id=icp.tenant_id,
                        )

                    # Filter for country but don't skip if the information is missing
                    if icp.company.countries and (
                        job_post.company.hq_location
                        and job_post.company.hq_location.country
                        and job_post.company.hq_location.country not in icp.company.countries
                    ):
                        logger.info(
                            "Job because criteria does not match, but continuing further",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            company_location=job_post.company.hq_location,
                            tenant_id=icp.tenant_id,
                        )

                    # Check if opportunity with the same company already exists
                    opportunity_statement = select(Opportunity.id).where(
                        and_(Opportunity.company_id == job_post.company.id, Opportunity.tenant_id == icp.tenant_id)
                    )
                    opportunity_results = await self.repository.session.execute(statement=opportunity_statement)
                    opportunity_ids = [result[0] for result in opportunity_results]
                    if opportunity_ids:
                        logger.info(
                            "Skipping new opportunity because one with the same company already exists",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    # TODO: Fetch the contact(s) with the right title from an external source
                    person_statement = (
                        select(Person.id)
                        .where(Person.company_id == job_post.company.id)
                        .execution_options(populate_existing=True)
                    )
                    await self.repository.session.execute(text("SET pg_trgm.similarity_threshold = 0.5;"))
                    person_results = await self.repository.session.execute(statement=person_statement)
                    person_ids = [result[0] for result in person_results]

                    if not person_ids:
                        # Extract person from data provider
                        try:
                            persons = await search_person_details(
                                job_post.company.url,
                                titles=icp.person.titles,
                                sub_roles=icp.person.sub_roles,
                            )
                        except:
                            persons = []

                        if not persons:
                            logger.warn(
                                "Skipping new opportunity because no appropriate contact found",
                                job_post_id=job_post.id,
                                company_id=job_post.company.id,
                                company_url=job_post.company.url,
                                tenant_id=icp.tenant_id,
                            )

                        person_objects = []
                        for person_details in persons:

                            if not difflib.get_close_matches(person_details.get("job_title", ""), icp.person.titles):
                                logger.warn(
                                    "Skipping person because title doesn't match ICP",
                                    job_post_id=job_post.id,
                                    company_id=job_post.company.id,
                                    company_url=job_post.company.url,
                                    tenant_id=icp.tenant_id,
                                    title=person_details.get("job_title"),
                                    icp_titles=icp.person.titles,
                                )
                                continue

                            linkedin_profile_url = None
                            twitter_profile_url = None
                            github_profile_url = None
                            birth_date = None
                            work_email = None

                            if person_details.get("linkedin_url"):
                                linkedin_profile_url = "https://" + person_details.get("linkedin_url").rstrip("/")
                            if person_details.get("twitter_url"):
                                twitter_profile_url = "https://" + person_details.get("twitter_url").rstrip("/")
                            if person_details.get("github_url"):
                                github_profile_url = "https://" + person_details.get("github_url").rstrip("/")
                            if person_details.get("birth_date"):
                                birth_date = datetime.strptime(person_details.get("birth_date"), "%Y-%m-%d").date()

                            if person_details.get("work_email"):
                                if get_domain_from_email(person_details.get("work_email", "")) == get_domain(
                                    job_post.company.url
                                ):
                                    work_email = person_details.get("work_email")

                            work_experiences = []
                            for work_ex in person_details.get("experience", []):
                                try:
                                    work_experiences.append(
                                        WorkExperience(
                                            starts_at=datetime.strptime(work_ex.get("start_date"), "%Y-%m").date(),
                                            title=work_ex.get("title", {}).get("name", "Unknown"),
                                            company_name=work_ex.get("company", {}).get("name", "Unknown"),
                                            company_url=work_ex.get("company", {}).get("website"),
                                            company_linkedin_profile_url=work_ex.get("linkedin_url"),
                                            ends_at=datetime.strptime(work_ex.get("end_date"), "%Y-%m").date()
                                            if work_ex.get("end_date")
                                            else None,
                                        )
                                    )
                                except Exception:
                                    pass

                            obj = PersonCreate(
                                first_name=person_details.get("first_name"),
                                last_name=person_details.get("last_name"),
                                full_name=person_details.get("full_name"),
                                title=person_details.get("job_title"),
                                occupation=person_details.get("job_title_role"),
                                industry=person_details.get("industry"),
                                linkedin_profile_url=linkedin_profile_url,
                                twitter_profile_url=twitter_profile_url,
                                github_profile_url=github_profile_url,
                                location=Location(
                                    country=person_details.get("location_country"),
                                    region=person_details.get("location_region"),
                                    city=person_details.get("location_locality"),
                                ),
                                personal_emails=person_details.get("personal_emails", []),
                                work_email=work_email,
                                personal_numbers=person_details.get("personal_numbers", []),
                                birth_date=birth_date,
                                work_experiences=work_experiences,
                                company_id=job_post.company.id,
                            )
                            person_objects.append(obj.to_dict())

                        if not person_objects:
                            logger.warn(
                                "Skipping new opportunity because no relevant people found",
                                job_post_id=job_post.id,
                                company_id=job_post.company.id,
                                company_url=job_post.company.url,
                                tenant_id=icp.tenant_id,
                            )
                            continue

                        person_service = PersonService(session=self.repository.session)
                        persons = await person_service.upsert_many(person_objects)
                        person_ids = [person.id for person in persons]

                    # Fetch context from job post
                    context = {}
                    if job_post.body and icp.pitch:
                        context["job_post"] = await extract_context_from_job_post(job_post.body, icp.pitch)
                    else:
                        logger.warn(
                            "Cannot generate opportunity context, job post body or icp pitch missing",
                            job_post_id=job_post.id,
                            icp=icp.id,
                        )

                    opportunity = await self.create(
                        {
                            "name": job_post.company.name,
                            "stage": OpportunityStage.IDENTIFIED.value,
                            "context": context,
                            "company_id": job_post.company.id,
                            "contact_ids": person_ids,
                            "job_post_ids": [job_post.id],
                            "tenant_id": icp.tenant_id,
                        }
                    )

                    await opportunities_audit_log_service.create(
                        {
                            "operation": "create",
                            "diff": {"new": opportunity},
                            "tenant_id": icp.tenant_id,
                            "opportunity_id": opportunity.id,
                        }
                    )
                    await self.repository.session.commit()
                    opportunities_found += 1

                except Exception as e:
                    logger.error("Error processing job post or person", job_post_id=job_post.id, exc_info=e)
                    await self.repository.session.rollback()

        return opportunities_found

    async def to_model(self, data: Opportunity | dict[str, Any] | Struct, operation: str | None = None) -> Opportunity:
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "create" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "update" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if is_dict(data) and "slug" not in data and operation == "create":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        if is_dict(data) and "slug" not in data and "name" in data and operation == "update":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        return await super().to_model(data, operation)


class ICPService(SQLAlchemyAsyncRepositoryService[ICP]):
    """ICP Service."""

    repository_type = ICPRepository
    match_fields = ["id"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: ICPRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type

    async def get_by_tenant_id(
        self,
        tenant_id: UUID,
        **kwargs: Any,
    ) -> ICP:
        """Get icp details."""
        return await self.repository.get_by_tenant_id(tenant_id=tenant_id)
