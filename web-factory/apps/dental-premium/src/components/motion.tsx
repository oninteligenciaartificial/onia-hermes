"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Reveal in-view con motion.dev. Curva y tiempos de la fórmula (0.8s,
// cubic-bezier(0.16,1,0.3,1)). NO se bifurca el markup por reduced-motion (eso
// causaba mismatch de hidratación y dejaba secciones en blanco): el estado
// inicial/animado es siempre el mismo y reduced-motion solo pone la duración
// en 0 → aparece instantáneo pero SIEMPRE termina visible.
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
   * encima del borde inferior para dispararse. El CTA del hero nace POR DEBAJO
   * de esa línea en una laptop, así que nunca entra "en viewport" y se queda en
   * `opacity:0` hasta que el visitante scrollee. Medido el 2026-09-03 sobre el
   * bundle de producción: a 1440x800 y 1440x900 el botón estaba DENTRO del
   * pliegue (bottom 757 y 849) y aun así era invisible.
   * Es el mismo bug que se arregló en ferreteria-sur el mismo día: las dos apps
   * comparten este componente por copia, así que se barrieron las dos.
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
