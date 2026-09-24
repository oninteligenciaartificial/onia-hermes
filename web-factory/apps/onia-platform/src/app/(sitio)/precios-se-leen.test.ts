import { describe, expect, it } from "vitest";

import {
  CSS_PORTADA,
  CSS_SITIO,
  contraste,
  declaracion,
  leer,
  resolverColor,
  tablaDeVariables,
  type Rgb,
} from "./contraste-css";

/**
 * El bloque de precios de la portada tiene que LEERSE. Es la pantalla donde el
 * lead decide, y el dato que decide es un numero.
 *
 * Medido el 2026-09-24 en produccion con Playwright (390 y 1440 px, midiendo el
 * color computado de cada nodo de texto contra su fondo efectivo), dos fallos
 * reales sobre 445 nodos juzgados:
 *
 *   `.cicloOn`     «Mensual», #fff sobre `--accent` (#089868) → 3,68:1
 *   `.planEquivale` «Bs 8.900 pagando el año — ahorrás 16 %»,
 *                   `--ink-faint` (#69716D) sobre `--ink-block` (#12100e) → 3,78:1
 *
 * contra el 4,5:1 que WCAG 2.1 (1.4.3) pide para texto normal. Los dos se
 * reprodujeron en telefono y en escritorio.
 *
 * POR QUE PASO `.planEquivale`, que es el patron que este gate cuida. El token
 * `--ink-faint` se eligio contra el fondo CLARO —su propio comentario en
 * `globals.css` dice «4.83:1 sobre --bg»— y despues se uso dentro de una tarjeta
 * que tambien existe en variante OSCURA (`.planStar`). Un color anclado a un
 * fondo, reusado sobre otro. Es el tercer caso del mismo molde en esta carpeta:
 * `.burger` se quedo afuera de `.headerSobreHero`, `.planStep` ya se habia
 * arreglado pasando a `currentColor`, y este es el que quedaba. Por eso los
 * sujetos salen del MARKUP de `precios-toggle.tsx` y no de una lista: la clase
 * que alguien agregue manana a la tarjeta nace exigida, que es lo que ninguna
 * lista escrita a mano hace.
 *
 * DOS FONDOS, UNA CLASE. Cada texto de la tarjeta se mide contra los DOS fondos
 * en los que la tarjeta se pinta (`.plan` claro y `.planStar` oscuro), porque
 * pasar en uno solo es exactamente el defecto.
 */

/** WCAG 2.1 (1.4.3) para texto normal. Los sujetos de acá son de 13-18 px. */
const CONTRASTE_MINIMO = 4.5;

/**
 * Cuantos textos tiene que encontrar el parser dentro de la tarjeta antes de que
 * su silencio valga como aprobacion. Hoy `precios-toggle.tsx` renderiza 8 clases
 * ahi adentro; por debajo de 4, lo que se rompio es la medicion.
 */
const MINIMO_SUJETOS = 4;

const TOGGLE = leer(
  new URL("./precios-toggle.tsx", import.meta.url).pathname,
);
const css = { sitio: leer(CSS_SITIO), portada: leer(CSS_PORTADA) };
const tabla = tablaDeVariables();

/** Los dos fondos en que se pinta una tarjeta de plan. */
const FONDOS: Array<{ nombre: string; clase: string; propiedad: string }> = [
  { nombre: "tarjeta clara (.plan)", clase: "plan", propiedad: "background" },
  { nombre: "tarjeta destacada (.planStar)", clase: "planStar", propiedad: "background" },
];

/**
 * Clases que `precios-toggle.tsx` renderiza DENTRO de la tarjeta de plan, con la
 * hoja de la que sale cada una: `s.` es `sitio.module.css` y `v.` es
 * `portada.module.css`. Salen del markup — el `<div className={...plan...}>` y
 * todo lo que cuelga de el.
 */
export function textosDeLaTarjeta(
  toggle: string,
): Array<{ clase: string; hoja: "sitio" | "portada" }> {
  const abre = toggle.indexOf("s.plans");
  const cuerpo = abre >= 0 ? toggle.slice(abre) : toggle;
  const vistas = new Map<string, "sitio" | "portada">();
  for (const m of cuerpo.matchAll(/\b([sv])\.([A-Za-z][A-Za-z0-9_]*)/g)) {
    const clase = m[2];
    // El contenedor y las variantes de la tarjeta no pintan texto propio.
    if (["plans", "plan", "planStar", "planPrice", "planFoot"].includes(clase)) continue;
    vistas.set(clase, m[1] === "s" ? "sitio" : "portada");
  }
  return [...vistas].map(([clase, hoja]) => ({ clase, hoja }));
}

