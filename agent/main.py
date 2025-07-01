import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# 使用 python-dotenv 加载 .env 文件中的环境变量
# 这行代码会查找 .env 文件并加载其中的键值对作为环境变量
load_dotenv()

# 检查 API 密钥是否已设置
if os.getenv("OPENAI_API_KEY") is None:
    print("错误：请设置 OPENAI_API_KEY 环境变量。")
else:
    print("环境配置成功，正在初始化模型...")

    # 1. 初始化模型
    # model_name 可以指定不同的模型，如 "gpt-4", "gpt-3.5-turbo"
    llm = ChatOpenAI(model_name="glm-4",
                     openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
                     )

    # 2. 创建消息
    messages = [
        HumanMessage(content="你好，给我讲一个关于程序员的笑话。")
    ]

    # 3. 调用模型并获取响应
    print("正在向模型发送请求...")
    response = llm.invoke(messages)

    # 4. 打印结果
    print("\n模型的回答：")
    print(response.content)