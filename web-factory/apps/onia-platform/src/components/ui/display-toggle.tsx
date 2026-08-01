"use client";

import * as m from "motion/react-m";
import { durations, springs } from "@/motion";
import styles from "./display-toggle.module.css";

/**
 * Toggle DECORATIVO para escenas (hero board, pasos, footer): mismo lenguaje
 * visual que el ModuleToggle interactivo del kit, pero es un <span> — no roba
 * foco dentro de regiones aria-hidden. Para toggles que el visitante toca,
 * usar SIEMPRE el ModuleToggle del kit (role="switch" real).
 *
 * Compositor-only: knob por transform (x), pista encendida por opacity.
 */
export function DisplayToggle({
  on,
  small = false,
}: {
  on: boolean;
  small?: boolean;
}) {
  const travel = small ? 16 : 22;
  return (
    <span className={small ? styles.rootSm : styles.root} aria-hidden>
      <span className={styles.trackOff} />
      <m.span
        className={styles.trackOn}
        initial={false}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: durations.base }}
      />
      <m.span
        className={styles.knob}
        initial={false}
        animate={{ x: on ? travel : 0 }}
        transition={springs.snappy}
      />
    </span>
  );
}
