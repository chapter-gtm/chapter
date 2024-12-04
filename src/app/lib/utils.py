import os
from urllib.parse import urlparse, urlunparse

import structlog

logger = structlog.get_logger()

logo_dev_token = os.environ["LOGO_DEV_TOKEN"]


def get_domain(url: str) -> str:
    """Extract domain from url."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed_url = urlparse(url)
    return parsed_url.netloc.replace("www.", "")


def get_domain_from_email(email: str) -> str | None:
    """Extract domain from email."""
    parsed_url = urlparse("mailto://" + email)
    return parsed_url.hostname


def get_logo_dev_link(url: str) -> str | None:
    """Construct a logo.dev url."""
    try:
        domain = get_domain(url)
    except (ValueError, TypeError) as e:
        error_msg = "Failed to build logo.dev link"
        logger.warning(error_msg, url=url, exc_info=e)
        return None
    else:
        return f"https://img.logo.dev/{domain}?token={logo_dev_token}"


def get_fully_qualified_url(domain_or_url: str) -> str:
    """Return fully qualified from domain or url."""

    parsed_url = urlparse(domain_or_url.strip())
    if not parsed_url.netloc and not parsed_url.path:
        error_msg = "Invalid URL or domain"
        raise ValueError(error_msg)

    if not parsed_url.scheme:
        return f"https://{domain_or_url.strip()}"

    return urlunparse(parsed_url)
