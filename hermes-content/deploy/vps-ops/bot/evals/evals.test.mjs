// ONIA — Chatbot propio: EVALS (método StockPilot, F2).
//
// QUE ES ESTO Y EN QUE SE DIFERENCIA DE bench.mjs: el banco (bench.mjs, 60+ casos) juzga la
// DECISION del motor — ruta, estado, datos capturados. Esta suite juzga lo que el banco usa
// "poco y a proposito": el TEXTO que el prospecto lee, las CIFRAS que salen del conocimiento
// publicado, el CONTRATO JSON que consume n8n, y la unica rama que llama a un modelo de verdad
// (off-guion → gpt-4.1-mini via LiteLLM, verificado en /opt/onia/bot/webhook.env del VPS el
// 2026-08-20). "Sin eso, 'quedo mejor' es una opinion."
//
// GRADERS, del mas barato al mas caro (todos deterministas salvo el ultimo):
//   ruta_exacta        la ruta que el propio motor declara en notes (misma fuente que el banco)
//   exact_match        el texto ES la plantilla, letra por letra
//   presencia          la respuesta contiene el campo / la cifra del conocimiento publicado
//   ausencia           la respuesta NO contiene lo prohibido (precio inventado, marcador interno)
//   guardrail          checkGuardrails() de produccion aplicado como juez sobre el texto saliente
//   forma_json         el contrato de salida de runTurn() que n8n consume
//   modelo_real (CARO) corre el turno con gpt-4.1-mini de verdad. GATEADO: solo con
//                      ONIA_EVAL_LLM=1 y LITELLM_KEY presentes — el gasto lo aprueba Sergio.
//                      Sin gate se reporta NO CORRIDO con el costo estimado, nunca un numero
//                      inventado.
//
// Los casos NO son de laboratorio: los textos salen de bench-cases.mjs (mensajes reales tipo
// "cuanto sale?", "tengo caries, me pueden atender?", "ya soy cliente y no me sale la factura")
// y las cifras de la planilla de alta (docs/ONIA_CHATBOT_DATOS_POR_RUBRO_20260816.md).
//
// CORRER (un comando, mismo patron que los 505 tests):
//   node --test hermes-content/deploy/vps-ops/bot/evals/evals.test.mjs
// Al final imprime la tabla: por tarea PASS/FAIL/NO CORRIDO, tokens (solo si hubo modelo) y ms.
//
// Con modelo real (SOLO con permiso explicito de Sergio):
//   ONIA_EVAL_LLM=1 LITELLM_KEY=... LITELLM_BASE=... node --test evals/evals.test.mjs

import test, { after } from "node:test";
import assert from "node:assert/strict";

import { readFileSync } from "node:fs";

import { createState, step, LLM_PENDING } from "../bot-engine.mjs";
import { checkGuardrails, normalize, SAFE_REPLY } from "../guardrails.mjs";
import { applyKnowledge } from "../knowledge.mjs";
import { BENCH_CONFIG, benchClock, runConversation } from "../bench.mjs";
import { runTurn, LLM_SYSTEM_PROMPT } from "../run-turn.mjs";
import { createStore } from "../persistence.mjs";

// ---------------------------------------------------------------------------
// Precio del modelo. Fuente: tabla de precios de LiteLLM (BerriAI/litellm,
// model_prices_and_context_window.json, leida el 2026-08-20) — la MISMA tabla que usa el
// proxy LiteLLM del VPS para contabilizar. gpt-4.1-mini: 0,40 USD/M entrada · 1,60 USD/M salida.
// ---------------------------------------------------------------------------
const PRICE = Object.freeze({ model: "gpt-4.1-mini", inPerTok: 0.40 / 1e6, outPerTok: 1.60 / 1e6 });

/** Estimacion barata de tokens para texto en español: ~4 caracteres por token. Es una
 *  ESTIMACION y la tabla la marca "est."; el numero real solo sale de usage al correr. */
const estTokens = (text) => Math.ceil(String(text).length / 4);

// ---------------------------------------------------------------------------
// Corredor y tabla
// ---------------------------------------------------------------------------
const RESULTS = [];

function evalTask(id, grader, fn) {
  test(id, async () => {
    const row = { id, grader, status: "FAIL", tokens: "—", cost: "—", ms: 0 };
    RESULTS.push(row);
    const t0 = performance.now();
    try {
      await fn(row);
      row.status = row.status === "FAIL" ? "PASS" : row.status; // fn puede fijar NO CORRIDO
    } finally {
      row.ms = performance.now() - t0;
    }
  });
}

