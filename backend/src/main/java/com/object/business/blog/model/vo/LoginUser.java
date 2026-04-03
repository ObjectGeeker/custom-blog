package com.object.business.blog.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 记录登录用户信息
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginUser {

    private String userId;

    private String userName;

    private String email;

    private String phoneNumber;

    private List<String> roles;

}
