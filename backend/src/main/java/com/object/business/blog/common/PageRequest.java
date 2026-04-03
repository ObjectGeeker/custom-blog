package com.object.business.blog.common;

import lombok.Data;

/**
 * 通用分页请求
 */
@Data
public class PageRequest {

    /**
     * 当前页面
     */
    private int currentPage = 1;

    /**
     * 页面大小
     */
    private int pageSize = 10;

    /**
     * 排序字段
     */
    private String sortField;

}
