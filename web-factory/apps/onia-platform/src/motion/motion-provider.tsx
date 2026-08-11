"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * Envolver la pagina UNA sola vez (layout raiz o page).
 *
 * - LazyMotion async: ~4.6 kb gzip sincronos en el bundle inicial; las
 *   features (~15 kb) llegan code-split despues del first paint.
 * - `strict`: un `<motion.div>` accidental (34 kb, el paquete completo)
 *   revienta en dev en vez de colarse callado al bundle.
 * - `reducedMotion="user"`: prefers-reduced-motion apaga las animaciones de
 *   transform globalmente (queda solo opacity suave). Los componentes con
 *   logica imperativa (CountUp, AgentScene, Magnetic) ademas chequean
 *   `useReducedMotion()` por su cuenta.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/*
        Sin JS, ninguna seccion puede quedar en blanco. Los reveal salen del
        servidor con `opacity:0` en linea, asi que el unico que puede ganarles es
        un !important. Vive aca, con el provider que causa el problema, para que
        valga en TODAS las paginas: antes la regla estaba suelta en el home y las
        subpaginas que ahora tambien animan se habrian quedado invisibles.
      */}
      <noscript>
        <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
