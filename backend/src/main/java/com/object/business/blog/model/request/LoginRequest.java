package com.object.business.blog.model.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户登录请求体
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    /**
     * 登录账号（用户账号 or 邮箱 or 手机号）
     */
    @NotNull
    @Min(value = 4, message = "用户账号不能小于4位")
    @Max(value = 12, message = "用户账号不能大于12位")
    private String loginAccount;
    /**
     * 登录凭证（密码 or 验证码）
     */
    @NotNull
    @Min(value = 4, message = "凭证不能小于4位")
    @Max(value = 16, message = "凭证不能大于16位")
    private String loginVerifyCode;
    /**
     * 登录类型（账密 or 邮箱 or 手机号）
     */
    private String loginType;

}
