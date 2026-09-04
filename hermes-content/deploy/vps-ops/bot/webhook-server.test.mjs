// ONIA — Chatbot propio: pruebas del SERVIDOR DE WEBHOOK (n8n fuera del camino critico).
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"
//
// Lo que se cubre y por que:
//   1. LA PUERTA: firma invalida / vencida -> 401 y el MOTOR NI SE LLAMA. Sin secreto -> 503.
//   2. LA REGLA DE ORO: un mensaje saliente se descarta sin llamar al motor (si no, la respuesta
//      del bot dispara su propio webhook y el bot se contesta a si mismo en loop infinito).
//   3. MENSAJE REPETIDO: el reintento de Chatwoot no vuelve a correr el turno.
//   4. LOS CODIGOS DE ESTADO: salvo auth y JSON roto, TODO devuelve 2xx. Un 500 nuestro hace que
//      Chatwoot reintregue y el prospecto reciba la respuesta DOS VECES. Incluye el caso del
//      motor tirando una excepcion inesperada.
//   5. n8n FUERA DEL CAMINO: la respuesta HTTP sale aunque n8n este colgado o caido, y el evento
//      se dispara DESPUES de responder.
//
// El motor real no se toca en ningun test: `runChatwootTurn` se inyecta mockeado (la integracion
// con el motor de verdad ya la cubre chatwoot-adapter.test.mjs).

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { once } from "node:events";

import {
  checkDatabaseHealth,
  createWebhookServer,
  formatearTraza,
  getHealthStatus,
  getServerConfig,
  handleChatwootWebhook,
  matchWebhookPath,
  DEFAULT_PORT,
  WEBHOOK_PATH,
} from "./webhook-server.mjs";
import { _resetDedup } from "./message-dedup.mjs";

const SECRET = "secreto-de-prueba-no-va-al-repo";
const NOW_MS = Date.UTC(2026, 6, 30, 18, 0, 0);

const CONFIG = {
  webhookSecret: SECRET,
  pathSecret: undefined,
  toleranceSeconds: 300,
  allowUnsigned: false,
  maxBodyBytes: 1024 * 1024,
};

/** Payload real de Chatwoot (misma forma que los fixtures de chatwoot-adapter.test.mjs). */
function mensajeEntrante(overrides = {}) {
  return JSON.stringify({
    event: "message_created",
    id: 4242,
    content: "DEMO",
    message_type: "incoming",
    private: false,
    created_at: "2026-07-30T18:00:00Z",
    sender: { id: 9, name: "Prospecto Prueba" },
    conversation: { id: 77 },
    ...overrides,
  });
}

function sign(body, secret = SECRET, timestampSeconds = Math.floor(NOW_MS / 1000)) {
  const hex = createHmac("sha256", secret).update(`${timestampSeconds}.${body}`).digest("hex");
  return { "x-chatwoot-timestamp": String(timestampSeconds), "x-chatwoot-signature": `sha256=${hex}` };
}

/** Resultado tipico de runChatwootTurn, mas un contador de llamadas. */
function motorMock(result = {}) {
  const llamadas = [];
  const fn = async (payload) => {
    llamadas.push(payload);
    return {
      ok: true,
      skipped: false,
      duplicate: false,
      conversationId: "77",
      messageId: "4242",
      stageBefore: "nuevo",
      stageAfter: "esperando_calificacion",
      dryRun: false,
      sent: [{ text: "Hola, soy el asistente de Onia.", posted: true }],
      warnings: [],
      ...result,
    };
  };
  fn.llamadas = llamadas;
  return fn;
}

function pedido(body, headers, extra = {}) {
  return { rawBody: body, headers, method: "POST", url: WEBHOOK_PATH, ...extra };
}

test.beforeEach(() => _resetDedup());

// ---------------------------------------------------------------------------
// Config y ruta
// ---------------------------------------------------------------------------

