from __future__ import annotations

from typing import TYPE_CHECKING, Any

import pytest

from app.asgi import create_app

if TYPE_CHECKING:
    from litestar import Litestar
    from pytest import MonkeyPatch

    from app.db.models import Team, Tenant, User

pytestmark = pytest.mark.anyio


@pytest.fixture(name="app")
def fx_app(pytestconfig: pytest.Config, monkeypatch: MonkeyPatch) -> Litestar:
    """App fixture.

    Returns:
        An application instance, configured via plugin.
    """
    app: Litestar = create_app()
    return app


@pytest.fixture(name="raw_tenants")
def fx_raw_tenants() -> list[Tenant | dict[str, Any]]:
    """Unstructured tenant representations."""

    return [
        {
            "id": "39fe5d11-7c44-4b50-819a-32c6f539b6ba",
            "name": "Example",
            "description": "Example Org",
            "url": "https://example.com",
            "is_active": True,
        },
        {
            "id": "620358d6-937e-481b-a5d7-3b5dac1df69f",
            "name": "Test",
            "description": "Test Org",
            "url": "https://test.com",
            "is_active": True,
        },
    ]


@pytest.fixture(name="raw_users")
def fx_raw_users() -> list[User | dict[str, Any]]:
    """Unstructured user representations."""

    return [
        {
            "id": "97108ac1-ffcb-411d-8b1e-d9183399f63b",
            "email": "superuser@example.com",
            "name": "Super User",
            "password": "Test_Password1!",
            "is_superuser": True,
            "is_active": True,
            "tenant_id": "39fe5d11-7c44-4b50-819a-32c6f539b6ba",
        },
        {
            "id": "5ef29f3c-3560-4d15-ba6b-a2e5c721e4d2",
            "email": "user@example.com",
            "name": "Example User",
            "password": "Test_Password2!",
            "is_superuser": False,
            "is_active": True,
            "tenant_id": "39fe5d11-7c44-4b50-819a-32c6f539b6ba",
        },
        {
            "id": "5ef29f3c-3560-4d15-ba6b-a2e5c721e999",
            "email": "test@test.com",
            "name": "Test User",
            "password": "Test_Password3!",
            "is_superuser": False,
            "is_active": True,
            "tenant_id": "620358d6-937e-481b-a5d7-3b5dac1df69f",
        },
        {
            "id": "6ef29f3c-3560-4d15-ba6b-a2e5c721e4d3",
            "email": "another@example.com",
            "name": "The User",
            "password": "Test_Password3!",
            "is_superuser": False,
            "is_active": True,
            "tenant_id": "39fe5d11-7c44-4b50-819a-32c6f539b6ba",
        },
        {
            "id": "7ef29f3c-3560-4d15-ba6b-a2e5c721e4e1",
            "email": "inactive@example.com",
            "name": "Inactive User",
            "password": "Old_Password2!",
            "is_superuser": False,
            "is_active": False,
            "tenant_id": "39fe5d11-7c44-4b50-819a-32c6f539b6ba",
        },
    ]


@pytest.fixture(name="raw_teams")
def fx_raw_teams() -> list[Team | dict[str, Any]]:
    """Unstructured team representations."""

    return [
        {
            "id": "97108ac1-ffcb-411d-8b1e-d9183399f63b",
            "slug": "test-team",
            "name": "Test Team",
            "description": "This is a description for a  team.",
            "owner_id": "5ef29f3c-3560-4d15-ba6b-a2e5c721e4d2",
        },
        {
            "id": "81108ac1-ffcb-411d-8b1e-d91833999999",
            "slug": "simple-team",
            "name": "Simple Team",
            "description": "This is a description",
            "owner_id": "5ef29f3c-3560-4d15-ba6b-a2e5c721e999",
            "tags": ["new", "another", "extra"],
        },
        {
            "id": "81108ac1-ffcb-411d-8b1e-d91833999998",
            "slug": "extra-team",
            "name": "Extra Team",
            "description": "This is a description",
            "owner_id": "5ef29f3c-3560-4d15-ba6b-a2e5c721e999",
            "tags": ["extra"],
        },
    ]
