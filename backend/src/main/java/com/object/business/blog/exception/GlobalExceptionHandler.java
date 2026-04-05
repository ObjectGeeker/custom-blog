package com.object.business.blog.exception;

import com.object.business.blog.common.BaseResponse;
import com.object.business.blog.common.ResultUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(exception = BusinessException.class)
    public BaseResponse<String> businessExceptionHandler(BusinessException e) {
        log.info("全局异常处理器 - 捕获到业务异常 errorCode: {}, errorMsg: {}, exception: {}", e.getErrorCode(), e.getMessage(), e.toString());
        return ResultUtils.error(e.getErrorCode(), e.getMessage());
    }

    @ExceptionHandler(exception = RuntimeException.class)
    public BaseResponse<String> businessExceptionHandler(RuntimeException e) {
        log.info("全局异常处理器 - 捕获到运行时异常", e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR);
    }

}
