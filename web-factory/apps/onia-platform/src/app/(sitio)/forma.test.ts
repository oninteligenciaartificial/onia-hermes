import { existsSync, readdirSync, readFileSync } from "node:fs";
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
 *   3. La tercera no fue la carpeta de la imagen sino DÓNDE miraba: el walk
 *      arrancaba en `(sitio)`, así que era ciego a la mitad de la superficie
 *      que un lead abre. Fuera de ese grupo viven `/servicios/marketing-ia`,
 *      `/servicios/consultoria`, `/terminos` y `/privacidad` —4 de las 16 URLs
 *      del sitemap— y TODO lo compartido (`site-header`, `site-footer`,
 *      `components/sections/`, `components/legal/`), que es donde una captura
 *      se cuela una vez y sale en las dieciséis páginas a la vez. Es el mismo
 *      agujero estructural que el bloque de tarjetas sociales de más abajo ya
 *      había tapado el 2026-09-02 leyendo el sitemap; los dos guards vivían en
 *      ESTE archivo, uno arreglado y el otro no.
 *
 * Por eso ahora la regla se da vuelta DOS veces: en vez de enumerar las
 * carpetas PROHIBIDAS —que son infinitas y siempre falta la próxima— se
 * enumeran las PERMITIDAS; y en vez de enumerar dónde SÍ mirar, se mira la
 * superficie viva entera y se enumera lo excluido, con su motivo. Una carpeta
 * de rutas nueva queda cubierta el día que se crea, sin tocar este archivo.
 *
 * Lo permitido, y por qué: `/contexto/` y `/fotos/` son fotos de negocios
 * reales —una persona en su local, ninguna pantalla legible—, que es
 * justamente lo referencial que Sergio pidió.
 *
 * Se mira `src/app` y `src/components` enteros. Lo único excluido es el
 * ARCHIVO de la web publicada hasta el 2026-08-21 (`app/v1/` y
 * `components/landing-v1/`): es noindex, su layout existe para conservarla tal
 * cual se publicó y sus capturas quedan a propósito. Si alguien lo renombra, el
 * walk lo alcanza y el test se pone rojo — que es el lado seguro del error.
 */

/** Carpetas de imagen que SÍ puede servir la superficie de venta. */
const PERMITIDAS = ["/contexto/", "/fotos/"] as const;

/**
 * El archivo de la web vieja, con su captura conservada a propósito. Es la
 * ÚNICA excusa para no mirar un archivo: cualquier otra carpeta entra.
 */
const ARCHIVO_V1 = ["app/v1", "components/landing-v1"] as const;

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
/** `src/`, la superficie viva entera: rutas de `app/` y todo lo compartido. */
const SRC = dirname(dirname(AQUI));

function fuentesDelSitio(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (ARCHIVO_V1.some((a) => ruta === join(SRC, a))) return [];
    if (e.isDirectory()) return fuentesDelSitio(ruta);
    // los .ts entran: una constante con la ruta no deja de ser una captura por
    // vivir fuera del JSX. Los tests quedan afuera o se cazan a sí mismos.
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [ruta];
  });
}

