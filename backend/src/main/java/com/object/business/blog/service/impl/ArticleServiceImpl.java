package com.object.business.blog.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.object.business.blog.exception.ErrorCode;
import com.object.business.blog.exception.ThrowUtils;
import com.object.business.blog.mapper.ArticleMapper;
import com.object.business.blog.model.po.Article;
import com.object.business.blog.model.request.ArticleCreateRequest;
import com.object.business.blog.model.request.ArticleQueryRequest;
import com.object.business.blog.model.request.ArticleUpdateRequest;
import com.object.business.blog.model.vo.ArticleVO;
import com.object.business.blog.service.ArticleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 文章表 服务实现类
 */
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    @Override
    public String createArticle(ArticleCreateRequest request) {
        Article article = new Article();
        BeanUtil.copyProperties(request, article);

        // 将标签和分类列表转换为JSON字符串
        article.setTags(JSONUtil.toJsonStr(request.getTags()));
        article.setCategories(JSONUtil.toJsonStr(request.getCategories()));

        save(article);
        return article.getId();
    }

    @Override
    public boolean updateArticle(ArticleUpdateRequest request) {
        Article article = getById(request.getId());
        ThrowUtils.throwIf(article == null, ErrorCode.NOT_FOUND_ERROR, "文章不存在");

        if (StrUtil.isNotBlank(request.getTitle())) {
            article.setTitle(request.getTitle());
        }
        if (StrUtil.isNotBlank(request.getContent())) {
            article.setContent(request.getContent());
        }
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            article.setTags(JSONUtil.toJsonStr(request.getTags()));
        }
        if (request.getCategories() != null && !request.getCategories().isEmpty()) {
            article.setCategories(JSONUtil.toJsonStr(request.getCategories()));
        }

        return updateById(article);
    }

    @Override
    public boolean deleteArticle(String id) {
        return removeById(id);
    }

    @Override
    public ArticleVO getArticleById(String id) {
        Article article = getById(id);
        ThrowUtils.throwIf(article == null, ErrorCode.NOT_FOUND_ERROR, "文章不存在");
        return convertToVO(article);
    }

    @Override
    public List<ArticleVO> listArticles(ArticleQueryRequest request) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();

        if (StrUtil.isNotBlank(request.getTitle())) {
            wrapper.like(Article::getTitle, request.getTitle());
        }
        if (StrUtil.isNotBlank(request.getTag())) {
            wrapper.like(Article::getTags, request.getTag());
        }
        if (StrUtil.isNotBlank(request.getCategory())) {
            wrapper.like(Article::getCategories, request.getCategory());
        }

        List<Article> list = list(wrapper);
        return list.stream().map(this::convertToVO).toList();
    }

    /**
     * 转换为视图对象
     */
    private ArticleVO convertToVO(Article article) {
        ArticleVO vo = new ArticleVO();
        BeanUtil.copyProperties(article, vo);
        // 将JSON字符串转换为列表
        vo.setTags(JSONUtil.toList(article.getTags(), String.class));
        vo.setCategories(JSONUtil.toList(article.getCategories(), String.class));
        return vo;
    }
}
