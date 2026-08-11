"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";

/**
 * BleedWordmark — el nombre a escala descarada, cortado por el borde inferior,
 * como cierre de pagina.
 *
 * Regla: va UNA sola vez por pagina y siempre al final. Su fuerza viene de la
 * escala, no del movimiento — el parallax es de 6% como mucho.
 *
 * POR QUE EL SVG DE MARCA Y NO TEXTO (cambio 2026-08-10):
 * antes esto era un `<p>onia</p>` gigante. Con texto real, las cuatro letras
 * salen del MISMO color y el punto de la "i" tambien: el remate de la home era
 * un "onia" todo negro, sin el cuadrado verde. Ese es exactamente el sintoma
 * que reporto Sergio ("el logo es el que la i es verde"). Ninguna fuente puede
 * pintar el tittle de otro color, asi que aca va el arte de marca —
 * `public/brand/v2/onia-logo.svg`, el mismo archivo que sirve el header, con
 * las letras en tinta #12100E y el tittle en verde senal #00D26A.
 *
 * Se sirve por `<img>` y no inline a proposito: un solo origen del arte (si se
 * corrige el SVG, se corrige en los dos lugares) y cero riesgo de que una copia
 * pegada en el JSX se desincronice del archivo.
 *
 * El recorte sigue siendo del contenedor (`overflow: hidden` + margen inferior
 * negativo), nunca una imagen pre-recortada.
 *
 * Accesibilidad: el nombre queda como `alt`, y el h1 de la pagina + el enlace
 * del header siguen llevando el texto indexable.
 *
 * prefers-reduced-motion: sin parallax, mismo recorte.
 */

/**
 * Cuanto del alto del arte queda fuera del recorte, en % del ANCHO del
 * contenedor (los margenes en % se resuelven contra el ancho).
 * El SVG mide 1898.3x763 -> su alto es el 40.2% de su ancho; -9% deja fuera
 * alrededor de un quinto del arte, que es donde el corte se lee intencional.
 */
const BLEED = "-9%";

type BleedWordmarkProps = {
  className?: string;
  /** Cuanto sube el wordmark en el rango de scroll, en %. */
  shift?: number;
};

export function BleedWordmark({ className, shift = 6 }: BleedWordmarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${shift}%`, "0%"]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <m.img
        src="/brand/v2/onia-logo.svg"
        alt="Onia"
        width={1898}
        height={763}
        loading="lazy"
        decoding="async"
        style={{
          y: reduced ? "0%" : y,
          display: "block",
          width: "100%",
          height: "auto",
          marginBottom: BLEED,
        }}
      />
    </div>
  );
}
