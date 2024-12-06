from __future__ import annotations

from uuid import UUID  # noqa: TCH003

from advanced_alchemy.base import UUIDAuditBase
from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, deferred, mapped_column, relationship

from app.lib.schema import Location, Process, Tool  # noqa: TCH001

from .company import Company  # noqa: TCH001
from .custom_types import LocationType, ProcessType, ToolType


class JobPost(UUIDAuditBase):
    """A job post."""

    __tablename__ = "job_post"
    __table_args__ = (Index("ix_job_post_id", "id"),)
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
    processes: Mapped[list[Process] | None] = mapped_column(ProcessType, nullable=True, default=None)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("company.id"), nullable=True, index=True)
    # -----------
    # ORM Relationships
    # ------------
    company: Mapped[Company] = relationship(
        lazy="noload",
    )

    # Defer loading large fields
    body = deferred(body)
