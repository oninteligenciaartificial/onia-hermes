"use client";

import { useEffect, useState } from "react";

/**
 * true en pantallas anchas (>=900px por defecto).
 * En SSR y primer paint devuelve false (mobile-first): las secciones que
 * bifurcan sticky-scrub vs. bloques apilados renderizan primero la variante
 * apilada (valida en todos lados) y suben a la escena rica tras hidratar.
 */
export function useIsDesktop(query = "(min-width: 900px)"): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
