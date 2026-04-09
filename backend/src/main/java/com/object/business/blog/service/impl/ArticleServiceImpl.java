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
import com.object.business.blog.model.po.Category;
import com.object.business.blog.model.po.Tag;
import com.object.business.blog.model.request.ArticleCreateRequest;
import com.object.business.blog.model.request.ArticleQueryRequest;
import com.object.business.blog.model.request.ArticleUpdateRequest;
import com.object.business.blog.model.vo.ArticleVO;
import com.object.business.blog.service.ArticleService;
import com.object.business.blog.service.CategoryService;
import com.object.business.blog.service.TagService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 文章表 服务实现类
 */
@Slf4j
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    @Value("${blog.file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    /** Markdown 图片: ![alt](/api/static/userId/file.jpg) */
    private static final Pattern MD_IMAGE_PATTERN =
            Pattern.compile("!\\[.*?]\\(([^)]+)\\)");

    /** HTML img 标签: <img src="/api/static/userId/file.jpg"> */
    private static final Pattern HTML_IMAGE_PATTERN =
            Pattern.compile("<img[^>]+src=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);

    @Resource
    private CategoryService categoryService;

    @Resource
    private TagService tagService;

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
        if (request.getSummary() != null) {
            article.setSummary(request.getSummary());
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
        Article article = getById(id);
        ThrowUtils.throwIf(article == null, ErrorCode.NOT_FOUND_ERROR, "文章不存在");

        deleteReferencedFiles(article.getContent());

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
            // 如果根据标签查找的话，需要把当前标签下的子级标签都找到，这样就可以做到一类查询
            // 找到所有的子级标签
            Tag tag = tagService.lambdaQuery().eq(Tag::getTagName, request.getTag()).one();
            List<Tag> tagList = tagService.lambdaQuery().likeRight(Tag::getPath, tag.getPath()).list();
            String jsonStr = JSONUtil.toJsonStr(tagList.stream().map(Tag::getTagName).toList());
            wrapper.apply("JSON_OVERLAPS(tags, {0})", jsonStr);
        }
        if (StrUtil.isNotBlank(request.getCategory())) {
            // 找到所有的子级分类
            Category category = categoryService.lambdaQuery().eq(Category::getCategoryName, request.getCategory()).one();
            List<Category> categoryList = categoryService.lambdaQuery().likeRight(Category::getPath, category.getPath()).list();
            String jsonStr = JSONUtil.toJsonStr(categoryList.stream().map(Category::getCategoryName).toList());
            wrapper.apply("JSON_OVERLAPS(categories, {0})", jsonStr);
        }

        List<Article> list = list(wrapper);
        return list.stream().map(this::convertToVO).toList();
    }

    /**
     * 从 Markdown 内容中提取引用的文件 URL，并删除对应的本地文件
     */
    private void deleteReferencedFiles(String content) {
        if (StrUtil.isBlank(content)) {
            return;
        }

        String staticPrefix = normalizeContextPath(contextPath) + "/static/";
        Set<String> relativePaths = new HashSet<>();

        extractRelativePaths(MD_IMAGE_PATTERN, content, staticPrefix, relativePaths);
        extractRelativePaths(HTML_IMAGE_PATTERN, content, staticPrefix, relativePaths);

        Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        for (String relativePath : relativePaths) {
            Path filePath = uploadRoot.resolve(relativePath).normalize();
            if (!filePath.startsWith(uploadRoot)) {
                log.warn("跳过非法文件路径: {}", filePath);
                continue;
            }
            try {
                boolean deleted = Files.deleteIfExists(filePath);
                if (deleted) {
                    log.info("已删除文件: {}", filePath);
                }
            } catch (IOException e) {
                log.warn("删除文件失败: {}", filePath, e);
            }
        }
    }

    private static void extractRelativePaths(Pattern pattern, String content,
                                             String staticPrefix, Set<String> out) {
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            String url = matcher.group(1);
            if (url.startsWith(staticPrefix)) {
                out.add(url.substring(staticPrefix.length()));
            }
        }
    }

    private static String normalizeContextPath(String contextPath) {
        if (StrUtil.isBlank(contextPath) || "/".equals(contextPath)) {
            return "";
        }
        return contextPath.endsWith("/")
                ? contextPath.substring(0, contextPath.length() - 1)
                : contextPath;
    }

    /**
     * 转换为视图对象
     */
    private ArticleVO convertToVO(Article article) {
        ArticleVO vo = new ArticleVO();
        BeanUtil.copyProperties(article, vo, "tags", "categories", "createUser", "updateUser");
        vo.setTags(JSONUtil.toList(article.getTags(), String.class));
        vo.setCategories(JSONUtil.toList(article.getCategories(), String.class));
        return vo;
    }
}
