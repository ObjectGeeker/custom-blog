package com.object.business.blog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.object.business.blog.model.po.Tag;
import com.object.business.blog.model.request.TagCreateRequest;
import com.object.business.blog.model.request.TagQueryRequest;
import com.object.business.blog.model.request.TagUpdateRequest;
import com.object.business.blog.model.vo.TagVO;

import java.util.List;

/**
 * 标签表 服务接口
 */
public interface TagService extends IService<Tag> {

    /**
     * 创建标签
     *
     * @param request 创建请求
     * @return 标签ID
     */
    String createTag(TagCreateRequest request);

    /**
     * 更新标签
     *
     * @param request 更新请求
     * @return 是否成功
     */
    boolean updateTag(TagUpdateRequest request);

    /**
     * 删除标签
     *
     * @param id 标签ID
     * @return 是否成功
     */
    boolean deleteTag(String id);

    /**
     * 根据ID查询标签
     *
     * @param id 标签ID
     * @return 标签视图对象
     */
    TagVO getTagById(String id);

    /**
     * 查询标签列表
     *
     * @param request 查询请求
     * @return 标签视图对象列表
     */
    List<TagVO> listTags(TagQueryRequest request);

    /**
     * 查询标签树
     *
     * @return 标签树列表
     */
    List<TagVO> getTagTree();
}
