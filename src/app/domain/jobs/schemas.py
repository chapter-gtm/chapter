from __future__ import annotations

from datetime import datetime  # noqa: TCH003
from uuid import UUID  # noqa: TCH003

import msgspec

from app.domain.companies.schemas import Company  # noqa: TCH001
from app.lib.schema import CamelizedBaseStruct, Location, Process, Tool


class JobPost(CamelizedBaseStruct):
    """A job post."""

    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    location: Location | None = None
    seniority_level: str | None = None
    employment_type: str | None = None
    job_functions: list[str] | None = None
    url: str | None = None
    apply_url: str | None = None
    total_applicants: int | None = None
    external_id: str | None = None
    tools: list[Tool] | None = None
    processes: list[Process] | None = None
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
    tools: list[Tool] | None = None
    processes: list[Process] | None = None
    company_id: str | None = None


class JobPostCreateFromURL(CamelizedBaseStruct):
    """A job post create from URL schema."""

    url: str
    timeout: float = 30.0


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
