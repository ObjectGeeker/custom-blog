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
    <div className="flex min-h-screen flex-col bg-base-100">
      <Header />

      <main className="flex-1">
        {/* Profile Section */}
        <section className="border-b border-base-200 bg-base-200/30">
          <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-base-200 ring-offset-2 ring-offset-base-100 sm:w-28">
                  <img
                    src={siteConfig.author.avatar}
                    alt={siteConfig.author.name}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                  {siteConfig.author.name}
                </h1>
                <p className="mb-6 max-w-lg text-base leading-relaxed text-base-content/70">
                  {siteConfig.author.bio}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {siteConfig.author.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm border-base-300"
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
        <section className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-base-content">最新文章</h2>
            <a
              href="/search"
              className="btn btn-ghost btn-sm gap-1 font-normal text-base-content/70 hover:text-base-content"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-40 rounded-box border border-base-200"
                />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <p className="py-12 text-center text-base-content/60">暂无文章</p>
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
