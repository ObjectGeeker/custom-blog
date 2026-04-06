package com.object.business.blog.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 对 {@code /static/**} 的 GET/HEAD 校验 Referer 主机名，减轻外链盗用流量。
 * <p>
 * 说明：Referer 可被客户端伪造，本过滤器用于常规防盗链；更高要求请在 Nginx/CDN 层做 referer 校验或改用带签名的临时 URL。
 */
@Component
@RequiredArgsConstructor
public class StaticImageRefererFilter extends OncePerRequestFilter {

    private final StaticImageRefererProperties properties;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        if (!properties.isEnabled() || !isStaticImageRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String referer = request.getHeader("Referer");
        if (referer == null || referer.isBlank()) {
            if (properties.isAllowEmptyReferer()) {
                filterChain.doFilter(request, response);
                return;
            }
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String host = extractHost(referer);
        if (host == null || !isAllowedHost(host)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isStaticImageRequest(HttpServletRequest request) {
        String method = request.getMethod();
        if (!"GET".equalsIgnoreCase(method) && !"HEAD".equalsIgnoreCase(method)) {
            return false;
        }
        String contextPath = request.getContextPath() == null ? "" : request.getContextPath();
        String uri = request.getRequestURI();
        if (uri == null) {
            return false;
        }
        String prefix = contextPath + "/static/";
        return uri.startsWith(prefix);
    }

    private String extractHost(String referer) {
        try {
            URI uri = new URI(referer.trim());
            String host = uri.getHost();
            return host == null ? null : host.toLowerCase(Locale.ROOT);
        } catch (URISyntaxException e) {
            return null;
        }
    }

    private boolean isAllowedHost(String hostLowerCase) {
        Set<String> allowed = properties.getAllowedHosts().stream()
                .map(h -> h == null ? "" : h.trim().toLowerCase(Locale.ROOT))
                .filter(h -> !h.isEmpty())
                .collect(Collectors.toSet());
        return allowed.contains(hostLowerCase);
    }
}
