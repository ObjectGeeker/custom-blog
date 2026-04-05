"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { listArticles } from "@/lib/api/article";
import type { ArticleVO } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";

  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState(title);

  useEffect(() => {
    setLoading(true);
    setSearchTitle(title);
    listArticles({
      title: title || undefined,
      category: category || undefined,
      tag: tag || undefined,
    })
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [title, category, tag]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchTitle.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("title", trimmed);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    window.history.pushState({}, "", `/search?${params.toString()}`);
    setLoading(true);
    listArticles({
      title: trimmed || undefined,
      category: category || undefined,
      tag: tag || undefined,
    })
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }

  return (
    <>
      {/* Search Form */}
      <div className="border-b border-base-200 bg-base-200/20">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <form onSubmit={handleSearch} className="relative mx-auto max-w-xl">
            <SearchIcon className="absolute left-4 top-1/2 z-1 h-5 w-5 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="输入关键词搜索文章..."
              className="input input-bordered input-lg h-12 w-full border-base-200 bg-base-100 pl-12 pr-4 placeholder:text-base-content/40"
            />
          </form>

          {(title || category || tag) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
              {title && (
                <span className="badge badge-neutral badge-lg badge-outline">关键词: {title}</span>
              )}
              {category && (
                <span className="badge badge-neutral badge-lg badge-outline">分类: {category}</span>
              )}
              {tag && (
                <span className="badge badge-neutral badge-lg badge-outline">标签: {tag}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-40 rounded-box border border-base-200"
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">没有找到相关文章</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-base-content/60">
              找到 {articles.length} 篇文章
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-base-100">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
