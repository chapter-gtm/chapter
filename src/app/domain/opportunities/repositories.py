from __future__ import annotations

from typing import TYPE_CHECKING, Any
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.repository import SQLAlchemyAsyncSlugRepository
from sqlalchemy import ColumnElement, select
from sqlalchemy.orm import joinedload

from app.db.models import Opportunity, OpportunityAuditLog

if TYPE_CHECKING:
    from advanced_alchemy.filters import FilterTypes

__all__ = (
    "OpportunityRepository",
    "OpportunityAuditLogRepository"
)


class OpportunityRepository(SQLAlchemyAsyncSlugRepository[Opportunity]):
    """Opportunity Repository."""

    model_type = Opportunity

    async def get_opportunities(
        self,
        *filters: FilterTypes | ColumnElement[bool],
        tenant_id: UUID,
        auto_expunge: bool | None = None,
        force_basic_query_mode: bool | None = None,
        **kwargs: Any,
    ) -> tuple[list[Opportunity], int]:
        """Get paginated list and total count of opportunities that a tenant can access."""

        return await self.list_and_count(
            *filters,
            statement=select(Opportunity)
            .where(Opportunity.tenant_id == tenant_id)
            .order_by(Opportunity.score)
            .options(
                joinedload(Opportunity.company, innerjoin=True),
                joinedload(Opportunity.contacts, isouter=True),
                joinedload(Opportunity.logs, innerjoin=True),
            ),
            auto_expunge=auto_expunge,
            force_basic_query_mode=force_basic_query_mode,
            **kwargs,
        )


class OpportunityAuditLogRepository(SQLAlchemyAsyncSlugRepository[OpportunityAuditLog]):
    """OpportunityAuditLog Repository."""

    model_type = OpportunityAuditLog
