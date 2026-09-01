// Guarda de las guardas: un gate que nadie corre no es un gate.
//
// El 2026-08-31 este repo tenia CINCO scripts de test escritos y verdes
// (`test:carousel`, `test:dentalgest-bridge`, `test:venta-honestidad`,
// `test:propuestas`, `validate:onia-core`) y **cero** forma de correrlos juntos:
// no habia script `test`, y ninguno de los 6 workflows de .github los invocaba.
// El de venta-honestidad se habia escrito el dia anterior justamente para que la
// frase falsa "el bot agenda" no volviera a la fuente unica de que se vende, y
// nada lo ejecutaba: la mentira podia volver en silencio.
//
// Esta guarda ata cada `test:*` a `npm test`. Su reciproco impide lo contrario:
// que `npm test` invoque un script que ya no existe y falle por el motivo equivocado.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const scripts = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8")).scripts ?? {};

/** Los `npm run <x>` que invoca el script `test`, en cadena. */
function invocadosPorTest() {
  const cmd = scripts.test ?? "";
  return [...cmd.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
}

test("todo script test:* se corre desde `npm test`", () => {
  const declarados = Object.keys(scripts).filter((k) => k.startsWith("test:"));
  assert.ok(declarados.length > 0, "no hay ni un script test:* — la guarda perdio sentido");

  const cableados = new Set(invocadosPorTest());
  const huerfanos = declarados.filter((k) => !cableados.has(k));

  assert.deepEqual(
    huerfanos,
    [],
    `estos tests existen y NO los corre nadie: ${huerfanos.join(", ")}.\n` +
      "Agregalos al script `test` de package.json, o borralos si ya no valen.",
  );
});

test("`npm test` no invoca scripts que no existen", () => {
  const inexistentes = invocadosPorTest().filter((k) => !(k in scripts));
  assert.deepEqual(
    inexistentes,
    [],
    `el script \`test\` invoca scripts inexistentes: ${inexistentes.join(", ")}`,
  );
});
