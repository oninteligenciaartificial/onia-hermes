import type { Metadata } from "next";
import { Entrada, Reveal } from "@/motion";
import {
  SIAT_GUIA_KICKER,
  SIAT_GUIA_TITULAR,
  SIAT_GUIA_BAJADA,
  SIAT_GUIA_PASO_0,
  SIAT_GUIA_PASOS,
  SIAT_GUIA_A_MANO,
  SIAT_GUIA_FRENA,
  SIAT_GUIA_CIERRE,
  SIAT_GUIA_ENLACES,
  SIAT_FUENTES,
} from "@/lib/siat";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { Block, Btn, Kicker, JsonLd } from "../ui";
import { CapturaGuia } from "./CapturaGuia";
import s from "../sitio.module.css";
import g from "./guia.module.css";

/**
 * /guia-facturacion — el lead magnet: la guía de una página.
 *
 * Es la hermana de `/facturacion`, y son DOS intenciones distintas a
 * propósito: aquella responde QUÉ EXIGE la norma; esta responde CÓMO ME
 * HABILITO. La segunda es la pregunta que aparece después de leer la primera,
 * y hoy no está en ningún lado en una sola hoja.
 *
 * El texto NO se redactó acá: sale entero de `lib/siat.ts`, que ya era la
 * fuente única del contenido fiscal. Si el SIN mueve la fecha por tercera vez
 * se corrige ese archivo y las dos páginas se enteran solas.
 *
 * Esto de arriba era FALSO hasta el 2026-09-17 y por eso ahora tiene un gate:
 * el Kicker del hero tenía la fecha escrita a mano y decía `Plazo · 30-09-2026`
 * mientras la bajada, dos líneas abajo, decía «el 1 de octubre» — el lead leía
 * la contradicción en la misma pantalla. Era el único texto de plazo de las dos
 * páginas que no venía de `lib/siat.ts`, justo el que las encabeza. Lo vigila
 * `(sitio)/plazo-no-se-tipea.test.ts`, sobre TODAS las `page.tsx` del disco.
 *
 * La guía se lee SIN dejar nada: es indexable y ese es medio punto del
 * ejercicio. El correo compra la HOJA IMPRIMIBLE (esta misma página con
 * @media print) y el aviso de cambio de fecha. Content upgrade, no muro.
 *
 * Enlace cruzado obligatorio con `/facturacion` en las dos direcciones, y
 * canonical propio en cada una. Si el ranking de `/facturacion` cae —es la
 * búsqueda más valiosa del sitio— estas dos se fusionan.
 */

export const metadata: Metadata = {
  title:
    "Cómo habilitarte para facturar en línea, gratis: 6 pasos en la Oficina Virtual del SIN",
  description:
    "Guía de una página: cómo saber si te alcanza el plazo del 1 de octubre de 2026 y los 6 pasos para habilitarte en el Portal Web en Línea del SIN. El trámite es gratuito y no necesitás comprar ningún sistema.",
  alternates: { canonical: "/guia-facturacion" },
  openGraph: {
    type: "article",
    locale: "es_BO",
    title: "Habilitate para facturar en línea, gratis, en 6 pasos",
    description:
      "La hoja que te falta: paso 0 para saber si te toca, los 6 pasos del trámite y lo que hay que tener a mano antes de empezar.",
    url: "/guia-facturacion",
  },
};

