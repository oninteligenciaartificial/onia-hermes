import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { CHATBOT_STACKS, CONVERSACIONES_INCLUIDAS, fmtBs } from "@/content/chatbot-precios";
import { waServiciosLink } from "@/lib/site";
import { Configurador } from "./Configurador";
import styles from "./configurador.module.css";

const SITE_URL = "https://onia.com.bo";
const ENTRADA = CHATBOT_STACKS[0];

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Chatbot de WhatsApp — precio publicado | Onia",
  description: `Chatbot de WhatsApp que contesta 24/7 con la información real de tu negocio: hasta ${CONVERSACIONES_INCLUIDAS} conversaciones por mes, y lo que necesite decisión pasa a una persona. Bs ${fmtBs(ENTRADA.mensual)}/mes, sin instalación. Hecho en Bolivia.`,
  alternates: { canonical: "/chatbot" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Chatbot de WhatsApp — precio publicado",
    description: `Contesta al instante a cualquier hora con lo que vos cargaste, hasta ${CONVERSACIONES_INCLUIDAS} conversaciones por mes; el resto pasa a una persona. Bs ${fmtBs(ENTRADA.mensual)}/mes, con los requisitos publicados.`,
    url: "/chatbot",
  },
};

/**
 * /chatbot — el configurador ES la página: el cliente elige uno de los tres
 * stacks, ve qué lleva y qué no, y manda el pedido por WhatsApp DESPUÉS de
 * marcar que leyó los requisitos (checkout-WhatsApp, sin backend). Los montos
 * viven en src/content/chatbot-precios.ts — este archivo no conoce números,
 * solo los referencia para el JSON-LD.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Chatbot WhatsApp", item: `${SITE_URL}/chatbot` },
      ],
    },
    {
      "@type": "Service",
      name: "Chatbot de WhatsApp para negocios",
      serviceType: "Automatización de WhatsApp con inteligencia artificial",
      description:
        `Chatbot de WhatsApp que contesta 24/7 con la información real que el negocio publicó: hasta ${CONVERSACIONES_INCLUIDAS} conversaciones por mes, y lo que no sabe pasa a una persona. Lo que salga del alcance se cotiza a medida.`,
      provider: { "@type": "Organization", name: "Onia", url: `${SITE_URL}/` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      url: `${SITE_URL}/chatbot`,
      offers: CHATBOT_STACKS.map((stack) => ({
        "@type": "Offer",
        name: `${stack.nivel} — ${stack.nombre}`,
        price: String(stack.mensual),
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      })),
    },
  ],
};

const PASOS = [
  {
    titulo: "Nos contás tu negocio",
    detalle:
      "Qué vendés, qué te preguntan siempre y cómo respondés vos. Con eso entrenamos el chatbot — habla de tu negocio, no genérico. Es la parte que más tiempo lleva y la ponés vos.",
  },
  {
    titulo: "Lo probás antes de encenderlo",
    detalle:
      "Te lo mostramos andando en un WhatsApp de prueba, con tus respuestas reales. Se enciende con clientes recién cuando vos das el OK.",
  },
  {
    titulo: "Atiende, y lo que no sabe lo deriva",
    detalle:
      "Responde solo lo que sabe; cuando la conversación necesita un humano, te la pasa con el contexto. Lo vamos ajustando con lo que aprende.",
  },
] as const;

export default function ChatbotPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <p className="kicker">Chatbot WhatsApp</p>
            <h1 className="h2">
              Un solo nivel, con IA. Lo que salga del alcance se cotiza a medida.
            </h1>
            <p className="lead">
              No es un menú de funciones sueltas: cada stack resuelve una cosa
              concreta — que no se te olvide nadie, que nadie quede sin
              respuesta, o que el chat opere solo. Abajo está lo que lleva cada
              uno, lo que no lleva y lo que tenés que poner vos.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "1.5rem" }}>
          <div className="container">
            <Configurador />
          </div>
        </section>

        <section className="section section-tight">
          <div className="container">
            <Reveal>
              <span className="kicker">Cómo funciona</span>
            </Reveal>
            <SplitTextReveal
              as="h2"
              className="h2"
              text="De tu WhatsApp de siempre a un WhatsApp que trabaja."
            />
            <StaggerGrid className={styles.pasos}>
              {PASOS.map((paso, i) => (
                <StaggerItem key={paso.titulo}>
                  <p className="kicker" style={{ fontSize: "0.72rem" }}>
                    Paso {i + 1}
                  </p>
                  <h3 style={{ marginTop: "0.5rem", fontSize: "1.15rem" }}>
                    {paso.titulo}
                  </h3>
                  <p className="lead" style={{ marginTop: "0.45rem", fontSize: "0.95rem" }}>
                    {paso.detalle}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <p
              style={{
                marginTop: "2.5rem",
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <a
                className="btn btn-ghost"
                href={waServiciosLink(
                  "Hola, vengo de la página del chatbot de Onia. Tengo una consulta antes de elegir el stack.",
                )}
              >
                Preguntanos por WhatsApp
              </a>
              <a className="btn btn-ghost" href="/servicios/webs">
                Ver los stacks de webs
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
