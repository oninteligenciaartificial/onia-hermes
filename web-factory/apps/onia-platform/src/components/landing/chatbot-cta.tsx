import { Reveal, SplitTextReveal, StaggerGrid, StaggerItem } from "@/motion";
import { CHATBOT_STACKS, fmtBs } from "@/content/chatbot-precios";
import styles from "./landing.module.css";

/**
 * Chatbot de WhatsApp — seccion propia (antes era una card perdida en el
 * carrusel). Split editorial: el telefono con la conversacion VIVA a la
 * izquierda, la tarjeta del nivel unico a la derecha (la escalera N1-N2-N3
 * se retiro el 2026-08-15; ver src/content/chatbot-precios.ts).
 *
 * Reglas que no se negocian:
 *  - Los montos salen de src/content/chatbot-precios.ts (fuente unica).
 *  - Se dice de frente que se contrata APARTE de los planes, y que el boton
 *    de WhatsApp de la web va gratis — lo que se cobra es el bot con IA.
 */
export function ChatbotCta() {
  return (
    <section className={styles.section} id="chatbot">
      <div className={styles.container}>
        <span className={styles.kicker}>Chatbot de WhatsApp · se contrata aparte</span>
        <div style={{ marginTop: "0.5rem" }}>
          <SplitTextReveal
            as="h2"
            className={styles.sectionTitle}
            text="Atiende el mensaje de las 11 de la noche."
          />
        </div>
      </div>

      <div className={`${styles.container} ${styles.botGrid}`}>
        <Reveal className={styles.botPhoneWrap} from="left">
          <div
            className={styles.botPhone}
            role="img"
            aria-label="Conversación de WhatsApp un domingo a las 22:47: un cliente pregunta si atienden el lunes feriado, el chatbot de Onia responde el horario, ofrece las 10:15 y deja la cita agendada."
          >
            <div className={styles.botPhoneBar}>
              <span className={styles.botAvatar} aria-hidden>
                CA
              </span>
              <div>
                <b>Clínica Andina</b>
                <br />
                <span>responde al instante</span>
              </div>
            </div>
            {/* la conversación AVANZA mensaje a mensaje hasta cerrar la cita
                sin que nadie del negocio conteste — eso es lo que se vende */}
            <StaggerGrid className={`${styles.chat} ${styles.botChat}`} stagger={0.65} repetir>
              <StaggerItem as="span" className={styles.botHora}>
                domingo · 22:47
              </StaggerItem>
              <StaggerItem as="span" className={`${styles.bub} ${styles.bubThem}`}>
                ¿Atienden el lunes feriado?
              </StaggerItem>
              <StaggerItem as="span" className={`${styles.bub} ${styles.bubUs}`}>
                Sí, de 9:00 a 13:00. ¿Te reservo un horario?
              </StaggerItem>
              <StaggerItem as="span" className={`${styles.bub} ${styles.bubThem}`}>
                Dale, a media mañana.
              </StaggerItem>
              <StaggerItem as="span" className={`${styles.bub} ${styles.bubUs}`}>
                10:15 queda libre. Listo, agendado a tu nombre.
              </StaggerItem>
            </StaggerGrid>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className={styles.stacks}>
              {CHATBOT_STACKS.map((stack) => (
                <div
                  key={stack.id}
                  className={`${styles.stackRow} ${
                    stack.destacado ? styles.stackFeat : ""
                  }`}
                >
                  <span className={styles.stackNivel}>{stack.nivel}</span>
                  <div className={styles.stackBody}>
                    {stack.destacado ? (
                      <span className={styles.stackFlag}>El que más se pide</span>
                    ) : null}
                    <h3>{stack.nombre}</h3>
                    <p>{stack.resuelve}</p>
                  </div>
                  <div className={styles.stackPrecio}>
                    <b className={styles.mono}>
                      {stack.setupDesde ? "desde " : ""}Bs {fmtBs(stack.setup)} inst.
                    </b>
                    <span className={styles.mono}>
                      + Bs {fmtBs(stack.mensual)}/mes
                      {stack.metaAparte ? " + Meta" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className={styles.botNota}>
              El botón de WhatsApp de tu web va gratis en cualquier plan. Esto
              es otra cosa: un bot que responde, califica y agenda por vos —
              entrenado con tu negocio, y lo probás antes de encenderlo.
            </p>
            <div className={styles.heroCta}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="/chatbot">
                Ver los tres stacks y sus requisitos
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
