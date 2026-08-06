// ONIA — Chatbot propio: SERVIDOR DE WEBHOOK. n8n SALE DEL CAMINO CRÍTICO.
//
// ANTES (n8n adentro del camino de respuesta):
//   Chatwoot -> n8n -> SSH -> chatwoot-adapter.sh -> md5sum de *.mjs + docker cp + docker exec
//            -> node (arranque en frío) -> runTurn -> API de Chatwoot
//   n8n caído o trabado = BOT MUDO. Y el salto extra se paga en cada mensaje, con el VPS al
//   240% de carga (load 9,6 sobre 4 núcleos, swap al 80%).
//
// AHORA (patrón de Bolivian Electric, `apps/web/app/api/chatwoot/webhook/route.ts`):
//   Chatwoot -> ESTE servidor (proceso caliente) -> runChatwootTurn -> API de Chatwoot
//            -> n8n fire-and-forget, DESPUÉS de responder, sin esperarlo
//   n8n caído = se pierde una fila de analítica. El prospecto ya fue atendido.
//
// Lo que se elimina por mensaje: el salto a n8n, el SSH, el `md5sum` de todos los `.mjs`, el
// `docker cp` y el arranque en frío de Node. El proceso queda vivo y el módulo ya importado.
//
// ORDEN DEL PIPELINE (no negociable, cada paso es más caro que el anterior):
//   1. método + ruta            5. dedup por id de mensaje  -> 200 `deduped`
//   2. tope de tamaño del body  6. correr el turno (motor + Chatwoot)
//   3. AUTENTICAR -> 401/503    7. responder 200
//   4. parsear -> 400 / skip    8. recién ahí, disparar el evento a n8n (desacoplado)
//
// REGLA DE ORO DE LOS CÓDIGOS DE ESTADO: salvo auth y JSON roto, TODO devuelve 2xx. Chatwoot
// reintrega los webhooks no-2xx: un 500 nuestro se traduce en que el prospecto recibe la misma
// respuesta dos veces. Un error interno se reporta en el cuerpo con 200, no reventando.
//
// El motor (`bot-engine.mjs`) NO se toca: este archivo es transporte y nada más.
//
// Config (nada secreto vive en el repo — ver webhook-server.sh y N8N_WORKFLOW.md §10.9):
//   ONIA_WEBHOOK_PORT                        default 3020
//   ONIA_CHATWOOT_WEBHOOK_SECRET             secreto HMAC de la firma
//   ONIA_CHATWOOT_WEBHOOK_PATH_SECRET        secreto en la URL (el que siempre funciona)
//   ONIA_CHATWOOT_SIGNATURE_TOLERANCE_SECONDS  default 300
//   ONIA_CHATWOOT_ALLOW_UNSIGNED=true        SÓLO local. Sin esto, sin secreto = 503.
//   ONIA_WEBHOOK_MAX_BODY_BYTES              default 1 MiB
//   ONIA_N8N_ENABLED / ONIA_N8N_EVENT_URL / ONIA_N8N_EVENT_SECRET  (ver n8n-event.mjs)

import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

import { parseChatwootWebhook, runChatwootTurn } from "./chatwoot-adapter.mjs";
import { authenticateChatwootRequest, DEFAULT_TOLERANCE_SECONDS } from "./webhook-security.mjs";
import { shouldProcessMessage, releaseMessage } from "./message-dedup.mjs";
import { buildBotTurnEvent, fireN8nBotTurnEvent, getN8nEventConfig } from "./n8n-event.mjs";
import { knowledgeHealth } from "./knowledge.mjs";

export const DEFAULT_PORT = 3020;
export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;
export const WEBHOOK_PATH = "/webhook/chatwoot";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export function getServerConfig(env = process.env) {
  const tolerance = Number(env.ONIA_CHATWOOT_SIGNATURE_TOLERANCE_SECONDS);
  const maxBody = Number(env.ONIA_WEBHOOK_MAX_BODY_BYTES);
  const port = Number(env.ONIA_WEBHOOK_PORT);

  return {
    port: Number.isFinite(port) && port > 0 ? port : DEFAULT_PORT,
    webhookSecret: String(env.ONIA_CHATWOOT_WEBHOOK_SECRET ?? "").trim() || undefined,
    pathSecret: String(env.ONIA_CHATWOOT_WEBHOOK_PATH_SECRET ?? "").trim() || undefined,
    toleranceSeconds: Number.isFinite(tolerance) ? tolerance : DEFAULT_TOLERANCE_SECONDS,
    allowUnsigned: String(env.ONIA_CHATWOOT_ALLOW_UNSIGNED ?? "").toLowerCase() === "true",
    maxBodyBytes: Number.isFinite(maxBody) && maxBody > 0 ? maxBody : DEFAULT_MAX_BODY_BYTES,
  };
}

