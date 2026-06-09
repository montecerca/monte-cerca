"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNegocios, saveNegocio, deleteNegocio,
  getPromociones, savePromocion, deletePromocion,
  getUrgencias, updateUrgencia,
} from "@/lib/firestore";
import { seedFirestore } from "@/lib/seed";
import { CATEGORIES } from "@/lib/data";
import type { Business, Promotion, UsefulInfo } from "@/lib/data";

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;

const emptySchedule = () =>
  Object.fromEntries(DIAS.map((d) => [d, { open: "09:00", close: "20:00", closed: false }])) as Business["schedule"];

const emptyBusiness = (): Business => ({
  id: "",
  name: "",
  category: "almacen",
  address: "",
  phone: "",
  whatsapp: "",
  description: "",
  tags: [],
  featured: false,
  schedule: emptySchedule(),
  instagram: "",
  facebook: "",
  mapUrl: "",
});

const emptyPromo = (): Promotion => ({
  id: "",
  businessId: "",
  businessName: "",
  title: "",
  description: "",
  endsAt: "",
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("mc_admin", "1");
      onLogin();
    } else {
      setError("Contraseña incorrecta");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Panel Admin</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Monte Cerca</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── NEGOCIO FORM ─────────────────────────────────────────────────────────────
function NegocioForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Business;
  onSave: (b: Business) => void;
  onCancel: () => void;
}) {
  const [b, setB] = useState<Business>(initial);
  const [tagsStr, setTagsStr] = useState(initial.tags.join(", "));
  const [saving, setSaving] = useState(false);

  function set(field: keyof Business, value: unknown) {
    setB((prev) => ({ ...prev, [field]: value }));
  }

  function setScheduleDay(day: typeof DIAS[number], field: string, value: unknown) {
    setB((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [day]: { ...prev.schedule[day], [field]: value } },
    }));
  }

  async function handleSave() {
    if (!b.name || !b.address || !b.phone) {
      alert("Nombre, dirección y teléfono son obligatorios");
      return;
    }
    setSaving(true);
    const negocio = { ...b, tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean) };
    await saveNegocio(negocio);
    onSave(negocio);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="bg-white max-w-2xl mx-auto my-8 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{b.id ? "Editar negocio" : "Nuevo negocio"}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input className="input" value={b.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría *</label>
            <select className="input" value={b.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono *</label>
            <input className="input" value={b.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Dirección *</label>
            <input className="input" value={b.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp (solo números)</label>
            <input className="input" value={b.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5492271..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input className="input" value={b.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="@negocio" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea className="input h-20" value={b.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
            <input className="input" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="delivery, hielo, garrafas" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Link Google Maps</label>
            <input className="input" value={b.mapUrl ?? ""} onChange={(e) => set("mapUrl", e.target.value)} />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="featured" checked={b.featured} onChange={(e) => set("featured", e.target.checked)} />
            <label htmlFor="featured" className="text-sm font-medium">Destacado en la página principal</label>
          </div>
        </div>

        {/* Horarios */}
        <h3 className="font-semibold mt-6 mb-3">Horarios</h3>
        <div className="space-y-2">
          {DIAS.map((dia) => (
            <div key={dia} className="flex items-center gap-3">
              <span className="w-24 text-sm capitalize">{dia}</span>
              <input
                type="checkbox"
                checked={b.schedule[dia].closed}
                onChange={(e) => setScheduleDay(dia, "closed", e.target.checked)}
              />
              <span className="text-xs text-gray-500">Cerrado</span>
              {!b.schedule[dia].closed && (
                <>
                  <input
                    type="time"
                    className="input w-28 text-sm"
                    value={b.schedule[dia].open}
                    onChange={(e) => setScheduleDay(dia, "open", e.target.value)}
                  />
                  <span className="text-sm">a</span>
                  <input
                    type="time"
                    className="input w-28 text-sm"
                    value={b.schedule[dia].close}
                    onChange={(e) => setScheduleDay(dia, "close", e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onCancel} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROMO FORM ───────────────────────────────────────────────────────────────
function PromoForm({
  initial,
  negocios,
  onSave,
  onCancel,
}: {
  initial: Promotion;
  negocios: Business[];
  onSave: (p: Promotion) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<Promotion>(initial);
  const [saving, setSaving] = useState(false);

  function set(field: keyof Promotion, value: string) {
    setP((prev) => ({ ...prev, [field]: value }));
    if (field === "businessId") {
      const neg = negocios.find((n) => n.id === value);
      if (neg) setP((prev) => ({ ...prev, businessId: value, businessName: neg.name }));
    }
  }

  async function handleSave() {
    if (!p.title || !p.businessId) { alert("Título y negocio son obligatorios"); return; }
    setSaving(true);
    await savePromocion(p);
    onSave(p);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full mx-4 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{p.id ? "Editar promoción" : "Nueva promoción"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Negocio *</label>
            <select className="input" value={p.businessId} onChange={(e) => set("businessId", e.target.value)}>
              <option value="">Seleccioná un negocio</option>
              {negocios.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input className="input" value={p.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea className="input h-20" value={p.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Válida hasta</label>
            <input type="date" className="input" value={p.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Guardar"}</button>
          <button onClick={onCancel} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─── PANEL PRINCIPAL ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"negocios" | "promociones" | "urgencias" | "setup">("negocios");

  const [negocios, setNegocios] = useState<Business[]>([]);
  const [promociones, setPromociones] = useState<Promotion[]>([]);
  const [urgencias, setUrgencias] = useState<UsefulInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const [editNegocio, setEditNegocio] = useState<Business | null>(null);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const [seedMsg, setSeedMsg] = useState("");
  const [seedLoading, setSeedLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mc_admin") === "1") setAuthed(true);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [n, p, u] = await Promise.all([getNegocios(), getPromociones(), getUrgencias()]);
    setNegocios(n);
    setPromociones(p);
    setUrgencias(u);
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  async function handleDeleteNegocio(id: string) {
    if (!confirm("¿Eliminar este negocio?")) return;
    await deleteNegocio(id);
    setNegocios((prev) => prev.filter((n) => n.id !== id));
  }

  async function handleDeletePromo(id: string) {
    if (!confirm("¿Eliminar esta promoción?")) return;
    await deletePromocion(id);
    setPromociones((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSeedData() {
    if (!confirm("¿Cargar los datos de ejemplo a Firebase? Solo hacé esto una vez.")) return;
    setSeedLoading(true);
    const result = await seedFirestore();
    setSeedMsg(result.message);
    if (result.ok) await loadAll();
    setSeedLoading(false);
  }

  async function handleUpdateUrgencia(id: string, field: string, value: string) {
    await updateUrgencia(id, { [field]: value });
    setUrgencias((prev) => prev.map((u) => u.id === id ? { ...u, [field]: value } : u));
  }

  const tabs = [
    { id: "negocios", label: "🏪 Negocios" },
    { id: "promociones", label: "🎯 Promociones" },
    { id: "urgencias", label: "🚨 Urgencias" },
    { id: "setup", label: "⚙️ Setup" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Panel Admin — Monte Cerca</h1>
            <p className="text-sm text-gray-600">San Miguel del Monte</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("mc_admin"); setAuthed(false); }}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading && <p className="text-center text-gray-500 py-12">Cargando...</p>}

        {/* TAB NEGOCIOS */}
        {!loading && tab === "negocios" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Negocios ({negocios.length})</h2>
              <button onClick={() => setEditNegocio(emptyBusiness())} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50">
                + Nuevo negocio
              </button>
            </div>
            <div className="space-y-3">
              {negocios.map((n) => {
                const cat = CATEGORIES.find((c) => c.id === n.category);
                return (
                  <div key={n.id} className="bg-white rounded-xl border p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{n.name} {n.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full ml-1">Destacado</span>}</p>
                      <p className="text-sm text-gray-600">{cat?.icon} {cat?.label} · {n.address}</p>
                      <p className="text-xs text-gray-500 mt-1">{n.tags.join(", ")}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditNegocio(n)} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">Editar</button>
                      <button onClick={() => handleDeleteNegocio(n.id)} className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Eliminar</button>
                    </div>
                  </div>
                );
              })}
              {negocios.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>No hay negocios todavía.</p>
                  <p className="text-sm mt-1">Cargá los datos de ejemplo desde la pestaña ⚙️ Setup.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB PROMOCIONES */}
        {!loading && tab === "promociones" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Promociones ({promociones.length})</h2>
              <button onClick={() => setEditPromo(emptyPromo())} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50">+ Nueva promo</button>
            </div>
            <div className="space-y-3">
              {promociones.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <p className="text-sm text-gray-600">{p.businessName} · Hasta {p.endsAt}</p>
                    <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditPromo(p)} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">Editar</button>
                    <button onClick={() => handleDeletePromo(p.id)} className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Eliminar</button>
                  </div>
                </div>
              ))}
              {promociones.length === 0 && <p className="text-center py-12 text-gray-400">No hay promociones.</p>}
            </div>
          </div>
        )}

        {/* TAB URGENCIAS */}
        {!loading && tab === "urgencias" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Urgencias y servicios esenciales</h2>
            <div className="space-y-4">
              {urgencias.map((u) => (
                <div key={u.id} className="bg-white rounded-xl border p-4">
                  <p className="font-semibold mb-3 text-gray-900">{u.title}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                      <input
                        className="input text-sm"
                        defaultValue={u.phone}
                        onBlur={(e) => handleUpdateUrgencia(u.id, "phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                      <input
                        className="input text-sm"
                        defaultValue={u.address ?? ""}
                        onBlur={(e) => handleUpdateUrgencia(u.id, "address", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Notas / Farmacia de turno</label>
                      <input
                        className="input text-sm"
                        defaultValue={u.notes ?? ""}
                        onBlur={(e) => handleUpdateUrgencia(u.id, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {urgencias.length === 0 && <p className="text-center py-12 text-gray-400">Cargá los datos de ejemplo desde ⚙️ Setup.</p>}
            </div>
            <p className="text-xs text-gray-400 mt-4">Los cambios se guardan automáticamente al salir del campo.</p>
          </div>
        )}

        {/* TAB SETUP */}
        {tab === "setup" && (
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Carga inicial de datos</h2>
            <p className="text-sm text-gray-600 mb-4">
              Hacé esto <strong>una sola vez</strong> para cargar los negocios, promociones y urgencias de ejemplo a Firebase.
              Después de esto, todo se edita desde este panel.
            </p>
            <button onClick={handleSeedData} disabled={seedLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50">
              {seedLoading ? "Cargando..." : "Cargar datos de ejemplo a Firebase"}
            </button>
            {seedMsg && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${seedMsg.includes("Cargados") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {seedMsg}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {editNegocio && (
        <NegocioForm
          initial={editNegocio}
          onSave={(n) => {
            setNegocios((prev) => {
              const idx = prev.findIndex((x) => x.id === n.id);
              return idx >= 0 ? prev.map((x) => x.id === n.id ? n : x) : [...prev, n];
            });
            setEditNegocio(null);
          }}
          onCancel={() => setEditNegocio(null)}
        />
      )}
      {editPromo && (
        <PromoForm
          initial={editPromo}
          negocios={negocios}
          onSave={(p) => {
            setPromociones((prev) => {
              const idx = prev.findIndex((x) => x.id === p.id);
              return idx >= 0 ? prev.map((x) => x.id === p.id ? p : x) : [...prev, p];
            });
            setEditPromo(null);
          }}
          onCancel={() => setEditPromo(null)}
        />
      )}
    </div>
  );
}
