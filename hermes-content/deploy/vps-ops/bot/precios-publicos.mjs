// ONIA — Chatbot: los UNICOS montos que el bot tiene permitido decir, y de donde sale cada uno.
//
// Decision de la sesion de control en nombre de Sergio (2026-09-03, tarea t_0651707c): el bot SI
// puede decir los precios PUBLICOS — los mismos que estan en onia.com.bo/precios — leidos de
// `lib/subscription-plans.ts` (DEFAULT_PLAN_AMOUNTS) y `lib/pricing.ts` de onia-platform, nunca de
// otro doc. Sigue PROHIBIDO inventar cifras y ofrecer descuentos.
//
// POR QUE EXISTE ESTE ARCHIVO Y NO UNA CIFRA SUELTA EN EL TEXTO:
// CLAUDE.md manda que el precio se LEA de esos dos archivos. El bot corre en otro repo, en .mjs, y
// dentro de un contenedor donde onia-platform no existe: no puede importarlos en vivo. Entonces la
// cifra se copia UNA vez, aca, con el simbolo exacto del que salio — y `precios-publicos.test.mjs`
// vuelve a abrir los dos .ts y falla en ROJO si alguno cambio. Copiar sin esa guarda es como se
// llego a tener cuatro precios vivos del mismo chatbot.
//
// QUE NO ESTA ACA, A PROPOSITO: los "desde" que se cotizan caso por caso (implementacion de
// Empresa, self-hosted, el equivalente mensual del anual) y las tarifas de Meta. El bot no cotiza
// nada de eso; si lo dijera, estaria prometiendo un numero que depende del alcance.

/**
 * Cada monto con su origen. `simbolo` es la ruta exacta dentro del archivo fuente: es lo que el
 * test vuelve a leer, asi que un rename alla tambien pone esto en rojo.
 */
