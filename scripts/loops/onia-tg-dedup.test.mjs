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
// 🔴 REESCRITO el 2026-09-08 al integrar `claude/onia-infra-setup-09ca24`. DOS carriles
// arreglaron el MISMO archivo el mismo dia y el merge salio SIN UN SOLO CONFLICTO:
//   · main (chatbot-cola) hizo que la clave se hashee sobre el titulo NORMALIZADO;
//   · la rama (infra) hizo que SOLO los problemas se vuelvan tarea — el exito se
//     registra en el log y se calla, citando a Sergio Urcullo: "si se friega el CI
//     o los loops, que el lo arregle".
// Las dos son correctas y se conservan. Lo que quedo viejo son los FIXTURES de este
// archivo: estaban escritos con avisos de EXITO ("✅ chatbot-cola · 929s"), y bajo la
// regla nueva un exito ya no llega nunca a la dedup, asi que los 6 casos median 0 y
// daban rojo. Las propiedades no cambiaron: se mudan a la unica forma que todavia
// puede crear una tarea, la del PROBLEMA. Y se agregan los anclajes de la regla nueva,
// que entro sin test propio — sin ellos, borrar el clasificador pasa en verde.
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
  // El log es la prueba de que callarse NO es perder: el exito no ocupa el tablero,
  // pero queda escrito. Sin este lector, "se calla" y "se pierde" se ven igual.
  const log = () => {
    const f = join(dir, "onia-tg.log");
    return existsSync(f) ? readFileSync(f, "utf8") : "";
  };
  return { avisar, tareasCreadas, curlSalio, log };
}

test("dos avisos del MISMO fallo que sólo difieren en la duración son UNA tarea", () => {
  const b = banco();
  b.avisar("🔴 chatbot-cola FALLÓ tras 929s · 0 commit(s)");
  b.avisar("🔴 chatbot-cola FALLÓ tras 954s · 0 commit(s)");
  b.avisar("🔴 chatbot-cola FALLÓ tras 1203s · 0 commit(s)");

  const creadas = b.tareasCreadas();
  assert.equal(
    creadas.length,
    1,
    `el mismo fallo creó ${creadas.length} tareas: ${creadas.join(" | ")}`,
  );
});

test("la hora dentro del título tampoco abre una tarea nueva cada vez", () => {
  const b = banco();
  b.avisar("⚠️ Integrador — 10:58 La Paz: conflicto sin resolver");
  b.avisar("⚠️ Integrador — 11:58 La Paz: conflicto sin resolver");

  assert.equal(b.tareasCreadas().length, 1);
});

test("un contador que crece no abre una tarea por cada valor", () => {
  const b = banco();
  b.avisar("⚠️ Memoria: MEMORY.md llegó a 431 entradas (tope 120).");
  b.avisar("⚠️ Memoria: MEMORY.md llegó a 437 entradas (tope 120).");

  assert.equal(b.tareasCreadas().length, 1);
});

// ── Los tres casos de ANCLAJE. Sin ellos, colapsar todo a una constante pasaría ──
// en verde y el enrutador dejaría de avisar de cosas distintas.

test("dos loops distintos con la misma duración son DOS tareas", () => {
  const b = banco();
  b.avisar("🔴 chatbot-cola FALLÓ tras 929s · 0 commit(s)");
  b.avisar("🔴 web-venta FALLÓ tras 929s · 0 commit(s)");

  const creadas = b.tareasCreadas();
  assert.equal(creadas.length, 2, `se comió un aviso distinto: ${creadas.join(" | ")}`);
});

test("dos problemas con texto distinto siguen siendo tareas distintas", () => {
  const b = banco();
  b.avisar("🔴 CI en ROJO — oninteligenciaartificial/onia-platform · Security");
  b.avisar("❌ El deploy de la landing quedó abortado a mitad del swap");

  assert.equal(b.tareasCreadas().length, 2);
});

test("un aviso idéntico repetido sigue creando una sola tarea", () => {
  const b = banco();
  b.avisar("🔴 CI en ROJO — oninteligenciaartificial/onia-platform · Security");
  b.avisar("🔴 CI en ROJO — oninteligenciaartificial/onia-platform · Security");
  b.avisar("🔴 CI en ROJO — oninteligenciaartificial/onia-platform · Security");

  assert.equal(b.tareasCreadas().length, 1);
});

// ── La regla nueva: SOLO los problemas ocupan un lugar en el tablero ─────────
// Sin estos casos, arrancar el clasificador entero pasa en verde y el tablero
// vuelve a llenarse de loops diciendo que les fue bien (~96 tareas al día).

test("un aviso de ÉXITO no ocupa un lugar en el tablero", () => {
  const b = banco();
  b.avisar("✅ chatbot-cola · 929s · 1 commit(s)");
  b.avisar("🛟 Rescatado un mensaje perdido");
  b.avisar("🟢 CI recuperado — oninteligenciaartificial/onia-platform · Security");

  const creadas = b.tareasCreadas();
  assert.equal(creadas.length, 0, `el éxito ocupó el tablero: ${creadas.join(" | ")}`);
});

test("callarse NO es perder: el éxito queda registrado en el log", () => {
  const b = banco();
  b.avisar("✅ chatbot-cola · 929s · 1 commit(s)");

  assert.match(
    b.log(),
    /INFORMATIVO \(sin tarea\).*chatbot-cola/,
    "el aviso informativo tiene que quedar escrito, o «se calla» y «se pierde» se ven igual",
  );
});

test("se clasifica por la PRIMERA LÍNEA, no por el cuerpo", () => {
  const b = banco();
  // El titular dice que salió bien; el cuerpo NARRA un error ya resuelto.
  // Mirar el mensaje entero convierte cada relato en tarea.
  b.avisar("🛟 Rescatado un mensaje perdido\nEl envío anterior FALLÓ con error de timeout.");

  const creadas = b.tareasCreadas();
  assert.equal(creadas.length, 0, `clasificó por el cuerpo: ${creadas.join(" | ")}`);
});

test("un problema en la primera línea SÍ abre tarea aunque el cuerpo sea largo", () => {
  const b = banco();
  b.avisar("🔴 El emisor SIAT no pudo firmar la factura\nDetalle: reintentos 3, CUFD vigente.");

  assert.equal(b.tareasCreadas().length, 1, "un problema real tiene que llegar al tablero");
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
  // Va con un PROBLEMA a propósito: un éxito sale antes de llegar al tablero, así que
  // este caso pasaría sin ejercitar nada — verde vacío en vez de verde.
  b.avisar("🔴 CI en ROJO — oninteligenciaartificial/onia-platform · Security");

  assert.equal(b.tareasCreadas().length, 1, "el problema tiene que haber creado su tarea");
  assert.equal(b.curlSalio(), false, "un aviso enrutado al tablero no puede además escribirle a Sergio");
});
