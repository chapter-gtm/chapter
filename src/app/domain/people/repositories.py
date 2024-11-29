from __future__ import annotations

from typing import TYPE_CHECKING, Any
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.repository import SQLAlchemyAsyncRepository, SQLAlchemyAsyncSlugRepository
from sqlalchemy import ColumnElement, select
from sqlalchemy.orm import joinedload, selectinload

from app.db.models import Person

if TYPE_CHECKING:
    from advanced_alchemy.filters import FilterTypes

__all__ = ("PersonRepository",)


class PersonRepository(SQLAlchemyAsyncSlugRepository[Person]):
    """Person Repository."""

    model_type = Person
