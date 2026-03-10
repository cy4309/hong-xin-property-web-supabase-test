"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function NewsSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      const url = q ? `/news?q=${encodeURIComponent(q)}` : "/news";
      router.push(url);
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <HiMagnifyingGlass
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          size={20}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋標題、摘要、內文..."
          className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-12 pr-4 text-deep placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="搜尋新聞"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          搜尋
        </button>
      </div>
    </form>
  );
}
