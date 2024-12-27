from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .company import Company


class Repo(UUIDAuditBase, SlugKey):
    """A Repo."""

    __tablename__ = "repo"
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(String(length=2083), nullable=False, unique=True)
    html_url: Mapped[str | None] = mapped_column(String(length=2083), nullable=False, unique=True)
    language: Mapped[str] = mapped_column(nullable=True)
    search_query: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("company.id"), nullable=True, index=True)
    # -----------
    # ORM Relationships
    # ------------
    company: Mapped[Company] = relationship(
        back_populates="repos",
        innerjoin=True,
        uselist=False,
        lazy="noload",
    )
