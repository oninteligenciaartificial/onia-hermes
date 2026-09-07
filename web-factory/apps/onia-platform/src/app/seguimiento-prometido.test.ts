import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Una pantalla no promete un SEGUIMIENTO en el mismo momento en que el código
 * acaba de decidir tirar el dato con el que seguiría.
 *
 * **Lo que se escapaba, medido el 2026-09-06 en `/guia-facturacion`**, que es
 * el ÚNICO formulario de captura de todo `onia.com.bo` (barrido: un solo
 * `<form>` en `src/app/**`) y encima el de la página que capta la búsqueda del
 * plazo del SIN. A cambio del correo se le prometen DOS cosas —la hoja
 * imprimible y el aviso si el SIN mueve la fecha—, y la pantalla del final
 * decía las dos siempre:
 *
 *     <p className={g.listoNota}>
 *       Si el SIN vuelve a mover la fecha, te escribimos. Ya lo hizo dos veces.
 *     </p>
 *
 * La hoja SÍ se entrega siempre, y eso está bien: es suya, ya cumplió su parte.
 * El aviso no. Entre el submit y ese texto hay **tres capas que se tragan el
 * fallo**, y las tres terminan en la misma pantalla de éxito:
 *
 * 1. `api/agenda-intake` devuelve 204 si le faltan `ONIA_CENTER_INTAKE_URL` o
 *    `ONIA_CENTER_INTAKE_SECRET`. Es exactamente la firma que ya nos mordió con
 *    `SEARXNG_URL` en el alta: un módulo que lee `process.env.X` y **devuelve
 *    vacío en vez de tirar** cuando X falta. Hoy las dos están puestas en el
 *    contenedor (medido), pero una rotación de env las apaga sin que nada se
 *    ponga rojo.
 * 2. El mismo handler envuelve el `fetch` a Onia Center en `try/catch` y
 *    devuelve 204 igual si el destino no contesta.
 * 3. El cliente envuelve su `fetch` en `try/catch` y pasa a `listo` igual.
 *
 * O sea: el lead se pierde en silencio y la pantalla le dice que le vamos a
 * escribir. Es una promesa que no se puede cumplir, hecha justo al que más
 * confió — el que ya dejó el correo.
 *
 * **Por qué ningún instrumento del carril lo veía**, que es lo que lo hace una
 * clase y no un typo:
 *
 * - No sobra **ninguna palabra**: el texto es legítimo cuando el lead SÍ quedó
 *   registrado. Los barridos de obra y de autobombo son listas de inclusión de
 *   literales prohibidos y acá no hay literal prohibido, hay un CRUCE malo
 *   (estado del registro × texto). Mismo eje que `modulos-por-rubro`, pero
 *   sobre el **camino de fallo**, que es el que ningún gate del proyecto
 *   recorre: todos miran el camino feliz.
 * - `promesa-humana.test.ts` —el gate hermano, mío— **tampoco lo caza**: su
 *   patrón exige compromiso en 1ª persona del plural **+ un plazo** («en el
 *   día»). Acá no hay plazo, así que pasa. El patrón estaba bien y la forma
 *   real del defecto no era la que anticipé.
 * - No se ve mirando la pantalla: en producción el camino feliz anda (probado
 *   de punta a punta con un lead sellado, que aterrizó en `onia_center.leads`).
 *   La foto del defecto sólo existe cuando el pipeline está caído.
 *
 * **La invariante**: si una pantalla registra al lead en modo best-effort,
 * entonces cada promesa de seguimiento tiene que estar CONDICIONADA al
 * resultado del registro. No se borra la promesa —cuando el registro ocurre es
 * verdadera y hay que decirla—: se condiciona. Y la bandera se saca de la
 * respuesta, nunca se fija a mano.
 *
 * Sujetos derivados del DISCO, no de una lista escrita: un formulario de
 * captura nuevo nace cubierto y hay que exceptuarlo a mano, a la vista.
 */

const RAIZ = join(import.meta.dirname);

/** Verbo de comunicación en 1ª persona del plural dirigido al lead. */
const PROMESA_SEGUIMIENTO =
  /\bte\s+(escribimos|avisamos|mandamos|contactamos|escribiremos|avisaremos|mandaremos)\b/gi;

/** El registro es best-effort: el fallo se traga y la pantalla sigue. */
const REGISTRO_BEST_EFFORT = /fetch\(\s*["'`]\/api\/[^"'`]*intake[^"'`]*["'`]/;

function fuentesDe(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name === "node_modules" || entrada.name.startsWith(".")) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      salida.push(...fuentesDe(ruta));
      continue;
    }
    if (!/\.tsx?$/.test(entrada.name)) continue;
    if (/\.test\.tsx?$/.test(entrada.name)) continue;
    salida.push(ruta);
  }
  return salida;
}

