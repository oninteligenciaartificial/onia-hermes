import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * La factura fiscal NO se vende como parte del producto.
 *
 * Medido el 2026-09-04: el contenedor `onia-platform` de producción tiene CERO
 * variables `SIAT_*` (`docker exec onia-platform env | grep -c SIAT` → 0). El
 * emisor está en trámite de homologación ante el SIN, y `proof.ts` lo dice de
 * frente en su propia fila (`siat: "tramite"`) y en el ledger `TODAVIA_NO`.
 *
 * Y aun así el pie de TODAS las páginas listaba «Facturación SIAT» dentro de la
 * columna **Producto**, al lado de Precios, Rubros y Agentes. Esa columna
 * enumera lo que el cliente compra: poner ahí la factura fiscal la declara
 * incluida, en la única superficie que no tiene la corrección al lado — el pie
 * aparece en las seis páginas y en ninguna dice «trámite». Sergio le escribe
 * esta semana a 7 leads; el más caro es una clínica que factura.
 *
 * Lo que este gate NO hace, y es a propósito: no prohíbe la palabra «SIAT» en
 * el sitio. `/facturacion` y `/guia-facturacion` son guías HONESTAS sobre la
 * norma del 1 de octubre de 2026 — explican que el Portal Web del SIN es
 * gratuito y que Onia todavía no emite. Un gate que prohibiera el literal
 * obligaría a borrarlas, que es exactamente al revés de lo que hay que hacer:
 * el problema nunca fue nombrar la norma, fue venderla como función nuestra.
 *
 * La invariante es de UBICACIÓN y de VOZ, no de vocabulario.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..");
const PIE = readFileSync(join(RAIZ, "components", "site-footer.tsx"), "utf8");
const PROOF = readFileSync(join(RAIZ, "lib", "proof.ts"), "utf8");

/** Las columnas del pie que enumeran lo que se COMPRA. */
const COLUMNAS_DE_OFERTA = ["Producto", "Servicios"];

/**
 * Los links de un grupo del pie, leídos del archivo.
 *
 * Se recorta por título de grupo hasta el cierre del array: el pie declara los
 * grupos como literales, así que el corte es estable y no hace falta ejecutar
 * el componente.
 */
function linksDelGrupo(src: string, titulo: string): string {
  const desde = src.indexOf(`titulo: "${titulo}"`);
  if (desde === -1) return "";
  const hasta = src.indexOf("],", desde);
  return src.slice(desde, hasta);
}

/** Nombra la factura fiscal como capacidad: «SIAT», «factura electrónica», etc. */
const CLAMA_FACTURA = /siat|factura(ci[oó]n)?\s+(electr[oó]nica|fiscal)/i;

describe("la factura fiscal no se ofrece como producto", () => {
  it("el pie declara sus columnas de oferta", () => {
    // Ancla: si alguien renombra las columnas, los casos de abajo dejarían de
    // mirar nada y pasarían en verde sin vigilar. Que falle acá y se actualice
    // a mano, a la vista.
    for (const titulo of COLUMNAS_DE_OFERTA) {
      expect(PIE, `el pie ya no tiene la columna "${titulo}"`).toContain(
        `titulo: "${titulo}"`,
      );
    }
  });

  it.each(COLUMNAS_DE_OFERTA)(
    "la columna %s del pie no ofrece la factura fiscal",
    (titulo) => {
      const grupo = linksDelGrupo(PIE, titulo);
      const etiquetas = [...grupo.matchAll(/label:\s*"([^"]+)"/g)].map(
        (m) => m[1],
      );

      expect(etiquetas.length, `no se leyeron links de "${titulo}"`).toBeGreaterThan(0);

      const ofrecidas = etiquetas.filter((e) => CLAMA_FACTURA.test(e));
      expect(
        ofrecidas,
        `la columna "${titulo}" del pie enumera lo que el cliente compra, y el ` +
          `emisor fiscal está en trámite ante el SIN (cero variables SIAT_* en ` +
          `producción). Si la guía de la norma va en el pie, va como guía y ` +
          `fuera de "${COLUMNAS_DE_OFERTA.join('" y "')}".`,
      ).toEqual([]);
    },
  );

  it("la comparación sigue declarando el emisor en trámite", () => {
    // La fila de Onia en la tabla es la corrección que sostiene toda la
    // honestidad del sitio. Pasarla a "si" es exactamente el commit que hay que
    // frenar mientras produccion no tenga el emisor encendido: hoy no lo tiene.
    const filaOnia = PROOF.slice(PROOF.indexOf('id: "onia"'));
    const estados = filaOnia.slice(0, filaOnia.indexOf("veredicto"));

    expect(
      estados,
      'la fila de Onia dejó de declarar `siat: "tramite"`. Si el emisor ya está ' +
        "homologado y encendido en producción, este gate se actualiza a mano y " +
        "con la evidencia (variables SIAT_* vivas en el contenedor).",
    ).toMatch(/siat:\s*"tramite"/);
  });
});
