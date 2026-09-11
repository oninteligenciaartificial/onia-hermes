import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { RUBROS_EN_PROSA, RUBROS_VIVOS } from "@/content/rubros";
import { rubrosDelSitio, SWITCHER } from "../../scripts/rubros-vivos.mjs";

/**
 * Una enumeración de rubros que AFIRMA COBERTURA los nombra a TODOS.
 *
 * **El defecto, medido el 2026-09-11 en la portada.** El encabezado de la
 * sección de módulos decía *"Módulos para clínicas, comercios, importadoras y
 * profesionales."* — **cuatro** — mientras la banda "Andando hoy" de dos
 * centímetros más abajo encendía **cinco** chips. El que faltaba era Estética,
 * un rubro que el alta entrega hoy: el dueño de un centro de estética leía el
 * título de la sección que existe para venderle los módulos y concluía que Onia
 * no era para él. Y no es un caso suelto — las otras CUATRO superficies del
 * sitio que enumeran rubros (la FAQ, los dos textos de `how-it-works` y
 * `/nosotros`) decían "cinco" y los nombraban a los cinco.
 *
 * **Por qué ningún instrumento del carril lo veía.** Es la parte que lo vuelve
 * una clase, y no un typo:
 *
 * 1. **No sobra una palabra: FALTA.** Todos los barridos de este carril
 *    persiguen lo que la venta dice de MÁS (obra, autobombo, una capacidad que
 *    no tenemos, un precio fuera de fuente). Son listas de INCLUSIÓN de
 *    literales prohibidos y una omisión les sale gratis.
 * 2. **El gate del tema existía y daba VERDE con razón.**
 *    `scripts/rubros-vivos.mjs` cruza los rubros que el sitio vende contra los
 *    que el alta entrega, en las dos direcciones, y su cabecera documenta los
 *    dos incidentes que lo motivaron. Su sujeto es la LISTA declarada — el
 *    conmutador de la portada — y el defecto vivía en la PROSA que enumera el
 *    mismo hecho. **Un hecho con dos representaciones y sólo una con dueño.**
 * 3. **Las hermanas sanas lo tapaban.** Abrir la FAQ o `/nosotros` y leer
 *    "cinco rubros: clínicas dentales, comercios, importadoras, estéticas y
 *    servicios profesionales" hace dar la familia por cubierta.
 *
 * **Qué vigila este archivo, y por qué son dos casos y no uno.** La reparación
 * fue derivar el título de `RUBROS_VIVOS`, y eso por sí solo apaga a cualquier
 * gate que persiga el literal: el texto pasa a ser una interpolación y sale del
 * universo del barrido justo cuando se lo arregla. Por eso se mide:
 *
 * - **el VALOR** que publica `@/content/rubros` (cubre el título derivado y
 *   cualquier otro que lo use), y
 * - **la PROSA** de todo `src/`, derivada del disco (cubre las otras cuatro
 *   superficies y las que se escriban mañana).
 *
 * ⚠️ **Lo que este gate NO prohíbe, a propósito.** Una lista ABIERTA no afirma
 * cobertura y es legítima: el `title` de `/rubros` dice *"dental, comercio,
 * importadora **y más**"* y su `description` usa tres rubros como EJEMPLOS de
 * vocabulario ("pacientes y odontograma en dental, productos y fiados en
 * comercio"). Ninguna de las dos promete que esos sean todos. La firma que se
 * persigue es la enumeración que CIERRA con «y/o <rubro>» sin marca de
 * apertura: ésa sí le dice al lector "estos son todos".
 */

const APP = new URL("../..", import.meta.url).pathname;
const SRC = join(APP, "src");

/**
 * El universo NO se enumera acá: sale del conmutador de la portada, que es la
 * misma autoridad que usa `scripts/rubros-vivos.mjs`. Un rubro nuevo aparece
 * solo, y si nadie le escribió su forma de nombrarlo el gate se pone rojo
 * (abajo) en vez de dejar de mirarlo en silencio.
 */
const IDS_DEL_SITIO: string[] = rubrosDelSitio(readFileSync(SWITCHER, "utf8"));

