import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "DentalGest — Gestión de clínicas dentales en Bolivia";
const SITE_DESCRIPTION =
  "Agenda, historias clínicas, facturación SIAT y un agente que reprograma a los pacientes que te fallan — todo por WhatsApp, sin planillas ni cuaderno.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // OG sin imagen a proposito: la imagen sera una captura REAL del sistema
  // cuando exista (regla: nunca mockups falsos). WhatsApp arma el preview
  // del link con estos tags.
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "es_BO",
    siteName: "DentalGest",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1b20" },
  ],
};

/**
 * Corre antes del primer paint: marca que hay JS (para el reveal)
 * y aplica el tema guardado (toggle manual sobre prefers-color-scheme).
 */
const themeInit = `(function(){try{var d=document.documentElement;d.classList.add("js");var t=localStorage.getItem("dg-theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
      </body>
    </html>
  );
}
