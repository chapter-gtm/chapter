from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR
from starlite import Provide, Starlite

from pyspa import api, db, middleware
from pyspa.config import log_config, settings
from pyspa.core import cache, client, compression, cors, exceptions, openapi, response, security, static_files

__all__ = ["app", "run_server"]


app = Starlite(
    debug=settings.app.DEBUG,
    exception_handlers={HTTP_500_INTERNAL_SERVER_ERROR: exceptions.logging_exception_handler},
    on_shutdown=[db.on_shutdown, client.on_shutdown, cache.on_shutdown],
    on_startup=[log_config.configure],
    openapi_config=openapi.config,
    compression_config=compression.config,
    cors_config=cors.config,
    route_handlers=[api.router],
    cache_config=cache.config,
    response_class=response.Response,
    middleware=[security.auth.middleware, middleware.DatabaseSessionMiddleware],
    dependencies={"db": Provide(db.db_session)},
    static_files_config=static_files.config,
    allowed_hosts=settings.app.BACKEND_CORS_ORIGINS,
)


"""Application Web Server Gateway Interface - gunicorn."""


def run_server(
    host: str,
    port: int,
    http_workers: int,
    reload: bool,
    log_level: str,
    asgi_app: str,
    lifespan: str = "auto",
    access_log: bool = True,
) -> None:
    """Launches an ASGI application with Uvicorn

    Args:
        host (str): _description_
        port (int): _description_
        http_workers (int): _description_
        reload (bool): _description_
        log_level (str): _description_
        asgi_app (str): _description_
        lifespan (str, optional): _description_. Defaults to "auto".
        access_log (bool, optional): _description_. Defaults to True.
    """
    import uvicorn  # pylint: disable=[import-outside-toplevel]

    uvicorn.run(
        app=asgi_app,
        host=host,
        port=port,
        log_level=log_level,
        log_config=None,  # this tells uvicorn to not apply its customizations
        reload=reload,
        lifespan=lifespan,
        access_log=access_log,
        workers=http_workers,
        reload_excludes=[".git", ".venv", "*.pyc"],
    )
