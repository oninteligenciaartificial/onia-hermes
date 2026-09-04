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
import { readFileSync, readdirSync } from "node:fs";
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

// ─────────────────────────────────────────────────────────────────────────────
// La MISMA guarda, pero sacando los sujetos del DISCO en vez de package.json.
//
// Las dos de arriba preguntan "¿todo `test:*` DECLARADO esta cableado?", asi que
// su lista de sujetos sale de una lista de inclusion — y por eso fallan ABIERTO:
// el dia que un archivo de test existe en disco y nadie lo declara, no tiene
// gate y nada se pone en rojo.
//
// Medido el 2026-09-03 por `onia-cola`: `scripts/docs-hygiene.test.mjs` (18
// casos), `scripts/video-scenes.test.mjs` (1) y `scripts/vigia_sin_respuesta.test.mjs`
// (15) estaban en disco, verdes, y **no los corria nadie** — 34 afirmaciones
// invisibles con las dos guardas de arriba en verde.
//
// Como se colo, y por que la de arriba no podia verlo: al mergear el carril
// chatbot ese mismo dia, `package.json` salio en CONFLICTO porque dos carriles
// le habian agregado un gate cada uno a la misma cadena `test`. Resolverlo
// eligiendo un lado —lo natural con el reloj en contra— borra el `test:*` del
// otro lado JUNTO con su declaracion, mientras el archivo .test.mjs entra igual
// al arbol por su propio hunk sin conflicto. Sin huerfano declarado, la guarda
// de arriba pasa. La cadena `test` es una lista a mano y ese choque se repite
// cada vez que dos carriles agregan un gate.
//
// Derivar del disco invierte la carga: un test nuevo en `scripts/` NACE cubierto
// y hay que excluirlo a mano, a la vista, con su motivo escrito.
//
// ⚠️ ALCANCE, dicho para que no se lea como mas de lo que es: **solo `scripts/`**,
// que es la carpeta cuya cadena `test` vive en este package.json. Los otros ~250
// `*.test.*` del repo (`.claude/skills/`, `web-factory/` con vitest, `onia-core/`,
// `video-factory/`, `hermes-content/deploy/vps-ops/bot/`) tienen su propio
// corredor y no los cubre esta guarda.

/** Archivos de test de `scripts/` que a proposito NO corre `npm test`, con su motivo. */
const EXCLUIDOS = new Map([
  // Vacio a proposito: los tres huerfanos del 2026-09-03 se CABLEARON, no se
  // excluyeron. Una entrada aca es una decision, no un atajo — y la de abajo
  // exige que el archivo exista, asi que una exclusion vencida sale en rojo.
]);

/** Rutas `scripts/...` que toca la cadena `test`, resolviendo los `npm run` en cascada. */
function rutasQueCorreNpmTest() {
  const vistos = new Set();
  const pendientes = ["test"];
  const rutas = new Set();

  while (pendientes.length > 0) {
    const nombre = pendientes.pop();
    if (vistos.has(nombre)) continue;
    vistos.add(nombre);

    const cmd = scripts[nombre];
    if (typeof cmd !== "string") continue;

    for (const m of cmd.matchAll(/scripts\/[\w./-]+/g)) rutas.add(m[0]);
    for (const m of cmd.matchAll(/npm run ([\w:-]+)/g)) pendientes.push(m[1]);
  }
  return rutas;
}

const ES_TEST = /\.test\.(mjs|js|ts)$/;

test("todo archivo de test de `scripts/` lo corre `npm test`", () => {
  const enDisco = readdirSync(join(raiz, "scripts")).filter((f) => ES_TEST.test(f));
  assert.ok(enDisco.length > 0, "no hay ni un *.test.* en scripts/ — la guarda perdio sentido");

  const corridos = rutasQueCorreNpmTest();
  const huerfanos = enDisco
    .filter((f) => !corridos.has(`scripts/${f}`))
    .filter((f) => !EXCLUIDOS.has(f))
    .sort();

  assert.deepEqual(
    huerfanos,
    [],
    `estos tests estan en scripts/ y NO los corre \`npm test\`: ${huerfanos.join(", ")}.\n` +
      "Cablealos al script `test` de package.json, borralos, o agregalos a EXCLUIDOS con su motivo.",
  );
});

test("una exclusion vencida no puede tapar nada: el archivo excluido tiene que existir", () => {
  const enDisco = new Set(readdirSync(join(raiz, "scripts")).filter((f) => ES_TEST.test(f)));
  const vencidas = [...EXCLUIDOS.keys()].filter((f) => !enDisco.has(f)).sort();

  assert.deepEqual(
    vencidas,
    [],
    `EXCLUIDOS nombra archivos que ya no existen: ${vencidas.join(", ")}.\n` +
      "Sacalos: una exclusion que no apunta a nada solo sirve para esconder la proxima.",
  );
});
