import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Reveal } from "@/motion";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Precios de Onia Platform — planes en bolivianos, publicados",
  description:
    "Básico Bs 320, Pro Bs 750 y Full Bs 1.500 al mes (o semanal desde Bs 89). Sin tarjeta para probar, sin contratos de permanencia y con la letra chica publicada. 14 días gratis.",
  alternates: { canonical: "/precios" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Precios de Onia Platform — en bolivianos, publicados",
    description:
      "Básico 320 · Pro 750 · Full 1.500 Bs/mes. 14 días gratis sin tarjeta, sin permanencia.",
    url: "/precios",
  },
};

/**
 * /precios — la pagina que Siigo y Alegra tienen y toda landing única no:
 * una URL enlazable y medible para la decisión de compra. Reusa la MISMA
 * seccion <Pricing/> del home (un solo lugar donde viven los montos) y la
 * FAQ; agrega el puente a /comparativa y a /prueba-gratis (el triángulo de
 * conversión del research: precios ↔ comparativa ↔ prueba).
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Precios", item: `${SITE_URL}/precios` },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Onia Platform",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/precios`,
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

export default function PreciosPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <Reveal>
              <p className="kicker">Precios</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="h2">
                En bolivianos, publicados, sin letra escondida.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                Tres planes que se distinguen por el salto de valor — ordenar,
                recuperar, crecer sin techo. Cada uno dice exactamente qué lleva
                y qué no, con los números que el sistema aplica de verdad:
                usuarios, fichas de clientes y recordatorios. Pagás mensual,
                semanal o anual, y cancelás cuando quieras.
              </p>
            </Reveal>
          </div>
        </section>
        <Pricing sinEncabezado />
        <section className="section section-tight">
          <div className="container">
            <Reveal>
              <p className="lead">
                ¿Necesitás además que te atiendan el WhatsApp o que te hagamos la
                web? Son servicios aparte, con su propio precio y sus propios
                requisitos publicados:{" "}
                <a href="/chatbot">los tres stacks de chatbot</a> y{" "}
                <a href="/servicios/webs">los stacks de webs</a>.
              </p>
              <p className="lead" style={{ marginTop: "1rem" }}>
                ¿Comparando opciones?{" "}
                <a href="/comparativa">
                  Mirá Onia contra todo lo que se vende en Bolivia
                </a>{" "}
                — con los precios públicos de cada uno y lo que todavía no
                hacemos, dicho de frente. ¿Preferís tocarlo antes que leer?{" "}
                <a href="/prueba-gratis">Probalo gratis 14 días</a>.
              </p>
            </Reveal>
          </div>
        </section>
        <Faq />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  );
}
