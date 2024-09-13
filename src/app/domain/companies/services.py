from __future__ import annotations

import structlog
from typing import TYPE_CHECKING, Any
from datetime import datetime, timezone, timedelta

from sqlalchemy.exc import IntegrityError
from advanced_alchemy.filters import SearchFilter, LimitOffset
from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from uuid_utils.compat import uuid4

from app.lib.pdl import get_company_details
from app.lib.schema import CamelizedBaseStruct, Location, Funding, OrgSize
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
            obj.url = obj.url.rstrip("/")
            filters.append(SearchFilter(field_name="url", value=obj.url, ignore_case=True))
        if obj.linkedin_profile_url:
            obj.linkedin_profile_url = obj.linkedin_profile_url.rstrip("/")
            filters.append(
                SearchFilter(field_name="linkedin_profile_url", value=obj.linkedin_profile_url, ignore_case=True)
            )

        if not filters:
            raise Exception("Unable to find company without url or linkedin_profile_url.")

        await logger.ainfo("Lookup companies", url=obj.url, linkedin_url=obj.linkedin_profile_url)
        filters.append(LimitOffset(limit=1, offset=0))
        results, count = await self.list_and_count(*filters)
        await logger.ainfo("Found companies", ids=[c.id for c in results], count=count)

        now = datetime.now(timezone.utc)
        fiftytwo_weeks_ago = now - timedelta(weeks=52)

        if count > 0:
            # TODO: Uncomment after upsert is fixed
            # if count > 0 and results[0].updated_at > fiftytwo_weeks_ago:
            await logger.ainfo("Company already exists", id=results[0].id, url=results[0].url)
            return results[0]

        # TODO: Move to provider specific code
        company_details = await get_company_details(url=obj.url, social_url=obj.linkedin_profile_url)
        obj.description = company_details.get("headline") or obj.description
        obj.type = company_details.get("type") or obj.type
        obj.industry = company_details.get("industry") or obj.industry
        obj.headcount = company_details.get("employee_count") or obj.headcount
        obj.founded_year = company_details.get("founded") or obj.founded_year
        obj.url = company_details.get("website") or obj.url
        obj.linkedin_profile_url = company_details.get("linkedin_url") or obj.linkedin_profile_url
        obj.hq_location = Location(
            country=company_details.get("location", {}).get("country"),
            region=company_details.get("location", {}).get("region"),
            city=company_details.get("location", {}).get("locality"),
        )
        # TODO: Enable Premium field
        # obj.org_size = OrgSize(**company_details.get("employee_count_by_role", {}))
        if company_details.get("funding_stages"):
            last_round_name = company_details.get("funding_stages")[0]
            words = last_round_name.split("_")
            words = [word.capitalize() for word in words]
            obj.last_funding = Funding(round_name=" ".join(words))

        # TODO: Fix upsert
        return await super().upsert(
            data=obj,
            item_id=results[0].id if count > 0 else None,
            auto_commit=auto_commit,
            auto_expunge=auto_expunge,
            auto_refresh=auto_refresh,
        )

    async def to_model(self, data: Company | dict[str, Any] | Struct, operation: str | None = None) -> Company:
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "create" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "update" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "upsert" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if is_dict(data) and "slug" not in data and operation == "create":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        if is_dict(data) and "slug" not in data and "name" in data and operation == "update":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        if is_dict(data) and "slug" not in data and "name" in data and operation == "upsert":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        return await super().to_model(data, operation)
