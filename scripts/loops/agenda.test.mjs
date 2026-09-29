// agenda.test.mjs — el lector del calendario de Sergio Urcullo (scripts/loops/agenda.sh).
//
// POR QUÉ EXISTE. El 2026-09-29 Sergio Urcullo compartió su calendario personal para que el
// resumen de las 06:30 traiga SU día y para que sus bloques (colegio, 🔒, 🎬, «sin celular»)
// decidan cuándo se lo puede interrumpir. Estos casos fijan las dos promesas —«su día» sin la
// rutina que empuja afuera lo importante, y «sus bloques» completos— y el contrato con la
// aduana (onia-tg.sh), que es la que usa el archivo de bloques.
//
// El calendario de prueba copia la FORMA de su calendario real del 29-sep (eventos repetidos
// con recurringEventId, una reserva de cal.com en otra zona horaria), no sus datos.
//
// Se corre con: node --test scripts/loops/agenda.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const AGENDA = join(AQUI, "agenda.sh");
const ADUANA = join(AQUI, "onia-tg.sh");
const HOY = "2026-09-30";

const ev = (summary, ini, fin, extra = {}) => ({
  summary,
  status: "confirmed",
  start: { dateTime: ini, timeZone: "America/La_Paz" },
  end: { dateTime: fin, timeZone: "America/La_Paz" },
  ...extra,
});
const rutina = { recurringEventId: "serie" };

const DIA = [
  ev("🌅 Levantarse — sin celular", `${HOY}T07:00:00-04:00`, `${HOY}T07:15:00-04:00`, rutina),
  ev("🎒 Colegio", `${HOY}T08:00:00-04:00`, `${HOY}T12:30:00-04:00`, rutina),
  ev("🍽️ Almuerzo + descanso", `${HOY}T12:30:00-04:00`, `${HOY}T13:00:00-04:00`, rutina),
  ev("🔒 ONIA · Platform — revisar el recorrido", `${HOY}T13:00:00-04:00`, `${HOY}T14:30:00-04:00`, rutina),
  // Viene en UTC: tiene que salir en hora de La Paz (15:00), no a las 19:00.
  ev("🎬 Grabar pieza 2", `${HOY}T19:00:00Z`, `${HOY}T20:30:00Z`),
  ev("📖 Lectura — sin celular", `${HOY}T17:00:00-04:00`, `${HOY}T17:30:00-04:00`, rutina),
  // Reserva de cal.com: otra zona horaria con el mismo offset, y el título largo de siempre.
  ev("Llamada 1 a 1 between Sergio Urcullo and Ana Pérez", `${HOY}T20:20:00-04:00`, `${HOY}T20:40:00-04:00`, {
    start: { dateTime: `${HOY}T20:20:00-04:00`, timeZone: "America/Caracas" },
  }),
  ev("Reunión que rechazó", `${HOY}T18:00:00-04:00`, `${HOY}T18:30:00-04:00`, {
    attendees: [{ email: "yo@x", self: true, responseStatus: "declined" }],
  }),
  ev("📵 Desconectar", `${HOY}T22:30:00-04:00`, `${HOY}T23:00:00-04:00`, rutina),
  { summary: "Feriado local", status: "confirmed", start: { date: HOY }, end: { date: "2026-10-01" } },
];

/** Banco: curl de mentira que devuelve el calendario dado y anota con qué lo llamaron. */
function banco({ calendario = DIA, rc = 0, conConf = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "onia-agenda-"));
  const estado = join(dir, "estado");
  mkdirSync(estado);
  const llamadas = join(dir, "llamadas.txt");
  writeFileSync(join(dir, "cal.json"), JSON.stringify(calendario));
  const curl = join(dir, "curl");
  writeFileSync(
    curl,
    `#!/usr/bin/env bash
printf '%s\\n' "$*" >> ${llamadas}
[ ${rc} -eq 0 ] || exit ${rc}
cat ${join(dir, "cal.json")}
`,
  );
  chmodSync(curl, 0o755);
  const conf = join(dir, "agenda.env");
  if (conConf) writeFileSync(conf, "ONIA_AGENDA_URL=https://n8n.ejemplo/webhook/ruta-secreta\n");
  const env = {
    ...process.env,
    PATH: `${dir}:${process.env.PATH}`,
    ONIA_AGENDA_CONF: conf,
    ONIA_AVISO_ESTADO: estado,
    ONIA_TG_LOG: join(dir, "onia-tg.log"),
  };
  const correr = (...args) => spawnSync("bash", [AGENDA, ...args], { env, encoding: "utf8" });
  const lineas = (r) => r.stdout.split("\n").filter(Boolean);
  const bloques = () => {
    const f = join(estado, "bloques-hoy.tsv");
    return existsSync(f) ? readFileSync(f, "utf8").split("\n").filter(Boolean) : null;
  };
  const puedo = (hm) =>
    spawnSync("bash", [ADUANA], {
      env: { ...env, ONIA_AVISO_PUEDO: "1", ONIA_AVISO_FECHA: HOY, ONIA_AVISO_HM: hm },
      encoding: "utf8",
    }).status;
  return { correr, lineas, bloques, puedo, estado, llamadas: () => readFileSync(llamadas, "utf8") };
}

