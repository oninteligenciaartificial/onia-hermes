// ONIA — Chatbot propio: pruebas del RECORDATORIO DEL DIA DE LA DEMO (M9).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. LA VENTANA DE META ELIGE EL CARRIL. Se cierra a las 24 h del ULTIMO MENSAJE ENTRANTE.
//      Dentro: texto libre M9 (gratis). Fuera: la plantilla aprobada `recordatorio_demo` — que es
//      el caso NORMAL aca (quien reserva para dentro de 3 dias). Antes se descartaba con
//      `fuera_de_ventana` y no le llegaba nada, porque no habia plantilla aprobada.
//   2. UNO SOLO POR DEMO: dos barridos seguidos mandan UNO. La reserva es la clave unica de
//      bot_messages y va ANTES de emitir; si no reserva, no se manda.
//   3. SIN LINK NO SE MANDA: si la reserva en Cal.com fallo (`calendar_event_id` null) no hay nada
//      que recordar, y una demo ya pasada tampoco se recuerda.
//   2b. EL DESENLACE QUEDA EN LA FILA: se reserva como `reserved` (antes de mandar) y despues la
//      MISMA fila dice `sent` o `failed`. Importa por PLATA: el medidor cuenta `reserved` como
//      cobrable, asi que un envio fallido que se quedara ahi facturaria un mensaje que no salio.
//   4. Tolerancia: sin base, lista vacia y warning. Determinismo: el "ahora" se inyecta.
//
// No hay red real en ninguna prueba: el store y el armador de links se inyectan.

import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG, createBotConfig } from "./config.mjs";
import { buildMessageRow, createStore } from "./persistence.mjs";
// Se importa el MEDIDOR a proposito: el bug no era del recordatorio solo, era de la union — lo que
// se guarda aca es lo que se le factura al cliente alla.
import { esCobrable } from "./usage-run.mjs";
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
      // El PATCH del desenlace: mismo contrato que el real (true / false / null) y mismo efecto —
      // muta la fila que ya estaba, sin agregar historia ni tocar la clave.
      async markMessageDelivered(messageKey, deliveryStatus, externalMessageId = null) {
        calls.push("markMessageDelivered");
        if (options.patchNull) return null; // base caida
        const fila = outbound.find((message) => message.messageKey === messageKey);
        if (!fila) return false;
        fila.deliveryStatus = deliveryStatus;
        if (externalMessageId) fila.externalMessageId = externalMessageId;
        return true;
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
// 3. Fuera de la ventana de Meta: sale la PLANTILLA aprobada (antes no salia nada)
// ---------------------------------------------------------------------------

test("si el prospecto no escribe hace 30 h la ventana esta cerrada: sale `recordatorio_demo`, no texto libre", async () => {
  const fake = memoryStore([row({ last_inbound_at: INBOUND_FUERA })]);
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.deepEqual(result.skipped, [], "ya no se descarta: la plantilla si se puede mandar");
  assert.equal(result.send.length, 1);

  const item = result.send[0];
  assert.equal(item.sendKind, "plantilla");
  assert.equal(item.templateName, "recordatorio_demo");
  assert.equal(item.templateKey, "M9_PLANTILLA");
  // La forma exacta que espera Chatwoot: variables POSICIONALES, en `body`, con la clave en texto.
  assert.deepEqual(item.templateParams, {
    name: "recordatorio_demo",
    language: "es",
    processed_params: { body: { 1: "jue 30/07 15:00", 2: LINK } },
  });
  // Y el texto guardado tiene que ser el de la plantilla aprobada, no el M9 de texto libre: es lo
  // que se ve en el panel y lo que queda en la bitacora.
  assert.match(item.text, /Te recuerdo tu demo de Onia: \*jue 30\/07 15:00\*/);
  assert.match(item.text, /Entrás desde acá: https:\/\/cal\.test\/booking\/uid-abc/);
  assert.ok(!item.text.includes("{{"), "ninguna variable sin renderizar");
  assert.equal(fake.outbound[0].templateKey, "M9_PLANTILLA");
});

test("el borde de la ventana: a las 23,9 h texto libre gratis, a las 24 h la plantilla paga", async () => {
  const casi = new Date(Date.parse(NOW) - 23.9 * 3600000).toISOString();
  const justo = new Date(Date.parse(NOW) - 24 * 3600000).toISOString();

  const dentro = await sweep([row({ last_inbound_at: casi })]);
  assert.equal(dentro.send.length, 1);
  assert.equal(dentro.send[0].sendKind, "texto_libre", "dentro de la ventana NO se paga plantilla");
  assert.equal(dentro.send[0].templateKey, "M9_RECORDATORIO");
  assert.equal(dentro.send[0].templateParams, null);

  const fuera = await sweep([row({ last_inbound_at: justo })]);
  assert.equal(fuera.send.length, 1);
  assert.equal(fuera.send[0].sendKind, "plantilla");
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
    row({ conversation_key: "whatsapp:1", contact_ref: "1", calendar_event_id: null }),
    row({ conversation_key: "whatsapp:2", contact_ref: "2" }),
  ]);
  const result = await runReminderSweep({ nowIso: NOW, emit: true }, { config: CONFIG, store: fake.store, meetingLink: linkFake });

  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].conversationKey, "whatsapp:2");
  assert.equal(result.skipped[0].reason, "sin_link");
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

