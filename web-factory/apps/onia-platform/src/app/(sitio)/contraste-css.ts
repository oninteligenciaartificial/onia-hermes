/**
 * Leer colores del CSS del sitio y medir contraste de WCAG, sin navegador.
 *
 * POR QUE EXISTE COMO MODULO. `barra-sobre-hero-se-lee.test.ts` nacio con esta
 * resolucion de variables adentro. Cuando el segundo gate de contraste necesito
 * lo mismo —el bloque de precios, 2026-09-24— la alternativa era una segunda
 * copia de la tabla de variables y del `color-mix`, y dos copias de un resolvedor
 * se desincronizan: la que no se toca sigue midiendo con las reglas viejas y
 * firma verde. Una sola definicion, dos consumidores.
 *
 * El tema OSCURO se excluye a proposito de la tabla: redefine `--ink` y
 * `--accent`, asi que mezclarlo taparia justo los casos que se miden. Playwright
 * y un telefono recien sacado de la caja piden el claro.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

export const CSS_SITIO = join(AQUI, "sitio.module.css");
export const CSS_PORTADA = join(AQUI, "portada.module.css");
export const CSS_GLOBAL = join(AQUI, "..", "globals.css");

export type Rgb = [number, number, number];

export function leer(ruta: string): string {
  return readFileSync(ruta, "utf8");
}

/**
 * Saca los comentarios `/* *​/` antes de parsear.
 *
 * No es cosmetico: el buscador de declaraciones pide un `;` o el arranque del
 * bloque delante de la propiedad, y un comentario explicativo entre dos reglas
 * deja a la siguiente sin ese ancla — `color:` desaparece y el gate lee «no lo
 * declara» en vez de su valor. Paso apenas se documento POR QUE un color era el
 * que era, que es justo lo que estos bloques tienen que llevar escrito. Su
 * hermano `barra-sobre-hero-se-lee.test.ts` aprendio lo mismo sobre el markup.
 */
export function sinComentarios(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, " ");
}

