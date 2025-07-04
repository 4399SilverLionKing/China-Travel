import { ItineraryPlanData, ItineraryHistoryItem, SaveHistoryRequest } from '@/lib/types/itinerary';
import {
  saveHistory,
  deleteHistoryById,
  deleteHistoryByUserId,
  getHistoryById,
  getHistoryByUserId,
  searchHistoryByTitle
} from '@/lib/api/java/history';

// 用户信息接口
interface UserInfo {
  userId: number;
  username: string;
}

// 生成行程标题
export function generateItineraryTitle(planData: ItineraryPlanData): string {
  const { startPoint, endPoint, travelDate } = planData;
  const date = new Date(travelDate).toLocaleDateString('zh-CN');
  return `${startPoint} 到 ${endPoint} - ${date}`;
}

// 获取历史记录列表（需要用户信息）
export async function getItineraryHistory(userInfo: UserInfo | null): Promise<ItineraryHistoryItem[]> {
  if (!userInfo) {
    throw new Error('用户未登录，无法获取历史记录');
  }

  try {
    return await getHistoryByUserId(userInfo.userId);
  } catch (error) {
    console.error('获取历史记录失败:', error);
    throw error;
  }
}

// 添加新的历史记录（需要用户信息）
export async function addItineraryToHistory(
  planData: ItineraryPlanData,
  generatedItinerary: string,
  userInfo: UserInfo | null
): Promise<ItineraryHistoryItem> {
  if (!userInfo) {
    throw new Error('用户未登录，无法保存历史记录');
  }

  const title = generateItineraryTitle(planData);

  try {
    const request: SaveHistoryRequest = {
      title,
      generatedItinerary,
      userId: userInfo.userId,
      username: userInfo.username,
      startPoint: planData.startPoint,
      endPoint: planData.endPoint,
      travelDate: planData.travelDate,
      travelMode: planData.travelMode,
      duration: planData.duration,
      waypoints: planData.waypoints,
    };
    return await saveHistory(request);
  } catch (error) {
    console.error('保存历史记录失败:', error);
    throw error;
  }
}

// 删除历史记录（需要用户信息）
export async function removeItineraryFromHistory(id: string, userInfo: UserInfo | null): Promise<void> {
  if (!userInfo) {
    throw new Error('用户未登录，无法删除历史记录');
  }

  try {
    await deleteHistoryById(id);
  } catch (error) {
    console.error('删除历史记录失败:', error);
    throw error;
  }
}

// 清空所有历史记录（需要用户信息）
export async function clearItineraryHistory(userInfo: UserInfo | null): Promise<void> {
  if (!userInfo) {
    throw new Error('用户未登录，无法清空历史记录');
  }

  try {
    await deleteHistoryByUserId(userInfo.userId);
  } catch (error) {
    console.error('清空历史记录失败:', error);
    throw error;
  }
}

// 根据ID获取历史记录项（需要用户信息）
export async function getItineraryHistoryItem(id: string, userInfo: UserInfo | null): Promise<ItineraryHistoryItem | null> {
  if (!userInfo) {
    throw new Error('用户未登录，无法获取历史记录详情');
  }

  try {
    return await getHistoryById(id);
  } catch (error) {
    console.error('获取历史记录项失败:', error);
    throw error;
  }
}

// 搜索历史记录（需要用户信息）
export async function searchItineraryHistory(keyword: string, userInfo: UserInfo | null): Promise<ItineraryHistoryItem[]> {
  if (!userInfo) {
    throw new Error('用户未登录，无法搜索历史记录');
  }

  try {
    return await searchHistoryByTitle(keyword);
  } catch (error) {
    console.error('搜索历史记录失败:', error);
    throw error;
  }
}
