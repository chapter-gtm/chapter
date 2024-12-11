from __future__ import annotations

from advanced_alchemy.repository import SQLAlchemyAsyncSlugRepository

from app.db.models import Company

__all__ = ("CompanyRepository",)


class CompanyRepository(SQLAlchemyAsyncSlugRepository[Company]):
    """Company Repository."""

    model_type = Company
