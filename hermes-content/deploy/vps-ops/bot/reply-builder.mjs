// ONIA — Chatbot propio: COMO SE ARMA LO QUE EL BOT DICE.
//
// Salio de bot-engine.mjs (que pasaba de 800 lineas) sin tocar una sola linea de logica: es el
// MISMO codigo, movido. Aca vive todo lo que es PURO y no decide nada:
//   - `say()` y `varsFor()`  : renderizan una linea del guion con las variables del estado.
//   - `missingFields()` / `pendingBranch()` / `pendingAsk()` : que dato falta y que se re-pregunta.
//   - `capturedLabels()`     : como el bot repite en voz alta lo que ya anoto.
//
// La division es por RESPONSABILIDAD, no por tamaño: bot-engine.mjs se queda con la maquina de
// estados y el router (quien decide QUE rama se toma); este archivo solo sabe COMO se escribe la
// respuesta de esa rama. Nada de aca mira intenciones, cambia de estado ni emite side effects.
//
// DETERMINISTA igual que el motor: cero Date.now(), cero Math.random(), cero I/O.
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§2 guion, §3 reglas)

import { DEFAULT_CONFIG, MODULOS_LISTOS, branchFor, renderTemplate, joinEs } from "./config.mjs";
import * as intents from "./intents.mjs";

/**
 * Estados donde lo unico pendiente es que el prospecto elija uno de los dos horarios.
 * `esperando_calificacion` y `calificado` son del guion VIEJO (las 3 preguntas iban antes de los
 * horarios): siguen en la lista porque hay conversaciones vivas en la base con ese estado.
 */
export const ESPERA_HORARIO_STAGES = Object.freeze([
  "esperando_calificacion",
  "calificado",
  "esperando_horario",
]);

export function slotLabel(slots, key) {
  const slot = (slots || []).find((item) => item.key === key);
  return slot ? slot.label : "";
}

export function activeSlots(state, config) {
  return state.slotsOffered && state.slotsOffered.length ? state.slotsOffered : config.slots;
}

/**
 * El catalogo listo para leerse en WhatsApp.
 * La LISTA es dato editable (config.productos), pero el "ya está armado" lo decide
 * `MODULOS_LISTOS`, congelado en codigo: por eso una edicion puede sumar un producto pero NO
 * puede declararlo terminado. Lo que no esta listo se agrupa en una linea con la misma frase que
 * usa la web ("sin humo") — decirlo tres veces suena a excusa y es la misma verdad.
 */
function productList(config) {
  const productos = config.productos?.length ? config.productos : DEFAULT_CONFIG.productos;
  const lineas = productos
    .filter((producto) => MODULOS_LISTOS.has(producto.key))
    .map((producto) => `• *${producto.nombre}* — ${producto.queResuelve}.`);
  const enCamino = productos.filter((producto) => !MODULOS_LISTOS.has(producto.key));
  if (enCamino.length) lineas.push(`• ${joinEs(enCamino.map((producto) => producto.nombre))}: en construcción, sin humo.`);
  return lineas.join("\n");
}

export function varsFor(state, config, extra = {}) {
  const q = state.qualification || {};
  const slots = activeSlots(state, config);
  const label = state.scheduledLabel || "";
  const branch = branchFor(q.industry, config);
  // HECHOS, no guion: salen de un solo lugar (config.demo / config.businessHours) y son lo que la
  // capa de conocimiento puede editar sin desplegar. El fallback al codigo esta para que una
  // config armada a mano en un test nunca deje un {{hueco}} a la vista del prospecto.
  const demo = config.demo || DEFAULT_CONFIG.demo;
  const horario = config.businessHours || DEFAULT_CONFIG.businessHours;
  return {
    humano: config.identity.humanName,
    producto: config.identity.productName,
    bot: config.identity.botName,
    demo_duracion: demo.duracionFrase,
    demo_modalidad: demo.modalidad,
    horario_frase: horario.frase || DEFAULT_CONFIG.businessHours.frase,
    slot_a: slotLabel(slots, "A"),
    slot_b: slotLabel(slots, "B"),
    productos: productList(config),
    rubro: intents.industryLabel(q.industry, config) || "",
    personas: q.teamSize ?? "",
    persona_palabra: q.teamSize === 1 ? "persona" : "personas",
    // Se nombra el modulo del rubro SOLO si ese rubro tiene uno de verdad. Para el resto queda
    // vacio: nombrar un modulo que no existe es prometer una feature (N2) con otro disfraz.
    nota_modulo: (branch && branch.moduleNote) || "",
    sillones: q.chairs ?? "",
    sillon_palabra: q.chairs === 1 ? "sillón" : "sillones",
    dia_hora_elegida: label,
    dia: label ? label.split(/\s+/)[0] : "",
    preguntas: askList(state, config),
    ...extra,
  };
}

