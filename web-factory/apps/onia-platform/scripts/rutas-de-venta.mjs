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
 */

/** Las únicas exentas, cada una con el motivo por el que no vende nada. */
export const EXENTAS = new Map([
  [
    "/patrones",
    "demo interna de patrones de scroll: no vende nada y ninguna página de venta la enlaza",
  ],
]);

/** `true` si la ruta NO es superficie de venta y un barrido puede saltearla. */
export const FUERA_DE_VENTA = (r) => EXENTAS.has(r);
