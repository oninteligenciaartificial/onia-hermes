// ONIA — Chatbot propio: tests de la RESERVA en Cal.com.
//
// Cero red: el `fetch` se inyecta siempre. Lo que se prueba de verdad es que el bot NUNCA
// afirme "agendado" cuando el calendario no lo confirmo, y que distinga el horario tomado
// (hay que ofrecer el otro) de un error de red (no hay que mentir tampoco, pero es otra cosa).

import test from "node:test";
import assert from "node:assert/strict";

import {
  botAttendeeEmail,
  buildBookingNotes,
  buildBookingPayload,
  createBooking,
  getBookingConfig,
  meetingLink,
  DEFAULT_DURATION_MINUTES,
  DEFAULT_PUBLIC_URL,
  BOOKING_TIMEOUT_MS,
} from "./calcom-booking.mjs";

const CONFIG = { baseUrl: "http://calcom:3000", eventTypeId: 5, durationMinutes: 45, timeZone: "America/La_Paz" };
const START = "2026-08-03T18:00:00.000Z";

function fetchMock(responses) {
  const llamadas = [];
  const fn = async (url, init) => {
    llamadas.push({ url, body: init?.body ? JSON.parse(init.body) : null });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  fn.llamadas = llamadas;
  return fn;
}

const ok = (body) => ({ ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) });
const status = (code, text = "") => ({ ok: false, status: code, json: async () => ({}), text: async () => text });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

test("getBookingConfig: sin CALCOM_BOT_EVENT_TYPE_ID no inventa un id", () => {
  const c = getBookingConfig({ CALCOM_BASE_URL: "http://calcom:3000/" });
  assert.equal(c.eventTypeId, null, "un id inventado reservaria en el evento equivocado");
  assert.equal(c.baseUrl, "http://calcom:3000", "la barra final se saca");
  assert.equal(c.durationMinutes, DEFAULT_DURATION_MINUTES);
  assert.equal(c.timeZone, "America/La_Paz");
});

test("getBookingConfig: descarta valores basura en vez de usarlos", () => {
  const c = getBookingConfig({ CALCOM_BASE_URL: "http://x", CALCOM_BOT_EVENT_TYPE_ID: "no-es-numero", CALCOM_BOT_DURATION_MINUTES: "-5" });
  assert.equal(c.eventTypeId, null);
  assert.equal(c.durationMinutes, DEFAULT_DURATION_MINUTES);
});

// La MISMA duracion que el guion le promete al prospecto es la que se bloquea en el calendario:
// run-turn.mjs le pasa `config.demo.duracionMinutos`. El entorno sigue ganando (es el freno de
// mano del que despliega), pero ya no hace falta que exista para que el numero sea el correcto.
test("getBookingConfig: la duracion sale del conocimiento/config, y el entorno la puede pisar", () => {
  assert.equal(getBookingConfig({}, 30).durationMinutes, 30, "sin env manda lo que dice el guion");
  assert.equal(getBookingConfig({ CALCOM_BOT_DURATION_MINUTES: "20" }, 30).durationMinutes, 20, "el env pisa");
  assert.equal(getBookingConfig({}, 0).durationMinutes, DEFAULT_DURATION_MINUTES, "un fallback basura no reserva 0 minutos");
});

// ---------------------------------------------------------------------------
// Link de la reunion — lo que se le manda al prospecto
// ---------------------------------------------------------------------------

test("meetingLink: sin uid no hay link (no se inventa uno)", () => {
  assert.equal(meetingLink(null), null);
  assert.equal(meetingLink("  "), null);
});

test("meetingLink: NUNCA usa la URL interna de docker, aunque sea la que reserva", () => {
  // Este es el punto: CALCOM_BASE_URL vale `http://calcom:3000` en el VPS y sirve para reservar
  // desde el contenedor, pero mandarsela al prospecto seria darle un link que no abre nunca.
  const link = meetingLink("uid-abc", { CALCOM_BASE_URL: "http://calcom:3000" });
  assert.equal(link, `${DEFAULT_PUBLIC_URL}/booking/uid-abc`);
  assert.ok(!link.includes("calcom:3000"));
});

test("meetingLink: CALCOM_PUBLIC_URL manda, sin barra final duplicada", () => {
  assert.equal(meetingLink("uid-abc", { CALCOM_PUBLIC_URL: "https://cal.test/" }), "https://cal.test/booking/uid-abc");
});

