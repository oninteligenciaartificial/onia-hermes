/**
 * La CONDICIÓN de la prueba gratis no se tipea a mano en ninguna pantalla.
 *
 * QUÉ CLASE CUIDA, y por qué no la cuidaba nadie. Los dos gates de dinero
 * (`precios.test.ts`, `precios-addons.test.ts`) persiguen montos: buscan el
 * número pegado a «Bs», partido en dos nodos, dentro de un JSON-LD o suelto en
 * una frase. Una condición contractual —«14 días gratis», «con el plan Pro»—
 * no lleva «Bs» y por eso pasa por debajo de los cuatro patrones, siendo
 * exactamente lo mismo: un dato del producto copiado a mano en la superficie
 * de venta.
 *
 * DÓNDE ESTABA EL ESLABÓN SUELTO. La cadena tiene dos tramos:
 *
 *   producto (TRIAL_DAYS, TRIAL_PLAN)  →  sitio (PRUEBA)  →  pantallas
 *
 * El primero lo ata `scripts/precios-fuente.mjs` desde el 2026-09-06: cruza
 * `PRUEBA.dias` contra `TRIAL_DAYS` de `lib/subscription/plan-state.ts` y sale
 * ROJO si se despegan. El segundo no lo ataba nada, y ahí estaban **29
 * copias** del número escritas a mano — la portada, /precios, /v1, la FAQ, los
 * botones, las metadatas y hasta el JSON-LD de /v1/prueba-gratis.
 *
 * POR QUÉ ESO ES PEOR QUE UN NÚMERO MAL. El día que el trial cambie, el cruce
 * se pone rojo y alguien corrige `PRUEBA.dias` — que es lo único que el cruce
 * mira. Con eso el cruce vuelve a VERDE, el carril canta objetivo cumplido, y
 * las 29 pantallas siguen prometiéndole al lead el número viejo sin que nada
 * se ponga rojo en ninguna parte. El arreglo del defecto es justo lo que deja
 * ciego al instrumento.
 *
 * CÓMO SE DERIVAN LOS SUJETOS. Del disco, recorriendo `src/` entero: un
 * archivo nuevo nace cubierto y hay que excluirlo a mano, a la vista. Esa
 * decisión ya se pagó en este carril dos veces — `compartir.test.ts` sacaba
 * sus rutas del sitemap y `precios.test.ts` tenía cuatro raíces escritas a
 * mano que dejaban `app/v1/**` sin vigilar.
 *
 * LOS COMENTARIOS NO CUENTAN. Un gate que persigue un literal da rojo sobre la
 * bitácora que explica el propio defecto, y obedecerlo obliga a borrar el
 * registro de lo que pasó. Se filtran las líneas de comentario antes de
 * aplicar el patrón, igual que en `hero.test.ts`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { PRUEBA } from "@/lib/pricing";

const RAIZ = join(__dirname, "..", "..");

/**
 * Lo que se excluye, nombrado de a uno y con su motivo. Nunca una carpeta
 * entera: un exento ancho es una lista de inclusión disfrazada.
 */
const EXENTOS = new Set([
  // La fuente. Es el único lugar donde el número puede estar escrito.
  "lib/pricing.ts",
]);

function fuentes(dir: string, salida: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === "__tests__") continue;
      fuentes(ruta, salida);
      continue;
    }
    if (![".ts", ".tsx"].includes(extname(entrada.name))) continue;
    if (entrada.name.includes(".test.")) continue;
    const rel = relative(RAIZ, ruta).split("\\").join("/");
    if (EXENTOS.has(rel)) continue;
    salida.push(ruta);
  }
  return salida;
}

/**
 * Las líneas que NO son comentario, cada una con su número REAL en el archivo.
 *
 * El número se conserva a propósito: la primera versión filtraba y numeraba
 * sobre el array ya filtrado, así que el gate señalaba una línea corrida —
 * mandaba a mirar código sano mientras el defecto seguía unas líneas más
 * abajo. Un gate que miente la ubicación cuesta más que no tenerlo.
 */
function sinComentarios(txt: string): { n: number; linea: string }[] {
  const salida: { n: number; linea: string }[] = [];
  let dentroDeBloque = false;

  txt.split("\n").forEach((linea, i) => {
    const t = linea.trim();
    const abre = linea.includes("/*");
    const cierra = linea.includes("*/");

    if (dentroDeBloque) {
      // Sigue adentro hasta el `*/`, mire como mire la línea. Filtrar sólo por
      // el prefijo `*` dejaba pasar el interior de los comentarios JSX
      // (`{/* … */}`), cuyas líneas del medio arrancan con texto normal: el
      // gate acusaba en falso a la bitácora que explica el propio defecto, que
      // es como esta familia de gates termina obligando a borrar el registro.
      if (cierra) dentroDeBloque = false;
      return;
    }
    if (abre && !cierra) {
      dentroDeBloque = true;
      return;
    }
    if (abre && cierra) return;
    if (t.startsWith("*") || t.startsWith("//")) return;

    salida.push({ n: i + 1, linea });
  });

  return salida;
}

const ARCHIVOS = fuentes(join(RAIZ, "app")).concat(
  fuentes(join(RAIZ, "components")),
  fuentes(join(RAIZ, "lib")),
  fuentes(join(RAIZ, "content")),
);

describe("la condición de la prueba se lee de la fuente, no se tipea", () => {
  it("recorre el árbol de verdad (si esto baja, alguien recortó la cobertura)", () => {
    expect(ARCHIVOS.length).toBeGreaterThan(80);
    expect(ARCHIVOS.some((f) => f.includes(`${join("app", "v1")}`))).toBe(true);
  });

  it("ninguna pantalla escribe los días de prueba a mano", () => {
    const patron = new RegExp(`\\b${PRUEBA.dias}\\s+d[ií]as?\\b`);
    const culpables: string[] = [];
    for (const f of ARCHIVOS) {
      for (const { n, linea } of sinComentarios(readFileSync(f, "utf8"))) {
        if (patron.test(linea)) culpables.push(`${relative(RAIZ, f)}:${n}`);
      }
    }
    expect(
      culpables,
      `Escriben los días de prueba a mano en vez de leer PRUEBA.dias:\n${culpables.join("\n")}`,
    ).toEqual([]);
  });

  /**
   * El plan con el que corre la prueba es la otra mitad de la condición, y ya
   * se despegó una vez: la tarjeta del Básico callaba que la prueba corre con
   * el Pro (arreglado en 66390e8a5). Se vigila igual que los días.
   */
  it("ninguna pantalla nombra a mano el plan con el que corre la prueba", () => {
    const patron = new RegExp(
      `(prueba|gratis|probar|prob[áa]|prob[áa]lo)[^.\\n]{0,80}\\b(con el|plan)\\s+${PRUEBA.planQueCorre}\\b`,
      "i",
    );
    const culpables: string[] = [];
    for (const f of ARCHIVOS) {
      for (const { n, linea } of sinComentarios(readFileSync(f, "utf8"))) {
        if (patron.test(linea) && !linea.includes("PRUEBA.planQueCorre")) {
          culpables.push(`${relative(RAIZ, f)}:${n}`);
        }
      }
    }
    expect(
      culpables,
      `Nombran el plan de la prueba a mano en vez de leer PRUEBA.planQueCorre:\n${culpables.join("\n")}`,
    ).toEqual([]);
  });
});
