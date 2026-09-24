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
//   3. la salida y el log del proceso dicen QUE clase se uso, nunca el valor;
//   4. una clave PRESENTE no es una clave que SIRVE: antes de arrancar se le pregunta a LiteLLM
//      (GET /models con esa clave, gratis). Rechazada (401/403) o sin permiso para el modelo del
//      bot -> la master y una tarea en el tablero. Sin esto, una clave revocada o restringida a
//      otro modelo dejaba al bot contestando TEXTO FIJO con /health en verde (run-turn.mjs hace
//      `if (!res.ok) return ""`), y el vigia de credito calla los 401 del proxy a proposito;
//   5. si LiteLLM no contesta la pregunta, la virtual se queda: la master tampoco pasaria.
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

/**
 * `clave`: contenido del archivo de la clave virtual; `null` = el archivo no existe.
 * `veredicto`: lo que contesta la prueba de la clave adentro del contenedor
 * ("ok" | "rechazada 401" | "sin-modelo <m>" | "" = LiteLLM no contesto).
 */
function correr({ clave, veredicto = "ok", modelo }) {
  const raiz = mkdtempSync(path.join(tmpdir(), "onia-llmkey-"));
  const host = path.join(raiz, "host");
  const bin = path.join(raiz, "bin");
  const log = path.join(raiz, "docker.log");
  const archivoClave = path.join(raiz, "litellm-bot.key");
  const tareas = path.join(raiz, "tareas.log");
  const tg = path.join(raiz, "onia-tg.sh");
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
  *"/models"*"node -e"*) printf 'K=%s\\n' "\${K:-}" >> ${JSON.stringify(log)}; printf '%s\\n' ${JSON.stringify(veredicto)} ;;
  *"printenv LITELLM_MASTER_KEY"*) echo ${JSON.stringify(MASTER)} ;;
  *wget*) echo '{"ok":true}' ;;
  *"grep -c"*) echo 1 ;;
esac
exit 0
`;
  writeFileSync(path.join(bin, "docker"), docker);
  chmodSync(path.join(bin, "docker"), 0o755);
  // onia-tg.sh falso: anota el camino (tablero o directo) y el mensaje.
  writeFileSync(tg, `#!/usr/bin/env bash\nprintf 'DIRECTO=%s %s\\n' "\${ONIA_TG_DIRECTO:-0}" "$1" >> ${JSON.stringify(tareas)}\n`);
  chmodSync(tg, 0o755);

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
        ONIA_TG: tg,
        ...(modelo ? { ONIA_BOT_MODEL: modelo } : {}),
      },
    });
    const code = r.status;
    const salida = `${r.stdout}${r.stderr}`;
    const llamadas = existsSync(log) ? readFileSync(log, "utf8").split("\n").filter(Boolean) : [];
    const arranque = llamadas.find((l) => l.startsWith("exec|-d|")) || "";
    const args = arranque.split("|");
    const litellmKey = args.find((a) => a.startsWith("LITELLM_KEY="))?.slice("LITELLM_KEY=".length);
    const prueba = llamadas.find((l) => l.includes("node|-e|") && l.includes("/models")) || "";
    const kPrueba = llamadas.find((l) => l.startsWith("K="))?.slice(2);
    const aviso = existsSync(tareas) ? readFileSync(tareas, "utf8") : "";
    return { code, salida, llamadas, arranque, comando: args.at(-1), litellmKey, prueba, kPrueba, aviso };
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
  assert.equal(r.aviso, "", "una clave que sirve no abre tarea");
});

test("la clave se PRUEBA antes de arrancar: contra /models, con el modelo del bot, sin la clave en argv", () => {
  const r = correr({ clave: VIRTUAL, modelo: "gpt-4.1-mini" });
  assert.ok(r.prueba, `no se pregunto a LiteLLM si la clave sirve:\n${r.llamadas.join("\n")}`);
  assert.match(r.prueba, /\|contenedor-falso\|node\|-e\|/, "la prueba corre en el contenedor del bot (esta en la red de LiteLLM)");
  assert.match(r.prueba, /M=gpt-4\.1-mini/, "tiene que probar el modelo que el bot VA a usar");
  assert.match(r.prueba, /U=http:\/\/onia_selfhosted-litellm-1:4000\/v1\/models/);
  assert.equal(r.kPrueba, VIRTUAL, "la prueba no uso la clave virtual");
  assert.ok(!r.prueba.includes(VIRTUAL), "la clave viajo en los argumentos (se ve en ps)");
});

test("clave RECHAZADA por LiteLLM (revocada, regenerada, basura): master y tarea, no texto fijo", () => {
  const r = correr({ clave: VIRTUAL, veredicto: "rechazada 401" });
  assert.equal(r.code, 0, r.salida);
  assert.equal(r.litellmKey, MASTER, "con la virtual rechazada el bot contesta TEXTO FIJO");
  assert.match(r.salida, /MASTER/);
  assert.match(r.salida, /rechazada 401/);
  assert.match(r.comando, /\[arranque\] LiteLLM: clave MASTER.*rechazada 401/, "el log del proceso no dice por que");
  assert.match(r.aviso, /^DIRECTO=0 /, "va al tablero: el bot sigue con IA, lo que falta es el tope");
  assert.match(r.aviso, /rechazada 401/);
  for (const secreto of [VIRTUAL, MASTER]) {
    assert.ok(!r.salida.includes(secreto) && !r.comando.includes(secreto) && !r.aviso.includes(secreto), "se filtro una clave");
  }
});

test("clave que no puede usar el modelo del bot (webhook.env sin ONIA_BOT_MODEL): master y tarea", () => {
  const r = correr({ clave: VIRTUAL, veredicto: "sin-modelo gpt-4o-mini" });
  assert.equal(r.litellmKey, MASTER);
  assert.match(r.prueba, /M=gpt-4o-mini/, "sin ONIA_BOT_MODEL prueba el default del lanzador");
  assert.match(r.aviso, /sin-modelo gpt-4o-mini/);
  assert.match(r.comando, /\[arranque\] LiteLLM: clave MASTER/);
});

test("LiteLLM no contesta la prueba: se queda la virtual (la master tampoco pasaria) y lo dice", () => {
  for (const veredicto of ["", "error TimeoutError", "http 500"]) {
    const r = correr({ clave: VIRTUAL, veredicto });
    assert.equal(r.code, 0, r.salida);
    assert.equal(r.litellmKey, VIRTUAL, `veredicto "${veredicto}": cambio a la master sin motivo`);
    assert.ok(!leyoMaster(r));
    assert.match(r.comando, /\[arranque\] LiteLLM: clave virtual.*sin verificar/);
    assert.equal(r.aviso, "", "LiteLLM caido no es culpa de la clave: eso lo ve vps-healthcheck");
  }
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