describe("la superficie de venta dibuja, no fotografía el sistema", () => {
  const archivos = fuentesDelSitio(SRC);
  const rotulo = (f: string) => f.slice(SRC.length + 1);

  it("encuentra las páginas del sitio", () => {
    // si el walk se rompe, los expects de abajo pasan sobre una lista vacía
    expect(archivos.length).toBeGreaterThan(5);
  });

  /**
   * El anti-regresión del agujero #3. Sin esto, alguien vuelve a apuntar el
   * walk a `(sitio)` —que suena razonable, es "la carpeta del sitio"— y la
   * suite sigue en verde con media superficie sin mirar. Las tres rutas de
   * abajo son de venta, están en el sitemap o las carga toda página, y NINGUNA
   * vive en `(sitio)`.
   */
  it("mira la superficie viva entera, no sólo (sitio)", () => {
    const relativos = archivos.map(rotulo);
    for (const afuera of [
      join("app", "terminos", "page.tsx"),
      join("app", "servicios", "consultoria", "page.tsx"),
      join("components", "site-header.tsx"),
    ]) {
      expect(relativos, `el walk no llega a ${afuera}`).toContain(afuera);
    }
  });

  it.each(archivos.map((f) => [rotulo(f), f]))(
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

/**
 * Toda ruta del sitio se comparte CON tarjeta.
 *
 * Nace del 2026-09-02: `opengraph-image.tsx` vivía sólo en `(sitio)` y su propio
 * comentario daba por hecho que "la heredan sus DOCE rutas". Falso — esa
 * convención de Next aplica al `page.tsx` de su segmento y no baja a los
 * anidados. Resultado medido sobre el build: la home servía el dibujo y las
 * otras once salían con título y descripción pero SIN imagen, `/empezar`
 * incluida, que es justo el link que se le pasa a un lead para que se registre.
 * Un `curl` a la home daba verde y tapaba las once.
 */
/**
 * Ninguna PÁGINA declara su tarjeta social como archivo: la tarjeta se dibuja.
 *
 * ⚠️ Cuarto agujero del mismo guard, medido el 2026-09-05, y el más caro de
 * los cuatro. Los dos bloques de arriba dejaban a `/v1` afuera por motivos
 * distintos y los dos motivos eran falsos:
 *   · el walk lo excluye como "archivo de la web vieja, es noindex" — pero
 *     `noindex` manda sobre buscadores, NO apaga la pantalla: producción sirve
 *     `/v1` con 200 y el fetcher de WhatsApp le lee el `og:image` igual; y
 *   · el bloque de tarjetas saca sus sujetos del SITEMAP, donde `/v1` no está,
 *     así que fallaba abierto por partida doble.
 * Entre los dos, `/v1/page.tsx` publicó `/og/onia-rubros.jpg` —la captura con
 * «MUY PRONTO» impreso adentro que la home se sacó el 2026-09-02— durante tres
 * días más, en la única superficie que se ve ANTES de abrir el sitio. Y ningún
 * barrido de texto podía verla: la palabra prohibida estaba dentro de un JPG.
 *
 * Este bloque mira `src/app` entero, sin exención: el cuerpo archivado de la
 * v1 sigue conservado en `components/landing-v1/` (que el walk de arriba sí
 * exime), pero una PÁGINA no declara imágenes.
 */
describe("ninguna página declara una captura como tarjeta social", () => {
  const APP_ENTERA = dirname(AQUI);

  function paginas(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const ruta = join(dir, e.name);
      if (e.isDirectory()) return paginas(ruta);
      return /^(page|layout)\.tsx$/.test(e.name) ? [ruta] : [];
    });
  }

  const encontradas = paginas(APP_ENTERA);

  it("encuentra las páginas y los layouts", () => {
    // Ancla: sin esto el it.each de abajo recorre una lista vacía y firma
    // verde. Hoy son más de 25 entre `(sitio)`, `/servicios`, `/v1` y legales.
    expect(encontradas.length).toBeGreaterThan(20);
  });

  it.each(encontradas.map((f) => [f.slice(APP_ENTERA.length + 1), f]))(
    "%s no declara ninguna imagen",
    (_rotulo, archivo) => {
      const declaradas = [
        ...soloCodigo(readFileSync(archivo as string, "utf8")).matchAll(RUTA_IMAGEN),
      ]
        .map((m) => m[0].slice(1))
        // Las fotos referenciales que Sergio sí pidió (`/contexto/`, `/fotos/`)
        // se declaran igual que siempre: la misma lista del guard de arriba,
        // para que no haya dos versiones de "qué imagen se puede servir".
        .filter((ruta) => !PERMITIDAS.some((ok) => ruta.includes(ok)));

      expect(
        declaradas,
        "una página que nombra un archivo de imagen lo está sirviendo como " +
          "tarjeta o como prueba. La tarjeta la dibuja `opengraph-image.tsx` " +
          "del mismo segmento (ver `tarjeta-social.tsx`), y las fotos " +
          "referenciales van en un componente, no en la metadata.",
      ).toEqual([]);
    },
  );
});

describe("cada ruta del sitio se comparte con su tarjeta social", () => {
  const APP = dirname(AQUI);

  /**
   * La lista sale del SITEMAP, no de la carpeta `(sitio)`.
   *
   * ⚠️ Enumerar la carpeta fue el segundo agujero del mismo defecto, medido el
   * 2026-09-02: al arreglar las doce rutas de `(sitio)` este guard se escribió
   * recorriendo ese directorio, así que quedó ciego a las publicadas FUERA del
   * grupo. Cuatro seguían compartiéndose sin imagen —`/servicios/consultoria`,
   * `/servicios/marketing-ia`, `/terminos` y `/privacidad`— y el guard pasaba
   * en verde igual, porque no las miraba. El sitemap es la lista de lo que
   * publicamos ("nunca una página publicada sin su entrada"), así que es la
   * fuente correcta: una página nueva entra al sitemap y este test le exige su
   * tarjeta, esté en el grupo que esté.
   */
  const paths = [
    ...readFileSync(join(APP, "sitemap.ts"), "utf8").matchAll(/\{\s*path:\s*"([^"]*)"/g),
  ].map((m) => m[1]);

  /** Una ruta del sitemap puede vivir dentro o fuera de `(sitio)`. */
  const dirDe = (path: string) =>
    [join(AQUI, path), join(APP, path)].find((d) => existsSync(join(d, "page.tsx")));

  it("lee las rutas publicadas del sitemap", () => {
    // Ancla anti-lista-vacía: si el barrido de arriba se rompe (regex, archivo
    // renombrado), el `it.each` correría sobre cero casos y pasaría en verde.
    //
    // El piso era 14 y baja a 9 el 2026-09-08: el sitemap pasó de 15 rutas a 12
    // cuando `/servicios/webs`, `/marketing-ia` y `/consultoria` salieron del
    // índice por decisión de Sergio Urcullo (`t_30b1711d` — la navegación pública
    // es el sistema, no una agencia; ver `robots.ts`). O sea que lo que cayó no
    // fue el barrido sino el sujeto. Queda en el mismo piso que sus hermanos
    // (`alcance.test.ts`, y el ancla de arriba de este archivo), que es la
    // distancia sana: cubre el barrido roto sin volver a caducar cada vez que el
    // sitio publica una página menos.
    expect(paths.length).toBeGreaterThan(9);
  });

  it.each(paths.map((p) => [p === "" ? "/" : p, p]))(
    "%s tiene su opengraph-image.tsx",
    (_rotulo, path) => {
      const dir = dirDe(path as string);
      expect(dir, `no encuentro el page.tsx de ${path} — ¿sitemap desactualizado?`).toBeTruthy();
      expect(
        existsSync(join(dir as string, "opengraph-image.tsx")),
        "sin este archivo la ruta se comparte por WhatsApp sin una sola imagen",
      ).toBe(true);
    },
  );
});
