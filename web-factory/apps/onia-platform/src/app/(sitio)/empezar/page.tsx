import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { REGISTRO_URL } from "../nav";
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
 * Cerrado 2026-08-21: Veterinaria se saco de toda la web. Sergio: "aun no
 * terminemos los que ya tenemos". El sitio vende los CINCO que el registro
 * entrega (dental, comercio, importadora, estetica, servicios) — vender un
 * sexto que el alta no puede dar es perder al lead en el ultimo clic.
 */

export const metadata: Metadata = {
  title: `Prueba gratis de ${PRUEBA.dias} días — Onia, sin tarjeta`,
  description: `Registrate en minutos, elegí tu rubro y usá el sistema completo ${PRUEBA.dias} días: agenda, clientes, caja, inventario, contabilidad Bolivia y agentes con IA. Sin tarjeta y sin permanencia.`,
  alternates: { canonical: "/empezar" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: `Probá Onia gratis ${PRUEBA.dias} días`,
    description:
      "Sistema completo, sin tarjeta. Elegís tu rubro y quedás andando en un día.",
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
      "Onia se arma para el tuyo: pantallas, vocabulario y agentes a tu medida. El rubro se elige en la primera pantalla del registro.",
  },
  {
    titulo: "Tu cuenta queda lista",
    detalle:
      "Sin instalación ni proyecto de meses. Le das el nombre de tu negocio y el sistema busca y carga tus datos.",
  },
  {
    titulo: `Usalo de verdad ${PRUEBA.dias} días`,
    detalle:
      "Todo encendido: agenda, caja, inventario, contabilidad y la cola de agentes. Si te sirve, pagás por QR; si no, no pagás nada.",
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
                Creá tu cuenta y usala <em>de verdad</em> {PRUEBA.dias} días.
              </h1>
              <p className={s.lead}>
                No es una demo recortada: es tu cuenta real, con todos los
                módulos encendidos. Si al final no te sirve, no pagás nada — y
                tus datos los exportás cuando quieras.
              </p>
              <div className={s.actions}>
                <Btn href={REGISTRO_URL}>Crear mi cuenta gratis</Btn>
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
            <Shape tone="green" ratio="4 / 3" tag="Tu cuenta" />
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
            Al vencer, la cuenta queda en solo lectura. No se borra nada.
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
            Creá tu cuenta. Sin tarjeta.
          </h2>
          <div className={s.actions}>
            <Btn href={REGISTRO_URL}>Crear mi cuenta gratis</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Hablar por WhatsApp
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
