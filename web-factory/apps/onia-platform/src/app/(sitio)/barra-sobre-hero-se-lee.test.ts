import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Arriba del todo, la barra se pinta del verde del hero. Todo lo que queda
 * ENCIMA de ese verde tiene que SEGUIR LEYÉNDOSE.
 *
 * Medido el 2026-09-24 en producción, mirando la pantalla: en `onia.com.bo/` a
 * 390 px, el botón «☰ Menú» —la ÚNICA navegación que existe en teléfono, porque
 * `.nav` está en `display:none` hasta 940 px— se pinta con `color: var(--ink)`
 * (#141A17) sobre `--green-deep` (#013925). Contraste **1,36:1** contra un mínimo
 * de 4,5. Los dos instrumentos coinciden: el DOM devuelve `rgb(20, 26, 23)` y el
 * muestreo de píxeles de la captura devuelve tinta `rgb(20,26,23)` sobre fondo
 * `rgb(1,57,37)`, en 320, 390 y 768. No es el rasterizador: es el sitio.
 *
 * POR QUÉ PASÓ, que es lo que este gate cuida. `.headerSobreHero` invierte a mano
 * los controles de la barra —`.logoTinta`/`.logoClaro`, `.navLink`, `.headerLogin`—
 * y `.burger` se quedó afuera. Los tres cubiertos son los que se ven en
 * ESCRITORIO, que es donde se miró; el que faltaba es el único que se ve en
 * TELÉFONO, que es donde nadie miró. Una lista escrita a mano se olvida del
 * hermano que no estaba en pantalla cuando se escribió, y el olvido es invisible
 * porque el control sigue ahí: clickeable, del tamaño correcto, ilegible.
 *
 * CÓMO NO FALLA EN VERDE. Los sujetos se derivan del MARKUP (`barra.tsx` y el
 * botón de `menu.tsx`), no de una lista de este archivo: un control nuevo en la
 * barra entra solo a la medición y nace exigido. El umbral se calcula con la
 * fórmula de contraste de WCAG sobre los colores RESUELTOS desde `globals.css`,
 * así que cambiar `--ink` o `--green-deep` mueve el veredicto sin tocar el test.
 * Y si el parser se rompe y deja de encontrar controles, el test se pone ROJO por
 * `MINIMO_SUJETOS` en vez de aprobar la nada — que es como esta familia de gates
 * se muere en silencio.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const CSS_SITIO = join(AQUI, "sitio.module.css");
const CSS_GLOBAL = join(AQUI, "..", "globals.css");
const BARRA = join(AQUI, "barra.tsx");
const MENU = join(AQUI, "menu.tsx");

/**
 * Mínimo de WCAG 2.1 para texto normal (1.4.3). El botón del menú es texto de
 * 0,95rem, no un icono suelto, así que le toca 4,5 y no el 3,0 de los
 * componentes de interfaz. El arreglo del 2026-09-24 llega a 9,4:1 usando el
 * mismo color que ya usaban `.navLink` y `.headerLogin`, así que el umbral no
 * obliga a inventar un color nuevo: obliga a no olvidarse de un control.
 */
const CONTRASTE_MINIMO = 4.5;

/**
 * Cuántos controles tiene que encontrar el parser antes de que su silencio valga
 * como aprobación. Hoy la barra renderiza 9 clases; si un refactor deja el
 * recuento por debajo de 5, lo que se rompió es la medición.
 */
const MINIMO_SUJETOS = 5;

/** Clases que la barra renderiza pero que NO pintan texto ni borde propio. */
const SIN_TINTA_PROPIA = new Set(["logoImg", "logoTinta", "logoClaro"]);

function leer(ruta: string): string {
  return readFileSync(ruta, "utf8");
}

/** `#abc` / `#aabbcc` → [r,g,b]. */
function hexARgb(hex: string): [number, number, number] | null {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  return null;
}

/**
 * Tabla de variables del TEMA CLARO — el `:root` de `globals.css` más el bloque
 * de tokens de `sitio.module.css`. El tema oscuro (`:root[data-theme="dark"]`)
 * se excluye a propósito: redefine `--ink` a un color claro, así que mezclarlo
 * taparía justo el caso que se mide. Playwright y un teléfono recién sacado de la
 * caja piden el claro.
 */
function tablaDeVariables(): Map<string, string> {
  const tabla = new Map<string, string>();
  for (const archivo of [CSS_GLOBAL, CSS_SITIO]) {
    const texto = leer(archivo);
    // Cortamos en el primer bloque de tema oscuro para no pisar el tema claro.
    const claro = texto.split(/:root\s*\[\s*data-theme\s*=\s*"dark"\s*\]/)[0];
    for (const m of claro.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      tabla.set(m[1], m[2].trim());
    }
  }
  return tabla;
}

/**
 * Resuelve un valor de color a [r,g,b]: sigue cadenas de `var(--x)` y evalúa el
 * único `color-mix(in srgb, C N%, transparent)` que usa esta hoja, que es una
 * mezcla con el fondo (alfa sobre opaco), no con otro color.
 */
function resolverColor(
  valor: string,
  tabla: Map<string, string>,
  fondo: [number, number, number],
  saltos = 0,
): [number, number, number] | null {
  if (saltos > 10) return null;
  const v = valor.trim();

  const mix = v.match(
    /color-mix\(\s*in\s+srgb\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*transparent\s*\)/i,
  );
  if (mix) {
    const base = resolverColor(mix[1], tabla, fondo, saltos + 1);
    if (!base) return null;
    const a = Number(mix[2]) / 100;
    return [0, 1, 2].map((i) =>
      Math.round(base[i] * a + fondo[i] * (1 - a)),
    ) as [number, number, number];
  }

  const ref = v.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,(.*))?\)$/i);
  if (ref) {
    const apuntado = tabla.get(ref[1]);
    if (apuntado) return resolverColor(apuntado, tabla, fondo, saltos + 1);
    if (ref[2]) return resolverColor(ref[2], tabla, fondo, saltos + 1);
    return null;
  }

  if (v.startsWith("#")) return hexARgb(v.split(/\s+/)[0]);

  const rgb = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  if (/^(#fff|white)$/i.test(v)) return [255, 255, 255];
  return null;
}

/** Luminancia relativa de WCAG 2.1. */
function luminancia([r, g, b]: [number, number, number]): number {
  const canal = (c: number) => {
    const x = c / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contraste(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const [alto, bajo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alto + 0.05) / (bajo + 0.05);
}

/**
 * Clases que la barra RENDERIZA encima del hero. Salen del markup, no de una
 * lista: `barra.tsx` entero, y de `menu.tsx` sólo lo que está antes del
 * `<dialog>` — la hoja del menú se abre a pantalla completa con su propio fondo,
 * así que nunca se pinta sobre el verde del hero.
 */
export function controlesDeLaBarra(barra: string, menu: string): string[] {
  // Los comentarios se van ANTES de buscar el `<dialog>`: el de `menu.tsx`
  // explica por qué usa `<dialog>`, así que partir por el texto crudo corta en
  // la explicación y deja al `.burger` —el sujeto de este gate— del lado que no
  // se mide. Falló así la primera vez que se corrió, en verde de mentira.
  const sinComentarios = menu
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
  const antesDelDialogo = sinComentarios.split("<dialog")[0];
  const clases = new Set<string>();
  for (const fuente of [barra, antesDelDialogo]) {
    for (const m of fuente.matchAll(/\bs\.([A-Za-z][A-Za-z0-9_]*)/g)) {
      clases.add(m[1]);
    }
  }
  for (const fuera of SIN_TINTA_PROPIA) clases.delete(fuera);
  // `header` y `headerSobreHero` son la barra misma, no un control de adentro.
  clases.delete("header");
  clases.delete("headerSobreHero");
  return [...clases].sort();
}

/**
 * Último `color:` declarado para un selector de clase, ignorando las reglas que
 * ya están calificadas por `.headerSobreHero` (ésas son justamente la cobertura).
 */
function colorBase(css: string, clase: string): string | null {
  let encontrado: string | null = null;
  const re = new RegExp(
    `(^|[},])\\s*([^{}]*\\.${clase}\\b[^{}]*)\\{([^}]*)\\}`,
    "g",
  );
  for (const m of css.matchAll(re)) {
    const selector = m[2];
    if (/headerSobreHero/.test(selector)) continue;
    const decl = m[3].match(/(?:^|;)\s*color\s*:\s*([^;]+)/);
    if (decl) encontrado = decl[1].trim();
  }
  return encontrado;
}

/** `color:` que `.headerSobreHero` le pone a una clase, si se lo pone. */
function colorSobreHero(css: string, clase: string): string | null {
  let encontrado: string | null = null;
  const re = new RegExp(
    `(^|[},])\\s*([^{}]*\\.headerSobreHero\\b[^{}]*\\.${clase}\\b[^{}]*)\\{([^}]*)\\}`,
    "g",
  );
  for (const m of css.matchAll(re)) {
    const decl = m[3].match(/(?:^|;)\s*color\s*:\s*([^;]+)/);
    if (decl) encontrado = decl[1].trim();
  }
  return encontrado;
}

describe("la barra sobre el hero se lee", () => {
  const css = leer(CSS_SITIO);
  const tabla = tablaDeVariables();
  const controles = controlesDeLaBarra(leer(BARRA), leer(MENU));

  it("encuentra los controles de la barra en el markup", () => {
    expect(controles.length).toBeGreaterThanOrEqual(MINIMO_SUJETOS);
    expect(controles).toContain("burger");
  });

  it("resuelve el verde del hero y la tinta de la barra clara", () => {
    const fondo = resolverColor("var(--green-deep)", tabla, [255, 255, 255]);
    const tinta = resolverColor("var(--ink)", tabla, [255, 255, 255]);
    expect(fondo).toEqual([1, 57, 37]);
    expect(tinta).toEqual([20, 26, 23]);
  });

  it("todo control que pinta tinta oscura se aclara sobre el hero", () => {
    const fondo = resolverColor("var(--green-deep)", tabla, [255, 255, 255])!;
    const rotos: string[] = [];
    let medidos = 0;

    for (const clase of controles) {
      const base = colorBase(css, clase);
      if (!base) continue;
      const rgbBase = resolverColor(base, tabla, fondo);
      if (!rgbBase) continue;
      medidos += 1;

      // Si el color de la barra clara ya se lee sobre el verde, no hace falta
      // invertir nada: lo que se exige es que SE LEA, no que exista una regla.
      if (contraste(rgbBase, fondo) >= CONTRASTE_MINIMO) continue;

      const sobre = colorSobreHero(css, clase);
      const rgbSobre = sobre ? resolverColor(sobre, tabla, fondo) : null;
      const ratio = rgbSobre ? contraste(rgbSobre, fondo) : contraste(rgbBase, fondo);

      if (ratio < CONTRASTE_MINIMO) {
        rotos.push(
          `.${clase}: ${ratio.toFixed(2)}:1 sobre el verde del hero ` +
            `(mínimo ${CONTRASTE_MINIMO}) — ${
              sobre
                ? `.headerSobreHero se lo pone en ${sobre}`
                : `.headerSobreHero no lo aclara, queda en ${base}`
            }`,
        );
      }
    }

    expect(medidos).toBeGreaterThanOrEqual(1);
    expect(rotos).toEqual([]);
  });
});
