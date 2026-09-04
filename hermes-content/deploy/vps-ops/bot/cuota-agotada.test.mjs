// ONIA — CUOTA MENSUAL AGOTADA (lote 4, paso 13, 2026-09-03): el bot deja de CALLAR.
//
// Antes, cuando una org agotaba sus conversaciones automaticas del mes, el producto dejaba de
// servir y el cliente del cliente escribia al vacio. Ahora /published manda
// `cuota: { agotada, usadas, limite } | null` y el motor:
//   - agotada  => texto fijo honesto (R_CUOTA_AGOTADA, jamas LLM) + handoff UNA vez por conversacion
//   - no agotada / null / ausente => exactamente el comportamiento de siempre (fail-open)
//
// Determinista: cero red real (fetch inyectado), cero Date.now().
//   node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";
import {
  applyKnowledge, asRecepcionista, cuotaAgotada, DEFAULT_TTL_MS, getOrgKnowledge,
  resetOrgKnowledgeCache, withKnowledge,
} from "./knowledge.mjs";

/** Reloj fijo: la cache tiene TTL y el test necesita cruzarlo sin Date.now(). */
const NOW_MS = Date.parse("2026-09-04T15:00:00Z");

test.afterEach(() => resetOrgKnowledgeCache());

const DOC = {
  schema: "onia.bot.knowledge/1",
  version: "test-cuota",
  identity: {
    productName: "Clínica Sonrisa",
    humanName: "la encargada",
    botName: "el asistente de Clínica Sonrisa",
  },
  empresa: { horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 19, frase: "lun-sab, 8:00-19:00" } },
  demo: { duracionMinutos: 20, duracionFrase: "20 minutos", modalidad: "visita en la clínica" },
  productos: [{ key: "limpieza", tipo: "servicio", nombre: "limpieza dental" }],
};
const TEXTO = /^Este mes ya atendimos el máximo de conversaciones automáticas de Clínica Sonrisa\. Te responde una persona en breve\./;

const configCon = (cuota) => asRecepcionista(applyKnowledge(DEFAULT_CONFIG, DOC), DOC, null, cuota);
const nuevo = () => createState({ channel: "sim", contactRef: "cuota" });
const turno = (config, state, text) =>
  step(state, { text, receivedAt: "2026-09-04T15:00:00Z" }, { config, llm: () => { throw new Error("el LLM NO se llama con la cuota agotada"); } });
const tipos = (result) => result.sideEffects.map((effect) => effect.type);

test("cuota agotada: texto fijo con el nombre del negocio, sin LLM, y handoff UNA sola vez", () => {
  const config = configCon({ agotada: true, usadas: 500, limite: 500 });

  const r1 = turno(config, nuevo(), "hola, quiero una limpieza");
  assert.equal(r1.replies.length, 1);
  assert.equal(r1.replies[0].templateKey, "R_CUOTA_AGOTADA");
  assert.match(r1.replies[0].text, TEXTO);
  assert.ok(r1.replies.every((reply) => !reply.pending), "ninguna respuesta queda pendiente de LLM");
  assert.equal(r1.nextState.botStage, "handoff_humano", "la conversacion queda marcada para un humano");
  assert.ok(tipos(r1).includes("review_queue") && tipos(r1).includes("notify_sergio"), "escala por la via del handoff");
  const aviso = r1.sideEffects.find((effect) => effect.type === "notify_sergio");
  assert.equal(aviso.payload.reason, "cuota_agotada");
  assert.ok(r1.notes.includes("handoff:cuota_agotada"));

  // Segundo mensaje: MISMO texto (nunca silencio), pero cero efectos nuevos (ya se derivo).
  const r2 = turno(config, r1.nextState, "¿y cuánto cuesta?");
  assert.match(r2.replies[0].text, TEXTO);
  assert.deepEqual(r2.sideEffects, []);
  assert.equal(r2.nextState.botStage, "handoff_humano");
  assert.ok(r2.notes.includes("cuota_agotada:ya_derivada"));
});

test("cuota agotada: un humano a cargo sigue ganando (silencio), y el opt-out tambien", () => {
  const config = configCon({ agotada: true, usadas: 500, limite: 500 });
  const humano = turno(config, { ...nuevo(), humanTookOver: true }, "hola");
  assert.deepEqual(humano.replies, []);
  const baja = turno(config, { ...nuevo(), optOutAt: "2026-09-01T00:00:00Z" }, "hola");
  assert.deepEqual(baja.replies, []);
});

test("cuota NO agotada: el recepcionista contesta como siempre", () => {
  const r = turno(configCon({ agotada: false, usadas: 3, limite: 500 }), nuevo(), "hola");
  assert.deepEqual(r.replies.map((reply) => reply.templateKey), ["M0R"]);
  assert.doesNotMatch(r.replies[0].text, /máximo de conversaciones/);
});

