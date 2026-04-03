package com.object.business.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.object.business.blog.model.po.Tag;
import org.apache.ibatis.annotations.Mapper;

/**
 * 标签表 Mapper接口
 */
@Mapper
public interface TagMapper extends BaseMapper<Tag> {
}
