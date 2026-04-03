package com.object.business.blog.controller;

import com.object.business.blog.common.BaseResponse;
import com.object.business.blog.common.ResultUtils;
import com.object.business.blog.model.request.ArticleCreateRequest;
import com.object.business.blog.model.request.ArticleQueryRequest;
import com.object.business.blog.model.request.ArticleUpdateRequest;
import com.object.business.blog.model.vo.ArticleVO;
import com.object.business.blog.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 文章表 控制器
 */
@RestController
@RequestMapping("/api/article")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    /**
     * 创建文章
     */
    @PostMapping
    public BaseResponse<String> create(@Valid @RequestBody ArticleCreateRequest request) {
        String articleId = articleService.createArticle(request);
        return ResultUtils.success(articleId);
    }

    /**
     * 更新文章
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> update(@Valid @RequestBody ArticleUpdateRequest request) {
        boolean result = articleService.updateArticle(request);
        return ResultUtils.success(result);
    }

    /**
     * 删除文章
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> delete(@RequestBody String id) {
        boolean result = articleService.deleteArticle(id);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID查询文章
     */
    @PostMapping("/getById")
    public BaseResponse<ArticleVO> getById(@RequestBody String id) {
        ArticleVO articleVO = articleService.getArticleById(id);
        return ResultUtils.success(articleVO);
    }

    /**
     * 查询文章列表
     */
    @PostMapping("/list")
    public BaseResponse<List<ArticleVO>> list(@RequestBody ArticleQueryRequest request) {
        List<ArticleVO> list = articleService.listArticles(request);
        return ResultUtils.success(list);
    }
}
