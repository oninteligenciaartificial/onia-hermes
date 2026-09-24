/**
 * Qué rutas del sitio son superficie de venta — o sea, cuáles tiene que barrer un
 * gate y cuáles no.
 *
 * Vive en su propio archivo, y no dentro de `enlaces-vivos.mjs`, porque ese script
 * corre su medición en el top-level: importarlo para probar esta lista dispararía
 * 42 curls contra producción y un `process.exit()` que mata al proceso que lo
 * importó (medido el 2026-09-03 en el bot, misma familia de bug). Acá no hay
 * efectos: es una función pura con su test al lado.
 *
 * ⚠️ HISTORIA, porque la regla sin ella se desobedece. Hasta el 2026-09-05 esta
 * lista dejaba fuera `/v1/**` entero —ocho páginas— con este argumento:
 * *"llevan noindex, nofollow, están en Disallow de robots.txt y no aparecen en el
 * sitemap"*. Ese corte ya estaba medido como FALSO el 2026-09-04, por este mismo
 * carril: **robots.txt manda sobre rastreadores, no apaga la pantalla**.
 * `/v1/comparativa` responde 200 y el fetcher de WhatsApp —por donde Sergio manda
 * el sitio a un lead— le lee el `<head>` igual. Ese día el arreglo se aplicó al
 * gate hermano (`obra.test.ts`) y no viajó hasta acá: así es como esta familia de
 * agujeros sobrevive, cada gate teniendo razón por separado.
 *
 * La regla que queda: **una ruta se exime por su NOMBRE y con su motivo, nunca por
 * una categoría** (noindex, disallow, "es archivo viejo"). Una categoría tapa un
 * árbol entero la próxima vez, y el gate sale verde igual.
 *
 * ⚠️ Esto NO es un gate y por eso no tiene alias en `package.json`. Hasta el
 * 2026-09-24 lo tuvo (`npm run rutas:venta`): como acá no hay efectos, ejecutarlo
 * imprimía NADA y salía 0 — un verde mudo indistinguible de una medición que pasó,
 * en la lista de gates del carril de venta. Lo que hay que probar de este archivo
 * ya lo prueban `enlaces-vivos.test.ts` y `precios-vivos.test.ts`, y lo que hay que
 * medir lo miden sus tres consumidores (`enlaces-vivos`, `precios-vivos`,
 * `mirar-venta`). Un alias que corre un módulo puro no mide: tranquiliza.
 */

import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Las únicas exentas, cada una con el motivo por el que no vende nada. */
export const EXENTAS = new Map([
  [
    "/patrones",
    "demo interna de patrones de scroll: no vende nada y ninguna página de venta la enlaza",
  ],
]);

/** `true` si la ruta NO es superficie de venta y un barrido puede saltearla. */
export const FUERA_DE_VENTA = (r) => EXENTAS.has(r);

/**
 * Rutas servidas, derivadas del DISCO (`src/app/**./page.tsx`) y no de una lista ni
 * del sitemap. `(sitio)` y demás grupos de Next no son segmentos de URL: se borran.
 *
 * Vive acá, y no dentro de un medidor, porque la tenían DOS: `enlaces-vivos.mjs`
 * barría el sitio entero con ella mientras `precios-vivos.mjs` miraba una sola
 * pantalla. El 2026-09-12 eso dejó a `/precios` —con Bs 750 y Bs 1.500 vivos, la
 * escalera retirada ese mismo día— fuera del único gate que cruza precios contra
 * producción. Una cura que no viaja al gemelo deja la clase abierta.
 */
export function rutasDelDisco(dirApp, prefijo = "") {
  const salida = [];
  for (const e of readdirSync(dirApp, { withFileTypes: true })) {
    if (!e.isDirectory()) {
      if (/^page\.tsx?$/.test(e.name)) salida.push(prefijo || "/");
      continue;
    }
    // Rutas dinamicas ([slug]) no se pueden visitar sin un valor: se saltan.
    if (e.name.startsWith("[") || e.name.startsWith("_") || e.name === "api") continue;
    const grupo = e.name.startsWith("(") && e.name.endsWith(")");
    salida.push(...rutasDelDisco(join(dirApp, e.name), grupo ? prefijo : `${prefijo}/${e.name}`));
  }
  return [...new Set(salida)];
}

/**
 * El universo que cualquier gate del sitio tiene que barrer: todo lo que producción
 * sirve, menos lo eximido por NOMBRE arriba.
 *
 * El default de `dirApp` apunta a `src/app` de esta app y no al cwd: un gate que se
 * corre desde otra carpeta mediría un árbol vacío y "cero rutas rotas" saldría verde.
 */
export function superficiesDeVenta(dirApp = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app")) {
  return rutasDelDisco(dirApp)
    .filter((r) => !FUERA_DE_VENTA(r))
    .sort();
}
