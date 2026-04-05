package com.object.business.blog.model.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 分类表 实体类
 */
@Data
@TableName("tb_category")
public class Category {

    /**
     * 主键id
     */
    @TableId(type = IdType.ASSIGN_ID)
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
     * 顺序号（列名 order 为 MySQL 保留字，须反引号）
     */
    @TableField("`order`")
    private Integer order;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 创建人id
     */
    @TableField(fill = FieldFill.INSERT)
    private String createUser;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 更新人
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String updateUser;

    /**
     * 逻辑删除
     */
    @TableLogic
    private Integer isDelete;
}
