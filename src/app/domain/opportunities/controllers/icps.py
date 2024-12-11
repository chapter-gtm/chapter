"""ICP Controllers."""
from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, get, post, put
from litestar.di import Provide
from litestar.exceptions import ValidationException

from app.db.models import User as UserModel
from app.domain.accounts.guards import requires_active_user
from app.domain.opportunities import urls
from app.domain.opportunities.dependencies import provide_icp_service
from app.domain.opportunities.schemas import ICP, ICPCreate, ICPUpdate
from app.domain.opportunities.services import ICPService

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
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
        operation_id="ListICPs",
        name="icps:list",
        summary="List ICPs",
        path=urls.ICP_LIST,
    )
    async def list_icps(
        self,
        icp_service: ICPService,
        current_user: UserModel,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[ICP]:
        """List opportunities that your account can access.."""
        results, total = await icp_service.get_icps(*filters, tenant_id=current_user.tenant_id)
        return icp_service.to_schema(data=results, total=total, schema_type=ICP, filters=filters)

    @get(
        operation_id="GetICP",
        name="icp:get",
        summary="Retrieve the details of an ICP.",
        path=urls.ICP_DETAIL,
    )
    async def get_icp(
        self,
        icp_service: ICPService,
        current_user: UserModel,
        icp_id: Annotated[
            UUID,
            Parameter(
                title="ICP ID",
                description="The ICP to retrieve.",
            ),
        ],
    ) -> ICP:
        """Get details about a comapny."""
        db_obj = await icp_service.get_icp(icp_id=icp_id, tenant_id=current_user.tenant_id)
        return icp_service.to_schema(schema_type=ICP, data=db_obj)

    @post(
        operation_id="CreateICP",
        name="icp:create",
        summary="Create a new ICP.",
        path=urls.ICP_CREATE,
    )
    async def create_icp(
        self,
        icp_service: ICPService,
        current_user: UserModel,
        data: ICPCreate,
    ) -> ICP:
        """Create a new ICP."""
        obj = data.to_dict()
        db_obj = await icp_service.create(obj)
        return icp_service.to_schema(schema_type=ICP, data=db_obj)

    @put(
        operation_id="UpdateICP",
        name="icp:update",
        summary="Update a new ICP.",
        path=urls.ICP_UPDATE,
    )
    async def update_icp(
        self,
        icp_service: ICPService,
        current_user: UserModel,
        data: ICPUpdate,
        icp_id: Annotated[
            UUID,
            Parameter(
                title="ICP ID",
                description="The ICP to update.",
            ),
        ],
    ) -> ICP:
        """Update an ICP."""
        obj = data.to_dict()
        icp = await icp_service.get_icp(icp_id=icp_id, tenant_id=current_user.tenant_id)
        if not icp:
            error_msg = "ICP does not exist"
            raise ValidationException(error_msg)

        if icp.tenant_id != current_user.tenant_id:
            error_msg = "ICP does not exist"
            raise ValidationException(error_msg)

        db_obj = await icp_service.update(obj, item_id=icp.id)
        return icp_service.to_schema(schema_type=ICP, data=db_obj)
