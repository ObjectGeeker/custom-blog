"use client";

import { useEffect, useState, useCallback } from "react";
import { getCategoryTree, createCategory, updateCategory, deleteCategory } from "@/lib/api/category";
import { TreeManager, type TreeNode } from "@/components/admin/TreeManager";
import type { CategoryVO } from "@/lib/types";

function mapCategoryToTree(cat: CategoryVO): TreeNode {
  return {
    id: cat.id,
    name: cat.categoryName,
    desc: cat.categoryDesc || "",
    businessLevel: cat.businessLevel,
    parentId: cat.parentId,
    children: (cat.children || []).map(mapCategoryToTree),
  };
}

export default function CategoriesPage() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTree = useCallback(() => {
    setLoading(true);
    getCategoryTree()
      .then((data) => setTree(data.map(mapCategoryToTree)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  async function handleCreate(name: string, desc: string, parentId: string | null, level: number) {
    await createCategory({
      categoryName: name,
      categoryDesc: desc || undefined,
      businessLevel: level,
      parentId: parentId || undefined,
    });
    fetchTree();
  }

  async function handleUpdate(id: string, name: string, desc: string) {
    await updateCategory({
      id,
      categoryName: name,
      categoryDesc: desc || undefined,
    });
    fetchTree();
  }

  async function handleDelete(id: string) {
    await deleteCategory(id);
    fetchTree();
  }

  async function handleReorderSiblings(parentId: string | null, orderedChildIds: string[]) {
    await Promise.all(orderedChildIds.map((id, index) => updateCategory({ id, order: index })));
    fetchTree();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">分类管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理文章分类，支持最多四级分类；按住左侧手柄拖动可调整同级顺序
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
            onReorderSiblings={handleReorderSiblings}
          />
        </div>
      )}
    </div>
  );
}
