// onia-tg-solo-decisiones.test.mjs — con $ONIA_AVISO_ESTADO/solo-decisiones al teléfono SOLO llega
// una decisión (interrumpe + ONIA_AVISO_DECISION=1). Sin ese archivo el comportamiento legado queda igual.
// Banco hermético: curl y tablero falsos, estado/log/env en un directorio temporal; no hay red.
//
// Se corre con: node --test scripts/loops/onia-tg-solo-decisiones.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const fw = (p) => p.replaceAll("\\", "/");
const SCRIPT = fw(join(dirname(fileURLToPath(import.meta.url)), "onia-tg.sh"));

function banco({ solo = true, activo = true, hm = "1000", bloque = false } = {}) {
  const dir = fw(mkdtempSync(join(tmpdir(), "onia-solo-")));
  const estado = `${dir}/estado`;
  mkdirSync(estado);
  if (activo) writeFileSync(`${estado}/activo`, "");
  if (solo) writeFileSync(`${estado}/solo-decisiones`, "");
  if (bloque) writeFileSync(`${estado}/bloques-hoy.tsv`, "2026-10-21\t0900\t1100\tClase\n");
  const envios = `${dir}/envios.txt`;
  const tareas = `${dir}/tareas.txt`;
  writeFileSync(tareas, "");
  writeFileSync(
    `${dir}/tablero.sh`,
    `#!/usr/bin/env bash
if [ "$1" = "list" ]; then cat ${tareas}; exit 0; fi
if [ "$1" = "create" ]; then echo "t_0000aaaa $2" >> ${tareas}; echo "Created t_0000aaaa"; exit 0; fi
exit 9
`,
  );
  writeFileSync(
    `${dir}/curl`,
    `#!/usr/bin/env bash
for a in "$@"; do case "$a" in text=*) printf '%s' "\${a#text=}" | base64 -w0 >> ${envios}; echo >> ${envios};; esac; done
echo '{"ok":true,"result":{"message_id":42}}'
`,
  );
  chmodSync(`${dir}/tablero.sh`, 0o755);
  chmodSync(`${dir}/curl`, 0o755);

  const entorno = (env) => ({
    ...process.env,
    PATH: `${dir}${process.platform === "win32" ? ";" : ":"}${process.env.PATH}`,
    TEMP: dir,
    TMP: dir,
    TMPDIR: dir,
    ONIA_TABLERO: `${dir}/tablero.sh`,
    ONIA_TG_LOG: `${dir}/onia-tg.log`,
    ONIA_TG_ENV: `${dir}/no-existe.env`,
    ONIA_AVISO_ESTADO: estado,
    TELEGRAM_BOT_TOKEN: "token-de-mentira",
    TELEGRAM_HOME_CHANNEL: "0",
    ONIA_AVISO_HM: hm,
    ONIA_AVISO_FECHA: "2026-10-21",
    ...env,
  });
  const correr = (args, env = {}) => spawnSync("bash", [SCRIPT, ...args], { env: entorno(env), encoding: "utf8" });
  const enviados = () =>
    existsSync(envios)
      ? readFileSync(envios, "utf8").split("\n").filter(Boolean).map((l) => Buffer.from(l, "base64").toString("utf8"))
      : [];
  const leer = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "");
  return {
    estado,
    enviados,
    avisar: (msg, env = {}) => correr([msg], env),
    puedo: (env = {}) => correr([], { ONIA_AVISO_PUEDO: "1", ...env }).status,
    soltar: (env = {}) => correr([], { ONIA_AVISO_SOLTAR: "1", ...env }),
    log: () => leer(`${dir}/onia-tg.log`),
    cola: () => leer(`${estado}/resumen.log`),
    tareas: () => leer(tareas),
    existe: (sub) => existsSync(`${estado}/${sub}`),
  };
}

const DECISION = { ONIA_AVISO: "interrumpe", ONIA_AVISO_DECISION: "1" };

test("solo-decisiones no activa por sí solo la política de horarios", () => {
  const b = banco({ activo: false, hm: "2300" });
  assert.equal(b.puedo(), 0, "PUEDO conserva el interruptor de horarios");
  assert.equal(b.avisar("decisión explícita", { ...DECISION, ONIA_AVISO_CLAVE: "sin-horarios" }).status, 0);
  assert.equal(b.enviados().length, 1);
});

test("modo solo-decisiones: la rutina calla y la decisión suena", () => {
  const b = banco();
  const r = b.avisar("🙋 rutina sin marcador", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "rut" });
  assert.equal(r.status, 0);
  assert.deepEqual(b.enviados(), [], "la rutina no puede llegar al teléfono");
  const d = b.avisar("🔐 decisión real", { ...DECISION, ONIA_AVISO_CLAVE: "dec" });
  assert.equal(d.status, 0);
  assert.equal(b.enviados().length, 1);
  assert.match(b.enviados()[0], /decisión real/);
});

