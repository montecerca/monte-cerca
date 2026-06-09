import { Business } from "./data";

const DAYS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"] as const;
type DayKey = (typeof DAYS)[number];

export function isOpenNow(business: Business): boolean {
  const now = new Date();
  const dayKey = DAYS[now.getDay()] as DayKey;
  const schedule = business.schedule[dayKey];

  if (schedule.closed) return false;

  const [openH, openM] = schedule.open.split(":").map(Number);
  const [closeH, closeM] = schedule.close.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  // Maneja horarios que cierran después de medianoche (ej: 00:30)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

export function getScheduleToday(business: Business): string {
  const now = new Date();
  const dayKey = DAYS[now.getDay()] as DayKey;
  const schedule = business.schedule[dayKey];
  if (schedule.closed) return "Cerrado hoy";
  if (schedule.open === "00:00" && schedule.close === "23:59") return "Abierto 24hs";
  return `${schedule.open} – ${schedule.close}`;
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getCategoryLabel(categories: { id: string; label: string }[], id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function searchBusinesses(
  businesses: Business[],
  query: string
): Business[] {
  const q = query.toLowerCase().trim();
  if (!q) return businesses;
  return businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
  );
}
