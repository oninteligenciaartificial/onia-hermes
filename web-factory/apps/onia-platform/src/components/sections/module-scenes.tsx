"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { easeOutExpo, springs } from "@/motion";
import styles from "./modules.module.css";

/**
 * Micro-escenas de los tiles de modulos. Cada una enseña SU mecanica y se
 * dispara cuando el modulo se ENCIENDE (prop `active` = toggle en on), no
 * con el scroll: la animacion queda pegada a la idea "encender el modulo".
 * Todo transform/opacity/clip-path; los loops infinitos chequean
 * useReducedMotion por su cuenta.
 */

type SceneProps = { active: boolean };

/** Sistema de gestion: una agenda que se llena. */
export function AgendaScene({ active }: SceneProps) {
  const rows = [
    { t: "09:00", w: "78%" },
    { t: "10:30", w: "58%" },
    { t: "12:00", w: "68%" },
    { t: "15:00", w: "44%" },
  ];
  return (
    <div className={styles.scAgenda} aria-hidden>
      {rows.map((r, i) => (
        <div key={r.t} className={styles.scAgendaRow}>
          <span className={`mono ${styles.scAgendaTime}`}>{r.t}</span>
          <span className={styles.scAgendaTrack}>
            <m.span
              className={styles.scAgendaBar}
              style={{ width: r.w, transformOrigin: "left center" }}
              initial={false}
              animate={{ scaleX: active ? 1 : 0 }}
              transition={{ ...springs.gentle, delay: active ? 0.15 + i * 0.12 : 0 }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Agentes IA: una propuesta que se desliza a la bandeja "Aprobar" y recibe el check. */
export function ApprovalScene({ active }: SceneProps) {
  return (
    <div className={styles.scApproval} aria-hidden>
      <m.div
        className={styles.scProposal}
        initial={false}
        animate={
          active ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }
        }
        transition={{ ...springs.heavy, delay: active ? 0.15 : 0 }}
      >
        <span className={styles.scProposalTag}>propuesta</span>
        Reprogramar a María P. → jue 15:00
      </m.div>
      <div className={styles.scTray}>
        Aprobar
        <m.span
          className={styles.scCheck}
          initial={false}
          animate={
            active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }
          }
          transition={{ ...springs.snappy, delay: active ? 0.75 : 0 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.2 5 9l5-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </m.span>
      </div>
    </div>
  );
}

/** Chatbot: burbuja entrante + respuesta instantanea. */
export function ChatScene({ active }: SceneProps) {
  return (
    <div className={styles.scChat} aria-hidden>
      <m.div
        className={styles.scBubbleIn}
        initial={false}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ ...springs.gentle, delay: active ? 0.15 : 0 }}
      >
        ¿Atienden los sábados?
      </m.div>
      <m.div
        className={styles.scBubbleOut}
        initial={false}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ ...springs.gentle, delay: active ? 0.55 : 0 }}
      >
        Sí, de 9 a 13. ¿Te agendo?
      </m.div>
    </div>
  );
}

/** Pagina web: un mini-navegador que se dibuja con clip-path. */
export function BrowserScene({ active }: SceneProps) {
  return (
    <div className={styles.scBrowserWrap} aria-hidden>
      <m.div
        className={styles.scBrowser}
        initial={false}
        animate={{
          clipPath: active ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: easeOutExpo, delay: active ? 0.15 : 0 }}
      >
        <div className={styles.scBrowserBar}>
          <i />
          <i />
          <i />
          <span className="mono">tunegocio.com.bo</span>
        </div>
        <div className={styles.scBrowserBody}>
          <span className={styles.scBrowserHero} />
          <span className={styles.scBrowserLine} />
          <span className={styles.scBrowserLineShort} />
        </div>
      </m.div>
    </div>
  );
}

/** Automatizaciones: tres nodos que se conectan y pulsan en secuencia. */
export function FlowScene({ active }: SceneProps) {
  const reduced = useReducedMotion();
  const nodes = [24, 110, 196];
  return (
    <svg
      className={styles.scFlow}
      viewBox="0 0 220 56"
      fill="none"
      aria-hidden
    >
      {[0, 1].map((i) => (
        <m.line
          key={`l${i}`}
          x1={nodes[i] + 12}
          y1="28"
          x2={nodes[i + 1] - 12}
          y2="28"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="1 1"
          pathLength={1}
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: active ? 0.3 + i * 0.45 : 0 }}
        />
      ))}
      {nodes.map((x, i) => (
        <m.circle
          key={`n${i}`}
          cx={x}
          cy="28"
          r="10"
          stroke="var(--accent)"
          strokeWidth="2"
          fill="var(--accent-soft)"
          initial={false}
          animate={{ scale: active ? 1 : 0.3, opacity: active ? 1 : 0 }}
          transition={{ ...springs.snappy, delay: active ? i * 0.45 : 0 }}
          style={{ transformOrigin: `${x}px 28px` }}
        />
      ))}
      {/* pulso perpetuo del ultimo nodo: "corre solo" */}
      {active && !reduced ? (
        <m.circle
          cx={nodes[2]}
          cy="28"
          r="10"
          stroke="var(--accent)"
          strokeWidth="2"
          fill="none"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 1.6, ease: "easeOut" }}
          style={{ transformOrigin: `${nodes[2]}px 28px` }}
        />
      ) : null}
    </svg>
  );
}

/** Version local: el wifi se apaga y el tile sigue latiendo — ese contraste ES el mensaje. */
export function OfflineScene({ active }: SceneProps) {
  const reduced = useReducedMotion();
  return (
    <div className={styles.scOffline} aria-hidden>
      <div className={styles.scWifi}>
        <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
          {[
            "M3 9.5C10.8 2.5 23.2 2.5 31 9.5",
            "M8 14.5c5-4.6 13-4.6 18 0",
            "M12.7 19.2a6.2 6.2 0 0 1 8.6 0",
          ].map((d, i) => (
            <m.path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              initial={false}
              animate={{ opacity: active ? 0.16 : 0.7 }}
              transition={{ duration: 0.4, delay: active ? 0.3 + i * 0.2 : 0 }}
            />
          ))}
          <circle cx="17" cy="23" r="2.4" fill="currentColor" opacity="0.7" />
        </svg>
        <m.span
          className={`mono ${styles.scOfflineLabel}`}
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ delay: active ? 0.9 : 0 }}
        >
          sin conexión
        </m.span>
      </div>
      <div className={styles.scHeartWrap}>
        <m.span
          className={styles.scHeart}
          initial={false}
          animate={
            active && !reduced
              ? { scale: [1, 1.25, 1], opacity: 1 }
              : { scale: 1, opacity: active ? 1 : 0.4 }
          }
          transition={
            active && !reduced
              ? { duration: 1.1, repeat: Infinity, delay: 1.2 }
              : { duration: 0.3 }
          }
        />
        <m.span
          className={`mono ${styles.scOfflineLabel}`}
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ delay: active ? 1.2 : 0 }}
        >
          tu operación sigue
        </m.span>
      </div>
    </div>
  );
}
