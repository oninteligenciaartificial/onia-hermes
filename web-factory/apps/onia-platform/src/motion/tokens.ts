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

/**
 * Viewport estandar: una sola vez. Re-animar en cada scroll marea, por eso `once`.
 *
 * `amount: "some"` (cualquier pixel dentro) y NO una fraccion, porque `amount`
 * se mide sobre el ALTO DEL ELEMENTO: un bloque alto que asoma por abajo puede
 * estar en pantalla y no llegar nunca al umbral, y se queda en `opacity: 0`.
 * No es teorico — se midio dos veces en este repo:
 *
 * - 2026-09-02, `onia.com.bo/` en telefono: el panel del dia (`s.day`, 512px de
 *   alto) asoma 148px en la primera pantalla de un iPhone 12-16 (390x844) = 29%,
 *   justo por debajo del 30%. El lead que llega desde WhatsApp abre la home y ve
 *   una franja de 148px EN BLANCO abajo, que solo aparece si scrollea. Igual en
 *   Galaxy S20/S23 (360x800): 53px en blanco. A 393x852 y mas alto entraba al
 *   35% y se veia bien — por eso ninguna revision a 1440x900 lo agarro.
 * - Antes, en `/servicios/webs`: el punto de compra (~5.000px a 390 de ancho)
 *   quedaba invisible para siempre. Se parcheo achicando ESE Reveal y la causa
 *   quedo viva aca, que es como llego a la home.
 *
 * La invariante que sostiene el numero: **nada que toque la pantalla puede
 * quedar invisible**. Con una fraccion no se cumple para bloques altos; con
 * "some" se cumple por definicion. Lo vigila `tokens.test.ts`.
 */
export const viewportOnce = { once: true, amount: "some" } as const;

/** Distancia estandar de entrada en px. Se anima via transform, nunca top/margin. */
export const riseDistance = 24;

/** Stagger estandar entre hermanos (s). Mas de 0.09 = pagina que se siente lenta. */
export const staggerBase = 0.07;
