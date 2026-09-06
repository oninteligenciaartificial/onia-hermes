import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { APP_URL, WA_URL_LANDING } from "@/lib/site";

const SITE_URL = "https://onia.com.bo";
const REGISTRO_URL = `${APP_URL}/register`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Prueba gratis de 14 días — Onia Platform, sin tarjeta",
  description:
    "Registrate en minutos, elegí tu rubro y usá el sistema completo 14 días: agenda, clientes, caja, inventario, contabilidad Bolivia y agentes con IA. Sin tarjeta y sin permanencia.",
  alternates: { canonical: "/prueba-gratis" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Probá Onia Platform gratis 14 días",
    description:
      "Sistema completo, sin tarjeta. Elegís tu rubro y quedás andando en un día.",
    url: "/prueba-gratis",
  },
};

/**
 * /prueba-gratis — la URL dedicada del trial (patrón Siigo /prueba-gratis/ y
 * Odoo /trial): el destino medible para ads, firmas de correo y links
 * externos. Corta a propósito: UNA decisión, cero desvíos.
 */
const RUBROS = [
  "Clínica dental",
  "Comercio / tienda",
  "Importadora",
  "Estética y spa",
  "Servicios profesionales",
] as const;

const PASOS = [
  {
    titulo: "Elegí tu rubro",
    detalle:
      "Onia se arma para el tuyo: pantallas, vocabulario y agentes a tu medida.",
  },
  {
    titulo: "Tu cuenta queda lista",
    detalle:
      // La promesa dice el camino que CORRE: la persona pega el enlace y el
      // motor lo lee (`traerHtml` cae a fetch nativo). Decía «le das el nombre
      // y el sistema busca», que es el paso (3) del orquestador y depende de
      // `SEARXNG_URL` — ausente en producción, así que devolvía el formulario
      // vacío. Ver capacidad-degradada.test.ts.
      "Sin instalación ni proyecto de meses. Pegás el enlace de tu web y el sistema lee la página y carga tus datos.",
  },
  {
    titulo: "Usalo de verdad 14 días",
    detalle:
      "Todo encendido: agenda, caja, inventario, contabilidad y la cola de agentes. Si te sirve, pagás por QR; si no, no pagás nada.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Prueba gratis", item: `${SITE_URL}/prueba-gratis` },
      ],
    },
    {
      "@type": "Offer",
      name: "Prueba gratis de 14 días de Onia Platform",
      price: "0",
      priceCurrency: "BOB",
      url: `${SITE_URL}/prueba-gratis`,
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function PruebaGratisPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <p className="kicker">Prueba gratis</p>
            <h1 className="h2">
              14 días con el sistema completo. Sin tarjeta.
            </h1>
            <p className="lead">
              No es una demo recortada: es tu cuenta real, con todos los
              módulos encendidos. Si al final no te sirve, no pagás nada — y
              tus datos los exportás cuando quieras.
            </p>
            <p style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a className="btn" href={REGISTRO_URL}>
                Crear mi cuenta gratis
              </a>
              <a className="btn btn-ghost" href={WA_URL_LANDING}>
                Prefiero preguntar por WhatsApp
              </a>
            </p>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <h2 className="h3">
              Así se ve el camino:
            </h2>
            <ol style={{ marginTop: "1.25rem", display: "grid", gap: "1rem", paddingLeft: "1.25rem" }}>
              {PASOS.map((paso) => (
                <li key={paso.titulo} className="lead" style={{ maxWidth: "46rem" }}>
                  <strong>{paso.titulo}.</strong> {paso.detalle}
                </li>
              ))}
            </ol>
            <p className="lead" style={{ marginTop: "1.5rem" }}>
              Rubros disponibles hoy:{" "}
              {RUBROS.map((rubro, i) => (
                <span key={rubro}>
                  <span className="badge badge-on">{rubro}</span>
                  {i < RUBROS.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <p className="lead" style={{ marginTop: "1.5rem" }}>
              ¿Querés ver montos antes de entrar? <a href="/precios">Los precios están publicados</a>{" "}
              — en bolivianos y con la letra chica a la vista.
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
