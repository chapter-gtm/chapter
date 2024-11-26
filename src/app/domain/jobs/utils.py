import os
import json
import structlog
from typing import Any
from openai import AsyncOpenAI
from rapidfuzz import process, fuzz


logger = structlog.get_logger()

canonical_tech_names = [
    "Python",
    "Kubernetes",
    "JavaScript",
    "Node.js",
    "React",
    "Flask",
    "GitHub",
    "Github Actions",
    "Jenkins",
    "CircleCI",
    "GitLab",
    "GitLab CI",
    "Docker",
    "GitOps",
    "Argo CD",
    "Cypress",
    "Playwright",
    "Rust",
    "Python",
    "TensorFlow",
    "PyTorch",
    "LlamaIndex",
    "LangCHain",
    "LLMs",
    "RAG",
    "HuggingFace",
    "OpenAI",
    "APIs",
    "SDKs",
    "REST APIs",
    "GraphQL",
    "OpenAPI",
    "Markdown",
    "Authorization",
    "Access Management",
    "AWS IAM",
    "Django",
    "Spring Boot",
    "Flask",
    "Express",
    "Ruby on Rails",
    "SailPoint",
    "Okta",
    "Auth0",
]

special_cases = {
    "k8s": "Kubernetes",
    "js": "Javascript",
    "ts": "Typescript",
    "node": "Node.js",
}

model = os.environ["OPENAI_MODEL_NAME"]
client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
prompt = """
    Only extract the following information directly from the given job post(which is in the form of HTML/JS code)
    without adding any outside knowledge or assumptions:
    - Company Name
    - Company URL
    - Company LinkedIn URL
    - Job title
    - Job Location
    - Tech stack such as tools, programming languages, frameworks, and technologies, along with the certainty(Low, Medium or High) that the company is likely using the tool

   Tips:
   - If a company url is not found directly, try to determine company name from the post and match against
   an email address found in the post get the company url.

    Rules for assigning certainty to tools:
    - If the candidate experience with a tool is preferred or considered a bonus, the certainty should be High.
    - If a tool is explicitely mentioned as part of company's tech stack, the certainty  should be High.
    - If a tool is mentioned as part of a list of similar tools, the certainty should be Low.
    - Else, use Medium.

    Format the extracted information into the following short JSON object:
    {{
        "company": {{
            "name": "company name",
            "url": "https://company.tld",
            "linkedin_url": "https://company/linkedin/url",
        }}
        title: "Job title",
        location: {{"country": "country name", "region": "state or provience name", "city": "city name"}},
        tools: [ {{"name": "tool name 1", "certainty": "High"}}, {{"name": "tool name 2", "certainty": "Medium"}} ]
    }}

    Note: Do NOT include anything that's not part of the post and use null if you're unable to extract any information.

    Here is the code:
    {html_content}
"""


def normalise_tool_stack(tool_stack):
    def normalise_name(name):
        # Check case-insensitive special cases
        lower_name = name.lower()
        if lower_name in special_cases:
            return special_cases[lower_name]

        # Fuzzy matching for general cases
        result = process.extractOne(name, canonical_tech_names, scorer=fuzz.ratio)
        if result:
            match, score = result[0], result[1]
            return match if score > 80 else name

        return name

    # Normalize each item's name in the tech stack
    for item in tool_stack:
        if "name" in item:
            item["name"] = normalise_name(item["name"].strip())
    return tool_stack


async def extract_job_details_from_html(html_content: str) -> dict[str, Any]:
    """Extracts job post from the html using an LLM."""
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

    job_details = json.loads(chat_response.choices[0].message.content)
    if (
        not "title" in job_details
        or "name" not in job_details.get("company")
        and ("url" not in job_details.get("company") or "linkedin_url" not in job_details.get("company"))
    ):
        logger.warn("Failed to extract necessary information from job post", job_details=job_details)

    # Normalise tools
    try:
        job_details["tools"] = normalise_tool_stack(job_details["tools"])
    except Exception as e:
        logger.warn("Failed to normalise tool stack", job_details=job_details, exc_info=e)

    return job_details