test("getServerConfig: defaults sanos y sin secretos inventados", () => {
  const config = getServerConfig({});
  assert.equal(config.port, DEFAULT_PORT);
  assert.equal(config.webhookSecret, undefined);
  assert.equal(config.pathSecret, undefined);
  assert.equal(config.allowUnsigned, false, "fail-closed por default");
  assert.equal(config.toleranceSeconds, 300);

  const custom = getServerConfig({ ONIA_WEBHOOK_PORT: "4000", ONIA_CHATWOOT_WEBHOOK_SECRET: " s " });
  assert.equal(custom.port, 4000);
  assert.equal(custom.webhookSecret, "s");
});

test("matchWebhookPath acepta la ruta simple y la ruta con secreto, e ignora el querystring", () => {
  assert.deepEqual(matchWebhookPath("/webhook/chatwoot"), { match: true, pathSecret: "" });
  assert.deepEqual(matchWebhookPath("/webhook/chatwoot/"), { match: true, pathSecret: "" });
  assert.deepEqual(matchWebhookPath("/webhook/chatwoot/abc123"), { match: true, pathSecret: "abc123" });
  assert.deepEqual(matchWebhookPath("/webhook/chatwoot?x=1"), { match: true, pathSecret: "" });
  assert.equal(matchWebhookPath("/otra-cosa").match, false);
  assert.equal(matchWebhookPath("/").match, false);
});

/** /health ahora consulta la base; en los tests se inyecta para no salir a la red. */
const DB_SANA = { checkDb: async () => ({ ok: true, latencyMs: 3 }) };
const DB_CAIDA = { checkDb: async () => ({ ok: false, latencyMs: 2501, error: "sin respuesta en 3000 ms" }) };

test("getHealthStatus grita cuando falta el secreto y NUNCA devuelve su valor", async () => {
  const malo = await getHealthStatus({ allowUnsigned: false }, { enabled: false }, DB_SANA);
  assert.equal(malo.ok, false);
  assert.match(malo.auth.aviso, /SIN SECRETO/);

  const bueno = await getHealthStatus(CONFIG, { enabled: true, url: "https://x", secret: "y" }, DB_SANA);
  assert.equal(bueno.ok, true);
  assert.equal(bueno.auth.firma, true);
  assert.equal(bueno.auth.aviso, undefined);
  assert.ok(!JSON.stringify(bueno).includes(SECRET), "el secreto no se filtra por /health");
});

// ---------------------------------------------------------------------------
// 0.b EL HUECO QUE COSTO CINCO DIAS: /health decia ok:true con la base inalcanzable
// ---------------------------------------------------------------------------

test("BASE CAIDA: /health dice ok:false y explica que la base no responde", async () => {
  const salud = await getHealthStatus(CONFIG, { enabled: true, url: "https://x", secret: "y" }, DB_CAIDA);
  assert.equal(salud.db.ok, false);
  assert.match(salud.db.error, /sin respuesta/);
  assert.equal(salud.auth.ok, true, "el problema NO es el secreto y el aviso tiene que distinguirlo");
  assert.equal(salud.ok, false, "sin base el bot contesta pero no guarda nada: la alarma DEBE sonar");
});

test("checkDatabaseHealth: una lectura REAL, tolerante, y con la latencia a la vista", async () => {
  const leidas = [];
  const storeOk = {
    warnings: [],
    loadConversation: async (clave) => {
      leidas.push(clave);
      return { row: null, state: null };
    },
  };
  const sano = await checkDatabaseHealth({ store: storeOk });
  assert.equal(sano.ok, true);
  assert.equal(typeof sano.latencyMs, "number");
  assert.equal(leidas.length, 1, "tiene que PEGARLE a PostgREST: un chequeo indirecto no vio la caida de agosto");

  // El store es tolerante por contrato: ante fallo devuelve null y apila el motivo en warnings.
  const storeRoto = {
    warnings: ["loadConversation: HTTP 500 upstream connect error"],
    loadConversation: async () => null,
  };
  const roto = await checkDatabaseHealth({ store: storeRoto });
  assert.equal(roto.ok, false);
  assert.match(roto.error, /HTTP 500/);
});

