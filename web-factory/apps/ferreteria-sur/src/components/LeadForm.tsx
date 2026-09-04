"use client";

import { useEffect, useRef, useState } from "react";
import { ferreteria, waLink } from "@/data/ferreteria";

// ─────────────────────────────────────────────────────────────────────────────
// FORMULARIO DE PEDIDO → POST a /api/lead (ruta server de ESTE sitio).
// El navegador nunca lleva credencial: la ruta server reenvía a Onia Platform.
//
// El lead de una ferretería es una LISTA, no una cita: nombre, WhatsApp, qué
// necesita y cómo lo retira. Si el canal no está encendido o el sistema falla,
// no se finge un "gracias": se le da a la persona el camino vivo (WhatsApp) con
// su lista ya escrita adentro del mensaje.
//
// Clases que espera la hoja de estilos (las escribe el agente de CSS):
//   .lead-form .lead-grid .lead-field .lead-wide .lead-ok .lead-error .lead-note
// Los botones usan .btn / .btn--solid de globals.css.
// ─────────────────────────────────────────────────────────────────────────────

const DRAFT_KEY = "fs-pedido-draft";

function loadDraft(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
  } catch {
    return {}; // modo privado o storage bloqueado: el form sigue funcionando
  }
}
function saveDraft(data: Record<string, string>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

type Estado = "idle" | "enviando" | "ok" | "error";

const TIPOS = [
  "Pedido de materiales",
  "Consulta de precio o stock",
  "Cotización para obra",
  "Corte a medida",
  "Pintura al color",
] as const;

const ENTREGAS = ["Retiro en el local", "Entrega en obra"] as const;

export function LeadForm() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(""); // link de WhatsApp con la lista adentro
  const formRef = useRef<HTMLFormElement | null>(null);

  // Autosave: volver atrás no borra la lista que ya tipeó.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    for (const [k, v] of Object.entries(loadDraft())) {
      const campo = form.elements.namedItem(k);
      if (typeof v === "string" && (campo instanceof HTMLInputElement || campo instanceof HTMLSelectElement || campo instanceof HTMLTextAreaElement)) {
        campo.value = v;
      }
    }
  }, []);

  function onInput() {
    const form = formRef.current;
    if (!form) return;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    delete data.src; // el oculto no es draft
    saveDraft(data);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setEstado("enviando");
    setError("");
    setFallback("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setEstado("ok");
        form.reset();
        clearDraft();
        return;
      }
      const cuerpo = (await res.json().catch(() => ({}))) as { error?: string };
      setEstado("error");
      setError(cuerpo.error || "No pudimos enviar el pedido.");
      // 422 = lo puede arreglar corrigiendo el campo. Todo lo demás es nuestro
      // problema, no suyo: se le pasa la lista a WhatsApp ya escrita.
      if (res.status !== 422) {
        setFallback(
          waLink(
            `Hola, les paso mi lista:\n\n${data.lista || ""}\n\nSoy ${data.nombre || ""} (${data.entrega || "Retiro en el local"}).`,
          ),
        );
      }
    } catch {
      setEstado("error");
      setError("Se cortó la conexión antes de enviar el pedido.");
      setFallback(waLink(`Hola, les paso mi lista:\n\n${data.lista || ""}\n\nSoy ${data.nombre || ""}.`));
    }
  }

  if (estado === "ok") {
    return (
      <div className="lead-ok" role="status">
        <strong>Lista recibida.</strong> Te respondemos por WhatsApp al número que dejaste
        con qué hay, qué falta y cuánto sale todo junto. Atendemos{" "}
        {ferreteria.horarios[0].dias.toLowerCase()} de {ferreteria.horarios[0].abre} a{" "}
        {ferreteria.horarios[0].cierra}, y {ferreteria.horarios[1].dias.toLowerCase()} hasta{" "}
        {ferreteria.horarios[1].cierra}.
      </div>
    );
  }

  return (
    <form className="lead-form" ref={formRef} onSubmit={onSubmit} onInput={onInput}>
      <div className="lead-grid">
        <label className="lead-field">
          <span>Tu nombre</span>
          <input name="nombre" required maxLength={80} autoComplete="name" />
        </label>
        <label className="lead-field">
          <span>Tu WhatsApp</span>
          <input
            name="whatsapp"
            required
            maxLength={30}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+591 7xxxxxxx"
          />
        </label>
        <label className="lead-field">
          <span>Qué necesitás</span>
          <select name="tipo" defaultValue={TIPOS[0]}>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="lead-field">
          <span>Cómo lo llevás</span>
          <select name="entrega" defaultValue={ENTREGAS[0]}>
            {ENTREGAS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="lead-field lead-wide">
          <span>Tu lista</span>
          <textarea
            name="lista"
            required
            rows={5}
            maxLength={2000}
            placeholder={"2 kg de tirafondo 6x60\n10 m de cable 2,5 mm\n1 disco de corte de 7\nlátex blanco, 4 litros"}
          />
        </label>
      </div>

      {/* atribución de campaña: viaja oculta hasta Onia */}
      <input type="hidden" name="src" value="ferreteria-sur" />

      <button className="btn btn--solid" type="submit" disabled={estado === "enviando"} aria-busy={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Mandar mi lista"}
      </button>

      {estado === "error" && (
        <p className="lead-error" role="alert">
          {error}{" "}
          {fallback && (
            <a href={fallback} target="_blank" rel="noreferrer">
              Mandala por WhatsApp con un toque
            </a>
          )}
        </p>
      )}

      <p className="lead-note">
        Contestamos en horario de atención. Si preferís, escribinos directo al{" "}
        {ferreteria.telefono}.
      </p>
    </form>
  );
}
