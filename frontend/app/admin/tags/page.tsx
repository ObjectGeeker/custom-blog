"use client";

import { useEffect, useState, useCallback } from "react";
import { getTagTree, createTag, updateTag, deleteTag } from "@/lib/api/tag";
import { TreeManager, type TreeNode } from "@/components/admin/TreeManager";
import type { TagVO } from "@/lib/types";

function mapTagToTree(tag: TagVO): TreeNode {
  return {
    id: tag.id,
    name: tag.tagName,
    desc: tag.tagDesc || "",
    businessLevel: tag.businessLevel,
    parentId: tag.parentId,
    children: (tag.children || []).map(mapTagToTree),
  };
}

export default function TagsPage() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTree = useCallback(() => {
    setLoading(true);
    getTagTree()
      .then((data) => setTree(data.map(mapTagToTree)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  async function handleCreate(name: string, desc: string, parentId: string | null, level: number) {
    await createTag({
      tagName: name,
      tagDesc: desc || undefined,
      businessLevel: level,
      parentId: parentId || undefined,
    });
    fetchTree();
  }

  async function handleUpdate(id: string, name: string, desc: string) {
    await updateTag({
      id,
      tagName: name,
      tagDesc: desc || undefined,
    });
    fetchTree();
  }

  async function handleDelete(id: string) {
    await deleteTag(id);
    fetchTree();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">标签管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理文章标签，支持最多四级标签
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border p-4">
          <TreeManager
            tree={tree}
            maxLevel={4}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
