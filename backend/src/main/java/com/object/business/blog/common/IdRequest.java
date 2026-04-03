package com.object.business.blog.common;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 通用 ID 请求对象
 */
@Data
public class IdRequest {

    @NotBlank(message = "ID不能为空")
    private String id;
}
