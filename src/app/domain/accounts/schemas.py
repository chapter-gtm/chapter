from __future__ import annotations

from typing import TYPE_CHECKING, Any

from app.domain.teams.models import TeamRoles
from app.lib.schema import CamelizedBaseModel

if TYPE_CHECKING:
    from pydantic import UUID4, EmailStr
    from pydantic.types import SecretStr


class User(CamelizedBaseModel):
    """User properties to use for a response."""

    id: UUID4  # noqa: A003
    email: EmailStr
    name: str | None
    is_superuser: bool
    is_active: bool
    is_verified: bool
    teams: list[UserTeam] | None = []


class UserTeam(CamelizedBaseModel):
    """Holds teams details for a user.

    This is nested in the User Model for 'team'
    """

    team_id: UUID4 | None = None
    name: str | None = None
    is_owner: bool | None = False
    role: TeamRoles | None = TeamRoles.MEMBER

    @classmethod
    def from_orm(cls, obj: Any) -> UserTeam:
        """Flatten team details to the user membership object."""
        if getattr(obj, "team", None) and getattr(obj.team, "name", None):
            obj.name = obj.team.name
        return super().from_orm(obj)


class UserRegister(CamelizedBaseModel):
    """User Registration Input."""

    email: EmailStr
    password: SecretStr
    name: str | None = None


class UserLogin(CamelizedBaseModel):
    """Properties required to log in."""

    username: str
    password: SecretStr


class UserPasswordUpdate(CamelizedBaseModel):
    """Properties to receive for user updates."""

    current_password: SecretStr
    new_password: SecretStr


class UserPasswordConfirm(CamelizedBaseModel):
    """Confirm Password DTO."""

    password: SecretStr


# Properties to receive via API on creation
class UserCreate(CamelizedBaseModel):
    """User Create DTO."""

    email: EmailStr
    password: SecretStr
    name: str | None = None
    is_superuser: bool | None = False
    is_active: bool | None = True
    is_verified: bool | None = False


class UserUpdate(CamelizedBaseModel):
    """User update DTO."""

    email: EmailStr | None = None
    name: str | None = None
    is_superuser: bool | None = False
    is_active: bool | None = False
    is_verified: bool | None = False
