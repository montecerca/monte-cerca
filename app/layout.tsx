import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UrgenciasFloat from "@/components/UrgenciasFloat";
import BienvenidaBanner from "@/components/BienvenidaBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monte Cerca — San Miguel del Monte",
  description: "El portal de negocios locales de San Miguel del Monte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}>
        <BienvenidaBanner />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
        <UrgenciasFloat />
      </body>
    </html>
  );
}
