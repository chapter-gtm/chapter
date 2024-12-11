import json
import os
from urllib.parse import urljoin

import structlog
from bs4 import BeautifulSoup
from openai import AsyncOpenAI

from app.lib.utils import get_fully_qualified_url

logger = structlog.get_logger()

model = os.environ["OPENAI_MODEL_NAME"]
client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
prompt = """
    You are a helpful assistant. Extract URLs for GitHub, Twitter(X), Discord, Slack, documentation, blogs,
    and changelogs from the following list of links:

    Tips:
    Identify documentation links by looking for keywords like "docs", "documentation", or "developer guide".
    Identify blog links by looking for keywords like "blog" or "news".
    Identify changelog links by looking for keywords like "changelog" or "release notes".

    Format the extracted information into the following short JSON object:
    {{
        "docs_url": "<docs url>",
        "blog_url": "<blog url>",
        "changelog_url": "<changelog url>",
        "github_url": "<github url>",
        "discord_url": "<discord url>",
        "slack_url": "<slack url>",
        "twitter_url": "<twitter url>",
    }}

    Note: Do NOT include anything that's not part of the page and use null if the information is missing

    Links:
    {links}
"""


async def extract_links_from_page(base_url: str, html_content: str) -> dict[str, str]:
    """Extracts links from the html using an LLM."""
    # Extract links from html
    soup = BeautifulSoup(html_content, "html.parser")
    anchors = soup.find_all("a", href=True)
    links_with_text = [{"href": a["href"], "text": a.get_text(strip=True)} for a in anchors]
    links = "\n".join([f"{link['text']}: {link['href']}" for link in links_with_text])

    # Identify links from the list using an LLM (TODO: Use regex)
    messages = [
        {
            "role": "user",
            "content": prompt.format(links=links),
        },
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
        logger.warning("Failed to extract necessary information from page")

    return {k: urljoin(get_fully_qualified_url(base_url), v) for k, v in data.items() if v}
