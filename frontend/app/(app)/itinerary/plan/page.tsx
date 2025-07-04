'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ItineraryPlanData } from '@/lib/types/itinerary';
import { sendStreamChatMessage, generateSessionId } from '@/lib/api/python/chat';
import { StreamChunk } from '@/lib/types/chat';
import { useItinerary } from '@/lib/contexts/itinerary-context';
import { addItineraryToHistory } from '@/lib/utils/itinerary-history';
import { useAuthGuard, useCurrentUser } from '@/lib/hooks/useAuthGuard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ItineraryPage() {
  const router = useRouter();
  const { itineraryData } = useItinerary();
  const [itinerary, setItinerary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => generateSessionId());

  // 使用认证保护
  const { shouldRender } = useAuthGuard();
  const { user, userId, username } = useCurrentUser();

  useEffect(() => {
    // 等待认证状态加载完成
    if (!shouldRender) return;

    // 从Context获取行程规划数据
    if (itineraryData) {
      generateItinerary(itineraryData);
    } else {
      // 如果没有数据，返回首页
      router.push('/');
    }
  }, [itineraryData, router, shouldRender]);

  // 生成行程规划
  const generateItinerary = async (data: ItineraryPlanData) => {
    setIsLoading(true);
    setIsStreaming(false);
    setItinerary(''); // 清空之前的内容

    try {
      // 构建AI提示词
      const preferences = [];
      if (data.preferences.historical) preferences.push('历史文化景点');
      if (data.preferences.natural) preferences.push('自然风光');
      if (data.preferences.food) preferences.push('美食体验');
      if (data.preferences.shopping) preferences.push('购物娱乐');

      const prompt = `请为我制定一个详细的旅行行程规划：
                      出发地：${data.startPoint}
                      目的地：${data.endPoint}
                      出行日期：${data.travelDate}
                      出行方式：${getTravelModeText(data.travelMode)}
                      预计时长：${getDurationText(data.duration)}
                      ${data.waypoints ? `途经地点：${data.waypoints}` : ''}
                      旅行偏好：${preferences.length > 0 ? preferences.join('、') : '无特殊偏好'}

                      请提供：
                      1. 详细的行程安排（按天分解）
                      2. 推荐的景点和活动
                      3. 交通建议
                      4. 住宿建议（如果是多天行程）
                      5. 美食推荐
                      6. 注意事项和小贴士

                      请用清晰的格式组织内容，方便阅读。`;

      // 使用流式接口
      await sendStreamChatMessage(sessionId, prompt, {
        onChunk: (chunk: StreamChunk) => {
          // 处理不同类型的数据块
          if (chunk.type === 'tool_call') {
            // 工具调用开始 - 后端已经包含了emoji和格式
            setItinerary(prev => prev + `\n${chunk.content}\n`);
          } else if (chunk.type === 'tool_result') {
            // 工具执行完成 - 后端已经包含了emoji和格式
            setItinerary(prev => prev + `${chunk.content}\n\n`);
          } else if (chunk.type === 'token') {
            // 流式文本输出 - 实时追加文本片段
            setIsStreaming(true);
            setIsLoading(false); // 开始接收token时，不再显示loading状态
            setItinerary(prev => prev + chunk.content);
          } else if (chunk.type === 'final') {
            // 最终响应 - 使用完整内容替换
            setItinerary(chunk.content);
            setIsStreaming(false);
          } else if (chunk.type === 'error') {
            // 错误信息
            setItinerary(prev => prev + `❌ 错误: ${chunk.content}\n`);
            setIsStreaming(false);
          }
        },
        onComplete: (finalContent: string) => {
          // 流式传输完成
          if (finalContent) {
            setItinerary(finalContent);
            // 保存到历史记录
            if (data && user) {
              const userInfo = { userId: userId!, username: username! };
              addItineraryToHistory(data, finalContent, userInfo).catch(error => {
                console.error('保存历史记录失败:', error);
              });
            }
          }
          setIsLoading(false);
          setIsStreaming(false);
        },
        onError: (error: Error) => {
          console.error('生成行程失败:', error);
          setItinerary('抱歉，生成行程时出现错误，请重试。');
          setIsLoading(false);
          setIsStreaming(false);
        }
      });
    } catch (error) {
      console.error('生成行程失败:', error);
      setItinerary('抱歉，生成行程时出现错误，请重试。');
      setIsLoading(false);
    }
  };

  // 获取出行方式文本
  const getTravelModeText = (mode: string) => {
    const modeMap: Record<string, string> = {
      driving: '驾车',
      walking: '步行',
      transit: '公交',
      cycling: '骑行'
    };
    return modeMap[mode] || mode;
  };

  // 获取时长文本
  const getDurationText = (duration: string) => {
    const durationMap: Record<string, string> = {
      'half-day': '半天',
      'one-day': '一天',
      'two-days': '两天',
      'three-days': '三天',
      'week': '一周',
      'custom': '自定义'
    };
    return durationMap[duration] || duration;
  };

  // 如果用户未认证，不渲染内容（会自动跳转到登录页）
  if (!shouldRender) {
    return null;
  }

  if (!itineraryData) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">行程规划</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-hidden">

        {/* 行程详情 */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col flex-1 min-h-0 h-[85vh]">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">AI 生成的行程规划</h2>
          </div>
          <div className="flex-1 overflow-y-scroll custom-scrollbar">
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className="text-gray-600">AI 正在为您生成个性化行程...</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 mb-3 mt-6 first:mt-0">{children}</h1>,
                      h2: ({children}) => <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-5 first:mt-0">{children}</h2>,
                      h3: ({children}) => <h3 className="text-base font-medium text-gray-900 mb-2 mt-4 first:mt-0">{children}</h3>,
                      p: ({children}) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700">{children}</ol>,
                      li: ({children}) => <li className="text-gray-700">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-blue-200 pl-4 py-2 mb-3 bg-blue-50 text-gray-700">{children}</blockquote>,
                      code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">{children}</code>,
                      pre: ({children}) => <pre className="bg-gray-100 p-3 rounded mb-3 overflow-x-auto">{children}</pre>,
                    }}
                  >
                    {itinerary}
                  </ReactMarkdown>

                  {/* 流式传输指示器 */}
                  {isStreaming && (
                    <div className="flex items-center space-x-2 mt-4 text-blue-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm">AI 正在生成内容...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