test("BASE COLGADA: el chequeo corta solo y /health contesta igual (nunca se queda esperando)", async () => {
  // Una lectura que NO resuelve nunca: es el caso real de un socket que queda abierto sin datos.
  const storeMudo = { warnings: [], loadConversation: () => new Promise(() => {}) };
  const inicio = Date.now();
  const db = await checkDatabaseHealth({ store: storeMudo, timeoutMs: 40 });
  assert.equal(db.ok, false);
  assert.match(db.error, /sin respuesta/);
  assert.ok(Date.now() - inicio < 3000, "el chequeo tiene que cortar por su reloj, no por el del socket");
});

test("BASE COLGADA en un proceso PELADO: el reloj del chequeo se sostiene SOLO", () => {
  // El test de arriba corre dentro del runner, que segun la version de Node puede tener handles
  // propios vivos y prestarle el event loop al reloj del chequeo. Este levanta un proceso sin NADA
  // mas en vuelo, asi que el reloj tiene que sostenerse solo: si el timer estuviera `unref`, el
  // loop se vaciaria antes de los timeoutMs y el proceso saldria MUDO, sin resolver nunca.
  //
  // Es exactamente la falla que dejaba 18 de 23 pruebas canceladas en el contenedor (Node 20)
  // mientras en la maquina de desarrollo (Node 24) todo daba verde: el runner de Node 24 mantiene
  // un handle referenciado y tapaba el agujero. Este test lo destapa en CUALQUIER version.
  const script = `
    import { checkDatabaseHealth } from ${JSON.stringify(new URL("./webhook-server.mjs", import.meta.url).href)};
    const mudo = { warnings: [], loadConversation: () => new Promise(() => {}) };
    process.stdout.write(JSON.stringify(await checkDatabaseHealth({ store: mudo, timeoutMs: 40 })));
  `;
  const hijo = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
    encoding: "utf8",
    timeout: 15_000,
  });

  assert.ok(
    hijo.stdout,
    `el proceso salio sin escribir nada: el chequeo nunca resolvio (status=${hijo.status} stderr=${hijo.stderr})`,
  );
  const db = JSON.parse(hijo.stdout);
  assert.equal(db.ok, false);
  assert.match(db.error, /sin respuesta/);
});

test("si el chequeo de base EXPLOTA, /health responde igual (nunca tumba el proceso)", async () => {
  const storeExplosivo = {
    warnings: [],
    loadConversation: async () => {
      throw new Error("boom");
    },
  };
  const db = await checkDatabaseHealth({ store: storeExplosivo });
  assert.equal(db.ok, false);
  assert.match(db.error, /boom/);
});

// ---------------------------------------------------------------------------
// 1. LA PUERTA
// ---------------------------------------------------------------------------

test("FIRMA INVALIDA: 401 y el motor NI SE LLAMA", async () => {
  const motor = motorMock();
  const body = mensajeEntrante();
  const res = await handleChatwootWebhook(pedido(body, sign(body, "secreto-del-atacante")), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });

  assert.equal(res.status, 401);
  assert.equal(res.body.reason, "firma_invalida");
  assert.equal(motor.llamadas.length, 0, "no se gasta ni una llamada al motor en un payload no autenticado");
  assert.equal(res.n8nEvent, undefined);
});

test("FIRMA VENCIDA (replay): 401 y el motor NI SE LLAMA", async () => {
  const motor = motorMock();
  const body = mensajeEntrante();
  const viejo = Math.floor(NOW_MS / 1000) - 86_400;
  const res = await handleChatwootWebhook(pedido(body, sign(body, SECRET, viejo)), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });

  assert.equal(res.status, 401);
  assert.equal(res.body.reason, "firma_vencida");
  assert.equal(motor.llamadas.length, 0);
});

