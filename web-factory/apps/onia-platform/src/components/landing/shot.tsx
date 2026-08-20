import type { ReactNode } from "react";
import styles from "./landing.module.css";

/**
 * Marco de producto — la pieza que se repite en hero, pasos y carrusel.
 *
 * Dos usos:
 *  1. con una captura REAL de la app adentro (<ShotImage>), que es lo que
 *     manda cuando existe;
 *  2. como maqueta construida con las filas de abajo, para pantallas internas
 *     que hoy no se pueden capturar sin una cuenta demo.
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

/** Captura real de la app dentro del marco. Siempre con medidas explicitas. */
export function ShotImage({
  src,
  alt,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- standalone sin sharp: next/image no optimiza en el VPS
    <img
      className={styles.shotImg}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : null)}
    />
  );
}

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
