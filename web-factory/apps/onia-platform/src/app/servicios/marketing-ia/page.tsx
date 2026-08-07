import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { waServiciosLink } from "@/lib/site";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Marketing con IA para tu negocio — contenido, pauta e influencers IA | Onia",
  description:
    "Producimos tu contenido con IA (reels, carruseles, piezas de marca), gestionamos tu pauta en Meta y hacemos publicidad con influencers IA — propias o construida para tu marca. Sin métricas infladas: te mostramos el método y decidís.",
  alternates: { canonical: "/servicios/marketing-ia" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Marketing con IA — contenido, pauta e influencers IA",
    description:
      "Contenido producido con IA, pauta en Meta gestionada e influencers IA. Hecho en Bolivia, cotizado a tu caso.",
    url: "/servicios/marketing-ia",
  },
};

/**
 * /servicios/marketing-ia — REGLA DE HONESTIDAD DURA: cero casos inventados,
 * cero métricas fabricadas, cero logos de clientes. La página describe QUÉ
 * hacemos y cómo se contrata, y esa transparencia ES el pitch (coherente con
 * /nosotros y la sección de honestidad del home).
 */
const SERVICIOS = [
  {
    titulo: "Contenido producido con IA",
    detalle:
      "Reels, carruseles y piezas de marca producidos con nuestro propio sistema de video e imagen con IA — el mismo que usamos para Onia. Definimos juntos la línea, producimos por tandas y nada se publica sin tu aprobación.",
  },
  {
    titulo: "Pauta en Meta, gestionada",
    detalle:
      "Armamos y administramos tus campañas en Facebook e Instagram: segmentación, creativos y ajustes continuos. El presupuesto de pauta es tuyo y lo definís vos; nosotros cobramos por gestionarlo y te reportamos qué se gastó y qué pasó, sin maquillaje.",
  },
  {
    titulo: "Publicidad con influencers IA",
    detalle:
      "Tenemos influencers IA propias que pueden presentar tu producto, o construimos una influencer IA para tu marca: cara consistente, contenido continuo, sin depender de la agenda de una persona. Todo el contenido hecho con IA se etiqueta como tal — no engañamos a tu audiencia.",
  },
] as const;

const COMO_CONTRATAR = [
  {
    titulo: "Nos escribís por WhatsApp",
    detalle: "Nos contás tu negocio, qué vendés y qué querés lograr.",
  },
  {
    titulo: "Te proponemos un plan con alcance y precio",
    detalle:
      "Qué piezas, qué frecuencia, qué pauta — con el precio en bolivianos por escrito. Sin permanencia forzada.",
  },
  {
    titulo: "Producimos, aprobás, sale",
    detalle:
      "Trabajamos por ciclos: producimos, revisás, se publica lo aprobado. Cada mes ves qué se hizo y decidís si seguimos.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Marketing con IA", item: `${SITE_URL}/servicios/marketing-ia` },
      ],
    },
    {
      "@type": "Service",
      name: "Marketing con IA",
      serviceType: "Marketing digital con inteligencia artificial",
      description:
        "Producción de contenido con IA (reels, carruseles, piezas de marca), gestión de pauta en Meta y publicidad con influencers IA.",
      provider: { "@type": "Organization", name: "Onia", url: `${SITE_URL}/` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      url: `${SITE_URL}/servicios/marketing-ia`,
    },
  ],
};

export default function MarketingIaPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <p className="kicker">Servicios · Marketing con IA</p>
            <h1 className="h2">
              Tu marketing, producido con las mismas IA que usamos para
              nosotros.
            </h1>
            <p className="lead">
              Onia no es solo el sistema de gestión: el mismo motor de IA que
              corre nuestros agentes produce contenido, administra pauta y
              opera influencers IA. Ese motor lo ponemos a trabajar para tu
              marca — y te lo mostramos andando antes de que pagues un peso.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ maxWidth: "46rem" }}>
            <h2 className="h2" style={{ fontSize: "1.6rem" }}>
              Qué hacemos
            </h2>
            <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.25rem" }}>
              {SERVICIOS.map((servicio) => (
                <div key={servicio.titulo}>
                  <h3 style={{ fontWeight: 700 }}>{servicio.titulo}</h3>
                  <p className="lead" style={{ marginTop: "0.35rem" }}>
                    {servicio.detalle}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="h2" style={{ fontSize: "1.6rem", marginTop: "2.5rem" }}>
              Lo que NO vas a encontrar acá
            </h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              Somos una empresa nueva y lo decimos de frente: no tenemos un
              muro de logos ni casos de éxito con números espectaculares — y
              antes que inventarlos, preferimos no tenerlos todavía. Lo que sí
              tenemos es el método y las herramientas trabajando todos los
              días para nuestra propia marca. Pedinos ver eso: es la prueba
              real.
            </p>

            <h2 className="h2" style={{ fontSize: "1.6rem", marginTop: "2.5rem" }}>
              Cómo se contrata
            </h2>
            <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.25rem" }}>
              {COMO_CONTRATAR.map((paso, i) => (
                <div key={paso.titulo}>
                  <h3 style={{ fontWeight: 700 }}>
                    {i + 1}. {paso.titulo}
                  </h3>
                  <p className="lead" style={{ marginTop: "0.35rem" }}>
                    {paso.detalle}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <a
                className="btn"
                style={{ background: "var(--senal)", color: "var(--tinta)" }}
                href={waServiciosLink(
                  "Hola, vengo de la web de Onia. Quiero una propuesta de marketing con IA para mi negocio.",
                )}
              >
                Pedir propuesta por WhatsApp
              </a>
              <a className="btn btn-ghost" href="/prueba-gratis">
                Conocer el sistema — 14 días gratis
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
