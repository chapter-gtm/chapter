from __future__ import annotations

from typing import TYPE_CHECKING, Any

from advanced_alchemy.repository import SQLAlchemyAsyncRepository
from sqlalchemy import ColumnElement, select

from app.db.models import JobPost

if TYPE_CHECKING:
    from advanced_alchemy.filters import FilterTypes

__all__ = ("JobPostRepository",)


class JobPostRepository(SQLAlchemyAsyncRepository[JobPost]):
    """JobPost Repository."""

    model_type = JobPost

    async def get_job_posts(
        self,
        *filters: FilterTypes | ColumnElement[bool],
        auto_expunge: bool | None = None,
        force_basic_query_mode: bool | None = None,
        **kwargs: Any,
    ) -> tuple[list[JobPost], int]:
        """Get paginated list and total count of job posts."""

        return await self.list_and_count(
            *filters,
            statement=select(JobPost).order_by(JobPost.created_at).options(),
            auto_expunge=auto_expunge,
            force_basic_query_mode=force_basic_query_mode,
            **kwargs,
        )