/**
 * Cómo se nombra cada rubro en una frase. La clave es el id del conmutador.
 *
 * ⚠️ El plural de «dental» es `dental(es)?` y NO `dentales?`: lo segundo pide
 * "dentale" y no matchea "dental", que es como lo escriben las tres superficies
 * más importantes. La primera medición de este gate salió con esa forma y
 * acusó a `how-it-works` (dos veces) y a `/prueba-gratis` de dejar afuera un
 * rubro que nombran perfecto — el falso positivo va en la dirección cara, la
 * que manda a "arreglar" copy sano. Lo ancla el caso «reconoce el rubro
 * escrito en singular».
 */
const COMO_SE_NOMBRA: Record<string, RegExp> = {
  dental: /\bcl[ií]nicas?\s+dental(es)?\b|\bdental(es)?\b|\bodontol[oó]gicas?\b/i,
  comercio: /\bcomercios?\b|\btiendas?\b/i,
  importadora: /\bimportadoras?\b|\bdistribuidoras?\b/i,
  estetica: /\best[eé]ticas?\b|\bspas?\b/i,
  servicios: /\bservicios\s+profesionales\b|\bprofesionales\b/i,
};

/** Deja el fragmento abierto: no promete que los enumerados sean todos. */
const ABIERTA = /\by\s+m[aá]s\b|\bentre\s+otros\b|[yu]\s+otros?\b|\betc\b|\.\.\.|…/i;

/**
 * ACOTA una capacidad a unos rubros en vez de afirmar a quién le sirve Onia.
 *
 * `ALCANCE_CLINICO = "solo en clínicas dentales y estética"` (`lib/pricing.ts`)
 * es correcto y tiene que seguir siéndolo: dice dónde existe la ficha clínica,
 * no qué rubros vende Onia. Sin esta exención el gate manda a romperlo.
 */
const ACOTA_UNA_CAPACIDAD = /\bs[oó]lo\b|\b[uú]nicamente\b|\bsalvo\b|\bexcepto\b|\bno est[aá]\b/i;

/**
 * Cuántos rubros hacen falta para leer una frase como afirmación de cobertura.
 *
 * Con DOS casi siempre se está acotando una capacidad, no enumerando el
 * mercado. El defecto que motivó este gate nombraba cuatro y las superficies
 * sanas nombran cinco, así que tres es un piso que caza lo que importa sin
 * acusar a la acotación de una feature.
 */
const MINIMO_PARA_SER_COBERTURA = 3;

/** El cierre que convierte una lista en una AFIRMACIÓN de cobertura. */
const CIERRE = new RegExp(
  `[,\\s](?:y|o)\\s+(?:${Object.values(COMO_SE_NOMBRA)
    .map((re) => re.source)
    .join("|")})`,
  "i",
);

/**
 * Comentarios e interpolaciones fuera, reemplazados por espacios para no mover
 * ni una posición: la línea que se reporta tiene que ser la de verdad.
 *
 * Los comentarios se quitan por ESTADO y no por prefijo de línea — el interior
 * de un bloque `/* ... *\/` o `{/* ... *\/}` arranca con texto normal, así que
 * un filtro por prefijo acusa a la bitácora que explica el propio defecto y
 * obliga a borrarla. Las interpolaciones se van porque `${X}` no es copy.
 */
export function soloCopy(src: string): string {
  const huecos = [
    /\/\*[\s\S]*?\*\//g, // bloque, incluido {/* ... */}
    /\/\/[^\n]*/g, // línea
    /\$\{[^}]*\}/g, // interpolación
  ];
  let out = src;
  for (const re of huecos) {
    out = out.replace(re, (m) => m.replace(/[^\n]/g, " "));
  }
  return out;
}

