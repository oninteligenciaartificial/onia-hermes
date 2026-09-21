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
import { resetOrgKnowledgeCache, KNOWLEDGE_SCHEMA } from "./knowledge.mjs";

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
// 0.a-bis /health CONTESTA SOBRE EL DOCUMENTO QUE LE TOCA AL LEAD, NO SOBRE OTRO
//
// Medido el 2026-09-12: toda conversacion resuelve su conocimiento con
// `ensureKnowledge({ inboxId })` (run-turn.mjs), que sirve la fila PUBLICADA de ese inbox
// apenas exista. `/health` llamaba `knowledgeHealth()` SIN inbox, o sea reportaba el archivo
// del proceso. Mientras no haya filas publicadas los dos coinciden y nada se ve; el dia que
// alguien publique una, /health sigue jurando por el archivo y el gate de precios que le
// pregunta FALLA EN VERDE sobre el documento equivocado.
//
// La cura tiene DOS mitades y las dos se prueban aca:
//   1. `?inboxId=N` resuelve con la MISMA funcion que el camino de respuesta (ensureKnowledge),
//      no con la hermana sincronica que se saltea el primer fetch.
//   2. la respuesta DECLARA el alcance que realmente midio. Sin eso no hay forma de que el que
//      pregunta distinga "te contesto por el inbox 4" de "te contesto por el archivo": es el
//      mismo JSON, y esa ambiguedad ES el defecto.
// ---------------------------------------------------------------------------

/** Un doc minimo y valido, igual que el fixture de knowledge.test.mjs. */
function docValido(extra = {}) {
  return {
    schema: KNOWLEDGE_SCHEMA,
    version: "test.1",
    updatedBy: "test",
    identity: { humanName: "Sergio" },
    ...extra,
  };
}

/** El /published del producto, mockeado: responde con fila SOLO para los inboxes pedidos. */
function publishedDe(porInbox) {
  const pedidos = [];
  const doFetch = async (url) => {
    pedidos.push(String(url));
    const inbox = new URL(String(url)).searchParams.get("inboxId");
    const fila = porInbox[String(inbox)];
    if (!fila) return { status: 404, ok: false, json: async () => ({}) };
    return { status: 200, ok: true, json: async () => ({ data: fila }) };
  };
  return { pedidos, opciones: { dbUrl: "https://prod/published", dbSecret: "s3cr3t", fetch: doFetch } };
}

test("/health?inboxId=N contesta por la fila PUBLICADA de ese inbox, igual que el camino de respuesta", async () => {
  resetOrgKnowledgeCache();
  const { pedidos, opciones } = publishedDe({ 4: docValido({ version: "fila-del-inbox-4" }) });

  const salud = await getHealthStatus(CONFIG, { enabled: false }, { ...DB_SANA, knowledgeOptions: opciones }, { inboxId: "4" });

  assert.equal(salud.knowledge.version, "fila-del-inbox-4", "reporto otro documento que el que recibe el lead");
  assert.equal(salud.knowledge.source, "db");
  assert.equal(salud.knowledge.alcance, "inbox:4", "la respuesta tiene que DECLARAR que midio el inbox");
  assert.equal(pedidos.length, 1, "tiene que PREGUNTARLE al producto, no deducirlo de la cache");
  assert.match(pedidos[0], /inboxId=4/);
  resetOrgKnowledgeCache();
});

test("/health sin inbox DECLARA que midio el proceso — no se puede confundir con una fila por inbox", async () => {
  resetOrgKnowledgeCache();
  const salud = await getHealthStatus(CONFIG, { enabled: false }, DB_SANA);
  assert.equal(salud.knowledge.alcance, "proceso", "sin alcance declarado, el que pregunta no sabe que le contestaron");
});

test("/health con un inboxId que no es un numero declara el alcance que REALMENTE midio", async () => {
  resetOrgKnowledgeCache();
  const { pedidos, opciones } = publishedDe({});
  // Un inbox basura no puede hacerse pasar por una medicion por inbox: seria el mismo falso
  // verde de arriba con otra cara. Se mide el proceso y se dice que se midio el proceso.
  const salud = await getHealthStatus(CONFIG, { enabled: false }, { ...DB_SANA, knowledgeOptions: opciones }, { inboxId: "'; drop--" });
  assert.equal(salud.knowledge.alcance, "proceso");
  assert.equal(pedidos.length, 0, "un inbox invalido no sale a preguntarle nada al producto");
});

