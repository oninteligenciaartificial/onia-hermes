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
  MOTIVOS_SIN_RESCATE_AJENO,
  crearMarcasEnDisco,
  claveDeMarca,
  VIDA_MARCA_MS,
  guardaDeEfectoReal,
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
      avisar: async () => {},
      marcas: crearMarcasEnDisco(dirDeMarcas()),
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
      avisar: async () => {},
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [
        fila({ conversationId: 49, messageId: 282 }),
        fila({ conversationId: 50, messageId: 290 }),
      ],
      postWebhook: async (p) => {
        if (p.conversation.id === 49) throw new Error("puerto muerto");
        // Cuerpo real: `postAlWebhook` SIEMPRE devuelve `respuesta`. El mock de antes
        // contestaba `{ok:true}` pelado — que en produccion no existe — y con eso este caso
        // afirmaba un rescate que el barrido no podia leer.
        return { ok: true, respuesta: '{"ok":true,"sent":[{"id":991}]}' };
      },
    },
  );
  assert.equal(res.reinyectados, 1, "el fallo de uno no puede cancelar el rescate del otro");
  assert.equal(res.contestados, 1, "y el que si salio tiene que contarse como rescatado");
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

// ---------------------------------------------------------------------------
// EL RESCATE FUNCIONABA Y EL TESTIGO NO — medido el 2026-09-03 provocando el primer
// huerfano de verdad (msg 339 insertado directo en la base de Chatwoot, sin disparar el
// webhook: el mismo estado que deja un webhook caido). El cron lo encontro, lo reinyecto y
// **el bot le contesto** (`rama=respondio enviados=1/1`, msg 340 en la conversacion). Pero el
// barrido informo `0 CONTESTADOS` y NO aviso a nadie: `-> respuesta_ilegible`.
//
// La causa, medida y no razonada, es el `.slice(0, 300)` de `postAlWebhook`:
//
//     cuerpo de EXITO  = 903 caracteres  -> cortado a 300: "Unterminated string in JSON"
//     cuerpo de DEDUP  = 101 caracteres  -> cortado a 300: intacto
//
// Es decir: el corte rompia UNICAMENTE el caso que importa. Todo lo que se habia probado
// hasta hoy —a mano y contra produccion— era dedup, y por eso salio verde siempre. El unico
// camino que nunca se habia ejercido es el unico que salva un lead.
//
// Estos casos cruzan `postAlWebhook` con `clasificarRespuesta`. Sueltos no ven nada: el bug
// no vive en ninguna de las dos, vive en el cuerpo que una le pasa a la otra.
// ---------------------------------------------------------------------------

/** Un cuerpo de exito con la forma y el TAMAÑO del real (903 chars el 2026-09-03). */
function cuerpoDeExito() {
  return JSON.stringify({
    ok: true,
    skipped: false,
    deduped: false,
    duplicate: false,
    sent: [
      {
        id: 340,
        content:
          "¿Querés que te reserve para el viernes 4 de septiembre a las 14:00 o para el sábado 5 a las 9:00? " +
          "Contame qué día te queda mejor y lo dejo agendado. La demo dura 30 minutos y te la hace Sergio.",
      },
    ],
    stageBefore: "esperando_horario",
    stageAfter: "esperando_horario",
    reason: null,
    traza: { conv: 49, msg: 339, rama: "respondio", etapa: "esperando_horario->esperando_horario" },
  });
}

test("EL TESTIGO ROTO: un rescate que SI contesto tiene que contarse como contestado", async () => {
  const cuerpo = cuerpoDeExito();
  assert.ok(cuerpo.length > 300, `el cuerpo de exito real pasa de 300; este mide ${cuerpo.length}`);

  const res = await postAlWebhook(
    { event: "message_created", conversation: { id: 49 } },
    {
      run: async () => ({ stdout: cuerpo }),
      leerEnv: () => "ONIA_CHATWOOT_WEBHOOK_PATH_SECRET=s3cr3-to",
      env: { ONIA_WEBHOOK_PORT: "3020" },
    },
  );

  const veredicto = clasificarRespuesta(res.respuesta);
  assert.equal(
    veredicto.contestado,
    true,
    `el bot contesto de verdad y el barrido lo leyo como "${veredicto.motivo}"`,
  );
});

