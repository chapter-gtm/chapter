import os
import structlog
from urllib.parse import urlparse


logger = structlog.get_logger()

logo_dev_token = os.environ["LOGO_DEV_TOKEN"]


def get_domain(url: str) -> str:
    """Extract domain from url."""
    parsed_url = urlparse(url)
    return parsed_url.netloc


def get_domain_from_email(email: str) -> str:
    """Extract domain from email."""
    parsed_url = urlparse("mailto://" + email)
    return parsed_url.hostname


def get_logo_dev_link(url: str) -> str | None:
    """Construct a logo.dev url."""
    try:
        domain = get_domain(url)
        return f"https://img.logo.dev/{domain}?token={logo_dev_token}"
    except Exception as e:
        logger.warn("Failed to build logo.dev link", url=url, exc_info=e)