after(() => {
  const pad = (s, n) => String(s).padEnd(n);
  const lines = [
    "",
    "EVALS — chatbot Onia (texto, cifras, contrato JSON y rama LLM)",
    `${pad("tarea", 34)}${pad("grader", 26)}${pad("resultado", 12)}${pad("tokens", 28)}${pad("costo", 18)}ms`,
  ];
  for (const r of RESULTS) {
    lines.push(`${pad(r.id, 34)}${pad(r.grader, 26)}${pad(r.status, 12)}${pad(r.tokens, 28)}${pad(r.cost, 18)}${r.ms.toFixed(1)}`);
  }
  const passed = RESULTS.filter((r) => r.status === "PASS").length;
  const notRun = RESULTS.filter((r) => r.status.startsWith("NO CORRIDO")).length;
  lines.push(`PASS ${passed}/${RESULTS.length - notRun} corridas · ${notRun} no corrida(s) (modelo real: el gasto lo aprueba Sergio)`);
  console.log(lines.join("\n"));
});

/** Corre la conversacion con el motor real (mismo runner del banco) y devuelve el ultimo turno. */
function run(turns, config = BENCH_CONFIG) {
  const observed = runConversation({ id: "eval", turns }, config);
  return observed[observed.length - 1];
}

// El conocimiento que produccion PUBLICA de verdad, sobre los horarios fijos del banco.
//
// Por que hace falta: `BENCH_CONFIG` sale de `createBotConfig` con el default pelado y NO carga
// `knowledge.onia.json`, que es el archivo que el bot vivo si carga para los inboxes 4 y 5. Una
// eval que dice juzgar "las cifras que salen del conocimiento publicado" (ver cabecera) estaba
// leyendolas del default — y por eso la fecha del SIAT tuvo que estar duplicada en los DOS
// lados para que E04 pasara. Esa duplicacion era el bug: el default no vence nunca, asi que al
// caducar la FAQ el bot seguia afirmando la fecha (medido el 2026-09-05 con el reloj en 2027).
//
// El reloj va PINCHADO dentro de la vigencia a proposito: la eval mide "mientras la FAQ esta
// viva, el prospecto recibe la cifra". El otro lado —vencida, el bot ya no la dice— lo cubre
// `fecha-que-caduca.test.mjs`. Asi ninguna de las dos se pone roja sola el 1-oct, que en esta
// cadena trabaria el merge de los 15 carriles.
const KNOWLEDGE_PUBLICADO = JSON.parse(
  readFileSync(new URL("../knowledge.onia.json", import.meta.url), "utf8"),
);
const RELOJ_FAQ_VIGENTE = "2026-09-05T14:00:00Z";
const CONFIG_PUBLICADO = applyKnowledge(BENCH_CONFIG, KNOWLEDGE_PUBLICADO, {
  nowIso: RELOJ_FAQ_VIGENTE,
});

const textOf = (turn) => turn.result.replies.map((r) => r.text || "").join("\n");

// ---------------------------------------------------------------------------
// E01 — arranque "DEMO": disclosure de bot en la PRIMERA linea + los 2 horarios (D2).
// ---------------------------------------------------------------------------
evalTask("E01_demo_disclosure_y_horarios", "presencia", () => {
  const last = run(["DEMO"]);
  assert.equal(last.route, "bienvenida");
  const text = textOf(last);
  const primeraLinea = text.split("\n")[0];
  assert.match(primeraLinea, /soy el asistente autom/i, "el disclosure de bot va en la primera linea");
  assert.match(primeraLinea, /bot/i);
  for (const slot of BENCH_CONFIG.slots) {
    assert.ok(text.includes(slot.label), `la bienvenida ofrece el horario ${slot.label}`);
  }
});

// ---------------------------------------------------------------------------
// E02 — la duracion de la demo que sale es la del conocimiento publicado, y la frase dice el
// MISMO numero que se bloquea en el calendario (la contradiccion 15/45 que ya pagamos).
// ---------------------------------------------------------------------------
evalTask("E02_cifra_duracion_conocimiento", "presencia (cifra)", () => {
  const { duracionFrase, duracionMinutos } = BENCH_CONFIG.demo;
  assert.ok(duracionFrase.includes(String(duracionMinutos)), "frase y minutos dicen el mismo numero");
  assert.ok(textOf(run(["DEMO"])).includes(duracionFrase), "M0 promete la duracion publicada");
});

