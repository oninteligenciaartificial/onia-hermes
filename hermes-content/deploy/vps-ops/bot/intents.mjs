// ONIA — Chatbot propio: DETECCION DETERMINISTA (regex + parsers).
// Es la tabla de decision de la spec §2.3 y corre ANTES de cualquier LLM.
// Regla de oro (spec §2.1): el estado solo avanza con un dato CAPTURADO Y GUARDADO, nunca con
// una suposicion del LLM. Por eso la extraccion de la calificacion vive aca, no en el prompt.
// Todos los regex reciben texto YA normalizado (minusculas, sin tildes) y NO llevan flag /g.

import { normalize } from "./guardrails.mjs";

// ---------------------------------------------------------------------------
// Intenciones (orden de prioridad de la spec §5.2:
//   opt-out > queja > precio > SIAT > clinico/legal > estado actual)
// ---------------------------------------------------------------------------

const RE_OPT_OUT = /\b(stop|baja|desuscribir|dar de baja)\b|\bno me (escribas|escriban|contactes|moleste)\b|\bno me interesa\b|\bdejame? de escribir\b|\bborrame\b/;
const RE_PRECIO = /\bcuanto (cuesta|sale|vale|es)\b|\bprecio(s)?\b|\bcostos?\b|\btarifa\b|\bcuanto me (sale|saldria|costaria)\b|\d+\s*(bs|bolivianos?|\$us|usd|dolares?)\b|\bes (caro|barato)\b|\bpresupuesto\b|\bcobran\b/;
// Ojo: el "sin" de la spec es el Servicio de Impuestos Nacionales, no la preposicion. Suelto
// ("demo sin compromiso") daria falsos positivos, asi que solo cuenta con articulo.
const RE_SIAT = /\bsiat\b|\bfactura(s|cion|r|do)?\b|\b(el|al|del) sin\b|\bimpuestos nacionales\b|\bimpuest\w+|\bnit\b|\bfiscal\b/;
const RE_QUEJA = /\bestafa\b|\bchanta\b|\bfraude\b|\bmentira\b|\bno les creo\b|\bes un robo\b|\bhuev\w+|\bpelotud\w+|\bbasura\b|\bporqueria\b|\bdenuncia\b/;
const RE_CLINICO_LEGAL = /\b(diagnostic\w+|tratamiento|extraccion|endodoncia|caries|implante|anestesia|receta|medicament\w+)\b|\bes deducible\b|\bpuedo (declarar|deducir)\b|\bcontrato\b|\bdemanda\b|\babogad\w+/;
const RE_PRODUCTO_DETALLE = /\bse conecta con\b|\bse integra con\b|\bcompatible con\b|\brayos x\b|\bradiograf\w+|\bimpresora\b|\bfirma digital\b|\bapi\b|\bexportar\b|\bmigrar (mis|los) datos\b/;
const RE_SIN_SLOT = /\bningun[oa]?\b|\bno me sirve\b|\bno puedo\b|\botro horario\b|\botro dia\b|\botra fecha\b|\bmas tarde\b|\bno me va\b/;

export function isOptOut(norm) {
  return RE_OPT_OUT.test(norm);
}

export function isPriceQuestion(norm) {
  return RE_PRECIO.test(norm);
}

export function isSiatQuestion(norm) {
  return RE_SIAT.test(norm);
}

export function isComplaint(norm) {
  return RE_QUEJA.test(norm);
}

export function isClinicalOrLegal(norm) {
  return RE_CLINICO_LEGAL.test(norm);
}

/** Pregunta tecnica de producto: el bot NO adivina, va a handoff (spec §2.3). */
export function isProductDetail(norm) {
  return RE_PRODUCTO_DETALLE.test(norm);
}

export function noSlotWorks(norm) {
  return RE_SIN_SLOT.test(norm);
}

