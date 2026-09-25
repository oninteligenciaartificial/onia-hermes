import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Una caja que CRECE no reparte sus filas: el `gap` que declara es el que se ve.
 *
 * POR QUÉ EXISTE ESTE GATE. Medido el 2026-09-25 contra producción con Chromium
 * a 1366×900, animaciones apagadas (`reducedMotion`), sobre el MISMO componente
 * dibujado en las dos pantallas que ve un lead:
 *
 *   onia.com.bo/          3 pastillas · alto del grid 74px · separación real  8px
 *   onia.com.bo/empezar   4 pastillas · alto del grid 222px · separación real 60px
 *
 * Las dos declaraban el mismo `gap` (~8px). En `/empezar` la separación real era
 * SIETE VECES Y MEDIA la declarada, y la tarjeta —el único dibujo de producto de
 * la última pantalla antes de registrarse— repartía cuatro pastillas sueltas en
 * bandas muertas de 110px bajo el título y 60px entre filas. No se lee como un
 * panel: se lee como una pantalla a medio cargar.
 *
 * LA CAUSA, y por qué la home no la mostraba. `.panelGrid` declaraba a la vez:
 *
 *   flex: 1 1 auto;              → crece y se come todo el alto sobrante del panel
 *   align-content: space-evenly; → y reparte las filas por ese alto crecido
 *   gap: 0.45em;                 → que a esa altura ya no decide nada
 *
 * `space-evenly` sólo se nota cuando SOBRA alto. En la portada el panel mide lo
 * que mide su contenido, así que no sobraba nada y las tres declaraciones
 * convivían sin síntoma; en `/empezar` el panel va dentro de un marco más alto,
 * sobraban 157px, y los mismos tres renglones de CSS estallaron la tarjeta. Por
 * eso el defecto no es "una página está mal": es una regla contradictoria que
 * espera a que alguien le dé alto de más.
 *
 * LA CURA: `align-content: center`. La caja sigue creciendo (el pie se queda
 * abajo, que es para lo que estaba el `flex: 1 1 auto`), pero las filas se
 * mantienen juntas a la distancia que dice el `gap`. Donde hoy está bien —la
 * portada, que no tiene alto sobrante— `center` y `space-evenly` dibujan lo
 * mismo, píxel por píxel: no es un rediseño, es sacarle a la regla la única
 * condición en la que miente.
 *
 * CÓMO NO FALLA EN VERDE. Los sujetos se derivan del DISCO —toda regla de
 * cualquier CSS de `src/` que reparta su contenido— y no de una lista escrita a
 * mano el día de la cura. Las declaraciones se MEZCLAN por selector dentro de
 * cada archivo, que es lo que este defecto exigía: `.panelGrid` se declara en
 * DOS bloques separados por 120 líneas (el `flex`/`align-content` en uno, el
 * `display: grid`/`gap` en el otro), así que un parser que mire un bloque por vez
 * no ve nunca las tres piezas juntas y aprueba el defecto sin enterarse.
 *
 * Y si el parser se rompe, el test se pone ROJO por `MINIMO_REGLAS` y por el
 * caso ancla —`.panelGrid` tiene que seguir existiendo, creciendo y declarando
 * `gap`— en vez de aprobar la nada.
 *
 * ⚠️ LÍMITE, dicho de frente: esto mira el CSS, no la pantalla. Una caja que
 * reciba alto de más por otro camino (un `height` fijo, una fila de grilla del
 * padre) y separe sus filas con `margin` en vez de `gap` no es sujeto de nadie
 * acá. Se eligió igual porque la contradicción se declara en una sola regla y se
 * puede leer sin levantar un navegador: el gate que SÍ abre la pantalla es
 * `mirar:portada`, y no vio esto en semanas porque mide que la pantalla pinte,
 * no que lo pintado tenga sentido.
 */

/** Valores que reparten el sobrante ENTRE las filas en vez de dejarlas juntas. */
const REPARTEN = ["space-evenly", "space-between", "space-around"];

/**
 * Piso de reglas parseadas. No es una cifra de diseño: es el detector de parser
 * roto. Hoy el repo tiene muchas más; si una refactorización del CSS deja esto
 * cerca del piso, el rojo dice "revisá el parser", no "arreglá el CSS".
 */
export const MINIMO_REGLAS = 200;

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..", "..");
const RAIZ = join(SRC, "..");

/** Todos los `.css` de `src/`, derivados del disco. */
function hojasDeEstilo(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...hojasDeEstilo(ruta));
    else if (entrada.name.endsWith(".css")) salida.push(ruta);
  }
  return salida;
}

/**
 * Declaraciones de cada selector, MEZCLADAS por archivo.
 *
 * Se recorren sólo los bloques HOJA (los que no contienen otro `{`), así que las
 * reglas de adentro de un `@media` entran con su selector y el `@media` no se
 * confunde con una regla. El selector se parte por coma: `.a, .b { … }` declara
 * sobre los dos.
 */
