create table custom_blog.tb_tag
(
    id             varchar(50)                        not null comment '主键id'
        primary key,
    tag_name       varchar(50)                        not null comment '标签名字',
    tag_desc       varchar(100)                       null comment '标签描述',
    business_level tinyint  default 1                 not null comment '业务级别(一级标签;二级标签)',
    path           varchar(255)                       not null comment '路径(/parentId/id)',
    parent_id      varchar(50)                        null comment '父级标签的id,一级标签为空',
    create_time    datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    create_user    varchar(50)                        not null comment '创建人id',
    update_time    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    update_user    varchar(50)                        not null comment '更新人',
    is_delete      tinyint  default 0                 not null comment '逻辑删除',
    constraint idx_path
        unique (path) comment '路径索引',
    constraint idx_tag_name
        unique (tag_name) comment '名称索引'
)
    comment '标签表' collate = utf8mb4_unicode_ci;

create index idx_business_level
    on custom_blog.tb_tag (business_level)
    comment '业务等级索引';

create index idx_parent_id
    on custom_blog.tb_tag (parent_id)
    comment '父id索引';

create table custom_blog.tb_category
(
    id             varchar(50)                        not null comment '主键id'
        primary key,
    category_name       varchar(50)                        not null comment '分类名字',
    category_desc       varchar(100)                       null comment '分类描述',
    business_level tinyint  default 1                 not null comment '业务级别(一级分类;二级分类)',
    path           varchar(255)                       not null comment '路径(/parentId/id)',
    parent_id      varchar(50)                        null comment '父级分类的id,一级分类为空',
    create_time    datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    create_user    varchar(50)                        not null comment '创建人id',
    update_time    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    update_user    varchar(50)                        not null comment '更新人',
    is_delete      tinyint  default 0                 not null comment '逻辑删除',
    constraint idx_path
        unique (path) comment '路径索引',
    constraint idx_tag_name
        unique (category_name) comment '名称索引'
)
    comment '分类表' collate = utf8mb4_unicode_ci;

create index idx_business_level
    on custom_blog.tb_category (business_level)
    comment '业务等级索引';

create index idx_parent_id
    on custom_blog.tb_category (parent_id)
    comment '父id索引';

alter table tb_category
    add `order` int default 1 not null comment '顺序号';



create table tb_article
(
    id         varchar(50)  not null comment '文章id'
        primary key,
    title      varchar(50)  not null comment '文章标题',
    content    longtext     not null comment '文章内容',
    tags       varchar(100) not null comment '文章标签(JSON数组)',
    categories varchar(100) not null comment '文章分类(JSON数组)',
    create_time    datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    create_user    varchar(50)                        not null comment '创建人id',
    update_time    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    update_user    varchar(50)                        not null comment '更新人',
    is_delete      tinyint  default 0                 not null comment '逻辑删除'
)
    comment '文章表' collate = utf8mb4_unicode_ci;

create index idx_category
    on tb_article (categories)
    comment '分类索引';

create index idx_tags
    on tb_article (tags)
    comment '标签索引';

create index idx_title
    on tb_article (title)
    comment '标题索引';

CREATE TABLE `tb_user`
(
    `id`            VARCHAR(64)  NOT NULL COMMENT '用户id',
    `user_name`     VARCHAR(64)           DEFAULT NULL COMMENT '用户名',
    `user_account`  VARCHAR(64)  NOT NULL COMMENT '用户账号',
    `user_password` VARCHAR(256) NOT NULL COMMENT '用户密码',
    `email`         VARCHAR(128) NOT NULL DEFAULT '' COMMENT '用户邮箱',
    `phone_number`  VARCHAR(20)  NOT NULL DEFAULT '' COMMENT '用户手机号',
    `status`        VARCHAR(20)           DEFAULT 'ACTIVE' COMMENT '用户账号状态 BAN-封禁 ACTIVE-正常',
    `create_time`   DATETIME              DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_user`   VARCHAR(64)           DEFAULT NULL COMMENT '创建人',
    `update_time`   DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `update_user`   VARCHAR(64)           DEFAULT NULL COMMENT '更新人',
    `is_delete`     TINYINT(1)            DEFAULT 1 COMMENT '逻辑删除 0-已删除 1-未删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_account` (`user_account`),
    UNIQUE KEY `uk_phone_number` (`phone_number`),
    UNIQUE KEY `uk_email` (`email`),
    KEY `idx_status_is_delete` (`status`, `is_delete`),
    KEY `idx_create_time` (`create_time`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='系统用户表';

