# type: ignore
"""Add a company person relation table

Revision ID: 269b038e5545
Revises: 698ddcfa9900
Create Date: 2024-07-31 12:07:19.041712+00:00

"""
from __future__ import annotations

import warnings
from typing import TYPE_CHECKING

import sqlalchemy as sa
from alembic import op
from advanced_alchemy.types import EncryptedString, EncryptedText, GUID, ORA_JSONB, DateTimeUTC
from sqlalchemy import Text  # noqa: F401

if TYPE_CHECKING:
    from collections.abc import Sequence

__all__ = ["downgrade", "upgrade", "schema_upgrades", "schema_downgrades", "data_upgrades", "data_downgrades"]

sa.GUID = GUID
sa.DateTimeUTC = DateTimeUTC
sa.ORA_JSONB = ORA_JSONB
sa.EncryptedString = EncryptedString
sa.EncryptedText = EncryptedText

# revision identifiers, used by Alembic.
revision = "269b038e5545"
down_revision = "698ddcfa9900"
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
        "company_person_relation",
        sa.Column("id", sa.GUID(length=16), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("company_id", sa.GUID(length=16), nullable=False),
        sa.Column("person_id", sa.GUID(length=16), nullable=False),
        sa.Column("sa_orm_sentinel", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTimeUTC(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTimeUTC(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["company_id"],
            ["company.id"],
            name=op.f("fk_company_person_relation_company_id_company"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["person_id"], ["person.id"], name=op.f("fk_company_person_relation_person_id_person"), ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("company_id", "person_id", "id", name=op.f("pk_company_person_relation")),
    )
    with op.batch_alter_table("company_person_relation", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_company_person_relation_company_id"), ["company_id"], unique=False)
        batch_op.create_index(batch_op.f("ix_company_person_relation_title"), ["title"], unique=False)

    # ### end Alembic commands ###


def schema_downgrades() -> None:
    """schema downgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("company_person_relation", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_company_person_relation_title"))
        batch_op.drop_index(batch_op.f("ix_company_person_relation_company_id"))

    op.drop_table("company_person_relation")
    # ### end Alembic commands ###


def data_upgrades() -> None:
    """Add any optional data upgrade migrations here!"""


def data_downgrades() -> None:
    """Add any optional data downgrade migrations here!"""
