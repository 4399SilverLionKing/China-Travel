'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Route, Trash2 } from 'lucide-react';
import { ItineraryHistoryItem } from '@/lib/types/itinerary';
import { getItineraryHistoryItem, removeItineraryFromHistory } from '@/lib/utils/itinerary-history';
import { useAuthGuard, useCurrentUser } from '@/lib/hooks/useAuthGuard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ItineraryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<ItineraryHistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 使用认证保护
  const { shouldRender } = useAuthGuard();
  const { user, userId, username } = useCurrentUser();

  useEffect(() => {
    if (!shouldRender || !user) return;

    const loadItem = async () => {
      const id = params.id as string;
      if (id) {
        try {
          const userInfo = { userId: userId!, username: username! };
          const historyItem = await getItineraryHistoryItem(id, userInfo);
          setItem(historyItem);
        } catch (error) {
          console.error('获取历史记录详情失败:', error);
          setItem(null);
        }
      }
      setIsLoading(false);
    };

    loadItem();
  }, [params.id, shouldRender, user, userId, username]);

  // 删除记录
  const handleDelete = async () => {
    if (!user || !item) return;

    if (confirm('确定要删除这条历史记录吗？')) {
      try {
        const userInfo = { userId: userId!, username: username! };
        await removeItineraryFromHistory(item.id, userInfo);
        router.push('/itinerary');
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      }
    }
  };



  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 如果用户未认证，不渲染内容（会自动跳转到登录页）
  if (!shouldRender) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Route className="w-8 h-8 animate-pulse mx-auto mb-2 text-blue-500" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">行程详情</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Route className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2 text-gray-500">记录不存在</h3>
            <p className="text-sm text-gray-400 mb-6">该历史记录可能已被删除</p>
            <button
              onClick={() => router.push('/itinerary')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              返回历史记录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">行程详情</h1>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>删除</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* 行程信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">{item.title}</h2>
          <div className="flex items-center space-x-2 w-auto">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">创建时间：</span>
            <span className="font-medium">{formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* 行程详情 */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col flex-1 min-h-0 h-[70vh]">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">AI 生成的行程规划</h2>
          </div>
          <div className="flex-1 overflow-y-scroll custom-scrollbar">
            <div className="p-4">
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
                  {item.generatedItinerary}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
