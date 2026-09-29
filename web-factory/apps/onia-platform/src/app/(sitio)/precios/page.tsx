import type { Metadata } from "next";
import { Reveal } from "@/motion";
import {
  PLANES,
  GRUPO,
  PRUEBA,
  ADDONS,
  NO_INCLUYE,
  CONDICIONES,
  NOTA_FISCAL,
  bs,
  sinSubirDePlan,
} from "@/lib/pricing";
import {
  CHATBOT_PLAN,
  precioAnual,
  fmtBs,
  SALARIO_MINIMO,
  pctDelSalarioMinimo,
} from "@/content/chatbot-precios";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { EMPEZAR_URL, registroConPlan } from "../nav";
import { CTA_ALTA, ctaAltaPlan } from "../alta";
import { Block, Btn, Kicker, JsonLd } from "../ui";
import s from "../sitio.module.css";

/**
 * Apartado de PRECIOS. Cada número sale de lib/pricing.ts (planes, add-ons, no
 * incluye, condiciones, nota fiscal). El add-on del chatbot ya no es excepción:
 * desde 2026-08-21 pricing.ts → ADDONS LEE su precio de
 * content/chatbot-precios.ts, así que esta pantalla, la landing y
 * /chatbot muestran el mismo número sin que nadie lo copie a mano.
 */

/**
 * El chatbot SALE de la lista de add-ons y pasa a ser el panel estrella: es el
 * único con precio publicado, apartado propio (/chatbot) y anclaje de valor.
 * Se filtra por `href` y NO por el nombre — lib/pricing.ts agregó ese campo
 * justamente para que la pantalla no adivine a qué fila le toca link, y el
 * sniff por `nombre.includes("Chatbot")` se rompía al renombrar la fila.
 */
const ADDONS_RESTO = ADDONS.filter((addon) => addon.href !== "/chatbot");

/**
 * Anclaje de valor del precio del chatbot. Un número suelto es un costo; el
 * mismo número contra algo que el comprador YA paga es una comparación.
 *
 * Se publica porque no es una cifra inventada: el salario mínimo nacional 2026
 * es dato público con fuente legal (DS 5516), y por eso la fuente se muestra
 * en pantalla al lado del número. El porcentaje se DERIVA de
 * `CHATBOT_PLAN.mensual` en vez de escribirse "12": si mañana cambia el precio
 * en la fuente única, la frase se mueve sola en lugar de quedar mintiendo.
 *
 * ⚠️ DUPLICADO RESUELTO el 2026-09-04: el monto salía de una constante tipeada
 * acá, en (sitio)/page.tsx y en (sitio)/chatbot/page.tsx. Hoy las tres leen
 * content/chatbot-precios.ts, al lado del precio del que es referencia, y lo
 * vigila (sitio)/salario-minimo.test.ts.
 */
const PCT_SALARIO = pctDelSalarioMinimo();

/**
 * La `description` se ARMA con PLANES, no se escribe. Es la superficie que no
 * se ve mirando la pantalla: si un precio cambia y esta frase queda a mano,
 * el buscador y la tarjeta compartida siguen anunciando el precio viejo y
 * ninguna captura lo delata. Gate: `(sitio)/precios.test.ts`.
 */
const DESC_PLANES = PLANES.map((p) => `${p.nombre} Bs ${bs(p.mensual)}`)
  // "a, b y c" — la misma prosa que ya publica el sitio; esto es un refactor,
  // no un cambio de copy: el HTML servido tiene que salir byte a byte igual.
  .reduce((acc, cur, i, arr) => (i === 0 ? cur : `${acc}${i === arr.length - 1 ? " y " : ", "}${cur}`), "");
const DESC_SEMANAL = bs(
  Math.min(...PLANES.map((p) => p.semanal).filter((s): s is number => s !== null)),
);

