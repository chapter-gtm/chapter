"""Person Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, delete, get, patch, post
from litestar.di import Provide

from app.config import constants
from app.domain.accounts.guards import requires_active_user
from app.domain.people import urls
from app.domain.people.dependencies import provide_persons_service
from app.domain.people.schemas import Person, PersonCreate, PersonUpdate
from app.domain.people.services import PersonService

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes


class PersonController(Controller):
    """Person operations."""

    tags = ["Persons"]
    dependencies = {"persons_service": Provide(provide_persons_service)}
    guards = [requires_active_user]
    signature_namespace = {
        "PersonService": PersonService,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="ListPersons",
        name="persons:list",
        summary="List Persons",
        path=urls.PERSON_LIST,
    )
    async def list_persons(
        self,
        persons_service: PersonService,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[Person]:
        """List persons that your account can access.."""
        results, total = await persons_service.list_and_count(*filters)
        return persons_service.to_schema(data=results, total=total, schema_type=Person, filters=filters)

    @post(
        operation_id="CreatePerson",
        name="persons:create",
        summary="Create a new person.",
        path=urls.PERSON_CREATE,
    )
    async def create_person(
        self,
        persons_service: PersonService,
        data: PersonCreate,
    ) -> PersonCreate:
        """Create a new person."""
        obj = data.to_dict()
        db_obj = await persons_service.create(obj)
        return persons_service.to_schema(schema_type=Person, data=db_obj)

    @get(
        operation_id="GetPerson",
        name="persons:get",
        summary="Retrieve the details of a person.",
        path=urls.PERSON_DETAIL,
    )
    async def get_person(
        self,
        persons_service: PersonService,
        person_id: Annotated[
            UUID,
            Parameter(
                title="Person ID",
                description="The person to retrieve.",
            ),
        ],
    ) -> Person:
        """Get details about a comapny."""
        db_obj = await persons_service.get(person_id)
        return persons_service.to_schema(schema_type=Person, data=db_obj)

    @patch(
        operation_id="UpdatePerson",
        name="persons:update",
        path=urls.PERSON_UPDATE,
    )
    async def update_person(
        self,
        data: PersonUpdate,
        persons_service: PersonService,
        person_id: Annotated[
            UUID,
            Parameter(
                title="Person ID",
                description="The person to update.",
            ),
        ],
    ) -> Person:
        """Update a person."""
        db_obj = await persons_service.update(
            item_id=person_id,
            data=data.to_dict(),
        )
        return persons_service.to_schema(schema_type=Person, data=db_obj)

    @delete(
        operation_id="DeletePerson",
        name="persons:delete",
        summary="Remove Person",
        path=urls.PERSON_DELETE,
    )
    async def delete_person(
        self,
        persons_service: PersonService,
        person_id: Annotated[
            UUID,
            Parameter(title="Person ID", description="The person to delete."),
        ],
    ) -> None:
        """Delete a person."""
        _ = await persons_service.delete(person_id)
