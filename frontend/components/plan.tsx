"use client";

import { Route, MapPin, Clock, Calendar } from "lucide-react";

export function PlanContent() {
  return (
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="font-medium">出行方式</span>
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">请选择出行方式</option>
            <option value="driving">驾车</option>
            <option value="walking">步行</option>
            <option value="transit">公交</option>
            <option value="cycling">骑行</option>
          </select>
        </div>
      </div>

      <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
        开始规划路线
      </button>
    </div>
  );
}