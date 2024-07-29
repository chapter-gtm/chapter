"""Tenant Controllers."""

from __future__ import annotations

from typing import Annotated, TYPE_CHECKING

from advanced_alchemy.utils.text import slugify
from litestar import Controller, Request, Response, get, post, patch, delete
from litestar.di import Provide
from litestar.enums import RequestEncodingType
from litestar.params import Body
from litestar.security.jwt import OAuth2Login

from app.db.models import User as UserModel  # noqa: TCH001
from app.domain.accounts import urls
from app.domain.accounts.dependencies import provide_tenants_service
from app.domain.accounts.guards import auth, requires_active_user, requires_superuser
from app.domain.accounts.schemas import Tenant, TenantCreate, TenantUpdate
from app.domain.accounts.services import TenantService

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes


class TenantController(Controller):
    """Tenant operations."""

    tags = ["Tenant"]
    dependencies = {"tenants_service": Provide(provide_tenants_service)}
    guards = [requires_active_user]
    signature_namespace = {
        "TenantService": TenantService,
        "RequestEncodingType": RequestEncodingType,
        "Body": Body,
    }

    @post(
        operation_id="CreateTenant",
        name="tenant:create",
        path=urls.ACCOUNT_TENANT_CREATE,
        guards=[requires_superuser],
        cache=False,
        summary="Create Tenant",
        description="Create a new tenant.",
    )
    async def create_tenant(
        self,
        tenants_service: TenantService,
        data: TenantCreate,
    ) -> Tenant:
        """Create a new tenant."""
        obj = data.to_dict()
        db_obj = await tenants_service.create(obj)
        return tenants_service.to_schema(schema_type=Tenant, data=db_obj)


    @get(
        operation_id="GetTenant",
        name="tenant:get",
        summary="Retrieve the details of a tenant.",
        path=urls.ACCOUNT_TENANT_DETAIL,
    )
    async def get_tenant(
        self,
        tenants_service: TenantService,
        tenant_id: Annotated[
            UUID,
            Parameter(
                title="Tenant ID",
                description="The tenant to retrieve.",
            ),
        ],
    ) -> Tenant:
        """Get details about a tenant."""
        db_obj = await tenants_service.get(tenant_id)
        return tenants_service.to_schema(schema_type=Tenant, data=db_obj)

    @patch(
        operation_id="UpdateTenant",
        name="tenants:update",
        path=urls.ACCOUNT_TENANT_UPDATE,
        guards=[requires_superuser],
    )
    async def update_tenant(
        self,
        data: TenantUpdate,
        tenants_service: TenantService,
        tenant_id: Annotated[
            UUID,
            Parameter(
                title="Tenant ID",
                description="The tenant to update.",
            ),
        ],
    ) -> Tenant:
        """Update a tenant."""
        db_obj = await tenants_service.update(
            item_id=tenant_id,
            data=data.to_dict(),
        )
        return tenants_service.to_schema(schema_type=Tenant, data=db_obj)

    @delete(
        operation_id="DeleteTenant",
        name="tenants:delete",
        summary="Remove Tenant",
        path=urls.ACCOUNT_TENANT_DELETE,
        guards=[requires_superuser],
    )
    async def delete_tenant(
        self,
        tenants_service: TenantService,
        tenant_id: Annotated[
            UUID,
            Parameter(title="Tenant ID", description="The tenant to delete."),
        ],
    ) -> None:
        """Delete a tenant."""
        _ = await tenants_service.delete(tenant_id)
