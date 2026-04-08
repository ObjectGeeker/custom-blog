package com.object.business.blog.controller;

import com.object.business.blog.common.BaseResponse;
import com.object.business.blog.common.ResultUtils;
import com.object.business.blog.model.request.LoginRequest;
import com.object.business.blog.model.response.LoginResponse;
import com.object.business.blog.service.ISecurityService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("security")
public class SecurityController {

    @Resource
    private ISecurityService securityService;

    @PostMapping("login")
    public BaseResponse<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = securityService.login(loginRequest, response);
        return ResultUtils.success(loginResponse);
    }

    @PostMapping("refresh_token")
    public BaseResponse<LoginResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        LoginResponse loginResponse = securityService.refreshToken(request, response);
        return ResultUtils.success(loginResponse);
    }

}