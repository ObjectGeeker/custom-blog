package com.object.business.blog.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.object.business.blog.exception.BusinessException;
import com.object.business.blog.exception.ErrorCode;
import com.object.business.blog.exception.ThrowUtils;
import com.object.business.blog.mapper.CategoryMapper;
import com.object.business.blog.model.po.Category;
import com.object.business.blog.model.request.CategoryCreateRequest;
import com.object.business.blog.model.request.CategoryQueryRequest;
import com.object.business.blog.model.request.CategoryUpdateRequest;
import com.object.business.blog.model.vo.CategoryVO;
import com.object.business.blog.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 分类表 服务实现类
 */
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Override
    public String createCategory(CategoryCreateRequest request) {
        Category category = new Category();
        BeanUtil.copyProperties(request, category);

        // 构建路径
        category.setPath(buildPath(request.getParentId(), category.getId()));


        save(category);
        return category.getId();
    }

    @Override
    public boolean updateCategory(CategoryUpdateRequest request) {
        Category category = getById(request.getId());
        ThrowUtils.throwIf(category == null, ErrorCode.NOT_FOUND_ERROR, "分类不存在");

        BeanUtil.copyProperties(request, category);

        // 如果修改了父级ID，需要重新计算路径
        if (request.getParentId() != null && !request.getParentId().equals(category.getParentId())) {
            category.setPath(buildPath(request.getParentId(), category.getId()));
        }

        return updateById(category);
    }

    @Override
    public boolean deleteCategory(String id) {
        return removeById(id);
    }

    @Override
    public CategoryVO getCategoryById(String id) {
        Category category = getById(id);
        ThrowUtils.throwIf(category == null, ErrorCode.NOT_FOUND_ERROR, "分类不存在");
        return convertToVO(category);
    }

    @Override
    public List<CategoryVO> listCategories(CategoryQueryRequest request) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();

        if (StrUtil.isNotBlank(request.getCategoryName())) {
            wrapper.like(Category::getCategoryName, request.getCategoryName());
        }
        if (request.getBusinessLevel() != null) {
            wrapper.eq(Category::getBusinessLevel, request.getBusinessLevel());
        }
        if (StrUtil.isNotBlank(request.getParentId())) {
            wrapper.eq(Category::getParentId, request.getParentId());
        }

        List<Category> list = list(wrapper);
        return list.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<Category> allCategories = list();
        return buildCategoryTree(allCategories);
    }

    /**
     * 构建分类树
     */
    private List<CategoryVO> buildCategoryTree(List<Category> categories) {
        // 转换为VO
        List<CategoryVO> voList = categories.stream().map(this::convertToVO).toList();

        // 按父ID分组
        Map<String, List<CategoryVO>> parentIdMap = voList.stream()
                .filter(vo -> vo.getParentId() != null)
                .collect(Collectors.groupingBy(CategoryVO::getParentId));

        // 设置子节点
        voList.forEach(vo -> vo.setChildren(parentIdMap.get(vo.getId())));

        // 返回根节点（parentId为空的）
        return voList.stream()
                .filter(vo -> StrUtil.isBlank(vo.getParentId()))
                .collect(Collectors.toList());
    }

    /**
     * 转换为视图对象
     */
    private CategoryVO convertToVO(Category category) {
        CategoryVO vo = new CategoryVO();
        BeanUtil.copyProperties(category, vo);
        return vo;
    }

    /**
     * 构建路径
     *
     * @param parentId 父级ID
     * @param id       当前ID
     * @return 路径
     */
    private String buildPath(String parentId, String id) {
        if (StrUtil.isNotBlank(parentId)) {
            Category parentCategory = getById(parentId);
            if (parentCategory != null) {
                return parentCategory.getPath() + "/" + id;
            }
        }
        return "/" + id;
    }
}
