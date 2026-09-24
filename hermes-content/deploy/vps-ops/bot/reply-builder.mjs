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

import { DEFAULT_CONFIG, MODULOS_LISTOS, branchFor, claveDeSlot, renderTemplate, joinEs, viaDelCanal } from "./config.mjs";
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
  // El fallback a `config.slots` con `slotsOffered` vacio es DELIBERADO y esta documentado en
  // followUpTemplate: el texto libre y la plantilla paga tienen que mirar los mismos horarios, asi
  // que una conversacion que nacio sin horarios igual usa los del config si despues se definen.
  // No se toca para tapar el placeholder — eso se resuelve en `hayHorarioReal`, que mira el flag
  // `pending`, que es la señal de verdad. Cambiarlo aca movia una ruta de plantillas PAGAS.
  return state.slotsOffered && state.slotsOffered.length ? state.slotsOffered : config.slots;
}

/**
 * Lo que el prospecto puede ELEGIR: los que vio (la foto de `activeSlots`) MAS los que tenemos
 * libres hoy y el guion no nombra (`config.slotsElegibles`, ver config.mjs).
 *
 * Son dos preguntas distintas y estaban contestadas con una sola lista: el guion ofrece de a dos
 * porque `{{slot_a}}` y `{{slot_b}}` caen en la misma frase, y de ahi salia tambien lo unico que
 * el motor sabia aceptar. Con cinco horarios publicados por dia, tres quedaban inalcanzables:
 * quien los nombraba caia en `proposesOwnTime` y se iba a la cola humana. Medido el 2026-09-24:
 * 43 conversaciones, CERO con `calendar_event_id`.
 *
 * Se deduplica por `claveDeSlot` porque la foto y los de hoy pueden ser EL MISMO horario, y dos
 * copias de un mismo dia hacen que `detectSlotChoice` lo lea como ambiguo (`accepted.length === 1`)
 * y lo mande a un humano — el bug que esto cierra, otra vez, por la puerta de atras.
 */
export function elegibleSlots(state, config) {
  const vistos = (activeSlots(state, config) || []).filter(Boolean);
  const claves = new Set(vistos.map(claveDeSlot));
  const extras = (config.slotsElegibles || []).filter((slot) => slot && !claves.has(claveDeSlot(slot)));
  return [...vistos, ...extras];
}

/**
 * ¿Hay horarios de VERDAD para ofrecer? Un slot `pending` es un placeholder, no una opcion.
 * Cubre los dos caminos por los que la conversacion se queda sin horarios: `slotsOffered: []`
 * (welcomeResult no ofrecio ninguno) y `config.slots` todavia en "pendiente de definir".
 *
 * Los tiene que tener TODOS, no alguno: las plantillas del guion (M0, M0b, PENDING_HORARIO)
 * ponen {{slot_a}} Y {{slot_b}} sobre la mesa en la misma frase, asi que con uno solo real el
 * otro sale igual, con su etiqueta, y el prospecto puede elegirlo. Mientras `pending` fue
 * todo-o-nada (los dos placeholders de DEMO_SLOTS) daba lo mismo; desde que el corte por
 * anticipacion (ANTICIPACION_MINIMA_MS) lo volvio un estado POR horario, `some` empezo a
 * ofrecer el vencido — y encima contradiciendo a la bienvenida, que mira `slotsPending`
 * (ALGUNO pending) y ya se habia callado. Medido en produccion el 2026-09-05, ver el test
 * "HORARIO VENCIDO" de bot-engine.test.mjs.
 *
 * Cuando falla, el guion cae a la rama SIN_HORARIOS, que no es silencio: sigue el embudo
 * pidiendo el contacto y avisa a Sergio para que coordine el la hora.
 */
function hayHorarioReal(state, config) {
  const slots = (activeSlots(state, config) || []).filter(Boolean);
  return slots.length > 0 && slots.every((slot) => !slot.pending);
}

function catalogo(config) {
  return config.productos?.length ? config.productos : DEFAULT_CONFIG.productos;
}

const esServicio = (producto) => producto.tipo === "servicio";

