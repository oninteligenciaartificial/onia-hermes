// VISION del bot (backlog v5, go de Sergio 2026-08-30: "pagamos api nomas de
// modelo barato"): cuando el cliente manda una FOTO, el bot la describe con el
// MISMO modelo del gateway (gpt-4.1-mini via LiteLLM, medido: US$ 0,0007/foto)
// para confirmar con contexto y derivar mejor al humano. JAMAS diagnostica ni
// cotiza: la descripcion pasa por los guardrails antes de usarse, y si viola
// una regla se descarta entera (el flujo cae al R_ATTACH de siempre).
//
// Modelo LOCAL en el VPS: descartado a proposito — ollama ya estrangulo esta
// maquina una vez (steal 93%, penalidad de Hostinger) y sin GPU una imagen
// tarda minutos. La API con tope de gasto del gateway es la via.
//
// Calca el contrato de audio-transcribe.mjs: no tira JAMAS; sin key, sin
// imagen, timeout o fallo => { ok:false } y el motor sigue como si esto no
// existiera. Reusa su descarga (limite de bytes + defensa SSRF: el data_url se
// resuelve SIEMPRE contra el Chatwoot propio).

import {
  DEFAULT_MAX_BYTES,
  downloadAudio,
  resolveAttachmentUrl,
} from "./audio-transcribe.mjs";

export const DEFAULT_VISION_TIMEOUT_MS = 8_000;
export const DEFAULT_VISION_MAX_TOKENS = 140;

const PROMPT = [
  "Sos el asistente de un negocio. Un cliente mando esta imagen por chat.",
  'Responde SOLO este JSON: {"descripcion":"...","comprobante":{"es":false}} o',
  '{"descripcion":"...","comprobante":{"es":true,"monto":"150.00","entidad":"BCP"}}.',
  "descripcion: UNA frase corta y neutral de que se ve, en espanol boliviano, max 20 palabras.",
  "PROHIBIDO en descripcion: diagnosticos, precios, cifras, marcas, juicios medicos o legales.",
  "comprobante.es=true SOLO si la imagen es claramente un comprobante/voucher de pago o",
  "transferencia (QR pagado, captura de banco/billetera). monto y entidad SOLO si se leen",
  "con claridad EN el documento (son datos del comprobante, no precios tuyos); si no, omitilos.",
].join(" ");

export function pickImageAttachment(attachments) {
  const list = Array.isArray(attachments) ? attachments : [];
  return (
    list.find((a) => String(a?.file_type ?? a?.fileType ?? "").toLowerCase() === "image"
      && (a?.data_url || a?.dataUrl)) || null
  );
}

function fail(reason, warnings = []) {
  return { ok: false, description: "", reason, warnings };
}

/**
 * Descarga la imagen del Chatwoot propio y la describe via LiteLLM.
 * @returns {Promise<{ok: boolean, description: string, reason?: string, warnings: string[]}>}
 */
export async function describeChatwootImage(options = {}, deps = {}) {
  const env = deps.env || process.env;
  const base = String(env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1").replace(/\/+$/, "");
  const key = String(env.LITELLM_KEY || "");
  const model = String(env.ONIA_BOT_MODEL || "gpt-4o-mini");
  if (!key) return fail("sin_litellm_key");

  const attachment = pickImageAttachment(options.attachments);
  if (!attachment) return fail("sin_imagen");

  const url = resolveAttachmentUrl(attachment.data_url ?? attachment.dataUrl, options.chatwootBaseUrl);
  if (!url) return fail("data_url_invalida");

  // Misma descarga que el audio: limite de bytes, timeout, token en header.
  const descarga = await downloadAudio(
    { url, token: options.token, maxBytes: options.maxBytes ?? DEFAULT_MAX_BYTES },
    deps,
  );
  if (!descarga.ok) return fail(`descarga:${descarga.reason}`, descarga.warnings || []);

  const b64 = Buffer.from(descarga.bytes).toString("base64");
  const mime = String(attachment.content_type || "image/jpeg");
  const fetchFn = typeof deps.fetch === "function" ? deps.fetch : fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_VISION_TIMEOUT_MS;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetchFn(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: options.maxTokens ?? DEFAULT_VISION_MAX_TOKENS,
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: `data:${mime};base64,${b64}`, detail: "low" } },
          ],
        }],
      }),
    });
    clearTimeout(timer);
    if (!res.ok) return fail(`litellm_http_${res.status}`);
    const json = await res.json();
    const raw = String(json?.choices?.[0]?.message?.content || "").trim();
    if (!raw) return fail("respuesta_vacia");
    // JSON estructurado; si el modelo devolvio texto plano (modelo viejo), se usa entero
    // como descripcion y sin comprobante — el flujo de siempre.
    let description = raw;
    let comprobante = null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        description = String(parsed.descripcion || "").trim() || raw;
        const c = parsed.comprobante;
        if (c && typeof c === "object" && c.es === true) {
          // El monto es un ECO del documento del cliente, jamas un precio nuestro.
          // Sanitizado estricto: solo numeros con decimal opcional; si no, no se muestra.
          const monto = String(c.monto ?? "").trim().replace(",", ".");
          const entidad = String(c.entidad ?? "").trim().slice(0, 30);
          comprobante = {
            es: true,
            ...( /^\d{1,7}(\.\d{1,2})?$/.test(monto) ? { monto } : {}),
            ...(entidad && /^[\w .-]+$/.test(entidad) ? { entidad } : {}),
          };
        }
      }
    } catch { /* texto plano: descripcion = raw */ }
    return { ok: true, description, comprobante, warnings: [] };
  } catch (error) {
    return fail("vision_exploto", [`vision: ${String(error?.message || error).slice(0, 160)}`]);
  }
}
