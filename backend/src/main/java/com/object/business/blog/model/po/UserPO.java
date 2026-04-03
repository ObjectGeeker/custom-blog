package com.object.business.blog.model.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@TableName(value = "tb_user")
public class UserPO {

    /**
     * 用户id
     */
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    /**
     * 用户名
     */
    @TableField(value = "user_name")
    private String userName;
    /**
     * 用户账号
     */
    @TableField(value = "user_account")
    private String userAccount;
    /**
     * 用户密码
     */
    @TableField(value = "user_password")
    private String userPassword;
    /**
     * 用户邮箱
     */
    @TableField(value = "email")
    private String email;
    /**
     * 用户手机号
     */
    @TableField(value = "phone_number")
    private String phoneNumber;
    /**
     * 用户账号状态 BAN - 封禁 ACTIVE - 正常
     */
    @TableField(value = "status")
    private String status;
    /**
     * 创建时间
     */
    @TableField(value = "create_time")
    private LocalDateTime createTime;
    /**
     * 创建人
     */
    @TableField(value = "create_user", fill = FieldFill.INSERT)
    private String createUser;
    /**
     * 更新时间
     */
    @TableField(value = "update_time")
    private LocalDateTime updateTime;
    /**
     * 更新人
     */
    @TableField(value = "update_user", fill = FieldFill.INSERT_UPDATE)
    private String updateUser;
    /**
     * 逻辑删除
     */
    @TableLogic(delval = "0", value = "is_delete")
    private Integer isDelete;

}