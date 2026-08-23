"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import s from "./sitio.module.css";

/**
 * Conmutador de rubros — LA sección estrella (Fanvue le da 6 pantallas de alto
 * a su switcher de nichos). Mecánica MEDIDA, portada del bloque vanilla
 * packages/blocks/src/sticky-niche-switcher.ts y de la versión React verificada
 * components/landing-v2/rubros.tsx:
 *
 *  · El JS decide UN entero (--niche-i) con un scroll handler rAF-throttled que
 *    RELEE getBoundingClientRect() de TODAS las bandas en cada aviso — acumular
 *    estado por centinela se queda viejo en un salto de scroll (bug medido:
 *    saltando hacia atrás el índice quedaba clavado en el último).
 *  · Las bandas miden un rubro de alto, no 1px: un punto se saltea entre dos
 *    frames y el observador nunca despierta.
 *  · El CSS deriva del entero el rodillo, la opacidad de las palabras (1 / .25)
 *    y la píldora. Conmutador DISCRETO por umbral (sin scrub, sin pin, sin GSAP).
 *  · Apilado (móvil / reduced-motion) las palabras van ANTES de las formas.
 *
 * El rodillo ya lleva la CAPTURA REAL de cada rubro. Antes llevaba un bloque de
 * forma+color —dos rectangulos translucidos sobre el color del rubro— que se leia
 * como una imagen que no cargo. La ranura estaba reservada con el ratio exacto,
 * asi que cablear la foto no movio nada: cero CLS.
 *
 * El color sigue debajo de la foto a proposito: es lo que se ve mientras carga,
 * y evita el destello blanco.
 *
 * Cada rubro muestra la pantalla que cuenta SU historia, no la misma para todos
 * —agenda, caja, cotizaciones, contabilidad—: en un conmutador que existe para
 * probar que el sistema cambia por rubro, cinco fotos parecidas prueban lo
 * contrario. Se generan con prisma/seed-demo.ts de onia-platform + el recorte de
 * .verif-tmp/recortes-rubro.mjs, a 2x del tamano de la tarjeta.
 *
 * `<img>` a secas y no next/image: el build es `output: standalone` sobre el VPS
 * y ahi next/image no optimiza (misma decision que landing-v2/pantalla.tsx).
 */

type Rubro = {
  id: string;
  palabra: string;
  /** color del bloque del rubro (tokens de marca, nunca un hex suelto) */
  bg: string;
  /** que se ve en la captura — es el alt, asi que describe la pantalla */
  alt: string;
};

const RUBROS: readonly Rubro[] = [
  { id: "dental", palabra: "Dental", bg: "var(--verde-800)", alt: "Agenda del día de una clínica dental: tres citas con hora, duración, motivo y teléfono." },
  { id: "comercio", palabra: "Comercio", bg: "var(--verde-900)", alt: "Caja de una ferretería: total del día por método de pago y las ventas una por una." },
  { id: "importadora", palabra: "Importadora", bg: "var(--tinta)", alt: "Cotizaciones B2B de una importadora, con su estado y su monto en bolivianos." },
  { id: "estetica", palabra: "Estética", bg: "var(--verde-700)", alt: "Agenda del día de un centro de estética: sesiones de láser y controles post-tratamiento." },
  { id: "servicios", palabra: "Servicios", bg: "var(--verde-900)", alt: "Contabilidad de un estudio profesional: IVA e IT del mes y registro de ventas." },
];

/** 2x del tamaño de la tarjeta: alcanza para retina sin pagar un archivo enorme. */
const FOTO = { w: 956, h: 1120 } as const;

export function Switcher() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;
    const marcas = Array.from(runway.querySelectorAll<HTMLElement>("[data-mark]"));
    if (marcas.length < 2) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      // se relee la geometría de TODAS las bandas: gana la última cruzada.
      // en móvil/reduced-motion van display:none, sus rects son cero y el
      // índice vuelve solo a 0 — sin guardas de matchMedia.
      let i = 0;
      for (let k = 0; k < marcas.length; k += 1) {
        if (marcas[k].getBoundingClientRect().top < 0) i = k;
      }
      setActivo((prev) => (prev === i ? prev : i));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };

    medir(); // recarga a mitad del runway: arranca en el rubro correcto
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={runwayRef}
      className={s.runway}
      style={{ "--niche-i": activo, "--niche-run": RUBROS.length + 1 } as CSSProperties}
    >
      <div className={s.marks} aria-hidden="true">
        {RUBROS.map((r, k) => (
          <i
            key={r.id}
            data-mark
            className={s.mark}
            style={{ top: `calc(var(--niche-step) * ${k})` }}
          />
        ))}
      </div>

      <div className={s.stage}>
        <div className={s.card}>
          <div className={s.roll}>
            {RUBROS.map((r) => (
              <div key={r.id} className={s.slot}>
                <span
                  className={s.slotShape}
                  style={{ background: r.bg } as CSSProperties}
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element -- standalone sin sharp: next/image no optimiza en el VPS */}
                <img
                  src={`/rubros/${r.id}.webp`}
                  alt={r.alt}
                  width={FOTO.w}
                  height={FOTO.h}
                  loading="lazy"
                  decoding="async"
                  className={s.slotFoto}
                />
                {/* Solo en el layout APILADO (movil / reduced-motion). Ahi las
                    cinco capturas se ven a la vez y, sin esto, nada dice cual es
                    cual: la lista de palabras esta arriba y la correspondencia
                    queda librada a que el lector cuente posiciones. En desktop
                    sobra —la palabra activa esta gigante al lado— y por eso el
                    CSS la esconde. */}
                <span className={s.slotNombre} aria-hidden="true">
                  {r.palabra}
                </span>
              </div>
            ))}
          </div>
          {/* La pildora con el nombre del rubro se quito al cablear la foto: sobre
              el bloque de color se leia, pero sobre una captura clara tapaba una
              fila de datos para repetir la palabra que ya esta gigante al lado. */}
        </div>

        <div className={s.stageMid}>
          <ol className={s.words} aria-label="Rubros vivos hoy">
            {RUBROS.map((r, k) => (
              <li key={r.id}>
                <span
                  className={s.word}
                  aria-current={k === activo ? "true" : "false"}
                >
                  {r.palabra}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
