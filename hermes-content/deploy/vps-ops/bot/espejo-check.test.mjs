// ONIA — el espejo del motor tiene que ser el motor que corre.
//
// El agujero que este test existe para tapar: `hermes-content/deploy/vps-ops/bot/` es el
// ESPEJO de `/opt/onia/bot/` del VPS, y nada verifica que sean iguales. Ya se desincronizo
// dos veces, las dos descubiertas de casualidad y en direcciones opuestas:
//
//   - 2026-08-28 (`d334d776`): el espejo quedo 25 archivos ATRAS del VPS. Trabajar sobre el
//     habria pisado el motor vivo.
//   - 2026-08-31 (esta vuelta): el VPS quedo un commit atras del espejo — le falta `994eb42d`,
//     el que hace que las frases de campaña se vean en modo venta. La cola daba el motor por
//     desplegado y escribia que solo faltaba copiar `knowledge.json`: con el motor viejo esa
//     copia no hace NADA, y el desconocido sigue recibiendo el saludo generico.
//
// Los dos costaron lo mismo: creer que estaba desplegado. Un md5 por lado lo responde.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";

import { compararEspejo, parsearMd5sum } from "./espejo-check.mjs";

test("parsearMd5sum: el prefijo de ruta del VPS no cambia el nombre del archivo", () => {
  const salida = [
    "7f50f1a9f84cbf0a51f28fd811d9a76a  /opt/onia/bot/bot-engine.mjs",
    "679e13da6b84d112ca17be1d9cab998e  /opt/onia/bot/config.mjs",
  ].join("\n");
  assert.deepEqual(parsearMd5sum(salida), {
    "bot-engine.mjs": "7f50f1a9f84cbf0a51f28fd811d9a76a",
    "config.mjs": "679e13da6b84d112ca17be1d9cab998e",
  });
});

test("parsearMd5sum: el asterisco de modo binario tampoco (md5sum de Git Bash lo escribe)", () => {
  // Trampa real: en Windows `md5sum *.mjs` devuelve "hash *nombre.mjs". Sin comerse ese
  // asterisco cada archivo del lado local aparece como "solo en el VPS" y el gate miente entero.
  assert.deepEqual(parsearMd5sum("b5a5c8789ed33b18ea9e490f8a04a64f *bot-engine.mjs"), {
    "bot-engine.mjs": "b5a5c8789ed33b18ea9e490f8a04a64f",
  });
});

test("compararEspejo: espejo igual al VPS => ok", () => {
  const lado = { "bot-engine.mjs": "aaa", "webhook-server.sh": "bbb" };
  const r = compararEspejo(lado, { ...lado });
  assert.equal(r.ok, true);
  assert.deepEqual(r.distintos, []);
  assert.deepEqual(r.soloRepo, []);
  assert.deepEqual(r.soloVps, []);
});

test("compararEspejo: el drift REAL del 2026-08-31 se pone rojo y nombra los archivos", () => {
  // Los md5 son los medidos en vivo: el VPS quedo en `3e3841aa` (comprobantes) y el espejo
  // en `994eb42d` (campañas). Si este caso pasara en verde, el gate no sirve para nada.
  const repo = {
    "bot-engine.mjs": "b5a5c8789ed33b18ea9e490f8a04a64f",
    "knowledge.mjs": "4ba536524a2e2d0cbb6d5ec16e02648c",
    "config.mjs": "679e13da6b84d112ca17be1d9cab998e",
    "campanas-web.test.mjs": "ccc",
  };
  const vps = {
    "bot-engine.mjs": "7f50f1a9f84cbf0a51f28fd811d9a76a",
    "knowledge.mjs": "d00a3c1f35c3ff1739b207d306c13b5c",
    "config.mjs": "679e13da6b84d112ca17be1d9cab998e",
  };
  const r = compararEspejo(repo, vps);
  assert.equal(r.ok, false);
  assert.deepEqual(r.distintos, ["bot-engine.mjs", "knowledge.mjs"]);
  assert.deepEqual(r.soloRepo, ["campanas-web.test.mjs"]);
  assert.deepEqual(r.soloVps, []);
});

test("compararEspejo: knowledge.json vive SOLO en el VPS y eso no es drift", () => {
  // Es el documento publicado del numero, no codigo. El espejo no lo versiona a proposito
  // (`d334d776`: "sin env, sin knowledge.json"), asi que compararlo daria rojo para siempre
  // — y un gate que siempre esta rojo se apaga.
  const r = compararEspejo({ "bot-engine.mjs": "aaa" }, { "bot-engine.mjs": "aaa", "knowledge.json": "xxx" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.soloVps, []);
});

test("compararEspejo: un .json que SI difiere tampoco tumba el gate, pero se reporta", () => {
  const r = compararEspejo({ "knowledge.example.json": "aaa" }, { "knowledge.example.json": "zzz" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.distintos, []);
  assert.deepEqual(r.ignorados, ["knowledge.example.json"]);
});

test("compararEspejo: un archivo que falta en el VPS es drift (deploy a medias)", () => {
  const r = compararEspejo({ "insistencia-run.mjs": "aaa" }, {});
  assert.equal(r.ok, false);
  assert.deepEqual(r.soloRepo, ["insistencia-run.mjs"]);
});

test("compararEspejo: un archivo que sobra en el VPS tambien es drift (el espejo quedo atras)", () => {
  // Es el caso de `d334d776`, el que paso al reves. Si solo miraramos "falta en el VPS",
  // trabajar sobre un espejo viejo seguiria pisando el motor vivo sin aviso.
  const r = compararEspejo({}, { "recepcionista.mjs": "aaa" });
  assert.equal(r.ok, false);
  assert.deepEqual(r.soloVps, ["recepcionista.mjs"]);
});
