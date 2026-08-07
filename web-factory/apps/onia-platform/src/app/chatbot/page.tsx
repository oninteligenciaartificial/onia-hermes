import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { CHATBOT_BASE } from "@/content/chatbot-precios";
import { waServiciosLink } from "@/lib/site";
import { Configurador } from "./Configurador";
import styles from "./configurador.module.css";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Chatbot de WhatsApp con IA — armalo a tu medida | Onia",
  description: `Un chatbot que atiende tu WhatsApp 24/7: responde, califica y deriva a tu equipo. Elegís qué encender — recordatorios, agenda, cobros con QR, notas de voz — desde Bs ${CHATBOT_BASE.mensual} al mes. Hecho en Bolivia.`,
  alternates: { canonical: "/chatbot" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Chatbot de WhatsApp con IA — armalo a tu medida",
    description: `Responde 24/7, califica y deriva. Encendé solo lo que necesitás, desde Bs ${CHATBOT_BASE.mensual}/mes.`,
    url: "/chatbot",
  },
};

/**
 * /chatbot — el configurador ES la página: el cliente arma su chatbot
 * encendiendo add-ons y se lleva el total a WhatsApp (checkout-WhatsApp,
 * sin backend). Los montos viven en src/content/chatbot-precios.ts —
 * este archivo no conoce números, solo los referencia para el JSON-LD.
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
      name: "Chatbot de WhatsApp con IA",
      serviceType: "Chatbot de WhatsApp con inteligencia artificial",
      description:
        "Chatbot que atiende el WhatsApp del negocio 24/7: responde, califica clientes y deriva a humanos. Add-ons de recordatorios, agenda, cobros con QR y notas de voz.",
      provider: { "@type": "Organization", name: "Onia", url: `${SITE_URL}/` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      url: `${SITE_URL}/chatbot`,
      offers: {
        "@type": "Offer",
        price: String(CHATBOT_BASE.mensual),
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

const PASOS = [
  {
    titulo: "Nos contás tu negocio",
    detalle:
      "Qué vendés, qué te preguntan siempre y cómo respondés vos. Con eso entrenamos el chatbot — habla de tu negocio, no genérico.",
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
              Armá tu chatbot a tu gusto. Pagás solo lo que encendés.
            </h1>
            <p className="lead">
              La base atiende tu WhatsApp las 24 horas: responde, califica al
              cliente y te deriva las conversaciones que valen. Lo demás lo
              encendés vos — tocá los interruptores y mirá el precio armarse.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "1.5rem" }}>
          <div className="container">
            <Configurador />
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
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
                  "Hola, vengo de la página del chatbot de Onia. Tengo una consulta antes de armarlo.",
                )}
              >
                Preguntanos por WhatsApp
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
