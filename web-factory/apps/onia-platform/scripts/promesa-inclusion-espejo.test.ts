/**
 * Las dos copias de `promesa-inclusion.mjs` son la MISMA, byte a byte.
 *
 * POR QUE HAY DOS. El detector de «¿a quién le decimos que el chatbot viene incluido?» lo escribió
 * el carril del bot en `hermes-content/deploy/vps-ops/bot/promesa-inclusion.mjs`, y el sitio lo
 * necesita en su `prebuild`. Un `import` relativo hacia allá es lo que estuvo escrito hasta el
 * 2026-09-17 y es imposible en producción: el publicador de la landing arma el stage con
 * `git archive` de SOLO `web-factory/` (`build-and-stage.sh`), así que el import resuelve en el
 * repo y no resuelve en el stage. Falla EN VERDE para todos los carriles —la cadena de
 * onia-hermes y el CI corren donde el hermano existe— y aparece recién cuando nadie mira: la
 * publicación de onia.com.bo murió dos corridas seguidas (17:50 y 20:50 La Paz) con
 * `ERR_MODULE_NOT_FOUND`, y lo único que lo decía era la línea `landing: FALLO` de
 * `/var/log/onia-publicar-solo.log`, que no escala a nadie.
 *
 * POR QUE ESTE GATE VIVE DE ESTE LADO. Porque este lado es el único que viaja al stage. Un gate
 * que viviera junto a la fuente no se ejecutaría nunca donde el defecto muerde.
 *
 * COMO NO SE APAGA SOLO. La comparación necesita las dos copias, y en el stage hay una: ahí el
 * gate no puede medir, y no poder medir no es verde. La condición se DERIVA del disco —¿existe el
 * subárbol `hermes-content/`?— y no de una variable de entorno que alguien pueda dejar puesta:
 * dentro del repo (donde corre la cadena, que es la que decide el merge) medir es OBLIGATORIO, y
 * el caso `siempre se mide dentro del repo` se pone rojo si la fuente se mueve o se borra.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ESPEJO = join(AQUI, "promesa-inclusion.mjs");

/** `scripts` → `onia-platform` → `apps` → `web-factory` → la raíz (del repo o del stage). */
const RAIZ = dirname(dirname(dirname(dirname(AQUI))));
const SUBARBOL_HERMANO = join(RAIZ, "hermes-content");
const FUENTE = join(SUBARBOL_HERMANO, "deploy", "vps-ops", "bot", "promesa-inclusion.mjs");

/**
 * ¿Estoy en el repo completo o en el stage de publicación? Se pregunta por el subárbol hermano y
 * no por el archivo: si preguntara por el archivo, borrar la fuente se leería como «estoy en un
 * stage» y apagaría el gate en silencio — justo el modo de falla que este archivo existe para no
 * repetir.
 */
export const enElRepoCompleto = (raiz = SUBARBOL_HERMANO) => existsSync(raiz);

describe("promesa-inclusion.mjs: el espejo del sitio y la fuente del bot son idénticos", () => {
  it("el espejo existe del lado que viaja al stage", () => {
    expect(existsSync(ESPEJO)).toBe(true);
  });

  it("el espejo no importa nada de afuera de web-factory (si lo hiciera, no llegaría al stage)", () => {
    const codigo = readFileSync(ESPEJO, "utf8");
    const haciaAfuera = [...codigo.matchAll(/^\s*(?:import|export)[^;]*?from\s*["'](\.{1,2}\/[^"']+)["']/gm)]
      .map((m) => m[1])
      .filter((ruta) => ruta.startsWith("../../../"));
    expect(haciaAfuera).toEqual([]);
  });

  it("siempre se mide dentro del repo: la fuente del bot está donde dice", () => {
    if (!enElRepoCompleto()) return; // stage: no hay con qué comparar, y eso lo dice el caso de abajo
    expect(existsSync(FUENTE)).toBe(true);
  });

  it("las dos copias coinciden byte a byte", () => {
    if (!enElRepoCompleto()) {
      // Stage de publicación: sólo viaja `web-factory/`. NO se puede medir, y eso no es verde ni
      // rojo — el veredicto de este cruce lo da la corrida que sí tiene las dos copias.
      expect(existsSync(FUENTE)).toBe(false);
      return;
    }
    expect(readFileSync(ESPEJO, "utf8")).toBe(readFileSync(FUENTE, "utf8"));
  });

  it("la pregunta de «¿puedo medir?» sale del disco, no de una variable de entorno", () => {
    expect(enElRepoCompleto(join(AQUI, "no-existe-este-subarbol"))).toBe(false);
    expect(enElRepoCompleto(AQUI)).toBe(true);
  });
});
