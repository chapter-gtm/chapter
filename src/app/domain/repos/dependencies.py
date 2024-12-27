"""Repo Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.domain.repos.services import RepoService

__all__ = ("provide_repos_service",)


if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncSession


async def provide_repos_service(db_session: AsyncSession) -> AsyncGenerator[RepoService, None]:
    """Construct repository and service objects for the request."""
    async with RepoService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service
