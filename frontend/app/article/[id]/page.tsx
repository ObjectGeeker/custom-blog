"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, User, FolderOpen, Tag, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { getArticleById, listArticles } from "@/lib/api/article";
import { formatDate, extractHeadings } from "@/lib/utils";
import type { ArticleVO, HeadingItem } from "@/lib/types";

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<ArticleVO | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleVO[]>([]);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getArticleById(id)
      .then((data) => {
        setArticle(data);
        setHeadings(extractHeadings(data.content));

        if (data.categories.length > 0) {
          listArticles({ category: data.categories[0] })
            .then((list) =>
              setRelatedArticles(list.filter((a) => a.id !== data.id).slice(0, 10)),
            )
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-base-100">
        <Header />
        <main className="mx-auto flex max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <div className="flex-1 space-y-4">
            <div className="skeleton h-10 w-2/3" />
            <div className="skeleton h-6 w-1/3" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-4 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col bg-base-100">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="mb-4 text-lg text-base-content/60">文章不存在</p>
            <Link href="/" className="btn btn-ghost btn-sm gap-1">
              <ArrowLeft className="h-4 w-4" /> 返回首页
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-100">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8 sm:px-6">
        {/* Left Sidebar - Related Articles */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-sm font-semibold text-base-content">同分类文章</p>
            {relatedArticles.length === 0 ? (
              <p className="text-xs text-base-content/50">暂无相关文章</p>
            ) : (
              <ul className="menu menu-sm rounded-box border border-base-200 bg-base-100 p-2">
                {relatedArticles.map((a) => (
                  <li key={a.id}>
                    <Link href={`/article/${a.id}`} className="truncate text-sm">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <article className="card card-border min-w-0 flex-1 border-base-200 bg-base-100 shadow-sm">
          <div className="card-body px-4 py-8 sm:px-8">
          <header className="mb-8 border-b border-base-200 pb-6">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-base-content">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(article.createTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {article.createUser}
              </span>
              {article.categories.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  {article.categories.join(" / ")}
                </span>
              )}
              {article.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  {article.tags.join(", ")}
                </span>
              )}
            </div>
          </header>

          <MarkdownRenderer content={article.content} />
          </div>
        </article>

        {/* Right Sidebar - TOC */}
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-24 rounded-box border border-base-200 bg-base-100 p-4">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