/**
 * Estado para `GET /health`. NUNCA devuelve un secreto: sólo si está o no está.
 * `knowledge` es obligatorio y no decorativo: sin ver la FUENTE y la VERSIÓN que el bot está
 * usando, "edité el JSON y no pasó nada" tarda días en descubrirse — que es exactamente el modo
 * de falla que ya nos costó caro con `sync-onia-core.mjs`.
 */
export function getHealthStatus(config = getServerConfig(), n8nConfig = getN8nEventConfig(), knowledge = knowledgeHealth()) {
  const authOk = Boolean(config.webhookSecret || config.pathSecret || config.allowUnsigned);
  return {
    ok: authOk,
    service: "onia-chatbot-webhook",
    auth: {
      firma: Boolean(config.webhookSecret),
      ruta: Boolean(config.pathSecret),
      sinVerificar: Boolean(config.allowUnsigned),
      // Se grita fuerte: sin esto el endpoint no procesa nada y hay que enterarse mirando /health,
      // no descubriéndolo porque el bot no contesta.
      aviso: authOk ? undefined : "SIN SECRETO CONFIGURADO: el webhook responde 503 a todo.",
    },
    n8n: { enabled: n8nConfig.enabled, configurado: Boolean(n8nConfig.url && n8nConfig.secret) },
    // source: "file" = manda knowledge.json · "code" = se cayó a los valores del código.
    // Caer a "code" después de haber sido "file" es la alarma: alguien editó y el bot no lo tomó.
    knowledge,
  };
}

// ---------------------------------------------------------------------------
// Ruta
// ---------------------------------------------------------------------------

/**
 * `/webhook/chatwoot` o `/webhook/chatwoot/<secreto>` -> { match, pathSecret }.
 * El querystring se descarta: un secreto en la query se termina logueando en cualquier proxy.
 */
export function matchWebhookPath(url) {
  const path = String(url || "").split("?")[0].replace(/\/+$/, "") || "/";
  if (path === WEBHOOK_PATH) return { match: true, pathSecret: "" };
  if (path.startsWith(`${WEBHOOK_PATH}/`)) {
    return { match: true, pathSecret: decodeURIComponent(path.slice(WEBHOOK_PATH.length + 1)) };
  }
  return { match: false, pathSecret: "" };
}

// ---------------------------------------------------------------------------
// El manejador — PURO respecto del socket (recibe strings, devuelve un objeto).
// Así se testea el pipeline entero sin levantar un servidor ni abrir un puerto.
// ---------------------------------------------------------------------------

/**
 * @param {object} request { rawBody, headers, method, url }
 * @param {object} [deps]  { config, runChatwootTurn, shouldProcessMessage, nowMs, nowIso, ... }
 * @returns {Promise<{status:number, body:object, n8nEvent?:object}>}
 *          `n8nEvent` presente = el llamador debe dispararlo DESPUÉS de responder.
 */
