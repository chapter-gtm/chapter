"""

Revision ID: 3509c01a5e01
Revises: 
Create Date: 2023-01-21 11:01:45.233332.

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "3509c01a5e01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user_account",
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), nullable=False),
        sa.Column("is_verified", sa.Boolean(), nullable=False),
        sa.Column("verified_at", sa.Date(), nullable=True),
        sa.Column("joined_at", sa.Date(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_user_account")),
        comment="User accounts for application access",
    )
    op.create_index(op.f("ix_user_account_email"), "user_account", ["email"], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_user_account_email"), table_name="user_account")
    op.drop_table("user_account")
    # ### end Alembic commands ###
