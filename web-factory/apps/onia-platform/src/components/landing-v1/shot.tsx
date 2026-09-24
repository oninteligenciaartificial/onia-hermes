import type { ReactNode } from "react";
import styles from "./landing.module.css";

/**
 * Marco de producto — la pieza que se repite en hero, pasos y carrusel.
 *
 * SE CONSTRUYE CON LAS FILAS DE ABAJO, siempre. Una pantalla del producto se
 * arma con markup; no se fotografia.
 *
 * ⚠️ Aca decia que el marco tenia dos usos y que la captura real «es lo que
 * manda cuando existe». Eso estaba al reves de la regla de Sergio Urcullo del
 * 2026-09-01 —*"no coloques capturas literales del sistema, se ve mal, coloca
 * cosas referenciales"*— y fue el comentario que licencio el defecto que se
 * encontro el 2026-09-24: la captura de `/v1` con «MUY PRONTO» y un rubro de
 * mas dibujados adentro (ver `how-it-works.tsx`). Un comentario que autoriza lo
 * que la regla prohibe vuelve a crear el defecto, aunque se arregle la
 * instancia.
 *
 * Y hay un motivo tecnico ademas del de marca: el texto dentro de un raster no
 * lo ve NINGUN gate de este repo. Construido con markup, lo cuidan los gates de
 * texto que ya existen.
 *
 * El marco no lleva borde + sombra difusa (patron de plantilla): es superficie
 * blanca con sombra de elevacion, y nada mas.
 */

export function Shot({
  title,
  tag,
  children,
  bodyless,
}: {
  title: string;
  tag?: string;
  children: ReactNode;
  /** El contenido ya trae su propio relleno (una captura a sangre). */
  bodyless?: boolean;
}) {
  return (
    <div className={styles.shot}>
      <div className={styles.shotBar}>
        <span className={styles.shotDots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.shotTitle}>{title}</span>
        {tag ? <span className={styles.shotTag}>{tag}</span> : null}
      </div>
      {bodyless ? children : <div className={styles.shotBody}>{children}</div>}
    </div>
  );
}

/*
 * Aca vivia `ShotImage`, que metia un <img> a sangre dentro del marco. Se
 * BORRO el 2026-09-24 junto con su unico consumidor, y no es limpieza de codigo
 * muerto: era la unica manera de poner un raster adentro de un <Shot>, o sea la
 * herramienta con la que se construia el defecto. Dejarla exportada y sin
 * consumidores la ofrecia a la proxima sesion con un nombre amable.
 *
 * Si algun dia hace falta una IMAGEN en un marco, que no sea una pantalla del
 * producto: pasa por `app/imagen-sin-obra.test.ts`, que exige declararla con su
 * motivo y rechaza las capturas por su ruta.
 */

/** Fila de agenda: hora · que · duracion. `state` marca lo vivo o el hueco. */
export function Row({
  time,
  name,
  dur,
  state,
}: {
  time?: string;
  name: string;
  dur?: string;
  state?: "on" | "free";
}) {
  const tone = state === "on" ? styles.on : state === "free" ? styles.free : "";
  return (
    <div className={`${styles.row} ${tone}`}>
      {time ? <span className={styles.t}>{time}</span> : null}
      <span className={styles.n}>{name}</span>
      {dur ? <span className={`${styles.t} ${styles.dur}`}>{dur}</span> : null}
    </div>
  );
}

/** Grilla de modulos con interruptor. `on` = encendido (verde = lo que vive). */
export function Modules({
  items,
}: {
  items: readonly { label: string; on: boolean }[];
}) {
  return (
    <div className={styles.mods}>
      {items.map((mod) => (
        <span
          key={mod.label}
          className={`${styles.mod} ${mod.on ? styles.modOn : ""}`}
        >
          {mod.label}
          <span className={styles.sw} aria-hidden />
        </span>
      ))}
    </div>
  );
}
