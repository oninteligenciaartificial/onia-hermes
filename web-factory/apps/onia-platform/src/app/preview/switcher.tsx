"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import s from "./preview.module.css";

/**
 * Conmutador de rubros — LA sección estrella (Fanvue le da 6 pantallas de alto
 * a su switcher de nichos). Mecánica MEDIDA, portada del bloque vanilla
 * packages/blocks/src/sticky-niche-switcher.ts y de la versión React verificada
 * components/landing-v2/rubros.tsx:
 *
 *  · El JS decide UN entero (--niche-i) con un scroll handler rAF-throttled que
 *    RELEE getBoundingClientRect() de TODAS las bandas en cada aviso — acumular
 *    estado por centinela se queda viejo en un salto de scroll (bug medido:
 *    saltando hacia atrás el índice quedaba clavado en el último).
 *  · Las bandas miden un rubro de alto, no 1px: un punto se saltea entre dos
 *    frames y el observador nunca despierta.
 *  · El CSS deriva del entero el rodillo, la opacidad de las palabras (1 / .25)
 *    y la píldora. Conmutador DISCRETO por umbral (sin scrub, sin pin, sin GSAP).
 *  · Apilado (móvil / reduced-motion) las palabras van ANTES de las formas.
 *
 * Diferencia con el original: el rodillo NO lleva fotos (regla de esta sesión:
 * sin imágenes). Lleva un bloque de forma+color por rubro — el "juego de formas
 * y colores" de Fanvue que pidió Sergio. Cada rubro reserva su ratio para que un
 * clip real entre después sin CLS.
 */

type Rubro = {
  id: string;
  palabra: string;
  /** color del bloque del rubro (tokens de marca, nunca un hex suelto) */
  bg: string;
};

const RUBROS: readonly Rubro[] = [
  { id: "dental", palabra: "Dental", bg: "var(--verde-800)" },
  { id: "comercio", palabra: "Comercio", bg: "var(--verde-900)" },
  { id: "importadora", palabra: "Importadora", bg: "var(--tinta)" },
  { id: "estetica", palabra: "Estética", bg: "var(--verde-700)" },
  { id: "servicios", palabra: "Servicios", bg: "var(--verde-900)" },
];

export function Switcher() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;
    const marcas = Array.from(runway.querySelectorAll<HTMLElement>("[data-mark]"));
    if (marcas.length < 2) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      // se relee la geometría de TODAS las bandas: gana la última cruzada.
      // en móvil/reduced-motion van display:none, sus rects son cero y el
      // índice vuelve solo a 0 — sin guardas de matchMedia.
      let i = 0;
      for (let k = 0; k < marcas.length; k += 1) {
        if (marcas[k].getBoundingClientRect().top < 0) i = k;
      }
      setActivo((prev) => (prev === i ? prev : i));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };

    medir(); // recarga a mitad del runway: arranca en el rubro correcto
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={runwayRef}
      className={s.runway}
      style={{ "--niche-i": activo, "--niche-run": RUBROS.length + 1 } as CSSProperties}
    >
      <div className={s.marks} aria-hidden="true">
        {RUBROS.map((r, k) => (
          <i
            key={r.id}
            data-mark
            className={s.mark}
            style={{ top: `calc(var(--niche-step) * ${k})` }}
          />
        ))}
      </div>

      <div className={s.stage}>
        <div className={s.card}>
          <div className={s.roll}>
            {RUBROS.map((r) => (
              <div key={r.id} className={s.slot}>
                <span
                  className={s.slotShape}
                  style={{ background: r.bg } as CSSProperties}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
          {/* decorativa: duplica la palabra activa, nunca un negocio inventado */}
          <div className={s.pill} aria-hidden="true">
            <span className={s.pillWin}>
              <span className={s.pillRows}>
                {RUBROS.map((r) => (
                  <span key={r.id} className={s.pillRow}>
                    {r.palabra}
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>

        <div className={s.stageMid}>
          <ol className={s.words} aria-label="Rubros vivos hoy">
            {RUBROS.map((r, k) => (
              <li key={r.id}>
                <span
                  className={s.word}
                  aria-current={k === activo ? "true" : "false"}
                >
                  {r.palabra}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
