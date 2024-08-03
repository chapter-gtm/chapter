"""Opportunity Account Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.orm import joinedload, noload, selectinload

from app.db.models import Opportunity, OpportunityAuditLog
from app.domain.opportunities.services import OpportunityService, OpportunityAuditLogService

__all__ = ("provide_opportunities_service", "provide_opportunities_audit_log_service")


if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from sqlalchemy.ext.asyncio import AsyncSession


async def provide_opportunities_service(db_session: AsyncSession) -> AsyncGenerator[OpportunityService, None]:
    """Construct repository and service objects for the request."""
    async with OpportunityService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service


async def provide_opportunities_audit_log_service(db_session: AsyncSession) -> AsyncGenerator[OpportunityAuditLogService, None]:
    """Construct repository and service objects for the request."""
    async with OpportunityAuditLogService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service
