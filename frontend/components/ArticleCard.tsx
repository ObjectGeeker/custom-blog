import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ArticleVO } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleVO;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`} className="group block">
      <article className="rounded-lg border border-border p-5 transition-all duration-200 hover:border-ring hover:shadow-sm">
        <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-muted-foreground">
          {article.title}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.content.replace(/[#*`>\-\[\]()!]/g, "").slice(0, 120)}...
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.createTime)}
          </span>

          {article.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {article.tags.slice(0, 3).join(", ")}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
