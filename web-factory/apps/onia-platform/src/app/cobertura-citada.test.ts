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
 * que este carril ya pagó tres veces. Y los `.test.ts` quedan fuera del
 * barrido de citas por el mismo motivo que ya obligó a separar pieza de prosa
 * en el barrido de palabras clave: una bitácora que narra este defecto tiene
 * que poder nombrar el archivo que no existe —este archivo lo hace— sin que el
 * gate obligue a borrar el registro de lo que pasó.
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
    else if (CODIGO.test(entrada.name) && !ES_TEST.test(entrada.name)) salida.push(ruta);
  }
  return salida;
}

/** Toda cita a un verificador de esta app, con el archivo que la escribe. */
function citas(): { archivo: string; script: string }[] {
  const salida: { archivo: string; script: string }[] = [];
  for (const archivo of archivosDe(SRC)) {
    const texto = readFileSync(archivo, "utf8");
    for (const [, nombre] of texto.matchAll(CITA)) {
      salida.push({ archivo: archivo.slice(APP.length + 1), script: `scripts/${nombre}.mjs` });
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

  it("todo verificador citado por el código existe en el árbol", () => {
    const muertas = CITAS.filter((c) => !existsSync(join(APP, c.script)));
    expect(
      muertas.map((c) => `${c.archivo} cita ${c.script}, que no existe`),
      "un comentario promete un cruce que nadie puede correr",
    ).toEqual([]);
  });

  /*
   * La prueba del instrumento, en las dos direcciones. Sin la mitad que exige
   * VERDE, un gate que marcara todo también pasaría estos casos —es el hueco
   * que ya dejó pasar un guardia roto en este mismo repo.
   */
  it("el gate distingue un verificador vivo de uno inventado", () => {
    const inventado = "scripts/" + "limites-vivos" + ".mjs";
    expect(existsSync(join(APP, inventado)), "el fixture dejó de ser un archivo inexistente").toBe(false);
    expect(existsSync(join(APP, "scripts/precios-fuente.mjs"))).toBe(true);
    expect([...`el número se cruza con ${inventado}`.matchAll(CITA)].length).toBe(1);
  });
});
