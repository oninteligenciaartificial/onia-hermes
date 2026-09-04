import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lo que el sitio dice de sí mismo, leído del disco — para los gates.
 *
 * No lo importa ninguna ruta: es infraestructura de `*.test.ts`, y por eso usa
 * `node:fs` sin problema. Vive acá y no en `lib/` porque lo único que hace es
 * leer este árbol de `app/`, y un helper lejos de lo que mide envejece solo.
 *
 * Nace de tener DOS gates que necesitan la misma lista y el mismo parser de
 * metadata (`compartir.test.ts` e `indexar.test.ts`). Copiar el parser al
 * segundo archivo era garantizar que dentro de un mes midieran cosas distintas.
 */

const APP = dirname(fileURLToPath(import.meta.url));

export type Pagina = { archivo: string; ruta: string };

/** Todas las `page.tsx` del disco, con su ruta pública. */
function paginas(dir: string): Pagina[] {
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

/** Toda página que existe en el árbol, publicada o no. */
export const PAGINAS: Pagina[] = paginas(APP);

/**
 * Los `path` que declara `sitemap.ts`. Se leen del texto y no importando el
 * módulo porque acá alcanza con la lista, y un import arrastra media app.
 */
export const RUTAS_DEL_SITEMAP: string[] = [
  ...readFileSync(join(APP, "sitemap.ts"), "utf8").matchAll(/path:\s*"([^"]*)"/g),
].map((m) => m[1]);

/**
 * Lo que el sitio le prohíbe al rastreador, leído de `robots.ts` — hoy
 * `/patrones` (demo interna) y `/v1` (archivo de la web anterior).
 *
 * Es la declaración que el propio sitio ya hace de qué NO publica, así que
 * ningún gate necesita mantener su propia lista de exclusiones a mano.
 */
export const RUTAS_PROHIBIDAS: string[] = [
  ...readFileSync(join(APP, "robots.ts"), "utf8").matchAll(/disallow\s*:\s*\[([^\]]*)\]/g),
].flatMap((m) => [...m[1].matchAll(/"([^"]*)"/g)].map((q) => q[1]));

/** ¿`ruta` cae dentro de alguna de las ramas que `robots.ts` deshabilita? */
export function estaProhibida(ruta: string): boolean {
  return RUTAS_PROHIBIDAS.some((p) => ruta === p || ruta.startsWith(`${p}/`));
}

/**
 * Las páginas que el sitio PUBLICA: todas las del disco menos las que su
 * propio `robots.ts` deshabilita.
 *
 * El corte es éste y no el sitemap a propósito. Con el sitemap como fuente,
 * una página nueva que nadie agregó ahí queda FUERA del gate —falla abierta, y
 * el defecto pasa en verde—; con el disco, una página nueva entra cubierta y
 * hay que excluirla a mano para que deje de estarlo. Y tampoco es el `noindex`:
 * `/terminos` no se quiere en Google y se manda por WhatsApp igual.
 */
export const PAGINAS_PUBLICAS: Pagina[] = PAGINAS.filter((p) => !estaProhibida(p.ruta));

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
export function metadata(fuente: string): string {
  const m = /export\s+const\s+metadata\s*(?::[^=]+)?=/.exec(fuente);
  return m ? bloque(fuente, m.index + m[0].length - 1) : "";
}

/** La metadata de una página del disco, ya leída. */
export function metadataDe(pagina: Pagina): string {
  return metadata(readFileSync(join(APP, pagina.archivo), "utf8"));
}

/** El valor de `clave: "…"` dentro del sub-objeto `campo` de la metadata. */
export function dentroDe(meta: string, campo: string, clave: string): string | null {
  const m = new RegExp(`\\b${campo}\\s*:`).exec(meta);
  if (!m) return null;
  const v = new RegExp(`\\b${clave}\\s*:\\s*"([^"]*)"`).exec(bloque(meta, m.index));
  return v ? v[1] : null;
}

/**
 * ¿La página se declara fuera del índice?
 *
 * Contempla las DOS formas que acepta Next —`robots: { index: false }` y
 * `robots: "noindex, follow"`—, porque un gate que sólo entiende la que se usó
 * hoy pasa en verde el día que alguien escribe la otra.
 */
export function declaraNoindex(meta: string): boolean {
  const m = /\brobots\s*:/.exec(meta);
  if (!m) return false;
  const resto = meta.slice(m.index + m[0].length);
  const literal = /^\s*"([^"]*)"/.exec(resto);
  if (literal) return /\bnoindex\b/.test(literal[1]);
  return /\bindex\s*:\s*false\b/.test(bloque(meta, m.index));
}