test("HTTP REAL: /health?inboxId=N llega hasta la resolucion por inbox por la red", async () => {
  resetOrgKnowledgeCache();
  const { pedidos, opciones } = publishedDe({ 7: docValido({ version: "fila-del-inbox-7" }) });
  const server = createWebhookServer({
    config: CONFIG,
    n8nConfig: { enabled: false },
    runChatwootTurn: motorMock(),
    nowMs: NOW_MS,
    store: { warnings: [], loadConversation: async () => null },
    log: () => {},
    knowledgeOptions: opciones,
  });
  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();
  try {
    const estado = await (await fetch(`http://127.0.0.1:${port}/health?inboxId=7`)).json();
    assert.equal(estado.knowledge.alcance, "inbox:7");
    assert.equal(estado.knowledge.version, "fila-del-inbox-7");
    assert.equal(pedidos.length, 1);
  } finally {
    server.close();
    await once(server, "close");
    resetOrgKnowledgeCache();
  }
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

test("TRAZA: un evento SIN MENSAJE no puede dejar la MISMA linea que una persona sin respuesta", async () => {
  // Medido el 2026-09-12 sobre el log vivo (51.774 lineas): de las 24 `rama=MUDO`, las ultimas 9
  // eran todas `conv=49` —una conversacion de sonda, no una persona— repitiendose cada 30-60 min
  // con `motivo=el motor no produjo respuesta`, que es EXACTAMENTE el motivo que dejaria el bug
  // por el que este log existe: "una persona escribio y el bot se callo". Indistinguibles.
  //
  // La causa, reproducida con el parser real: `conversation_resolved` entra sin `messageId` y sin
  // texto (solo desarma el takeover), corre el turno y no manda nada. Cae al motivo por DEFECTO,
  // el que se escribe cuando ninguna rama supo decir algo mas preciso.
  //
  // Por eso el pipeline va ENTERO y no se le pasa una traza a mano: la propiedad depende de lo que
  // el PARSER entrega (un `messageId` vacio), no de como se formatea despues.
  const resuelto = JSON.stringify({ event: "conversation_resolved", id: 49, status: "resolved", timestamp: 1757661326 });
  const evento = await handleChatwootWebhook(pedido(resuelto, sign(resuelto)), {
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [], stageBefore: "esperando_horario", stageAfter: "esperando_horario" }),
    nowMs: NOW_MS,
  });
  const lineaEvento = formatearTraza(evento.traza);

  // La persona: MISMA rama, MISMO cuerpo vacio, misma etapa. Lo unico distinto es que hubo un
  // mensaje del otro lado — y es lo unico que el log tiene que poder distinguir.
  const persona = mensajeEntrante({ id: 9042, content: "hola, sigo esperando", conversation: { id: 49 } });
  const mudo = await handleChatwootWebhook(pedido(persona, sign(persona)), {
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [], stageBefore: "esperando_horario", stageAfter: "esperando_horario" }),
    nowMs: NOW_MS,
  });
  const lineaPersona = formatearTraza(mudo.traza);

  assert.match(lineaEvento, /rama=MUDO/, "la rama sigue siendo MUDO: el turno corrio y no mando nada");
  assert.match(lineaPersona, /rama=MUDO/);

  const motivoDe = (linea) => (linea.match(/motivo=(.*?)(?: entrada=|$)/) || [])[1];
  assert.notEqual(
    motivoDe(lineaEvento),
    motivoDe(lineaPersona),
    `si los dos motivos son iguales el bug real es indistinguible del ruido: ${motivoDe(lineaEvento)}`,
  );
  assert.match(
    lineaEvento,
    /conversation_resolved/,
    "el motivo tiene que NOMBRAR el evento, como ya hacen sus hermanos (mensaje_no_entrante:outgoing, update_sin_botones)",
  );
  assert.match(
    lineaPersona,
    /motivo=el motor no produjo respuesta/,
    "el bug real CONSERVA su motivo: cerrar el ruido no puede apagar la senal",
  );

  // La misma linea mentia en un segundo campo: `msg=49 conv=49`. No es un id de mensaje — es el de
  // la CONVERSACION repetido, porque el payload de `conversation_resolved` ES la conversacion y
  // `meta.messageId` viene vacio, asi que no lo pisa. Un id inventado manda a buscar a la base un
  // mensaje que no existe. `-` es "no hay"; `?` sigue siendo "no se".
  assert.match(lineaEvento, /msg=-/, "sin mensaje, `msg` no puede afirmar un id");
  assert.doesNotMatch(lineaEvento, /msg=49/, "repetir el id de conversacion en `msg` es un dato falso");
  assert.match(lineaPersona, /msg=9042/, "cuando SI hay mensaje, su id tiene que seguir viajando");
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

