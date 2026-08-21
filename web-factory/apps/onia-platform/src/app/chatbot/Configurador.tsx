"use client";

import { useState } from "react";
import { CountUp } from "@/motion";
import {
  CHATBOT_STACKS,
  META_NOTA,
  fmtBs,
  precioAnual,
  precioStack,
  type StackId,
} from "@/content/chatbot-precios";
import { REQUISITOS_CHATBOT } from "@/content/requisitos";
import { RequisitosGate } from "@/components/requisitos-gate";
import styles from "./configurador.module.css";

/**
 * El centro de /chatbot: tres stacks, no un menú de add-ons sueltos. El
 * cliente elige el nivel, ve exactamente qué incluye, qué NO y qué tiene que
 * poner él, y el pedido sale por WhatsApp recién después de marcar que leyó
 * los requisitos (RequisitosGate). Sin backend.
 *
 * Todos los montos salen de src/content/chatbot-precios.ts. Acá no vive
 * ningún número.
 */
export function Configurador() {
  const [elegido, setElegido] = useState<StackId>("whatsapp");
  const stack =
    CHATBOT_STACKS.find((s) => s.id === elegido) ?? CHATBOT_STACKS[0];

  const mensaje = [
    `Hola, vengo de la web de Onia. Quiero el chatbot de WhatsApp ${stack.nivel} — "${stack.nombre}".`,
    `Precio que vi: ${precioStack(stack)}.`,
  ].join("\n");

  return (
    <>
      <div className={styles.wrap}>
        <div>
          <p className={styles.presetLabel} id="stacks-label">
            Elegí el stack
          </p>
          <div
            className={styles.presets}
            role="group"
            aria-labelledby="stacks-label"
          >
            {CHATBOT_STACKS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={styles.preset}
                aria-pressed={s.id === elegido}
                onClick={() => setElegido(s.id)}
              >
                <span className={styles.presetPaso}>
                  {s.nivel}
                  {s.destacado ? " · el más pedido" : ""}
                </span>
                <span className={styles.presetNombre}>{s.nombre}</span>
                <span className={styles.presetRes}>{precioStack(s)}</span>
              </button>
            ))}
          </div>

          <div className={styles.base}>
            <div className={styles.baseHead}>
              <h3 className={styles.baseNombre}>
                <span className={styles.led} aria-hidden />
                {stack.nivel} — {stack.nombre}
              </h3>
              <span className={`${styles.basePrecio} mono`}>
                Bs {fmtBs(stack.mensual)}/mes
              </span>
            </div>

            <p className={styles.detalleLinea}>
              <strong>Qué resuelve.</strong> {stack.resuelve}
            </p>
            <p className={styles.detalleLinea}>
              <strong>Para quién es.</strong> {stack.paraQuien}
            </p>

            <div className={styles.detalleCols}>
              <div>
                <p className={styles.detalleTitulo}>Qué incluye</p>
                <ul className={styles.baseIncluye}>
                  {stack.incluye.map((item) => (
                    <li key={item}>
                      <span className={styles.baseCheck} aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={styles.detalleTitulo}>Qué NO incluye</p>
                <ul className={styles.listaSimple}>
                  {stack.noIncluye.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={styles.detalleTitulo}>Qué necesitás vos</p>
                <ul className={styles.listaSimple}>
                  {stack.necesitasVos.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.resumen} aria-label="Tu chatbot">
          <p className={styles.resumenTitulo}>Tu chatbot</p>
          <ul className={styles.lineas}>
            <li className={styles.linea}>
              <span>
                {stack.nivel} — {stack.nombre}
              </span>
              <span className={styles.lineaMonto}>
                Bs {fmtBs(stack.mensual)}/mes
              </span>
            </li>
            <li className={styles.linea}>
              <span>Instalación</span>
              <span className={styles.lineaMonto}>sin costo</span>
            </li>
          </ul>
          <p className={styles.total} aria-hidden>
            <span className={styles.totalN}>
              <CountUp value={stack.mensual} />
            </span>
            <span className={styles.totalU}>Bs/mes</span>
          </p>
          {/* El total animado se oculta al lector de pantalla; este anuncio
              estático es el que cambia una vez por interacción. */}
          <span className={styles.srOnly} aria-live="polite">
            {stack.nivel}, {stack.nombre}: {fmtBs(stack.mensual)} bolivianos al
            mes, sin costo de instalación
          </span>
          <p className={styles.instalacion}>
            Sin costo de instalación. O {precioAnual(stack)}.
          </p>
          <p className={styles.ctaMicro}>{META_NOTA}</p>
          <p className={styles.ctaMicro}>
            El pedido se manda abajo, con los requisitos a la vista.
          </p>
        </aside>
      </div>

      <RequisitosGate
        req={REQUISITOS_CHATBOT}
        mensaje={mensaje}
        cta={`Pedir el ${stack.nivel} por WhatsApp`}
      />
    </>
  );
}
