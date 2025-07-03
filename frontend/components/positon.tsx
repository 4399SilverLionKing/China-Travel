"use client";

import { Navigation, MapPin, Compass, MessageCircle, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { sendChatMessage, generateSessionId } from "@/lib/api/python/chat";

interface PositionContentProps {
  map?: any;
  AMap?: any;
}

export function PositionContent({ map, AMap }: PositionContentProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [locationIntroduction, setLocationIntroduction] = useState<string>("");
  const [isLoadingIntroduction, setIsLoadingIntroduction] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [sessionId] = useState(() => generateSessionId());

  // 获取地址信息
  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || '11bc90d13674d2dad543c1fda27c8fa6';
      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_API_KEY}&location=${longitude},${latitude}&extensions=base&batch=false&roadlevel=0`
      );
      const data = await response.json();

      if (data.status === '1' && data.regeocode) {
        return data.regeocode.formatted_address;
      }
      return null;
    } catch (error) {
      console.error("获取地址失败:", error);
      return null;
    }
  };

  // 获取位置介绍
  const getLocationIntroduction = async (address: string, latitude: number, longitude: number) => {
    setIsLoadingIntroduction(true);
    try {
      const prompt = `请为我介绍一下这个位置：${address}（坐标：${latitude.toFixed(6)}, ${longitude.toFixed(6)}）。请包括这个地方的特色、历史、文化、旅游景点、美食等信息，用简洁生动的语言描述，大约200-300字。`;

      const response = await sendChatMessage(sessionId, prompt);
      setLocationIntroduction(response.response);
    } catch (error) {
      console.error("获取位置介绍失败:", error);
      setLocationIntroduction("抱歉，无法获取该位置的介绍信息。");
    } finally {
      setIsLoadingIntroduction(false);
    }
  };

  // 获取地图中心位置信息
  const getMapCenterLocation = async () => {
    if (!map || !AMap) {
      console.warn('地图未初始化');
      return;
    }

    setIsLoadingLocation(true);
    setLocationIntroduction("");

    try {
      // 获取地图中心点
      const center = map.getCenter();
      const longitude = center.getLng();
      const latitude = center.getLat();

      // 获取地址信息
      const address = await getAddressFromCoords(latitude, longitude);

      setCurrentLocation({
        latitude,
        longitude,
        address: address || undefined,
      });

      // 获取位置介绍
      if (address) {
        await getLocationIntroduction(address, latitude, longitude);
      }
    } catch (error) {
      console.error("获取地图中心位置失败:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // 自动获取地图中心位置
  useEffect(() => {
    if (map && AMap) {
      getMapCenterLocation();
    }
  }, [map, AMap]);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <Navigation className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">位置介绍</h2>
        <p className="text-gray-600">当前地图中心位置信息</p>
      </div>

      <div className="space-y-4">
        {currentLocation && (
          <div className="space-y-4">

            {/* 位置介绍区域 */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              {isLoadingIntroduction ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI 正在为您生成位置介绍...</span>
                </div>
              ) : (
                <div className="text-sm text-blue-800 leading-relaxed">
                  {locationIntroduction}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}