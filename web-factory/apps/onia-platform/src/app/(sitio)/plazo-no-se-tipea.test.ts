import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe } from "../rutas";

/**
 * Ninguna página **tipea** la fecha del plazo del SIN: la importa de `lib/siat.ts`.
 *
 * `lib/siat.ts` dice de sí mismo, en su cabecera: *«Si una cifra o una fecha
 * cambia, se cambia ACÁ y no en las páginas»*, y `guia-facturacion/page.tsx`
 * repite la promesa: *«El texto NO se redactó acá: sale entero de lib/siat.ts…
 * Si el SIN mueve la fecha por tercera vez se corrige ese archivo y las dos
 * páginas se enteran solas»*. Las dos eran FALSAS: el Kicker que encabeza
 * `/guia-facturacion` —lo primero que se lee en esa pantalla— tenía la fecha
 * escrita a mano, y decía `Plazo · 30-09-2026` mientras su propia bajada, dos
 * líneas abajo, decía «el 1 de octubre». La pantalla se contradecía a la vista
 * del lead. Un comentario que AFIRMA una garantía es una hipótesis con fecha:
 * ésta hay que verificarla, y eso es este archivo.
 *
 * Por qué no lo vio ningún gate anterior:
 *   · `plazo-que-vence.test.ts` pregunta por el TIEMPO VERBAL, y `Plazo ·
 *     30-09-2026` no tiene verbo. Su pregunta es correcta; es otra pregunta.
 *   · Los barridos de texto prohibido y las capturas miran el sitio de HOY:
 *     la fecha estaba bien escrita, sólo que era la equivocada de las dos.
 *   · Los cruces de precios atan CIFRAS contra su fuente; una fecha no es un
 *     monto y no es sujeto de ninguno.
 *
 * Las dos fechas significaban cosas opuestas: la RND 102600000007 fijaba el
 * **30-09-2026** como último día de transición y el **01-10-2026** como primer
 * día de obligación. Sueltas, un rótulo de una línea se lee como LA fecha
 * límite — y `CLAUDE.md` prohíbe el 30 de septiembre por nombre, justo porque
 * ya se corrigió en otras superficies por este mismo motivo. El matiz completo
 * tiene un solo lugar donde cabe y es `SIAT_BAJADA`.
 *
 * ⚠️ 2026-10-03: el 30-09-2026 es además el día de la RND 102600000038, que dejó
 * sin efecto ese plazo. La regla de este archivo vale igual —y más—: cuando la
 * norma cambió, el Kicker se corrigió solo porque sale de `lib/siat.ts`
 * (`Plazo 01-10-2026 · sin efecto`), y la única corrección a mano en las páginas
 * fue su metadata.
 *
 * El sujeto es la CLASE, no el Kicker: toda `page.tsx` del disco. Una página
 * fiscal nueva nace cubierta, y el universo se camina con `readdirSync`
 * (`../rutas`) y no con `git ls-files`, porque el archivo recién escrito y sin
 * commitear es justo el que hay que cazar.
 */

/** El último día de transición, como lo escribe la gente. */
const TRANSICION =
  /30\s*(de\s*)?(septiembre|sept[a-z]*\.?|09)\s*(de\s*)?2026|30[-/]09[-/]2026|2026[-/]09[-/]30/i;

/** Cualquiera de las dos fechas del plazo, en cualquiera de sus formas. */
const PLAZO = new RegExp(
  `(1|1º|1°|01)\\s*(de\\s*)?(octubre|oct[a-z]*\\.?)\\s*(de\\s*)?2026|01[-/]10[-/]2026|2026[-/]10[-/]01|${TRANSICION.source}`,
  "i",
);

/**
 * La fuente sin comentarios, conservando los saltos de línea.
 *
 * Los comentarios acusan Y absuelven: esta misma bitácora cita el defecto
 * palabra por palabra, y un gate que la mire obliga a borrar el registro para
 * ponerse verde — que es exactamente como esta familia de gates falla.
 */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/^\s*\/\/.*$/gm, " ");
}