test("modo solo-decisiones: DIRECTO sin marcador calla, con marcador suena", () => {
  const b = banco();
  b.avisar("directo viejo", { ONIA_TG_DIRECTO: "1" });
  assert.deepEqual(b.enviados(), []);
  b.avisar("directo decisión", { ONIA_TG_DIRECTO: "1", ONIA_AVISO_DECISION: "1" });
  assert.equal(b.enviados().length, 1);
});

test("modo solo-decisiones: AHORA=1 sin marcador no elude el filtro", () => {
  const b = banco();
  b.avisar("jarvis cierre", { ONIA_AVISO: "interrumpe", ONIA_AVISO_AHORA: "1", ONIA_AVISO_EMISOR: "jarvis" });
  assert.deepEqual(b.enviados(), []);
  assert.match(b.log(), /INFORMATIVO/, "va por el camino sistema: log/tarea/dedup");
});

test("modo solo-decisiones: un problema sin marcador se vuelve tarea, no teléfono", () => {
  const b = banco();
  b.avisar("❌ CI roto", { ONIA_AVISO: "interrumpe" });
  assert.deepEqual(b.enviados(), []);
  assert.match(b.tareas(), /CI roto/);
});

test("modo solo-decisiones: resumen queda en el log, sin digest ni teléfono", () => {
  const b = banco();
  const r = b.avisar("📊 dato del día", { ONIA_AVISO: "resumen" });
  assert.equal(r.status, 0);
  assert.deepEqual(b.enviados(), []);
  assert.equal(b.cola(), "", "no alimenta el digest");
  assert.match(b.log(), /dato del día/);
});

test("legado intacto sin el archivo: interrumpe sin marcador suena, resumen se encola, la noche encola con 0", () => {
  const b = banco({ solo: false });
  b.avisar("legado suena", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "leg" });
  assert.equal(b.enviados().length, 1);
  b.avisar("📊 legado resumen", { ONIA_AVISO: "resumen" });
  assert.match(b.cola(), /legado resumen/);
  const n = banco({ solo: false, hm: "2300" });
  assert.equal(n.avisar("noche legado", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "nl" }).status, 0);
  assert.match(n.cola(), /noche legado/);
});

test("modo solo-decisiones: decisión de noche devuelve 75, no marca ni encola", () => {
  const b = banco({ hm: "2300" });
  const r = b.avisar("🔐 decisión de noche", { ...DECISION, ONIA_AVISO_CLAVE: "dn" });
  assert.equal(r.status, 75);
  assert.deepEqual(b.enviados(), []);
  assert.equal(b.cola(), "");
  assert.equal(b.existe("nocturnos/dn"), false);
  assert.equal(b.existe("enviados/dn"), false);
  // con AHORA=1 y marcador sí suena en el silencio
  assert.equal(b.avisar("🔐 decisión de noche", { ...DECISION, ONIA_AVISO_AHORA: "1", ONIA_AVISO_CLAVE: "dn" }).status, 0);
  assert.equal(b.enviados().length, 1);
});

test("modo solo-decisiones: decisión en bloque devuelve 75 y no retiene", () => {
  const b = banco({ bloque: true });
  const r = b.avisar("🔐 decisión en clase", { ...DECISION, ONIA_AVISO_CLAVE: "db" });
  assert.equal(r.status, 75);
  assert.deepEqual(b.enviados(), []);
  assert.equal(b.existe("retenidos.log"), false);
  assert.equal(b.existe("retenidos/db"), false);
  assert.equal(b.existe("enviados/db"), false);
});

test("PUEDO sigue sin exigir marcador: 0 de día, 75 de noche o en bloque", () => {
  assert.equal(banco().puedo(), 0);
  assert.equal(banco({ hm: "2300" }).puedo(), 75);
  assert.equal(banco({ bloque: true }).puedo(), 75);
});

test("modo solo-decisiones: SOLTAR no vacía ni envía las colas antiguas", () => {
  const b = banco();
  const R = `${b.estado}/retenidos.log`;
  writeFileSync(R, "2026-10-20T10:00:00Z\tviejo\tk1\tClase\tAviso viejo\tcuerpo\n");
  mkdirSync(`${b.estado}/retenidos`);
  writeFileSync(`${b.estado}/retenidos/k1`, "1");
  const r = b.soltar();
  assert.equal(r.status, 0);
  assert.deepEqual(b.enviados(), []);
  assert.match(readFileSync(R, "utf8"), /Aviso viejo/);
  assert.deepEqual(readdirSync(`${b.estado}/retenidos`), ["k1"]);
  assert.equal(b.cola(), "");
  assert.match(b.log(), /SOLTAR/);
});

test("legado: SOLTAR sin el archivo sigue mandando lo retenido", () => {
  const b = banco({ solo: false });
  writeFileSync(`${b.estado}/retenidos.log`, "2026-10-20T10:00:00Z\tviejo\tk1\tClase\tAviso viejo\tcuerpo\n");
  assert.equal(b.soltar().status, 0);
  assert.equal(b.enviados().length, 1);
});
