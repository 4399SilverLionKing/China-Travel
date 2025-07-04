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

// 流式聊天响应数据块类型
export interface StreamChunk {
  type: 'tool_call' | 'tool_result' | 'token' | 'final' | 'error';
  content: string;
  metadata?: {
    tool?: string;
    tool_input?: string;
    observation?: string;
    error_type?: string;
  } | null;
}

// 流式聊天回调函数类型
export interface StreamCallbacks {
  onChunk?: (chunk: StreamChunk) => void;
  onComplete?: (finalContent: string) => void;
  onError?: (error: Error) => void;
}