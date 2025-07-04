package com.asta.backend.service;

import com.asta.backend.entity.po.ItineraryHistoryItem;
import com.asta.backend.entity.query.ItineraryHistoryQuery;
import com.asta.backend.entity.vo.ItineraryHistoryVO;
import com.asta.backend.entity.vo.PageVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 历史记录服务测试类
 *
 * @author asta
 * @since 2025-07-04
 */
@SpringBootTest
public class ItineraryHistoryServiceTest {

    @Autowired
    private IItineraryHistoryService historyService;

    @Test
    public void testSaveAndGetHistory() {
        // 创建测试数据
        ItineraryHistoryItem historyItem = new ItineraryHistoryItem();
        historyItem.setTitle("北京三日游");
        historyItem.setGeneratedItinerary("第一天：天安门广场 -> 故宫博物院\n第二天：长城一日游\n第三天：颐和园 -> 圆明园");
        historyItem.setUserId(1);
        historyItem.setUsername("testuser");

        // 保存历史记录
        ItineraryHistoryVO savedHistory = historyService.saveHistory(historyItem);
        assertNotNull(savedHistory);
        assertNotNull(savedHistory.getId());
        assertEquals("北京三日游", savedHistory.getTitle());

        // 根据ID查询
        ItineraryHistoryVO retrievedHistory = historyService.getHistoryById(savedHistory.getId());
        assertNotNull(retrievedHistory);
        assertEquals(savedHistory.getId(), retrievedHistory.getId());
        assertEquals("北京三日游", retrievedHistory.getTitle());

        // 根据用户ID查询
        List<ItineraryHistoryVO> userHistory = historyService.getHistoryByUserId(1);
        assertFalse(userHistory.isEmpty());
        assertTrue(userHistory.stream().anyMatch(h -> h.getId().equals(savedHistory.getId())));

        // 删除测试数据
        Boolean deleted = historyService.deleteHistoryById(savedHistory.getId());
        assertTrue(deleted);

        // 验证删除成功
        ItineraryHistoryVO deletedHistory = historyService.getHistoryById(savedHistory.getId());
        assertNull(deletedHistory);
    }

    @Test
    public void testPageQuery() {
        // 创建多个测试数据
        for (int i = 1; i <= 5; i++) {
            ItineraryHistoryItem historyItem = new ItineraryHistoryItem();
            historyItem.setTitle("测试行程" + i);
            historyItem.setGeneratedItinerary("测试内容" + i);
            historyItem.setUserId(2);
            historyItem.setUsername("testuser2");
            historyService.saveHistory(historyItem);
        }

        // 分页查询
        ItineraryHistoryQuery query = new ItineraryHistoryQuery();
        query.setUserId(2);
        query.setPageIndex(1);
        query.setPageSize(3);

        PageVO<ItineraryHistoryVO> pageResult = historyService.getHistoryPage(query);
        assertNotNull(pageResult);
        assertEquals(3, pageResult.getRecords().size());
        assertTrue(pageResult.getTotal() >= 5);

        // 清理测试数据
        historyService.deleteHistoryByUserId(2);
    }

    @Test
    public void testSearchByTitle() {
        // 创建测试数据
        ItineraryHistoryItem historyItem = new ItineraryHistoryItem();
        historyItem.setTitle("上海迪士尼乐园一日游");
        historyItem.setGeneratedItinerary("上海迪士尼乐园游玩攻略");
        historyItem.setUserId(3);
        historyItem.setUsername("testuser3");
        
        ItineraryHistoryVO savedHistory = historyService.saveHistory(historyItem);

        // 搜索测试
        List<ItineraryHistoryVO> searchResult = historyService.getHistoryByTitle("迪士尼");
        assertFalse(searchResult.isEmpty());
        assertTrue(searchResult.stream().anyMatch(h -> h.getTitle().contains("迪士尼")));

        // 清理测试数据
        historyService.deleteHistoryById(savedHistory.getId());
    }
}
