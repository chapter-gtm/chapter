import os
import json
import httpx
import structlog
from typing import Any


logger = structlog.get_logger()
pdl_api_key = os.environ["PDL_API_KEY"]


async def get_company_details(url: str = None, social_url: str = None) -> dict[str, Any]:
    """Get company details."""
    if not url and not social_url:
        raise Exception("Either url or social_url is required")

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "X-API-Key": pdl_api_key,
    }
    params = {"titlecase": "true"}

    if url:
        params["website"] = url

    if social_url:
        params["profile"] = social_url

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.peopledatalabs.com/v5/company/enrich", headers=headers, params=params)
        data = response.json()
        if response.status_code != 200 or not data:
            await logger.awarn(
                "Company not found.", status=response.status_code, response=data, url=url, social_url=social_url
            )
            raise Exception("Company not found.")
        return data


async def get_person_details(social_url: str) -> dict[str, Any]:
    """Get person details."""
    if not social_url:
        raise Exception("social_url is required")

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "X-API-Key": pdl_api_key,
    }
    params = {"titlecase": "true", "profile": social_url}

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.peopledatalabs.com/v5/person/enrich", headers=headers, params=params)
        data = response.json()
        if not data.get("data"):
            await logger.awarn("Person not found.", response=data, social_url=social_url)
            raise Exception("Person not found.")
        return data.get("data")


async def search_person_details(
    company_url: str,
    levels: list[str] = None,
    titles: list[str] = None,
    sub_roles: list[str] = None,
    org_name: str = "engineering",
    limit: int = 5,
) -> list[dict[str, Any]]:
    """Get relevant persons."""
    if not company_url:
        raise Exception("company_url is required")

    if not levels:
        levels = ["cxo", "director", "vp"]

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "X-API-Key": pdl_api_key,
    }

    search_criteria = {
        "bool": {
            "must": [
                {"term": {"job_company_website": company_url}},
                {"term": {"job_title_role": org_name}},
            ]
        }
    }

    role_criteria = {
        "bool": {"should": [{"bool": {"should": [{"term": {"job_title_levels": level}} for level in levels]}}]}
    }

    if titles:
        role_criteria["bool"]["should"].append(
            {
                "bool": {
                    "must": [
                        {"bool": {"should": [{"term": {"job_title": title}} for title in titles]}},
                        {"term": {"job_title_levels": "senior"}},
                    ]
                }
            }
        )

    if sub_roles:
        role_criteria["bool"]["should"].append(
            {
                "bool": {
                    "must": [
                        {"bool": {"should": [{"term": {"job_title_sub_role": sub_role}} for sub_role in sub_roles]}},
                        {"term": {"job_title_levels": "senior"}},
                    ]
                }
            }
        )

    search_criteria["bool"]["must"].append(role_criteria)

    params = {"query": json.dumps(search_criteria), "size": limit, "titlecase": "true"}
    await logger.ainfo("Searching relevant people", company_url=company_url, search_criteria=search_criteria)

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.peopledatalabs.com/v5/person/search", headers=headers, params=params)
        data = response.json()
        if not data.get("data"):
            await logger.awarn("Person not found.", response=data, company_url=company_url)
            raise Exception("Person not found.")
        return data.get("data")
