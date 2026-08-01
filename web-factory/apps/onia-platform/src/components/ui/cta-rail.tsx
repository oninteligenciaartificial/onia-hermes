"use client";

import { PressableCta } from "@/motion";
import styles from "./cta-rail.module.css";

/**
 * CTA recurrente — la salida a la accion despues de cada bloque de valor.
 *
 * Por que existe: la version anterior de la landing tenia UN solo cierre, al
 * final. Quien se convencia en la seccion del agente tenia que seguir
 * scrolleando media pagina para poder hacer algo. Cada bloque de valor cierra
 * ahora con su propia salida.
 *
 * Para que no se lea como spam hay DOS tonos y se alternan:
 *  - "quiet": una linea sobre un filete, con un enlace. Casi no interrumpe.
 *  - "loud":  banda en tinta, invertida. Se usa UNA sola vez en la pagina, en
 *             el punto de mayor intencion (despues de ver al agente trabajar).
 */

export type Accion = {
  label: string;
  href: string;
  /** "wa" = accion principal · "ghost" = secundaria */
  tipo?: "wa" | "ghost";
  /** Abre en pestaña nueva (agenda externa, WhatsApp). */
  externo?: boolean;
};

export function CtaRail({
  tono = "quiet",
  etiqueta,
  titulo,
  apoyo,
  acciones,
}: {
  tono?: "quiet" | "loud";
  etiqueta?: string;
  titulo: string;
  apoyo?: string;
  acciones: readonly Accion[];
}) {
  return (
    <section
      className={`${styles.rail} ${tono === "loud" ? styles.loud : styles.quiet}`}
      aria-label={titulo}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          {etiqueta ? (
            <p className={`mono ${styles.etiqueta}`}>
              <span className={styles.dot} aria-hidden />
              {etiqueta}
            </p>
          ) : null}
          <p className={styles.titulo}>{titulo}</p>
          {apoyo ? <p className={styles.apoyo}>{apoyo}</p> : null}
        </div>

        <div className={styles.acciones}>
          {acciones.map((a) => (
            <PressableCta key={a.href + a.label}>
              <a
                href={a.href}
                className={`btn ${a.tipo === "ghost" ? "btn-ghost" : "btn-wa"}`}
                {...(a.externo
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {a.tipo === "ghost" ? null : (
                  <span className="btn-dot" aria-hidden />
                )}
                {a.label}
              </a>
            </PressableCta>
          ))}
        </div>
      </div>
    </section>
  );
}
