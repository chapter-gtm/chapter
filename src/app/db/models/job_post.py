from __future__ import annotations

from typing import TYPE_CHECKING

from uuid import UUID
from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import String, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship, deferred

from app.lib.schema import Location, Funding, Tool
from .custom_types import LocationType, FundingType, ToolType
from .company import Company


class JobPost(UUIDAuditBase):
    """A job post."""

    __tablename__ = "job_post"
    __table_args__ = (Index("ix_job_post_id", "id"),)
    __pii_columns__ = {}
    title: Mapped[str] = mapped_column(nullable=False, index=True)
    body: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    location: Mapped[Location | None] = mapped_column(LocationType, nullable=True, default=None)
    seniority_level: Mapped[str | None] = mapped_column(nullable=True, default=None)
    employment_type: Mapped[str | None] = mapped_column(nullable=True, default=None)
    job_functions: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    total_applicants: Mapped[int | None] = mapped_column(nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    apply_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    external_id: Mapped[str | None] = mapped_column(nullable=True, default=None)
    tools: Mapped[list[Tool] | None] = mapped_column(ToolType, nullable=True, default=None)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("company.id"), nullable=True, index=True)
    # -----------
    # ORM Relationships
    # ------------
    company: Mapped[Company] = relationship(
        lazy="select",
    )

    # Defer loading large fields
    body = deferred(body)
