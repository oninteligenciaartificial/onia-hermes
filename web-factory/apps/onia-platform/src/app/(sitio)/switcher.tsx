"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PanelDibujado } from "./ui";
import s from "./sitio.module.css";

/**
 * Conmutador de rubros v3 — TODO FIJO (segunda vuelta de Sergio Urcullo,
 * 11-sep, sobre el v2 en el preview: "aquí que los textos estén fijos y sigue
 * las tipografías de la marca onia, no cambies y haz que se vea más bonito").
 *
 * El v2 scrolleaba los bloques de texto (70vh cada uno): en pantalla era un
 * título, un hueco gigante y el siguiente rubro flotando en gris. En el v3 la
 * sección queda CLAVADA a pantalla completa y el scroll solo avanza el rubro:
 * texto e imagen cambian en el lugar, uno por uno, sin huecos.
 *
 * Mecánica: el contenedor mide --n × 90vh (el "recorrido"); un handler
 * rAF-throttled RELEE getBoundingClientRect() del contenedor en cada aviso
 * (lección del v1: acumular estado se queda viejo en un salto de scroll) y
 * convierte el avance [0..1] en el índice del rubro.
 *
 * APILADO (móvil): cada rubro con su texto y SU panel juntos, en orden.
 * Reduced-motion NO degrada el layout de escritorio — Sergio lo tiene activo
 * en Windows y el fallback es lo que él ve; solo se apagan las transiciones.
 *
 * El rodillo lleva el PANEL DIBUJADO de cada rubro, nunca una captura
 * (Sergio, 2026-09-01; guard forma.test.ts). El copy repite lo que este mismo
 * sitio ya publica por rubro — acá no nace ninguna promesa.
 */

type Rubro = {
  /** el mismo id que el panel dibujado en ui.tsx (PanelId) */
  id: "dental" | "comercio" | "importadora" | "estetica" | "servicios";
  palabra: string;
  /** color del mat del rubro (tokens de marca, nunca un hex suelto) */
  bg: string;
  /** una línea del RESULTADO, la misma historia que dibuja su panel */
  linea: string;
};

/**
 * Los cinco mats se alternan a propósito (dos verdes vecinos parecidos hacían
 * que el rodillo pareciera trabado — medido en v1): oscuro → señal → tinta →
 * medio → hondo. El orden de los rubros NO se toca: dental primero es la
 * regla del proyecto (dental vivo → comercio → importadora).
 */
const RUBROS: readonly Rubro[] = [
  {
    id: "dental",
    palabra: "Dental",
    bg: "var(--verde-800)",
    linea: "La agenda del día con cada paciente, su hora, su tratamiento y su teléfono.",
  },
  {
    id: "comercio",
    palabra: "Comercio",
    bg: "var(--signal)",
    linea: "La caja del día cortada por método de pago — y el fiado fuera del cuaderno.",
  },
  {
    id: "importadora",
    palabra: "Importadora",
    bg: "var(--tinta)",
    linea: "Tus cotizaciones vivas: cuál se aprobó, cuál marcaste como enviada y cuál espera respuesta.",
  },
  {
    id: "estetica",
    palabra: "Estética",
    bg: "var(--verde-500)",
    linea: "La clienta que dejó el tratamiento a medias: te queda el mensaje escrito con tu link para que reserve, y vos lo aprobás.",
  },
  {
    id: "servicios",
    palabra: "Servicios",
    bg: "var(--verde-900)",
    linea: "Ventas y compras del mes al día, para llegar al cierre sin arqueología.",
  },
];

export function Switcher() {
  const contRef = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const cont = contRef.current;
    if (!cont) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      // Avance = cuánto del recorrido del contenedor ya cruzó el tope del
      // viewport. En móvil (sin recorrido: height auto) no hay nada que medir
      // y el índice queda inofensivo — el pin está display:none.
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.min(Math.max(-r.top / recorrido, 0), 1);
      const i = Math.min(RUBROS.length - 1, Math.floor(avance * RUBROS.length));
      setActivo((prev) => (prev === i ? prev : i));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };

    medir(); // recarga a mitad de la sección: arranca en el rubro correcto
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
      className={s.swy}
      ref={contRef}
      style={{ "--n": RUBROS.length } as CSSProperties}
    >
      {/* Escritorio: la escena FIJA. Texto e imagen cambian en el lugar. */}
      <div className={s.swyPin}>
        <div>
          <div className={s.swyTexto}>
            {RUBROS.map((r, k) => (
              <div
                key={r.id}
                className={k === activo ? `${s.swyTx} ${s.swyTxActivo}` : s.swyTx}
                aria-hidden={k === activo ? undefined : "true"}
              >
                <h3 className={s.swyPalabra}>{r.palabra}</h3>
                <p className={s.swyLinea}>{r.linea}</p>
              </div>
            ))}
          </div>
          <div className={s.swyPuntos} aria-hidden="true">
            {RUBROS.map((r, k) => (
              <span
                key={r.id}
                className={
                  k === activo ? `${s.swyPunto} ${s.swyPuntoActivo}` : s.swyPunto
                }
              />
            ))}
          </div>
        </div>

        <div className={s.swyEscenario} aria-hidden="true">
          {RUBROS.map((r, k) => (
            <div
              key={r.id}
              className={`${s.swyPanel}${k === activo ? ` ${s.swyPanelActivo}` : ""}`}
              style={{ background: r.bg } as CSSProperties}
            >
              <PanelDibujado panel={r.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Apilado (móvil): cada rubro con su panel, en orden. */}
      <div className={s.swyApilado}>
        {RUBROS.map((r) => (
          <article key={r.id} className={s.swyPar}>
            <h3 className={s.swyPalabra}>{r.palabra}</h3>
            <p className={s.swyLinea}>{r.linea}</p>
            <div
              className={s.swyPanelInline}
              style={{ background: r.bg } as CSSProperties}
            >
              <PanelDibujado panel={r.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
