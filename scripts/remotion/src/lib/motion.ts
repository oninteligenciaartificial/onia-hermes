// Helpers de movimiento compartidos por las 5 composiciones. Todo puro: función
// de (frame, fps, durationInFrames) → número. Sin Date.now/Math.random (el
// render tiene que ser reproducible frame a frame).
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "./easing";

export interface EnterExitOpts {
  /** Duración de la entrada en ms. Default 280 (entrada rápida, spec: 200-350ms). */
  enterMs?: number;
  /** Duración de la salida en ms. Default 200 (salida más rápida que la entrada). */
  exitMs?: number;
  /** Frames de espera antes de empezar a entrar (para escalonar piezas de un mismo apoyo). */
  delayFrames?: number;
}

export interface EnterExitResult {
  /** 0 al arrancar → 1 una vez adentro (ease-out-expo). No vuelve a bajar. */
  enter: number;
  /** 1 mientras está en pantalla → 0 al terminar (ease-out-quart). */
  exit: number;
  /** min(enter, exit): útil directo para opacity. */
  opacity: number;
  /** Distancia normalizada al reposo (0 = totalmente asentado, crece en el borde
   *  de entrada Y en el de salida) — para animar transforms en ambos extremos
   *  sin tener que escribir la lógica dos veces. */
  offset: number;
}

export function useEnterExit(opts: EnterExitOpts = {}): EnterExitResult {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enterMs = opts.enterMs ?? 280;
  const exitMs = opts.exitMs ?? 200;
  const delay = opts.delayFrames ?? 0;

  const enterFrames = Math.max(1, Math.round((enterMs / 1000) * fps));
  const exitFrames = Math.max(1, Math.round((exitMs / 1000) * fps));

  const enter = interpolate(frame, [delay, delay + enterFrames], [0, 1], {
    easing: EASE_OUT_EXPO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitStart = Math.max(delay + enterFrames, durationInFrames - exitFrames);
  const exit = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    easing: EASE_OUT_QUART,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(enter, exit);
  const offset = Math.max(1 - enter, 1 - exit);

  return { enter, exit, opacity, offset };
}

/** Cuenta hacia arriba desde 0 hasta `target`, con deceleración (sin overshoot).
 *  `target` debe ser un valor fijo por composición (no cambia con el frame). */
export function useCountUp(target: number, opts: { durationMs?: number; delayFrames?: number; easing?: (t: number) => number } = {}): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationMs = opts.durationMs ?? 640;
  const delay = opts.delayFrames ?? 0;
  const frames = Math.max(1, Math.round((durationMs / 1000) * fps));
  return interpolate(frame, [delay, delay + frames], [0, target], {
    easing: opts.easing ?? EASE_OUT_EXPO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** true si el string es un número "puro" (entero o decimal, sin signo/símbolos) —
 *  esos son los que tiene sentido animar como contador. "24/7" o "+35%" NO cuentan. */
export function isPureNumber(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value.trim());
}

/** Formatea un número con separador de miles "." (convención boliviana), sin
 *  depender de Intl (determinista y sin locale data del entorno). */
export function formatBolivianNumber(value: number, decimals: number): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decPart ? `${withThousands},${decPart}` : withThousands;
}
