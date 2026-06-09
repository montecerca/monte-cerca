"use client";

import { useEffect, useState } from "react";
import { getNegocios, getPromociones, getUrgencias } from "@/lib/firestore";
import { CATEGORIES } from "@/lib/data";
import { isOpenNow, getScheduleToday } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import type { Business, Promotion, UsefulInfo } from "@/lib/data";

export default function HomePage() {
  const [negocios, setNegocios] = useState<Business[]>([]);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [urgencias, setUrgencias] = useState<UsefulInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNegocios(), getPromociones(), getUrgencias()]).then(([n, p, u]) => {
      setNegocios(n);
      setPromos(p);
      setUrgencias(u);
      setLoading(false);
    });
  }, []);

  const featured = negocios.filter((b) => b.featured);
  const nuevos = negocios.filter((b) => (b as any).esNuevo);
  const openNow = negocios.filter((b) => isOpenNow(b));
  const activePromos = promos.filter((p) => new Date(p.endsAt) >= new Date());

  return (
    <div className="space-y-10">

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
        <p className="text-blue-100 text-sm font-medium mb-1">San Miguel del Monte, Buenos Aires</p>
        <h1 className="text-3xl font-bold mb-2">¿Qué estás buscando?</h1>
        <p className="text-blue-100 mb-6 text-sm">Negocios, horarios, servicios y más — todo en un lugar</p>
        <SearchBar />
      </section>

      {/* CATEGORÍAS */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Categorías</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/negocios?categoria=${cat.id}`}
              className="flex flex-col items-center gap-1 bg-white rounded-xl p-3 border border-gray-100 hover:border-blue-300 hover:shadow-sm transition-all text-center"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 leading-tight">{cat.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* DESTACADOS — CARRUSEL */}
      {!loading && featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              ⭐ <span>Negocios Destacados</span>
            </h2>
            <a href="/negocios" className="text-sm text-blue-600 hover:underline">Ver todos →</a>
          </div>
          {/* Carrusel */}
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"
               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {featured.map((b) => {
              const open = isOpenNow(b);
              const cat = CATEGORIES.find((c) => c.id === b.category);
              return (
                <a
                  key={b.id}
                  href={`/negocios/${b.id}`}
                  className="snap-start shrink-0 w-72 sm:w-80 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 hover:shadow-lg hover:border-amber-400 transition-all relative overflow-hidden"
                >
                  {/* Banda decorativa */}
                  <div className="absolute top-0 right-0 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    DESTACADO
                  </div>
                  <div className="mt-2">
                    <p className="font-bold text-gray-900 text-lg leading-tight pr-20">{b.name}</p>
                    <p className="text-sm text-amber-700 font-medium mt-0.5">{cat?.icon} {cat?.label}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{b.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-500">📍 {b.address}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {open ? "● Abierto" : "Cerrado"}
                    </span>
                  </div>
                  {b.phone && (
                    <p className="text-xs text-blue-600 mt-2 font-mono">📞 {b.phone}</p>
                  )}
                </a>
              );
            })}
          </div>
          {/* Indicador de scroll */}
          {featured.length > 2 && (
            <p className="text-xs text-gray-400 text-center mt-2">← Deslizá para ver más →</p>
          )}
        </section>
      )}

      {/* NUEVOS EMPRENDIMIENTOS */}
      {!loading && nuevos.length > 0 && (
        <section>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌱</span>
              <div>
                <h2 className="text-lg font-bold text-green-800">Nuevos Emprendimientos</h2>
                <p className="text-sm text-green-600">Apoyá a quienes están empezando en Monte</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nuevos.map((b) => {
                const open = isOpenNow(b);
                const cat = CATEGORIES.find((c) => c.id === b.category);
                return (
                  <a
                    key={b.id}
                    href={`/negocios/${b.id}`}
                    className="bg-white border border-green-100 rounded-xl p-4 hover:shadow-md hover:border-green-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{b.name}</p>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Nuevo</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{cat?.icon} {cat?.label}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {open ? "● Abierto" : "Cerrado"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{b.description}</p>
                    <p className="text-xs text-gray-400 mt-2">📍 {b.address}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ABIERTO AHORA */}
      {!loading && openNow.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
              Abierto ahora
            </h2>
            <a href="/negocios?abierto=1" className="text-sm text-blue-600 hover:underline">Ver todos →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {openNow.slice(0, 6).map((b) => (
              <a key={b.id} href={`/negocios/${b.id}`}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-green-200 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {CATEGORIES.find((c) => c.id === b.category)?.label}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">● Abierto</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{getScheduleToday(b)}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* PROMOCIONES */}
      {!loading && activePromos.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">🎉 Promociones activas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePromos.map((p) => (
              <a key={p.id} href={`/negocios/${p.businessId}`}
                className="bg-red-50 border border-red-100 rounded-xl p-4 hover:shadow-md transition-all">
                <p className="font-semibold text-red-700">{p.title}</p>
                <p className="text-sm text-red-600 mt-1">{p.description}</p>
                <p className="text-xs text-red-400 mt-2">{p.businessName} · Hasta {p.endsAt}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* INFORMACIÓN ÚTIL */}
      {urgencias.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">🚨 Información útil</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {urgencias.map((info) => {
              const icons: Record<string, string> = {
                hospital: "🏥", policia: "👮", bomberos: "🚒",
                farmacia_turno: "💊", veterinaria: "🐾", otro: "ℹ️",
              };
              return (
                <a key={info.id} href="/urgencias"
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-all">
                  <span className="text-2xl">{icons[info.type]}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{info.title}</p>
                    <p className="text-blue-600 text-sm font-mono">{info.phone}</p>
                    {info.notes && <p className="text-xs text-gray-500 mt-0.5">{info.notes}</p>}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

    </div>
  );
}
