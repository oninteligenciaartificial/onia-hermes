import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

// Par tipográfico de la fórmula: serif de display escasa (Fraunces, el
// equivalente LIBRE de Aime que mide el corpus) + sans geométrica (DM Sans,
// equivalente de Neue Montreal). Cargadas por next/font: cero CLS, self-hosted.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clínica Dental Amanecer | Dentista en Santa Cruz",
  description:
    "Odontología integral en Santa Cruz: evaluación honesta, presupuesto por escrito antes de empezar y urgencias el mismo día. Agenda por WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
