package com.object.business.blog.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 分类创建请求对象
 */
@Data
public class CategoryCreateRequest {

    /**
     * 主键 id（客户端生成 UUID，创建时用于拼接 path）
     */
    @NotBlank(message = "分类 id 不能为空")
    private String id;

    /**
     * 分类名字
     */
    @NotBlank(message = "分类名字不能为空")
    private String categoryName;

    /**
     * 分类描述
     */
    private String categoryDesc;

    /**
     * 业务级别(一级分类;二级分类)
     */
    @NotNull(message = "业务级别不能为空")
    private Integer businessLevel;

    /**
     * 父级分类的id,一级分类为空
     */
    private String parentId;
}
