import { config } from '../../config/env';
import { ApiError } from '../../types/common';
import { tokenUtils } from '../../utils/token';

// API基础URL
const API_BASE_URL = config.javaApiBaseUrl;

// 通用的API请求函数
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // 获取token并添加到请求头
  const token = tokenUtils.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // 如果有token，添加Authorization头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // 处理HTTP状态码错误
    if (!response.ok) {
      if (response.status === 401) {
        // 401未授权，清除token并跳转到登录页
        tokenUtils.removeToken();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_info');
          window.location.href = '/login';
        }
        const error: ApiError = {
          code: 401,
          message: '登录已过期，请重新登录',
        };
        throw error;
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 检查业务逻辑错误
    if (data.code && data.code !== 10000) {
      // 如果业务逻辑返回401，也进行相同处理
      if (data.code === 401) {
        tokenUtils.removeToken();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_info');
          window.location.href = '/login';
        }
      }

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