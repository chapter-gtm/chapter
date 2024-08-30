"""Job Post Controllers."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from litestar import Controller, delete, get, patch, post
from litestar.di import Provide

from app.config import constants
from app.lib.schema import Location, Tool
from app.lib.scraperapi import extract_url_content
from app.db.models import User as UserModel
from app.domain.accounts.guards import requires_active_user
from app.domain.companies.dependencies import provide_companies_service
from app.domain.companies.schemas import CompanyCreate
from app.domain.companies.services import CompanyService
from app.domain.jobs import urls
from app.domain.jobs.dependencies import provide_job_posts_service
from app.domain.jobs.schemas import JobPost, JobPostCreate, JobPostCreateFromURL, JobPostUpdate
from app.domain.jobs.services import JobPostService
from app.domain.jobs.utils import extract_job_details_from_html

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes


class JobPostController(Controller):
    """JobPost operations."""

    tags = ["Job Posts"]
    dependencies = {
        "companies_service": Provide(provide_companies_service),
        "job_posts_service": Provide(provide_job_posts_service),
    }
    guards = [requires_active_user]
    signature_namespace = {
        "JobPostService": JobPostService,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="ListJobPosts",
        name="jobs:list-post",
        summary="List Job Posts",
        path=urls.JOBS_LIST,
    )
    async def list_job_posts(
        self,
        job_posts_service: JobPostService,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[JobPost]:
        """List job_posts that your account can access.."""
        results, total = await job_posts_service.get_job_posts(*filters)
        return job_posts_service.to_schema(data=results, total=total, schema_type=JobPost, filters=filters)

    @post(
        operation_id="CreateJobPost",
        name="jobs:create-post",
        summary="Create a new job post.",
        path=urls.JOBS_CREATE,
    )
    async def create_job_post(
        self,
        job_posts_service: JobPostService,
        data: JobPostCreate,
    ) -> JobPostCreate:
        """Create a new job post."""
        obj = data.to_dict()
        db_obj = await job_posts_service.create(obj)
        return job_posts_service.to_schema(schema_type=JobPost, data=db_obj)

    @post(
        operation_id="CreateJobPostFromURL",
        name="jobs:create-post-from-url",
        summary="Create a new job post from URL.",
        path=urls.JOBS_CREATE_FROM_URL,
    )
    async def create_job_post_from_url(
        self,
        companies_service: CompanyService,
        job_posts_service: JobPostService,
        data: JobPostCreateFromURL,
    ) -> JobPostCreate:
        """Create a new job post."""
        html_content = await extract_url_content(data.url)
        job_details = await extract_job_details_from_html(html_content)
        job_post = JobPostCreate(
            title=job_details.get("title"),
            location=Location(
                country=job_details.get("location", {}).get("country"),
                region=job_details.get("location", {}).get("region"),
                city=job_details.get("location", {}).get("city"),
            ),
            tools=[
                Tool(name=tool["name"], certainty=tool.get("certainty", "Low"))
                for tool in job_details.get("tools", [])
                if tool.get("name")
            ],
        )
        company = CompanyCreate(
            name=job_details.get("company", {}).get("name"),
            url=job_details.get("company", {}).get("url"),
            linkedin_profile_url=job_details.get("company", {}).get("linkedin_url"),
        )
        company_db_obj = await companies_service.create(company.to_dict())
        job_post.company_id = company_db_obj.id

        db_obj = await job_posts_service.create(job_post.to_dict())
        return job_posts_service.to_schema(schema_type=JobPost, data=db_obj)

    @get(
        operation_id="GetJobPost",
        name="jobs:get-post",
        summary="Retrieve the details of a job post.",
        path=urls.JOBS_DETAIL,
    )
    async def get_job_post(
        self,
        job_posts_service: JobPostService,
        job_post_id: Annotated[
            UUID,
            Parameter(
                title="JobPost ID",
                description="The job_post to retrieve.",
            ),
        ],
    ) -> JobPost:
        """Get details about a job post."""
        db_obj = await job_posts_service.get(job_post_id)
        return job_posts_service.to_schema(schema_type=JobPost, data=db_obj)

    @patch(
        operation_id="UpdateJobPost",
        name="jobs:update-post",
        path=urls.JOBS_UPDATE,
    )
    async def update_job_post(
        self,
        data: JobPostUpdate,
        job_posts_service: JobPostService,
        job_post_id: Annotated[
            UUID,
            Parameter(
                title="JobPost ID",
                description="The job_post to update.",
            ),
        ],
    ) -> JobPost:
        """Update a job post."""
        db_obj = await job_posts_service.update(
            item_id=job_post_id,
            data=data.to_dict(),
        )
        return job_posts_service.to_schema(schema_type=JobPost, data=db_obj)

    @delete(
        operation_id="DeleteJobPost",
        name="jobs:delete-post",
        summary="Remove JobPost",
        path=urls.JOBS_DELETE,
    )
    async def delete_job_post(
        self,
        job_posts_service: JobPostService,
        job_post_id: Annotated[
            UUID,
            Parameter(title="JobPost ID", description="The job_post to delete."),
        ],
    ) -> None:
        """Delete a job_post."""
        _ = await job_posts_service.delete(job_post_id)
