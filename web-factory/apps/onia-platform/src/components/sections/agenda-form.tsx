"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { PressableCta } from "@/motion";
import { useRubro } from "@/components/rubro-context";
import { waLink } from "@/lib/site";
import { RUBROS_PLANES, rubroPlanes } from "@/lib/pricing";
import type { RubroId } from "@/lib/pricing";
import styles from "./doors.module.css";

/**
 * Formulario minimo para pedir una reunion.
 *
 * HONESTIDAD DE INGENIERIA: todavia NO hay herramienta de agenda ni endpoint
 * conectado, asi que el formulario no finge que "envia" nada. Lo que hace es
 * armar el mensaje con los datos y abrir WhatsApp para que la persona lo mande
 * ella misma — destino real, verificable, sin simulacion.
 *
 * Cuando exista agenda (Cal.com u otra) o un endpoint propio, se cambia el
 * submit por un POST y este comentario deja de aplicar.
 */

type Campos = {
  nombre: string;
  negocio: string;
  whatsapp: string;
};

type Errores = Partial<Record<keyof Campos, string>>;

const VACIO: Campos = { nombre: "", negocio: "", whatsapp: "" };

function validar(c: Campos): Errores {
  const e: Errores = {};
  if (c.nombre.trim().length < 2) e.nombre = "Poné tu nombre.";
  if (c.negocio.trim().length < 2) e.negocio = "¿Cómo se llama tu negocio?";
  const digitos = c.whatsapp.replace(/\D/g, "");
  if (digitos.length < 7) e.whatsapp = "Necesitamos tu número para escribirte.";
  return e;
}

function mensaje(c: Campos, rubro: RubroId): string {
  return [
    "Hola, quiero coordinar una reunión para ver Onia.",
    `Nombre: ${c.nombre.trim()}`,
    `Negocio: ${c.negocio.trim()}`,
    `Rubro: ${rubroPlanes(rubro).mensaje}`,
    `Mi WhatsApp: ${c.whatsapp.trim()}`,
  ].join("\n");
}

export function AgendaForm() {
  const { rubro, setRubro } = useRubro();
  const [campos, setCampos] = useState<Campos>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [abierto, setAbierto] = useState(false);
  const id = useId();

  function set<K extends keyof Campos>(k: K, v: string) {
    setCampos((prev) => ({ ...prev, [k]: v }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validar(campos);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    setAbierto(true);
    window.open(waLink(mensaje(campos, rubro)), "_blank", "noopener,noreferrer");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <p className={`mono ${styles.formTitulo}`}>O dejá tus datos y coordinamos</p>

      <div className={styles.formGrid}>
        <Campo
          id={`${id}-nombre`}
          label="Tu nombre"
          value={campos.nombre}
          error={errores.nombre}
          autoComplete="name"
          onChange={(v) => set("nombre", v)}
        />
        <Campo
          id={`${id}-negocio`}
          label="Tu negocio"
          value={campos.negocio}
          error={errores.negocio}
          autoComplete="organization"
          onChange={(v) => set("negocio", v)}
        />

        <div className={styles.campo}>
          <label htmlFor={`${id}-rubro`} className={styles.label}>
            Rubro
          </label>
          <select
            id={`${id}-rubro`}
            className={styles.input}
            value={rubro}
            onChange={(e) => setRubro(e.target.value as RubroId)}
          >
            {RUBROS_PLANES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <Campo
          id={`${id}-whatsapp`}
          label="Tu WhatsApp"
          value={campos.whatsapp}
          error={errores.whatsapp}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          onChange={(v) => set("whatsapp", v)}
        />
      </div>

      <PressableCta className={styles.formCta}>
        <button type="submit" className="btn btn-wa">
          <span className="btn-dot" aria-hidden />
          Coordinar la reunión
        </button>
      </PressableCta>

      <p className={styles.formNota} role="status">
        {abierto
          ? "Se abrió WhatsApp con tus datos escritos. Tocá enviar ahí y coordinamos el horario."
          : "No tenemos agenda automática todavía: al tocar el botón se abre WhatsApp con tus datos ya escritos y el horario lo cerramos ahí. Nada se envía sin que vos lo mandes."}
      </p>
    </form>
  );
}

type CampoProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "tel";
  autoComplete?: string;
  onChange: (v: string) => void;
};

function Campo({
  id,
  label,
  value,
  error,
  type = "text",
  inputMode,
  autoComplete,
  onChange,
}: CampoProps) {
  return (
    <div className={styles.campo}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <span id={`${id}-error`} className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
