"use client";

import { useEffect, useRef, useState } from "react";

// Regla de UX 12 (@agenticmatt): autosave del draft — volver atrás no borra lo
// tipeado. Se guarda en localStorage y se restaura al montar. Wrap en try/catch:
// en modo privado o con storage bloqueado, no rompe.
const DRAFT_KEY = "dp-lead-draft";
function loadDraft(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveDraft(data: Record<string, string>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* storage no disponible: el form sigue funcionando */
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

// Formulario de pedido → POST a /api/lead (ruta server de ESTE sitio). El
// navegador NUNCA lleva credencial: la ruta server reenvía a Onia Platform con
// el Bearer del lado servidor. Optimista con rollback y error honesto.
type Estado = "idle" | "enviando" | "ok" | "error";

export function LeadForm() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  // Restaurar el draft al montar (regla 12).
  useEffect(() => {
    const draft = loadDraft();
    const form = formRef.current;
    if (!form) return;
    for (const [k, v] of Object.entries(draft)) {
      const field = form.elements.namedItem(k) as HTMLInputElement | null;
      if (field && typeof v === "string") field.value = v;
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
    setEstado("enviando");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`(${res.status})`);
      setEstado("ok");
      form.reset();
      clearDraft();
    } catch (err) {
      setEstado("error");
      setError(
        "No pudimos enviar el pedido. Probá de nuevo o escribinos directo por WhatsApp.",
      );
    }
  }

  if (estado === "ok") {
    return (
      <div className="lead-ok" role="status">
        <strong>¡Recibido!</strong> Te escribimos por WhatsApp con el primer horario
        libre y el costo de la evaluación. Gracias por confiar.
      </div>
    );
  }

  return (
    <form className="lead-form" ref={formRef} onSubmit={onSubmit} onInput={onInput}>
      <div className="lead-grid">
        <label className="lead-field">
          <span>Tu nombre</span>
          <input name="nombre" required autoComplete="name" />
        </label>
        <label className="lead-field">
          <span>Tu WhatsApp</span>
          <input name="whatsapp" required inputMode="tel" autoComplete="tel" placeholder="+591" />
        </label>
        <label className="lead-field lead-wide">
          <span>¿Qué necesitás?</span>
          <select name="tratamiento" defaultValue="">
            <option value="" disabled>Elegir…</option>
            <option>Evaluación y diagnóstico</option>
            <option>Limpieza y prevención</option>
            <option>Ortodoncia</option>
            <option>Implantes y prótesis</option>
            <option>Endodoncia</option>
            <option>Urgencia</option>
          </select>
        </label>
        <label className="lead-field lead-wide">
          <span>Contanos tu caso</span>
          <textarea name="mensaje" rows={3} placeholder="Qué sentís, desde cuándo, qué te gustaría resolver" />
        </label>
      </div>
      {/* atribución de campaña: viaja oculto igual que el circuito de Onia */}
      <input type="hidden" name="src" value="dental-premium" />
      <button className="btn btn--solid" type="submit" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Pedir presupuesto"}
      </button>
      {estado === "error" && <p className="lead-error" role="alert">{error}</p>}
      <p className="lead-note">Respondemos el mismo día en horario de atención.</p>
    </form>
  );
}
