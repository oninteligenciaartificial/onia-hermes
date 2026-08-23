import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { CUIDADO_WEB, WEB_STACKS, precioWeb } from "@/content/webs";
import { SITE_URL } from "@/lib/site";
import { EMPEZAR_URL } from "../../nav";
import { Block, Btn, Kicker, JsonLd } from "../../ui";
import s from "../../sitio.module.css";
import { PedirWeb } from "./PedirWeb";
import styles from "./webs.module.css";

/**
 * /servicios/webs — los stacks de web con lo que lleva cada uno, lo que NO
 * lleva y lo que tiene que poner el cliente, más el bloque de requisitos en el
 * punto de compra.
 *
 * VIVE DENTRO DE `(sitio)` desde 2026-08-23. El add-on "Web del negocio" de
 * /precios manda acá (lib/pricing.ts → ADDONS), y hasta hoy esta página colgaba
 * del cromo v1: el lector salía de la v3, aterrizaba en otra maqueta y perdía
 * el camino de vuelta a /precios y al CTA. La URL no cambió — el grupo de rutas
 * no sale en la ruta —, así que el sitemap, el canonical y el enlace de
 * pricing.ts siguen igual.
 *
 * Los montos viven en src/content/webs.ts (ratificados 2026-08-23:
 * 2.000 / 4.500 / desde 7.500). Esta página NO escribe un número a mano, ni
 * siquiera en el meta description: la línea de precios se deriva de WEB_STACKS.
 * La descripción anterior seguía anunciando 790/1.500/2.900 — la oferta de
 * arranque vencida el 31-jul-2026 —, o sea que en Google el sitio publicaba un
 * precio que nadie cobraba.
 */
const LINEA_PRECIOS = WEB_STACKS.flatMap((stack) =>
  stack.precio === null
    ? []
    : [`${stack.nombre} Bs ${stack.precio.toLocaleString("es-BO")}`],
).join(" · ");

export const metadata: Metadata = {
  title: "Webs para tu negocio — landing, web profesional y tienda | Onia",
  description: `${LINEA_PRECIOS}, pago único. Qué lleva cada una, qué no lleva y qué tenés que poner vos — publicado antes de que compres. Dominio y hosting a tu nombre.`,
  alternates: { canonical: "/servicios/webs" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Webs para tu negocio — precios y requisitos publicados",
    description: `${LINEA_PRECIOS}. Con lo que no incluye y lo que ponés vos, dicho de frente.`,
    url: "/servicios/webs",
  },
};

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
      offers: WEB_STACKS.filter((stack) => stack.precio !== null).map((stack) => ({
        "@type": "Offer",
        name: stack.nombre,
        price: String(stack.precio),
        priceCurrency: "BOB",
        category: "Pago único",
        availability: "https://schema.org/InStock",
      })),
    },
  ],
};

export default function Webs() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <Block surface="paper">
        <Reveal>
          <Kicker>Servicios · Webs</Kicker>
          <h1 className={s.display}>
            Tu web, con el precio y los requisitos <em>publicados</em> antes de
            comprar.
          </h1>
          <p className={s.lead}>
            Cuatro stacks, del más simple al más completo. De cada uno decimos
            qué lleva, qué NO lleva y qué tenés que poner vos — porque una web
            se atrasa por el contenido, casi nunca por el diseño. El dominio y
            el hosting van siempre a tu nombre.
          </p>
        </Reveal>
      </Block>

      {/* Los stacks. La grilla es propia y no la `.plans` de la v3: son CUATRO
          tarjetas y la de precios es de tres columnas — el cuarto quedaba
          huérfano. */}
      <Block surface="paperDim" labelledBy="stacks">
        <Reveal>
          <Kicker>Los stacks</Kicker>
          <h2 id="stacks" className={s.h2}>
            Elegís por el problema que tenés, no por cuántas páginas son.
          </h2>
        </Reveal>
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
      </Block>

      <Block surface="paper" labelledBy="cuidado">
        <Reveal>
          <Kicker>Después de publicarla</Kicker>
          <h2 id="cuidado" className={s.h2}>
            Cuidado Web.
          </h2>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            Una web que nadie toca envejece. El mensual es opcional y lo elegís
            vos. No incluye un panel para que edites: los cambios los hacemos
            nosotros, y cuántos entran por mes queda escrito en tu propuesta
            antes de arrancar.
          </p>
          <div className={styles.cuidado}>
            {CUIDADO_WEB.map((plan) => (
              <div key={plan.nombre} className={styles.cuidadoItem}>
                <p className={styles.cuidadoPrecio}>
                  Bs {plan.mensual.toLocaleString("es-BO")}
                  <span className={s.planUnit}> /mes</span>
                </p>
                <p className={styles.stackLinea} style={{ marginTop: "0.3rem" }}>
                  <strong>{plan.nombre}.</strong> {plan.que}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* `Reveal` SOLO sobre el titular. Envolviendo también a <PedirWeb /> el
          bloque quedaba INVISIBLE en teléfono: `viewportOnce` es
          `amount: 0.3`, así que un Reveal más alto que ~3,3 pantallas nunca
          llega al 30% visible y se queda en opacity 0 para siempre. El punto de
          compra entero (picker + requisitos) mide unos 5.000px a 390 de ancho.
          Visto renderizado con Playwright a 390x844. */}
      <Block surface="paperDim" labelledBy="pedir">
        <Reveal>
          <Kicker>Pedila</Kicker>
          <h2 id="pedir" className={s.h2}>
            ¿Cuál querés?
          </h2>
        </Reveal>
        <PedirWeb />
      </Block>

      {/* Camino de vuelta: la web es un add-on del sistema, no una isla. Antes
          esta página terminaba en el pie viejo y no había regreso a /precios. */}
      <Block surface="signal" labelledBy="volver">
        <Reveal>
          <h2 id="volver" className={s.display} style={{ maxWidth: "20ch" }}>
            La web trae al cliente. El sistema lo atiende.
          </h2>
          <div className={s.actions}>
            <Btn href="/precios">Ver precios del sistema</Btn>
            <Btn href={EMPEZAR_URL} variant="line">
              Probá gratis
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