test("se reserva como 'reserved' ANTES de mandar y la MISMA fila termina en 'sent'", async () => {
  const enVivo = createBotConfig({ dryRun: false });

  const sim = memoryStore([row({ conversation_key: "sim:x", channel: "sim", contact_ref: "x" })]);
  await runReminderSweep({ nowIso: NOW, emit: true }, { config: enVivo, store: sim.store, meetingLink: linkFake });
  assert.equal(sim.outbound[0].deliveryStatus, "simulated");
  assert.ok(!sim.calls.includes("markMessageDelivered"), "en sim la fila ya dice la verdad: no se toca");

  // El insert ES la reserva, o sea que se escribe ANTES de mandar: en ese instante NO puede decir
  // "sent" (seria mentira si el envio falla). Se mira desde adentro del envio, que es el unico
  // lugar donde se puede probar el ORDEN — y el orden es la proteccion anti-duplicados.
  const enviados = [];
  const real = memoryStore([row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" })]);
  const salida = await runReminderSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: real.store,
      meetingLink: linkFake,
      chatwoot: {
        enabled: true,
        warnings: [],
        sendMessage: (id, text) => {
          enviados.push({ id, text, estadoAlMandar: real.outbound[0]?.deliveryStatus });
          return { id: 1 };
        },
      },
    },
  );
  assert.equal(enviados[0].estadoAlMandar, "reserved", "cuando sale el mensaje, la reserva ya estaba");
  assert.equal(real.outbound[0].deliveryStatus, "sent", "y despues la fila dice como termino de verdad");
  assert.equal(real.outbound[0].messageKey, `recordatorio:chatwoot:42:${DEMO_AT}`, "la clave NO se toca: sigue dedupeando");
  assert.equal(salida.send[0].deliveryStatus, "sent", "el resultado del barrido dice lo mismo que la fila");
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].id, "42");
  assert.match(enviados[0].text, /\S/);
});

