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
  parsearSecretoDeRuta,
  construirUrlWebhook,
  postAlWebhook,
  clasificarRespuesta,
  armarAvisoRescate,
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

// ---------------------------------------------------------------------------
// LA ULTIMA MILLA: el 401. El barrido seleccionaba bien y moria al reinyectar
// ("wget: server returned error: HTTP/1.1 401 Unauthorized") porque pegaba contra
// `/webhook/chatwoot` pelado. El webhook autentica, y de sus dos mecanismos el que
// siempre esta disponible desde adentro del contenedor es el SECRETO EN LA RUTA.
// ---------------------------------------------------------------------------

test("el secreto sale del MISMO archivo que usa webhook-server.sh, no de una copia", () => {
  const contenido = [
    "# comentario",
    "",
    "ONIA_CHATWOOT_WEBHOOK_SECRET=otra-cosa",
    'ONIA_CHATWOOT_WEBHOOK_PATH_SECRET="s3cr3-to"',
    "ONIA_BOT_DRY_RUN=false",
  ].join("\n");
  assert.equal(parsearSecretoDeRuta(contenido), "s3cr3-to");
});

test("el archivo lo escribe un shell: aguanta export, comillas simples y espacios", () => {
  assert.equal(parsearSecretoDeRuta("export ONIA_CHATWOOT_WEBHOOK_PATH_SECRET='abc'"), "abc");
  assert.equal(parsearSecretoDeRuta("ONIA_CHATWOOT_WEBHOOK_PATH_SECRET = abc  "), "abc");
  assert.equal(parsearSecretoDeRuta("#ONIA_CHATWOOT_WEBHOOK_PATH_SECRET=comentado"), undefined);
  assert.equal(parsearSecretoDeRuta(""), undefined);
});

test("EL 401: con secreto, la URL lo lleva en la ruta — que es lo que el webhook acepta", () => {
  assert.equal(
    construirUrlWebhook({ puerto: "3020", secreto: "abc" }),
    "http://127.0.0.1:3020/webhook/chatwoot/abc",
  );
});

test("un secreto con caracteres raros va escapado, no rompe la URL", () => {
  assert.equal(
    construirUrlWebhook({ puerto: "3020", secreto: "a/b c" }),
    "http://127.0.0.1:3020/webhook/chatwoot/a%2Fb%20c",
  );
});

test("sin secreto NO inventa una ruta: pega pelado y que el 401 se vea", () => {
  assert.equal(
    construirUrlWebhook({ puerto: "3020", secreto: undefined }),
    "http://127.0.0.1:3020/webhook/chatwoot",
  );
});

test("postAlWebhook manda el secreto de verdad, no solo lo sabe calcular", async () => {
  let comando = "";
  const res = await postAlWebhook(
    { event: "message_created", conversation: { id: 49 } },
    {
      run: async (_bin, args) => {
        comando = args[args.length - 1];
        return { stdout: "ok" };
      },
      leerEnv: () => "ONIA_CHATWOOT_WEBHOOK_PATH_SECRET=s3cr3-to",
      env: { ONIA_WEBHOOK_PORT: "3020", ONIA_BOT_CONTAINER: "onia-center" },
    },
  );
  assert.ok(
    comando.includes("http://127.0.0.1:3020/webhook/chatwoot/s3cr3-to"),
    `la URL tiene que llevar el secreto; fue: ${comando}`,
  );
  assert.equal(res.ok, true);
});

test("el secreto NUNCA sale en un error: wget lo imprime en el comando y eso va al log", async () => {
  await assert.rejects(
    () =>
      postAlWebhook(
        { event: "message_created", conversation: { id: 49 } },
        {
          run: async (_bin, args) => {
            // execFile pone el comando entero en el mensaje de error. Ese es el filtrado.
            throw new Error(`Command failed: docker ${args.join(" ")}`);
          },
          leerEnv: () => "ONIA_CHATWOOT_WEBHOOK_PATH_SECRET=s3cr3-to",
          env: { ONIA_WEBHOOK_PORT: "3020" },
        },
      ),
    (error) => {
      assert.ok(!error.message.includes("s3cr3-to"), `el secreto se filtro al error: ${error.message}`);
      assert.ok(error.message.includes("***"), "y tiene que verse que ahi habia un secreto");
      return true;
    },
  );
});

// ---------------------------------------------------------------------------
// MEDIDO CONTRA PRODUCCION el 2026-09-03, y no era lo que este archivo suponia: el unico
// huerfano del barrido (conv 47) estaba en `handoff_humano` — el bot calla POR DISEÑO. La
// reinyeccion salio sin error y el barrido conto "1 reinyectado" habiendo rescatado CERO.
// En un carril cuya doctrina es que un dato que no se mira no prueba nada, un contador que
// dice exito sin exito es peor que no tenerlo: se repite cada vuelta y nadie lo revisa.
// ---------------------------------------------------------------------------

