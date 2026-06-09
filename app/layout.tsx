import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monte Cerca — San Miguel del Monte",
  description:
    "Encontrá negocios, horarios, promociones e información útil de San Miguel del Monte.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span className="font-bold text-xl text-blue-600">Monte Cerca</span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
              <a href="/negocios" className="hover:text-blue-600 transition-colors">Negocios</a>
              <a href="/urgencias" className="hover:text-red-600 transition-colors font-medium text-red-500">🚨 Urgencias</a>
            </nav>
            <div className="sm:hidden flex gap-4 text-sm">
              <a href="/negocios" className="text-gray-600">Negocios</a>
              <a href="/urgencias" className="text-red-500 font-medium">🚨</a>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            <p>📍 <strong>Monte Cerca</strong> — San Miguel del Monte, Buenos Aires</p>
            <p className="mt-1">¿Tu negocio no está? <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Escribinos por WhatsApp</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