/** Los .ts/.tsx de la superficie de venta, del disco. Nada enumerado. */
function fuentes(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...fuentes(full));
    else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Las FRASES de un fuente: lo que alguien lee, no lo que el archivo contiene.
 *
 * El sujeto de un gate de copy tiene que ser copy. Midiendo el archivo entero,
 * la primera versión acusó a un diccionario de traducción de ids
 * (`{ dental: "clínica dental", comercio: "comercio", … }`, `v1/empezar/data.ts`)
 * de "dejar un rubro afuera": las comas eran del objeto y el «y» que lo cerraba
 * venía de un valor suelto ("estética y spa"). Un mapa de código no le promete
 * cobertura a nadie.
 *
 * Se toman los literales de cadena y el texto JSX, y dentro de cada uno se corta
 * por oración: una enumeración que deja un rubro afuera no se salva porque el
 * mismo párrafo lo nombre tres oraciones después.
 */
export function frases(copy: string): { texto: string; inicio: number }[] {
  const out: { texto: string; inicio: number }[] = [];
  // El nodo JSX cierra en `<` o en `{`: `/nosotros` enumera los cinco rubros y
  // remata con `— y{" "}`, así que exigir `<` lo dejaba fuera del barrido.
  const candidatos = /"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`|>([^<>{}]{10,})[<{]/g;

  for (const m of copy.matchAll(candidatos)) {
    const bruto = m[1] ?? m[2] ?? m[3] ?? m[4];
    if (!bruto) continue;
    const base = m.index! + m[0].indexOf(bruto);
    let desde = 0;
    for (const corte of [...bruto.matchAll(/[.!?]/g), { index: bruto.length }]) {
      const texto = bruto.slice(desde, corte.index as number);
      if (texto.trim()) out.push({ texto, inicio: base + desde });
      desde = (corte.index as number) + 1;
    }
  }
  return out;
}

export interface Enumeracion {
  archivo: string;
  linea: number;
  frase: string;
  nombrados: string[];
  faltan: string[];
}

/**
 * Las enumeraciones CERRADAS de rubros de un fuente, con las que quedan cortas.
 *
 * Se parte en fragmentos porque el sujeto es la FRASE, no el archivo: una
 * enumeración que nombra tres rubros no se salva porque el archivo mencione los
 * otros dos noventa líneas más abajo. Es la misma lección que la ventana de
 * `promesa-fiscal.test.ts` — una persona lee un párrafo, no un archivo.
 */
export function enumeracionesCortas(src: string, archivo = "", universo = IDS_DEL_SITIO) {
  const copy = soloCopy(src);
  const cortas: Enumeracion[] = [];
  let cerradas = 0;

  for (const { texto, inicio } of frases(copy)) {
    const fragmento = texto;

    const nombrados = universo.filter((id) => COMO_SE_NOMBRA[id]?.test(fragmento));
    if (nombrados.length < MINIMO_PARA_SER_COBERTURA) continue;
    if (ABIERTA.test(fragmento) || ACOTA_UNA_CAPACIDAD.test(fragmento)) continue;
    if (!CIERRE.test(fragmento)) continue;

    cerradas++;
    const faltan = universo.filter((id) => !nombrados.includes(id));
    if (faltan.length === 0) continue;
    cortas.push({
      archivo,
      linea: copy.slice(0, inicio).split("\n").length,
      frase: fragmento.trim().replace(/\s+/g, " ").slice(-160),
      nombrados,
      faltan,
    });
  }
  return { cortas, cerradas };
}

