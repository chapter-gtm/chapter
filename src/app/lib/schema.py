from typing import Any
from datetime import date
import enum

import msgspec

from app.lib.utils import get_logo_dev_link


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


class FundingRound(enum.Enum):
    """Funding round."""

    GRANT = "Grant"
    PRE_SEED = "Pre-Seed"
    SEED = "Seed"
    SERIES_A = "Series A"
    SERIES_B = "Series B"
    SERIES_C = "Series C"
    SERIES_D = "Series D"
    SERIES_E = "Series E"
    SERIES_UNKNOWN = "Series Unknown"
    PRIVATE_EQUITY = "Private Equity"
    EQUITY_CROWDFUNDING = "Equity Crowdfunding"
    PUBLIC = "Public"


class Funding(CamelizedBaseStruct):
    """Funding data."""

    round_name: FundingRound = FundingRound.SERIES_UNKNOWN
    money_raised: int | None = None
    announced_date: date | None = None
    investors: list[Investor] = []


class WorkExperience(CamelizedBaseStruct):
    """Work experience data."""

    starts_at: date
    title: str
    company_name: str
    company_url: str | None = None
    company_linkedin_profile_url: str | None = None
    company_profile_pic_url: str | None = None
    ends_at: date | None = None
    description: str | None = None
    location: Location | None = None

    def __post_init__(self):
        """Build a profile pic url from company url."""
        if self.company_url:
            self.company_profile_pic_url = get_logo_dev_link(self.company_url)


class SocialActivity(CamelizedBaseStruct):
    """Social activity data."""

    title: str
    link: str | None = None
    status: str | None = None


class OpportunityStage(enum.Enum):
    """Opportunity stages."""

    IDENTIFIED = "Identified"
    QUALIFIED = "Qualified"
    CONTACTED = "Contacted"
    ENGAGED = "Engaged"
    PROPOSED = "Proposed"
    NEGOTIATED = "Negotiated"
    DEFERRED = "Deferred"
    SUSPENDED = "Suspended"
    CUSTOMER = "Customer"


class OrgSize(CamelizedBaseStruct):
    """Org size data."""

    engineering: int | None = None


class Scale(enum.Enum):
    """Scale data."""

    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Tool(CamelizedBaseStruct):
    """Tool data."""

    name: str
    # Shouldn't be part of the tool but makes things easier for now
    certainty: Scale = Scale.LOW


class OrgSizeCriteria(CamelizedBaseStruct):
    """Org size data."""

    engineering_min: int | None = None
    engineering_max: int | None = None


class CompanyCriteria(CamelizedBaseStruct):
    """Company criteria."""

    headcount_min: int | None = None
    headcount_max: int | None = None
    org_size: OrgSizeCriteria | None = None
    funding: list[FundingRound] | None = None
    countries: list[str] | None = None


class ToolCriteria(CamelizedBaseStruct):
    """Tool criteria."""

    include: list[str] | None = None
    exclude: list[str] | None = None


class PersonCriteria(CamelizedBaseStruct):
    """Person criteria."""

    titles: list[str] | None = None
