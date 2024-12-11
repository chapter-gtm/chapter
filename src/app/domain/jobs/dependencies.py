"""Job Post Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.domain.jobs.services import JobPostService

__all__ = ("provide_job_posts_service",)


if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncSession


async def provide_job_posts_service(db_session: AsyncSession) -> AsyncGenerator[JobPostService, None]:
    """Construct repository and service objects for the request."""
    async with JobPostService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service
