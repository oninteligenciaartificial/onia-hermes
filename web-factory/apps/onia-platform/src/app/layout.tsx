import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, Bricolage_Grotesque, DM_Sans, Spline_Sans_Mono } from "next/font/google";
import { MotionProvider } from "@/motion";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Titular grande condensado. Variable con eje de ancho (wdth 62-125), asi que
 * el condensed pesado sale del mismo archivo: cero peso extra por corte.
 * Es el sustituto libre (OFL) del Akzidenz-Grotesk Next Cnd de Fanvue.
 * Sistema completo: web-factory/docs/TIPOGRAFIA_SISTEMA_20260727.md
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display-cnd",
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
    { media: "(prefers-color-scheme: light)", color: "#F9FBFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0C110F" },
  ],
};

/** Aplica el tema guardado antes del primer paint (toggle manual sobre prefers-color-scheme). */
const themeInit = `(function(){try{var t=localStorage.getItem("onia-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

/**
 * Chatbot de Onia: widget de Chatwoot (self-hosted en el VPS). Es el MISMO motor que atiende
 * WhatsApp — califica (rubro/equipo/ciudad), agenda la demo con reserva real en Cal.com y
 * deriva a humano — expuesto como inbox web (id 4). Carga async despues del load para no
 * tocar LCP; si Chatwoot esta caido, el sitio ni se entera.
 */
const chatwootInit = `window.addEventListener("load",function(){var BASE_URL="https://onia-chatbot-chatwoot.hqdqgh.easypanel.host";var g=document.createElement("script");g.src=BASE_URL+"/packs/js/sdk.js";g.defer=true;g.async=true;g.onload=function(){window.chatwootSDK.run({websiteToken:"9k5i7xnAgCbSse1EZwVChZLw",baseUrl:BASE_URL})};document.body.appendChild(g);});`;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${bricolage.variable} ${archivo.variable} ${dmSans.variable} ${splineMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <MotionProvider>{children}</MotionProvider>
        <script dangerouslySetInnerHTML={{ __html: chatwootInit }} />
      </body>
    </html>
  );
}
