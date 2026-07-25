import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, DM_Sans, Spline_Sans_Mono } from "next/font/google";
import { MotionProvider } from "@/motion";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "Onia — El sistema con IA que maneja tu negocio completo";
const SITE_DESCRIPTION =
  "Elegís tu rubro, tu cuenta queda lista y encendés módulos cuando los necesités: gestión, agentes con IA que esperan tu aprobación, chatbot de WhatsApp, facturación SIAT. Hecho en Bolivia.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // OG sin imagen a proposito: la imagen sera una captura REAL del sistema
  // cuando exista (regla de la casa: nunca mockups falsos como proof).
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "es_BO",
    siteName: "Onia",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ea" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1915" },
  ],
};

/** Aplica el tema guardado antes del primer paint (toggle manual sobre prefers-color-scheme). */
const themeInit = `(function(){try{var t=localStorage.getItem("onia-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${bricolage.variable} ${dmSans.variable} ${splineMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
