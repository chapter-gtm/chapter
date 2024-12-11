from __future__ import annotations

from typing import TYPE_CHECKING, Any

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService

from app.db.models import JobPost

from .repositories import JobPostRepository

if TYPE_CHECKING:

    from advanced_alchemy.filters import FilterTypes

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