test("mandar no es rescatar: si el webhook dedupea, no se cuenta como contestado", () => {
  const r = clasificarRespuesta('{"ok":true,"deduped":true,"duplicate":true,"sent":[],"reason":"mensaje_ya_procesado"}');
  assert.equal(r.contestado, false);
  assert.equal(r.motivo, "mensaje_ya_procesado");
});

test("rescate de verdad: el webhook dice que salio algo", () => {
  const r = clasificarRespuesta('{"ok":true,"sent":[{"id":1}]}');
  assert.equal(r.contestado, true);
});

test("el bot en handoff no contesta y eso NO es un rescate", () => {
  const r = clasificarRespuesta('{"ok":true,"sent":[],"reason":"handoff_humano"}');
  assert.equal(r.contestado, false);
  assert.equal(r.motivo, "handoff_humano");
});

test("una respuesta que no es JSON no rompe el barrido ni se cuenta como exito", () => {
  assert.equal(clasificarRespuesta("<html>502</html>").contestado, false);
  assert.equal(clasificarRespuesta(undefined).contestado, false);
});

test("el barrido separa lo mandado de lo CONTESTADO, que es lo unico que salva un lead", async () => {
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: true },
    {
      leerFilas: async () => [
        fila({ conversationId: 49, messageId: 282 }),
        fila({ conversationId: 47, messageId: 249 }),
      ],
      postWebhook: async (p) =>
        p.conversation.id === 49
          ? { ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' }
          : { ok: true, respuesta: '{"ok":true,"deduped":true,"sent":[],"reason":"mensaje_ya_procesado"}' },
    },
  );
  assert.equal(res.reinyectados, 2, "los dos se mandaron");
  assert.equal(res.contestados, 1, "pero solo uno produjo respuesta");
  const conv47 = res.detalle.find((d) => d.conversationId === 47);
  assert.equal(conv47.resultado, "mensaje_ya_procesado", "y el barrido dice POR QUE el otro no");
});

// ─────────────────────────────────────────────────────────────────────────────────────────
// EL AVISO. Un barrido que corre solo cada 10 min y NO cuenta a nadie lo que hizo repite,
// en su propio cuerpo, el bug que vino a cerrar: el mensaje se pierde y nadie se entera.
// Y es ademas la unica forma de conseguir la prueba que le falta al circuito —un rescate
// que produzca una respuesta VISIBLE—: cuando aparezca el proximo huerfano real, el aviso
// lo va a decir. Sin esto habria que estar mirando el log en el minuto exacto.

test("avisa SOLO cuando salvo a alguien de verdad, no cuando solo mando", async () => {
  const avisos = [];
  await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 47, messageId: 249 })],
      postWebhook: async () => ({
        ok: true,
        respuesta: '{"ok":true,"deduped":true,"sent":[],"reason":"mensaje_ya_procesado"}',
      }),
      avisar: async (texto) => avisos.push(texto),
    },
  );
  assert.deepEqual(avisos, [], "reinyectar sin contestar no salva a nadie: no se avisa");

  await runRescateSweep(
    { ahoraMs: T0 + min(7), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 49, messageId: 282 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' }),
      avisar: async (texto) => avisos.push(texto),
    },
  );
  assert.equal(avisos.length, 1, "un lead rescatado SI se avisa");
  assert.match(avisos[0], /conv(ersacion)? 49/i, "el aviso dice cual conversacion mirar");
  assert.match(avisos[0], /7 min/, "y cuanto tiempo estuvo esperando esa persona");
});

test("en seco no avisa nunca, aunque haya huerfanos", async () => {
  const avisos = [];
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: false },
    {
      leerFilas: async () => [fila()],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' }),
      avisar: async (texto) => avisos.push(texto),
    },
  );
  assert.equal(res.huerfanos, 1);
  assert.deepEqual(avisos, [], "el modo seco no puede tocar Telegram");
});

test("el aviso va en HTML y escapa el texto de la persona: un < suelto lo hace NO llegar", () => {
  const texto = armarAvisoRescate({
    contestados: 1,
    detalle: [
      {
        conversationId: 49,
        messageId: 282,
        edadMin: 41,
        texto: 'tengo una <clinica> & "4 doctores"',
        resultado: "contestado",
      },
    ],
  });
  assert.ok(!/<clinica>/.test(texto), "el < del cliente no puede viajar crudo a Telegram");
  assert.match(texto, /&lt;clinica&gt;/);
  assert.match(texto, /&amp;/);
  assert.match(texto, /<b>/, "pero el formato propio del aviso SI es HTML");
});

test("si un aviso falla, el barrido no pierde el rescate que ya hizo", async () => {
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 49, messageId: 282 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' }),
      avisar: async () => {
        throw new Error("telegram caido");
      },
    },
  );
  assert.equal(res.contestados, 1, "el lead se salvo igual: Telegram es el testigo, no el trabajo");
});
