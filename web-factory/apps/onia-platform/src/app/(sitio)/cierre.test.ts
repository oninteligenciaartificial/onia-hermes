import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
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
const SRC = dirname(APP);

/**
 * TODAS las hojas de estilo de la app, descubiertas del disco.
 *
 * ⚠️ Acá había una lista de DOS archivos (`globals.css` y `sitio.module.css`).
 * Era el mismo error que este proyecto ya cometió con el guard de capturas:
 * mirar sólo `(sitio)` y ser ciego al resto de lo publicado. La app tiene
 * CATORCE hojas, y el defecto que este archivo vigila —reservar fondo desde el
 * documento— sale en TODAS las rutas se escriba donde se escriba: un CSS module
 * puede alcanzar el `body` con `:global(body)`, y `guia-facturacion` ya lo hace.
 * Con la lista fija, el mismo bug reescrito en cualquiera de las otras doce
 * hojas pasaba en VERDE.
 *
 * Se leen del disco a propósito: una hoja nueva queda cubierta sin que nadie se
 * acuerde de agregarla acá. Un gate que hay que mantener a mano es un gate que
 * se queda viejo.
 */
function hojasDeEstilo(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return hojasDeEstilo(ruta);
    return e.isFile() && e.name.endsWith(".css") ? [ruta] : [];
  });
}

const HOJAS = hojasDeEstilo(SRC).sort();

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

/**
 * El SUJETO de un selector: la última parte, la que el navegador termina
 * estilando. En `body:has(.hoja) main` el sujeto es `main`, no el `body` —
 * ése reserva fondo en un `main`, no en el documento.
 *
 * Los combinadores se buscan sólo a nivel de superficie: un espacio dentro de
 * `:has(.a .b)` no separa nada.
 */
function sujeto(selector: string): string {
  let hondura = 0;
  let corte = 0;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (c === "(" || c === "[") hondura++;
    else if (c === ")" || c === "]") hondura--;
    else if (hondura === 0 && /[\s>+~]/.test(c)) corte = i + 1;
  }
  return selector.slice(corte).trim();
}

/**
 * ¿El selector alcanza al documento entero?
 *
 * Cuenta `body` y `html` en todas sus formas de escribirse: envueltos en
 * `:global(...)` —en cualquier posición, no sólo rodeando el selector
 * entero—, y calificados con pseudo-clases o clases (`body:has(.hoja)`,
 * `html.oscuro`), que siguen siendo el documento. No cuenta cuando `body` es
 * sólo el ancestro de otra cosa.
 */
function esElDocumento(selector: string): boolean {
  return selector.split(",").some((s) => {
    const plano = s.replace(/:global\(([^()]*)\)/g, "$1").trim();
    // se corta en la primera pseudo-clase, clase, id o atributo del sujeto
    const raiz = sujeto(plano).split(/[:.#[]/)[0].trim();
    return raiz === "body" || raiz === "html";
  });
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
    rotulo: relative(SRC, ruta).replaceAll("\\", "/"),
    css: soloCodigo(readFileSync(ruta, "utf8")),
  }));

  it("encuentra las hojas de estilo del sitio", () => {
    // Si el descubrimiento se rompe (carpeta movida, `src/` renombrado), los
    // expects de abajo pasarían sobre una lista VACÍA, en verde. Se ancla a las
    // dos hojas que visten la superficie de venta y al orden de magnitud: son
    // catorce hoy, así que menos de diez es que algo dejó de verse.
    expect(hojas.length, "el barrido de hojas .css encontró casi nada").toBeGreaterThan(9);
    for (const imprescindible of ["app/globals.css", "app/(sitio)/sitio.module.css"]) {
      expect(
        hojas.map((h) => h.rotulo),
        `falta ${imprescindible}: el guard estaría mirando otra cosa`,
      ).toContain(imprescindible);
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

  it("el pie de la superficie de venta absorbe el área segura del teléfono", () => {
    // La segunda mitad del arreglo, anclada donde importa: el pie de `(sitio)`,
    // que es el que cierra `/` y `/empezar`. Sin esto, borrar el padding del
    // body a secas deja la misma franja en cualquier iPhone con notch.
    const pieDeVenta = hojas.find((h) => h.rotulo === "app/(sitio)/sitio.module.css");
    const absorben = reglas(pieDeVenta!.css).filter(
      (r) => /safe-area-inset-bottom/.test(r.cuerpo) && /footer/i.test(r.selector),
    );
    expect(
      absorben.length,
      "el pie de venta no absorbe env(safe-area-inset-bottom): en un iPhone con " +
        "notch vuelve la franja debajo del pie negro",
    ).toBeGreaterThan(0);
  });

  it("nadie absorbe el área segura desde el documento, en ninguna hoja", () => {
    // El área segura la puede absorber el pie o una barra fija propia (la
    // `.mobar` de landing-v1 lo hace bien: tiene su propio fondo). Lo que no
    // puede es absorberla el `body`/`html` — ahí el espacio se pinta del fondo
    // CLARO y se lee como una franja rota debajo del pie.
    const culpables = hojas.flatMap((h) =>
      reglas(h.css)
        .filter((r) => /safe-area-inset-bottom/.test(r.cuerpo) && esElDocumento(r.selector))
        .map((r) => `${h.rotulo}: ${r.selector}`),
    );
    expect(
      culpables,
      "absorber el área segura desde el documento pinta del fondo claro: tiene " +
        "que hacerlo el pie, o el elemento fijo que tenga fondo propio",
    ).toEqual([]);
  });
});
