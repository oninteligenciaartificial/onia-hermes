import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PLANES, ADDONS, GRUPO, PRUEBA, bs } from "@/lib/pricing";
import {
  CHATBOT_PLAN,
  precioStack,
  precioAnual,
  fmtBs,
} from "@/content/chatbot-precios";
import { HUECO, FECHA_CONSULTA } from "@/lib/proof";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { EMPEZAR_URL } from "./nav";
import { ALTA_VERBO_VOS, CTA_ALTA, ctaAltaPlan } from "./alta";
import { Block, Shape, Btn, Kicker, JsonLd } from "./ui";
import { Switcher } from "./switcher";
import s from "./sitio.module.css";

/**
 * Portada del sitio (v3) — el ORDEN es el argumento (como Fanvue):
 *   hero (promesa de resultado) → banda de prueba verificable → hecho fuerte →
 *   manifiesto → agentes → chatbot → SWITCHER de rubros (estrella) →
 *   precios → FAQ → cierre.
 *
 * Las tres pantallas del hero, agentes y chatbot son CAPTURAS REALES del
 * producto. Donde todavía no hay clip va un placeholder de forma+color con el
 * ratio ya reservado, así el material real entra sin CLS. Precios y
 * capacidades salen SOLO de las fuentes (lib/pricing.ts,
 * content/chatbot-precios.ts, lib/proof.ts) — cero cifras a mano.
 */

/**
 * La imagen social es una captura REAL del sistema (el selector de rubro de
 * app.onia.com.bo), no un mockup. Regla de la casa: nada de pantallas
 * dibujadas haciendo de prueba. Viene de la v1 y se conserva.
 */
const OG_IMAGE = "/og/onia-rubros.jpg";

/**
 * El titular de la pestaña y el del buscador dicen lo MISMO que el h1.
 *
 * Hasta el 2026-09-01 los cuatro repetían el hero viejo ("Tu negocio no pierde
 * citas ni cobros mientras dormís") — se cambió el hero y el resultado de
 * Google habría seguido prometiendo la frase anterior. Una promesa que cambia
 * se barre en TODA la superficie, y el snippet es la primera.
 *
 * También se va el "Desde Bs 320" de las dos descripciones, por la misma razón
 * por la que se fue del hero: la escena que promete la página —el negocio
 * atendiendo de noche— la hace el asistente (add-on) más la agenda pública
 * sobre el plan, no el plan de Bs 320 solo. El precio completo, con lo que cada
 * nivel trae y lo que no, vive en /precios, que es donde se compra.
 */
const TITULO = "Onia · Cerrás vos, el negocio no | Software de gestión Bolivia";
const DESCRIPCION =
  "Onia es el sistema con el que llevás tu negocio en Bolivia: agenda, clientes, cobros e inventario, con un asistente que contesta fuera de horario y agentes que dejan el borrador listo para tu aprobación. 14 días gratis, sin tarjeta.";
const OG_TITULO = "Cerrás vos. El negocio no. — Onia, Bolivia";
const OG_DESCRIPCION =
  "Un negocio abre 9 horas. Las otras 15 hoy no las atiende nadie: el que pregunta a las once espera hasta mañana, si espera. Onia contesta, agenda y deja los avisos escritos para que vos los aprobés. 14 días gratis, sin tarjeta.";

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
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        // La captura es el selector de rubro, que es el primer paso en las DOS
        // ramas del alta: describirlo así no ata este alt a `./alta`.
        alt: "Pantalla real de Onia: elegís el rubro de tu negocio en el primer paso.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITULO,
    description: OG_DESCRIPCION,
    images: [OG_IMAGE],
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
 * ⚠️ DUPLICADO CONOCIDO. Esta misma constante vive en
 * (sitio)/chatbot/page.tsx:78 y en (sitio)/precios/page.tsx. Le corresponde
 * estar UNA vez, en content/chatbot-precios.ts, al lado del precio del que es
 * referencia — pero ese archivo está fuera de este carril. Anotado en el
 * reporte: mover la constante allá y que las tres pantallas la importen.
 */
const SALARIO_MINIMO_2026 = 3300;
const PCT_SALARIO = Math.round(
  (CHATBOT_PLAN.mensual / SALARIO_MINIMO_2026) * 100,
);

/**
 * FAQ de la portada — respuestas con los números TRAÍDOS de las fuentes.
 *
 * El verbo del alta NO se escribe acá: sale de `./alta`. El 23-ago se barrió a
 * mano a "pedís tu acceso" (el alta estaba cerrada) y cuando el alta se reabrió
 * esta respuesta quedó atrás pidiendo permiso para entrar a un formulario que ya
 * crea la cuenta sola. La prueba de 14 días sin tarjeta es cierta en las dos
 * ramas y es lo que se promete.
 *
 * Las cuatro preguntas nuevas (carga de datos, aprender a usarlo, dejar de
 * pagar, rubro fuera de la lista) son las que frenan la compra. Ninguna
 * respuesta se redactó de cero — cada una cita su fuente en el repo.
 */
