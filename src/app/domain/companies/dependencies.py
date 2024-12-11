"""User Account Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from app.domain.companies.services import CompanyService

__all__ = ("provide_companies_service",)


if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncSession


async def provide_companies_service(db_session: AsyncSession) -> AsyncGenerator[CompanyService, None]:
    """Construct repository and service objects for the request."""
    async with CompanyService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service
