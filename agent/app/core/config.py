from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """应用配置类，自动从环境变量和.env文件加载配置"""

    # 基本信息
    PROJECT_NAME: str = "ChinaTravel"
    API_V1_STR: str = "/api/v1"

    # 智谱API配置
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://open.bigmodel.cn/api/paas/v4/"
    OPENAI_MODEL: str = "glm-4-plus"

    # 高德地图API配置
    AMAP_API_KEY: str = ""

    # LangChain配置
    LANGCHAIN_TRACING_V2: bool = True
    LANGCHAIN_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGCHAIN_API_KEY: str = ""
    LANGCHAIN_PROJECT: str = "ChinaTravel"

    class Config:
        env_file = ".env"

# 创建全局配置实例
settings = Settings()