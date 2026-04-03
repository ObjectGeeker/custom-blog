package com.object.business.blog.model.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文章表 实体类
 */
@Data
@TableName("tb_article")
public class Article {

    /**
     * 文章id
     */
    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 文章标签(JSON数组)
     */
    private String tags;

    /**
     * 文章分类(JSON数组)
     */
    private String categories;

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
     * 逻辑删除
     */
    @TableLogic
    private Integer isDelete;
}
