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
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { compararEspejo, ladoVps, md5Archivo, md5Local, parsearMd5sum } from "./espejo-check.mjs";

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

// --- El fin de linea NO es drift en un .mjs, y SI lo es en un .sh -------------------------
//
// `onia-hermes` tiene `core.autocrlf=true` y no tiene `.gitattributes`: git guarda el blob en
// LF y lo materializa en CRLF al hacer checkout. O sea que un `git checkout --` sobre el espejo
// cambia los BYTES de un archivo sin cambiar una sola linea de codigo — medido el 2026-08-31:
// `recepcionista.mjs` paso de 14110 bytes (LF, lo que corre el VPS) a 14375 (CRLF), +265,
// exactamente una por linea, con `git status --porcelain` VACIO y `diff` normalizando \r vacio.
//
// Como el gate compara md5 de bytes, eso fabricaba un "deploy pendiente" que nadie pidio. Es el
// molde exacto del fantasma que este carril sangra: un rojo que no corresponde a ningun cambio
// se apaga, o se "arregla" con un scp inutil al VPS.
//
// La asimetria es a proposito y no se puede colapsar: en un `.sh` el CRLF NO es cosmetico
// (`#!/bin/bash\r` no arranca), asi que ahi el byte tiene que seguir contando.

test("md5Archivo: en un .mjs, CRLF y LF con el mismo codigo dan el MISMO hash", () => {
  const lf = Buffer.from("const a = 1;\nexport default a;\n");
  const crlf = Buffer.from("const a = 1;\r\nexport default a;\r\n");
  assert.notEqual(lf.length, crlf.length, "el fixture tiene que diferir en bytes, si no no prueba nada");
  assert.equal(md5Archivo("bot-engine.mjs", crlf), md5Archivo("bot-engine.mjs", lf));
});

test("md5Archivo: en un .sh, CRLF y LF dan hashes DISTINTOS — ahi el byte importa", () => {
  const lf = Buffer.from("#!/bin/bash\necho hola\n");
  const crlf = Buffer.from("#!/bin/bash\r\necho hola\r\n");
  assert.notEqual(md5Archivo("webhook-server.sh", crlf), md5Archivo("webhook-server.sh", lf));
});

test("md5Archivo: normalizar NO tapa el drift real (el caso medido hoy en el VPS)", () => {
  // `recepcionista.test.mjs`: 9783 bytes en el espejo, 0 bytes en el VPS (md5 del archivo
  // vacio, d41d8cd9...). Si normalizar pusiera esto en verde, el gate dejaria de servir.
  const espejo = Buffer.from("import test from 'node:test';\r\ntest('x', () => {});\r\n");
  const vps = Buffer.from("");
  assert.notEqual(md5Archivo("recepcionista.test.mjs", espejo), md5Archivo("recepcionista.test.mjs", vps));
});

test("md5Archivo: dos .mjs con codigo distinto siguen difiriendo aunque compartan fin de linea", () => {
  const a = Buffer.from("const a = 1;\r\n");
  const b = Buffer.from("const a = 2;\r\n");
  assert.notEqual(md5Archivo("config.mjs", a), md5Archivo("config.mjs", b));
});

// --- La politica de fin de linea del espejo tiene que estar ESCRITA, no ser una casualidad ---
//
// Los tests de arriba prueban que el gate PERDONA el \r de un .mjs. Eso baja el ruido, pero
// deja los dos lados distintos de verdad: el dia que haga falta un `scp` selectivo por md5
// crudo, el hash sigue sin coincidir. Lo unico que hace que el espejo SEA un espejo es que el
// checkout materialice LF, y eso lo decide `.gitattributes` — que en `onia-hermes` no existe
// en la raiz, con `core.autocrlf=true`: o sea CRLF al hacer checkout.
//
// Medido el 2026-09-01: 21 .mjs del espejo estaban en CRLF en disco con el blob en LF, y
// coincidian con el VPS por casualidad. Este test se pone rojo si alguien deja el directorio
// sin politica otra vez.

test("el espejo declara eol=lf para sus .mjs (si no, un checkout los vuelve CRLF)", () => {
  const espejo = fileURLToPath(new URL(".", import.meta.url));
  const nombres = readdirSync(espejo).filter(
    (n) => n.endsWith(".mjs") && statSync(path.join(espejo, n)).isFile(),
  );
  assert.ok(nombres.length > 0, "el espejo tiene que tener .mjs, si no el test no prueba nada");

  // `git check-attr` lee la politica EFECTIVA, no el texto del archivo: es lo que git va a
  // aplicar en el proximo checkout, que es exactamente lo que este test cuida.
  const salida = execFileSync("git", ["check-attr", "eol", "--", ...nombres], {
    cwd: espejo,
    encoding: "utf8",
  });
  const sinPolitica = salida
    .split("\n")
    .filter((l) => l.trim() && !l.endsWith(": eol: lf"))
    .map((l) => l.split(":")[0]);
  assert.deepEqual(sinPolitica, [], `sin eol=lf en .gitattributes: ${sinPolitica.join(", ")}`);
});

// --- Desde el 2026-09-01 el loop corre DENTRO del VPS: /opt/onia/bot ya es este disco --------
//
// Hasta el 2026-08-31 este gate corria en la maquina de Sergio y el unico camino al VPS era
// SSH con ONIA_VPS_KEY. Migrado el loop al propio VPS, esa clave no existe en el host (se
// conectaria a si mismo) y el script fallaba entero con "Permission denied (publickey)" en vez
// de comparar nada — medido en vivo el 2026-09-01. Si el directorio ya esta en este disco no
// hace falta SSH.

test("ladoVps: si el directorio ya esta en este disco, lo lee directo sin pasar por SSH", () => {
  const tmp = mkdtempSync(path.join(tmpdir(), "espejo-check-"));
  try {
    writeFileSync(path.join(tmp, "bot-engine.mjs"), "const a = 1;\n");
    // Host y clave a proposito rotos: si `ladoVps` intentara SSH esto tiraria, no daria un
    // resultado. Que devuelva el md5 local prueba que no lo intento.
    const r = ladoVps({ host: "root@host-que-no-existe.invalid", key: "/no/existe", dir: tmp });
    assert.deepEqual(r, md5Local(tmp));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
