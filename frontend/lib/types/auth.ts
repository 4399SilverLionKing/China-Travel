// 认证相关的类型定义

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    username: string;
    token: string;
  };
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

// 注册响应类型
export interface RegisterResponse {
  code: number;
  message: string;
  data: string;
}

