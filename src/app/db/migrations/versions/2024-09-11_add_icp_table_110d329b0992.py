# type: ignore
"""Add icp table

Revision ID: 110d329b0992
Revises: 50dc3def711b
Create Date: 2024-09-11 15:57:47.240984+00:00

"""
from __future__ import annotations

import warnings
from typing import TYPE_CHECKING

import sqlalchemy as sa
from alembic import op
from advanced_alchemy.types import EncryptedString, EncryptedText, GUID, ORA_JSONB, DateTimeUTC
from sqlalchemy import Text  # noqa: F401

from app.db.models.custom_types import CompanyCriteriaType, ToolCriteriaType, PersonCriteriaType

if TYPE_CHECKING:
    from collections.abc import Sequence

__all__ = ["downgrade", "upgrade", "schema_upgrades", "schema_downgrades", "data_upgrades", "data_downgrades"]

sa.GUID = GUID
sa.DateTimeUTC = DateTimeUTC
sa.ORA_JSONB = ORA_JSONB
sa.EncryptedString = EncryptedString
sa.EncryptedText = EncryptedText

# revision identifiers, used by Alembic.
revision = "110d329b0992"
down_revision = "50dc3def711b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=UserWarning)
        with op.get_context().autocommit_block():
            schema_upgrades()
            data_upgrades()


def downgrade() -> None:
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", category=UserWarning)
        with op.get_context().autocommit_block():
            data_downgrades()
            schema_downgrades()


def schema_upgrades() -> None:
    """schema upgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "icp",
        sa.Column("id", sa.GUID(length=16), nullable=False),
        sa.Column("company", CompanyCriteriaType(), nullable=True),
        sa.Column("tool", ToolCriteriaType(), nullable=True),
        sa.Column("person", PersonCriteriaType(), nullable=True),
        sa.Column("tenant_id", sa.GUID(length=16), nullable=False),
        sa.Column("sa_orm_sentinel", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTimeUTC(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTimeUTC(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenant.id"], name=op.f("fk_icp_tenant_id_tenant")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_icp")),
    )
    with op.batch_alter_table("icp", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_icp_person"), ["person"], unique=False)
        batch_op.create_index(batch_op.f("ix_icp_tenant_id"), ["tenant_id"], unique=False)

    # ### end Alembic commands ###


def schema_downgrades() -> None:
    """schema downgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("icp", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_icp_tenant_id"))
        batch_op.drop_index(batch_op.f("ix_icp_person"))

    op.drop_table("icp")
    # ### end Alembic commands ###


def data_upgrades() -> None:
    """Add any optional data upgrade migrations here!"""


def data_downgrades() -> None:
    """Add any optional data downgrade migrations here!"""
