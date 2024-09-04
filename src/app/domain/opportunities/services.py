from __future__ import annotations

import structlog
from typing import TYPE_CHECKING, Any

from sqlalchemy import ColumnElement, insert, select, or_, and_, not_, func, text
from advanced_alchemy.filters import SearchFilter, LimitOffset
from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from uuid_utils.compat import uuid4

from app.lib.schema import CamelizedBaseStruct, OpportunityStage
from app.db.models import Opportunity, OpportunityAuditLog, JobPost, Person
from app.domain.accounts.services import TenantService
from .repositories import OpportunityRepository, OpportunityAuditLogRepository

from app.db.models import Opportunity, OpportunityAuditLog, opportunity_person_relation, opportunity_job_post_relation

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

__all__ = (
    "OpportunityService",
    "OpportunityAuditLogService",
)
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
        tenant_ids: list[str],
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> Opportunity:
        """Generate opportunity from criteria."""
        if not tenant_ids:
            tenants_service = TenantService(session=self.repository.session)
            tenants, _ = await tenants_service.list_and_count()
            tenant_ids = [tenant.id for tenant in tenants]

        opportunities_found = 0
        for tenant_id in tenant_ids:
            # TODO:
            # 1. Read criteria from tenant icp/criteria
            # 2. Add created_at after <timestamp> filter
            tools = ["Github Actions", "Cypress", "Playwright"]
            tools_to_avoid = ["Gitlab CI", "CircleCI"]
            company_size_min = 11
            company_size_max = 500
            engineering_size_min = 10
            engineering_size_max = 60
            funding = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C"]
            countries = [
                "United States",
                "United Kingdom",
                "Canada",
                "Germany",
                "France",
                "Netherlands",
                "Sweden",
                "Australia",
                "New Zealand",
            ]
            person_titles = [
                "Platform Engineer",
                "Tech Lead",
                "Staff Engineer",
                "Head of Engineering",
                "Director of Engineering",
                "VP of Engineering",
                "CTO",
                "Co-founder",
            ]

            tool_stack_or_conditions = [JobPost.tools.contains([{"name": name}]) for name in tools]
            tool_stack_not_conditions = [not_(JobPost.tools.contains([{"name": name} for name in tools_to_avoid]))]

            # TODO: Case-insensetive match and filter on tool certainty
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
            job_post_results = await self.repository.session.execute(statement=job_posts_statement)
            opportunities_audit_log_service = OpportunityAuditLogService(session=self.repository.session)
            for result in job_post_results:
                job_post = result[0]
                try:
                    if not job_post.company:
                        logger.info(
                            "Skipping job because no company associated with job post",
                            job_post_id=job_post.id,
                        )
                        continue

                    # Filter for company size but skip if the information is missing
                    if (
                        not job_post.company.headcount
                        or job_post.company.headcount < company_size_min
                        or job_post.company.headcount > company_size_max
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            company_headcount=job_post.company.headcount,
                        )
                        continue

                    # Filter for org size but skip if the information is missing
                    if (
                        not job_post.company.org_size
                        or not job_post.company.org_size.engineering
                        or job_post.company.org_size.engineering < engineering_size_min
                        or job_post.company.org_size.engineering > engineering_size_max
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            org_size=job_post.company.org_size,
                        )
                        continue

                    # Filter for funding stage but don't skip if the information is missing
                    if job_post.company.last_funding and job_post.company.last_funding.round_name.value not in funding:
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            funding_round=job_post.company.last_funding,
                        )
                        continue

                    # Filter for country but don't skip if the information is missing
                    if (
                        job_post.company.hq_location
                        and job_post.company.hq_location.country
                        and job_post.company.hq_location.country not in countries
                    ):
                        logger.info(
                            "Skipping job because criteria does not match",
                            job_post_id=job_post.id,
                            company_location=job_post.company.hq_location,
                        )
                        continue

                    # TODO: Fetch the contact(s) with the right title from an external source
                    person_statement = (
                        select(Person.id)
                        .where(
                            and_(
                                Person.title.op("%")(text("ANY(:titles)")).params(titles=person_titles),
                                Person.company_id == job_post.company.id,
                            )
                        )
                        .execution_options(populate_existing=True)
                    )
                    await self.repository.session.execute(text("SET pg_trgm.similarity_threshold = 0.5;"))
                    person_results = await self.repository.session.execute(statement=person_statement)
                    person_ids = [result[0] for result in person_results]

                    if not person_ids:
                        continue

                    opportunity = await self.create(
                        {
                            "name": job_post.company.name,
                            "stage": OpportunityStage.IDENTIFIED.value,
                            "company_id": job_post.company.id,
                            "contact_ids": person_ids,
                            "job_post_ids": [job_post.id],
                            "tenant_id": tenant_id,
                        }
                    )

                    await opportunities_audit_log_service.create(
                        {
                            "operation": "create",
                            "diff": {"new": opportunity},
                            "tenant_id": tenant_id,
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
