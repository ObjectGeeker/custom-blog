package com.object.business.blog.config.security;

import cn.hutool.json.JSONUtil;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.object.business.blog.context.SystemSecurityContext;
import com.object.business.blog.model.vo.LoginUser;
import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Resource
    private JwtProperties jwtProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String accessToken = request.getHeader("Authorization");
            if (accessToken != null && accessToken.startsWith("Bearer ")) {
                accessToken = accessToken.substring(7);
                byte[] key = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);

                boolean verified = JWTUtil.verify(accessToken, key);
                if (verified) {
                    JWT jwt = JWTUtil.parseToken(accessToken);
                    // validate(0) 校验标准 exp / nbf / iat claim，leeway = 0 秒
                    if (jwt.validate(0)) {
                        String jsonStr = (String) jwt.getPayload("systemUser");
                        LoginUser loginUser = JSONUtil.toBean(jsonStr, LoginUser.class);

                        List<GrantedAuthority> authorities = loginUser.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                .collect(Collectors.toList());

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(loginUser.getUserName(), null, authorities);

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        SystemSecurityContext.set(loginUser);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("JWT验证失败", e);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            SystemSecurityContext.clear();
        }
    }

}
