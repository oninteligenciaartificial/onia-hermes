"use client";

import { useState } from "react";
import { CountUp } from "@/motion";
import {
  CHATBOT_ADDONS,
  CHATBOT_BASE,
  CHATBOT_PRESETS,
  type AddonId,
} from "@/content/chatbot-precios";
import { waServiciosLink } from "@/lib/site";
import styles from "./configurador.module.css";

const fmt = (v: number) => Math.round(v).toLocaleString("es-BO");

/**
 * El centro de /chatbot: el cliente arma su chatbot encendiendo add-ons
 * (interruptores aria-pressed, mismo lenguaje que los módulos de la landing)
 * o eligiendo un preset. Total vivo + CTA que abre WhatsApp con el resumen
 * ya escrito — patrón checkout-WhatsApp de la casa, sin backend.
 *
 * Todos los montos salen de src/content/chatbot-precios.ts. Acá no vive
 * ningún número.
 */
export function Configurador() {
  const [activos, setActivos] = useState<readonly AddonId[]>([]);

  const seleccion = CHATBOT_ADDONS.filter((a) => activos.includes(a.id));
  const mensual =
    CHATBOT_BASE.mensual + seleccion.reduce((sum, a) => sum + a.mensual, 0);

  function toggle(id: AddonId) {
    setActivos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const presetActivo = CHATBOT_PRESETS.find(
    (p) =>
      p.addons.length === activos.length &&
      p.addons.every((id) => activos.includes(id)),
  );

  const resumen = [
    `Hola, quiero el ${CHATBOT_BASE.nombre} de Onia armado así:`,
    `- Base (responde 24/7, califica y deriva): Bs ${fmt(CHATBOT_BASE.mensual)}/mes`,
    ...seleccion.map(
      (a) => `- ${a.nombre} (${a.detalle}): +Bs ${fmt(a.mensual)}/mes`,
    ),
    `Total: Bs ${fmt(mensual)}/mes + Bs ${fmt(CHATBOT_BASE.instalacion)} de instalación única.`,
  ].join("\n");

  return (
    <div className={styles.wrap}>
      <div>
        <p className={styles.presetLabel} id="presets-label">
          Empezá por un armado típico
        </p>
        <div
          className={styles.presets}
          role="group"
          aria-labelledby="presets-label"
        >
          {CHATBOT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.preset}
              aria-pressed={presetActivo?.id === preset.id}
              onClick={() => setActivos([...preset.addons])}
            >
              <span className={styles.presetPaso}>
                {preset.id.toUpperCase()}
              </span>
              <span className={styles.presetNombre}>{preset.nombre}</span>
              <span className={styles.presetRes}>{preset.resultado}</span>
            </button>
          ))}
        </div>

        <div className={styles.base}>
          <div className={styles.baseHead}>
            <h3 className={styles.baseNombre}>
              <span className={styles.led} aria-hidden />
              {CHATBOT_BASE.nombre} — la base
            </h3>
            <span className={`${styles.basePrecio} mono`}>
              Bs {fmt(CHATBOT_BASE.mensual)}/mes
            </span>
          </div>
          <ul className={styles.baseIncluye}>
            {CHATBOT_BASE.incluye.map((item) => (
              <li key={item}>
                <span className={styles.baseCheck} aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.addons}>
          {CHATBOT_ADDONS.map((addon) => {
            const on = activos.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                className={styles.addon}
                aria-pressed={on}
                onClick={() => toggle(addon.id)}
              >
                <span className={styles.addonLed} aria-hidden />
                <span className={styles.addonBody}>
                  <span className={styles.addonNombre}>{addon.nombre}</span>
                  <span className={styles.addonDesc}>{addon.detalle}</span>
                </span>
                <span className={styles.addonPrecio}>
                  +Bs {fmt(addon.mensual)}/mes
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className={styles.resumen} aria-label="Tu chatbot armado">
        <p className={styles.resumenTitulo}>Tu chatbot</p>
        <ul className={styles.lineas}>
          <li className={styles.linea}>
            <span>Base — {CHATBOT_BASE.nombre}</span>
            <span className={styles.lineaMonto}>
              Bs {fmt(CHATBOT_BASE.mensual)}
            </span>
          </li>
          {seleccion.map((addon) => (
            <li key={addon.id} className={styles.linea}>
              <span>{addon.nombre}</span>
              <span className={styles.lineaMonto}>+Bs {fmt(addon.mensual)}</span>
            </li>
          ))}
        </ul>
        <p className={styles.total} aria-hidden>
          <span className={styles.totalN}>
            <CountUp value={mensual} />
          </span>
          <span className={styles.totalU}>Bs/mes</span>
        </p>
        {/* El total animado se oculta al lector de pantalla; este anuncio
            estático es el que cambia una vez por interacción. */}
        <span className={styles.srOnly} aria-live="polite">
          Total: {fmt(mensual)} bolivianos al mes
        </span>
        <p className={styles.instalacion}>
          + Bs {fmt(CHATBOT_BASE.instalacion)} de instalación, una sola vez.
        </p>
        <a className={`btn ${styles.cta}`} href={waServiciosLink(resumen)}>
          Lo quiero así
        </a>
        <p className={styles.ctaMicro}>
          Se abre WhatsApp con tu armado ya escrito. Lo ajustamos hablando —
          nada queda contratado hasta que vos digas.
        </p>
      </aside>
    </div>
  );
}
