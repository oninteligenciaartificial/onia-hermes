// ONIA — Chatbot propio: pruebas del CIERRE POST-DEMO.
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. EL HUECO: una demo que ya termino y sigue en `demo_agendada` se cierra y se avisa UNA vez.
//      Sin esto, `demo_realizada` era un estado que nadie escribia nunca.
//   2. IDEMPOTENCIA: la reserva ES el cambio de estado (CAS). Correr el barrido dos veces avisa una
//      sola vez, y sin reserva confirmada NO se avisa.
//   3. NO ADIVINA: sin `scheduled_at` no se da nada por terminado; una demo futura o en curso
//      tampoco se toca; y con humano a cargo u opt-out no se toca NADA.
//   4. NO LE ESCRIBE AL PROSPECTO y NO toca el pipeline del CRM: el aviso va a Sergio con las tres
//      salidas, porque el dato (si vino, si cerro) no lo tenemos.
//   5. Tolerancia: sin base, lista vacia y warning. Determinismo: el "ahora" se inyecta.
//
// No hay red real en ninguna prueba: el store se inyecta.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig } from "./config.mjs";
import { createStore } from "./persistence.mjs";
import {
  DONE_STAGE,
  GRACIA_MINUTOS,
  buildDemoDoneNotice,
  closedAfterHours,
  endedBefore,
  parseArgs,
  renderHuman,
  runPostDemoSweep,
  skipReason,
} from "./postdemo-run.mjs";

const CONFIG = createBotConfig({});

// Demo del jueves 30/07 a las 15:00 de La Paz (19:00Z). Dura 30 min y hay 30 de gracia, o sea que
// se da por terminada a las 20:00Z.
const DEMO_AT = "2026-07-30T19:00:00Z";
const NOW = "2026-07-30T21:00:00Z"; // 2 h despues del inicio: terminada hace rato
const NOW_EN_CURSO = "2026-07-30T19:20:00Z"; // 20 min adentro: sigue en la llamada
const NOW_ANTES = "2026-07-30T17:00:00Z"; // la demo todavia no empezo

/** Fila de bot_conversations tal como la devuelve el barrido. */
function row(extra = {}) {
  return {
    conversation_key: "chatwoot:42",
    channel: "chatwoot",
    contact_ref: "42",
    display_name: "Ana",
    bot_stage: "demo_agendada",
    qualification: { industry: "comercio", teamSize: 5, city: "Santa Cruz" },
    scheduled_at: DEMO_AT,
    calendar_event_id: "uid-abc",
    human_took_over: false,
    opt_out_at: null,
    last_inbound_at: "2026-07-29T20:00:00Z",
    raw: { outboundSeq: 3, scheduledLabel: "jue 30/07 15:00" },
    ...extra,
  };
}

/**
 * Store de mentira con memoria. El CAS es de VERDAD: `reserveDemoDone` solo gana si la fila sigue
 * en `demo_agendada`, igual que el UPDATE con WHERE de PostgREST. Las filas se devuelven tal cual
 * (incluso las que NO corresponden) para probar tambien el re-chequeo en memoria.
 */
function memoryStore(rows, options = {}) {
  const calls = [];
  const stage = new Map((rows || []).map((item) => [item.conversation_key, item.bot_stage]));
  return {
    calls,
    stage,
    store: {
      enabled: true,
      warnings: [],
      async sweepDemosTerminadas(cutoff, limit) {
        calls.push(`sweep:${cutoff}:${limit}`);
        if (options.sweepNull) return null;
        return (rows || []).map((item) => ({ ...item }));
      },
      async reserveDemoDone(key) {
        calls.push(`reserve:${key}`);
        if (options.reserveNull) return null;
        if (stage.get(key) !== "demo_agendada") return false;
        stage.set(key, DONE_STAGE);
        return true;
      },
      // Si el barrido llamara a cualquiera de estas, la prueba lo caza: no le escribe al prospecto
      // ni toca el CRM.
      async insertOutbound() {
        calls.push("insertOutbound");
        return 1;
      },
      async saveConversation() {
        calls.push("saveConversation");
        return {};
      },
      async upsertLead() {
        calls.push("upsertLead");
        return "lead-x";
      },
    },
  };
}

/**
 * Canal de aviso de mentira, SIEMPRE listo.
 *
 * Hace falta desde que el barrido manda el aviso de verdad: sin canal no cierra ninguna fila (ver
 * `postdemo-avisa-por-el-canal-vivo.test.mjs`), que es justamente la guarda que impide quemar la
 * reserva. Los casos de abajo miden el FILTRO y el CAS, no el canal, así que se lo damos por
 * puesto — pero se lo damos EXPLÍCITO: caer al canal real del entorno los haría depender de que
 * la máquina que corre los tests tenga (o no) un token de Telegram.
 */
