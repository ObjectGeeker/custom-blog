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
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <div className="flex-1 space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-secondary" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-secondary" />
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
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-lg text-muted-foreground">文章不存在</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-foreground underline underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" /> 返回首页
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8 sm:px-6">
        {/* Left Sidebar - Related Articles */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <p className="mb-3 text-sm font-semibold">同分类文章</p>
            {relatedArticles.length === 0 ? (
              <p className="text-xs text-muted-foreground">暂无相关文章</p>
            ) : (
              <nav className="space-y-1">
                {relatedArticles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/article/${a.id}`}
                    className="block truncate rounded-sm px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {a.title}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <article className="min-w-0 flex-1">
          <header className="mb-8 border-b border-border pb-6">
            <h1 className="mb-4 text-3xl font-bold tracking-tight">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
        </article>

        {/* Right Sidebar - TOC */}
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
