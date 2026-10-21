// Sección 18 del diagnóstico: la última salida de la revisión de la orquesta (21-oct).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, utimesSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DIR = new URL("../../hermes-content/deploy/hermes-jarvis/", import.meta.url);
const diag = readFileSync(new URL("diagnostico.sh", DIR), "utf8").replaceAll("\r\n", "\n");
const inicio = diag.indexOf('sec "18.');
assert.ok(inicio >= 0, "falta la sección 18");
const fin = diag.indexOf('\nsec "', inicio + 1);
const seccion = diag.slice(inicio, fin);

function correr(preparar) {
  const dir = mkdtempSync(join(tmpdir(), "diag-orq-"));
  try {
    mkdirSync(join(dir, ".hermes", "cron"), { recursive: true });
    preparar(dir);
    const comun = readFileSync(new URL("comun.sh", DIR), "utf8").replaceAll("\r\n", "\n").replaceAll("/root", dir);
    const guion = "REDACTAR_SED='s/a^//'\n" + comun + "\n" + seccion.replaceAll("/root", dir);
    const r = spawnSync("bash", ["-s"], { input: guion, encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    return r.stdout;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const conTrabajo = (dir) =>
  writeFileSync(join(dir, ".hermes", "cron", "jobs.json"),
    JSON.stringify({ jobs: [{ id: "26deb0b4121c", name: "onia-planificar-orquesta", enabled: true, state: "scheduled" }] }));

test("muestra la salida MÁS NUEVA de la revisión", () => {
  const out = correr((dir) => {
    conTrabajo(dir);
    const d = join(dir, ".hermes", "cron", "output", "26deb0b4121c");
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "vieja.md"), "la de antes\n");
    utimesSync(join(d, "vieja.md"), new Date(Date.now() - 3600e3), new Date(Date.now() - 3600e3));
    writeFileSync(join(d, "nueva.md"), "[SILENT]\n");
  });
  assert.match(out, /--- su última salida: nueva\.md \(9 bytes, /);
  assert.match(out, /^\[SILENT\]$/m);
  assert.doesNotMatch(out, /la de antes/);
});

test("sin salida todavía, lo dice en vez de callar", () => {
  const out = correr(conTrabajo);
  assert.match(out, /--- su última salida: \(no hay en .*\/cron\/output\/26deb0b4121c\/\)/);
});

test("sin el trabajo, no lista nada de output/", () => {
  const out = correr((dir) => writeFileSync(join(dir, ".hermes", "cron", "jobs.json"), JSON.stringify({ jobs: [] })));
  assert.match(out, /revisión de cada 3 h: no está programada/);
  assert.match(out, /--- su última salida: \(no hay en .*\/cron\/output\/\?\/\)/);
});
