import { ChatRequest, ChatResponse, StreamChunk, StreamCallbacks } from '../../types/chat';
import { apiRequest } from './http';
import { config } from '../../config/env';

// 聊天API基础URL
const CHAT_API_BASE_URL = config.pythonApiBaseUrl || 'http://localhost:20001';

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

// 流式聊天消息
export async function sendStreamChatMessage(
  sessionId: string,
  input: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const requestBody: ChatRequest = {
    session_id: sessionId,
    input: input,
  };

  const url = `${CHAT_API_BASE_URL}/chat/stream`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let finalContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // 将新数据添加到缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 处理缓冲区中的完整行
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一个不完整的行

        for (const line of lines) {
          const trimmedLine = line.trim();

          // 跳过空行和非数据行
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) {
            continue;
          }

          // 提取数据部分
          const dataStr = trimmedLine.substring(6); // 移除 "data: " 前缀

          // 跳过空数据
          if (!dataStr) {
            continue;
          }

          try {
            const chunk: StreamChunk = JSON.parse(dataStr);

            // 调用回调函数
            callbacks.onChunk?.(chunk);

            // 如果是最终响应，保存内容
            if (chunk.type === 'final') {
              finalContent = chunk.content;
            }
          } catch (parseError) {
            console.warn('解析SSE数据失败:', parseError, 'Data:', dataStr);
          }
        }
      }

      // 调用完成回调
      callbacks.onComplete?.(finalContent);
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '流式聊天请求失败';
    callbacks.onError?.(new Error(errorMessage));
  }
}

// 生成会话ID的辅助函数
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
