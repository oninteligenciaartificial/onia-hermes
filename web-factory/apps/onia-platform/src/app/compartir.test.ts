import { describe, expect, it } from "vitest";

import { PAGINAS, estaProhibida, dentroDe, metadataDe } from "./rutas";

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
 * ⚠️ **El sujeto es el disco ENTERO menos `EXENTOS`**, y las tres alternativas
 * obvias están mal:
 *  - Por carpeta: las rutas del sitio viven en dos lados (`(sitio)/` y `app/` a
 *    secas — `/terminos`, `/privacidad` y `/servicios/consultoria` son de las
 *    segundas). Mirar sólo `(sitio)` es el mismo punto ciego que ya se pagó dos
 *    veces en este proyecto.
 *  - Por `noindex`: `/terminos` declara `robots: { index: false }` y aun así ES
 *    una de las dos páginas que estaban rotas. Compartir e indexar son cosas
 *    distintas: una página que no querés en Google se manda igual por WhatsApp.
 *    Con ese criterio el gate pasaba en verde sobre el defecto.
 *  - Por el sitemap, aunque esta misma nota lo dijera hasta el 2026-09-03: ese
 *    corte se rompió el día que `/terminos` salió del sitemap por declararse
 *    `noindex` (ver `indexar.test.ts`). Un criterio de cobertura que se encoge
 *    solo cuando cambia una política de indexación falla ABIERTO.
 *
 * ⚠️ **Y hasta el 2026-09-08 el corte era el disco menos el `disallow` de
 * `robots.ts`, que es la MISMA falla un escalón más abajo — se encogió solo, y
 * justo sobre las páginas cuya única superficie que queda es compartirlas.**
 * La justificación escrita acá era que el disallow es *«lo que el propio sitio
 * declara que NO publica»*. Eso valía mientras el disallow tuviera sólo
 * `/patrones` y `/v1`; dejó de valer ese día, cuando entraron
 * `/servicios/marketing-ia` y `/servicios/consultoria` al sacarlas del menú
 * (tarea `t_30b1711d`). El propio `robots.ts` dice de ellas, con todas las
 * letras, que **no se bajan**: siguen respondiendo 200 «así que una URL que ya
 * circula sigue abriendo y se puede mandar en una venta». O sea que la página
 * que se manda por WhatsApp salió, en silencio y el mismo día, del único gate
 * que revisa la tarjeta de WhatsApp. El disallow manda sobre RASTREADORES, no
 * apaga la pantalla, y esta nota ya lo decía dos párrafos más arriba sobre el
 * `noindex` — le faltaba aplicárselo a su propio corte.
 *
 * Medido ese día: el gate cubría **14 de 25** páginas del árbol. `obra.test.ts`,
 * `obra-en-el-cuerpo.test.ts`, `obra-literal.test.ts` y
 * `factura-en-la-oferta.test.ts` ya habían dejado de restar el disallow por
 * esta misma razón —`factura-en-la-oferta.test.ts` la explica nombrando estas
 * dos rutas—; éste se quedó atrás. Es el barrido a medias de siempre: se
 * arregla la instancia donde el defecto saltó y el gate hermano queda con el
 * agujero abierto.
 *
 * Con el disco es al revés: una página nueva nace cubierta y hay que sacarla a
 * mano, acá y con su motivo, para que deje de estarlo.
 *
 * Corre en `prebuild` (`tsc --noEmit && vitest run`), el comando real del
 * deploy, no un script paralelo que no llama nadie.
 */

/**
 * Lo único que NO se comparte, con su motivo escrito.
 *
 * Es una lista de EXCLUSIÓN —un `page.tsx` nuevo nace cubierto y hay que
 * sacarlo acá, a la vista— y a propósito no se deriva de `robots.ts`: no
 * indexar y no compartir son decisiones distintas, y confundirlas es como este
 * gate perdió once páginas.
 */
const EXENTOS: ReadonlyArray<{ ruta: string; motivo: string }> = [
  {
    ruta: "/patrones",
    motivo:
      "Galería interna de patrones de UI: no declara metadata ninguna, no la " +
      "enlaza una sola pantalla y no es una dirección que se le mande a un " +
      "lead. ⚠️ Si algún día se le cuelga una superficie que venda, se va.",
  },
];

/** Las páginas que alguien puede mandar por WhatsApp: el disco menos `EXENTOS`. */
const COMPARTIBLES = PAGINAS.filter((p) => !EXENTOS.some((e) => e.ruta === (p.ruta || "/")));

describe("toda ruta publicada se comparte con su propia URL", () => {
  it("encuentra las páginas, y ninguna exención sobra", () => {
    // Sin este ancla, romper el descubrimiento (carpeta movida, `page.tsx`
    // renombrado) dejaría los `it.each` de abajo corriendo sobre una lista
    // VACÍA: cero casos, verde, y el defecto suelto.
    expect(PAGINAS.length, "el barrido de page.tsx encontró casi nada").toBeGreaterThan(9);
    expect(COMPARTIBLES.length, "las exenciones se comieron el sitio").toBeGreaterThan(9);

    // Una exención que ya no apunta a una página del árbol es una creencia
    // vieja que absuelve a nadie: se borra, o tapa a su sucesora.
    const fantasmas = EXENTOS.filter((e) => !PAGINAS.some((p) => (p.ruta || "/") === e.ruta));
    expect(
      fantasmas.map((e) => e.ruta),
      "hay exenciones que no corresponden a ninguna página del disco",
    ).toEqual([]);
    expect(
      EXENTOS.every((e) => e.motivo.trim().length > 40),
      "una exención sin motivo escrito es una lista de inclusión disfrazada",
    ).toBe(true);
  });

  it("el sujeto incluye las páginas que robots.ts deshabilita", () => {
    // El ancla del CORTE, no del patrón — el mismo que `obra.test.ts` tiene
    // desde el 2026-09-04 y que a este gate le faltó hasta el 2026-09-08.
    // Volver a restar el `disallow` dejaría este caso en rojo en vez de vaciar
    // la cobertura en silencio, que es exactamente como se perdieron
    // `/servicios/marketing-ia` y `/servicios/consultoria` el día que salieron
    // del menú. Se afirma sobre páginas deshabilitadas REALES del árbol: si un
    // día no queda ninguna, este caso avisa que se quedó sin sujeto en lugar
    // de seguir midiendo nada.
    const deshabilitadas = PAGINAS.filter((p) => estaProhibida(p.ruta));
    expect(
      deshabilitadas.length,
      "no quedan páginas deshabilitadas en el árbol: este ancla ya no ancla nada",
    ).toBeGreaterThan(0);
    expect(
      deshabilitadas
        .filter((p) => !COMPARTIBLES.includes(p))
        .map((p) => p.ruta)
        .filter((r) => !EXENTOS.some((e) => e.ruta === (r || "/"))),
      "el gate volvió a restar el disallow de robots.ts, y una página que " +
        "responde 200 se quedó sin vigilancia sobre su tarjeta de WhatsApp",
    ).toEqual([]);
  });

  it.each(COMPARTIBLES.map((p) => [p.ruta || "/", p]))(
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
