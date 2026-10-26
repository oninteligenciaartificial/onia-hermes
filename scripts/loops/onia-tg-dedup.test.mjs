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
        ONIA_TG_ENV: join(dir, "no-existe.env"),
        ONIA_AVISO_ESTADO: join(dir, "estado"),
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

// ── «Nada roto» NO es un problema ────────────────────────────────────────────
// Medido el 2026-09-10: el clasificador funciona (casi todo sale INFORMATIVO) y aun
// asi entraron 4 tareas de EXITO ese dia. La causa es que la regla «se clasifica por
// la primera linea» supone que el aviso TIENE varias lineas: cuando el aviso es UN
// parrafo —que es como escriben recorrido-cliente y el integrador— la primera linea
// ES el mensaje entero, y el filtro vuelve a mirar el cuerpo sin que nada avise.
//
// Ahi la palabra llega NEGADA, que es justo lo que un carril sano escribe cuando su
// vuelta salio bien: «Nada roto», «sin nada roto», «no falló». El resultado es una
// tarea que dice que algo esta roto porque el loop dijo que NO lo estaba.
//
// Los tres fixtures son textuales de tareas reales de ese dia (t_7c1c0612,
// t_3ef94060, t_154ce16c).

test("«nada roto» no abre tarea: la negación es lo que escribe un carril sano", () => {
  const b = banco();
  b.avisar(
    "Probé el camino completo en Importadora/distribuidora, primera vez con este " +
      "instrumento: se completó entero (9/9). El paso de agendar cita no aplica en este " +
      "rubro y es correcto -- vende catálogo, cotizaciones e importación, no tiene agenda. " +
      "Nada roto.",
  );
  b.avisar(
    "Recorrido de cliente: probé el camino completo dos veces más (dental y, por primera " +
      "vez con el instrumento nuevo, servicios profesionales). Los 9 pasos se completaron " +
      "sin nada roto en las dos.",
  );
  b.avisar(
    "Hice el camino completo de un cliente nuevo (dental) y terminó entero: cuenta, rubro, " +
      "un paciente de prueba guardado, una cita agendada y vista en la agenda, y llegué a " +
      "la pantalla de cobro. Nada roto en el producto hoy.",
  );

  const creadas = b.tareasCreadas();
  assert.equal(creadas.length, 0, `una vuelta sana ocupó el tablero: ${creadas.join(" | ")}`);
});

// ANCLA en la dirección cara. Sin este caso, la salida barata es borrar del patrón las
// palabras que aparecen negadas, y ahí el clasificador deja de ver el problema REAL.
test("negar una cosa no absuelve al problema que el MISMO aviso reporta", () => {
  const b = banco();
  b.avisar("Nada roto en el recorrido, pero el emisor SIAT FALLÓ al firmar la factura.");
  b.avisar("Sin errores en los gates; el deploy quedó abortado por falta de espacio.");

  assert.equal(
    b.tareasCreadas().length,
    2,
    "descartar la negación no puede llevarse puesto el problema que viene después",
  );
});

// El ancla de arriba NO alcanza y esto se vio mutando: sus dos avisos abren tarea por
// «FALLÓ» y por «abortado», así que borrar «roto» del patrón —la salida barata— pasaba
// en VERDE con los 14 casos. Hace falta uno donde la ÚNICA señal sea esa palabra.
test("«roto» sin negar sigue siendo un problema, y es la única señal del aviso", () => {
  const b = banco();
  b.avisar("El deploy dejó el sitio roto: la home devuelve 500.");

  assert.equal(
    b.tareasCreadas().length,
    1,
    "sacar la palabra del patrón en vez de descartar la negación deja ciego al clasificador",
  );
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
