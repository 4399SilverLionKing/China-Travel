from fastapi import APIRouter
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.post("/get_current_weather")
async def get_current_weather():
    return None