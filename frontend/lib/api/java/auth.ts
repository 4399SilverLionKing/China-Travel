import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from '../../types/auth';
import { apiRequest } from './http';

// 登录API
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/authenticate/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// 注册API
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/authenticate/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// Token相关的工具函数
export const tokenUtils = {
  // 保存token到localStorage
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  // 从localStorage获取token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // 删除token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // 检查是否已登录
  isLoggedIn: (): boolean => {
    return !!tokenUtils.getToken();
  },
};
