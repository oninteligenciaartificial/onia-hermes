"use client";

import { useId, useState } from "react";
import { REQUISITOS_WEB } from "@/content/requisitos";
import { RequisitosGate } from "@/components/requisitos-gate";
import { WEB_STACKS, precioWeb, type WebStackId } from "@/content/webs";
import styles from "./webs.module.css";

/**
 * El punto de compra de la web: elegís el stack, y el pedido sale por WhatsApp
 * recién después de marcar que leíste los requisitos. El mensaje se manda con
 * los requisitos escritos adentro (RequisitosGate) — así queda constancia y no
 * hay discusión después sobre quién ponía qué.
 */
export function PedirWeb() {
  const [elegido, setElegido] = useState<WebStackId>("profesional");
  const grupo = useId();
  const stack = WEB_STACKS.find((s) => s.id === elegido) ?? WEB_STACKS[0];

  const mensaje = [
    `Hola, vengo de la web de Onia. Quiero la ${stack.nombre}.`,
    `Precio que vi: ${precioWeb(stack)}. Mensual sugerido: ${stack.mensual}.`,
  ].join("\n");

  return (
    <>
      {/* El kicker y el titular los pone la página, con la tipografía del
          cromo v3. Acá vivían como clases globales de la v1 (`kicker`, `h3`) y
          al portar la página quedaban en otro tamaño que el resto. */}
      <div className={styles.picker} role="radiogroup" aria-label="Elegí tu web">
        {WEB_STACKS.map((s) => {
          const on = s.id === elegido;
          return (
            <label
              key={s.id}
              className={`${styles.opcion} ${on ? styles.opcionOn : ""}`}
            >
              <input
                type="radio"
                className={styles.radio}
                name={grupo}
                value={s.id}
                checked={on}
                onChange={() => setElegido(s.id)}
              />
              <span className={styles.opcionNombre}>
                {s.nombre}
                <span className={styles.opcionPrecio}>{precioWeb(s)}</span>
              </span>
            </label>
          );
        })}
      </div>

      <RequisitosGate
        req={REQUISITOS_WEB}
        mensaje={mensaje}
        cta={`Pedir la ${stack.nombre} por WhatsApp`}
      />
    </>
  );
}
