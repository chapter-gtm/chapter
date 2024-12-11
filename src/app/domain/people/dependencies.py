"""People Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.domain.people.services import PersonService

__all__ = ("provide_persons_service",)


if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncSession


async def provide_persons_service(db_session: AsyncSession) -> AsyncGenerator[PersonService, None]:
    """Construct repository and service objects for the request."""
    async with PersonService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service
