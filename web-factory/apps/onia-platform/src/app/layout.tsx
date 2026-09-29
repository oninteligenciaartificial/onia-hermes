import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { MotionProvider } from "@/motion";
import { SITE_URL } from "@/lib/site";
import { ALCANCE_CON_AGENDA, ALCANCE_CON_INVENTARIO } from "@/lib/pricing";
import { chatDiferidoInit } from "@/lib/chat-diferido";
import "./globals.css";

/*
 * DOS familias en todo el sitio, ni una mas
 * (web-factory/docs/ONIA_MARCA_SISTEMA_20260726.md §3 "Tipografia").
 *
 * 29-sep-2026: Sergio Urcullo eligio Instrument Sans + IBM Plex Mono como la
 * letra de la marca, estilo Fanvue (la medicion vive en
 * web-factory/data/references/design-sources/fanvue-mecanica-medida.md).
 * Reemplazan a Archivo + Geist Mono, que quedan superadas:
 *
 *  - Instrument Sans variable para TODO: texto y titulares. La jerarquia sale
 *    del TAMANO y del apretado, nunca de sumar familias ni de pesos gordos:
 *    titulares 500-600 con tracking -2 %, nunca 700.
 *  - IBM Plex Mono solo en micro-etiquetas, numeros y horas. No es variable:
 *    se cargan los tres cortes que el CSS pide (400/500/600); un 700 cae al
 *    600 en vez de sintetizarse.
 *
 * Los ROLES (display / sans / mono) viven como tokens en globals.css; aca solo
 * se cargan los archivos. `next/font/google` los auto-hospeda en el build: el
 * navegador nunca habla con Google (lo fija `lib/csp-de-la-landing.test.ts`).
 */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "Onia — El sistema con IA que maneja tu negocio completo";
/**
 * La descripción que hereda toda ruta sin metadata propia — hoy `/patrones` y
 * la página 404, que es la que ve el lead que abre un link viejo.
 *
 * ⚠️ Enumeraba «facturación SIAT» entre los módulos que se encienden, y el
 * emisor está en trámite ante el SIN (`proof.ts` → siat: "tramite"). Es la
 * misma promesa que salió del pie (198cca363) y del cuerpo de la portada
 * (5423e2f50): acá sobrevivió cinco días porque el `<head>` no sale en
 * ninguna captura. Vuelve cuando la homologación concluya.
 */
const SITE_DESCRIPTION =
  `Elegís tu rubro, te entregamos el sistema configurado y encendés módulos cuando los necesités: clientes y caja, agentes con IA que esperan tu aprobación, agente conversacional de WhatsApp, inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}. Hecho en Bolivia.`;

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
  /**
   * OG sin imagen ACA a proposito: la imagen la pone cada segmento con su
   * `opengraph-image.tsx` (ver `(sitio)/tarjeta-social.tsx`), porque esa
   * convencion de Next no baja a las rutas anidadas.
   *
   * ⚠️ Corregido 2026-09-02. Aca decia que la imagen "sera una captura REAL del
   * sistema cuando exista (nunca mockups falsos como proof)" — la regla al
   * REVES. Sergio, 2026-09-01: "no coloques capturas literales del sistema, se
   * ve mal, coloca cosas referenciales". Ese comentario es el que sostuvo
   * `/og/onia-rubros.jpg` (una captura con "MUY PRONTO" impreso adentro) como
   * primera cosa que veia un lead al recibir el link.
   */
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "es_BO",
    siteName: "Onia",
  },
  twitter: {
    /**
     * `summary_large_image` y no `summary`: con `summary` la tarjeta sale chica
     * y el dibujo de 1200×630 queda recortado a un cuadradito al costado del
     * texto. Medido el 2026-09-02: `/empezar` heredaba `summary` de aca, asi
     * que aun con imagen se compartia como si no la tuviera.
     */
    card: "summary_large_image",
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

/*
 * Chatbot de Onia: widget de Chatwoot (self-hosted en el VPS). Es el MISMO motor que atiende
 * WhatsApp — califica (rubro/equipo/ciudad), agenda la demo con reserva real en Cal.com y
 * deriva a humano — expuesto como inbox web (id 4). Sigue cargando async despues del load
 * para no tocar LCP; si Chatwoot esta caido, el sitio ni se entera.
 *
 * Desde el 2026-09-11 ademas espera a que el visitante de señal de quererlo: era el 71 % del
 * peso de la portada y se lo llevaba hasta el que rebotaba a los tres segundos. El snippet y
 * su porque viven en `@/lib/chat-diferido`, que es donde el gate puede EJECUTARLO.
 */

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${plexMono.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <MotionProvider>{children}</MotionProvider>
        <script dangerouslySetInnerHTML={{ __html: chatDiferidoInit }} />
      </body>
    </html>
  );
}
