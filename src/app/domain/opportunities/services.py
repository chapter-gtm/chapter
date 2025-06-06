from __future__ import annotations

import difflib
from contextlib import suppress
from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING, Any

import structlog
from advanced_alchemy.exceptions import ErrorMessages  # noqa: TCH002
from advanced_alchemy.repository._util import LoadSpec
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from advanced_alchemy.utils.dataclass import Empty, EmptyType
from sqlalchemy import and_, insert, not_, or_, select
from sqlalchemy.exc import (
    DataError,
    IntegrityError,
    InvalidRequestError,
    OperationalError,
    PendingRollbackError,
    StatementError,
)
from sqlalchemy.orm import InstrumentedAttribute, joinedload, selectinload, undefer

from app.db.models import (
    ICP,
    Company,
    JobPost,
    Opportunity,
    OpportunityAuditLog,
    Person,
    Repo,
    opportunity_job_post_relation,
    opportunity_person_relation,
    opportunity_repo_relation,
)
from app.domain.people.schemas import PersonCreate
from app.domain.people.services import PersonService
from app.lib.pdl import search_person_details
from app.lib.schema import FundingRound, Location, OpportunityStage, WorkExperience
from app.lib.utils import get_domain, get_domain_from_email

from .repositories import ICPRepository, OpportunityAuditLogRepository, OpportunityRepository
from .utils import extract_context_from_job_post

if TYPE_CHECKING:
    from collections.abc import Iterable
    from uuid import UUID

    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.service import ModelDictT

__all__ = ("OpportunityService", "OpportunityAuditLogService", "ICPService")
logger = structlog.get_logger()


