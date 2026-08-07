import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WA_URL_LANDING } from "@/lib/site";

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
 * convierte en confianza. REGLA DE LA CASA respetada a rajatabla: el SIN
 * ofrece un Portal Web GRATUITO y se dice primero y de frente — el pitch es
 * "no tengas que tipear", jamás "estás obligado a comprarme". Fechas y RND
 * verificadas contra fuentes oficiales el 2026-08-06 (PDF de la RND
 * 102500000036 + nota de prensa del SIN por la RND 102600000007).
 */
const FAQ_SIAT = [
  {
    q: "¿Cómo sé si mi negocio está en los grupos 9° al 12°?",
    a: "El SIN asignó los grupos por NIT en resoluciones de 2024 (RND 102400000004, 05, 12 y 25). Entrá a tu Oficina Virtual (siat.impuestos.gob.bo) con tu NIT o preguntale a tu contador: ahí figura tu modalidad asignada. No adivines por el rubro — depende del NIT.",
  },
  {
    q: "¿Puedo cumplir gratis?",
    a: "Sí. El SIN ofrece el Portal Web en Línea gratuito, donde emitís factura por factura tipeando los datos a mano. Cumple la norma al 100%. Lo que un sistema como Onia agrega no es el cumplimiento: es no re-tipear — la factura sale sola de tu venta, con tu caja y tu contabilidad conectadas.",
  },
  {
    q: "¿Qué pasa si no migro antes del 1 de octubre de 2026?",
    a: "Desde esa fecha los grupos alcanzados solo pueden emitir por su modalidad de facturación en línea asignada (RND 102600000007). Emitir por medios anteriores deja de ser válido para esos contribuyentes.",
  },
  {
    q: "¿Ya hubo prórrogas? ¿Puede haber otra?",
    a: "Hubo dos: la RND 102500000036 movió el plazo a marzo de 2026, y la RND 102600000007 lo movió al 30 de septiembre de 2026. Puede haber otra — nadie lo sabe. Nuestro consejo honesto: no apuestes tu facturación a que la haya.",
  },
  {
    q: "¿Y Onia ya puede emitir facturas en línea?",
    a: "Estamos en trámite: nuestro sistema está registrado ante el SIN como proveedor y ya completó las pruebas técnicas de emisión, anulación y contingencia en el ambiente de pruebas del SIN (Fase 1). Faltan las etapas formales de inspección. Mientras tanto, con Onia tu venta queda registrada y lista, y emitís por el portal gratuito del SIN — te avisamos apenas la homologación concluya.",
  },
] as const;

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
      mainEntity: FAQ_SIAT.map((item) => ({
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
            <h1 className="h2">
              Desde el 1 de octubre de 2026, miles de negocios solo podrán
              facturar en línea.
            </h1>
            <p className="lead">
              La RND 102600000007 del SIN fijó el 30 de septiembre de 2026 como
              último día de transición para los grupos 9° al 12° de
              contribuyentes — el universo de micro y pequeñas empresas. Desde
              el 1 de octubre, esos negocios emiten únicamente por su modalidad
              de facturación en línea asignada.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ maxWidth: "46rem" }}>
            <h2 className="h2" style={{ fontSize: "1.6rem" }}>
              Lo primero que tenés que saber: podés cumplir GRATIS.
            </h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              El SIN ofrece el <strong>Portal Web en Línea</strong>, gratuito,
              donde cualquier contribuyente emite sus facturas tipeándolas una
              por una en la página de Impuestos. Si tu negocio emite pocas
              facturas, esa opción cumple la norma y no cuesta nada. Cualquiera
              que te diga "estás obligado por ley a comprar un sistema" te está
              mintiendo — y con nosotros esa frase no existe.
            </p>
            <h2 className="h2" style={{ fontSize: "1.6rem", marginTop: "2rem" }}>
              Lo que un sistema resuelve no es la obligación: es el re-tipeo.
            </h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              El costo real del portal gratuito es tu tiempo: cada venta se
              tipea dos veces — una en tu cuaderno o caja, otra en el portal.
              Con un sistema de gestión conectado, la factura sale de la MISMA
              venta que ya registraste al cobrar, y tu registro de compras y
              ventas (RCV), el IVA y el calendario de vencimientos se arman
              solos. Ese es el trabajo que Onia hace — el cumplimiento ya era
              tuyo gratis.
            </p>
            <h2 className="h2" style={{ fontSize: "1.6rem", marginTop: "2rem" }}>
              Dónde está Onia en este camino (dicho de frente)
            </h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              Nuestro sistema está <strong>registrado ante el SIN como
              proveedor de facturación</strong> y ya completó las pruebas
              técnicas de la Fase 1 en el ambiente de pruebas oficial: emisión
              individual y masiva, anulaciones, reversiones y operación sin
              internet. Quedan las etapas formales del trámite (inspección del
              SIN). Mientras la homologación concluye, Onia registra y ordena
              cada venta, arma tu contabilidad, y emitís por el portal
              gratuito — sin re-tipear tus números, porque el sistema te los
              da listos.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ maxWidth: "46rem" }}>
            <h2 className="h2" style={{ fontSize: "1.6rem" }}>
              Las preguntas que todos hacen
            </h2>
            <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.25rem" }}>
              {FAQ_SIAT.map((item) => (
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
              Fuentes: RND 102100000011 (Sistema de Facturación), RND
              102500000036 y nota de prensa oficial del SIN sobre la RND
              102600000007. Verificado el 6 de agosto de 2026. Esto es
              información general, no asesoría tributaria — tu caso concreto
              confirmalo con tu contador o en tu Oficina Virtual.
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
