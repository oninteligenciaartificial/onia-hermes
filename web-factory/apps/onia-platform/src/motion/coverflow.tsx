"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { springs } from "./tokens";

/**
 * Coverflow — carrusel donde las tarjetas laterales quedan rotadas en
 * perspectiva y atenuadas, y la central manda. Navegacion por flechas
 * circulares (el patron de la seccion "Creators" de Fanvue).
 *
 * Para ONIA sirve para casos/testimonios reales, no para relleno: cada
 * tarjeta deberia ser una clinica que paga. Mientras no las haya, esta
 * seccion no va en la web (una web con testimonios inventados se cae al
 * primer clic del prospecto).
 *
 * Compositor-only: solo transform + opacity.
 * prefers-reduced-motion: grilla estatica, sin rotacion ni transiciones.
 */

export type CoverflowItem = {
  id: string;
  content: ReactNode;
  /** Pie que solo se muestra en la tarjeta activa. */
  caption?: ReactNode;
};

type CoverflowProps = {
  items: readonly CoverflowItem[];
  className?: string;
  stageClassName?: string;
  cardClassName?: string;
  captionClassName?: string;
  controlsClassName?: string;
  /** Grados de rotacion Y de las tarjetas laterales. */
  tilt?: number;
  /** Desplazamiento lateral, en % del ancho de la tarjeta. */
  spread?: number;
  labels?: { prev: string; next: string };
};

export function Coverflow({
  items,
  className,
  stageClassName,
  cardClassName,
  captionClassName,
  controlsClassName,
  tilt = 22,
  spread = 78,
  labels = { prev: "Anterior", next: "Siguiente" },
}: CoverflowProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const n = items.length;

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + n) % n);

  if (reduced) {
    return (
      <div className={className}>
        <div className={stageClassName} style={{ display: "flex", gap: 16, overflowX: "auto" }}>
          {items.map((it) => (
            <div key={it.id} className={cardClassName}>
              {it.content}
              {it.caption ? <div className={captionClassName}>{it.caption}</div> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={stageClassName}
        style={{ perspective: 1400, display: "grid", placeItems: "center" }}
      >
        {items.map((it, i) => {
          // distancia circular con signo: -1 izquierda, +1 derecha
          let d = i - index;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const far = Math.abs(d) > 2;

          return (
            <m.div
              key={it.id}
              className={cardClassName}
              aria-hidden={d !== 0}
              initial={false}
              animate={{
                x: `${d * spread}%`,
                rotateY: d === 0 ? 0 : -Math.sign(d) * tilt,
                scale: d === 0 ? 1 : 0.86,
                opacity: far ? 0 : d === 0 ? 1 : 0.45,
                zIndex: 10 - Math.abs(d),
              }}
              transition={springs.gentle}
              style={{
                gridArea: "1 / 1",
                transformStyle: "preserve-3d",
                pointerEvents: d === 0 ? "auto" : "none",
              }}
            >
              {it.content}
            </m.div>
          );
        })}
      </div>

      {items[index]?.caption ? (
        <m.div
          key={items[index].id}
          className={captionClassName}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
        >
          {items[index].caption}
        </m.div>
      ) : null}

      <div className={controlsClassName}>
        <button type="button" onClick={() => go(-1)} aria-label={labels.prev}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" onClick={() => go(1)} aria-label={labels.next}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
