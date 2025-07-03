"use client";

import { Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react";
import { useState, useEffect } from "react";

interface WeatherData {
  temperature: string;
  weather: string;
  humidity: string;
  windDirection: string;
  windPower: string;
  city: string;
}

interface WeatherContentProps {
  map?: any;
  AMap?: any;
}

export function WeatherContent({ map, AMap }: WeatherContentProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeatherIcon = (weather: string) => {
    if (weather.includes("晴")) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (weather.includes("雨")) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (weather.includes("云")) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <Cloud className="w-8 h-8 text-gray-500" />;
  };

  // 根据坐标获取天气信息
  const fetchWeatherByLocation = async (lng: number, lat: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || '11bc90d13674d2dad543c1fda27c8fa6';

      // 首先通过逆地理编码获取城市信息
      const geocodeResponse = await fetch(
        `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_API_KEY}&location=${lng},${lat}&extensions=base&batch=false&roadlevel=0`
      );

      const geocodeData = await geocodeResponse.json();
      console.log('逆地理编码结果:', geocodeData);

      if (geocodeData.status === '1' && geocodeData.regeocode) {
        const addressComponent = geocodeData.regeocode.addressComponent;
        console.log('地址组件:', addressComponent);

        // 更完善的城市名称获取逻辑
        let cityName = '';
        if (addressComponent.city && addressComponent.city !== '') {
          cityName = addressComponent.city;
        } else if (addressComponent.province && addressComponent.province !== '') {
          cityName = addressComponent.province;
        } else if (addressComponent.district && addressComponent.district !== '') {
          cityName = addressComponent.district;
        } else {
          // 如果都没有，使用adcode查询
          cityName = addressComponent.adcode;
        }

        console.log('获取到的城市名称:', cityName);

        if (!cityName) {
          throw new Error('无法获取城市信息');
        }

        // 获取天气信息
        const weatherResponse = await fetch(
          `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_API_KEY}&city=${encodeURIComponent(cityName)}&extensions=base`
        );

        const weatherData = await weatherResponse.json();
        console.log('天气数据:', weatherData);

        if (weatherData.status === '1' && weatherData.lives && weatherData.lives.length > 0) {
          const weather = weatherData.lives[0];
          setWeatherData({
            temperature: weather.temperature,
            weather: weather.weather,
            humidity: weather.humidity,
            windDirection: weather.winddirection,
            windPower: weather.windpower,
            city: weather.city
          });
        } else {
          setError('无法获取天气数据');
        }
      } else {
        setError('无法获取位置信息');
      }
    } catch (error) {
      console.error('获取位置天气信息失败:', error);
      setError(error instanceof Error ? error.message : '获取天气信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 自动获取地图当前中心点的天气
  useEffect(() => {
    if (map && AMap) {
      const center = map.getCenter();
      const lng = center.getLng();
      const lat = center.getLat();
      fetchWeatherByLocation(lng, lat);
    }
  }, [map, AMap]);

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div className="text-center">
        <Cloud className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">天气信息</h2>
        <p className="text-gray-600">当前地图位置的天气状况</p>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在获取天气信息...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">获取天气信息失败</p>
          </div>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {weatherData && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{weatherData.city}</h3>
              <div className="flex items-center justify-center space-x-3">
                {getWeatherIcon(weatherData.weather)}
                <span className="text-3xl font-bold text-gray-900">{weatherData.temperature}°C</span>
              </div>
              <p className="text-lg text-gray-700 mt-2">{weatherData.weather}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">湿度</p>
                <p className="font-bold text-gray-900">{weatherData.humidity}%</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Wind className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">风力</p>
                <p className="font-bold text-gray-900">{weatherData.windPower}级</p>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">风向: {weatherData.windDirection}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}