import type { Metadata } from "next";
import { Entrada, Reveal } from "@/motion";
import { WEB_STACKS } from "@/content/webs";
import { SITE_URL } from "@/lib/site";
import { EMPEZAR_URL } from "../../nav";
import { CTA_ALTA } from "../../alta";
import { Block, Btn, Kicker, JsonLd } from "../../ui";
import s from "../../sitio.module.css";
import { WebConfigurator } from "@/components/web-configurator/WebConfigurator";
import { Especificaciones } from "./Especificaciones";

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
        "Landing de captación, web profesional, web con dirección de arte a medida, tienda con pedido por WhatsApp y ecommerce sobre Shopify, Hotmart o Whop. Dominio y hosting a nombre del cliente.",
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
        <Entrada>
          <Kicker>Servicios · Webs</Kicker>
          <h1 className={s.display}>
            Ves tu web antes de dejar <em>un solo dato</em>.
          </h1>
          <p className={s.lead}>
            Una frase sobre tu negocio, o cuatro respuestas, y el preview se arma
            con tu nombre, tu rubro y tus colores; nada se guarda hasta que la
            pedís. De cada alcance decimos qué lleva, qué NO lleva y qué tenés
            que poner vos, en «Más información» — porque una web se atrasa por
            el contenido, casi nunca por el diseño. El precio está publicado y el
            dominio y el hosting van siempre a tu nombre.
          </p>
        </Entrada>
      </Block>

      {/* `Reveal` SOLO sobre el titular. Envolviendo también al configurador
          el bloque quedaba INVISIBLE en teléfono: `viewportOnce` es
          `amount: 0.3`, así que un Reveal más alto que ~3,3 pantallas nunca
          llega al 30% visible y se queda en opacity 0 para siempre. El punto de
          compra entero (configurador + requisitos) mide varias pantallas a 390
          de ancho. Visto renderizado con Playwright a 390x844.
          El configurador reemplaza a <PedirWeb /> desde 2026-09-17: alcance,
          preview en vivo, extras y requisitos en un solo recorrido, y la
          selección viaja escrita en el mensaje de WhatsApp. Las tarjetas con
          las especificaciones exactas («Los stacks» + Cuidado Web) viven en su
          pestaña «Más información» (Sergio Urcullo, mismo día: «solo quiero
          el configurador; la otra que salga de una pestaña»). */}
      <Block surface="paperDim" labelledBy="pedir">
        <Reveal>
          <Kicker>Pedila</Kicker>
          <h2 id="pedir" className={s.h2}>
            ¿Cuál querés?
          </h2>
        </Reveal>
        <WebConfigurator especificaciones={<Especificaciones />} />
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
              {CTA_ALTA}
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
