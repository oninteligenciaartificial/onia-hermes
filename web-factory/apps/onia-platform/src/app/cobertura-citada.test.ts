import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Ningún comentario del sitio afirma que un número está vigilado por un
 * verificador que NO EXISTE.
 *
 * **La clase, y por qué es peor que no decir nada.** Los cruces contra el
 * producto (`precios-fuente`, `rubros-vivos`, `busqueda-alta-viva`,
 * `deploy-vivo`) viven fuera de `npm test` a propósito: exigir el repo hermano
 * pondría rojo por AMBIENTE y trabaría el merge de los quince carriles. El
 * precio de esa decisión es que la única señal de que un dato está cruzado es
 * el COMENTARIO que lo dice. Un comentario que nombra un verificador
 * inexistente no es un error de tipeo: es una afirmación de cobertura falsa, y
 * detiene la auditoría en vez de dispararla. Quien lo lee tiene dos salidas y
 * las dos son malas — creerle sin correrlo (el dato queda sin cruzar y nadie
 * vuelve a mirarlo), o correrlo, recibir `MODULE_NOT_FOUND` y escribir un
 * SEGUNDO cruzador al lado del que ya existe, que es dos fuentes de verdad del
 * mismo tema, lo que `CLAUDE.md` prohíbe.
 *
 * **El caso vivo, medido el 2026-09-07.** `src/content/chatbot-precios.ts`
 * cerraba con «el número se cruza contra el producto con
 * `scripts/limites-vivos.mjs`». Ese archivo nunca se escribió:
 * `node scripts/limites-vivos.mjs` → `MODULE_NOT_FOUND`. El cruce SÍ existía,
 * con otro nombre —`scripts/precios-fuente.mjs`, que compara
 * `CONVERSACIONES_INCLUIDAS` contra `includedConversations` del producto y ese
 * día dio verde sobre 32 cifras—, así que el dato estaba sano y la única cosa
 * rota era la que decía cómo comprobarlo.
 *
 * **Por qué ningún gate podía verlo.** No sobra una palabra prohibida, no hay
 * precio fuera de fuente, no hay `href` que un checker de enlaces recorra
 * —y `tsc` no mira adentro de un comentario—. Es el eslabón que sigue a los ya
 * cubiertos: ahí el defecto estaba en lo que la pantalla DICE; acá está en lo
 * que el código AFIRMA SOBRE SÍ MISMO.
 *
 * **La dirección que cubre, y la que ya tiene dueño.** Acá va sólo
 * *citado → existe*. El simétrico —*existe → invocado*, el verificador que
 * está en el árbol y no lo corre nadie— ya lo vigila
 * `scripts/gates-cableados.test.ts` desde el 2026-09-06, y repetirlo sería dos
 * fuentes de verdad del mismo tema. Que las dos hagan falta es justamente el
 * punto: aquél parte del DISCO, así que un puntero a un archivo que nunca se
 * creó le es invisible — es una lista de inclusión que falla abierto, un
 * escalón más arriba, igual que `guards-cableados` lo es respecto de él.
 *
 * **Lo que NO mira, a propósito.** Sólo `scripts/*.mjs` de ESTA app, que es un
 * prefijo sin ambigüedad. Las rutas de otros repos y paquetes que los
 * comentarios citan para explicar de dónde salió algo
 * (`onia-platform/lib/pricing.ts`, `packages/blocks/src/…`) son PROSA: no se
 * resuelven desde acá y exigirlas pondría rojo por ambiente, el modo de fallo
 * que este carril ya pagó tres veces.
 *
 * **El `.test.ts` SÍ entra, y por qué hubo que cambiarlo.** Hasta el
 * 2026-09-12 este barrido dejaba afuera todo archivo de prueba, con el
 * argumento correcto de que una bitácora tiene que poder nombrar el archivo
 * que no existe —esta cabecera lo hace— sin que el gate obligue a borrar el
 * registro de lo que pasó. El costo se midió: el 2026-09-07 se corrigió el
 * puntero `limites-vivos` en `chatbot-precios.ts` y quedó idéntico y VIVO en
 * `(sitio)/limite-que-corta.test.ts`, invisible **cuatro días** por ser un
 * archivo de prueba. Exentar por TIPO DE ARCHIVO no separa lo que hay que
 * separar: un `.test.ts` narra el defecto en un párrafo y manda a trabajar en
 * el de al lado, y un mensaje de error de un test
 * (`promesa-de-privacidad.test.ts`: «Declarala en PROMESAS de
 * `scripts/privacidad-viva.mjs`») es tan directivo como cualquier comentario.
 * El corte va por CONTEXTO: la vecindad de cada aparición dice si la cita
 * NARRA un puntero muerto o AFIRMA un cruce vigente. Es el mismo criterio —y
 * las mismas marcas, medidas de casos reales— con el que `verificar_cola.js`
 * separó bitácora de afirmación en `npm run cola:viva` el 2026-09-11.
 *
 * **La ventana es el PÁRRAFO, y eso no es un detalle.** Con el archivo entero,
 * una cabecera que narra un puntero muerto absolvería una cita directiva
 * doscientas líneas más abajo: el gate se apagaría solo, en silencio, que es
 * como esta familia empieza a fallar ABIERTO. Con la oración sola, la primera
 * mitad de una bitácora partida en dos renglones («…cerraba con
 * `scripts/X.mjs`». «Ese archivo nunca se escribió») saldría acusada y
 * mandaría a borrar el registro. El párrafo es la unidad en la que un humano
 * escribe una y otra cosa.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = resolve(AQUI, "../..");