test("SIN SECRETO CONFIGURADO: 503, no procesa (fail-closed)", async () => {
  const motor = motorMock();
  const body = mensajeEntrante();
  const res = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: { ...CONFIG, webhookSecret: undefined },
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });

  assert.equal(res.status, 503);
  assert.equal(res.body.reason, "webhook_sin_secreto_configurado");
  assert.equal(motor.llamadas.length, 0);
});

test("SECRETO EN LA RUTA: entra con el path correcto, 401 con el path adivinado", async () => {
  const config = { ...CONFIG, webhookSecret: undefined, pathSecret: "ruta-larga-secreta" };
  const body = mensajeEntrante();

  const ok = await handleChatwootWebhook(
    pedido(body, {}, { url: `${WEBHOOK_PATH}/ruta-larga-secreta` }),
    { config, runChatwootTurn: motorMock(), nowMs: NOW_MS },
  );
  assert.equal(ok.status, 200);

  _resetDedup();
  const mal = await handleChatwootWebhook(
    pedido(body, {}, { url: `${WEBHOOK_PATH}/adivinada` }),
    { config, runChatwootTurn: motorMock(), nowMs: NOW_MS },
  );
  assert.equal(mal.status, 401);
});

test("metodo y ruta equivocados: 405 y 404", async () => {
  const deps = { config: CONFIG, runChatwootTurn: motorMock(), nowMs: NOW_MS };
  const get = await handleChatwootWebhook({ method: "GET", url: WEBHOOK_PATH, rawBody: "" }, deps);
  assert.equal(get.status, 405);

  const body = mensajeEntrante();
  const otra = await handleChatwootWebhook(pedido(body, sign(body), { url: "/otra" }), deps);
  assert.equal(otra.status, 404);
});

test("body gigante: 413 antes de parsear nada", async () => {
  const motor = motorMock();
  const res = await handleChatwootWebhook(pedido("x".repeat(200), {}), {
    config: { ...CONFIG, maxBodyBytes: 100 },
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });
  assert.equal(res.status, 413);
  assert.equal(motor.llamadas.length, 0);
});

test("JSON roto (ya autenticado): 400", async () => {
  const roto = "{esto no es json";
  const res = await handleChatwootWebhook(pedido(roto, sign(roto)), {
    config: CONFIG,
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.reason, "json_invalido");
});

// ---------------------------------------------------------------------------
// 2. LA REGLA DE ORO
// ---------------------------------------------------------------------------

test("REGLA DE ORO: un mensaje SALIENTE se descarta sin llamar al motor (nada de loop infinito)", async () => {
  const motor = motorMock();
  const body = mensajeEntrante({ message_type: "outgoing", content: "Hola, soy el asistente de Onia." });
  const res = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.skipped, true);
  assert.match(res.body.reason, /no_entrante/);
  assert.equal(motor.llamadas.length, 0, "el eco del propio bot NO llega al motor");
});

test("una nota privada tampoco despierta al bot", async () => {
  const motor = motorMock();
  const body = mensajeEntrante({ private: true });
  const res = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });
  assert.equal(res.body.skipped, true);
  assert.equal(motor.llamadas.length, 0);
});

test("un skip NO consume el dedup (un mensaje que nunca se proceso no puede quedar marcado)", async () => {
  const saliente = mensajeEntrante({ message_type: "outgoing" });
  await handleChatwootWebhook(pedido(saliente, sign(saliente)), {
    config: CONFIG,
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
  });

  // El MISMO id, ahora como entrante, tiene que procesarse igual.
  const motor = motorMock();
  const entrante = mensajeEntrante();
  const res = await handleChatwootWebhook(pedido(entrante, sign(entrante)), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });
  assert.equal(res.status, 200);
  assert.equal(motor.llamadas.length, 1);
});

