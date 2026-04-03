"use client";

import { useEffect, useState } from "react";
import { Mail, ArrowRight, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { siteConfig } from "@/config/site";
import { listArticles } from "@/lib/api/article";
import type { ArticleVO } from "@/lib/types";

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listArticles({})
      .then((data) => setArticles(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    GitHub: <ExternalLink className="h-4 w-4" />,
    Email: <Mail className="h-4 w-4" />,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Profile Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <img
                src={siteConfig.author.avatar}
                alt={siteConfig.author.name}
                className="h-24 w-24 rounded-full border-2 border-border object-cover sm:h-28 sm:w-28"
              />
              <div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {siteConfig.author.name}
                </h1>
                <p className="mb-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                  {siteConfig.author.bio}
                </p>
                <div className="flex items-center justify-center gap-3 sm:justify-start">
                  {siteConfig.author.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
                    >
                      {iconMap[link.name]}
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">最新文章</h2>
            <a
              href="/search"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-lg border border-border bg-secondary"
                />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              暂无文章
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