export const PRECIOS_PUBLICOS = Object.freeze([
  // --- Planes de suscripcion → lib/subscription-plans.ts (DEFAULT_PLAN_AMOUNTS) ---
  Object.freeze({ monto: 320, concepto: "plan Básico, por mes", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.basic.monthly" }),
  Object.freeze({ monto: 89, concepto: "plan Básico, por semana", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.basic.weekly" }),
  Object.freeze({ monto: 3200, concepto: "plan Básico, total al año", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.basic.annual" }),
  Object.freeze({ monto: 550, concepto: "plan Crece, por mes", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.crece.monthly" }),
  Object.freeze({ monto: 145, concepto: "plan Crece, por semana", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.crece.weekly" }),
  Object.freeze({ monto: 5500, concepto: "plan Crece, total al año", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.crece.annual" }),
  Object.freeze({ monto: 890, concepto: "plan Profesional, por mes", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.professional.monthly" }),
  Object.freeze({ monto: 229, concepto: "plan Profesional, por semana", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.professional.weekly" }),
  Object.freeze({ monto: 8900, concepto: "plan Profesional, total al año", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.professional.annual" }),
  Object.freeze({ monto: 1290, concepto: "plan Completo, por mes", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.clinic.monthly" }),
  Object.freeze({ monto: 12900, concepto: "plan Completo, total al año", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.clinic.annual" }),
  Object.freeze({ monto: 2900, concepto: "plan Empresa, por mes", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.enterprise.monthly" }),
  Object.freeze({ monto: 29000, concepto: "plan Empresa, total al año", fuente: "subscription-plans.ts", simbolo: "DEFAULT_PLAN_AMOUNTS.enterprise.annual" }),

  // --- Add-ons → lib/pricing.ts ---
  Object.freeze({ monto: 390, concepto: "chatbot de WhatsApp, por mes", fuente: "pricing.ts", simbolo: "WHATSAPP_ADDON.entryMonthly" }),
  Object.freeze({ monto: 3900, concepto: "chatbot de WhatsApp, total al año", fuente: "pricing.ts", simbolo: "WHATSAPP_ADDON.annualTotal" }),
  Object.freeze({ monto: 150, concepto: "agenda pública, por mes en Básico", fuente: "pricing.ts", simbolo: "BOOKING_ADDON_PRICE.monthly" }),
  Object.freeze({ monto: 70, concepto: "usuario extra, por mes", fuente: "pricing.ts", simbolo: "EXTRA_USER_ADDON_PRICE.monthly" }),
]);

/** Los montos, sin repetir. Es el allowlist que consulta el guardrail. */
export const MONTOS_PERMITIDOS = Object.freeze(new Set(PRECIOS_PUBLICOS.map((item) => item.monto)));

/**
 * Marcadores de descuento/promocion. Un monto publico NO habilita a regalarlo: "Bs 320 con
 * descuento" tiene la cifra correcta y sigue siendo una venta que Sergio no autorizo. Van aparte
 * del allowlist justamente para que una cifra buena no pueda contrabandear una oferta.
 *
 * ⚠️ Solo se miran cuando el texto TRAE una cifra (guardrails.mjs). Palabras como "gratis" son
 * legitimas fuera de una oferta —la FAQ del SIAT habla del portal gratuito del Estado— y mirarlas
 * sueltas tumbaba la publicacion del conocimiento entero.
 */
export const MARCADORES_DE_OFERTA = Object.freeze([
  /\bdescuent\w+/,
  /\bpromocion\w*/,
  /\boferta\b/,
  /\brebaj\w+/,
  /\bgratis\b/,
  /\bsin (costo|cargo alguno)\b/,
  /\bte lo dejo\b/,
  /\bprecio especial\b/,
  /\bsolo por hoy\b/,
  /\bmitad de precio\b/,
]);

/**
 * Numeros escritos como plata. Cubre las DOS formas, y esa es la correccion que motivo el archivo:
 * el guardrail viejo solo veia "320 Bs" y dejaba pasar "Bs 320" — la forma que usa el propio
 * pricing.ts ("Bs 390/mes"), o sea la unica que un texto real iba a traer.
 */
const MONEDA = String.raw`bs|bolivianos?|\$us|usd|dolares?`;
const NUMERO = String.raw`\d[\d.,]*`;
const MONTO_CON_MONEDA = new RegExp(
  String.raw`(?:(?:${MONEDA})\s*\.?\s*(${NUMERO}))|(?:(${NUMERO})\s*(?:${MONEDA})\b)`,
  "g",
);

/**
 * "1.500" -> 1500, "0,11" -> 0.11, "320" -> 320.
 * El punto es separador de miles en Bolivia, asi que no se puede delegar en Number().
 */
export function parsearMonto(crudo) {
  const texto = String(crudo ?? "").trim();
  if (!texto) return null;
  if (/^\d{1,3}(?:[.,]\d{3})+$/.test(texto)) return Number(texto.replace(/[.,]/g, ""));
  if (/^\d+[.,]\d{1,2}$/.test(texto)) return Number(texto.replace(",", "."));
  if (/^\d+$/.test(texto)) return Number(texto);
  return null;
}

/** Todos los montos de plata que aparecen en un texto YA NORMALIZADO (minusculas, sin tildes). */
export function montosEnTexto(textoNormalizado) {
  const encontrados = [];
  // El regex lleva /g, asi que se le resetea el lastIndex: con /g, .exec() es stateful y una
  // segunda llamada arrancaria por la mitad. Es la misma trampa que guardrails.mjs documenta.
  MONTO_CON_MONEDA.lastIndex = 0;
  let match;
  while ((match = MONTO_CON_MONEDA.exec(String(textoNormalizado ?? ""))) !== null) {
    const monto = parsearMonto(match[1] ?? match[2]);
    if (monto !== null) encontrados.push(monto);
  }
  return encontrados;
}

/**
 * ¿Este texto dice SOLO precios publicos?
 * `true` exige que haya al menos un monto y que todos esten en el allowlist. Sin montos devuelve
 * `false` a proposito: si no hay cifra, no hay nada que eximir, y una frase como "el precio es X"
 * tiene que seguir cayendo en el guardrail por sus propios patrones.
 */
export function soloPreciosPublicos(textoNormalizado) {
  const montos = montosEnTexto(textoNormalizado);
  const intrusos = montos.filter((monto) => !MONTOS_PERMITIDOS.has(monto));
  return { montos, intrusos, ok: montos.length > 0 && intrusos.length === 0 };
}
