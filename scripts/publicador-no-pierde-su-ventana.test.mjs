#!/usr/bin/env node
/**
 * El publicador automatico ESPERA su turno en vez de perder la ventana.
 *
 * POR QUE EXISTE, medido el 2026-09-18. El cron de `onia-publicar-solo.sh`
 * corre cada 3 HORAS y es el unico camino por el que la plataforma y el bot
 * llegan al cliente sin que Sergio Urcullo apriete nada. Ese dia la corrida de
 * las 06:50:01 UTC se salteo ENTERA: un `--dry-run` de dos segundos, disparado
 * a mano 66 s antes para probar un pedido de deploy, todavia tenia el lock por
 * su deploy en segundo plano. `flock -n` se rinde en el acto, asi que los tres
 * destinos se quedaron sin publicar tres horas mas.
 *
 * Y fallo MUDO por partida doble: salia `exit 0` —el cron lo lee como exito— y
 * la linea del log no llevaba FECHA, asi que en un log append-only no se podia
 * atribuir a ninguna corrida; hubo que deducirla por el mtime del archivo.
 * Mientras tanto `deploy_sin_pedido.mjs` seguia firmando "no hay que pedir ok,
 * el publicador lo hace solo (<=3 h)" sobre una ventana ya perdida.
 *
 * QUE FIJA, y por que asi. No mira el texto del script: lo EJECUTA con el lock
 * tomado por otro, que es la unica forma de distinguir "espera" de "se rinde".
 * Con el lock retenido el script no puede publicar nada, asi que el caso es
 * seguro de correr en cualquier maquina. El lock se apunta a un archivo propio
 * sellado por corrida (`ONIA_PUBLICAR_LOCK`) para no tocar el de produccion.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const GUION = join(AQUI, "loops/extras/publicar-solo.sh");

/** Corre el publicador en seco con el lock YA TOMADO por otro proceso. */
function conElLockTomado({ esperaSegundos }) {
  const dir = mkdtempSync(join(tmpdir(), "onia-publicar-lock-"));
  const lock = join(dir, "publicar.lock");
  // Un tenedor del lock que no lo suelta mientras dure el caso.
  const tenedor = spawn("flock", [lock, "-c", "sleep 30"], { stdio: "ignore" });
  try {
    // flock necesita un instante para tomarlo; sin esto el caso mide otra cosa.
    spawnSync("bash", ["-c", `for i in $(seq 1 50); do flock -n ${lock} -c true || exit 0; sleep 0.1; done; exit 1`]);
    const t0 = Date.now();
    const r = spawnSync("bash", [GUION, "--dry-run"], {
      env: {
        ...process.env,
        ONIA_PUBLICAR_LOCK: lock,
        ONIA_PUBLICAR_ESPERA: String(esperaSegundos),
      },
      encoding: "utf8",
      timeout: 60_000,
    });
    return { ...r, salida: `${r.stdout ?? ""}${r.stderr ?? ""}`, tardoMs: Date.now() - t0 };
  } finally {
    tenedor.kill("SIGKILL");
    rmSync(dir, { recursive: true, force: true });
  }
}

test("con el lock tomado por otro, ESPERA su turno en vez de rendirse en el acto", () => {
  const r = conElLockTomado({ esperaSegundos: 3 });
  assert.ok(
    r.tardoMs >= 2500,
    `se rindio en ${r.tardoMs} ms con una espera pedida de 3 s. ` +
      "Con `flock -n` una colision de segundos cuesta la ventana entera de 3 h: " +
      "el publicador tiene que ESPERAR (flock -w). Salida: " + r.salida,
  );
});

test("cuando se rinde de verdad, lo dice CON FECHA — un log append-only sin fecha no se puede atribuir", () => {
  const r = conElLockTomado({ esperaSegundos: 1 });
  assert.match(
    r.salida,
    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/,
    "la linea del salteo salio sin fecha, que es como el salteo del 2026-09-18 quedo " +
      "imposible de atribuir (hubo que deducirlo por el mtime del log). Salida: " + r.salida,
  );
});

test("rendirse NO publica nada: sale antes de tocar ningun destino", () => {
  const r = conElLockTomado({ esperaSegundos: 1 });
  assert.equal(r.status, 0, "el cron lee el codigo de salida; rendirse no es un error del sistema");
  for (const destino of ["plataforma:", "landing:", "bot:"]) {
    assert.ok(
      !r.salida.includes(destino),
      `llego a medir ${destino} sin tener el lock: dos publicadores encimados es justo ` +
        "lo que el lock existe para impedir. Salida: " + r.salida,
    );
  }
});

test("el aviso esta definido ANTES del bloque del lock, o el salteo muere mudo", () => {
  const fuente = spawnSync("cat", [GUION], { encoding: "utf8" }).stdout;
  const defineAvisar = fuente.indexOf("\navisar() {");
  const tomaElLock = fuente.indexOf("\nexec 9>");
  assert.ok(defineAvisar > -1 && tomaElLock > -1, "no encontre avisar() o la toma del lock");
  assert.ok(
    defineAvisar < tomaElLock,
    "el bloque del lock usa avisar() para escalar el salteo, pero la funcion se define " +
      "DESPUES: en bash eso es 'command not found' justo en el caso raro que se quiere ver.",
  );
});
