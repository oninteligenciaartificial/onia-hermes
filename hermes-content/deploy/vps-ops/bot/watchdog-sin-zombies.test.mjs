// ---------------------------------------------------------------------------
// watchdog-sin-zombies.test.mjs
//
// QUE FIJA. Ningun `docker exec` del watchdog corre `timeout` DENTRO del contenedor.
//
// POR QUE, medido el 2026-09-24: onia-center tenia 13.559 procesos zombie (71% de su
// limite de pids, +720 por dia = una corrida del cron cada 2 min). El `timeout` de
// busybox se bifurca: el padre hace exec del comando y un HIJO vigila. Cuando el
// comando termina, ese hijo queda huerfano, lo adopta el PID 1 del contenedor
// (`node server.js`, que no recoge hijos) y queda zombie para siempre. A ese ritmo, en
// ~7 dias el contenedor no podia crear procesos y el bot dejaba de enviar.
// El tope va del lado del HOST (`timeout N docker exec ...`), no adentro.
// ---------------------------------------------------------------------------
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

for (const script of ["webhook-watchdog.sh", "webhook-server.sh"]) {
  test(`${script}: ningun docker exec corre timeout adentro del contenedor`, () => {
    const lineas = readFileSync(join(AQUI, script), "utf8").split("\n");
    const culpables = lineas
      .map((l, i) => ({ l, n: i + 1 }))
      .filter(({ l }) => !l.trim().startsWith("#"))
      .filter(({ l }) => /docker exec\b.*\btimeout\s+\d/.test(l));
    assert.deepEqual(culpables, [], culpables.map((c) => `${script}:${c.n}: ${c.l.trim()}`).join("\n"));
  });
}
