package com.object.business.blog.model.request;

import lombok.Data;

/**
 * 文章查询请求对象
 */
@Data
public class ArticleQueryRequest {

    /**
     * 文章标题（模糊查询）
     */
    private String title;

    /**
     * 标签
     */
    private String tag;

    /**
     * 分类
     */
    private String category;
}