test("la asimetria que lo escondio: el cuerpo corto de dedup sobrevivia al corte y el largo no", async () => {
  const dedup = '{"ok":true,"skipped":false,"deduped":true,"duplicate":true,"sent":[],"reason":"mensaje_ya_procesado"}';
  assert.ok(dedup.length < 300, "el cuerpo de dedup medido son 101 chars: por eso nunca fallo");

  const pegar = async (stdout) =>
    clasificarRespuesta(
      (
        await postAlWebhook(
          { event: "message_created", conversation: { id: 49 } },
          { run: async () => ({ stdout }), leerEnv: () => "", env: {} },
        )
      ).respuesta,
    );

  assert.equal((await pegar(dedup)).motivo, "mensaje_ya_procesado");
  assert.equal((await pegar(cuerpoDeExito())).motivo, "contestado");
});

test("una respuesta que el barrido no puede leer es un FALLO ruidoso, no un silencio", async () => {
  // Antes esto salia con exit 0 y "0 CONTESTADOS": indistinguible de no haber tenido trabajo.
  // Un rescate cuyo resultado no se puede leer es un desconocido que quiza quedo sin contestar.
  const r = await runRescateSweep(
    { emitir: true, ahoraMs: T0 + min(10) },
    {
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ createdAtMs: T0 })],
      postWebhook: async () => ({ ok: true, respuesta: "<html>502 Bad Gateway</html>" }),
      avisar: async () => {},
    },
  );
  assert.equal(r.reinyectados, 1);
  assert.equal(r.contestados, 0);
  assert.equal(r.fallidos.length, 1, "una respuesta ilegible tiene que salir por fallidos (exit 1)");
  assert.match(r.fallidos[0].motivo, /ilegible/);
});

// ---------------------------------------------------------------------------
// EL TERCER ESTADO, medido en vivo el 2026-09-10 sobre el inbox 5 (Onia WhatsApp):
//
//   messages id=873  message_type=0  19:28:49Z  "hola"     <- una persona, no una sonda
//   19:34  conv 11 msg 873 —  5 min sin respuesta -> mensaje_ya_procesado
//   19:44  conv 11 msg 873 — 15 min sin respuesta -> sin_respuesta
//   19:54  conv 11 msg 873 — 25 min sin respuesta -> sin_respuesta
//   20:04  conv 11 msg 873 — 35 min sin respuesta -> sin_respuesta
//   ...y las cuatro vueltas cerraron con "0 sin respuesta"? No: con **0 CONTESTADOS**.
//
// El barrido lo intento CUATRO veces, fallo las cuatro, y salio con exit 0 y una linea
// identica a la de una vuelta sin trabajo. `armarAvisoRescate` solo mira `contestado`, asi
// que tampoco aviso. El mensaje dejo de ser huerfano recien a las 20:11, y no porque lo
// rescataran: porque la persona volvio a escribir sola. Nadie se entero nunca.
//
// La causa es que `runRescateSweep` tenia TRES salidas y contabilizaba DOS: `contestado`
// sumaba y avisaba, `respuesta_ilegible` y el error caian en `fallidos` (exit 1), y todo lo
// demas —un cuerpo legible que dice "no emiti nada"— no caia en ninguna. El archivo ya habia
// escrito la regla correcta para su hermano ilegible ("no poder LEER el resultado no es 'no
// paso nada'"), y no la aplico al caso en que SI se puede leer y lo que dice es que no salio
// nada. Media familia cubierta se lee como familia cubierta.
//
// LO QUE LO HACE DEMOSTRABLE, y no una opinion sobre motivos: `seleccionarHuerfanos` ya
// probo que en esa conversacion NO hay ningun saliente despues del entrante. Entonces una
// reinyeccion que no produce `sent` es, por construccion, un rescate que fallo — sin
// importar como se llame el motivo. No hace falta enumerar motivos malos (eso seria una
// lista de inclusion, que falla abierto con el motivo nuevo que nadie previo).
// ---------------------------------------------------------------------------

