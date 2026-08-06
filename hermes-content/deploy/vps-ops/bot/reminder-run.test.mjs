// ONIA — Chatbot propio: pruebas del RECORDATORIO DEL DIA DE LA DEMO (M9).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. LA VENTANA DE META ES EL LIMITE REAL. Se cierra a las 24 h del ULTIMO MENSAJE ENTRANTE;
//      fuera de ella el mensaje de formato libre falla con 131047 y solo salen plantillas (que no
//      existen). Una demo reservada para dentro de 3 dias NO recibe recordatorio: se descarta con
//      `fuera_de_ventana`. Este es el error que ya nos mordio una vez con el follow-up.
//   2. UNO SOLO POR DEMO: dos barridos seguidos mandan UNO. La reserva es la clave unica de
//      bot_messages y va ANTES de emitir; si no reserva, no se manda.
//   3. SIN LINK NO SE MANDA: si la reserva en Cal.com fallo (`calendar_event_id` null) no hay nada
//      que recordar, y una demo ya pasada tampoco se recuerda.
//   4. Tolerancia: sin base, lista vacia y warning. Determinismo: el "ahora" se inyecta.
//
// No hay red real en ninguna prueba: el store y el armador de links se inyectan.

import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG, createBotConfig } from "./config.mjs";
import { createStore } from "./persistence.mjs";
import {
  buildReminder,
  localHour,
  parseArgs,
  reminderMessageKey,
  renderHuman,
  runReminderSweep,
  skipReason,
} from "./reminder-run.mjs";

const CONFIG = createBotConfig({});

// Demo del jueves 30/07 a las 15:00 de La Paz (19:00Z). "Ahora" = 12:00 de La Paz (16:00Z), o sea
// 3 h antes: dentro de las 4 h de `reminder.leadHours` y bien lejos del horario silencioso.
const DEMO_AT = "2026-07-30T19:00:00Z";
const NOW = "2026-07-30T16:00:00Z";
// Ultimo mensaje del prospecto 20 h antes de NOW: la ventana de 24 h de Meta sigue ABIERTA.
const INBOUND_DENTRO = "2026-07-29T20:00:00Z";
// 30 h antes: la ventana ya se cerro. Es el caso "reservo para dentro de 3 dias".
const INBOUND_FUERA = "2026-07-29T10:00:00Z";

const LINK = "https://cal.test/booking/uid-abc";
const linkFake = (uid) => (uid ? `https://cal.test/booking/${uid}` : null);

/** Fila de bot_conversations tal como la devuelve el barrido. */
function row(extra = {}) {
  return {
    conversation_key: "whatsapp:75414930",
    channel: "whatsapp",
    contact_ref: "75414930",
    display_name: "Ana",
    bot_stage: "demo_agendada",
    qualification: { industry: "comercio", teamSize: 5, city: "Santa Cruz" },
    scheduled_at: DEMO_AT,
    calendar_event_id: "uid-abc",
    human_took_over: false,
    opt_out_at: null,
    last_inbound_at: INBOUND_DENTRO,
    raw: { outboundSeq: 3, scheduledLabel: "jue 30/07 15:00" },
    ...extra,
  };
}

/**
 * Store de mentira con memoria. La clave unica de bot_messages es de VERDAD (un Set), asi que
 * sirve para probar el doble envio sin red: es el mismo mecanismo que la reserva real.
 */
function memoryStore(rows, options = {}) {
  const calls = [];
  const outbound = [];
  const keys = new Set();
  return {
    calls,
    outbound,
    keys,
    store: {
      enabled: true,
      warnings: [],
      async sweepDemoReminders() {
        calls.push("sweep");
        if (options.sweepNull) return null;
        // El barrido real filtra en SQL; aca se devuelve lo que se le pide, incluso filas que NO
        // corresponden, para probar el re-chequeo en memoria.
        return (rows || []).map((item) => ({ ...item }));
      },
      async insertOutbound(messages) {
        calls.push("insertOutbound");
        if (options.insertNull) return null;
        const nuevos = (messages || []).filter((message) => !keys.has(message.messageKey));
        for (const message of nuevos) keys.add(message.messageKey);
        outbound.push(...nuevos);
        return nuevos.length;
      },
      async saveConversation() {
        calls.push("saveConversation");
        return {};
      },
    },
  };
}

