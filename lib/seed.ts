// Script para cargar los datos iniciales a Firebase
// Ejecutar UNA SOLA VEZ desde el panel admin

import { BUSINESSES, PROMOTIONS, USEFUL_INFO } from "./data";
import { db } from "./firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export async function seedFirestore(): Promise<{ ok: boolean; message: string }> {
  try {
    // Cargar negocios
    for (const business of BUSINESSES) {
      const { id, ...data } = business;
      await setDoc(doc(db, "negocios", id), data);
    }

    // Cargar promociones
    for (const promo of PROMOTIONS) {
      const { id, ...data } = promo;
      await setDoc(doc(db, "promociones", id), data);
    }

    // Cargar urgencias
    for (const info of USEFUL_INFO) {
      const { id, ...data } = info;
      await setDoc(doc(db, "urgencias", id), data);
    }

    return { ok: true, message: `Cargados: ${BUSINESSES.length} negocios, ${PROMOTIONS.length} promociones, ${USEFUL_INFO.length} urgencias.` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: msg };
  }
}