test("EL TERCER ESTADO: reinyectar y que NO salga nada es un FALLO, no un silencio", async () => {
  const r = await runRescateSweep(
    { emitir: true, ahoraMs: T0 + min(35) },
    {
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873, content: "hola", inboxId: 5 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[],"reason":"sin_respuesta"}' }),
      avisar: async () => {},
    },
  );
  assert.equal(r.reinyectados, 1, "se mando");
  assert.equal(r.contestados, 0, "y no salvo a nadie");
  assert.equal(r.fallidos.length, 1, "un rescate que fallo tiene que salir por fallidos (exit 1)");
  assert.equal(r.fallidos[0].conversationId, 11);
  assert.equal(r.fallidos[0].messageId, 873);
  assert.match(r.fallidos[0].motivo, /sin_respuesta/, "y el FALLO dice POR QUE no salio nada");
});

test("el dedup tampoco absuelve: el huerfano ya probo que nadie le contesto", async () => {
  // Era la coartada escrita en el propio archivo ("los que salieron deduplicados no salvaron
  // a nadie"). Cierto — y por eso mismo la persona sigue esperando: que la clave ya estuviera
  // reclamada significa que el motor la tomo y no emitio, no que alguien le contesto.
  const r = await runRescateSweep(
    { emitir: true, ahoraMs: T0 + min(5) },
    {
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873 })],
      postWebhook: async () => ({
        ok: true,
        respuesta: '{"ok":true,"deduped":true,"sent":[],"reason":"mensaje_ya_procesado"}',
      }),
      avisar: async () => {},
    },
  );
  assert.equal(r.fallidos.length, 1, "reinyectado, sin salida y sin saliente en la conversacion");
  assert.match(r.fallidos[0].motivo, /mensaje_ya_procesado/);
});

test("el handoff es la UNICA excusa, y tiene dueno: lo mira onia-vigia-sin-respuesta", async () => {
  // No es un rescate fallido: el bot se calla a proposito porque la conversacion paso a una
  // persona. Que esa persona tampoco haya contestado es real, y es de OTRO vigia — avisarlo
  // aca duplicaria su aviso cada 10 min, que es como se entrena a no leer los avisos.
  const r = await runRescateSweep(
    { emitir: true, ahoraMs: T0 + min(5) },
    {
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[],"reason":"handoff_humano"}' }),
      avisar: async () => {},
    },
  );
  assert.equal(r.fallidos.length, 0, "el handoff no se cuenta como rescate fallido");
  assert.equal(r.detalle[0].resultado, "handoff_humano", "pero el barrido igual dice que paso");
});

test("la excusa no puede crecer sola: un motivo nuevo NACE cubierto", () => {
  // Sin este caso, el dia que alguien agregue un motivo a la exencion nada se pone rojo y el
  // tercer estado vuelve a ser silencio — con otro nombre.
  assert.deepEqual([...MOTIVOS_SIN_RESCATE_AJENO], ["handoff_humano"]);
});

