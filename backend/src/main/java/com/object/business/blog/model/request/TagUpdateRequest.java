package com.object.business.blog.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 标签更新请求对象
 */
@Data
public class TagUpdateRequest {

    /**
     * 主键id
     */
    @NotBlank(message = "标签ID不能为空")
    private String id;

    /**
     * 标签名字
     */
    private String tagName;

    /**
     * 标签描述
     */
    private String tagDesc;

    /**
     * 父级标签的id,一级标签为空
     */
    private String parentId;
}
