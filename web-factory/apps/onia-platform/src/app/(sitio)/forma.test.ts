import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio de venta NO sirve capturas literales del producto.
 *
 * Sergio, 2026-09-01, textual: "no coloques capturas literales del sistema, se
 * ve mal, coloca cosas referenciales". Ese día cayeron primero las que servía
 * `<Shape src=...>` y después las cinco del conmutador de rubros: todas se
 * reemplazaron por paneles dibujados.
 *
 * El guard existe porque cablear una captura es la solución obvia y barata: ya
 * pasó dos veces (la ranura de forma+color nació vacía y terminó con cuatro
 * .webp del panel adentro, y el conmutador con cinco más), y un `grep` a mano
 * no lo va a atrapar dentro de seis meses. `<Shape>` ya no compila con `src`,
 * pero un `<img>` suelto sí.
 *
 * ⚠️ El patrón cubre DOS rutas y no una. La primera versión sólo miraba
 * `"…capturas/"`, anclado a comillas dobles: no vio `/rubros/${r.id}.webp` —
 * otra carpeta, y armado con un template literal— y las cinco capturas del
 * conmutador sobrevivieron a este mismo archivo. Una regla que sólo caza la
 * forma exacta del bug de ayer no es una regla.
 *
 * Sólo se mira `app/(sitio)` — la superficie de venta viva. `/v1` y
 * `components/landing-v1/` son el ARCHIVO de la web publicada hasta el
 * 2026-08-21 (noindex, su layout existe para conservarla tal cual se publicó)
 * y conservan su captura a propósito.
 *
 * Lo que NO caza, a propósito: `/contexto/` y `/fotos/` son fotos de negocios
 * reales —una persona en su local, ninguna pantalla legible—, que es
 * justamente lo referencial que Sergio pidió.
 */

/** Cada patrón es una forma de servir una captura del producto. */
const CAPTURA: readonly [string, RegExp][] = [
  // carpeta vieja de capturas, en cualquier string
  ["capturas/", /["'`][^"'`]*capturas\//],
  // el conmutador de rubros: ruta a imagen, incluso interpolada
  ["/rubros/*.<img>", /rubros\/[^"'`\s)]*\.(?:avif|jpe?g|png|webp)/i],
];

const AQUI = dirname(fileURLToPath(import.meta.url));

function tsxDelSitio(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? tsxDelSitio(join(dir, e.name))
      : e.name.endsWith(".tsx")
        ? [join(dir, e.name)]
        : [],
  );
}

describe("la superficie de venta dibuja, no fotografía el sistema", () => {
  const archivos = tsxDelSitio(AQUI);

  it("encuentra las páginas del sitio", () => {
    // si el walk se rompe, los expects de abajo pasan sobre una lista vacía
    expect(archivos.length).toBeGreaterThan(5);
  });

  it.each(archivos.map((f) => [f.slice(AQUI.length + 1), f]))(
    "%s no sirve una captura del producto",
    (_rotulo, ruta) => {
      const codigo = readFileSync(ruta, "utf8");
      for (const [rotulo, patron] of CAPTURA) {
        expect(codigo, `sirve una captura (${rotulo})`).not.toMatch(patron);
      }
    },
  );
});
