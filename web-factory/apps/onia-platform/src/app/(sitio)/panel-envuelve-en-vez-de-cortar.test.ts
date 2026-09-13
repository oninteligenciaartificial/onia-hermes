import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * En los paneles del sitio de venta el texto ENVUELVE; nunca se corta con «…».
 *
 * POR QUÉ EXISTE ESTE GATE. La cura ya se escribió DOS VECES para la misma familia de
 * textos y las dos veces cerró sólo el ancho que alguien había mirado:
 *
 *  1. La primera nació dentro de `@media (max-width: 767px)`. Cerró 320 y 390 —los
 *     teléfonos que se miraron— y dejó la clase abierta justo en escritorio.
 *  2. El 2026-09-13, medido EN PRODUCCIÓN con `scrollWidth > clientWidth`, se cortaban
 *     SEIS textos a 768px y CINCO a 1440 y 1920 en la banda «Tres cosas que vas a usar
 *     todos los días» de la home: el título del panel del chatbot salía «WhatsA…»
 *     (perdía 91px de 20 caracteres) y las filas de agentes quedaban en «Recordar
 *     citas …», «Avisar los pago…», «Invitar a quien …». El lead que entra desde una
 *     computadora leía la tarjeta que explica QUÉ HACE el sistema con el nombre de la
 *     capacidad borrado. Se arregló sacando la regla del `@media` (`7878342f`).
 *
 * Lo que queda abierto después de ese arreglo es la CLASE, no la instancia: nada impide
 * que la regla de «envolver en vez de cortar» vuelva a meterse dentro de un `@media`,
 * que es exactamente como nació el defecto. El gate que lo veía (`scripts/mirar-venta.mjs`)
 * mide el síntoma con un navegador, se corre a mano y no está en `prebuild`, así que una
 * regresión puede vivir días. Éste mide la CAUSA y corre en `npm test`.
 *
 * CÓMO NO FALLA EN VERDE. Los sujetos se derivan del DISCO —toda regla de cualquier CSS
 * de `src/` que declare `text-overflow: ellipsis`, que es la forma en que una clase
 * declara «voy a cortar este texto»—, nunca de una lista de nombres escrita a mano: una
 * lista así falla abierto el día que aparece el panel siguiente. Y si el parser se rompe
 * y deja de encontrar reglas, el test se pone ROJO por `MINIMO_SUJETOS` y por el caso
 * ancla, en vez de aprobar la nada.
 *
 * ⚠️ `.panelBarLbl` NO es sujeto de este gate, aunque esté en el bloque de la cura junto
 * a las otras tres. Se verificó en el CSS: no declara `text-overflow`, no declara
 * `overflow: hidden` y ningún ancestro suyo declara `white-space: nowrap` (que es una
 * propiedad heredada), así que ya envuelve por defecto y su `white-space: normal` es un
 * cinturón, no un arreglo. Meterlo igual exigiría nombrarlo a mano — la lista de
 * inclusión que este gate existe para no tener. Si algún día gana un `nowrap`, entra
 * solo por la aserción simétrica de abajo.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..", "..");

/** `white-space: nowrap` + `overflow: hidden` + esto = el texto sale cortado con «…». */
const RE_CORTA = /text-overflow:\s*ellipsis/;
/** La cura: el texto pasa a ocupar dos líneas en vez de perder el final. */
const RE_ENVUELVE = /white-space:\s*normal/;
/** Lo que vuelve a cortar: una sola línea, y lo que no entra se pierde. */
const RE_UNA_SOLA_LINEA = /white-space:\s*nowrap/;

/**
 * Las tres que se midieron cortadas en producción el 2026-09-13. El caso ancla exige que
 * el barrido las ENCUENTRE: es lo único que distingue «no hay defectos» de «el parser
 * quedó ciego y no vio ni al sujeto conocido».
 */
const CLASES_MEDIDAS_CORTADAS = ["panelTitle", "panelTxt", "panelPillTxt"] as const;

