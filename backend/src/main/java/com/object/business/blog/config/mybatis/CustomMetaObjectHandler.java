package com.object.business.blog.config.mybatis;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.object.business.blog.context.SystemSecurityContext;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CustomMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createUser", String.class, Objects.requireNonNull(SystemSecurityContext.get()).getUserId());
        this.strictInsertFill(metaObject, "updateUser", String.class, Objects.requireNonNull(SystemSecurityContext.get()).getUserId());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "updateUser", String.class, Objects.requireNonNull(SystemSecurityContext.get()).getUserId());
    }
}
