package com.object.business.blog.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

/**
 * 文章创建请求对象
 */
@Data
public class ArticleCreateRequest {

    /**
     * 文章标题
     */
    @NotBlank(message = "文章标题不能为空")
    private String title;

    /**
     * 文章简述
     */
    private String summary;

    /**
     * 文章内容
     */
    @NotBlank(message = "文章内容不能为空")
    private String content;

    /**
     * 文章标签列表
     */
    @NotEmpty(message = "文章标签不能为空")
    private List<String> tags;

    /**
     * 文章分类列表
     */
    @NotEmpty(message = "文章分类不能为空")
    private List<String> categories;
}
