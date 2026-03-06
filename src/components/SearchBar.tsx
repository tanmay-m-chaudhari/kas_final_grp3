"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : "/");
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes, ingredients, cuisines…"
        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
      <button type="submit" className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
        Search
      </button>
    </form>
  );
}
