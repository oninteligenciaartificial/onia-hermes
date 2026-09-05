import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Una barra que flota sobre el contenido tiene que TAPAR lo que pasa por debajo.
 *
 * Medido el 2026-09-05 en producción, mirando la pantalla: en `onia.com.bo/chatbot`,
 * al llegar al final de la página, el título blanco en negrita de la sección verde de
 * precio («Bs 390 / mes, sin instalación.») queda justo detrás del header y **se ve
 * fantasma, superpuesto al nav**. El header es `position: sticky` con fondo al **88 %**
 * y `backdrop-filter: blur(10px)`: no es opaco, así que el 12 % del verde oscuro de
 * atrás sube y ensucia la barra al lado del logo. Estilo computado verificado con
 * Playwright: `color(srgb 0.976471 0.984314 0.980392 / 0.88)`, `blur(10px)`,
 * `opacity: 1`, y `elementsFromPoint` en el medio del header devuelve la
 * `SECTION.sitio_block sitio_green` de atrás. Lo reportó el canario visual el
 * 2026-09-03 con espera de 2.500 ms (o sea que no es una animación a mitad de camino),
 * y seguía vivo dos días después.
 *
 * POR QUÉ ES UN GATE Y NO UN ARREGLO SUELTO. El defecto no es de `/chatbot`: es del
 * CSS de la barra, y sólo se NOTA donde el contraste de atrás es alto. En `/precios` y
 * `/empezar`, con el mismo scroll al fondo, no se ve nada — así que arreglarlo mirando
 * una sola página deja el defecto vivo en la siguiente sección oscura que alguien
 * escriba. Y había **tres** barras traslúcidas distintas, no una: la de las páginas del
 * sitio (88 %), la de `site-header` (82 %, que sirve `/nosotros`, `/privacidad`,
 * `/terminos`, `/servicios/*` y las `/v1/*`) y la barra fija de abajo de `landing-v1`
 * (92 %). Arreglar sólo la que saltó es el error que `CLAUDE.md` nombra: barrer el
 * síntoma donde apareció y no a los hermanos que hacen lo mismo.
 *
 * CÓMO NO FALLA EN VERDE. Los sujetos se derivan del DISCO —se recorre `src/` y se
 * toma toda regla que sea `position: sticky|fixed` Y tenga un fondo `color-mix(...
 * N%, transparent)`—, no de una lista escrita a mano. Así una barra nueva nace
 * cubierta y hay que excluirla A MANO, a la vista. Y si el parser se rompe y deja de
 * encontrar reglas, el test se pone ROJO por `MINIMO_SUJETOS` en vez de aprobar la
 * nada, que es como esta familia de gates se muere en silencio.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..");

/**
 * Cuánto fondo tiene que tener la barra para que el texto de atrás no se lea.
 *
 * El 88 % deja pasar el 12 % del verde oscuro (≈ RGB 13,61,43) sobre un fondo casi
 * blanco (≈ 250): unos 26 puntos de diferencia sobre 255, que es exactamente el borrón que se
 * ve en la captura. Al 97 % la diferencia cae a ~6 puntos y, encima difuminada por el
 * `blur`, deja de leerse. No se pide 100 %: la barra sigue siendo de vidrio —conserva
 * su `backdrop-filter` y un resto de traslucidez—, así que esto arregla el defecto sin
 * cambiar la dirección visual, que es decisión de Sergio y no de este gate.
 */
const MINIMO_OPACIDAD = 97;

/**
 * Reglas que tienen `backdrop-filter` y NO son una barra que flote sobre el contenido.
 * Se nombran una por una: una exclusión anónima es como este gate empezaría a mentir.
 *
 * - `patrones.module.css .panel`: no es una barra sino una TARJETA (tiene
 *   `border-radius` y `blur(2px)`), y vive en `/patrones`, una galería interna que no
 *   es superficie de venta. Su traslucidez es el efecto buscado, no una fuga.
 */
const EXENTOS: readonly { archivo: string; selector: string }[] = [
  { archivo: "app/patrones/patrones.module.css", selector: ".panel" },
];

/**
 * `background: color-mix(in srgb, var(--bg) 88%, transparent)` → 88
 *
 * Se recorre con `[^;]*?` y no con `[^)]*?`: el valor lleva un `var(--bg)` ADENTRO, y
 * un patrón que se corta en el primer paréntesis no llega nunca al porcentaje. Ese fue
 * el primer intento y encontró CERO barras — con el agravante de que la aserción de
 * opacidad pasaba igual, en verde, sobre una lista vacía. Lo cazó `MINIMO_SUJETOS`.
 */
const RE_FONDO = /background:\s*color-mix\([^;]*?(\d{1,3})%\s*,\s*transparent\s*\)/;
/** Bloque CSS más interno: `selector { ...sin llaves... }` */
const RE_REGLA = /([^{}]+)\{([^{}]*)\}/g;

function archivosCss(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosCss(p));
    else if (e.name.endsWith(".css")) out.push(p);
  }
  return out;
}

interface Barra {
  archivo: string;
  selector: string;
  opacidad: number;
}

function barrasFlotantes(): Barra[] {
  const barras: Barra[] = [];
  for (const ruta of archivosCss(SRC)) {
    const archivo = relative(SRC, ruta).split("\\").join("/");
    const css = readFileSync(ruta, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const [, crudo, cuerpo] of css.matchAll(RE_REGLA)) {
      if (!/position:\s*(sticky|fixed)/.test(cuerpo)) continue;
      const fondo = RE_FONDO.exec(cuerpo);
      if (!fondo) continue;
      // El chunk anterior a `{` puede arrastrar el `@media (...)`: el selector real
      // es la última línea.
      const selector = crudo.trim().split("\n").pop()!.trim();
      if (EXENTOS.some((e) => e.archivo === archivo && selector.includes(e.selector))) continue;
      barras.push({ archivo, selector, opacidad: Number(fondo[1]) });
    }
  }
  return barras;
}

/**
 * Se midieron 3 el 2026-09-05. Si mañana se encuentran menos, lo que se rompió es el
 * parser —no el sitio— y hay que arreglar el parser, NO bajar este número.
 */
const MINIMO_SUJETOS = 3;

describe("las barras que flotan sobre el contenido lo tapan", () => {
  const barras = barrasFlotantes();

  it(`descubre al menos ${MINIMO_SUJETOS} barras (si no, el parser quedó ciego)`, () => {
    expect(
      barras.length,
      `Sólo se encontraron ${barras.length} barras flotantes en src/. Un gate que mira ` +
        `cero sujetos pasa en verde sobre cualquier cosa: revisar RE_REGLA/RE_FONDO.`,
    ).toBeGreaterThanOrEqual(MINIMO_SUJETOS);
  });

  it(`ninguna deja pasar el texto de atrás (fondo ≥ ${MINIMO_OPACIDAD} %)`, () => {
    const fugas = barras.filter((b) => b.opacidad < MINIMO_OPACIDAD);
    expect(
      fugas,
      `Estas barras flotan sobre el contenido con el fondo por debajo del ${MINIMO_OPACIDAD} %, ` +
        `así que el texto que pasa por debajo se ve fantasma (medido en /chatbot el 2026-09-05):\n` +
        fugas.map((b) => `  · ${b.archivo} ${b.selector} → ${b.opacidad} %`).join("\n"),
    ).toEqual([]);
  });
});
