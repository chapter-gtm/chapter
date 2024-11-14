from __future__ import annotations

from uuid import UUID
from datetime import date
from typing import Any, Final, TYPE_CHECKING

from advanced_alchemy.base import SlugKey, UUIDAuditBase, orm_registry
from sqlalchemy import String, Text, ForeignKey, Index, Column, Table, UniqueConstraint, desc
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.lib.schema import OpportunityStage, OpportunityContext
from .company import Company
from .person import Person
from .job_post import JobPost
from .custom_types import OpportunityStageType, OpportunityContextType

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
    __pii_columns__ = {}
    __table_args__ = (
        Index("ix_opportunity_id", "id"),
        Index("ix_opportunity_id_tenant_id", "id", "tenant_id"),
        Index("idx_opportunity_created_at", "tenant_id", desc("created_at")),
        Index("idx_opportunity_tenant_id_created_at", "tenant_id", desc("created_at")),
        UniqueConstraint("tenant_id", "company_id"),
    )
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    stage: Mapped[OpportunityStage] = mapped_column(
        OpportunityStageType, nullable=False, default="identified", index=True
    )
    notes: Mapped[str] = mapped_column(Text, nullable=True)
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
    logs: Mapped[list[OpportunityAuditLog]] = relationship(
        lazy="noload",
    )