/**
 * El texto que se PINTA, no el que se declara.
 *
 * Un literal entre `>` y `<` sin llaves es texto escrito a mano en el JSX.
 * `<Kicker>{SIAT_GUIA_KICKER}</Kicker>` lleva llaves y queda afuera, que es el
 * punto: eso está derivado de la fuente y es lo que el gate quiere que pase.
 */
function textoPintado(fuente: string): string[] {
  return [...sinComentarios(fuente).matchAll(/>([^<>{}]+)</g)]
    .map((m) => m[1].trim())
    .filter(Boolean);
}

/** El `page.tsx` que trajo el defecto: si sale del universo, el gate se apagó solo. */
const SUJETO_CONOCIDO = "(sitio)/guia-facturacion/page.tsx";

describe("la fecha del plazo del SIN no se tipea en una página", () => {
  it("el universo trae las páginas del disco, incluida la que trajo el defecto", () => {
    expect(PAGINAS.length).toBeGreaterThan(10);
    expect(
      PAGINAS.map((p) => p.archivo.replace(/\\/g, "/")),
      "si la guía fiscal no está en el universo, el gate mide otra cosa",
    ).toContain(SUJETO_CONOCIDO);
  });

  it.each(PAGINAS)("$ruta no pinta una fecha del plazo a mano", (pagina) => {
    const tipeadas = textoPintado(readFileSync(archivoDe(pagina), "utf8")).filter((t) =>
      PLAZO.test(t),
    );
    expect(
      tipeadas,
      `${pagina.ruta} escribe la fecha del plazo en el JSX en vez de importarla de @/lib/siat: si el SIN la mueve por tercera vez (ya van dos), esta línea queda vieja mientras el resto de la página se corrige sola`,
    ).toEqual([]);
  });

  it.each(PAGINAS)("$ruta no presenta el 30-09 como si fuera el plazo", (pagina) => {
    const fuente = sinComentarios(readFileSync(archivoDe(pagina), "utf8"));
    expect(
      [...fuente.matchAll(new RegExp(TRANSICION.source, "gi"))].map((m) => m[0]),
      `${pagina.ruta} nombra el último día de transición; suelto se lee como LA fecha límite y contradice al resto del sitio. El matiz completo va en SIAT_BAJADA, que lo explica entero`,
    ).toEqual([]);
  });
});

describe("el gate puede fallar", () => {
  it("caza el Kicker exacto que trajo el defecto", () => {
    const defecto = `<Kicker>Plazo · 30-09-2026</Kicker>`;
    expect(textoPintado(defecto).filter((t) => PLAZO.test(t))).toEqual(["Plazo · 30-09-2026"]);
    expect(TRANSICION.test(defecto)).toBe(true);
  });

  it("caza las otras formas de escribir las dos fechas", () => {
    for (const forma of [
      "<p>desde el 1 de octubre de 2026</p>",
      "<span>01-10-2026</span>",
      "<b>hasta el 30 de septiembre de 2026</b>",
      "<em>30/09/2026</em>",
    ]) {
      expect(textoPintado(forma).filter((t) => PLAZO.test(t)), forma).not.toEqual([]);
    }
  });

  it("deja pasar lo que SÍ está derivado de la fuente", () => {
    expect(textoPintado(`<Kicker>{SIAT_GUIA_KICKER}</Kicker>`)).toEqual([]);
    expect(textoPintado(`<h1>{SIAT_GUIA_TITULAR}</h1>`)).toEqual([]);
  });

  it("no acusa a la bitácora que explica el defecto", () => {
    const bitacora = `/* Decía <Kicker>Plazo · 30-09-2026</Kicker> y contradecía su bajada. */\n<Kicker>{SIAT_GUIA_KICKER}</Kicker>`;
    expect(textoPintado(bitacora).filter((t) => PLAZO.test(t))).toEqual([]);
    expect(TRANSICION.test(sinComentarios(bitacora))).toBe(false);
  });
});
