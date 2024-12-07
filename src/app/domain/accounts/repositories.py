from __future__ import annotations

from typing import TYPE_CHECKING, Any
from uuid import UUID  # noqa: TCH003

from advanced_alchemy.repository import SQLAlchemyAsyncRepository, SQLAlchemyAsyncSlugRepository
from sqlalchemy import select

from app.db.models import Role, Tenant, User, UserRole

if TYPE_CHECKING:
    from advanced_alchemy.repository._util import LoadSpec


class UserRepository(SQLAlchemyAsyncRepository[User]):
    """User SQLAlchemy Repository."""

    model_type = User

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
