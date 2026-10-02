// pedido-respuesta.test.mjs — la respuesta de Claude a un pedido vuelve a Telegram por la aduana.
//
// POR QUÉ EXISTE. El pedido sale de Hermes a una rutina de Claude en la nube
// (pedido-claude.sh); la respuesta vuelve con el workflow hermes-respuesta.yml, que en el VPS corre
// hermes-content/deploy/hermes-jarvis/responder.sh como root. Estos casos fijan que solo se
// responden pedidos que salieron de Hermes, una vez por estado, por la aduana (nunca directo) y
// que el texto se entrega como texto: escapado para el HTML de Telegram, sin ejecutarse.
//
// Se corre con: node --test scripts/loops/pedido-respuesta.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(AQUI, "..", "..", "hermes-content", "deploy", "hermes-jarvis");
const COMUN = readFileSync(join(DIR, "comun.sh"), "utf8");
const RESPONDER = readFileSync(join(DIR, "responder.sh"), "utf8");
const ID = "p_1a2b3c4d";
// Un link con el largo de los de verdad (session_ + 24): con uno de juguete («session_01XYZ») la
// prueba de los 90 bytes pasaba y en producción el link de «necesita tu ok» quedaba cortado.
const SESION = "session_01AbCdEfGhIjKlMnOpQrStUv";
const URL_REAL = `https://claude.ai/code/${SESION}`;
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

function banco({ tgFalla = false, horasAtras = 1, url = URL_REAL } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "respuesta-"));
  const estado = join(dir, "pedidos");
  mkdirSync(estado);
  const ts = Math.floor(Date.now() / 1000) - horasAtras * 3600;
  writeFileSync(
    join(estado, "pedidos.tsv"),
    `${ts}\t${ID}\tplataforma\tabc123\t${SESION}\t${url}\n`,
  );
  const tg = join(dir, "tg.sh");
  writeFileSync(
    tg,
    `#!/usr/bin/env bash
n=$(cat ${dir}/envios 2>/dev/null || echo 0); echo $((n + 1)) > ${dir}/envios
printf '%s|%s|%s|%s\\n' "$ONIA_AVISO" "$ONIA_AVISO_CLAVE" "$ONIA_AVISO_EMISOR" "\${ONIA_AVISO_AHORA:-}" > ${dir}/tg-env.txt
printf '%s' "$1" > ${dir}/tg-msg.txt
${tgFalla ? "exit 1" : "exit 0"}
`,
  );
  chmodSync(tg, 0o755);
  const responder = (pedido, estadoPedido, texto) => {
    const b64 = Buffer.from(texto, "utf8").toString("base64");
    const guion = `REDACTAR_SED='s/a^//'\nPEDIDO='${pedido}'\nESTADO='${estadoPedido}'\nTEXTO_B64='${b64}'\n${COMUN}\n${RESPONDER}`;
    return spawnSync("bash", ["-s"], {
      input: guion,
      env: { ...process.env, ONIA_PEDIDOS_ESTADO: estado, ONIA_TG: tg },
      encoding: "utf8",
    });
  };
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  return { dir, estado, responder, leer, envios: () => Number(leer("envios") || 0) };
}

test("la respuesta de un pedido de Hermes sale por la aduana, como interrupción con clave propia", () => {
  const b = banco();
  const r = b.responder(ID, "listo", "Listo: el botón ya confirma. PR #91 abierto en borrador.");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(b.leer("tg-env.txt").trim(), `interrumpe|pedido-${ID}-listo|claude|`);
  const msg = b.leer("tg-msg.txt");
  assert.match(msg, new RegExp(`^✅ Listo · p_1a2b3c4d · ${reEsc(URL_REAL)}\\n<b>Claude terminó tu pedido</b> \\(plataforma\\)\\n\\nListo: el botón ya confirma\\.`));
  assert.match(b.leer("pedidos/respuestas.tsv"), new RegExp(`\\t${ID}\\tlisto\\n$`));
});

test("respeta la noche y sus bloques: nunca pide ONIA_AVISO_AHORA", () => {
  const b = banco();
  b.responder(ID, "necesita-ok", "¿Lo mergeo?");
  assert.ok(b.leer("tg-env.txt").trim().endsWith("|"), "ONIA_AVISO_AHORA tiene que ir vacío");
  assert.match(b.leer("tg-msg.txt"), /^🙋 Falta tu ok · p_1a2b3c4d · /);
});

test("un pedido que no salió de Hermes no le escribe nada", () => {
  const b = banco();
  const r = b.responder("p_ffffffff", "listo", "hola");
  assert.equal(r.status, 66);
  assert.equal(b.envios(), 0);
});