test("cuota null o ausente: fail-open, exactamente el comportamiento de siempre", () => {
  for (const cuota of [null, undefined, "si", { usadas: 1 }]) {
    const config = configCon(cuota);
    assert.equal(config.cuota, null, `cuota ${JSON.stringify(cuota)} no es un veredicto`);
    const r = turno(config, nuevo(), "hola");
    assert.deepEqual(r.replies.map((reply) => reply.templateKey), ["M0R"]);
  }
});

// El CABLE entero: /published manda `cuota` -> la cache la guarda -> withKnowledge la pone en la config.
function fetchFalso(cuota) {
  return async () => ({
    ok: true,
    status: 200,
    json: async () => ({ data: DOC, version: 1, updatedBy: "test", orgSlug: null, ...(cuota === undefined ? {} : { cuota }) }),
  });
}
const ORG = "org_cuota";
const DB_OPTS = { dbUrl: "http://producto/api/chatbot-knowledge/published", dbSecret: "s3cr3t" };

test("db: la cuota de /published llega a la config del turno; sin cuota o malformada queda null", async () => {
  const conCuota = { ...DB_OPTS, fetch: fetchFalso({ agotada: true, usadas: 500, limite: 500 }) };
  const state = await getOrgKnowledge(ORG, conCuota);
  assert.deepEqual(state.cuota, { agotada: true, usadas: 500, limite: 500 });
  const config = withKnowledge(DEFAULT_CONFIG, { organizationId: ORG, ...conCuota });
  assert.equal(config.modo, "recepcionista");
  assert.equal(config.cuota.agotada, true);

  resetOrgKnowledgeCache();
  assert.equal((await getOrgKnowledge(ORG, { ...DB_OPTS, fetch: fetchFalso(undefined) })).cuota, null);
  resetOrgKnowledgeCache();
  assert.equal((await getOrgKnowledge(ORG, { ...DB_OPTS, fetch: fetchFalso({ agotada: "true" }) })).cuota, null);
});

// --- LA CUOTA NO SE HEREDA DE UNA LECTURA QUE FALLO (2026-09-04) ---
//
// `nextOrgCache` conserva la ultima copia buena cuando el fetch falla, y eso es correcto para el
// CONOCIMIENTO: una FAQ vieja sirve. Pero arrastraba tambien `cuota`, que no es contenido: es un
// INTERRUPTOR DE CORTE. Con `agotada:true` guardado, cualquier tramo sin producto (deploy de
// onia-platform, 404 porque el dueño apago y prendio el add-on, red caida) deja al bot cortando a
// TODOS los que escriban a ese cliente — y el 1 del mes que viene, cuando el cupo ya se renovo, la
// unica forma de soltarlo es reiniciar el proceso. Callar a un cliente que paga es mas caro que
// unos mensajes de mas: sin dato fresco, `cuota` vuelve a null, que este mismo archivo define como
// "no se sabe = se atiende".
const fetchRoto = () => { throw new Error("red caida"); };
const fetch404 = async () => ({ ok: false, status: 404, json: async () => ({ error: "Sin conocimiento publicado" }) });

for (const [comoFalla, fetch] of [["la red se cae", fetchRoto], ["el producto contesta 404", fetch404]]) {
  test(`db: con la cuota agotada guardada y ${comoFalla}, el bot SIGUE atendiendo (la cuota no se hereda)`, async () => {
    const agotada = { ...DB_OPTS, fetch: fetchFalso({ agotada: true, usadas: 500, limite: 500 }) };
    assert.equal((await getOrgKnowledge(ORG, { ...agotada, nowMs: NOW_MS })).cuota.agotada, true);

    const state = await getOrgKnowledge(ORG, { ...DB_OPTS, fetch, nowMs: NOW_MS + DEFAULT_TTL_MS + 1 });
    assert.equal(state.data.identity.productName, "Clínica Sonrisa", "el conocimiento SI se conserva");
    assert.equal(state.cuota, null, "el interruptor de corte NO se hereda de una lectura que fallo");

    const config = withKnowledge(DEFAULT_CONFIG, {
      organizationId: ORG, ...DB_OPTS, fetch, nowMs: NOW_MS + DEFAULT_TTL_MS + 1,
    });
    assert.equal(cuotaAgotada(config), false, "sin dato fresco no se corta: null = no se sabe = atender");
    const salida = turno(config, nuevo(), "hola, quiero una limpieza dental");
    assert.doesNotMatch(salida.replies[0].text, TEXTO, "no le puede decir 'cupo lleno' a quien escribe");
  });
}