// ---------------------------------------------------------------------------
// 3. DEDUP
// ---------------------------------------------------------------------------

test("MENSAJE REPETIDO: el reintento de Chatwoot no vuelve a correr el turno", async () => {
  const motor = motorMock();
  const body = mensajeEntrante();
  const deps = { config: CONFIG, runChatwootTurn: motor, nowMs: NOW_MS };

  const primera = await handleChatwootWebhook(pedido(body, sign(body)), deps);
  assert.equal(primera.status, 200);
  assert.equal(motor.llamadas.length, 1);

  const reintento = await handleChatwootWebhook(pedido(body, sign(body)), deps);
  assert.equal(reintento.status, 200, "2xx para que Chatwoot deje de reintentar");
  assert.equal(reintento.body.deduped, true);
  assert.deepEqual(reintento.body.sent, []);
  assert.equal(motor.llamadas.length, 1, "el motor corrio UNA sola vez");
  assert.equal(reintento.n8nEvent, undefined, "un duplicado no genera evento de analitica");
});

// ---------------------------------------------------------------------------
// 4. CODIGOS DE ESTADO / fail-open
// ---------------------------------------------------------------------------

test("si el motor TIRA: 200 (nunca 500) y la clave de dedup se libera para poder reintentar", async () => {
  const explota = async () => {
    throw new Error("supabase no responde");
  };
  const body = mensajeEntrante();
  const res = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: explota,
    nowMs: NOW_MS,
  });

  assert.equal(res.status, 200, "un 500 haria que Chatwoot reintregue y el prospecto reciba dos respuestas");
  assert.equal(res.body.ok, false);
  assert.equal(res.body.error, "error_interno");
  assert.match(res.body.reason, /supabase/);

  // Y como el turno murio SIN mandar nada, el mismo mensaje se tiene que poder reprocesar.
  const motor = motorMock();
  const reintento = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
  });
  assert.equal(motor.llamadas.length, 1, "el reintento SI se procesa: la clave se habia liberado");
});

// ---------------------------------------------------------------------------
// 5. n8n FUERA DEL CAMINO CRITICO
// ---------------------------------------------------------------------------

test("camino feliz: 200, el resultado del turno y el evento redactado para n8n", async () => {
  const motor = motorMock();
  const body = mensajeEntrante({ content: "soy sergio@onia.com.bo" });
  const res = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: motor,
    nowMs: NOW_MS,
    nowIso: "2026-07-30T18:00:00.000Z",
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(motor.llamadas.length, 1);

  assert.ok(res.n8nEvent, "el evento viaja aparte para dispararlo DESPUES de responder");
  assert.equal(res.n8nEvent.stageAfter, "esperando_calificacion");
  assert.ok(!JSON.stringify(res.n8nEvent).includes("sergio@onia.com.bo"), "redactado");
});

