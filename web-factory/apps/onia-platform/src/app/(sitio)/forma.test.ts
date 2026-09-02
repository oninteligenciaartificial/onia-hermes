import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio de venta NO sirve capturas literales del producto.
 *
 * Sergio, 2026-09-01, textual: "no coloques capturas literales del sistema, se
 * ve mal, coloca cosas referenciales". Ese día cayeron primero las que servía
 * `<Shape src=...>`, después las cinco del conmutador de rubros, y el 2026-09-02
 * la última: la tarjeta social de la home, que era una captura con "MUY PRONTO"
 * impreso adentro. Todas se reemplazaron por dibujos.
 *
 * ⚠️ ESTE GUARD YA FALLÓ DOS VECES, y las dos por lo mismo: cazaba la forma
 * exacta del bug de ayer en vez de la clase de bug.
 *   1. La primera versión sólo miraba `"…capturas/"`. No vio
 *      `/rubros/${r.id}.webp` —otra carpeta, y armado con template literal— y
 *      las cinco capturas del conmutador sobrevivieron a este mismo archivo.
 *   2. La segunda agregó `rubros/*.webp`. No vio `/og/onia-rubros.jpg`, que
 *      vivía en `page.tsx` —dentro del alcance que este walk recorre—, y encima
 *      la lista de excepciones de este comentario omitía `/og/`: un lector
 *      concluía que no quedaba ninguna. El guard daba VERDE sobre la captura
 *      más visible del sitio, la que ve un lead antes de abrir la página.
 *
 * Por eso ahora la regla se da vuelta: en vez de enumerar las carpetas
 * PROHIBIDAS —que son infinitas y siempre falta la próxima— se enumeran las
 * PERMITIDAS. Cualquier ruta a imagen que no sea una de ésas es un fallo,
 * venga de `/og/`, `/panel/`, `/pantallas/` o de la carpeta que se invente
 * mañana.
 *
 * Lo permitido, y por qué: `/contexto/` y `/fotos/` son fotos de negocios
 * reales —una persona en su local, ninguna pantalla legible—, que es
 * justamente lo referencial que Sergio pidió.
 *
 * Sólo se mira `app/(sitio)`, la superficie de venta viva. `/v1` y
 * `components/landing-v1/` son el ARCHIVO de la web publicada hasta el
 * 2026-08-21 (noindex, su layout existe para conservarla tal cual se publicó) y
 * conservan su captura a propósito.
 */

/** Carpetas de imagen que SÍ puede servir la superficie de venta. */
const PERMITIDAS = ["/contexto/", "/fotos/"] as const;

/** Cualquier ruta a un archivo de imagen, incluso armada con template literal. */
const RUTA_IMAGEN = /["'`][^"'`]*\.(?:avif|jpe?g|png|webp)/gi;

/**
 * Los comentarios se sacan ANTES de mirar. El guard tiene que castigar SERVIR
 * una captura, no nombrarla: este mismo archivo y el de la tarjeta social
 * explican en prosa cuál era la ruta vieja, y un guard que se dispara con la
 * documentación de su propio bug es un guard que alguien apaga.
 */
function soloCodigo(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const AQUI = dirname(fileURLToPath(import.meta.url));

function fuentesDelSitio(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return fuentesDelSitio(join(dir, e.name));
    // los .ts entran: una constante con la ruta no deja de ser una captura por
    // vivir fuera del JSX. Los tests quedan afuera o se cazan a sí mismos.
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [join(dir, e.name)];
  });
}

describe("la superficie de venta dibuja, no fotografía el sistema", () => {
  const archivos = fuentesDelSitio(AQUI);

  it("encuentra las páginas del sitio", () => {
    // si el walk se rompe, los expects de abajo pasan sobre una lista vacía
    expect(archivos.length).toBeGreaterThan(5);
  });

  it.each(archivos.map((f) => [f.slice(AQUI.length + 1), f]))(
    "%s no sirve una captura del producto",
    (_rotulo, ruta) => {
      const codigo = soloCodigo(readFileSync(ruta, "utf8"));
      const rutas = codigo.match(RUTA_IMAGEN) ?? [];
      const prohibidas = rutas.filter(
        (r) => !PERMITIDAS.some((ok) => r.includes(ok)),
      );
      expect(
        prohibidas,
        `sirve imagen desde una carpeta que no es ${PERMITIDAS.join(" ni ")}`,
      ).toEqual([]);
    },
  );
});
