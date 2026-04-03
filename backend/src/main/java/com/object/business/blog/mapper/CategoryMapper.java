package com.object.business.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.object.business.blog.model.po.Category;
import org.apache.ibatis.annotations.Mapper;

/**
 * 分类表 Mapper接口
 */
@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}
