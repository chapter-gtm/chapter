import os

import httpx
import structlog

logger = structlog.get_logger()
pdfshift_api_key = os.environ["PDFSHIFT_API_KEY"]


async def get_pdf(url: str, encode: bool = False) -> bytes | str:
    """Get pdf."""
    if not url:
        error_msg = "URL is required"
        raise ValueError(error_msg)

    body = {"source": url, "encode": encode, "timeout": 30}

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.pdfshift.io/v3/convert/pdf",
            auth=("api", pdfshift_api_key),
            json=body,
        )

        if response.status_code != 200 and not response.content:
            error_msg = "Failed to extract pdf."
            await logger.awarn(
                error_msg,
                status=response.status_code,
                response=response.content,
                url=url,
            )
            raise LookupError(error_msg)

        return response.content
