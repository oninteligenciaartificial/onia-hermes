"use client";

import * as m from "motion/react-m";
import { useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { riseDistance, springs, staggerBase, viewportOnce } from "./tokens";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: riseDistance, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.gentle,
  },
};

type StaggerGridProps = {
  children: ReactNode;
  className?: string;
  /** Segundos entre items. >0.09 se siente lento; listas >12 items bajan a 0.04. */
  stagger?: number;
  as?: "div" | "ul" | "ol";
  /**
   * Vuelve a reproducirse cada vez que el bloque entra en pantalla, en vez de
   * una sola vez. Es para ESCENAS que muestran el producto paso a paso (el
   * chat que avanza, el cobro que se completa) dentro de un carrusel que se
   * mueve solo: si corriera `once`, quien llega tarde ve una pantalla muerta.
   * Para contenido de lectura NO se usa — re-animar un texto al scrollear marea.
   */
  repetir?: boolean;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "span";
};

const gridTags = { div: m.div, ul: m.ul, ol: m.ol } as const;
const itemTags = { div: m.div, li: m.li, article: m.article, span: m.span } as const;

/**
 * Stagger de grid — el grid entra como SISTEMA, no como cards sueltas.
 * El contenedor orquesta (staggerChildren); cada <StaggerItem> hereda la
 * variante sin props propias. La onda dirige el ojo en orden de lectura.
 *
 * No usar en listas >20 items (el delay acumulado se percibe como lentitud)
 * ni para el above-the-fold critico (retrasa la lectura del LCP).
 */
export function StaggerGrid({
  children,
  className,
  stagger = staggerBase,
  as = "div",
  repetir = false,
}: StaggerGridProps) {
  const Tag = gridTags[as] as typeof m.div;
  /*
   * Con prefers-reduced-motion el MotionConfig del provider ya apaga el
   * transform, pero la CASCADA seguia corriendo: el contenido aparecia de a
   * uno con varios segundos de espera. Para quien pidio menos movimiento eso
   * es peor, no mejor. Reducido = todo junto, y una sola vez.
   */
  const reducido = useReducedMotion();
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reducido ? 0 : stagger } },
  };
  return (
    <Tag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={repetir && !reducido ? { once: false, amount: 0.6 } : viewportOnce}
    >
      {children}
    </Tag>
  );
}

/** Item de <StaggerGrid>. Hereda la orquestacion del padre via variants. */
export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const Tag = itemTags[as] as typeof m.div;
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
