package com.asta.backend.service.impl;

import com.asta.backend.constant.RedisConstant;
import com.asta.backend.entity.po.ItineraryHistoryItem;
import com.asta.backend.entity.query.ItineraryHistoryQuery;
import com.asta.backend.entity.vo.ItineraryHistoryVO;
import com.asta.backend.entity.vo.PageVO;
import com.asta.backend.service.IItineraryHistoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 历史记录服务实现类
 *
 * @author asta
 * @since 2025-07-04
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryHistoryServiceImpl implements IItineraryHistoryService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public ItineraryHistoryVO saveHistory(ItineraryHistoryItem historyItem) {
        try {
            // 生成唯一ID
            if (!StringUtils.hasText(historyItem.getId())) {
                historyItem.setId(generateHistoryId());
            }

            // 设置创建时间
            if (!StringUtils.hasText(historyItem.getCreatedAt())) {
                historyItem.setCreatedAt(LocalDateTime.now().format(FORMATTER));
            }

            // 保存到Redis
            String key = RedisConstant.ITINERARY_HISTORY_PREFIX + historyItem.getId();
            String jsonValue = objectMapper.writeValueAsString(historyItem);
            redisTemplate.opsForValue().set(key, jsonValue);

            // 添加到用户历史记录列表
            if (historyItem.getUserId() != null) {
                String userListKey = RedisConstant.USER_HISTORY_LIST_PREFIX + historyItem.getUserId();
                redisTemplate.opsForList().leftPush(userListKey, historyItem.getId());
            }

            log.info("保存历史记录成功，ID: {}", historyItem.getId());
            return convertToVO(historyItem);

        } catch (JsonProcessingException e) {
            log.error("保存历史记录失败，序列化错误: {}", e.getMessage());
            throw new RuntimeException("保存历史记录失败", e);
        }
    }

    @Override
    public Boolean deleteHistoryById(String id) {
        try {
            String key = RedisConstant.ITINERARY_HISTORY_PREFIX + id;
            
            // 先获取历史记录以获取用户ID
            ItineraryHistoryItem historyItem = getHistoryItemById(id);
            if (historyItem == null) {
                return false;
            }

            // 从Redis删除
            Boolean deleted = redisTemplate.delete(key);

            // 从用户历史记录列表中删除
            if (historyItem.getUserId() != null) {
                String userListKey = RedisConstant.USER_HISTORY_LIST_PREFIX + historyItem.getUserId();
                redisTemplate.opsForList().remove(userListKey, 1, id);
            }

            log.info("删除历史记录成功，ID: {}", id);
            return deleted;

        } catch (Exception e) {
            log.error("删除历史记录失败，ID: {}, 错误: {}", id, e.getMessage());
            return false;
        }
    }

    @Override
    public Long deleteHistoryByUserId(Integer userId) {
        try {
            String userListKey = RedisConstant.USER_HISTORY_LIST_PREFIX + userId;
            
            // 获取用户所有历史记录ID
            List<Object> historyIds = redisTemplate.opsForList().range(userListKey, 0, -1);
            if (historyIds == null || historyIds.isEmpty()) {
                return 0L;
            }

            long deletedCount = 0;
            // 删除每个历史记录
            for (Object idObj : historyIds) {
                String id = idObj.toString();
                String key = RedisConstant.ITINERARY_HISTORY_PREFIX + id;
                if (redisTemplate.delete(key)) {
                    deletedCount++;
                }
            }

            // 删除用户历史记录列表
            redisTemplate.delete(userListKey);

            log.info("删除用户历史记录成功，用户ID: {}, 删除数量: {}", userId, deletedCount);
            return deletedCount;

        } catch (Exception e) {
            log.error("删除用户历史记录失败，用户ID: {}, 错误: {}", userId, e.getMessage());
            return 0L;
        }
    }

    @Override
    public ItineraryHistoryVO getHistoryById(String id) {
        ItineraryHistoryItem historyItem = getHistoryItemById(id);
        return historyItem != null ? convertToVO(historyItem) : null;
    }

    @Override
    public List<ItineraryHistoryVO> getHistoryByUserId(Integer userId) {
        try {
            String userListKey = RedisConstant.USER_HISTORY_LIST_PREFIX + userId;
            List<Object> historyIds = redisTemplate.opsForList().range(userListKey, 0, -1);
            
            if (historyIds == null || historyIds.isEmpty()) {
                return new ArrayList<>();
            }

            List<ItineraryHistoryVO> result = new ArrayList<>();
            for (Object idObj : historyIds) {
                String id = idObj.toString();
                ItineraryHistoryItem historyItem = getHistoryItemById(id);
                if (historyItem != null) {
                    result.add(convertToVO(historyItem));
                }
            }

            return result;

        } catch (Exception e) {
            log.error("查询用户历史记录失败，用户ID: {}, 错误: {}", userId, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public PageVO<ItineraryHistoryVO> getHistoryPage(ItineraryHistoryQuery query) {
        try {
            List<ItineraryHistoryVO> allHistory;
            
            if (query.getUserId() != null) {
                // 按用户查询
                allHistory = getHistoryByUserId(query.getUserId());
            } else {
                // 查询所有
                allHistory = getAllHistory();
            }

            // 过滤条件
            List<ItineraryHistoryVO> filteredHistory = allHistory.stream()
                    .filter(item -> filterByConditions(item, query))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // 按创建时间倒序
                    .collect(Collectors.toList());

            // 分页处理
            int pageIndex = query.getPageIndex();
            int pageSize = query.getPageSize();
            long total = filteredHistory.size();

            int startIndex = (pageIndex - 1) * pageSize;
            int endIndex = Math.min(startIndex + pageSize, filteredHistory.size());
            
            List<ItineraryHistoryVO> pageData = startIndex < filteredHistory.size() 
                    ? filteredHistory.subList(startIndex, endIndex) 
                    : new ArrayList<>();

            return new PageVO<>(pageData, total, (long) pageIndex, (long) pageSize);

        } catch (Exception e) {
            log.error("分页查询历史记录失败，错误: {}", e.getMessage());
            return new PageVO<>(new ArrayList<>(), 0L, (long) query.getPageIndex(), (long) query.getPageSize());
        }
    }

    @Override
    public List<ItineraryHistoryVO> getAllHistory() {
        try {
            Set<String> keys = redisTemplate.keys(RedisConstant.ITINERARY_HISTORY_PREFIX + "*");
            if (keys.isEmpty()) {
                return new ArrayList<>();
            }

            List<ItineraryHistoryVO> result = new ArrayList<>();
            for (String key : keys) {
                Object value = redisTemplate.opsForValue().get(key);
                if (value != null) {
                    try {
                        ItineraryHistoryItem historyItem = objectMapper.readValue(value.toString(), ItineraryHistoryItem.class);
                        result.add(convertToVO(historyItem));
                    } catch (JsonProcessingException e) {
                        log.warn("反序列化历史记录失败，key: {}", key);
                    }
                }
            }

            return result.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("查询所有历史记录失败，错误: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<ItineraryHistoryVO> getHistoryByTitle(String title) {
        if (!StringUtils.hasText(title)) {
            return new ArrayList<>();
        }

        return getAllHistory().stream()
                .filter(item -> item.getTitle() != null && item.getTitle().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * 根据ID获取历史记录实体
     */
    private ItineraryHistoryItem getHistoryItemById(String id) {
        try {
            String key = RedisConstant.ITINERARY_HISTORY_PREFIX + id;
            Object value = redisTemplate.opsForValue().get(key);
            
            if (value != null) {
                return objectMapper.readValue(value.toString(), ItineraryHistoryItem.class);
            }
            return null;

        } catch (JsonProcessingException e) {
            log.error("反序列化历史记录失败，ID: {}, 错误: {}", id, e.getMessage());
            return null;
        }
    }

    /**
     * 生成历史记录ID
     */
    private String generateHistoryId() {
        Long counter = redisTemplate.opsForValue().increment(RedisConstant.HISTORY_ID_COUNTER);
        return "HIST_" + System.currentTimeMillis() + "_" + counter;
    }

    /**
     * 转换为VO对象
     */
    private ItineraryHistoryVO convertToVO(ItineraryHistoryItem item) {
        ItineraryHistoryVO vo = new ItineraryHistoryVO();
        vo.setId(item.getId());
        vo.setGeneratedItinerary(item.getGeneratedItinerary());
        vo.setCreatedAt(item.getCreatedAt());
        vo.setTitle(item.getTitle());
        vo.setUserId(item.getUserId());
        vo.setUsername(item.getUsername());
        return vo;
    }

    /**
     * 根据查询条件过滤
     */
    private boolean filterByConditions(ItineraryHistoryVO item, ItineraryHistoryQuery query) {
        // 标题过滤
        if (StringUtils.hasText(query.getTitle()) && 
            (item.getTitle() == null || !item.getTitle().toLowerCase().contains(query.getTitle().toLowerCase()))) {
            return false;
        }

        // 用户名过滤
        if (StringUtils.hasText(query.getUsername()) && 
            (item.getUsername() == null || !item.getUsername().toLowerCase().contains(query.getUsername().toLowerCase()))) {
            return false;
        }

        // 时间范围过滤
        if (StringUtils.hasText(query.getStartTime()) && 
            item.getCreatedAt().compareTo(query.getStartTime()) < 0) {
            return false;
        }

        if (StringUtils.hasText(query.getEndTime()) &&
            item.getCreatedAt().compareTo(query.getEndTime()) > 0) {
            return false;
        }

        return true;
    }
}
