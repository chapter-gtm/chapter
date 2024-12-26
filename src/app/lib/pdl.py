import json
import os
from typing import Any

import httpx
import structlog

logger = structlog.get_logger()
pdl_api_key = os.environ["PDL_API_KEY"]


async def get_company_details(url: str | None = None, social_url: str | None = None) -> dict[str, Any]:
    """Get company details."""
    if not url and not social_url:
        error_msg = "Either url or social_url is required"
        raise ValueError(error_msg)

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
            error_msg = "Company not found."
            await logger.awarn(
                error_msg,
                status=response.status_code,
                response=data,
                url=url,
                social_url=social_url,
            )
            raise LookupError(error_msg)
        return data if isinstance(data, dict) else {}


async def get_person_details(social_url: str) -> dict[str, Any]:
    """Get person details."""
    if not social_url:
        error_msg = "social_url is required"
        raise ValueError(error_msg)

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
            error_msg = "Person not found."
            await logger.awarn(error_msg, response=data, social_url=social_url)
            raise LookupError(error_msg)
        data = data.get("data")
        return data if isinstance(data, dict) else {}


async def search_person_details(
    company_url: str,
    levels: list[str] | None = None,
    titles: list[str] | None = None,
    sub_roles: list[str] | None = None,
    org_name: str = "engineering",
    limit: int = 5,
) -> list[dict[str, Any]]:
    """Get relevant persons."""
    if not company_url:
        error_msg = "company_url is required"
        raise LookupError(error_msg)

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
            ],
        },
    }

    role_criteria: dict[str, Any] = {
        "bool": {"should": [{"bool": {"should": [{"term": {"job_title_levels": level}} for level in levels]}}]},
    }

    if titles:
        role_criteria["bool"]["should"].append(
            {
                "bool": {
                    "must": [
                        {"bool": {"should": [{"term": {"job_title": title}} for title in titles]}},
                        {"term": {"job_title_levels": "senior"}},
                    ],
                },
            },
        )

    if sub_roles:
        role_criteria["bool"]["should"].append(
            {
                "bool": {
                    "must": [
                        {
                            "bool": {
                                "should": [{"term": {"job_title_sub_role": sub_role}} for sub_role in sub_roles],
                            },
                        },
                        {"term": {"job_title_levels": "senior"}},
                    ],
                },
            },
        )

    search_criteria["bool"]["must"].append(role_criteria)

    params: dict[str, str] = {"query": json.dumps(search_criteria), "size": str(limit), "titlecase": "true"}
    await logger.ainfo("Searching relevant people", company_url=company_url, search_criteria=search_criteria)

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.peopledatalabs.com/v5/person/search", headers=headers, params=params)
        data: dict[str, list[dict[str, Any]]] = response.json()
        if "data" not in data:
            error_msg = "Person not found."
            await logger.awarn(error_msg, response=data, company_url=company_url)
            raise LookupError(error_msg)
        return data.get("data", [])


async def get_org_size(
    company_url: str,
    org_name: str = "engineering",
) -> int:
    """Get org size."""
    if not company_url:
        error_msg = "company_url is required"
        raise LookupError(error_msg)

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "X-API-Key": pdl_api_key,
    }

    search_criteria = {
        "bool": {"must": [{"term": {"job_title_role": org_name}}, {"term": {"job_company_website": company_url}}]},
    }

    params: dict[str, str] = {"query": json.dumps(search_criteria), "size": str(1), "data_include": ""}
    await logger.ainfo("Searching org", company_url=company_url, search_criteria=search_criteria)

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.peopledatalabs.com/v5/person/search", headers=headers, params=params)
        data: dict[str, Any] = response.json()
        if response.status_code != 200 and not data.get("total"):
            error_msg = "Org size not found."
            await logger.awarn(
                error_msg,
                status=response.status_code,
                response=data,
                company_url=company_url,
                org_name=org_name,
            )
            raise LookupError(error_msg)

        return int(data["total"])
