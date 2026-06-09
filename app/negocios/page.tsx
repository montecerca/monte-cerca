import { BUSINESSES, CATEGORIES } from "@/lib/data";
import { isOpenNow, getScheduleToday, searchBusinesses } from "@/lib/utils";

export default function NegociosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; abierto?: string }>;
}) {
  return <NegociosContent searchParamsPromise={searchParams} />;
}

async function NegociosContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ q?: string; categoria?: string; abierto?: string }>;
}) {
  const params = await searchParamsPromise;
  const query = params.q ?? "";
  const categoria = params.categoria ?? "";
  const soloAbiertos = params.abierto === "1";

  let results = BUSINESSES;
  if (query) results = searchBusinesses(results, query);
  if (categoria) results = results.filter((b) => b.category === categoria);
  if (soloAbiertos) results = results.filter((b) => isOpenNow(b));

  const catActual = CATEGORIES.find((c) => c.id === categoria);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold">
          {catActual ? `${catActual.icon} ${catActual.label}` : query ? `Resultados para "${query}"` : "Todos los negocios"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{results.length} negocios encontrados</p>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <a href="/negocios" className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!categoria && !query ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
          Todos
        </a>
        {CATEGORIES.map((cat) => (
          <a key={cat.id} href={`/negocios?categoria=${cat.id}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${categoria === cat.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
            {cat.icon} {cat.label}
          </a>
        ))}
      </div>

      {/* Resultados */}
      {results.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No encontramos resultados</p>
          <p className="text-sm mt-1">Probá con otro término o explorá las categorías</p>
          <a href="/negocios" className="mt-4 inline-block text-blue-600 hover:underline text-sm">Ver todos los negocios</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((b) => {
            const open = isOpenNow(b);
            const cat = CATEGORIES.find((c) => c.id === b.category);
            return (
              <a key={b.id} href={`/negocios/${b.id}`}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-100 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-gray-500">{cat?.icon} {cat?.label}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {open ? "● Abierto" : "Cerrado"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{b.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">📍 {b.address}</p>
                  <p className="text-xs text-gray-400">{getScheduleToday(b)}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
