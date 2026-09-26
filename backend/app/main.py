from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, regions
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title="EquiMap API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Content-Type"],
)
app.include_router(health.router, prefix="/api")
app.include_router(regions.router, prefix="/api")