/**
 * Se midieron 3 el 2026-09-13. Si mañana se encuentran menos, lo que se rompió es el
 * parser —no el sitio— y hay que arreglar el parser, NO bajar este número.
 */
const MINIMO_SUJETOS = 3;

interface Regla {
  archivo: string;
  linea: number;
  selector: string;
  /** La última clase del selector: la que la regla realmente estiliza. */
  clase: string;
  cuerpo: string;
  /** `@media (...)` que la envuelve, o `null` si vive al nivel superior del archivo. */
  envoltorio: string | null;
  /** Posición de apertura: con igual especificidad, la cascada la decide el orden. */
  orden: number;
}

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

/**
 * Los comentarios se BLANQUEAN conservando los saltos de línea, no se borran: si se
 * borraran, los números de línea del informe apuntarían a otro lado. Y blanquear no es
 * cosmético — el comentario que explica esta misma cura contiene el texto
 * `@media (max-width: 767px)`, así que un parser que lea el archivo crudo se inventa un
 * envoltorio que no existe y absuelve a la regla que está afuera.
 */
function sinComentarios(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

function reglasDe(css: string, archivo: string): Regla[] {
  const out: Regla[] = [];
  const pila: string[] = [];
  let prelude = "";
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === ";") {
      // `@import ...;` y demás sentencias sin bloque: no arrastran al selector siguiente.
      prelude = "";
      i += 1;
      continue;
    }
    if (ch === "}") {
      pila.pop();
      prelude = "";
      i += 1;
      continue;
    }
    if (ch !== "{") {
      prelude += ch;
      i += 1;
      continue;
    }
    const cabeza = prelude.trim();
    prelude = "";
    if (cabeza.startsWith("@")) {
      pila.push(cabeza.replace(/\s+/g, " "));
      i += 1;
      continue;
    }
    const cierre = css.indexOf("}", i);
    const fin = cierre < 0 ? css.length : cierre;
    const cuerpo = css.slice(i + 1, fin);
    const linea = css.slice(0, i).split("\n").length;
    const envoltorio = pila.length > 0 ? pila[pila.length - 1] : null;
    for (const parte of cabeza.split(",")) {
      const selector = parte.trim().replace(/\s+/g, " ");
      if (selector === "") continue;
      const clases = [...selector.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
      if (clases.length === 0) continue;
      out.push({
        archivo,
        linea,
        selector,
        clase: clases[clases.length - 1],
        cuerpo,
        envoltorio,
        orden: i,
      });
    }
    i = fin + 1;
  }
  return out;
}

function todasLasReglas(): Regla[] {
  const out: Regla[] = [];
  for (const ruta of archivosCss(SRC)) {
    const archivo = relative(SRC, ruta).split("\\").join("/");
    out.push(...reglasDe(sinComentarios(readFileSync(ruta, "utf8")), archivo));
  }
  return out;
}

