// API错误类型
export interface ApiError {
  code: number;
  message: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
