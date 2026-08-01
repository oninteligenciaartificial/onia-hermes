"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { PressableCta } from "@/motion";
import { useRubro } from "@/components/rubro-context";
import { CAL_DEMO_URL, calLink } from "@/lib/site";
import { RUBROS_PLANES, rubroPlanes } from "@/lib/pricing";
import type { RubroId } from "@/lib/pricing";
import styles from "./doors.module.css";

/**
 * Formulario minimo para pedir una reunion.
 *
 * Destino REAL: Cal.com propio (self-hosted en el VPS, cuenta `onia`), evento
 * "demo-onia" de 45 min. Verificado 2026-07-30: responde 200 en publico.
 *
 * Los datos que la persona escribe se pasan a Cal.com por querystring, asi que
 * NO los vuelve a tipear: llega a la pantalla de horarios con el nombre puesto
 * y el negocio/rubro/telefono en las notas, y elige el horario ahi.
 *
 * Sigue sin haber simulacion: el formulario no dice "enviado" — abre el
 * calendario y la reserva la confirma la persona.
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

/**
 * Lo que viaja en las notas de la reserva, para llegar a la demo sabiendo de
 * quien se trata en vez de gastar los primeros minutos preguntando lo basico.
 */
function notas(c: Campos, rubro: RubroId, src: string): string {
  return [
    `Negocio: ${c.negocio.trim()}`,
    `Rubro: ${rubroPlanes(rubro).mensaje}`,
    `WhatsApp: ${c.whatsapp.trim()}`,
    ...(src ? [`Fuente: ${src}`] : []),
  ].join(" · ");
}

/**
 * Fuente de atribucion (?src= en la URL de cada pieza de contenido).
 *
 * Se lee al momento del submit y se persiste en sessionStorage: si la persona
 * navega dentro del sitio antes de agendar, la fuente de la pieza que la trajo
 * no se pierde. Es el dato que liquida el bounty por demo atribuible — sin
 * fuente registrada, la demo no cuenta para nadie.
 */
function fuenteAtribucion(): string {
  if (typeof window === "undefined") return "";
  try {
    const enUrl = new URLSearchParams(window.location.search).get("src")?.trim() ?? "";
    if (enUrl) {
      window.sessionStorage.setItem("onia_src", enUrl);
      return enUrl;
    }
    return window.sessionStorage.getItem("onia_src") ?? "";
  } catch {
    return "";
  }
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

    const src = fuenteAtribucion();

    // Registro best-effort del lead en Onia Center con su fuente. keepalive
    // para que sobreviva a la apertura de la pestana nueva; si falla, el flujo
    // de la persona no se entera.
    try {
      void fetch("/api/agenda-intake", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: campos.nombre.trim(),
          negocio: campos.negocio.trim(),
          whatsapp: campos.whatsapp.trim(),
          rubro,
          src,
        }),
      }).catch(() => {});
    } catch {
      // sin red o sin fetch: la reserva sigue igual
    }

    const url = calLink(CAL_DEMO_URL, {
      name: campos.nombre.trim(),
      notes: notas(campos, rubro, src),
    });
    window.open(url, "_blank", "noopener,noreferrer");
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
          Elegir horario para la demo
        </button>
      </PressableCta>

      <p className={styles.formNota} role="status">
        {abierto
          ? "Se abrió nuestra agenda con tus datos cargados. Elegí el horario que te sirva y queda confirmado."
          : "Se abre nuestra agenda con tus datos ya cargados: elegís el horario y listo. Son 45 minutos, por videollamada. Si preferís hablar antes, escribinos por WhatsApp acá arriba."}
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