test("TRAZA: la linea dice POR QUE CANAL entro, incluso cuando el evento se ignora", async () => {
  // Medido el 2026-09-13 en produccion, cruzando `conversations` de Chatwoot con el log vivo:
  // de los 7 desconocidos reales que escribieron, 4 no recibieron ni una respuesta y 1 murio en
  // el segundo turno — y DOS de los mudos son del inbox 5, el de WhatsApp, que es el canal de
  // leads reales. El log del webhook (46.323 lineas) no trae el inbox en ninguna rama, asi que
  // esa distincion solo se pudo hacer yendo a la base a cruzarla a mano.
  //
  // Por que importa y no es cosmetico: el inbox ES la clave con la que el bot elige QUE
  // documento le contesta al lead (`cacheKeyOf` keyea `inbox:<id>`, y la fuente del panel se
  // aplica a TODOS los alcances). Dos conversaciones con lineas identicas pueden estar
  // cotizando precios distintos, y hoy no hay forma de saberlo desde el log.
  //
  // El `ignorado` es el caso que mas duele y por eso va primero: es la rama mas frecuente (863
  // de 1.312 lineas con `rama=`), la que se descarta sin llamar al motor, y la unica que hoy no
  // pasa por el parser — o sea la que no puede deducir nada sola.
  const saliente = mensajeEntrante({ message_type: "outgoing", inbox: { id: 5 } });
  const ignorado = await handleChatwootWebhook(pedido(saliente, sign(saliente)), {
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [] }),
    nowMs: NOW_MS,
  });
  assert.match(
    formatearTraza(ignorado.traza),
    /inbox=5/,
    "un evento ignorado sin canal no se puede atribuir: es la rama mas frecuente del log",
  );

  // El camino feliz, por el pipeline entero: la propiedad depende de lo que entrega el PARSER
  // (`turn.inbox_id`), no de como se formatea despues.
  const deWhatsapp = mensajeEntrante({ content: "hola, me interesa", inbox: { id: 5 } });
  const feliz = await handleChatwootWebhook(pedido(deWhatsapp, sign(deWhatsapp)), {
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [{ text: "hola", posted: true }] }),
    nowMs: NOW_MS,
  });
  assert.match(formatearTraza(feliz.traza), /inbox=5/, "el canal del lead que SI fue atendido tambien se nombra");

  // `conversation_created` trae el payload PLANO (`inbox_id` top-level), no anidado: es la forma
  // que las otras dos ramas del adapter no miran, y la que se pierde si cada una extrae por su
  // cuenta.
  const creada = JSON.stringify({
    event: "conversation_created",
    id: 88,
    inbox_id: 7,
    messages: [{ id: 5150, content: "hola", message_type: "incoming", created_at: "2026-07-30T18:00:00Z", sender: { id: 9 } }],
  });
  const nueva = await handleChatwootWebhook(pedido(creada, sign(creada)), {
    config: CONFIG,
    runChatwootTurn: motorMock({ sent: [] }),
    nowMs: NOW_MS,
  });
  assert.match(formatearTraza(nueva.traza), /inbox=7/, "el payload plano de conversation_created tambien tiene canal");

  // Y cuando NO se sabe, el campo va igual: si apareciera solo cuando se conoce, un grep por
  // inbox perderia justo las lineas que hay que mirar. La ausencia de una clave codifica una
  // creencia, y aca la creencia seria falsa.
  assert.match(
    formatearTraza({ conversacion: "77", estado: 200, cuerpo: { ok: true, sent: [], warnings: [] } }),
    /inbox=\?/,
    "sin canal conocido el campo sigue presente, con el signo de pregunta",
  );
});

