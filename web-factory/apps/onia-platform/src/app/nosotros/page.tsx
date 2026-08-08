import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WA_URL_LANDING } from "@/lib/site";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Quiénes somos — Onia",
  description:
    "Onia (OniaAgency) es una empresa boliviana de Santa Cruz que construye el sistema de gestión con IA para negocios de Bolivia. Empresa nueva, tecnología real: así trabajamos.",
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
 * Coherente con la sección de honestidad del home: empresa nueva, dicho de
 * frente, con lo verificable por delante. Los datos legales coinciden con el
 * pie y con el portfolio de Meta — no tocar sin actualizar los tres.
 */
const PRINCIPIOS = [
  {
    titulo: "Honestidad primero",
    detalle:
      "Somos nuevos y lo decimos. Lo que está en trámite, lo publicamos como en trámite. Lo que no hacemos todavía, está escrito en la página de comparación.",
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
            <p className="kicker">Nosotros</p>
            <h1 className="h2">
              Una empresa boliviana construyendo el sistema que Bolivia no
              tenía.
            </h1>
            <p className="lead">
              Onia nace en Santa Cruz de la Sierra con una convicción simple:
              el dueño de un negocio boliviano merece la misma tecnología que
              una empresa grande — con inteligencia artificial de verdad, en
              bolivianos, y hablando su idioma. Somos OniaAgency, registrados
              en SEPREC y con NIT vigente, y estamos empezando: sin
              inversores, sin humo, con el sistema en producción.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ maxWidth: "46rem" }}>
            <h2 className="h2" style={{ fontSize: "1.6rem" }}>
              Cómo trabajamos
            </h2>
            <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.25rem" }}>
              {PRINCIPIOS.map((principio) => (
                <div key={principio.titulo}>
                  <h3 style={{ fontWeight: 700 }}>{principio.titulo}</h3>
                  <p className="lead" style={{ marginTop: "0.35rem" }}>
                    {principio.detalle}
                  </p>
                </div>
              ))}
            </div>
            <h2 className="h2" style={{ fontSize: "1.6rem", marginTop: "2.5rem" }}>
              Dónde estamos hoy
            </h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              El sistema corre en producción con seis rubros disponibles —
              clínicas dentales, comercios, importadoras, estéticas,
              veterinarias y servicios profesionales — y nuestro emisor de
              facturación está registrado ante el SIN con las pruebas técnicas
              de la Fase 1 completadas. Los primeros clientes de Onia van a
              poder decir que estuvieron desde el principio; por eso el precio
              de lanzamiento es el que es.
            </p>
            <p style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a className="btn" href="/prueba-gratis">
                Probar el sistema
              </a>
              <a className="btn btn-ghost" href={WA_URL_LANDING}>
                Hablar con nosotros
              </a>
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
