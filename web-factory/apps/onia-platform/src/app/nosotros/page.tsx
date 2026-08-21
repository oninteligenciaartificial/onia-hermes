import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PressableCta, Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { WA_URL_LANDING } from "@/lib/site";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Quiénes somos — Onia",
  description:
    "Onia (OniaAgency) es una empresa boliviana de Santa Cruz que construye el sistema de gestión con IA para negocios de Bolivia. Registrados en SEPREC, con NIT vigente y el sistema en producción: así trabajamos.",
  alternates: { canonical: "/nosotros" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Quiénes somos — Onia",
    description: "Empresa boliviana, tecnología real, honestidad primero.",
    url: "/nosotros",
  },
};

/**
 * /nosotros — la señal de confianza que toda marca desconocida necesita antes
 * de que alguien le entregue los datos de su negocio (patrón Alegra/Siigo).
 *
 * REGLA DE COPY (2026-08-15, pedido de Sergio): la página NO anuncia que la
 * empresa es nueva ni que todavía no hay clientes — eso contesta el miedo del
 * comprador («¿y si no funciona?») dándole la razón. Se contesta con lo
 * verificable y comprobable por él: 14 días con el sistema completo sin
 * tarjeta, sin permanencia, datos exportables en CSV. Sigue prohibido el
 * camino opuesto: inventar clientes, logos, testimonios o métricas.
 * Cada garantía de acá está verificada contra src/lib/pricing.ts, que a su vez
 * sale del código que cobra. Los datos legales coinciden con el pie y con el
 * portfolio de Meta — no tocar sin actualizar los tres.
 */
const PRINCIPIOS = [
  {
    titulo: "Honestidad primero",
    detalle:
      "Lo que está en trámite lo publicamos como en trámite, y lo que el sistema todavía no hace está escrito en la página de comparación. Preferimos que lo leas acá y no que lo descubras en la primera semana.",
  },
  {
    titulo: "La IA propone, vos aprobás",
    detalle:
      "Nuestros agentes trabajan de noche, pero nada sale hacia un cliente tuyo sin tu OK. Human-in-the-loop no es un adorno: es la arquitectura.",
  },
  {
    titulo: "Bolivia específica, no genérica",
    detalle:
      "IVA 13%, IT 3%, RCV, vencimientos por NIT, QR bancario, precios en bolivianos. No somos un software de afuera traducido: la contabilidad boliviana es el núcleo.",
  },
  {
    titulo: "Tus datos son tuyos",
    detalle:
      "Los exportás cuando quieras, no los vendemos y no entrenamos modelos de IA con ellos. Está en la política de privacidad, con nombre y apellido.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Nosotros", item: `${SITE_URL}/nosotros` },
      ],
    },
    {
      "@type": "AboutPage",
      name: "Quiénes somos — Onia",
      url: `${SITE_URL}/nosotros`,
      about: {
        "@type": "Organization",
        name: "Onia",
        legalName: "OniaAgency",
        url: `${SITE_URL}/`,
        email: "business@onia.com.bo",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Santa Cruz de la Sierra",
          addressCountry: "BO",
        },
      },
    },
  ],
};

export default function NosotrosPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <Reveal>
              <p className="kicker">Nosotros</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="h2">
                Una empresa boliviana construyendo el sistema que Bolivia no
                tenía.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                Onia nace en Santa Cruz de la Sierra con una convicción simple:
                el dueño de un negocio boliviano merece la misma tecnología que
                una empresa grande — con inteligencia artificial de verdad, en
                bolivianos, y hablando su idioma. Somos OniaAgency, registrados
                en SEPREC y con NIT vigente, y el sistema ya corre en
                producción: entrás, lo usás completo 14 días sin dejar una
                tarjeta, y recién después decidís.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <SplitTextReveal as="h2" className="h2" text="Cómo trabajamos." />
            {/* cuatro principios: dos columnas, no tres con un huerfano */}
            <StaggerGrid className="card-grid card-grid-2">
              {PRINCIPIOS.map((principio) => (
                <StaggerItem key={principio.titulo} className="card">
                  <h3 className="h3">{principio.titulo}</h3>
                  <p className="copy">{principio.detalle}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <SplitTextReveal as="h2" className="h2" text="Dónde estamos hoy." />
            <Reveal>
              <p className="lead" style={{ marginTop: "0.75rem" }}>
                El sistema corre en producción con seis rubros disponibles —
                clínicas dentales, comercios, importadoras, estéticas,
                veterinarias y servicios profesionales — y nuestro emisor de
                facturación está registrado ante el SIN con las pruebas técnicas
                de la Fase 1 completadas. Lo probás tal como está hoy: 14 días
                con el sistema completo, sin tarjeta y sin contrato de
                permanencia. Si no te sirve, no pagás nada y tus datos te los
                llevás en CSV cuando quieras.
              </p>
            </Reveal>
            <Reveal className="actions">
              <PressableCta>
                <a className="btn" href="/empezar">
                  Probar el sistema
                </a>
              </PressableCta>
              <a className="btn btn-ghost" href={WA_URL_LANDING}>
                Hablar con nosotros
              </a>
            </Reveal>
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
