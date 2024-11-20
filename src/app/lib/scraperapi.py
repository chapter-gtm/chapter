import os
import httpx


scraper_api_key = os.environ["SCRAPERAPI_API_KEY"]


async def extract_url_content(url: str, render: bool = False, timeout=60.0) -> str:
    """Extracts URL content using a 3rd party service"""
    params = {
        "api_key": scraper_api_key,
        "url": url,
        "follow_redirect": "false",
        "country_code": "us",
        "device_type": "desktop",
        "render": str(render).lower(),
    }

    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.scraperapi.com", params=params, timeout=timeout)
        data = response.text
        return data
