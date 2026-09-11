import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PLANES, ADDONS, GRUPO, PRUEBA, ALCANCE_CON_AGENDA, bs, plan } from "@/lib/pricing";
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
import { ALTA_VERBO_VOS, CTA_ALTA, ctaAltaPlan } from "./alta";
import { FAQ } from "./faq-datos";
import { Block, Shape, Btn, Kicker, JsonLd, PanelDibujado } from "./ui";
import { Switcher } from "./switcher";
import { NocheFoto } from "./noche";
import { PreciosConCiclo } from "./precios-toggle";
import s from "./sitio.module.css";
import p from "./portada.module.css";

/**
 * Portada del sitio (v3) — el ORDEN es el argumento (como Fanvue):
 *   hero (promesa de resultado) → banda de prueba verificable → hecho fuerte →
 *   manifiesto → agentes → chatbot → SWITCHER de rubros (estrella) →
 *   precios → FAQ → cierre.
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
const DESDE_MES = `Bs ${bs(plan("basico").mensual)}`;
const TITULO =
  "Onia · Todo el negocio en una pantalla | Software de gestión Bolivia";
const DESCRIPCION = `Onia es el sistema con el que llevás tu negocio en Bolivia: fichas de clientes, caja, cobros e inventario en un solo lugar —y agenda ${ALCANCE_CON_AGENDA}—, ya armado para tu rubro. Desde ${DESDE_MES} al mes. ${PRUEBA.dias} días gratis, sin tarjeta.`;
const OG_TITULO = "Todo el negocio, en una pantalla. — Onia, Bolivia";
const OG_DESCRIPCION = `Los clientes en el teléfono, el stock en la cabeza y las cuentas en una planilla: nada se cruza, y lo que no se cruza se pierde. Onia junta clientes, caja, cobros e inventario en un solo sistema —y agenda ${ALCANCE_CON_AGENDA}—, armado para tu rubro. Desde ${DESDE_MES} al mes, ${PRUEBA.dias} días gratis y sin tarjeta.`;

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
 *   · noche  → rubros/page.tsx:41 (paquetes y sesiones) + la sección 5 de
 *              este mismo archivo (el borrador que espera tu aprobación)
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
      "Bajás la persiana y el paquete que quedó por la mitad no se pierde: a la mañana te espera el borrador de a quién llamar, para que lo aprobés.",
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
        `Sistema de gestión con IA para negocios en Bolivia: clientes, cobros, inventario y agentes con aprobación humana —y agenda ${ALCANCE_CON_AGENDA}—.`,
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

/**
 * Una lane de la banda: rótulo · track de marcas · palabra.
 *
 * Las marcas son las HORAS del bloque (9 o 15), las mismas que cuenta la regla
 * de arriba — no son un gráfico de ningún dato. El track es decorativo
 * (aria-hidden); lo que se lee es la frase que forman los dos rótulos.
 *
 * `--i` escalona la onda de ONIA: una sola regla CSS en vez de quince
 * `nth-child`.
 */
