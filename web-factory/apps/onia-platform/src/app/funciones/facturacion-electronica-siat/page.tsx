import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WA_URL_LANDING } from "@/lib/site";
import {
  SIAT_TITULAR,
  SIAT_BAJADA,
  SIAT_BLOQUES,
  SIAT_FAQ,
  SIAT_FUENTES,
} from "@/lib/siat";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Facturación en línea obligatoria en Bolivia: qué exige el SIN desde el 1 de octubre de 2026",
  description:
    "Los grupos 9° al 12° de contribuyentes deben emitir por facturación en línea desde el 01-10-2026 (RND 102600000007). Qué significa, las opciones que tenés — incluido el portal gratuito del SIN — y cómo saber tu grupo.",
  alternates: { canonical: "/funciones/facturacion-electronica-siat" },
  openGraph: {
    type: "article",
    locale: "es_BO",
    title: "Facturación en línea obligatoria: lo que cambia el 1 de octubre de 2026",
    description:
      "La guía honesta: qué exige el SIN, quiénes están alcanzados y las opciones reales — incluida la gratuita.",
    url: "/funciones/facturacion-electronica-siat",
  },
};

/**
 * /funciones/facturacion-electronica-siat — la página normativa (patrón
 * Holded con Verifactu en España): captura la búsqueda del plazo y la
 * convierte en confianza.
 *
 * El TEXTO ya no vive acá: vive en `lib/siat.ts`, porque el preview (v3)
 * necesita el mismo contenido y una ley copiada en dos páginas es una ley que
 * en seis meses dice dos cosas distintas. Acá queda el armado y el JSON-LD.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Facturación electrónica SIAT", item: `${SITE_URL}/funciones/facturacion-electronica-siat` },
      ],
    },
    {
      "@type": "Article",
      headline: "Facturación en línea obligatoria en Bolivia: lo que cambia el 1 de octubre de 2026",
      inLanguage: "es-BO",
      datePublished: "2026-08-07",
      author: { "@type": "Organization", name: "Onia" },
      url: `${SITE_URL}/funciones/facturacion-electronica-siat`,
    },
    {
      "@type": "FAQPage",
      mainEntity: SIAT_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function SiatPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <p className="kicker">Facturación electrónica · SIAT</p>
            <h1 className="h2">{SIAT_TITULAR}</h1>
            <p className="lead">{SIAT_BAJADA}</p>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container prose">
            {SIAT_BLOQUES.map((bloque, i) => (
              <div key={bloque.titulo}>
                <h2 className="h3" style={i > 0 ? { marginTop: "2.5rem" } : undefined}>
                  {bloque.titulo}
                </h2>
                <p className="lead" style={{ marginTop: "0.75rem" }}>
                  {bloque.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-tight">
          <div className="container prose">
            <h2 className="h3">
              Las preguntas que todos hacen
            </h2>
            <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.25rem" }}>
              {SIAT_FAQ.map((item) => (
                <div key={item.q}>
                  <h3 style={{ fontWeight: 700 }}>{item.q}</h3>
                  <p className="lead" style={{ marginTop: "0.35rem" }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a className="btn" href="/prueba-gratis">
                Dejá tu operación lista — 14 días gratis
              </a>
              <a className="btn btn-ghost" href={WA_URL_LANDING}>
                Preguntanos tu caso por WhatsApp
              </a>
            </p>
            <p className="lead" style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
              {SIAT_FUENTES}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  );
}