const sweep = (rows, options = {}, config = CONFIG) =>
  runReminderSweep({ nowIso: options.nowIso || NOW, emit: options.emit !== false, limit: options.limit }, {
    config,
    store: options.store || memoryStore(rows, options).store,
    meetingLink: linkFake,
  });

// ---------------------------------------------------------------------------
// 1. El filtro que sale a PostgREST
// ---------------------------------------------------------------------------

test("el barrido pide demos agendadas que empiezan dentro de las proximas 4 h, ordenadas y con limite", async () => {
  const requests = [];
  const store = createStore({
    url: "https://sb.test",
    key: "service-role-fake",
    fetch: async (url) => {
      requests.push(String(url));
      return { ok: true, status: 200, text: async () => "[]" };
    },
  });

  await runReminderSweep({ nowIso: NOW, emit: true, limit: 20 }, { config: CONFIG, store });
  const url = requests[0];

  assert.match(url, /bot_stage=eq\.demo_agendada/, "1) la demo esta reservada");
  assert.match(url, /human_took_over=is\.false/, "2) ningun humano tomo la conversacion");
  assert.match(url, /opt_out_at=is\.null/, "3) no pidio la baja");
  assert.match(url, /scheduled_at=gte\.2026-07-30T16:00:00\.000Z/, "4) la demo no empezo todavia");
  assert.match(url, /scheduled_at=lte\.2026-07-30T20:00:00\.000Z/, "y empieza dentro de las 4 h de antelacion");
  assert.match(url, /order=scheduled_at\.asc/);
  assert.match(url, /limit=20/);
  // A PROPOSITO: la ventana de Meta NO se filtra en SQL. Si se filtrara, la demo que no se puede
  // avisar desapareceria del listado en vez de salir con `fuera_de_ventana` — y es justo la que
  // Sergio tiene que atender a mano.
  assert.ok(!/last_inbound_at/.test(url), "la ventana de Meta se chequea en memoria, no en SQL");
});

// ---------------------------------------------------------------------------
// 2. Dentro de la ventana: SI se manda
// ---------------------------------------------------------------------------

test("demo en 3 h y el prospecto escribio hace 20 h: sale el recordatorio con el link", async () => {
  const fake = memoryStore([row()]);
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.equal(result.scanned, 1);
  assert.equal(result.send.length, 1);
  assert.deepEqual(result.skipped, []);

  const item = result.send[0];
  assert.equal(item.conversationKey, "whatsapp:75414930");
  assert.equal(item.templateKey, "M9_RECORDATORIO");
  assert.equal(item.replySource, "script", "texto fijo: no pasa por el LLM");
  assert.equal(item.hoursUntil, 3);
  assert.equal(item.link, LINK);
  assert.equal(item.reserved, true);
  assert.match(item.text, /jue 30\/07 15:00/, "dice cuando es");
  assert.match(item.text, /https:\/\/cal\.test\/booking\/uid-abc/, "y como entrar");
  assert.match(item.text, /\bOnia\b/);
  assert.ok(!item.text.includes("{{"), "todas las variables renderizadas");
  assert.ok(!/\d+\s*(bs|bolivianos|\$)/i.test(item.text), "el recordatorio no cotiza");
});

test("sin scheduledLabel guardado, la etiqueta se arma del scheduled_at (no se manda un hueco)", async () => {
  const result = await sweep([row({ raw: { outboundSeq: 3 } })]);
  assert.equal(result.send.length, 1);
  assert.match(result.send[0].text, /15:00/, "la hora sale del ISO, en hora de Bolivia");
  assert.ok(!result.send[0].text.includes("**.**"));
});

// ---------------------------------------------------------------------------
// 3. Fuera de la ventana de Meta: NO se manda (y no se intenta)
// ---------------------------------------------------------------------------

