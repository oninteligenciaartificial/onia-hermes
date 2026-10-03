/// <reference types="vite/client" />
import { createElement, isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import sitemap from "./sitemap";

/**
 * El HTML que el servidor manda de cada página publicada — para los gates.
 *
 * No lo importa ninguna ruta: es infraestructura de `*.test.ts` (como `rutas.ts`) y usa
 * `import.meta.glob`, que solo existe en vitest. Nace el 3-oct de tener DOS gates que
 * necesitan el mismo render: `titular-visible-sin-js.test.ts` (el `<h1>` sin `opacity:0`) y
 * `promesa-que-el-producto-cumple.test.ts` (lo que el visitante LEE, sin las etiquetas que
 * parten una frase). Copiar el descubrimiento de rutas al segundo era garantizar que dentro
 * de un mes midieran páginas distintas.
 *
 * Las páginas se descubren solas: cada `page.tsx` de `app/` se mapea a su ruta (los grupos
 * `(sitio)` no cuentan en la URL), y se miden TODAS las que el sitemap publica más
 * `/terminos` (publicada, fuera del sitemap por `noindex`). Una página nueva que entre al
 * sitemap queda vigilada sin tocar ningún gate.
 *
 * **Se renderizan todas juntas, en el `beforeAll` de cada gate, con un timeout propio.**
 * Importar una página en frío transforma toda su cadena de módulos, y eso dentro de un
 * `it()` cuenta contra los 5 s por defecto de vitest. Medido el 3-oct con la suite entera
 * y la CPU estrangulada (`taskset -c 0`, 6 workers): con el import dentro del `it()`, «/»
 * se cayó 2 de 2 veces con «Test timed out in 5000ms» (5.055 y 5.089 ms) sin nada roto, y
 * `prebuild` corre esta suite antes de `next build` en el VPS. Con la carga acá, en un
 * `beforeAll(…, 60_000)`: 2 de 2 en verde, el `it()` de «/» en 20 y 1 ms, y la suite tarda
 * lo mismo (59 s contra 59-63 s) aunque ahora renderizan dos gates.
 */

type Pagina = () => ReactElement | Promise<ReactElement>;

const MODULOS = import.meta.glob<{ default: Pagina }>("./**/page.tsx");

const rutaDe = (archivo: string) =>
  "/" +
  archivo
    .replace(/^\.\//, "")
    .replace(/\/?page\.tsx$/, "")
    .split("/")
    .filter((tramo) => tramo && !/^\(.*\)$/.test(tramo))
    .join("/");

export const PAGINA_DE_RUTA = new Map(Object.entries(MODULOS).map(([archivo, cargar]) => [rutaDe(archivo), cargar]));

export const RUTAS_PUBLICADAS: readonly string[] = [
  ...sitemap().map(({ url }) => new URL(url).pathname.replace(/\/$/, "") || "/"),
  "/terminos",
];

/** Lo mismo que hace Next con una página de servidor: la llama y renderiza lo que devuelve. */
export async function htmlDelServidor(Pagina: Pagina): Promise<string> {
  const salida = await Pagina();
  const raiz = isValidElement(salida) ? salida : createElement(Pagina as () => ReactElement);
  return renderToStaticMarkup(raiz);
}

/** Margen para importar y renderizar el sitio entero en frío, aun con la máquina cargada. */
export const TIEMPO_PARA_RENDERIZAR = 60_000;

/**
 * El HTML de cada ruta publicada. Una página que no carga o no renderiza queda como `Error`
 * en su ruta —y el `it()` de esa ruta lo tira—, para que una sola rota no tape a las demás.
 */
export async function renderizarPublicadas(): Promise<Map<string, string | Error>> {
  const html = new Map<string, string | Error>();
  await Promise.all(
    RUTAS_PUBLICADAS.map(async (ruta) => {
      const cargar = PAGINA_DE_RUTA.get(ruta);
      try {
        if (!cargar) throw new Error(`No hay page.tsx para ${ruta}`);
        html.set(ruta, await htmlDelServidor((await cargar()).default));
      } catch (error) {
        html.set(ruta, error instanceof Error ? error : new Error(String(error)));
      }
    }),
  );
  return html;
}

/** El HTML de una ruta ya renderizada, o el error con el que falló. */
export function htmlDe(renderizadas: Map<string, string | Error>, ruta: string): string {
  const html = renderizadas.get(ruta);
  if (html === undefined) throw new Error(`${ruta} no se renderizó: ¿corrió el beforeAll?`);
  if (html instanceof Error) throw html;
  return html;
}