test("un envio REAL nunca queda guardado como 'simulated' (el bug que hacia invisible al recordatorio)", async () => {
  const enVivo = createBotConfig({ dryRun: false });
  const real = memoryStore([row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" })]);
  await runReminderSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: real.store,
      meetingLink: linkFake,
      chatwoot: { enabled: true, warnings: [], sendMessage: () => ({ id: 1 }) },
    },
  );

  const fila = real.outbound[0];
  assert.notEqual(fila.deliveryStatus, "simulated", "un envio de verdad NO es una simulacion");
  assert.equal(fila.deliveryStatus, "sent");

  // Las DOS mitades del bug, juntas: lo que el barrido decide y lo que buildMessageRow manda a la
  // base. La degradacion silenciosa a "simulated" vivia en ese mapeo, no aca.
  const enBase = buildMessageRow({ ...fila, direction: "outbound" }, { conversationKey: "chatwoot:42" });
  assert.equal(enBase.delivery_status, "sent");
  // Y mientras el mensaje vuela, la fila tampoco puede decir "simulated": ese era el bug exacto —
  // `reserved` no estaba en la lista blanca, asi que cada recordatorio utility REAL nacia como
  // simulacion y el medidor no lo veia nunca.
  const reservaEnBase = buildMessageRow(
    { ...fila, deliveryStatus: "reserved", direction: "outbound" },
    { conversationKey: "chatwoot:42" },
  );
  assert.equal(reservaEnBase.delivery_status, "reserved", "se reservo de verdad: no es una simulacion");
  // Y el que paga la cuenta lo ve: el medidor solo cuenta lo que salio.
  assert.equal(esCobrable(enBase), true, "un recordatorio que SI salio se cuenta");
});

test("si el envio FALLA la fila termina en 'failed', no en 'reserved' (o se factura de mas)", async () => {
  const enVivo = createBotConfig({ dryRun: false });

  // Sin token: se reserva igual (para no duplicar) pero el barrido avisa que NO salio.
  const roto = memoryStore([row({ conversation_key: "chatwoot:43", channel: "chatwoot", contact_ref: "43" })]);
  const fallo = await runReminderSweep(
    { nowIso: NOW, emit: true },
    { config: enVivo, store: roto.store, meetingLink: linkFake, chatwoot: { enabled: false, warnings: [], sendMessage: () => null } },
  );
  assert.equal(fallo.send[0].deliveryStatus, "failed");
  assert.match(fallo.warnings.join(" "), /sin token/);

  const fila = roto.outbound[0];
  assert.equal(fila.deliveryStatus, "failed", "lo guardado dice que no salio");
  assert.equal(roto.keys.size, 1, "la reserva sigue tomada: un segundo barrido NO reintenta");
  // ESTE es el punto: `reserved` cuenta como cobrable. Un fallido que se quedara en `reserved` le
  // facturaria al cliente un mensaje que Meta nunca cobro.
  assert.equal(esCobrable({ direction: "outbound", delivery_status: "reserved" }), true, "el techo cuenta lo reservado");
  const enBase = buildMessageRow({ ...fila, direction: "outbound" }, { conversationKey: "chatwoot:43" });
  assert.equal(esCobrable(enBase), false, "un fallido no se le factura a nadie");
});

test("si el PATCH del desenlace falla, el barrido sigue y termina bien (exit 0): solo avisa", async () => {
  const enVivo = createBotConfig({ dryRun: false });
  const fake = memoryStore([row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" })], {
    patchNull: true,
  });
  const result = await runReminderSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: fake.store,
      meetingLink: linkFake,
      chatwoot: { enabled: true, warnings: [], sendMessage: () => ({ id: 1 }) },
    },
  );

  // Nada revienta: si esto tirara, n8n reintentaria el barrido y el prospecto recibiria DOS.
  assert.equal(result.ok, true);
  assert.equal(result.send.length, 1);
  assert.equal(result.send[0].deliveryStatus, "sent", "el envio si salio, y se reporta");
  assert.equal(fake.outbound[0].deliveryStatus, "reserved", "la fila queda en 'reserved': se reservo y no se supo mas");
  assert.match(result.warnings.join(" "), /no se pudo marcar 'sent'/);
});

