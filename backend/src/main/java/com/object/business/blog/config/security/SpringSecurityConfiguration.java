package com.object.business.blog.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SpringSecurityConfiguration {

    /**
     * 允许匿名访问的接口
     */
    private final String[] permitAllMatchers = {
            // 登录接口
            "/security/login",
            // 标签查询接口
            "/tag/getById",
            "/tag/list",
            "/tag/tree",
            // 分类查询接口
            "/category/getById",
            "/category/list",
            "/category/tree",
            // 文章查询接口
            "/article/getById",
            "/article/list"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 跨域配置
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 允许的前端域名，生产环境建议配置具体域名
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        // 允许的 HTTP 方法
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 允许的请求头
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        // 允许携带凭证（如 Cookie）
        configuration.setAllowCredentials(true);
        // 预检请求缓存时间（秒）
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        // 使用JWT，所以禁用CSRF
        httpSecurity.csrf(CsrfConfigurer::disable)
                // 启用 CORS 跨域
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 禁用SESSION
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizationRegistry -> authorizationRegistry
                        // 允许对于网站静态资源的无授权访问
                        .requestMatchers(HttpMethod.GET, "/", "/*.html", "/login.html").permitAll()
                        // 对登录注册允许匿名访问
                        // 访问授权，所有 /user/** 路径下的请求需要 ADMIN 角色。注意；Spring Security在处理角色时，会自动为角色名添加"ROLE_"前缀。因此，"ADMIN"角色实际上对应权限"ROLE_ADMIN"。
                        .requestMatchers(permitAllMatchers).permitAll()
                        // 跨域请求会先进行一次options请求
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()
                        // 对所有请求开启授权保护
                        .anyRequest()
                        // 必须已认证才能访问
                        .authenticated()
                )
                // 添加自定义的处理器在前面执行
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // 禁用缓存
                .headers(headersConfigurer -> headersConfigurer
                        .cacheControl(HeadersConfigurer.CacheControlConfig::disable)
                )
                // 自定义异常处理
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        // 无权限访问
                        .accessDeniedHandler(this::handleAccessDenied)
                        // 未认证访问
                        .authenticationEntryPoint(this::handleAuthentication)
                );

        return httpSecurity.build();
    }

    private void handleAccessDenied(HttpServletRequest request,
                                    HttpServletResponse response,
                                    AccessDeniedException accessDeniedException) throws IOException {

        // 抛出你的自定义异常，或统一返回
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        // 直接返回统一响应
        response.getWriter().write("{\"code\":403,\"message\":\"无权限访问\"}");
    }

    private void handleAuthentication(HttpServletRequest request,
                                      HttpServletResponse response,
                                      AuthenticationException authenticationException) throws IOException {

        // 抛出你的自定义异常，或统一返回
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // 直接返回统一响应
        response.getWriter().write("{\"code\":401,\"message\":\"未登录\"}");
    }

}
