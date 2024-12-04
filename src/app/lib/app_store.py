import re
from datetime import UTC, datetime
from typing import Any

import httpx
import structlog
from google_play_scraper import app, search

from app.lib.utils import get_domain

logger = structlog.get_logger()


async def get_ios_app_url(company_url: str) -> str | None:
    """Get app url."""
    if not company_url:
        error_msg = "company url is required"
        raise ValueError(error_msg)

    company_domain = get_domain(company_url)
    headers = {
        "accept": "application/json",
    }
    params = {"term": company_domain, "entity": "software"}

    async with httpx.AsyncClient() as client:
        response = await client.get("https://itunes.apple.com/search", headers=headers, params=params)
        data = response.json()
        results = data.get("results")
        if not results:
            await logger.awarn("iOS app not found.", data=data, company_url=company_url)
            return None

        for result in results:
            if result.get("sellerUrl") and get_domain(result.get("sellerUrl")) == company_domain:
                return str(result.get("trackViewUrl")) if result.get("trackViewUrl") else None

    await logger.awarn("iOS app not found.", data=data, company_url=company_url)
    return None


def extract_ios_app_id_from_url(app_url: str) -> str | None:
    """Extract app id from app url."""
    match = re.search(r"id(\d+)", app_url)
    if not match:
        return None

    return match.group(1)


async def get_ios_app_details(app_url: str) -> dict[str, Any]:
    """Get app details."""
    if not app_url:
        error_msg = "app url is required"
        raise ValueError(error_msg)

    headers = {
        "accept": "application/json",
    }
    app_id = extract_ios_app_id_from_url(app_url)
    params = {"id": app_id}

    async with httpx.AsyncClient() as client:
        response = await client.get("https://itunes.apple.com/lookup", headers=headers, params=params)
        data = response.json()
        results = data.get("results")
        if not results:
            await logger.awarn("iOS app not found.", data=data, app_url=app_url)
            return {}

        return {
            "id": app_id,
            "url": app_url,
            "version": results[0].get("version"),
            "release_date": datetime.strptime(results[0].get("releaseDate"), "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=UTC),
            "current_version_release_date": datetime.strptime(
                results[0].get("currentVersionReleaseDate"),
                "%Y-%m-%dT%H:%M:%SZ",
            ).replace(tzinfo=UTC),
            "rating": results[0].get("averageUserRating"),
            "rating_count": results[0].get("userRatingCount"),
            "price": results[0].get("price"),
            "installs": None,
        }


def extract_android_app_id_from_url(app_url: str) -> str | None:
    """Extract app id from app url."""
    match = re.search(r"id=([^&]+)", app_url)
    if not match:
        return None

    return match.group(1)  # Extracts the app ID


async def get_android_app_url(company_name: str, company_url: str) -> str | None:
    """Get app url."""
    if not company_name or not company_url:
        error_msg = "company name and url are required"
        raise ValueError(error_msg)

    search_results = search(company_name)
    if not search_results:
        await logger.awarn("Android app not found.", company_name=company_name)
        return None

    company_domain = get_domain(company_url)
    for result in search_results:
        app_id = result.get("appId")
        if not app_id:
            await logger.awarn("Android app not found.", company_name=company_name)
            return None

        app_details = app(app_id)
        if app_details.get("developerWebsite") and get_domain(app_details.get("developerWebsite")) == company_domain:
            return str(app_details.get("url")) if app_details.get("url") else None

    await logger.awarn("Android app not found.", company_name=company_name)
    return None


async def get_android_app_details(app_url: str) -> dict[str, Any]:
    """Get app details."""
    if not app_url:
        error_msg = "app url is required"
        raise ValueError(error_msg)

    try:
        app_id = extract_android_app_id_from_url(app_url)
        app_details = app(app_id)
        return {
            "id": app_id,
            "url": app_url,
            "version": app_details.get("version"),
            "release_date": datetime.strptime(app_details.get("released"), "%b %d, %Y").replace(tzinfo=UTC),
            "current_version_release_date": datetime.fromtimestamp(app_details.get("updated"), tz=UTC),
            "rating": app_details.get("score"),
            "rating_count": app_details.get("ratings"),
            "price": app_details.get("price"),
            "installs": app_details.get("installs"),
        }
    except (ValueError, TypeError, KeyError) as e:
        await logger.awarn("Android app not found.", app_url=app_url, exc_info=e)
        return {}
