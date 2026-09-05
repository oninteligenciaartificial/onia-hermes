import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  EQUIVALENCIAS,
  MINIMO_RUBROS,
  SWITCHER,
  comparar,
  hayDesalineacion,
  rubrosDelAlta,
  rubrosDelSitio,
} from "./rubros-vivos.mjs";

/**
 * El cruce sitio ↔ alta, probado con los casos que HOY no existen.
 *
 * Un gate que sólo se prueba contra el estado actual no prueba nada: hoy los
 * cinco coinciden, así que cualquier implementación —incluida `return []`— pasa
 * en verde. Lo que se verifica acá es que el instrumento SEPA ponerse rojo, en
 * las dos direcciones, y que no confunda "no pude medir" con "está sano".
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

/** El alta real, recortada: cada opción se publica con su `data-testid`. */
const ALTA_HTML = `
<button type="button" data-testid="rubro-dentagest-clinical" class="x">Clínica dental</button>
<button type="button" data-testid="rubro-gestios-general" class="x">Comercio / tienda</button>
<button type="button" data-testid="rubro-proveegest-electrico" class="x">Importadora</button>
<button type="button" data-testid="rubro-esteticagest-clinical" class="x">Estética y spa</button>
<button type="button" data-testid="rubro-gestios-servicios-profesionales" class="x">Servicios profesionales</button>
`;

describe("lee la autoridad sin enumerarla", () => {
  it("saca los rubros del alta por su data-testid", () => {
    expect(rubrosDelAlta(ALTA_HTML)).toEqual([
      "dentagest-clinical",
      "esteticagest-clinical",
      "gestios-general",
      "gestios-servicios-profesionales",
      "proveegest-electrico",
    ]);
  });

  /**
   * La propiedad que hace que este cruce valga más que `rubros-del-alta.test.ts`:
   * un rubro que nadie previó aparece solo, sin tocar el instrumento.
   */
  it("ve un rubro NUEVO que ninguna lista de este repo nombra", () => {
    const conUnoNuevo =
      ALTA_HTML + '<button data-testid="rubro-hotelgest-boutique">Hotel</button>';
    expect(rubrosDelAlta(conUnoNuevo)).toContain("hotelgest-boutique");
  });

  it("no inventa rubros cuando el alta no contesta lo que esperábamos", () => {
    expect(rubrosDelAlta("<h1>Iniciar sesión</h1>")).toEqual([]);
  });

  it("lee la lista que publica el conmutador de la portada", () => {
    const ids = rubrosDelSitio(readFileSync(SWITCHER, "utf8"));
    expect(ids.length).toBeGreaterThanOrEqual(MINIMO_RUBROS);
  });
});

describe("cruza en las DOS direcciones", () => {
  const delAlta = rubrosDelAlta(ALTA_HTML);
  const delSitio = ["comercio", "dental", "estetica", "importadora", "servicios"];

  it("hoy el sitio vende exactamente lo que el alta entrega", () => {
    const cruce = comparar(delAlta, delSitio);
    expect(cruce).toEqual({ sinMapear: [], noOfrecidos: [], noEntregados: [] });
    expect(hayDesalineacion(cruce)).toBe(false);
  });

  /**
   * Dirección 1 — el caso Veterinaria, que vivió 23 días en `/v1`.
   */
  it("ROJO si el sitio ofrece un rubro que el alta no entrega", () => {
    const cruce = comparar(delAlta, [...delSitio, "veterinaria"]);
    expect(cruce.noEntregados).toEqual(["veterinaria"]);
    expect(hayDesalineacion(cruce)).toBe(true);
  });

  /**
   * Dirección 2 — la que ningún barrido de textos prohibidos puede ver, porque
   * no sobra una palabra: falta. Es la que hoy no tenía gate.
   */
  it("ROJO si el alta entrega un rubro que el sitio no ofrece", () => {
    const cruce = comparar(
      delAlta,
      delSitio.filter((id) => id !== "servicios"),
    );
    expect(cruce.noOfrecidos).toEqual(["servicios"]);
    expect(hayDesalineacion(cruce)).toBe(true);
  });

  /**
   * El rubro nuevo no puede colarse como "todo en orden": sin entrada en
   * EQUIVALENCIAS quedaría fuera de las dos listas y el cruce daría verde.
   */
  it("ROJO si el alta suma un rubro que nadie mapeó", () => {
    const cruce = comparar([...delAlta, "hotelgest-boutique"], delSitio);
    expect(cruce.sinMapear).toEqual(["hotelgest-boutique"]);
    expect(hayDesalineacion(cruce)).toBe(true);
  });

  it("un alta vacía no se lee como sitio sano", () => {
    // sin el piso de MINIMO_RUBROS esto sería el falso verde del instrumento
    const cruce = comparar([], delSitio);
    expect(hayDesalineacion(cruce)).toBe(true);
    expect(cruce.noEntregados).toEqual(delSitio);
  });
});

describe("las equivalencias siguen describiendo el sitio real", () => {
  /**
   * Ancla el mapeo contra la lista que el conmutador publica de verdad. Sin
   * esto, renombrar un rubro en la portada deja `EQUIVALENCIAS` apuntando a un
   * id que ya no existe y el cruce acusa al alta de un defecto propio — el rojo
   * falso que manda a arreglar algo sano.
   */
  it("cada id mapeado existe en el conmutador", () => {
    const delSitio = rubrosDelSitio(readFileSync(SWITCHER, "utf8"));
    for (const id of Object.values(EQUIVALENCIAS)) {
      expect(delSitio, `EQUIVALENCIAS apunta a "${id}", que el conmutador no publica`).toContain(id);
    }
  });
});

describe("la guarda de ejecución directa", () => {
  /**
   * Importar este módulo NO puede disparar la medición contra producción. Se
   * prueba en un proceso HIJO a propósito: en el propio proceso el módulo ya
   * está cacheado por los imports de arriba y el caso pasaría en falso.
   */
  it("importar no mide ni sale del proceso", () => {
    const salida = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import(${JSON.stringify(join(AQUI, "rubros-vivos.mjs"))}).then(() => console.log("VIVO"));`,
      ],
      { encoding: "utf8", timeout: 30_000 },
    );
    expect(salida).toContain("VIVO");
  });
});
