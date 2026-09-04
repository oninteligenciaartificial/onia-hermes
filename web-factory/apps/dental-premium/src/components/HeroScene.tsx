"use client";

import { useEffect, useRef } from "react";

// Hero con parallax GSAP: la capa de imagen se aleja (scale + y) mientras
// scrolleás, con el titular quieto encima. Es el motion "cine" que el corpus
// marcó con GSAP en los premium. reduced-motion: no registra el trigger.
export function HeroScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement | null>(null);

  // GSAP entra por import() DINÁMICO, no estático. Importado arriba viajaba en
  // el bundle inicial de la home (187 kB contra un presupuesto de 150) para una
  // animación que sólo corre después de montar, y que con reduced-motion no
  // corre nunca. Así el parallax sigue vivo, en su propio chunk.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelado = false;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      // El componente pudo desmontarse mientras bajaba el chunk: sin esta
      // guarda el trigger queda registrado sobre un nodo que ya no existe.
      if (cancelado) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to(".hero-media", {
          yPercent: 18,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }, root);
    })();
    return () => {
      cancelado = true;
      ctx?.revert();
    };
  }, []);

  // `on-green` marca esta superficie como OSCURA y rebindea los tokens de tinta
  // (ver globals.css). Sin eso, `.btn--ghost` del hero se pintaba con la tinta
  // de superficie clara y quedaba invisible sobre el verde profundo.
  return <div ref={root} className="hero on-green">{children}</div>;
}
