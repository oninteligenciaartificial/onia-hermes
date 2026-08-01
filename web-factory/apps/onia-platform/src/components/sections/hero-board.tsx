"use client";

import * as m from "motion/react-m";
import { AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springs } from "@/motion";
import { DisplayToggle } from "@/components/ui/display-toggle";
import { GhostCursor } from "@/components/ui/ghost-cursor";
import styles from "./hero.module.css";

/**
 * La animacion insignia: el tablero de una cuenta Onia (diagrama vivo, no
 * screenshot). Loop de ~9s que enseña las DOS ideas del producto:
 *
 *   paso 0  cuenta con "Sistema de gestion" ya encendido
 *   paso 1  un cursor fantasma viaja al toggle de "Agentes IA"
 *   paso 2  click: el modulo se ENCIENDE (toggle + tile a plena vida)
 *   paso 3  en el feed aparece la propuesta del agente con estado
 *           "Esperando tu aprobacion" — human-in-the-loop desde el hero
 *
 * Pausado fuera del viewport; prefers-reduced-motion = cuadro final estatico
 * (ambos modulos encendidos + propuesta visible, sin cursor).
 */

const STEP_HOLD_MS = [1900, 1050, 750, 4900] as const;
const FINAL_STEP = 3;

export function HeroBoard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorHomeRef = useRef<HTMLDivElement>(null);
  const toggleSpotRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [delta, setDelta] = useState({ x: -180, y: -120 });

  // El viaje del cursor se mide contra el DOM real (sobrevive al responsive).
  useEffect(() => {
    function measure() {
      const home = cursorHomeRef.current?.getBoundingClientRect();
      const target = toggleSpotRef.current?.getBoundingClientRect();
      if (home && target) {
        setDelta({
          x: target.left + target.width / 2 - home.left,
          y: target.top + target.height / 2 - home.top,
        });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setTimeout(
      () => setStep((s) => (s + 1) % (FINAL_STEP + 1)),
      STEP_HOLD_MS[step],
    );
    return () => window.clearTimeout(id);
  }, [step, inView, reduced]);

  const shown = reduced ? FINAL_STEP : step;
  const agentsOn = shown >= 2;

  return (
    <div
      ref={rootRef}
      className={styles.boardWrap}
      role="img"
      aria-label="Demostración animada de una cuenta Onia: el módulo Sistema de gestión ya está encendido; un cursor enciende el módulo Agentes IA y aparece una propuesta del agente que espera la aprobación del dueño."
    >
      <div aria-hidden className={styles.board}>
        <div className={styles.boardTop}>
          <span className={styles.boardDots}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.boardTitle}>Cuenta · Clínica Andina</span>
          <span className={styles.boardRubro}>Rubro: Dental</span>
        </div>

        <div className={styles.tiles}>
          {/* Sistema de gestion — encendido de entrada */}
          <div className={`${styles.tile} ${styles.tileOn}`}>
            <div className={styles.tileHead}>
              <span className={styles.tileName}>Sistema de gestión</span>
              <DisplayToggle on />
            </div>
            <div className={styles.agendaRows}>
              {["09:00", "10:30", "15:00"].map((t, i) => (
                <div key={t} className={styles.agendaRow}>
                  <span className={styles.agendaTime}>{t}</span>
                  <span
                    className={styles.agendaBar}
                    style={{ width: `${72 - i * 14}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Agentes IA — el que se enciende en vivo */}
          <div
            className={`${styles.tile} ${agentsOn ? styles.tileOn : styles.tileOff}`}
          >
            <div className={styles.tileHead}>
              <span className={styles.tileName}>Agentes IA</span>
              <div ref={toggleSpotRef}>
                <DisplayToggle on={agentsOn} />
              </div>
            </div>
            <m.div
              className={styles.agentStatus}
              initial={false}
              animate={{ opacity: agentsOn ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {agentsOn ? (
                <>
                  <span className={styles.livePulse} />
                  Activo · trabaja 24/7
                </>
              ) : (
                "Apagado"
              )}
            </m.div>
          </div>

          <div className={`${styles.tile} ${styles.tileSm} ${styles.tileOff}`}>
            <span className={styles.tileName}>Chatbot WhatsApp</span>
            <DisplayToggle on={false} small />
          </div>
          <div className={`${styles.tile} ${styles.tileSm} ${styles.tileOff}`}>
            <span className={styles.tileName}>Página web</span>
            <DisplayToggle on={false} small />
          </div>
        </div>

        {/* feed: la propuesta que espera aprobacion */}
        <div className={styles.feed}>
          <AnimatePresence>
            {shown >= FINAL_STEP ? (
              <m.div
                key="proposal"
                className={styles.feedLine}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={springs.heavy}
              >
                <span className={styles.feedText}>
                  Agente: propuse reprogramar a María P.
                </span>
                <span className={styles.feedPill}>Esperando tu aprobación</span>
              </m.div>
            ) : (
              <m.span
                key="idle"
                className={styles.feedIdle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sin novedades — todo al día
              </m.span>
            )}
          </AnimatePresence>
        </div>

        {/* cursor fantasma */}
        {!reduced ? (
          <div ref={cursorHomeRef} className={styles.cursorHome}>
            <m.div
              initial={false}
              animate={{
                x: shown >= 1 ? delta.x : 0,
                y: shown >= 1 ? delta.y : 0,
                scale: shown === 2 ? 0.82 : 1,
                opacity: shown >= 1 ? 1 : 0.45,
              }}
              transition={springs.gentle}
              style={{ willChange: "transform" }}
            >
              <GhostCursor />
            </m.div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
