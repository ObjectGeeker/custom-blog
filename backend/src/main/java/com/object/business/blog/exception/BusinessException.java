package com.object.business.blog.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final String errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getErrorMsg());
        this.errorCode = errorCode.getErrorCode();
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode.getErrorCode();
    }


}