test("HTTP REAL: el servidor contesta aunque n8n este COLGADO, y dispara el evento despues", async () => {
  // n8n que no contesta NUNCA: si el servidor lo esperara, este test se colgaria.
  let disparado = null;
  const fireEvent = (event) => {
    disparado = event;
  };

  const server = createWebhookServer({
    config: CONFIG,
    n8nConfig: { enabled: true, url: "https://n8n.example/nunca", secret: "s" },
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
    fireEvent,
    log: () => {},
  });

  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();

  try {
    const body = mensajeEntrante();
    const res = await fetch(`http://127.0.0.1:${port}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...sign(body) },
      body,
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.conversationId, "77");

    // El evento se dispara DESPUES de escribir la respuesta: cuando el cliente ya la tiene, ya paso.
    assert.ok(disparado, "el evento a n8n se disparo");
    assert.equal(disparado.eventType, "chatbot_turn");
  } finally {
    server.close();
    await once(server, "close");
  }
});

test("HTTP REAL: /health responde sin auth y firma invalida da 401 por la red", async () => {
  // La base se sustituye en el STORE, no en el chequeo: asi corre la cadena COMPLETA de verdad
  // (handler -> getHealthStatus -> checkDatabaseHealth -> store) y lo unico simulado es la hoja
  // de red. Antes este test daba por hecho que la maquina NO tenia credenciales de Supabase; en
  // el contenedor de produccion si las tiene, la lectura salia bien y el test se caia por el
  // ENTORNO, no por el codigo.
  const leidas = [];
  const storeCaido = {
    warnings: ["loadConversation: faltan credenciales de Supabase"],
    loadConversation: async (clave) => {
      leidas.push(clave);
      return null;
    },
  };

  const server = createWebhookServer({
    config: CONFIG,
    n8nConfig: { enabled: false },
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
    store: storeCaido,
    log: () => {},
  });

  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();

  try {
    const health = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(health.status, 200);
    const estado = await health.json();
    assert.equal(estado.service, "onia-chatbot-webhook");
    assert.equal(estado.auth.firma, true);
    assert.ok(!JSON.stringify(estado).includes(SECRET));
    // /health tiene que PEGARLE a la base por HTTP. El hueco que costo cinco dias en agosto 2026
    // fue exactamente un /health que se declaraba sano sin leer nada: si esta cuenta da 0, el
    // chequeo volvio a ser indirecto y la alarma vuelve a no sonar.
    assert.equal(leidas.length, 1, "el chequeo real tiene que llegar hasta el store, no deducirse");
    assert.equal(estado.db.ok, false);
    assert.match(estado.db.error, /credenciales/);
    assert.equal(estado.ok, false, "el bot no puede reportarse sano si no puede guardar nada");

    const body = mensajeEntrante();
    const malo = await fetch(`http://127.0.0.1:${port}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...sign(body, "otro-secreto") },
      body,
    });
    assert.equal(malo.status, 401);
  } finally {
    server.close();
    await once(server, "close");
  }
});

// ---------------------------------------------------------------------------
// Regresion: colision de `deps.config` entre transporte y motor
// ---------------------------------------------------------------------------

test("REGRESION: la config del TRANSPORTE no baja al motor (si baja, el bot no le contesta a NADIE)", async () => {
  // En produccion `createWebhookServer` se auto-inyecta su config con `{ ...deps, config }`. Esa
  // `config` es la del transporte (webhookSecret, pathSecret, maxBodyBytes). El motor lee
  // `deps.config` esperando la del BOT (qualification, slots, script), asi que si se la dejamos
  // pasar, `config.qualification` es undefined y TODO turno real muere con "reading 'fields'".
  // Los otros tests de este archivo no lo detectan porque miran solo el `payload` del motor.
  let depsQueRecibioElMotor = null;
  const espia = async (_payload, deps) => {
    depsQueRecibioElMotor = deps;
    return { ok: true, skipped: false, duplicate: false, conversationId: "77", messageId: "4242", sent: [], warnings: [] };
  };

  const body = mensajeEntrante();
  const res = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: espia,
    nowMs: NOW_MS,
  });

  assert.equal(res.status, 200);
  assert.ok(depsQueRecibioElMotor, "el motor tiene que haberse llamado");
  assert.equal(
    depsQueRecibioElMotor.config,
    undefined,
    "el motor NO puede recibir la config del transporte: con ella cree que no tiene qualification y el turno explota",
  );
  assert.equal(depsQueRecibioElMotor.nowMs, NOW_MS, "el resto de los inyectables si tienen que seguir pasando");
});

