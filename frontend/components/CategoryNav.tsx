"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCategoryTree } from "@/lib/api/category";
import type { CategoryVO } from "@/lib/types";

function CategoryItem({ cat }: { cat: CategoryVO }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = cat.children && cat.children.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!hasChildren) {
    return (
      <Link
        href={`/search?category=${cat.id}`}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {cat.categoryName}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {cat.categoryName}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-40 rounded-md border border-border bg-background p-1 shadow-lg">
          {cat.children.map((child) => (
            <Link
              key={child.id}
              href={`/search?category=${child.id}`}
              onClick={() => setOpen(false)}
              className="block rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {child.categoryName}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryNav() {
  const [tree, setTree] = useState<CategoryVO[]>([]);

  useEffect(() => {
    getCategoryTree().then(setTree).catch(() => {});
  }, []);

  if (tree.length === 0) return null;

  return (
    <nav className="flex items-center gap-0.5">
      {tree.map((cat) => (
        <CategoryItem key={cat.id} cat={cat} />
      ))}
    </nav>
  );
}
