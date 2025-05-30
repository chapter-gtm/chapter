"""Job Post Controllers."""

from __future__ import annotations

import os
from typing import TYPE_CHECKING, Annotated

import boto3
import structlog
from advanced_alchemy.filters import LimitOffset, SearchFilter
from litestar import Controller, MediaType, delete, get, patch, post, put
from litestar.datastructures import UploadFile  # noqa: TCH002
from litestar.di import Provide
from litestar.enums import RequestEncodingType  # noqa: TCH002
from litestar.exceptions import NotFoundException
from litestar.params import Body  # noqa: TCH002
from litestar.response import Response

from app.domain.accounts.guards import requires_active_user
from app.domain.companies.dependencies import provide_companies_service
from app.domain.companies.schemas import CompanyCreate
from app.domain.companies.services import CompanyService  # noqa: TCH001
from app.domain.jobs import urls
from app.domain.jobs.dependencies import provide_job_posts_service
from app.domain.jobs.schemas import JobPost, JobPostCreate, JobPostCreateFromURL, JobPostUpdate
from app.domain.jobs.services import JobPostService
from app.domain.jobs.utils import extract_job_details_from_html
from app.lib.pdfshift import get_pdf
from app.lib.schema import Location, Process, Tool
from app.lib.scraperapi import extract_url_content
from app.lib.utils import get_domain

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes

logger = structlog.get_logger()
app_s3_bucket_name = os.environ["APP_S3_BUCKET_NAME"]


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
    ) -> JobPost:
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
    ) -> JobPost:
        """Create a new job post."""
        # Check if job post already exists in the database
        filters = [
            SearchFilter(field_name="url", value=data.url.rstrip("/"), ignore_case=True),
            LimitOffset(limit=1, offset=0),
        ]
        results, count = await job_posts_service.list_and_count(*filters)

        if count > 0:
            jp = job_posts_service.to_schema(schema_type=JobPost, data=results[0])
            await logger.ainfo("Job post already exists", job_post=jp)
            return jp

        # Extract job post from URL
        render = False

        # Some ur;s require a rendering javascript(done using headless browser)
        job_link_domain = get_domain(data.url)
        if job_link_domain.endswith(("workable.com", "linkedin.com")):
            render = True

        html_content = await extract_url_content(data.url, render=render, timeout=data.timeout)
        job_details = await extract_job_details_from_html(html_content)

        company_url = job_details.get("company", {}).get("url")
        company_linkedin_url = job_details.get("company", {}).get("linkedin_url")

        if not company_url and not company_linkedin_url:
            error_msg = "Cannot determine company url or company linkedin url from job post"
            raise ValueError(error_msg)

        # Add or update company
        company = CompanyCreate(
            name=job_details.get("company", {}).get("name"),
            url=company_url,
            linkedin_profile_url=company_linkedin_url,
        )
        company_db_obj = await companies_service.create(company.to_dict())

        # Add job post
        job_post = JobPostCreate(
            title=job_details.get("title", "Engineer"),
            body=html_content,
            url=data.url.rstrip("/"),
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
            processes=[
                Process(name=process["name"]) for process in job_details.get("processes", []) if process.get("name")
            ],
            team_name=job_details.get("team_name"),
            company_id=str(company_db_obj.id),
        )
        db_obj = await job_posts_service.create(job_post.to_dict())

        # Generate pdf and save to s3
        if db_obj.url:
            pdf_content = await get_pdf(db_obj.url)
            if pdf_content:
                s3_client = boto3.client("s3")
                s3_client.put_object(Bucket=app_s3_bucket_name, Key=f"job_posts/{db_obj.id}.pdf", Body=pdf_content)
            else:
                error_msg = "Couldn't get pdf for a job post"
                await logger.awarn(
                    error_msg,
                    job_id=db_obj.id,
                    job_title=db_obj.title,
                    company_id=company_db_obj.id,
                    company_name=company_db_obj.name,
                    company_url=company_db_obj.url,
                )

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

    @get(
        operation_id="GetJobPostPDF",
        name="jobs:get-post-pdf",
        summary="Retrieve the job post pdf.",
        path=urls.JOBS_PDF,
    )
    async def get_job_post_pdf(
        self,
        job_post_id: Annotated[
            UUID,
            Parameter(
                title="JobPost ID",
                description="The job_post to retrieve.",
            ),
        ],
    ) -> Response:
        """Get job post pdf."""
        try:
            # Retrieve the file from S3
            s3_client = boto3.client("s3")
            file_object = s3_client.get_object(Bucket=app_s3_bucket_name, Key=f"job_posts/{job_post_id}.pdf")

            # Extract the file content and metadata
            file_content = file_object["Body"].read()
            content_type = "application/pdf"

            return Response(
                media_type=content_type,
                content=file_content,
                headers={
                    "Content-Disposition": f"attachment; filename={job_post_id}.pdf",
                    "Content-Type": content_type,
                },
            )
        except s3_client.exceptions.NoSuchKey as e:
            raise NotFoundException(detail="Job post PDF not found.") from e

    @put(
        operation_id="UpdateJobPostAddPDF",
        name="jobs:update-post-add-pdf",
        summary="Add PDF to a job post.",
        path=urls.JOBS_UPDATE_ADD_PDF,
        media_type=MediaType.TEXT,
    )
    async def add_job_post_pdf(
        self,
        data: Annotated[UploadFile, Body(media_type=RequestEncodingType.MULTI_PART)],
        job_posts_service: JobPostService,
        job_post_id: Annotated[
            UUID,
            Parameter(
                title="JobPost ID",
                description="The job_post to update.",
            ),
        ],
    ) -> None:
        """Update job post with pdf."""
        file_content = await data.read()

        await job_posts_service.get(job_post_id)

        # Upload the file to S3
        s3_client = boto3.client("s3")
        s3_client.put_object(Bucket=app_s3_bucket_name, Key=f"job_posts/{job_post_id}.pdf", Body=file_content)

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
