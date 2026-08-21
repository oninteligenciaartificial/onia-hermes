import type { Metadata } from "next";
import { Reveal } from "@/motion";
import {
  SIAT_TITULAR,
  SIAT_BAJADA,
  SIAT_BLOQUES,
  SIAT_FAQ,
  SIAT_FUENTES,
} from "@/lib/siat";
import { WA_URL_LANDING } from "@/lib/site";
import { Block, Btn, Kicker } from "../ui";
import s from "../sitio.module.css";

/**
 * /preview/facturacion — con el 1-oct-2026 encima, "¿y la factura?" decide la
 * compra en Bolivia. El contenido NO se redactó acá: es el mismo que ya vive
 * en /funciones/facturacion-electronica-siat, movido a lib/siat.ts para que
 * las dos páginas lean la misma ley (una norma copiada en dos lugares dice dos
 * cosas distintas en seis meses).
 *
 * La nota fiscal honesta —emisor en trámite de homologación, y mientras tanto
 * facturás en el Portal del SIN que es gratuito— SE MANTIENE y va en su propio
 * bloque. Es la excepción explícita a "la venta nunca exhibe obra": acá no es
 * marketing, es honestidad legal tributaria. Decirlo antes de que lo descubran
 * es lo que hace creíble todo lo demás.
 */

export const metadata: Metadata = {
  title: "Facturación SIAT — preview del rediseño",
};

/* Los tres bloques del argumento, en el orden de la fuente:
   1) podés cumplir gratis · 2) qué resuelve un sistema · 3) dónde está Onia. */
const [GRATIS, RETIPEO, DONDE_ESTA] = SIAT_BLOQUES;

export default function PreviewFacturacion() {
  return (
    <>
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
        </Reveal>
      </Block>

      {/* 2 · Qué resuelve un sistema */}
      <Block surface="ink" labelledBy="retipeo">
        <Reveal>
          <Kicker>Qué resuelve un sistema</Kicker>
          <h2 id="retipeo" className={s.h2}>
            {RETIPEO.titulo}
          </h2>
          <p className={s.body} style={{ fontSize: "1.1em", maxWidth: "50em" }}>
            {RETIPEO.texto}
          </p>
        </Reveal>
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
            Dejá tu operación lista antes del plazo.
          </h2>
          <div className={s.actions}>
            <Btn href="/empezar">Empezá gratis</Btn>
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
