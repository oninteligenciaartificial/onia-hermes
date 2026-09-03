"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Hero con parallax GSAP: la capa de imagen se aleja (scale + y) mientras
// scrolleás, con el titular quieto encima. Es el motion "cine" que el corpus
// marcó con GSAP en los premium. reduced-motion: no registra el trigger.
export function HeroScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, []);

  // `on-green` marca esta superficie como OSCURA y rebindea los tokens de tinta
  // (ver globals.css). Sin eso, `.btn--ghost` del hero se pintaba con la tinta
  // de superficie clara y quedaba invisible sobre el verde profundo.
  return <div ref={root} className="hero on-green">{children}</div>;
}
