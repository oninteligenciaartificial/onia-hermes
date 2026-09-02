import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio de venta NO sirve capturas literales del producto.
 *
 * Sergio, 2026-09-01, textual: "no coloques capturas literales del sistema, se
 * ve mal, coloca cosas referenciales". Ese día había SEIS: cinco pasaban por
 * `<Shape src=...>` y se reemplazaron por paneles dibujados.
 *
 * El guard existe porque cablear una captura es la solución obvia y barata: ya
 * pasó una vez (la ranura de forma+color nació vacía y terminó con cuatro
 * .webp del panel adentro), y un `grep` a mano no lo va a atrapar dentro de
 * seis meses. `<Shape>` ya no compila con `src`, pero un `<img>` suelto sí.
 *
 * Sólo se mira `app/(sitio)` — la superficie de venta viva. `/v1` y
 * `components/landing-v1/` son el ARCHIVO de la web publicada hasta el
 * 2026-08-21 (noindex, su layout existe para conservarla tal cual se publicó)
 * y conservan su captura a propósito.
 */

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
      // el `"` deja fuera los comentarios que explican POR QUÉ no van
      expect(readFileSync(ruta, "utf8")).not.toMatch(/"[^"]*capturas\//);
    },
  );
});
