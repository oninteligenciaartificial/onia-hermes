// ONIA — Chatbot propio: GUARDRAILS deterministas sobre el texto libre del LLM.
// Mecanismo heredado de Bolivian Electric (reply-guardrails.ts), verificado en la spec §3.1:
//   normalizar (minusculas + sin tildes) -> probar los regex -> si CUALQUIERA matchea,
//   se descarta la respuesta ENTERA y se manda el texto seguro. No recorta, no censura palabras.
// Tres detalles que son faciles de perder y aca son test:
//   1. Los regex NO llevan flag /g (con /g, .test() es stateful y falla en llamadas alternas).
//   2. El texto seguro se testea contra sus propios regex (si no, el fallback se dispara a si mismo).
//   3. Se aplica SOLO al texto libre del LLM. Los mensajes de guion (M0-M7) NO pasan por aca.
// Ademas: todo va envuelto en try/catch — el guardrail NUNCA puede romper el webhook.
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md §3.1

import { MARCADORES_DE_OFERTA, soloPreciosPublicos } from "./precios-publicos.mjs";

/**
 * Texto seguro (equivalente al SAFE_REPLY de BE). Conserva los {{ }} a proposito: la
 * sustitucion de variables ocurre DESPUES del guardrail, si no una hora puede parecer una cifra.
 */
export const SAFE_REPLY_BASE =
  "Eso prefiero no contestártelo yo — soy un bot y no quiero darte un dato equivocado. " +
  "Te lo confirma {{humano}} en la demo.";
// La pregunta de los horarios va APARTE (2-oct): sin horarios que ofrecer —sin agenda propia o con
// el placeholder— el motor la reemplaza por la pregunta pendiente real (`textoSeguro` en
// bot-engine.mjs). Pegada, salia «¿Te reservo HORARIO A (pendiente de definir) o …?».
export const SAFE_REPLY = `${SAFE_REPLY_BASE} ¿Te reservo {{slot_a}} o {{slot_b}}?`;

/**
 * Los 6 codigos de la spec. Los regex se escriben SIN tildes porque el texto llega normalizado.
 * Desviacion consciente respecto de la tabla de la spec: en `promete_feature` uso `radiograf\w*`
 * en vez de `radiograf` — con `\b` al final, "radiografia" nunca matchearia (la 'i' es \w).
 */
/**
 * N1. Hasta el 2026-09-03 este regex estaba AL REVES y nadie lo habia mirado de frente: su unico
 * patron con cifra exigia <numero><moneda> ("320 Bs") y nunca veia <moneda><numero> ("Bs 320") —
 * la forma que usa el propio pricing.ts ("Bs 390/mes"), o sea la unica que un texto real trae.
 * Medido: dejaba pasar "Bs 999 por mes, oferta especial" y rechazaba "cuesta poco".
 *
 * Hay DOS modos, y la diferencia es quien escribio el texto:
 *
 *   ESTRICTO (por defecto) — texto que IMPROVISA el LLM. Ninguna cifra de plata, ni siquiera una
 *   real: el contexto del LLM no lleva numeros por contrato (bot-engine.mjs, `forbidden`), asi que
 *   si aparece uno es una alucinacion, valga o no. Este modo quedo MAS cerrado que antes, porque
 *   ahora tambien ve "Bs 320".
 *
 *   PRECIOS PUBLICOS (`opciones.preciosPublicos`) — solo para la FAQ `precios` de
 *   knowledge.onia.json: texto curado, versionado y atado a los dos .ts por
 *   precios-publicos.test.mjs. Es la unica puerta que abrio Sergio (decision 2026-09-03), y se
 *   abre sobre el texto que un humano revisa, nunca sobre el que un modelo inventa.
 *
 * Orden deliberado:
 *   1. sin ninguna cifra   -> deciden los patrones de frase de siempre;
 *   2. modo estricto       -> cualquier monto viola;
 *   3. cifra fuera del allowlist -> viola;
 *   4. marcador de oferta  -> viola, aunque la cifra sea real (un monto bueno no regala nada);
 *   5. resto               -> NO viola: son los precios publicos, la excepcion autorizada.
 *
 * Los marcadores de oferta se miran SOLO cuando hay una cifra, y no es una comodidad: esta regla
 * habla de PLATA, asi que sin monto no hay nada que descontar. Mirarlos siempre daba un falso
 * positivo caro — la FAQ del SIAT dice que "el SIN tiene un portal gratis", que es un portal del
 * Estado y no un descuento nuestro, y con eso se caia la publicacion del conocimiento entero.
 *
 * LIMITE CONOCIDO, documentado en vez de fingido: el allowlist valida el MONTO, no a que producto
 * se lo pega. "el chatbot cuesta Bs 320" es una cifra real mal asignada y pasa en modo abierto.
 * Lo cubre que ese modo solo alcanza a un texto que se revisa y se versiona.
 */
function evaluaDeclaraPrecio(norm, patterns, opciones = {}) {
  const { montos, intrusos } = soloPreciosPublicos(norm);
  if (montos.length === 0) return patterns.some((pattern) => pattern.test(norm));
  if (!opciones.preciosPublicos) return true;
  if (intrusos.length > 0) return true;
  return MARCADORES_DE_OFERTA.some((pattern) => pattern.test(norm));
}

