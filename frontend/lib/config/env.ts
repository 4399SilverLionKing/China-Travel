// 环境配置

export const config = {
  // API基础URL
  javaApiBaseUrl: process.env.NEXT_PUBLIC_JAVA_API_BASE_URL,

  // 聊天API基础URL
  pythonApiBaseUrl: process.env.NEXT_PUBLIC_PYTHON_API_BASE_URL,

  // 其他配置可以在这里添加
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
