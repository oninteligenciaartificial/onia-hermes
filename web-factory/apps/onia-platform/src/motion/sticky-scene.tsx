"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const SceneContext = createContext<MotionValue<number> | null>(null);

type StickySceneProps = {
  /** Cuantos viewports de scroll "dura" la escena. 2–4 razonable; mas cansa. */
  viewports?: number;
  children: ReactNode;
  className?: string;
  /** Clase para el frame sticky interno (fondo, padding, etc.). */
  stickyClassName?: string;
};

/**
 * Escena sticky con scrub — el "pin" casero de la casa, sin GSAP.
 *
 * El wrapper mide `viewports * 100vh`; el frame interno queda
 * `position: sticky` un viewport completo mientras el usuario scrollea.
 * El progreso 0→1 se comparte por contexto y los hijos lo mapean con
 * `useSceneTransform`. Corre sobre ScrollTimeline nativo donde existe
 * (hilo del compositor), con fallback JS.
 *
 * prefers-reduced-motion: la escena colapsa a una seccion normal de 1
 * pantalla y el progreso queda fijo en 1 (estado final estatico).
 *
 * NUNCA anidar dentro de un ancestro con transform (rompe sticky, igual
 * que rompia el pin de GSAP).
 */
export function StickyScene({
  viewports = 3,
  children,
  className,
  stickyClassName,
}: StickySceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const staticProgress = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = reduced ? staticProgress : scrollYProgress;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height: reduced ? "auto" : `${viewports * 100}vh`,
        position: "relative",
      }}
    >
      <div
        className={stickyClassName}
        style={
          reduced
            ? { position: "relative", minHeight: "100vh", overflow: "hidden" }
            : { position: "sticky", top: 0, height: "100vh", overflow: "hidden" }
        }
      >
        <SceneContext.Provider value={progress}>
          {children}
        </SceneContext.Provider>
      </div>
    </div>
  );
}

/** Progreso 0→1 de la escena sticky mas cercana. */
export function useSceneProgress(): MotionValue<number> {
  const value = useContext(SceneContext);
  if (!value) {
    throw new Error("useSceneProgress debe usarse dentro de <StickyScene>");
  }
  return value;
}

/**
 * Mapea el progreso de la escena a un rango de salida, para usar directo en
 * style: `const y = useSceneTransform([0, 0.5], [40, 0])` →
 * `<m.div style={{ y }} />`. Solo mapear a transform/opacity/clipPath.
 */
export function useSceneTransform<T extends string | number>(
  input: number[],
  output: T[],
): MotionValue<T> {
  const progress = useSceneProgress();
  return useTransform(progress, input, output);
}
