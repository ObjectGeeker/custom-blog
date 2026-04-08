package com.object.business.blog.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 文章更新请求对象
 */
@Data
public class ArticleUpdateRequest {

    /**
     * 文章id
     */
    @NotBlank(message = "文章ID不能为空")
    private String id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章简述
     */
    private String summary;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 文章标签列表
     */
    private List<String> tags;

    /**
     * 文章分类列表
     */
    private List<String> categories;
}
