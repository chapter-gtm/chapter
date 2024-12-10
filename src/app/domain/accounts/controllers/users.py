"""User Account Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, delete, get, patch, post
from litestar.di import Provide
from litestar.params import Dependency, Parameter

from app.domain.accounts import urls
from app.domain.accounts.dependencies import provide_users_service
from app.domain.accounts.guards import requires_active_user, requires_superuser
from app.domain.accounts.schemas import User, UserCreate, UserLite, UserUpdate
from app.domain.accounts.services import UserService
from app.domain.accounts.utils import get_signed_user_profile_pic_url

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.service import OffsetPagination

    from app.db.models import User as UserModel


class UserController(Controller):
    """User Account Controller."""

    tags = ["User Accounts"]
    guards = [requires_active_user]
    dependencies = {"users_service": Provide(provide_users_service)}
    signature_namespace = {"UserService": UserService}
    dto = None
    return_dto = None

    @get(
        operation_id="ListUsers",
        name="users:list",
        summary="List Users",
        description="Retrieve the users.",
        path=urls.ACCOUNT_LIST,
        cache=300,
    )
    async def list_users(
        self,
        users_service: UserService,
        current_user: UserModel,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[UserLite]:
        """List users."""
        results, total = await users_service.list_and_count(*filters, tenant_id=current_user.tenant_id)
        paginated_response = users_service.to_schema(data=results, total=total, schema_type=UserLite, filters=filters)

        # Workaround due to https://github.com/jcrist/msgspec/issues/673
        # advanced alchemy to_schema uses `cast` to convert dict to schema
        # object, which does not call `__post_init__`
        for user in paginated_response.items:
            user.avatar_url = get_signed_user_profile_pic_url(user.id)

        return paginated_response

    @get(
        operation_id="GetUser",
        name="users:get",
        guards=[requires_superuser],
        path=urls.ACCOUNT_DETAIL,
        summary="Retrieve the details of a user.",
    )
    async def get_user(
        self,
        users_service: UserService,
        current_user: UserModel,
        user_id: Annotated[
            UUID,
            Parameter(
                title="User ID",
                description="The user to retrieve.",
            ),
        ],
    ) -> User:
        """Get a user."""
        db_obj = await users_service.get(user_id)
        return users_service.to_schema(db_obj, schema_type=User)

    @post(
        operation_id="CreateUser",
        name="users:create",
        guards=[requires_superuser],
        summary="Create a new user.",
        cache_control=None,
        description="A user who can login and use the system.",
        path=urls.ACCOUNT_CREATE,
    )
    async def create_user(
        self,
        users_service: UserService,
        data: UserCreate,
    ) -> User:
        """Create a new user."""
        db_obj = await users_service.create(data.to_dict())
        return users_service.to_schema(db_obj, schema_type=User)

    @patch(
        operation_id="UpdateUser",
        name="users:update",
        guards=[requires_superuser],
        path=urls.ACCOUNT_UPDATE,
    )
    async def update_user(
        self,
        data: UserUpdate,
        users_service: UserService,
        user_id: UUID = Parameter(
            title="User ID",
            description="The user to update.",
        ),
    ) -> User:
        """Update user."""
        db_obj = await users_service.update(item_id=user_id, data=data.to_dict())
        return users_service.to_schema(db_obj, schema_type=User)

    @delete(
        operation_id="DeleteUser",
        name="users:delete",
        guards=[requires_superuser],
        path=urls.ACCOUNT_DELETE,
        summary="Remove User",
        description="Removes a user and all associated data from the system.",
    )
    async def delete_user(
        self,
        users_service: UserService,
        user_id: Annotated[
            UUID,
            Parameter(
                title="User ID",
                description="The user to delete.",
            ),
        ],
    ) -> None:
        """Delete a user from the system."""
        _ = await users_service.delete(user_id)
