# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import anyio
from alembic import command as migration_command
from alembic.config import Config as AlembicConfig
from sqlalchemy import Table
from sqlalchemy.schema import DropTable

from app.lib import logging, settings
from app.lib.db import engine
from app.lib.db.orm import DatabaseModel, meta

logger = logging.getLogger()


def create_database() -> None:
    """Create database DDL migrations."""
    alembic_cfg = AlembicConfig(settings.db.MIGRATION_CONFIG)
    alembic_cfg.set_main_option("script_location", settings.db.MIGRATION_PATH)
    migration_command.upgrade(alembic_cfg, "head")


def upgrade_database() -> None:
    """Upgrade the database to the latest revision."""
    alembic_cfg = AlembicConfig(settings.db.MIGRATION_CONFIG)
    alembic_cfg.set_main_option("script_location", settings.db.MIGRATION_PATH)
    migration_command.upgrade(alembic_cfg, "head")


def reset_database() -> None:
    """Reset the database to an initial empty state."""
    alembic_cfg = AlembicConfig(settings.db.MIGRATION_CONFIG)
    alembic_cfg.set_main_option("script_location", settings.db.MIGRATION_PATH)
    anyio.run(drop_tables)
    migration_command.upgrade(alembic_cfg, "head")


def purge_database() -> None:
    """Drop all objects in the database."""
    alembic_cfg = AlembicConfig(settings.db.MIGRATION_CONFIG)
    alembic_cfg.set_main_option("script_location", settings.db.MIGRATION_PATH)
    anyio.run(drop_tables)


def show_database_revision() -> None:
    """Show current database revision."""
    alembic_cfg = AlembicConfig(settings.db.MIGRATION_CONFIG)
    alembic_cfg.set_main_option("script_location", settings.db.MIGRATION_PATH)
    migration_command.current(alembic_cfg, verbose=False)


async def drop_tables() -> None:
    """Drop all tables from the database."""
    logger.info("Connecting to database backend.")
    async with engine.begin() as db:
        logger.info("Dropping the db")
        await db.run_sync(DatabaseModel.metadata.drop_all)
        logger.info("Dropping the version table")

        await db.execute(
            DropTable(
                element=Table(settings.db.MIGRATION_DDL_VERSION_TABLE, meta),
                if_exists=True,
            )
        )
        await db.commit()
    logger.info("Successfully dropped all objects")
