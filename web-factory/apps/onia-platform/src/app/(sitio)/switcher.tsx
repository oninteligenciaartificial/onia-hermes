"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PanelDibujado } from "./ui";
import s from "./sitio.module.css";

/**
 * Conmutador de rubros v2 — SCROLLYTELLING (pedido de Sergio Urcullo, 11-sep,
 * sobre captura de producción: "texto a la izquierda, imágenes a la derecha,
 * que se muevan mediante scroll y se vean uno por uno").
 *
 * Layout: los cinco bloques de texto scrollean a la izquierda; el panel
 * DIBUJADO del rubro activo queda pegado (sticky) a la derecha y cambia con
 * crossfade cuando el bloque de texto siguiente cruza el centro del viewport.
 *
 * La MECÁNICA de detección se hereda del conmutador v1, batallada y medida:
 *  · UN entero (activo) decidido por un scroll handler rAF-throttled que RELEE
 *    getBoundingClientRect() de TODOS los bloques en cada aviso — acumular
 *    estado por centinela se queda viejo en un salto de scroll (bug medido:
 *    saltando hacia atrás el índice quedaba clavado en el último).
 *  · El umbral es el CENTRO del viewport, no el borde: con texto de altura
 *    real (no bandas invisibles) el rubro se activa cuando SU texto es el que
 *    se está leyendo.
 *
 * APILADO (móvil y reduced-motion): cada rubro muestra su texto y SU panel
 * juntos, en orden. ⚠️ La versión anterior apilaba LAS CINCO PALABRAS gigantes
 * primero y los cinco paneles después — eso es lo que Sergio vio en producción
 * (su Windows tiene "reducir movimiento" activado, así que él SIEMPRE ve el
 * fallback) y lo que motivó este rediseño: el fallback también es la página.
 *
 * El rodillo lleva el PANEL DIBUJADO de cada rubro, nunca una captura
 * (Sergio, 2026-09-01; guard forma.test.ts). El copy de cada bloque repite lo
 * que este mismo sitio ya publica por rubro — acá no nace ninguna promesa.
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
    linea: "Tus cotizaciones vivas: cuál se aprobó, cuál se envió y cuál espera respuesta.",
  },
  {
    id: "estetica",
    palabra: "Estética",
    bg: "var(--verde-500)",
    linea: "Cada paquete con las sesiones ya hechas y las que faltan, control incluido.",
  },
  {
    id: "servicios",
    palabra: "Servicios",
    bg: "var(--verde-900)",
    linea: "Ventas y compras del mes al día, para llegar al cierre sin arqueología.",
  },
];

export function Switcher() {
  const listaRef = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const bloques = Array.from(lista.querySelectorAll<HTMLElement>("[data-rubro]"));
    if (bloques.length < 2) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      // Gana el último bloque cuyo tope cruzó el centro del viewport. Se relee
      // TODA la geometría en cada aviso (la lección del v1). En apilado los
      // bloques siguen visibles, así que el índice es inofensivo ahí: el panel
      // sticky está display:none.
      const centro = window.innerHeight / 2;
      let i = 0;
      for (let k = 0; k < bloques.length; k += 1) {
        if (bloques[k].getBoundingClientRect().top < centro) i = k;
      }
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
    <div className={s.swy} ref={listaRef}>
      {/* Columna de TEXTO: los cinco bloques scrollean. En apilado, cada
          bloque trae su propio panel debajo. */}
      <div className={s.swyTextos}>
        {RUBROS.map((r, k) => (
          <article
            key={r.id}
            data-rubro
            className={s.swyBloque}
            aria-current={k === activo ? "true" : "false"}
          >
            <h3 className={s.swyPalabra}>{r.palabra}</h3>
            <p className={s.swyLinea}>{r.linea}</p>
            {/* El panel INLINE del apilado (móvil / reduced-motion). En el
                scrolly de escritorio va display:none y manda el sticky. */}
            <div className={s.swyPanelInline} style={{ background: r.bg } as CSSProperties}>
              <PanelDibujado panel={r.id} />
            </div>
          </article>
        ))}
      </div>

      {/* Columna STICKY: un solo panel visible por vez, crossfade al cambiar. */}
      <div className={s.swyEscenario} aria-hidden="true">
        <div className={s.swySticky}>
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
    </div>
  );
}