// ── Su día: lo que importa, en orden y en hora de La Paz ────────────────────────

test("su día trae colegio, los bloques de trabajo, la reunión y lo que no se repite — en orden", () => {
  const b = banco();
  const r = b.correr(HOY);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(b.lineas(r), [
    "Todo el día · Feriado local",
    "08:00–12:30 🎒 Colegio",
    "13:00–14:30 🔒 ONIA · Platform — revisar el recorrido",
    "15:00–16:30 🎬 Grabar pieza 2",
    "20:20–20:40 Llamada 1 a 1 con Ana Pérez",
  ]);
});

test("gemelo: la rutina repetida y lo que rechazó NO entran (empujaban afuera a la reunión)", () => {
  const b = banco();
  const salida = b.correr(HOY).stdout;
  for (const fuera of ["Levantarse", "Almuerzo", "Lectura", "Desconectar", "rechazó"]) {
    assert.doesNotMatch(salida, new RegExp(fuera), fuera);
  }
});

test("pide al calendario el día entero de La Paz, no el de UTC", () => {
  const b = banco();
  b.correr(HOY);
  assert.match(b.llamadas(), new RegExp(`desde=${HOY}T00:00:00-04:00`));
  assert.match(b.llamadas(), new RegExp(`hasta=${HOY}T23:59:59-04:00`));
});

test("un día vacío (n8n responde [{}]) no es un error: sale 0 y sin líneas", () => {
  const b = banco({ calendario: [{}] });
  const r = b.correr(HOY);
  assert.equal(r.status, 0);
  assert.equal(b.lineas(r).length, 0);
});

test("si el calendario no responde, sale 1 — el resumen dice «no pude leer», no «nada»", () => {
  const b = banco({ rc: 22 });
  const r = b.correr(HOY);
  assert.equal(r.status, 1);
  assert.equal(b.lineas(r).length, 0);
});

test("sin la URL configurada sale 2 y lo dice, sin inventar un día vacío", () => {
  const b = banco({ conConf: false });
  const r = b.correr(HOY);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /falta ONIA_AGENDA_URL/);
});

test("un error nunca imprime la URL: la ruta es la llave del calendario", () => {
  const b = banco({ rc: 22 });
  const r = b.correr(HOY);
  assert.doesNotMatch(r.stdout + r.stderr, /ruta-secreta/);
});

// ── Sus bloques: todos, repetidos o no, para la aduana ──────────────────────────

test("los bloques incluyen colegio, 🔒, 🎬, «sin celular» y 📵 — y ninguna reunión ni el almuerzo", () => {
  const b = banco();
  const r = b.correr("--bloques", HOY);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(b.bloques(), [
    `${HOY}\t0700\t0715\t🌅 Levantarse — sin celular`,
    `${HOY}\t0800\t1230\t🎒 Colegio`,
    `${HOY}\t1300\t1430\t🔒 ONIA · Platform — revisar el recorrido`,
    `${HOY}\t1500\t1630\t🎬 Grabar pieza 2`,
    `${HOY}\t1700\t1730\t📖 Lectura — sin celular`,
    `${HOY}\t2230\t2300\t📵 Desconectar`,
  ]);
});

test("si el calendario falla, el archivo de bloques anterior queda como estaba", () => {
  const b = banco({ rc: 22 });
  writeFileSync(join(b.estado, "bloques-hoy.tsv"), `${HOY}\t0800\t1230\t🎒 Colegio\n`);
  const r = b.correr("--bloques", HOY);
  assert.equal(r.status, 1);
  assert.deepEqual(b.bloques(), [`${HOY}\t0800\t1230\t🎒 Colegio`]);
});

test("contrato con la aduana: con los bloques escritos, en clase espera y en el hueco suena", () => {
  const b = banco();
  b.correr("--bloques", HOY);
  writeFileSync(join(b.estado, "activo"), "");
  assert.equal(b.puedo("1000"), 75, "en Colegio");
  assert.equal(b.puedo("1400"), 75, "en el bloque 🔒");
  assert.equal(b.puedo("1445"), 0, "entre bloques");
  assert.equal(b.puedo("1715"), 75, "leyendo, sin celular");
  assert.equal(b.puedo("1900"), 0);
});