test("si el prospecto no escribe hace 30 h la ventana de Meta esta cerrada: no se manda ni se intenta", async () => {
  const fake = memoryStore([row({ last_inbound_at: INBOUND_FUERA })]);
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.deepEqual(result.send, []);
  assert.equal(result.skipped.length, 1);
  assert.match(result.skipped[0].reason, /^fuera_de_ventana:30\.0h$/);
  assert.deepEqual(fake.calls, ["sweep"], "no se reserva ni se escribe: fuera de la ventana falla con 131047");
});

test("el borde de la ventana: a las 23,9 h todavia sale, a las 24 h ya no", async () => {
  const casi = new Date(Date.parse(NOW) - 23.9 * 3600000).toISOString();
  const justo = new Date(Date.parse(NOW) - 24 * 3600000).toISOString();

  const dentro = await sweep([row({ last_inbound_at: casi })]);
  assert.equal(dentro.send.length, 1);

  const fuera = await sweep([row({ last_inbound_at: justo })]);
  assert.deepEqual(fuera.send, []);
  assert.match(fuera.skipped[0].reason, /^fuera_de_ventana/);
});

test("sin last_inbound_at no se puede saber si la ventana esta abierta: no se manda", async () => {
  const result = await sweep([row({ last_inbound_at: null })]);
  assert.deepEqual(result.send, []);
  assert.equal(result.skipped[0].reason, "sin_last_inbound_at");
});

// ---------------------------------------------------------------------------
// 4. Uno solo por demo
// ---------------------------------------------------------------------------

test("dos barridos seguidos mandan UNO solo: la clave unica de bot_messages se queda con la reserva", async () => {
  const fake = memoryStore([row()]);
  const deps = { config: CONFIG, store: fake.store, meetingLink: linkFake };

  const primero = await runReminderSweep({ nowIso: NOW, emit: true }, deps);
  const segundo = await runReminderSweep({ nowIso: NOW, emit: true }, deps);

  assert.equal(primero.send.length, 1);
  assert.equal(primero.send[0].reserved, true);
  assert.deepEqual(segundo.send, [], "el segundo barrido no manda nada");
  assert.deepEqual(segundo.skipped, [{ conversationKey: "whatsapp:75414930", reason: "ya_recordado" }]);
  assert.equal(fake.outbound.length, 1, "una sola fila en bot_messages");
});

test("un barrido una hora despues tampoco repite: la clave lleva el inicio de la demo, no la hora del barrido", async () => {
  const fake = memoryStore([row()]);
  const deps = { config: CONFIG, store: fake.store, meetingLink: linkFake };

  await runReminderSweep({ nowIso: NOW, emit: true }, deps);
  const luego = await runReminderSweep({ nowIso: "2026-07-30T17:00:00Z", emit: true }, deps);

  assert.deepEqual(luego.send, []);
  assert.equal(luego.skipped[0].reason, "ya_recordado");
  assert.equal(fake.outbound.length, 1);
});

test("si la demo se reprograma, la clave cambia y SI corresponde recordarla de nuevo", () => {
  assert.equal(reminderMessageKey("whatsapp:1", DEMO_AT), `recordatorio:whatsapp:1:${DEMO_AT}`);
  assert.notEqual(reminderMessageKey("whatsapp:1", DEMO_AT), reminderMessageKey("whatsapp:1", "2026-07-31T19:00:00Z"));
});

test("si la reserva falla (base caida) NO se manda: sin reserva confirmada no se envia", async () => {
  const fake = memoryStore([row()], { insertNull: true });
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.deepEqual(result.send, []);
  assert.deepEqual(result.skipped, [{ conversationKey: "whatsapp:75414930", reason: "reserva_fallida" }]);
});

test("el recordatorio NO reescribe la conversacion entera (no puede pisar un human_took_over nuevo)", async () => {
  const fake = memoryStore([row()]);
  await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });
  assert.deepEqual(fake.calls, ["sweep", "insertOutbound"]);
});

