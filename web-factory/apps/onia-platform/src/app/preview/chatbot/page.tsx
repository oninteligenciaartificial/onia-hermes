import { Reveal } from "@/motion";
import {
  CHATBOT_PLAN,
  precioStack,
  CUPO_MENSUAL,
  A_MEDIDA,
} from "@/content/chatbot-precios";
import { WA_URL_LANDING } from "@/lib/site";
import { Block, Shape, Btn, Kicker } from "../ui";
import s from "../preview.module.css";

/**
 * Apartado del CHATBOT. Montos SOLO de content/chatbot-precios.ts (que copia
 * onia-platform/lib/pricing.ts → WHATSAPP_ADDON, ratificado 2026-08-15). Sin
 * imágenes: la conversación se reserva como forma para un clip futuro.
 */
export default function PreviewChatbot() {
  const bot = CHATBOT_PLAN;
  return (
    <>
      <Block surface="paper">
        <div className={s.split}>
          <Reveal>
            <div>
              <Kicker>Chatbot de WhatsApp</Kicker>
              <h1 className={s.display}>
                El que escribe a las once ya tiene <em>respuesta</em>.
              </h1>
              <p className={s.lead}>
                No es un menú de opciones: es un bot con IA entrenado con el
                contenido real de tu negocio, que contesta, califica y te deriva
                el caso con contexto.
              </p>
              <div className={s.actions}>
                <Btn href={WA_URL_LANDING} external>
                  Pedir el chatbot
                </Btn>
                <Btn href="/preview/precios" variant="line">
                  Ver precios
                </Btn>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Shape tone="green" ratio="3 / 4" tag="Conversación" />
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
          <p className={s.body} style={{ maxWidth: "48em" }}>
            {CUPO_MENSUAL} conversaciones por mes incluidas: al llegar, corta —
            nunca una factura sorpresa. Lo que Meta cobre por los mensajes que
            iniciás va aparte; responder dentro de las 24 horas desde que el
            cliente escribe no lo cobra Meta. {A_MEDIDA}
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
