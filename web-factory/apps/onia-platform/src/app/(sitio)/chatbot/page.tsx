import type { Metadata } from "next";
import { Reveal } from "@/motion";
import {
  CHATBOT_PLAN,
  precioStack,
  precioAnual,
  META_NOTA,
  A_MEDIDA,
  fmtBs,
} from "@/content/chatbot-precios";
import { WA_URL_LANDING, SITE_URL } from "@/lib/site";
import { Block, Shape, Btn, Kicker, JsonLd } from "../ui";
import s from "../sitio.module.css";

export const metadata: Metadata = {
  title: "Chatbot de WhatsApp — precio publicado | Onia",
  description: `Chatbot de WhatsApp que contesta 24/7 con la información real de tu negocio y deriva a una persona lo que necesite decisión. Bs ${fmtBs(CHATBOT_PLAN.mensual)}/mes, sin instalación. Los requisitos, a la vista antes de contratar. Hecho en Bolivia.`,
  alternates: { canonical: "/chatbot" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Chatbot de WhatsApp — precio publicado",
    description: `Contesta al instante a cualquier hora con lo que vos cargaste, y deriva el resto. Bs ${fmtBs(CHATBOT_PLAN.mensual)}/mes, con los requisitos publicados.`,
    url: "/chatbot",
  },
};

/** Breadcrumb + Service: venían de la v1 (/chatbot) y se conservan tal cual. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Chatbot WhatsApp", item: `${SITE_URL}/chatbot` },
      ],
    },
    {
      "@type": "Service",
      name: "Chatbot de WhatsApp para negocios",
      serviceType: "Automatización de WhatsApp con inteligencia artificial",
      description:
        "Chatbot de WhatsApp que contesta 24/7 con la información real que el negocio publicó y deriva a una persona lo que no sabe. Lo que salga del alcance se cotiza a medida.",
      provider: { "@type": "Organization", name: "Onia", url: `${SITE_URL}/` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      url: `${SITE_URL}/chatbot`,
      offers: {
        "@type": "Offer",
        name: CHATBOT_PLAN.nombre,
        price: String(CHATBOT_PLAN.mensual),
        priceCurrency: "BOB",
        category: "Suscripción mensual",
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

/**
 * Anclaje de valor del precio. Estaba escrito desde el 2026-08-21 en un
 * COMENTARIO de content/chatbot-precios.ts:33-34 y nunca se publicó: es el
 * mejor argumento de precio del repo y no lo veía ningún comprador.
 *
 * Se puede publicar porque NO es una cifra inventada: el salario mínimo
 * nacional 2026 es dato público con fuente legal (DS 5516), y por eso la
 * fuente se muestra en pantalla junto al número.
 *
 * El porcentaje se DERIVA de `CHATBOT_PLAN.mensual` en vez de escribirse "12":
 * si mañana cambia el precio en content/chatbot-precios.ts (la fuente única),
 * la frase se mueve sola en lugar de quedar mintiendo. Hoy: 390 / 3.300 =
 * 11,8 % → 12 %.
 *
 * ⚠️ La constante vive acá y no en content/chatbot-precios.ts —que es donde
 * corresponde, al lado del precio del que es referencia— porque este carril
 * solo toca las páginas del sitio. Anotado en el reporte.
 */
const SALARIO_MINIMO_2026 = 3300;
const PCT_SALARIO = Math.round((CHATBOT_PLAN.mensual / SALARIO_MINIMO_2026) * 100);

/**
 * Apartado del CHATBOT. Montos y promesa SOLO de content/chatbot-precios.ts,
 * que es la fuente única (pricing.ts → ADDONS lee de ahí). El copy vende lo
 * que el bot HACE — contesta a cualquier hora con la info que el negocio
 * cargó, no inventa, y deriva a una persona — y no nombra lo que no existe.
 * Sin imágenes: la conversación se reserva como forma para un clip futuro.
 */
