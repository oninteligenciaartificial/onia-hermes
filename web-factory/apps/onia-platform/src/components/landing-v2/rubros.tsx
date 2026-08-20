"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/motion";
import styles from "./v2.module.css";

/**
 * 3. RUBROS — el conmutador de rubros pegado al scroll de Fanvue
 *    (Sport/Music/Art…), portado del bloque vanilla YA medido y verificado:
 *    packages/blocks/src/sticky-niche-switcher.ts + la ficha
 *    data/references/design-sources/fanvue-secciones/sticky-niche-switcher.md.
 *
 * Mecánica (idéntica al bloque, no reinventada):
 *  · El JS decide UN entero (--niche-i) con un scroll handler rAF-throttled
 *    que RELEE getBoundingClientRect() de TODAS las bandas en cada aviso —
 *    acumular estado por centinela se queda viejo en un salto de scroll
 *    (medido: saltando hacia atrás el índice quedaba clavado en el último).
 *  · Las bandas miden un rubro de alto, no 1 px: un punto se saltea entre
 *    dos frames y el observador nunca despierta.
 *  · El CSS deriva del entero el rodillo de fotos, la opacidad de las
 *    palabras (1 / 0.25 medido) y la píldora. Cero GSAP: el original es un
 *    conmutador DISCRETO por umbral (sin scrub, sin pin).
 *  · Apilado (móvil / reduced-motion) las palabras van ANTES de las fotos
 *    (order: -1 en .nicheMid): la afirmación antes que la prueba.
 *  · UNA sola tarjeta de fotos: hay una foto real por rubro, no dos — y el
 *    bloque vanilla ya define ese fallback (la escena se recompone, no deja
 *    la ventana derecha vacía).
 *
 * Reglas ONIA encima del diseño:
 *  · La píldora lleva el NOMBRE DEL RUBRO. Cero clientes pagando ⇒ prohibido
 *    inventar negocios, métricas o testimonios.
 *  · href solo donde la página EXISTE: hoy /modulos/dental. Los demás rubros
 *    se renderizan como <span> (el patrón del bloque: pierde teclado, no
 *    rompe ni promete una URL muerta).
 */

type Rubro = {
  id: string;
  palabra: string;
  /** Solo si la página existe de verdad en src/app/modulos/. */
  href?: string;
  foto: string;
  alt: string;
};

const RUBROS: readonly Rubro[] = [
  {
    id: "dental",
    palabra: "Dental",
    href: "/modulos/dental",
    foto: "/fotos/dentista.webp",
    alt: "Odontóloga atendiendo en su consultorio.",
  },
  {
    id: "comercio",
    palabra: "Comercio",
    foto: "/fotos/ferreteria.webp",
    alt: "Mostrador de una ferretería.",
  },
  {
    id: "importadora",
    palabra: "Importadora",
    foto: "/fotos/importadora.webp",
    alt: "Depósito de una importadora.",
  },
  {
    id: "estetica",
    palabra: "Estética",
    foto: "/fotos/estetica.webp",
    alt: "Sesión en un centro de estética.",
  },
  {
    id: "veterinaria",
    palabra: "Veterinaria",
    foto: "/fotos/veterinaria.webp",
    alt: "Veterinaria revisando a un animal.",
  },
  {
    id: "servicios",
    palabra: "Servicios",
    foto: "/fotos/duena-telefono.webp",
    alt: "Dueña de un negocio con el teléfono en la mano.",
  },
];

const PRONTO = ["Gastronomía", "Construcción", "Educación", "Turismo", "Ganadería"] as const;

export function RubrosV2() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;
    const marcas = Array.from(runway.querySelectorAll<HTMLElement>("[data-niche-mark]"));
    if (marcas.length < 2) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      // Se relee la geometría de TODAS las bandas: gana la última cruzada.
      // En móvil/reduced-motion las bandas van display:none, sus rects son
      // cero y el índice vuelve solo a 0 — sin guardas de matchMedia.
      let i = 0;
      for (let k = 0; k < marcas.length; k += 1) {
        if (marcas[k].getBoundingClientRect().top < 0) i = k;
      }
      setActivo((prev) => (prev === i ? prev : i));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };

    medir(); // recarga o enlace profundo a mitad del runway: arranca en el rubro correcto
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.section} aria-labelledby="v2-rubros">
      <div className={styles.container}>
        <Reveal>
          <p className={styles.kicker}>Un solo sistema</p>
          <h2 id="v2-rubros" className={`${styles.titulo} ${styles.medidaCorta}`}>
            Elegís tu rubro y la cuenta ya viene armada.
          </h2>
          <p className={styles.lead}>
            No es un software distinto por industria: es el mismo núcleo con
            módulos y vocabulario propios. Un dentista ve pacientes y
            tratamientos; una ferretería ve productos y fiados.
          </p>
          <div className={styles.acciones}>
            <a className={styles.link} href="/modulos/dental">
              Ver un rubro por dentro →
            </a>
          </div>
        </Reveal>

        <div
          ref={runwayRef}
          className={styles.nicheRunway}
          style={{ "--niche-i": activo, "--niche-run": RUBROS.length + 1 } as CSSProperties}
        >
          <div className={styles.nicheMarks} aria-hidden="true">
            {RUBROS.map((r, k) => (
              <i
                key={r.id}
                data-niche-mark
                className={styles.nicheMark}
                style={{ top: `calc(var(--niche-step) * ${k})` }}
              />
            ))}
          </div>

          <div className={styles.nicheStage}>
            <div className={styles.nicheCard}>
              <div className={styles.nicheRoll}>
                {RUBROS.map((r) => (
                  /* eslint-disable-next-line @next/next/no-img-element -- standalone sin optimizador */
                  <img
                    key={r.id}
                    className={styles.nicheShot}
                    src={r.foto}
                    alt={r.alt}
                    width={282}
                    height={331}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
              {/* Decorativa: duplica la palabra activa, nunca un negocio inventado. */}
              <div className={styles.nichePill} aria-hidden="true">
                <span className={styles.nicheWin}>
                  <span className={styles.nicheRows}>
                    {RUBROS.map((r) => (
                      <span key={r.id} className={styles.nicheRow}>
                        {r.palabra}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>

            <div className={styles.nicheMid}>
              <ol className={styles.nicheWords} aria-label="Rubros vivos hoy">
                {RUBROS.map((r, k) => (
                  <li key={r.id}>
                    {r.href ? (
                      <a
                        className={styles.nicheWord}
                        href={r.href}
                        aria-current={k === activo ? "true" : "false"}
                      >
                        {r.palabra}
                      </a>
                    ) : (
                      <span
                        className={styles.nicheWord}
                        aria-current={k === activo ? "true" : "false"}
                      >
                        {r.palabra}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <p className={styles.nota} style={{ marginTop: "var(--v2-gap-corto)" }}>
          Seis rubros vivos y vendibles hoy. Muy pronto: {PRONTO.join(", ")} —
          el núcleo ya los contempla, falta encenderlos.
        </p>
      </div>
    </section>
  );
}
