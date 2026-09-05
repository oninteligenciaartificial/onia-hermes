import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES } from "@/lib/proof";
import { cadenaHastaSimbolo, moduloDe } from "../rutas";
import { NAV_HEADER } from "./nav";

/**
 * El header de escritorio es el CAMINO DE COMPRA: ninguna de sus pantallas
 * puede mostrarle al lead la tabla de competidores.
 *
 * Lo que estaba roto hasta el 2026-09-04: `/comparativa` vivía en el header,
 * pegada a `/precios`. Es una pantalla que nombra seis competidores CON su
 * precio y que dice textual «El Portal del SIN es gratis y cumple la ley. Eso
 * lo decimos nosotros primero». O sea que el renglón donde el lead va a mirar
 * cuánto cuesta Onia le ofrecía, a un clic, la lista de dónde comprarlo más
 * barato. La regla de Sergio (2026-09-03) es que la web se vende como lety.ai
 * y dapta.ai de HOY: beneficio, un precio claro, y cero autobombo — nada sobre
 * nuestras competencias.
 *
 * **Por qué el invariante NO es «/comparativa no está en NAV_HEADER».** Eso es
 * una lista de exclusión: prohíbe la página que ya conocemos y deja pasar la
 * próxima. La `/comparativa` de mañana puede llamarse `/vs-sintic` o
 * `/por-que-onia` y el gate seguiría verde. Acá el sujeto es **cada entrada de
 * `NAV_HEADER`** —así una pantalla nueva del header nace cubierta— y lo que se
 * prohíbe es la CAPACIDAD, no el nombre: que la página pueda pintar
 * `CONTENDIENTES`, la tabla de competidores de `lib/proof.ts`.
 *
 * Se mide sobre el grafo de imports y no sobre el texto del `page.tsx`, porque
 * los nombres de los competidores no están escritos en la página: los importa.
 * Un `grep` de «Sintic» sobre `comparativa/page.tsx` sale VACÍO y firmaría
 * verde sobre la página que ES el defecto. Por eso el barrido sigue los
 * imports hasta el fondo: `page.tsx` → `components/sections/proof.tsx` →
 * `lib/proof.ts` también cuenta, aunque la página no nombre el símbolo.
 *
 * Lo que este guard NO cubre, a propósito: que la página siga siendo
 * ALCANZABLE. `/comparativa` no se bajó —sigue publicada, en el sitemap y en
 * `NAV_DECIDIR`—, y de eso ya se ocupa `alcance.test.ts`, que deriva sus
 * sujetos del disco. Dos gates midiendo lo mismo se desincronizan al mes.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

/** El símbolo de `lib/proof.ts` que pinta la tabla de competidores. */
const TABLA_COMPETIDORES = "CONTENDIENTES";
const PROOF = moduloDe("@/lib/proof");

/**
 * El recorredor del grafo vive en `app/rutas.ts`, compartido con
 * `obra-en-el-cuerpo.test.ts`. Acá había una copia: dos copias del mismo
 * recorrido miden cosas distintas al mes, que es justo el motivo por el que
 * `rutas.ts` existe.
 */
const cadenaHastaLosCompetidores = (entrada: string) =>
  cadenaHastaSimbolo(entrada, TABLA_COMPETIDORES, PROOF);

describe("el header de escritorio es el camino de compra", () => {
  /**
   * El instrumento, probado contra un caso que YA cumple: si alguien renombra
   * `CONTENDIENTES` o vacía la tabla, el barrido de arriba deja de encontrar
   * nada y firmaría verde sobre cualquier header. Esto lo pone en rojo.
   */
  it("la tabla de competidores existe y nombra a alguien que no somos nosotros", () => {
    const ajenos = CONTENDIENTES.filter((c) => !c.esOnia);
    expect(ajenos.length).toBeGreaterThan(0);
    expect(readFileSync(PROOF, "utf8")).toContain(`export const ${TABLA_COMPETIDORES}`);
  });

  /** El caso de control: la página que SÍ compara tiene que dar positivo. */
  it("el barrido detecta la comparativa, que es la que sí muestra competidores", () => {
    const comparativa = join(AQUI, "comparativa", "page.tsx");
    expect(existsSync(comparativa)).toBe(true);
    expect(cadenaHastaLosCompetidores(comparativa)).not.toBeNull();
  });

  it.each(NAV_HEADER.map((item) => [item.href, item.label] as const))(
    "%s (%s) no muestra la tabla de competidores",
    (href) => {
      const pagina = join(AQUI, href, "page.tsx");
      expect(existsSync(pagina), `${href} no tiene page.tsx en (sitio)`).toBe(true);
      const cadena = cadenaHastaLosCompetidores(pagina);
      expect(
        cadena,
        cadena === null
          ? ""
          : `El header ofrece ${href}, que le muestra al lead la tabla de competidores.\n` +
            `Entra por: ${cadena.join(" → ")}\n` +
            "El header es el camino de compra: la comparación vive en NAV_DECIDIR (pie y menú de teléfono).",
      ).toBeNull();
    },
  );
});
