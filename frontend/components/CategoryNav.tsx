"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCategoryTree } from "@/lib/api/category";
import type { CategoryVO } from "@/lib/types";
import { cn } from "@/lib/utils";

function CategoryMenuItem({
  cat,
  onNavigate,
}: {
  cat: CategoryVO;
  onNavigate: () => void;
}) {
  const hasChildren = cat.children && cat.children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link href={`/search?category=${cat.id}`} onClick={onNavigate}>
          {cat.categoryName}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <details>
        <summary>{cat.categoryName}</summary>
        <ul>
          {cat.children.map((child) => (
            <CategoryMenuItem key={child.id} cat={child} onNavigate={onNavigate} />
          ))}
        </ul>
      </details>
    </li>
  );
}

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
        className="btn btn-ghost btn-sm font-normal text-base-content/80 hover:text-base-content"
      >
        {cat.categoryName}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("dropdown dropdown-bottom dropdown-start", open && "dropdown-open")}
    >
      <button
        type="button"
        tabIndex={0}
        className="btn btn-ghost btn-sm gap-1 font-normal text-base-content/80 hover:text-base-content"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {cat.categoryName}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      <ul
        tabIndex={-1}
        className="dropdown-content menu menu-sm z-[100] mb-1 mt-1 max-h-[min(70vh,24rem)] w-52 overflow-y-auto overflow-x-hidden rounded-box border border-base-200 bg-base-100 p-2 shadow-lg"
      >
        {cat.children.map((child) => (
          <CategoryMenuItem
            key={child.id}
            cat={child}
            onNavigate={() => setOpen(false)}
          />
        ))}
      </ul>
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
    <nav className="flex flex-wrap items-center gap-0.5">
      {tree.map((cat) => (
        <CategoryItem key={cat.id} cat={cat} />
      ))}
    </nav>
  );
}
