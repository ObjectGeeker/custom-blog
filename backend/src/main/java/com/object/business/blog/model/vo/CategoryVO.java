package com.object.business.blog.model.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 分类表 视图对象
 */
@Data
public class CategoryVO {

    /**
     * 主键id
     */
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
     * 业务级别(一级分类;二级分类)
     */
    private Integer businessLevel;

    /**
     * 路径(/parentId/id)
     */
    private String path;

    /**
     * 父级分类的id,一级分类为空
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
     * 子分类列表
     */
    private List<CategoryVO> children;
}
