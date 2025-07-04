package com.asta.backend.constant;

public class RedisConstant {

    /**
     * 历史记录相关Redis键前缀
     */
    public static final String ITINERARY_HISTORY_PREFIX = "itinerary:history:";

    /**
     * 用户历史记录列表键前缀
     */
    public static final String USER_HISTORY_LIST_PREFIX = "user:history:list:";

    /**
     * 历史记录ID计数器键
     */
    public static final String HISTORY_ID_COUNTER = "itinerary:history:id:counter";

}
