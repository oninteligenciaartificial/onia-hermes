import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, chmodSync, existsSync, readdirSync, statSync, utimesSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const fuente = readFileSync(join(RAIZ, "hermes-content/deploy/hermes-jarvis/diagnostico.sh"), "utf8").replaceAll("\r\n", "\n");
const inicio = fuente.indexOf('sec "17.');
assert.ok(inicio >= 0, "falta la sección QA release");
const fin = fuente.indexOf('\nsec "', inicio + 1);
assert.ok(fin > inicio, "falta la sección siguiente");
const seccion = fuente.slice(inicio, fin);
const redactar = "s/SECRETO-DE-PRUEBA/***/g";

function hashes(raiz) {
  const salida = {};
  function recorrer(dir) {
    for (const nombre of readdirSync(dir)) {
      const ruta = join(dir, nombre);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else salida[ruta.slice(raiz.length)] = createHash("sha256").update(readFileSync(ruta)).digest("hex");
    }
  }
  recorrer(raiz);
  return salida;
}
function correr({ estado, log, texto = seccion, sed = redactar } = {}) {
  const tmp = mkdtempSync(join(tmpdir(), "diag-qa-release-"));
  try {
    const dirEstado = estado ?? join(tmp, "estado");
    const rutaLog = log ?? join(tmp, "qa.log");
    const dobles = join(tmp, "dobles");
    mkdirSync(dobles);
    const marcador = join(tmp, "llamada-prohibida");
    for (const nombre of ["curl", "wget", "docker", "hermes", "ssh"]) {
      const ruta = join(dobles, nombre);
      writeFileSync(ruta, `#!/bin/sh\nprintf x > '${marcador}'\n`);
      chmodSync(ruta, 0o755);
    }
    const antes = existsSync(dirEstado) ? hashes(dirEstado) : null;
    const local = texto.replaceAll("/var/lib/onia-qa-release", dirEstado).replaceAll("/var/log/onia-qa-release.log", rutaLog);
    const comun = readFileSync(join(RAIZ, "hermes-content/deploy/hermes-jarvis/comun.sh"), "utf8").replaceAll("\r\n", "\n");
    const script = `REDACTAR_SED='${sed}'\n${comun}\n${local}`;
    const r = spawnSync("bash", ["-s"], { input: script, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
    assert.equal(r.status, 0, r.error?.message || r.stdout + r.stderr);
    assert.equal(existsSync(marcador), false, "la sección ejecutó un comando prohibido");
    if (antes) assert.deepEqual(hashes(dirEstado), antes, "la sección modificó el estado");
    return r.stdout;
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}
function crearEstado(raiz) { const estado = join(raiz, "estado"); mkdirSync(estado, { recursive: true }); return estado; }
function guardar(estado, nombre, contenido = "") { writeFileSync(join(estado, nombre), contenido); }
function epochHora(epoch) { return new Date(epoch * 1000).toISOString().slice(11, 16) + "Z"; }

test("carpeta ausente: avisa y termina la sección", () => {
  const out = correr();
  assert.match(out, /no existe .*: qa-release todavía no corrió/);
  assert.doesNotMatch(out, /release visto:|veredicto:|ventanas del publicador:|tareas abiertas:|capturas:|últimas 15 líneas/);
});
test("visto válido: release medido y veredicto sano", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); guardar(estado, "visto", "abc1234\n"); const out = correr({ estado }); assert.match(out, /release visto: abc1234 \(hace \d+ min\)/); assert.match(out, /veredicto: sano/); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("roto: hora UTC, corte de 160 caracteres y redacción", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try {
    const estado = crearEstado(tmp); const epoch = 1791700000; const motivo = `SECRETO-DE-PRUEBA ${"x".repeat(400)}`; guardar(estado, "roto", `abc1234 ${epoch} ${motivo}\n`);
    const out = correr({ estado }); const linea = out.split("\n").find((l) => l.includes("veredicto: ROTO"));
    assert.ok(linea); assert.ok(linea.includes(`ROTO desde ${epochHora(epoch)}`), linea); assert.ok(linea.endsWith("*** " + "x".repeat(156)), linea); assert.doesNotMatch(out, /SECRETO-DE-PRUEBA/);
    assert.throws(() => assert.doesNotMatch(correr({ estado, texto: seccion.replaceAll("redactar", "cat") }), /SECRETO-DE-PRUEBA/));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("un secreto de largo fijo en el límite del corte no se escapa a medias (se redacta antes de cortar)", () => {
  // Revisión del 11-oct: con «cut | redactar» los primeros 20 de 40 hexadecimales quedaban a la vista, porque el
  // corte los partía y la redacción de largo fijo ya no los reconocía.
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try {
    const estado = crearEstado(tmp); const secreto = "0123456789abcdef0123456789abcdef01234567"; const sed = "s/[0-9a-f]{40}/***/g";
    guardar(estado, "roto", `abc1234 1791700000 ${"y".repeat(140)}${secreto}\n`);
    const log = join(tmp, "qa.log"); writeFileSync(log, `${"x".repeat(180)}${secreto}\n`);
    const out = correr({ estado, log, sed });
    assert.doesNotMatch(out, /0123456789abcdef0123/); assert.match(out, /\*\*\*/);
    // y sin el arreglo (cortar primero) se escaparía: la prueba lo comprueba.
    const sinArreglo = seccion.replaceAll("| redactar | cut -c 1-160", "| cut -c 1-160 | redactar").replaceAll("| redactar | cut -c 1-200", "| cut -c 1-200 | redactar");
    assert.throws(() => assert.doesNotMatch(correr({ estado, log, sed, texto: sinArreglo }), /0123456789abcdef0123/));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("sin medir aparece solo o después de ROTO", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); guardar(estado, "sin-medir"); let out = correr({ estado }); assert.match(out, /veredicto: SIN MEDIR/); guardar(estado, "roto", "abc1234 1791700000 motivo\n"); out = correr({ estado }); assert.ok(out.indexOf("veredicto: ROTO") < out.indexOf("veredicto: SIN MEDIR")); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("ventana y contador validan sus formatos", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); guardar(estado, "ventana", "1791700000\n"); guardar(estado, "ventanas-seguidas", "12\n"); let out = correr({ estado }); assert.match(out, new RegExp(`última leída ${epochHora(1791700000)}; seguidas sin publicar: 12`)); guardar(estado, "ventana", "xyz\n"); guardar(estado, "ventanas-seguidas", "xyz\n"); out = correr({ estado }); assert.match(out, /última leída \?; seguidas sin publicar: \?/); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("tareas muestran ids válidos, inválidos y ausentes", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); guardar(estado, "tarea-roto", "t_0a1b2c3d\n"); guardar(estado, "tarea-log", "no-es-un-id\n"); const out = correr({ estado }); assert.match(out, /tareas abiertas: roto t_0a1b2c3d · medir — · log \(id inválido\) · ventanas —/); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("capturas: cuenta PNG y no revela nombres", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); const dir = join(estado, "capturas"); mkdirSync(dir); const ahora = Date.now() / 1000; for (const [nombre, mins] of [["uno.png", 30], ["dos.png", 20], ["privado-nombre.png", 2]]) { const p = join(dir, nombre); writeFileSync(p, "png"); utimesSync(p, ahora - mins * 60, ahora - mins * 60); } const out = correr({ estado }); assert.match(out, /capturas: 3 archivo\(s\) \.png; la más nueva hace \d+ min/); assert.doesNotMatch(out, /uno\.png|dos\.png|privado-nombre/); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("log: últimas 15 líneas, corte 200 y redacción", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); const rutaLog = join(tmp, "qa.log"); const lineas = Array.from({ length: 40 }, (_, i) => `linea-${i + 1}`); lineas[38] = "L".repeat(500); lineas[39] = "SECRETO-DE-PRUEBA linea-final"; writeFileSync(rutaLog, lineas.join("\n") + "\n"); const out = correr({ estado, log: rutaLog }); assert.match(out, /linea-26/); assert.doesNotMatch(out, /linea-25/); assert.ok(out.includes("L".repeat(200))); assert.ok(!out.includes("L".repeat(201))); assert.match(out, /\*\*\* linea-final/); assert.doesNotMatch(out, /SECRETO-DE-PRUEBA/); const mutado = seccion.replace("tail -n 15", "tail -n 150"); assert.throws(() => { const salida = correr({ estado, log: rutaLog, texto: mutado }); assert.doesNotMatch(salida, /linea-25/); }); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("los controles internos nunca se muestran", () => {
  const tmp = mkdtempSync(join(tmpdir(), "estado-qa-"));
  try { const estado = crearEstado(tmp); guardar(estado, "corriendo-desde", "secreto\n"); guardar(estado, ".candado", "secreto\n"); const out = correr({ estado }); assert.doesNotMatch(out, /corriendo-desde|\.candado/); }
  finally { rmSync(tmp, { recursive: true, force: true }); }
});
test("la sección solo lee y su texto no contiene órdenes externas", () => {
  assert.doesNotMatch(seccion, /curl|wget|docker|ssh|https?:\/\/|rm |mv |touch |>>/i);
});