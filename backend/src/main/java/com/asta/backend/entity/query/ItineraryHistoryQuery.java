package com.asta.backend.entity.query;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 历史记录查询参数类
 *
 * @author asta
 * @since 2025-07-04
 */
@Getter
@Setter
@ToString
public class ItineraryHistoryQuery extends PageQuery {

    /**
     * 历史记录ID
     */
    private String id;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 行程标题（模糊查询）
     */
    private String title;

    /**
     * 开始时间（格式：yyyy-MM-dd HH:mm:ss）
     */
    private String startTime;

    /**
     * 结束时间（格式：yyyy-MM-dd HH:mm:ss）
     */
    private String endTime;
}