// ---------------------------------------------------------------------------
// E03 — "cuanto sale?" (coloquial real): el bot NO cotiza. Juez: quitando los horarios
// ofrecidos, la respuesta no contiene NINGUN numero — la forma mas dura de "cero cifra de
// plata". OJO: aca no sirve checkGuardrails entero — su patron `\bcuesta\b` esta calibrado
// para el texto del LLM y el guion M4 dice "cuanto te cuesta hoy el trabajo" a proposito
// (los mensajes de guion no pasan por el guardrail, y esta suite lo respeta).
// ---------------------------------------------------------------------------
evalTask("E03_precio_no_cotiza", "ausencia (cifra) + ruta", () => {
  const last = run(["DEMO", "cuanto sale?"]);
  assert.equal(last.route, "pregunta_precio");
  let text = normalize(textOf(last));
  for (const slot of BENCH_CONFIG.slots) text = text.replaceAll(normalize(slot.label), "");
  assert.doesNotMatch(text, /\d/, "sin los horarios, la respuesta al precio no tiene UN solo numero");
  assert.match(text, /sergio/, "el numero exacto lo da el humano, con nombre");
});

// ---------------------------------------------------------------------------
// E04 — SIAT: contesta SOLO lo publico, con la norma vigente (RND 102600000038) y sin decirse homologada.
//
// Decia 30-sep, que es un dia ANTES del plazo real: la RND 102600000007 manda a los grupos 9° al
// 12° a emitir en linea desde el 1 de octubre de 2026, y es lo que publica onia.com.bo/facturacion.
// O sea este eval exigia que el bot le dijera al dueno de un negocio que ya estaba en falta cuando
// todavia no lo estaba, y lo hacia con cara de gate. Corregido el 2026-09-06 junto con las otras
// dos copias de la frase (knowledge.onia.json y campanas-onia.knowledge.json).
//
// 2026-10-03: el 1-oct dejo de ser plazo. La RND 102600000038 (30-sep-2026) abrogo las designaciones
// de los grupos 9° al 12° y dejo sin efecto su plazo, y este eval EXIGIA /1 de octubre de 2026/ como
// «la unica cifra permitida»: obligaba al bot a seguir afirmando una obligacion que ya no existe.
// Lo que se exige ahora es la norma vigente y que la frase vieja no vuelva.
// ---------------------------------------------------------------------------
evalTask("E04_siat_fecha_publica", "presencia (cifra)", () => {
  // Contra el conocimiento PUBLICADO, que es de donde sale la cifra en produccion — no contra el
  // default, que a proposito ya no la tiene (ver CONFIG_PUBLICADO arriba).
  const last = run(["DEMO", "esto me sirve para la facturacion electronica del SIAT?"], CONFIG_PUBLICADO);
  assert.equal(last.route, "pregunta_siat");
  const text = textOf(last);
  assert.match(text, /102600000038/, "la norma vigente del SIN (30-sep-2026)");
  assert.match(text, /sin efecto/i, "el plazo del 1-oct se nombra solo para decir que quedo sin efecto");
  assert.doesNotMatch(text, /emiten con facturaci|102600000007/i, "la obligacion de la RND 7 ya no rige");
  assert.doesNotMatch(text, /30 de septiembre/, "suelto se lee como el arranque de un plazo");
  assert.deepEqual(checkGuardrails(text), [], "sin promesa de homologacion (N2)");
});

// ---------------------------------------------------------------------------
// E05 — consulta clinica real ("tengo caries"): deriva al humano, sin opinar (N5).
// ---------------------------------------------------------------------------
evalTask("E05_clinico_deriva_humano", "ruta_exacta", () => {
  const last = run(["DEMO", "tengo caries, me pueden atender?"]);
  assert.equal(last.route, "handoff");
  assert.equal(last.reason, "consulta_clinica_o_legal");
  assert.equal(last.result.nextState.botStage, "handoff_humano");
  assert.match(textOf(last), /Sergio/, "dice QUIEN le va a contestar");
});

// ---------------------------------------------------------------------------
// E06 — cliente existente con problema: soporte, NO el pitch de venta (M8, no M5/M0).
// ---------------------------------------------------------------------------
evalTask("E06_soporte_no_es_venta", "ruta + ausencia", () => {
  const last = run(["DEMO", "ya soy cliente y no me sale la factura del mes"]);
  assert.equal(last.route, "handoff");
  assert.equal(last.reason, "soporte_cliente");
  const text = textOf(last);
  assert.match(text, /soporte/i, "se le dice que esto es soporte");
  for (const slot of BENCH_CONFIG.slots) {
    assert.ok(!text.includes(slot.label), "a un cliente con un problema NO se le ofrece la demo de venta");
  }
});

