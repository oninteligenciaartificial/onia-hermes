import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import nextConfig from "../../next.config";

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
/** `src/`, para resolver el alias `@/`. */
const SRC = join(APP, "..");

export type Pagina = { archivo: string; ruta: string };

/** El `page.tsx` de una página, en ruta absoluta. */
export function archivoDe(pagina: Pagina): string {
  return join(APP, pagina.archivo);
}

/** Un módulo del árbol por su ruta con alias (`@/lib/proof` → …/src/lib/proof.ts). */
export function moduloDe(spec: string): string {
  return join(SRC, spec.replace(/^@\//, "") + ".ts");
}

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
 * Lo que el sitio le prohíbe al rastreador, leído de `robots.ts`. La lista NO
 * se enumera acá a propósito —
 * este comentario decía «hoy `/patrones` y `/v1`» con cuatro entradas vivas, y
 * una lista copiada al lado de su fuente envejece sola. El motivo de cada una
 * vive en `robots.ts`, y que ninguna sea fantasma lo verifica
 * `ruta-citada.test.ts`.
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
 * Las reglas 308 de `next.config.ts`, tal como las sirve Next.
 *
 * Hacen falta desde el 2026-09-29, cuando `/v1`, `/servicios/marketing-ia` y
 * `/servicios/consultoria` salieron del `disallow` de `robots.ts` para que
 * Google pueda seguir su 308 (con el disallow nunca lo pedía). Hasta ese día el
 * disallow era lo que las dejaba fuera de «lo que el sitio publica»; sin él, sus
 * `page.tsx` —que siguen en el disco como sujeto de los gates de copy— habrían
 * entrado como páginas vivas a pesar de que nadie las sirve.
 */
const REDIRECCIONES = (await nextConfig.redirects!()).filter((r) => r.permanent === true);

/** ¿`ruta` la atrapa una redirección permanente, exacta o con `/:ruta*`? */
export function estaRedirigida(ruta: string): boolean {
  return REDIRECCIONES.some(({ source }) =>
    source.endsWith("/:ruta*")
      ? ruta.startsWith(`${source.slice(0, -"/:ruta*".length)}/`)
      : source === ruta,
  );
}

/**
 * Las páginas que el sitio PUBLICA: todas las del disco menos las que su
 * propio `robots.ts` deshabilita y las que `next.config.ts` redirige.
 *
 * El corte es éste y no el sitemap a propósito. Con el sitemap como fuente,
 * una página nueva que nadie agregó ahí queda FUERA del gate —falla abierta, y
 * el defecto pasa en verde—; con el disco, una página nueva entra cubierta y
 * hay que excluirla a mano para que deje de estarlo. Y tampoco es el `noindex`:
 * `/terminos` no se quiere en Google y se manda por WhatsApp igual.
 */
export const PAGINAS_PUBLICAS: Pagina[] = PAGINAS.filter(
  (p) => !estaProhibida(p.ruta) && !estaRedirigida(p.ruta),
);

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
 * ¿La pantalla puede pintar `simbolo`? Recorre el grafo de imports desde su
 * `page.tsx` y devuelve la CADENA que llega hasta él —para que el fallo diga
 * por dónde entra, no sólo que entra—, o `null` si no lo alcanza.
 *
 * Se mide sobre el grafo y no sobre el texto del `page.tsx` porque el dato casi
 * nunca está escrito en la página: lo importa. Un `grep` de «Sintic» sobre
 * `comparativa/page.tsx` sale VACÍO y firmaría verde sobre la página que ES el
 * defecto; la cadena real es `page.tsx` → `components/sections/proof.tsx` →
 * `lib/proof.ts`.
 *
 * ⚠️ Vive acá, y no copiado en cada gate, por el mismo motivo que el parser de
 * metadata: dos copias del mismo recorredor miden cosas distintas al mes. Y por
 * eso todo gate que lo use debe anclarlo con un caso que SÍ tiene que encontrar
 * — si el resolver se rompe, el recorrido no encuentra nada y falla ABIERTO,
 * que es la dirección en la que nadie mira.
 */
export function cadenaHastaSimbolo(
  entrada: string,
  simbolo: string,
  modulo: string,
): string[] | null {
  const conLlaves = /import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g;
  const cualquierImport = /from\s*["']([^"']+)["']/g;
  const visitados = new Set<string>();
  const cola: { archivo: string; cadena: string[] }[] = [
    { archivo: entrada, cadena: [relative(SRC, entrada)] },
  ];
  while (cola.length > 0) {
    const { archivo, cadena } = cola.shift()!;
    if (visitados.has(archivo)) continue;
    visitados.add(archivo);
    const texto = readFileSync(archivo, "utf8");

    for (const m of texto.matchAll(conLlaves)) {
      if (!new RegExp(`\\b${simbolo}\\b`).test(m[1])) continue;
      if (resolverImport(archivo, m[2]) === modulo) return cadena;
    }

    for (const m of texto.matchAll(cualquierImport)) {
      const destino = resolverImport(archivo, m[1]);
      if (destino && !visitados.has(destino)) {
        cola.push({ archivo: destino, cadena: [...cadena, relative(SRC, destino)] });
      }
    }
  }
  return null;
}

/**
 * ¿La pantalla puede pintar un TEXTO que matchea `patron`? Igual que
 * `cadenaHastaSimbolo`, pero persiguiendo la frase y no el nombre del símbolo,
 * y devolviendo además el fragmento que la disparó — para que el fallo diga qué
 * dice el sitio, no sólo dónde.
 *
 * Hace falta porque un símbolo con nombre (`TODAVIA_NO`) es la forma CÓMODA del
 * defecto: la lista de huecos del producto puesta en una sección, con título. La
 * forma que se escapa es UNA línea suelta metida en otro dato —medida el
 * 2026-09-06 en `content/webs.ts`, dentro de un ítem de `noIncluye`—, que no es
 * un símbolo, no está escrita en ningún `page.tsx` y aun así la sirve producción.
 *
 * Se lee SIN comentarios y con los espacios aplanados: el JSX y los objetos de
 * contenido parten las frases en varias líneas, así que buscar sobre el texto
 * crudo deja pasar justo lo que está formateado.
 *
 * ⚠️ Mismo aviso que su hermana: **anclalo con un caso que SÍ tiene que
 * encontrar.** Si el resolver de imports se rompe, el recorrido no visita nada,
 * el patrón no matchea y el gate firma verde sobre un sitio sin vigilancia.
 */
export function cadenaHastaTexto(
  entrada: string,
  patron: RegExp,
): { cadena: string[]; encontrado: string } | null {
  const cualquierImport = /from\s*["']([^"']+)["']/g;
  const visitados = new Set<string>();
  const cola: { archivo: string; cadena: string[] }[] = [
    { archivo: entrada, cadena: [relative(SRC, entrada)] },
  ];
  while (cola.length > 0) {
    const { archivo, cadena } = cola.shift()!;
    if (visitados.has(archivo)) continue;
    visitados.add(archivo);
    const texto = readFileSync(archivo, "utf8");

    const limpio = texto
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/^[ \t]*\/\/.*$/gm, " ")
      .replace(/\s+/g, " ");
    const hallado = limpio.match(patron);
    if (hallado) return { cadena, encontrado: hallado[0] };

    for (const m of texto.matchAll(cualquierImport)) {
      const destino = resolverImport(archivo, m[1]);
      if (destino && !visitados.has(destino)) {
        cola.push({ archivo: destino, cadena: [...cadena, relative(SRC, destino)] });
      }
    }
  }
  return null;
}

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
