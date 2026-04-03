package com.object.business.blog.common;

import com.object.business.blog.exception.ErrorCode;
import lombok.Data;

import java.io.Serializable;

/**
 * 通用返回类
 *
 * @param <T> 返回参数类型
 */
@Data
public class BaseResponse<T> implements Serializable {

    private String code;
    private String message;
    private T data;

    public BaseResponse(String code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public BaseResponse(ErrorCode errorCode) {
        this(errorCode.getErrorCode(), errorCode.getErrorMsg(), null);
    }

    public BaseResponse(ErrorCode errorCode, String message) {
        this(errorCode.getErrorCode(), message, null);
    }
}
