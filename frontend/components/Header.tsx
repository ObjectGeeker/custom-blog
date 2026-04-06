"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { CategoryNav } from "@/components/CategoryNav";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar sticky top-0 z-40 border-b border-base-200 bg-base-100/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="navbar mx-auto min-h-14 w-full max-w-screen-2xl justify-between gap-2 px-0">
        <div className="navbar-start w-auto shrink-0">
          <Link
            href="/"
            className="btn btn-ghost text-lg font-semibold tracking-tight text-base-content"
          >
            {siteConfig.title}
          </Link>
        </div>

        <div className="navbar-end hidden w-auto flex-none items-center gap-1 md:flex">
          <CategoryNav />
          <SearchBar />
          <ThemeToggle />
        </div>

        <div className="navbar-end flex flex-none gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-ghost btn-square btn-sm border border-base-200"
            aria-label="打开菜单"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-base-200 px-4 pb-4 pt-3 md:hidden">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-3">
            <SearchBar />
            <CategoryNav />
          </div>
        </div>
      )}
    </header>
  );
}
