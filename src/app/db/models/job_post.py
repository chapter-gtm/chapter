from __future__ import annotations

from typing import TYPE_CHECKING

from uuid import UUID
from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.lib.schema import Location, Funding
from .custom_types import LocationType, FundingType
from .company import Company


class JobPost(UUIDAuditBase):
    """A job post."""

    __tablename__ = "job_post"
    __pii_columns__ = {}
    title: Mapped[str] = mapped_column(nullable=False, index=True)
    body: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    location: Mapped[Location | None] = mapped_column(LocationType, nullable=True, default=None)
    seniority_level: Mapped[str | None] = mapped_column(nullable=True, default=None)
    employment_type: Mapped[str | None] = mapped_column(nullable=True, default=None)
    job_functions: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    total_applicants: Mapped[int | None] = mapped_column(nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    apply_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    external_id: Mapped[str | None] = mapped_column(nullable=True, default=None)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("company.id"), nullable=True)
    # -----------
    # ORM Relationships
    # ------------
    company: Mapped[Company] = relationship(
        lazy="joined",
    )