const SRC = join(APP, "src");

/*
 * `scripts/<algo>.mjs` DE ESTA APP. El corte del principio no es cosmético: el
 * repo raíz también tiene un `scripts/`, y una cita que nombra su raíz
 * (`onia-hermes/scripts/venta-honestidad.test.mjs`, que existe y corre en la
 * cadena `npm test` de allá) no se resuelve desde acá. Sin este corte el gate
 * la marcaría como muerta y mandaría a "arreglar" un puntero correcto —el
 * falso positivo caro, el que hace tocar lo que funciona—. Con él, la
 * exigencia es que una cita SIN raíz sea de acá, que es lo que cualquiera
 * entiende al leerla.
 */
const CITA = /(?<![\w/-])scripts\/([A-Za-z0-9_.-]+)\.mjs\b/g;

const CODIGO = /\.(ts|tsx)$/;
const ES_TEST = /\.test\.(ts|tsx)$/;

function archivosDe(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...archivosDe(ruta));
    else if (CODIGO.test(entrada.name)) salida.push(ruta);
  }
  return salida;
}

/*
 * Las marcas salen de los casos REALES medidos —el `MODULE_NOT_FOUND` del
 * 2026-09-07 y los cuatro fantasmas del 2026-09-11—, no de lo que a uno se le
 * ocurre que alguien podría escribir. Son las mismas que usa
 * `verificar_cola.js` en la raíz: el criterio es uno solo, escrito dos veces
 * porque esta app tiene su propia cadena de tests y exigir un módulo del repo
 * de arriba pondría rojo por AMBIENTE.
 */
const MARCAS_DE_BITACORA = [
  /nunca (?:se |lo )?(?:escribi|cre|existi)/i,
  /\bno existe\b/i,
  /\bya no existe\b/i,
  /\binexistente\b/i,
  /No such file/i,
  /MODULE_NOT_FOUND/,
  /puntero muerto/i,
  /corrigi[oó] el puntero/i,
];

/**
 * Los párrafos del archivo, con el prefijo de comentario quitado. Un JSDoc
 * separa párrafos con una línea de ` *` sola: sin normalizar, esa línea no
 * está vacía y el archivo entero sería UN párrafo.
 */
export function parrafosDe(texto: string): string[] {
  const lineas = texto
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\*+|\*\/|\*|\/\/)\s?/, "").replace(/\s*\*\/\s*$/, "").trim());
  const salida: string[] = [];
  let actual: string[] = [];
  for (const linea of lineas) {
    if (linea === "") {
      if (actual.length) salida.push(actual.join("\n"));
      actual = [];
    } else actual.push(linea);
  }
  if (actual.length) salida.push(actual.join("\n"));
  return salida;
}

