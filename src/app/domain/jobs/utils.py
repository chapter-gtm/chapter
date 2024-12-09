import json
import os
from typing import Any

import structlog
from openai import AsyncOpenAI
from rapidfuzz import fuzz, process

logger = structlog.get_logger()

canonical_tech_names = [
    "Python",
    "Kubernetes",
    "JavaScript",
    "Node.js",
    "React",
    "Flask",
    "GitHub",
    "GitHub Actions",
    "Jenkins",
    "CircleCI",
    "GitLab",
    "GitLab CI",
    "Buildkite",
    "Docker",
    "GitOps",
    "Argo CD",
    "Cypress",
    "Playwright",
    "Rust",
    "Go",
    "Python",
    "TensorFlow",
    "PyTorch",
    "LlamaIndex",
    "LangCHain",
    "LLM",
    "RAG",
    "HuggingFace",
    "OpenAI",
    "API",
    "SDK",
    "REST API",
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
    "AWS",
    "Grafana",
    "Prometheuse",
    "Sentry",
    "Word2Vec",
    "GloVe",
    "BERT",
    "ELMo",
    "fastText",
    "Llama",
    "T5",
    "Stable Diffusion",
    "ComfyUI",
]

tool_name_special_cases = {
    "k8s": "Kubernetes",
    "js": "Javascript",
    "ts": "Typescript",
    "node": "Node.js",
    "golang": "Go",
}


canonical_process_names = ["Code Review", "Testing", "Documentation", "CI/CD"]
process_name_special_cases = {
    "ci/cd pipelines": "CI/CD",
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
    - Mentions of engineering processes / practices that the team and company are following or want to follow

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
        tools: [ {{"name": "tool name 1", "certainty": "High"}}, {{"name": "tool name 2", "certainty": "Medium"}} ],
        processes: [{{"name": "process 1"}}, {{"name": "process 2"}}]
    }}

    Note: Do NOT include anything that's not part of the post and use null if you're unable to extract any information.

    Here is the code:
    {html_content}
"""


def normalise_names(
    items: list[dict[str, str]],
    canonical_names: list[str],
    special_cases: dict[str, str],
) -> list[dict[str, str]]:
    def normalise_name(name: str) -> str:
        # Check case-insensitive special cases
        lower_name = name.lower()
        if lower_name in special_cases:
            return special_cases[lower_name]

        # Fuzzy matching for general cases
        result: tuple[str, float, int] | None = process.extractOne(
            name,
            canonical_names,
            scorer=fuzz.token_set_ratio,
            processor=str.lower,
        )
        if result:
            match, score, _ = result
            return match if score > 80 else name

        return name

    # Normalize each item's name in the tech stack
    for item in items:
        if "name" in item:
            item["name"] = normalise_name(item["name"].strip())
    return items


async def extract_job_details_from_html(html_content: str) -> dict[str, Any]:
    """Extracts job post from the html using an LLM."""
    messages = [
        {
            "role": "user",
            "content": prompt.format(html_content=html_content),
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

    job_details: dict[str, Any] = {}
    try:
        job_details = json.loads(chat_response.choices[0].message.content)
    except (ValueError, TypeError, KeyError, json.JSONDecodeError) as e:
        await logger.awarn("Failed to extract data from job details", response=chat_response, exc_info=e)

    if (
        "title" not in job_details
        or "company" not in job_details
        or not job_details.get("company")
        or "name" not in job_details["company"]
        or "url" not in job_details["company"]
        or "linkedin_url" not in job_details["company"]
    ):
        await logger.awarn("Failed to extract necessary information from job post", job_details=job_details)

    # Normalise tools
    try:
        job_details["tools"] = normalise_names(job_details["tools"], canonical_tech_names, tool_name_special_cases)
    except (ValueError, TypeError, KeyError) as e:
        await logger.awarn("Failed to normalise tool stack", job_details=job_details, exc_info=e)

    try:
        job_details["processes"] = normalise_names(
            job_details["processes"],
            canonical_process_names,
            process_name_special_cases,
        )
    except (ValueError, TypeError, KeyError) as e:
        await logger.awarn("Failed to normalise processes", job_details=job_details, exc_info=e)

    return job_details
