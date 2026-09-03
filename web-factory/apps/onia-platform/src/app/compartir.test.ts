import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Una ruta que el sitio PUBLICA se comparte con su URL.
 *
 * El 2026-09-03 `/terminos` y `/privacidad` eran las dos únicas rutas del
 * sitemap sin `og:url`: traían las otras nueve etiquetas Open Graph —imagen
 * incluida— porque las HEREDAN del layout raíz, y ahí la única que falta es
 * justamente la que no se puede heredar, porque es distinta en cada página.
 * Ninguna de las dos declaraba `openGraph`, así que nadie notó el hueco: la
 * tarjeta se veía casi bien.
 *
 * `og:url` es lo que WhatsApp, Facebook y LinkedIn usan para saber a qué
 * dirección apunta el enlace que están dibujando, y para juntar la página con
 * ella misma cuando llega con parámetros de campaña pegados. Sin ella la
 * tarjeta queda a merced de la URL exacta que el visitante haya copiado.
 *
 * ⚠️ El corte es el SITEMAP, no la carpeta ni el `noindex`, y las dos
 * alternativas obvias estaban mal:
 *  - Por carpeta: las rutas del sitio viven en dos lados (`(sitio)/` y
 *    `app/` a secas — `/terminos`, `/privacidad` y `/servicios/consultoria`
 *    son de las segundas). Mirar sólo `(sitio)` es el mismo punto ciego que
 *    ya se pagó dos veces en este proyecto.
 *  - Por `noindex`: `/terminos` declara `robots: { index: false }` y aun así
 *    ES una de las dos páginas rotas. Compartir y indexar son cosas
 *    distintas: una página que no querés en Google se manda igual por
 *    WhatsApp. Con ese criterio el gate pasaba en verde sobre el defecto.
 *
 * El sitemap es la declaración que ya hace el propio sitio de qué es público,
 * así que una ruta nueva queda cubierta por agregarla ahí — que es lo que el
 * comentario de `sitemap.ts` ya obliga a hacer. Un gate que hay que mantener
 * a mano es un gate que se queda viejo.
 *
 * Corre en `prebuild` (`tsc --noEmit && vitest run`), el comando real del
 * deploy, no un script paralelo que no llama nadie.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = AQUI;

/** Todas las `page.tsx` del disco, con su ruta pública. */
function paginas(dir: string): { archivo: string; ruta: string }[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const camino = join(dir, e.name);
    if (e.isDirectory()) return paginas(camino);
    if (e.name !== "page.tsx") return [];
    // Los segmentos entre paréntesis son grupos de Next: organizan carpetas y
    // NO salen en la URL. `(sitio)/precios/page.tsx` se sirve en `/precios`.
    const ruta =
      "/" +
      relative(APP, dirname(camino))
        .split(/[\\/]/)
        .filter((s) => s && !s.startsWith("("))
        .join("/");
    return [{ archivo: relative(APP, camino), ruta: ruta === "/" ? "" : ruta }];
  });
}

const PAGINAS = paginas(APP);

/**
 * Los `path` que declara `sitemap.ts`. Se leen del texto y no importando el
 * módulo porque acá alcanza con la lista, y un import arrastra media app.
 */
function rutasDelSitemap(): string[] {
  const fuente = readFileSync(join(APP, "sitemap.ts"), "utf8");
  return [...fuente.matchAll(/path:\s*"([^"]*)"/g)].map((m) => m[1]);
}

const PUBLICAS = rutasDelSitemap();

/** El cuerpo de `{ … }` que arranca en `desde`, contando llaves. */
function bloque(fuente: string, desde: number): string {
  const abre = fuente.indexOf("{", desde);
  if (abre === -1) return "";
  let hondura = 0;
  for (let i = abre; i < fuente.length; i++) {
    if (fuente[i] === "{") hondura++;
    else if (fuente[i] === "}" && --hondura === 0) return fuente.slice(abre + 1, i);
  }
  return "";
}

/** El bloque `export const metadata = { … }` de una página. */
function metadata(fuente: string): string {
  const m = /export\s+const\s+metadata\s*(?::[^=]+)?=/.exec(fuente);
  return m ? bloque(fuente, m.index + m[0].length - 1) : "";
}

/** El valor de `clave: "…"` dentro del sub-objeto `campo` de la metadata. */
function dentroDe(meta: string, campo: string, clave: string): string | null {
  const m = new RegExp(`\\b${campo}\\s*:`).exec(meta);
  if (!m) return null;
  const v = new RegExp(`\\b${clave}\\s*:\\s*"([^"]*)"`).exec(bloque(meta, m.index));
  return v ? v[1] : null;
}

describe("toda ruta publicada se comparte con su propia URL", () => {
  it("encuentra las páginas y el sitemap", () => {
    // Sin este ancla, romper el descubrimiento (carpeta movida, `page.tsx`
    // renombrado) dejaría los `it.each` de abajo corriendo sobre una lista
    // VACÍA: cero casos, verde, y el defecto suelto.
    expect(PAGINAS.length, "el barrido de page.tsx encontró casi nada").toBeGreaterThan(9);
    expect(PUBLICAS.length, "no se pudo leer la lista de rutas de sitemap.ts").toBeGreaterThan(9);
  });

  it.each(PUBLICAS.map((ruta) => [ruta || "/", ruta]))(
    "%s trae og:url, y apunta a sí misma",
    (rotulo, ruta) => {
      const pagina = PAGINAS.find((p) => p.ruta === ruta);
      expect(pagina, `${rotulo} está en el sitemap y no tiene page.tsx: publica un 404`).toBeTruthy();

      const meta = metadata(readFileSync(join(APP, pagina!.archivo), "utf8"));
      const url = dentroDe(meta, "openGraph", "url");
      expect(
        url,
        `${pagina!.archivo} no declara openGraph.url. Es la única etiqueta OG que ` +
          `NO se hereda del layout raíz —cambia en cada página—, así que la tarjeta ` +
          `de WhatsApp queda sin dirección propia.`,
      ).not.toBeNull();

      // Dos direcciones distintas para la misma página es peor que una sola
      // faltante: el buscador cree una y el que comparte ve la otra.
      const canonical = dentroDe(meta, "alternates", "canonical");
      if (canonical !== null) {
        expect(
          url,
          `${pagina!.archivo}: og:url (${url}) y canonical (${canonical}) no coinciden`,
        ).toBe(canonical);
      }
    },
  );
});
