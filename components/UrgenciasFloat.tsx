"use client";

import { useState, useEffect } from "react";
import { getUrgencias } from "@/lib/firestore";
import type { UsefulInfo } from "@/lib/data";

const TYPE_ICONS: Record<string, string> = {
  hospital: "🏥",
  policia: "🚔",
  bomberos: "🚒",
  veterinaria: "🐾",
  farmacia_turno: "💊",
  otro: "📞",
};

export default function UrgenciasFloat() {
  const [open, setOpen] = useState(false);
  const [urgencias, setUrgencias] = useState<UsefulInfo[]>([]);

  useEffect(() => {
    getUrgencias().then(setUrgencias).catch(() => {});
  }, []);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Urgencias"
        className="fixed bottom-5 right-5 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <span className="text-2xl">🚨</span>
      </button>

      {/* Overlay oscuro en mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel de urgencias */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">🚨 Números de urgencia</p>
              <p className="text-xs text-red-100">San Miguel del Monte</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-red-200 text-lg font-bold leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Lista */}
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {urgencias.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-6">Cargando...</p>
            )}
            {urgencias.map((u) => (
              <div key={u.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {TYPE_ICONS[u.type] ?? "📞"} {u.title}
                    </p>
                    {u.notes && (
                      <p className="text-xs text-gray-500 mt-0.5">{u.notes}</p>
                    )}
                  </div>
                  <a
                    href={`tel:${u.phone.split(" / ")[0]}`}
                    className="shrink-0 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    📞 {u.phone}
                  </a>
                </div>
                {u.address && (
                  <p className="text-xs text-gray-400 mt-1">📍 {u.address}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Tocá el número para llamar</p>
          </div>
        </div>
      )}
    </>
  );
}
