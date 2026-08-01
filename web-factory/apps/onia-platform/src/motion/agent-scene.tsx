"use client";

import * as m from "motion/react-m";
import { AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { springs } from "./tokens";

/**
 * Escena "el agente reprograma" — vignette autonoma que EXPLICA el producto:
 *
 *   paso 0  calendario con la cita en el slot A (martes)
 *   paso 1  burbuja del paciente: "no puedo el martes"
 *   paso 2  burbuja del agente proponiendo nuevo horario
 *   paso 3  el chip de la cita VIAJA del martes al jueves (transform, spring
 *           con peso) — el momento didactico
 *   paso 4  badge "aprobado" — human-in-the-loop explicito (compliance: el
 *           agente REPROGRAMA con aprobacion humana, no "recuerda")
 *
 * Luego respira y vuelve a empezar. Corre solo cuando esta en viewport
 * (timers pausados fuera de vista). Con prefers-reduced-motion se muestra
 * el cuadro FINAL estatico: chip en jueves + burbujas + badge, sin loop.
 *
 * El viaje del chip se mide contra los slots reales del DOM (delta de
 * getBoundingClientRect), asi la escena sobrevive a cualquier CSS que le
 * ponga el builder. Todo por transform/opacity.
 *
 * Estilado: el kit da la mecanica y un layout minimo; colores/tipografia
 * van por CSS sobre los data-attributes (data-slot, data-chip,
 * data-bubble-patient, data-bubble-agent, data-approved).
 */

type AgentRescheduleSceneProps = {
  /** Copys de la escena — viven en la pagina, no en el kit. */
  patientMessage?: string;
  agentMessage?: string;
  approvedLabel?: string;
  chipLabel?: string;
  slotALabel?: string;
  slotBLabel?: string;
  /** Descripcion para screen readers de toda la escena. */
  ariaLabel?: string;
  className?: string;
};

const STEP_HOLD_MS = [900, 1500, 1600, 1300, 2800] as const;
const FINAL_STEP = 4;

export function AgentRescheduleScene({
  patientMessage = "Hola, no voy a poder el martes…",
  agentMessage = "Sin problema. ¿Jueves 15:30? Queda pendiente de aprobacion.",
  approvedLabel = "Aprobado por la clinica",
  chipLabel = "Cita · 10:00",
  slotALabel = "Martes",
  slotBLabel = "Jueves",
  ariaLabel = "Demostracion animada: un paciente avisa que no puede asistir, el agente de ONIA propone otro horario, la cita se mueve al nuevo dia y una persona del equipo aprueba el cambio.",
  className,
}: AgentRescheduleSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const slotARef = useRef<HTMLDivElement>(null);
  const slotBRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [delta, setDelta] = useState({ x: 0, y: 0 });

  // Delta real entre slots (robusto ante el CSS del builder y el responsive).
  useEffect(() => {
    function measure() {
      const a = slotARef.current?.getBoundingClientRect();
      const b = slotBRef.current?.getBoundingClientRect();
      if (a && b) setDelta({ x: b.left - a.left, y: b.top - a.top });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Loop de pasos: solo corre visible y sin reduced-motion.
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setTimeout(
      () => setStep((s) => (s + 1) % (FINAL_STEP + 1)),
      STEP_HOLD_MS[step],
    );
    return () => window.clearTimeout(id);
  }, [step, inView, reduced]);

  const shown = reduced ? FINAL_STEP : step;
  const moved = shown >= 3;

  return (
    <div
      ref={rootRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <div aria-hidden style={{ display: "grid", gap: 12 }}>
        {/* Mini calendario: dos slots */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div ref={slotARef} data-slot data-slot-a style={{ position: "relative" }}>
            <span data-slot-label>{slotALabel}</span>
            <div data-slot-well style={{ position: "relative", minHeight: 44 }}>
              <m.div
                data-chip
                initial={false}
                animate={{ x: moved ? delta.x : 0, y: moved ? delta.y : 0 }}
                transition={springs.heavy}
                style={{ position: "absolute", top: 0, left: 0, willChange: "transform" }}
              >
                {chipLabel}
              </m.div>
            </div>
          </div>
          <div ref={slotBRef} data-slot data-slot-b>
            <span data-slot-label>{slotBLabel}</span>
            <div data-slot-well style={{ minHeight: 44 }} />
          </div>
        </div>

        {/* Conversacion */}
        <div style={{ display: "grid", gap: 8, minHeight: 96 }}>
          <AnimatePresence>
            {shown >= 1 ? (
              <m.div
                key="patient"
                data-bubble-patient
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={springs.gentle}
                style={{ justifySelf: "start" }}
              >
                {patientMessage}
              </m.div>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {shown >= 2 ? (
              <m.div
                key="agent"
                data-bubble-agent
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={springs.gentle}
                style={{ justifySelf: "end" }}
              >
                {agentMessage}
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Aprobacion humana */}
        <div style={{ minHeight: 32 }}>
          <AnimatePresence>
            {shown >= FINAL_STEP ? (
              <m.div
                key="approved"
                data-approved
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={springs.snappy}
                style={{ display: "inline-block" }}
              >
                {approvedLabel}
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
