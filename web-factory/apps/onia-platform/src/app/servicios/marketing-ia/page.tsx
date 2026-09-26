import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PressableCta, Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { waServiciosLink } from "@/lib/site";
import { PRUEBA } from "@/lib/pricing";
import { CTA_ALTA } from "../../(sitio)/alta";
import { EMPEZAR_URL } from "../../(sitio)/nav";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Marketing con IA para tu negocio — contenido, pauta e influencers IA | Onia",
  description:
    "Producimos tu contenido con IA (reels, carruseles, piezas de marca), gestionamos tu pauta en Meta y hacemos publicidad con influencers IA — propias o construida para tu marca. Sin métricas infladas: te mostramos el método y decidís.",
  // NOINDEX (2026-09-11, R4) — mismo motivo y misma mecánica que su gemela
  // /servicios/consultoria: fuera del nav por decisión de Sergio (08-09),
  // `disallow` solo no desindexa, y canonical+noindex se contradicen.
  robots: { index: false, follow: false },
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
 * hacemos y cómo se contrata, y ofrece la prueba que reemplaza al muro de logos:
 * ver las piezas andando antes de pagar.
 *
 * ⚠️ **No tener prueba social NO se cuenta**, aunque sea cierto y suene honesto.
 * Hasta el 2026-09-26 esta página tenía una sección *"Lo que NO vas a encontrar
 * acá."* que abría con *"Somos una empresa nueva … no tenemos un muro de logos
 * ni casos de éxito"*: el «Cero autobombo» de `CLAUDE.md` prohíbe hablar de
 * nosotros, y eso incluye el autobombo que se DISCULPA — el criterio ya estaba
 * escrito en la cabecera de `TODAVIA_NO` (`lib/proof.ts`), con estas dos frases.
 * Las dos mitades están prohibidas por separado: ni fabricar la prueba que falta
 * ni confesar que falta. Lo que se dice es cómo la comprueba el lead. Gate:
 * `app/trayectoria-declarada.test.ts`.
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
            <Reveal>
              <p className="kicker">Servicios · Marketing con IA</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="h2">
                Tu marketing, producido con las mismas IA que usamos para
                nosotros.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                Onia no es solo el sistema de gestión: el mismo motor de IA que
                corre nuestros agentes produce contenido, administra pauta y
                opera influencers IA. Ese motor lo ponemos a trabajar para tu
                marca — y te lo mostramos andando antes de que pagues un peso.
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
            <SplitTextReveal
              as="h2"
              className="h2"
              text="Cómo comprobás que funciona."
            />
            <Reveal>
              <p className="lead" style={{ marginTop: "0.75rem" }}>
                Antes de que pongas un peso te mostramos las piezas andando: el
                contenido ya producido, una campaña corriendo y una influencer
                IA presentando un producto. Pedinos verlo aplicado a tu rubro y
                decidí con el trabajo delante, no con una promesa.
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
                    "Hola, vengo de la web de Onia. Quiero una propuesta de marketing con IA para mi negocio.",
                  )}
                >
                  Pedir propuesta por WhatsApp
                </a>
              </PressableCta>
              <a className="btn btn-ghost" href={EMPEZAR_URL}>
                {CTA_ALTA} — {PRUEBA.dias} días gratis
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
