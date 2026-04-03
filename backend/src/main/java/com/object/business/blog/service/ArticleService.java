package com.object.business.blog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.object.business.blog.model.po.Article;
import com.object.business.blog.model.request.ArticleCreateRequest;
import com.object.business.blog.model.request.ArticleQueryRequest;
import com.object.business.blog.model.request.ArticleUpdateRequest;
import com.object.business.blog.model.vo.ArticleVO;

import java.util.List;

/**
 * 文章表 服务接口
 */
public interface ArticleService extends IService<Article> {

    /**
     * 创建文章
     *
     * @param request 创建请求
     * @return 文章ID
     */
    String createArticle(ArticleCreateRequest request);

    /**
     * 更新文章
     *
     * @param request 更新请求
     * @return 是否成功
     */
    boolean updateArticle(ArticleUpdateRequest request);

    /**
     * 删除文章
     *
     * @param id 文章ID
     * @return 是否成功
     */
    boolean deleteArticle(String id);

    /**
     * 根据ID查询文章
     *
     * @param id 文章ID
     * @return 文章视图对象
     */
    ArticleVO getArticleById(String id);

    /**
     * 查询文章列表
     *
     * @param request 查询请求
     * @return 文章视图对象列表
     */
    List<ArticleVO> listArticles(ArticleQueryRequest request);
}
