package com.asta.backend.entity.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 历史记录返回数据类
 *
 * @author asta
 * @since 2025-07-04
 */
@Data
public class ItineraryHistoryVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 历史记录ID
     */
    private String id;

    /**
     * 生成的行程内容
     */
    private String generatedItinerary;

    /**
     * 创建时间
     */
    private String createdAt;

    /**
     * 行程标题
     */
    private String title;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 用户名
     */
    private String username;
}