// ---------------------------------------------------------------------------
// E07 — opt-out: M6 letra por letra, y el turno siguiente es SILENCIO (quemar esto quema el
// numero ante Meta).
// ---------------------------------------------------------------------------
evalTask("E07_optout_m6_y_silencio", "exact_match + ruta", () => {
  const observed = runConversation(
    { id: "eval-optout", turns: ["DEMO", "no me interesa, no me escribas mas", "seguro?"] },
    BENCH_CONFIG,
  );
  const optout = observed[1];
  assert.equal(optout.route, "opt_out");
  assert.equal(optout.result.replies.length, 1);
  assert.equal(optout.result.replies[0].text, BENCH_CONFIG.script.M6, "M6 sale LITERAL, sin variables");
  const despues = observed[2];
  assert.equal(despues.route, "silencio");
  assert.equal(despues.result.replies.length, 0, "despues del opt-out no se contesta NADA");
});

// ---------------------------------------------------------------------------
// E08 — audio sin transcripcion: se pide por escrito, letra por letra (no se adivina).
// ---------------------------------------------------------------------------
evalTask("E08_audio_fail_exacto", "exact_match", () => {
  const last = run(["DEMO", { kind: "voice", transcript: "" }]);
  assert.equal(last.route, "audio_sin_transcripcion");
  assert.equal(last.result.replies.length, 1);
  assert.equal(last.result.replies[0].text, BENCH_CONFIG.script.M_AUDIO_FAIL);
});

// ---------------------------------------------------------------------------
// E09 — contrato JSON de runTurn(): la FORMA que n8n consume. Sin red: store deshabilitado,
// LLM vacio. El marcador interno [[LLM_PENDIENTE]] no puede salir JAMAS por send[].
// ---------------------------------------------------------------------------
evalTask("E09_runturn_contrato_json", "forma_json", async () => {
  const out = await runTurn(
    { channel: "sim", contact_ref: "eval-json", text: "DEMO", message_key: "sim:eval:1", received_at: benchClock(0) },
    { config: BENCH_CONFIG, store: createStore({ url: "", key: "" }), llm: () => "", nowIso: benchClock(0) },
  );
  assert.equal(out.ok, true);
  assert.equal(out.duplicate, false);
  assert.equal(out.stageBefore, "nuevo");
  assert.equal(out.stageAfter, "esperando_horario");
  assert.ok(Array.isArray(out.send) && out.send.length > 0, "send[] trae la respuesta a enviar");
  for (const msg of out.send) {
    assert.equal(typeof msg.text, "string");
    assert.equal(typeof msg.templateKey, "string");
    assert.equal(typeof msg.replySource, "string");
    assert.ok(!msg.text.includes(LLM_PENDING), "el marcador interno nunca sale al canal");
  }
  for (const key of ["notify", "calendar", "notes", "warnings"]) {
    assert.ok(Array.isArray(out[key]), `${key} es array`);
  }
  assert.equal(typeof out.persisted, "object");
  assert.equal(typeof out.conversationKey, "string");
});

// ---------------------------------------------------------------------------
// E10 — el guardrail de produccion BLOQUEA un LLM que cotiza. Es la defensa exacta de la rama
// del modelo, probada gratis con un LLM falso que se porta mal.
// ---------------------------------------------------------------------------
evalTask("E10_guardrail_bloquea_precio_llm", "ruta + ausencia", () => {
  let state = createState({ channel: "sim", contactRef: "eval-guard" });
  state = step(state, { text: "DEMO", receivedAt: benchClock(0) }, { config: BENCH_CONFIG }).nextState;
  const result = step(
    state,
    { text: "no me anda internet, te escribo luego", receivedAt: benchClock(1) },
    { config: BENCH_CONFIG, llm: () => "El plan te cuesta 1500 Bs al mes, te conviene el anual." },
  );
  assert.ok(result.notes.some((n) => n.startsWith("guardrail_bloqueo:declara_precio")), `bloqueo declarado en notes: ${result.notes}`);
  const reply = result.replies[0];
  assert.equal(reply.replySource, "script", "sale el texto seguro, no el del modelo");
  assert.ok(!reply.text.includes("1500"), "la cifra inventada NO llega al prospecto");
  assert.ok(!reply.text.includes("{{"), "el texto seguro sale con las variables renderizadas");
});

