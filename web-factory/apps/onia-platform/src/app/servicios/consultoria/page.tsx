import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { waServiciosLink } from "@/lib/site";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Consultoría y capacitación en IA y automatización | Onia",
  description:
    "Diagnóstico de procesos, implementación de automatizaciones y capacitación de equipos en IA — para empresas bolivianas. Te decimos de frente qué conviene automatizar y qué no.",
  alternates: { canonical: "/servicios/consultoria" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Consultoría y capacitación en IA y automatización",
    description:
      "Diagnóstico, implementación y capacitación. Automatizaciones que quedan andando en tu operación, no en un PDF.",
    url: "/servicios/consultoria",
  },
};

/**
 * /servicios/consultoria — misma honestidad dura que /servicios/marketing-ia:
 * cero casos inventados, cero promesas de "10x", cero logos. Se describe QUÉ
 * hacemos y cómo se contrata. El diferencial declarado es verificable:
 * operamos nuestra propia empresa con estas automatizaciones.
 */
const SERVICIOS = [
  {
    titulo: "Diagnóstico de procesos",
    detalle:
      "Nos sentamos con tu equipo y mapeamos cómo trabaja tu empresa de verdad: dónde se pierde tiempo, qué se hace dos veces, qué depende de una sola persona. Salís con un mapa claro de qué conviene automatizar primero — y qué no vale la pena automatizar, dicho de frente.",
  },
  {
    titulo: "Implementación de automatizaciones",
    detalle:
      "Construimos los flujos: integraciones entre tus sistemas, respuestas automáticas, reportes que se arman solos, agentes de IA que preparan el trabajo y esperan aprobación humana. Lo dejamos andando en tu operación y a tu gente sabiendo usarlo — no entregamos un informe y desaparecemos.",
  },
  {
    titulo: "Capacitación de equipos",
    detalle:
      "Talleres prácticos de IA para tu equipo, con sus tareas y herramientas reales — no teoría genérica. La medida del éxito es simple: que al día siguiente usen lo aprendido en su trabajo.",
  },
] as const;

const COMO_CONTRATAR = [
  {
    titulo: "Una conversación primero",
    detalle:
      "Nos contás tu empresa y tu problema por WhatsApp. Si creemos que no te podemos ayudar, te lo decimos ahí mismo.",
  },
  {
    titulo: "Propuesta con alcance y precio",
    detalle:
      "Qué se hace, en cuánto tiempo y cuánto cuesta, en bolivianos y por escrito. Cada caso se cotiza a medida — no vendemos paquetes de horas genéricos.",
  },
  {
    titulo: "Se entrega funcionando",
    detalle:
      "El trabajo se cierra cuando la automatización corre en tu operación y tu equipo la maneja. Construido y apagado no cuenta como terminado.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Consultoría y capacitación", item: `${SITE_URL}/servicios/consultoria` },
      ],
    },
    {
      "@type": "Service",
      name: "Consultoría y capacitación en IA y automatización",
      serviceType: "Consultoría en inteligencia artificial y automatización de procesos",
      description:
        "Diagnóstico de procesos, implementación de automatizaciones y capacitación de equipos en IA para empresas.",
      provider: { "@type": "Organization", name: "Onia", url: `${SITE_URL}/` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      url: `${SITE_URL}/servicios/consultoria`,
    },
  ],
};

export default function ConsultoriaPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section">
          <div className="container">
            <p className="kicker">Servicios · Consultoría y capacitación</p>
            <h1 className="h2">
              Automatizá tu empresa con alguien que automatizó la suya.
            </h1>
            <p className="lead">
              Onia funciona con agentes de IA que preparan el trabajo de cada
              día y esperan aprobación humana — esa es nuestra operación real,
              no una promesa de venta. La consultoría es eso mismo aplicado a
              tu empresa: diagnóstico, implementación y un equipo tuyo que
              sabe usarlo.
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
              Sin humo
            </h2>
            <p className="lead" style={{ marginTop: "0.75rem" }}>
              No prometemos multiplicar tu facturación ni certificamos nada
              con diplomas rimbombantes. La IA automatiza muy bien algunas
              cosas y otras no — parte del trabajo es decirte cuáles son
              cuáles en TU empresa, aunque eso achique el proyecto. Preferimos
              un cliente que vuelve a uno que se sintió vendido.
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
                  "Hola, vengo de la web de Onia. Quiero consultoría/capacitación en IA para mi empresa.",
                )}
              >
                Empezar la conversación
              </a>
              <a className="btn btn-ghost" href="/nosotros">
                Conocer quiénes somos
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
