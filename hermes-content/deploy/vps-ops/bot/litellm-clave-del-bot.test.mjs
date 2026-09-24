// ONIA — el motor del bot le habla a LiteLLM con SU clave virtual, no con la master.
//
// POR QUE. Hasta el 2026-09-24 `webhook-server.sh` leia LITELLM_MASTER_KEY del contenedor de
// LiteLLM y se la pasaba al proceso. La master no tiene tope: el presupuesto del bot (alias
// `onia-bot-motor`, US$10 cada 30 dias) existia en LiteLLM y el bot lo salteaba entero. Un bucle
// o un abuso gastaba contra la cuenta de OpenAI sin que nada lo frenara.
//
// QUE FIJA, corriendo el script de verdad contra un `docker` de mentira:
//   1. con /root/.config/onia/litellm-bot.key presente y no vacio, al proceso le llega ESA clave
//      y la master ni se lee;
//   2. sin el archivo (o vacio), la master de siempre: el cambio no puede dejar al bot sin IA;
//   3. la salida y el log del proceso dicen QUE clase se uso, nunca el valor.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/litellm-clave-del-bot.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_SH = path.join(HERE, "webhook-server.sh");

const VIRTUAL = "sk-virtual-DEL-BOT-no-se-muestra";
const MASTER = "sk-MASTER-no-se-muestra";

/** `clave`: contenido del archivo de la clave virtual; `null` = el archivo no existe. */
function correr({ clave }) {
  const raiz = mkdtempSync(path.join(tmpdir(), "onia-llmkey-"));
  const host = path.join(raiz, "host");
  const bin = path.join(raiz, "bin");
  const log = path.join(raiz, "docker.log");
  const archivoClave = path.join(raiz, "litellm-bot.key");
  for (const d of [host, bin]) mkdirSync(d, { recursive: true });
  writeFileSync(path.join(host, "webhook-server.sh"), readFileSync(SERVER_SH));
  chmodSync(path.join(host, "webhook-server.sh"), 0o755);
  writeFileSync(path.join(host, "webhook-server.mjs"), "// centinela: hace que BOT_DIR sea este\n");
  if (clave !== null) writeFileSync(archivoClave, clave);

  // Anota cada llamada (una por linea, argumentos separados por |) y contesta lo minimo para que
  // el arranque llegue al final: master falsa, /health ok y un solo proceso vivo.
  const docker = `#!/usr/bin/env bash
( IFS='|'; printf '%s\\n' "$*" ) >> ${JSON.stringify(log)}
case "$*" in
  *"printenv LITELLM_MASTER_KEY"*) echo ${JSON.stringify(MASTER)} ;;
  *wget*) echo '{"ok":true}' ;;
  *"grep -c"*) echo 1 ;;
esac
exit 0
`;
  writeFileSync(path.join(bin, "docker"), docker);
  chmodSync(path.join(bin, "docker"), 0o755);

  try {
    const r = spawnSync("bash", [path.join(host, "webhook-server.sh"), "start"], {
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        ONIA_BOT_CONTAINER: "contenedor-falso",
        ONIA_LITELLM_BOT_KEY_FILE: archivoClave,
        ONIA_TG_ENV_FILE: path.join(raiz, "no-existe.env"),
        ONIA_WEBHOOK_ENV_FILE: path.join(raiz, "no-existe.env"),
      },
    });
    const code = r.status;
    const salida = `${r.stdout}${r.stderr}`;
    const llamadas = existsSync(log) ? readFileSync(log, "utf8").split("\n").filter(Boolean) : [];
    const arranque = llamadas.find((l) => l.startsWith("exec|-d|")) || "";
    const args = arranque.split("|");
    const litellmKey = args.find((a) => a.startsWith("LITELLM_KEY="))?.slice("LITELLM_KEY=".length);
    return { code, salida, llamadas, arranque, comando: args.at(-1), litellmKey };
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
}

const leyoMaster = (r) => r.llamadas.some((l) => l.includes("printenv|LITELLM_MASTER_KEY"));

test("con la clave virtual en el archivo, el proceso recibe ESA y la master ni se lee", () => {
  const r = correr({ clave: `${VIRTUAL}\n` });
  assert.equal(r.code, 0, r.salida);
  assert.equal(r.litellmKey, VIRTUAL, "el bot tiene que gastar contra su propio tope");
  assert.ok(!leyoMaster(r), "leyo la master teniendo la virtual");
  assert.match(r.salida, /LiteLLM: clave virtual/);
  assert.match(r.comando, /\[arranque\] LiteLLM: clave virtual/, "el log del proceso no dice que clave usa");
});

test("sin el archivo, cae a la master de siempre y lo avisa", () => {
  const r = correr({ clave: null });
  assert.equal(r.code, 0, r.salida);
  assert.equal(r.litellmKey, MASTER, "sin archivo el bot no puede quedar sin IA");
  assert.match(r.salida, /AVISO: LiteLLM con la MASTER/);
  assert.match(r.comando, /\[arranque\] LiteLLM: clave MASTER/);
});

test("un archivo vacio (o solo espacios) cuenta como ausente: master, no clave vacia", () => {
  const r = correr({ clave: " \n\t" });
  assert.equal(r.code, 0, r.salida);
  assert.equal(r.litellmKey, MASTER);
  assert.match(r.salida, /MASTER/);
});

test("ni la clave virtual ni la master aparecen en la salida ni en el log del proceso", () => {
  for (const clave of [VIRTUAL, null]) {
    const r = correr({ clave });
    for (const secreto of [VIRTUAL, MASTER]) {
      assert.ok(!r.salida.includes(secreto), `la salida mostro una clave (${clave === null ? "master" : "virtual"})`);
      assert.ok(!r.comando.includes(secreto), "la linea que va al log del proceso lleva una clave");
    }
  }
});
