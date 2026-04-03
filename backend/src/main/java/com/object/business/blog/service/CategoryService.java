package com.object.business.blog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.object.business.blog.model.po.Category;
import com.object.business.blog.model.request.CategoryCreateRequest;
import com.object.business.blog.model.request.CategoryQueryRequest;
import com.object.business.blog.model.request.CategoryUpdateRequest;
import com.object.business.blog.model.vo.CategoryVO;

import java.util.List;

/**
 * 分类表 服务接口
 */
public interface CategoryService extends IService<Category> {

    /**
     * 创建分类
     *
     * @param request 创建请求
     * @return 分类ID
     */
    String createCategory(CategoryCreateRequest request);

    /**
     * 更新分类
     *
     * @param request 更新请求
     * @return 是否成功
     */
    boolean updateCategory(CategoryUpdateRequest request);

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @return 是否成功
     */
    boolean deleteCategory(String id);

    /**
     * 根据ID查询分类
     *
     * @param id 分类ID
     * @return 分类视图对象
     */
    CategoryVO getCategoryById(String id);

    /**
     * 查询分类列表
     *
     * @param request 查询请求
     * @return 分类视图对象列表
     */
    List<CategoryVO> listCategories(CategoryQueryRequest request);

    /**
     * 查询分类树
     *
     * @return 分类树列表
     */
    List<CategoryVO> getCategoryTree();
}