test("el barrido separa lo mandado de lo CONTESTADO, que es lo unico que salva un lead", async () => {
  const res = await runRescateSweep(
    { ahoraMs: T0 + min(5), emitir: true },
    {
      avisar: async () => {},
      marcas: crearMarcasEnDisco(dirDeMarcas()),
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
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ conversationId: 47, messageId: 249 })],
      postWebhook: async () => ({
        ok: true,
        respuesta: '{"ok":true,"deduped":true,"sent":[],"reason":"mensaje_ya_procesado"}',
      }),
      avisar: async (texto) => avisos.push(texto),
    },
  );
  // Se mira el aviso de RESCATE (🛟), no la bandeja entera: un reinyectado deduplicado que
  // sigue sin saliente SI manda el aviso de perdido (🔴) — es deliberado y lo fija el caso
  // "el dedup tampoco absuelve". Hasta hoy esto decia `deepEqual(avisos, [])` y pasaba en
  // verde por una razon falsa: sin `marcas` propias, la corrida ANTERIOR habia dejado
  // `chatwoot-47-249` en el directorio de produccion, asi que la reserva devolvia `false` y
  // el 🔴 no salia. El caso estaba colgado de un archivo dejado por su propia corrida previa.
  assert.deepEqual(
    avisos.filter((a) => a.includes("🛟")),
    [],
    "reinyectar sin contestar no salva a nadie: no se avisa un rescate",
  );

  await runRescateSweep(
    { ahoraMs: T0 + min(7), emitir: true },
    {
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ conversationId: 49, messageId: 282 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' }),
      avisar: async (texto) => avisos.push(texto),
    },
  );
  const rescates = avisos.filter((a) => a.includes("🛟"));
  assert.equal(rescates.length, 1, "un lead rescatado SI se avisa");
  assert.match(rescates[0], /conv(ersacion)? 49/i, "el aviso dice cual conversacion mirar");
  assert.match(rescates[0], /7 min/, "y cuanto tiempo estuvo esperando esa persona");
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
      marcas: crearMarcasEnDisco(dirDeMarcas()),
      leerFilas: async () => [fila({ conversationId: 49, messageId: 282 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' }),
      avisar: async () => {
        throw new Error("telegram caido");
      },
    },
  );
  assert.equal(res.contestados, 1, "el lead se salvo igual: Telegram es el testigo, no el trabajo");
});

// ---------------------------------------------------------------------------
// LA MITAD QUE QUEDABA ABIERTA DE `7a9e10c0`: el fallo se VE en el log y no le llega a nadie.
//
// El barrido ya sale con `exit 1` cuando reinyecta y no sale nada — pero eso vive en
// `/var/log/onia-rescate-mensaje-perdido.log`, que nadie mira. El "hola" del 10-sep (conv 11
// msg 873, inbox 5) fallo cuatro veces y dejo de figurar como huerfano porque la persona
// volvio a escribir sola, no porque alguien la atendiera.
//
// Y NO SE PUEDE AVISAR POR VUELTA: la ventana del huerfano es MAX_EDAD_MS = 12 h y el cron
// corre cada 10 min, asi que UN mensaje perdido daria hasta 72 avisos identicos. Eso no es
// avisar de mas, es apagar el canal — el vigia que grita mal no molesta, inutiliza.
//
// Asi que el aviso necesita MEMORIA por mensaje, durable entre corridas. Se midio primero si
// servia `bot_messages.message_key` (unique, ya existe) y NO sirve, por dos razones medidas
// contra produccion el 2026-09-11 — las dos estan en la cabecera de `crearMarcasEnDisco`.
// ---------------------------------------------------------------------------

import { mkdtempSync, rmSync, existsSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Un directorio de marcas propio por caso: dos casos no pueden pisarse. */
function dirDeMarcas() {
  const dir = mkdtempSync(join(tmpdir(), "onia-rescate-marcas-"));
  test.after?.(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** Un huerfano que se reinyecta y el webhook contesta que no emitio nada: fallo. */
const PERDIDO = { ok: true, respuesta: '{"ok":true,"sent":[],"reason":"sin_respuesta"}' };

test("EL MENSAJE PERDIDO AVISA: reinyectar y que no salga nada le llega a Sergio Urcullo", async () => {
  const avisos = [];
  const r = await runRescateSweep(
    { ahoraMs: T0 + min(35), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873, content: "hola" })],
      postWebhook: async () => PERDIDO,
      avisar: async (texto) => avisos.push(texto),
      marcas: crearMarcasEnDisco(dirDeMarcas()),
    },
  );
  assert.equal(r.fallidos.length, 1, "sigue siendo un fallo ruidoso");
  assert.equal(avisos.length, 1, "y ahora ademas SALE del log");
  assert.match(avisos[0], /conv(ersacion)? 11/i, "dice cual conversacion abrir");
  assert.match(avisos[0], /35 min/, "y cuanto lleva esperando esa persona");
});

