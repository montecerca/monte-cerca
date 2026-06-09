import { BUSINESSES, CATEGORIES } from "@/lib/data";
import { isOpenNow, getScheduleToday } from "@/lib/utils";
import { notFound } from "next/navigation";

const DAYS = [
  { key: "lunes",     label: "Lunes" },
  { key: "martes",    label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves",    label: "Jueves" },
  { key: "viernes",   label: "Viernes" },
  { key: "sabado",    label: "Sábado" },
  { key: "domingo",   label: "Domingo" },
] as const;

export async function generateStaticParams() {
  return BUSINESSES.map((b) => ({ id: b.id }));
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = BUSINESSES.find((b) => b.id === id);
  if (!business) notFound();

  const open = isOpenNow(business);
  const cat = CATEGORIES.find((c) => c.id === business.category);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Volver */}
      <a href="/negocios" className="text-sm text-blue-600 hover:underline">← Volver</a>

      {/* Encabezado del negocio */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <p className="text-gray-500 mt-1">{cat?.icon} {cat?.label}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium flex-shrink-0 ${open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            {open ? "● Abierto ahora" : "● Cerrado"}
          </span>
        </div>

        <p className="text-gray-700">{business.description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>📍 {business.address}</p>
          <p>📞 {business.phone}</p>
          <p>🕐 Hoy: {getScheduleToday(business)}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 mt-5">
          {business.whatsapp && (
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              💬 WhatsApp
            </a>
          )}
          <a href={`tel:${business.phone}`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            📞 Llamar
          </a>
          {business.mapUrl && (
            <a href={business.mapUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              🗺️ Cómo llegar
            </a>
          )}
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold mb-4">Horarios</h2>
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => {
            const sch = business.schedule[key];
            const isToday = new Date().getDay() === DAYS.findIndex((d) => d.key === key) + 1 ||
              (key === "domingo" && new Date().getDay() === 0);
            return (
              <div key={key} className={`flex justify-between text-sm py-1.5 px-3 rounded-lg ${isToday ? "bg-blue-50 font-medium" : ""}`}>
                <span className={isToday ? "text-blue-700" : "text-gray-600"}>
                  {label} {isToday ? "(hoy)" : ""}
                </span>
                <span className={sch.closed ? "text-gray-400" : isToday ? "text-blue-700" : "text-gray-800"}>
                  {sch.closed
                    ? "Cerrado"
                    : sch.open === "00:00" && sch.close === "23:59"
                    ? "24 horas"
                    : `${sch.open} – ${sch.close}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redes sociales */}
      {(business.instagram || business.facebook) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold mb-3">Redes sociales</h2>
          <div className="flex gap-3">
            {business.instagram && (
              <a href={`https://instagram.com/${business.instagram}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-pink-600 hover:underline">
                📸 Instagram
              </a>
            )}
            {business.facebook && (
              <a href={`https://facebook.com/${business.facebook}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline">
                👍 Facebook
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
