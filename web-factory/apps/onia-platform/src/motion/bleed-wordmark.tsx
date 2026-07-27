"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";

/**
 * BleedWordmark — el nombre a escala descarada, cortado por el borde inferior,
 * como cierre de pagina. Es el remate del footer de Fanvue.
 *
 * Regla: va UNA sola vez por pagina y siempre al final. Su fuerza viene de la
 * escala, no del movimiento — el parallax es de 6% como mucho.
 *
 * Accesibilidad: el texto es real (seleccionable, indexable). Se recorta con
 * overflow del contenedor, nunca con una imagen.
 *
 * prefers-reduced-motion: sin parallax, mismo recorte.
 */

type BleedWordmarkProps = {
  text?: string;
  className?: string;
  /** Cuanto sube el wordmark en el rango de scroll, en %. */
  shift?: number;
};

export function BleedWordmark({
  text = "onia",
  className,
  shift = 6,
}: BleedWordmarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${shift}%`, "0%"]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }} aria-hidden={false}>
      <m.p
        style={{
          y: reduced ? "0%" : y,
          margin: 0,
          lineHeight: 0.78,
          fontSize: "clamp(5rem, 26vw, 22rem)",
          fontWeight: 560,
          letterSpacing: "-0.03em",
          // el corte inferior: la mitad inferior de la caja queda fuera
          marginBottom: "-0.18em",
        }}
      >
        {text}
      </m.p>
    </div>
  );
}
