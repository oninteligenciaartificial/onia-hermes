// Casos del BARRIDO DE RESCATE. Ver la cabecera de `rescate-run.mjs` para el porque.
//
// El caso 1 es el bug real, medido el 2026-09-03: el contenedor `onia-center` reinicio a las
// 00:03:32, el proceso del webhook se fue con el, y el mensaje entrante de las 00:03:52 no
// tuvo NUNCA respuesta. El watchdog levanto el webhook a las 00:04:01 — pero Chatwoot ya
// habia disparado su unico webhook contra un puerto muerto. Ese mensaje se perdio para
// siempre. Con gente real del otro lado, eso es un lead que se fue.

import test from "node:test";
import assert from "node:assert/strict";

import {
  seleccionarHuerfanos,
  construirPayloadRescate,
  MIN_EDAD_MS,
  MAX_EDAD_MS,
  runRescateSweep,
} from "./rescate-run.mjs";

const T0 = Date.parse("2026-09-03T00:00:00Z");
const min = (n) => n * 60 * 1000;

/** Fila tal como sale del psql de Chatwoot: una por mensaje, cualquier orden. */
function fila(over = {}) {
  return {
    conversationId: 49,
    messageId: 282,
    messageType: 0, // 0 = entrante, 1 = saliente, 2 = actividad del sistema
    createdAtMs: T0,
    content: "Hola, quiero informacion sobre el sistema",
    inboxId: 4,
    private: false,
    ...over,
  };
}

test("EL BUG: un entrante sin ninguna respuesta despues es huerfano y se rescata", () => {
  const filas = [fila({ messageId: 282, createdAtMs: T0 })];
  const out = seleccionarHuerfanos(filas, { ahoraMs: T0 + min(5) });
  assert.equal(out.length, 1, "el mensaje que quedo sin contestar TIENE que salir");
  assert.equal(out[0].messageId, 282);
});

test("si el bot ya contesto DESPUES, no es huerfano — rescatar seria hablar de mas", () => {
  const filas = [
    fila({ messageId: 282, createdAtMs: T0 }),
    fila({ messageId: 284, messageType: 1, createdAtMs: T0 + 1000, content: "Perfecto, anotado" }),
  ];
  assert.deepEqual(seleccionarHuerfanos(filas, { ahoraMs: T0 + min(5) }), []);
});

test("una respuesta ANTERIOR no cuenta: el ultimo turno sigue sin contestar", () => {
  const filas = [
    fila({ messageId: 279, messageType: 1, createdAtMs: T0 - 2000 }),
    fila({ messageId: 282, createdAtMs: T0 }),
  ];
  const out = seleccionarHuerfanos(filas, { ahoraMs: T0 + min(5) });
  assert.equal(out.length, 1);
  assert.equal(out[0].messageId, 282, "se rescata el entrante posterior a la ultima salida");
});

test("recien llegado NO se toca: el webhook normal puede estar contestandolo ahora mismo", () => {
  const filas = [fila({ createdAtMs: T0 })];
  assert.deepEqual(
    seleccionarHuerfanos(filas, { ahoraMs: T0 + MIN_EDAD_MS - 1000 }),
    [],
    "por debajo de la edad minima el barrido se calla: doble respuesta es peor que tarde",
  );
});

test("viejo de mas NO se rescata: contestar un 'hola' de hace tres dias es peor que callar", () => {
  const filas = [fila({ createdAtMs: T0 })];
  assert.deepEqual(seleccionarHuerfanos(filas, { ahoraMs: T0 + MAX_EDAD_MS + min(1) }), []);
});

test("la nota privada y la actividad del sistema no son turnos de nadie", () => {
  assert.deepEqual(
    seleccionarHuerfanos([fila({ private: true })], { ahoraMs: T0 + min(5) }),
    [],
    "una nota privada del equipo no es un prospecto esperando",
  );
  assert.deepEqual(
    seleccionarHuerfanos([fila({ messageType: 2, content: "Conversation was marked resolved" })], {
      ahoraMs: T0 + min(5),
    }),
    [],
    "message_type=2 es actividad de Chatwoot, no una persona",
  );
});

