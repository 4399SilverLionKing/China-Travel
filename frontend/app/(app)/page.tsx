'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Menu, Navigation, Cloud, Route } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import { PlanContent } from '@/components/plan';
import { PositionContent } from '@/components/positon';
import { WeatherContent } from '@/components/weather';
import { ItineraryPlanData } from '@/lib/types/itinerary';
import { useRouter } from 'next/navigation';
import { useItinerary } from '@/lib/contexts/itinerary-context';

// 高德地图API Key
const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || '';

interface SearchResult {
  id: string;
  name: string;
  address: string;
  location: string;
  district: string;
}

export default function Home() {
  const router = useRouter();
  const { setItineraryData } = useItinerary();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [AMap, setAMap] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'plan' | 'position' | 'weather' | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 获取用户当前位置
  const getCurrentLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理位置获取'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          resolve([longitude, latitude]);
        },
        (error) => {
          console.warn('获取位置失败:', error.message);
          // 如果获取位置失败，使用默认位置（北京）
          resolve([116.397428, 39.90923]);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分钟缓存
        }
      );
    });
  };

  // 初始化地图
  useEffect(() => {
    const initMap = async () => {
      // 确保在客户端环境中运行
      if (typeof window === 'undefined') return;

      if (!AMAP_API_KEY) {
        console.error('高德地图API Key未配置，请检查环境变量 NEXT_PUBLIC_AMAP_API_KEY');
        return;
      }

      try {
        // 动态导入 AMapLoader 避免 SSR 问题
        const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;

        const AMapInstance = await AMapLoader.load({
          key: AMAP_API_KEY,
          version: '2.0',
          plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.Geocoder']
        });

        // 获取用户当前位置
        const currentLocation = await getCurrentLocation();

        if (mapContainer.current) {
          const mapInstance = new AMapInstance.Map(mapContainer.current, {
            zoom: 15, // 提高缩放级别以更好地显示当前位置
            center: currentLocation, // 使用用户当前位置
            mapStyle: 'amap://styles/normal',
            viewMode: '2D',
            showLabel: true,
            // 设置地图边距，为底部导航留出空间
            margin: {
              bottom: 64
            }
          });

          // 在当前位置添加标记
          const marker = new AMapInstance.Marker({
            position: currentLocation,
            title: '当前位置',
            icon: new AMapInstance.Icon({
              size: new AMapInstance.Size(25, 34),
              image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
            })
          });
          mapInstance.add(marker);

          setMap(mapInstance);
          setAMap(AMapInstance);
          setIsMapLoading(false);
        }
      } catch (error) {
        console.error('地图加载失败:', error);
        setIsMapLoading(false);
      }
    };

    initMap();
  }, []);

  // 点击外部关闭搜索结果和菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
      if (!target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 搜索地点
  const searchPlaces = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      // 使用高德地图Web API进行搜索
      const response = await fetch(
        `https://restapi.amap.com/v3/assistant/inputtips?key=${AMAP_API_KEY}&keywords=${encodeURIComponent(keyword)}&datatype=all`
      );

      const data = await response.json();
      setIsSearching(false);

      console.log('搜索状态:', data.status, '搜索结果:', data);

      if (data.status === '1' && data.tips && data.tips.length > 0) {
        const results: SearchResult[] = data.tips
          .filter((tip: any) => tip.location && tip.location !== '') // 过滤掉没有坐标的结果
          .map((tip: any) => ({
            id: tip.id || Math.random().toString(),
            name: tip.name,
            address: tip.address || '',
            location: tip.location,
            district: tip.district || ''
          }));

        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setIsSearching(false);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // 处理搜索输入
  const handleSearchInput = (value: string) => {
    setSearchKeyword(value);

    // 清除之前的搜索定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 防抖搜索
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  // 选择搜索结果
  const selectSearchResult = (result: SearchResult) => {
    if (!map || !AMap) return;

    const [lng, lat] = result.location.split(',').map(Number);

    // 移动地图中心到选中位置
    map.setCenter([lng, lat]);
    map.setZoom(15);

    // 添加标记
    map.clearMap(); // 清除之前的标记
    const marker = new AMap.Marker({
      position: [lng, lat],
      title: result.name
    });
    map.add(marker);

    // 添加信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="font-bold text-lg mb-2">${result.name}</h3>
          <p class="text-gray-600 mb-1">${result.address}</p>
          <p class="text-gray-500 text-sm">${result.district}</p>
        </div>
      `,
      offset: new AMap.Pixel(0, -30)
    });

    marker.on('click', () => {
      infoWindow.open(map, [lng, lat]);
    });

    // 隐藏搜索结果
    setShowResults(false);
    setSearchKeyword(result.name);
  };

  // 处理菜单选项点击
  const handleMenuOption = (option: 'plan' | 'position' | 'weather') => {
    setActiveDrawer(option);
    setShowMenu(false);
  };

  // 处理行程规划提交
  const handlePlanSubmit = (data: ItineraryPlanData) => {
    setItineraryData(data);
    setActiveDrawer(null); // 关闭抽屉
    // 跳转到行程规划页面，生成新的行程
    router.push('/itinerary/plan');
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* 搜索栏 */}
      <div className="relative z-10 p-4 bg-white shadow-sm w-full rounded-b-2xl">
        {/* 菜单按钮 - 绝对定位在左侧 */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 menu-container">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center w-6 h-6  hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* 菜单弹窗 */}
          {showMenu && (
            <div className="absolute left-0 top-[7vh] mt-2 w-atuo bg-white border border-gray-200 rounded-lg shadow-lg z-30">
              <div className="py-2">
                <button
                  onClick={() => handleMenuOption('position')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Navigation className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleMenuOption('weather')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Cloud className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleMenuOption('plan')}
                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Route className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 搜索输入框 - 居中对齐，忽略左侧按钮 */}
        <div className="flex justify-center search-container">
          <div className="relative w-[70vw] ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="搜索地点..."
              className="w-full pl-10 pr-4 py-3 h-[5vh] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* 搜索结果下拉列表 */}
          {showResults && (
            searchResults.length > 0 ? (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-20">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => selectSearchResult(result)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{result.name}</h4>
                        {result.address && (
                          <p className="text-sm text-gray-600 truncate">{result.address}</p>
                        )}
                        {result.district && (
                          <p className="text-xs text-gray-500">{result.district}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              searchKeyword.trim() && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-3 text-center text-gray-500">
                    未找到相关地点
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* 地图容器 */}
      <div className="flex-1 relative bottom-15">
        {isMapLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">地图加载中...</p>
            </div>
          </div>
        )}
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Drawer 组件 */}
      <Drawer open={activeDrawer !== null} onOpenChange={(open) => !open && setActiveDrawer(null)}>
        <DrawerTitle>
          {activeDrawer === 'plan' && '行程规划'}
          {activeDrawer === 'position' && '位置介绍'}
          {activeDrawer === 'weather' && '天气预报'}
        </DrawerTitle>
        <DrawerContent className='h-[60vh]'>
          {activeDrawer === 'plan' && <PlanContent onPlanSubmit={handlePlanSubmit} />}
          {activeDrawer === 'position' && <PositionContent map={map} AMap={AMap} />}
          {activeDrawer === 'weather' && <WeatherContent map={map} AMap={AMap} />}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