export default function Chatbot() {
  const bot = CHATBOT_PLAN;
  return (
    <>
      <JsonLd data={JSON_LD} />
      <Block surface="paper">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Chatbot de WhatsApp</Kicker>
              <h1 className={s.display}>
                El que escribe a las once ya tiene <em>respuesta</em>.
              </h1>
              <p className={s.lead}>
                Contesta al instante a cualquier hora —también el domingo y el
                feriado— con la información real que vos publicaste. Y cuando
                el caso necesita una persona, te lo pasa con la conversación
                entera.
              </p>
              <div className={s.actions}>
                <Btn href={WA_URL_LANDING} external>
                  Pedir el chatbot
                </Btn>
                <Btn href="/precios" variant="line">
                  Ver precios
                </Btn>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {/* Ranura cableada con la ÚNICA captura publicable del chatbot.
                Descartadas tras abrirlas: bot-saludo / bot-pedido /
                editor-chatbot / editor-chatbot-movil son todas del lote viejo
                (18-ago) y muestran datos de QA en pantalla — "ZZ QA Clinica
                Chatbot", "ZZ QA Ferreteria Tornillo", el nombre de Sergio, un
                "Atendemos Atendemos" duplicado y un "(aud 11:52)" de debug.
                Publicar eso en la pantalla de venta es exhibir el banco de
                pruebas. El lote de capturas/ (21-ago) es el limpio.

                El ratio pasa de 3/4 a 4/3 porque es el del archivo: forzar un
                4/3 dentro de un 3/4 con object-fit:cover + object-position:top
                left recortaba justo la derecha, o sea el panel "Probá tu bot",
                que es la mitad del argumento. Sigue siendo el <Shape> el que
                reserva el ratio, así que CLS cero. Es además el ratio que usan
                las otras cuatro capturas del sitio. */}
            <Shape
              tone="green"
              ratio="4 / 3"
              src="/v2/capturas/whatsapp.webp"
              width={2160}
              height={1620}
              alt="Editor del chatbot de Onia: el negocio carga su nombre, a quién deriva, cómo se presenta el bot y sus horarios, y al lado lo prueba escribiendo como si fuera el cliente."
            />
          </Reveal>
        </div>
      </Block>

      {/* Qué resuelve */}
      <Block surface="ink" labelledBy="resuelve">
        <Reveal>
          <Kicker>Qué resuelve</Kicker>
          <h2 id="resuelve" className={s.h2}>
            {bot.nombre}.
          </h2>
          <p className={s.body} style={{ fontSize: "1.15em" }}>
            {bot.resuelve}
          </p>
          <p className={s.note} style={{ marginTop: "1.4em" }}>
            Para: {bot.paraQuien}
          </p>
        </Reveal>
      </Block>

      {/* Qué incluye */}
      <Block surface="paper" labelledBy="incluye">
        <Reveal>
          <Kicker>Qué incluye</Kicker>
          <h2 id="incluye" className={s.h2}>
            Todo lo que entra en el servicio.
          </h2>
          <ul className={s.planList} style={{ marginTop: "2em", maxWidth: "46em" }}>
            {bot.incluye.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </Block>

      {/* Necesitás vos / No incluye */}
      <Block surface="paperDim" labelledBy="requisitos">
        <div className={s.split}>
          <Reveal>
            <div>
              <h2 id="requisitos" className={s.h3}>
                Lo que necesitás vos
              </h2>
              <ul className={s.planList} style={{ marginTop: "1.2em" }}>
                {bot.necesitasVos.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div>
              <h2 className={s.h3}>Lo que no incluye</h2>
              <ul className={s.planList} style={{ marginTop: "1.2em" }}>
                {bot.noIncluye.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Block>

      {/* Precio */}
      <Block surface="green" labelledBy="precio">
        <Reveal>
          <Kicker>Precio</Kicker>
          <p id="precio" className={s.h2} style={{ maxWidth: "20ch" }}>
            {precioStack(bot)}.
          </p>
          {/* El anclaje va ANTES de la letra chica de Meta: es lo que convierte
              el número en una comparación, no un dato más. La fuente legal se
              muestra — un anclaje sin fuente es una cifra inventada. */}
          <p
            className={s.body}
            style={{ maxWidth: "44em", fontSize: "1.15em" }}
          >
            Es el {PCT_SALARIO} % del salario mínimo nacional 2026 (Bs{" "}
            {fmtBs(SALARIO_MINIMO_2026)}, según el DS 5516), sin aguinaldo ni
            domingos, por algo que atiende las 24 horas.
          </p>
          <p className={s.body} style={{ maxWidth: "48em" }}>
            O {precioAnual(bot)}. {META_NOTA} {A_MEDIDA}
          </p>
          <div className={s.actions}>
            <Btn href={WA_URL_LANDING} external>
              Pedir el chatbot
            </Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