/** Disparador de arranque / reapertura. */
export function isDemoTrigger(norm, config) {
  const words = (config?.triggers?.demo || []).map((w) => w.toLowerCase());
  return words.some((word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(norm));
}

// ---------------------------------------------------------------------------
// Eleccion de horario
// ---------------------------------------------------------------------------

const RE_SLOT_A = /^\s*a\s*[).]?\s*$|\bopcion a\b|\bla a\b|\bel? a\b|\bprimer[ao]\b|^\s*1\s*[).]?\s*$|\bla 1\b/;
const RE_SLOT_B = /^\s*b\s*[).]?\s*$|\bopcion b\b|\bla b\b|\bel? b\b|\bsegund[ao]\b|^\s*2\s*[).]?\s*$|\bla 2\b/;

/** Devuelve el slot elegido o null. Tambien matchea el label textual del slot. */
export function detectSlotChoice(norm, slots = []) {
  for (const slot of slots) {
    const label = normalize(slot?.label || "");
    if (label && !slot.pending && norm.includes(label)) return slot;
  }
  const wantsA = RE_SLOT_A.test(norm);
  const wantsB = RE_SLOT_B.test(norm);
  if (wantsA && !wantsB) return slots.find((slot) => slot.key === "A") || null;
  if (wantsB && !wantsA) return slots.find((slot) => slot.key === "B") || null;
  return null;
}

// ---------------------------------------------------------------------------
// Calificacion: ¿es tuya? · ¿cuantos sillones? · ¿que ciudad?
// ---------------------------------------------------------------------------

const RE_ES_MIA = /\bes mi[ao]\b|\bes mi (clinica|consultorio)\b|\bsoy (el |la )?(dueñ\w+|duen\w+|propietari\w+|titular)\b|\btengo (mi|una) (clinica|consultorio)\b|\bmi propi[ao]\b|\bclinica propia\b|\bes propia\b|\bla manejo yo\b|\bsoy dueñ\w+/;
const RE_SOCIO = /\bsoci[ao]s?\b|\ba medias\b|\bcon mi (hermano|hermana|esposa|esposo|colega|primo)\b|\bcompartida\b|\bentre dos\b/;
const RE_NO_ES_MIA = /\btrabajo en la de\b|\bes de (mi jefe|otro|otra|un amigo)\b|\bsoy (emplead\w+|asistent\w+|recepcionista|secretari\w+|pasante)\b|\bno es mia\b|\btrabajo para\b/;

// Descarte: claramente NO es el publico (spec §2.2 M1c). Conservador a proposito.
const RE_DESCARTE = /\bsoy estudiante\b|\bestudio (odontologia|medicina)\b|\bsoy proveedor\b|\bles vendo\b|\bquiero vender\w*\b|\bveterinari\w+|\bpeluqueri\w+|\brestaurante\b|\bferreteri\w+|\bfarmacia\b|\bbusco trabajo\b|\bcurriculum\b|\bcv\b|\bno tengo clinica\b|\bno soy dentista\b/;

const RE_SILLONES = /\b(\d{1,2})\s*(sillon\w*|unidad\w*|box\w*|consultorio\w*)\b/;
const RE_SILLONES_PALABRA = /\b(un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(sillon\w*|unidad\w*|box\w*|consultorio\w*)\b/;
const NUM_PALABRA = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };

// Lista canonica: determinista y sin falsos positivos. El fallback de abajo cubre el resto.
const CIUDADES = Object.freeze([
  ["santa cruz", "Santa Cruz"],
  ["la paz", "La Paz"],
  ["el alto", "El Alto"],
  ["cochabamba", "Cochabamba"],
  ["sucre", "Sucre"],
  ["tarija", "Tarija"],
  ["oruro", "Oruro"],
  ["potosi", "Potosí"],
  ["trinidad", "Trinidad"],
  ["cobija", "Cobija"],
  ["montero", "Montero"],
  ["quillacollo", "Quillacollo"],
  ["sacaba", "Sacaba"],
  ["riberalta", "Riberalta"],
  ["yacuiba", "Yacuiba"],
  ["camiri", "Camiri"],
  ["warnes", "Warnes"],
  ["villa montes", "Villa Montes"],
  ["tupiza", "Tupiza"],
  ["llallagua", "Llallagua"],
]);

