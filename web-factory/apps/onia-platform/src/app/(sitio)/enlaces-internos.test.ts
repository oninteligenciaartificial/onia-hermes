import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import nextConfig from "../../../next.config";

/**
 * Todo enlace que el sitio le muestra a un lead lleva a algo que existe.
 *
 * El gate hermano `enlaces.test.ts` vigila a dónde SALE el sitio (el host), y
 * nació de los dos botones de `/contacto` que apuntaban a un `cal.onia.com.bo`
 * muerto. Pero los enlaces INTERNOS —`href="/precios"`, el 90 % de los clics
 * del embudo— no los miraba nadie: un `href` a una ruta que no existe da 404 y
 * ningún test del repo se pone en rojo.
 *
 * ⚠️ POR QUÉ NO ALCANZA CON MEDIRLO CONTRA PRODUCCIÓN, que es como se venía
 * haciendo. La cifra "CTA rotos" de este carril sale de recorrer los `href` del
 * HTML que sirve `onia.com.bo`, y `onia.com.bo` sirve el ÚLTIMO BUILD
 * DESPLEGADO, no el árbol. Medido hoy 2026-09-05: producción corre el build del
 * 04-sep 10:04 UTC con **24 commits de esta app en `main` que el cliente no
 * ve**. O sea que la cifra daba 0 sin haber mirado una sola línea de lo que
 * este carril commiteó en dos días — y el día que Sergio apruebe el deploy
 * entran los 24 de golpe, que es el momento de máxima exposición y justo cuando
 * medir la pantalla no puede avisar nada. Este gate mira el ÁRBOL, así que un
 * enlace roto se cae antes de llegar al cliente y no después.
 *
 * ⚠️ UN 404 NO ES LA FIRMA. `/prueba-gratis` no existe como página y aun así
 * responde **308 → /empezar**, porque hay un redirect declarado. Por eso los
 * destinos válidos son los tres a la vez —página, archivo de `public/` y
 * redirect— y los redirects se IMPORTAN de `next.config.ts` en vez de
 * copiarse: una segunda lista se desincroniza, que es el caso de los cuatro
 * precios vivos del mismo chatbot.
 *
 * Los sujetos se derivan del DISCO entero, sin exentos: una lista de inclusión
 * falla abierto y este carril ya la pagó dos veces (las rutas sacadas del
 * sitemap, y las cuatro raíces escritas a mano que dejaban `app/v1/**` sin
 * vigilar). Un archivo nuevo nace cubierto.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` — subir dos: `(sitio)` y `app`. */
const SRC = dirname(dirname(AQUI));
const APP = join(SRC, "app");
const RAIZ = dirname(SRC);
const PUBLIC = join(RAIZ, "public");

/** Un segmento `(grupo)` organiza carpetas y NO aparece en la URL. */
const esGrupo = (nombre: string) => /^\(.*\)$/.test(nombre);

/** `page.tsx` y `route.ts` son lo que hace que una URL responda. */
const esPagina = (nombre: string) => /^(page|route)\.tsx?$/.test(nombre);

/** Rutas que el App Router sirve, derivadas de dónde hay un `page`/`route`. */
function rutasDelDisco(dir: string, url = ""): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) {
      return rutasDelDisco(ruta, esGrupo(e.name) ? url : `${url}/${e.name}`);
    }
    return esPagina(e.name) ? [url || "/"] : [];
  });
}

/** Todo lo que `public/` publica tal cual, desde la raíz del dominio. */
function estaticosDelDisco(dir: string, url = ""): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    return e.isDirectory()
      ? estaticosDelDisco(ruta, `${url}/${e.name}`)
      : [`${url}/${e.name}`];
  });
}

/** Archivos de código bajo `src/`, sin los tests (que citan rutas de ejemplo). */
function fuentesDelSitio(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return fuentesDelSitio(ruta);
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [ruta];
  });
}

/**
 * Los comentarios se sacan antes de mirar: el guard castiga ENLAZAR a una ruta
 * inexistente, no nombrarla. Esta misma cabecera cita `/prueba-gratis`.
 */
