from __future__ import annotations

from typing import TYPE_CHECKING, Any
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.repository import SQLAlchemyAsyncRepository, SQLAlchemyAsyncSlugRepository
<<<<<<< Updated upstream
from sqlalchemy import select
=======
from sqlalchemy import ColumnElement, select
from sqlalchemy.orm import joinedload, InstrumentedAttribute
>>>>>>> Stashed changes

from app.db.models import Role, Tenant, User, UserRole

if TYPE_CHECKING:
    from advanced_alchemy.repository._util import LoadSpec
    from advanced_alchemy.filters import FilterTypes


class UserRepository(SQLAlchemyAsyncRepository[User]):
    """User SQLAlchemy Repository."""

    model_type = User

    async def get_users(
        self,
        *filters: FilterTypes | ColumnElement[bool],
        tenant_id: UUID,
        auto_expunge: bool | None = None,
        force_basic_query_mode: bool | None = None,
        **kwargs: Any,
    ) -> tuple[list[User], int]:
        """Get paginated list and total count of opportunities that a tenant can access."""

        return await self.list_and_count(
            *filters,
            statement=select(User).where(User.tenant_id == tenant_id),
            auto_expunge=auto_expunge,
            force_basic_query_mode=force_basic_query_mode,
            **kwargs,
        )

    async def get_user(
        self,
        user_id: UUID,
        tenant_id: UUID,
        *,
        load: LoadSpec | None = None,
        execution_options: dict[str, Any] | None = None,
        auto_expunge: bool | None = None,
    ) -> User:
        """Get a user along with it's associated details."""
        return await self.get_one(
            id=user_id,
            auto_expunge=auto_expunge,
            statement=select(User).where((User.id == user_id) & (User.tenant_id == tenant_id)).options(),
            load=load,
            execution_options=execution_options,
        )


class RoleRepository(SQLAlchemyAsyncSlugRepository[Role]):
    """User SQLAlchemy Repository."""

    model_type = Role


class UserRoleRepository(SQLAlchemyAsyncRepository[UserRole]):
    """User Role SQLAlchemy Repository."""

    model_type = UserRole


class TenantRepository(SQLAlchemyAsyncSlugRepository[Tenant]):
    """Tenant SQLAlchemy Repository."""

    model_type = Tenant
