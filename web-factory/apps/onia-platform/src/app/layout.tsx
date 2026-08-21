import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/motion";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/*
 * DOS familias en todo el sitio, ni una mas
 * (web-factory/docs/ONIA_MARCA_SISTEMA_20260726.md §3 "Tipografia").
 *
 * Antes eran CUATRO — Archivo en la landing y en el cromo, pero Bricolage +
 * DM Sans + Spline Mono en /empezar, /nosotros, /precios, legales y servicios.
 * El resultado era el que vio Sergio: la misma web con dos caras segun la
 * seccion. Las tres se retiran; queda:
 *
 *  - Archivo variable para TODO. La jerarquia sale del TAMANO y del eje `wdth`,
 *    nunca de sumar familias ni de pesos gordos (el sistema no pasa de 650).
 *    Es la misma letra con la que se cortaron los SVG del wordmark
 *    (wght 560 / wdth 96): logo y pagina son la misma tipografia.
 *  - Geist Mono solo en micro-etiquetas <=12px MAYUSCULA con tracking abierto.
 *
 * Los ROLES (display / sans / mono) viven como tokens en globals.css; aca solo
 * se cargan los archivos.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "Onia — El sistema con IA que maneja tu negocio completo";
const SITE_DESCRIPTION =
  "Elegís tu rubro, te entregamos el sistema configurado y encendés módulos cuando los necesités: gestión, agentes con IA que esperan tu aprobación, chatbot de WhatsApp, facturación SIAT. Hecho en Bolivia.";

export const metadata: Metadata = {
  /*
   * Base de TODA URL absoluta del sitio (canonical, OG, sitemap de metadata).
   * Sin esto Next cae a `http://localhost:3000` y publica canonicals a
   * localhost. Va en el layout raiz para que lo hereden todas las paginas;
   * el `canonical` NO se pone aca a proposito: se declara por pagina, o cada
   * ruta heredaria "/" como canonical y se desindexaria el sitio entero.
   */
  metadataBase: new URL(SITE_URL),
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
      className={`${archivo.variable} ${geistMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <MotionProvider>{children}</MotionProvider>
        <script dangerouslySetInnerHTML={{ __html: chatwootInit }} />
      </body>
    </html>
  );
}
