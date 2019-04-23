import sys
import asyncio
from aiohttp import web
import aiohttp_cors
import uvloop
import os
import json
from .conf.logging import LOG
from .conf.config import init_db_pool
from .utils.data import fetch_autocomplete, fetch_acronym, fetch_stats
from pyld import jsonld

routes = web.RouteTableDef()
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
jsonld.set_document_loader(jsonld.aiohttp_document_loader(timeout=1000))


context = {
    "dc": "http://purl.org/dc/elements/1.1/",
    "acr": "http://example.com/vocab#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "acr:contains": {"@type": "@id"}
}


@routes.get('/health')
async def healthcheck(request):
    """Test health, will always return ok."""
    LOG.info('Healthcheck called')
    return web.Response(text='OK')


@routes.get('/stats')
async def stats(request):
    """Get some simple statistics data from database."""
    LOG.info('stats')
    db_pool = request.app['pool']
    data = await fetch_stats(db_pool)
    response = {"data": data}
    return web.json_response(response, content_type='application/json', dumps=json.dumps)


@routes.get('/search')
async def search(request):
    """Match search query string, used in autocomplete function."""
    LOG.info('search')
    db_pool = request.app['pool']
    term = request.rel_url.query['term']
    data = await fetch_autocomplete(db_pool, term)
    response = {"data": data}
    return web.json_response(response, content_type='application/json', dumps=json.dumps)


@routes.get('/{acronymtype}/{acronymid}')
async def retrieve(request):
    """Retrieve data specific to an acronym, URL should be persistent."""
    db_pool = request.app['pool']
    term = request.match_info['acronymid']
    term_type = request.match_info['acronymtype']
    LOG.info('retrieve')
    data = await fetch_acronym(db_pool, term, term_type)
    doc = {"@id": f'acr:{data[0]["index"]}',
           "dc:title": data[0]["title"],
           "skos:label": data[0]["title"],
           "dc:type": {"@id": f'acr:{data[0]["acronymtype"]}',
                       "@type": 'skos:Concept',
                       "skos:label": data[0]["acronymtype"]},
           "dc:language": data[0]["language"],
           "dc:description": data[0]["description"]}
    if request.content_type == 'application/ld+json':
        response = jsonld.flatten(doc, context)
        return web.json_response(response, content_type='application/ld+json', dumps=json.dumps)
    elif request.content_type == 'application/n-quads':
        response = jsonld.normalize(doc, {'algorithm': 'URDNA2015', 'format': 'application/n-quads'})
        return web.Response(text=response, content_type='application/n-quads')
    else:
        response = {"data": data}
        return web.json_response(response, content_type='application/json', dumps=json.dumps)


def set_cors(server):
    """Set CORS rules."""
    # Configure CORS settings
    cors = aiohttp_cors.setup(server, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })
    # Apply CORS to endpoints
    for route in list(server.router.routes()):
        cors.add(route)


async def initialize(app):
    """Spin up DB a connection pool with the HTTP server."""
    # TO DO check if table and Database exist
    # and maybe exit gracefully or at lease wait for a bit
    LOG.debug('Create PostgreSQL connection pool.')
    app['pool'] = await init_db_pool()
    set_cors(app)


async def destroy(app):
    """Upon server close, close the DB connection pool."""
    await app['pool'].close()


async def init():
    """Initialise server."""
    server = web.Application()
    server.router.add_routes(routes)
    server.on_startup.append(initialize)
    server.on_cleanup.append(destroy)
    return server


def main():
    """Do the server."""
    # make it HTTPS and request certificate
    # sslcontext.load_cert_chain(ssl_certfile, ssl_keyfile)
    # sslcontext = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    # sslcontext.check_hostname = False
    web.run_app(init(), host=os.environ.get('HOST', '0.0.0.0'),
                port=os.environ.get('PORT', '5530'),
                shutdown_timeout=0, ssl_context=None)


if __name__ == '__main__':
    assert sys.version_info >= (3, 6), "acronym finder requires python3.6+"
    main()
