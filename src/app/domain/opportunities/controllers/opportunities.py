"""Opportunity Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, delete, get, patch, post
from litestar.di import Provide
from litestar.exceptions import ValidationException

from app.config import constants
from app.lib.utils import get_logo_dev_link
from app.db.models import User as UserModel
from app.domain.accounts.guards import requires_active_user
from app.domain.accounts.dependencies import provide_users_service
from app.domain.accounts.services import UserService
from app.domain.opportunities import urls
from app.domain.opportunities.dependencies import provide_opportunities_service, provide_opportunities_audit_log_service
from app.domain.opportunities.schemas import Opportunity, OpportunityCreate, OpportunityUpdate
from app.domain.opportunities.services import OpportunityService, OpportunityAuditLogService

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes


class OpportunityController(Controller):
    """Opportunity operations."""

    tags = ["Opportunities"]
    dependencies = {
        "opportunities_service": Provide(provide_opportunities_service),
        "opportunities_audit_log_service": Provide(provide_opportunities_audit_log_service),
        "users_service": Provide(provide_users_service),
    }
    guards = [requires_active_user]
    signature_namespace = {
        "OpportunityService": OpportunityService,
        "UserModel": UserModel,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="ListOpportunities",
        name="opportunities:list",
        summary="List Opportunities",
        path=urls.OPPORTUNITY_LIST,
    )
    async def list_opportunities(
        self,
        opportunities_service: OpportunityService,
        current_user: UserModel,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[Opportunity]:
        """List opportunities that your account can access.."""
        results, total = await opportunities_service.get_opportunities(*filters, tenant_id=current_user.tenant_id)
        paginated_response = opportunities_service.to_schema(
            data=results, total=total, schema_type=Opportunity, filters=filters
        )

        # Workaround due to https://github.com/jcrist/msgspec/issues/673
        for opportunity in paginated_response.items:
            if opportunity.company and opportunity.company.url:
                opportunity.company.profile_pic_url = get_logo_dev_link(opportunity.company.url)

        return paginated_response

    @post(
        operation_id="CreateOpportunity",
        name="opportunities:create",
        summary="Create a new opportunity.",
        path=urls.OPPORTUNITY_CREATE,
    )
    async def create_opportunity(
        self,
        opportunities_service: OpportunityService,
        opportunities_audit_log_service: OpportunityAuditLogService,
        users_service: UserService,
        current_user: UserModel,
        data: OpportunityCreate,
    ) -> OpportunityCreate:
        """Create a new opportunity."""
        obj = data.to_dict()

        # Verify is the owner exists in this tenant
        owner_id = obj.get("owner_id")
        if owner_id:
            db_obj = await users_service.get_user(owner_id, tenant_id=current_user.tenant_id)
            if not db_obj:
                raise ValidationException("Owner does not exist")

        obj["tenant_id"] = current_user.tenant_id
        db_obj = await opportunities_service.create(obj)

        await opportunities_audit_log_service.create(
            {
                "operation": "create",
                "diff": {"new": obj},
                "user_id": current_user.id,
                "tenant_id": current_user.tenant_id,
                "opportunity_id": db_obj.id,
            }
        )

        return opportunities_service.to_schema(schema_type=Opportunity, data=db_obj)

    @get(
        operation_id="GetOpportunity",
        name="opportunities:get",
        summary="Retrieve the details of a opportunity.",
        path=urls.OPPORTUNITY_DETAIL,
    )
    async def get_opportunity(
        self,
        opportunities_service: OpportunityService,
        current_user: UserModel,
        opportunity_id: Annotated[
            UUID,
            Parameter(
                title="Opportunity ID",
                description="The opportunity to retrieve.",
            ),
        ],
    ) -> Opportunity:
        """Get details about a comapny."""
        db_obj = await opportunities_service.get_opportunity(opportunity_id, tenant_id=current_user.tenant_id)
        opportunity = opportunities_service.to_schema(schema_type=Opportunity, data=db_obj)

        # Workaround due to https://github.com/jcrist/msgspec/issues/673
        if opportunity.company and opportunity.company.url:
            opportunity.company.profile_pic_url = get_logo_dev_link(opportunity.company.url)

        return opportunity

    @patch(
        operation_id="UpdateOpportunity",
        name="opportunities:update",
        path=urls.OPPORTUNITY_UPDATE,
    )
    async def update_opportunity(
        self,
        data: OpportunityUpdate,
        opportunities_service: OpportunityService,
        opportunities_audit_log_service: OpportunityAuditLogService,
        users_service: UserService,
        current_user: UserModel,
        opportunity_id: Annotated[
            UUID,
            Parameter(
                title="Opportunity ID",
                description="The opportunity to update.",
            ),
        ],
    ) -> Opportunity:
        """Update a opportunity."""
        obj = data.to_dict()

        # Verify is the owner exists for in tenant
        owner_id = obj.get("owner_id")
        if owner_id:
            db_obj = await users_service.get_user(owner_id, tenant_id=current_user.tenant_id)
            if not db_obj:
                raise ValidationException("Owner does not exist")

        # Verify if the user is part of the same tenant as the opportunity
        opportunity = await opportunities_service.get_opportunity(opportunity_id, tenant_id=current_user.tenant_id)
        if not opportunity:
            raise ValidationException("Opportunity does not exist")

        if opportunity.tenant_id != current_user.tenant_id:
            raise ValidationException("Opportunity does not exist")

        db_obj = await opportunities_service.update(
            item_id=opportunity_id,
            data=obj,
        )

        await opportunities_audit_log_service.create(
            {
                "operation": "update",
                "diff": {"new": obj},
                "user_id": current_user.id,
                "tenant_id": current_user.tenant_id,
                "opportunity_id": db_obj.id,
            }
        )

        return opportunities_service.to_schema(schema_type=Opportunity, data=db_obj)

    @delete(
        operation_id="DeleteOpportunity",
        name="opportunities:delete",
        summary="Remove Opportunity",
        path=urls.OPPORTUNITY_DELETE,
    )
    async def delete_opportunity(
        self,
        opportunities_service: OpportunityService,
        current_user: UserModel,
        opportunity_id: Annotated[
            UUID,
            Parameter(title="Opportunity ID", description="The opportunity to delete."),
        ],
    ) -> None:
        """Delete a opportunity."""
        _ = await opportunities_service.delete(opportunity_id)