function Lane({
  quien,
  que,
  marcas,
  tono,
}: {
  quien: string;
  que: string;
  marcas: number;
  /** vos = lleno y quieto · duerme = la misma marca aplastada · onia = de pie, con onda */
  tono: "vos" | "duerme" | "onia";
}) {
  const tonoClass = { vos: s.laneVos, duerme: s.laneDuerme, onia: s.laneOnia };
  return (
    <div className={`${s.lane} ${tonoClass[tono]}`}>
      <span className={s.laneQ}>{quien}</span>
      <span className={s.track} aria-hidden="true">
        {Array.from({ length: marcas }, (_, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
      <span className={s.laneS}>{que}</span>
    </div>
  );
}

/** Lo que el sistema hace hoy. Cada línea se puede comprobar entrando. */
const HECHOS = [
  {
    que: `Fichas, caja y cobros, y agenda ${ALCANCE_CON_AGENDA}`,
    como: "En una sola pantalla, no en cuatro programas que no se hablan.",
  },
  {
    que: "Inventario que avisa",
    como: "Existencias, costo y proveedor, con aviso cuando algo baja del mínimo.",
  },
  {
    que: "Contesta tu WhatsApp",
    como: CHATBOT_PLAN.resuelve,
  },
  {
    que: "Tus datos son tuyos",
    como: "Los exportás en CSV cuando quieras. Sin permanencia y sin pedir permiso.",
  },
] as const;

/** Las tres capacidades con peso de producto, cada una con su panel dibujado. */
const CAPACIDADES = [
  {
    panel: "cuenta" as const,
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
    nombre: "Trabajan de noche, no deciden solos",
    texto:
      "Los agentes preparan el mensaje, detectan al cliente que no volvió y arman el seguimiento. Vos aprobás. Nada sale sin que lo mires.",
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
        <Reveal>
          <div className={p.centro}>
            <Kicker>Un solo sistema para todo el negocio</Kicker>
            <h1 className={p.heroTitulo}>
              Todo el negocio, en <em>una</em> pantalla.
            </h1>
            <p className={p.heroLead}>
              Onia es el sistema con el que llevás tu negocio: clientes, caja,
              inventario y cobros, con agentes que trabajan de noche y te dejan las
              decisiones a vos.
            </p>
            <div className={p.heroCtas}>
              <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
              <Btn href={WA_URL_LANDING} variant="line" external>
                Preguntar por WhatsApp
              </Btn>
            </div>
            <p className={p.heroNota}>
              {PRUEBA.dias} días de prueba con el plan {PRUEBA.planQueCorre}, sin tarjeta.
              Después, desde Bs {bs(plan("basico").mensual)} al mes.
            </p>

            {/* La escena que la referencia arma con mockups de su app. Acá va
                el panel DIBUJADO — nunca una captura del sistema. */}
            <div className={p.escena}>
              <div className={p.escenaPanel}>
                <PanelDibujado panel="cuenta" />
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
        </Reveal>
      </Block>

      {/* 2 · LO QUE HACE (reemplaza «Our Journey in Numbers») ─────────
          Fincash llena esta franja con métricas de tracción. Nosotros no
          tenemos clientes pagando, así que no hay número honesto que poner:
          va lo que el sistema hace, que se comprueba entrando. */}
      <Block surface="paperDim" labelledBy="v4-hace">
        <Reveal>
          <div className={p.centro}>
            <Kicker>Lo que hace, hoy</Kicker>
            <h2 id="v4-hace" className={s.h2}>
              No es una promesa: es lo que vas a encontrar adentro.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className={p.hechos}>
            {HECHOS.map((h) => (
              <div className={p.hecho} key={h.que}>
                <p className={p.hechoQue}>{h.que}</p>
                <p className={p.hechoComo}>{h.como}</p>
              </div>
            ))}
          </div>
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
                  <PanelDibujado panel={c.panel} />
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

      {/* 6 · CHATBOT — bloque de resultado → apartado */}
      <Block surface="paper" labelledBy="chatbot">
        <div className={`${s.split} ${s.splitFlip}`}>
          <Reveal>
            <div>
              <Kicker>Chatbot de WhatsApp</Kicker>
              <h2 id="chatbot" className={s.h2}>
                El que escribe a las once ya tiene respuesta.
              </h2>
              <p className={s.body}>
                Contesta al instante con la información real que vos publicaste.
                No inventa ni cotiza por su cuenta: lo que no sabe te lo pasa
                con la conversación entera. Se suma a cualquier plan.
              </p>
              <div className={s.actions}>
                <a className={s.link} href="/chatbot">
                  Ver el chatbot y sus requisitos →
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Shape tone="green" panel="chat" />
          </Reveal>
        </div>

        {/* EL DÍA — las 9 horas que atendés vos y las 15 que no atiende nadie.

            Vivía en el hero y era la pieza más grande de la primera pantalla:
            con eso la portada vendía el add-on. Acá abajo hace lo que le toca —
            es el argumento del asistente, al lado del asistente. */}
        <Reveal delay={0.08} className={s.day}>
          <div className={s.ruler} aria-hidden="true">
            {Array.from({ length: HORAS_VOS + HORAS_ONIA }, (_, i) => (
              <span
                key={i}
                className={i < HORAS_VOS ? s.tick : `${s.tick} ${s.tickOn}`}
              />
            ))}
          </div>

          <div
            className={`${s.slab} ${s.slabVos}`}
            style={{ "--span": HORAS_VOS } as CSSProperties}
          >
            {/* El rótulo y la banda van EN UN GRUPO, igual que en el bloque
                verde: así las lanes arrancan a la misma altura a los dos lados
                del corte de las 18:00 y se leen como UNA banda que cruza la
                pieza. Sueltas, con space-between repartiendo tres hijos, la
                del negro caía 95px más abajo y el contraste había que
                buscarlo. */}
            <div>
              <p className={s.hrs}>
                <span>09:00 → 18:00</span>
              </p>
              <div className={s.band}>
                <Lane quien="Vos" que="Atendés" marcas={HORAS_VOS} tono="vos" />
                <Lane
                  quien="Onia"
                  que="Con vos"
                  marcas={HORAS_VOS}
                  tono="onia"
                />
              </div>
            </div>

            <div>
              <p className={s.amount}>{HORAS_VOS} horas</p>
              <p className={s.who}>Abrís vos.</p>
            </div>
          </div>

          <div
            className={`${s.slab} ${s.slabOnia}`}
            style={{ "--span": HORAS_ONIA } as CSSProperties}
          >
            <div>
              <p className={s.hrs}>
                <span>18:00 → 09:00</span>
                <span>Todos los días · también domingo</span>
              </p>
              {/* Las dos lanes JUNTAS: la misma forma, aplastada arriba y de
                  pie abajo. Leído de corrido: "Vos dormís / Onia por vos". */}
              <div className={s.band}>
                <Lane
                  quien="Vos"
                  que="Dormís"
                  marcas={HORAS_ONIA}
                  tono="duerme"
                />
                <Lane
                  quien="Onia"
                  que="Por vos"
                  marcas={HORAS_ONIA}
                  tono="onia"
                />
              </div>
            </div>

            <div>
              <p className={s.amount}>{HORAS_ONIA} horas</p>
              <ul className={s.moments}>
                {MOMENTOS.map((momento) => (
                  <li key={momento.hora}>
                    <b>{momento.hora}</b> <span>{momento.que}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Block>

      {/* 7 · RUBROS ───────────────────────────────────────────────────
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

      {/* 8 · PRECIOS EN LA LANDING ────────────────────────────────────
          Lo mejor que tiene la referencia y que nosotros mandábamos a otra
          página: el precio en el camino de lectura, con el ahorro anual a la
          vista y un plan destacado. */}
      <Block surface="paper" labelledBy="v4-precios">
        <Reveal>
          <div className={p.centro}>
            <Kicker>Precios claros</Kicker>
            <h2 id="v4-precios" className={s.h2}>
              Tres pasos. Sin implementación, sin permanencia.
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

      {/* 9 · LO QUE SE SUMA AL PLAN — add-ons con peso de PRODUCTO.

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
          <Kicker>Se suma a cualquier plan</Kicker>
          <h2 id="oferta" className={s.h2}>
            Sobre el plan encendés lo que te falta.
          </h2>
          <p className={s.lead}>
            Cada cosa se prende aparte y se paga aparte. No hay que saltar de
            plan para desbloquear una sola.
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
          <div className={s.offerFoot}>
            <p className={s.body} style={{ maxWidth: "46em" }}>
              <strong>{GRUPO.nombre}:</strong> {bs(GRUPO.mensual)} Bs/mes, con
              implementación desde {bs(GRUPO.implementacionDesde)} Bs.{" "}
              {GRUPO.copy}
            </p>
            <div className={s.actions}>
              <a className={s.link} href="/precios">
                Ver los precios completos y lo que no incluye →
              </a>
            </div>
          </div>
        </Reveal>
      </Block>

      {/* 10 · FAQ ──────────────────────────────────────────────────────
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

      {/* 11 · CIERRE ───────────────────────────────────────────────────
          El mismo CTA del hero, tercera y última vez. */}
      <Block surface="ink" labelledBy="v4-cierre">
        <Reveal>
          <div className={p.centro}>
            <h2 id="v4-cierre" className={s.display} style={{ maxWidth: "18ch" }}>
              {ALTA_VERBO_VOS} hoy y probalo con tu propio negocio.
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
