// Guardia del contrato de importacion de los 12 evals.
//
// Por que existe. Los evals viven en `evals/`, o sea FUERA del glob `*.test.mjs`
// con el que se corre y se reporta la suite. Cuando `d334d776` se llevo por delante
// el `export LLM_SYSTEM_PROMPT` de run-turn.mjs, el archivo de evals dejo de CARGAR
// y los 12 graders —los que miden que el bot no cotiza precios, no promete y deriva
// al humano— no corrieron durante dias, mientras la cola escribia "634/634 verde".
//
// Este test pone el cable-trampa DENTRO del glob que si se reporta: si cualquier
// export del que dependen los evals desaparece, se pone rojo aca, en el numero que
// la gente mira, y no en un archivo que nadie corre.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const EVALS = resolve(AQUI, "evals/evals.test.mjs");

// `import { a, b as c } from "../mod.mjs";` -> { mod: "../mod.mjs", nombres: ["a","b"] }
function importsNombrados(fuente) {
  const re = /^import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/gm;
  const out = [];
  for (const m of fuente.matchAll(re)) {
    const nombres = m[1]
      .split(",")
      .map((n) => n.trim().split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
    out.push({ especificador: m[2], nombres });
  }
  return out;
}

const declarados = importsNombrados(readFileSync(EVALS, "utf8"))
  // node:test / node:assert no son nuestros y no pueden romperse por un commit nuestro
  .filter((i) => i.especificador.startsWith("."));

test("el parser encuentra imports de verdad (si no, este guardia seria un verde vacio)", () => {
  assert.ok(
    declarados.length >= 4,
    `esperaba >=4 imports relativos en evals.test.mjs, encontre ${declarados.length}`,
  );
});

for (const { especificador, nombres } of declarados) {
  test(`los evals pueden importar ${nombres.join(", ")} de ${especificador}`, async () => {
    const mod = await import(
      new URL(especificador, pathToFileURL(EVALS)).href
    );
    for (const nombre of nombres) {
      assert.ok(
        nombre in mod,
        `${especificador} ya no exporta "${nombre}" — los 12 evals dejan de cargar y ` +
          `desaparecen del conteo en silencio (fue exactamente el bug de d334d776)`,
      );
    }
  });
}
