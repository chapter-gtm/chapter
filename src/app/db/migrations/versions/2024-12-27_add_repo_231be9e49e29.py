# type: ignore
"""Add repo

Revision ID: 231be9e49e29
Revises: 7f74b429804b
Create Date: 2024-12-27 11:14:31.609513+00:00

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
revision = '231be9e49e29'
down_revision = '7f74b429804b'
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
    op.create_table('repo',
    sa.Column('id', sa.GUID(length=16), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('url', sa.String(length=2083), nullable=False),
    sa.Column('html_url', sa.String(length=2083), nullable=False),
    sa.Column('language', sa.String(), nullable=True),
    sa.Column('search_query', sa.String(length=500), nullable=True),
    sa.Column('company_id', sa.GUID(length=16), nullable=True),
    sa.Column('slug', sa.String(length=100), nullable=False),
    sa.Column('sa_orm_sentinel', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTimeUTC(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTimeUTC(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['company_id'], ['company.id'], name=op.f('fk_repo_company_id_company')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_repo')),
    sa.UniqueConstraint('html_url'),
    sa.UniqueConstraint('html_url', name=op.f('uq_repo_html_url')),
    sa.UniqueConstraint('slug', name='uq_repo_slug'),
    sa.UniqueConstraint('url'),
    sa.UniqueConstraint('url', name=op.f('uq_repo_url'))
    )
    with op.batch_alter_table('repo', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_repo_company_id'), ['company_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_repo_name'), ['name'], unique=False)
        batch_op.create_index('ix_repo_slug_unique', ['slug'], unique=True)

    # ### end Alembic commands ###

def schema_downgrades() -> None:
    """schema downgrade migrations go here."""
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('repo', schema=None) as batch_op:
        batch_op.drop_index('ix_repo_slug_unique')
        batch_op.drop_index(batch_op.f('ix_repo_name'))
        batch_op.drop_index(batch_op.f('ix_repo_company_id'))

    op.drop_table('repo')
    # ### end Alembic commands ###

def data_upgrades() -> None:
    """Add any optional data upgrade migrations here!"""

def data_downgrades() -> None:
    """Add any optional data downgrade migrations here!"""
