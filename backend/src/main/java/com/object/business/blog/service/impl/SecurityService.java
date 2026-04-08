package com.object.business.blog.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.object.business.blog.config.security.JwtProperties;
import com.object.business.blog.exception.BusinessException;
import com.object.business.blog.exception.ErrorCode;
import com.object.business.blog.mapper.UserMapper;
import com.object.business.blog.model.po.UserPO;
import com.object.business.blog.model.request.LoginRequest;
import com.object.business.blog.model.response.LoginResponse;
import com.object.business.blog.model.vo.LoginUser;
import com.object.business.blog.model.vo.UserVO;
import com.object.business.blog.service.ISecurityService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;

@Service
public class SecurityService implements ISecurityService {

    @Resource
    private UserMapper userMapper;

    @Resource
    private PasswordEncoder passwordEncoder;

    @Resource
    private JwtProperties jwtProperties;

    @Override
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        //1. 根据登录类型选择不同的登录方法（目前写死为账号密码登录）
        String loginAccount = loginRequest.getLoginAccount();
        String loginVerifyCode = loginRequest.getLoginVerifyCode();
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getUserAccount, loginAccount);
        UserPO UserPO = userMapper.selectOne(wrapper);
        if (null == UserPO) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号不存在");
        }
        if (!passwordEncoder.matches(loginVerifyCode, UserPO.getUserPassword())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "密码错误");
        }
        if ("BAN".equals(UserPO.getStatus())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号被封禁");
        }

        //2. 构建 LoginUser（不含密码）
        UserVO systemUser = BeanUtil.toBean(UserPO, UserVO.class);
        LoginUser loginUser = LoginUser.builder()
                .userId(systemUser.getId())
                .userName(systemUser.getUserName())
                .email(systemUser.getEmail())
                .phoneNumber(systemUser.getPhoneNumber())
                .roles(new ArrayList<>())
                .build();

        byte[] key = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);

        //3. 生成 accessToken，使用标准 exp claim
        String accessToken = JWT.create()
                .setPayload("systemUser", JSONUtil.toJsonStr(loginUser))
                .setExpiresAt(Date.from(Instant.now().plus(jwtProperties.getAccessTokenExpireHours(), ChronoUnit.HOURS)))
                .setKey(key)
                .sign();

        //4. 生成 refreshToken，使用标准 exp claim
        String refreshToken = JWT.create()
                .setPayload("userId", loginUser.getUserId())
                .setExpiresAt(Date.from(Instant.now().plus(jwtProperties.getRefreshTokenExpireDays(), ChronoUnit.DAYS)))
                .setKey(key)
                .sign();

        //5. 通过 ResponseCookie 设置 refreshToken，携带 SameSite 和 Path 属性
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/security")
                .maxAge(Duration.ofDays(jwtProperties.getRefreshTokenExpireDays()))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        //6. 返回（签名密钥保留在服务端，不再下发给客户端）
        return LoginResponse.builder().accessToken(accessToken).build();
    }

    @Override
    public LoginResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = parseRefreshToken(request);
        byte[] key = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        boolean verified = JWTUtil.verify(refreshToken, key);
        if (!verified) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        JWT jwt = JWTUtil.parseToken(refreshToken);
        jwt.setKey(key);
        if (!jwt.validate(0)) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        // 获取用户数据
        String userId = (String) jwt.getPayload("userId");
        UserPO userPO = userMapper.selectById(userId);
        // 生成access_token
        LoginUser loginUser = LoginUser.builder()
                .userId(userPO.getId())
                .userName(userPO.getUserName())
                .email(userPO.getEmail())
                .phoneNumber(userPO.getPhoneNumber())
                .roles(new ArrayList<>())
                .build();
        String accessToken = JWT.create()
                .setPayload("systemUser", JSONUtil.toJsonStr(loginUser))
                .setExpiresAt(Date.from(Instant.now().plus(jwtProperties.getAccessTokenExpireHours(), ChronoUnit.HOURS)))
                .setKey(key)
                .sign();
        // 刷新refresh_token的过期时间
        String newRefreshToken = JWT.create()
                .setPayload("userId", loginUser.getUserId())
                .setExpiresAt(Date.from(Instant.now().plus(jwtProperties.getRefreshTokenExpireDays(), ChronoUnit.DAYS)))
                .setKey(key)
                .sign();
        ResponseCookie cookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/security")
                .maxAge(Duration.ofDays(jwtProperties.getRefreshTokenExpireDays()))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return LoginResponse.builder().accessToken(accessToken).build();
    }

    private static String parseRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        // 获取refresh_token
        Cookie refreshTokenCookie = null;
        for (Cookie cookie : cookies) {
            if ("refresh_token".equals(cookie.getName())) {
                refreshTokenCookie = cookie;
                break;
            }
        }
        if (null == refreshTokenCookie) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        // 校验refresh_token
        String refreshToken = refreshTokenCookie.getValue();
        return refreshToken;
    }

}
