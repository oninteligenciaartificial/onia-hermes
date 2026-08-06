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

/**
 * Texto seguro (equivalente al SAFE_REPLY de BE). Conserva los {{ }} a proposito: la
 * sustitucion de variables ocurre DESPUES del guardrail, si no una hora puede parecer una cifra.
 */
export const SAFE_REPLY =
  "Eso prefiero no contestártelo yo — soy un bot y no quiero darte un dato equivocado. " +
  "Te lo confirma {{humano}} en la demo. ¿Te reservo {{slot_a}} o {{slot_b}}?";

/**
 * Los 6 codigos de la spec. Los regex se escriben SIN tildes porque el texto llega normalizado.
 * Desviacion consciente respecto de la tabla de la spec: en `promete_feature` uso `radiograf\w*`
 * en vez de `radiograf` — con `\b` al final, "radiografia" nunca matchearia (la 'i' es \w).
 */
export const GUARDRAIL_RULES = Object.freeze([
  Object.freeze({
    code: "declara_precio",
    reason: "N1 — el bot no cotiza: el precio depende del plan y del tamaño de la clínica",
    patterns: Object.freeze([
      /\d+(?:[.,]\d+)?\s*(bs\b|bolivianos?\b|\$us\b|usd\b|dolares?\b)/,
      /\bcuesta\b|\bsale\b\s*(en|a|por)?\s*\d/,
      /\bprecio\s*(es|:|=|de|final|mensual)\b/,
      /\bdesde\s+bs\b/,
    ]),
  }),
  Object.freeze({
    code: "promete_siat",
    reason: "N2 — DentalGest no está homologado ante el SIN: prometer emisión certificada es riesgo real",
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
    reason: "N5 — consejo clínico, dental o fiscal: eso va a handoff, no lo contesta el bot",
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

/** Devuelve los codigos violados. No modifica nada. */
export function checkGuardrails(text) {
  const norm = normalize(text);
  const violations = [];
  for (const rule of GUARDRAIL_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(norm))) violations.push(rule.code);
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
