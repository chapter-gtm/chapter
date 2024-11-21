from __future__ import annotations

from uuid import UUID  # noqa: TCH003
from datetime import datetime

import msgspec

from app.db.models.company import Company
from app.lib.schema import CamelizedBaseStruct, Location, Funding, OrgSize, AppDetails
from app.lib.utils import get_logo_dev_link
from app.lib.app_store import get_ios_app_details, get_android_app_details


class Company(CamelizedBaseStruct):
    """A company."""

    id: UUID
    slug: str
    name: str
    created_at: datetime
    updated_at: datetime
    description: str | None = None
    type: str | None = None
    industry: str | None = None
    headcount: int | None = None
    founded_year: int | None = None
    url: str | None = None
    profile_pic_url: str | None = None
    linkedin_profile_url: str | None = None
    hq_location: Location | None = None
    last_funding: Funding | None = None
    org_size: OrgSize | None = None
    ios_app_url: str | None = None
    android_app_url: str | None = None
    docs_url: str | None = None
    blog_url: str | None = None
    changelog_url: str | None = None
    github_url: str | None = None
    discord_url: str | None = None
    slack_url: str | None = None
    twitter_url: str | None = None
    ios_app_details: AppDetails | None = None
    android_app_details: AppDetails | None = None

    def __post_init__(self):
        """Build a profile pic url from company url."""
        if self.url:
            self.profile_pic_url = get_logo_dev_link(self.url)

        # TODO: Fetch app details but the methods are async
        """
        if self.ios_app_url:
            ios_app_details = get_ios_app_details(self.ios_app_url)
            self.ios_app_details = AppDetails(**ios_app_details)

        if self.android_app_url:
            android_app_details = get_android_app_details(self.android_app_url)
            self.android_app_details = AppDetails(**android_app_details)
        """


class CompanyCreate(CamelizedBaseStruct):
    """A company create schema."""

    name: str
    description: str | None = None
    type: str | None = None
    industry: str | None = None
    headcount: int | None = None
    founded_year: int | None = None
    url: str | None = None
    linkedin_profile_url: str | None = None
    hq_location: Location | None = None
    last_funding: Funding | None = None
    org_size: OrgSize | None = None
    ios_app_url: str | None = None
    android_app_url: str | None = None


class CompanyUpdate(CamelizedBaseStruct, omit_defaults=True):
    """A company update schema."""

    name: str | None | msgspec.UnsetType = msgspec.UNSET
    description: str | None | msgspec.UnsetType = msgspec.UNSET
    type: str | None | msgspec.UnsetType = msgspec.UNSET
    industry: str | None | msgspec.UnsetType = msgspec.UNSET
    headcount: int | None | msgspec.UnsetType = msgspec.UNSET
    founded_year: int | None | msgspec.UnsetType = msgspec.UNSET
    url: str | None | msgspec.UnsetType = msgspec.UNSET
    linkedin_profile_url: str | None | msgspec.UnsetType = msgspec.UNSET
    hq_location: Location | None | msgspec.UnsetType = msgspec.UNSET
    last_funding: Funding | None | msgspec.UnsetType = msgspec.UNSET
    org_size: OrgSize | None | msgspec.UnsetType = msgspec.UNSET
    ios_app_url: str | None | msgspec.UnsetType = msgspec.UNSET
    android_app_url: str | None | msgspec.UnsetType = msgspec.UNSET