const soloCodigo = (fuente: string) =>
  fuente.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/**
 * Un patrón de ruta a regex. Cubre las dos formas que importan:
 * `[slug]` / `:slug` toman un segmento, `[...resto]` / `:resto*` toman varios.
 */
function aRegExp(patron: string): RegExp {
  const cuerpo = patron
    .split("/")
    .map((seg) => {
      if (/^\[\.\.\..+\]$/.test(seg) || /^:.+\*$/.test(seg)) return "§MUCHOS§";
      if (/^\[.+\]$/.test(seg) || /^:.+$/.test(seg)) return "§UNO§";
      return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/")
    .replace(/§MUCHOS§/g, ".+")
    .replace(/§UNO§/g, "[^/]+");
  return new RegExp(`^${cuerpo}$`);
}

/** Normaliza un `href` a la forma con la que se comparan las rutas. */
const normalizar = (href: string) =>
  href.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";

describe("los enlaces internos del sitio llevan a algo que existe", () => {
  const rutas = rutasDelDisco(APP);
  const estaticos = new Set(estaticosDelDisco(PUBLIC));
  const archivos = fuentesDelSitio(SRC);

  const redirects = (
    nextConfig.redirects ? nextConfig.redirects() : Promise.resolve([])
  ) as Promise<{ source: string }[]>;

  it("encuentra las rutas, los estáticos y las fuentes", () => {
    // Si cualquiera de los tres walks se rompe, el test de abajo pasa sobre una
    // lista vacía: en verde y sin haber mirado nada.
    expect(rutas, "el walk de app/ no encontró rutas").not.toHaveLength(0);
    expect(estaticos.size, "el walk de public/ no encontró archivos").not.toBe(
      0,
    );
    expect(archivos.length).toBeGreaterThan(5);
    expect(rutas, "la home tiene que estar entre las rutas").toContain("/");
  });

  it("mira también app/v1, que responde 200 aunque sea noindex", () => {
    // `forma.test.ts` exime `app/v1` por ser noindex y ese corte ya falló
    // ABIERTO dos veces en este carril. noindex manda sobre buscadores, no
    // apaga la pantalla.
    expect(rutas).toContain("/v1");
    expect(archivos.map((f) => f.slice(SRC.length + 1))).toContain(
      join("app", "v1", "precios", "page.tsx"),
    );
  });

  it("ningún href interno se queda sin destino", async () => {
    const patrones = [
      ...rutas.map(aRegExp),
      ...(await redirects).map((r) => aRegExp(normalizar(r.source))),
    ];
    const tieneDestino = (url: string) =>
      estaticos.has(url) || patrones.some((p) => p.test(url));

    const rotos: string[] = [];
    for (const ruta of archivos) {
      const codigo = soloCodigo(readFileSync(ruta, "utf8"));
      for (const [, href] of codigo.matchAll(/href=["'](\/[^"']*)["']/g)) {
        const url = normalizar(href);
        // Un href con `${...}` se arma en ejecución: no hay literal que mirar.
        if (href.includes("${")) continue;
        if (tieneDestino(url)) continue;
        rotos.push(`${ruta.slice(SRC.length + 1)} → ${href}`);
      }
    }

    expect(
      rotos,
      "enlaza a una ruta que no existe ni como página, ni como archivo de " +
        "public/, ni como redirect: el lead hace clic y recibe un 404",
    ).toEqual([]);
  });

  it("caza un href roto (si no, este gate no protege nada)", async () => {
    // El gate se prueba con el defecto en su forma REAL —un href literal a una
    // ruta que no existe—, no con una comprobación cómoda. Sin este caso, un
    // walk vacío o un regex demasiado permisivo dejarían los dos tests de
    // arriba en verde para siempre.
    const patrones = [
      ...rutas.map(aRegExp),
      ...(await redirects).map((r) => aRegExp(normalizar(r.source))),
    ];
    const tieneDestino = (url: string) =>
      estaticos.has(url) || patrones.some((p) => p.test(url));

    expect(tieneDestino("/planes-2027"), "una ruta inventada").toBe(false);
    expect(tieneDestino("/"), "la home").toBe(true);
    expect(tieneDestino("/precios"), "una página real").toBe(true);
    expect(tieneDestino("/prueba-gratis"), "vive sólo como redirect").toBe(true);
  });
});
