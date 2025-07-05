import { config } from '../../config/env';

// 聊天API基础URL
const CHAT_API_BASE_URL = config.pythonApiBaseUrl || 'http://localhost:20001';

// 通用的聊天API请求函数
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${CHAT_API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // 网络错误或其他错误
    throw new Error(
      error instanceof Error ? error.message : '聊天API请求失败'
    );
  }
}