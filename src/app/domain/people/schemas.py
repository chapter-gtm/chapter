from __future__ import annotations

from uuid import UUID  # noqa: TCH003
from datetime import date, datetime

import msgspec

from app.db.models.person import Person
from app.lib.schema import CamelizedBaseStruct, Location, WorkExperience, SocialActivity


class Person(CamelizedBaseStruct):
    """A person."""

    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime
    first_name: str | None = None
    last_name: str | None = None
    full_name: str | None = None
    headline: str | None = None
    title: str | None = None
    summary: str | None = None
    occupation: str | None = None
    industry: str | None = None
    profile_pic_url: str | None = None
    url: str | None = None
    linkedin_profile_url: str | None = None
    twitter_profile_url: str | None = None
    github_profile_url: str | None = None
    location: Location | None = None
    personal_emails: list[str] | None = None
    work_email: str | None = None
    phone_numbers: list[str] | None = None
    birth_date: date | None = None
    gender: str | None = None
    languages: list[str] | None = None
    work_experiences: list[WorkExperience] | None = None
    social_activities: list[SocialActivity] | None = None
    skills: list[str] | None = None


class PersonCreate(CamelizedBaseStruct):
    """A person create schema."""

    first_name: str | None = None
    last_name: str | None = None
    full_name: str | None = None
    headline: str | None = None
    title: str | None = None
    summary: str | None = None
    occupation: str | None = None
    industry: str | None = None
    profile_pic_url: str | None = None
    url: str | None = None
    linkedin_profile_url: str | None = None
    twitter_profile_url: str | None = None
    github_profile_url: str | None = None
    location: Location | None = None
    personal_emails: list[str] | None = None
    work_email: str | None = None
    phone_numbers: list[str] | None = None
    birth_date: date | None = None
    gender: str | None = None
    languages: list[str] | None = None
    work_experiences: list[WorkExperience] | None = None
    social_activities: list[SocialActivity] | None = None
    skills: list[str] | None = None
    company_id: str | None = None


class PersonCreateFromURL(CamelizedBaseStruct):
    """A person create from URL schema."""

    url: str


class PersonUpdate(CamelizedBaseStruct, omit_defaults=True):
    """A person update schema."""

    id: UUID
    first_name: str | None | msgspec.UnsetType = msgspec.UNSET
    last_name: str | None | msgspec.UnsetType = msgspec.UNSET
    full_name: str | None | msgspec.UnsetType = msgspec.UNSET
    headline: str | None | msgspec.UnsetType = msgspec.UNSET
    title: str | None | msgspec.UnsetType = msgspec.UNSET
    summary: str | None | msgspec.UnsetType = msgspec.UNSET
    occupation: str | None | msgspec.UnsetType = msgspec.UNSET
    industry: str | None | msgspec.UnsetType = msgspec.UNSET
    profile_pic_url: str | None | msgspec.UnsetType = msgspec.UNSET
    url: str | None | msgspec.UnsetType = msgspec.UNSET
    linkedin_profile_url: str | None | msgspec.UnsetType = msgspec.UNSET
    twitter_profile_url: str | None | msgspec.UnsetType = msgspec.UNSET
    github_profile_url: str | None | msgspec.UnsetType = msgspec.UNSET
    location: Location | None | msgspec.UnsetType = msgspec.UNSET
    personal_emails: list[str] | None | msgspec.UnsetType = msgspec.UNSET
    work_email: str | None | msgspec.UnsetType = msgspec.UNSET
    personal_numbers: list[str] | None | msgspec.UnsetType = msgspec.UNSET
    birth_date: date | None | msgspec.UnsetType = msgspec.UNSET
    gender: str | None | msgspec.UnsetType = msgspec.UNSET
    languages: list[str] | None | msgspec.UnsetType = msgspec.UNSET
    work_experiences: list[WorkExperience] | None | msgspec.UnsetType = msgspec.UNSET
    social_activities: list[SocialActivity] | None | msgspec.UnsetType = msgspec.UNSET
    skills: list[str] | None | msgspec.UnsetType = msgspec.UNSET
