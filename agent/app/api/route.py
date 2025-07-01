from fastapi import APIRouter

from app.api.routes import ai, amap

api_router = APIRouter()
api_router.include_router(ai.router,tags=["ai"])
api_router.include_router(amap.router,tags=["amap"])