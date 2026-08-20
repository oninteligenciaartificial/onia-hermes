import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroV2 } from "@/components/landing-v2/hero";
import { BandaV2 } from "@/components/landing-v2/banda";
import { RubrosV2 } from "@/components/landing-v2/rubros";
import { AgentesV2 } from "@/components/landing-v2/agentes";
import { ChatbotV2 } from "@/components/landing-v2/chatbot";
import { PreciosV2 } from "@/components/landing-v2/precios";
import { HonestidadV2 } from "@/components/landing-v2/honestidad";
import { CierreV2 } from "@/components/landing-v2/cierre";
import styles from "@/components/landing-v2/v2.module.css";

const SITE_URL = "https://onia.com.bo/";
const TITLE = "Onia · Tu negocio no pierde citas ni cobros | Bolivia";
const DESCRIPTION =
  "Onia Platform es el sistema de gestión con inteligencia artificial para negocios en Bolivia: agenda, clientes, cobros y agentes que trabajan 24/7 con tu aprobación. Desde Bs 320 al mes. Probalo 14 días gratis, sin tarjeta.";

/**
 * La imagen social es una captura REAL del sistema (el selector de rubro de
 * app.onia.com.bo), no un mockup. Regla de la casa: nada de pantallas
 * dibujadas haciendo de prueba.
 */
const OG_IMAGE = "/og/onia-rubros.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    siteName: "Onia Platform",
    title: "Tu negocio no pierde citas ni cobros — Onia, Bolivia",
    description:
      "Onia recuerda cada cita, persigue cada deuda y hace volver al cliente que se enfrió. Vos aprobás; el sistema hace. Desde Bs 320/mes, 14 días gratis.",
    url: "/",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Pantalla real de Onia: elegís el rubro de tu negocio al crear la cuenta.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu negocio no pierde citas ni cobros — Onia, Bolivia",
    description:
      "Onia recuerda cada cita, persigue cada deuda y hace volver al cliente que se enfrió. Vos aprobás; el sistema hace. Desde Bs 320/mes, 14 días gratis.",
    images: [OG_IMAGE],
  },
};

/**
 * Datos estructurados: Organization + SoftwareApplication con los tres precios
 * en BOB. Si los precios cambian, cambian en <Pricing> y ACA — es el mismo
 * numero dicho dos veces, una para la persona y otra para el buscador.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "Onia",
      legalName: "OniaAgency",
      url: SITE_URL,
      areaServed: { "@type": "Country", name: "Bolivia" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santa Cruz de la Sierra",
        addressCountry: "BO",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Onia Platform",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}#org` },
      description:
        "Sistema de gestión con IA para negocios en Bolivia: agenda, clientes, cobros, facturación y agentes con aprobación humana.",
      offers: [
        { name: "Básico", price: "320" },
        { name: "Pro", price: "750" },
        { name: "Full", price: "1500" },
      ].map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price,
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      })),
    },
  ],
};

/**
 * Landing Onia Platform — la v2 promovida a home (recambio 2026-08-20, pedido
 * por Sergio: "hiciste el recambio de la landing? ya te di todo lo que
 * queria").
 *
 * Por que gano la v2 sobre el rediseno v1 (los dos convivieron para comparar):
 *  1. Esta construida sobre las LEYES MEDIDAS de Fanvue (tipografia lh<=1,
 *     tracking proporcional, ritmo anclado, secciones de UN mensaje) — el
 *     canon de web-factory/WEB_FACTORY_PATTERN_BANK_2026.md.
 *  2. Densidad de MEDIA REAL: 29 imagenes de produccion contra 8 maquetas
 *     dibujadas en HTML de la v1.
 *  3. Sus precios citan la fuente que cobra (lib/pricing y chatbot-precios,
 *     corregido hoy al nivel unico ratificado 2026-08-15 — la v1 publicaba la
 *     escalera N1/N2/N3 RETIRADA).
 *
 * La v1 queda en git (components/landing/*) y la ruta /v2 se elimina: la
 * landing es UNA, y dos versiones vivas del mismo mensaje es el bug de las
 * cuatro listas de precios con otra cara.
 */
export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      {/*
        Sin JS ninguna seccion puede quedar en blanco. Los <Reveal> salen del
        servidor con `opacity:0` en linea, asi que el unico que les gana es un
        !important. Acotado a esta pagina.
      */}
      <noscript>
        <style>{`.${styles.page} [style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <HeroV2 />
        <BandaV2 />
        <RubrosV2 />
        <AgentesV2 />
        <ChatbotV2 />
        <PreciosV2 />
        <HonestidadV2 />
        <CierreV2 />
      </main>
      <SiteFooter />
    </>
  );
}
