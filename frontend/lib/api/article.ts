import { post } from "./client";
import type {
  ArticleVO,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleQueryRequest,
} from "@/lib/types";

export async function createArticle(data: ArticleCreateRequest): Promise<string> {
  return post<string>("/api/article", data);
}

export async function updateArticle(data: ArticleUpdateRequest): Promise<boolean> {
  return post<boolean>("/api/article/update", data);
}

export async function deleteArticle(id: string): Promise<boolean> {
  return post<boolean>("/api/article/delete", { id });
}

export async function getArticleById(id: string): Promise<ArticleVO> {
  return post<ArticleVO>("/api/article/getById", { id });
}

export async function listArticles(query: ArticleQueryRequest = {}): Promise<ArticleVO[]> {
  return post<ArticleVO[]>("/api/article/list", query);
}
