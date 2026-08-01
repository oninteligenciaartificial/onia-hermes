"use client";

import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { springs } from "./tokens";

/**
 * ScrollList — lista vertical cuyo item activo avanza CON EL SCROLL, con un
 * panel (imagen/captura) sincronizado al costado. Todo queda pineado por
 * `position: sticky` mientras la escena dura.
 *
 * Es el patron de "Built for every niche" de Fanvue, traducido: alli son
 * categorias de creador; aca son los rubros del producto, y el panel muestra
 * el sistema REAL de cada rubro. La diferencia importa — el de ellos entretiene,
 * el nuestro demuestra.
 *
 * Se distingue de `rubros.tsx` (seleccion por click): aca el usuario no elige,
 * el scroll cuenta. Sirve para la primera pasada narrativa; el selector por
 * click sirve para explorar. No usar los dos para lo mismo en una pagina.
 *
 * prefers-reduced-motion: colapsa a lista estatica, todos los items legibles
 * al 100% y el panel del primero visible. Sin pin, sin scrub.
 *
 * NUNCA anidar dentro de un ancestro con `transform` (rompe sticky).
 */

export type ScrollListItem = {
  id: string;
  label: string;
  /** Panel que se muestra cuando este item esta activo. */
  panel: ReactNode;
};

type ScrollListProps = {
  items: readonly ScrollListItem[];
  /** Viewports de scroll por item. 0.9–1.4 razonable. */
  perItem?: number;
  className?: string;
  stickyClassName?: string;
  listClassName?: string;
  panelClassName?: string;
  /** Opacidad de los items inactivos. */
  dimOpacity?: number;
};

export function ScrollList({
  items,
  perItem = 1.1,
  className,
  stickyClassName,
  listClassName,
  panelClassName,
  dimOpacity = 0.28,
}: ScrollListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduced) return;
    // el ultimo tramo se reparte igual: index = floor(p * n) acotado
    const next = Math.min(items.length - 1, Math.floor(p * items.length));
    setActive((prev) => (prev === next ? prev : next));
  });

  const current = reduced ? 0 : active;

  if (reduced) {
    return (
      <div className={className}>
        <div className={stickyClassName}>
          <ul className={listClassName}>
            {items.map((it) => (
              <li key={it.id} data-active="true">
                {it.label}
              </li>
            ))}
          </ul>
          <div className={panelClassName}>{items[0]?.panel}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: `${items.length * perItem * 100}vh` }}
    >
      <div className={stickyClassName} style={{ position: "sticky", top: 0 }}>
        <div className={panelClassName}>
          {items.map((it, i) => (
            <m.div
              key={it.id}
              aria-hidden={i !== current}
              initial={false}
              animate={{
                opacity: i === current ? 1 : 0,
                scale: i === current ? 1 : 0.97,
              }}
              transition={springs.gentle}
              style={{
                gridArea: "1 / 1",
                pointerEvents: i === current ? "auto" : "none",
              }}
            >
              {it.panel}
            </m.div>
          ))}
        </div>

        <ul className={listClassName}>
          {items.map((it, i) => (
            <m.li
              key={it.id}
              initial={false}
              animate={{
                opacity: i === current ? 1 : dimOpacity,
                x: i === current ? 0 : -4,
              }}
              transition={springs.gentle}
              data-active={i === current ? "true" : "false"}
            >
              {it.label}
            </m.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
