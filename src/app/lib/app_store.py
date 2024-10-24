import json
import httpx
import structlog

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
