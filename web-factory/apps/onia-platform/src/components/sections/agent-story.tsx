"use client";

import * as m from "motion/react-m";
import {
  AnimatePresence,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useRef, useState } from "react";
import {
  Reveal,
  SplitTextReveal,
  StickyScene,
  springs,
  useSceneProgress,
} from "@/motion";
import { useIsDesktop } from "@/lib/use-media";
import styles from "./agent-story.module.css";

/**
 * Seccion f — la segunda insignia: linea de tiempo 20:47 → 20:49 → 07:30 en
 * tres actos scroll-driven. La PAUSA deliberada del acto 2 (la propuesta se
 * queda en "Esperando tu aprobacion" hasta el siguiente scroll) enseña el
 * human-in-the-loop mejor que cualquier texto. Compliance: el agente
 * REPROGRAMA con aprobacion humana; no manda nada solo.
 * Mobile / reduced-motion: triptico estatico de las tres viñetas.
 */

const ACTS = [
  {
    time: "20:47",
    text: "Un cliente cancela su cita de mañana por WhatsApp. Vos ya cerraste; ni lo viste.",
  },
  {
    time: "20:49",
    text: "El agente de Onia detecta el hueco, revisa la lista de espera y prepara la propuesta: mover a otro cliente a ese horario y avisarle. Todo queda redactado y en pausa.",
  },
  {
    time: "07:30",
    text: "Abrís la app con el café. Una tarjeta te espera: «Propongo reprogramar a María P. al hueco de las 15:00. ¿Aprobás?» Un toque. Listo. La silla no quedó vacía.",
  },
] as const;

