package com.object.business.blog.controller;

import com.object.business.blog.common.BaseResponse;
import com.object.business.blog.common.ResultUtils;
import com.object.business.blog.model.request.TagCreateRequest;
import com.object.business.blog.model.request.TagQueryRequest;
import com.object.business.blog.model.request.TagUpdateRequest;
import com.object.business.blog.model.vo.TagVO;
import com.object.business.blog.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签表 控制器
 */
@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    /**
     * 创建标签
     */
    @PostMapping
    public BaseResponse<String> create(@Valid @RequestBody TagCreateRequest request) {
        String tagId = tagService.createTag(request);
        return ResultUtils.success(tagId);
    }

    /**
     * 更新标签
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> update(@Valid @RequestBody TagUpdateRequest request) {
        boolean result = tagService.updateTag(request);
        return ResultUtils.success(result);
    }

    /**
     * 删除标签
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> delete(@RequestBody String id) {
        boolean result = tagService.deleteTag(id);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID查询标签
     */
    @PostMapping("/getById")
    public BaseResponse<TagVO> getById(@RequestBody String id) {
        TagVO tagVO = tagService.getTagById(id);
        return ResultUtils.success(tagVO);
    }

    /**
     * 查询标签列表
     */
    @PostMapping("/list")
    public BaseResponse<List<TagVO>> list(@RequestBody TagQueryRequest request) {
        List<TagVO> list = tagService.listTags(request);
        return ResultUtils.success(list);
    }

    /**
     * 查询标签树
     */
    @PostMapping("/tree")
    public BaseResponse<List<TagVO>> getTree() {
        List<TagVO> tree = tagService.getTagTree();
        return ResultUtils.success(tree);
    }
}
