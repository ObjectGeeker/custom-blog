package com.object.business.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.object.business.blog.model.po.UserPO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<UserPO> {
}