describe("una enumeración de rubros que afirma cobertura los nombra a todos", () => {
  it("el conmutador se pudo leer — sin universo no hay veredicto, y el verde sería falso", () => {
    expect(IDS_DEL_SITIO.length).toBeGreaterThanOrEqual(5);
  });

  it("cada rubro del conmutador tiene su forma de nombrarlo — uno nuevo no se mira en silencio", () => {
    const sinPatron = IDS_DEL_SITIO.filter((id) => !COMO_SE_NOMBRA[id]);
    expect(
      sinPatron,
      `el conmutador publica ${sinPatron.join(", ")} y este gate no sabe reconocerlo en una ` +
        `frase, así que dejaría de vigilarlo sin ponerse rojo. Agregalo a COMO_SE_NOMBRA.`,
    ).toEqual([]);
  });

  it("el VALOR derivado nombra a los cinco — es el que publica el título de la portada", () => {
    const faltan = IDS_DEL_SITIO.filter((id) => !COMO_SE_NOMBRA[id].test(RUBROS_EN_PROSA));
    expect(
      faltan,
      `RUBROS_EN_PROSA ("${RUBROS_EN_PROSA}") no nombra ${faltan.join(", ")}, y es lo que lee ` +
        `el encabezado de la sección de módulos de la portada.`,
    ).toEqual([]);
    expect(RUBROS_VIVOS.length).toBe(IDS_DEL_SITIO.length);
  });

  it("ningún rubro se queda sin su plural: el título se arma con ellos", () => {
    expect(RUBROS_VIVOS.filter((r) => !r.plural.trim())).toEqual([]);
  });

  it("reconoce el rubro escrito en singular — «Dental» es como lo escribe la portada", () => {
    // Ancla del falso positivo que tuvo la primera medición: `dentales?` pide
    // "dentale" y dejaba fuera "Dental", así que el gate acusaba a tres
    // archivos sanos de omitir el rubro que nombran.
    const fuente = '<p>Dental, comercio, importadora, estética o servicios profesionales.</p>';
    expect(enumeracionesCortas(fuente).cortas).toEqual([]);
    expect(enumeracionesCortas(fuente).cerradas).toBe(1);
  });

  it("caza la enumeración corta: el defecto exacto de la portada del 2026-09-11", () => {
    const { cortas } = enumeracionesCortas(
      'text="Módulos para clínicas dentales, comercios, importadoras y servicios profesionales."',
    );
    expect(cortas).toHaveLength(1);
    expect(cortas[0].faltan).toEqual(["estetica"]);
  });

  it("una lista ABIERTA o que ACOTA una capacidad no afirma cobertura y no se toca", () => {
    // `/rubros` deja la lista abierta a propósito, y `ALCANCE_CLINICO` dice
    // dónde existe la ficha clínica, no a qué rubros le sirve Onia.
    expect(
      enumeracionesCortas('title="Un sistema por rubro — dental, comercio, importadora y más"')
        .cortas,
    ).toEqual([]);
    expect(
      enumeracionesCortas('const ALCANCE = "solo en clínicas dentales, comercios y estética";')
        .cortas,
    ).toEqual([]);
  });

  it("un mapa de código no le promete cobertura a nadie: el sujeto es COPY, no el archivo", () => {
    // El falso positivo de la segunda medición: las comas eran del objeto y el
    // «y» que lo cerraba venía de un valor suelto ("estética y spa").
    const mapa =
      'const R = { dental: "clínica dental", comercio: "comercio", ' +
      'proveedores: "importadora", estetica: "estética y spa" };';
    expect(enumeracionesCortas(mapa).cortas).toEqual([]);
  });

  it("ninguna frase del sitio enumera rubros y deja uno afuera", () => {
    const cortas: Enumeracion[] = [];
    let cerradas = 0;
    for (const archivo of fuentes(SRC)) {
      const r = enumeracionesCortas(readFileSync(archivo, "utf8"), archivo.slice(APP.length));
      cortas.push(...r.cortas);
      cerradas += r.cerradas;
    }

    // Fail-closed: si el barrido deja de encontrar sujetos, "ninguna queda
    // corta" se leería como sitio sano. Ya pasó dos veces en este carril (el
    // gate que sacaba sus sujetos del sitemap; el de las cuatro raíces a mano).
    expect(
      cerradas,
      "el barrido no encontró NI UNA enumeración cerrada de rubros en todo el sitio: " +
        "eso no es un sitio sano, es un instrumento que dejó de medir.",
    ).toBeGreaterThanOrEqual(3);

    expect(
      cortas.map((c) => `${c.archivo}:${c.linea} — falta ${c.faltan.join(", ")} · «…${c.frase}»`),
      "una enumeración cerrada afirma que esos son TODOS los rubros; si el alta entrega uno más, " +
        "su dueño lee que Onia no es para él. O se nombran todos, o la lista se deja abierta.",
    ).toEqual([]);
  });
});
