from __future__ import annotations

import json
from contextlib import suppress
from typing import Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import String, TypeDecorator

from app.lib.schema import (
    CompanyCriteria,
    Funding,
    FundingRound,
    Location,
    OpportunityContext,
    OpportunityStage,
    OrgSize,
    OrgSizeCriteria,
    PersonCriteria,
    Process,
    ProcessCriteria,
    Scale,
    SocialActivity,
    Tool,
    ToolCriteria,
    WorkExperience,
)


class JSONBType(TypeDecorator):
    """Base JSON Type."""

    impl = JSONB  # Use the PostgreSQL JSONB type as base

    def process_bind_param(self, value: Any, dialect: Any) -> Any:
        """Convert Python object to JSON format before storing it in the database."""
        if isinstance(value, dict):
            return value
        if hasattr(value, "to_dict"):
            return value.to_dict()
        return value

    def process_result_value(self, value: Any, dialect: Any) -> Any | list[Any] | None:
        """Convert JSON format to Python object when reading from the database."""
        if value:
            return json.loads(value)
        return None


class LocationType(JSONBType):
    """Location Type."""

    def process_result_value(self, value: Any, dialect: Any) -> Location | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return Location.from_dict(value)
        return None


class FundingType(JSONBType):
    """Funding Type."""

    def process_result_value(self, value: Any, dialect: Any) -> Any | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            obj = Funding.from_dict(value)
            try:
                obj.round_name = FundingRound(obj.round_name)
            except ValueError:
                obj.round_name = FundingRound.SERIES_UNKNOWN
            return obj
        return None


class WorkExperienceType(JSONBType):
    """Work Experience Type."""

    def process_result_value(self, value: Any, dialect: Any) -> WorkExperience | list[WorkExperience] | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return WorkExperience.from_dict(value)
        if value and isinstance(value, list):
            return [WorkExperience.from_dict(item) for item in value]
        return None


class SocialActivityType(JSONBType):
    """Social Activity Type."""

    def process_result_value(self, value: Any, dialect: Any) -> SocialActivity | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return SocialActivity.from_dict(value)
        return None


class OpportunityStageType(TypeDecorator):
    """Opportunity Stage Type."""

    impl = String

    def process_bind_param(self, value: Any, dialect: Any) -> Any:
        """Convert Python object to JSON format before storing it in the database."""
        if isinstance(value, OpportunityStage):
            return value.value
        return value

    def process_result_value(self, value: Any, dialect: Any) -> OpportunityStage | None:
        """Convert JSON format to Python object when reading from the database."""
        if value is not None:
            return OpportunityStage(value)
        return value


class OrgSizeType(JSONBType):
    """Org Size Type."""

    def process_result_value(self, value: Any, dialect: Any) -> OrgSize | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return OrgSize.from_dict(value)
        return None


class ToolType(JSONBType):
    """Tool Type."""

    def process_result_value(self, value: Any, dialect: Any) -> Tool | list[Tool] | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            obj = Tool.from_dict(value)
            obj.certainty = Scale(obj.certainty) if obj.certainty else Scale.LOW
            return obj
        if value and isinstance(value, list):
            objs = []
            for item in value:
                obj = Tool.from_dict(item)
                obj.certainty = Scale(obj.certainty) if obj.certainty else Scale.LOW
                objs.append(obj)
            return objs
        return None


class ProcessType(JSONBType):
    """Process Type."""

    def process_result_value(self, value: Any, dialect: Any) -> Process | list[Process] | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return Process.from_dict(value)
        if value and isinstance(value, list):
            objs = []
            for item in value:
                obj = Process.from_dict(item)
                objs.append(obj)
            return objs
        return None


class OrgSizeCriteriaType(JSONBType):
    """Org Size Criteria Type."""

    def process_result_value(self, value: Any, dialect: Any) -> OrgSizeCriteria | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return OrgSizeCriteria.from_dict(value)
        return None


class PersonCriteriaType(JSONBType):
    """Process Criteria Type."""

    def process_result_value(self, value: Any, dialect: Any) -> PersonCriteria | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return PersonCriteria.from_dict(value)
        return None


class ToolCriteriaType(JSONBType):
    """Tool Criteria Type."""

    def process_result_value(self, value: Any, dialect: Any) -> ToolCriteria | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return ToolCriteria.from_dict(value)
        return None


class ProcessCriteriaType(JSONBType):
    """Process Criteria Type."""

    def process_result_value(self, value: Any, dialect: Any) -> ProcessCriteria | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return ProcessCriteria.from_dict(value)
        return None


class CompanyCriteriaType(JSONBType):
    """Company Criteria Type."""

    def process_result_value(self, value: Any, dialect: Any) -> CompanyCriteria | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            obj = CompanyCriteria.from_dict(value)
            if not obj.funding or not isinstance(obj.funding, list):
                return None
            funding_rounds = []
            for funding_round in obj.funding:
                with suppress(ValueError):
                    funding_rounds.append(FundingRound(funding_round))
            obj.funding = funding_rounds
            if obj.org_size and isinstance(obj.org_size, dict):
                obj.org_size = OrgSizeCriteria.from_dict(obj.org_size)
            return obj
        return None


class OpportunityContextType(JSONBType):
    """Opportunity Criteria Type."""

    def process_result_value(self, value: Any, dialect: Any) -> OpportunityContext | None:
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return OpportunityContext.from_dict(value)
        return None
