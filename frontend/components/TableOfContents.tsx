"use client";

import { useEffect, useState } from "react";
import type { HeadingItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1 text-sm" aria-label="Table of contents">
      <p className="mb-3 font-semibold text-base-content">目录</p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={cn(
            "block truncate py-1 text-base-content/60 transition-colors hover:text-base-content",
            h.level === 2 && "pl-3",
            h.level === 3 && "pl-6",
            h.level === 4 && "pl-9",
            activeId === h.id && "font-medium text-base-content",
          )}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
