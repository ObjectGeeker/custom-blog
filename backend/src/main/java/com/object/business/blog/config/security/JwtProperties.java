package com.object.business.blog.config.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {

    /**
     * HMAC 签名密钥，生产环境务必替换为高强度随机值并通过环境变量注入
     */
    private String secret;

    private int accessTokenExpireHours = 2;

    private int refreshTokenExpireDays = 7;
}
