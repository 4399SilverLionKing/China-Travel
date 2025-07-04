package com.asta.backend.entity.po;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;

/**
 * 历史行程记录实体类
 *
 * @author asta
 * @since 2025-07-04
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ItineraryHistoryItem implements Serializable {

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
     * 用户ID（关联用户）
     */
    private Integer userId;

    /**
     * 用户名（冗余字段，便于查询）
     */
    private String username;
}