export async function handleChatwootWebhook(request = {}, deps = {}) {
  const config = deps.config || getServerConfig();
  const method = String(request.method || "POST").toUpperCase();

  if (method !== "POST") {
    return { status: 405, body: { ok: false, reason: "metodo_no_permitido" } };
  }

  const route = matchWebhookPath(request.url);
  if (!route.match) {
    return { status: 404, body: { ok: false, reason: "ruta_desconocida" } };
  }

  const rawBody = String(request.rawBody ?? "");
  if (rawBody.length > config.maxBodyBytes) {
    return { status: 413, body: { ok: false, reason: "payload_demasiado_grande" } };
  }

  // 3. AUTENTICAR antes de parsear: no se gasta ni un JSON.parse en un payload no autenticado.
  const auth = authenticateChatwootRequest(
    { rawBody, headers: request.headers, pathSecret: route.pathSecret },
    config,
    deps.nowMs ?? Date.now(),
  );
  if (!auth.ok) {
    return { status: auth.status, body: { ok: false, reason: auth.reason } };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // 400: un JSON roto no es un reintento que valga la pena; que Chatwoot lo marque como fallo.
    return { status: 400, body: { ok: false, reason: "json_invalido" } };
  }

  // 4. Parseo del canal. Saliente / nota privada / evento ajeno se cortan acá: es LA regla de oro
  // (si no, la respuesta del bot dispara su propio webhook y se contesta a sí mismo en loop).
  const parsed = parseChatwootWebhook(payload);
  if (parsed.skip) {
    // Ojo: NO se consume el dedup en un skip. Marcar como "visto" un mensaje que nunca se
    // procesó haría que una reentrega legítima se descarte.
    return { status: 200, body: { ok: true, skipped: true, reason: parsed.reason } };
  }

  // 5. Dedup. `message_key` = `chatwoot:<conversationId>:<messageId>`, LA MISMA clave que usa el
  // dedup durable de base (`bot_messages.message_key`). Éste es el filtro barato de adelante.
  const dedupKey = parsed.turn?.message_key;
  const dedupFn = typeof deps.shouldProcessMessage === "function" ? deps.shouldProcessMessage : shouldProcessMessage;
  if (!dedupFn(dedupKey, deps.nowMs ?? Date.now())) {
    return {
      status: 200,
      body: { ok: true, skipped: false, deduped: true, duplicate: true, sent: [], reason: "mensaje_ya_procesado" },
    };
  }

  // 6. El turno. Fail-open: cualquier excepción inesperada tiene que terminar en 200, no en 500.
  const runFn = typeof deps.runChatwootTurn === "function" ? deps.runChatwootTurn : runChatwootTurn;
  let result;
  try {
    // `config` se SACA a proposito antes de bajar al motor. Arriba (createWebhookServer) el
    // servidor se inyecta a si mismo su config con `{ ...deps, config }`, pero esa `config` es la
    // del TRANSPORTE (webhookSecret, pathSecret, maxBodyBytes). El motor lee `deps.config`
    // esperando la config del BOT (qualification, slots, script): si le llega la del transporte,
    // `config.qualification` es undefined y el turno muere con "reading 'fields'" — o sea, el bot
    // no le contesta a NADIE. Sacandola, run-turn.mjs cae a `resolveConfig()`, que es justo lo que
    // tiene que pasar en produccion. El resto de los inyectables (client, runTurn, fetch) siguen.
    const { config: _configDelTransporte, ...depsDelTurno } = deps;
    result = await runFn(payload, depsDelTurno);
  } catch (error) {
    // Se suelta la clave: el turno murió ANTES de mandar nada, así que un reintento de Chatwoot
    // (o que el prospecto reescriba) tiene que poder procesarse. Si se dejara reclamada, el
    // mensaje quedaría descartado 10 minutos sin que nadie le haya contestado nunca.
    const releaseFn = typeof deps.releaseMessage === "function" ? deps.releaseMessage : releaseMessage;
    releaseFn(dedupKey);
    return {
      status: 200,
      body: {
        ok: false,
        skipped: false,
        duplicate: false,
        sent: [],
        error: "error_interno",
        reason: String(error?.message || error).slice(0, 300),
      },
    };
  }

  // 7/8. La respuesta se devuelve YA; el evento de n8n viaja aparte para que el llamador lo
  // dispare después de escribirla.
  const n8nEvent = buildBotTurnEvent({
    parsed,
    result,
    rawText: parsed.turn?.text,
    nowIso: deps.nowIso,
  });

  return { status: 200, body: result, n8nEvent };
}

// ---------------------------------------------------------------------------
// Servidor HTTP
// ---------------------------------------------------------------------------