/**
 * HowTo + Breadcrumb. `HowTo` es el marcado que le corresponde a esto y no lo
 * tiene ninguna otra página del sitio: son pasos ordenados de un trámite. El
 * `estimatedCost` en 0 no es adorno — es la afirmación central de la guía.
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
        {
          "@type": "ListItem",
          position: 3,
          name: "Cómo habilitarte, paso a paso",
          item: `${SITE_URL}/guia-facturacion`,
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "Cómo habilitarte para facturar en línea en el Portal Web en Línea del SIN",
      description: SIAT_GUIA_BAJADA,
      inLanguage: "es-BO",
      totalTime: "PT1H",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "BOB",
        value: "0",
      },
      supply: SIAT_GUIA_A_MANO.map((item) => ({
        "@type": "HowToSupply",
        name: item,
      })),
      step: SIAT_GUIA_PASOS.map((paso, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: paso.titulo,
        text: paso.detalle,
        url: `${SITE_URL}/guia-facturacion#paso-${i + 1}`,
      })),
    },
  ],
};

export default function GuiaFacturacion() {
  return (
    <>
      <JsonLd data={JSON_LD} />

      {/* ------------------------------------------------------------------
          1 · La captura. Una sola acción en esta pantalla: el correo.
          Sin botón secundario, sin "ver precios", sin nada que compita.
          En teléfono el formulario entra justo debajo de la bajada; en
          escritorio va al costado, y el titular no se cae de la primera vista.
      ------------------------------------------------------------------- */}
      <section className={`${g.heroBlock} ${g.noPrint}`}>
        <div className={g.heroInner}>
          <div className={g.hero}>
            <Entrada>
              <div>
                <Kicker>{SIAT_GUIA_KICKER}</Kicker>
                <h1 className={s.display} style={{ maxWidth: "14ch" }}>
                  {SIAT_GUIA_TITULAR}
                </h1>
                <p className={s.lead} style={{ maxWidth: "32em" }}>
                  {SIAT_GUIA_BAJADA}
                </p>
              </div>
            </Entrada>
            <Entrada delay={0.08}>
              <CapturaGuia />
            </Entrada>
          </div>
        </div>
      </section>

      {/* Encabezado que SOLO existe en el papel: al imprimir desaparecen el
          cromo del sitio y el formulario, y la hoja necesita decir qué es y de
          dónde salió. Es además el ancla del @media print: `body:has(.hoja)`
          acota las reglas de impresión a esta página y a ninguna otra. */}
      <div className={g.hoja} aria-hidden="true">
        <p className={g.hojaTitulo}>
          Facturación en línea 2026 — cómo habilitarte gratis, en 6 pasos
        </p>
        <p className={g.hojaFuente}>onia.com.bo/guia-facturacion</p>
      </div>

      {/* ------------------------------------------------------------------
          2 · Paso 0 — el que casi nadie hace. Va en el bloque más fuerte
          porque es el error caro: el grupo lo fija el NIT, no el rubro.
      ------------------------------------------------------------------- */}
      <Block surface="signal" labelledBy="paso-0">
        <Reveal>
          <div className={g.noPrint}>
            <Kicker>Antes de tocar nada</Kicker>
          </div>
          <h2 id="paso-0" className={s.h2} style={{ maxWidth: "20ch" }}>
            {SIAT_GUIA_PASO_0.titulo}
          </h2>
          <p className={s.body} style={{ fontSize: "1.1em", maxWidth: "48em" }}>
            {SIAT_GUIA_PASO_0.texto}
          </p>
        </Reveal>
      </Block>

      {/* ------------------------------------------------------------------
          3 · Los 6 pasos. Es la carne de la hoja: un libro mayor numerado,
          no seis tarjetas iguales. El número manda la lectura, el título
          dice la acción y el detalle dice la trampa.
      ------------------------------------------------------------------- */}
      <Block surface="paper" labelledBy="pasos">
        <Reveal>
          <div className={g.noPrint}>
            <Kicker>El trámite</Kicker>
          </div>
          <h2 id="pasos" className={s.h2} style={{ maxWidth: "22ch" }}>
            Seis pasos en la Oficina Virtual, en este orden.
          </h2>
        </Reveal>
        <ol className={g.pasos}>
          {SIAT_GUIA_PASOS.map((paso, i) => (
            <li className={g.paso} key={paso.titulo} id={`paso-${i + 1}`}>
              <span className={g.pasoNum} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={g.pasoTitulo}>{paso.titulo}</h3>
              <p className={g.pasoDetalle}>{paso.detalle}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* ------------------------------------------------------------------
          4 · Lo que hay que tener a mano. Cinco, y son cinco a propósito.
      ------------------------------------------------------------------- */}
      <Block surface="paperDim" labelledBy="a-mano">
        <Reveal>
          <div className={g.noPrint}>
            <Kicker>Antes de empezar</Kicker>
          </div>
          <h2 id="a-mano" className={s.h2} style={{ maxWidth: "20ch" }}>
            Tené esto sobre la mesa.
          </h2>
          <ul className={g.aMano}>
            {SIAT_GUIA_A_MANO.map((item) => (
              <li className={g.aManoItem} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Block>

      {/* ------------------------------------------------------------------
          5 · Lo que frena. Sale de los pasos de arriba, no de estadísticas:
          no tenemos una muestra de negocios habilitados y no se inventa una.
      ------------------------------------------------------------------- */}
      <Block surface="ink" labelledBy="frena">
        <Reveal>
          <div className={g.noPrint}>
            <Kicker>Lo que te frena</Kicker>
          </div>
          <h2 id="frena" className={s.h2} style={{ maxWidth: "22ch" }}>
            Las tres formas de no llegar.
          </h2>
          <ul className={g.frena}>
            {SIAT_GUIA_FRENA.map((item, i) => (
              <li className={g.frenaItem} key={item}>
                <span className={g.frenaNum} aria-hidden="true">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Block>

      {/* ------------------------------------------------------------------
          6 · Cierre. UNA línea comercial, y recién acá: después de que la
          hoja ya sirvió. Después, las fuentes enteras con el descargo — sin
          eso el contenido fiscal no se publica.
      ------------------------------------------------------------------- */}
      <Block surface="green" labelledBy="cierre-guia">
        <Reveal>
          <h2 id="cierre-guia" className={s.h2} style={{ maxWidth: "20ch" }}>
            Ya podés hacer el trámite solo.
          </h2>
          <p className={s.body} style={{ fontSize: "1.1em", maxWidth: "46em" }}>
            {SIAT_GUIA_CIERRE}
          </p>

          <div className={`${s.actions} ${g.noPrint}`}>
            <Btn href="/facturacion">Qué exige la norma, en detalle</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Preguntanos tu caso por WhatsApp
            </Btn>
          </div>

          <ul className={g.fuentes}>
            {SIAT_GUIA_ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <a
                  className={s.link}
                  href={enlace.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {enlace.label}
                </a>
              </li>
            ))}
          </ul>

          <p className={s.note} style={{ marginTop: "1.6em" }}>
            {SIAT_FUENTES}
          </p>
        </Reveal>
      </Block>
    </>
  );
}