export const GUARDRAIL_RULES = Object.freeze([
  Object.freeze({
    code: "declara_precio",
    reason:
      "N1 — el bot solo dice los precios PUBLICOS de subscription-plans.ts y pricing.ts: " +
      "ni una cifra inventada, ni un descuento",
    patterns: Object.freeze([
      /\d+(?:[.,]\d+)?\s*(bs\b|bolivianos?\b|\$us\b|usd\b|dolares?\b)/,
      /\bcuesta\b|\bsale\b\s*(en|a|por)?\s*\d/,
      /\bprecio\s*(es|:|=|de|final|mensual)\b/,
      /\bdesde\s+bs\b/,
    ]),
    // Con cifra manda `evalua`; sin cifra, los `patterns` de arriba. Ver el comentario del metodo.
    evalua: evaluaDeclaraPrecio,
  }),
  Object.freeze({
    code: "promete_siat",
    reason: "N2 — Onia NO está homologada ante el SIN: prometer emisión certificada es riesgo real",
    patterns: Object.freeze([
      /\b(emitimos|emite|factura(mos)?)\b[^.]{0,30}\b(siat|sin|electronica|certificada)\b/,
      // El plural cuenta: "ya estamos homologados" es la forma mas natural de decirlo, y con
      // `[oa]\b` a secas se colaba entera. Lo caza el guardrail del LLM y tambien el validador de
      // la capa de conocimiento editable, que usa este mismo checkGuardrails().
      /\bhomologad[oa]s?\b/,
      /\bautorizado por el sin\b/,
    ]),
  }),
  Object.freeze({
    code: "promete_feature",
    reason: "N2 — compromiso de capacidad no desplegada",
    patterns: Object.freeze([
      /\bse integra con\b/,
      /\b(soporta|incluye|tiene)\b[^.]{0,25}\b(rayos x|radiograf\w*|impresora|nfc|firma digital)\b/,
      /\bgarantiz\w+/,
      /\bsin falla\w*/,
    ]),
  }),
  Object.freeze({
    code: "finge_humano",
    reason: "N3 — el 'es IA' se dice de frente: es el pilar P4 y es política de Meta",
    patterns: Object.freeze([
      /\bsoy (sergio|lucia|humano|una persona)\b/,
      /\bte llamo (ahora|en un rato)\b/,
      /\bestoy revisando tu\b/,
    ]),
  }),
  Object.freeze({
    code: "cifra_inventada",
    reason: "N4 — cero casos, porcentajes ni testimonios fabricados",
    patterns: Object.freeze([
      /\b\d{1,3}\s*%/,
      /\b(mas de|mas que)\s+\d+\s+(clinicas|clientes|dentistas|pacientes)\b/,
    ]),
  }),
  Object.freeze({
    code: "consejo_profesional",
    reason: "N5 — consejo profesional (clínico, legal o fiscal): eso va a handoff, no lo contesta el bot",
    patterns: Object.freeze([
      /\b(te recomiendo|deberias)\b[^.]{0,25}\b(declarar|facturar|tratamiento|diagnostic)/,
    ]),
  }),
]);

/** minusculas + sin tildes (NFD y se descartan los diacriticos). */
export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Devuelve los codigos violados. No modifica nada.
 * @param {object} [opciones] `preciosPublicos: true` habilita el allowlist de montos — se usa SOLO
 *   para la FAQ `precios` (texto curado). Por defecto va el modo estricto, que es el del LLM.
 */
export function checkGuardrails(text, opciones = {}) {
  const norm = normalize(text);
  const violations = [];
  for (const rule of GUARDRAIL_RULES) {
    // Una regla puede traer su propia decision (hoy solo `declara_precio`, que necesita mirar el
    // allowlist y no solo hacer match). Sin `evalua`, sigue siendo "cualquier patron alcanza".
    const viola =
      typeof rule.evalua === "function"
        ? rule.evalua(norm, rule.patterns, opciones)
        : rule.patterns.some((pattern) => pattern.test(norm));
    if (viola) violations.push(rule.code);
  }
  return violations;
}

/**
 * Aplica el guardrail al texto libre del LLM.
 * @returns {{ok: boolean, text: string, violations: string[], error?: string}}
 * ok=false => `text` ya es el texto seguro (con sus {{ }} sin renderizar).
 * Ante CUALQUIER error interno devuelve el texto original con ok=true: el guardrail no rompe nada.
 */
export function enforceGuardrails(text, options = {}) {
  try {
    // La coercion va DENTRO del try: un objeto con toString() roto no puede tumbar el webhook.
    const original = String(text ?? "");
    const safeReply = options.safeReply || SAFE_REPLY;
    const violations = checkGuardrails(original);
    if (violations.length === 0) return { ok: true, text: original, violations: [] };
    return { ok: false, text: safeReply, violations };
  } catch (error) {
    return {
      ok: true,
      text: typeof text === "string" ? text : "",
      violations: [],
      error: String(error?.message || error).slice(0, 200),
    };
  }
}

/** Explicacion legible de un codigo (para el panel y el probador). */
export function guardrailReason(code) {
  const rule = GUARDRAIL_RULES.find((item) => item.code === code);
  return rule ? rule.reason : code;
}
