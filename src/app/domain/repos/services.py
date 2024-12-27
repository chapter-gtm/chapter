"""Repo services."""
from __future__ import annotations

from typing import TYPE_CHECKING, Any

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model

from app.db.models import Repo

from .repositories import RepoRepository

if TYPE_CHECKING:
    from advanced_alchemy.service import ModelDictT

__all__ = ("RepoService",)


class RepoService(SQLAlchemyAsyncRepositoryService[Repo]):
    """Repo Service."""

    repository_type = RepoRepository
    match_fields = ["name"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: RepoRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type

    async def to_model(self, data: ModelDictT[Repo], operation: str | None = None) -> Repo:
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "create" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "update" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "upsert" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if is_dict(data) and "slug" not in data and operation == "create":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        if is_dict(data) and "slug" not in data and "name" in data and operation == "update":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        if is_dict(data) and "slug" not in data and "name" in data and operation == "upsert":
            data["slug"] = await self.repository.get_available_slug(data["name"])
        return await super().to_model(data, operation)
