"""ICP Controllers."""
from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, delete, get, patch, post
from litestar.di import Provide
from litestar.exceptions import ValidationException

from app.config import constants
from app.db.models import User as UserModel
from app.domain.accounts.guards import requires_active_user
from app.domain.accounts.services import UserService
from app.domain.opportunities import urls
from app.domain.opportunities.dependencies import provide_icp_service
from app.domain.opportunities.schemas import ICP
from app.domain.opportunities.services import ICPService

if TYPE_CHECKING:
    from uuid import UUID
    from litestar.params import Dependency, Parameter
    from app.lib.dependencies import FilterTypes


class ICPController(Controller):
    """ICP operations."""

    tags = ["ICPs"]
    dependencies = {
        "icp_service": Provide(provide_icp_service),
    }
    guards = [requires_active_user]
    signature_namespace = {
        "ICPService": ICPService,
        "UserModel": UserModel,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="GetICP",
        name="icp:get",
        summary="Retrieve the details of an icp.",
        path=urls.ICP_DETAIL,
    )
    async def get_icp(
        self,
        icp_service: ICPService,
        current_user: UserModel,
    ) -> ICP:
        """Get details about a comapny."""
        db_obj = await icp_service.get_by_tenant_id(current_user.tenant_id)
        return icp_service.to_schema(schema_type=ICP, data=db_obj)