/** La maqueta del caso, acumulativa: recibe el acto vivo (0, 1 o 2). */
function Stage({ act }: { act: number }) {
  const cancelled = act >= 0;
  const proposed = act >= 1;
  const approved = act >= 2;

  return (
    <div className={styles.stage} aria-hidden>
      {/* agenda + lista de espera */}
      <div className={styles.agendaCol}>
        <p className={`mono ${styles.colLabel}`}>Agenda · mañana</p>

        <div className={styles.slot}>
          <span className={`mono ${styles.slotTime}`}>10:00</span>
          <span className={styles.slotChip}>Jorge L.</span>
        </div>

        <div
          className={`${styles.slot} ${cancelled && !approved ? styles.slotHole : ""}`}
        >
          <span className={`mono ${styles.slotTime}`}>15:00</span>
          <span className={styles.slotWell}>
            <m.span
              className={`${styles.slotChip} ${styles.chipCancelled}`}
              initial={false}
              animate={{ opacity: cancelled ? (approved ? 0 : 0.4) : 1 }}
              transition={{ duration: 0.35 }}
            >
              Cliente
            </m.span>
            <AnimatePresence>
              {approved ? (
                <m.span
                  key="maria"
                  className={`${styles.slotChip} ${styles.chipNew}`}
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={springs.heavy}
                >
                  María P.
                </m.span>
              ) : null}
            </AnimatePresence>
          </span>
        </div>

        <p className={`mono ${styles.colLabel}`}>Lista de espera</p>
        <ul className={styles.waitlist}>
          <m.li
            initial={false}
            animate={
              proposed
                ? { opacity: 1, scale: 1.02 }
                : { opacity: 0.75, scale: 1 }
            }
            className={proposed ? styles.waitHot : ""}
          >
            María P.
          </m.li>
          <li>Carlos V.</li>
        </ul>
      </div>

      {/* conversacion + propuesta */}
      <div className={styles.feedCol}>
        <AnimatePresence>
          {cancelled ? (
            <m.div
              key="cancel"
              className={styles.waBubble}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={springs.gentle}
            >
              <span className={`mono ${styles.waTime}`}>20:47</span>
              Hola, mañana no voy a poder ir. Disculpá.
            </m.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {proposed ? (
            <m.div
              key="proposal"
              className={styles.agentCard}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={springs.heavy}
            >
              <span className={styles.agentHead}>
                <span className={styles.agentNode} />
                Agente Onia
              </span>
              <p className={styles.agentText}>
                Propongo reprogramar a María P. al hueco de las 15:00.
                ¿Aprobás?
              </p>
              <span className={styles.agentActions}>
                {/* BUG ARREGLADO 2026-07-30: un spring NO admite 3 keyframes
                    (Motion tira "Only two keyframes currently supported with
                    spring"). La excepcion mataba el loop de animacion y TODO
                    lo que venia despues en la pagina (precios, objeciones,
                    puertas) se quedaba invisible en opacity 0. El rebote de
                    aprobacion va con tween, que si acepta keyframes. */}
                <m.span
                  className={`${styles.approveBtn} ${approved ? styles.approveDone : ""}`}
                  initial={false}
                  animate={{ scale: approved ? [1, 0.9, 1] : 1 }}
                  transition={
                    approved
                      ? { duration: 0.3, times: [0, 0.35, 1], ease: "easeOut" }
                      : springs.snappy
                  }
                >
                  {approved ? "Aprobada" : "Aprobar"}
                  {approved ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6.2 5 9l5-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </m.span>
                <span
                  className={`mono ${styles.statusPill} ${approved ? styles.statusOk : ""}`}
                >
                  {approved ? "hecha · 07:30" : "esperando tu aprobación"}
                </span>
              </span>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Contenido del sticky frame en desktop. */
function StickyStory() {
  const progress = useSceneProgress();
  const [act, setAct] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    // ventana ancha para el acto 1: la propuesta se queda ESPERANDO —
    // esa pausa es el argumento.
    const next = v < 0.26 ? 0 : v < 0.7 ? 1 : 2;
    setAct((prev) => (prev === next ? prev : next));
  });

  return (
    <div className={`container ${styles.storyGrid}`}>
      <ol className={styles.timeline}>
        {ACTS.map((a, i) => (
          <li
            key={a.time}
            className={`${styles.act} ${i === act ? styles.actActive : ""}`}
          >
            <span className={`mono ${styles.actTime}`}>{a.time}</span>
            <p className={styles.actText}>{a.text}</p>
          </li>
        ))}
      </ol>
      <Stage act={act} />
    </div>
  );
}

/** Triptico apilado (mobile / reduced-motion). */
function StackedAct({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const a = ACTS[index];

  return (
    <div ref={ref} className={styles.stackedAct}>
      <div className={`${styles.act} ${styles.actActive}`}>
        <span className={`mono ${styles.actTime}`}>{a.time}</span>
        <p className={styles.actText}>{a.text}</p>
      </div>
      <Stage act={inView ? index : -1} />
    </div>
  );
}

export function AgentStory() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const sticky = isDesktop && !reduced;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <p className="kicker">Agentes con IA</p>
        <SplitTextReveal
          as="h2"
          className={`h2 ${styles.title}`}
          text="Te cancelaron a las 8 de la noche. Tu agente ya estaba trabajando."
        />
      </div>

      {sticky ? (
        <StickyScene viewports={3} stickyClassName={styles.stickyFrame}>
          <StickyStory />
        </StickyScene>
      ) : (
        <div className={`container ${styles.stacked}`}>
          {ACTS.map((_, i) => (
            <StackedAct key={i} index={i} />
          ))}
        </div>
      )}

      <div className="container">
        <Reveal className={styles.closing}>
          <p>
            Así funcionan todos los agentes de Onia:{" "}
            <strong>proponen, vos aprobás.</strong> No mandan mensajes a tus
            clientes por su cuenta, no toman decisiones a tus espaldas.
            Trabajan 24/7 juntando el trabajo sucio; vos seguís siendo el
            dueño de cada decisión.
          </p>
          <aside className={styles.aside}>
            En odontología de la región se pierde entre el 10% y el 30% de
            las citas, y hasta 1 de cada 4 pacientes no termina su tratamiento
            (datos de Colombia y Chile; en Bolivia no hay estudio publicado).
            El valor no está en recordar la cita: está en reprogramar y llenar
            el hueco.
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
