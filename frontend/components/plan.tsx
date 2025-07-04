"use client";

import { Route, MapPin, Clock, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { ItineraryPlanData } from "@/lib/types/itinerary";

interface PlanContentProps {
  onPlanSubmit: (data: ItineraryPlanData) => void;
}

export function PlanContent({ onPlanSubmit }: PlanContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ItineraryPlanData>({
    startPoint: '',
    endPoint: '',
    travelDate: '',
    travelMode: '',
    waypoints: '',
    duration: '',
    preferences: {
      historical: false,
      natural: false,
      food: false,
      shopping: false
    }
  });

  // 处理表单输入变化
  const handleInputChange = (field: keyof ItineraryPlanData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理偏好选择变化
  const handlePreferenceChange = (preference: keyof ItineraryPlanData['preferences']) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!formData.startPoint.trim()) {
      alert('请输入出发地点');
      return false;
    }
    if (!formData.endPoint.trim()) {
      alert('请输入目的地');
      return false;
    }
    if (!formData.travelDate) {
      alert('请选择出行日期');
      return false;
    }
    if (!formData.travelMode) {
      alert('请选择出行方式');
      return false;
    }
    return true;
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 通过回调函数传递数据
      onPlanSubmit(formData);
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-6">
      <div className="text-center">
        <Route className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">行程规划</h2>
        <p className="text-gray-600">为您的旅行制定完美的路线</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="font-medium">起点</span>
          </div>
          <input
            type="text"
            placeholder="请输入出发地点"
            value={formData.startPoint}
            onChange={(e) => handleInputChange('startPoint', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-green-500" />
            <span className="font-medium">终点</span>
          </div>
          <input
            type="text"
            placeholder="请输入目的地"
            value={formData.endPoint}
            onChange={(e) => handleInputChange('endPoint', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="font-medium">出行日期</span>
          </div>
          <input
            type="date"
            value={formData.travelDate}
            onChange={(e) => handleInputChange('travelDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="font-medium">出行方式</span>
          </div>
          <select
            value={formData.travelMode}
            onChange={(e) => handleInputChange('travelMode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择出行方式</option>
            <option value="driving">驾车</option>
            <option value="walking">步行</option>
            <option value="transit">公交</option>
            <option value="cycling">骑行</option>
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-medium">途经地点</span>
          </div>
          <textarea
            placeholder="请输入想要途经的地点（可选）"
            rows={3}
            value={formData.waypoints}
            onChange={(e) => handleInputChange('waypoints', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">预计时长</span>
          </div>
          <select
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择预计时长</option>
            <option value="half-day">半天</option>
            <option value="one-day">一天</option>
            <option value="two-days">两天</option>
            <option value="three-days">三天</option>
            <option value="week">一周</option>
            <option value="custom">自定义</option>
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Route className="w-5 h-5 text-pink-500" />
            <span className="font-medium">旅行偏好</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.historical}
                onChange={() => handlePreferenceChange('historical')}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">历史文化景点</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.natural}
                onChange={() => handlePreferenceChange('natural')}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">自然风光</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.food}
                onChange={() => handlePreferenceChange('food')}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">美食体验</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.shopping}
                onChange={() => handlePreferenceChange('shopping')}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">购物娱乐</span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{isSubmitting ? '正在规划...' : '开始规划路线'}</span>
      </button>
      </div>
    </div>
  );
}