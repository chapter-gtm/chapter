"""User Account Controllers."""

from __future__ import annotations

import os
from typing import TYPE_CHECKING, Annotated

import boto3
from litestar import Controller, delete, get, patch, post
from litestar.di import Provide
from litestar.params import Dependency, Parameter
from litestar.response import Response
from litestar.exceptions import NotFoundException

from app.db.models import User as UserModel
from app.domain.accounts import urls
from app.domain.accounts.dependencies import provide_users_service
from app.domain.accounts.guards import requires_superuser, requires_active_user
from app.domain.accounts.schemas import User, UserCreate, UserUpdate
from app.domain.accounts.services import UserService

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.filters import FilterTypes
    from advanced_alchemy.service import OffsetPagination

app_s3_bucket_name = os.environ["APP_S3_BUCKET_NAME"]


class UserController(Controller):
    """User Account Controller."""

    tags = ["User Accounts"]
    guards = [requires_superuser]
    dependencies = {"users_service": Provide(provide_users_service)}
    signature_namespace = {
        "UserService": UserService,
        "UserModel": UserModel,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="ListUsers",
        name="users:list",
        summary="List Users",
        description="Retrieve the users.",
        path=urls.ACCOUNT_LIST,
        cache=60,
    )
    async def list_users(
        self,
        users_service: UserService,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[User]:
        """List users."""
        results, total = await users_service.list_and_count(*filters)
        return users_service.to_schema(data=results, total=total, schema_type=User, filters=filters)

    @get(
        operation_id="GetUser",
        name="users:get",
        path=urls.ACCOUNT_DETAIL,
        summary="Retrieve the details of a user.",
    )
    async def get_user(
        self,
        users_service: UserService,
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

    @get(
        operation_id="GetUserProfilePic",
        guards=[requires_active_user],
        name="users:get-profile-pic",
        path=urls.ACCOUNT_PROFILE_PIC,
        summary="Retrieve the profile pic of a user.",
    )
    async def get_user_profile_pic(
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
        if current_user.tenant_id != db_obj.tenant_id:
            raise Exception("User not found")

        try:
            # Retrieve the file from S3
            s3_client = boto3.client("s3")
            file_object = s3_client.get_object(Bucket=app_s3_bucket_name, Key="users/avatars/{user_id}.webp")

            # Extract the file content
            file_content = file_object["Body"].read()

            return Response(
                content=file_content,
                media_type="image/webp",  # Ensure correct media type
                headers={"Content-Disposition": "inline"},  # Optionally, force the browser to display the image inline
            )
        except s3_client.exceptions.NoSuchKey:
            raise NotFoundException(detail=f"Profile pic for user {user_id} not found.")

    @post(
        operation_id="CreateUser",
        name="users:create",
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
        """Create a new user."""
        db_obj = await users_service.update(item_id=user_id, data=data.to_dict())
        return users_service.to_schema(db_obj, schema_type=User)

    @delete(
        operation_id="DeleteUser",
        name="users:delete",
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
