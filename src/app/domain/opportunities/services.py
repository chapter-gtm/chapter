from __future__ import annotations

from typing import TYPE_CHECKING, Any

from sqlalchemy import ColumnElement, insert
from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from uuid_utils.compat import uuid4

from app.lib.schema import CamelizedBaseStruct
from app.db.models import Opportunity, OpportunityAuditLog
from app.domain.accounts.services import UserService
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
            stmt = insert(opportunity_person_relation).values(opportunity_id=obj.id, person_id=contact_id)
            await self.repository.session.execute(stmt)

        # Add associated job posts
        for job_post_id in job_post_ids:
            stmt = insert(opportunity_job_post_relation).values(opportunity_id=obj.id, job_post_id=job_post_id)
            await self.repository.session.execute(stmt)

        return data

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
