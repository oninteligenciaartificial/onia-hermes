"use client";

import {
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  /** Formateador. Default: es-BO con separador de miles, sin decimales. */
  format?: (v: number) => string;
  className?: string;
};

const defaultFormat = (v: number) => Math.round(v).toLocaleString("es-BO");

/**
 * Count-up fisico — el numero acelera y frena con masa ("dato medido ahora",
 * no pintado). Escribe directo en el nodo DOM via MotionValue: CERO
 * re-renders de React por frame.
 *
 * SSR renderiza el valor FINAL (SEO y no-JS ven el numero real); al entrar
 * al viewport arranca de 0 y sube una sola vez.
 *
 * REGLA DE LA CASA: los numeros fiscales NO bailan. Nunca usar CountUp en
 * cifras SIAT/facturas/impuestos — esas aparecen firmes, exactas, de una.
 * Tipografia: el numero va en mono con font-variant-numeric: tabular-nums
 * (evita el jitter de ancho mientras cuenta).
 *
 * prefers-reduced-motion: salta directo al valor final, sin animacion.
 */
export function CountUp({ value, format = defaultFormat, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const spring = useSpring(0, { stiffness: 110, damping: 28, mass: 1.2 });

  useMotionValueEvent(spring, "change", (v) => {
    if (ref.current) ref.current.textContent = format(v);
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      spring.jump(value);
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    spring.set(value);
  }, [inView, value, reduced, spring, format]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {format(value)}
    </span>
  );
}
