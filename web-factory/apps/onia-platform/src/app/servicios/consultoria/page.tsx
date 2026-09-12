import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PressableCta, Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { waServiciosLink } from "@/lib/site";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Consultoría y capacitación en IA y automatización | Onia",
  description:
    "Diagnóstico de procesos, implementación de automatizaciones y capacitación de equipos en IA — para empresas bolivianas. Te decimos de frente qué conviene automatizar y qué no.",
  /**
   * NOINDEX (2026-09-11, R4): Sergio sacó esta página del nav el 08-09 ("los
   * leads confunden la web con una agencia"), pero robots.ts solo la tenía en
   * `disallow` — eso impide RASTREAR, no DESINDEXAR, y con el rastreo
   * bloqueado Google nunca llega a leer un noindex del HTML... salvo este,
   * que viaja en el header/metadata. Canonical fuera: un canonical sobre una
   * página noindex es una contradicción que los buscadores ignoran a gusto.
   */
  robots: { index: false, follow: false },
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
            <Reveal>
              <p className="kicker">Servicios · Consultoría y capacitación</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="h2">
                Automatizá tu empresa con alguien que automatizó la suya.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                Onia funciona con agentes de IA que preparan el trabajo de cada
                día y esperan aprobación humana — esa es nuestra operación real,
                no una promesa de venta. La consultoría es eso mismo aplicado a
                tu empresa: diagnóstico, implementación y un equipo tuyo que
                sabe usarlo.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <SplitTextReveal as="h2" className="h2" text="Qué hacemos." />
            <StaggerGrid className="card-grid">
              {SERVICIOS.map((servicio) => (
                <StaggerItem key={servicio.titulo} className="card">
                  <h3 className="h3">{servicio.titulo}</h3>
                  <p className="copy">{servicio.detalle}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <SplitTextReveal as="h2" className="h2" text="Sin humo." />
            <Reveal>
              <p className="lead" style={{ marginTop: "0.75rem" }}>
                No prometemos multiplicar tu facturación ni certificamos nada
                con diplomas rimbombantes. La IA automatiza muy bien algunas
                cosas y otras no — parte del trabajo es decirte cuáles son
                cuáles en TU empresa, aunque eso achique el proyecto. Preferimos
                un cliente que vuelve a uno que se sintió vendido.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <SplitTextReveal as="h2" className="h2" text="Cómo se contrata." />
            <StaggerGrid className="card-grid">
              {COMO_CONTRATAR.map((paso, i) => (
                <StaggerItem key={paso.titulo} className="card">
                  <span className="card-num" aria-hidden>
                    {`0${i + 1}`}
                  </span>
                  <h3 className="h3">{paso.titulo}</h3>
                  <p className="copy">{paso.detalle}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <Reveal className="actions">
              <PressableCta>
                <a
                  className="btn"
                  href={waServiciosLink(
                    "Hola, vengo de la web de Onia. Quiero consultoría/capacitación en IA para mi empresa.",
                  )}
                >
                  Empezar la conversación
                </a>
              </PressableCta>
              <a className="btn btn-ghost" href="/nosotros">
                Conocer quiénes somos
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
