package com.object.business.blog.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.object.business.blog.exception.BusinessException;
import com.object.business.blog.exception.ErrorCode;
import com.object.business.blog.exception.ThrowUtils;
import com.object.business.blog.mapper.TagMapper;
import com.object.business.blog.model.po.Tag;
import com.object.business.blog.model.request.TagCreateRequest;
import com.object.business.blog.model.request.TagQueryRequest;
import com.object.business.blog.model.request.TagUpdateRequest;
import com.object.business.blog.model.vo.TagVO;
import com.object.business.blog.service.TagService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 标签表 服务实现类
 */
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

    @Override
    public String createTag(TagCreateRequest request) {
        Tag tag = new Tag();
        BeanUtil.copyProperties(request, tag);

        // 构建路径
        tag.setPath(buildPath(request.getParentId(), tag.getId()));

        save(tag);
        return tag.getId();
    }

    @Override
    public boolean updateTag(TagUpdateRequest request) {
        Tag tag = getById(request.getId());
        ThrowUtils.throwIf(tag == null, ErrorCode.NOT_FOUND_ERROR, "标签不存在");

        BeanUtil.copyProperties(request, tag);

        // 如果修改了父级ID，需要重新计算路径
        if (request.getParentId() != null && !request.getParentId().equals(tag.getParentId())) {
            tag.setPath(buildPath(request.getParentId(), tag.getId()));
        }

        return updateById(tag);
    }

    @Override
    public boolean deleteTag(String id) {
        return removeById(id);
    }

    @Override
    public TagVO getTagById(String id) {
        Tag tag = getById(id);
        ThrowUtils.throwIf(tag == null, ErrorCode.NOT_FOUND_ERROR, "标签不存在");
        return convertToVO(tag);
    }

    @Override
    public List<TagVO> listTags(TagQueryRequest request) {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();

        if (StrUtil.isNotBlank(request.getTagName())) {
            wrapper.like(Tag::getTagName, request.getTagName());
        }
        if (request.getBusinessLevel() != null) {
            wrapper.eq(Tag::getBusinessLevel, request.getBusinessLevel());
        }
        if (StrUtil.isNotBlank(request.getParentId())) {
            wrapper.eq(Tag::getParentId, request.getParentId());
        }

        List<Tag> list = list(wrapper);
        return list.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public List<TagVO> getTagTree() {
        List<Tag> allTags = list();
        return buildTagTree(allTags);
    }

    /**
     * 构建标签树
     */
    private List<TagVO> buildTagTree(List<Tag> tags) {
        // 转换为VO
        List<TagVO> voList = tags.stream().map(this::convertToVO).toList();

        // 按父ID分组
        Map<String, List<TagVO>> parentIdMap = voList.stream()
                .filter(vo -> vo.getParentId() != null)
                .collect(Collectors.groupingBy(TagVO::getParentId));

        // 设置子节点
        voList.forEach(vo -> vo.setChildren(parentIdMap.get(vo.getId())));

        // 返回根节点（parentId为空的）
        return voList.stream()
                .filter(vo -> StrUtil.isBlank(vo.getParentId()))
                .collect(Collectors.toList());
    }

    /**
     * 转换为视图对象
     */
    private TagVO convertToVO(Tag tag) {
        TagVO vo = new TagVO();
        BeanUtil.copyProperties(tag, vo);
        return vo;
    }

    /**
     * 构建路径
     *
     * @param parentId 父级ID
     * @param id       当前ID
     * @return 路径
     */
    private String buildPath(String parentId, String id) {
        if (StrUtil.isNotBlank(parentId)) {
            Tag parentTag = getById(parentId);
            if (parentTag != null) {
                return parentTag.getPath() + "/" + id;
            }
        }
        return "/" + id;
    }
}
