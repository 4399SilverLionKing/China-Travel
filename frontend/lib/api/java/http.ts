import { config } from '../../config/env';
import { ApiError } from '../../types/common';

// API基础URL
const API_BASE_URL = config.javaApiBaseUrl;

// 通用的API请求函数
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

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

    // 检查业务逻辑错误
    if (data.code && data.code !== 10000) {
      const error: ApiError = {
        code: data.code,
        message: data.message || '请求失败',
      };
      throw error;
    }

    return data;
  } catch (error) {
    // 如果是我们自定义的ApiError，直接抛出
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }

    // 网络错误或其他错误
    const apiError: ApiError = {
      code: -1,
      message: error instanceof Error ? error.message : '网络请求失败',
    };
    throw apiError;
  }
}