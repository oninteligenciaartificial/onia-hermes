import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PAGINAS_PUBLICAS, moduloDe } from "./rutas";

/**
 * Toda página publicada tiene que ser ALCANZABLE desde el sitio vivo.
 *
 * Publicar una página no es ponerla en el disco ni en el sitemap: es que un
 * lead pueda llegar. Una página sin un solo enlace entrante desde la superficie
 * de venta existe para el buscador y para nadie más — y encima el sitemap la
 * pide indexar, así que el sitio se contradice solo.
 *
 * **Ya pasó dos veces, y la segunda es la que trajo este gate.** La primera fue
 * `/nosotros` (2026-08-23): estaba en el sitemap y no la linkeaba ningún nav de
 * la v3, sólo el header y el pie viejos, que ya no envuelven al sitio. Se
 * arregló metiéndola en `NAV_DECIDIR`… y ahí quedó, sin barrer a las hermanas.
 *
 * La segunda la midió el carril `web-venta` el 2026-09-03 sobre las 16 páginas
 * que sirve `onia.com.bo`, contando enlaces entrantes en el HTML servido:
 * `/servicios/marketing-ia` y `/servicios/consultoria` tenían **4**, y las
 * cuatro eran `/privacidad`, `/terminos` y ellas dos entre sí. Desde la portada,
 * `/precios`, `/empezar`, `/rubros`, `/chatbot`, `/agentes`, `/facturacion`,
 * `/comparativa`, `/contacto` y `/nosotros` no había **ninguno**: para llegar a
 * dos servicios que se cobran había que entrar por la política de privacidad.
 * Las dos siguen en `app/servicios/`, el árbol viejo, con el `SiteFooter`
 * archivado — el mismo cromo que `/v1`, que es `noindex` justamente por viejo.
 *
 * **Por qué el enlace tiene que salir de `(sitio)` y no de cualquier página.**
 * Es la trampa que dejó el defecto vivo un año: contar "¿la enlaza alguien?" da
 * verde, porque `/privacidad` la enlaza. Pero `/privacidad` la enlaza **con el
 * pie archivado**, el que ninguna pantalla de venta usa. Un enlace que sólo
 * existe en el cromo muerto no acerca a nadie. Así que el sujeto se busca en el
 * árbol vivo —`app/(sitio)/`, que es el mapa único (`nav.ts`) más el cuerpo de
 * las páginas que el lead pisa— y en ningún otro lado.
 *
 * **Los sujetos salen del DISCO, no de una lista.** Es la lección que dejó
 * `compartir.test.ts` el mismo día: un gate que saca sus sujetos de una lista de
 * inclusión (el sitemap, un array de rutas) falla ABIERTO — el día que algo sale
 * de esa lista por un motivo no relacionado, deja de tener gate y nada se pone
 * en rojo. Acá una página nueva nace cubierta, y para dejarla fuera hay que
 * prohibirla en `robots.ts`, que es una decisión visible.
 *
 * Corre en `prebuild` (`tsc --noEmit && vitest run`), el comando real del deploy.
 */

const APP = dirname(fileURLToPath(import.meta.url));
const VIVO = join(APP, "(sitio)");

/** Todo archivo de código del árbol vivo, menos sus propios gates. */
function fuentesVivas(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const camino = join(dir, e.name);
    if (e.isDirectory()) return fuentesVivas(camino);
    if (!/\.tsx?$/.test(e.name) || e.name.endsWith(".test.ts")) return [];
    return [camino];
  });
}

/** Los destinos internos que escribe un archivo, en las dos formas que usa el
 *  sitio: el `href="/x"` del JSX y el `href: "/x"` de `nav.ts`. */
function destinosDe(archivo: string): string[] {
  const texto = readFileSync(archivo, "utf8");
  return [
    ...[...texto.matchAll(/href=\{?"(\/[^"?#]*)"/g)].map((m) => m[1]),
    ...[...texto.matchAll(/href:\s*"(\/[^"?#]*)"/g)].map((m) => m[1]),
  ];
}

/**
 * Los módulos `@/…` que importa el árbol vivo, resueltos a archivo.
 *
 * ⚠️ Sin esto el gate da ROJO FALSO, y en la dirección cara: la que manda a
 * desindexar una página viva. Medido el 2026-09-08 con `/servicios/webs`, que la
 * PORTADA ofrece en su cuerpo —«Web del negocio · desde Bs 2.000, pago único»—
 * con el `href` viniendo de `ADDONS` en `lib/pricing.ts`. Como el enlace no está
 * escrito en ningún `.tsx` de `(sitio)`, el barrido de texto no lo veía y el
 * gate declaraba inalcanzable una página que un lead alcanza en un clic desde la
 * home; obedecerlo la sacaba del sitemap y del índice.
 *
 * Es la misma familia que ya mordió a `header-camino-de-compra.test.ts`: un
 * `grep` sobre el `page.tsx` es ciego a todo dato IMPORTADO, y en este sitio los
 * datos de venta (precios, add-ons, stacks) viven todos en `lib/`. Un nivel
 * alcanza —el dato lo importa la pantalla, no un intermediario— y mantiene el
 * gate leyendo archivos en vez de construir el grafo entero.
 */
function modulosImportados(fuentes: readonly string[]): string[] {
  const specs = new Set(
    fuentes.flatMap((archivo) => [
      ...[...readFileSync(archivo, "utf8").matchAll(/from\s+"(@\/[^"]+)"/g)].map((m) => m[1]),
    ]),
  );
  return [...specs].map(moduloDe).filter((f) => existsSync(f));
}

const FUENTES_VIVAS = fuentesVivas(VIVO);

const DESTINOS_VIVOS: ReadonlySet<string> = new Set(
  [...FUENTES_VIVAS, ...modulosImportados(FUENTES_VIVAS)].flatMap(destinosDe),
);

/**
 * Las páginas que el sitio publica: las del disco menos las que `robots.ts`
 * prohíbe. Se importa de `rutas.ts` en vez de recalcularla — la lista ya vive
 * ahí y dos copias del mismo filtro miden cosas distintas al mes.
 */
const PUBLICADAS = PAGINAS_PUBLICAS;

describe("toda página publicada es alcanzable desde el sitio vivo", () => {
  it("encuentra las dos listas", () => {
    // Sin este ancla, romper cualquiera de los dos barridos (carpeta renombrada,
    // `(sitio)` movido) dejaría el `it.each` de abajo corriendo sobre una lista
    // vacía: cero casos, verde, y el defecto suelto. Es la misma guarda que
    // `indexar.test.ts`, y por el mismo motivo.
    expect(PUBLICADAS.length, "el barrido de page.tsx encontró casi nada").toBeGreaterThan(9);
    expect(
      DESTINOS_VIVOS.size,
      "no se leyó ningún href del árbol vivo: el barrido de (sitio) está roto",
    ).toBeGreaterThan(9);
  });

  it.each(PUBLICADAS.map((p) => [p.ruta || "/", p.ruta, p.archivo]))(
    "%s se puede alcanzar desde app/(sitio)",
    (rotulo, ruta, archivo) => {
      expect(
        DESTINOS_VIVOS.has(ruta || "/"),
        `${archivo} se publica en ${rotulo} y NINGUNA pantalla del sitio vivo la enlaza. ` +
          `Un lead no puede llegar. Enlazala desde app/(sitio)/nav.ts (si es del mapa del ` +
          `sitio) o desde el cuerpo de la página que corresponda; si no se publica más, ` +
          `sacala del sitemap y prohibila en robots.ts.`,
      ).toBe(true);
    },
  );
});
