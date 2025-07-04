package com.asta.backend.controller;

import com.asta.backend.entity.po.ItineraryHistoryItem;
import com.asta.backend.entity.query.ItineraryHistoryQuery;
import com.asta.backend.entity.vo.ItineraryHistoryVO;
import com.asta.backend.entity.vo.JsonVO;
import com.asta.backend.entity.vo.PageVO;
import com.asta.backend.entity.vo.ResultStatus;
import com.asta.backend.service.IItineraryHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 历史记录控制器
 *
 * @author asta
 * @since 2025-07-04
 */
@RestController
@RequestMapping("api/history")
@RequiredArgsConstructor
public class ItineraryHistoryController {

    private final IItineraryHistoryService historyService;

    /**
     * 保存历史记录
     */
    @PostMapping("/save")
    public JsonVO<ItineraryHistoryVO> saveHistory(@RequestBody @Validated ItineraryHistoryItem historyItem) {
        try {
            ItineraryHistoryVO result = historyService.saveHistory(historyItem);
            return JsonVO.success(result);
        } catch (Exception e) {
            return JsonVO.create(null,ResultStatus.FAIL.getCode(),"保存历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID删除历史记录
     */
    @DeleteMapping("/{id}")
    public JsonVO<String> deleteHistory(@PathVariable String id) {
        try {
            Boolean result = historyService.deleteHistoryById(id);
            if (result) {
                return JsonVO.success("删除成功");
            } else {
                return JsonVO.fail("删除失败，记录不存在");
            }
        } catch (Exception e) {
            return JsonVO.fail("删除历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 根据用户ID删除所有历史记录
     */
    @DeleteMapping("/user/{userId}")
    public JsonVO<String> deleteHistoryByUserId(@PathVariable Integer userId) {
        try {
            Long deletedCount = historyService.deleteHistoryByUserId(userId);
            return JsonVO.success("删除成功，共删除 " + deletedCount + " 条记录");
        } catch (Exception e) {
            return JsonVO.fail("删除用户历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID查询历史记录
     */
    @GetMapping("/{id}")
    public JsonVO<ItineraryHistoryVO> getHistoryById(@PathVariable String id) {
        try {
            ItineraryHistoryVO result = historyService.getHistoryById(id);
            if (result != null) {
                return JsonVO.success(result);
            } else {
                return JsonVO.create(null, ResultStatus.FAIL.getCode(),"历史记录不存在");
            }
        } catch (Exception e) {
            return JsonVO.create(null,ResultStatus.FAIL.getCode(),"查询历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 根据用户ID查询历史记录列表
     */
    @GetMapping("/user/{userId}")
    public JsonVO<List<ItineraryHistoryVO>> getHistoryByUserId(@PathVariable Integer userId) {
        try {
            List<ItineraryHistoryVO> result = historyService.getHistoryByUserId(userId);
            return JsonVO.success(result);
        } catch (Exception e) {
            return JsonVO.create(null,ResultStatus.FAIL.getCode(),"查询用户历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 分页查询历史记录
     */
    @PostMapping("/page")
    public JsonVO<PageVO<ItineraryHistoryVO>> getHistoryPage(@RequestBody ItineraryHistoryQuery query) {
        try {
            PageVO<ItineraryHistoryVO> result = historyService.getHistoryPage(query);
            return JsonVO.success(result);
        } catch (Exception e) {
            return JsonVO.create(null,ResultStatus.FAIL.getCode(),"分页查询历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 查询所有历史记录
     */
    @GetMapping("/all")
    public JsonVO<List<ItineraryHistoryVO>> getAllHistory() {
        try {
            List<ItineraryHistoryVO> result = historyService.getAllHistory();
            return JsonVO.success(result);
        } catch (Exception e) {
            return JsonVO.create(null,ResultStatus.FAIL.getCode(),"查询所有历史记录失败: " + e.getMessage());
        }
    }

    /**
     * 根据标题搜索历史记录
     */
    @GetMapping("/search")
    public JsonVO<List<ItineraryHistoryVO>> searchHistoryByTitle(@RequestParam String title) {
        try {
            List<ItineraryHistoryVO> result = historyService.getHistoryByTitle(title);
            return JsonVO.success(result);
        } catch (Exception e) {
            return JsonVO.create(null,ResultStatus.FAIL.getCode(),"搜索历史记录失败: " + e.getMessage());
        }
    }
}
