from __future__ import annotations

from typing import TYPE_CHECKING

from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.lib.schema import Location, Funding
from .custom_types import LocationType, FundingType


class Company(UUIDAuditBase, SlugKey):
    """A company or an organization."""

    __tablename__ = "company"
    __pii_columns__ = {"name", "description", "url", "linkedin_url", "profile_pic_url"}
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None)
    type: Mapped[str | None] = mapped_column(nullable=True, default=None, index=True)
    industry: Mapped[str | None] = mapped_column(nullable=True, default=None, index=True)
    headcount: Mapped[int | None] = mapped_column(nullable=True, default=None, index=True)
    founded_year: Mapped[int | None] = mapped_column(nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    profile_pic_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    linkedin_profile_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    hq_location: Mapped[Location | None] = mapped_column(LocationType, nullable=True, default=None)
    last_funding: Mapped[Funding | None] = mapped_column(FundingType, nullable=True, default=None)
    # -----------
    # ORM Relationships
    # ------------