test("UNA SOLA VEZ POR MENSAJE: el cron pasa 72 veces y el aviso sale uno", async () => {
  const avisos = [];
  const marcas = crearMarcasEnDisco(dirDeMarcas());
  const deps = {
    leerFilas: async () => [fila({ conversationId: 11, messageId: 873, content: "hola" })],
    postWebhook: async () => PERDIDO,
    avisar: async (texto) => avisos.push(texto),
    marcas,
  };
  for (let vuelta = 0; vuelta < 5; vuelta += 1) {
    const r = await runRescateSweep({ ahoraMs: T0 + min(10 + vuelta * 10), emitir: true }, deps);
    assert.equal(r.fallidos.length, 1, "el fallo NO se tapa: el log y el exit 1 siguen");
  }
  assert.equal(avisos.length, 1, "cinco vueltas, un aviso — 72 identicos apagan el canal");
});

test("cada mensaje perdido es un lead distinto: el segundo tambien avisa", async () => {
  const avisos = [];
  const marcas = crearMarcasEnDisco(dirDeMarcas());
  const corrida = (over, ahora) =>
    runRescateSweep(
      { ahoraMs: ahora, emitir: true },
      {
      marcas: crearMarcasEnDisco(dirDeMarcas()),
        leerFilas: async () => [fila(over)],
        postWebhook: async () => PERDIDO,
        avisar: async (texto) => avisos.push(texto),
        marcas,
      },
    );
  await corrida({ conversationId: 11, messageId: 873 }, T0 + min(10));
  await corrida({ conversationId: 11, messageId: 874 }, T0 + min(20));
  await corrida({ conversationId: 12, messageId: 873 }, T0 + min(30));
  assert.equal(avisos.length, 3, "la marca es por MENSAJE, no por conversacion ni por vuelta");
});

test("el handoff no avisa ni deja marca: su dueno es onia-vigia-sin-respuesta", async () => {
  const avisos = [];
  const dir = dirDeMarcas();
  const r = await runRescateSweep(
    { ahoraMs: T0 + min(10), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 55, messageId: 900 })],
      postWebhook: async () => ({ ok: true, respuesta: '{"ok":true,"sent":[],"reason":"handoff_humano"}' }),
      avisar: async (texto) => avisos.push(texto),
      marcas: crearMarcasEnDisco(dir),
    },
  );
  assert.equal(r.fallidos.length, 0, "la excusa sigue excusando");
  assert.deepEqual(avisos, [], "y no duplica el aviso del vigia que ya lo mira");
  assert.ok(!existsSync(join(dir, "chatwoot-55-900")), "tampoco quema la marca del mensaje");
});

test("SI NO PUEDO RECORDAR, NO AVISO: 72 mensajes identicos es peor que el log", async () => {
  const avisos = [];
  const r = await runRescateSweep(
    { ahoraMs: T0 + min(10), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873 })],
      postWebhook: async () => PERDIDO,
      avisar: async (texto) => avisos.push(texto),
      marcas: { reservar: () => null, purgar: () => {} },
    },
  );
  assert.deepEqual(avisos, [], "sin memoria no se puede avisar una sola vez");
  assert.equal(r.fallidos.length, 1, "pero el fallo sigue en el log y el exit sigue en 1");
  assert.ok(r.marcasFallidas?.length, "y que NO se pudo recordar tambien se dice, no se traga");
});

