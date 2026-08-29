// EDITOR CONVERSACIONAL (backlog v6, go de Sergio 2026-08-30, referencia Sendy
// "Entrena a Vendedor IA"): el dueño escribe EN CASTELLANO lo que quiere cambiar
// ("atendé también los domingos", "agregá el servicio de blanqueamiento") y esto
// devuelve el DOC COMPLETO modificado — que pasa validateKnowledge TODO-O-NADA
// antes de salir. Nada se persiste acá: la plataforma muestra el diff y el dueño
// PUBLICA con su flujo de siempre. Más seguro que Sendy: la IA propone, el
// validador manda, el humano publica.
//
// Vive en el motor (y no en la plataforma) a propósito: acá YA están la key de
// LiteLLM, la red interna y el validador real — cero cirugía de infra.

import { validateKnowledge } from "./knowledge.mjs";

export const DEFAULT_EDITOR_TIMEOUT_MS = 20_000;

const SYSTEM = [
  "Sos el editor del documento de conocimiento de un chatbot recepcionista boliviano.",
  "El documento sigue el schema \"onia.bot.knowledge/1\". Campos permitidos:",
  '- schema (fijo "onia.bot.knowledge/1"), version (no lo toques)',
  "- identity: { productName, humanName, botName }",
  "- empresa: { horario: { frase, dias, tramos }, direccion, ciudad }",
  "- productos: lista de { key, tipo (servicio|producto), nombre, descripcion }",
  "- cita: { habilitada, frase }",
  "- lexico: { palabras adicionales por intent }",
  "- faq: lista de { id: \"negocio\", pregunta, respuesta, tags (palabras de 3+ letras) }",
  "REGLAS DURAS:",
  "1. Devolvé el DOCUMENTO COMPLETO en JSON válido — no un fragmento, no comentarios, no markdown.",
  "2. Aplicá SOLO lo que la instrucción pide; el resto queda IDÉNTICO.",
  "3. PROHIBIDO inventar precios, cifras, promociones o datos que la instrucción no trae.",
  "4. PROHIBIDO campos fuera del schema.",
  "5. Si la instrucción es imposible o ambigua, devolvé exactamente {\"error\":\"<por qué, en una frase>\"}.",
].join("\n");

function fail(reason, errores = []) {
  return { ok: false, reason, errores, knowledge: null };
}

/**
 * @returns {Promise<{ok: boolean, knowledge: object|null, reason?: string, errores?: string[]}>}
 */
export async function sugerirEdicion({ knowledge, instruccion } = {}, deps = {}) {
  const env = deps.env || process.env;
  const base = String(env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1").replace(/\/+$/, "");
  const key = String(env.LITELLM_KEY || "");
  const model = String(env.ONIA_BOT_MODEL || "gpt-4o-mini");
  if (!key) return fail("sin_litellm_key");

  const texto = String(instruccion || "").trim();
  if (!texto || texto.length > 1000) return fail("instruccion_invalida");
  const base_doc = knowledge && typeof knowledge === "object" ? knowledge : null;
  if (!base_doc) return fail("doc_invalido");

  const fetchFn = typeof deps.fetch === "function" ? deps.fetch : fetch;
  let raw;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), deps.timeoutMs ?? DEFAULT_EDITOR_TIMEOUT_MS);
    const res = await fetchFn(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 3000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `DOCUMENTO ACTUAL:\n${JSON.stringify(base_doc)}\n\nINSTRUCCION DEL DUEÑO:\n${texto}`,
          },
        ],
      }),
    });
    clearTimeout(timer);
    if (!res.ok) return fail(`litellm_http_${res.status}`);
    const json = await res.json();
    raw = String(json?.choices?.[0]?.message?.content || "");
  } catch (error) {
    return fail("llm_exploto", [String(error?.message || error).slice(0, 160)]);
  }

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch {
    return fail("respuesta_no_es_json");
  }
  if (doc && typeof doc === "object" && typeof doc.error === "string") {
    return fail("instruccion_rechazada", [doc.error.slice(0, 200)]);
  }

  // EL JUEZ: el mismo validador todo-o-nada que protege el editor manual.
  const verdict = validateKnowledge(doc);
  if (!verdict.ok) return fail("doc_invalido_post_llm", verdict.errors ?? []);
  return { ok: true, knowledge: doc };
}

/** Handler HTTP para el webhook-server (mismo Bearer que /preview). */
export async function handleEditorRequest({ rawBody, headers } = {}, deps = {}) {
  const secret = String((deps.env || process.env).ONIA_BOT_PREVIEW_SECRET || "");
  const auth = String(headers?.authorization || "");
  if (!secret || auth !== `Bearer ${secret}`) {
    return { status: 401, body: { ok: false, reason: "no_autorizado" } };
  }
  let payload;
  try {
    payload = JSON.parse(String(rawBody || ""));
  } catch {
    return { status: 400, body: { ok: false, reason: "json_invalido" } };
  }
  const out = await sugerirEdicion(payload, deps);
  return { status: out.ok ? 200 : 422, body: out };
}