/**
 * Los MODULOS de la plataforma, listos para leerse en WhatsApp.
 * La lista es dato editable (config.productos), pero el "ya está armado" lo decide
 * `MODULOS_LISTOS`, congelado en codigo: por eso una edicion puede sumar un modulo pero NO puede
 * declararlo terminado.
 *
 * Lo que no esta listo NO SE NOMBRA. Hasta el 2026-09-05 se agrupaba en una linea final
 * ("• Servicios: en construcción, sin humo"), justificada en que era "la misma frase que usa la
 * web". Las dos mitades de eso quedaron falsas: la web no dice ni "sin humo" ni "en construcción"
 * en ninguna de sus pantallas, y la regla de Sergio del 2026-08-20 prohibe comunicar estado de
 * obra en TODA superficie que ve un cliente — el bot es la mas directa que hay, y un solo cartel
 * contamina la percepcion del producto entero. La demanda de lo que falta se captura sin
 * admitirlo, que es lo que ya hace el cierre de la plantilla ("cuál te sirve lo ve Sergio").
 *
 * El candado se aplica SIEMPRE acá, y eso es deliberado: esta lista es el funnel de venta de
 * ONIA. El catalogo de un cliente no pasa por esta funcion — sale por `catalogoCliente()` en
 * recepcionista.mjs, sin candado, porque son hechos suyos. Un primer intento de distinguirlos
 * comparando la identidad del array abria justo el agujero que el CANDADO existe para tapar: al
 * editar `productos` en el knowledge, el array dejaba de ser el default y la edicion se saltaba
 * la vara entera, pudiendo declarar armado un modulo que no lo esta.
 *
 * Lo que la capa editable SI puede sumar sin desplegar son los SERVICIOS (ver serviceList): esos
 * no son software a medio construir. Un MODULO nuevo necesita entrar a MODULOS_LISTOS, que es
 * codigo, con el modulo construido delante — encenderlo es una promesa comercial.
 */
function productList(config) {
  return catalogo(config)
    .filter((producto) => !esServicio(producto) && MODULOS_LISTOS.has(producto.key))
    .map((producto) => `• *${producto.nombre}*${producto.queResuelve ? ` — ${producto.queResuelve}` : ""}.`)
    .join("\n");
}

/**
 * Los SERVICIOS, en una sola frase. No pasan por MODULOS_LISTOS porque no son software a medio
 * construir: son trabajo que Onia ya entrega (web, chatbot, videos con IA, redes). Van en una
 * linea y no en viñetas para que la respuesta siga entrando de un vistazo en WhatsApp.
 *
 * Devuelve la frase ENTERA (o vacio) en vez de solo la lista: si el catalogo editable se quedara
 * sin servicios, una plantilla con "Y además hacemos {{servicios}}." dejaria un "Y además
 * hacemos ." colgando a la vista del prospecto. El bloque se arma acá o no se arma.
 */
function serviceList(config) {
  const servicios = catalogo(config).filter(esServicio).map((producto) => producto.nombre);
  return servicios.length ? `\n\nY además hacemos ${joinEs(servicios)}.` : "";
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
    // El dueno suele escribir su horario como oracion completa ("Atendemos de lunes...").
    // Las plantillas que consumen {{horario_frase}} ya ponen el verbo o el contexto
    // ("Atendemos {{...}}", "en horario de oficina ({{...}})"): sin este strip salia
    // "Atendemos Atendemos de lunes..." — visto en produccion (conv 39, 2026-08-29).
    horario_frase: (horario.frase || DEFAULT_CONFIG.businessHours.frase).replace(/^\s*atendemos\s+/i, ""),
    // Por qué vía le escribe el humano. Se DERIVA del canal (ver `viaDelCanal`): el widget web
    // no tiene teléfono, así que prometerle "desde este mismo número" es imposible de cumplir.
    via_humano: viaDelCanal(state.channelType),
    slot_a: slotLabel(slots, "A"),
    slot_b: slotLabel(slots, "B"),
    // Un solo bloque: modulos + servicios. Ver serviceList sobre por que no son dos variables.
    productos: `${productList(config)}${serviceList(config)}`,
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
  // SIN HORARIOS REALES NO SE PIDE ELEGIR. Este es el punto por el que el placeholder salio a
  // produccion, y tapa DOS salidas de una sola vez: bot-engine.mjs pega este texto al final de la
  // respuesta determinista y ademas se lo pasa al LLM como `pendingQuestion` — de ahi salieron las
  // parafrasis "horario A o horario B" (conv 49, 2026-09-03). Si la re-pregunta no plantea una
  // eleccion, no hay literal que filtrar ni nada que el modelo pueda parafrasear.
  if (ESPERA_HORARIO_STAGES.includes(state.botStage)) {
    return say(hayHorarioReal(state, config) ? "PENDING_HORARIO" : "PENDING_HORARIO_SIN_HORARIOS", state, config).text;
  }
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
