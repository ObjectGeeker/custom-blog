package com.object.business.blog.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 分类更新请求对象
 */
@Data
public class CategoryUpdateRequest {

    /**
     * 主键id
     */
    @NotBlank(message = "分类ID不能为空")
    private String id;

    /**
     * 分类名字
     */
    private String categoryName;

    /**
     * 分类描述
     */
    private String categoryDesc;

    /**
     * 父级分类的id,一级分类为空
     */
    private String parentId;
}
