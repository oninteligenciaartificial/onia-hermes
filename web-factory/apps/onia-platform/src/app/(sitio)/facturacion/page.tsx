import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/motion";
import {
  SIAT_TITULAR,
  SIAT_BAJADA,
  SIAT_BLOQUES,
  SIAT_FAQ,
  SIAT_FUENTES,
} from "@/lib/siat";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { Block, Btn, Kicker, JsonLd } from "../ui";
import { CTA_ALTA } from "../alta";
import { EMPEZAR_URL } from "../nav";
import s from "../sitio.module.css";

/**
 * /facturacion — con el 1-oct-2026 encima, "¿y la factura?" decide la
 * compra en Bolivia. El contenido NO se redactó acá: vive en lib/siat.ts, que
 * era la fuente compartida con la vieja /funciones/facturacion-electronica-siat.
 * Esa URL ya no existe: redirige acá con 308 (next.config.ts) para no partir en
 * dos el posicionamiento de la búsqueda del plazo, que es la más valiosa del
 * sitio.
 *
 * La nota fiscal honesta —emisor en trámite de homologación, y mientras tanto
 * facturás en el Portal del SIN que es gratuito— SE MANTIENE y va en su propio
 * bloque. Es la excepción explícita a "la venta nunca exhibe obra": acá no es
 * marketing, es honestidad legal tributaria. Decirlo antes de que lo descubran
 * es lo que hace creíble todo lo demás.
 */

export const metadata: Metadata = {
  title:
    "Facturación en línea obligatoria en Bolivia: qué exige el SIN desde el 1 de octubre de 2026",
  description:
    "Los grupos 9° al 12° de contribuyentes deben emitir por facturación en línea desde el 01-10-2026 (RND 102600000007). Qué significa, las opciones que tenés — incluido el portal gratuito del SIN — y cómo saber tu grupo.",
  alternates: { canonical: "/facturacion" },
  openGraph: {
    type: "article",
    locale: "es_BO",
    title: "Facturación en línea obligatoria: lo que cambia el 1 de octubre de 2026",
    description:
      "La guía honesta: qué exige el SIN, quiénes están alcanzados y las opciones reales — incluida la gratuita.",
    url: "/facturacion",
  },
};

/**
 * Breadcrumb + Article + FAQPage: los tres venían de
 * /funciones/facturacion-electronica-siat. La URL cambia; el marcado se
 * conserva entero, apuntando a la ruta nueva.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Facturación electrónica SIAT",
          item: `${SITE_URL}/facturacion`,
        },
      ],
    },
    {
      "@type": "Article",
      headline:
        "Facturación en línea obligatoria en Bolivia: lo que cambia el 1 de octubre de 2026",
      inLanguage: "es-BO",
      datePublished: "2026-08-07",
      author: { "@type": "Organization", name: "Onia" },
      url: `${SITE_URL}/facturacion`,
    },
    {
      "@type": "FAQPage",
      mainEntity: SIAT_FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

/* Los tres bloques del argumento, en el orden de la fuente:
   1) podés cumplir gratis · 2) qué resuelve un sistema · 3) dónde está Onia. */
const [GRATIS, RETIPEO, DONDE_ESTA] = SIAT_BLOQUES;

export default function Facturacion() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <Block surface="paper">
        <Reveal>
          <Kicker>Facturación electrónica · SIAT</Kicker>
          <h1 className={s.display} style={{ maxWidth: "20ch" }}>
            {SIAT_TITULAR}
          </h1>
          <p className={s.lead}>{SIAT_BAJADA}</p>
        </Reveal>
      </Block>

      {/* 1 · La opción gratuita, primero y en el bloque más fuerte */}
      <Block surface="signal" labelledBy="gratis">
        <Reveal>
          <Kicker>Antes que nada</Kicker>
          <p id="gratis" className={s.h2} style={{ maxWidth: "22ch" }}>
            {GRATIS.titulo}
          </p>
          <p className={s.body} style={{ fontSize: "1.1em", maxWidth: "50em" }}>
            {GRATIS.texto}
          </p>
          {/* La pregunta que aparece justo acá es «¿y cómo me habilito?», y
              esta página no la responde: responde QUÉ EXIGE la norma. El
              paso a paso vive en /guia-facturacion. Enlace cruzado en las
              dos direcciones, canonical propio en cada una. */}
          <div className={s.actions}>
            <a className={s.link} href="/guia-facturacion">
              Cómo habilitarte gratis, en 6 pasos →
            </a>
          </div>
        </Reveal>
      </Block>

      {/* 2 · Qué resuelve Onia mientras el emisor sigue en homologación.
          La foto es de CONTEXTO (una contadora de noche con el
          archivador de papel), no de producto, y NO agrega ni una sola
          afirmación fiscal: el texto sigue saliendo entero de lib/siat.ts y
          la nota honesta del bloque 3 queda intacta. El alt describe la
          escena y no dice que sea cliente de Onia. Reglas:
          hermes-content/docs/ONIA_WEB_IMAGENES_DE_CONTEXTO.md */}
      <Block surface="ink" labelledBy="retipeo">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Qué resuelve un sistema</Kicker>
              <h2 id="retipeo" className={s.h2}>
                {RETIPEO.titulo}
              </h2>
              <p className={s.body} style={{ fontSize: "1.1em" }}>
                {RETIPEO.texto}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {/* Ratio nativo de la foto (1280×1078): así no se recorta nada. */}
            <div
              className={s.foto}
              style={{ "--foto-ratio": "640 / 539" } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin sharp: next/image no optimiza en el VPS */}
              <img
                src="/contexto/servicios.webp"
                alt="Contadora trabajando de noche en su escritorio, con un archivador de palanca abierto, una calculadora y una lámpara encendida."
                width={1280}
                height={1078}
                loading="lazy"
                decoding="async"
                className={s.fotoImg}
              />
            </div>
          </Reveal>
        </div>
      </Block>

      {/* 3 · Dónde está Onia — la nota fiscal honesta, sin maquillar */}
      <Block surface="paper" labelledBy="donde">
        <Reveal>
          <Kicker>De frente</Kicker>
          <h2 id="donde" className={s.h2}>
            {DONDE_ESTA.titulo}
          </h2>
          <p className={s.body} style={{ fontSize: "1.1em", maxWidth: "50em" }}>
            {DONDE_ESTA.texto}
          </p>
        </Reveal>
      </Block>

      {/* FAQ normativa */}
      <Block surface="paperDim" labelledBy="faq-siat">
        <Reveal>
          <Kicker>Preguntas frecuentes</Kicker>
          <h2 id="faq-siat" className={s.h2}>
            Las preguntas que todos hacen.
          </h2>
          <div className={s.faq}>
            {SIAT_FAQ.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary className={s.faqQ}>{item.q}</summary>
                <p className={s.faqA}>{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Cierre + fuentes */}
      <Block surface="green" labelledBy="cierre-siat">
        <Reveal>
          <h2 id="cierre-siat" className={s.h2} style={{ maxWidth: "20ch" }}>
            Tené tus ventas y compras ordenadas.
          </h2>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Preguntanos tu caso por WhatsApp
            </Btn>
          </div>
          <p className={s.note} style={{ marginTop: "2.4em" }}>
            {SIAT_FUENTES}
          </p>
        </Reveal>
      </Block>
    </>
  );
}
