// onia-tg-dedup.test.mjs — el enrutador de avisos no puede inundar el tablero.
//
// POR QUE EXISTE. El 2026-09-08 `onia-tg.sh` dejo de mandar a Telegram por defecto y
// paso a crear una TAREA. Su propio comentario dice para que esta la dedup: "el mismo
// aviso repetido no crea 144 tareas al dia". Dos horas despues de entrar, medido:
// de las 28 tareas [auto:] vivas, 19 eran el MISMO aviso repetido.
//
// La causa: la clave se hasheaba sobre el titulo CRUDO, y el emisor dominante —el aviso
// de fin de vuelta de los loops— lleva su duracion adentro:
//     "✅ chatbot-cola · 929s · 1 commit(s)"   -> clave 8d79f2
//     "✅ chatbot-cola · 954s · 1 commit(s)"   -> clave c3ad73
// Hashean distinto, asi que la dedup nunca los veia. Son 4 loops x ~24 vueltas = ~96
// tareas al dia del mismo aviso, y no es ruido cosmetico: el tablero es de donde los
// carriles sacan trabajo, y lo leen ANTES que su cola.
//
// El enrutador entro sin un solo test, asi que nada podia ponerlo en rojo.
//
// Se corre con: node --test scripts/loops/onia-tg-dedup.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, "onia-tg.sh");

/**
 * Banco de pruebas hermetico: un tablero de mentira que guarda las tareas en un archivo
 * y un `curl` de mentira, para que ninguna corrida toque el tablero real ni salga a la red.
 */
function banco() {
  const dir = mkdtempSync(join(tmpdir(), "onia-tg-"));
  const tareas = join(dir, "tareas.txt");
  const creados = join(dir, "creados.txt");
  const curlLlamado = join(dir, "curl-llamado.txt");
  writeFileSync(tareas, "");
  writeFileSync(creados, "");

  // `list` imprime el tablero; `create <titulo> ...` agrega una fila viva y devuelve un id.
  const tablero = join(dir, "tablero.sh");
  writeFileSync(
    tablero,
    `#!/usr/bin/env bash
if [ "$1" = "list" ]; then cat ${tareas}; exit 0; fi
if [ "$1" = "create" ]; then
  ID="t_$(printf '%s' "$2" | md5sum | cut -c1-8)"
  printf '▶ %s  ready     (unassigned)          %s\\n' "$ID" "$2" >> ${tareas}
  printf '%s\\n' "$2" >> ${creados}
  echo "Created $ID"
  exit 0
fi
exit 9
`,
  );
  chmodSync(tablero, 0o755);

  // Un curl que no sale a internet: sólo deja constancia de que lo llamaron.
  const curl = join(dir, "curl");
  writeFileSync(curl, `#!/usr/bin/env bash\necho llamado >> ${curlLlamado}\necho '{"ok":true}'\n`);
  chmodSync(curl, 0o755);

  const avisar = (msg, env = {}) =>
    execFileSync("bash", [SCRIPT, msg], {
      env: {
        ...process.env,
        PATH: `${dir}:${process.env.PATH}`,
        ONIA_TABLERO: tablero,
        ONIA_TG_LOG: join(dir, "onia-tg.log"),
        TELEGRAM_BOT_TOKEN: "token-de-mentira",
        TELEGRAM_CHAT_ID: "0",
        TELEGRAM_HOME_CHANNEL: "0",
        ...env,
      },
      encoding: "utf8",
    });

  const tareasCreadas = () => readFileSync(creados, "utf8").split("\n").filter(Boolean);
  const curlSalio = () => existsSync(curlLlamado);
  return { avisar, tareasCreadas, curlSalio };
}

test("dos avisos de fin de vuelta que sólo difieren en la duración son UNA tarea", () => {
  const b = banco();
  b.avisar("✅ chatbot-cola · 929s · 1 commit(s)");
  b.avisar("✅ chatbot-cola · 954s · 1 commit(s)");
  b.avisar("✅ chatbot-cola · 1203s · 1 commit(s)");

  const creadas = b.tareasCreadas();
  assert.equal(
    creadas.length,
    1,
    `el mismo aviso de fin de vuelta creó ${creadas.length} tareas: ${creadas.join(" | ")}`,
  );
});

test("la hora dentro del título tampoco abre una tarea nueva cada vez", () => {
  const b = banco();
  b.avisar("Integrador — 10:58 La Paz");
  b.avisar("Integrador — 11:58 La Paz");

  assert.equal(b.tareasCreadas().length, 1);
});

test("un contador que crece no abre una tarea por cada valor", () => {
  const b = banco();
  b.avisar("🧠 Memoria: MEMORY.md llegó a 431 entradas (tope 120).");
  b.avisar("🧠 Memoria: MEMORY.md llegó a 437 entradas (tope 120).");

  assert.equal(b.tareasCreadas().length, 1);
});

// ── Los tres casos de ANCLAJE. Sin ellos, colapsar todo a una constante pasaría ──
// en verde y el enrutador dejaría de avisar de cosas distintas.

test("dos loops distintos con la misma duración son DOS tareas", () => {
  const b = banco();
  b.avisar("✅ chatbot-cola · 929s · 1 commit(s)");
  b.avisar("✅ web-venta · 929s · 1 commit(s)");

  const creadas = b.tareasCreadas();
  assert.equal(creadas.length, 2, `se comió un aviso distinto: ${creadas.join(" | ")}`);
});

test("avisos con texto distinto siguen siendo tareas distintas", () => {
  const b = banco();
  b.avisar("🔴 CI en ROJO — oninteligenciaartificial/onia-platform · Security");
  b.avisar("🟢 CI recuperado — oninteligenciaartificial/onia-platform · Security");

  assert.equal(b.tareasCreadas().length, 2);
});

test("un aviso idéntico repetido sigue creando una sola tarea", () => {
  const b = banco();
  b.avisar("🛟 Rescatado un mensaje perdido");
  b.avisar("🛟 Rescatado un mensaje perdido");
  b.avisar("🛟 Rescatado un mensaje perdido");

  assert.equal(b.tareasCreadas().length, 1);
});

// ── Hermeticidad: el camino directo es el de las aprobaciones y no pasa por el tablero ──

test("ONIA_TG_DIRECTO=1 va a Telegram y NO crea tareas", () => {
  const b = banco();
  b.avisar("Pregunta para Sergio Urcullo · 1 decisión", { ONIA_TG_DIRECTO: "1" });

  assert.equal(b.tareasCreadas().length, 0, "el camino directo no debe tocar el tablero");
  assert.equal(b.curlSalio(), true, "el camino directo tiene que llamar a Telegram");
});

test("el camino por defecto NO sale a Telegram", () => {
  const b = banco();
  b.avisar("✅ chatbot-cola · 929s · 1 commit(s)");

  assert.equal(b.curlSalio(), false, "un aviso enrutado al tablero no puede además escribirle a Sergio");
});