// ---------------------------------------------------------------------------
// LA TRAZA: una linea por webhook, con el motivo del silencio
//
// POR QUE EXISTE. El 2026-09-02 se midio que `/tmp/onia-bot-webhook.log` tenia SOLO lineas de
// arranque: 2,5 MB de "escuchando en :3020" y NI UNA por mensaje. Con eso, el bug de "contesta
// una vez y se calla" sobrevivio UNA SEMANA con cinco personas reales del otro lado — nadie
// podia decir por que se callaba porque el bot no decia nada de si mismo.
//
// `createWebhookServer` ya recibia un `log`, pero solo lo llamaba en dos errores raros (socket
// muerto y n8n). El camino que importa —el webhook— no escribia nunca. Un log que existe y no
// se llama es peor que no tenerlo: parece que hay diagnostico.
//
// Las tres ramas MUDAS son el objetivo del ejercicio, y las tres devuelven 200 con el cuerpo
// casi igual: `MUDO` (el motor no produjo respuesta), `NO_ENTREGADO` (la produjo y Chatwoot la
// rechazo — cuatro dias reales en agosto) e `ignorado`. Sin nombrarlas, las tres se leen como
// exito.
// ---------------------------------------------------------------------------

test("TRAZA: el motor proceso el mensaje y NO produjo respuesta -> rama MUDO con su motivo", () => {
  const linea = formatearTraza({
    conversacion: "77",
    mensaje: "4242",
    entrada: "Tengo una clinica dental en Santa Cruz, somos 4 personas",
    estado: 200,
    cuerpo: {
      ok: true,
      skipped: false,
      duplicate: false,
      stageBefore: "handoff_humano",
      stageAfter: "handoff_humano",
      sent: [],
      warnings: [],
    },
  });

  assert.match(linea, /rama=MUDO/, "un turno sin respuesta tiene que gritar MUDO, no parecerse a un exito");
  assert.match(linea, /conv=77/);
  assert.match(linea, /clinica dental/, "sin la entrada no se puede reproducir el caso");
  assert.match(linea, /handoff_humano/, "la etapa ES el motivo: en handoff_humano el bot no vuelve a hablar");
});

test("TRAZA: el motor respondio y Chatwoot lo RECHAZO -> NO_ENTREGADO, no 'respondio'", () => {
  // Modo de falla real: en agosto el bot paso CUATRO DIAS calculando respuestas que Chatwoot
  // nunca recibio. `sent` tiene texto, `posted` es false. Si esto se loguea como "respondio",
  // el log miente exactamente igual que el silencio.
  const linea = formatearTraza({
    conversacion: "77",
    mensaje: "4242",
    entrada: "hola",
    estado: 200,
    cuerpo: { ok: true, sent: [{ text: "Hola!", posted: false }], warnings: ["chatwoot 502"] },
  });

  assert.match(linea, /rama=NO_ENTREGADO/);
  assert.doesNotMatch(linea, /rama=respondio/);
  assert.match(linea, /enviados=0\/1/, "hay que ver publicados/producidos, no solo un total");
  assert.match(linea, /chatwoot 502/, "el warning del motor es el motivo y tiene que viajar");
});

test("TRAZA: camino feliz -> respondio, con las etapas y el conteo", () => {
  const linea = formatearTraza({
    conversacion: "77",
    mensaje: "4242",
    entrada: "DEMO",
    estado: 200,
    cuerpo: {
      ok: true,
      stageBefore: "nuevo",
      stageAfter: "esperando_horario",
      sent: [{ text: "Hola", posted: true }],
      warnings: [],
    },
  });

  assert.match(linea, /rama=respondio/);
  assert.match(linea, /enviados=1\/1/);
  assert.match(linea, /nuevo->esperando_horario/, "la transicion de etapa es lo que explica el turno siguiente");
});

