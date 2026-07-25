"use client";

import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { durations, springs } from "./tokens";

type ModuleToggleProps = {
  on: boolean;
  onToggle: (next: boolean) => void;
  /** Nombre accesible del modulo ("Chatbot WhatsApp", "Agentes IA"...). */
  label: string;
  className?: string;
};

/**
 * Interruptor de modulo — LA pieza didactica del pitch de ONIA Platform
 * ("encendes modulos cuando los necesites"). El visitante lo toca y VE el
 * modulo encenderse: la animacion explica el producto, no decora.
 *
 * Compositor-only: el knob viaja por transform (x) y la pista encendida es
 * una capa que cross-fadea por opacity — NUNCA se anima background-color.
 * Colores via CSS con los data-attributes [data-track-off], [data-track-on]
 * y [data-knob] (el acento semantico lo pone la hoja de estilos, no el kit).
 *
 * Accesible: <button role="switch" aria-checked>. Con reduced-motion el
 * knob salta sin animar (MotionConfig se encarga).
 */
export function ModuleToggle({ on, onToggle, label, className }: ModuleToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onToggle(!on)}
      className={className}
      style={{
        position: "relative",
        width: 56,
        height: 32,
        borderRadius: 999,
        border: "none",
        padding: 0,
        cursor: "pointer",
        background: "transparent",
      }}
    >
      <span
        data-track-off
        style={{ position: "absolute", inset: 0, borderRadius: 999 }}
      />
      <m.span
        data-track-on
        style={{ position: "absolute", inset: 0, borderRadius: 999 }}
        initial={false}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: durations.base }}
      />
      <m.span
        data-knob
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 26,
          height: 26,
          borderRadius: "50%",
        }}
        initial={false}
        animate={{ x: on ? 24 : 0 }}
        transition={springs.snappy}
      />
    </button>
  );
}

type ModulePowerProps = {
  on: boolean;
  children: ReactNode;
  className?: string;
  /** Overlay opcional cuando esta apagado ("Activalo cuando lo necesites"). */
  placeholder?: ReactNode;
};

/**
 * El "cuerpo" del modulo que se enciende/apaga con el toggle: contenido
 * a plena vida vs. atenuado en gris (opacity + scale + grayscale — filter
 * con moderacion, permitido por ser un elemento chico y contenido).
 */
export function ModulePower({ on, children, className, placeholder }: ModulePowerProps) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <m.div
        initial={false}
        animate={
          on
            ? { opacity: 1, scale: 1, filter: "grayscale(0)" }
            : { opacity: 0.35, scale: 0.985, filter: "grayscale(1)" }
        }
        transition={springs.gentle}
      >
        {children}
      </m.div>
      <AnimatePresence>
        {!on && placeholder ? (
          <m.div
            key="module-off"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.base }}
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
            }}
          >
            {placeholder}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
