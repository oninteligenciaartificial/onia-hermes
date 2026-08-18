// ONIA — Probador del editor de conocimiento (paso previo a publicar).
// Recibe un BORRADOR de knowledge + un mensaje, y corre un turno REAL del motor
// contra ese borrador: mismo validador, misma config, mismo step(). Sin tocar
// la base, sin conversacion persistida, sin WhatsApp. Si el borrador es
// invalido, devuelve los errores del validador (los mismos que rechazarian el
// archivo publicado) — el dueno ve QUE campo y POR QUE antes de guardar.
//
// Auth: Bearer ONIA_BOT_PREVIEW_SECRET (webhook.env). Sin secreto configurado,
// el endpoint queda apagado (401 siempre): apagado por defecto, no abierto.
import { validateKnowledge, applyKnowledge, asRecepcionista, getOrgKnowledge } from "./knowledge.mjs";
import { createBotConfig, DEFAULT_CONFIG } from "./config.mjs";
import { createState, step, LLM_PENDING } from "./bot-engine.mjs";

const MAX_TURNOS = 20; // replay acotado: el probador no es una conversacion infinita

export async function handlePreviewRequest({ rawBody, headers }) {
  const secret = process.env.ONIA_BOT_PREVIEW_SECRET || "";
  const auth = String(headers?.authorization || "");
  if (!secret || auth !== `Bearer ${secret}`) {
    return { status: 401, body: { ok: false, error: "no_autorizado" } };
  }
  let payload;
  try {
    payload = JSON.parse(String(rawBody || "{}"));
  } catch {
    return { status: 400, body: { ok: false, error: "json_invalido" } };
  }
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (!message) return { status: 400, body: { ok: false, error: "falta_message" } };

  let config = DEFAULT_CONFIG;
  let conocimiento;
  if (payload.knowledge != null) {
    // Un borrador explicito gana sobre todo: es lo que el editor quiere probar.
    const verdict = validateKnowledge(payload.knowledge);
    if (!verdict.ok) return { status: 422, body: { ok: false, errores: verdict.errors } };
    config = applyKnowledge(createBotConfig(), payload.knowledge, { nowIso: new Date().toISOString() });
    // Decision Sergio 2026-08-18: el borrador del editor ES el bot de una org cliente.
    // El probador tiene que mostrar EXACTAMENTE lo que el cliente final vera (modo
    // recepcionista con ese borrador), no el funnel de venta de Onia con el nombre cambiado.
    config = asRecepcionista(config, payload.knowledge);
    conocimiento = { fuente: "borrador" };
  } else if (typeof payload.organizationId === "string" && payload.organizationId.trim()) {
    // Sin borrador: probar contra lo PUBLICADO de esa org (paso b — fuente db).
    // /preview no esta en el camino del mensaje, asi que aca SI se espera la red.
    const state = await getOrgKnowledge(payload.organizationId.trim());
    if (state.data) {
      config = applyKnowledge(createBotConfig(), state.data, { nowIso: new Date().toISOString() });
      // Fuente db = org cliente: el probador tiene que mostrar lo que el bot REAL contesta
      // (modo recepcionista), no el funnel de venta con el nombre cambiado.
      if (state.source === "db") config = asRecepcionista(config, state.data);
    }
    conocimiento = { fuente: state.source, version: state.version, error: state.error };
  }

  const turnosPrevios = Array.isArray(payload.turnos) ? payload.turnos.slice(0, MAX_TURNOS) : [];
  let state = createState();
  let clock = Date.now() - (turnosPrevios.length + 1) * 120_000;
  for (const previo of turnosPrevios) {
    if (typeof previo !== "string" || !previo.trim()) continue;
    const r = step(state, { text: previo, receivedAt: new Date(clock).toISOString() }, { config });
    state = r.nextState;
    clock += 120_000;
  }
  const result = step(state, { text: message, receivedAt: new Date(clock).toISOString() }, { config });

  return {
    status: 200,
    body: {
      ok: true,
      respuestas: result.replies.map((reply) => ({
        plantilla: reply.templateKey,
        texto: reply.text === LLM_PENDING ? reply.fallbackText : reply.text,
        // Botones del recepcionista (input_select): al chat del editor le llegan como
        // TITULOS para pintarlos como pastillas clickeables. Solo si la reply los trae.
        ...(Array.isArray(reply.options) && reply.options.length
          ? { opciones: reply.options.map((boton) => boton.title) }
          : {}),
      })),
      etapa: result.nextState.botStage,
      notas: result.notes,
      ...(conocimiento ? { conocimiento } : {}),
    },
  };
}
