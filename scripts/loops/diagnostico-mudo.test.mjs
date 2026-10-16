// La frontera se calcula desde el reloj de la prueba, no desde el algoritmo del diagnóstico.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, chmodSync, utimesSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DIR = new URL("../../hermes-content/deploy/hermes-jarvis/", import.meta.url);
const diag = readFileSync(new URL("diagnostico.sh", DIR), "utf8").replaceAll("\r\n", "\n");
const inicio = diag.indexOf('sec "15.');
assert.ok(inicio >= 0, "falta la sección 15 (#194)");
const fin = diag.indexOf('\nsec "', inicio + 1);
assert.ok(fin > inicio, "falta la sección siguiente");
const seccion = diag.slice(inicio, fin);

function diagnosticoMudo(casos, texto = seccion) {
  // Si cruza el minuto UTC, se rehacen reloj y mtimes; no se amplía el margen de 60 s.
  for (let intento = 0; intento < 3; intento++) {
    const ahora = Math.floor(Date.now() / 60000) * 60000;
    const dir = mkdtempSync(join(tmpdir(), "diag-mudo-"));
    try {
      const dobles = join(dir, "dobles");
      mkdirSync(dobles);
      const lineas = casos.map((c, i) => {
        const ruta = join(dir, `log-${i}`);
        if (c.fecha !== null) {
          writeFileSync(ruta, "fixture\n");
          const fecha = new Date(c.fecha(ahora));
          utimesSync(ruta, fecha, fecha);
        }
        return `${c.horario} /fixture/trabajo-${i}.sh >> ${ruta} 2>&1`;
      });
      const cron = join(dobles, "crontab");
      writeFileSync(cron, `#!/usr/bin/env bash\ncat <<'CRON'\n${lineas.join("\n")}\nCRON\n`);
      chmodSync(cron, 0o755);
      const comun = readFileSync(new URL("comun.sh", DIR), "utf8").replaceAll("\r\n", "\n").replaceAll("/root", dir);
      const guion = "REDACTAR_SED='s/a^//'\n" + comun + "\n" +
        texto.replaceAll("/var/lib/onia-latido", join(dir, "latidos"));
      const r = spawnSync("bash", ["-s"], { input: guion, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
      assert.equal(r.status, 0, r.error?.message || r.stdout + r.stderr);
      if (Math.floor(Date.now() / 60000) * 60000 !== ahora) continue;
      const filas = casos.map((_, i) => {
        const fila = r.stdout.split("\n").find((l) => l.includes(`trabajo-${i}.sh →`));
        assert.ok(fila, r.stdout);
        return fila.trim().split(/\s+cada\s+/)[0];
      });
      return { ...r, filas };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  assert.fail("el minuto UTC cambió en los tres intentos");
}

const minuto = 60000;
const hora = 60 * minuto;
const dia = 24 * hora;
const ultimaCinco = (t) => Math.floor(t / (5 * minuto)) * 5 * minuto;
const ultimaHora = (t) => Math.floor(t / hora) * hora;
function ultimaDiaria(t) {
  const d = new Date(t);
  const hoy = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 10, 30);
  return t >= hoy ? hoy : hoy - dia;
}
function fronteras() {
  return [
    ...[["*/5 * * * *", ultimaCinco, 5 * minuto], ["0 * * * *", ultimaHora, hora], ["30 10 * * *", ultimaDiaria, dia]]
      .flatMap(([horario, ultima, periodo]) => [58, 62].map((s) => ({ horario, fecha: (t) => ultima(t) - periodo - s * 1000 }))),
    { horario: "0 * * * *", fecha: (t) => ultimaHora(t) + 1000 },
    { horario: "*/5 * * * *", fecha: (t) => ultimaCinco(t) - 2 * minuto },
  ];
}

test("frontera: cada cinco minutos, cada hora, diario y una sola corrida perdida", () => {
  assert.deepEqual(diagnosticoMudo(fronteras()).filas, ["ok", "MUDO", "ok", "MUDO", "ok", "MUDO", "ok", "ok"]);
});

test("log ausente, anual con y sin log y fecha de mañana", () => {
  const r = diagnosticoMudo([
    { horario: "*/5 * * * *", fecha: null },
    { horario: "0 5 1 1 *", fecha: (t) => t },
    { horario: "0 5 1 1 *", fecha: null },
    { horario: "*/5 * * * *", fecha: (t) => t + dia },
  ]);
  assert.deepEqual(r.filas, ["MUDO (no hay log)", "no medible", "no medible", "ok"]);
});

test("lo MUDO sale primero aunque el sano esté primero en el cron", () => {
  const r = diagnosticoMudo([
    { horario: "*/5 * * * *", fecha: (t) => t },
    { horario: "*/5 * * * *", fecha: (t) => ultimaCinco(t) - 5 * minuto - 62000 },
  ]);
  assert.ok(r.stdout.indexOf("trabajo-1.sh →") < r.stdout.indexOf("trabajo-0.sh →"), r.stdout);
  assert.match(r.stdout, /--- 2 línea\(s\): 1 MUDA\(S\), 0 sin log, 0 no medibles/);
});

for (const [antes, despues] of [["penultima - 60", "penultima + 60"], ["penultima - 60", "penultima"], ["cs[-2]", "cs[-1]"]]) {
  test(`mutación detectada: ${antes} → ${despues}`, () => {
    assert.ok(seccion.includes(antes), "la mutación debe modificar el texto real");
    const esperado = ["ok", "MUDO", "ok", "MUDO", "ok", "MUDO", "ok", "ok"];
    assert.deepEqual(diagnosticoMudo(fronteras()).filas, esperado);
    assert.notDeepEqual(diagnosticoMudo(fronteras(), seccion.replace(antes, despues)).filas, esperado);
  });
}
