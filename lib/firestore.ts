import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Business, Promotion, UsefulInfo } from "./data";

// ── NEGOCIOS ──────────────────────────────────────────────
export async function getNegocios(): Promise<Business[]> {
  const q = query(collection(db, "negocios"), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Business));
}

export async function getNegocio(id: string): Promise<Business | null> {
  const snap = await getDoc(doc(db, "negocios", id));
  if (!snap.exists()) return null;
  return { ...snap.data(), id: snap.id } as Business;
}

export async function saveNegocio(negocio: Business): Promise<void> {
  const { id, ...data } = negocio;
  if (id) {
    await setDoc(doc(db, "negocios", id), data);
  } else {
    await addDoc(collection(db, "negocios"), data);
  }
}

export async function deleteNegocio(id: string): Promise<void> {
  await deleteDoc(doc(db, "negocios", id));
}

// ── PROMOCIONES ───────────────────────────────────────────
export async function getPromociones(): Promise<Promotion[]> {
  const snap = await getDocs(collection(db, "promociones"));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Promotion));
}

export async function savePromocion(promo: Promotion): Promise<void> {
  const { id, ...data } = promo;
  if (id) {
    await setDoc(doc(db, "promociones", id), data);
  } else {
    await addDoc(collection(db, "promociones"), data);
  }
}

export async function deletePromocion(id: string): Promise<void> {
  await deleteDoc(doc(db, "promociones", id));
}

// ── URGENCIAS ─────────────────────────────────────────────
export async function getUrgencias(): Promise<UsefulInfo[]> {
  const snap = await getDocs(collection(db, "urgencias"));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as UsefulInfo));
}

export async function saveUrgencia(info: UsefulInfo): Promise<void> {
  const { id, ...data } = info;
  await setDoc(doc(db, "urgencias", id), data);
}

export async function updateUrgencia(id: string, data: Partial<UsefulInfo>): Promise<void> {
  await updateDoc(doc(db, "urgencias", id), data);
}

// ── CATEGORÍAS ACTIVAS ────────────────────────────────────
export async function getCategoriasActivas(): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, "config", "categorias"));
    if (!snap.exists()) return []; // si no existe, todas activas
    return snap.data().desactivadas ?? [];
  } catch {
    return [];
  }
}

export async function saveCategoriasDesactivadas(desactivadas: string[]): Promise<void> {
  await setDoc(doc(db, "config", "categorias"), { desactivadas });
}