test("TRAZA: un turno que no manda nada pero CAMBIA el estado dice QUE hizo, no solo por que callo", () => {
  // Medido el 2026-09-19 contra produccion. El dueño tiene UN solo camino para devolverle una
  // conversacion al bot despues de contestar el mismo: "Marcar resuelta" en /inbox, que la
  // pantalla vende textual como «Resuelta — tu asistente atiende de nuevo». Ese desarme corre
  // sin mandar un mensaje (`send: []`, `notes: ["takeover_desarmado"]`), asi que cae en la rama
  // MUDO y se escribia IDENTICO a un evento que no hizo nada: «evento sin mensaje
  // (conversation_status_changed): no hay nada que contestar».
  //
  // Por que no es cosmetico: ante «marque resuelta y el bot no volvio» hay TRES causas con
  // remedios opuestos —el evento no llego (suscripcion de Chatwoot), llego y desarmo (el
  // producto esta sano, mirar otro lado), o llego y no desarmo (bug del motor)— y esa linea no
  // distingue ninguna. Con 47.826 lineas de log delante, `grep -c takeover_desarmado` da 0
  // aunque el desarme funcione, que es lo que se midio: el log nunca imprimia las notas. Es la
  // hermana de `48dac281` (un motivo por DEFECTO vuelve indistinguible el ruido de la señal):
  // alla dos causas distintas compartian motivo, aca una rama CON efecto se ve como una sin el.
  //
  // El campo se deriva de las notas del motor —el vocabulario con el que ya declara lo que
  // hizo— y no de una lista de notas "importantes": una lista a mano falla abierta en la nota
  // que se agregue mañana, que es justo la que nadie va a poder diagnosticar.
  const desarmo = formatearTraza({
    conversacion: "49",
    estado: 200,
    eventoSinMensaje: "conversation_status_changed",
    cuerpo: { ok: true, sent: [], warnings: [], notes: ["takeover_desarmado"] },
  });
  assert.match(desarmo, /rama=MUDO/, "sigue siendo MUDO: el turno corrio y no mando nada");
  assert.match(desarmo, /takeover_desarmado/, "la linea tiene que nombrar el efecto que tuvo");

  // La MITAD que hace util al campo: el mismo evento SIN efecto no puede decir que hizo algo,
  // o `hizo=` se vuelve decoracion y volvemos a no poder distinguir las dos.
  const sinEfecto = formatearTraza({
    conversacion: "49",
    estado: 200,
    eventoSinMensaje: "conversation_status_changed",
    cuerpo: { ok: true, sent: [], warnings: [], notes: [] },
  });
  assert.doesNotMatch(sinEfecto, /hizo=/, "sin notas del motor no se inventa un efecto");
  assert.match(sinEfecto, /no hay nada que contestar/, "y conserva el motivo que ya explicaba el silencio");
  assert.notEqual(desarmo, sinEfecto, "las dos lineas tienen que poder distinguirse");
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

test("HTTP REAL: el aviso que NO sale dice DE QUIEN era (sin eso no se puede recuperar)", async () => {
  // Medido en produccion el 2026-09-04: con el flag apagado el log dejaba exactamente esto
  //     [aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)
  // y no hay forma de saber a quien habia que atender. La linea del webhook de al lado si trae
  // `conv=`, pero son dos callbacks asincronos distintos: con dos mensajes a la vez el `[aviso]`
  // se intercala con la linea de OTRA conversacion y el cruce por proximidad miente.
  //
  // El propio aviso-telegram.mjs ya dice "un aviso que no dice a quien contestarle no sirve" y
  // aplica esa regla al mensaje que le llega a Sergio. Falta aplicarla a la linea que queda
  // cuando el aviso NO llega, que es el unico caso en que hace falta.
  const lineas = [];
  const server = createWebhookServer({
    config: CONFIG,
    runChatwootTurn: motorMock({
      stageBefore: "nuevo",
      stageAfter: "handoff_humano",
      notify: [{ kind: "handoff", reason: "cuota_agotada", text: "quiero una limpieza dental" }],
    }),
    nowMs: NOW_MS,
    n8nConfig: { enabled: false },
    fireEvent: () => {},
    avisoConfig: { enabled: false }, // el estado REAL de produccion hoy
    log: (linea) => lineas.push(linea),
  });
  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();

  try {
    const body = mensajeEntrante({ content: "hola, quiero una limpieza dental" });
    const res = await fetch(`http://127.0.0.1:${port}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...sign(body) },
      body,
    });
    assert.equal(res.status, 200);
    await res.json();

    // El aviso es fire-and-forget: su callback corre despues de la respuesta HTTP.
    for (let i = 0; i < 50 && !lineas.some((l) => l.includes("[aviso]")); i += 1) {
      await new Promise((r) => setTimeout(r, 10));
    }

    const delAviso = lineas.filter((l) => l.includes("[aviso]"));
    assert.equal(delAviso.length, 1, `el aviso deja UNA linea; salieron ${delAviso.length}: ${JSON.stringify(lineas)}`);
    assert.match(delAviso[0], /skipped/, "apagado tiene que verse como skipped, no como exito");
    assert.match(delAviso[0], /conv=77/, "sin la conversacion el aviso perdido NO se puede recuperar");
    assert.match(delAviso[0], /cuota_agotada/, "el motivo tambien: dice por que el bot derivo");
  } finally {
    server.close();
    await once(server, "close");
  }
});

// ---------------------------------------------------------------------------
// UN CIRCUITO DEGRADADO QUE CONTESTA BIEN — 2026-09-19.
//
// Los avisos solo salian a la luz cuando el bot se callaba (`MUDO` / `NO_ENTREGADO`): en
// `rama=respondio` el campo `motivo` queda sin definir y los warnings morian en el aire. Eso
// tapa justo la falla mas cara de detectar — la que NO se nota. El caso real: con Speaches
// caido, el respaldo de OpenAI salva el turno, el prospecto recibe su respuesta correcta y
// nadie se entera de que el destino barato esta muerto ni de que cada nota de voz factura.
// Un circuito degradado que no se ve se vuelve normal.
// ---------------------------------------------------------------------------

test("TRAZA: contesto BIEN pero degradado -> el aviso se ve igual", () => {
  const linea = formatearTraza({
    conversacion: "58",
    mensaje: "1437",
    inbox: "5",
    estado: 200,
    cuerpo: {
      ok: true,
      stageBefore: "nuevo",
      stageAfter: "esperando_horario",
      sent: [{ text: "¡Hola!", posted: true }],
      warnings: [
        "audio: Speaches no respondio: getaddrinfo ENOTFOUND speaches",
        "audio: contesto el respaldo openai (gpt-4o-mini-transcribe) — el primario esta caido",
      ],
    },
  });

  assert.match(linea, /rama=respondio/, "el turno SI salio bien: la rama no se toca");
  assert.match(linea, /aviso=/, "un turno degradado que no deja linea se vuelve el estado normal");
  assert.match(linea, /respaldo openai/, "y tiene que decir QUIEN contesto, o nadie arregla el primario");
});

test("TRAZA: un turno sano no ensucia el log con un campo vacio", () => {
  const linea = formatearTraza({
    conversacion: "58",
    estado: 200,
    cuerpo: { ok: true, sent: [{ text: "hola", posted: true }], warnings: [] },
  });
  assert.match(linea, /rama=respondio/);
  assert.ok(!/aviso=/.test(linea), "sin avisos no hay campo: 47.000 lineas con un `aviso=` vacio es ruido");
});

test("TRAZA: la rama MUDA sigue explicandose con su motivo, no con el campo nuevo", () => {
  const linea = formatearTraza({
    conversacion: "58",
    estado: 200,
    cuerpo: { ok: true, sent: [], warnings: ["audio: sin transcripción (stt_fallido)"] },
  });
  assert.match(linea, /rama=MUDO/);
  assert.match(linea, /motivo=audio: sin transcripción/, "el motivo del silencio manda: es lo primero que se lee");
  assert.ok(!/aviso=/.test(linea), "no se dice dos veces lo mismo en la misma linea");
});
