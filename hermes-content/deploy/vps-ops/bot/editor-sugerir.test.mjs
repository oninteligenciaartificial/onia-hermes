// Editor conversacional: la IA propone, validateKnowledge manda, el humano
// publica. Estos tests fijan el contrato: doc completo o nada, jamas un doc
// invalido puerta afuera, y el "no entendi" es un fallo honesto, no un 500.
import test from "node:test";
import assert from "node:assert/strict";

import { handleEditorRequest, sugerirEdicion } from "./editor-sugerir.mjs";

const DOC = {
  schema: "onia.bot.knowledge/1",
  identity: { productName: "Ferreteria Tornillo", humanName: "Marta" },
  empresa: { horario: { frase: "lun-vie, 9:00-18:00" } },
};
const ENV = { LITELLM_BASE: "http://litellm:4000/v1", LITELLM_KEY: "k", ONIA_BOT_MODEL: "gpt-4.1-mini", ONIA_BOT_PREVIEW_SECRET: "prev" };

function llmQueDevuelve(contenido) {
  return async () => ({
    ok: true, status: 200,
    json: async () => ({ choices: [{ message: { content: typeof contenido === "string" ? contenido : JSON.stringify(contenido) } }] }),
  });
}

test("camino feliz: instruccion aplicada, doc valido sale entero", async () => {
  const docNuevo = { ...DOC, empresa: { horario: { frase: "lun-sab, 9:00-18:00" } } };
  const r = await sugerirEdicion(
    { knowledge: DOC, instruccion: "atende tambien los sabados" },
    { env: ENV, fetch: llmQueDevuelve(docNuevo) },
  );
  assert.equal(r.ok, true);
  assert.equal(r.knowledge.empresa.horario.frase, "lun-sab, 9:00-18:00");
});

test("el LLM devuelve un doc INVALIDO (rompe schema): se rechaza entero", async () => {
  const roto = { identity: { productName: "X" } }; // sin schema
  const r = await sugerirEdicion(
    { knowledge: DOC, instruccion: "lo que sea" },
    { env: ENV, fetch: llmQueDevuelve(roto) },
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "doc_invalido_post_llm");
});

test("el LLM dice error (instruccion imposible): fallo honesto con el motivo", async () => {
  const r = await sugerirEdicion(
    { knowledge: DOC, instruccion: "poneme precios en dolares" },
    { env: ENV, fetch: llmQueDevuelve({ error: "No puedo inventar precios" }) },
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "instruccion_rechazada");
  assert.match(r.errores[0], /precios/);
});

test("respuesta que no es JSON: fallo limpio", async () => {
  const r = await sugerirEdicion(
    { knowledge: DOC, instruccion: "x" },
    { env: ENV, fetch: llmQueDevuelve("claro, aca va el doc: {...}") },
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "respuesta_no_es_json");
});

test("sin key / instruccion vacia / doc invalido: fallos sin red", async () => {
  assert.equal((await sugerirEdicion({ knowledge: DOC, instruccion: "x" }, { env: { ...ENV, LITELLM_KEY: "" } })).reason, "sin_litellm_key");
  assert.equal((await sugerirEdicion({ knowledge: DOC, instruccion: "  " }, { env: ENV })).reason, "instruccion_invalida");
  assert.equal((await sugerirEdicion({ knowledge: null, instruccion: "x" }, { env: ENV })).reason, "doc_invalido");
});

test("handler HTTP: Bearer correcto pasa, incorrecto 401, cuerpo roto 400", async () => {
  const docNuevo = { ...DOC };
  const okRes = await handleEditorRequest(
    { rawBody: JSON.stringify({ knowledge: DOC, instruccion: "nada" }), headers: { authorization: "Bearer prev" } },
    { env: ENV, fetch: llmQueDevuelve(docNuevo) },
  );
  assert.equal(okRes.status, 200);
  assert.equal(okRes.body.ok, true);

  const mal = await handleEditorRequest(
    { rawBody: "{}", headers: { authorization: "Bearer otro" } },
    { env: ENV },
  );
  assert.equal(mal.status, 401);

  const roto = await handleEditorRequest(
    { rawBody: "no-json", headers: { authorization: "Bearer prev" } },
    { env: ENV },
  );
  assert.equal(roto.status, 400);
});