test("fuera de la ventana, los `template_params` llegan HASTA el cliente de Chatwoot (no se pierden)", async () => {
  const enVivo = createBotConfig({ dryRun: false });
  const enviados = [];
  const fake = memoryStore([
    row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42", last_inbound_at: INBOUND_FUERA }),
  ]);
  const result = await runReminderSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: fake.store,
      meetingLink: linkFake,
      chatwoot: {
        enabled: true,
        warnings: [],
        sendMessage: (id, text, templateParams) => {
          enviados.push({ id, text, templateParams });
          return { id: 1 };
        },
      },
    },
  );

  assert.equal(result.send[0].deliveryStatus, "sent");
  assert.equal(enviados.length, 1);
  assert.deepEqual(enviados[0].templateParams, {
    name: "recordatorio_demo",
    language: "es",
    processed_params: { body: { 1: "jue 30/07 15:00", 2: LINK } },
  });
});

test("dentro de la ventana NO se manda plantilla: el cliente recibe templateParams en null", async () => {
  const enVivo = createBotConfig({ dryRun: false });
  const enviados = [];
  const fake = memoryStore([row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42" })]);
  await runReminderSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: fake.store,
      meetingLink: linkFake,
      chatwoot: {
        enabled: true,
        warnings: [],
        sendMessage: (id, text, templateParams) => {
          enviados.push({ templateParams });
          return { id: 1 };
        },
      },
    },
  );
  assert.equal(enviados[0].templateParams, null, "el texto libre es gratis: no se paga una plantilla al pedo");
});

test("si Meta rechaza la plantilla NO se reintenta: la reserva ya se gasto", async () => {
  const enVivo = createBotConfig({ dryRun: false });
  let intentos = 0;
  const fake = memoryStore([
    row({ conversation_key: "chatwoot:42", channel: "chatwoot", contact_ref: "42", last_inbound_at: INBOUND_FUERA }),
  ]);
  const result = await runReminderSweep(
    { nowIso: NOW, emit: true },
    {
      config: enVivo,
      store: fake.store,
      meetingLink: linkFake,
      chatwoot: {
        enabled: true,
        warnings: ["chatwoot: HTTP 400 plantilla en pacing"],
        sendMessage: () => {
          intentos += 1;
          return null;
        },
      },
    },
  );

  assert.equal(intentos, 1, "un solo intento: dos recordatorios al mismo prospecto es peor que ninguno");
  assert.equal(result.send[0].deliveryStatus, "failed");
  assert.equal(result.send[0].sendKind, "plantilla");
  assert.equal(fake.keys.size, 1, "la reserva quedo tomada: un segundo barrido NO reintenta");
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
  assert.equal(skipReason({ ...vivo, lastInboundAt: null }, NOW, CONFIG), "sin_last_inbound_at");
  // Estar fuera de la ventana YA NO es motivo de descarte: cambia el carril (plantilla), no el si.
  assert.equal(skipReason({ ...vivo, lastInboundAt: INBOUND_FUERA }, NOW, CONFIG), null);
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
    row({ conversation_key: "whatsapp:8", contact_ref: "8", last_inbound_at: INBOUND_FUERA }),
    row({ conversation_key: "whatsapp:9", contact_ref: "9", calendar_event_id: null }),
  ]);
  const result = await runReminderSweep({ nowIso: NOW, emit: false }, { config: CONFIG, store: fake.store, meetingLink: linkFake });
  const text = renderHuman(result);

  assert.match(text, /modo dry-run/);
  assert.match(text, /demos en la franja: 3/);
  assert.match(text, /MANDARIA \(2\)/);
  assert.match(text, /whatsapp:75414930 \[whatsapp\] Ana — demo jue 30\/07 15:00, en 3 h\n/, "el gratis no lleva marca");
  // El que se paga se tiene que VER en la tabla que Sergio lee antes de encender.
  assert.match(text, /whatsapp:8 .* · PLANTILLA recordatorio_demo \(paga\)/);
  assert.match(text, /NO SE MANDA \(1\)/);
  assert.match(text, /whatsapp:9 — sin_link/);
});
