import os
import json
import structlog
from typing import Any
from openai import AsyncOpenAI


logger = structlog.get_logger()

model = os.environ["OPENAI_MODEL_NAME"]
client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
prompt = """
    Only extract the following information directly from the given company homepage(which is in the form of HTML/JS code)
    without adding any outside knowledge or assumptions:
    - Documentation URL (preferably developer docs)
    - GitHub URL

    Format the extracted information into the following short JSON object:
    {{
        "docs_url": "<docs url>",
        "blog_url": "<blog url>",
        "github_url": "<github url>",
        "discord_url": "<discord url>",
        "slack_url": "<slack url>",
        "twitter_url": "<twitter url>",
    }}

    Note: Do NOT include anything that's not part of the page and use null if the information is missing

    Here is the code:
    {html_content}
"""


async def extract_data_from_page(html_content: str) -> dict[str, Any]:
    """Extracts data from the html using an LLM."""
    messages = [
        {
            "role": "user",
            "content": prompt.format(html_content=html_content),
        }
    ]
    chat_response = await client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
        response_format={
            "type": "json_object",
        },
    )

    data = json.loads(chat_response.choices[0].message.content)
    if not data:
        logger.warn("Failed to extract necessary information from page")

    return data
