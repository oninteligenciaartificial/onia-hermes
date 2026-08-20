import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal, SplitTextReveal } from "@/motion";
import { CUIDADO_WEB, WEB_STACKS, precioWeb } from "@/content/webs";
import { PedirWeb } from "./PedirWeb";
import styles from "./webs.module.css";

const SITE_URL = "https://onia.com.bo";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Webs para tu negocio — landing, web profesional y tienda | Onia",
  description:
    "Landing de captación Bs 790, Web Profesional Bs 1.500 y Web Pro Onia Bs 2.900, pago único. Qué lleva cada una, qué no lleva y qué tenés que poner vos — publicado antes de que compres. Dominio y hosting a tu nombre.",
  alternates: { canonical: "/servicios/webs" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Webs para tu negocio — precios y requisitos publicados",
    description:
      "Landing Bs 790 · Web Profesional Bs 1.500 · Web Pro Onia Bs 2.900. Con lo que no incluye y lo que ponés vos, dicho de frente.",
    url: "/servicios/webs",
  },
};

/**
 * /servicios/webs — los stacks de web con lo que lleva cada uno, lo que NO
 * lleva y lo que tiene que poner el cliente, más el bloque de requisitos en el
 * punto de compra. Los montos viven en src/content/webs.ts (verificados contra
 * el catálogo de precios y el cotizador de vendedores); esta página no conoce
 * números salvo para el JSON-LD.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Webs", item: `${SITE_URL}/servicios/webs` },
      ],
    },
    {
      "@type": "Service",
      name: "Diseño y desarrollo de sitios web",
      serviceType: "Diseño web para negocios",
      description:
        "Landing de captación, web profesional, web con dirección de arte a medida y tienda con pedido por WhatsApp. Dominio y hosting a nombre del cliente.",
      provider: { "@type": "Organization", name: "Onia", url: `${SITE_URL}/` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      url: `${SITE_URL}/servicios/webs`,
      offers: WEB_STACKS.filter((s) => s.precio !== null).map((s) => ({
        "@type": "Offer",
        name: s.nombre,
        price: String(s.precio),
        priceCurrency: "BOB",
        category: "Pago único",
        availability: "https://schema.org/InStock",
      })),
    },
  ],
};

export default function WebsPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <p className="kicker">Servicios · Webs</p>
            <h1 className="h2">
              Tu web, con el precio y los requisitos publicados antes de
              comprar.
            </h1>
            <p className="lead">
              Cuatro stacks, del más simple al más completo. De cada uno decimos
              qué lleva, qué NO lleva y qué tenés que poner vos — porque una web
              se atrasa por el contenido, casi nunca por el diseño. El dominio y
              el hosting van siempre a tu nombre.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "1.5rem" }}>
          <div className="container">
            <Reveal>
              <span className="kicker">Los stacks</span>
            </Reveal>
            <SplitTextReveal
              as="h2"
              className="h2"
              text="Elegís por el problema que tenés, no por cuántas páginas son."
            />

            <div className={styles.stacks}>
              {WEB_STACKS.map((stack) => (
                <Reveal
                  key={stack.id}
                  className={`${styles.stack} ${stack.destacado ? styles.stackFeat : ""}`}
                >
                  <h3 className={styles.stackNombre}>{stack.nombre}</h3>
                  <p className={styles.stackPrecio}>{precioWeb(stack)}</p>
                  <p className={styles.stackLinea}>
                    <strong>Para quién es.</strong> {stack.paraQuien}
                  </p>
                  <p className={styles.stackLinea}>
                    <strong>Qué resuelve.</strong> {stack.resuelve}
                  </p>

                  <p className={styles.stackTitulo}>Qué incluye</p>
                  <ul className={styles.lista}>
                    {stack.incluye.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className={styles.stackTitulo}>Qué NO incluye</p>
                  <ul className={styles.lista}>
                    {stack.noIncluye.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className={styles.stackTitulo}>Qué necesitás vos</p>
                  <ul className={styles.lista}>
                    {stack.necesitasVos.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className={styles.stackMensual}>{stack.mensual}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container prose">
            <h2 className="h3">
              Después de publicarla: Cuidado Web
            </h2>
            <p className="lead" style={{ marginTop: "0.6rem" }}>
              Una web que nadie toca envejece. El mensual es opcional y lo
              elegís vos. No incluye un panel para que edites: los cambios los
              hacemos nosotros, y cuántos entran por mes queda escrito en tu
              propuesta antes de arrancar.
            </p>
            <div className={styles.cuidado}>
              {CUIDADO_WEB.map((plan) => (
                <div key={plan.nombre} className={styles.cuidadoItem}>
                  <p className={styles.cuidadoPrecio}>
                    Bs {plan.mensual.toLocaleString("es-BO")}
                    <span style={{ fontSize: "0.85rem", fontWeight: 400 }}>
                      {" "}
                      /mes
                    </span>
                  </p>
                  <p style={{ fontWeight: 700, marginTop: "0.3rem" }}>
                    {plan.nombre}
                  </p>
                  <p className={styles.stackLinea} style={{ marginTop: "0.3rem" }}>
                    {plan.que}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-tight">
          <div className="container prose">
            <PedirWeb />
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
