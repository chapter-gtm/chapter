"""Repo schemas."""
from __future__ import annotations

from datetime import datetime  # noqa: TCH003
from uuid import UUID  # noqa: TCH003

import msgspec

from app.lib.schema import CamelizedBaseStruct


class Repo(CamelizedBaseStruct):
    """A Repo."""

    id: UUID
    slug: str
    name: str
    url: str
    html_url: str
    created_at: datetime
    updated_at: datetime
    description: str | None = None
    language: str | None = None


class RepoCreate(CamelizedBaseStruct):
    """A repo create schema."""

    name: str
    url: str
    html_url: str
    description: str | None = None
    language: str | None = None
    search_query: str | None = None
    company_id: UUID | None = None


class RepoCreateFromSearchCriteria(CamelizedBaseStruct):
    """A repo create from search criteria."""

    query: str
    sort: str = "updated"
    order: str = "desc"
    page: int = 1
    per_page: int = 100


class RepoUpdate(CamelizedBaseStruct):
    """A repo update schema."""

    name: str | None | msgspec.UnsetType = msgspec.UNSET
    url: str | None | msgspec.UnsetType = msgspec.UNSET
    html_url: str | None | msgspec.UnsetType = msgspec.UNSET
    description: str | None | msgspec.UnsetType = msgspec.UNSET
    language: str | None | msgspec.UnsetType = msgspec.UNSET
