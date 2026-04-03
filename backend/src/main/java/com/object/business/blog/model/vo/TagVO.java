package com.object.business.blog.model.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 标签表 视图对象
 */
@Data
public class TagVO {

    /**
     * 主键id
     */
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
     * 业务级别(一级标签;二级标签)
     */
    private Integer businessLevel;

    /**
     * 路径(/parentId/id)
     */
    private String path;

    /**
     * 父级标签的id,一级标签为空
     */
    private String parentId;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 创建人id
     */
    private String createUser;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 更新人
     */
    private String updateUser;

    /**
     * 子标签列表
     */
    private List<TagVO> children;
}
