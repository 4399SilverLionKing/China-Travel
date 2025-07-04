// 行程规划相关类型定义

export interface ItineraryPlanData {
  startPoint: string;
  endPoint: string;
  travelDate: string;
  travelMode: 'driving' | 'walking' | 'transit' | 'cycling' | '';
  waypoints?: string;
  duration: 'half-day' | 'one-day' | 'two-days' | 'three-days' | 'week' | 'custom' | '';
  preferences: {
    historical: boolean;
    natural: boolean;
    food: boolean;
    shopping: boolean;
  };
}

export interface ItineraryResponse {
  itinerary: string;
  sessionId: string;
}

// 历史行程记录
export interface ItineraryHistoryItem {
  id: string;                    // 历史记录ID
  generatedItinerary: string;    // 生成的行程内容
  createdAt: string;            // 创建时间 (yyyy-MM-dd HH:mm:ss)
  title: string;                // 行程标题
  userId?: number;              // 用户ID (可选)
  username?: string;            // 用户名 (可选)
}

// 历史记录列表
export interface ItineraryHistory {
  items: ItineraryHistoryItem[];
}

// 保存历史记录请求
export interface SaveHistoryRequest {
  title: string;
  generatedItinerary: string;
  userId?: number;
  username?: string;
  // 可以添加更多字段来存储行程规划的详细信息
  startPoint?: string;
  endPoint?: string;
  travelDate?: string;
  travelMode?: string;
  duration?: string;
  waypoints?: string;
}

// 分页查询历史记录请求
export interface HistoryPageRequest {
  userId?: number;              // 可选，按用户过滤
  title?: string;               // 可选，按标题模糊查询
  username?: string;            // 可选，按用户名模糊查询
  startTime?: string;           // 可选，开始时间
  endTime?: string;             // 可选，结束时间
  pageNum: number;              // 页码，从1开始
  pageSize: number;             // 每页大小
}

// 分页查询响应
export interface HistoryPageResponse {
  records: ItineraryHistoryItem[];  // 当前页数据
  total: number;                    // 总记录数
  current: number;                  // 当前页码
  size: number;                     // 每页大小
  pages: number;                    // 总页数
  hasPrevious: boolean;             // 是否有上一页
  hasNext: boolean;                 // 是否有下一页
}
