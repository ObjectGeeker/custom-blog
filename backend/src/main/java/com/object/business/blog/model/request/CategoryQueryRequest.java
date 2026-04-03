package com.object.business.blog.model.request;

import lombok.Data;

/**
 * 分类查询请求对象
 */
@Data
public class CategoryQueryRequest {

    /**
     * 分类名字（模糊查询）
     */
    private String categoryName;

    /**
     * 业务级别(一级分类;二级分类)
     */
    private Integer businessLevel;

    /**
     * 父级分类的id
     */
    private String parentId;
}
