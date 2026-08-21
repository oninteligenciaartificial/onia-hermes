import { Reveal } from "@/motion";
import {
  A_MEDIDA,
  CHATBOT_STACKS,
  META_NOTA,
  fmtBs,
} from "@/content/chatbot-precios";
import { Pantalla } from "./pantalla";
import styles from "./v2.module.css";

/**
 * 5. CHATBOT — un solo mensaje: el que escribe a las once ya tiene respuesta.
 *
 * Leyes aplicadas:
 *  · §3 → dos capturas REALES del bot contestando (el saludo con botones y el
 *    pedido derivado). Son la misma conversación en dos momentos, por eso la
 *    segunda baja: dos momentos, no dos objetos gemelos.
 *  · 5-6 → escalera de niveles como celdas de pelo sobre hairlines, sin
 *    tarjetas; el texto en su propia medida.
 *  · 2-3 → los títulos de nivel bajan del display con el mismo peso 500.
 *
 * Los montos NO viven acá: salen de src/content/chatbot-precios.ts, que a su
 * vez cita `onia-platform/lib/pricing.ts → WHATSAPP_ADDON.tiers`. Un precio en
 * la landing que no salga del código que cobra es un precio inventado.
 */
export function ChatbotV2() {
  return (
    <section className={styles.section} aria-labelledby="v2-bot">
      <div className={styles.container}>
        <Reveal>
          <p className={styles.kicker}>Chatbot de WhatsApp</p>
          <h2 id="v2-bot" className={`${styles.titulo} ${styles.medida}`}>
            El que escribe a las once de la noche ya tiene respuesta.
          </h2>
          <p className={styles.lead}>
            No es un menú de opciones: es un bot con IA entrenado con el
            contenido real de tu negocio, que contesta, califica y te deriva el
            caso con contexto. Se suma a cualquier plan.
          </p>
        </Reveal>

        <div className={styles.botGrid}>
          <Reveal delay={0.06}>
            <div className={styles.botCapturas}>
              <Pantalla
                src="/v2/bot-saludo.webp"
                alt="Conversación real: el bot de Onia se presenta como asistente del negocio, avisa que está respondiendo fuera de horario y ofrece los botones Horarios, Servicios y Hablar con el dueño."
                ancho={406}
                alto={656}
              />
              <Pantalla
                src="/v2/bot-pedido.webp"
                alt="Conversación real: el cliente escribe que quiere comprar 100 tornillos y el bot le confirma que ya le pasó el pedido al dueño por ese mismo chat."
                ancho={406}
                alto={656}
              />
            </div>
            <p className={styles.pie}>
              Conversación real con el bot de una cuenta de prueba, del saludo al
              pedido derivado
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className={styles.escalera}>
              {CHATBOT_STACKS.map((stack) => (
                <div
                  key={stack.id}
                  className={`${styles.escalon} ${
                    stack.destacado ? styles.escalonDestacado : ""
                  }`}
                >
                  <span className={styles.escalonNivel}>{stack.nivel}</span>
                  <div>
                    <h3>{stack.nombre}</h3>
                    <p>{stack.resuelve}</p>
                  </div>
                  <p className={styles.escalonPrecio}>
                    <b>Bs {fmtBs(stack.mensual)}/mes</b>
                    sin instalación
                  </p>
                </div>
              ))}
            </div>
            {/* 2026-08-21: se cayo el cupo de 500 conversaciones (no hay
                contador ni corte en el codigo) y el +20 % sobre Meta (el
                cliente le paga a Meta directo). El texto sale de META_NOTA. */}
            <p className={styles.nota} style={{ marginTop: "1.2rem" }}>
              {META_NOTA} {A_MEDIDA}
            </p>
            <div className={styles.acciones}>
              <a className={styles.link} href="/chatbot">
                Ver el detalle y los requisitos →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
