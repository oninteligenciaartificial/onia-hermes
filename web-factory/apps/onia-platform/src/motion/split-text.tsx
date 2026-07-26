"use client";

import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { easeOutExpo, viewportOnce } from "./tokens";

type SplitTag = "h1" | "h2" | "h3" | "p";

type SplitTextRevealProps = {
  text: string;
  as?: SplitTag;
  className?: string;
  /** Segundos entre palabras. 0.03–0.06; mas alto se siente lento. */
  stagger?: number;
  delay?: number;
};

const tags = { h1: m.h1, h2: m.h2, h3: m.h3, p: m.p } as const;

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/**
 * Split-text reveal por palabras con mascara — el sello "aca hubo diseño".
 *
 * Accesible por construccion: el contenedor lleva aria-label con el texto
 * completo y cada palabra va aria-hidden — el screen reader lee la frase
 * entera, no pedazos. El split es determinista (string → spans) asi que
 * SSR renderiza el mismo arbol y no hay mismatch de hidratacion.
 *
 * Solo para TITULARES (1–2 lineas). Nunca parrafos, nunca el copy critico
 * del hero que el visitante debe leer al instante.
 * Con prefers-reduced-motion el transform salta al final y queda el fade.
 */
export function SplitTextReveal({
  text,
  as = "h2",
  className,
  stagger = 0.045,
  delay = 0,
}: SplitTextRevealProps) {
  const words = text.split(" ");
  const Tag = tags[as] as typeof m.h2;
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  return (
    <Tag
      className={className}
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
            }}
          >
            <m.span
              variants={wordVariants}
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {word}
            </m.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
