import { post } from "./client";
import type {
  TagVO,
  TagCreateRequest,
  TagUpdateRequest,
  TagQueryRequest,
} from "@/lib/types";

export async function createTag(data: TagCreateRequest): Promise<string> {
  return post<string>("/api/tag", data);
}

export async function updateTag(data: TagUpdateRequest): Promise<boolean> {
  return post<boolean>("/api/tag/update", data);
}

export async function deleteTag(id: string): Promise<boolean> {
  return post<boolean>("/api/tag/delete", { id });
}

export async function getTagById(id: string): Promise<TagVO> {
  return post<TagVO>("/api/tag/getById", { id });
}

export async function listTags(query: TagQueryRequest = {}): Promise<TagVO[]> {
  return post<TagVO[]>("/api/tag/list", query);
}

export async function getTagTree(): Promise<TagVO[]> {
  return post<TagVO[]>("/api/tag/tree");
}