test("createBooking: la duracion del turno viaja al payload sin pasar por el entorno", async () => {
  const f = fetchMock([ok({ uid: "abc" })]);
  await createBooking({ config: undefined, durationMinutes: 30, startAt: START }, {
    fetch: f,
    env: { CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" },
  });
  const { start, end } = f.llamadas[0].body;
  assert.equal((Date.parse(end) - Date.parse(start)) / 60000, 30);
});

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

test("buildBookingPayload: el fin se calcula desde la duracion", () => {
  const p = buildBookingPayload({ eventTypeId: 5, startAt: START, durationMinutes: 45, name: "Ana", email: "a@b.co" });
  assert.equal(p.start, "2026-08-03T18:00:00.000Z");
  assert.equal(p.end, "2026-08-03T18:45:00.000Z");
  assert.equal(p.responses.name, "Ana");
  assert.equal(p.language, "es");
});

test("buildBookingPayload: fecha invalida devuelve null (no un payload roto)", () => {
  assert.equal(buildBookingPayload({ eventTypeId: 5, startAt: "mañana a la tarde" }), null);
  assert.equal(buildBookingPayload({ eventTypeId: 5, startAt: null }), null);
});

test("botAttendeeEmail: correo propio y trazable, nunca uno con pinta de real", () => {
  const mail = botAttendeeEmail("chatwoot:990010");
  assert.equal(mail, "bot+chatwoot-990010@onia.com.bo");
  assert.ok(mail.startsWith("bot+"), "tiene que verse que es del bot");
});

test("buildBookingNotes: solo pone lo que el bot capturo de verdad", () => {
  const completo = buildBookingNotes({ industry: "ferreteria", teamSize: 4, city: "Santa Cruz" });
  assert.match(completo, /rubro: ferreteria/);
  assert.match(completo, /personas: 4/);
  assert.match(completo, /ciudad: Santa Cruz/);
  assert.ok(!/sillones/.test(completo), "un no-dental no puede llevar sillones en la reserva");

  // `chairs` es dato de RAMA: suma cuando esta, no se nombra cuando no.
  const dental = buildBookingNotes({ industry: "dental", teamSize: 3, city: "La Paz", chairs: 2 });
  assert.match(dental, /sillones: 2/);

  const vacio = buildBookingNotes({});
  assert.ok(!/rubro/.test(vacio), "sin dato no se inventa el campo");
  assert.match(vacio, /asistente automatico/);

  // 0 es un dato REAL, no un vacio: no se puede perder por un chequeo de verdad/falsedad.
  assert.match(buildBookingNotes({ chairs: 0 }), /sillones: 0/);
  assert.match(buildBookingNotes({ teamSize: 0 }), /personas: 0/);
});

// ---------------------------------------------------------------------------
// createBooking
// ---------------------------------------------------------------------------

test("SIN CONFIG: no llama a nadie y avisa", async () => {
  const f = fetchMock([]);
  const r = await createBooking({ config: { baseUrl: "", eventTypeId: null }, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "sin_config");
  assert.equal(f.llamadas.length, 0, "sin config no se gasta una llamada");
});

test("CAMINO FELIZ: devuelve el uid de la reserva", async () => {
  const f = fetchMock([ok({ uid: "jMAiNFvpHfcVMf2pZ8rAhp", startTime: START })]);
  const r = await createBooking({ config: CONFIG, startAt: START, name: "Ana", conversationKey: "chatwoot:1" }, { fetch: f });
  assert.equal(r.ok, true);
  assert.equal(r.uid, "jMAiNFvpHfcVMf2pZ8rAhp");
  assert.equal(f.llamadas[0].url, "http://calcom:3000/api/book/event");
  assert.equal(f.llamadas[0].body.eventTypeId, 5);
  assert.equal(f.llamadas[0].body.responses.email, "bot+chatwoot-1@onia.com.bo");
});

test("409: horario_tomado, distinto de un error — el bot tiene que ofrecer el otro", async () => {
  const f = fetchMock([status(409, '{"message":"no_available_users_found_error"}')]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "horario_tomado", "si se confunde con 'error' el bot repite 'listo, agendado' sobre un horario ocupado");
});

test("500 de Cal.com: error, y NO se reporta como reservado", async () => {
  const f = fetchMock([status(500, "boom")]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "error");
});

test("CAL.COM CAIDO: no tira, devuelve error (el prospecto igual tiene que ser atendido)", async () => {
  const f = fetchMock([new Error("ECONNREFUSED")]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "error");
  assert.match(r.warnings[0], /ECONNREFUSED/);
});

test("RESERVA SIN uid: se acepta pero queda avisado (no se puede cancelar despues sin uid)", async () => {
  const f = fetchMock([ok({ startTime: START })]);
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, true);
  assert.equal(r.uid, null);
  assert.match(r.warnings.join(" "), /uid/);
});

test("FECHA INVALIDA: se corta antes de llamar a Cal.com", async () => {
  const f = fetchMock([]);
  const r = await createBooking({ config: CONFIG, startAt: "cuando puedas" }, { fetch: f });
  assert.equal(r.reason, "inicio_invalido");
  assert.equal(f.llamadas.length, 0);
});

// ---------------------------------------------------------------------------
// TIMEOUT — el turno del prospecto no se cuelga esperando al calendario.
//
// POR QUE EXISTE, medido el 2026-09-13 en produccion. El proceso vivo del bot declara
// `CALCOM_BASE_URL=http://calcom:3000` (leido de /proc/<pid>/environ dentro de `onia-center`)
// y en el VPS **no hay ningun contenedor `calcom`** — `docker ps | grep -i cal` da vacio.
// O sea que la rama que corre NO es `sin_config` (que se deriva del entorno sin tocar la red):
// es la que SI sale a la red, contra un host que no resuelve. Medido desde el contenedor:
// `wget -qO- --timeout=8 http://calcom:3000/api/book/event` -> `bad address` en **5,00 s**.
//
// Esos 5 s los espera el PROSPECTO, en el turno mas caro que tiene el bot: el que acaba de
// elegir su horario de demo. Y 5 s es el piso, no el techo — lo puso el resolvedor de DNS,
// que es quien corto. Un host que resolviera y no contestara (el caso del dia que alguien
// levante Cal.com a medias) se queda esperando SIN LIMITE, porque `createBooking` no tenia
// reloj propio: pasaba `signal: deps.signal` y ningun llamador de produccion le pasa uno.
//
// Su HERMANO ya sabia esto: `aviso-telegram.mjs` manda en el mismo turno y tiene
// `AVISO_TIMEOUT_MS = 5000` con su `AbortController`. Dos llamadas de red en el mismo turno,
// una con reloj y la otra sin: la asimetria era el defecto.
// ---------------------------------------------------------------------------

test("TIMEOUT: la reserva corta sola y el prospecto no espera para siempre", async () => {
  // Un Cal.com que resuelve y no contesta nunca: sin reloj propio, esto no termina jamas.
  const f = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const e = new Error("The operation was aborted");
        e.name = "AbortError";
        reject(e);
      });
    });

  // ⚠️ El `race` NO es decorativo, y esta escrito asi porque la primera version de este gate
  // NO cazaba el defecto que existe para cazar. Validado por mutacion el 2026-09-13: al
  // devolverle a `createBooking` su `signal: deps.signal` original —el defecto exacto de
  // produccion— este caso no se ponia rojo, se COLGABA, y `node --test` lo reportaba como
  // "pass 18 / fail 0" en vez de "fail 1". Un test que se cuelga ante el bug se lee igual que
  // uno que pasa: la ausencia de FAIL no es verde. El reloj del test lo vuelve ruidoso.
  const arranque = Date.now();
  const r = await Promise.race([
    createBooking({ config: CONFIG, startAt: START }, { fetch: f, timeoutMs: 40 }),
    new Promise((_r, reject) =>
      setTimeout(
        () => reject(new Error("createBooking no volvio en 3 s: la reserva NO tiene reloj propio")),
        3000,
      ),
    ),
  ]);
  const tardo = Date.now() - arranque;

  assert.equal(r.ok, false);
  assert.equal(r.reason, "error");
  assert.match(r.warnings.join(" "), /timeout/i, "el motivo tiene que NOMBRAR al timeout: un 'error' generico manda a diagnosticar la red del prospecto");
  assert.ok(tardo < 2000, `la reserva tardo ${tardo}ms: corto sola, no se colgo`);
});

