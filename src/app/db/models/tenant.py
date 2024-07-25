from __future__ import annotations

from typing import TYPE_CHECKING

from advanced_alchemy.base import SlugKey, UUIDAuditBase
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .user import User


class Tenant(UUIDAuditBase, SlugKey):
    """A group of tenants i.e. a company or an organization."""

    __tablename__ = "tenant"
    __pii_columns__ = {"name", "description", "url"}
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None)
    url: Mapped[str | None] = mapped_column(nullable=True, default=None)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    # -----------
    # ORM Relationships
    # ------------
    users: Mapped[list[User]] = relationship(
        back_populates="tenant",
        innerjoin=True,
        lazy="selectin",
    )
