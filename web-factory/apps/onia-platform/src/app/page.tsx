import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Closing, Honesty } from "@/components/landing/closing";
import { Faq, FAQS } from "@/components/landing/faq";
import { BleedWordmark } from "@/motion";
import { MobileBar } from "@/components/landing/mobile-bar";
import styles from "@/components/landing/landing.module.css";

const SITE_URL = "https://onia.com.bo/";
const TITLE = "Onia Platform · Sistema de gestión con IA para negocios en Bolivia";
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
    title: "Sistema de gestión con IA para negocios en Bolivia",
    description:
      "Agenda, clientes, cobros y agentes con IA en una sola cuenta. Desde Bs 320/mes. 14 días gratis.",
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
    title: "Sistema de gestión con IA para negocios en Bolivia",
    description:
      "Agenda, clientes, cobros y agentes con IA en una sola cuenta. Desde Bs 320/mes. 14 días gratis.",
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
    {
      "@type": "FAQPage",
      // Mismo texto que la seccion <Faq/> — una sola fuente (FAQS).
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

/**
 * Landing Onia Platform — porte fiel del mockup aprobado por Sergio
 * (2026-08-01). Seis secciones, en este orden y no en otro:
 *
 *   hero (promesa + una pantalla)
 *   -> como funciona (3 pasos, con la captura real del selector de rubro)
 *   -> modulos (carrusel de funciones, sobre verde hondo)
 *   -> precios (en bolivianos, con la letra chica plegada)
 *   -> honestidad (cero clientes y factura en tramite, sobre tinta)
 *   -> cierre.
 *
 * Lo denso que salio del home no se borro: la comparacion con la competencia
 * vive en /comparativa y la letra chica quedo plegada dentro de precios.
 */
export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      {/*
        Sin JS no puede quedar una seccion en blanco (regla del mockup y
        anti-referencia de la casa: nada de contenido escondido detras de una
        animacion). Los reveal salen del servidor con opacity:0 en linea, asi
        que el unico que puede ganarles es un !important.
      */}
      <noscript>
        <style>{`.${styles.page} [style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Honesty />
        <Faq />
        <Closing />
        {/* Remate editorial: el nombre a escala descarada, cortado por el
            borde — una sola vez por pagina, siempre al final (doctrina del
            componente). */}
        <div className={styles.wordmarkStrip}>
          <BleedWordmark className={styles.wordmark} />
        </div>
      </main>
      <SiteFooter />
      <MobileBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  );
}