const canalListo = () => ({ listo: true, motivo: null, async enviar() { return { ok: true, status: "sent", reason: "aviso enviado" }; } });

const sweep = (rows, options = {}, config = CONFIG) =>
  runPostDemoSweep({ nowIso: options.nowIso || NOW, emit: options.emit !== false, limit: options.limit }, {
    config,
    store: options.store || memoryStore(rows, options).store,
    aviso: options.aviso || canalListo(),
  });

// ---------------------------------------------------------------------------
// 1. El filtro que sale a PostgREST
// ---------------------------------------------------------------------------

test("el barrido pide demos agendadas que YA TERMINARON (inicio + duracion + gracia), ordenadas y con limite", async () => {
  const requests = [];
  const store = createStore({
    url: "https://sb.test",
    key: "service-role-fake",
    fetch: async (url) => {
      requests.push(String(url));
      return { ok: true, status: 200, text: async () => "[]" };
    },
  });

  await runPostDemoSweep({ nowIso: NOW, emit: true, limit: 20 }, { config: CONFIG, store, aviso: canalListo() });
  const url = requests[0];

  assert.match(url, /bot_stage=eq\.demo_agendada/, "1) la demo esta reservada y sin cerrar");
  assert.match(url, /human_took_over=is\.false/, "2) ningun humano tomo la conversacion");
  assert.match(url, /opt_out_at=is\.null/, "3) no pidio la baja");
  // 21:00Z menos 1 h (30 de demo + 30 de gracia). Con el "ahora" pelado entrarian demos que recien
  // estan empezando.
  assert.match(url, /scheduled_at=lte\.2026-07-30T20:00:00\.000Z/, "4) el corte NO es el ahora pelado");
  assert.ok(!/scheduled_at=gte/.test(url), "no hay piso: una demo vieja sin cerrar tambien se cierra");
  assert.match(url, /order=scheduled_at\.asc/);
  assert.match(url, /limit=20/);
});

test("la reserva es un CAS sobre el estado: el PATCH exige que siga en demo_agendada", async () => {
  const calls = [];
  const store = createStore({
    url: "https://sb.test",
    key: "service-role-fake",
    fetch: async (url, init) => {
      calls.push({ url: String(url), method: init.method, body: init.body });
      return { ok: true, status: 200, text: async () => "[]" };
    },
  });

  await store.reserveDemoDone("chatwoot:42");
  const patch = calls[0];

  assert.equal(patch.method, "PATCH");
  assert.match(patch.url, /conversation_key=eq\.chatwoot%3A42/);
  assert.match(patch.url, /bot_stage=eq\.demo_agendada/, "el CAS: si otro barrido ya la movio, esto pega 0 filas");
  assert.match(patch.url, /human_took_over=is\.false/);
  assert.match(patch.url, /opt_out_at=is\.null/);
  assert.deepEqual(JSON.parse(patch.body), { bot_stage: DONE_STAGE }, "UNA columna: no pisa el resto del estado");
});

// ---------------------------------------------------------------------------
// 2. El hueco: la demo que paso se cierra y se avisa
// ---------------------------------------------------------------------------

test("una demo que ya termino se cierra y avisa a Sergio UNA vez", async () => {
  const memory = memoryStore([row()]);
  const result = await sweep(null, { store: memory.store });

  assert.equal(result.ok, true);
  assert.equal(result.mode, "emit");
  assert.equal(result.scanned, 1);
  assert.equal(result.send.length, 1);
  assert.equal(result.skipped.length, 0);

  const aviso = result.send[0];
  assert.equal(aviso.conversationKey, "chatwoot:42");
  assert.equal(aviso.kind, "demo_realizada");
  assert.equal(aviso.stageBefore, "demo_agendada");
  assert.equal(aviso.stageAfter, DONE_STAGE);
  assert.equal(aviso.reserved, true);
  assert.equal(aviso.hoursSince, 2);
  assert.equal(memory.stage.get("chatwoot:42"), DONE_STAGE, "el estado quedo movido en la base");
});

test("correr el barrido dos veces NO avisa dos veces", async () => {
  const memory = memoryStore([row()]);

  const primera = await sweep(null, { store: memory.store });
  const segunda = await sweep(null, { store: memory.store });

  assert.equal(primera.send.length, 1, "la primera avisa");
  assert.equal(segunda.send.length, 0, "la segunda no");
  assert.deepEqual(segunda.skipped, [{ conversationKey: "chatwoot:42", reason: "ya_cerrada" }]);
});

