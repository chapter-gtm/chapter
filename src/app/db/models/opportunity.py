from __future__ import annotations

from typing import TYPE_CHECKING, Any, Final
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.base import SlugKey, UUIDAuditBase, orm_registry
from sqlalchemy import Column, ForeignKey, Index, Table, Text, UniqueConstraint, desc
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.lib.schema import OpportunityContext, OpportunityStage  # noqa: TCH001

from .company import Company  # noqa: TCH001
from .custom_types import OpportunityContextType, OpportunityStageType
from .job_post import JobPost  # noqa: TCH001
from .person import Person  # noqa: TCH001
from .repo import Repo  # noqa: TCH001

if TYPE_CHECKING:
    from .user import User


opportunity_person_relation: Final[Table] = Table(
    "opportunity_person_relation",
    orm_registry.metadata,
    Column("opportunity_id", ForeignKey("opportunity.id", ondelete="CASCADE"), primary_key=True, index=True),
    Column("person_id", ForeignKey("person.id", ondelete="CASCADE"), primary_key=True),
    Column("tenant_id", ForeignKey("tenant.id", ondelete="CASCADE"), primary_key=True),
)

opportunity_job_post_relation: Final[Table] = Table(
    "opportunity_job_post_relation",
    orm_registry.metadata,
    Column("opportunity_id", ForeignKey("opportunity.id", ondelete="CASCADE"), primary_key=True, index=True),
    Column("job_post_id", ForeignKey("job_post.id", ondelete="CASCADE"), primary_key=True),
    Column("tenant_id", ForeignKey("tenant.id", ondelete="CASCADE"), primary_key=True),
    Index("idx_opportunity_job_post_relation_opportunity_job", "opportunity_id", "job_post_id"),
)

opportunity_repo_relation: Final[Table] = Table(
    "opportunity_repo_relation",
    orm_registry.metadata,
    Column("opportunity_id", ForeignKey("opportunity.id", ondelete="CASCADE"), primary_key=True, index=True),
    Column("repo_id", ForeignKey("repo.id", ondelete="CASCADE"), primary_key=True),
    Column("tenant_id", ForeignKey("tenant.id", ondelete="CASCADE"), primary_key=True),
    Index("idx_opportunity_repo_relation_opportunity_repo", "opportunity_id", "repo_id"),
)


class OpportunityAuditLog(UUIDAuditBase):
    """An audit log for opportunity."""

    __tablename__ = "opportunity_audit_log"
    __table_args__ = (Index("ix_opportunity_audit_log_opportunity_id_tenant_id", "opportunity_id", "tenant_id"),)
    operation: Mapped[str] = mapped_column(nullable=False)
    diff: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True, default=None)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user_account.id"), nullable=True)
    tenant_id: Mapped[UUID] = mapped_column(ForeignKey("tenant.id"), nullable=False)
    opportunity_id: Mapped[UUID] = mapped_column(ForeignKey("opportunity.id"), nullable=False, index=True)
    # -----------
    # ORM Relationships
    # ------------
    user: Mapped[User] = relationship(
        lazy="joined",
    )


class Opportunity(UUIDAuditBase, SlugKey):
    """An opportunity."""

    __tablename__ = "opportunity"
    __table_args__ = (
        Index("ix_opportunity_id", "id"),
        Index("ix_opportunity_id_tenant_id", "id", "tenant_id"),
        Index("idx_opportunity_created_at", "tenant_id", desc("created_at")),
        Index("idx_opportunity_tenant_id_created_at", "tenant_id", desc("created_at")),
        UniqueConstraint("tenant_id", "company_id"),
    )  # type: ignore[assignment]
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    stage: Mapped[OpportunityStage] = mapped_column(
        OpportunityStageType,
        nullable=False,
        default="identified",
        index=True,
    )
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    context: Mapped[OpportunityContext | None] = mapped_column(OpportunityContextType, nullable=True, default={})
    tenant_id: Mapped[UUID] = mapped_column(ForeignKey("tenant.id"), nullable=False, index=True)
    owner_id: Mapped[UUID] = mapped_column(ForeignKey("user_account.id"), nullable=True, default=None, index=True)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("company.id"), nullable=True, index=True)
    # -----------
    # ORM Relationships
    # ------------
    owner: Mapped[User] = relationship(
        lazy="joined",
    )
    company: Mapped[Company] = relationship(
        lazy="joined",
    )
    contacts: Mapped[list[Person]] = relationship(
        secondary=lambda: opportunity_person_relation,
        cascade="all, delete",
        passive_deletes=True,
        lazy="selectin",
    )
    job_posts: Mapped[list[JobPost]] = relationship(
        secondary=lambda: opportunity_job_post_relation,
        cascade="all, delete",
        passive_deletes=True,
        lazy="selectin",
    )
    repos: Mapped[list[Repo]] = relationship(
        secondary=lambda: opportunity_repo_relation,
        cascade="all, delete",
        passive_deletes=True,
        lazy="selectin",
    )
    logs: Mapped[list[OpportunityAuditLog]] = relationship(
        lazy="noload",
    )