/**
 * ¿Este párrafo NARRA que la ruta no existe, en vez de mandar a usarla?
 *
 * La ventana de la marca es la ORACIÓN de cada aparición, no el párrafo: si
 * bastara con que la marca esté en el párrafo, una línea que cuenta un
 * puntero muerto absolvería a la cita viva del renglón siguiente. Alcanza con
 * que UNA aparición de ESA ruta esté declarada inexistente — una cita cuyo
 * propio párrafo dice que el archivo no existe no manda a nadie a trabajar
 * ahí, es el OBJETO de lo que se narra.
 */
export function narradaComoInexistente(parrafo: string, ruta: string): boolean {
  let desde = 0;
  for (;;) {
    const i = parrafo.indexOf(ruta, desde);
    if (i === -1) return false;
    desde = i + ruta.length;
    // El punto de una extensión no corta la oración porque se exige el espacio
    // (o el salto) detrás.
    const izq = Math.max(parrafo.lastIndexOf(". ", i), parrafo.lastIndexOf(".\n", i));
    const der = [parrafo.indexOf(". ", desde), parrafo.indexOf(".\n", desde)].filter((n) => n !== -1);
    const oracion = parrafo.slice(izq === -1 ? 0 : izq + 1, der.length ? Math.min(...der) : parrafo.length);
    if (MARCAS_DE_BITACORA.some((re) => re.test(oracion))) return true;
  }
}

/**
 * `scripts/X.mjs` no es una ruta: es un MOLDE, la forma de nombrar «un script
 * cualquiera» cuando se explica la regla en vez de citar un archivo. Exigirlo
 * manda a crear un archivo llamado `X`. Mismo criterio que la raíz.
 */
const ES_MOLDE = /^[A-Z]$/;

type Cita = { archivo: string; script: string; narrada: boolean };

/** Toda cita a un verificador de esta app, con el archivo que la escribe. */
function citas(): Cita[] {
  const salida: Cita[] = [];
  for (const archivo of archivosDe(SRC)) {
    for (const parrafo of parrafosDe(readFileSync(archivo, "utf8"))) {
      for (const [, nombre] of parrafo.matchAll(CITA)) {
        if (ES_MOLDE.test(nombre)) continue;
        const script = `scripts/${nombre}.mjs`;
        salida.push({
          archivo: archivo.slice(APP.length + 1),
          script,
          narrada: narradaComoInexistente(parrafo, script),
        });
      }
    }
  }
  return salida;
}

const CITAS = citas();

