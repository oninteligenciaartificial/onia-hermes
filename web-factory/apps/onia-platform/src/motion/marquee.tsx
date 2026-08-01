"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Marquee — cinta horizontal infinita. Duplica el contenido y lo desplaza
 * exactamente -50%, asi el loop es invisible.
 *
 * Uso honesto: logos de prensa/clientes REALES. Si todavia no hay clientes,
 * NO se rellena con logos de herramientas que usamos ni con marcas ajenas —
 * eso es el atajo que hace ver barata a una web.
 *
 * prefers-reduced-motion: se detiene y muestra la primera tanda estatica,
 * con scroll horizontal manual disponible.
 */

type MarqueeProps = {
  children: ReactNode;
  /** Segundos por vuelta completa. Mas alto = mas lento. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
};

export function Marquee({
  children,
  duration = 32,
  reverse = false,
  className,
  trackClassName,
}: MarqueeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={{ overflowX: "auto" }}>
        <div className={trackClassName}>{children}</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <m.div
        className={trackClassName}
        style={{ display: "flex", width: "max-content" }}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {children}
        <div aria-hidden="true" style={{ display: "flex" }}>
          {children}
        </div>
      </m.div>
    </div>
  );
}
