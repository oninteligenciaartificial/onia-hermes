"use client";

import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { riseDistance, springs, viewportOnce } from "./tokens";

type RevealTag = "div" | "section" | "li" | "span" | "figure";

type RevealProps = {
  children: ReactNode;
  /** Retraso en segundos para orquestar hermanos sueltos (≈0.06 * indice, no mas). */
  delay?: number;
  /** Direccion de entrada. Solo transform/opacity — nunca layout. */
  from?: "bottom" | "left" | "right" | "none";
  className?: string;
  as?: RevealTag;
};

const offsets = {
  bottom: { x: 0, y: riseDistance },
  left: { x: -riseDistance, y: 0 },
  right: { x: riseDistance, y: 0 },
  none: { x: 0, y: 0 },
} as const;

const tags = {
  div: m.div,
  section: m.section,
  li: m.li,
  span: m.span,
  figure: m.figure,
} as const;

/**
 * Reveal on scroll — el piso de la casa, no el techo.
 * Fade + rise con fisica al entrar al viewport, una sola vez.
 * Para grids usar <StaggerGrid>; para titulares usar <SplitTextReveal>.
 */
export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className,
  as = "div",
}: RevealProps) {
  const Tag = tags[as] as typeof m.div;
  const off = offsets[from];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x: off.x, y: off.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springs.gentle, delay }}
    >
      {children}
    </Tag>
  );
}
