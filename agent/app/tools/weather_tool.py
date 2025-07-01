import requests
import json
from langchain.tools import tool
from app.core.config import settings

# 从配置获取API密钥
AMAP_API_KEY = settings.AMAP_API_KEY

# 接口请求地址
AMAP_WEATHER_URL = "https://restapi.amap.com/v3/weather/weatherInfo"
AMAP_DISTRICT_URL = "https://restapi.amap.com/v3/config/district"

# 缓存已查询过的城市adcode，避免重复请求
_city_adcode_cache = {}

# 获取城市adcode
def get_city_adcode(city_name: str) -> str:
    """
    根据城市名称获取adcode，使用高德地图API动态查询
    """
    # 清理城市名称
    clean_city_name = city_name.replace("市", "").replace("区", "").replace("县", "").strip()

    # 检查缓存
    if clean_city_name in _city_adcode_cache:
        return _city_adcode_cache[clean_city_name]

    try:
        # 使用行政区域查询API获取adcode
        adcode = _get_adcode_by_district_api(clean_city_name)
        if adcode:
            _city_adcode_cache[clean_city_name] = adcode
            return adcode

    except Exception as e:
        print(f"获取城市adcode时发生错误：{str(e)}")

    return ""

# 调用高德地图行政区域查询API
def _get_adcode_by_district_api(city_name: str) -> str:
    """
    使用行政区域查询API获取adcode
    """
    try:
        params = {
            'key': AMAP_API_KEY,
            'keywords': city_name,
            'subdistrict': 0,  # 不返回下级行政区
            'output': 'JSON'
        }

        response = requests.get(AMAP_DISTRICT_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        if data.get('status') == '1' and data.get('districts'):
            districts = data['districts']
            for district in districts:
                # 优先匹配完全相同的名称
                if district.get('name') == city_name or district.get('name') == city_name + '市':
                    return district.get('adcode', '')
                # 模糊匹配
                if city_name in district.get('name', '') or district.get('name', '') in city_name:
                    return district.get('adcode', '')

    except Exception as e:
        print(f"行政区域查询API调用失败：{str(e)}")

    return ""

@tool
def get_current_weather(location: str) -> str:
    """
    获取指定地点的当前天气信息。
    使用高德地图API获取实时天气数据。

    Args:
        location: 城市名称，如"北京"、"上海"等

    Returns:
        包含天气信息的字符串
    """
    try:
        # 获取城市的adcode
        adcode = get_city_adcode(location)
        if not adcode:
            return f"抱歉，无法找到 {location} 的城市编码，请检查城市名称是否正确。支持查询中国大陆地区的城市天气信息。"

        # 构建请求参数
        params = {
            'key': AMAP_API_KEY,
            'city': adcode,
            'extensions': 'base',  # base: 实况天气, all: 预报天气
            'output': 'JSON'
        }

        # 发送请求
        response = requests.get(AMAP_WEATHER_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        # 检查API响应状态
        if data.get('status') != '1':
            return f"获取天气信息失败：{data.get('info', '未知错误')}"

        # 解析天气数据
        lives = data.get('lives', [])
        if not lives:
            return f"未找到 {location} 的天气数据"

        return lives[0]

    except requests.exceptions.RequestException as e:
        return f"网络请求失败：{str(e)}"
    except json.JSONDecodeError:
        return "解析天气数据失败"
    except Exception as e:
        return f"获取天气信息时发生错误：{str(e)}"

@tool
def get_weather_forecast(location: str) -> str:
    """
    获取指定地点的天气预报信息。
    使用高德地图API获取未来几天的天气预报。

    Args:
        location: 城市名称，如"北京"、"上海"等

    Returns:
        包含天气预报信息的字符串
    """
    try:
        # 获取城市的adcode
        adcode = get_city_adcode(location)
        if not adcode:
            return f"抱歉，无法找到 {location} 的城市编码，请检查城市名称是否正确。支持查询中国大陆地区的城市天气预报。"

        # 构建请求参数
        params = {
            'key': AMAP_API_KEY,
            'city': adcode,
            'extensions': 'all',  # all: 预报天气
            'output': 'JSON'
        }

        # 发送请求
        response = requests.get(AMAP_WEATHER_URL, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        # 检查API响应状态
        if data.get('status') != '1':
            return f"获取天气预报失败：{data.get('info', '未知错误')}"

        # 解析预报数据
        forecasts = data.get('forecasts', [])
        if not forecasts:
            return f"未找到 {location} 的天气预报数据"

        forecast_info = forecasts[0]
        casts = forecast_info.get('casts', [])

        if not casts:
            return f"未找到 {location} 的详细预报数据"

        return forecast_info

    except requests.exceptions.RequestException as e:
        return f"网络请求失败：{str(e)}"
    except json.JSONDecodeError:
        return "解析天气预报数据失败"
    except Exception as e:
        return f"获取天气预报时发生错误：{str(e)}"

all_tools = [get_current_weather, get_weather_forecast]