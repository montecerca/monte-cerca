import { USEFUL_INFO } from "@/lib/data";

const ICONS: Record<string, string> = {
  hospital: "🏥",
  policia: "👮",
  bomberos: "🚒",
  farmacia_turno: "💊",
  veterinaria: "🐾",
  otro: "ℹ️",
};

const COLORS: Record<string, string> = {
  hospital: "border-red-200 bg-red-50",
  policia:  "border-blue-200 bg-blue-50",
  bomberos: "border-orange-200 bg-orange-50",
  farmacia_turno: "border-green-200 bg-green-50",
  veterinaria: "border-purple-200 bg-purple-50",
  otro: "border-gray-200 bg-gray-50",
};

export default function UrgenciasPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      <div>
        <h1 className="text-2xl font-bold">🚨 Urgencias e información útil</h1>
        <p className="text-gray-500 text-sm mt-1">Teléfonos y datos de servicios esenciales de San Miguel del Monte</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {USEFUL_INFO.map((info) => (
          <div key={info.id} className={`rounded-2xl border p-5 ${COLORS[info.type] ?? COLORS.otro}`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{ICONS[info.type]}</span>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{info.title}</h2>
                {info.address && <p className="text-sm text-gray-600 mt-0.5">📍 {info.address}</p>}
                {info.notes && <p className="text-sm text-gray-600 mt-1">{info.notes}</p>}
                <a href={`tel:${info.phone.split(" / ")[0]}`}
                  className="mt-3 inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-mono font-medium text-lg px-4 py-2 rounded-xl transition-colors">
                  📞 {info.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
        <strong>Emergencias generales:</strong> Marcá el <strong>911</strong> desde cualquier teléfono. Es gratuito y funciona las 24 horas.
      </div>

    </div>
  );
}