test("la fila de bot_messages queda con clave determinista y sin mover el estado", async () => {
  const fake = memoryStore([row()]);
  await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  const escrita = fake.outbound[0];
  assert.equal(escrita.messageKey, `recordatorio:whatsapp:75414930:${DEMO_AT}`);
  assert.equal(escrita.direction, "outbound");
  assert.equal(escrita.templateKey, "M9_RECORDATORIO");
  assert.equal(escrita.stageBefore, "demo_agendada");
  assert.equal(escrita.stageAfter, "demo_agendada", "un recordatorio no avanza el embudo");
  assert.equal(escrita.deliveryStatus, "skipped", "dryRun por defecto: se registra, no se manda");
});

// ---------------------------------------------------------------------------
// 5. Sin link / demo pasada / todavia lejos
// ---------------------------------------------------------------------------

test("sin calendar_event_id no hay link: no se manda un recordatorio a medias", async () => {
  const fake = memoryStore([row({ calendar_event_id: null })]);
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.deepEqual(result.send, []);
  assert.deepEqual(result.skipped, [{ conversationKey: "whatsapp:75414930", reason: "sin_link" }]);
  assert.deepEqual(fake.calls, ["sweep"], "ni se escribe la bitacora");
});

test("si el armador de links no devuelve nada tampoco se manda (nunca se inventa un link)", async () => {
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, {
    config: CONFIG,
    store: memoryStore([row()]).store,
    meetingLink: () => null,
  });
  assert.deepEqual(result.send, []);
  assert.equal(result.skipped[0].reason, "sin_link");
});

test("una demo que ya empezo no se recuerda", async () => {
  const result = await sweep([row()], { nowIso: "2026-07-30T19:30:00Z" });
  assert.deepEqual(result.send, []);
  assert.match(result.skipped[0].reason, /^demo_ya_paso:0\.5h$/);
});

test("una demo de la semana que viene todavia no se recuerda", async () => {
  const result = await sweep([row({ scheduled_at: "2026-08-03T19:00:00Z" })]);
  assert.deepEqual(result.send, []);
  assert.match(result.skipped[0].reason, /^todavia_lejos/);
});

test("sin scheduled_at no hay demo que recordar", async () => {
  const result = await sweep([row({ scheduled_at: null })]);
  assert.deepEqual(result.send, []);
  assert.equal(result.skipped[0].reason, "sin_horario");
});

// ---------------------------------------------------------------------------
// 6. Re-chequeo en memoria de las condiciones del barrido
// ---------------------------------------------------------------------------

test("aunque la base devuelva la fila, NO se manda si un humano tomo, si pidio la baja o si el estado no aplica", async () => {
  const casos = [
    { patch: { human_took_over: true }, reason: "humano_a_cargo" },
    { patch: { opt_out_at: INBOUND_DENTRO }, reason: "opt_out" },
    { patch: { bot_stage: "handoff_humano" }, reason: "estado_no_aplica:handoff_humano" },
    { patch: { bot_stage: "esperando_horario" }, reason: "estado_no_aplica:esperando_horario" },
  ];

  for (const caso of casos) {
    const fake = memoryStore([row(caso.patch)]);
    const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

    assert.deepEqual(result.send, [], `${caso.reason}: no se manda nada`);
    assert.deepEqual(result.skipped, [{ conversationKey: "whatsapp:75414930", reason: caso.reason }]);
    assert.deepEqual(fake.calls, ["sweep"], `${caso.reason}: ni se escribe`);
  }
});

test("una demo entre varias no frena a las demas", async () => {
  const fake = memoryStore([
    row({ conversation_key: "whatsapp:1", contact_ref: "1", last_inbound_at: INBOUND_FUERA }),
    row({ conversation_key: "whatsapp:2", contact_ref: "2" }),
  ]);
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].conversationKey, "whatsapp:2");
  assert.match(result.skipped[0].reason, /^fuera_de_ventana/);
});