test("el aviso del perdido va en HTML y escapa lo que escribio la persona", async () => {
  const avisos = [];
  await runRescateSweep(
    { ahoraMs: T0 + min(10), emitir: true },
    {
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873, content: 'soy <dra> & "4"' })],
      postWebhook: async () => PERDIDO,
      avisar: async (texto) => avisos.push(texto),
      marcas: crearMarcasEnDisco(dirDeMarcas()),
    },
  );
  assert.ok(!/<dra>/.test(avisos[0]), "un < crudo hace que el mensaje NO llegue a Telegram");
  assert.match(avisos[0], /&lt;dra&gt;/);
  assert.match(avisos[0], /<b>/, "el formato propio del aviso si es HTML");
});

test("rescatado y perdido son avisos SEPARADOS: el enrutador clasifica por la primera linea", async () => {
  const avisos = [];
  await runRescateSweep(
    { ahoraMs: T0 + min(10), emitir: true },
    {
      leerFilas: async () => [
        fila({ conversationId: 49, messageId: 282 }),
        fila({ conversationId: 11, messageId: 873 }),
      ],
      postWebhook: async (payload) =>
        payload?.id === 282 ? { ok: true, respuesta: '{"ok":true,"sent":[{"id":1}]}' } : PERDIDO,
      avisar: async (texto) => avisos.push(texto),
      marcas: crearMarcasEnDisco(dirDeMarcas()),
    },
  );
  assert.equal(avisos.length, 2, "una buena noticia y una mala no viajan en el mismo mensaje");
  assert.ok(
    avisos.some((a) => /🛟/.test(a)) && avisos.some((a) => /🔴/.test(a)),
    "y cada una arranca con su propia cara",
  );
});

test("la marca se limpia sola: pasada la ventana del huerfano deja de bloquear", async () => {
  const avisos = [];
  const dir = dirDeMarcas();
  const marcas = crearMarcasEnDisco(dir);
  const deps = {
    leerFilas: async () => [fila({ conversationId: 11, messageId: 873 })],
    postWebhook: async () => PERDIDO,
    avisar: async (texto) => avisos.push(texto),
    marcas,
  };
  await runRescateSweep({ ahoraMs: T0 + min(10), emitir: true }, deps);
  assert.equal(avisos.length, 1);

  // Envejecer la marca a mano es lo unico que puede pasar en produccion: el archivo queda y
  // nadie lo borra. Sin purga el directorio crece para siempre.
  const despues = T0 + min(20);
  const vencida = (despues - VIDA_MARCA_MS - 60_000) / 1000;
  utimesSync(join(dir, "chatwoot-11-873"), vencida, vencida);
  await runRescateSweep({ ahoraMs: despues, emitir: true }, deps);
  assert.equal(avisos.length, 2, "una marca vencida no puede silenciar un mensaje para siempre");

  // Y la que TODAVIA esta dentro de la ventana no se toca: purgar de mas devuelve los 72.
  await runRescateSweep({ ahoraMs: despues + min(10), emitir: true }, deps);
  assert.equal(avisos.length, 2, "la marca fresca sigue en pie");
});

test("sin conv o sin msg no hay clave, y sin clave no se inventa una marca compartida", () => {
  assert.equal(claveDeMarca({ conversationId: 11, messageId: 873 }), "chatwoot-11-873");
  assert.equal(claveDeMarca({ conversationId: 11 }), null);
  assert.equal(claveDeMarca({ messageId: 873 }), null);
  // Un id que viniera contaminado no puede escaparse del directorio de marcas.
  assert.equal(claveDeMarca({ conversationId: "../../etc", messageId: "passwd" }), null);
});