export const metadata: Metadata = {
  title: "Precios de Onia — planes en bolivianos, publicados",
  description: `${DESC_PLANES} al mes (o semanal desde Bs ${DESC_SEMANAL}). Sin tarjeta para probar, sin contratos de permanencia y con la letra chica publicada. ${PRUEBA.dias} días gratis.`,
  alternates: { canonical: "/precios" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Precios de Onia — en bolivianos, publicados",
    // Escribía "Básico 320 · Pro 750 · Full 1.500 Bs/mes" a mano hasta el
    // 2026-09-04: el gate de al lado no lo veía porque pone el "Bs" DESPUÉS del
    // número y el patrón sólo buscaba "Bs 320". La `description` de arriba ya
    // se había atado a la tabla y su hermana de OpenGraph —la que se ve al
    // compartir el enlace— quedó con los tres precios congelados.
    description: `${PLANES.map((p) => `${p.nombre} ${bs(p.mensual)}`).join(" · ")} Bs/mes. ${PRUEBA.dias} días gratis sin tarjeta, sin permanencia.`,
    url: "/precios",
  },
};

/** Breadcrumb + SoftwareApplication con los montos: heredado de la v1. */
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
      name: "Onia",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/precios`,
      offers: PLANES.map((plan) => ({
        "@type": "Offer",
        name: plan.nombre,
        price: String(plan.mensual),
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      })),
    },
  ],
};

export default function Precios() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      <Block surface="paper">
        <Reveal>
          <Kicker>Precios claros</Kicker>
          <h1 className={s.display}>
            Cuatro escalones. Sin implementación, sin <em>permanencia</em>.
          </h1>
          <p className={s.lead}>
            {PRUEBA.copy}
          </p>
        </Reveal>
      </Block>

      {/* Planes */}
      <Block surface="paperDim" labelledBy="planes">
        <h2 id="planes" className={s.h2} style={{ position: "absolute", left: "-9999px" }}>
          Planes
        </h2>
        <Reveal>
          <div className={s.plans}>
            {PLANES.map((plan) => (
              <div
                key={plan.id}
                className={`${s.plan} ${plan.destacado ? s.planStar : ""}`}
              >
                <span className={s.planStep}>
                  {plan.paso} · {plan.salto}
                </span>
                <h3 className={s.planName}>{plan.nombre}</h3>
                <div className={s.planPrice}>
                  <span className={s.planNum}>{bs(plan.mensual)}</span>
                  <span className={s.planUnit}>Bs / mes</span>
                </div>
                <p className={`${s.mono} ${s.planUnit}`} style={{ marginTop: "0.2em" }}>
                  {bs(plan.anual)} Bs/año
                  {plan.semanal !== null ? ` · ${bs(plan.semanal)} Bs/sem` : ""}
                </p>
                <p className={s.planResult}>{plan.resultado}</p>
                <ul className={s.planList}>
                  {plan.incluye.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {/* Lo que el nivel NO trae (pricing.ts → `sinEsto`, que estaba
                    definido y nunca se pintaba). El que duda entre Básico y Pro
                    decide ACÁ: "Agentes de IA (vienen desde Pro)" es el
                    argumento que sube el ticket, y enterrarlo en la letra chica
                    lo desperdicia.

                    Jerarquía MENOR que `incluye` a propósito: `.note` (62 % de
                    currentColor, 0.9em) contra `.planList` (82 %, 0.95em), y
                    viñeta "—" en vez del punto de acento — el punto verde de
                    `.planList` significa "incluido" y acá diría lo contrario.

                    Sin encabezado visible: `sinEsto` de Pro y Full son frases
                    de tranquilidad ("Nada del Básico se queda afuera"), y un
                    título "No incluye" encima las volvería contradictorias. El
                    contexto va en `aria-label`, que sí funciona para los tres.

                    Las cuatro reglas inline existen porque `.note` es tipografía
                    de párrafo, no de lista, y el módulo CSS es de otro carril
                    (falta una clase `.planSinEsto` — anotado en el reporte). */}
                <ul
                  className={s.note}
                  aria-label={`Lo que no trae el plan ${plan.nombre}`}
                  style={{
                    listStyle: "none",
                    margin: "1em 0 0",
                    padding: 0,
                    display: "grid",
                    gap: "0.35em",
                  }}
                >
                  {plan.sinEsto.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.1em 1fr",
                        gap: "0.4em",
                      }}
                    >
                      <span aria-hidden="true">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className={s.note} style={{ marginTop: "1em" }}>
                  {plan.cuando}
                </p>
                <div className={s.planFoot}>
                  <Btn href={registroConPlan(plan.id)}>{ctaAltaPlan(plan.nombre)}</Btn>
                </div>
              </div>
            ))}
          </div>
          <p className={s.note} style={{ marginTop: "1.4em" }}>
            Precios finales en bolivianos, impuestos incluidos.
          </p>
        </Reveal>
      </Block>

      {/* Add-ons — SUBEN a pegarse a los planes, y dejan de ser una tabla.

          Dos cambios, con un motivo cada uno.

          EL ORDEN. Antes esta sección vivía DEBAJO de Grupo / Empresarial, que
          es un proyecto cotizado que casi nadie compra. El add-on se decide
          caliente, justo después de elegir el plan — no tres pantallas más
          abajo. Es el orden que usan Intercom, Shopify y Notion en sus páginas
          de precios: grilla de planes → add-ons → el resto de la letra chica.

          LA FORMA. Era una tabla de cinco filas con el precio en mono 0.9em al
          85 % contra el margen derecho. Ahora es asimétrica: el chatbot sale
          de la lista y toma superficie propia, y los otros cuatro quedan como
          carta de precios. Sacarlo de la lista es el punto — un add-on
          estrella DENTRO de una lista de add-ons se lee como uno de cinco por
          más que se lo maquille (Intercom promueve a Fin fuera de su sección
          de add-ons por exactamente esa razón).

          Ni un `.btn` en el bloque: botón = plan, link = add-on. Los montos
          salen de lib/pricing.ts → ADDONS y de content/chatbot-precios.ts,
          las mismas fuentes que la portada. */}
      <Block surface="ink" labelledBy="addons">
        <Reveal>
          {/* Ver el hermano de la portada: el universal "Se suma a cualquier plan" es falso desde
              que `whatsappIncluded`/`publicBookingIncluded` meten add-ons ADENTRO de un plan. */}
          <Kicker>Uno por uno</Kicker>
          <h2 id="addons" className={s.h2}>
            Lo que le sumás al plan, con su precio.
          </h2>
          {/* Hermana de la portada: acá el sujeto SÍ estaba acotado («Ninguno…»), así que la
              frase era cierta — y tipeada igual, que es como las dos se separan. Las dos leen
              ahora la misma cláusula derivada del catálogo. */}
          <p className={s.lead}>Se prende y se paga aparte. {sinSubirDePlan()}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={s.offerStar}>
            <div>
              <span className={s.planStep}>Add-on · WhatsApp</span>
              {/* El nombre es el RESULTADO y no lo redacta esta pantalla: sale
                  de content/chatbot-precios.ts → `nombre`, la fuente única. */}
              <h3 className={s.offerName}>{CHATBOT_PLAN.nombre}.</h3>
              <p className={s.body}>{CHATBOT_PLAN.resuelve}</p>
              <div className={s.actions}>
                <a className={s.link} href="/chatbot">
                  Ver el agente conversacional y sus requisitos →
                </a>
              </div>
            </div>
            <div className={s.offerRail}>
              <div className={s.offerPrice}>
                <span className={s.offerNum}>{bs(CHATBOT_PLAN.mensual)}</span>
                <span className={s.offerUnit}>Bs / mes</span>
              </div>
              <p className={s.offerNote}>
                Sin instalación. O {precioAnual(CHATBOT_PLAN)}.
              </p>
              <p className={s.offerAnchor}>
                Es el{" "}
                <b>
                  {PCT_SALARIO} % del salario mínimo nacional{" "}
                  {SALARIO_MINIMO.anio}
                </b>{" "}
                (Bs {fmtBs(SALARIO_MINIMO.monto)}, según el{" "}
                {SALARIO_MINIMO.norma}), sin aguinaldo ni domingos, por algo que
                atiende las 24 horas.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <p className={`${s.planStep} ${s.offerListLabel}`}>
            Lo demás que se suma
          </p>
          <div className={s.offerList}>
            {ADDONS_RESTO.map((addon) => (
              <div key={addon.nombre} className={s.offerItem}>
                <div className={s.offerItemHead}>
                  <h3 className={s.offerItemName}>
                    {addon.href ? (
                      <a href={addon.href}>{addon.nombre}</a>
                    ) : (
                      addon.nombre
                    )}
                  </h3>
                  <span className={s.offerItemPrice}>{addon.precio}</span>
                </div>
                <p className={s.offerItemText}>{addon.copy}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Grupo / Empresarial — baja debajo de los add-ons: es un proyecto que
          se cotiza, no una compra de esta página. Cambia de tinta a verde
          porque los add-ons se quedaron con el bloque oscuro y dos bloques de
          tinta seguidos borran el corte de tono, que es la ÚNICA profundidad
          que usa este sitio (cero sombras en todo el archivo). */}
      <Block surface="green" labelledBy="grupo">
        <Reveal>
          <Kicker>{GRUPO.nombre}</Kicker>
          <p id="grupo" className={s.h2} style={{ maxWidth: "22ch" }}>
            {bs(GRUPO.mensual)} Bs/mes, con implementación desde {bs(GRUPO.implementacionDesde)} Bs.
          </p>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            {GRUPO.copy}
          </p>
          <div className={s.actions}>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Cotizar Grupo
            </Btn>
          </div>
        </Reveal>
      </Block>

      {/* No incluye */}
      <Block surface="paperDim" labelledBy="no-incluye">
        <Reveal>
          <Kicker>Lo que no incluye</Kicker>
          <h2 id="no-incluye" className={s.h2}>
            Los costos de terceros, de frente.
          </h2>
          <div className={s.rows}>
            {NO_INCLUYE.map((x) => (
              <div key={x.que} className={s.row}>
                <span className={s.rowName}>{x.que}</span>
                <p className={s.rowText}>{x.detalle}</p>
                <span />
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Condiciones */}
      <Block surface="paper" labelledBy="condiciones">
        <Reveal>
          <Kicker>Condiciones</Kicker>
          <h2 id="condiciones" className={s.h2}>
            Cómo se paga.
          </h2>
          <ul className={s.planList} style={{ marginTop: "2em", maxWidth: "52em" }}>
            {CONDICIONES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {/* La comparación vive ACÁ y no en el menú de arriba.

              `/comparativa` salió del nav el 2026-09-08 («ok C» de Sergio
              Urcullo). El error no es comparar —`lety.ai`, la referencia que él
              fijó, también compara con nombre— sino DÓNDE: pegada a «Precios» en
              la barra, el camino de compra le ofrecía al que ya venía a pagar
              una pantalla con seis competidores y su precio. Abajo de las
              condiciones el sujeto es otro: el que ya leyó cuánto cuesta y está
              decidiendo. Ver `header-camino-de-compra.test.ts`.

              Y es el enlace que la mantiene ALCANZABLE: sin él queda sin una
              sola pantalla que la ofrezca y `alcance.test.ts` la manda al
              disallow de `robots.ts` — o sea, desindexada. Medido: sacarla del
              nav sin esto pone el gate en rojo. */}
          <p className={s.note} style={{ marginTop: "2em", maxWidth: "52em" }}>
            ¿Lo estás comparando con otra opción?{" "}
            <a className={s.link} href="/comparativa">
              Mirá la comparación
            </a>
            .
          </p>
        </Reveal>
      </Block>

      {/* Nota fiscal — honestidad de producto */}
      <Block surface="green" labelledBy="fiscal">
        <Reveal>
          <Kicker>Facturación fiscal</Kicker>
          <p id="fiscal" className={s.body} style={{ fontSize: "1.2em", maxWidth: "50em" }}>
            {NOTA_FISCAL}
          </p>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
