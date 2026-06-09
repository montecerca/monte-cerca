"use client";

import { useState, useEffect } from "react";
import { getNegocios } from "@/lib/firestore";
import { CATEGORIES } from "@/lib/data";
import type { Business } from "@/lib/data";
import { isOpenNow } from "@/lib/utils";


export default function NegociosPage() {
  const [negocios, setNegocios] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => {
    getNegocios()
      .then((data) => {
        // Solo mostrar negocios activos (activo !== false)
        setNegocios(data.filter((n) => (n as any).activo !== false));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = negocios.filter((n) => {
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      n.name.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q)) ||
      n.address.toLowerCase().includes(q);
    const matchCat = !catFilter || n.category === catFilter;
    return matchQuery && matchCat;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Negocios</h1>
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <a href="/" className="text-sm text-blue-600 hover:underline">← Inicio</a>
        <h1 className="text-2xl font-bold mt-2">Todos los negocios</h1>
        <p className="text-sm text-gray-500">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre, categoría o tag..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      {/* Filtro por categoría */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCatFilter("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!catFilter ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCatFilter(cat.id === catFilter ? "" : cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${catFilter === cat.id ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const open = isOpenNow(n);
          const cat = CATEGORIES.find((c) => c.id === n.category);
          return (
            <a
              key={n.id}
              href={`/negocios/${n.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900">{n.name}</h2>
                    {n.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⭐</span>}
                    {(n as any).esNuevo && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌱 Nuevo</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{cat?.icon} {cat?.label} · {n.address}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.description}</p>

                  {/* Instagram en listado */}
                  {n.instagram && (
                    <p className="text-xs text-pink-500 mt-1.5">
                      📸 @{n.instagram.replace(/^@/, "")}
                    </p>
                  )}

                  {/* Tags */}
                  {n.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {n.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {open ? "● Abierto" : "● Cerrado"}
                </span>
              </div>
            </a>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">😕 No encontramos resultados</p>
            <p className="text-sm mt-1">Probá con otra búsqueda o categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
