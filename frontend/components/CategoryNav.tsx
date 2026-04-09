"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getCategoryTree } from "@/lib/api/category";
import type { CategoryVO } from "@/lib/types";
import { cn } from "@/lib/utils";

function categoryHref(name: string) {
  return `/search?category=${encodeURIComponent(name)}`;
}

function CategoryMenuItem({
  cat,
  onNavigate,
}: {
  cat: CategoryVO;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link href={categoryHref(cat.categoryName)} onClick={onNavigate}>
          {cat.categoryName}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-center gap-0 rounded-btn p-0 hover:bg-base-200">
        <Link
          href={categoryHref(cat.categoryName)}
          onClick={onNavigate}
          className="flex-1 px-3 py-1.5"
        >
          {cat.categoryName}
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="rounded-btn px-2 py-1.5 opacity-50 hover:bg-base-300 hover:opacity-100"
        >
          <ChevronRight
            className={cn(
              "h-3 w-3 transition-transform",
              expanded && "rotate-90",
            )}
          />
        </button>
      </div>
      {expanded && (
        <ul>
          {cat.children.map((child) => (
            <CategoryMenuItem
              key={child.id}
              cat={child}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
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
        href={categoryHref(cat.categoryName)}
        className="btn btn-ghost btn-sm font-normal text-base-content/80 hover:text-base-content"
      >
        {cat.categoryName}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "dropdown dropdown-bottom dropdown-start",
        open && "dropdown-open",
      )}
    >
      <div className="flex items-center">
        <Link
          href={categoryHref(cat.categoryName)}
          className="btn btn-ghost btn-sm rounded-r-none pr-1.5 font-normal text-base-content/80 hover:text-base-content"
        >
          {cat.categoryName}
        </Link>
        <button
          type="button"
          tabIndex={0}
          className="btn btn-ghost btn-sm rounded-l-none pl-0.5 pr-1.5 text-base-content/80 hover:text-base-content"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
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
