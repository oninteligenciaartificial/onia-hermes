import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { alcanza, hrefsDeArray, segmento } from "./capacidad-por-rubro.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Las partes PURAS del cruce (capacidad, rubro), cableadas a `npm test`. La
 * medición viva vive en el alias `capacidad:por-rubro` y no entra en la cadena:
 * necesita el repo hermano y pondría rojo por AMBIENTE, que traba el merge de
 * los quince carriles.
 */
describe("cruce (capacidad, rubro): las piezas que no necesitan el repo hermano", () => {
  it("alcanza() corta por SEGMENTO, que es como corta el layout", () => {
    const comunes = new Set(["dashboard"]);
    // El pack declara /billing; el layout permite el segmento entero, así que
    // /billing/recurring también entra. Confundirlos volvería a prometerle las
    // recurrentes a quien sólo tiene cobros.
    expect(alcanza({ pantalla: "/billing/recurring", navDelRubro: ["/billing"], comunes })).toBe(true);
    expect(alcanza({ pantalla: "/reports", navDelRubro: ["/billing"], comunes })).toBe(false);
  });

  it("un segmento común lo alcanza cualquier pack, aunque no lo declare", () => {
    expect(alcanza({ pantalla: "/settings", navDelRubro: [], comunes: new Set(["settings"]) })).toBe(true);
  });

  it("hrefsDeArray corta en el cierre del array y no se pasa al siguiente", () => {
    const txt = 'const A = [\n  { href: "/uno" },\n  { href: "/dos" },\n];\nconst B = [\n  { href: "/tres" },\n];';
    const leidos = hrefsDeArray(txt, "const A");
    expect(leidos).toEqual(["/uno", "/dos"]);
  });

  it("hrefsDeArray AVISA cuando el array no está, en vez de devolver vacío", () => {
    // Devolver [] haría que un rubro sin nav parezca un rubro que no alcanza
    // nada: el gate acusaría al producto de un defecto del instrumento.
    expect(hrefsDeArray("const A = [\n];", "const NO_EXISTE")).toBeNull();
  });

  it("segmento() toma el primero, que es la unidad del corte", () => {
    expect(segmento("/billing/recurring")).toBe("billing");
    expect(segmento("/reports")).toBe("reports");
  });

  it("importar el módulo NO dispara la medición ni mata al proceso", () => {
    // En ESTE proceso el módulo ya está cacheado, así que el caso pasaría en
    // falso: la prueba tiene que correr en un proceso HIJO.
    const salida = execFileSync(
      process.execPath,
      ["-e", `import(${JSON.stringify(join(AQUI, "capacidad-por-rubro.mjs"))}).then((m) => { console.log("VIVO", typeof m.alcanza); });`],
      { encoding: "utf8", timeout: 20_000 },
    );
    expect(salida).toContain("VIVO function");
    // Si la guarda faltara, el import habría impreso el informe de la medición.
    expect(salida).not.toContain("Rubros activos leídos");
    expect(salida).not.toContain("NO MEDIDO");
  });

  it("el self-check del script pasa en verde", () => {
    const salida = execFileSync(
      process.execPath,
      [join(AQUI, "capacidad-por-rubro.mjs"), "--self-check"],
      { encoding: "utf8", timeout: 20_000 },
    );
    expect(salida).toContain("self-check VERDE");
  });
});
