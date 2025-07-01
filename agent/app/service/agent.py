from langchain import hub
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_tools_agent, AgentExecutor
from app.tools.weather_tool import all_tools as weather_tools
from app.core.config import settings

def create_agent_executor():

    # 初始化模型，使用配置中的环境变量
    llm = ChatOpenAI(
        model=settings.OPENAI_MODEL,
        base_url=settings.OPENAI_BASE_URL,
        temperature=0.7,
    )

    # 工具
    tools = weather_tools

    # 使用标准提示词模板
    prompt = hub.pull("hwchase17/openai-tools-agent")

    # Agent
    agent = create_openai_tools_agent(llm, tools, prompt)

    # 执行器
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    return agent_executor

agent_executor_instance = create_agent_executor()