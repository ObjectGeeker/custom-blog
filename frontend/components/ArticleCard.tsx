import Link from "next/link";
import { Calendar, Tag, FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ArticleVO } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleVO;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`} className="group block">
      <article className="card card-border border-base-200 bg-base-100 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
        <div className="card-body gap-3 p-5">
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-base-content group-hover:text-base-content/80">
            {article.title}
          </h3>

          {article.summary && (
            <p className="line-clamp-2 text-sm leading-relaxed text-base-content/60">
              {article.summary}
            </p>
          )}

          <div className="card-actions flex flex-wrap items-center gap-3 text-xs text-base-content/50">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.createTime)}
            </span>

            {article.categories.length > 0 && (
              <span className="flex items-center gap-1">
                <FolderOpen className="h-3.5 w-3.5" />
                {article.categories.slice(0, 3).join(", ")}
              </span>
            )}

            {article.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {article.tags.slice(0, 3).join(", ")}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
