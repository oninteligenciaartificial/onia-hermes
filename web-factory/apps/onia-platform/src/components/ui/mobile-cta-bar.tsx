"use client";

import { useEffect, useState } from "react";
import { useRubro } from "@/components/rubro-context";
import { rubroPlanes } from "@/lib/pricing";
import { waLink } from "@/lib/site";
import styles from "./mobile-cta-bar.module.css";

/**
 * Barra de accion fija en movil.
 *
 * Por que: la mayoria del trafico llega por WhatsApp desde el telefono. En
 * movil el header solo deja el logo y un boton — "Precios" no se alcanza sin
 * scrollear a ciegas por una pagina larga. La barra mantiene las dos acciones
 * del embudo (ver el precio · escribir) a un pulgar de distancia durante todo
 * el recorrido.
 *
 * Cuando NO aparece, para no ser spam:
 *  - mientras se lee el hero, que ya tiene sus propios CTAs;
 *  - cuando entra la seccion de compra (#empezar), que ya es el cierre;
 *  - en desktop, donde el header sticky ya tiene nav completa.
 *
 * Sin animacion de entrada bajo prefers-reduced-motion: aparece y ya.
 */
export function MobileCtaBar() {
  const { rubro } = useRubro();
  const [heroVisible, setHeroVisible] = useState(true);
  const [cierreVisible, setCierreVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    // el cierre son las dos puertas de compra Y el pie, que tambien tiene su
    // propio WhatsApp: repetirlo en la barra seria decir dos veces lo mismo
    const cierre = [
      document.getElementById("empezar"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => el !== null);
    if (!hero && cierre.length === 0) return;

    const vistos = new Set<Element>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) {
            setHeroVisible(e.isIntersecting);
            continue;
          }
          if (e.isIntersecting) vistos.add(e.target);
          else vistos.delete(e.target);
        }
        setCierreVisible(vistos.size > 0);
      },
      { rootMargin: "-20% 0px -20% 0px" },
    );

    if (hero) obs.observe(hero);
    for (const el of cierre) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visible = !heroVisible && !cierreVisible;
  const actual = rubroPlanes(rubro);
  const texto = `Hola, vengo de la web de Onia. Rubro: ${actual.mensaje}. Quiero saber cómo arranco.`;

  return (
    <div
      className={`${styles.bar} ${visible ? styles.on : ""}`}
      aria-hidden={!visible}
    >
      <a
        href="#precios"
        className={`btn btn-ghost ${styles.action}`}
        tabIndex={visible ? undefined : -1}
      >
        Ver precios
      </a>
      <a
        href={waLink(texto)}
        className={`btn btn-wa ${styles.action}`}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? undefined : -1}
      >
        <span className="btn-dot" aria-hidden />
        WhatsApp
      </a>
    </div>
  );
}