test("TRAZA: skip, dedup y error tienen cada uno su rama y su motivo", () => {
  const ignorado = formatearTraza({
    conversacion: "77",
    estado: 200,
    cuerpo: { ok: true, skipped: true, reason: "mensaje_no_entrante:outgoing" },
  });
  assert.match(ignorado, /rama=ignorado/);
  assert.match(ignorado, /motivo=mensaje_no_entrante:outgoing/);

  const repetido = formatearTraza({
    conversacion: "77",
    estado: 200,
    cuerpo: { ok: true, deduped: true, duplicate: true, reason: "mensaje_ya_procesado", sent: [] },
  });
  assert.match(repetido, /rama=repetido/);

  const roto = formatearTraza({
    conversacion: "77",
    estado: 200,
    cuerpo: { ok: false, error: "error_interno", reason: "reading 'fields'", sent: [] },
  });
  assert.match(roto, /rama=ERROR/);
  assert.match(roto, /reading 'fields'/);

  const rechazado = formatearTraza({ estado: 401, cuerpo: { ok: false, reason: "firma_invalida" } });
  assert.match(rechazado, /rama=rechazado/);
  assert.match(rechazado, /motivo=firma_invalida/);
  assert.match(rechazado, /estado=401/);
});

test("TRAZA: la entrada va en UNA linea y acotada (un log multilinea no se puede grepear)", () => {
  const linea = formatearTraza({
    conversacion: "77",
    entrada: `primera\nsegunda\r\ntercera ${"x".repeat(400)}`,
    estado: 200,
    cuerpo: { ok: true, sent: [{ text: "a", posted: true }], warnings: [] },
  });

  assert.equal(linea.includes("\n"), false, "una traza multilinea rompe el grep y el tail");
  assert.ok(linea.length < 400, `la linea no puede crecer sin tope (mide ${linea.length})`);
  assert.match(linea, /primera/);
});

test("handleChatwootWebhook devuelve traza en TODAS las ramas, con conversacion y entrada", async () => {
  const body = mensajeEntrante({ content: "Tengo una ferreteria" });
  const feliz = await handleChatwootWebhook(pedido(body, sign(body)), {
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [] }),
    nowMs: NOW_MS,
  });
  assert.ok(feliz.traza, "sin traza el servidor no tiene que loguear");
  assert.equal(feliz.traza.conversacion, "77");
  assert.equal(feliz.traza.entrada, "Tengo una ferreteria");

  const saliente = mensajeEntrante({ message_type: "outgoing" });
  const skip = await handleChatwootWebhook(pedido(saliente, sign(saliente)), {
    config: CONFIG,
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
  });
  assert.ok(skip.traza, "un skip TAMBIEN se loguea: es la rama que mas se confunde con exito");
  assert.equal(skip.traza.conversacion, "77", "el skip conoce la conversacion y tiene que decirla");

  const noAuth = await handleChatwootWebhook(pedido(body, {}), { config: CONFIG, nowMs: NOW_MS });
  assert.ok(noAuth.traza, "un rechazo de auth es justo lo que hay que ver cuando 'no llegan' los webhooks");
  assert.equal(noAuth.traza.estado, 401);
});

test("HTTP REAL: cada webhook deja UNA linea en el log (era CERO y costo una semana)", async () => {
  const lineas = [];
  const server = createWebhookServer({
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [], stageBefore: "handoff_humano", stageAfter: "handoff_humano" }),
    nowMs: NOW_MS,
    n8nConfig: { enabled: false },
    fireEvent: () => {},
    log: (linea) => lineas.push(linea),
  });
  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();

  try {
    const body = mensajeEntrante({ content: "quiero informacion" });
    const res = await fetch(`http://127.0.0.1:${port}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...sign(body) },
      body,
    });
    assert.equal(res.status, 200);
    await res.json();

    const delWebhook = lineas.filter((l) => l.includes("conv="));
    assert.equal(delWebhook.length, 1, `un webhook = una linea; salieron ${delWebhook.length}: ${JSON.stringify(lineas)}`);
    assert.match(delWebhook[0], /rama=MUDO/, "el turno mudo tiene que verse en el log, no solo en el cuerpo HTTP");
    assert.match(delWebhook[0], /quiero informacion/);
  } finally {
    server.close();
    await once(server, "close");
  }
});
