package com.object.business.blog.controller;

import com.object.business.blog.common.BaseResponse;
import com.object.business.blog.common.IdRequest;
import com.object.business.blog.common.ResultUtils;
import com.object.business.blog.model.request.CategoryCreateRequest;
import com.object.business.blog.model.request.CategoryQueryRequest;
import com.object.business.blog.model.request.CategoryUpdateRequest;
import com.object.business.blog.model.vo.CategoryVO;
import com.object.business.blog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类表 控制器
 */
@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 创建分类
     */
    @PostMapping
    public BaseResponse<String> create(@Valid @RequestBody CategoryCreateRequest request) {
        String categoryId = categoryService.createCategory(request);
        return ResultUtils.success(categoryId);
    }

    /**
     * 更新分类
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> update(@Valid @RequestBody CategoryUpdateRequest request) {
        boolean result = categoryService.updateCategory(request);
        return ResultUtils.success(result);
    }

    /**
     * 删除分类
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> delete(@Valid @RequestBody IdRequest request) {
        boolean result = categoryService.deleteCategory(request.getId());
        return ResultUtils.success(result);
    }

    /**
     * 根据ID查询分类
     */
    @PostMapping("/getById")
    public BaseResponse<CategoryVO> getById(@Valid @RequestBody IdRequest request) {
        CategoryVO categoryVO = categoryService.getCategoryById(request.getId());
        return ResultUtils.success(categoryVO);
    }

    /**
     * 查询分类列表
     */
    @PostMapping("/list")
    public BaseResponse<List<CategoryVO>> list(@RequestBody CategoryQueryRequest request) {
        List<CategoryVO> list = categoryService.listCategories(request);
        return ResultUtils.success(list);
    }

    /**
     * 查询分类树
     */
    @PostMapping("/tree")
    public BaseResponse<List<CategoryVO>> getTree() {
        List<CategoryVO> tree = categoryService.getCategoryTree();
        return ResultUtils.success(tree);
    }
}