describe("el texto de los paneles envuelve en vez de cortarse, en TODO ancho", () => {
  const reglas = todasLasReglas();
  const cortadoras = reglas.filter((r) => RE_CORTA.test(r.cuerpo));

  /**
   * El caso propio de `sinComentarios()`. Va con fixture y no contra el CSS real porque
   * hoy el archivo lo pasa POR CASUALIDAD: su bitácora cita `@media (max-width: 767px)`
   * ANTES de citar una regla con llaves, así que el `@` nunca queda primero después de
   * un `}` y el parser no llega a apilar el envoltorio fantasma. Arrancar el blanqueo no
   * ponía nada en rojo — o sea que la guarda era decorativa y el gate iba a descubrirlo
   * el día que alguien reordenara un comentario. El fixture invierte ese orden, que es
   * la forma normal de una bitácora («antes esto vivía acá, y la cura estaba allá»).
   */
  it("un comentario que CITA una media query no envuelve a la regla que está afuera", () => {
    const fixture = [
      "/* bitácora: antes: .panelRows { flex: 1 1 auto }",
      "   @media (max-width: 767px) { y la cura vivía acá adentro */",
      ".panelTitle {",
      "  white-space: normal;",
      "}",
    ].join("\n");
    const hallada = reglasDe(sinComentarios(fixture), "fixture.css").find(
      (r) => r.clase === "panelTitle",
    );
    expect(
      hallada?.envoltorio,
      `El parser leyó el \`@media\` que vive DENTRO de un comentario y dio por envuelta a una ` +
        `regla que está afuera: con eso absuelve al defecto (la cura parece encerrada) o acusa ` +
        `a un archivo sano. Los comentarios se blanquean antes de parsear.`,
    ).toBeNull();
  });

  it(`descubre al menos ${MINIMO_SUJETOS} clases que cortan texto (si no, el parser quedó ciego)`, () => {
    expect(
      cortadoras.length,
      `Sólo se encontraron ${cortadoras.length} reglas con \`text-overflow: ellipsis\` en ` +
        `src/. Un gate que mira cero sujetos pasa en verde sobre cualquier cosa: revisar ` +
        `reglasDe()/sinComentarios() antes de tocar el CSS.`,
    ).toBeGreaterThanOrEqual(MINIMO_SUJETOS);
  });

  it("el barrido encuentra las tres clases que se midieron cortadas en producción", () => {
    const halladas = new Set(cortadoras.map((r) => r.clase));
    const perdidas = CLASES_MEDIDAS_CORTADAS.filter((c) => !halladas.has(c));
    expect(
      perdidas,
      `El barrido no ve estas clases, que el 2026-09-13 salían cortadas en onia.com.bo: ` +
        `${perdidas.map((c) => `.${c}`).join(", ")}. Si el CSS ya no las tiene, actualizar ` +
        `CLASES_MEDIDAS_CORTADAS con la medición nueva; si las tiene, el parser está ciego ` +
        `y este gate está aprobando la nada.`,
    ).toEqual([]);
  });

  it("la regla que las hace envolver vive FUERA de toda media query", () => {
    const sinCurar = cortadoras.filter((corta) => {
      const cura = reglas.find(
        (r) =>
          r.archivo === corta.archivo &&
          r.clase === corta.clase &&
          r.envoltorio === null &&
          r.orden > corta.orden &&
          RE_ENVUELVE.test(r.cuerpo),
      );
      return cura === undefined;
    });
    expect(
      sinCurar,
      `Estas clases cortan el texto con «…» y no tienen un \`white-space: normal\` al nivel ` +
        `superior del archivo DESPUÉS de la regla que las corta, así que el corte queda vivo ` +
        `en los anchos que la media query no cubre — que es exactamente cómo nació este ` +
        `defecto (cerrado a 320/390, vivo a 768/1440/1920):\n` +
        sinCurar.map((r) => `  · ${r.archivo}:${r.linea} ${r.selector}`).join("\n"),
    ).toEqual([]);
  });

  it("ninguna media query vuelve a imponer una sola línea sobre lo ya curado", () => {
    const curadas = new Set(
      reglas
        .filter((r) => r.envoltorio === null && RE_ENVUELVE.test(r.cuerpo))
        .map((r) => `${r.archivo} .${r.clase}`),
    );
    const recortan = reglas.filter(
      (r) =>
        r.envoltorio !== null &&
        RE_UNA_SOLA_LINEA.test(r.cuerpo) &&
        curadas.has(`${r.archivo} .${r.clase}`),
    );
    expect(
      recortan,
      `Estas media queries le devuelven \`white-space: nowrap\` a una clase que el archivo ya ` +
        `había hecho envolver: el texto vuelve a cortarse en ESE ancho, que es la misma falla ` +
        `de siempre entrando por la puerta de atrás:\n` +
        recortan.map((r) => `  · ${r.archivo}:${r.linea} ${r.envoltorio} → ${r.selector}`).join("\n"),
    ).toEqual([]);
  });
});
