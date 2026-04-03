package com.object.business.blog.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 标签创建请求对象
 */
@Data
public class TagCreateRequest {

    /**
     * 标签名字
     */
    @NotBlank(message = "标签名字不能为空")
    private String tagName;

    /**
     * 标签描述
     */
    private String tagDesc;

    /**
     * 业务级别(一级标签;二级标签)
     */
    @NotNull(message = "业务级别不能为空")
    private Integer businessLevel;

    /**
     * 父级标签的id,一级标签为空
     */
    private String parentId;
}
