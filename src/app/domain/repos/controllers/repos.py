"""Repo Controllers."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING, Annotated

import structlog
from advanced_alchemy.exceptions import IntegrityError
from litestar import Controller, get, post
from litestar.di import Provide

from app.domain.accounts.guards import requires_active_user
from app.domain.companies.dependencies import provide_companies_service
from app.domain.companies.schemas import CompanyCreate
from app.domain.companies.services import CompanyService  # noqa: TCH001
from app.domain.repos import urls
from app.domain.repos.dependencies import provide_repos_service
from app.domain.repos.schemas import (
    Repo,
    RepoCreate,
    RepoCreateFromSearchCriteria,
)
from app.domain.repos.services import RepoService
from app.lib.github import search_repos
from app.lib.utils import get_domain

if TYPE_CHECKING:
    from uuid import UUID

    from advanced_alchemy.service.pagination import OffsetPagination
    from litestar.params import Dependency, Parameter

    from app.lib.dependencies import FilterTypes


logger = structlog.get_logger()


class RepoController(Controller):
    """Repo operations."""

    tags = ["Repos"]
    dependencies = {
        "companies_service": Provide(provide_companies_service),
        "repos_service": Provide(provide_repos_service),
    }
    guards = [requires_active_user]
    signature_namespace = {
        "RepoService": RepoService,
    }
    dto = None
    return_dto = None

    @get(
        operation_id="ListRepos",
        name="repos:list",
        summary="List Repos",
        path=urls.REPO_LIST,
    )
    async def list_repos(
        self,
        repos_service: RepoService,
        filters: Annotated[list[FilterTypes], Dependency(skip_validation=True)],
    ) -> OffsetPagination[Repo]:
        """List repos that your account can access.."""
        results, total = await repos_service.list_and_count(*filters)
        return repos_service.to_schema(
            data=results,
            total=total,
            schema_type=Repo,
            filters=filters,
        )

    @post(
        operation_id="CreateReposFromSearchCriteria",
        name="repos:create-repos-from-search-criteria",
        summary="Create new repos from search criteria.",
        path=urls.REPO_CREATE_FROM_SEARCH_CRITERIA,
    )
    async def create_repos_from_search_criteria(
        self,
        companies_service: CompanyService,
        repos_service: RepoService,
        data: RepoCreateFromSearchCriteria,
    ) -> OffsetPagination[Repo]:
        """Create a new repo."""
        # Extract repo from URL
        repos_to_be_added = []
        repos = await search_repos(data.query, data.sort, data.order, data.page, data.per_page)

        for repo in repos:
            try:
                if not repo.get("homepage"):
                    error_msg = "Cannot determine company url from repo"
                    await logger.awarn(error_msg, repo=repo)

                # Add or update company
                company = CompanyCreate(
                    name=get_domain(repo["homepage"]),
                    url=repo["homepage"],
                )
                company_db_obj = await companies_service.create(company.to_dict())

                # Add repo
                repos_to_be_added.append(
                    RepoCreate(
                        name=repo["name"],
                        description=repo.get("description"),
                        url=repo["url"],
                        html_url=repo["html_url"],
                        language=repo["language"],
                        search_query=data.query,
                        company_id=company_db_obj.id,
                    ).to_dict(),
                )
            except (ValueError, IntegrityError) as e:
                error_msg = "Failed to find company or add repo"
                await logger.awarn(error_msg, repo=repo, exc_info=e)

        # Need to add created_at and updated_at for the advanced alchemy upsert to work
        for repo in repos_to_be_added:
            repo["created_at"] = datetime.now(UTC)
            repo["updated_at"] = datetime.now(UTC)

        repos_added = await repos_service.upsert_many(repos_to_be_added, match_fields=["url", "html_url"])
        return repos_service.to_schema(data=repos_added, total=len(repos_added), schema_type=Repo)

    @get(
        operation_id="GetRepo",
        name="repos:get-repo",
        summary="Retrieve the details of a repo.",
        path=urls.REPO_DETAIL,
    )
    async def get_repo(
        self,
        repos_service: RepoService,
        repo_id: Annotated[
            UUID,
            Parameter(
                title="Repo ID",
                description="The repo to retrieve.",
            ),
        ],
    ) -> Repo:
        """Get details about a repo."""
        db_obj = await repos_service.get(repo_id)
        return repos_service.to_schema(schema_type=Repo, data=db_obj)
