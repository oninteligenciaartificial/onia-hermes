"use client";

import { useEffect } from "react";

/**
 * Reveal on scroll (fade + 12px rise) via IntersectionObserver.
 * Solo opacity/transform. `prefers-reduced-motion` lo apaga todo.
 * El estado oculto solo aplica bajo `html.js` (progressive enhancement).
 */
export function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const el of elements) {
        el.classList.add("is-revealed");
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
