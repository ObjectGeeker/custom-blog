import { post } from "./client";
import type {
  CategoryVO,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQueryRequest,
} from "@/lib/types";

export async function createCategory(data: CategoryCreateRequest): Promise<string> {
  return post<string>("/api/category", data);
}

export async function updateCategory(data: CategoryUpdateRequest): Promise<boolean> {
  return post<boolean>("/api/category/update", data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  return post<boolean>("/api/category/delete", { id });
}

export async function getCategoryById(id: string): Promise<CategoryVO> {
  return post<CategoryVO>("/api/category/getById", { id });
}

export async function listCategories(query: CategoryQueryRequest = {}): Promise<CategoryVO[]> {
  return post<CategoryVO[]>("/api/category/list", query);
}

export async function getCategoryTree(): Promise<CategoryVO[]> {
  return post<CategoryVO[]>("/api/category/tree");
}