const FAQ = [
  {
    q: "¿Necesito tarjeta para probar?",
    a: `No. La prueba de ${PRUEBA.dias} días no pide tarjeta ni pago: ${ALTA_VERBO_VOS}, elegís tu rubro y usás el sistema completo esos ${PRUEBA.dias} días.`,
  },
  {
    // lib/pricing.ts:283 (CONDICIONES) + (sitio)/empezar/page.tsx:79 (paso 02).
    q: "¿Los datos del Excel o del cuaderno los cargo yo?",
    a: "No arrancás con la pantalla vacía: te entregamos el sistema con la configuración de tu rubro puesta y alguien que te la explica. En los tres planes no cobramos implementación ni migración — el checkout cobra solo el plan. Grupo / Empresarial sí lleva implementación acompañada y se cotiza aparte.",
  },
  {
    // (sitio)/empezar/page.tsx:79 — "alguien que te la explica".
    q: "¿Y si no sé de computación? ¿Quién me enseña?",
    a: "Nadie instala nada ni arranca un proyecto de meses: te entregamos la cuenta con la configuración de tu rubro puesta y alguien que te la explica. Si te trabás después, escribinos por WhatsApp.",
  },
  {
    // content/legal/terminos.md:83 (sin permanencia) y §3.4 (mora: gracia →
    // suspensión con datos intactos, nunca borrado inmediato) + pricing.ts:284.
    q: "¿Y si dejo de pagar, pierdo todo?",
    a: "No. No hay contrato de permanencia: podés no renovar, sin penalidad. Si un pago no entra, primero hay un período de gracia con el servicio activo y avisos; después el acceso se suspende, pero tus datos se conservan intactos — la suspensión nunca implica borrarlos. Y los exportás en CSV desde el plan más chico.",
  },
  {
    // (sitio)/rubros/page.tsx:78-80 y (sitio)/contacto/page.tsx:118-121.
    q: "¿Sirve para mi rubro si no está en la lista?",
    a: "Onia no es un software distinto por industria: es el mismo núcleo con módulos y vocabulario propios. Hoy la cuenta se arma sola para los cinco rubros que ves en Rubros. ¿El tuyo es otro? Escribinos por WhatsApp y lo vemos con tu caso.",
  },
  {
    q: "¿La factura al SIN ya funciona?",
    a: "Nuestro emisor está registrado ante el SIN y la homologación está en trámite. Mientras tanto cada venta queda lista y facturás en el Portal Web del SIN, gratis y legal. Te avisamos apenas concluya. Está contado entero, con las resoluciones y las fechas, en la página de facturación.",
  },
  {
    q: "¿El chatbot de WhatsApp está incluido?",
    a: `No: es un servicio aparte, ${precioStack(CHATBOT_PLAN)}. El botón de WhatsApp de tu web sí va gratis.`,
  },
  {
    q: "¿Mis datos son míos?",
    a: "Sí. Los exportás en CSV cuando quieras, en cualquier plan pago. No vendemos datos ni entrenamos modelos con ellos.",
  },
];

