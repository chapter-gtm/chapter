from typing import Any
from datetime import date

import msgspec


class BaseStruct(msgspec.Struct):
    def to_dict(self) -> dict[str, Any]:
        """Convert object to dict."""
        return {f: getattr(self, f) for f in self.__struct_fields__ if getattr(self, f, None) != msgspec.UNSET}

    @classmethod
    def from_dict(cls, data):
        """Create an instance from a dictionary."""
        return cls(**data)


class CamelizedBaseStruct(BaseStruct, rename="camel"):
    """Camelized Base Struct"""


class Message(CamelizedBaseStruct):
    message: str


class Location(CamelizedBaseStruct):
    """A Location."""
    city: str | None = None
    region: str | None = None
    country: str | None = None


class Investor(CamelizedBaseStruct):
    """An investor."""
    name: str
    type: str | None = None
    url: str | None = None
    linkedin_profile_url: str | None = None


class Funding(CamelizedBaseStruct):
    """Funding data."""
    round_name: str = "Series Unknown"
    money_raised: int | None = None
    announced_date: date | None = None
    investors: list[Investor] = []


class WorkExperience(CamelizedBaseStruct):
    """Work experience data."""
    starts_at: date
    title: str
    company_name: str
    ends_at: date | None = None
    linkedin_profile_url: str | None = None
    description: str | None = None
    location: Location | None = None
    logo_url: str | None = None


class SocialActivity(CamelizedBaseStruct):
    """Social activity data."""
    title: str
    link: str | None = None
    status: str | None = None
