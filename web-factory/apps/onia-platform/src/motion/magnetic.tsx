"use client";

import * as m from "motion/react-m";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { springs } from "./tokens";

type MagneticProps = {
  children: ReactNode;
  /** Cuanto sigue al cursor. 0.15–0.35; mas parece un bug. */
  strength?: number;
  className?: string;
};

/**
 * Iman de cursor para CTAs/iconos sueltos — el elemento se inclina hacia el
 * puntero y al salir vuelve con fisica CONSERVANDO la velocidad (eso no se
 * finge con CSS). Solo transform (x/y).
 *
 * - Solo mouse: en touch/pen no hace nada (pointerType check).
 * - prefers-reduced-motion: inerte.
 * - Maximo 1–2 imanes por viewport; en botones de texto largo, mejor
 *   <PressableCta>.
 */
export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.6 });
  const reduced = useReducedMotion();

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.div
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </m.div>
  );
}

type PressableCtaProps = {
  children: ReactNode;
  className?: string;
};

/**
 * CTA con respuesta fisica al hover/tap — spring, no ease generico.
 * El hover de Motion filtra los falsos hover de touch (CSS :hover no).
 * No usar en links inline de texto (el scale rompe el ritmo tipografico).
 */
export function PressableCta({ children, className }: PressableCtaProps) {
  return (
    <m.div
      className={className}
      style={{ display: "inline-block" }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={springs.press}
    >
      {children}
    </m.div>
  );
}