/**
 * "Un día con Onia" — las tres escenas que acompañan al manifiesto.
 *
 * El manifiesto era una frase suspendida: explicaba QUÉ ES el sistema y no
 * mostraba nunca QUÉ PASA en un negocio. Sergio, textual: "mostrar usos
 * prácticos".
 *
 * Son fotos de CONTEXTO, no de producto: una persona en su negocio, ningún
 * dispositivo con pantalla legible. La interfaz sigue siendo captura REAL y
 * vive en sus propios bloques (hero, agentes, chatbot, conmutador). Reglas,
 * shot list y gate: hermes-content/docs/ONIA_WEB_IMAGENES_DE_CONTEXTO.md
 *
 * Cada línea es un RESULTADO, y cada resultado es una capacidad YA publicada
 * en este mismo sitio — acá no se promete nada nuevo:
 *   · mañana → switcher.tsx:50 (agenda del día: hora, motivo y teléfono)
 *   · tarde  → switcher.tsx:51 (caja: total del día por método de pago)
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
      "Bajás la persiana y el paquete que quedó por la mitad no se pierde: a la mañana te espera el borrador de a quién llamar, para que lo apruebes.",
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
      description:
        "Sistema de gestión con IA para negocios en Bolivia: agenda, clientes, cobros, facturación y agentes con aprobación humana.",
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
  { hora: "Domingo", que: "Reservan la cita solos, por tu agenda pública." },
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

export default function Portada() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      {/* 1 · HERO — "el resultado": el día del negocio, DIBUJADO.

          Aprobado por Sergio el 2026-09-01 sobre la pieza suelta de
          hermes-content/references/ui-patterns/hero-onia/resultado/. De tres
          direcciones ganó ésta; el titular no se toca.

          Lo que sale y por qué:
           · la CAPTURA del panel. Sergio, 2026-09-01: "no coloques capturas
             literales del sistema, se ve mal, coloca cosas referenciales". El
             hero no lleva ni una imagen — el día se dibuja con divs y color.
           · "Ver precios" como segundo botón. La escena que dibuja el hero la
             hace el asistente (add-on) sobre el plan: mandar a la tabla de
             precios desde acá es prometer un número que no compra esta imagen.
             /precios sigue en el header, en el pie y en la sección 8.
           · la nota de "14 días gratis · sin tarjeta". No se pierde: es la
             banda de prueba que viene JUSTO abajo, y la primera pregunta de la
             FAQ. Repetirla acá le sacaba aire al argumento del día. */}
      <Block surface="paper" className={s.heroBlock}>
        <Reveal>
          <div className={`${s.split} ${s.heroTop}`}>
            <div>
              <Kicker>Un negocio abre 9 horas</Kicker>
              <h1 className={s.display}>
                Cerrás vos.
                <br />
                El negocio <em>no</em>.
              </h1>
            </div>
            <div>
              <p className={s.lead}>
                <b>Onia es el sistema con el que llevás el negocio.</b> Y no
                cierra cuando cerrás vos.
              </p>
              <p className={s.cost}>
                Fuera de horario hoy no contesta nadie.{" "}
                <b>El que pregunta espera hasta mañana.</b> Si espera.
              </p>
              <div className={s.actions}>
                {/* El verbo tiene que ser el del destino, y el destino cambia:
                    por eso sale de `./alta` y no se escribe acá. Prometer un
                    botón que el producto no cumple —en cualquiera de los dos
                    sentidos— pierde al lead en el último clic. */}
                <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
                <Btn href={WA_URL_LANDING} variant="line" external>
                  Escribinos por WhatsApp
                </Btn>
              </div>
              <p className={s.puerta}>
                <em>El asistente</em> es la puerta. Adentro está el sistema:{" "}
                <b>agenda, clientes, cobros e inventario</b>.
              </p>
            </div>
          </div>
        </Reveal>

        {/* pendiente: prueba real (cero clientes pagando ⇒ ni logos ni
            testimonios; los hechos verificables van en la banda de abajo) */}

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

      {/* 2 · BANDA DE PRUEBA — solo hechos verificables, cero logos/testimonios */}
      <Block surface="paperDim">
        <Reveal>
          <div className={s.trust}>
            <div className={s.trustCell}>
              <div className={s.trustNum}>5</div>
              <p className={s.trustLabel}>rubros vivos en producción hoy</p>
            </div>
            <div className={s.trustCell}>
              <div className={s.trustNum}>24/7</div>
              <p className={s.trustLabel}>agentes que trabajan y esperan tu aprobación</p>
            </div>
            <div className={s.trustCell}>
              <div className={s.trustNum}>{PRUEBA.dias} días</div>
              <p className={s.trustLabel}>de prueba, sin tarjeta</p>
            </div>
            <div className={s.trustCell}>
              <div className={s.trustNum}>CSV</div>
              <p className={s.trustLabel}>tus datos salen cuando quieras</p>
            </div>
          </div>
        </Reveal>
      </Block>

      {/* 3 · HECHO FUERTE — el hueco de mercado, sourced (proof.ts) */}
      <Block surface="green" labelledBy="hecho">
        <Reveal>
          <Kicker>El hueco</Kicker>
          <p id="hecho" className={s.h2} style={{ maxWidth: "22ch" }}>
            {HUECO}
          </p>
          <p className={s.body} style={{ fontSize: "1.15em" }}>
            Onia unifica la gestión y los agentes con IA en un solo sistema,
            hecho para Bolivia.
          </p>
          <p className={s.note} style={{ marginTop: "1.6em" }}>
            Comparación de precios y capacidades publicadas por la competencia,
            consultadas el {FECHA_CONSULTA}.
          </p>
          <div className={s.actions}>
            <a className={s.link} href="/comparativa">
              Ver la comparación, con nombres y precios →
            </a>
          </div>
        </Reveal>
      </Block>

      {/* 4 · UN DÍA CON ONIA — el manifiesto deja de estar suspendido: la
          frase que dice QUÉ ES queda arriba, y debajo van tres momentos del
          día que muestran QUÉ PASA. Fotos de contexto (ver DIA, arriba); la
          interfaz sigue siendo captura real y vive en los otros bloques. */}
      <Block surface="paper" labelledBy="que-es">
        <Reveal>
          <Kicker>Un día con Onia</Kicker>
          <p id="que-es" className={s.h2} style={{ maxWidth: "24ch" }}>
            Onia es un solo sistema de gestión con IA: agenda, clientes, cobros y
            contabilidad, con agentes que esperan tu aprobación.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className={s.scenes}>
            {DIA.map((escena) => (
              <div key={escena.id}>
                <div className={s.foto}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin sharp: next/image no optimiza en el VPS */}
                  <img
                    src={`/contexto/${escena.id}.webp`}
                    alt={escena.alt}
                    width={FOTO_DIA.w}
                    height={FOTO_DIA.h}
                    loading="lazy"
                    decoding="async"
                    className={s.fotoImg}
                  />
                </div>
                <p className={s.sceneHora}>{escena.momento}</p>
                <p className={s.sceneTexto}>{escena.texto}</p>
              </div>
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
                Contesta al instante con la información real que vos
                publicaste. No inventa ni cotiza por su cuenta: lo que no sabe
                te lo pasa con la conversación entera. Se suma a cualquier
                plan.
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
      </Block>

      {/* 7 · SWITCHER DE RUBROS — la sección estrella */}
      <Block surface="paper" labelledBy="rubros">
        <Reveal>
          <Kicker>Un solo sistema</Kicker>
          <h2 id="rubros" className={s.h2}>
            Elegís tu rubro y la cuenta ya viene armada.
          </h2>
          <p className={s.lead}>
            No es un software distinto por industria: es el mismo núcleo con
            módulos y vocabulario propios. Un dentista ve pacientes; una
            ferretería ve productos y fiados.
          </p>
        </Reveal>
        <Switcher />
        <Reveal>
          <p className={s.note}>Cinco rubros vivos y vendibles hoy.</p>
          <div className={s.actions}>
            <a className={s.link} href="/rubros">
              Ver los rubros por dentro →
            </a>
          </div>
        </Reveal>
      </Block>

      {/* 8 · PRECIOS — resumen (fuente: lib/pricing.ts) → apartado */}
      <Block surface="paperDim" labelledBy="precios">
        <Reveal>
          <Kicker>Precios claros</Kicker>
          <h2 id="precios" className={s.h2}>
            Tres pasos. Sin implementación, sin permanencia.
          </h2>
        </Reveal>
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
                <p className={s.planResult}>{plan.resultado}</p>
                <ul className={s.planList}>
                  {plan.incluye.slice(0, 4).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {/* Lo que el nivel NO trae, dicho acá y no en la letra chica
                    (lib/pricing.ts:65 lo define y hasta hoy solo lo renderizaba
                    la landing vieja /v1). No es una advertencia: es lo que hace
                    entender por qué existe el escalón de arriba. Por eso va
                    debajo, más chico y más apagado que `incluye` — mismo
                    componente de lista, jerarquía menor. */}
                <p className={s.planStep} style={{ marginTop: "1.1em" }}>
                  Qué no lleva
                </p>
                {/* opacity 0.85 y no menos: .planList ya viene a 82% de
                    currentColor, así que esto queda en ~70% efectivo — por
                    encima del 62% que .planStep midió en 4,95:1. Bajar a 0.7
                    daría ~57% y caería del 4,5:1. La jerarquía la hace el
                    tamaño, no apagar el texto hasta que no se lea. */}
                <ul
                  className={s.planList}
                  style={{ marginTop: "0.35em", fontSize: "0.86em", opacity: 0.85 }}
                >
                  {plan.sinEsto.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className={s.planFoot}>
                  <Btn href={EMPEZAR_URL}>{ctaAltaPlan(plan.nombre)}</Btn>
                </div>
              </div>
            ))}
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
                Es el <b>{PCT_SALARIO} % del salario mínimo nacional 2026</b>{" "}
                (Bs {fmtBs(SALARIO_MINIMO_2026)}, según el DS 5516), sin
                aguinaldo ni domingos, por algo que atiende las 24 horas.
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

      {/* 10 · FAQ — objeciones reales, respuestas honestas */}
      <Block surface="paperDim" labelledBy="faq">
        <Reveal>
          <Kicker>Preguntas frecuentes</Kicker>
          <h2 id="faq" className={s.h2}>
            Lo que preguntan antes de empezar.
          </h2>
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

      {/* 11 · CIERRE — una frase + el mismo CTA, en verde señal (texto oscuro) */}
      <Block surface="signal" labelledBy="cierre">
        <Reveal>
          <h2 id="cierre" className={s.display} style={{ maxWidth: "18ch" }}>
            Probá Onia {PRUEBA.dias} días. Sin tarjeta.
          </h2>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
            <Btn href={WA_URL_LANDING} variant="line" external>
              Hablar por WhatsApp
            </Btn>
          </div>
          <div className={s.actions} style={{ marginTop: "1.2em" }}>
            <a className={s.link} href="/contacto">
              O agendá una demo con horario →
            </a>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
