import json
import os

import structlog
from openai import AsyncOpenAI

logger = structlog.get_logger()

model = os.environ["OPENAI_MODEL_NAME"]
client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

context_prompt = """
    Only extract the following information directly from the given job post(which is in the form of HTML/JS code)
    without adding any outside knowledge or assumptions:
    - Pick up 0 to 2 most relevant sentences(if they exist and along with the reason) from the job post that prove with high certainty that the compaany that made the post needs my product(pitch: {product_pitch}).

    Format the extracted information into a json serializable array of objects as per this format:
    {{"result": [ {{"sentence": "sentence 1", "reason": "reason 1"}}, {{"sentence": "sentence 2", "reason": "reason 2"}} ]}}

    Note: Do NOT include anything that's not part of the post.

    Here is the code:
    {html_content}
"""


async def extract_context_from_job_post(html_content: str, product_pitch: str) -> list[dict[str, str]]:
    """Extracts context from html job post using an LLM."""
    messages = [
        {
            "role": "user",
            "content": context_prompt.format(html_content=html_content, product_pitch=product_pitch),
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

    context = json.loads(chat_response.choices[0].message.content)
    logger.debug("Context extracted from job post", context=context)
    return [
        {"sentence": str(item["sentence"]), "reason": str(item["reason"])}
        for item in context.get("result", [])
        if "sentence" in item
    ]
