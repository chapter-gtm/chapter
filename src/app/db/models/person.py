from __future__ import annotations

from typing import TYPE_CHECKING
from datetime import date

from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.lib.schema import Location, WorkExperience, SocialActivity
from .custom_types import LocationType, WorkExperienceType, SocialActivityType


class Person(UUIDAuditBase, SlugKey):
    """A person."""

    __tablename__ = "person"
    __pii_columns__ = {"first_name", "last_name", "full_name", "linkedin_url", "profile_pic_url", "personal_emails", "work_emails", "personal_numbers", "social_activities"}
    first_name: Mapped[str] = mapped_column(nullable=True, default=None)
    last_name: Mapped[str] = mapped_column(nullable=True, default=None)
    full_name: Mapped[str] = mapped_column(nullable=True, default=None)
    headline: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None)
    summary: Mapped[str | None] = mapped_column(String(length=2000), nullable=True, default=None)
    occupation: Mapped[str] = mapped_column(nullable=True, default=None)
    industry: Mapped[str | None] = mapped_column(nullable=True, default=None, index=True)
    profile_pic_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    linkedin_profile_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    twitter_profile_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    github_profile_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    location: Mapped[Location | None] = mapped_column(LocationType, nullable=True, default=None)
    personal_emails: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    work_emails: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    personal_numbers: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    birth_date: Mapped[date | None] = mapped_column(nullable=True, default=None)
    gender: Mapped[str | None] = mapped_column(nullable=True, default=None)
    languages: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True, default=None)
    work_experiences: Mapped[list[WorkExperience] | None] = mapped_column(WorkExperienceType, nullable=True, default=None)
    social_activities: Mapped[list[SocialActivity] | None] = mapped_column(SocialActivityType, nullable=True, default=None)
    # -----------
    # ORM Relationships
    # ------------
