from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING, Any

import structlog
from advanced_alchemy.filters import LimitOffset, SearchFilter
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model

from app.db.models import Company
from app.lib.app_store import get_android_app_url, get_ios_app_url
from app.lib.pdl import get_company_details
from app.lib.pitchbook import get_company_funding_data
from app.lib.schema import Funding, Location
from app.lib.scraperapi import extract_url_content
from app.lib.utils import get_domain

from .repositories import CompanyRepository
from .utils import extract_links_from_page

if TYPE_CHECKING:

    from advanced_alchemy.service import ModelDictT

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
        obj = None
        if isinstance(data, dict):
            obj = await self.to_model(data, "create")
        elif isinstance(data, Company):
            obj = data
        else:
            raise ValueError("CompanyService.create can only take a dict or Company object.")

        filters = []
        if obj.url:
            obj.url = get_domain(obj.url)
            filters.append(SearchFilter(field_name="url", value=obj.url, ignore_case=True))
        if obj.linkedin_profile_url:
            obj.linkedin_profile_url = get_domain(obj.linkedin_profile_url)
            filters.append(
                SearchFilter(field_name="linkedin_profile_url", value=obj.linkedin_profile_url, ignore_case=True),
            )

        if not filters:
            raise Exception("Unable to find company without url or linkedin_profile_url.")

        filters.append(LimitOffset(limit=1, offset=0))
        results, count = await self.list_and_count(*filters)

        now = datetime.now(UTC)
        fiftytwo_weeks_ago = now - timedelta(weeks=52)

        if count > 0:
            # TODO: Uncomment after upsert is fixed
            # if count > 0 and results[0].updated_at > fiftytwo_weeks_ago:
            await logger.ainfo("Company already exists", id=results[0].id, url=results[0].url)
            return results[0]

        try:
            company_details = await get_company_details(url=obj.url, social_url=obj.linkedin_profile_url)
            location = Location(
                country=company_details.get("location", {}).get("country"),
                region=company_details.get("location", {}).get("region"),
                city=company_details.get("location", {}).get("locality"),
            )
        except Exception as e:
            await logger.awarn("Error getting company details", exc_info=e)
            company_details = {}
            location = None

        # TODO: Move to provider specific code
        obj.description = company_details.get("headline") or obj.description
        obj.type = company_details.get("type") or obj.type
        obj.industry = company_details.get("industry") or obj.industry
        obj.headcount = company_details.get("employee_count") or obj.headcount
        obj.founded_year = company_details.get("founded") or obj.founded_year
        obj.url = company_details.get("website") or obj.url
        obj.linkedin_profile_url = company_details.get("linkedin_url") or obj.linkedin_profile_url
        obj.hq_location = location
        # TODO: Enable Premium field
        # obj.org_size = OrgSize(**company_details.get("employee_count_by_role", {}))

        if obj.url:
            # Get investor names and last funding round name
            try:
                funding_data = await get_company_funding_data(obj.url)
                obj.last_funding = Funding(
                    round_name=funding_data["round_name"],
                    money_raised=funding_data["money_raised"],
                    announced_date=funding_data["announced_date"],
                    investors=funding_data["investors"],
                )
            except Exception as e:
                obj.last_funding = Funding()
                await logger.awarn("Failed to get company funding data", url=obj.url, exc_info=e)

            # Get app store urls
            try:
                obj.ios_app_url = await get_ios_app_url(obj.url)
                obj.android_app_url = await get_android_app_url(obj.name, obj.url)
            except Exception as e:
                await logger.awarn("Failed to get app store data", url=obj.url, exc_info=e)

            # Get data from company homepage
            try:
                company_homepage_html_content = await extract_url_content(obj.url, render=True)
                company_homepage_data = await extract_links_from_page(obj.url, company_homepage_html_content)
                obj.docs_url = company_homepage_data.get("docs_url")
                obj.blog_url = company_homepage_data.get("blog_url")
                obj.changelog_url = company_homepage_data.get("changelog_url")
                obj.github_url = company_homepage_data.get("github_url")
                obj.discord_url = company_homepage_data.get("discord_url")
                obj.slack_url = company_homepage_data.get("slack_url")
                obj.twitter_url = company_homepage_data.get("twitter_url")
            except Exception as e:
                await logger.awarn("Failed to extract links from company homepage", url=obj.url, exc_info=e)

        # TODO: Fix upsert
        return await super().upsert(
            data=obj,
            item_id=results[0].id if count > 0 else None,
            auto_commit=auto_commit,
            auto_expunge=auto_expunge,
            auto_refresh=auto_refresh,
        )

    async def to_model(self, data: ModelDictT[Company], operation: str | None = None) -> Company:
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
