import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { declaracionesPorSelector } from "./grilla-que-crece-no-reparte.test";

/**
 * La marca de la barra no se encoge: es lo último que se cede, no el relleno.
 *
 * POR QUÉ EXISTE ESTE GATE. Medido el 2026-09-25 contra producción con Chromium,
 * `onia.com.bo/empezar`, animaciones apagadas, midiendo el ancho REAL del `<img>`
 * del wordmark en la barra pegajosa:
 *
 *   320px  logo  0px de 65  → la marca DESAPARECE de la barra
 *   360px  logo 35px de 65  → la marca sale CORTADA por la mitad
 *   390px  logo 65px de 65  → bien
 *
 * O sea: en un iPhone SE la primera pantalla del sitio no tiene marca, y en un
 * Android de 360 —el ancho más común de la gama baja— tiene media. La barra es
 * lo único que viaja por TODAS las pantallas de venta; perder ahí el logo es
 * perder la marca en la única pieza que se repite.
 *
 * LA CAUSA, y por qué nació de un arreglo. El 2026-09-24 se le puso
 * `white-space: nowrap` al CTA de la barra para que «Creá tu cuenta» dejara de
 * partirse en tres líneas a 320px (ver el comentario de `.headerCta .btn`). Ese
 * arreglo es correcto y se queda. Pero dejó la barra con TRES hermanos de los
 * cuales dos son rígidos —el CTA por `nowrap`, el botón de menú por su contenido—
 * y uno elástico: el wordmark, un `<img>` con `width: auto`. Cuando el ancho no
 * alcanza, flexbox encoge lo único que puede encogerse, y lo encoge hasta CERO
 * sin avisar: no desborda, no rompe el layout, no se queja ningún gate. La marca
 * se va en silencio.
 *
 * Por eso el sujeto no es «el logo de /empezar»: es la FORMA. Un hermano rígido
 * nuevo en la barra vuelve a exprimir al único elástico que quede.
 *
 * LA CURA, medida antes de escribirla (misma corrida, inyectada sobre
 * producción): `flex: 0 0 auto` en el wordmark, y al lado el aire que hacía falta
 * para que entren los tres a 320 y 360 —barra un poco más angosta, CTA y botón de
 * menú con menos relleno por debajo de 380px—. Resultado:
 *
 *   320px  logo 0 → 65 · el botón de menú dejó de salirse 5px · barra sigue 61px
 *   360px  logo 35 → 65 · nada se sale
 *   390px  sin cambio (la media query corta en 380px)
 *
 * El CTA sigue en UNA línea (alto 44-47px, nunca las tres líneas del 24-sep) y la
 * barra sigue midiendo 61px en los tres anchos: no es un rediseño, es hacer
 * entrar lo que ya estaba.
 *
 * CÓMO NO FALLA EN VERDE. El sujeto se deriva del disco y las declaraciones se
 * MEZCLAN por selector (mismo parser que el gate hermano), porque `.wordmark` se
 * declara en un bloque y su rigidez en otro. Si el parser se rompe, el caso ancla
 * —`.wordmark` existe, y el CTA de la barra sigue declarando `nowrap`— se pone
 * rojo en vez de aprobar la nada.
 *
 * ⚠️ LÍMITE, dicho de frente: esto mira el CSS, no la pantalla. Si la marca
 * desaparece por otro camino (un `overflow: hidden` del padre, un `max-width` en
 * el `<img>`) este gate pasa en verde. Se eligió igual porque la condición se
 * declara en una sola regla y se lee sin levantar un navegador; el ancho real se
 * mide con `npm run mirar:venta`, que captura 320 y 360 y hasta hoy los daba por
 * buenos porque mide que la pantalla PINTE, no que la marca siga ahí.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const CSS = readFileSync(join(AQUI, "sitio.module.css"), "utf8");
const DECLS = declaracionesPorSelector(CSS);

/** El wordmark de la barra: el `<a>` que envuelve al `<img>` de marca. */
const MARCA = ".wordmark";

/**
 * El hermano rígido que creó el defecto. Si esto deja de ser cierto, la premisa
 * del gate cambió y el rojo tiene que decirlo — no desaparecer en silencio.
 */
const HERMANO_RIGIDO = ".headerCta .btn";

/** `flex`/`flex-shrink` que garantizan que la caja NO se encoja. */
function noSeEncoge(decls: Map<string, string> | undefined): boolean {
  if (!decls) return false;
  const shrink = decls.get("flex-shrink");
  if (shrink !== undefined) return Number.parseFloat(shrink) === 0;
  const flex = decls.get("flex");
  if (flex === undefined) return false;
  if (flex === "none") return true;
  // `flex: <grow> <shrink> <basis>` — el segundo número es el que importa.
  const partes = flex.split(/\s+/);
  if (partes.length >= 2) return Number.parseFloat(partes[1]) === 0;
  return false;
}

describe("la marca de la barra no se encoge", () => {
  it("1. ANCLA: el wordmark existe y el CTA de la barra sigue siendo rígido", () => {
    expect(
      DECLS.has(MARCA),
      `No encontré ${MARCA} en sitio.module.css. O se renombró el wordmark, o el ` +
        `parser se rompió: en los dos casos este gate dejó de medir lo que dice medir.`,
    ).toBe(true);

    expect(
      DECLS.get(HERMANO_RIGIDO)?.get("white-space"),
      `${HERMANO_RIGIDO} ya no declara 'white-space: nowrap'. Ése era el hermano ` +
        `rígido que exprimía a la marca; si se fue, revisá si este gate sigue ` +
        `haciendo falta antes de tocarlo.`,
    ).toBe("nowrap");
  });

  it("2. el wordmark declara que no se encoge", () => {
    expect(
      noSeEncoge(DECLS.get(MARCA)),
      `${MARCA} no declara que se niegue a encogerse (flex: 0 0 auto / flex: none / ` +
        `flex-shrink: 0).\n\n` +
        `Sin eso es el único elástico de una barra con hermanos rígidos, así que ` +
        `flexbox lo encoge a él. Medido en producción el 2026-09-25: a 320px el ` +
        `logo medía 0px de 65 —la marca no estaba— y a 360px medía 35px, cortada ` +
        `por la mitad. No desborda ni rompe nada: se va callada.`,
    ).toBe(true);
  });
});
