from __future__ import annotations

from datetime import date  # noqa: TCH003
from typing import TYPE_CHECKING

from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.lib.schema import Funding, Location, OrgSize  # noqa: TCH001

from .custom_types import FundingType, LocationType, OrgSizeType

if TYPE_CHECKING:
    from .person import Person
    from .repo import Repo


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
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    linkedin_profile_url: Mapped[str | None] = mapped_column(
        String(length=2083),
        nullable=True,
        default=None,
        unique=True,
    )
    hq_location: Mapped[Location | None] = mapped_column(LocationType, nullable=True, default=None)
    last_funding: Mapped[Funding | None] = mapped_column(FundingType, nullable=True, default=None)
    org_size: Mapped[OrgSize | None] = mapped_column(OrgSizeType, nullable=True, default=None)
    ios_app_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    android_app_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    docs_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    blog_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    changelog_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None)
    github_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    discord_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    slack_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    twitter_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=True, default=None, unique=True)
    product_last_released_at: Mapped[date] = mapped_column(nullable=True, default=None)
    # -----------
    # ORM Relationships
    # ------------
    people: Mapped[list[Person]] = relationship(
        back_populates="company",
        innerjoin=True,
        lazy="noload",
    )
    repos: Mapped[list[Repo]] = relationship(
        back_populates="company",
        innerjoin=True,
        lazy="noload",
    )
