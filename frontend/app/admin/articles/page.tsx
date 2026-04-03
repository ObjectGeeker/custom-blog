"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
import { listArticles, deleteArticle } from "@/lib/api/article";
import { formatDate } from "@/lib/utils";
import type { ArticleVO } from "@/lib/types";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchArticles() {
    setLoading(true);
    listArticles({})
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`确定删除文章「${title}」吗？`)) return;
    try {
      await deleteArticle(id);
      fetchArticles();
    } catch {
      alert("删除失败");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          新建文章
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg border border-border bg-secondary" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">暂无文章</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-3 text-left font-medium">标题</th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">分类</th>
                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">标签</th>
                <th className="px-4 py-3 text-left font-medium">创建时间</th>
                <th className="px-4 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{article.title}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {article.categories.join(", ")}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {article.tags.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(article.createTime)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        title="编辑"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
