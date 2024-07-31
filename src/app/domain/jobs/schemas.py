from __future__ import annotations

from uuid import UUID  # noqa: TCH003

import msgspec

from app.db.models.job_post import JobPost
from app.lib.schema import CamelizedBaseStruct, Location
from app.domain.companies.schemas import Company


class JobPost(CamelizedBaseStruct):
    """A job post."""
    id: UUID
    title: str
    body: str | None = None
    location: Location | None = None
    seniority_level: str | None = None
    employment_type: str | None = None
    job_functions: list[str] | None = None
    url: str | None = None
    apply_url: str | None = None
    total_applicants: int | None = None
    external_id: str | None = None
    comapny_id: str | None = None
    company: Company | None = None


class JobPostCreate(CamelizedBaseStruct):
    """A job post create schema."""
    title: str
    body: str | None = None
    location: Location | None = None
    seniority_level: str | None = None
    employment_type: str | None = None
    job_functions: list[str] | None = None
    url: str | None = None
    apply_url: str | None = None
    total_applicants: int | None = None
    external_id: str | None = None
    company_id: str | None = None


class JobPostUpdate(CamelizedBaseStruct, omit_defaults=True):
    """A job post update schema."""
    id: UUID
    title: str | None | msgspec.UnsetType = msgspec.UNSET
    body: str | None | msgspec.UnsetType = msgspec.UNSET
    location: Location | None | msgspec.UnsetType = msgspec.UNSET
    seniority_level: str | None | msgspec.UnsetType = msgspec.UNSET
    employment_type: str | None | msgspec.UnsetType = msgspec.UNSET
    job_functions: list[str] | None | msgspec.UnsetType = msgspec.UNSET
    url: str | None | msgspec.UnsetType = msgspec.UNSET
    apply_url: str | None | msgspec.UnsetType = msgspec.UNSET
    total_applicants: int | None | msgspec.UnsetType = msgspec.UNSET
    external_id: str | None | msgspec.UnsetType = msgspec.UNSET
    company_id: str | None | msgspec.UnsetType = msgspec.UNSET