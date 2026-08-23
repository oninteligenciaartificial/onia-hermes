import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PLANES, ADDONS, GRUPO, PRUEBA, bs } from "@/lib/pricing";
import { CHATBOT_PLAN, precioStack } from "@/content/chatbot-precios";
import { HUECO, FECHA_CONSULTA } from "@/lib/proof";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { EMPEZAR_URL } from "./nav";
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

const TITULO = "Onia · Tu negocio no pierde citas ni cobros | Bolivia";
const DESCRIPCION =
  "Onia es el sistema de gestión con inteligencia artificial para negocios en Bolivia: agenda, clientes, cobros y agentes que trabajan 24/7 con tu aprobación. Desde Bs 320 al mes. Probalo 14 días gratis, sin tarjeta.";
const OG_TITULO = "Tu negocio no pierde citas ni cobros — Onia, Bolivia";
const OG_DESCRIPCION =
  "Onia recuerda cada cita, persigue cada deuda y hace volver al cliente que se enfrió. Vos aprobás; el sistema hace. Desde Bs 320/mes, 14 días gratis.";

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
        alt: "Pantalla real de Onia: elegís el rubro de tu negocio al crear la cuenta.",
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

/* FAQ de la portada — respuestas con los números TRAÍDOS de las fuentes. */
const FAQ = [
  {
    q: "¿Necesito tarjeta para probar?",
    a: `No. La prueba de ${PRUEBA.dias} días no pide tarjeta ni pago: te registrás, elegís tu rubro y usás el sistema completo.`,
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

export default function Portada() {
  return (
    <>
      <JsonLd data={JSON_LD} />
      {/* 1 · HERO — promesa de RESULTADO, no de categoría abstracta */}
      <Block surface="paper">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Software de gestión con IA · Bolivia</Kicker>
              <h1 className={s.display}>
                Tu negocio no pierde <em>citas ni cobros</em> mientras dormís.
              </h1>
              <p className={s.lead}>
                Onia agenda las citas, persigue los cobros y hace volver al
                cliente que se enfrió. Vos aprobás; el sistema hace.
              </p>
              <div className={s.actions}>
                <Btn href={EMPEZAR_URL}>Probá {PRUEBA.dias} días gratis</Btn>
                <Btn href="/precios" variant="line">
                  Ver precios
                </Btn>
              </div>
              <p className={s.note} style={{ marginTop: "1.2em" }}>
                Sin tarjeta · sin implementación · tus datos se exportan en CSV
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Shape
              tone="green"
              ratio="4 / 3"
              src="/v2/capturas/panel.webp"
              width={2160}
              height={1620}
              alt="Panel de Onia mostrando el dia de una ferreteria: Bs 4.633,40 cobrados en 11 tickets, como le pagaron, el corte de caja y una propuesta del agente esperando aprobacion."
            />
          </Reveal>
        </div>
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

      {/* 4 · MANIFIESTO — qué es Onia, en una frase */}
      <Block surface="paper" labelledBy="que-es">
        <Reveal>
          <p id="que-es" className={s.h2} style={{ maxWidth: "24ch" }}>
            Onia es un solo sistema de gestión con IA: agenda, clientes, cobros y
            contabilidad, con agentes que esperan tu aprobación.
          </p>
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
            <Shape
              tone="signal"
              ratio="4 / 3"
              src="/v2/capturas/agentes.webp"
              width={1680}
              height={1260}
              alt="Pantalla de agentes de Onia con las propuestas que dejaron trabajando de noche, cada una esperando que el dueno apruebe."
            />
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
            <Shape
              tone="green"
              ratio="4 / 3"
              src="/v2/capturas/whatsapp.webp"
              width={2160}
              height={1620}
              alt="Editor del chatbot de WhatsApp en Onia: el negocio escribe su horario, sus servicios y como habla, y el bot contesta con eso."
            />
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
                <div className={s.planFoot}>
                  <Btn href={EMPEZAR_URL}>Probar {plan.nombre}</Btn>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* 9 · OFERTA COMPLETA — add-ons y Grupo. Sergio, 2026-08-22: "solo veo 3
          precios, hay que mostrar todo lo que ofrecemos". Cada monto sale de la
          MISMA fuente que /precios (lib/pricing.ts → ADDONS y GRUPO), así que
          no puede haber dos números del mismo servicio. */}
      <Block surface="paper" labelledBy="oferta">
        <Reveal>
          <Kicker>Todo lo que ofrecemos</Kicker>
          <h2 id="oferta" className={s.h2}>
            No son solo tres planes.
          </h2>
          <p className={s.lead}>
            Sobre cualquier plan encendés lo que te haga falta y pagás solo eso.
            Nada de saltar de plan para desbloquear una sola cosa.
          </p>
          <div className={s.rows}>
            {ADDONS.map((addon) => (
              <div key={addon.nombre} className={s.row}>
                <span className={s.rowName}>
                  {addon.href ? (
                    <a className={s.link} href={addon.href}>
                      {addon.nombre} →
                    </a>
                  ) : (
                    addon.nombre
                  )}
                </span>
                <p className={s.rowText}>{addon.copy}</p>
                <span className={s.rowPrice}>{addon.precio}</span>
              </div>
            ))}
          </div>
          <p className={s.body} style={{ marginTop: "2.2em", maxWidth: "46em" }}>
            <strong>{GRUPO.nombre}:</strong> {bs(GRUPO.mensual)} Bs/mes, con
            implementación desde {bs(GRUPO.implementacionDesde)} Bs.{" "}
            {GRUPO.copy}
          </p>
          <div className={s.actions}>
            <a className={s.link} href="/precios">
              Ver los precios completos y lo que no incluye →
            </a>
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
            <Btn href={EMPEZAR_URL}>Empezá gratis</Btn>
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
