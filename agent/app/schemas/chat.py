from pydantic import BaseModel
from typing import Optional

# 定义请求模型
class ChatRequest(BaseModel):
    session_id: str
    input: str

# 定义响应模型
class ChatResponse(BaseModel):
    response: str

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None