"""Company Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, delete, get, patch, post
from litestar.di import Provide

from app.config import constants
from app.domain.accounts.guards import requires_active_user
from app.domain.companies import urls
from app.domain.companies.dependencies import provide_companies_service
from app.domain.companies.schemas import Company, CompanyCreate, CompanyUpdate
from app.domain.companies.services import CompanyService

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes


class CompanyController(Controller):
    """Company operations."""

    tags = ["Companies"]
    dependencies = {"companies_service": Provide(provide_companies_service)}
    guards = [requires_active_user]
    signature_namespace = {
        "CompanyService": CompanyService,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="ListCompanies",
        name="companies:list",
        summary="List Companies",
        path=urls.COMPANY_LIST,
    )
    async def list_companies(
        self,
        companies_service: CompanyService,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[Company]:
        """List companies that your account can access.."""
        results, total = await companies_service.list_and_count(*filters)
        return companies_service.to_schema(data=results, total=total, schema_type=Company, filters=filters)

    @post(
        operation_id="CreateCompany",
        name="companies:create",
        summary="Create a new company.",
        path=urls.COMPANY_CREATE,
    )
    async def create_company(
        self,
        companies_service: CompanyService,
        data: CompanyCreate,
    ) -> CompanyCreate:
        """Create a new company."""
        obj = data.to_dict()
        db_obj = await companies_service.create(obj)
        return companies_service.to_schema(schema_type=Company, data=db_obj)

    @get(
        operation_id="GetCompany",
        name="companies:get",
        summary="Retrieve the details of a company.",
        path=urls.COMPANY_DETAIL,
    )
    async def get_company(
        self,
        companies_service: CompanyService,
        company_id: Annotated[
            UUID,
            Parameter(
                title="Company ID",
                description="The company to retrieve.",
            ),
        ],
    ) -> Company:
        """Get details about a comapny."""
        db_obj = await companies_service.get(company_id)
        # company = companies_service.to_schema(schema_type=Company, data=db_obj)
        # Workaround due to https://github.com/jcrist/msgspec/issues/673
        return Company.from_dict(db_obj.to_dict())

    @patch(
        operation_id="UpdateCompany",
        name="companies:update",
        path=urls.COMPANY_UPDATE,
    )
    async def update_company(
        self,
        data: CompanyUpdate,
        companies_service: CompanyService,
        company_id: Annotated[
            UUID,
            Parameter(
                title="Company ID",
                description="The company to update.",
            ),
        ],
    ) -> Company:
        """Update a company."""
        db_obj = await companies_service.update(
            item_id=company_id,
            data=data.to_dict(),
        )
        return companies_service.to_schema(schema_type=Company, data=db_obj)

    @delete(
        operation_id="DeleteCompany",
        name="companies:delete",
        summary="Remove Company",
        path=urls.COMPANY_DELETE,
    )
    async def delete_company(
        self,
        companies_service: CompanyService,
        company_id: Annotated[
            UUID,
            Parameter(title="Company ID", description="The company to delete."),
        ],
    ) -> None:
        """Delete a company."""
        _ = await companies_service.delete(company_id)