test("EN SECO NO TOCA LAS MARCAS: mirar el barrido a mano no puede borrar estado real", async () => {
  // Este caso existe por una razon que ningun otro puede ver: `purgar` BORRA archivos. Un
  // `node rescate-run.mjs` sin `--emit` —lo que uno tipea para mirar— no puede pasar la
  // escoba por las marcas de produccion; si lo hiciera, el aviso del lead perdido volveria a
  // salir. Que ademas no deje marca nueva ya lo garantiza que en seco no se reinyecta nada.
  const dir = dirDeMarcas();
  const llamadas = [];
  await runRescateSweep(
    { ahoraMs: T0 + min(10), emitir: false },
    {
      leerFilas: async () => [fila({ conversationId: 11, messageId: 873 })],
      postWebhook: async () => PERDIDO,
      avisar: async () => {},
      marcas: {
        reservar: async (c) => (llamadas.push(`reservar:${c}`), true),
        liberar: async (c) => llamadas.push(`liberar:${c}`),
        purgar: async () => llamadas.push("purgar"),
      },
    },
  );
  assert.deepEqual(llamadas, [], "el modo seco no lee ni escribe ni borra una sola marca");
  assert.ok(!existsSync(join(dir, "chatwoot-11-873")), "y no deja huella");
});

test("si Telegram se cae, la marca se SUELTA: ese lead no se anuncio nunca", async () => {
  const dir = dirDeMarcas();
  const marcas = crearMarcasEnDisco(dir);
  const avisos = [];
  let primeraVuelta = true;
  const deps = {
    leerFilas: async () => [fila({ conversationId: 11, messageId: 873 })],
    postWebhook: async () => PERDIDO,
    avisar: async (texto) => {
      if (primeraVuelta) throw new Error("telegram caido");
      avisos.push(texto);
    },
    marcas,
  };
  const r = await runRescateSweep({ ahoraMs: T0 + min(10), emitir: true }, deps);
  assert.ok(r.avisoFallido, "el fallo de entrega se dice");
  assert.ok(!existsSync(join(dir, "chatwoot-11-873")), "y la reserva no se queda con el aviso");

  primeraVuelta = false;
  await runRescateSweep({ ahoraMs: T0 + min(20), emitir: true }, deps);
  assert.equal(avisos.length, 1, "la vuelta siguiente si lo anuncia");
});

// ─────────────────────────────────────────────────────────────────────────────
// HERMETISMO: la suite no puede tocar produccion. Medido el 2026-09-11 y no supuesto.
//
// Estos casos nacen de un dano real causado por ESTA MISMA suite. Los tres casos que
// llamaban a `runRescateSweep` con `emitir: true` sin inyectar `deps.avisar` ni `deps.marcas`
// caian a los defaults, que son los REALES:
//
//   05:16:01  TAREA t_3cd88596 clave=876bcd "🔴 Un mensaje quedo SIN contestar"
//   05:16:09  TAREA-YA-EXISTE ... (y 6 mas en 50 s)
//
// O sea: la suite le creo a Sergio Urcullo una tarea en el tablero —de donde los cuatro
// carriles sacan trabajo— afirmando "Hay una persona esperando en la bandeja" sobre la sonda
// de QA (conv 49), con el bot habiendole contestado los dos mensajes (936->937, 938->939) y
// el barrido real informando `0 sin respuesta` en todas sus corridas de esa hora.
//
// Y lo caro no fue el aviso falso sino la MARCA: quedaron escritos en
// `/var/lib/onia-rescate-avisado/` los archivos `chatwoot-49-282`, `chatwoot-47-249` y
// `chatwoot-11-873`. El ultimo es el lead REAL del 10-sep que motivo todo el arreglo. La
// marca existe para no repetir un aviso ya entregado: con ella puesta por un test, el dia
// que ese mensaje vuelva a quedar huerfano el aviso NO sale. El instrumento que existe para
// no perder un lead quedaba silenciado por su propio test, en verde y sin una sola linea.
//
// La baranda va en el PRODUCTO y TIRA en vez de no-operar: un no-op silencioso dejaria en
// verde a un caso que cree estar probando el aviso, que es el guardia hueco de siempre.
// Y falla CERRADO: un caso futuro con `emitir: true` que no inyecte explota solo, con el
// nombre de lo que falta. Por eso no hace falta ademas un gate que parsee este archivo.

