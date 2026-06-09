"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/negocios?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Farmacia, delivery, carbón, hielo..."
        className="flex-1 px-4 py-3 rounded-xl border-0 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm text-sm"
      />
      <button
        type="submit"
        className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-sm"
      >
        Buscar
      </button>
    </form>
  );
}
