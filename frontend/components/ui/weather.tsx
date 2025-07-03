'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card } from './card';
import { getCurrentWeather } from '@/lib/api/python/chat';
import { Cloud, Loader2 } from 'lucide-react';

export function WeatherComponent() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCurrentWeather();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取天气信息失败');
      console.error('获取天气失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Cloud className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">天气信息</h2>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleGetWeather}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              获取中...
            </>
          ) : (
            '获取当前天气'
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {weatherData && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium mb-2">天气数据：</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(weatherData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
