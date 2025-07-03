import { ChatRequest, ChatResponse} from '../../types/chat';
import { apiRequest } from './http';


// 发送聊天消息
export async function sendChatMessage(
  sessionId: string,
  input: string
): Promise<ChatResponse> {
  const requestBody: ChatRequest = {
    session_id: sessionId,
    input: input,
  };

  return apiRequest<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
}

// 生成会话ID的辅助函数
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
