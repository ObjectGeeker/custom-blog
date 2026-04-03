package com.object.business.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.object.business.blog.model.po.Article;
import org.apache.ibatis.annotations.Mapper;

/**
 * 文章表 Mapper接口
 */
@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
}
