import os
import json
import httpx
import structlog
from typing import Any

from app.lib.schema import Investor


logger = structlog.get_logger()
pb_api_key = os.environ["PB_API_KEY"]


async def get_company_investors(url: str) -> list[str]:
    """Get company investors."""
    if not url:
        raise Exception("url is required")

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"PB-Token {pb_api_key}",
    }
    params = {"companyNames": url}

    async with httpx.AsyncClient() as client:
        # Fetch company pb id
        response = await client.get("https://api.pitchbook.com/companies/search", headers=headers, params=params)
        data = response.json()
        try:
            pb_company_id = data["items"][0]["companyId"]
        except (KeyError, TypeError, IndexError):
            await logger.awarn("Company not found.", response=data, url=url)
            raise Exception("Company not found.")

        # Fetch investor list
        response = await client.get(
            f"https://api.pitchbook.com/companies/{pb_company_id}/active-investors", headers=headers, params=params
        )
        data = response.json()
        try:
            investors = [
                item["investorName"]
                for item in data
                if "individual" not in item["investorTypes"][0]["type"]["description"]
            ]
        except (KeyError, TypeError, IndexError):
            await logger.awarn("Investors found.", response=data, url=url)
            raise Exception("Investors not found.")

        # TODO: Fetch last funding round name
        return investors
