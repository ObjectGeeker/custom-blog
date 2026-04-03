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