// ⚠️ COMO SE VALIDAN ESTOS CASOS POR MUTACION — y cual NO se corre, medido el 2026-09-11.
//
// Una baranda contra un efecto externo es el unico gate que NO se puede validar quitandole la
// proteccion: la mutacion "que el default de `avisar` no llame a la guarda" deja al caso de
// abajo ejecutando `onia-tg.sh` DE VERDAD. La corri creyendola segura y mando un aviso real
// (05:47:39 en /var/log/onia-tg.log); lo contuvo de casualidad la dedup del enrutador, que ya
// tenia esa clave de la vuelta anterior. O sea: validar la baranda la rompio.
//
// Las cuatro que SI valen, y ninguna ejecuta el efecto:
//   · la guarda tira sin decir "hermetismo"        -> caen los 3 casos que esperan ese texto
//   · el catch del aviso se traga el `.hermetismo` -> cae el caso del aviso (equivale a la
//                                                     peligrosa, sin desarmar la guarda)
//   · las marcas por defecto no llaman a la guarda -> cae el caso de las marcas
//   · la guarda tira SIEMPRE (tambien en prod)     -> cae el caso de "fuera de node --test"
test("hermetismo: bajo `node --test` la guarda de efecto real TIRA y nombra que falta", () => {
  assert.ok(process.env.NODE_TEST_CONTEXT, "precondicion: estos casos corren bajo node --test");
  assert.throws(() => guardaDeEfectoReal("avisar"), /hermetismo/i);
  assert.throws(() => guardaDeEfectoReal("avisar"), /deps\.avisar/);
});

test("hermetismo: el aviso por defecto no puede llegar a Telegram desde un test", async () => {
  await assert.rejects(
    runRescateSweep(
      { ahoraMs: T0 + min(5), emitir: true },
      {
        leerFilas: async () => [fila()],
        postWebhook: async () => PERDIDO,
        marcas: crearMarcasEnDisco(dirDeMarcas()),
        // avisar: A PROPOSITO sin inyectar — es el defecto que se esta cazando.
      },
    ),
    /hermetismo/i,
    "sin `deps.avisar`, el barrido tiene que explotar antes de ejecutar onia-tg.sh",
  );
});

test("hermetismo: las marcas por defecto no pueden escribir en el directorio de produccion", () => {
  const previo = process.env.ONIA_RESCATE_MARCAS;
  delete process.env.ONIA_RESCATE_MARCAS;
  try {
    assert.throws(() => crearMarcasEnDisco(), /hermetismo/i);
    // Con un directorio propio es hermetico y tiene que seguir funcionando: la baranda no
    // puede volver intesteable a la parte que SI se prueba.
    assert.ok(crearMarcasEnDisco(dirDeMarcas()));
    // Y la variable de entorno tambien alcanza: asi corre el caso de la purga.
    process.env.ONIA_RESCATE_MARCAS = dirDeMarcas();
    assert.ok(crearMarcasEnDisco());
  } finally {
    if (previo === undefined) delete process.env.ONIA_RESCATE_MARCAS;
    else process.env.ONIA_RESCATE_MARCAS = previo;
  }
});

test("hermetismo: fuera de `node --test` la guarda deja pasar — produccion no se toca", () => {
  const previo = process.env.NODE_TEST_CONTEXT;
  delete process.env.NODE_TEST_CONTEXT;
  try {
    // El cron corre `node rescate-run.mjs --emit` sin runner: ahi la guarda NO existe, o la
    // baranda del test se comeria el unico aviso que importa.
    assert.doesNotThrow(() => guardaDeEfectoReal("avisar"));
    assert.ok(crearMarcasEnDisco(), "y las marcas de verdad se construyen igual");
  } finally {
    if (previo === undefined) delete process.env.NODE_TEST_CONTEXT;
    else process.env.NODE_TEST_CONTEXT = previo;
  }
});
