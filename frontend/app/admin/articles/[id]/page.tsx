"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticleById, updateArticle } from "@/lib/api/article";
import type { ArticleVO } from "@/lib/types";

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [article, setArticle] = useState<ArticleVO | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getArticleById(id)
      .then(setArticle)
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [id]);

  async function handleSubmit(data: {
    title: string;
    summary: string;
    content: string;
    categories: string[];
    tags: string[];
  }) {
    setSubmitLoading(true);
    try {
      await updateArticle({ id, ...data });
      router.push("/admin/articles");
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!article) {
    return <p className="py-16 text-center text-muted-foreground">文章不存在</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/articles"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">编辑文章</h1>
      </div>

      <ArticleForm
        initialTitle={article.title}
        initialSummary={article.summary}
        initialContent={article.content}
        initialCategories={article.categories}
        initialTags={article.tags}
        submitLabel="更新文章"
        loading={submitLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
