"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?title=${encodeURIComponent(trimmed)}`);
      setQuery("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-md:w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-1 h-4 w-4 -translate-y-1/2 text-base-content/40" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章..."
        className="input input-bordered input-sm h-9 w-full border-base-200 bg-base-100 pl-9 text-sm placeholder:text-base-content/40 md:w-40 lg:w-56"
      />
    </form>
  );
}
