"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Editor } from "@bytemd/react";
import gfmPlugin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight";
import { getCategoryTree } from "@/lib/api/category";
import { getTagTree } from "@/lib/api/tag";
import { uploadFile } from "@/lib/api/file";
import type { CategoryVO, TagVO } from "@/lib/types";
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";

interface ArticleFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialCategories?: string[];
  initialTags?: string[];
  submitLabel: string;
  loading: boolean;
  onSubmit: (data: {
    title: string;
    content: string;
    categories: string[];
    tags: string[];
  }) => void;
}

function flattenTree<T extends { id: string; children: T[] }>(
  nodes: T[],
  level = 0,
): Array<T & { _level: number }> {
  const result: Array<T & { _level: number }> = [];
  for (const node of nodes) {
    result.push({ ...node, _level: level });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, level + 1));
    }
  }
  return result;
}

export function ArticleForm({
  initialTitle = "",
  initialContent = "",
  initialCategories = [],
  initialTags = [],
  submitLabel,
  loading,
  onSubmit,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const [categoryTree, setCategoryTree] = useState<CategoryVO[]>([]);
  const [tagTree, setTagTree] = useState<TagVO[]>([]);

  const plugins = useMemo(() => [gfmPlugin(), highlightPlugin()], []);

  const uploadImages = useCallback(async (files: File[]) => {
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const { fileUrl } = await uploadFile(file);
          return { url: fileUrl };
        }),
      );
      return results;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "上传失败";
      window.alert(`图片上传失败：${msg}`);
      throw e;
    }
  }, []);

  useEffect(() => {
    getCategoryTree().then(setCategoryTree).catch(() => {});
    getTagTree().then(setTagTree).catch(() => {});
  }, []);

  const flatCategories = useMemo(
    () =>
      flattenTree(
        categoryTree.map((c) => ({
          id: c.id,
          name: c.categoryName,
          children: (c.children || []).map((ch) => ({
            id: ch.id,
            name: ch.categoryName,
            children: [] as { id: string; name: string; children: never[] }[],
          })),
        })),
      ),
    [categoryTree],
  );

  const flatTags = useMemo(
    () =>
      flattenTree(
        tagTree.map((t) => ({
          id: t.id,
          name: t.tagName,
          children: (t.children || []).map((ch) => ({
            id: ch.id,
            name: ch.tagName,
            children: [] as { id: string; name: string; children: never[] }[],
          })),
        })),
      ),
    [tagTree],
  );

  function toggleItem(list: string[], item: string): string[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (selectedCategories.length === 0 || selectedTags.length === 0) return;
    onSubmit({
      title: title.trim(),
      content,
      categories: selectedCategories,
      tags: selectedTags,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
          文章标题 <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入文章标题"
          required
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          分类 <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {flatCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategories(toggleItem(selectedCategories, cat.name))}
              className={`rounded-md border px-2.5 py-1 text-sm transition-colors ${
                selectedCategories.includes(cat.name)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-ring"
              }`}
              style={{ marginLeft: cat._level * 12 }}
            >
              {cat.name}
            </button>
          ))}
          {flatCategories.length === 0 && (
            <span className="text-sm text-muted-foreground">暂无分类，请先创建</span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          标签 <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {flatTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTags(toggleItem(selectedTags, tag.name))}
              className={`rounded-md border px-2.5 py-1 text-sm transition-colors ${
                selectedTags.includes(tag.name)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-ring"
              }`}
              style={{ marginLeft: tag._level * 12 }}
            >
              {tag.name}
            </button>
          ))}
          {flatTags.length === 0 && (
            <span className="text-sm text-muted-foreground">暂无标签，请先创建</span>
          )}
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          文章内容 <span className="text-destructive">*</span>
        </label>
        <Editor value={content} plugins={plugins} onChange={setContent} uploadImages={uploadImages} />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim() || selectedCategories.length === 0 || selectedTags.length === 0}
          className="flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
