from __future__ import annotations

from datetime import date  # noqa: TCH003
from typing import TYPE_CHECKING
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.lib.schema import Location, SocialActivity, WorkExperience  # noqa: TCH001

from .custom_types import LocationType, SocialActivityType, WorkExperienceType

if TYPE_CHECKING:
    from .company import Company


class Person(UUIDAuditBase, SlugKey):
    """A person."""

    __tablename__ = "person"
    __table_args__ = (Index("ix_person_id", "id"),)  # type: ignore[assignment]
    __pii_columns__ = {
        "first_name",
        "last_name",
        "full_name",
        "linkedin_profile_url",
        "profile_pic_url",
        "personal_emails",
        "work_emails",
        "phone_numbers",
        "social_activities",
    }
    first_name: Mapped[str] = mapped_column(nullable=True, default=None)
    last_name: Mapped[str] = mapped_column(nullable=True, default=None)
    full_name: Mapped[str] = mapped_column(nullable=True, default=None)
    headline: Mapped[str | None] = mapped_column(String(length=2000), nullable=True, default=None, index=True)
    title: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None, index=True)
    summary: Mapped[str | None] = mapped_column(String(length=2000), nullable=True, default=None)
    occupation: Mapped[str] = mapped_column(nullable=True, default=None)
    industry: Mapped[str | None] = mapped_column(nullable=True, default=None, index=True)
    profile_pic_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    linkedin_profile_url: Mapped[str | None] = mapped_column(
        String(length=2083),
        nullable=True,
        default=None,
        unique=True,
    )
    twitter_profile_url: Mapped[str | None] = mapped_column(
        String(length=2083),
        nullable=True,
        default=None,
        unique=True,
    )
    github_profile_url: Mapped[str | None] = mapped_column(
        String(length=2083),
        nullable=True,
        default=None,
        unique=True,
    )
    location: Mapped[Location | None] = mapped_column(LocationType, nullable=True, default=None)
    personal_emails: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    work_email: Mapped[str | None] = mapped_column(nullable=True, default=None)
    phone_numbers: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    birth_date: Mapped[date | None] = mapped_column(nullable=True, default=None)
    gender: Mapped[str | None] = mapped_column(nullable=True, default=None)
    languages: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    work_experiences: Mapped[list[WorkExperience] | None] = mapped_column(
        WorkExperienceType,
        nullable=True,
        default=None,
    )
    social_activities: Mapped[list[SocialActivity] | None] = mapped_column(
        SocialActivityType,
        nullable=True,
        default=None,
    )
    skills: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("company.id"), nullable=True, index=True)
    # -----------
    # ORM Relationships
    # ------------
    company: Mapped[Company] = relationship(
        back_populates="people",
        innerjoin=True,
        uselist=False,
        lazy="noload",
    )
