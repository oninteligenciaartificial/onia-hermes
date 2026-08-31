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
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