/** 1️⃣ 2️⃣ 3️⃣ 4️⃣ — la lista de M2 nunca pasa de 4 items (3 datos + el dolor). */
const VINETAS = Object.freeze(["1️⃣", "2️⃣", "3️⃣", "4️⃣"]);

/**
 * Las preguntas que M2 pone sobre la mesa DESPUES de reservar: los datos que todavia faltan
 * (nunca los que el prospecto ya dio) y, siempre al final, la del dolor.
 * Las preguntas se DERIVAN del `missLabel` de cada campo: asi el guion no puede desincronizarse
 * de la config, y el banco (que busca ese mismo texto) mide lo que el bot realmente pregunto.
 */
export function askList(state, config) {
  const items = missingFields(state.qualification || {}, config).map(
    (field) => `¿${field.missLabel.charAt(0).toUpperCase()}${field.missLabel.slice(1)}?`,
  );
  items.push(config.script.M2_PREGUNTA_DOLOR);
  return items.map((item, index) => `${VINETAS[index] || "•"} ${item}`).join("\n");
}

export function say(templateKey, state, config, extraVars = {}) {
  const text = renderTemplate(config.script[templateKey], varsFor(state, config, extraVars));
  return { templateKey, replySource: "script", text };
}

export function missingFields(qualification, config) {
  return config.qualification.fields.filter((field) => {
    const value = qualification[field.key];
    return value === undefined || value === null || value === "";
  });
}

/** Como se lee el dolor cuando el bot lo repite en voz alta ("anotado ... que lo que más te come"). */
const DOLOR_LABEL = Object.freeze({
  agenda: "la agenda",
  cobros: "los cobros",
  clientes: "los clientes que no vuelven",
});

export function capturedLabels(qualification, config) {
  const labels = [];
  if (qualification.industry) {
    const label = intents.industryLabel(qualification.industry, config);
    labels.push(label ? `que te dedicás a ${label}` : "a qué te dedicás");
  }
  if (qualification.teamSize) {
    labels.push(qualification.teamSize === 1 ? "que trabajás por tu cuenta" : `que son ${qualification.teamSize} personas`);
  }
  if (qualification.city) labels.push(`que estás en ${qualification.city}`);
  if (qualification.chairs) {
    labels.push(`que tenés ${qualification.chairs} ${qualification.chairs === 1 ? "sillón" : "sillones"}`);
  }
  if (DOLOR_LABEL[qualification.painPoint]) {
    labels.push(`que lo que más tiempo te come es ${DOLOR_LABEL[qualification.painPoint]}`);
  }
  return labels;
}

/**
 * La pregunta EXTRA que este rubro todavia debe, o null.
 * Se pregunta una sola vez (`branchAsked`): si el prospecto no la contesta, el embudo sigue.
 */
export function pendingBranch(state, config) {
  if (state.branchAsked) return null;
  const branch = branchFor((state.qualification || {}).industry, config);
  if (!branch) return null;
  const value = (state.qualification || {})[branch.field.key];
  return value === undefined || value === null || value === "" ? branch : null;
}

/** La pregunta pendiente del estado actual: con esto una respuesta off-guion vuelve al embudo. */
export function pendingAsk(state, config) {
  // Antes de reservar lo unico pendiente es elegir horario: los datos ya no se piden aca.
  if (ESPERA_HORARIO_STAGES.includes(state.botStage)) return say("PENDING_HORARIO", state, config).text;
  if (state.botStage === "demo_agendada") {
    const missing = missingFields(state.qualification, config);
    if (missing.length > 0) {
      return say("PENDING_CALIFICACION", state, config, {
        dato_faltante: joinEs(missing.map((field) => field.missLabel)),
      }).text;
    }
    const branch = pendingBranch(state, config);
    if (branch) return say(branch.askKey, state, config).text;
    return say("PENDING_AGENDADA", state, config).text;
  }
  return null;
}
