import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES } from "@/lib/proof";
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
/** `src/`, para resolver el alias `@/`. */
const SRC = join(AQUI, "..", "..");

/** El símbolo de `lib/proof.ts` que pinta la tabla de competidores. */
const TABLA_COMPETIDORES = "CONTENDIENTES";
const PROOF = join(SRC, "lib", "proof.ts");

const EXTENSIONES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

/**
 * Resuelve un import a un archivo del árbol. Devuelve `null` para lo que no es
 * nuestro (paquetes de node_modules) y para los CSS, que no importan nada.
 */
function resolverImport(desde: string, spec: string): string | null {
  if (spec.endsWith(".css")) return null;
  let base: string;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(desde), spec);
  else return null; // paquete externo
  for (const ext of EXTENSIONES) {
    const camino = base + ext;
    // `existsSync` solo no alcanza: `@/motion` existe y es una CARPETA, y
    // leerla revienta con EISDIR. El índice se busca aparte, en EXTENSIONES.
    if (existsSync(camino) && statSync(camino).isFile()) return camino;
  }
  return null;
}

/**
 * Los `import { A, B } from "X"` de un archivo. El `[^}]*` cruza saltos de
 * línea solo, que es como está escrito el import de `comparativa/page.tsx`.
 */
function importsConLlaves(texto: string): { bindings: string; spec: string }[] {
  return [...texto.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)].map((m) => ({
    bindings: m[1],
    spec: m[2],
  }));
}

/** Todo import del archivo, con o sin llaves (default, namespace, side-effect). */
function todosLosSpecs(texto: string): string[] {
  return [...texto.matchAll(/from\s*["']([^"']+)["']/g)].map((m) => m[1]);
}

/**
 * ¿La pantalla puede pintar la tabla de competidores? Recorre el grafo de
 * imports desde su `page.tsx` y devuelve la cadena que llega hasta ella, para
 * que el fallo diga POR DÓNDE entra y no solo que entra.
 */
function cadenaHastaLosCompetidores(entrada: string): string[] | null {
  const visitados = new Set<string>();
  const cola: { archivo: string; cadena: string[] }[] = [
    { archivo: entrada, cadena: [relative(SRC, entrada)] },
  ];
  while (cola.length > 0) {
    const { archivo, cadena } = cola.shift()!;
    if (visitados.has(archivo)) continue;
    visitados.add(archivo);
    const texto = readFileSync(archivo, "utf8");

    for (const { bindings, spec } of importsConLlaves(texto)) {
      if (!new RegExp(`\\b${TABLA_COMPETIDORES}\\b`).test(bindings)) continue;
      if (resolverImport(archivo, spec) === PROOF) return cadena;
    }

    for (const spec of todosLosSpecs(texto)) {
      const destino = resolverImport(archivo, spec);
      if (destino && !visitados.has(destino)) {
        cola.push({ archivo: destino, cadena: [...cadena, relative(SRC, destino)] });
      }
    }
  }
  return null;
}

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
