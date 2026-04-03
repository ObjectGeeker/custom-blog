package com.object.business.blog.context;


import com.object.business.blog.model.vo.LoginUser;

public class SystemSecurityContext {

    private static final ThreadLocal<LoginUser> LOGIN_USER_CONTEXT = new ThreadLocal<>();

    public static void set(LoginUser loginUser) {
        LOGIN_USER_CONTEXT.set(loginUser);
    }

    public static LoginUser get() {
        return null != LOGIN_USER_CONTEXT.get() ? LOGIN_USER_CONTEXT.get() : null;
    }

    public static void clear() {
        LOGIN_USER_CONTEXT.remove();
    }

}
