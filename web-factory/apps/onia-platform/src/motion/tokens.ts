/**
 * Tokens de motion de la casa — ONIA Platform.
 *
 * Un solo vocabulario fisico para toda la web: los componentes del kit
 * consumen ESTOS tokens, nunca duraciones/eases sueltas. Si un movimiento
 * se siente mal, se corrige aca y cambia en todos lados.
 *
 * Regla dura: solo se animan propiedades de compositor
 * (transform / opacity / clip-path; filter con moderacion).
 */

export const springs = {
  /** UI que responde al dedo: toggles, knobs, chips. Rapido, sin rebote largo. */
  snappy: { type: "spring" as const, stiffness: 420, damping: 30 },
  /** Entradas de contenido: cards, secciones, bloques. */
  gentle: { type: "spring" as const, stiffness: 170, damping: 26, mass: 1 },
  /** Hover/tap fisico de CTA — responde como objeto, no como CSS. */
  press: { type: "spring" as const, stiffness: 400, damping: 17 },
  /** Elementos que "aterrizan" con peso: el chip de cita, cifras, recibos. */
  heavy: { type: "spring" as const, stiffness: 140, damping: 22, mass: 1.3 },
};

export const durations = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
} as const;

/** Ease de la casa para reveals no-fisicos (expo out). */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Viewport estandar: una sola vez, con 30% visible. Re-animar en cada scroll marea. */
export const viewportOnce = { once: true, amount: 0.3 } as const;

/** Distancia estandar de entrada en px. Se anima via transform, nunca top/margin. */
export const riseDistance = 24;

/** Stagger estandar entre hermanos (s). Mas de 0.09 = pagina que se siente lenta. */
export const staggerBase = 0.07;
