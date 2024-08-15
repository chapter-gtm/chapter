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
    OrgSize,
    Tool,
    Scale,
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
            obj.round_name = FundingRound(obj.round_name) if obj.round_name else FundingRound.SERIES_UNKNOWN
            return obj
        return None


class WorkExperienceType(JSONBType):
    def process_result_value(self, value, dialect):
        """Convert JSON format to Python object when reading from the database."""
        if value and isinstance(value, dict):
            return WorkExperience.from_dict(value)
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
        return None
