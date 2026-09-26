import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/motion";
import {
  PLANES,
  ADDONS,
  GRUPO,
  PRUEBA,
  ALCANCE_CON_AGENDA,
  ALCANCE_CON_INVENTARIO,
  bs,
  nombresConChatbot,
  plan,
  planDeEntrada,
  primerPlanCon,
  sinSubirDePlan,
} from "@/lib/pricing";

/**
 * El plan de ENTRADA, una sola vez: la línea de precio del hero y el panel que
 * va debajo tienen que hablar del MISMO plan. Que discreparan es el defecto del
 * 2026-09-19 — la línea decía Bs 320 y el panel dibujaba los agentes, que ese
 * plan no enciende.
 *
 * Desde el 2026-09-26 son TRES, no dos: el `<head>` (`DESDE_MES`, más abajo)
 * tipeaba `plan("basico")` mientras la pantalla ya derivaba. Las dos mitades de
 * la misma página habrían dicho precios distintos el día que entre un escalón
 * más barato, y la que se ve ANTES de abrir el sitio —snippet de Google,
 * tarjeta de WhatsApp— es justamente la que estaba tipeada.
 */
const PLAN_DE_ENTRADA = planDeEntrada();
import {
  CHATBOT_PLAN,
  precioStack,
  precioAnual,
  fmtBs,
  SALARIO_MINIMO,
  pctDelSalarioMinimo,
} from "@/content/chatbot-precios";
import { HUECO_PARTIDO, FECHA_CONSULTA } from "@/lib/proof";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { EMPEZAR_URL } from "./nav";
import { ALTA_VERBO_VOS_TITULO, CTA_ALTA, ctaAltaPlan } from "./alta";
import { FAQ } from "./faq-datos";
import { Block, Shape, Btn, Kicker, JsonLd, PanelDibujado } from "./ui";
import { ConversacionNocturna } from "./conversacion";
import { Switcher } from "./switcher";
import { NocheFoto } from "./noche";
import { PreciosConCiclo } from "./precios-toggle";
import s from "./sitio.module.css";
import p from "./portada.module.css";

/**
 * Portada del sitio (v3) — el ORDEN es el argumento. Reordenada el 2026-09-11
 * por veredicto de Sergio ("el tema de los chatbots es principal... quita esas
 * cajitas que son solo texto"):
 *   hero (puro texto, el que él aprobó) → CHATBOT protagonista (conversación
 *   dibujada + el día) → la noche → capacidades → agentes → SWITCHER de
 *   rubros → precios → add-ons → FAQ → cierre.
 * Las «cajitas» de HECHOS (solo texto) se retiraron ese día.
 *
 * Ninguna pantalla de esta página es una captura del producto: las de agentes,
 * chatbot y el conmutador de rubros son PANELES DIBUJADOS (<Shape> en ui.tsx),
 * y las fotos son de contexto —la persona en su negocio, sin pantalla legible—.
 * Sergio, 2026-09-01, textual: "no coloques capturas literales del sistema, se
 * ve mal, coloca cosas referenciales". El guard forma.test.ts lo sostiene.
 * Precios y capacidades salen SOLO de las fuentes (lib/pricing.ts,
 * content/chatbot-precios.ts, lib/proof.ts) — cero cifras a mano.
 */

/**
 * La imagen social NO se declara acá. La dibuja `opengraph-image.tsx`, que al
 * vivir en el segmento `(sitio)` la sirve para las DOCE rutas del sitio y no
 * sólo para la home.
 *
 * ⚠️ Acá había una regla escrita al revés —"la imagen social es una captura
 * REAL del sistema… nada de pantallas dibujadas haciendo de prueba"— catorce
 * líneas debajo del comentario de cabecera que dice lo contrario. Esa regla
 * sostenía `/og/onia-rubros.jpg`, una captura con "MUY PRONTO" impreso adentro
 * y la fila de abajo cortada por el recorte: la primera cosa que veía un lead
 * al recibir el link por WhatsApp. Un comentario que contradice a la regla de
 * la casa no es una nota: es la instrucción que la próxima sesión obedece.
 *
 * Si esta página vuelve a declarar `openGraph.images`, PISA el dibujo.
 */

