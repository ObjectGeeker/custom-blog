package com.object.business.blog.model.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 标签表 实体类
 */
@Data
@TableName("tb_tag")
public class Tag {

    /**
     * 主键id
     */
    @TableId(type = IdType.ASSIGN_ID)
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
