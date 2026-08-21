"use client";

import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * Parallax suave del marco del hero — 28px como maximo en toda la pantalla.
 * Es profundidad, no efecto: si se nota, esta mal.
 *
 * Solo transform (compositor). Con prefers-reduced-motion no se mueve nada.
 */
export function ParallaxSoft({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, -28], { clamp: true });

  return (
    <m.div className={className} style={reduced ? undefined : { y }}>
      {children}
    </m.div>
  );
}
