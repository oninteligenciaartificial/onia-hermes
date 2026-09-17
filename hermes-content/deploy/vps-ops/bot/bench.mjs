// ONIA — Chatbot propio: BANCO DE MEDICION (cuanto entiende el bot a un dueño de negocio REAL,
// del rubro que sea: dental, ferreteria, restaurante, servicios).
//
// Por que existe: los tests unitarios prueban que el codigo hace lo que dice el codigo.
// Ninguno dice si el bot entiende a alguien que escribe "cuanto sale?" a secas, "somos 3" o
// "estoy en reunion, te escribo mas tarde". Sin este numero, "el bot mejoro" es una opinion.
//
// Que se mide, y por que asi (los dos principios, copiados del banco de Bolivian Electric):
//   - La decision del bot NO se reimplementa: se llama a la MISMA funcion de produccion,
//     step() de bot-engine.mjs, con la MISMA config. La "ruta" que tomo el turno se lee de
//     result.notes, que es la declaracion que el propio motor hace de lo que hizo. Si el bot
//     cambia de criterio, la medicion cambia con el.
//   - La verdad del caso se lee con el MISMO parser/normalizador que usa el bot
//     (normalize() de guardrails.mjs) y las etiquetas del guion salen de config, no de
//     strings copiados aca: un instrumento mas permisivo que el bot contaria como acierto
//     una respuesta equivocada. Los probes de "que dato esta preguntando" se DERIVAN de
//     config.qualification.fields[].missLabel y de config.script.M0 — bench.test.mjs falla
//     si el guion deja de decir lo que el probe supone.
//
// La verdad de cada caso la declara `said`: que datos DIJO el prospecto, con su valor. Un
// campo ausente de `said` es un campo que el prospecto NUNCA dijo, y guardarlo es inventar.
//
// Puro y determinista: misma entrada -> misma salida. Sin red, sin estado, sin reloj: el
// tiempo entra por `receivedAt` inyectado (BENCH_T0 + 2 min por turno).
//
// Correr:  node hermes-content/deploy/vps-ops/bot/bench.mjs
// Spec:    hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§2.1 regla de oro, §2.3 tabla)

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { STAGES, createState, step } from "./bot-engine.mjs";
import { allQualificationFields, createBotConfig } from "./config.mjs";
import { normalize } from "./guardrails.mjs";

// ---------------------------------------------------------------------------
// Reloj y config del banco
// ---------------------------------------------------------------------------

/**
 * Lunes 15:00 en La Paz: dentro del horario de atencion, para que M7 no ensucie las respuestas.
 * Era 10:05, que estaba dentro del "lun-vie 9:00-18:00" tipeado a mano y quedo FUERA cuando el
 * horario paso a derivarse de las ventanas reales de Sergio Urcullo (14-17 y 20-22). El margen
 * hasta las 17:00 da 60 pasos de `benchClock`, muy por encima del caso mas largo.
 */
export const BENCH_T0 = "2026-07-27T19:00:00Z";

export function benchClock(index) {
  return new Date(Date.parse(BENCH_T0) + index * 120000).toISOString();
}

/**
 * Config medida. Es la de produccion con UNA sustitucion declarada: los 2 horarios.
 * config.mjs los deja como placeholder `pending` a proposito (Sergio no los fijo todavia) y
 * con placeholders la rama "eligio el horario por su etiqueta" no existe — el banco no puede
 * medir un camino que la config apaga. Se sustituyen aca, a la vista, y el reporte imprime
 * cuales se usaron: un numero que no dice contra que se midio no se puede reproducir.
 */
export const BENCH_CONFIG = createBotConfig({
  slots: Object.freeze([
    Object.freeze({ key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false }),
    Object.freeze({ key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false }),
  ]),
});

// ---------------------------------------------------------------------------
// Taxonomia de fallos
// ---------------------------------------------------------------------------

/**
 * Cada tipo de fallo es una forma distinta en que el bot puede quedar mal con un dentista.
 * El orden de SEVERIDAD es de dano de negocio, no de gusto:
 *   - lo peor es avanzar sobre un dato que el prospecto nunca dio (viola §2.1) o hablarle a
 *     alguien que pidio que no le escriban: eso no se arregla con 5 minutos de Sergio;
 *   - lo mas barato es un handoff de mas — la spec §2.3 lo dice con todas las letras:
 *     "Un handoff de mas cuesta 5 minutos de Sergio. Una promesa inventada cuesta un cliente."
 */