describe("un comentario no puede afirmar que algo está vigilado por un verificador que no existe", () => {
  /*
   * El ancla. Sin esto el gate falla ABIERTO en su forma más tonta: si el
   * recorrido se rompe —una extensión nueva, un `readdir` que tira— no hay
   * citas, nada difiere y todo queda verde sobre un sitio sin vigilancia. Se
   * ancla en una cita REAL y viva, no en una inventada.
   */
  it("el barrido encuentra las citas vivas del código", () => {
    expect(CITAS.length, "el recorrido de src/ no encontró UNA sola cita: mide en falso").toBeGreaterThan(0);
    expect(
      CITAS.some((c) => c.script === "scripts/precios-fuente.mjs"),
      "no se ve la cita viva a scripts/precios-fuente.mjs: el barrido no llega a src/content",
    ).toBe(true);
  });

  it("el barrido alcanza también los .test.ts", () => {
    expect(
      archivosDe(SRC).some((a) => ES_TEST.test(a)),
      "los .test.ts quedaron fuera del universo: una afirmación de cobertura viva escrita ahí es invisible",
    ).toBe(true);
  });

  it("todo verificador citado por el código existe en el árbol", () => {
    const muertas = CITAS.filter((c) => !c.narrada && !existsSync(join(APP, c.script)));
    const narradas = CITAS.filter((c) => c.narrada && !existsSync(join(APP, c.script)));
    // El canal de AVISO: una bitácora no cuenta para el rojo, pero se imprime.
    // Callarla dejaría al gate indistinguible de uno que no mira nada.
    for (const c of narradas) {
      console.log(`AVISO  ${c.archivo} nombra ${c.script}, que no existe — su párrafo lo declara así: es bitácora`);
    }
    expect(
      muertas.map((c) => `${c.archivo} cita ${c.script}, que no existe`),
      "un comentario promete un cruce que nadie puede correr",
    ).toEqual([]);
  });

  /*
   * La prueba del instrumento, en las dos direcciones. Sin la mitad que exige
   * VERDE, un gate que marcara todo también pasaría estos casos —es el hueco
   * que ya dejó pasar un guardia roto en este mismo repo.
   *
   * Los fixtures arman la ruta PARTIDA a propósito: este archivo ahora está
   * dentro de su propio universo, y una ruta entera escrita acá se acusaría a
   * sí misma.
   */
  const FANTASMA = "scripts/" + "limites-vivos" + ".mjs";
  const VIVO = "scripts/" + "precios-fuente" + ".mjs";

  it("el gate distingue un verificador vivo de uno inventado", () => {
    expect(existsSync(join(APP, FANTASMA)), "el fixture dejó de ser un archivo inexistente").toBe(false);
    expect(existsSync(join(APP, VIVO))).toBe(true);
    expect([...`el número se cruza con ${FANTASMA}`.matchAll(CITA)].length).toBe(1);
  });

  it("una metavariable no es una ruta que haya que crear", () => {
    expect(ES_MOLDE.test("X"), "scripts/X.mjs es el molde con el que se explica la regla").toBe(true);
    expect(ES_MOLDE.test("precios-fuente"), "un nombre real quedó exento como si fuera un molde").toBe(false);
    expect(CITAS.some((c) => c.script === "scripts/X.mjs"), "el molde entró como cita").toBe(false);
  });

  it("una bitácora que narra el puntero muerto NO se acusa", () => {
    const bitacora = [
      `cerraba con «el número se cruza contra el producto con`,
      `${FANTASMA}». Ese archivo nunca se escribió:`,
      `\`node ${FANTASMA}\` → \`MODULE_NOT_FOUND\`. El cruce SÍ existía con otro`,
      `nombre —${VIVO}—, así que el dato estaba sano.`,
    ].join("\n");
    const parrafos = parrafosDe(bitacora);
    expect(parrafos.length, "la bitácora tiene que quedar en UN párrafo").toBe(1);
    expect(narradaComoInexistente(parrafos[0], FANTASMA), "narrar el puntero muerto obligaría a borrar el registro").toBe(true);
    // …y no se derrama al vecino: el cruce vigente del mismo párrafo se sigue exigiendo.
    expect(narradaComoInexistente(parrafos[0], VIVO), "la marca de un fantasma absolvió a la cita viva de al lado").toBe(false);
  });

  it("una afirmación de cobertura VIVA se exige aunque viva en un .test.ts", () => {
    const directiva = `El cruce del número contra el producto va como script aparte: ${FANTASMA}.`;
    const parrafos = parrafosDe(` * ${directiva}`);
    expect([...parrafos[0].matchAll(CITA)].length, "el barrido no ve la cita al quitar el prefijo del comentario").toBe(1);
    expect(narradaComoInexistente(parrafos[0], FANTASMA), "una cita directiva se leyó como bitácora").toBe(false);
  });

  it("la bitácora de un párrafo no absuelve al párrafo de al lado", () => {
    const texto = [
      ` * ${FANTASMA} nunca se escribió.`,
      ` *`,
      ` * El número se cruza con ${FANTASMA}, correlo antes de tocar el precio.`,
    ].join("\n");
    const parrafos = parrafosDe(texto);
    expect(parrafos.length, "la línea ' *' sola tiene que cortar el párrafo").toBe(2);
    expect(narradaComoInexistente(parrafos[0], FANTASMA)).toBe(true);
    expect(
      narradaComoInexistente(parrafos[1], FANTASMA),
      "la ventana se pasó del párrafo: una bitácora absolvió una cita directiva",
    ).toBe(false);
  });
});