// ---------------------------------------------------------------------------
// 7. Horario silencioso: transitorio, no pierde el recordatorio
// ---------------------------------------------------------------------------

test("una demo temprano no dispara un WhatsApp a las 5 de la mañana, pero SI sale a las 8", async () => {
  const demoTemprano = "2026-07-30T13:00:00Z"; // 09:00 de La Paz
  const fila = row({ scheduled_at: demoTemprano, raw: { scheduledLabel: "jue 30/07 09:00" } });

  const dormido = await sweep([fila], { nowIso: "2026-07-30T09:30:00Z" }); // 05:30 de La Paz
  assert.deepEqual(dormido.send, []);
  assert.match(dormido.skipped[0].reason, /^horario_silencioso:5h$/);

  const despierto = await sweep([fila], { nowIso: "2026-07-30T12:00:00Z" }); // 08:00 de La Paz
  assert.equal(despierto.send.length, 1, "la fila sigue elegible: el recordatorio no se pierde");
  assert.equal(despierto.send[0].hoursUntil, 1);
});

test("localHour lee la hora de Bolivia del ISO inyectado (nunca el reloj de la maquina)", () => {
  assert.equal(localHour("2026-07-30T16:00:00Z", CONFIG), 12);
  assert.equal(localHour("2026-07-30T02:00:00Z", CONFIG), 22, "UTC-4 sin horario de verano");
  assert.equal(localHour("no-es-fecha", CONFIG), null);
});

// ---------------------------------------------------------------------------
// 8. Dry-run, tolerancia y determinismo
// ---------------------------------------------------------------------------

test("dry-run por defecto: dice a quien le mandaria, pero no reserva ni escribe", async () => {
  const fake = memoryStore([row()]);
  const result = await runReminderSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.equal(result.mode, "dry-run");
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].reserved, false);
  assert.equal(result.send[0].deliveryStatus, "preview");
  assert.deepEqual(fake.calls, ["sweep"], "no toca la base");
  assert.equal(fake.keys.size, 0, "la reserva sigue libre: se puede mandar de verdad despues");
});

test("sin base: lista vacia y el motivo en warnings (no tira, no inventa demos)", async () => {
  const store = createStore({ url: "", key: "" });
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store });

  assert.equal(result.ok, true);
  assert.equal(result.scanned, 0);
  assert.deepEqual(result.send, []);
  assert.ok(result.notes.includes("barrido_sin_resultado"));
  assert.ok(result.warnings.some((warning) => warning.includes("sin credenciales")));
});

test("con la base caida (5xx) tampoco se manda nada y queda el rastro", async () => {
  const store = createStore({
    url: "https://sb.test",
    key: "k",
    fetch: async () => ({ ok: false, status: 503, text: async () => "upstream caido" }),
  });
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store });

  assert.deepEqual(result.send, []);
  assert.ok(result.warnings.some((warning) => warning.includes("HTTP 503")));
});

test("sin --now valido no se barre nada (el 'ahora' es obligatorio y explicito)", async () => {
  for (const nowIso of [undefined, null, "", "manana"]) {
    const fake = memoryStore([row()]);
    const result = await runReminderSweep({ nowIso, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });
    assert.equal(result.ok, false);
    assert.match(result.error, /--now invalido/);
    assert.deepEqual(fake.calls, [], "ni siquiera consulta la base");
  }
});

test("determinista: el mismo --now sobre el mismo estado da exactamente la misma salida", async () => {
  const uno = await sweep([row()], { emit: false });
  const dos = await sweep([row()], { emit: false });
  assert.deepEqual(uno, dos);
});

test("el canal 'sim' registra 'simulated'; con dryRun apagado, 'sent'", async () => {
  const enVivo = createBotConfig({ dryRun: false });

  const sim = memoryStore([row({ conversation_key: "sim:x", channel: "sim", contact_ref: "x" })]);
  await runReminderSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: sim.store, meetingLink: linkFake });
  assert.equal(sim.outbound[0].deliveryStatus, "simulated");

  const real = memoryStore([row()]);
  await runReminderSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: real.store, meetingLink: linkFake });
  assert.equal(real.outbound[0].deliveryStatus, "sent");
});