test("id o estado inválidos: no le escribe nada", () => {
  const b = banco();
  assert.equal(b.responder("p_1a2b3c4d; rm -rf /", "listo", "x").status, 65);
  assert.equal(b.responder(ID, "cualquiera", "x").status, 65);
  assert.equal(b.envios(), 0);
});

test("la misma respuesta dos veces no suena dos veces, y después de cerrado no suena nada", () => {
  const b = banco();
  b.responder(ID, "necesita-ok", "¿Lo mergeo?");
  const r = b.responder(ID, "necesita-ok", "¿Lo mergeo? (otra vez)");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /ya tenía una respuesta «necesita-ok»/);
  assert.equal(b.envios(), 1);
  assert.equal(b.responder(ID, "listo", "Listo.").status, 0);
  assert.equal(b.envios(), 2, "de «necesita-ok» a «listo» sí suena");
  for (const e of ["listo", "necesita-ok", "no-se-pudo"]) {
    const t = b.responder(ID, e, "algo más");
    assert.equal(t.status, 66);
    assert.match(t.stdout, /ya se cerró/);
  }
  assert.equal(b.envios(), 2);
});

test("un pedido de más de 48 h no suena", () => {
  const b = banco({ horasAtras: 49 });
  const r = b.responder(ID, "listo", "Listo, tarde.");
  assert.equal(r.status, 66);
  assert.match(r.stdout, /más de 48 h/);
  assert.equal(b.envios(), 0);
});

// La aduana guarda la primera línea, sin HTML, cortada con `cut -c1-90` (onia-tg.sh, titulo_de):
// GNU cut cuenta BYTES, y un emoji son 3 a 6. Verificación del 1-oct: «🙋 Necesita tu ok» con un
// link real sumaba 92 bytes y lo retenido quedaba «…session_…SuJp3», sin las dos últimas letras.
const loQueGuardaLaAduana = (linea) => Buffer.from(linea).subarray(0, 90).toString("utf8");

for (const estado of ["listo", "necesita-ok", "no-se-pudo"]) {
  test(`«${estado}»: la primera línea alcanza sola con un link real (id y link enteros en 90 bytes)`, () => {
    const b = banco();
    b.responder(ID, estado, "Detalle de la respuesta.");
    const primera = b.leer("tg-msg.txt").split("\n")[0];
    assert.ok(Buffer.byteLength(primera) <= 90, `${Buffer.byteLength(primera)} bytes: ${primera}`);
    assert.doesNotMatch(primera, /</);
    assert.match(loQueGuardaLaAduana(primera), new RegExp(`p_1a2b3c4d · ${reEsc(URL_REAL)}$`));
  });
}

test("con un link más largo que los de hoy, queda solo el emoji: el id y el link no se cortan", () => {
  const largo = `https://claude.ai/code/session_${"x".repeat(36)}`; // 67: los de hoy tienen 55
  const b = banco({ url: largo });
  b.responder(ID, "no-se-pudo", "No pude: hace falta la PC.");
  const primera = b.leer("tg-msg.txt").split("\n")[0];
  assert.ok(Buffer.byteLength(primera) <= 90, `${Buffer.byteLength(primera)} bytes: ${primera}`);
  assert.equal(primera, `⚠️ p_1a2b3c4d · ${largo}`);
});

test("el texto es texto: se escapa para Telegram y no se ejecuta", () => {
  const b = banco();
  b.responder(ID, "listo", "<b>ojo</b> & $(touch HACKEADO) `id`");
  const msg = b.leer("tg-msg.txt");
  assert.match(msg, /&lt;b&gt;ojo&lt;\/b&gt; &amp; \$\(touch HACKEADO\) `id`/);
  assert.equal(existsSync(join(b.dir, "HACKEADO")), false);
  assert.equal(existsSync("HACKEADO"), false);
});

test("una respuesta larguísima se corta en 1500 caracteres sin romper un acento", () => {
  const b = banco();
  b.responder(ID, "listo", "á".repeat(2000));
  const cuerpo = b.leer("tg-msg.txt").split("\n\n")[1];
  assert.equal([...cuerpo].length, 1500);
  assert.doesNotMatch(cuerpo, /�/);
});

test("si la aduana no la acepta, no la da por respondida", () => {
  const b = banco({ tgFalla: true });
  const r = b.responder(ID, "listo", "Listo.");
  assert.equal(r.status, 1);
  assert.equal(existsSync(join(b.estado, "respuestas.tsv")), false);
});
