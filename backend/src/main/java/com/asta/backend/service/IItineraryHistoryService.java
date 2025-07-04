package com.asta.backend.service;

import com.asta.backend.entity.po.ItineraryHistoryItem;
import com.asta.backend.entity.query.ItineraryHistoryQuery;
import com.asta.backend.entity.vo.ItineraryHistoryVO;
import com.asta.backend.entity.vo.PageVO;

import java.util.List;

/**
 * 历史记录服务接口
 *
 * @author asta
 * @since 2025-07-04
 */
public interface IItineraryHistoryService {

    /**
     * 保存历史记录
     *
     * @param historyItem 历史记录对象
     * @return 保存后的历史记录
     */
    ItineraryHistoryVO saveHistory(ItineraryHistoryItem historyItem);

    /**
     * 根据ID删除历史记录
     *
     * @param id 历史记录ID
     * @return 是否删除成功
     */
    Boolean deleteHistoryById(String id);

    /**
     * 根据用户ID删除该用户的所有历史记录
     *
     * @param userId 用户ID
     * @return 删除的记录数量
     */
    Long deleteHistoryByUserId(Integer userId);

    /**
     * 根据ID查询历史记录
     *
     * @param id 历史记录ID
     * @return 历史记录详情
     */
    ItineraryHistoryVO getHistoryById(String id);

    /**
     * 根据用户ID查询历史记录列表
     *
     * @param userId 用户ID
     * @return 历史记录列表
     */
    List<ItineraryHistoryVO> getHistoryByUserId(Integer userId);

    /**
     * 分页查询历史记录
     *
     * @param query 查询参数
     * @return 分页结果
     */
    PageVO<ItineraryHistoryVO> getHistoryPage(ItineraryHistoryQuery query);

    /**
     * 查询所有历史记录
     *
     * @return 所有历史记录列表
     */
    List<ItineraryHistoryVO> getAllHistory();

    /**
     * 根据标题模糊查询历史记录
     *
     * @param title 标题关键字
     * @return 匹配的历史记录列表
     */
    List<ItineraryHistoryVO> getHistoryByTitle(String title);
}
