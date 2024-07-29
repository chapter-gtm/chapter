"""Application Modules."""
from __future__ import annotations

from typing import TYPE_CHECKING

from app.domain.accounts.controllers import AccessController, UserController, UserRoleController, TenantController
from app.domain.system.controllers import SystemController
from app.domain.tags.controllers import TagController
from app.domain.teams.controllers import TeamController, TeamMemberController
from app.domain.companies.controllers import CompanyController

if TYPE_CHECKING:
    from litestar.types import ControllerRouterHandler


route_handlers: list[ControllerRouterHandler] = [
    AccessController,
    UserController,
    TeamController,
    UserRoleController,
    #  TeamInvitationController,
    TeamMemberController,
    TagController,
    TenantController,
    CompanyController,
    SystemController,
]
