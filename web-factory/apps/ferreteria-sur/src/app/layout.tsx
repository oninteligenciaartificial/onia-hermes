import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// ── Elección tipográfica ──────────────────────────────────────────────────────
// El sitio anterior del catálogo (dental-premium) es Fraunces + DM Sans: serif
// escasa, cálida, consultorio. Acá hace falta lo contrario y por motivo, no por
// capricho: una ferretería vende OFICIO, no calma.
//
// Display · ARCHIVO BLACK (Omnibus-Type). Grotesca de señalética y prensa,
// pensada para rótulos de alto contraste: asta gruesa, contraforma mínima,
// aire de letra pintada en chapa. Es la letra del cartel del local y de la
// etiqueta de la máquina, no la del folleto de clínica. Un solo peso (400 =
// negro macizo) porque una señal no tiene medias tintas.
//
// Body · IBM PLEX SANS. Nace como tipografía de una empresa de ingeniería para
// documentación técnica: humanista pero sobria, legible en párrafo largo y en
// ficha de producto. Contraste real con la display (peso, ancho y esqueleto
// distintos), no la misma familia en dos tamaños.
//
// Datos · IBM PLEX MONO. Misma superfamilia, ancho fijo, para lo que en una
// ferretería SIEMPRE va tabulado: medidas, códigos, horarios, unidades. Es la
// textura de "ficha técnica" que separa este sitio de un landing genérico.
//
// Ninguna es Inter / Geist / Onest / Poppins / Montserrat. Todas por next/font:
// self-hosted, sin request a Google en runtime, cero CLS.
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ferretería Sur | Herramienta, construcción y eléctrico en Santa Cruz",
  description:
    "Ferretería en la zona sur de Santa Cruz de la Sierra: herramienta, tornillería, eléctrico, plomería, pintura y material de construcción. Consultá stock por WhatsApp antes de cruzar la ciudad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${archivoBlack.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        {/* motion serializa el estado inicial de cada Reveal como
            style="opacity:0;transform:translateY(24px)" en el HTML del
            servidor. Con JS caído eso deja el sitio entero en blanco debajo del
            nav (21 bloques en esta página). Tres líneas y el contenido siempre
            se lee. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
