"""GitHub APIs."""
from datetime import UTC, datetime, timedelta
from typing import Any

import httpx
import structlog

logger = structlog.get_logger()


async def search_repos(
    query: str,
    sort: str = "stars",
    order: str = "desc",
    page: int = 1,
    per_page: int = 30,
) -> list[dict[str, Any]]:
    """Search github repos by query"""
    url = "https://api.github.com/search/repositories"
    params = {"q": query, "sort": sort, "order": order, "page": str(page), "per_page": str(per_page)}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        repos_data = response.json()
        repos = []
        for repo in repos_data["items"]:
            try:
                # Skip repos from non orgs
                if repo["owner"]["type"] != "Organization":
                    continue

                now = datetime.now(UTC)
                n_weeks_ago = now - timedelta(weeks=4)
                updated_at = datetime.fromisoformat(repo["updated_at"])
                pushed_at = datetime.fromisoformat(repo["pushed_at"])

                # Skip repos without recent activity
                if pushed_at < n_weeks_ago and updated_at < n_weeks_ago:
                    continue

                homepage = repo["homepage"]
                if not homepage:
                    resp = await client.get(repo["owner"]["url"])
                    org_data = resp.json()
                    homepage = org_data["blog"]

                repos.append(
                    {
                        "name": repo["name"],
                        "description": repo["description"],
                        "html_url": repo["html_url"],
                        "url": repo["url"],
                        "homepage": homepage,
                        "language": repo["language"],
                    },
                )
                repo["created_at"] = datetime.fromisoformat(repo["created_at"])
                repo["last_pushed_at"] = datetime.fromisoformat(repo["pushed_at"])
                repo["last_updated_at"] = datetime.fromisoformat(repo["updated_at"])
            except (KeyError, TypeError, IndexError):
                error_msg = "Failed to parse repo data. Repo."
                await logger.awarn(error_msg, repo=repo, query=query)

        return repos
