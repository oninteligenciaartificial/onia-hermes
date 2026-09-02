import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El último píxel de la página es del PIE.
 *
 * El 2026-09-02 las dos pantallas de venta cerraban con una franja CLARA de
 * 73px debajo del pie NEGRO, en teléfono. La causa era un
 * `body { padding-bottom: 4.6rem }` que reservaba lugar para una barra de
 * acción fija del móvil que ya no existe. El hueco quedó huérfano y, como
 * vivía en el `body`, pintaba del fondo claro y salía en las DIECISÉIS rutas
 * del sitio a la vez. Es lo último que ve un lead que leyó la página entera.
 *
 * Ese arreglo fue sólo CSS y se fue sin gate: nada impedía que volviera. Este
 * archivo es el gate, y corre en `prebuild` (`tsc --noEmit && vitest run`),
 * que es el comando real del deploy — no un script paralelo que no llama
 * nadie.
 *
 * ⚠️ Escrito mirando cómo falló TRES veces el guard de capturas
 * (`forma.test.ts`): las tres por cazar la forma exacta del bug de ayer en vez
 * de la CLASE. Así que acá no se busca el literal `4.6rem`, ni sólo
 * `padding-bottom`: se prohíbe que el `body` o el `html` reserven espacio al
 * final, en cualquiera de sus formas (`padding-bottom`, `padding-block`,
 * `margin-bottom`, o el atajo `padding`/`margin` de 2+ valores, que también
 * tiene lado de abajo). Quien reserve fondo desde ahí lo pinta del fondo claro,
 * que es exactamente el defecto, se llame como se llame la propiedad.
 *
 * Y lleva las DOS mitades del arreglo, porque borrar el padding a secas dejaba
 * el mismo defecto en cualquier iPhone con notch: el área segura del teléfono
 * la tiene que absorber el PIE, para que ese margen salga del negro del pie.
 * Un gate con sólo la primera mitad pasa en verde sobre la pantalla rota.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);

/** Las dos hojas que visten la superficie de venta. */
const HOJAS = [
  join(APP, "globals.css"),
  join(AQUI, "sitio.module.css"),
] as const;

/**
 * Los comentarios se sacan ANTES de mirar. Este archivo y el CSS explican en
 * prosa cuál era la regla vieja; un guard que se dispara con la documentación
 * de su propio bug es un guard que alguien apaga.
 */
function soloCodigo(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Bloques `selector { declaraciones }` más internos (los de dentro de `@media` incluidos). */
function reglas(css: string): { selector: string; cuerpo: string }[] {
  const encontradas: { selector: string; cuerpo: string }[] = [];
  const BLOQUE = /([^{}]*)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = BLOQUE.exec(css)) !== null) {
    encontradas.push({ selector: m[1].trim(), cuerpo: m[2] });
  }
  return encontradas;
}

/** ¿El selector alcanza al documento entero? `body`, `html` y su forma `:global()`. */
function esElDocumento(selector: string): boolean {
  return selector
    .split(",")
    .map((s) => s.trim().replace(/^:global\((.*)\)$/, "$1").trim())
    .some((s) => s === "body" || s === "html");
}

/**
 * Parte una lista de valores CSS respetando los paréntesis: el valor que más
 * importa acá es `calc(2.4em + env(safe-area-inset-bottom, 0px))`, y partirlo
 * por espacios lo haría pedazos.
 */
function valores(lista: string): string[] {
  const partes: string[] = [];
  let actual = "";
  let hondura = 0;
  for (const c of lista.trim()) {
    if (c === "(") hondura++;
    if (c === ")") hondura--;
    if (/\s/.test(c) && hondura === 0) {
      if (actual) partes.push(actual);
      actual = "";
      continue;
    }
    actual += c;
  }
  if (actual) partes.push(actual);
  return partes;
}

/**
 * El lado de ABAJO que declara una regla de espaciado, o `null` si la
 * declaración no tiene lado de abajo. Cubre las cuatro formas de escribir lo
 * mismo, porque la clase de bug es "reservar fondo", no la propiedad concreta:
 *   `padding-bottom: X`  ·  `padding-block: A [B]`  ·  `padding: A [B [C [D]]]`
 * En el atajo de 4 valores el de abajo es el tercero; en el de 3, también; en
 * el de 2 y el de 1, es el primero (arriba y abajo comparten).
 */
function ladoDeAbajo(declaracion: string): string | null {
  const m = /^(padding|margin)(-bottom|-block)?\s*:(.+)$/.exec(declaracion);
  if (!m) return null;
  const v = valores(m[3]);
  if (v.length === 0) return null;
  if (m[2] === "-bottom") return v[0];
  if (m[2] === "-block") return v[1] ?? v[0];
  return v.length >= 3 ? v[2] : v[0];
}

/** `0`, `0px`, `0rem`… no reservan nada. Un guard que ladra sobre un reset se apaga. */
const CERO = /^0[a-z%]*$/i;

/** Las declaraciones de esta regla que reservan espacio abajo de verdad. */
function reservaFondo(cuerpo: string): string[] {
  return cuerpo
    .split(";")
    .map((d) => d.trim())
    .filter((d) => {
      const abajo = ladoDeAbajo(d);
      return abajo !== null && !CERO.test(abajo);
    });
}

describe("la página de venta cierra en el pie, sin franja debajo", () => {
  const hojas = HOJAS.map((ruta) => ({
    rotulo: ruta.slice(APP.length + 1),
    css: soloCodigo(readFileSync(ruta, "utf8")),
  }));

  it("encuentra las hojas de estilo del sitio", () => {
    // si una hoja se renombra, los expects de abajo pasan sobre nada
    for (const h of hojas) {
      expect(reglas(h.css).length, `${h.rotulo} no tiene reglas`).toBeGreaterThan(10);
    }
  });

  it.each(hojas.map((h) => [h.rotulo, h.css]))(
    "%s no reserva espacio al final desde el body ni el html",
    (rotulo, css) => {
      const culpables = reglas(css)
        .filter((r) => esElDocumento(r.selector))
        .flatMap((r) => reservaFondo(r.cuerpo).map((d) => `${r.selector} { ${d} }`));
      expect(
        culpables,
        `${rotulo} reserva fondo desde el documento: eso pinta del fondo CLARO ` +
          `debajo del pie negro, en todas las rutas del sitio. Si hace falta ` +
          `espacio abajo, lo absorbe el pie.`,
      ).toEqual([]);
    },
  );

  it("el área segura del teléfono la absorbe el pie, no el body", () => {
    const enElPie = hojas
      .flatMap((h) => reglas(h.css))
      .filter((r) => /safe-area-inset-bottom/.test(r.cuerpo));
    expect(
      enElPie.length,
      "nadie absorbe env(safe-area-inset-bottom): en un iPhone con notch vuelve la franja",
    ).toBeGreaterThan(0);
    for (const r of enElPie) {
      expect(
        esElDocumento(r.selector),
        `\`${r.selector}\` absorbe el área segura desde el documento: pinta del ` +
          `fondo claro. Tiene que hacerlo un elemento del pie.`,
      ).toBe(false);
      expect(
        r.selector,
        `\`${r.selector}\` absorbe el área segura pero no es el pie`,
      ).toMatch(/footer/i);
    }
  });
});
