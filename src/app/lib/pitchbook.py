import asyncio
import os
from datetime import date
from typing import Any

import httpx
import structlog

logger = structlog.get_logger()
pb_api_key = os.environ["PB_API_KEY"]

pitchbook_round_map = {
    "SeedA": "Pre-Seed",
    "Seed": "Seed",
    "A": "Series A",
    "B": "Series B",
    "C": "Series C",
    "D": "Series D",
    "E": "Series E",
    "F": "Series F",
    "PEGTH": "Private Equity",
    "IPO": "Public",
}


async def fetch_url(
    client: httpx.AsyncClient,
    url: str,
    headers: dict[str, Any] | None = None,
    params: dict[str, Any] | None = None,
) -> Any:
    """Fetch url."""
    try:
        if not headers:
            headers = {}
        if not params:
            params = {}
        response = await client.get(url, headers=headers)
        if response.status_code != 200 or not response.text:
            return {}
        return response.json()
    except httpx.RequestError as e:
        await logger.awarn("Error while fetching data.", exc_info=e)
    return {}


async def get_company_funding_data(url: str) -> dict[str, Any]:
    """Get company investors."""
    if not url:
        error_msg = "url is required"
        raise ValueError(error_msg)

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
        except (KeyError, TypeError, IndexError) as e:
            error_msg = "Company not found."
            await logger.awarn(error_msg, response=data, url=url, exc_info=e)
            raise LookupError(error_msg) from e

        results: list[Any] = []
        try:
            urls = [
                f"https://api.pitchbook.com/companies/{pb_company_id}/active-investors",
                f"https://api.pitchbook.com/companies/{pb_company_id}/most-recent-financing",
            ]

            tasks = [fetch_url(client, url, headers=headers) for url in urls]
            results = await asyncio.gather(*tasks)

            # Get funding round name (Awesome API design Pitchbook!)
            try:
                round_name = pitchbook_round_map[results[1]["lastFinancingDealType3"]["code"]]
            except (KeyError, TypeError):
                try:
                    round_name = pitchbook_round_map[results[1]["lastFinancingDealType2"]["code"]]
                except (KeyError, TypeError):
                    try:
                        round_name = pitchbook_round_map[results[1]["lastFinancingDealType"]["code"]]
                    except (KeyError, TypeError):
                        round_name = "Series Unknown"

            try:
                announced_date = date.fromisoformat(results[1]["lastFinancingDate"])
            except ValueError:
                announced_date = None

            try:
                money_raised = results[1]["lastFinancingSize"]["amount"]
            except (KeyError, ValueError):
                money_raised = None

            return {
                "investors": [
                    item["investorName"]
                    for item in results[0]
                    if "individual" not in item["investorTypes"][0]["type"]["description"]
                ],
                "round_name": round_name,
                "announced_date": announced_date,
                "money_raised": money_raised,
            }
        except (KeyError, TypeError, IndexError) as e:
            error_msg = "Failed to get round and investors"
            await logger.awarn(error_msg, response=results, url=url, exc_info=e)
            raise
