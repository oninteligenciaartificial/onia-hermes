"use client";

import * as m from "motion/react-m";
import { AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springs } from "@/motion";
import styles from "./bolivia.module.css";

/**
 * La pantalla dividida "tipear vs. no tipear" — el argumento ES la asimetria
 * de ritmo entre las dos mitades:
 *
 * - Izquierda "a mano": una factura que se tipea campo por campo, lenta,
 *   con el cursor parpadeando, en loop eterno (CSS puro: clip-path con
 *   steps() — cero JS por frame). Transmite el tedio.
 * - Derecha "con Onia": el cobro ya registrado dispara la factura armada de
 *   una: el punto viaja y la factura aterriza con su check. El ciclo entero
 *   dura ~3s contra ~9s del tipeo.
 *
 * prefers-reduced-motion: cuadro estatico lado a lado, todo en su estado
 * final, con las captions como argumento.
 */

const FIELDS = [
  { label: "NIT", value: "1023456789" },
  { label: "Razón social", value: "Clínica Andina S.R.L." },
  { label: "Detalle", value: "Consulta + limpieza · Bs 350" },
] as const;

const RIGHT_HOLD_MS = [750, 650, 2100] as const;

export function SiatScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setTimeout(
      () => setStep((s) => (s + 1) % RIGHT_HOLD_MS.length),
      RIGHT_HOLD_MS[step],
    );
    return () => window.clearTimeout(id);
  }, [step, inView, reduced]);

  const shown = reduced ? RIGHT_HOLD_MS.length - 1 : step;

  return (
    <div
      ref={rootRef}
      className={styles.scene}
      role="img"
      aria-label="Comparación animada: a la izquierda, una factura se tipea campo por campo en el portal, lenta y sin fin; a la derecha, con Onia, el cobro ya registrado genera la factura armada de una vez, con su check."
    >
      <div aria-hidden className={styles.sceneGrid}>
        {/* ---- izquierda: a mano ---- */}
        <div className={styles.paneManual}>
          <p className={`mono ${styles.paneTitle}`}>Portal, a mano</p>
          <div className={styles.form}>
            {FIELDS.map((f, i) => (
              <div key={f.label} className={styles.formRow}>
                <span className={`mono ${styles.formLabel}`}>{f.label}</span>
                <span className={styles.formField}>
                  <span
                    className={`mono ${styles.formValue} ${styles[`typing${i}` as "typing0"]}`}
                  >
                    {f.value}
                  </span>
                  {i === FIELDS.length - 1 ? (
                    <span className={styles.caret} />
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          <p className={`mono ${styles.paneCaption}`}>
            cada factura, tipeada — todos los días
          </p>
        </div>

        {/* ---- derecha: con Onia ---- */}
        <div className={styles.paneOnia}>
          <p className={`mono ${styles.paneTitle}`}>Con Onia</p>

          <div className={styles.oniaFlow}>
            <div className={styles.cobroCard}>
              <span className={styles.cobroDot} />
              Cobro registrado
              <span className={`mono ${styles.cobroAmount}`}>Bs 350</span>
            </div>

            {/* el dato viaja */}
            <div className={styles.travelTrack}>
              <m.span
                className={styles.travelDot}
                initial={false}
                animate={{
                  y: shown >= 1 ? 34 : 0,
                  opacity: shown >= 1 ? (shown >= 2 ? 0 : 1) : 0,
                }}
                transition={
                  shown >= 1 ? { duration: 0.45, ease: "easeIn" } : { duration: 0 }
                }
              />
            </div>

            <div className={styles.facturaSlot}>
              <AnimatePresence>
                {shown >= 2 ? (
                  <m.div
                    key="factura"
                    className={styles.facturaCard}
                    initial={{ opacity: 0, y: -14, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={springs.heavy}
                  >
                    <span className={styles.facturaHead}>
                      Factura lista
                      <span className={styles.facturaCheck}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6.2 5 9l5-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className={styles.facturaLine} />
                    <span className={styles.facturaLineShort} />
                  </m.div>
                ) : (
                  <m.span
                    key="esperando"
                    className={`mono ${styles.facturaIdle}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                  >
                    …
                  </m.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className={`mono ${styles.paneCaption}`}>
            la factura sale del cobro — cero doble trabajo
          </p>
        </div>
      </div>
    </div>
  );
}