/**
 * El titular de la pestaña y el del buscador dicen lo MISMO que el h1.
 *
 * Hasta el 2026-09-01 los cuatro repetían el hero viejo ("Tu negocio no pierde
 * citas ni cobros mientras dormís") — se cambió el hero y el resultado de
 * Google habría seguido prometiendo la frase anterior. Una promesa que cambia
 * se barre en TODA la superficie, y el snippet es la primera.
 *
 * El 2026-09-04 se barrieron los cuatro otra vez, y por el mismo motivo con el
 * signo cambiado: el hero dejó de vender al asistente, así que el snippet no
 * puede seguir prometiendo "el que pregunta a las once". Lo que se ofrece es el
 * sistema, y el precio de entrada vuelve a las descripciones porque ahora sí es
 * el precio de lo que la página promete — interpolado de `lib/pricing.ts`,
 * nunca tipeado: una descripción con la cifra a mano es la forma más fácil de
 * publicar un precio que ya no se cobra, y no la ve ninguna captura.
 */
const DESDE_MES = `Bs ${bs(PLAN_DE_ENTRADA.mensual)}`;
const TITULO =
  "Onia · Todo el negocio en una pantalla | Software de gestión Bolivia";
const DESCRIPCION = `Onia es el sistema con el que llevás tu negocio en Bolivia: fichas de clientes, caja y cobros en un solo lugar —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—, ya armado para tu rubro. Desde ${DESDE_MES} al mes. ${PRUEBA.dias} días gratis, sin tarjeta.`;
const OG_TITULO = "Todo el negocio, en una pantalla. — Onia, Bolivia";
const OG_DESCRIPCION = `Los clientes en el teléfono, el stock en la cabeza y las cuentas en una planilla: nada se cruza, y lo que no se cruza se pierde. Onia junta clientes, caja y cobros en un solo sistema —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—, armado para tu rubro. Desde ${DESDE_MES} al mes, ${PRUEBA.dias} días gratis y sin tarjeta.`;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  // Canonical POR PÁGINA, nunca en el layout: si viviera arriba, las nueve
  // rutas heredarían "/" y el sitio entero se desindexaría.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    siteName: "Onia",
    title: OG_TITULO,
    description: OG_DESCRIPCION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITULO,
    description: OG_DESCRIPCION,
  },
};

/**
 * El chatbot SALE de la lista de add-ons y pasa a ser el panel estrella de la
 * sección 9: es el único con precio publicado, apartado propio (/chatbot) y
 * anclaje de valor. Se filtra por `href` y NO por el nombre — lib/pricing.ts
 * agregó ese campo justamente para que la pantalla no adivine a qué fila le
 * toca link, y ese sniff se rompía con renombrar la fila.
 */
const ADDONS_RESTO = ADDONS.filter((addon) => addon.href !== "/chatbot");

/**
 * Anclaje de valor del precio del chatbot. Un número suelto es un costo; el
 * mismo número contra algo que el comprador YA paga es una comparación.
 *
 * Se puede publicar porque no es una cifra inventada: el salario mínimo
 * nacional 2026 es dato público con fuente legal (DS 5516), y por eso la
 * fuente se muestra en pantalla al lado del número. El porcentaje se DERIVA de
 * `CHATBOT_PLAN.mensual` en vez de escribirse "12": si mañana cambia el precio
 * en la fuente única, la frase se mueve sola en lugar de quedar mintiendo.
 *
 * ⚠️ DUPLICADO RESUELTO el 2026-09-04. Esta constante estaba tipeada acá, en
 * (sitio)/chatbot/page.tsx y en (sitio)/precios/page.tsx, y lo que sostuvo las
 * tres copias fue el comentario que había en este mismo lugar: decía que le
 * correspondía estar en content/chatbot-precios.ts *"pero ese archivo está
 * fuera de este carril"*. Era falso —`src/content/` es esta misma app— y la
 * frase congeló el arreglo por leerse como medida. Hoy sale de la fuente, y la
 * invariante se ejecuta en vez de leerse: (sitio)/salario-minimo.test.ts.
 */
