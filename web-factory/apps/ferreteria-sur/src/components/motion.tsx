"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Reveal in-view con motion.dev. Portado de dental-premium sin cambiar la
// mecánica: la curva y los tiempos son los mismos de la fórmula (0.8s,
// cubic-bezier(0.16,1,0.3,1) = --ease-out en globals.css).
//
// NO se bifurca el markup por reduced-motion (eso causaba mismatch de
// hidratación y dejaba secciones en blanco): el estado inicial/animado es
// siempre el mismo y reduced-motion solo pone la duración en 0 → aparece
// instantáneo pero SIEMPRE termina visible.
//
// Solo se animan transform (y) y opacity.
const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  alMontar = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /**
   * Anima al MONTAR en vez de al entrar en viewport. Obligatorio en el hero.
   *
   * `whileInView` con `margin: 0 0 -12%` exige que el bloque esté un 12% por
   * encima del borde inferior para dispararse. En una laptop de 800-900px de
   * alto el CTA del hero nace POR DEBAJO de esa línea, así que nunca entra
   * "en viewport": se quedaba en `opacity:0` hasta que el visitante scrolleara.
   * Medido el 2026-09-03 en el bundle de producción: a 1440x900 el botón que
   * convierte estaba dentro del pliegue (bottom 842 < 900) y aun así NO se
   * veía. Un bloque que ya está sobre el pliegue no puede depender de un
   * scroll que nunca va a pasar.
   */
  alMontar?: boolean;
}) {
  const reduce = useReducedMotion();
  const entrada = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(alMontar
        ? { animate: entrada }
        : { whileInView: entrada, viewport: { once: true, margin: "0px 0px -12% 0px" } })}
      transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
