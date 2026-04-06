package com.object.business.blog.service.impl;

import cn.hutool.core.util.StrUtil;
import com.object.business.blog.exception.BusinessException;
import com.object.business.blog.exception.ErrorCode;
import com.object.business.blog.exception.ThrowUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * 本地磁盘存储：写入 {@code blog.file.upload-dir}/{userId}/，对外通过 /static/** 暴露（见 {@link com.object.business.blog.config.WebMvcConfig}）。
 */
@Service
public class LocalFileUploadService extends AbstractFileUploadService {

    /** 本地存储根目录，需与 WebMvcConfig 中 /static/** 映射到同一磁盘路径 */
    @Value("${blog.file.upload-dir:uploads}")
    private String uploadDir;

    /** 用于拼接前端可访问的完整相对路径（如 /api） */
    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Override
    protected String persistPicture(MultipartFile file, String userId, String newFileName) {
        // 物理路径：{uploadDir}/{userId}/，与对外 URL /static/{userId}/ 一一对应
        Path userDir = Paths.get(uploadDir, userId).toAbsolutePath().normalize();
        try {
            Files.createDirectories(userDir);
            Path target = userDir.resolve(newFileName).normalize();
            // resolve 后必须仍落在 userDir 下，防止异常文件名跳出用户目录
            ThrowUtils.throwIf(!target.startsWith(userDir), ErrorCode.PARAMS_ERROR, "非法文件路径");
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "文件保存失败");
        }
        return buildLocalPublicFileUrl(userId, newFileName);
    }

    /** 与 Spring Security 放行的 /static/** 及 context-path 一致 */
    private String buildLocalPublicFileUrl(String userId, String fileName) {
        String prefix = normalizeContextPath(contextPath);
        return prefix + "/static/" + userId + "/" + fileName;
    }

    /** 拼 URL 时用：无 context-path 或根路径则不加前缀，否则去掉末尾 / */
    private static String normalizeContextPath(String contextPath) {
        if (StrUtil.isBlank(contextPath) || "/".equals(contextPath)) {
            return "";
        }
        return contextPath.endsWith("/")
                ? contextPath.substring(0, contextPath.length() - 1)
                : contextPath;
    }
}
