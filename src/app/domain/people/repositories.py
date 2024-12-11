from __future__ import annotations

from advanced_alchemy.repository import SQLAlchemyAsyncSlugRepository

from app.db.models import Person

__all__ = ("PersonRepository",)


class PersonRepository(SQLAlchemyAsyncSlugRepository[Person]):
    """Person Repository."""

    model_type = Person
