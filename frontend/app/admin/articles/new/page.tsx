"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticle } from "@/lib/api/article";

export default function NewArticlePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: {
    title: string;
    content: string;
    categories: string[];
    tags: string[];
  }) {
    setLoading(true);
    try {
      await createArticle(data);
      router.push("/admin/articles");
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold tracking-tight">新建文章</h1>
      </div>

      <ArticleForm submitLabel="发布文章" loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}
