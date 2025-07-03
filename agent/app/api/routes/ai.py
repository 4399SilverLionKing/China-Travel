from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.service.agent import agent_executor_instance
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    智能助手聊天接口

    - input: 用户输入的问题或请求
    """

    if not request.input or not request.input.strip():
        raise HTTPException(status_code=400, detail="请求体中必须包含非空的 'input' 字段")

    try:
        # 在用户输入前添加中文指令
        chinese_prompt = f"请用中文回答以下问题：{request.input}"

        # 调用agent
        result = agent_executor_instance.invoke({
            "input": chinese_prompt
        })

        # 获取输出
        output = result.get("output")

        if output is None:
            raise HTTPException(status_code=500, detail="Agent返回了空响应")

        return ChatResponse(response=output)

    except Exception as e:
        # 异常处理
        logging.error(f"调用 Agent 时发生错误: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"处理请求时发生内部错误: {str(e)}")