export const FAILURES = Object.freeze({
  avanzo_sin_dato: "avanzo de estado con un dato que el prospecto nunca dio (viola la regla de oro §2.1)",
  hablo_sin_permiso: "hablo cuando debia callarse (opt-out vivo o humano a cargo)",
  handoff_de_menos: "siguio solo cuando debia derivar a un humano",
  intent_falso_positivo: "detecto una intencion que NO estaba",
  intent_missed: "no detecto una intencion que SI estaba",
  dato_mal_extraido: "perdio, invento o guardo mal un dato de calificacion",
  repregunta_lo_dicho: "volvio a preguntar algo que el prospecto ya habia contestado",
  estado_incorrecto: "termino en un estado / rama distinta de la correcta",
  texto_incorrecto: "el texto que sale dice algo que no debia decir",
  handoff_de_mas: "derivo a un humano pudiendo seguir solo",
});

export const ALL_STATUSES = Object.freeze(["hit", ...Object.keys(FAILURES)]);

/** 0 = lo peor. Ordena la lista de "peores fallos" del reporte. */
export const SEVERITY = Object.freeze({
  avanzo_sin_dato: 0,
  hablo_sin_permiso: 1,
  handoff_de_menos: 2,
  intent_falso_positivo: 3,
  intent_missed: 4,
  dato_mal_extraido: 5,
  repregunta_lo_dicho: 6,
  estado_incorrecto: 7,
  texto_incorrecto: 8,
  handoff_de_mas: 9,
  hit: 10,
});

/**
 * Las rutas que el motor declara en `notes`. Se lee la PRIMERA que aparece: el motor emite la
 * ruta principal antes que las notas de adorno (fuera_de_horario, llm_no_inyectado, ...).
 */
export const PRIMARY_ROUTES = Object.freeze([
  "silencio",
  "opt_out",
  "reabierto_por_demo",
  "audio_sin_transcripcion",
  "sin_texto",
  "handoff",
  "pregunta_precio",
  "pregunta_siat",
  "bienvenida",
  "calificado",
  "descartado",
  "rama_rubro",
  "repregunta",
  "off_guion",
  "demo_agendada",
  "dolor",
  "cortesia_sin_respuesta",
]);

/** Rutas que nacen de una DETECCION (regex), no del estado: aca viven los falsos positivos. */
export const INTENT_ROUTES = new Set(["opt_out", "pregunta_precio", "pregunta_siat", "descartado", "reabierto_por_demo"]);

/**
 * Handoffs disparados por una deteccion (vs. los que salen del flujo, como "no le sirve el
 * horario"). Estos strings son los que emite bot-engine.mjs: bench.test.mjs verifica que sigan
 * existiendo en el motor, para que renombrar un motivo no se lea como "el bot empeoro".
 */
export const INTENT_HANDOFF_REASONS = new Set([
  "queja_o_desconfianza",
  "consulta_clinica_o_legal",
  "detalle_tecnico_de_producto",
  // Mandar a soporte a quien venia a comprar es un falso positivo caro (le corta la demo), no un
  // handoff de mas: por eso se clasifica con la severidad de una deteccion equivocada.
  "soporte_cliente",
]);

/** Estados en los que el bot YA dio por buena la calificacion. */
export const ADVANCED_STAGES = new Set(["calificado", "esperando_horario", "demo_agendada", "demo_realizada"]);

// ---------------------------------------------------------------------------
// Lectura del turno (todo sale de lo que devolvio step(), nada se recalcula)
// ---------------------------------------------------------------------------

