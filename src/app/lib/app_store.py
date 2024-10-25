import re
import json
import httpx
import structlog
from typing import Any
from datetime import datetime

from google_play_scraper import search, app

from app.lib.utils import get_domain

logger = structlog.get_logger()


async def get_ios_app_url(company_url: str) -> str:
    """Get app url."""
    if not company_url:
        raise Exception("company url is required")

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
                return result.get("trackViewUrl")

    await logger.awarn("iOS app not found.", data=data, company_url=company_url)
    return None


def extract_ios_app_id_from_url(app_url: str):
    """Extract app id from app url."""
    match = re.search(r"id(\d+)", app_url)
    if not match:
        return None

    return match.group(1)


async def get_ios_app_details(app_url: str) -> dict[str, Any]:
    """Get app details."""
    if not app_url:
        raise Exception("app url is required")

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
            await logger.awarn("iOS app not found.", data=data, company_url=company_url)
            return None

        return {
            "id": app_id,
            "url": app_url,
            "version": results[0].get("version"),
            "release_date": datetime.strptime(results[0].get("releaseDate"), "%Y-%m-%dT%H:%M:%SZ"),
            "current_version_release_date": datetime.strptime(
                results[0].get("currentVersionReleaseDate"), "%Y-%m-%dT%H:%M:%SZ"
            ),
            "rating": results[0].get("averageUserRating"),
            "rating_count": results[0].get("userRatingCount"),
            "price": results[0].get("price"),
            "installs": None,
        }


def extract_android_app_id_from_url(app_url: str):
    """Extract app id from app url."""
    match = re.search(r"id=([^&]+)", app_url)
    if not match:
        return None

    return match.group(1)  # Extracts the app ID


async def get_android_app_url(company_name: str, company_url: str) -> str:
    """Get app url."""
    if not company_name or not company_url:
        raise Exception("company name and url are required")

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
            return app_details.get("url")

    await logger.awarn("Android app not found.", company_name=company_name)
    return None


async def get_android_app_details(app_url: str) -> dict[str, Any]:
    """Get app details."""
    if not app_url:
        raise Exception("app url is required")

    try:
        app_id = extract_android_app_id_from_url(app_url)
        app_details = app(app_id)
        return {
            "id": app_id,
            "url": app_url,
            "version": app_details.get("version"),
            "release_date": datetime.strptime(app_details.get("released"), "%b %d, %Y"),
            "current_version_release_date": datetime.utcfromtimestamp(app_details.get("updated")),
            "rating": app_details.get("score"),
            "rating_count": app_details.get("ratings"),
            "price": app_details.get("price"),
            "installs": app_details.get("installs"),
        }
    except Exception:
        await logger.awarn("Android app not found.", app_url=app_url)
        return None
