from __future__ import annotations

from uuid import UUID  # noqa: TCH003
from typing import Any
from datetime import datetime

import msgspec

from app.domain.accounts.schemas import User
from app.domain.companies.schemas import Company
from app.domain.people.schemas import Person
from app.domain.jobs.schemas import JobPost
from app.lib.schema import CamelizedBaseStruct, OpportunityStage


class OpportunityAuditLog(CamelizedBaseStruct):
    """An opportunity audit log."""

    id: UUID
    operation: str
    user: User
    created_at: datetime
    updated_at: datetime
    diff: dict[str, Any] | None = None


class Opportunity(CamelizedBaseStruct):
    """An opportunity."""

    id: UUID
    slug: str
    name: str
    created_at: datetime
    updated_at: datetime
    stage: OpportunityStage
    notes: str | None = None
    owner: User | None = None
    company: Company | None = None
    contacts: list[Person] | None = None
    job_posts: list[JobPost] | None = None
    logs: list[OpportunityAuditLog] | None = None


class OpportunityCreate(CamelizedBaseStruct):
    """An opportunity create schema."""

    name: str
    stage: OpportunityStage | None = None
    notes: str | None = None
    owner_id: UUID | None = None
    company_id: UUID | None = None
    contact_ids: list[UUID] | None = None
    job_post_ids: list[UUID] | None = None


class OpportunityScanFor(CamelizedBaseStruct):
    """An opportunity scan schema."""

    tenant_ids: list[str] | None = None


class OpportunityUpdate(CamelizedBaseStruct):
    """An opportunity update schema."""

    name: str | None | msgspec.UnsetType = msgspec.UNSET
    stage: OpportunityStage | None | msgspec.UnsetType = msgspec.UNSET
    notes: str | None | msgspec.UnsetType = msgspec.UNSET
    owner_id: UUID | None = None