/** Los comentarios explican el defecto: si no se quitan, el gate se muerde la cola. */
function sinComentarios(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const CAPTURAS = fuentesDe(RAIZ)
  .map((ruta) => ({ ruta, fuente: sinComentarios(readFileSync(ruta, "utf8")) }))
  .filter(({ fuente }) => REGISTRO_BEST_EFFORT.test(fuente));

/** El proxy que registra al lead: se busca por lo que LEE, no por su ruta. */
const ENDPOINTS = fuentesDe(RAIZ)
  .filter((ruta) => /route\.tsx?$/.test(ruta))
  .map((ruta) => ({ ruta, fuente: sinComentarios(readFileSync(ruta, "utf8")) }))
  .filter(({ fuente }) => /ONIA_CENTER_INTAKE_(URL|SECRET)/.test(fuente));

describe("una promesa de seguimiento se condiciona al registro del lead", () => {
  it("hay al menos un endpoint de registro que vigilar", () => {
    expect(ENDPOINTS.length).toBeGreaterThan(0);
  });

  it("hay al menos una pantalla de captura que vigilar", () => {
    // Ancla: si un refactor mueve el formulario y el barrido deja de verlo, el
    // gate se quedaría VERDE sin sujetos — el modo de falla de esta familia.
    expect(CAPTURAS.length).toBeGreaterThan(0);
  });

  // Sin esto el arreglo se revierte solo: si el endpoint vuelve a contestar
  // 204 siempre, la bandera del cliente da SIEMPRE true, la promesa vuelve a
  // ser incondicional y los casos de arriba siguen VERDES. El guardia del
  // cliente no puede ser más honesto que la respuesta que lee.
  it.each(ENDPOINTS.map(({ ruta, fuente }) => [ruta, fuente] as const))(
    "%s distingue al lead registrado del que se perdió",
    (_ruta, fuente) => {
      const estados = new Set(
        [...fuente.matchAll(/status:\s*(\d{3})/g)].map((m) => m[1]),
      );
      expect(
        estados.size,
        `contesta siempre ${[...estados].join("/")}: el cliente no puede saber si el lead quedó registrado`,
      ).toBeGreaterThan(1);

      // La rama sin configuración es la que ya nos mordió con SEARXNG_URL.
      const sinConfig = fuente.slice(
        0,
        fuente.search(/if\s*\(\s*!url\s*\|\|\s*!secret\s*\)[\s\S]*?\}/) +
          (fuente.match(/if\s*\(\s*!url\s*\|\|\s*!secret\s*\)[\s\S]*?\}/)?.[0]
            ?.length ?? 0),
      );
      expect(
        /204/.test(sinConfig.split(/if\s*\(\s*!url/)[1] ?? ""),
        "sin ONIA_CENTER_INTAKE_URL/SECRET contesta 204: le miente al cliente diciendo que registró",
      ).toBe(false);
    },
  );

  it.each(CAPTURAS.map(({ ruta, fuente }) => [ruta, fuente] as const))(
    "%s no promete el seguimiento sin saber si el lead quedó registrado",
    (_ruta, fuente) => {
      const promesas = fuente.match(PROMESA_SEGUIMIENTO) ?? [];
      if (promesas.length === 0) return;

      // 1. Existe una bandera con el resultado del registro.
      const bandera = fuente.match(
        /const\s+\[\s*(registrad[oa]|leadRegistrado)\s*,\s*set\w+\s*\]\s*=\s*useState/,
      );
      expect(
        bandera,
        `promete seguimiento (${promesas.join(", ")}) sin guardar si el registro ocurrió`,
      ).not.toBeNull();

      const nombre = bandera![1];

      // 2. La bandera sale de la RESPUESTA, no fijada a mano. Sin esto, el
      //    arreglo se "cumple" con setRegistrado(true) y no cambia nada.
      const fijadaAMano = new RegExp(
        `set${nombre[0].toUpperCase()}${nombre.slice(1)}\\(\\s*true\\s*\\)`,
        "i",
      );
      expect(
        fijadaAMano.test(fuente),
        `la bandera ${nombre} se fija a mano en true: no mide el registro`,
      ).toBe(false);

      // 3. Cada promesa está dentro de un condicional que la referencia.
      for (const promesa of promesas) {
        const desde = fuente.indexOf(promesa);
        const bloque = fuente.slice(Math.max(0, desde - 400), desde);
        expect(
          new RegExp(`\\{\\s*${nombre}\\s*&&`).test(bloque),
          `la promesa «${promesa}» se muestra sin mirar ${nombre}`,
        ).toBe(true);
      }
    },
  );
});
