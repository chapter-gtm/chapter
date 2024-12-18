# type: ignore
"""Add association opportunity_job_post

Revision ID: 992fa69e02cb
Revises: 44ace4dcae8c
Create Date: 2024-08-02 13:55:31.388468+00:00

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
revision = "992fa69e02cb"
down_revision = "44ace4dcae8c"
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
        "opportunity_job_post_relation",
        sa.Column("opportunity_id", sa.GUID(length=16), nullable=False),
        sa.Column("job_post_id", sa.GUID(length=16), nullable=False),
        sa.ForeignKeyConstraint(
            ["job_post_id"],
            ["job_post.id"],
            name=op.f("fk_opportunity_job_post_relation_job_post_id_job_post"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["opportunity_id"],
            ["opportunity.id"],
            name=op.f("fk_opportunity_job_post_relation_opportunity_id_opportunity"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("opportunity_id", "job_post_id", name=op.f("pk_opportunity_job_post_relation")),
    )
    # ### end Alembic commands ###


def schema_downgrades() -> None:
    """schema downgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("opportunity_job_post_relation")
    # ### end Alembic commands ###


def data_upgrades() -> None:
    """Add any optional data upgrade migrations here!"""


def data_downgrades() -> None:
    """Add any optional data downgrade migrations here!"""