/** La ruta que el propio motor declaro para este turno. `reason` es lo que va tras los dos puntos. */
export function routeOf(result) {
  for (const note of result.notes || []) {
    const [head, ...rest] = String(note).split(":");
    if (PRIMARY_ROUTES.includes(head)) return { route: head, reason: rest.join(":") || null };
  }
  return { route: "sin_ruta", reason: null };
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

/**
 * Que datos de calificacion esta pidiendo esta respuesta.
 * Se deriva de config: M2, M1a y PENDING_CALIFICACION escriben literalmente el `missLabel` del
 * campo (M2 arma su lista con esas mismas palabras), asi que alcanza con buscar ese texto en la
 * respuesta REAL. bench.test.mjs verifica la suposicion contra el guion que sale del motor, para
 * que el probe no sobreviva a un cambio de texto.
 */
export function fieldsAsked(replies, config) {
  const asked = new Set();
  const fields = allQualificationFields(config); // incluye el dato de rama (sillones)
  for (const reply of replies || []) {
    const text = normalize(reply.text || "");
    for (const field of fields) {
      if (text.includes(normalize(field.missLabel))) asked.add(field.key);
    }
  }
  return asked;
}

/** Corre la conversacion completa contra el motor real. Devuelve un turno observado por mensaje. */
export function runConversation(bench, config = BENCH_CONFIG) {
  let state = createState({ channel: "sim", contactRef: bench.id, ...(bench.state || {}) });
  const observed = [];
  bench.turns.forEach((turn, index) => {
    const incoming = typeof turn === "string" ? { text: turn } : { ...turn };
    const result = step(
      state,
      { ...incoming, receivedAt: incoming.receivedAt || benchClock(index) },
      { config },
    );
    state = result.nextState;
    observed.push({ incoming, result, ...routeOf(result) });
  });
  return observed;
}

// ---------------------------------------------------------------------------
// Juicio del caso
// ---------------------------------------------------------------------------

function dataProblems(bench, state, config) {
  const said = bench.said || {};
  const problems = [];
  // Los 3 universales + el dato de rama: perder o inventar los sillones de una clinica tiene que
  // contar como fallo igual que perder la ciudad.
  for (const field of allQualificationFields(config)) {
    const key = field.key;
    const stored = state.qualification ? state.qualification[key] : undefined;
    const declared = Object.prototype.hasOwnProperty.call(said, key);
    if (declared && !hasValue(stored)) {
      problems.push({ kind: "perdido", key, detail: `${key}: el prospecto lo dijo (${JSON.stringify(said[key])}) y no quedo guardado` });
    } else if (declared && hasValue(stored) && stored !== said[key]) {
      problems.push({ kind: "valor", key, detail: `${key}: guardo ${JSON.stringify(stored)}, el prospecto dijo ${JSON.stringify(said[key])}` });
    } else if (!declared && hasValue(stored)) {
      problems.push({ kind: "inventado", key, detail: `${key}: guardo ${JSON.stringify(stored)} y el prospecto nunca lo dijo` });
    }
  }
  return problems;
}

function routeProblem(expected, actual) {
  const sameRoute = expected.route === actual.route;
  const sameReason = !expected.reason || expected.reason === actual.reason;
  if (sameRoute && sameReason) return null;

  const detail = `esperaba ${expected.route}${expected.reason ? `:${expected.reason}` : ""}, tomo ${actual.route}${actual.reason ? `:${actual.reason}` : ""}`;

  // Se callo, pero por otro motivo: no hablo de mas, se equivoco de rama. Etiquetarlo
  // "hablo sin permiso" seria acusarlo de algo que no hizo en un turno sin una sola respuesta.
  if (expected.route === "silencio" && actual.route !== "silencio") {
    return { kind: "hablo_sin_permiso", detail };
  }
  if (expected.route === "handoff" && actual.route !== "handoff") return { kind: "handoff_de_menos", detail };
  if (actual.route === "handoff" && expected.route !== "handoff") {
    const kind = INTENT_HANDOFF_REASONS.has(actual.reason) ? "intent_falso_positivo" : "handoff_de_mas";
    return { kind, detail };
  }
  // El falso positivo se juzga ANTES que el "no la vio": cuando el bot dispara una deteccion
  // que no correspondia (un opt-out sobre "no me interesa el precio"), lo que define el dano
  // es lo que hizo de mas, no lo que dejo de hacer.
  if (INTENT_ROUTES.has(actual.route)) return { kind: "intent_falso_positivo", detail };
  if (INTENT_ROUTES.has(expected.route)) return { kind: "intent_missed", detail };
  return { kind: "estado_incorrecto", detail };
}

/**
 * Evalua un caso contra el motor real. Devuelve TODOS los problemas; el status es el peor.
 * `observed` existe SOLO para poder testear al juez con turnos sinteticos: si el juez se
 * probara con la salida real del bot, sus tests dirian lo que el bot hace hoy y se pondrian
 * en rojo el dia que el bot mejore. En produccion siempre se corre con el motor real.
 */
export function evaluateCase(bench, config = BENCH_CONFIG, observed = runConversation(bench, config)) {
  const last = observed[observed.length - 1];
  const state = last.result.nextState;
  const expected = { route: bench.expect.route, reason: bench.expect.reason || null };
  const actual = { route: last.route, reason: last.reason };
  const problems = [];

  // 1. Regla de oro (§2.1): el estado solo avanza con un dato CAPTURADO — nunca con uno que el
  //    prospecto no dijo. Se mira el dato INVENTADO y no el campo vacio: con el embudo nuevo
  //    (valor + horarios -> reserva -> 3 preguntas) llegar a `demo_agendada` sin los datos es el
  //    DISEÑO, no un fallo. Lo que sigue prohibido es hablarle a alguien con un dato que un regex
  //    se imagino: eso ensucia el CRM y el bot lo repite en voz alta.
  const data = dataProblems(bench, state, config);
  if (ADVANCED_STAGES.has(state.botStage)) {
    const invented = data.filter((problem) => problem.kind === "inventado");
    if (invented.length > 0) {
      problems.push({
        kind: "avanzo_sin_dato",
        detail: `quedo en ${state.botStage} con ${invented.map((p) => `${p.key} inventado`).join(", ")}`,
      });
    }
  }

  // 2. Que rama tomo (lo declara el motor en notes).
  const route = routeProblem(expected, actual);
  if (route) problems.push(route);

  // 3. Que datos quedaron guardados. `subkind` viaja al resumen: contar "perdidos" e
  //    "inventados" leyendo el texto del detalle seria contar el mensaje, no el hecho.
  for (const problem of data) {
    problems.push({ kind: "dato_mal_extraido", subkind: problem.kind, detail: problem.detail });
  }

  // 4. Re-preguntar lo que el prospecto ya contesto.
  const asked = fieldsAsked(last.result.replies, config);
  const reasked = Object.keys(bench.said || {}).filter((key) => asked.has(key));
  if (reasked.length > 0) {
    problems.push({ kind: "repregunta_lo_dicho", detail: `vuelve a pedir ${reasked.join(", ")} — el prospecto ya lo dijo` });
  }

  // 5. El estado solo se juzga si la rama fue la correcta (si no, el estado es su consecuencia).
  if (!route && bench.expect.stage && state.botStage !== bench.expect.stage) {
    problems.push({ kind: "estado_incorrecto", detail: `quedo en ${state.botStage}, esperaba ${bench.expect.stage}` });
  }

  // 6. Silencios: cuando la respuesta correcta es no contestar, contestar ES el fallo.
  const replyText = last.result.replies.map((reply) => reply.text || "").join("\n");
  if ((expected.route === "silencio" || expected.route === "cortesia_sin_respuesta") && last.result.replies.length > 0 && !route) {
    problems.push({ kind: "hablo_sin_permiso", detail: "debia quedarse callado y respondio" });
  }

  // 7. Texto que no puede salir (se usa poco y a proposito: el guion es fijo y ya esta testeado).
  for (const pattern of bench.expect.replyMust || []) {
    if (!pattern.test(replyText)) problems.push({ kind: "texto_incorrecto", detail: `la respuesta no dice ${pattern}` });
  }
  for (const pattern of bench.expect.replyMustNot || []) {
    if (pattern.test(replyText)) problems.push({ kind: "texto_incorrecto", detail: `la respuesta dice ${pattern} y no debia` });
  }

  const status = problems.length === 0
    ? "hit"
    : problems.map((problem) => problem.kind).sort((a, b) => SEVERITY[a] - SEVERITY[b])[0];

  return {
    id: bench.id,
    note: bench.note,
    tags: bench.tags,
    lastMessage: typeof bench.turns[bench.turns.length - 1] === "string"
      ? bench.turns[bench.turns.length - 1]
      : (bench.turns[bench.turns.length - 1].text || `[${bench.turns[bench.turns.length - 1].kind}]`),
    status,
    problems,
    expected: `${expected.route}${expected.reason ? `:${expected.reason}` : ""} / ${bench.expect.stage || "-"}`,
    actual: `${actual.route}${actual.reason ? `:${actual.reason}` : ""} / ${state.botStage}`,
    qualification: { ...(state.qualification || {}) },
    said: { ...(bench.said || {}) },
    reply: replyText,
  };
}

// ---------------------------------------------------------------------------
// Resumen y reporte
// ---------------------------------------------------------------------------

export function summarizeOutcomes(outcomes) {
  const byStatus = Object.fromEntries(ALL_STATUSES.map((status) => [status, 0]));
  const byProblem = Object.fromEntries(Object.keys(FAILURES).map((kind) => [kind, 0]));
  const byTag = {};
  let datosPerdidos = 0;
  let datosInventados = 0;

  for (const outcome of outcomes) {
    byStatus[outcome.status] += 1;
    for (const problem of outcome.problems) {
      byProblem[problem.kind] += 1;
      if (problem.subkind === "perdido") datosPerdidos += 1;
      if (problem.subkind === "inventado") datosInventados += 1;
    }
    for (const tag of outcome.tags) {
      const bucket = byTag[tag] || { total: 0, hits: 0 };
      byTag[tag] = { total: bucket.total + 1, hits: bucket.hits + (outcome.status === "hit" ? 1 : 0) };
    }
  }

  const total = outcomes.length;
  return {
    total,
    hits: byStatus.hit,
    hitRate: total === 0 ? 0 : byStatus.hit / total,
    byStatus,
    byProblem,
    byTag,
    datosPerdidos,
    datosInventados,
  };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatOutcome(outcome, position) {
  const lines = [
    `${position}. [${outcome.status}] ${outcome.id}`,
    `   mensaje:  "${outcome.lastMessage}"`,
    `   esperaba: ${outcome.expected}`,
    `   hizo:     ${outcome.actual}`,
  ];
  if (Object.keys(outcome.qualification).length || Object.keys(outcome.said).length) {
    lines.push(`   guardo:   ${JSON.stringify(outcome.qualification)}  |  dijo: ${JSON.stringify(outcome.said)}`);
  }
  for (const problem of outcome.problems) lines.push(`   fallo:    ${problem.kind} — ${problem.detail}`);
  lines.push(`   por que:  ${outcome.note}`);
  return lines.join("\n");
}

export function formatBenchReport(summary, outcomes, worstCount = 8, meta = {}) {
  const lines = [];
  lines.push("BANCO DE MEDICION — chatbot Onia (agenda demos con dueños de negocios, cualquier rubro)");
  if (meta.fingerprint) lines.push(`codigo medido: ${meta.fingerprint}`);
  if (meta.slots) lines.push(`horarios de la config medida: ${meta.slots}`);
  lines.push("");
  lines.push(`casos: ${summary.total}`);
  lines.push(`ACIERTOS: ${summary.hits}/${summary.total} (${percent(summary.hitRate)})`);
  lines.push("");
  lines.push("casos por fallo mas grave:");
  for (const status of Object.keys(FAILURES)) {
    lines.push(`  ${status.padEnd(22)} ${String(summary.byStatus[status]).padStart(3)}   ${FAILURES[status]}`);
  }
  lines.push("");
  lines.push("problemas totales (un caso puede fallar de varias formas a la vez):");
  for (const kind of Object.keys(FAILURES)) {
    if (summary.byProblem[kind] > 0) lines.push(`  ${kind.padEnd(22)} ${String(summary.byProblem[kind]).padStart(3)}`);
  }
  lines.push("");
  lines.push(`datos que el prospecto DIJO y el bot no guardo: ${summary.datosPerdidos}`);
  lines.push(`datos que el bot guardo y el prospecto NUNCA dijo: ${summary.datosInventados}`);

  const tags = Object.keys(summary.byTag).sort();
  if (tags.length) {
    lines.push("");
    lines.push("por tipo de mensaje:");
    for (const tag of tags) {
      const bucket = summary.byTag[tag];
      lines.push(`  ${tag.padEnd(18)} ${bucket.hits}/${bucket.total} (${percent(bucket.hits / bucket.total)})`);
    }
  }

  const worst = [...outcomes]
    .filter((outcome) => outcome.status !== "hit")
    .sort((a, b) => SEVERITY[a.status] - SEVERITY[b.status] || a.id.localeCompare(b.id))
    .slice(0, worstCount);

  if (worst.length) {
    lines.push("");
    lines.push(`peores ${worst.length} fallos (por dano de negocio):`);
    worst.forEach((outcome, index) => lines.push(formatOutcome(outcome, index + 1)));
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Validacion estructural de los casos (el corredor ABORTA si algo no cierra)
// ---------------------------------------------------------------------------

/**
 * Un caso mal escrito no mide: mide el typo. Se aborta antes de imprimir un numero, igual que
 * el corredor de BE aborta si un caso espera un producto que el catalogo no tiene.
 */
export function validateCases(cases, config = BENCH_CONFIG) {
  const errors = [];
  const ids = new Set();
  const fieldKeys = new Set(allQualificationFields(config).map((field) => field.key));

  for (const bench of cases) {
    const where = bench.id || "(sin id)";
    if (!bench.id) errors.push("hay un caso sin id");
    else if (ids.has(bench.id)) errors.push(`id repetido: ${bench.id}`);
    ids.add(bench.id);
    if (!bench.note) errors.push(`${where}: falta la nota que justifica la respuesta correcta`);
    if (!Array.isArray(bench.tags) || bench.tags.length === 0) errors.push(`${where}: falta tags`);
    if (!Array.isArray(bench.turns) || bench.turns.length === 0) errors.push(`${where}: falta turns`);
    if (!bench.expect || !bench.expect.route) errors.push(`${where}: falta expect.route`);
    else if (!PRIMARY_ROUTES.includes(bench.expect.route)) errors.push(`${where}: ruta desconocida "${bench.expect.route}"`);
    if (bench.expect && bench.expect.stage && !STAGES.includes(bench.expect.stage)) {
      errors.push(`${where}: estado desconocido "${bench.expect.stage}"`);
    }
    for (const key of Object.keys(bench.said || {})) {
      if (!fieldKeys.has(key)) errors.push(`${where}: "${key}" no es un campo de calificacion`);
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Huella del codigo medido (leccion de BE: una base que no dice contra que se midio, miente)
// ---------------------------------------------------------------------------

const HERE = dirname(fileURLToPath(import.meta.url));

/** Cierre transitivo de imports locales: la lista se DERIVA, no se mantiene a mano. */
export function measuredSources(entries = ["bench.mjs", "bench-cases.mjs"], dir = HERE) {
  const seen = new Set();
  const queue = [...entries];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    let source;
    try {
      source = readFileSync(join(dir, file), "utf8");
    } catch {
      continue;
    }
    seen.add(file);
    for (const match of source.matchAll(/from\s+"\.\/([\w.-]+\.mjs)"/g)) queue.push(match[1]);
  }
  return [...seen].sort();
}

export function sourceFingerprint(files = measuredSources(), dir = HERE) {
  const hash = createHash("sha1");
  for (const file of files) {
    hash.update(file);
    hash.update(createHash("sha1").update(readFileSync(join(dir, file))).digest("hex"));
  }
  return `${hash.digest("hex").slice(0, 12)} (${files.length} archivos)`;
}

// ---------------------------------------------------------------------------
// Corredor
// ---------------------------------------------------------------------------

async function main() {
  const { BENCH_CASES } = await import("./bench-cases.mjs");
  const errors = validateCases(BENCH_CASES, BENCH_CONFIG);
  if (errors.length) {
    console.error("El banco NO corre: hay casos mal escritos.");
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  const outcomes = BENCH_CASES.map((bench) => evaluateCase(bench, BENCH_CONFIG));
  const summary = summarizeOutcomes(outcomes);
  console.log(
    formatBenchReport(summary, outcomes, Number(process.env.BENCH_WORST || 8), {
      fingerprint: sourceFingerprint(),
      slots: BENCH_CONFIG.slots.map((slot) => `${slot.key}=${slot.label}`).join(" · "),
    }),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`El banco no pudo correr: ${error && error.stack ? error.stack : error}`);
    process.exit(1);
  });
}