/** `#abc` / `#aabbcc` → [r,g,b]. */
export function hexARgb(hex: string): Rgb | null {
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
 * Tabla de variables del TEMA CLARO: el `:root` de `globals.css` mas los tokens
 * de las hojas que se le pasen. Corta en el primer bloque `[data-theme="dark"]`.
 */
export function tablaDeVariables(
  archivos: string[] = [CSS_GLOBAL, CSS_SITIO, CSS_PORTADA],
): Map<string, string> {
  const tabla = new Map<string, string>();
  for (const archivo of archivos) {
    const claro = sinComentarios(leer(archivo)).split(
      /:root\s*\[\s*data-theme\s*=\s*"dark"\s*\]/,
    )[0];
    for (const m of claro.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      tabla.set(m[1], m[2].trim());
    }
  }
  return tabla;
}

/**
 * Resuelve un valor de color a [r,g,b]: sigue cadenas de `var(--x)` y evalua el
 * `color-mix(in srgb, C N%, transparent)` de estas hojas, que es siempre una
 * mezcla con el FONDO (alfa sobre opaco), no con otro color. Por eso pide el
 * fondo: sin el, un `currentColor 62%` no se puede resolver a un color real.
 *
 * `currentColor` se resuelve con la tinta heredada que le pase el llamador — es
 * el mecanismo con el que una clase se adapta a la tarjeta clara y a la oscura.
 */
export function resolverColor(
  valor: string,
  tabla: Map<string, string>,
  fondo: Rgb,
  tintaHeredada: Rgb | null = null,
  saltos = 0,
): Rgb | null {
  if (saltos > 10) return null;
  const v = valor.trim();

  const mix = v.match(
    /color-mix\(\s*in\s+srgb\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*transparent\s*\)/i,
  );
  if (mix) {
    const base = resolverColor(mix[1], tabla, fondo, tintaHeredada, saltos + 1);
    if (!base) return null;
    const a = Number(mix[2]) / 100;
    return [0, 1, 2].map((i) => Math.round(base[i] * a + fondo[i] * (1 - a))) as Rgb;
  }

  if (/^currentcolor$/i.test(v)) return tintaHeredada;

  const ref = v.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,(.*))?\)$/i);
  if (ref) {
    const apuntado = tabla.get(ref[1]);
    if (apuntado) return resolverColor(apuntado, tabla, fondo, tintaHeredada, saltos + 1);
    if (ref[2]) return resolverColor(ref[2], tabla, fondo, tintaHeredada, saltos + 1);
    return null;
  }

  if (v.startsWith("#")) return hexARgb(v.split(/\s+/)[0]);

  const rgb = v.match(/rgba?\(\s*(\d+)[\s,/]+(\d+)[\s,/]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  if (/^white$/i.test(v)) return [255, 255, 255];
  if (/^black$/i.test(v)) return [0, 0, 0];
  return null;
}

/** Luminancia relativa de WCAG 2.1. */
function luminancia([r, g, b]: Rgb): number {
  const canal = (c: number) => {
    const x = c / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contraste(a: Rgb, b: Rgb): number {
  const [alto, bajo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alto + 0.05) / (bajo + 0.05);
}

/**
 * ¿La clase es el SUJETO de este selector — lo que el selector pinta — y no un
 * ancestro suyo?
 *
 * Hace falta porque `.cicloOn .cicloTag` y `.cicloOn` mencionan las dos a
 * `cicloOn`, y preguntar por el fondo de `.cicloOn` con una busqueda por
 * mencion devuelve el velo de la ETIQUETA: el gate midio «#fff sobre
 * rgb(255 255 255 / 0.22)» = 1,00:1 y se puso rojo por un defecto inventado,
 * tapando el real (3,68:1). Un rojo por el motivo equivocado es un verde futuro.
 *
 * El sujeto es el ultimo componente compuesto del selector: lo que queda
 * despues del ultimo combinador (` `, `>`, `+`, `~`), ya sin pseudo-elementos.
 * Asi `.cicloBtn.cicloOn` cuenta —clase encadenada al sujeto— y
 * `.planStar .planList li::before` no.
 */
function esElSujeto(selector: string, clase: string): boolean {
  return selector.split(",").some((uno) => {
    const ultimo = uno.trim().split(/\s*[>+~]\s*|\s+/).pop() ?? "";
    return new RegExp(`\\.${clase}\\b`).test(ultimo.replace(/::?[a-z-]+(\([^)]*\))?/gi, ""));
  });
}

/**
 * Declaraciones de las reglas cuyo SUJETO es una clase. Devuelve el ULTIMO
 * valor declarado para la propiedad pedida, en orden de aparicion: es lo que
 * gana en la cascada entre reglas de igual especificidad.
 *
 * `excluyendo` saca de la cuenta las reglas ya calificadas por otro ancestro
 * (por ejemplo `.headerSobreHero .x` o `.planStar .x`): esas son justamente la
 * cobertura que el gate quiere verificar aparte, no el color base.
 * `exigiendo` hace lo contrario: pide ese ancestro.
 */
export function declaracion(
  css: string,
  clase: string,
  propiedad: string,
  opciones: { excluyendo?: RegExp; exigiendo?: RegExp } = {},
): string | null {
  let encontrado: string | null = null;
  const limpio = sinComentarios(css);
  const re = new RegExp(`(^|[},])\\s*([^{}]*\\.${clase}\\b[^{}]*)\\{([^}]*)\\}`, "g");
  const prop = new RegExp(`(?:^|;)\\s*${propiedad}\\s*:\\s*([^;]+)`, "i");
  for (const m of limpio.matchAll(re)) {
    const selector = m[2];
    if (!esElSujeto(selector, clase)) continue;
    if (opciones.excluyendo && opciones.excluyendo.test(selector)) continue;
    if (opciones.exigiendo && !opciones.exigiendo.test(selector)) continue;
    const decl = m[3].match(prop);
    if (decl) encontrado = decl[1].trim();
  }
  return encontrado;
}
