import type { CSSProperties, ReactNode } from "react";
import s from "./entrada.module.css";

type EntradaTag = "div" | "section" | "header";

type EntradaProps = {
  children: ReactNode;
  /** Retraso en segundos para el segundo elemento del hero (≈0.06-0.08, no más). */
  delay?: number;
  className?: string;
  as?: EntradaTag;
};

/**
 * Entrada de la PRIMERA PANTALLA (el hero: titular, bajada, botones y la pieza
 * de al lado). Componente de servidor, sin `"use client"`: la animación es CSS,
 * corre con el HTML y solo SUBE el bloque — no lo funde desde transparente
 * (por qué, medido: `entrada.module.css`).
 *
 * **Por qué no `<Reveal>` arriba de todo** (auditoría 2026-10-02): el Reveal de
 * motion sale del servidor con `opacity:0` en línea y recién se ve cuando
 * hidrata React y llegan las features diferidas de LazyMotion. En el hero eso
 * es el titular transparente: LCP de 3,4-3,7 s en /precios y /empezar, con el
 * texto ya descargado desde el primer byte. `<Reveal>` sigue siendo el de las
 * secciones de más abajo, que entran al scrollear; para lo que está en pantalla
 * al abrir, va `<Entrada>`. Lo vigila `app/titular-visible-sin-js.test.ts`.
 */
export function Entrada({ children, delay = 0, className, as = "div" }: EntradaProps) {
  const Tag = as;
  const style: CSSProperties | undefined = delay ? { animationDelay: `${delay}s` } : undefined;
  return (
    <Tag className={className ? `${s.entrada} ${className}` : s.entrada} style={style}>
      {children}
    </Tag>
  );
}
