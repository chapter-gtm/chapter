"""Repo repositories."""
from __future__ import annotations

from advanced_alchemy.repository import SQLAlchemyAsyncSlugRepository

from app.db.models import Repo

__all__ = ("RepoRepository",)


class RepoRepository(SQLAlchemyAsyncSlugRepository[Repo]):
    """Repo Repository."""

    model_type = Repo
