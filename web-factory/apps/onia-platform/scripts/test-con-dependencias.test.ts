import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const GUARDA = fileURLToPath(new URL("./test-con-dependencias.mjs", import.meta.url));
const APP = fileURLToPath(new URL("..", import.meta.url));

/** Un directorio del que NINGUN padre tiene node_modules/.bin/vitest. */
function correrSinDependencias() {
  const cwd = mkdtempSync(join(tmpdir(), "onia-sin-deps-"));
  return spawnSync(process.execPath, [GUARDA], { cwd, encoding: "utf8" });
}

/**
 * El defecto que origina esta guarda (t_43a9b27c): en un worktree sin las
 * dependencias de la app, `vitest run` moria con EXIT 127 "vitest: not found".
 * Un carril leia eso como "los tests estan rojos" o "lo rompi yo" y gastaba la
 * vuelta; el integrador corre esta misma cadena antes de mergear a main.
 */
describe("test:sitio-venta no puede fallar de forma ambigua", () => {
  it("sin dependencias falla, nunca pasa en verde", () => {
    // Lo que NO puede pasar: verde sin haber corrido un solo test. Estos tests
    // son el unico gate que impide un precio de plan tipeado a mano en la
    // superficie de venta; apagarse en silencio es el peor modo de fallo.
    expect(correrSinDependencias().status).not.toBe(0);
  });

  it("sin dependencias el codigo de salida NO se confunde con un test roto", () => {
    const status = correrSinDependencias().status;
    expect(status).not.toBe(127); // "command not found", el que engañaba
    expect(status).not.toBe(1); // el que devuelve vitest con tests en rojo
    expect(status).toBe(78);
  });

  it("sin dependencias dice el comando exacto que lo arregla", () => {
    const r = correrSinDependencias();
    const salida = `${r.stdout}${r.stderr}`;
    expect(salida).toContain("npm ci");
    expect(salida).toContain("web-factory/apps/onia-platform");
    // Que se lea que NO es un test en rojo: esa confusion es la que costo vueltas.
    expect(salida.toLowerCase()).toContain("no se corrio");
  });

  // Contracara: una guarda que fallara SIEMPRE taparia los tests de verdad y
  // seria igual de inutil. Con las dependencias puestas tiene que encontrarlas.
  it("con las dependencias de la app encuentra vitest", () => {
    const r = spawnSync(process.execPath, [GUARDA, "--solo-verificar"], {
      cwd: APP,
      encoding: "utf8",
    });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toMatch(/node_modules\/\.bin\/vitest$/);
  });

  // Sin esto la guarda queda huerfana: seguiria verde aunque `npm test` volviera
  // a llamar a `vitest` pelado, que es justo el defecto que vino a cerrar.
  it("los gates de la app pasan por la guarda, no por vitest pelado", () => {
    const scripts = JSON.parse(readFileSync(join(APP, "package.json"), "utf8")).scripts;
    for (const nombre of ["test", "prebuild"]) {
      expect(scripts[nombre]).toContain("scripts/test-con-dependencias.mjs");
      expect(scripts[nombre]).not.toMatch(/(^|&&\s*|;\s*)vitest\b/);
    }
  });

  // Un .mjs que corre su medicion en el top-level la dispara al ser IMPORTADO.
  // Aca eso significaria lanzar vitest dentro de vitest.
  it("importarla no corre nada", () => {
    const r = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", `await import(${JSON.stringify(GUARDA)}); console.log("IMPORTADA_SIN_CORRER");`],
      { cwd: APP, encoding: "utf8" },
    );
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("IMPORTADA_SIN_CORRER");
    expect(r.stdout).not.toContain("Test Files");
  });
});
