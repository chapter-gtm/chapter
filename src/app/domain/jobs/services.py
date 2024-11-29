from __future__ import annotations

from typing import TYPE_CHECKING, Any

from advanced_alchemy.exceptions import RepositoryError
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService, is_dict, is_msgspec_model, is_pydantic_model
from uuid_utils.compat import uuid4

from app.lib.schema import CamelizedBaseStruct, Location, Funding
from app.db.models import JobPost

from .repositories import JobPostRepository

if TYPE_CHECKING:
    from collections.abc import Iterable
    from uuid import UUID

    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.service import ModelDictT
    from msgspec import Struct
    from sqlalchemy.orm import InstrumentedAttribute

__all__ = ("JobPostService",)


class JobPostService(SQLAlchemyAsyncRepositoryService[JobPost]):
    """JobPost Service."""

    repository_type = JobPostRepository
    match_fields = ["title"]

    def __init__(self, **repo_kwargs: Any) -> None:
        self.repository: JobPostRepository = self.repository_type(**repo_kwargs)
        self.model_type = self.repository.model_type

    async def get_job_posts(
        self,
        *filters: FilterTypes,
        **kwargs: Any,
    ) -> tuple[list[JobPost], int]:
        """Get all job posts."""
        return await self.repository.get_job_posts(*filters, **kwargs)
