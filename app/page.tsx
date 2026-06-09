import { BUSINESSES, CATEGORIES, PROMOTIONS, USEFUL_INFO } from "@/lib/data";
import { isOpenNow, getScheduleToday } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const featured = BUSINESSES.filter((b) => b.featured);
  const openNow = BUSINESSES.filter((b) => isOpenNow(b));
  const activePromos = PROMOTIONS.filter((p) => new Date(p.endsAt) >= new Date());

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

      {/* ABIERTO AHORA */}
      {openNow.length > 0 && (
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
                    <p className="font-medium text-sm">{b.name}</p>
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

      {/* DESTACADOS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Negocios destacados</h2>
          <a href="/negocios" className="text-sm text-blue-600 hover:underline">Ver todos →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featured.map((b) => {
            const open = isOpenNow(b);
            return (
              <a key={b.id} href={`/negocios/${b.id}`}
                className="bg-white rounded-xl border border-blue-100 p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-gray-500">
                      {CATEGORIES.find((c) => c.id === b.category)?.label}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {open ? "● Abierto" : getScheduleToday(b)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{b.description}</p>
                <p className="text-xs text-gray-400 mt-2">📍 {b.address}</p>
              </a>
            );
          })}
        </div>
      </section>

      {/* PROMOCIONES */}
      {activePromos.length > 0 && (
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
      <section>
        <h2 className="text-lg font-semibold mb-4">🚨 Información útil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {USEFUL_INFO.map((info) => {
            const icons: Record<string, string> = {
              hospital: "🏥", policia: "👮", bomberos: "🚒",
              farmacia_turno: "💊", veterinaria: "🐾", otro: "ℹ️",
            };
            return (
              <a key={info.id} href="/urgencias"
                className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-all">
                <span className="text-2xl">{icons[info.type]}</span>
                <div>
                  <p className="font-medium text-sm">{info.title}</p>
                  <p className="text-blue-600 text-sm font-mono">{info.phone}</p>
                  {info.notes && <p className="text-xs text-gray-500 mt-0.5">{info.notes}</p>}
                </div>
              </a>
            );
          })}
        </div>
      </section>

    </div>
  );
}
