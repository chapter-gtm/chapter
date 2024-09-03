import os
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
        if not data:
            await logger.awarn("Company not found.", response=data, url=url, social_url=social_url)
            raise Exception("Company not found.")
        return data


async def get_person_details(social_url: str = None) -> dict[str, Any]:
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
            await logger.awarn("Person not found.", response=data, url=url, social_url=social_url)
            raise Exception("Person not found.")
        return data.get("data")