test("si la reserva falla (base caida) NO se avisa: mejor perder el aviso que mandarlo dos veces", async () => {
  const result = await sweep([row()], { reserveNull: true });

  assert.equal(result.send.length, 0);
  assert.deepEqual(result.skipped, [{ conversationKey: "chatwoot:42", reason: "reserva_fallida" }]);
});

test("dry-run: muestra el aviso y NO reserva nada", async () => {
  const memory = memoryStore([row()]);
  const result = await runPostDemoSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: memory.store });

  assert.equal(result.mode, "dry-run");
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].reserved, false);
  assert.ok(!memory.calls.some((call) => call.startsWith("reserve:")), "el dry-run no toca la base");
  assert.equal(memory.stage.get("chatwoot:42"), "demo_agendada", "la fila sigue abierta");
});

// ---------------------------------------------------------------------------
// 3. Lo que NO se toca
// ---------------------------------------------------------------------------

test("una demo futura o en curso no se cierra (y el motivo dice cuanto falta)", async () => {
  const futura = await sweep([row()], { nowIso: NOW_ANTES });
  assert.equal(futura.send.length, 0);
  assert.match(futura.skipped[0].reason, /^demo_sin_terminar:/);

  const enCurso = await sweep([row()], { nowIso: NOW_EN_CURSO });
  assert.equal(enCurso.send.length, 0, "todavia esta en la llamada: no se le avisa encima");
  assert.match(enCurso.skipped[0].reason, /^demo_sin_terminar:/);
});

test("sin scheduled_at NO se adivina que la demo ocurrio", async () => {
  const result = await sweep([row({ scheduled_at: null })]);

  assert.equal(result.send.length, 0);
  assert.deepEqual(result.skipped, [{ conversationKey: "chatwoot:42", reason: "sin_horario" }]);
});

test("humano a cargo, opt-out u otro estado: no se toca la conversacion", async () => {
  const humano = await sweep([row({ human_took_over: true })]);
  assert.deepEqual(humano.skipped, [{ conversationKey: "chatwoot:42", reason: "humano_a_cargo" }]);

  const baja = await sweep([row({ opt_out_at: "2026-07-30T10:00:00Z" })]);
  assert.deepEqual(baja.skipped, [{ conversationKey: "chatwoot:42", reason: "opt_out" }]);

  const otro = await sweep([row({ bot_stage: "handoff_humano" })]);
  assert.deepEqual(otro.skipped, [{ conversationKey: "chatwoot:42", reason: "estado_no_aplica:handoff_humano" }]);

  const rota = await sweep([row({ scheduled_at: "no-es-fecha" })]);
  assert.deepEqual(rota.skipped, [{ conversationKey: "chatwoot:42", reason: "fecha_invalida" }]);
});

test("el barrido NO le escribe al prospecto ni toca el CRM", async () => {
  const memory = memoryStore([row()]);
  const result = await sweep(null, { store: memory.store });

  const prohibidas = memory.calls.filter((call) => ["insertOutbound", "saveConversation", "upsertLead"].includes(call));
  assert.deepEqual(prohibidas, [], "ni mensaje al prospecto, ni pipeline movido, ni estado entero pisado");
  assert.equal(result.send[0].target, "sergio", "el aviso tiene UN destinatario y no es el prospecto");
});

// ---------------------------------------------------------------------------
// 4. El aviso
// ---------------------------------------------------------------------------

test("el aviso dice quien, de que rubro, cuando fue, y las TRES salidas para que conteste Sergio", async () => {
  const result = await sweep([row()]);
  const texto = result.send[0].text;

  assert.match(texto, /Ana/, "quien");
  assert.match(texto, /comercio/i, "de que rubro");
  assert.match(texto, /Santa Cruz/, "de donde");
  assert.match(texto, /jue 30\/07 15:00/, "que dia fue la demo");
  assert.match(texto, /CERRÓ/);
  assert.match(texto, /NO VINO/);
  assert.match(texto, /PROPUESTA/);
  assert.match(texto, /no moví nada/, "queda claro que el CRM no se toco solo");
});

test("sin datos de calificacion el aviso sale igual, sin inventar rubro", async () => {
  const result = await sweep([row({ display_name: null, qualification: {} })]);
  const aviso = result.send[0];

  assert.equal(aviso.industry, null);
  assert.match(aviso.text, /sin nombre/);
  assert.ok(!/\(\)/.test(aviso.text), "no queda un parentesis vacio donde iban los datos");
});