export function declaracionesPorSelector(
  css: string,
): Map<string, Map<string, string>> {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  const porSelector = new Map<string, Map<string, string>>();
  const bloques = limpio.matchAll(/([^{}]+)\{([^{}]*)\}/g);
  for (const bloque of bloques) {
    const selectores = bloque[1].trim();
    if (!selectores || selectores.startsWith("@")) continue;
    for (const crudo of selectores.split(",")) {
      const selector = crudo.trim().replace(/\s+/g, " ");
      if (!selector) continue;
      const decls = porSelector.get(selector) ?? new Map<string, string>();
      for (const linea of bloque[2].split(";")) {
        const corte = linea.indexOf(":");
        if (corte < 0) continue;
        const prop = linea.slice(0, corte).trim().toLowerCase();
        const valor = linea.slice(corte + 1).trim().toLowerCase();
        if (prop && valor) decls.set(prop, valor);
      }
      porSelector.set(selector, decls);
    }
  }
  return porSelector;
}

/**
 * Si la caja puede quedarse con alto que no pidió. `flex: 1`, `flex: 1 1 auto` y
 * `flex-grow: 1` son la misma cosa para este defecto; `flex: none` y `flex: 0 …`
 * no crecen.
 */
export function crece(decls: Map<string, string>): boolean {
  const grow = decls.get("flex-grow");
  if (grow !== undefined) return Number.parseFloat(grow) > 0;
  const flex = decls.get("flex");
  if (flex === undefined) return false;
  if (flex === "none" || flex === "auto" || flex === "initial") return flex === "auto";
  return Number.parseFloat(flex) > 0;
}

/** Si la caja declara una separación propia entre sus filas. */
export function declaraGap(decls: Map<string, string>): boolean {
  return ["gap", "row-gap", "grid-row-gap", "grid-gap"].some((p) =>
    decls.has(p),
  );
}

/**
 * Qué propiedad manda sobre el eje que CRECE (el vertical, que es donde el panel
 * reparte alto de más).
 *
 * No es un detalle: la misma contradicción se escribe con dos nombres distintos
 * según el display, y por eso el barrido tiene que preguntar por el eje y no por
 * una propiedad fija. En `sitio.module.css` conviven las dos, a siete líneas de
 * distancia — `.panelGrid` (grid) con `align-content` y `.panelRows/.panelChat/
 * .panelBars` (flex column) con `justify-content`—, así que un gate que mirara
 * sólo `align-content` arreglaba una y dejaba viva la hermana.
 *
 * Un flex en FILA queda fuera a propósito: ahí `justify-content: space-between`
 * con `gap` es el patrón correcto de toda la vida (empujar cosas a los bordes),
 * y meterlo acá llenaría el gate de falsos rojos.
 */
export function ejeDeBloque(decls: Map<string, string>): string | null {
  const display = decls.get("display") ?? "";
  if (display.includes("grid")) return "align-content";
  if (display.includes("flex")) {
    return decls.get("flex-direction")?.startsWith("column")
      ? "justify-content"
      : null;
  }
  return null;
}

/** Si reparte el sobrante entre las filas en vez de dejarlas juntas. */
export function reparte(decls: Map<string, string>): boolean {
  const eje = ejeDeBloque(decls);
  if (!eje) return false;
  const valor = decls.get(eje);
  return valor !== undefined && REPARTEN.some((v) => valor.includes(v));
}

const HOJAS = hojasDeEstilo(SRC);
const TODAS = HOJAS.map((ruta) => ({
  ruta: relative(RAIZ, ruta),
  reglas: declaracionesPorSelector(readFileSync(ruta, "utf8")),
}));

describe("una caja que crece no reparte sus filas", () => {
  it(`parsea al menos ${MINIMO_REGLAS} reglas (si no, el parser está roto)`, () => {
    const total = TODAS.reduce((suma, h) => suma + h.reglas.size, 0);
    expect(HOJAS.length).toBeGreaterThan(0);
    expect(total).toBeGreaterThanOrEqual(MINIMO_REGLAS);
  });

  it("el caso ancla sigue siendo sujeto: .panelGrid crece y declara gap", () => {
    const hoja = TODAS.find((h) => h.ruta.endsWith("sitio.module.css"));
    expect(hoja, "no encontré src/app/(sitio)/sitio.module.css").toBeDefined();
    const decls = hoja!.reglas.get(".panelGrid");
    expect(decls, "no encontré la regla .panelGrid").toBeDefined();
    // Las dos mitades del defecto, que viven en bloques distintos del archivo:
    // si el parser dejara de mezclarlas, este test cae y avisa por qué.
    expect(crece(decls!), ".panelGrid dejó de crecer").toBe(true);
    expect(declaraGap(decls!), ".panelGrid dejó de declarar gap").toBe(true);
  });

  it("ninguna caja que crece con gap propio reparte sus filas", () => {
    const culpables: string[] = [];
    for (const hoja of TODAS) {
      for (const [selector, decls] of hoja.reglas) {
        if (crece(decls) && declaraGap(decls) && reparte(decls)) {
          const eje = ejeDeBloque(decls)!;
          culpables.push(
            `${hoja.ruta} · ${selector} — crece (${decls.get("flex") ?? decls.get("flex-grow")}), ` +
              `declara gap (${decls.get("gap") ?? decls.get("row-gap")}) ` +
              `y reparte (${eje}: ${decls.get(eje)}): ` +
              `con alto de sobra la separación real deja de ser la declarada`,
          );
        }
      }
    }
    expect(culpables, culpables.join("\n")).toEqual([]);
  });
});