class OpportunityAuditLogService(SQLAlchemyAsyncRepositoryService[OpportunityAuditLog]):
    """OpportunityAuditLog Service."""

    repository_type = OpportunityAuditLogRepository
    match_fields = ["id"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: OpportunityAuditLogRepository = self.repository_type(**repo_kwargs)
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
    ) -> Opportunity:
        """Get opportunity details."""
        return await self.repository.get_opportunity(opportunity_id=opportunity_id, tenant_id=tenant_id, **kwargs)

    async def update(
        self,
        data: ModelDictT[Opportunity],
        item_id: Any | None = None,
        *,
        attribute_names: Iterable[str] | None = None,
        with_for_update: bool | None = None,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
        id_attribute: str | InstrumentedAttribute[Any] | None = None,
        error_messages: ErrorMessages | None | EmptyType = Empty,
        load: LoadSpec | None = None,
        execution_options: dict[str, Any] | None = None,
    ) -> Opportunity:
        """Wrap repository update operation.

        Returns:
            Updated representation.
        """
        return await super().update(
            data=data,
            item_id=item_id,
            attribute_names=attribute_names,
            with_for_update=with_for_update,
            auto_commit=auto_commit,
            auto_expunge=auto_expunge,
            auto_refresh=auto_refresh,
            id_attribute=id_attribute,
            error_messages=error_messages,
            load=load,
            execution_options=execution_options,
        )

    async def create(
        self,
        data: ModelDictT[Opportunity],
        *,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
        error_messages: ErrorMessages | None | EmptyType = Empty,
    ) -> Opportunity:
        """Create a new opportunity."""
        contact_ids: list[UUID] = []
        job_post_ids: list[UUID] = []
        repo_ids: list[UUID] = []
        if isinstance(data, dict):
            contact_ids = data.pop("contact_ids", [])
            job_post_ids = data.pop("job_post_ids", [])
            repo_ids = data.pop("repo_ids", [])
            data = await self.to_model(data, "create")
        elif isinstance(data, Opportunity):
            pass
        else:
            error_msg = "OpportunityService.create.create can only take a dict or Opportunity object."
            raise TypeError(error_msg)

        obj = await super().create(
            data=data,
            auto_commit=auto_commit,
            auto_expunge=True,
            auto_refresh=False,
            error_messages=error_messages,
        )

        # Add associated contacts
        for contact_id in contact_ids:
            stmt = insert(opportunity_person_relation).values(
                opportunity_id=obj.id,
                person_id=contact_id,
                tenant_id=obj.tenant_id,
            )
            await self.repository.session.execute(stmt)

        # Add associated job posts
        for job_post_id in job_post_ids:
            stmt = insert(opportunity_job_post_relation).values(
                opportunity_id=obj.id,
                job_post_id=job_post_id,
                tenant_id=obj.tenant_id,
            )
            await self.repository.session.execute(stmt)

        # Add associated repos
        for repo_id in repo_ids:
            stmt = insert(opportunity_repo_relation).values(
                opportunity_id=obj.id,
                repo_id=repo_id,
                tenant_id=obj.tenant_id,
            )
            await self.repository.session.execute(stmt)

        return data

    async def _icp_matches_company(self, icp: ICP, company: Company) -> bool:  # noqa: PLR0911
        if not company:
            await logger.ainfo(
                "Company does not match the ICP: Company is empty",
                tenant_id=icp.tenant_id,
            )
            return False

        if icp.company.headcount_min and (not company.headcount or company.headcount < icp.company.headcount_min):
            await logger.ainfo(
                "Company does not match ICP: headcount min",
                company_id=company.id,
                company_url=company.url,
                company_headcount=company.headcount,
                icp_headcount_min=icp.company.headcount_min,
                tenant_id=icp.tenant_id,
            )
            return False

        if icp.company.headcount_max and (not company.headcount or company.headcount > icp.company.headcount_max):
            await logger.ainfo(
                "Company does not match ICP: headcount max",
                company_id=company.id,
                company_url=company.url,
                company_headcount=company.headcount,
                icp_headcount_max=icp.company.headcount_max,
                tenant_id=icp.tenant_id,
            )
            return False

        # Filter for org size but skip if the information is missing
        if (
            icp.company.org_size
            and icp.company.org_size.engineering_min
            and (
                not company.org_size
                or not company.org_size.engineering
                or company.org_size.engineering < icp.company.org_size.engineering_min
            )
        ):
            await logger.ainfo(
                "Company does not match ICP: engineering min",
                company_id=company.id,
                company_url=company.url,
                comapny_org_size=company.org_size,
                icp_engineering_min=icp.company.org_size.engineering_min,
                tenant_id=icp.tenant_id,
            )
            return False

        if (
            icp.company.org_size
            and icp.company.org_size.engineering_max
            and (
                not company.org_size
                or not company.org_size.engineering
                or company.org_size.engineering > icp.company.org_size.engineering_max
            )
        ):
            await logger.ainfo(
                "Company does not match ICP: engineering max",
                company_id=company.id,
                company_url=company.url,
                comapny_org_size=company.org_size,
                icp_engineering_max=icp.company.org_size.engineering_max,
                tenant_id=icp.tenant_id,
            )
            return False

        if (
            icp.company.funding
            and company.last_funding
            and company.last_funding.round_name != FundingRound.SERIES_UNKNOWN
            and company.last_funding.round_name not in icp.company.funding
        ):
            await logger.ainfo(
                "Company does not match ICP: funding stage",
                company_id=company.id,
                company_url=company.url,
                company_funding_stage=company.last_funding,
                icp_funding_stage=icp.company.funding,
                tenant_id=icp.tenant_id,
            )
            return False

        return True

    async def _find_or_fetch_contacts(self, icp: ICP, company: Company) -> list[UUID]:
        """Find existing contacts or extract the from external sources."""
        # TODO: Fetch the contact(s) with the right title from an external source
        person_statement = (
            select(Person.id).where(Person.company_id == company.id).execution_options(populate_existing=True)
        )
        person_results = await self.repository.session.execute(statement=person_statement)
        person_ids = [result[0] for result in person_results]

        if person_ids:
            return person_ids

        if not company.url:
            await logger.awarn("Error fetching people from company: URL is empty", company_id=company.id)
            return []

        # Extract person from data provider
        try:
            persons = await search_person_details(
                company.url,
                titles=icp.person.titles,
                sub_roles=icp.person.sub_roles,
            )
        except (ValueError, TypeError, LookupError) as e:
            await logger.awarn(
                "Error fetching people from external source",
                company_id=company.id,
                company_url=company.url,
                exc_info=e,
            )
            return []

        person_objects = []
        for person_details in persons:

            if not icp.person.titles or not difflib.get_close_matches(
                person_details.get("job_title", ""),
                icp.person.titles,
            ):
                await logger.adebug(
                    "Skipping person because title doesn't match ICP",
                    company_id=company.id,
                    company_url=company.url,
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
                linkedin_profile_url = "https://" + person_details.get("linkedin_url", "").rstrip("/")
            if person_details.get("twitter_url"):
                twitter_profile_url = "https://" + person_details.get("twitter_url", "").rstrip("/")
            if person_details.get("github_url"):
                github_profile_url = "https://" + person_details.get("github_url", "").rstrip("/")

            with suppress(Exception):
                birth_date = (
                    datetime.strptime(person_details.get("birth_date", ""), "%Y-%m-%d").replace(tzinfo=UTC).date()
                )

            if person_details.get("work_email") and get_domain_from_email(
                person_details.get("work_email", ""),
            ) == get_domain(
                company.url,
            ):
                work_email = person_details.get("work_email")

            work_experiences = []
            for work_ex in person_details.get("experience", []):
                with suppress(Exception):
                    work_experiences.append(
                        WorkExperience(
                            starts_at=datetime.strptime(work_ex.get("start_date", ""), "%Y-%m")
                            .replace(tzinfo=UTC)
                            .date(),
                            title=work_ex.get("title", {}).get("name", "Unknown"),
                            company_name=work_ex.get("company", {}).get("name", "Unknown"),
                            company_url=work_ex.get("company", {}).get("website"),
                            company_linkedin_profile_url=work_ex.get("linkedin_url"),
                            ends_at=datetime.strptime(work_ex.get("end_date", ""), "%Y-%m").replace(tzinfo=UTC).date()
                            if work_ex.get("end_date")
                            else None,
                        ),
                    )

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
                phone_numbers=person_details.get("phone_numbers", []),
                birth_date=birth_date,
                work_experiences=work_experiences,
                company_id=str(company.id),
            )
            person_objects.append(obj.to_dict())

        if not person_objects:
            await logger.ainfo(
                "No relevant people found at company",
                company_id=company.id,
                company_url=company.url,
                tenant_id=icp.tenant_id,
            )
            return []

        person_service = PersonService(session=self.repository.session)
        inserted_persons = await person_service.upsert_many(person_objects)
        return [person.id for person in inserted_persons]

    async def scan_jobs(
        self,
        tenant_ids: list[str] | None = None,
        last_n_days: int = 7,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> int:
        """Generate opportunities from jobs."""
        icp_service = ICPService(session=self.repository.session)
        # TDOD: Filter for tenant_ids
        icps = await icp_service.list()

        opportunities_found = 0
        for icp in icps:
            if tenant_ids and str(icp.tenant_id) not in tenant_ids:
                continue

            if not icp.tool.include and not icp.process.include:
                await logger.ainfo(
                    "Skipping icp as tool and process include lists are both empty",
                    tenant_id=icp.tenant_id,
                    icp_id=icp.id,
                    icp_name=icp.name,
                )
                continue

            date_n_days_ago = datetime.now(UTC) - timedelta(days=last_n_days)
            and_conditions = [
                JobPost.created_at > date_n_days_ago,
                Opportunity.id.is_(None),
            ]

            # TODO: Filter on tool certainty?
            tool_stack_or_conditions = (
                [JobPost.tools.contains([{"name": name}]) for name in icp.tool.include] if icp.tool.include else []
            )
            process_or_conditions = (
                [JobPost.processes.contains([{"name": name}]) for name in icp.process.include]
                if icp.process.include
                else []
            )

            if icp.tool.exclude:
                tool_stack_not_conditions = [
                    not_(JobPost.tools.contains([{"name": name} for name in icp.tool.exclude])),
                ]
                and_conditions.extend(tool_stack_not_conditions)

            job_posts_statement = (
                select(JobPost)
                # TODO: This would still include job posts from last N days not matching this tenant that were previously discarded
                .outerjoin(
                    Opportunity,
                    (JobPost.company_id == Opportunity.company_id) & (Opportunity.tenant_id == icp.tenant_id),
                )
                .where(
                    and_(
                        or_(*tool_stack_or_conditions, *process_or_conditions),
                        *and_conditions,
                    ),
                )
                .execution_options(populate_existing=True)
                .options(selectinload(JobPost.company), undefer(JobPost.body))
            )

            opportunities_audit_log_service = OpportunityAuditLogService(session=self.repository.session)
            job_post_results = await self.repository.session.execute(statement=job_posts_statement)

            matching_job_count = 0
            for result in job_post_results:
                matching_job_count += 1
                job_post = result[0]
                try:
                    if not await self._icp_matches_company(icp, job_post.company):
                        await logger.ainfo(
                            "Skipping job because company does not match the ICP",
                            job_post_id=job_post.id,
                            tenant_id=icp.tenant_id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                        )
                        continue

                    person_ids = await self._find_or_fetch_contacts(icp, job_post.company)
                    if not person_ids:
                        await logger.ainfo(
                            "Skipping job because no appropriate contact found at the company",
                            job_post_id=job_post.id,
                            company_id=job_post.company.id,
                            company_url=job_post.company.url,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    # Fetch context from job post
                    context = {}
                    if job_post.body and icp.pitch:
                        context["job_post"] = await extract_context_from_job_post(job_post.body, icp.pitch)
                    else:
                        await logger.awarn(
                            "Cannot generate opportunity highlight, job post body or icp pitch missing",
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
                        },
                    )

                    await opportunities_audit_log_service.create(
                        {
                            "operation": "create",
                            "diff": {"new": opportunity},
                            "tenant_id": icp.tenant_id,
                            "opportunity_id": opportunity.id,
                        },
                    )
                    await self.repository.session.commit()
                    opportunities_found += 1

                except (ValueError, AttributeError, TypeError) as e:
                    error_msg = "Error processing job post or person"
                    await logger.aerror(error_msg, job_post_id=job_post.id, exc_info=e)
                except (
                    IntegrityError,
                    OperationalError,
                    DataError,
                    PendingRollbackError,
                    InvalidRequestError,
                    StatementError,
                ) as e:
                    error_msg = "Error inserting / updating opportunity"
                    await logger.aerror(error_msg, job_post_id=job_post.id, exc_info=e)
                    await self.repository.session.rollback()

            await logger.ainfo(
                "Searched for new jobs matching tool stack and date range",
                tools_include=icp.tool.include,
                tools_exclude=icp.tool.exclude,
                last_n_days=last_n_days,
                matching_job_count=matching_job_count,
                icp=icp.tenant_id,
            )

        return opportunities_found

    async def scan_repos(
        self,
        tenant_ids: list[str] | None = None,
        last_n_days: int = 7,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> int:
        """Generate opportunies from repos."""
        date_n_days_ago = datetime.now(UTC) - timedelta(days=last_n_days)
        icp_service = ICPService(session=self.repository.session)
        opportunities_audit_log_service = OpportunityAuditLogService(session=self.repository.session)

        # TDOD: Filter for tenant_ids
        icps = await icp_service.list()

        opportunities_found = 0
        for icp in icps:
            if tenant_ids and str(icp.tenant_id) not in tenant_ids:
                continue

            if not icp.repo.query:
                await logger.ainfo(
                    "Skipping icp as repo criteria is empty",
                    tenant_id=icp.tenant_id,
                    icp_id=icp.id,
                    icp_name=icp.name,
                )
                continue

            and_conditions = [
                Repo.created_at > date_n_days_ago,
                Repo.search_query == icp.repo.query,
                Opportunity.id.is_(None),
            ]

            repo_statement = (
                select(Repo)
                # TODO: This would still include repos from last N days not matching this tenant that were previously discarded
                .outerjoin(
                    Opportunity,
                    (Repo.company_id == Opportunity.company_id) & (Opportunity.tenant_id == icp.tenant_id),
                )
                .where(
                    and_(*and_conditions),
                )
                .execution_options(populate_existing=True)
                .options(joinedload(Repo.company))
            )

            matching_repo_count = 0
            repo_results = await self.repository.session.execute(statement=repo_statement)
            for result in repo_results:
                repo = result[0]
                matching_repo_count += 1
                try:
                    if not await self._icp_matches_company(icp, repo.company):
                        await logger.ainfo(
                            "Skipping repo because company does not match the ICP",
                            repo_id=repo.id,
                            tenant_id=icp.tenant_id,
                            company_id=repo.company.id,
                            company_url=repo.company.url,
                        )
                        continue

                    person_ids = await self._find_or_fetch_contacts(icp, repo.company)
                    if not person_ids:
                        await logger.ainfo(
                            "Skipping job because no appropriate contact found at the company",
                            repo_id=repo.id,
                            company_id=repo.company.id,
                            company_url=repo.company.url,
                            tenant_id=icp.tenant_id,
                        )
                        continue

                    opportunity = await self.create(
                        {
                            "name": repo.company.name,
                            "stage": OpportunityStage.IDENTIFIED.value,
                            "company_id": repo.company.id,
                            "contact_ids": person_ids,
                            "repo_ids": [repo.id],
                            "tenant_id": icp.tenant_id,
                        },
                        auto_commit=auto_commit,
                        auto_expunge=auto_expunge,
                        auto_refresh=auto_refresh,
                    )

                    await opportunities_audit_log_service.create(
                        {
                            "operation": "create",
                            "diff": {"new": opportunity},
                            "tenant_id": icp.tenant_id,
                            "opportunity_id": opportunity.id,
                        },
                        auto_commit=auto_commit,
                        auto_expunge=auto_expunge,
                        auto_refresh=auto_refresh,
                    )
                    await self.repository.session.commit()
                    opportunities_found += 1

                except (ValueError, AttributeError, TypeError) as e:
                    error_msg = "Error processing repo or person"
                    await logger.aerror(error_msg, repo_id=repo.id, exc_info=e)
                except (
                    IntegrityError,
                    OperationalError,
                    DataError,
                    PendingRollbackError,
                    InvalidRequestError,
                    StatementError,
                ) as e:
                    error_msg = "Error inserting / updating opportunity"
                    await logger.aerror(error_msg, repo_id=repo.id, repo_name=repo.name, exc_info=e)
                    await self.repository.session.rollback()

            await logger.ainfo(
                "Searched for new repos matching query and date range",
                repo_search_query=icp.repo.query,
                last_n_days=last_n_days,
                matching_repo_count=matching_repo_count,
                icp=icp.tenant_id,
            )

        return opportunities_found

    async def to_model(self, data: ModelDictT[Opportunity], operation: str | None = None) -> Opportunity:
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

    async def get_icps(
        self,
        *filters: FilterTypes,
        tenant_id: UUID,
        **kwargs: Any,
    ) -> tuple[list[ICP], int]:
        """Get all ICPs for a tenant."""
        return await self.repository.get_icps(*filters, tenant_id=tenant_id, **kwargs)

    async def get_icp(
        self,
        icp_id: UUID,
        tenant_id: UUID,
        **kwargs: Any,
    ) -> ICP:
        """Get icp details."""
        return await self.repository.get_icp(icp_id=icp_id, tenant_id=tenant_id)
