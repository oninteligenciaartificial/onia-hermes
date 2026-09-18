import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PRUEBA, ALCANCE_CON_AGENDA } from "@/lib/pricing";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { MEDIO_DE_PAGO } from "@/content/medio-de-pago";
import { REGISTRO_URL } from "../nav";
import { CTA_ALTA } from "../alta";
import { Block, Shape, Btn, Kicker, JsonLd } from "../ui";
import s from "../sitio.module.css";

/**
 * /empezar — la pantalla de ARRANQUE del sitio.
 *
 * Hereda el embudo de la vieja `/prueba-gratis`, que ya no existe como página:
 * esa URL circula en firmas, anuncios y enlaces externos, así que redirige acá
 * con 308 (next.config.ts). El ÚNICO salto hacia afuera es el que tiene que
 * serlo — el registro real del producto (app.onia.com.bo/register).
 *
 * Los tres pasos son el texto ya escrito y publicado en /prueba-gratis; no se
 * redactó nada nuevo. Tampoco se enumeran rubros acá: el rubro se elige en la
 * primera pantalla del registro, que es la verdad.
 *
 * El verbo del alta NO se escribe aca: sale de `../alta`, que es el espejo de
 * ONIA_ALTA_AUTOMATICA. Esta pagina ya vivio las dos ramas — el 21-ago Sergio
 * cerro el alta y se reescribio a "Pedi tu acceso"; el 29-ago se reabrio y el
 * texto quedo atras. Prometer un alta que el producto no da pierde al lead en el
 * ultimo clic, y PEDIR permiso cuando el producto ya lo da, tambien. La prueba
 * de 14 dias es cierta en las dos ramas.
 *
 * Cerrado 2026-08-21: Veterinaria se saco de toda la web. Sergio: "aun no
 * terminemos los que ya tenemos". El sitio vende los CINCO que el registro
 * entrega (dental, comercio, importadora, estetica, servicios) — vender un
 * sexto que el alta no puede dar es perder al lead en el ultimo clic.
 */

export const metadata: Metadata = {
  title: `Prueba gratis de ${PRUEBA.dias} días — Onia, sin tarjeta`,
  description: `${CTA_ALTA}, elegí tu rubro y usá el plan ${PRUEBA.planQueCorre} completo ${PRUEBA.dias} días: clientes, caja, inventario, contabilidad Bolivia y agentes con IA —y agenda ${ALCANCE_CON_AGENDA}—. Sin tarjeta y sin permanencia.`,
  alternates: { canonical: "/empezar" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: `Probá Onia gratis ${PRUEBA.dias} días`,
    // El plan se DERIVA: «Sistema completo» nombraba sin querer el plan de
    // arriba (Bs 1.290), y esto es lo que se pinta en el preview de WhatsApp,
    // antes de que el lead abra la página.
    description: `El plan ${PRUEBA.planQueCorre} completo, sin tarjeta. Elegís tu rubro y te lo entregamos configurado.`,
    url: "/empezar",
  },
};

/** Breadcrumb + Offer del trial: venían de /prueba-gratis, con la ruta nueva. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Empezar", item: `${SITE_URL}/empezar` },
      ],
    },
    {
      "@type": "Offer",
      name: `Prueba gratis de ${PRUEBA.dias} días de Onia`,
      price: "0",
      priceCurrency: "BOB",
      url: `${SITE_URL}/empezar`,
      availability: "https://schema.org/InStock",
    },
  ],
};

/** Copiado tal cual de la vieja /prueba-gratis (PASOS). */
const PASOS: readonly { titulo: string; detalle: string }[] = [
  {
    titulo: "Elegí tu rubro",
    detalle:
      "Onia se arma para el tuyo: pantallas, vocabulario y agentes a tu medida. El rubro lo elegís en el primer paso del registro.",
  },
  {
    titulo: "Te la entregamos configurada",
    // Acá decía «y alguien que te la explica». No hay ese alguien: el alta es
    // automática, no agenda ni avisa a nadie, y a Onia la vende Sergio Urcullo
    // solo. Lo que SÍ ocurre es que la cuenta llega armada para el rubro y el
    // sistema guía la puesta en marcha; el WhatsApp queda como salida real.
    detalle:
      "Sin instalación ni proyecto de meses: la cuenta llega con la configuración de tu rubro puesta y el sistema te guía la puesta en marcha paso a paso.",
  },
  {
    titulo: `Usalo de verdad ${PRUEBA.dias} días`,
    // El medio de pago lo dice `@/content/medio-de-pago`, no esta pantalla: acá
    // decía «pagás por QR» y no existe ningún QR.
    detalle: `Todo encendido: caja, inventario, contabilidad, la cola de agentes y la agenda ${ALCANCE_CON_AGENDA}. ${MEDIO_DE_PAGO.siTeSirve}`,
  },
];

