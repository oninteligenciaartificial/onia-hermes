"use client";

import { useState } from "react";
import {
  ASSISTANT_COLORS,
  ASSISTANT_FEELS,
  ASSISTANT_RUBROS,
  buildAssistantPlan,
  EMPTY_ASSISTANT_ANSWERS,
  type AssistantAnswers,
  type AssistantPlan,
} from "@/content/web-assistant";
import { WEB_GOALS, WEB_PALETTES } from "@/content/web-configurator";
import styles from "./web-configurator.module.css";

type Props = {
  onApply: (plan: AssistantPlan) => void;
};

/**
 * Paso 00 del configurador: el cuestionario. Cuatro respuestas → `onApply`
 * recibe el plan y el configurador lo aplica a todos sus pasos. Nada se
 * guarda ni se manda: es la misma pantalla, con los controles ya elegidos.
 */
export function WebAssistant({ onApply }: Props) {
  const [answers, setAnswers] = useState<AssistantAnswers>(EMPTY_ASSISTANT_ANSWERS);
  const [applied, setApplied] = useState(false);
  const ready = answers.businessName.trim().length > 0;

  function set<K extends keyof AssistantAnswers>(key: K, value: AssistantAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setApplied(false);
  }

  function chip(active: boolean) {
    return `${styles.chip} ${active ? styles.optionOn : ""}`;
  }

  return (
    <form
      className={`${styles.step} ${styles.assistantStep}`}
      id="asistente"
      aria-labelledby="asistente-titulo"
      onSubmit={(event) => {
        event.preventDefault();
        if (!ready) return;
        onApply(buildAssistantPlan(answers));
        setApplied(true);
      }}
    >
      <p className={styles.stepTitle} id="asistente-titulo">
        <span className={styles.stepNumber}>00</span>
        Armá tu web en un minuto
      </p>
      <p className={styles.stepHint}>
        Cuatro respuestas y el asistente elige estructura, estilo, colores y tipografía. Después ajustás lo que quieras en los pasos de abajo.
      </p>

      <label className={styles.formField}>
        <span>¿Cómo se llama tu negocio?</span>
        <input
          type="text"
          autoComplete="organization"
          value={answers.businessName}
          onChange={(event) => set("businessName", event.target.value)}
          placeholder="Ej. Clínica Amanecer"
        />
      </label>

      <fieldset className={styles.assistantQuestion}>
        <legend className={styles.assistantLegend}>¿A qué se dedica?</legend>
        <div className={styles.chipGrid}>
          {ASSISTANT_RUBROS.map((item) => (
            <button key={item.id} type="button" className={chip(item.id === answers.rubro)} aria-pressed={item.id === answers.rubro} onClick={() => set("rubro", item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.assistantQuestion}>
        <legend className={styles.assistantLegend}>¿Qué tiene que lograr la web?</legend>
        <div className={styles.chipGrid}>
          <button type="button" className={chip(answers.goal === "rubro")} aria-pressed={answers.goal === "rubro"} onClick={() => set("goal", "rubro")}>
            Lo habitual en mi rubro
          </button>
          {WEB_GOALS.map((item) => (
            <button key={item.id} type="button" className={chip(item.id === answers.goal)} aria-pressed={item.id === answers.goal} onClick={() => set("goal", item.id)}>
              {item.nombre}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.assistantQuestion}>
        <legend className={styles.assistantLegend}>¿Cómo querés que se sienta?</legend>
        <div className={styles.chipGrid}>
          {ASSISTANT_FEELS.map((item) => (
            <button key={item.id} type="button" className={chip(item.id === answers.feel)} aria-pressed={item.id === answers.feel} onClick={() => set("feel", item.id)} title={item.descripcion}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.assistantQuestion}>
        <legend className={styles.assistantLegend}>¿Un color de marca?</legend>
        <div className={styles.chipGrid}>
          <button type="button" className={chip(answers.color === "rubro")} aria-pressed={answers.color === "rubro"} onClick={() => set("color", "rubro")}>
            El que mejor le quede
          </button>
          {ASSISTANT_COLORS.map((id) => {
            const palette = WEB_PALETTES.find((item) => item.id === id);
            if (!palette) return null;
            return (
              <button key={id} type="button" className={chip(id === answers.color)} aria-pressed={id === answers.color} onClick={() => set("color", id)}>
                <span className={styles.chipSwatch} style={{ backgroundColor: palette.accent }} aria-hidden="true" />
                {palette.nombre}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.assistantActions}>
        <button type="submit" className="btn" disabled={!ready} aria-disabled={!ready}>
          Armar mi web <span aria-hidden="true">→</span>
        </button>
        <p className={styles.assistantDone} aria-live="polite">
          {applied
            ? "Listo: mirá el preview. Lo que no te convenza lo cambiás en los pasos de abajo."
            : ready
              ? "Con esto alcanza. Podés contestar el resto o armarla ya."
              : "Empezá por el nombre."}
        </p>
      </div>
    </form>
  );
}
