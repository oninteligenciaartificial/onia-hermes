import type { Metadata } from "next";
import { PLANES, bs, cuantosPlanes, semanalDesde, PRUEBA } from "@/lib/pricing";

/**
 * Los saltos de valor, en el orden de la escalera y en minúscula: "ordenar,
 * recuperar, operar completo y todo incluido". Se derivan por el mismo motivo
 * que la cantidad — un plan nuevo entra solo, tipeados se quedan atrás.
 */
function saltosDeLaEscalera(): string {
  const saltos = PLANES.map((p) => p.salto.toLowerCase());
  if (saltos.length <= 1) return saltos.join("");
  return `${saltos.slice(0, -1).join(", ")} y ${saltos[saltos.length - 1]}`;
}

/**
 * Los planes con su precio, TODOS, en el orden de la escalera.
 *
 * ⚠️ La razón por la que existe está escrita doce renglones más arriba, para los `salto`, desde
 * el 2026-09-12 — y no viajó a las dos `description` de acá abajo, que seguían nombrando
 * `plan("basico")`, `plan("pro")` y `plan("full")` a mano. Medido el 2026-09-17 sobre
 * `onia.com.bo/v1/precios` SERVIDA: «Básico Bs 320, Pro Bs 890 y Full Bs 1.290», con el plan
 * **Crece (Bs 550)** vendiéndose en la tabla de esa misma pantalla y ausente del único renglón
 * que viaja al buscador y al preview de WhatsApp. Interpolar la CIFRA (la cura del 2026-09-04)
 * no alcanzó: el id seguía tipeado, así que el plan nuevo no entró en ninguna de las dos.
 */
function preciosDeLaEscalera({ separador }: { separador: "prosa" | "puntos" }): string {
  const partes = PLANES.map((p) =>
    separador === "prosa"
      ? `${p.nombre} Bs ${bs(p.mensual)}`
      : `${p.nombre} ${bs(p.mensual)}`,
  );
  if (separador === "puntos") return partes.join(" · ");
  if (partes.length <= 1) return partes.join("");
  return `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`;
}
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Pricing } from "@/components/landing-v1/pricing";
import { Faq } from "@/components/landing-v1/faq";
import { Reveal } from "@/motion";

const SITE_URL = "https://onia.com.bo";

/**
 * La `description` es superficie de cliente que NO se ve mirando la pantalla:
 * es el único renglón que tiene el sitio para ganarse el clic en Google. Hasta
 * el 2026-09-04 tipeaba los tres precios a mano, así que un cambio de plan la
 * dejaba anunciando el precio viejo en el buscador sin que ninguna captura lo
 * delatara. Guarda: `app/(sitio)/precios.test.ts`.
 */
const SEMANAL = semanalDesde();
const DESDE_SEMANAL = SEMANAL === null ? "" : ` (o semanal desde Bs ${bs(SEMANAL)})`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Precios de Onia Platform — planes en bolivianos, publicados",
  description:
    `${preciosDeLaEscalera({ separador: "prosa" })} al mes${DESDE_SEMANAL}. Sin tarjeta para probar, sin contratos de permanencia y con la letra chica publicada. ${PRUEBA.dias} días gratis.`,
  alternates: { canonical: "/precios" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Precios de Onia Platform — en bolivianos, publicados",
    description:
      `${preciosDeLaEscalera({ separador: "puntos" })} Bs/mes. ${PRUEBA.dias} días gratis sin tarjeta, sin permanencia.`,
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
      // Los tres montos estaban tipeados a mano acá —"320", "750", "1500"—
      // treinta y cinco líneas debajo de la `description` que YA los leía de
      // la tabla. El gate de precios no los veía porque busca el número
      // pegado a «Bs» o suelto entre etiquetas, y en el JSON-LD el precio
      // viaja desnudo y fuera del JSX, con la moneda en otra clave. Google
      // saca de acá el precio que publica: un plan que cambie dejaba al
      // buscador anunciando el viejo, que es la forma exacta del desastre de
      // los cuatro precios vivos. Misma corrección que en `v1/page.tsx`.
      offers: PLANES.map((p) => ({
        "@type": "Offer",
        name: p.nombre,
        price: String(p.mensual),
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
                {/* Ni la cantidad ni los saltos se tipean: los dos salen de la escalera. Decía
                    "Tres planes — ordenar, recuperar, crecer sin techo" y la escalera C sumó un
                    cuarto salto, así que la bajada contaba un plan menos de los que se ven. */}
                Son {cuantosPlanes()} planes que se distinguen por el salto de
                valor — {saltosDeLaEscalera()}. Cada uno dice exactamente qué
                lleva y qué no, con los números que el sistema aplica de verdad:
                usuarios, fichas de clientes y recordatorios. Pagás por
                adelantado el ciclo que elijas y no renovás cuando quieras: sin
                permanencia y sin penalidad.
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
                — con el precio público de cada uno y su fecha de consulta.
                ¿Preferís tocarlo antes que leer?{" "}
                <a href="/prueba-gratis">Probalo gratis {PRUEBA.dias} días</a>.
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