export default function Empezar() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <Block surface="paper">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Empezá</Kicker>
              <h1 className={s.display}>
                {CTA_ALTA} y usalo <em>de verdad</em> {PRUEBA.dias} días.
              </h1>
              {/* Acá decía «con todos los módulos encendidos». La prueba corre
                  con PRUEBA.planQueCorre, que NO los enciende todos: el
                  chatbot de WhatsApp y el segundo administrador los trae el
                  plan de arriba. Se nombra el plan —la misma forma que usa
                  PRUEBA.copy— en vez de cuantificar las partes. */}
              <p className={s.lead}>
                No es una demo recortada: es tu cuenta real, con el plan{" "}
                {PRUEBA.planQueCorre} completo. Si al final no te sirve, no
                pagás nada — y tus datos los exportás cuando quieras.
              </p>
              <div className={s.actions}>
                <Btn href={REGISTRO_URL}>{CTA_ALTA}</Btn>
                <Btn href="/contacto" variant="line">
                  Prefiero hablar antes
                </Btn>
              </div>
              <p className={s.note} style={{ marginTop: "1.2em" }}>
                Sin tarjeta · sin implementación · tus datos se exportan en CSV
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {/* "Tu cuenta", dibujada. Antes acá iba panel.webp, el panel real
                de una ferretería con sus montos del día: Sergio, 2026-09-01,
                textual —"no coloques capturas literales del sistema, se ve
                mal, coloca cosas referenciales". El panel muestra lo que el
                copy de al lado promete —los módulos ya encendidos— sin atar
                la pieza a las cifras de un negocio que no existe. */}
            <Shape tone="green" panel="cuenta" />
          </Reveal>
        </div>
      </Block>

      {/* Los tres pasos */}
      <Block surface="paperDim" labelledBy="camino">
        <Reveal>
          <Kicker>El camino</Kicker>
          <h2 id="camino" className={s.h2}>
            Tres pasos, y el tercero ya es tu negocio adentro.
          </h2>
          <div className={s.cells}>
            {PASOS.map((paso, i) => (
              <div key={paso.titulo} className={s.cell}>
                <h3 className={s.h3}>
                  <span className={s.mono} style={{ opacity: 0.55 }}>
                    0{i + 1}
                  </span>{" "}
                  {paso.titulo}
                </h3>
                <p>{paso.detalle}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Qué pasa al día 15 — la letra chica, dicha fuerte */}
      <Block surface="ink" labelledBy="al-final">
        <Reveal>
          <Kicker>Cuando se termina</Kicker>
          <p id="al-final" className={s.h2} style={{ maxWidth: "24ch" }}>
            Al vencer, la cuenta queda en solo lectura. Nada se borra de
            inmediato.
          </p>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            {PRUEBA.copy}
          </p>
          <div className={s.actions}>
            <a className={s.link} href="/precios">
              Ver los precios antes de entrar →
            </a>
          </div>
        </Reveal>
      </Block>

      {/* Cierre */}
      <Block surface="signal" labelledBy="cierre-empezar">
        <Reveal>
          <h2 id="cierre-empezar" className={s.display} style={{ maxWidth: "16ch" }}>
            {CTA_ALTA}. Sin tarjeta.
          </h2>
          <div className={s.actions}>
            <Btn href={REGISTRO_URL}>{CTA_ALTA}</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Hablar por WhatsApp
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