const PCT_SALARIO = pctDelSalarioMinimo();


/**
 * "Un día con Onia" — las tres escenas que acompañan al manifiesto.
 *
 * El manifiesto era una frase suspendida: explicaba QUÉ ES el sistema y no
 * mostraba nunca QUÉ PASA en un negocio. Sergio, textual: "mostrar usos
 * prácticos".
 *
 * Son fotos de CONTEXTO, no de producto: una persona en su negocio, ningún
 * dispositivo con pantalla legible. La interfaz NO se fotografía en ningún
 * bloque: hero, agentes, chatbot y conmutador son paneles DIBUJADOS (<Shape> y
 * <PanelDibujado> en ui.tsx). Reglas, shot list y gate:
 * hermes-content/docs/ONIA_WEB_IMAGENES_DE_CONTEXTO.md
 *
 * Cada línea es un RESULTADO, y cada resultado es una capacidad YA publicada
 * en este mismo sitio — acá no se promete nada nuevo:
 *   · mañana → panel "dental" de ui.tsx (agenda del día: hora y tratamiento)
 *   · tarde  → panel "comercio" de ui.tsx (la caja cortada por método de pago)
 *              + rubros/page.tsx:39 (fiados)
 *   · noche  → el Recall del producto (`lib/onia-core/modules/agents-por-rubro.ts`:
 *              corre en estética y dispara por `recallAfterDays`) + la sección 5
 *              de este mismo archivo (el borrador que espera tu aprobación)
 *
 * ⚠️ La cita de cada línea va al PRODUCTO, nunca a otra pantalla de este sitio.
 * Acá la de la noche citaba `rubros/page.tsx` y `rubros/page.tsx` se citaba a sí
 * mismo: el sitio comparándose consigo mismo. Así sobrevivió «el paquete que
 * quedó por la mitad», un saldo que el producto no lleva (2026-09-19).
 */
const DIA = [
  {
    id: "dental",
    momento: "Por la mañana",
    texto:
      "Sabés quién viene hoy sin descifrar el cuaderno: la agenda del día trae cada cita con su hora, su motivo y el teléfono para confirmarla.",
    alt: "Recepcionista de un consultorio dental con el celular en una mano y el dedo siguiendo un renglón del cuaderno de citas abierto.",
  },
  {
    id: "comercio",
    momento: "A media tarde",
    texto:
      "Cerrás la caja sin sacar la calculadora: el total del día ya viene cortado por método de pago, y el fiado deja de vivir en el cuaderno.",
    alt: "Dueño de una ferretería detrás del mostrador, con el cuaderno de fiados abierto y una tablet apoyada boca abajo al lado.",
  },
  {
    id: "estetica",
    momento: "De noche",
    texto:
      "Bajás la persiana y la clienta que dejó el tratamiento a medias no se pierde: a la mañana te espera el borrador de a quién llamar, para que lo aprobés.",
    alt: "Dueña de un centro de estética junto a la camilla vacía con papel nuevo puesto, con el celular en la mano.",
  },
] as const;

/** Las tres son 1280×960 (4/3), tal cual salieron a public/contexto/. */
const FOTO_DIA = { w: 1280, h: 960 } as const;

