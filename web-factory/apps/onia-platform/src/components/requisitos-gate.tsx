"use client";

import { useId, useState } from "react";
import { textoAceptacion, type Requisitos } from "@/content/requisitos";
import { waServiciosLink } from "@/lib/site";
import styles from "./requisitos.module.css";

interface Props {
  req: Requisitos;
  /** Lo que el cliente pide, ya armado (plan, stack, total). */
  mensaje: string;
  /** Texto del botón. */
  cta: string;
}

/**
 * Requisitos en el PUNTO DE COMPRA.
 *
 * Tres decisiones deliberadas:
 *  1. Los requisitos están VISIBLES en la página, no en un modal ni en un
 *     acordeón cerrado: no se puede mandar el pedido sin haberlos tenido
 *     delante.
 *  2. La casilla habilita el botón. El enlace nunca se saca del orden de
 *     tabulación (aria-disabled, no `disabled`), así que un lector de pantalla
 *     lo encuentra y lee POR QUÉ todavía no se puede usar.
 *  3. El texto que se manda por WhatsApp lleva la aceptación adentro: la
 *     constancia queda en el chat del cliente, no solo en la página.
 */
export function RequisitosGate({ req, mensaje, cta }: Props) {
  const [aceptado, setAceptado] = useState(false);
  const uid = useId();
  const checkId = `${uid}-ok`;
  const hintId = `${uid}-hint`;

  const texto = `${mensaje}\n\n${textoAceptacion(req)}`;
  const href = waServiciosLink(texto);

  return (
    <section className={styles.wrap} aria-labelledby={`${uid}-t`}>
      <h2 className={styles.titulo} id={`${uid}-t`}>
        {req.titulo}
      </h2>
      <p className={styles.entrada}>{req.entrada}</p>

      <div className={styles.bloques}>
        {req.bloques.map((bloque) => (
          <div key={bloque.titulo} className={styles.bloque}>
            <h3 className={styles.bloqueTitulo}>{bloque.titulo}</h3>
            {bloque.intro && <p className={styles.bloqueIntro}>{bloque.intro}</p>}
            <ul className={styles.items}>
              {bloque.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.gate}>
        <input
          type="checkbox"
          id={checkId}
          className={styles.check}
          checked={aceptado}
          onChange={(e) => setAceptado(e.target.checked)}
        />
        <label htmlFor={checkId} className={styles.checkLabel}>
          {req.aceptacion}
        </label>
      </div>

      <a
        className={`btn ${styles.cta}`}
        href={aceptado ? href : undefined}
        aria-disabled={!aceptado}
        aria-describedby={aceptado ? undefined : hintId}
        onClick={(e) => {
          if (!aceptado) e.preventDefault();
        }}
      >
        {cta}
      </a>
      <p className={styles.hint} id={hintId}>
        {aceptado
          ? "Se abre WhatsApp con tu pedido y los requisitos ya escritos. Nada queda contratado hasta que vos digas."
          : "Marcá la casilla de arriba para poder enviar el pedido. Va con los requisitos escritos adentro del mensaje."}
      </p>
    </section>
  );
}
