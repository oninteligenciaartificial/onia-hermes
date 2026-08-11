"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
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

  /*
   * ATERRIZA EXACTO — esto es plata, no decoracion.
   *
   * Antes esto corria con `useSpring` + evento "change": el resorte se da por
   * quieto cuando su VELOCIDAD baja del umbral, no cuando llega, asi que el
   * ultimo frame emitido para 1.500 caia en 1.495 y el plan Full quedaba
   * publicado en la web como "Bs 1.495". Con `animate` hay un `onComplete` de
   * verdad y el ultimo valor escrito es el numero real.
   */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView || reduced) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      type: "spring",
      stiffness: 110,
      damping: 28,
      mass: 1.2,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
      onComplete: () => {
        node.textContent = format(value);
      },
    });
    return () => {
      controls.stop();
      // si el componente se desmonta o cambia el monto a mitad de cuenta, lo
      // que queda escrito es el numero correcto, nunca uno a medio contar
      node.textContent = format(value);
    };
  }, [inView, value, reduced, format]);

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
