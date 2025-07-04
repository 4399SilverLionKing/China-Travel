import { apiRequest } from './http';
import {
  ItineraryHistoryItem,
  SaveHistoryRequest,
  HistoryPageRequest,
  HistoryPageResponse
} from '@/lib/types/itinerary';
import { ApiResponse } from '@/lib/types/common';

// 保存历史记录
export async function saveHistory(request: SaveHistoryRequest): Promise<ItineraryHistoryItem> {
  const response = await apiRequest<ApiResponse<ItineraryHistoryItem>>('/api/history/save', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '保存历史记录失败');
  }

  return response.data;
}

// 根据ID删除历史记录
export async function deleteHistoryById(id: string): Promise<string> {
  const response = await apiRequest<ApiResponse<string>>(`/api/history/${id}`, {
    method: 'DELETE',
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '删除历史记录失败');
  }

  return response.data;
}

// 根据用户ID删除所有历史记录
export async function deleteHistoryByUserId(userId: number): Promise<string> {
  const response = await apiRequest<ApiResponse<string>>(`/api/history/user/${userId}`, {
    method: 'DELETE',
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '删除用户历史记录失败');
  }

  return response.data;
}

// 根据ID查询历史记录
export async function getHistoryById(id: string): Promise<ItineraryHistoryItem> {
  const response = await apiRequest<ApiResponse<ItineraryHistoryItem>>(`/api/history/${id}`, {
    method: 'GET',
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '查询历史记录失败');
  }

  return response.data;
}

// 根据用户ID查询历史记录列表
export async function getHistoryByUserId(userId: number): Promise<ItineraryHistoryItem[]> {
  const response = await apiRequest<ApiResponse<ItineraryHistoryItem[]>>(`/api/history/user/${userId}`, {
    method: 'GET',
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '查询用户历史记录失败');
  }

  return response.data;
}

// 分页查询历史记录
export async function getHistoryPage(request: HistoryPageRequest): Promise<HistoryPageResponse> {
  const response = await apiRequest<ApiResponse<HistoryPageResponse>>('/api/history/page', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '分页查询历史记录失败');
  }

  return response.data;
}

// 查询所有历史记录
export async function getAllHistory(): Promise<ItineraryHistoryItem[]> {
  const response = await apiRequest<ApiResponse<ItineraryHistoryItem[]>>('/api/history/all', {
    method: 'GET',
  });

  if (response.code !== 10000) {
    throw new Error(response.message || '查询所有历史记录失败');
  }

  return response.data;
}

// 根据标题搜索历史记录
export async function searchHistoryByTitle(title: string): Promise<ItineraryHistoryItem[]> {
  const response = await apiRequest<ApiResponse<ItineraryHistoryItem[]>>(
    `/api/history/search?title=${encodeURIComponent(title)}`,
    {
      method: 'GET',
    }
  );

  if (response.code !== 10000) {
    throw new Error(response.message || '搜索历史记录失败');
  }

  return response.data;
}