// ---------------------------------------------------------------------------
// 9. CLI y helpers
// ---------------------------------------------------------------------------

test("parseArgs: dry-run por defecto, y acepta las dos formas de cada flag", () => {
  assert.deepEqual(parseArgs([]), { now: null, emit: false, json: false, limit: 50 });
  assert.equal(parseArgs(["--emit"]).emit, true);
  assert.equal(parseArgs(["--emit", "--dry-run"]).emit, false);
  assert.equal(parseArgs(["--now", NOW]).now, NOW);
  assert.equal(parseArgs([`--now=${NOW}`]).now, NOW);
  assert.equal(parseArgs(["--limit", "10"]).limit, 10);
  assert.equal(parseArgs(["--limit=10"]).limit, 10);
  assert.equal(parseArgs(["--limit", "cero"]).limit, 50, "un limite invalido cae al default");
  assert.equal(parseArgs(["--json"]).json, true);
});

test("skipReason nombra el motivo exacto (es lo que Sergio lee en el dry-run)", () => {
  const vivo = {
    humanTookOver: false,
    optOutAt: null,
    botStage: "demo_agendada",
    scheduledAt: DEMO_AT,
    calendarEventId: "uid-abc",
    lastInboundAt: INBOUND_DENTRO,
  };
  assert.equal(skipReason(null, NOW, CONFIG), "fila_ilegible");
  assert.equal(skipReason(vivo, NOW, CONFIG), null);
  assert.equal(skipReason({ ...vivo, humanTookOver: true }, NOW, CONFIG), "humano_a_cargo");
  assert.equal(skipReason({ ...vivo, optOutAt: NOW }, NOW, CONFIG), "opt_out");
  assert.equal(skipReason({ ...vivo, scheduledAt: "no-es-fecha" }, NOW, CONFIG), "fecha_invalida");
  assert.equal(skipReason({ ...vivo, calendarEventId: null }, NOW, CONFIG), "sin_link");
  assert.match(skipReason({ ...vivo, lastInboundAt: INBOUND_FUERA }, NOW, CONFIG), /^fuera_de_ventana/);
});

test("buildReminder arma el texto del guion, sin tocar red ni estado", () => {
  const built = buildReminder(
    { scheduledAt: DEMO_AT, scheduledLabel: "jue 30/07 15:00", channel: "whatsapp" },
    LINK,
    CONFIG,
  );
  assert.equal(built.templateKey, "M9_RECORDATORIO");
  assert.equal(built.replySource, "script");
  assert.ok(built.text.includes(LINK));
  assert.ok(built.text.includes("jue 30/07 15:00"));
});

test("el guion NO promete el recordatorio: M2 ya no dice que el link llega el dia de la demo", () => {
  // La ventana de Meta hace que a veces NO se pueda mandar. Prometerlo en M2 era prometer algo que
  // a veces no pasa; el link se manda en el momento de reservar (M2_LINK).
  assert.ok(!/te llega el link/i.test(DEFAULT_CONFIG.script.M2));
  assert.match(DEFAULT_CONFIG.script.M2_LINK, /\{\{link_reunion\}\}/);
});

test("renderHuman muestra a quien se le manda, a quien no y por que", async () => {
  const fake = memoryStore([
    row(),
    row({ conversation_key: "whatsapp:9", contact_ref: "9", last_inbound_at: INBOUND_FUERA }),
  ]);
  const result = await runReminderSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: fake.store, meetingLink: linkFake });
  const text = renderHuman(result);

  assert.match(text, /modo dry-run/);
  assert.match(text, /demos en la franja: 2/);
  assert.match(text, /MANDARIA \(1\)/);
  assert.match(text, /whatsapp:75414930 \[whatsapp\] Ana — demo jue 30\/07 15:00, en 3 h/);
  assert.match(text, /NO SE MANDA \(1\)/);
  assert.match(text, /whatsapp:9 — fuera_de_ventana/);
});