test("sin scheduledLabel guardado, la fecha se formatea desde el ISO", () => {
  const notice = buildDemoDoneNotice(
    { conversationKey: "sim:1", channel: "sim", scheduledAt: DEMO_AT, qualification: {}, displayName: "Beto" },
    NOW,
    CONFIG,
  );
  assert.match(notice.label, /30\/07 15:00/, "15:00 de La Paz, no 19:00 UTC");
});

// ---------------------------------------------------------------------------
// 5. La duracion sale del config, no del codigo
// ---------------------------------------------------------------------------

test("la duracion de la demo sale de config.demo.duracionMinutos", () => {
  assert.equal(closedAfterHours(CONFIG), (CONFIG.demo.duracionMinutos + GRACIA_MINUTOS) / 60);

  const larga = createBotConfig({ demo: { duracionMinutos: 90 } });
  assert.equal(closedAfterHours(larga), (90 + GRACIA_MINUTOS) / 60);
  assert.equal(endedBefore(NOW, larga), "2026-07-30T19:00:00.000Z", "una demo mas larga corre el corte");
});

test("con la demo mas larga, la misma fila todavia no se cierra", async () => {
  const larga = createBotConfig({ demo: { duracionMinutos: 90 } });
  const result = await sweep([row()], { nowIso: "2026-07-30T20:00:00Z" }, larga);

  assert.equal(result.send.length, 0);
  assert.match(result.skipped[0].reason, /^demo_sin_terminar:/);
});

// ---------------------------------------------------------------------------
// 6. Tolerancia y determinismo
// ---------------------------------------------------------------------------

test("sin base: no tira, devuelve listas vacias y el motivo", async () => {
  const store = createStore({ url: "", key: "" });
  const result = await runPostDemoSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store, aviso: canalListo() });

  assert.equal(result.ok, true);
  assert.equal(result.scanned, 0);
  assert.deepEqual(result.send, []);
  assert.deepEqual(result.notes, ["barrido_sin_resultado"]);
  assert.match(result.warnings.join(" "), /sin credenciales/);
});

test("el barrido devuelve null (base caida): tampoco tira", async () => {
  const result = await sweep([row()], { sweepNull: true });

  assert.equal(result.ok, true);
  assert.deepEqual(result.send, []);
  assert.deepEqual(result.notes, ["barrido_sin_resultado"]);
});

test("--now ausente o invalido: ok=false y nada que avisar", async () => {
  const sinNow = await runPostDemoSweep({ emit: true }, { config: CONFIG, store: memoryStore([row()]).store });
  assert.equal(sinNow.ok, false);
  assert.deepEqual(sinNow.send, []);

  const roto = await runPostDemoSweep({ nowIso: "ayer", emit: true }, { config: CONFIG, store: memoryStore([row()]).store });
  assert.equal(roto.ok, false);
  assert.match(roto.error, /--now invalido/);
});

test("skipReason no mira el reloj del sistema: el mismo estado y el mismo ahora dan lo mismo", () => {
  const state = { botStage: "demo_agendada", scheduledAt: DEMO_AT, humanTookOver: false, optOutAt: null };
  assert.equal(skipReason(state, NOW, CONFIG), null);
  assert.equal(skipReason(state, NOW, CONFIG), null);
  assert.equal(skipReason(null, NOW, CONFIG), "fila_ilegible");
});

// ---------------------------------------------------------------------------
// 7. CLI y salida legible
// ---------------------------------------------------------------------------

test("parseArgs: --emit, --now, --limit (y el limite absurdo cae al default)", () => {
  assert.deepEqual(parseArgs([]), { now: null, emit: false, dryRunExplicito: false, json: false, limit: 50 });
  assert.deepEqual(parseArgs(["--emit", "--now", NOW, "--limit", "10"]), { now: NOW, emit: true, dryRunExplicito: false, json: false, limit: 10 });
  assert.deepEqual(parseArgs([`--now=${NOW}`, "--limit=0"]), { now: NOW, emit: false, dryRunExplicito: false, json: false, limit: 50 });
  assert.equal(parseArgs(["--emit", "--dry-run"]).emit, false, "--dry-run gana si viene despues");
});

test("la salida legible muestra el aviso completo y los descartes", async () => {
  const result = await runPostDemoSweep({ nowIso: NOW, emit: false }, {
    config: CONFIG,
    store: memoryStore([row(), row({ conversation_key: "chatwoot:99", scheduled_at: null })]).store,
  });
  const texto = renderHuman(result);

  assert.match(texto, /cierre post-demo/);
  assert.match(texto, /CERRARIA \(1\)/);
  assert.match(texto, /chatwoot:42/);
  assert.match(texto, /NO SE CIERRA \(1\)/);
  assert.match(texto, /chatwoot:99 — sin_horario/);
});
