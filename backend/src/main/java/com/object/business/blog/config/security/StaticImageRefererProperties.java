package com.object.business.blog.config.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 静态图片防盗链：仅当 Referer 指向允许的主机名时才响应 {@code /static/**}。
 */
@Data
@Component
@ConfigurationProperties(prefix = "blog.security.static-image-referer")
public class StaticImageRefererProperties {

    /**
     * 是否启用校验；关闭则不做 Referer 检查（仅建议本地调试时关闭）。
     */
    private boolean enabled = true;

    /**
     * 允许的 Referer 主机名（不含端口），如 {@code blog.objectgeeker.com}。
     */
    private List<String> allowedHosts = new ArrayList<>(List.of("blog.objectgeeker.com"));

    /**
     * 是否允许缺失 Referer 的请求（直接打开图片链接、部分隐私设置下可能无 Referer）。
     * 生产环境若要求“仅本站页面可展示图片”，建议为 false。
     */
    private boolean allowEmptyReferer = false;
}
