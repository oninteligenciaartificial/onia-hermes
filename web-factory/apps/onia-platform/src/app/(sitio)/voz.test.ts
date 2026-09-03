import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * El sitio le habla al cliente de VOS, y de vos en todas las frases.
 *
 * El 2026-09-03 la home tenía una tarjeta que arrancaba en voseo y terminaba en
 * tuteo dentro de la MISMA oración: *"**Bajás** la persiana … para que lo
 * **apruebes**"*. El resto del sitio dice `aprobás` en cinco lugares
 * (`hero.tsx`, `pricing.ts`, `agentes/page.tsx`, `nosotros/page.tsx`,
 * `sitio.module.css`), así que no era una elección de estilo: era un descuido.
 * Y no estaba sólo en la home — el mismo `apruebes` estaba en los TÉRMINOS
 * (encima pegado a un `vos`: *"para que vos las apruebes"*) y en el catálogo de
 * requisitos que se renderiza en la home y en `/chatbot`.
 *
 * Importa porque la voz es lo único que separa un sitio escrito para este
 * cliente de una plantilla traducida. Un lead boliviano no va a nombrar el
 * defecto, pero lo oye: la frase suena a folleto de otro país justo en la
 * pantalla donde decide.
 *
 * ⚠️ Escrito mirando por qué el guard de capturas falló tres veces: por cazar
 * la forma exacta del bug de ayer en vez de la clase. Así que acá no se busca
 * el literal `apruebes`, sino **cualquiera** de las formas de tuteo listadas
 * abajo, en **todo** archivo de cara al cliente descubierto del disco — no una
 * lista fija de rutas, que envejece en cuanto alguien agrega una página.
 *
 * ⚠️ Y la contracara, que es la que mantiene vivo a un gate: la lista es
 * DELIBERADAMENTE conservadora. Sólo entran formas donde el tuteo y el voseo se
 * escriben distinto **sin discusión** (`tienes`/`tenés`, `ti`/`vos`). Quedan
 * FUERA a propósito las que comparten forma (`tengas`, `quieras`, `estás`,
 * `vas`, `te`, `tu`) y los imperativos que chocan con sustantivos reales del
 * sitio (`prueba` es también "14 días de prueba"). Un gate que grita por algo
 * correcto es un gate que alguien apaga en la primera corrida, y entonces no
 * cubre nada.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);
const SRC = dirname(APP);

/**
 * Formas de tuteo → cómo las dice este sitio. El par se escribe entero para que
 * el error diga qué poner, no sólo qué está mal: un gate que sólo prohíbe
 * obliga a adivinar el reemplazo.
 */
const TUTEO: [RegExp, string][] = [
  [/\btienes\b/gi, "tenés"],
  [/\bpuedes\b/gi, "podés"],
  [/\bquieres\b/gi, "querés"],
  [/\bsabes\b/gi, "sabés"],
  [/\bhaces\b/gi, "hacés"],
  [/\beres\b/gi, "sos"],
  [/\bvienes\b/gi, "venís"],
  [/\bdices\b/gi, "decís"],
  [/\bpierdes\b/gi, "perdés"],
  [/\bvendes\b/gi, "vendés"],
  [/\bentiendes\b/gi, "entendés"],
  [/\bprefieres\b/gi, "preferís"],
  [/\bempiezas\b/gi, "empezás"],
  [/\bcierras\b/gi, "cerrás"],
  [/\bencuentras\b/gi, "encontrás"],
  [/\bvuelves\b/gi, "volvés"],
  [/\beliges\b/gi, "elegís"],
  [/\bsigues\b/gi, "seguís"],
  [/\bpides\b/gi, "pedís"],
  // El que abrió este archivo. Va con sus hermanos de diptongo: el sitio
  // conjuga estos verbos en voseo en el indicativo (`aprobás`, `probás`), así
  // que el subjuntivo tuteante al lado suena a dos personas escribiendo.
  [/\bapruebes\b/gi, "aprobés"],
  [/\bpruebes\b/gi, "probés"],
  [/\bencuentres\b/gi, "encontrés"],
  // Pronombres: inequívocos, no hay forma voseante que los comparta.
  [/\bpara ti\b/gi, "para vos"],
  [/\bcontigo\b/gi, "con vos"],
];

/** Todo lo que termina siendo texto en pantalla, descubierto del disco. */
function archivosDeCliente(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return archivosDeCliente(ruta);
    if (!e.isFile()) return [];
    if (/\.test\.[tj]sx?$/.test(e.name)) return []; // este archivo cita el defecto
    return /\.(tsx|ts|md)$/.test(e.name) ? [ruta] : [];
  });
}

/**
 * Los comentarios se sacan ANTES de mirar, igual que en `cierre.test.ts`: el
 * código explica en prosa cuál era el error, y un guard que se dispara con la
 * documentación de su propio bug es un guard que alguien apaga.
 *
 * ⚠️ Se BLANQUEAN conservando los saltos de línea, no se borran. La primera
 * versión los borraba y el error apuntaba a `page.tsx:122` para un defecto que
 * estaba en la 215: cada comentario de arriba corría la cuenta. Un gate que
 * manda al renglón equivocado hace perder más tiempo del que ahorra — el que lo
 * lee va, no encuentra nada, y deja de creerle.
 */
function soloTextoVisible(fuente: string): string {
  const enBlanco = (m: string) => m.replace(/[^\n]/g, " ");
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, enBlanco)
    .replace(/^\s*\/\/.*$/gm, enBlanco);
}

const ARCHIVOS = archivosDeCliente(SRC).sort();

describe("el sitio habla de vos en todas sus frases", () => {
  it("descubre archivos de cara al cliente del disco, no de una lista fija", () => {
    expect(ARCHIVOS.length).toBeGreaterThan(20);
  });

  it.each(TUTEO)("no usa %s (este sitio dice «%s»)", (forma, voseo) => {
    const culpables: string[] = [];
    for (const ruta of ARCHIVOS) {
      const texto = soloTextoVisible(readFileSync(ruta, "utf8"));
      for (const [i, linea] of texto.split("\n").entries()) {
        forma.lastIndex = 0;
        if (forma.test(linea)) {
          culpables.push(`${relative(SRC, ruta)}:${i + 1} → decir «${voseo}»`);
        }
      }
    }
    expect(culpables, culpables.join("\n")).toEqual([]);
  });
});
