"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => router.push("/")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${active === "" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
        All
      </button>
      {categories.map((cat) => (
        <button key={cat} onClick={() => router.push(cat === active ? "/" : `/?category=${encodeURIComponent(cat)}`)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${active === cat ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
