from __future__ import annotations

from typing import TYPE_CHECKING, Any

from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from uuid_utils.compat import uuid4

from app.lib.schema import CamelizedBaseStruct, Location, WorkExperience, SocialActivity
from app.db.models import Person

from .repositories import PersonRepository

if TYPE_CHECKING:
    from collections.abc import Iterable
    from uuid import UUID

    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.service import ModelDictT
    from msgspec import Struct
    from sqlalchemy.orm import InstrumentedAttribute

__all__ = ("PersonService",)


class PersonService(SQLAlchemyAsyncRepositoryService[Person]):
    """Person Service."""

    repository_type = PersonRepository
    match_fields = ["full_name"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: PersonRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type

    async def to_model(self, data: Person | dict[str, Any] | Struct, operation: str | None = None) -> Person:
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "create" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "update" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if (is_msgspec_model(data) or is_pydantic_model(data)) and operation == "upsert" and data.slug is None:  # type: ignore[union-attr]
            data.slug = await self.repository.get_available_slug(data.name)  # type: ignore[union-attr]
        if is_dict(data) and "slug" not in data and operation == "create":
            data["slug"] = await self.repository.get_available_slug(data["full_name"])
        if is_dict(data) and "slug" not in data and "full_name" in data and operation == "update":
            data["slug"] = await self.repository.get_available_slug(data["full_name"])
        if is_dict(data) and "slug" not in data and "full_name" in data and operation == "upsert":
            data["slug"] = await self.repository.get_available_slug(data["full_name"])
        return await super().to_model(data, operation)
