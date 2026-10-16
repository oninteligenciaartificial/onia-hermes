import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const anuncios = new URL("../hermes-content/research/competencia/anuncios/", import.meta.url);
const leer = (ruta) => readFileSync(new URL(ruta, anuncios), "utf8");
const capturas = JSON.parse(leer("fichas/CAPTURAS-11OCT.json"));
const entradas = Object.entries(capturas).flatMap(([slug, filas]) => filas.map((fila) => ({ slug, ...fila })));

function archivosCapturados(dir = anuncios, prefijo = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((archivo) => {
    const ruta = prefijo + archivo.name;
    if (archivo.isDirectory()) return archivosCapturados(new URL(`${archivo.name}/`, dir), `${ruta}/`);
    return archivo.name.endsWith("-11oct.png") ? [ruta] : [];
  });
}

// Solo filas con una ruta de captura: Dentalink NO CAPTURADO no es una entrada.
const fuente = leer("CAPTURAS-50D-11OCT.md").split(/\r?\n/)
  .filter((linea) => /^\| \d+ \|/.test(linea))
  .map((linea) => linea.split("|").slice(1, -1).map((celda) => celda.trim()))
  .filter((celdas) => /^`.+-11oct\.png`$/.test(celdas[6] ?? ""))
  .map(([id, , dias, formato, texto_principal, llamado, ruta]) => ({
    id, dias: dias || null, formato: formato || null,
    texto_principal: texto_principal || null, llamado: llamado || null,
    ruta: ruta.slice(1, -1),
  }));

test("todo PNG del 11-oct está registrado una sola vez bajo su anunciante", () => {
  const archivos = archivosCapturados().sort();
  assert.ok(archivos.length > 0, "no se encontraron capturas del 11-oct");
  assert.deepEqual(entradas.map((c) => c.ruta).sort(), archivos, "captura sin registrar, duplicada o inexistente");
  assert.equal(new Set(entradas.map((c) => c.id)).size, entradas.length, "ids duplicados");
  for (const c of entradas) assert.equal(c.ruta, `${c.slug}/${c.id}-11oct.png`, "id o anunciante no coincide con la ruta");
});

test("los días y todas las celdas se conservan literalmente desde la tabla fuente", () => {
  assert.equal(entradas.length, fuente.length, "faltan o sobran filas respecto de la tabla fuente");
  for (const original of fuente) {
    const entrada = entradas.find((c) => c.ruta === original.ruta);
    assert.ok(entrada, `falta ${original.ruta} en CAPTURAS-11OCT.json`);
    const { slug, ...datos } = entrada;
    assert.deepEqual(datos, original, `${slug}/${original.id}: cambió una celda de la fuente (incluidos los días)`);
  }
});

test("cada captura tiene su fila con id, días y ruta en la sección de su ficha", () => {
  for (const [slug, filas] of Object.entries(capturas)) {
    const ficha = leer(`fichas/${slug}.md`);
    const seccion = ficha.match(/^## Capturas del 11-oct\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1];
    assert.ok(seccion, `${slug}: falta la sección Capturas del 11-oct`);
    const filasFicha = seccion.split(/\r?\n/).filter((linea) => /^\| `\d+` \|/.test(linea));
    assert.equal(filasFicha.length, filas.length, `${slug}: falta o sobra una fila de captura`);
    for (const c of filas) {
      const valores = [`\`${c.id}\``, ...[c.dias, c.formato, c.texto_principal, c.llamado].map((v) => String(v ?? "no observable").replace(/\|/g, "\\|")), `\`${c.ruta}\``];
      assert.ok(filasFicha.includes(`| ${valores.join(" | ")} |`), `${slug}: captura ${c.id} sin citar o con datos distintos`);
    }
  }
});

test("el gate está registrado justo después de test:replica-grupo1", () => {
  const { scripts } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(scripts["test:biblioteca-fichas-capturas"], "node --test scripts/biblioteca-fichas-capturas.test.mjs");
  assert.match(scripts.test, /npm run test:replica-grupo1 && npm run test:biblioteca-fichas-capturas &&/);
});