/**
 * Datos estructurados heredados de la v1 — Organization + SoftwareApplication
 * con los tres precios en BOB + FAQPage. Los montos NO se escriben acá: salen
 * de PLANES (lib/pricing.ts), que es la fuente única, y las preguntas salen
 * del mismo array FAQ que renderiza la sección.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Onia",
      legalName: "OniaAgency",
      url: `${SITE_URL}/`,
      areaServed: { "@type": "Country", name: "Bolivia" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santa Cruz de la Sierra",
        addressCountry: "BO",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Onia",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#org` },
      // ⚠️ La factura NO se enumera acá: el emisor está en trámite ante el SIN
      // (`proof.ts` → siat: "tramite"). Esta cadena es la descripción del
      // producto que lee Google, así que nombrarla entre los módulos la vende
      // igual que el pie (198cca363) y que el cuerpo de esta misma página
      // (5423e2f50). Cuando la homologación concluya, vuelve — con evidencia.
      description:
        `Sistema de gestión con IA para negocios en Bolivia: clientes, cobros y agentes con aprobación humana —más inventario ${ALCANCE_CON_INVENTARIO} y agenda ${ALCANCE_CON_AGENDA}—.`,
      offers: PLANES.map((plan) => ({
        "@type": "Offer",
        name: plan.nombre,
        price: String(plan.mensual),
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

/**
 * El día del negocio, en dos números. Las 9 horas que atiende una persona y
 * las 15 que no atiende nadie.
 *
 * Salen de acá y de ningún otro lado: la rejilla del hero son 24 columnas y la
 * proporción 9:15 es ESPACIAL (`--span`), no dibujada a mano. Los mismos dos
 * números cuentan las marcas de la regla, las marcas de cada lane y el texto
 * "9 horas / 15 horas". Escribirlos cuatro veces era la forma segura de que un
 * día dejaran de sumar 24.
 */
const HORAS_VOS = 9;
const HORAS_ONIA = 15;

/**
 * Las tres cosas que de verdad pasan en esas 15 horas. Ninguna es una promesa
 * nueva: el asistente que contesta es el chatbot (sección 6 y /chatbot), la
 * reserva sola es el add-on de reservas online (lib/pricing.ts → ADDONS) y el
 * borrador que espera aprobación es lo que hacen los agentes (sección 5).
 *
 * ⚠️ El cierre del tercero NO se toca: los agentes preparan el borrador y lo
 * dejan en la cola de aprobación — no avisan, no mandan y no cobran solos
 * (onia-core/contract.json:838 · app/api/cron/onia-agents/route.ts, "SIN
 * ningun envio externo"). Tres diseñadores se equivocaron en esto antes.
 */
const MOMENTOS = [
  { hora: "23:40", que: "Preguntan el precio. Contesta el asistente." },
  { hora: "Domingo", que: `Reservan solos por tu agenda pública, ${ALCANCE_CON_AGENDA}.` },
  {
    hora: "07:00",
    que: (
      <>
        Los recordatorios y los avisos de pago quedan escritos.{" "}
        <span className={s.cierre}>Vos los aprobás.</span>
      </>
    ),
  },
] as const;


/** Las tres capacidades con peso de producto, cada una con su panel dibujado. */
const CAPACIDADES = [
  {
    panel: "cuenta" as const,
    // La portada dibuja el plan de ENTRADA, que es el único que puede prometer
    // sin mentirle a nadie: el que paga el más caro también lo tiene. Ver
    // `modulos-de-la-cuenta.ts`.
    plan: PLAN_DE_ENTRADA.id,
    nombre: "El día entero, en una pantalla",
    texto:
      "Lo que entró, lo que falta cobrar y lo que viene después. No hay que abrir un reporte para saber cómo va el negocio: es lo primero que ves al entrar.",
  },
  {
    panel: "chat" as const,
    nombre: "Los mensajes no se pierden",
    texto:
      "Lo que llega por WhatsApp entra al mismo lugar que el resto. El que atiende ve la ficha del cliente mientras le contesta, sin cambiar de app.",
  },
  {
    panel: "agentes" as const,
    // ⚠️ Acá decía «Trabajan de noche, no deciden solos», palabra por palabra el
    // titular de la sección 5, que cae 518 px más abajo: las dos entraban en un
    // mismo viewport de 1440×900 (medido el 2026-09-24 sobre onia.com.bo). Esta
    // tarjeta aporta lo que la 5 NO dice —QUÉ detecta el agente—; la 5 aporta
    // CUÁNDO trabaja y QUIÉN decide. El rótulo nombra lo que su propio cuerpo ya
    // promete, así que no agrega superficie: la saca.
    nombre: "El que no volvió, no se te pierde",
    texto:
      "Los agentes detectan al cliente que dejó de venir, preparan el mensaje y arman el seguimiento.",
  },
] as const;

