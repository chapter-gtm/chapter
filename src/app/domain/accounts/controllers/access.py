"""User Account Controllers."""

from __future__ import annotations

from datetime import timedelta
from typing import Annotated

from advanced_alchemy.utils.text import slugify
from litestar import Controller, Request, Response, get, patch, post
from litestar.di import Provide
from litestar.enums import RequestEncodingType
from litestar.params import Body
from litestar.security.jwt import OAuth2Login

from app.db.models import User as UserModel  # noqa: TCH001
from app.domain.accounts import urls
from app.domain.accounts.dependencies import provide_users_service
from app.domain.accounts.guards import auth, requires_active_user
from app.domain.accounts.schemas import AccountLogin, AccountRegister, User, UserUpdate
from app.domain.accounts.services import RoleService, UserService
from app.domain.accounts.utils import get_signed_user_profile_pic_url


class AccessController(Controller):
    """User login and registration."""

    tags = ["Access"]
    dependencies = {"users_service": Provide(provide_users_service)}
    signature_namespace = {
        "UserService": UserService,
        "RoleService": RoleService,
        "OAuth2Login": OAuth2Login,
        "RequestEncodingType": RequestEncodingType,
        "Body": Body,
        "User": User,
    }

    @post(
        operation_id="AccountLogin",
        name="account:login",
        path=urls.ACCOUNT_LOGIN,
        cache=False,
        summary="Login",
        exclude_from_auth=True,
    )
    async def login(
        self,
        users_service: UserService,
        data: Annotated[AccountLogin, Body(title="OAuth2 Login", media_type=RequestEncodingType.URL_ENCODED)],
    ) -> Response[OAuth2Login]:
        """Authenticate a user."""
        user = await users_service.authenticate(data.username, data.password)
        return auth.login(user.email, token_expiration=timedelta(days=7))

    @post(
        operation_id="AccountLogout",
        name="account:logout",
        path=urls.ACCOUNT_LOGOUT,
        cache=False,
        summary="Logout",
        exclude_from_auth=True,
    )
    async def logout(
        self,
        request: Request,
    ) -> Response:
        """Account Logout"""
        request.cookies.pop(auth.key, None)
        request.clear_session()

        response = Response(
            {"message": "OK"},
            status_code=200,
        )
        response.delete_cookie(auth.key)

        return response

    @post(
        operation_id="AccountRegister",
        name="account:register",
        path=urls.ACCOUNT_REGISTER,
        cache=False,
        summary="Create User",
        description="Register a new account.",
    )
    async def signup(
        self,
        request: Request,
        users_service: UserService,
        roles_service: RoleService,
        data: AccountRegister,
    ) -> User:
        """User Signup."""
        user_data = data.to_dict()
        role_obj = await roles_service.get_one_or_none(slug=slugify(users_service.default_role))
        if role_obj is not None:
            user_data.update({"role_id": role_obj.id})
        user = await users_service.create(user_data)
        request.app.emit(event_id="user_created", user_id=user.id)
        return users_service.to_schema(user, schema_type=User)

    @get(
        operation_id="AccountProfile",
        name="account:profile",
        path=urls.ACCOUNT_PROFILE,
        guards=[requires_active_user],
        summary="User Profile",
        description="User profile information.",
    )
    async def profile(self, request: Request, current_user: UserModel, users_service: UserService) -> User:
        """User Profile."""
        # Workaround due to https://github.com/jcrist/msgspec/issues/673
        # advanced alchemy to_schema uses `cast` to convert dict to schema
        # object, which does not call `__post_init__`
        user = users_service.to_schema(current_user, schema_type=User)
        user.avatar_url = get_signed_user_profile_pic_url(user.id)
        return user

    @patch(
        operation_id="UpdateCurrentUser",
        name="account:update",
        path=urls.ACCOUNT_PROFILE_UPDATE,
    )
    async def update_profile(
        self,
        data: UserUpdate,
        current_user: UserModel,
        users_service: UserService,
    ) -> User:
        """Update user profile."""
        db_obj = await users_service.update(item_id=current_user.id, data=data.to_dict())
        return users_service.to_schema(db_obj, schema_type=User)
