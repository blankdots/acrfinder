from ..conf.logging import LOG
from itertools import groupby


def transform(data):
    """Transform for UI, in order to make it easy."""
    uniquekeys = dict()
    for k, g in groupby(data, key=lambda x: x['acronymtype']):
        uniquekeys[k] = {"name": k, "results": list(g)}
    return uniquekeys


async def fetch_autocomplete(db_pool, term):
    """Execute query for returning dataset metadata."""
    # Take one connection from the database pool
    async with db_pool.acquire(timeout=180) as connection:
        # Start a new session with the connection
        async with connection.transaction():
            # Fetch dataset metadata according to user request
            try:
                query = """SELECT index, title, acronymType, fullname, description
                           FROM acronym_data_table
                           where tsquery(LOWER($1) || ':*') @@ to_tsvector(title)
                           GROUP by index, title, acronymType, fullname, description
                           limit 10;"""
                statement = await connection.prepare(query)
                db_response = await statement.fetch(term)
                data = []
                LOG.info(f"Query for arconym: {term}.")
                for record in list(db_response):
                    data.append(dict(record))
                return transform(data)
            except Exception as e:
                LOG.error(e)
                pass


async def fetch_acronym(db_pool, term, term_type):
    """Execute query for returning dataset metadata."""
    # Take one connection from the database pool
    async with db_pool.acquire(timeout=180) as connection:
        # Start a new session with the connection
        async with connection.transaction():
            # Fetch dataset metadata according to user request
            try:
                query = """SELECT index, title, fullname, acronymtype, status, description, language, url
                           FROM acronym_data_table
                           WHERE title=$1 AND acronymtype=$2
                           GROUP by index, title, fullname, acronymtype, status, description, language, url;"""
                statement = await connection.prepare(query)
                db_response = await statement.fetch(term, term_type)
                data = []
                LOG.info(f"Query for dataset(s): {term} from {term_type}.")
                for record in list(db_response):
                    data.append(dict(record))
                return data
            except Exception as e:
                LOG.error(e)
                pass


async def fetch_stats(db_pool):
    """Fetch some statistics regarding database contents.

    For now this function only returns the number of acronyms (rows) per type,
    but it could be extended to do some rudimentary data analysis.
    """
    # Take one connection from the database pool
    async with db_pool.acquire(timeout=180) as connection:
        # Start a new session with the connection
        async with connection.transaction():
            # Fetch number of acronyms
            try:
                query = """SELECT COUNT(*), acronymType
                           FROM acronym_data_table
                           GROUP BY acronymType;"""
                statement = await connection.prepare(query)
                db_response = await statement.fetch()
                data = []
                LOG.info("Query for acronym count per type.")
                for record in list(db_response):
                    data.append(dict(record))
                return data
            except Exception as e:
                LOG.error(e)
                pass
