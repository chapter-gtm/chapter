"""Person Controllers."""

from __future__ import annotations

import contextlib
from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING, Annotated

import structlog
from advanced_alchemy.filters import LimitOffset, SearchFilter
from litestar import Controller, delete, get, patch, post
from litestar.di import Provide
from litestar.exceptions import HTTPException

from app.domain.accounts.guards import requires_active_user
from app.domain.companies.dependencies import provide_companies_service
from app.domain.companies.schemas import CompanyCreate
from app.domain.companies.services import CompanyService  # noqa: TCH001
from app.domain.people import urls
from app.domain.people.dependencies import provide_persons_service
from app.domain.people.schemas import Person, PersonCreate, PersonCreateFromURL, PersonUpdate
from app.domain.people.services import PersonService
from app.lib.pdl import get_person_details
from app.lib.schema import Location, WorkExperience
from app.lib.utils import get_domain, get_domain_from_email

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes

logger = structlog.get_logger()


class PersonController(Controller):
    """Person operations."""

    tags = ["Persons"]
    dependencies = {
        "companies_service": Provide(provide_companies_service),
        "persons_service": Provide(provide_persons_service),
    }
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
    ) -> Person:
        """Create a new person."""
        obj = data.to_dict()
        db_obj = await persons_service.create(obj)
        return persons_service.to_schema(schema_type=Person, data=db_obj)

    @post(
        operation_id="CreatePersonFromURL",
        name="persons:create-from-url",
        summary="Create a new person from URL.",
        path=urls.PERSON_CREATE_FROM_URL,
    )
    async def create_person_from_url(
        self,
        companies_service: CompanyService,
        persons_service: PersonService,
        data: PersonCreateFromURL,
    ) -> Person:
        """Create a new person from URL."""
        # Check if person already exists in the database
        filters = [
            SearchFilter(field_name="linkedin_profile_url", value=data.url.rstrip("/"), ignore_case=True),
            LimitOffset(limit=1, offset=0),
        ]
        results, count = await persons_service.list_and_count(*filters)

        now = datetime.now(UTC)
        four_weeks_ago = now - timedelta(weeks=4)

        if count > 0 and results[0].updated_at > four_weeks_ago:
            await logger.ainfo("Person already exists and is up-to-date", person=results[0])
            return persons_service.to_schema(schema_type=Person, data=results[0])

        # Extract person from data provider
        person_details = None
        try:
            person_details = await get_person_details(data.url)
        except Exception as e:
            error_msg = "Error extracting person details"
            logger.aerror(error_msg, exc_info=e)
            raise HTTPException(status_code=500, detail="An unexpected error occurred.") from e

        linkedin_profile_url = None
        twitter_profile_url = None
        github_profile_url = None
        birth_date = None
        work_email = None
        person_company_name = str(person_details.get("job_company_name", ""))
        person_company_url = str(person_details.get("job_company_website", ""))
        person_company_linkedin_url = str(person_details.get("job_company_linkedin_url"))

        if not person_company_name and not person_company_url and not person_company_linkedin_url:
            error_msg = "Company not found in person details"
            await logger.aerror(error_msg, person_details=person_details)
            raise ValueError(error_msg)

        if person_details.get("linkedin_url"):
            linkedin_profile_url = "https://" + person_details.get("linkedin_url", "").rstrip("/")
        if person_details.get("twitter_url"):
            twitter_profile_url = "https://" + person_details.get("twitter_url", "").rstrip("/")
        if person_details.get("github_url"):
            github_profile_url = "https://" + person_details.get("github_url", "").rstrip("/")

        with contextlib.suppress(Exception):
            birth_date = datetime.strptime(person_details.get("birth_date", ""), "%Y-%m-%d").replace(tzinfo=UTC).date()

        # Add or update company
        company = CompanyCreate(
            name=person_company_name,
            url=person_company_url,
            linkedin_profile_url=person_company_linkedin_url,
        )
        company_db_obj = await companies_service.create(company.to_dict())

        if company_db_obj.url and get_domain_from_email(person_details.get("work_email", "")) == get_domain(
            company_db_obj.url,
        ):
            work_email = person_details.get("work_email")

        work_experiences = []
        for work_ex in person_details.get("experience", []):
            with contextlib.suppress(Exception):
                work_experiences.append(
                    WorkExperience(
                        starts_at=datetime.strptime(work_ex.get("start_date"), "%Y-%m").replace(tzinfo=UTC).date(),
                        title=work_ex.get("title", {}).get("name", "Unknown"),
                        company_name=work_ex.get("company", {}).get("name", "Unknown"),
                        company_url=work_ex.get("company", {}).get("website"),
                        company_linkedin_profile_url=work_ex.get("linkedin_url"),
                        ends_at=datetime.strptime(work_ex.get("end_date"), "%Y-%m").replace(tzinfo=UTC).date()
                        if work_ex.get("end_date")
                        else None,
                    ),
                )

        # Add person
        # TODO: Move this code into a provider specific code
        obj = PersonCreate(
            first_name=person_details.get("first_name"),
            last_name=person_details.get("last_name"),
            full_name=person_details.get("full_name"),
            headline=person_details.get("headline") or person_details.get("summary"),
            title=person_details.get("job_title"),
            summary=person_details.get("job_summary"),
            occupation=person_details.get("job_title_role"),
            industry=person_details.get("industry"),
            linkedin_profile_url=linkedin_profile_url,
            twitter_profile_url=twitter_profile_url,
            github_profile_url=github_profile_url,
            location=Location(
                country=person_details.get("location_country"),
                region=person_details.get("location_region"),
                city=person_details.get("location_locality"),
            ),
            personal_emails=person_details.get("personal_emails", []),
            work_email=work_email,
            phone_numbers=person_details.get("phone_numbers", []),
            birth_date=birth_date,
            work_experiences=work_experiences,
            skills=person_details.get("skills"),
            company_id=str(company_db_obj.id),
        )
        db_obj = await persons_service.upsert(obj.to_dict(), item_id=results[0].id if count > 0 else None)
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
