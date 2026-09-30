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
// Lejos en el futuro a propósito: «huecos» de HOY y el «esa hora ya pasó» miran el reloj real.
const HOY = "2030-01-15";

let n = 0;
const ev = (summary, ini, fin, extra = {}) => ({
  id: `evt${String(++n).padStart(5, "0")}`,
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

/** Banco: curl de mentira que devuelve el calendario dado, contesta los cambios y anota todo. */
function banco({ calendario = DIA, rc = 0, conConf = true, respuestaCambio = { id: "evt-nuevo-1" } } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "onia-agenda-"));
  const estado = join(dir, "estado");
  mkdirSync(estado);
  const llamadas = join(dir, "llamadas.txt");
  const pedidos = join(dir, "pedidos.txt");
  writeFileSync(join(dir, "cal.json"), JSON.stringify(calendario));
  writeFileSync(join(dir, "resp.json"), JSON.stringify([respuestaCambio]));
  const curl = join(dir, "curl");
  writeFileSync(
    curl,
    `#!/usr/bin/env bash
printf '%s\\n' "$*" >> ${llamadas}
[ ${rc} -eq 0 ] || exit ${rc}
for a in "$@"; do case "$a" in @*) cat "\${a#@}" >> ${pedidos}; echo >> ${pedidos}; cat ${join(dir, "resp.json")}; exit 0;; esac; done
cat ${join(dir, "cal.json")}
`,
  );
  chmodSync(curl, 0o755);
  const conf = join(dir, "agenda.env");
  if (conConf)
    writeFileSync(
      conf,
      "ONIA_AGENDA_URL=https://n8n.ejemplo/webhook/ruta-secreta\nONIA_AGENDA_CAMBIOS_URL=https://n8n.ejemplo/webhook/otra-secreta\n",
    );
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
  const pedidosHechos = () =>
    existsSync(pedidos) ? readFileSync(pedidos, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
  return { correr, lineas, bloques, puedo, estado, pedidosHechos, llamadas: () => readFileSync(llamadas, "utf8") };
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

// ── Cambiar su calendario: nunca sin su sí ──────────────────────────────────────
// Sergio Urcullo, 2026-09-30: "terminemos de hacer hermes" — agendar, mover y cancelar desde
// Telegram. Lo cambia Hermes, que es un modelo: la regla «primero se le muestra, después se hace»
// vive acá, donde no se la puede saltar. Sin --si, cero pedidos al calendario.

const idDe = (titulo) => DIA.find((e) => e.summary === titulo).id;

test("crear sin --si NO toca el calendario: muestra lo que haría y sale 3", () => {
  const b = banco();
  const r = b.correr("crear", HOY, "19:00", "20:00", "Llamada", "con", "Ana");
  assert.equal(r.status, 3);
  assert.match(r.stdout, /SIN CAMBIOS — falta el sí de Sergio Urcullo/);
  assert.match(r.stdout, /crear «Llamada con Ana» el mar 15-ene 19:00–20:00/);
  assert.equal(b.pedidosHechos().length, 0);
});

test("la vista previa avisa con qué choca (y el choque no bloquea: decide él)", () => {
  const b = banco();
  const r = b.correr("crear", HOY, "13:30", "14:00", "Dentista");
  assert.equal(r.status, 3);
  assert.match(r.stdout, /⚠️ choca con: 13:00–14:30 🔒 ONIA · Platform — revisar el recorrido/);
});

test("crear con --si manda exactamente ese evento, en hora de La Paz, y devuelve el id", () => {
  const b = banco();
  const r = b.correr("crear", HOY, "19:00", "20:00", "Llamada con Ana", "--si");
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(b.pedidosHechos(), [
    { op: "crear", titulo: "Llamada con Ana", inicio: `${HOY}T19:00:00-04:00`, fin: `${HOY}T20:00:00-04:00` },
  ]);
  assert.match(r.stdout, /✅ creado: mar 15-ene 19:00–20:00 Llamada con Ana \(id evt-nuevo-1\)/);
});

test("mover sin --si dice de dónde a dónde, con el título real, y no toca nada", () => {
  const b = banco();
  const r = b.correr("mover", idDe("🔒 ONIA · Platform — revisar el recorrido"), "2030-01-16", "19:00", "20:30");
  assert.equal(r.status, 3);
  assert.match(r.stdout, /mover «🔒 ONIA · Platform — revisar el recorrido» del mar 15-ene 13:00–14:30 al mié 16-ene 19:00–20:30/);
  assert.equal(b.pedidosHechos().length, 0);
});

test("mover con --si manda el id y el horario nuevo", () => {
  const b = banco();
  const id = idDe("🔒 ONIA · Platform — revisar el recorrido");
  const r = b.correr("mover", id, "2030-01-16", "19:00", "20:30", "--si");
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(b.pedidosHechos(), [
    { op: "mover", id, inicio: "2030-01-16T19:00:00-04:00", fin: "2030-01-16T20:30:00-04:00" },
  ]);
  assert.match(r.stdout, /✅ movido: «🔒 ONIA · Platform — revisar el recorrido» ahora el mié 16-ene 19:00–20:30/);
});

test("mover un evento dentro del mismo día no choca consigo mismo", () => {
  const b = banco();
  const r = b.correr("mover", idDe("🎬 Grabar pieza 2"), HOY, "15:30", "17:15");
  assert.equal(r.status, 3);
  assert.doesNotMatch(r.stdout, /choca con: 15:00–16:30 🎬/);
  assert.match(r.stdout, /choca con: 17:00–17:30 📖 Lectura/);
});

test("mover o cancelar un id que no existe: sale 4 y no manda nada", () => {
  const b = banco();
  assert.equal(b.correr("mover", "noexiste123", HOY, "19:00", "20:00", "--si").status, 4);
  assert.equal(b.correr("cancelar", "noexiste123", "--si").status, 4);
  assert.equal(b.pedidosHechos().length, 0);
});

test("cancelar: sin --si solo muestra; con --si manda el id", () => {
  const b = banco({ respuestaCambio: { success: true } });
  const id = idDe("Llamada 1 a 1 between Sergio Urcullo and Ana Pérez");
  const previa = b.correr("cancelar", id);
  assert.equal(previa.status, 3);
  assert.match(previa.stdout, /cancelar «Llamada 1 a 1 con Ana Pérez» del mar 15-ene 20:20–20:40/);
  assert.equal(b.pedidosHechos().length, 0);
  const r = b.correr("cancelar", id, "--si");
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(b.pedidosHechos(), [{ op: "cancelar", id }]);
});

test("horas imposibles, fin antes del inicio o una hora pasada: no se manda nada", () => {
  const b = banco();
  assert.equal(b.correr("crear", HOY, "25:00", "26:00", "X", "--si").status, 64);
  assert.equal(b.correr("crear", HOY, "20:00", "19:00", "X", "--si").status, 64);
  assert.equal(b.correr("crear", "2020-01-01", "10:00", "11:00", "X", "--si").status, 64);
  assert.equal(b.correr("mover", idDe("🎒 Colegio"), "2020-01-01", "10:00", "11:00", "--si").status, 64);
  assert.equal(b.pedidosHechos().length, 0);
});

test("huecos: los ratos libres del día, sin pisar ni la rutina", () => {
  const b = banco();
  const r = b.correr("huecos", HOY, "60");
  assert.equal(r.status, 0, r.stderr);
  // Lo que rechazó no ocupa; el almuerzo, la lectura y el ejercicio sí.
  assert.deepEqual(b.lineas(r), ["17:30–20:20 (170 min libres)"]);
  assert.deepEqual(b.lineas(b.correr("huecos", HOY, "30")), [
    "07:30–08:00 (30 min libres)",
    "14:30–15:00 (30 min libres)",
    "16:30–17:00 (30 min libres)",
    "17:30–20:20 (170 min libres)",
    "20:40–21:30 (50 min libres)",
  ]);
});

test("--ids trae el día entero, rutina incluida, con el id de cada evento", () => {
  const b = banco();
  const r = b.correr("--ids", HOY);
  assert.equal(r.status, 0, r.stderr);
  const lineas = b.lineas(r);
  assert.ok(lineas.includes(`${idDe("🍽️ Almuerzo + descanso")}\t12:30\t13:00\t🍽️ Almuerzo + descanso`));
  assert.ok(lineas.some((l) => l.endsWith("\t--\t--\tFeriado local")));
});

test("un comando desconocido no hace nada y explica el uso", () => {
  const b = banco();
  const r = b.correr("borrar-todo");
  assert.equal(r.status, 64);
  assert.match(r.stderr, /crear <fecha>/);
  assert.equal(b.pedidosHechos().length, 0);
});