function readBody(req, maxBytes) {
  return new Promise((resolve) => {
    let data = "";
    let bytes = 0;
    let aborted = false;

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      if (aborted) return;
      bytes += Buffer.byteLength(chunk, "utf8");
      // Corte duro: un body gigante no puede comerse la RAM de un VPS que ya está en swap.
      if (bytes > maxBytes) {
        aborted = true;
        resolve({ tooLarge: true, body: "" });
        // Cortar el socket. Sin esto seguimos recibiendo (y descartando) todo lo que el cliente
        // quiera mandar: el corte de RAM protege el buffer, no el ancho de banda ni el socket.
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on("end", () => {
      if (!aborted) resolve({ tooLarge: false, body: data });
    });
    req.on("error", () => {
      if (!aborted) resolve({ tooLarge: false, body: data });
    });
  });
}

function writeJson(res, status, payload) {
  // El stringify va protegido aunque el call site tenga su propio try: `payload` es lo que
  // devuelve runChatwootTurn, que no se controla desde este archivo. Una referencia circular o
  // un BigInt tiraría de forma sincrona dentro de un handler `async` -> unhandled rejection ->
  // proceso caido -> el bot queda mudo para TODOS hasta reinicio manual. Es peor que el
  // problema que este archivo existe para evitar.
  let body;
  try {
    body = JSON.stringify(payload);
  } catch (error) {
    status = 200; // 200 a proposito: un 500 hace que Chatwoot reintente y duplique la respuesta.
    body = JSON.stringify({
      ok: false,
      error: "serializacion_fallida",
      reason: String(error?.message || error).slice(0, 200),
    });
  }
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Crea el servidor. No llama a `listen()`: eso lo hace `main()`, así un test puede crearlo sin
 * abrir un puerto.
 * @param {object} [deps] inyectables: { config, n8nConfig, handle, fireEvent, log, fetch }
 */
export function createWebhookServer(deps = {}) {
  const config = deps.config || getServerConfig();
  const n8nConfig = deps.n8nConfig || getN8nEventConfig();
  const handle = typeof deps.handle === "function" ? deps.handle : handleChatwootWebhook;
  const fireEvent = typeof deps.fireEvent === "function" ? deps.fireEvent : fireN8nBotTurnEvent;
  const log = typeof deps.log === "function" ? deps.log : (line) => process.stdout.write(`${line}\n`);

  return createServer(async (req, res) => {
    // Defensa en profundidad: si el cliente corta a mitad de la respuesta, un evento `error`
    // sin listener escala a excepcion no capturada y mata el proceso. Misma familia de riesgo
    // que el stringify de writeJson.
    res.on("error", () => {});
    req.on("error", () => {});

    const url = String(req.url || "/");

    if (req.method === "GET" && url.split("?")[0].replace(/\/+$/, "") === "/health") {
      writeJson(res, 200, getHealthStatus(config, n8nConfig));
      return;
    }

    let outcome;
    try {
      const { tooLarge, body } = await readBody(req, config.maxBodyBytes);
      outcome = tooLarge
        ? { status: 413, body: { ok: false, reason: "payload_demasiado_grande" } }
        : await handle({ rawBody: body, headers: req.headers, method: req.method, url }, { ...deps, config });
    } catch (error) {
      // Última red de contención: el proceso NO se cae y Chatwoot no recibe un 500 que lo haga
      // reintregar (respuesta duplicada al prospecto).
      outcome = {
        status: 200,
        body: { ok: false, error: "error_interno", reason: String(error?.message || error).slice(0, 300) },
      };
    }

    // Escribir también puede fallar (el cliente cortó la conexión y el socket ya está muerto).
    // Esto va FUERA del try de arriba a propósito, así que necesita el suyo: en un handler
    // `async` una excepción acá es un unhandled rejection, y eso mata el proceso de Node — o sea
    // el bot entero — por un socket que se cerró antes de tiempo.
    try {
      writeJson(res, outcome.status, outcome.body);
    } catch (error) {
      log(`[webhook] no se pudo escribir la respuesta: ${String(error?.message || error)}`);
    }

    // FIRE-AND-FORGET, ya con la respuesta escrita. Si n8n está caído, colgado o mal
    // configurado, nadie se entera acá: el prospecto ya fue atendido.
    // El turno YA se completó, así que esto corre aunque la escritura de arriba haya fallado.
    if (outcome.n8nEvent) {
      try {
        fireEvent(outcome.n8nEvent, n8nConfig, deps, (result) => {
          if (result && result.ok === false) log(`[n8n] ${result.reason}`);
        });
      } catch (error) {
        log(`[n8n] no se pudo disparar el evento: ${String(error?.message || error)}`);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

export function main(deps = {}) {
  const config = deps.config || getServerConfig();
  const server = createWebhookServer({ ...deps, config });
  const health = getHealthStatus(config, deps.n8nConfig || getN8nEventConfig());

  // Timeouts explicitos en vez del default de Node: un cliente que abre el socket y no manda
  // nada no puede quedarse colgado ocupando un handle.
  server.requestTimeout = 30_000;
  server.headersTimeout = 20_000;

  // Red final: NADA puede tumbar este proceso. Si el bot se cae, queda mudo para todos los
  // prospectos hasta que alguien lo reinicie a mano — y nadie se entera hasta que un cliente
  // se queja. Preferimos un proceso vivo con un error logueado.
  process.on("uncaughtException", (error) => {
    process.stdout.write(`[onia-webhook] excepcion no capturada (proceso sigue vivo): ${String(error?.stack || error)}\n`);
  });
  process.on("unhandledRejection", (reason) => {
    process.stdout.write(`[onia-webhook] promesa rechazada sin catch (proceso sigue vivo): ${String(reason)}\n`);
  });

  server.listen(config.port, () => {
    process.stdout.write(`[onia-webhook] escuchando en :${config.port}${WEBHOOK_PATH}\n`);
    if (!health.ok) process.stdout.write(`[onia-webhook] ${health.auth.aviso}\n`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
    // Si algún socket queda colgado, no se espera para siempre.
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return server;
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
