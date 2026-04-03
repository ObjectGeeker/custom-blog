package com.object.business.blog.common;


import com.object.business.blog.exception.ErrorCode;

/**
 * 返回工具类
 */
public class ResultUtils {

    /**
     * 成功
     *
     * @param data 数据
     * @param <T>  返回参数类型
     * @return 通用返回类
     */
    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(ErrorCode.SUCCESS.getErrorCode(), ErrorCode.SUCCESS.getErrorMsg(), data);
    }

    /**
     * 失败
     *
     * @param errorCode 错误码
     * @param <T>       返回参数类型
     * @return 通用返回类
     */
    public static <T> BaseResponse<T> error(ErrorCode errorCode) {
        return new BaseResponse<>(errorCode);
    }

    /**
     * 失败
     *
     * @param errorCode 错误码
     * @param message   错误消息
     * @param <T>       返回参数类型
     * @return 通用返回类
     */
    public static <T> BaseResponse<T> error(ErrorCode errorCode, String message) {
        return new BaseResponse<>(errorCode, message);
    }

    /**
     * 失败
     *
     * @param errorCode 错误码
     * @param message   错误消息
     * @param <T>       返回参数类型
     * @return 通用返回类
     */
    public static <T> BaseResponse<T> error(String errorCode, String message) {
        return new BaseResponse<>(errorCode, message, null);
    }

}