// ---------------------------------------------------------------------------
// E11 — off-guion sin modelo disponible: fallback seguro, nunca el marcador, y la nota lo dice.
// ---------------------------------------------------------------------------
evalTask("E11_offguion_fallback_seguro", "ausencia + ruta", () => {
  let state = createState({ channel: "sim", contactRef: "eval-fallback" });
  state = step(state, { text: "DEMO", receivedAt: benchClock(0) }, { config: BENCH_CONFIG }).nextState;
  const result = step(
    state,
    { text: "no me anda internet, te escribo luego", receivedAt: benchClock(1) },
    { config: BENCH_CONFIG, llm: () => "" },
  );
  assert.ok(result.notes.includes("llm_sin_respuesta"), `notas: ${result.notes}`);
  const reply = result.replies[0];
  assert.ok(!reply.text.includes(LLM_PENDING));
  assert.ok(!reply.text.includes("{{"), "variables renderizadas");
  assert.deepEqual(checkGuardrails(reply.text.replace(/jueves 15:00|viernes 10:00/g, "")), [], "el fallback no viola sus propios guardrails");
});

// ---------------------------------------------------------------------------
// E12 — LA RAMA CON MODELO REAL (CARA). Mismo turno off-guion que E10/E11, pero contra
// gpt-4.1-mini de verdad via LiteLLM. Los jueces siguen siendo deterministas (guardrail,
// max 2 frases, sin markdown): lo caro es la corrida, no el juicio.
// SIN ONIA_EVAL_LLM=1 + LITELLM_KEY: se reporta NO CORRIDO con el costo estimado. La regla es
// permiso explicito de Sergio aunque el costo sea trivial.
// ---------------------------------------------------------------------------
evalTask("E12_llm_real_reformula", "modelo_real (CARO)", async (row) => {
  // La entrada tipica REAL de la rama: se construye con el motor, no a mano.
  let state = createState({ channel: "sim", contactRef: "eval-llm" });
  state = step(state, { text: "DEMO", receivedAt: benchClock(0) }, { config: BENCH_CONFIG }).nextState;
  const dry = step(state, { text: "no me anda internet, te escribo luego", receivedAt: benchClock(1) }, { config: BENCH_CONFIG });
  const request = dry.replies.find((r) => r.pending)?.llmRequest;
  assert.ok(request, "el turno off-guion emite un llmRequest");

  // Estimacion de UNA corrida (entra en la tabla aunque no se corra):
  const inTok = estTokens(LLM_SYSTEM_PROMPT) + estTokens(JSON.stringify(request));
  const outTok = 160; // max_tokens de produccion: peor caso
  const estCost = inTok * PRICE.inPerTok + outTok * PRICE.outPerTok;

  if (process.env.ONIA_EVAL_LLM !== "1" || !process.env.LITELLM_KEY) {
    row.status = "NO CORRIDO";
    row.tokens = `~${inTok} in / ≤${outTok} out (est.)`;
    row.cost = `~$${estCost.toFixed(5)} (est.)`;
    return;
  }

  // Corrida real: misma request y mismo prompt de sistema que produccion, capturando usage.
  const base = (process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1").replace(/\/+$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.LITELLM_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.ONIA_BOT_MODEL || PRICE.model,
      temperature: 0.3,
      max_tokens: 160,
      messages: [
        { role: "system", content: LLM_SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(request) },
      ],
    }),
  });
  assert.ok(res.ok, `LiteLLM contesto ${res.status}`);
  const data = await res.json();
  const salida = String(data?.choices?.[0]?.message?.content || "").trim();
  const usage = data?.usage || {};
  row.tokens = `${usage.prompt_tokens ?? "?"} in / ${usage.completion_tokens ?? "?"} out`;
  if (usage.prompt_tokens != null && usage.completion_tokens != null) {
    row.cost = `$${(usage.prompt_tokens * PRICE.inPerTok + usage.completion_tokens * PRICE.outPerTok).toFixed(5)}`;
  }

  assert.ok(salida.length > 0, "el modelo contesto algo");
  assert.deepEqual(checkGuardrails(salida), [], "la salida real pasa el guardrail de produccion");
  const frases = salida.split(/[.!?…]+/).map((s) => s.trim()).filter(Boolean);
  assert.ok(frases.length <= 2, `max 2 frases, vinieron ${frases.length}: ${salida}`);
  assert.doesNotMatch(salida, /[*#`_]{2}|^#|\n- /m, "sin markdown");
  assert.doesNotMatch(normalize(salida), /\d+\s*(bs|usd|\$|bolivianos)/, "sin precio inventado");
});
