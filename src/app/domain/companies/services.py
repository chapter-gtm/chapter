from __future__ import annotations

import structlog
from typing import TYPE_CHECKING, Any
from datetime import datetime, timezone, timedelta

from sqlalchemy.exc import IntegrityError
from advanced_alchemy.filters import SearchFilter, LimitOffset
from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from uuid_utils.compat import uuid4

from app.lib.schema import CamelizedBaseStruct, Location, Funding
from app.db.models import Company

from .repositories import CompanyRepository

if TYPE_CHECKING:
    from collections.abc import Iterable
    from uuid import UUID

    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.service import ModelDictT
    from msgspec import Struct
    from sqlalchemy.orm import InstrumentedAttribute

__all__ = ("CompanyService",)
logger = structlog.get_logger()


class CompanyService(SQLAlchemyAsyncRepositoryService[Company]):
    """Company Service."""

    repository_type = CompanyRepository
    match_fields = ["name"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: CompanyRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type

    async def create(
        self,
        data: ModelDictT[Company],
        *,
        auto_commit: bool | None = None,
        auto_expunge: bool | None = None,
        auto_refresh: bool | None = None,
    ) -> Company:
        """Create a new company."""
        obj = await self.to_model(data, "create")
        filters = []
        if obj.url:
            filters.append(SearchFilter(field_name="url", value=obj.url, ignore_case=True))
        if obj.linkedin_profile_url:
            filters.append(
                SearchFilter(field_name="linkedin_profile_url", value=obj.linkedin_profile_url, ignore_case=True)
            )

        if not filters:
            raise Exception("Unable to find company without url or linkedin_profile_url.")

        filters.append(LimitOffset(limit=1, offset=0))
        results, count = await self.list_and_count(*filters)

        now = datetime.now(timezone.utc)
        fiftytwo_weeks_ago = now - timedelta(weeks=52)

        if count > 0 and results[0].id != obj.id and results[0].updated_at > fiftytwo_weeks_ago:
            logger.ainfo("Company already exists and is up-to-date", company=results[0])
            return results[0]

        obj.url = obj.url.rstrip("/")
        obj.linkedin_profile_url = obj.linkedin_profile_url.rstrip("/")

        # TODO: Enrich company

        return await super().upsert(
            data=data,
            item_id=results[0] if count > 0 else None,
            auto_commit=auto_commit,
            auto_expunge=auto_expunge,
            auto_refresh=auto_refresh,
        )

    async def to_model(self, data: Company | dict[str, Any] | Struct, operation: str | None = None) -> Company:
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "create" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "update" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if is_dict(data) and "slug" not in data and operation == "create":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        if is_dict(data) and "slug" not in data and "name" in data and operation == "update":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        return await super().to_model(data, operation)
