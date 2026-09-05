import type { Metadata } from "next";
import { Reveal } from "@/motion";
import {
  CHATBOT_PLAN,
  precioStack,
  precioAnual,
  META_NOTA,
  A_MEDIDA,
  fmtBs,
  SALARIO_MINIMO,
  pctDelSalarioMinimo,
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
 * El monto y el porcentaje salen de content/chatbot-precios.ts, la fuente
 * única, al lado del precio del que son referencia: las dos mitades de la
 * frase se mueven por separado —el DS cambia el salario, Sergio cambia el
 * precio— y escritas acá cualquiera dejaba a la otra mintiendo. Hasta el
 * 2026-09-04 esta constante estaba tipeada también en la portada y en
 * /precios; lo sostuvo un comentario que decía que la fuente estaba "fuera de
 * este carril", y era falso. Ver (sitio)/salario-minimo.test.ts.
 */
const PCT_SALARIO = pctDelSalarioMinimo();

/**
 * Apartado del CHATBOT. Montos y promesa SOLO de content/chatbot-precios.ts,
 * que es la fuente única (pricing.ts → ADDONS lee de ahí). El copy vende lo
 * que el bot HACE — contesta a cualquier hora con la info que el negocio
 * cargó, no inventa, y deriva a una persona — y no nombra lo que no existe.
 * Sin imágenes: la conversación se DIBUJA con divs (ver <Shape> en ../ui).
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
            {/* La conversacion se DIBUJA. Antes acá iba whatsapp.webp, el
                editor real del chatbot: Sergio, 2026-09-01, textual —"no
                coloques capturas literales del sistema, se ve mal, coloca
                cosas referenciales". El panel no muestra la pantalla que hay
                que aprender a usar, muestra el resultado: el que escribió a
                las 23:40 ya tiene su horario contestado. */}
            <Shape tone="green" panel="chat" />
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
            Es el {PCT_SALARIO} % del salario mínimo nacional{" "}
            {SALARIO_MINIMO.anio} (Bs {fmtBs(SALARIO_MINIMO.monto)}, según el{" "}
            {SALARIO_MINIMO.norma}), sin aguinaldo ni domingos, por algo que
            atiende las 24 horas.
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