export default function Portada() {
  return (
    <>
      <JsonLd data={JSON_LD} />

      {/* 1 · HERO ────────────────────────────────────────────
          La referencia hace que el título SEA la página hasta que scrolleás.
          El texto es el aprobado el 1-sep; lo que cambia es la composición:
          de dos columnas a centrado, con «una» en el acento. */}
      <Block surface="green" className={p.heroVerde}>
        {/* Los halos de Hostinger. Van acá y no en el CSS del Block porque son
            de ESTA pieza: el resto del sitio sigue siendo papel. */}
        <span className={`${p.halo} ${p.haloA}`} aria-hidden="true" />
        <span className={`${p.halo} ${p.haloB}`} aria-hidden="true" />
        {/* El HERO no usa <Reveal>: motion arranca en opacity 0 y el titular
            queda invisible hasta que hidrata el JS — Lighthouse midió 788 ms de
            "element render delay" sobre el LCP (p.heroLead) por esa espera. La
            entrada acá es CSS puro (misma curva y distancia que el sistema de
            motion), así el fold pinta con el HTML. El resto del sitio sigue con
            Reveal: debajo del pliegue la hidratación no le cuesta al LCP. */}
        <div className={p.heroEntrada}>
          <div className={p.centro}>
            <Kicker>Un solo sistema para todo el negocio</Kicker>
            <h1 className={p.heroTitulo}>
              Todo el negocio, en <em>una</em> pantalla.
            </h1>
            {/* La salvedad de los agentes NO es adorno y no se borra: el precio que
                se lee tres líneas más abajo es el del plan de ENTRADA, que los trae
                apagados. Sin ella las dos frases son ciertas por separado y falsas
                juntas, y el lead se entera al pagar. El plan se DERIVA con
                `primerPlanCon` —nunca se tipea— para que siga siendo cierta el día
                que la capacidad cambie de escalón, como pasó el 2026-09-12. Lo
                sostiene `fold-no-promete-lo-apagado.test.ts`. */}
            <p className={p.heroLead}>
              Onia es el sistema con el que llevás tu negocio: clientes, caja,
              cobros y contabilidad. Con agentes que trabajan de noche y te dejan las
              decisiones a vos, desde el plan {primerPlanCon("agentes")}.
            </p>
            <div className={p.heroCtas}>
              <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
              <Btn href={WA_URL_LANDING} variant="line" external>
                Preguntar por WhatsApp
              </Btn>
            </div>
            <p className={p.heroNota}>
              {PRUEBA.dias} días de prueba con el plan {PRUEBA.planQueCorre}, sin tarjeta.
              Después, desde Bs {bs(PLAN_DE_ENTRADA.mensual)} al mes.
            </p>

            {/* La escena que la referencia arma con mockups de su app. Acá va
                el panel DIBUJADO — nunca una captura del sistema. */}
            <div className={p.escena}>
              <div className={p.escenaPanel}>
                <PanelDibujado panel="cuenta" plan={PLAN_DE_ENTRADA.id} />
              </div>
              <span className={`${p.nodo} ${p.nodoA}`} aria-hidden="true">
                ✓
              </span>
              <span className={`${p.nodo} ${p.nodoB}`} aria-hidden="true">
                Bs
              </span>
              <span className={`${p.nodo} ${p.nodoC}`} aria-hidden="true">
                ◷
              </span>
            </div>
          </div>
        </div>
      </Block>

      {/* 2 · CHATBOT — PROTAGONISTA ─────────────────────────────────
          Sergio, 2026-09-11, sobre la portada entera: "el tema de los chatbots
          es principal, que sea más protagonista, está al final eso" + "quita
          esas cajitas que son solo texto que no enseñan nada". Las cajitas
          (HECHOS) se fueron; el chatbot sube de la posición 6 a acá, pegado al
          hero, y su pieza visual deja de ser un Shape chico: es la
          conversación dibujada contestando de noche (conversacion.tsx). El
          argumento de las horas (EL DÍA) viaja con él. */}
      <Block surface="paper" labelledBy="chatbot">
        <div className={`${s.split} ${s.splitFlip}`}>
          <Reveal>
            <div>
              {/* Copy FORMAL (Sergio, 12-sep, sobre esta caption: "mejorá la
                  caption, no hables informalmente"): registro profesional,
                  mismo voseo de la marca, sin coloquialismos. */}
              <Kicker>Chatbot de WhatsApp</Kicker>
              <h2 id="chatbot" className={s.h2}>
                Tu WhatsApp responde las 24 horas.
              </h2>
              <p className={s.body}>
                El asistente contesta al instante con la información que tu
                negocio publicó. No improvisa precios ni promesas: lo que
                requiere una decisión te llega con la conversación completa.
                Viene incluido en {nombresConChatbot()}; sobre los demás planes
                se suma aparte.
              </p>
              <div className={s.actions}>
                <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
                <a className={s.link} href="/chatbot">
                  Ver el chatbot y sus requisitos →
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ConversacionNocturna />
          </Reveal>
        </div>

        {/* EL DÍA — rehecho el 11-sep. Sergio, sobre los slabs negro/verde con
            cuadraditos, textual: "esto no me gusta para nada... mirá cómo
            están hechas las webs de las competencias, mejoranos". Entra la
            línea del día: una frase, UNA barra limpia con las 24 horas
            repartidas y los tres momentos — base clara, tipografía de marca,
            cero relojería. */}
        <Reveal delay={0.08} className={s.dia}>
          <p className={s.diaFrase}>
            Tu negocio atiende <b>{HORAS_VOS} horas</b>. Las otras{" "}
            <b>{HORAS_ONIA}</b>, el asistente responde por vos — feriados y
            domingos incluidos.
          </p>
          <div
            className={s.diaBarra}
            role="img"
            aria-label={`De las 24 horas del día atendés ${HORAS_VOS}; las otras ${HORAS_ONIA} contesta Onia, también el domingo.`}
          >
            <span
              className={s.diaVos}
              style={{ "--span": HORAS_VOS } as CSSProperties}
            >
              <i>09:00 → 18:00</i> Atendés vos
            </span>
            <span
              className={s.diaOnia}
              style={{ "--span": HORAS_ONIA } as CSSProperties}
            >
              <i>18:00 → 09:00</i> Contesta Onia
            </span>
          </div>
          <ul className={s.diaMomentos}>
            {MOMENTOS.map((momento) => (
              <li key={momento.hora}>
                <b>{momento.hora}</b> <span>{momento.que}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Block>

      {/* 3 · LA NOCHE — la variante con foto; su historia, en noche.tsx */}
      <NocheFoto />

      {/* 4 · CAPACIDADES EN TARJETAS GRANDES ──────────────────────────
          El patrón de features de la referencia: una idea por tarjeta, con su
          dibujo arriba, en vez de una lista de bullets. */}
      <Block surface="paper" labelledBy="v4-capacidades">
        <Reveal>
          <div className={p.centro}>
            <Kicker>Adentro</Kicker>
            <h2 id="v4-capacidades" className={s.h2}>
              Tres cosas que vas a usar todos los días.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={p.capacidades}>
            {CAPACIDADES.map((c) => (
              <article className={p.capacidad} key={c.panel}>
                <div className={p.capacidadArte}>
                  <PanelDibujado panel={c.panel} plan={"plan" in c ? c.plan : undefined} />
                </div>
                <h3 className={p.capacidadNombre}>{c.nombre}</h3>
                <p className={p.capacidadTexto}>{c.texto}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* 5 · AGENTES — bloque de resultado (ancla oscura) → apartado */}
      <Block surface="ink" labelledBy="agentes">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Agentes con IA</Kicker>
              <h2 id="agentes" className={s.h2}>
                Trabajan de noche. No <em>deciden</em> solos.
              </h2>
              <p className={s.body}>
                Revisan tus datos con el negocio cerrado y dejan un borrador
                esperando: a quién llamar, a quién cobrarle. A la mañana aprobás
                lo que sirve y se manda. La decisión sigue siendo tuya.
              </p>
              <div className={s.actions}>
                <a className={s.link} href="/agentes">
                  Ver cómo funcionan los agentes →
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Shape tone="signal" panel="agentes" />
          </Reveal>
        </div>
      </Block>

      {/* 6 · RUBROS ───────────────────────────────────────────────────
          Esto NO está en la referencia y es lo que más nos separa de ella:
          el mismo núcleo cambia de vocabulario según el rubro. Se queda. */}
      <Block surface="paperDim" labelledBy="v4-rubros">
        <Reveal>
          <div className={p.centro}>
            <Kicker>Un solo sistema</Kicker>
            <h2 id="v4-rubros" className={s.h2}>
              Elegís tu rubro y la cuenta ya viene armada.
            </h2>
            <p className={p.heroLead}>
              No es un software distinto por industria: es el mismo núcleo con módulos y
              vocabulario propios. Un dentista ve pacientes; una ferretería ve productos y
              fiados.
            </p>
          </div>
        </Reveal>
        <Switcher />
      </Block>

      {/* 7 · PRECIOS EN LA LANDING ────────────────────────────────────
          Lo mejor que tiene la referencia y que nosotros mandábamos a otra
          página: el precio en el camino de lectura, con el ahorro anual a la
          vista y un plan destacado. */}
      <Block surface="paper" labelledBy="v4-precios">
        <Reveal>
          <div className={p.centro}>
            <Kicker>Precios claros</Kicker>
            <h2 id="v4-precios" className={s.h2}>
              Cuatro escalones. Sin implementación, sin permanencia.
            </h2>
            <p className={p.heroLead}>{PRUEBA.copy}</p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={p.centro}>
            <PreciosConCiclo />
          </div>
        </Reveal>
      </Block>

      {/* 8 · LO QUE SE SUMA AL PLAN — add-ons con peso de PRODUCTO.

          Dos pedidos de Sergio, en orden. 2026-08-22: "solo veo 3 precios, hay
          que mostrar todo lo que ofrecemos" — por eso la sección existe.
          2026-08-23: "dale más importancia a los add-ons, que se vean más,
          mirá cómo ofrecen las startups" — por eso dejó de ser una tabla.

          Lo que era: cinco filas de `.rows` (nombre · copy al 72 % · precio en
          mono 0.9em pegado al margen derecho). Se leía como la letra chica de
          un contrato, y ahí adentro está el margen que la página escondía.

          Lo que es: jerarquía ASIMÉTRICA, que es lo que hacen las startups que
          venden bien. El chatbot se sale de la lista y toma superficie propia
          —es el único con precio publicado, apartado propio (/chatbot) y
          anclaje de valor—, y los otros cuatro quedan como carta de precios
          legible en vez de nota al pie.

          Ni un `.btn` en todo el bloque, a propósito: botón = plan, link de
          texto = add-on. Es lo que evita que el add-on le robe la compra
          principal al plan (que sigue arriba, en `paperDim`, con sus botones).

          Cada monto sale de la MISMA fuente que /precios (lib/pricing.ts →
          ADDONS y GRUPO; content/chatbot-precios.ts para el chatbot): no puede
          haber dos números del mismo servicio. */}
      <Block surface="ink" labelledBy="oferta">
        <Reveal>
          {/* "Se suma a cualquier plan" hasta el 2026-09-18: rotulaba la sección entera con un
              universal falso desde la escalera C —el chatbot viene ADENTRO de Full y Grupo, y la
              agenda pública desde Crece—, así que a quien ya los paga en su plan le ofrecía
              comprarlos de nuevo. "Uno por uno" dice lo mismo que el lead y es cierto siempre. */}
          <Kicker>Uno por uno</Kicker>
          <h2 id="oferta" className={s.h2}>
            Sobre el plan encendés lo que te falta.
          </h2>
          {/* La segunda oración decía «No hay que saltar de plan para desbloquear una sola»
              hasta el 2026-09-18: un universal sobre el MECANISMO, falso desde que los agentes
              (Crece) y el segundo administrador (Completo) vienen ADENTRO del plan y no existen
              como add-on. Ahora sale de `sinSubirDePlan()`, que lo deriva del catálogo. */}
          <p className={s.lead}>
            Cada cosa se prende aparte y se paga aparte. {sinSubirDePlan()}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className={s.offerStar}>
            <div>
              <span className={s.planStep}>Add-on · WhatsApp</span>
              {/* El nombre es el RESULTADO, no la función, y no lo redacta
                  esta pantalla: sale de content/chatbot-precios.ts → `nombre`,
                  que es la fuente única del chatbot. */}
              <h3 className={s.offerName}>{CHATBOT_PLAN.nombre}.</h3>
              <p className={s.body}>{CHATBOT_PLAN.resuelve}</p>
              <div className={s.actions}>
                <a className={s.link} href="/chatbot">
                  Ver el chatbot y sus requisitos →
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
              {/* El ancla completa (monto del salario, DS, aguinaldo) vive en
                  /chatbot y /precios. Acá una línea: Sergio, 11-sep, sobre esta
                  sección: "demasiado texto". El % sigue DERIVADO de la fuente. */}
              <p className={s.offerAnchor}>
                El <b>{PCT_SALARIO} % de un salario mínimo</b>, por algo que
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
          <div className={s.offerFoot}>
            {/* Una línea, no el párrafo entero de GRUPO.copy: el detalle vive
                en /precios ("demasiado texto", Sergio 11-sep). */}
            <p className={s.body} style={{ maxWidth: "46em" }}>
              <strong>{GRUPO.nombre}:</strong> Bs {bs(GRUPO.mensual)}/mes +
              implementación desde Bs {bs(GRUPO.implementacionDesde)}. Para
              varias razones sociales — se cotiza.
            </p>
            <div className={s.actions}>
              <a className={s.link} href="/precios">
                Ver los precios completos y lo que no incluye →
              </a>
            </div>
          </div>
        </Reveal>
      </Block>

      {/* 9 · FAQ ──────────────────────────────────────────────────────
          Las mismas ocho preguntas de la home, leidas de `faq-datos.ts`: son
          las que frenan la compra y cada respuesta cita su fuente en el repo.
          No se reescriben acá — una segunda lista con cifras se desincroniza
          en la primera edicion. */}
      <Block surface="paperDim" labelledBy="v4-faq">
        <Reveal>
          <div className={p.centro}>
            <Kicker>Antes de empezar</Kicker>
            <h2 id="v4-faq" className={s.h2}>
              Lo que preguntan antes de empezar.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={s.faq}>
            {FAQ.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary className={s.faqQ}>{item.q}</summary>
                <p className={s.faqA}>{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* 10 · CIERRE ───────────────────────────────────────────────────
          El mismo CTA del hero, tercera y última vez. */}
      <Block surface="ink" labelledBy="v4-cierre">
        <Reveal>
          <div className={p.centro}>
            <h2 id="v4-cierre" className={s.display} style={{ maxWidth: "18ch" }}>
              {ALTA_VERBO_VOS_TITULO} hoy y probalo con tu propio negocio.
            </h2>
            <div className={p.heroCtas}>
              <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
              <Btn href={WA_URL_LANDING} variant="line" external>
                Preguntar por WhatsApp
              </Btn>
            </div>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