describe("el bloque de precios de la portada se lee", () => {
  const sujetos = textosDeLaTarjeta(TOGGLE);

  it("encuentra los textos de la tarjeta en el markup", () => {
    expect(sujetos.length).toBeGreaterThanOrEqual(MINIMO_SUJETOS);
    expect(sujetos.map((s) => s.clase)).toContain("planEquivale");
  });

  it("resuelve los dos fondos en los que se pinta una tarjeta", () => {
    const claro = resolverColor(
      declaracion(css.sitio, "plan", "background", { excluyendo: /planStar/ })!,
      tabla,
      [255, 255, 255],
    );
    const oscuro = resolverColor(
      declaracion(css.sitio, "planStar", "background")!,
      tabla,
      [255, 255, 255],
    );
    expect(claro).toEqual([255, 255, 255]); // --surface
    expect(oscuro).toEqual([18, 16, 14]); // --ink-block / --tinta
  });

  it("todo texto de la tarjeta se lee sobre los DOS fondos", () => {
    const rotos: string[] = [];
    let medidos = 0;

    for (const { nombre, clase: claseFondo, propiedad } of FONDOS) {
      const crudo = declaracion(css.sitio, claseFondo, propiedad, {
        excluyendo: claseFondo === "plan" ? /planStar/ : undefined,
      });
      const fondo = crudo ? resolverColor(crudo, tabla, [255, 255, 255]) : null;
      expect(fondo, `no pude resolver el fondo de ${nombre}`).not.toBeNull();

      // La tinta que la tarjeta hereda a sus hijos: la declarada por la variante,
      // y si no declara ninguna, la del sitio.
      const tintaCruda =
        declaracion(css.sitio, claseFondo, "color", {
          excluyendo: claseFondo === "plan" ? /planStar/ : undefined,
        }) ?? "var(--ink)";
      const heredada = resolverColor(tintaCruda, tabla, fondo as Rgb);

      for (const { clase, hoja } of sujetos) {
        const decl = declaracion(css[hoja], clase, "color");
        if (!decl) continue; // hereda: ya cubierto por la tinta de la tarjeta
        const rgb = resolverColor(decl, tabla, fondo as Rgb, heredada);
        if (!rgb) continue;
        medidos += 1;
        const ratio = contraste(rgb, fondo as Rgb);
        if (ratio < CONTRASTE_MINIMO) {
          rotos.push(
            `.${clase} sobre ${nombre}: ${ratio.toFixed(2)}:1 ` +
              `(minimo ${CONTRASTE_MINIMO}) — declara color: ${decl}`,
          );
        }
      }
    }

    expect(medidos).toBeGreaterThanOrEqual(1);
    expect(rotos).toEqual([]);
  });

  it("el interruptor mensual/anual se lee en su estado activo", () => {
    const fondoCrudo = declaracion(css.portada, "cicloOn", "background");
    const tintaCruda = declaracion(css.portada, "cicloOn", "color");
    expect(fondoCrudo, ".cicloOn tiene que declarar su fondo").not.toBeNull();
    expect(tintaCruda, ".cicloOn tiene que declarar su tinta").not.toBeNull();

    const fondo = resolverColor(fondoCrudo!, tabla, [255, 255, 255]);
    const tinta = resolverColor(tintaCruda!, tabla, fondo as Rgb);
    expect(fondo).not.toBeNull();
    expect(tinta).not.toBeNull();

    const ratio = contraste(tinta as Rgb, fondo as Rgb);
    expect(
      ratio,
      `.cicloOn: ${ratio.toFixed(2)}:1 — ${tintaCruda} sobre ${fondoCrudo}`,
    ).toBeGreaterThanOrEqual(CONTRASTE_MINIMO);

    // Y la etiqueta del ahorro, que se pinta ENCIMA del boton activo: su fondo
    // es un velo translucido sobre ese mismo verde, no el fondo de la pagina.
    const veloCrudo = declaracion(css.portada, "cicloTag", "background", {
      exigiendo: /cicloOn/,
    });
    const tagCrudo = declaracion(css.portada, "cicloTag", "color", {
      exigiendo: /cicloOn/,
    });
    if (veloCrudo && tagCrudo) {
      const velo = resolverColor(veloCrudo, tabla, fondo as Rgb) ?? (fondo as Rgb);
      const tag = resolverColor(tagCrudo, tabla, velo);
      const r = contraste(tag as Rgb, velo);
      expect(
        r,
        `.cicloOn .cicloTag: ${r.toFixed(2)}:1 — ${tagCrudo} sobre ${veloCrudo}`,
      ).toBeGreaterThanOrEqual(CONTRASTE_MINIMO);
    }
  });
});
