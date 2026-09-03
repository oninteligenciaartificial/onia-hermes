import { describe, expect, it } from "vitest";

import { PAGINAS, PAGINAS_PUBLICAS, RUTAS_PROHIBIDAS, dentroDe, metadataDe } from "./rutas";

/**
 * Una ruta que el sitio PUBLICA se comparte con su URL.
 *
 * El 2026-09-03 `/terminos` y `/privacidad` eran las dos únicas rutas sin
 * `og:url`: traían las otras nueve etiquetas Open Graph —imagen incluida—
 * porque las HEREDAN del layout raíz, y ahí la única que falta es justamente la
 * que no se puede heredar, porque es distinta en cada página. Ninguna de las
 * dos declaraba `openGraph`, así que nadie notó el hueco: la tarjeta se veía
 * casi bien.
 *
 * `og:url` es lo que WhatsApp, Facebook y LinkedIn usan para saber a qué
 * dirección apunta el enlace que están dibujando, y para juntar la página con
 * ella misma cuando llega con parámetros de campaña pegados. Sin ella la
 * tarjeta queda a merced de la URL exacta que el visitante haya copiado.
 *
 * ⚠️ **El corte es el disco menos el `disallow` de `robots.ts`** — o sea, lo
 * que el propio sitio declara que NO publica—, y las dos alternativas obvias
 * están mal:
 *  - Por carpeta: las rutas del sitio viven en dos lados (`(sitio)/` y `app/` a
 *    secas — `/terminos`, `/privacidad` y `/servicios/consultoria` son de las
 *    segundas). Mirar sólo `(sitio)` es el mismo punto ciego que ya se pagó dos
 *    veces en este proyecto.
 *  - Por `noindex`: `/terminos` declara `robots: { index: false }` y aun así ES
 *    una de las dos páginas que estaban rotas. Compartir e indexar son cosas
 *    distintas: una página que no querés en Google se manda igual por WhatsApp.
 *    Con ese criterio el gate pasaba en verde sobre el defecto.
 *
 * ⚠️ **Y tampoco es el sitemap, aunque esta misma nota lo dijera hasta el
 * 2026-09-03.** Ese corte se rompió el día que `/terminos` salió del sitemap
 * por declararse `noindex` (ver `indexar.test.ts`): la página seguía publicada
 * y compartible, pero habría dejado de tener gate **sin que nada se pusiera en
 * rojo**. Un criterio de cobertura que se encoge solo cuando cambia una
 * política de indexación es un criterio que falla ABIERTO. Con el disco es al
 * revés: una página nueva nace cubierta y hay que excluirla a mano —en
 * `robots.ts`, a la vista— para que deje de estarlo.
 *
 * Corre en `prebuild` (`tsc --noEmit && vitest run`), el comando real del
 * deploy, no un script paralelo que no llama nadie.
 */

describe("toda ruta publicada se comparte con su propia URL", () => {
  it("encuentra las páginas y lo que el sitio no publica", () => {
    // Sin este ancla, romper el descubrimiento (carpeta movida, `page.tsx`
    // renombrado) dejaría los `it.each` de abajo corriendo sobre una lista
    // VACÍA: cero casos, verde, y el defecto suelto.
    expect(PAGINAS.length, "el barrido de page.tsx encontró casi nada").toBeGreaterThan(9);
    expect(
      PAGINAS_PUBLICAS.length,
      "no quedó ninguna página pública: el disallow de robots.ts se comió el sitio",
    ).toBeGreaterThan(9);
    // Si `robots.ts` deja de excluir algo, `/patrones` y `/v1` entran al gate y
    // lo ensucian. Que el barrido encoja tiene que doler acá, no allá.
    expect(
      RUTAS_PROHIBIDAS.length,
      "no se pudo leer el disallow de robots.ts",
    ).toBeGreaterThan(0);
    expect(
      PAGINAS.length - PAGINAS_PUBLICAS.length,
      "robots.ts prohíbe rutas que no existen en el disco, o dejó de prohibir las que sí",
    ).toBeGreaterThan(0);
  });

  it.each(PAGINAS_PUBLICAS.map((p) => [p.ruta || "/", p]))(
    "%s trae og:url, y apunta a sí misma",
    (rotulo, pagina) => {
      const meta = metadataDe(pagina);
      const url = dentroDe(meta, "openGraph", "url");
      expect(
        url,
        `${pagina.archivo} (${rotulo}) no declara openGraph.url. Es la única etiqueta ` +
          `OG que NO se hereda del layout raíz —cambia en cada página—, así que la ` +
          `tarjeta de WhatsApp queda sin dirección propia.`,
      ).not.toBeNull();

      // Dos direcciones distintas para la misma página es peor que una sola
      // faltante: el buscador cree una y el que comparte ve la otra.
      const canonical = dentroDe(meta, "alternates", "canonical");
      if (canonical !== null) {
        expect(
          url,
          `${pagina.archivo}: og:url (${url}) y canonical (${canonical}) no coinciden`,
        ).toBe(canonical);
      }
    },
  );
});
