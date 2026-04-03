package com.object.business.blog.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    SUCCESS("200", "ok"),
    PARAMS_ERROR("40000", "请求参数错误"),
    NOT_LOGIN_ERROR("40100", "未登录"),
    NOT_AUTH_ERROR("40101", "无权限"),
    NOT_FOUND_ERROR("40400", "请求数据不存在"),
    FORBIDDEN_ERROR("40300", "禁止访问"),
    SYSTEM_ERROR("50000", "系统错误"),
    OPERATION_ERROR("50001", "操作失败");
    private final String errorCode;
    private final String errorMsg;

}
