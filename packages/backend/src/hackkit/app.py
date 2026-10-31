"""App factory: the generic /api routes plus any routers you pass in."""
from typing import Iterable

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router as generic_router


def create_app(title: str = "Hackkit API", routers: Iterable[APIRouter] = (), prefix: str = "/api",
               cors_origins: Iterable[str] = ("*",)) -> FastAPI:
    app = FastAPI(title=title)
    app.add_middleware(CORSMiddleware, allow_origins=list(cors_origins), allow_methods=["*"], allow_headers=["*"])
    app.include_router(generic_router, prefix=prefix)
    for r in routers:
        app.include_router(r, prefix=prefix)
    return app
