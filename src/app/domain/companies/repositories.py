from __future__ import annotations

from typing import TYPE_CHECKING, Any
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.repository import SQLAlchemyAsyncRepository, SQLAlchemyAsyncSlugRepository
from sqlalchemy import ColumnElement, select
from sqlalchemy.orm import joinedload, selectinload

from app.db.models import Company

if TYPE_CHECKING:
    from advanced_alchemy.filters import FilterTypes

__all__ = ("CompanyRepository",)


class CompanyRepository(SQLAlchemyAsyncSlugRepository[Company]):
    """Company Repository."""

    model_type = Company
