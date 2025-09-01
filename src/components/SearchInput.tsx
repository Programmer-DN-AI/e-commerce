"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { setParam } from "@/lib/utils/query";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  // Initialize query from URL params
  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    setQuery(searchQuery);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      const url = setParam(pathname, `?${searchParams.toString()}`, "search", trimmedQuery);
      const withPageReset = setParam(pathname, new URL(url, "http://dummy").search, "page", "1");
      router.push(withPageReset, { scroll: false });
    } else {
      // Remove search param if query is empty
      const url = setParam(pathname, `?${searchParams.toString()}`, "search", null);
      const withPageReset = setParam(pathname, new URL(url, "http://dummy").search, "page", "1");
      router.push(withPageReset, { scroll: false });
    }
  };

  const handleClear = () => {
    setQuery("");
    const url = setParam(pathname, `?${searchParams.toString()}`, "search", null);
    const withPageReset = setParam(pathname, new URL(url, "http://dummy").search, "page", "1");
    router.push(withPageReset, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-700 hover:text-dark-900 transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
