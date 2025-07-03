// 聊天相关类型定义

// 聊天请求类型
export interface ChatRequest {
  session_id: string;
  input: string;
}

// 聊天响应类型
export interface ChatResponse {
  response: string;
}