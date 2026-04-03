package com.object.business.blog.model.request;

import lombok.Data;

/**
 * 标签查询请求对象
 */
@Data
public class TagQueryRequest {

    /**
     * 标签名字（模糊查询）
     */
    private String tagName;

    /**
     * 业务级别(一级标签;二级标签)
     */
    private Integer businessLevel;

    /**
     * 父级标签的id
     */
    private String parentId;
}
