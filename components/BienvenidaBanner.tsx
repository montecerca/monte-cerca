"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BienvenidaBanner() {
  const [visible, setVisible] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const snap = await getDoc(doc(db, "config", "bienvenida"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.activo && data.texto) {
            setTexto(data.texto);
            setVisible(true);
            // Empieza a salir a los 3s
            setTimeout(() => setSaliendo(true), 3000);
            // Se oculta completamente después de la animación (3s + 0.5s)
            setTimeout(() => setVisible(false), 3500);
          }
        }
      } catch (e) {
        // Silencioso: si falla no muestra banner
      }
    }
    cargar();
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
        saliendo ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="bg-blue-600 text-white text-center px-4 py-3 shadow-lg">
        <p className="text-sm font-medium">{texto}</p>
      </div>
    </div>
  );
}