test("una actividad del sistema DESPUES del entrante no lo tapa: sigue sin contestar", () => {
  const filas = [
    fila({ messageId: 282, createdAtMs: T0 }),
    fila({ messageId: 283, messageType: 2, createdAtMs: T0 + 1000, content: "marked resolved" }),
  ];
  assert.equal(
    seleccionarHuerfanos(filas, { ahoraMs: T0 + min(5) }).length,
    1,
    "resolver la conversacion no es contestarle a la persona",
  );
});

test("cada conversacion se juzga sola: una contestada no salva a la muda", () => {
  const filas = [
    fila({ conversationId: 49, messageId: 282, createdAtMs: T0 }),
    fila({ conversationId: 49, messageId: 284, messageType: 1, createdAtMs: T0 + 1000 }),
    fila({ conversationId: 50, messageId: 290, createdAtMs: T0 }),
  ];
  const out = seleccionarHuerfanos(filas, { ahoraMs: T0 + min(5) });
  assert.equal(out.length, 1);
  assert.equal(out[0].conversationId, 50);
});

test("las filas llegan desordenadas y el resultado no cambia", () => {
  const desordenadas = [
    fila({ messageId: 284, messageType: 1, createdAtMs: T0 + 1000 }),
    fila({ messageId: 282, createdAtMs: T0 }),
  ];
  assert.deepEqual(seleccionarHuerfanos(desordenadas, { ahoraMs: T0 + min(5) }), []);
});

test("el payload de rescate lo entiende el MISMO parser que el webhook de Chatwoot", async () => {
  const { parseChatwootWebhook } = await import("./chatwoot-adapter.mjs");
  const payload = construirPayloadRescate(fila());
  const parsed = parseChatwootWebhook(payload);
  assert.equal(parsed.skip, undefined || parsed.skip, "no debe saltear");
  assert.ok(!parsed.skip, `el parser lo descarto: ${parsed.reason}`);
  assert.equal(
    parsed.turn.message_key,
    "chatwoot:49:282",
    "MISMA clave que el webhook en vivo: es lo unico que evita la doble respuesta",
  );
  assert.equal(parsed.turn.text, "Hola, quiero informacion sobre el sistema");
});

test("el barrido no manda nada en seco, y dice cuantos habria rescatado", async () => {
  const enviados = [];
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: false },
    {
      leerFilas: async () => [fila()],
      postWebhook: async (p) => {
        enviados.push(p);
        return { ok: true };
      },
    },
  );
  assert.equal(enviados.length, 0, "sin --emit no se toca produccion");
  assert.equal(res.huerfanos, 1);
  assert.equal(res.reinyectados, 0);
});

test("con --emit reinyecta por el webhook y cuenta lo que salio", async () => {
  const enviados = [];
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: true },
    {
      leerFilas: async () => [fila()],
      postWebhook: async (p) => {
        enviados.push(p);
        return { ok: true };
      },
    },
  );
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].event, "message_created");
  assert.equal(res.reinyectados, 1);
});

test("si el webhook rechaza uno, el barrido sigue con los demas y lo reporta", async () => {
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: true },
    {
      leerFilas: async () => [
        fila({ conversationId: 49, messageId: 282 }),
        fila({ conversationId: 50, messageId: 290 }),
      ],
      postWebhook: async (p) => {
        if (p.conversation.id === 49) throw new Error("puerto muerto");
        return { ok: true };
      },
    },
  );
  assert.equal(res.reinyectados, 1, "el fallo de uno no puede cancelar el rescate del otro");
  assert.equal(res.fallidos.length, 1);
  assert.equal(res.fallidos[0].conversationId, 49);
});
