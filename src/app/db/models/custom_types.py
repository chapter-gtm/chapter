from __future__ import annotations

import json
from dataclasses import dataclass, asdict

from sqlalchemy.types import TypeDecorator, String
from sqlalchemy.dialects.postgresql import JSONB

from app.lib.schema import (
    Location,
    FundingRound,
    Funding,
    WorkExperience,
    SocialActivity,
    OpportunityStage,
    OpportunityContext,
    OrgSize,
    Tool,
    Process,
    Scale,
    OrgSizeCriteria,
    CompanyCriteria,
    ToolCriteria,
    ProcessCriteria,
    PersonCriteria,
)


class JSONBType(TypeDecorator):
    impl = JSONB  # Use the PostgreSQL JSONB type as base

    def process_bind_param(self, value, dialect):
        """Convert Python object to JSON format before storing it in the database."""
        if isinstance(value, dict):
            return value
        elif hasattr(value, "to_dict"):
            return value.to_dict()
        return value

    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value:
            return json.loads(value)
        return None


class LocationType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return Location.from_dict(value)
        return None


class FundingType(JSONBType):
    def process_result_value(self, value, dialect):
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
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return WorkExperience.from_dict(value)
        elif value and isinstance(value, list):
            objs = []
            for item in value:
                objs.append(WorkExperience.from_dict(item))
            return objs
        return None


class SocialActivityType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return SocialActivity.from_dict(value)
        return None


class OpportunityStageType(TypeDecorator):
    impl = String

    def process_bind_param(self, value, dialect):
        if isinstance(value, OpportunityStage):
            return value.value
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            return OpportunityStage(value)
        return value


class OrgSizeType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return OrgSize.from_dict(value)
        return None


class ToolType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            obj = Tool.from_dict(value)
            obj.certainty = Scale(obj.certainty) if obj.certainty else Scale.LOW
            return obj
        elif value and isinstance(value, list):
            objs = []
            for item in value:
                obj = Tool.from_dict(item)
                obj.certainty = Scale(obj.certainty) if obj.certainty else Scale.LOW
                objs.append(obj)
            return objs
        return None


class ProcessType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            obj = Process.from_dict(value)
            return obj
        elif value and isinstance(value, list):
            objs = []
            for item in value:
                obj = Process.from_dict(item)
                objs.append(obj)
            return objs
        return None


class OrgSizeCriteriaType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return OrgSizeCriteria.from_dict(value)
        return None


class PersonCriteriaType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return PersonCriteria.from_dict(value)
        return None


class ToolCriteriaType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return ToolCriteria.from_dict(value)
        return None


class ProcessCriteriaType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return ProcessCriteria.from_dict(value)
        return None


class CompanyCriteriaType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            obj = CompanyCriteria.from_dict(value)
            funding_rounds = []
            for funding_round in obj.funding:
                try:
                    funding_rounds.append(FundingRound(funding_round))
                except ValueError:
                    pass
            obj.funding = funding_rounds
            obj.org_size = OrgSizeCriteria.from_dict(obj.org_size)
            return obj
        return None


class OpportunityContextType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return OpportunityContext.from_dict(value)
        return None
