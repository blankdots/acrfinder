"""DB Configuration."""

import os
import asyncpg


async def init_db_pool():
    """Create a connection pool.

    As we will have frequent requests to the database it is recommended to create a connection pool.
    """
    return await asyncpg.create_pool(host=os.environ.get('DATABASE_URL', 'localhost'),
                                     port=os.environ.get('DATABASE_PORT', '5432'),
                                     user=os.environ.get('DATABASE_USER', 'acronym'),
                                     password=os.environ.get('DATABASE_PASSWORD', 'acronym'),
                                     database=os.environ.get('DATABASE_NAME', 'acronymdb'),
                                     min_size=0,
                                     max_size=20,
                                     max_queries=50000,
                                     timeout=120,
                                     command_timeout=180,
                                     max_cached_statement_lifetime=0,
                                     max_inactive_connection_lifetime=180)