const RE_CIUDAD_FALLBACK = /\b(?:estoy en|soy de|desde|ciudad de|vivo en|aca en|aqui en)\s+([a-z]{4,}(?:\s+[a-z]{3,})?)\b/;
const STOP_CIUDAD = new Set(["casa", "clinica", "consultorio", "trabajo", "bolivia", "aqui", "aca", "todo", "esto", "eso", "mismo", "realidad", "verdad"]);

function titleCase(text) {
  return text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

/** Extrae SOLO lo que encuentra. No pisa lo ya capturado. */
export function parseQualification(norm, current = {}) {
  const found = {};

  if (current.ownsClinic === undefined || current.ownsClinic === null) {
    if (RE_SOCIO.test(norm)) found.ownsClinic = "socio"; // decide con un socio => califica, con nota
    else if (RE_NO_ES_MIA.test(norm)) found.ownsClinic = false;
    else if (RE_ES_MIA.test(norm)) found.ownsClinic = true;
  }

  if (current.chairs === undefined || current.chairs === null) {
    const digits = norm.match(RE_SILLONES);
    const words = norm.match(RE_SILLONES_PALABRA);
    if (digits) found.chairs = Number(digits[1]);
    else if (words) found.chairs = NUM_PALABRA[words[1]] ?? null;
    else {
      // Numero suelto: solo vale si es una respuesta corta (el usuario contesta "2").
      const bare = norm.trim().match(/^(\d{1,2})$/);
      if (bare) found.chairs = Number(bare[1]);
    }
    if (found.chairs !== undefined && (!Number.isFinite(found.chairs) || found.chairs < 1 || found.chairs > 60)) {
      delete found.chairs;
    }
  }

  if (current.city === undefined || current.city === null) {
    const hit = CIUDADES.find(([needle]) => norm.includes(needle));
    if (hit) found.city = hit[1];
    else {
      const fallback = norm.match(RE_CIUDAD_FALLBACK);
      const candidate = fallback ? fallback[1].trim() : "";
      if (candidate && !STOP_CIUDAD.has(candidate.split(/\s+/)[0])) found.city = titleCase(candidate);
    }
  }

  return found;
}

/** Descarte suave: claramente fuera del publico objetivo. */
export function isDisqualified(norm, qualification = {}) {
  if (RE_DESCARTE.test(norm)) return true;
  return qualification.ownsClinic === false;
}

const RE_DOLOR_AGENDA = /\bagenda\b|\bcitas?\b|\bturnos?\b|\bhorarios?\b|\bhuecos?\b|\bausenci\w+|\bno vienen a la cita\b/;
const RE_DOLOR_COBROS = /\bcobros?\b|\bcobrar\b|\bpagos?\b|\bplata\b|\bcuentas?\b|\bmorosos?\b|\bdeud\w+|\bcaja\b/;
const RE_DOLOR_PACIENTES = /\bpacientes\b|\bno vuelven\b|\brecall\b|\bseguimiento\b|\bretencion\b|\bfidelizacion\b/;

const RE_CORTESIA = /^\s*(gracias|muchas gracias|ok|oka?y|dale|listo|perfecto|buenisimo|barbaro|de una|joya|👍|🙏)[\s!.,]*$/;

/** "gracias" / "dale" a secas: no es una consulta, no hace falta molestar a un humano. */
export function isCourtesy(norm) {
  return RE_CORTESIA.test(norm);
}

/** El dolor que pregunta M2. Devuelve 'agenda' | 'cobros' | 'pacientes' | null. */
export function detectPainPoint(norm) {
  if (RE_DOLOR_COBROS.test(norm)) return "cobros";
  if (RE_DOLOR_PACIENTES.test(norm)) return "pacientes";
  if (RE_DOLOR_AGENDA.test(norm)) return "agenda";
  return null;
}
