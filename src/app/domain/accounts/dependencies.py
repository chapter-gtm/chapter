"""User Account Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from sqlalchemy.orm import joinedload, selectinload

from app.db.models import Role, UserRole
from app.db.models import User as UserModel
from app.domain.accounts.services import RoleService, TenantService, UserRoleService, UserService

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from litestar.connection import Request
    from litestar.security.jwt import Token
    from sqlalchemy.ext.asyncio import AsyncSession


async def provide_user(request: Request[UserModel, Token, Any]) -> UserModel:
    """Get the user from the connection.

    Args:
        request: current connection.

    Returns:
        User
    """
    return request.user


async def provide_users_service(db_session: AsyncSession) -> AsyncGenerator[UserService, None]:
    """Construct repository and service objects for the request."""
    async with UserService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service


async def provide_roles_service(db_session: AsyncSession | None = None) -> AsyncGenerator[RoleService, None]:
    """Provide roles service.

    Args:
        db_session (AsyncSession | None, optional): current database session. Defaults to None.

    Returns:
        RoleService: A role service object
    """
    async with RoleService.new(
        session=db_session,
        load=selectinload(Role.users).options(joinedload(UserRole.user, innerjoin=True)),
    ) as service:
        yield service


async def provide_user_roles_service(db_session: AsyncSession | None = None) -> AsyncGenerator[UserRoleService, None]:
    """Provide user roles service.

    Args:
        db_session (AsyncSession | None, optional): current database session. Defaults to None.

    Returns:
        UserRoleService: A user role service object
    """
    async with UserRoleService.new(
        session=db_session,
    ) as service:
        yield service


async def provide_tenants_service(db_session: AsyncSession) -> AsyncGenerator[TenantService, None]:
    """Construct repository and service objects for the request."""
    async with TenantService.new(
        session=db_session,
        load=[],
    ) as service:
        yield service
