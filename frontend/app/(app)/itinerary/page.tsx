'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, History, Calendar, Trash2, Eye, Plus } from 'lucide-react';
import { ItineraryHistoryItem } from '@/lib/types/itinerary';
import { getItineraryHistory, removeItineraryFromHistory, clearItineraryHistory } from '@/lib/utils/itinerary-history';
import { useAuthGuard, useCurrentUser } from '@/lib/hooks/useAuthGuard';

export default function ItineraryHistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<ItineraryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 使用认证保护
  const { shouldRender } = useAuthGuard();
  const { user, userId, username } = useCurrentUser();

  useEffect(() => {
    if (shouldRender && user) {
      loadHistory();
    }
  }, [shouldRender, user]);

  const loadHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userInfo = { userId: userId!, username: username! };
      const history = await getItineraryHistory(userInfo);
      setHistoryItems(history);
    } catch (error) {
      console.error('加载历史记录失败:', error);
      setHistoryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除历史记录项
  const handleDeleteItem = async (id: string) => {
    if (!user) return;

    if (confirm('确定要删除这条历史记录吗？')) {
      try {
        const userInfo = { userId: userId!, username: username! };
        await removeItineraryFromHistory(id, userInfo);
        await loadHistory();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  // 清空所有历史记录
  const handleClearAll = async () => {
    if (!user) return;

    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      try {
        const userInfo = { userId: userId!, username: username! };
        await clearItineraryHistory(userInfo);
        await loadHistory();
      } catch (error) {
        console.error('清空失败:', error);
        alert('清空失败，请重试');
      }
    }
  };

  // 查看历史记录详情
  const handleViewDetail = (item: ItineraryHistoryItem) => {
    // 可以跳转到详情页面或者在当前页面显示详情
    router.push(`/itinerary/detail/${item.id}`);
  };

  // 如果用户未认证，不渲染内容（会自动跳转到登录页）
  if (!shouldRender) {
    return null;
  }

  if (isLoading) {
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
            <h1 className="text-xl font-bold">历史记录</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <History className="w-8 h-8 animate-pulse mx-auto mb-2 text-blue-500" />
            <p className="text-gray-600">正在加载历史记录...</p>
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
            <h1 className="text-xl font-bold">历史记录</h1>
          </div>
          <div className="flex items-center space-x-2">
            {historyItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 text-red-600 bg-red-50 rounded-lg transition-colors"
              >
                清空全部
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 ">
        {historyItems.length === 0 ? (
          // 空状态
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <History className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">暂无历史记录</h3>
            <p className="text-sm text-gray-400 mb-6">您还没有创建过任何行程规划</p>
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>创建第一个行程</span>
            </button>
          </div>
        ) : (
          // 历史记录列表
          <div className="p-4 h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>创建时间：{item.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