test("TIMEOUT: hay un tope por defecto — no depende de que el llamador se acuerde", async () => {
  // El defecto real de produccion es justamente que NINGUN llamador pasa `signal` ni `timeoutMs`.
  // Un tope que solo existe si te acordas de pedirlo no protege el turno de nadie.
  assert.ok(Number(BOOKING_TIMEOUT_MS) > 0, "tiene que haber un tope por defecto");
  assert.ok(Number(BOOKING_TIMEOUT_MS) <= 10000, "un tope mas largo que 10 s ya es una conversacion muerta");

  const f = async (_url, init) => {
    assert.ok(init?.signal, "el fetch tiene que recibir un signal aunque el llamador no pase ninguno");
    return ok({ uid: "abc", startTime: START });
  };
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f });
  assert.equal(r.ok, true);
});

// El reloj se SUMA al signal del llamador, no lo reemplaza: si algun dia un llamador quiere
// cancelar la reserva antes (porque el prospecto escribio otra cosa), tiene que poder.
test("TIMEOUT: el llamador que aborta DURANTE el fetch corta la reserva igual", async () => {
  const propio = new AbortController();
  const f = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const e = new Error("The operation was aborted");
        e.name = "AbortError";
        reject(e);
      });
      // El prospecto se arrepiente mientras Cal.com piensa.
      setTimeout(() => propio.abort(), 10);
    });

  const r = await createBooking(
    { config: CONFIG, startAt: START },
    { fetch: f, signal: propio.signal, timeoutMs: 30000 },
  );
  assert.equal(r.ok, false, "abortar desde el llamador tiene que cortar la reserva");
  assert.equal(r.reason, "error");
});

test("TIMEOUT: un signal que YA venia abortado no dispara la reserva a ciegas", async () => {
  const propio = new AbortController();
  propio.abort();
  let salioALaRed = false;
  const f = async (_url, init) => {
    salioALaRed = true;
    assert.ok(init?.signal?.aborted, "si el llamador ya cancelo, el signal tiene que llegar abortado");
    const e = new Error("The operation was aborted");
    e.name = "AbortError";
    throw e;
  };
  const r = await createBooking({ config: CONFIG, startAt: START }, { fetch: f, signal: propio.signal });
  assert.equal(r.ok, false);
  assert.ok(salioALaRed === false || r.reason === "error");
});
