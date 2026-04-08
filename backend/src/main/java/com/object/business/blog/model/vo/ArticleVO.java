package com.object.business.blog.model.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章表 视图对象
 */
@Data
public class ArticleVO {

    /**
     * 文章id
     */
    private String id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章简述
     */
    private String summary;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 文章标签列表
     */
    private List<String> tags;

    /**
     * 文章分类列表
     */
    private List<String> categories;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    //todo createUser和updateUser需要使用mybatis查询后置插件，每次都填充对应的人员

    /**
     * 创建人id
     */
    private LoginUser createUser;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 更新人
     */
    private LoginUser updateUser;
}
