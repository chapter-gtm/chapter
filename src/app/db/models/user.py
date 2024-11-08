from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.base import UUIDAuditBase
from sqlalchemy import String, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from .oauth_account import UserOauthAccount
    from .team_member import TeamMember
    from .user_role import UserRole
    from .tenant import Tenant


class User(UUIDAuditBase):
    __tablename__ = "user_account"
    __table_args__ = (Index("ix_user_account_id", "id"),)
    __pii_columns__ = {"name", "email", "avatar_url"}

    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    name: Mapped[str | None] = mapped_column(nullable=True, default=None)
    hashed_password: Mapped[str | None] = mapped_column(String(length=255), nullable=True, default=None)
    avatar_url: Mapped[str | None] = mapped_column(String(length=500), nullable=True, default=None)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    verified_at: Mapped[date] = mapped_column(nullable=True, default=None)
    joined_at: Mapped[date] = mapped_column(default=datetime.now)
    login_count: Mapped[int] = mapped_column(default=0)
    tenant_id: Mapped[UUID] = mapped_column(ForeignKey("tenant.id"), nullable=False)
    recently_viewed_opportunity_ids: Mapped[list[UUID]] = mapped_column(JSONB, nullable=True, default=[])
    # -----------
    # ORM Relationships
    # ------------
    #
    tenant: Mapped[Tenant] = relationship(
        back_populates="users",
        innerjoin=True,
        uselist=False,
        lazy="noload",
    )
    roles: Mapped[list[UserRole]] = relationship(
        back_populates="user",
        lazy="noload",
        uselist=True,
        cascade="all, delete",
    )
    teams: Mapped[list[TeamMember]] = relationship(
        back_populates="user",
        lazy="noload",
        uselist=True,
        cascade="all, delete",
        viewonly=True,
    )
    oauth_accounts: Mapped[list[UserOauthAccount]] = relationship(
        back_populates="user",
        lazy="noload",
        cascade="all, delete",
        uselist=True,
    )
