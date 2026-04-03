package com.object.business.blog.service;

import com.object.business.blog.model.request.LoginRequest;
import com.object.business.blog.model.response.LoginResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface ISecurityService {

    /**
     * 登录
     *
     * @param loginRequest 登录请求体
     * @param response     http response
     * @return 登录返回体
     */
    LoginResponse login(LoginRequest loginRequest, HttpServletResponse response);
}
