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
import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  testsFueraDeLaCadena,
  SUBARBOLES_CON_CORREDOR_PROPIO,
} from "./tests_fuera_de_la_cadena.mjs";

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

// ─────────────────────────────────────────────────────────────────────────────
// La MISMA pregunta, para TODO el repo y no solo `scripts/`.
//
// El 2026-09-17 se cablearon 951 pruebas que la cadena no corria. Al dia
// siguiente habia 15 mas (`video-factory/`, `ciencia-cuerpo`): verdes, en disco,
// y sin correr — porque la guarda de arriba solo mira `scripts/`, y el ALCANCE
// escrito en su comentario se leia como "esto ya esta cubierto". Un test nuevo
// en cualquier otra carpeta nacia invisible.
//
// El universo lo deriva `tests_fuera_de_la_cadena.mjs`, que este gate IMPORTA en
// vez de copiar: un gate con su propia copia de la expresion del producto puede
// tener la copia bien y el producto mal, y coincidir para siempre.

test("ningun test del repo queda fuera de `npm test`", () => {
  const { universo, fuera } = testsFueraDeLaCadena();

  assert.ok(universo.length > 0, "universo vacio — el instrumento dejo de ver el disco");

  assert.deepEqual(
    fuera,
    [],
    `estas pruebas existen en disco y NO las corre \`npm test\`: ${fuera.join(", ")}.\n` +
      "Cablealas al script `test`, borralas, o declara su subarbol en\n" +
      "SUBARBOLES_CON_CORREDOR_PROPIO (scripts/tests_fuera_de_la_cadena.mjs) con su motivo.",
  );
});

test("el universo incluye los sujetos que motivaron la guarda, fuera de scripts/", () => {
  // Caso ancla. Sin el, un filtro de mas deja el universo vacio de lo que importa
  // y el gate firma verde midiendo nada — que es como se cuela cada vez.
  const { universo } = testsFueraDeLaCadena();
  const anclas = [
    "onia-core/modules/agents-logic.test.mjs",
    "hermes-content/integrations/siat/test/fase1-runner.test.mjs",
    "video-factory/test/formats.test.mjs",
  ];
  for (const a of anclas) {
    if (!existsSync(join(raiz, a))) continue; // el ancla se movio: no inventamos rojo
    assert.ok(
      universo.includes(a),
      `el universo no ve ${a} — un filtro lo dejo afuera y el gate mide menos de lo que dice`,
    );
  }
});

test("una exclusion de subarbol vencida no puede tapar nada: la carpeta tiene que existir", () => {
  const vencidas = [...SUBARBOLES_CON_CORREDOR_PROPIO.keys()]
    .filter((c) => !existsSync(join(raiz, c)))
    .sort();

  assert.deepEqual(
    vencidas,
    [],
    `SUBARBOLES_CON_CORREDOR_PROPIO nombra carpetas que ya no existen: ${vencidas.join(", ")}.`,
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

// ─────────────────────────────────────────────────────────────────────────────
// Un paso de la cadena puede vivir en OTRO package.json, y hasta hoy el
// instrumento no podia seguirlo.
//
// `test:sitio-venta` es `cd web-factory/apps/onia-platform && npm run prebuild`,
// y esa forma la instalo la leccion del 2026-09-17: la cadena corria `npm test`
// del sitio —mas flojo que el `prebuild` (tsc --noEmit + tests) que corre el
// publicador—, asi que 5 errores de tipo entraron verdes a `main` y mataron la
// publicacion de onia.com.bo dos corridas seguidas.
//
// El instrumento resolvia ese `npm run prebuild` contra el package.json de la
// RAIZ, donde no existe, y lo listaba como "prebuild (script inexistente)". Dos
// fallas opuestas con la misma causa: un nombre fantasma que se lee como "este
// paso de la cadena esta roto" —y cuyo arreglo natural es volver al gate flojo—,
// y, del otro lado, que todo test del subarbol anidado quede fuera de
// `ejecutados`: si ese subarbol no estuviera excluido, la cadena entera saldria
// reportada como huerfana. La exclusion `web-factory` dice textual "la app que se
// publica entra por `test:sitio-venta`": sin seguir el `cd`, el instrumento no
// podia verificar su propio motivo.
test("un `cd <dir> && npm run <x>` se resuelve en el package.json de ESE dir", () => {
  // Se siembra FUERA del repo: un sujeto sembrado adentro lo levanta el gate de
  // aca arriba —que camina el mismo disco— y lo deja rojo acusando al producto.
  const semilla = mkdtempSync(join(tmpdir(), "onia-cadena-anidada-"));
  try {
    mkdirSync(join(semilla, "sub"), { recursive: true });
    writeFileSync(
      join(semilla, "package.json"),
      JSON.stringify({ scripts: { test: "npm run test:sub", "test:sub": "cd sub && npm run prebuild" } }),
    );
    writeFileSync(
      join(semilla, "sub", "package.json"),
      JSON.stringify({ scripts: { prebuild: "tsc --noEmit && node --test gate.test.mjs" } }),
    );
    writeFileSync(join(semilla, "sub", "gate.test.mjs"), "");

    const { universo, ejecutados, fuera, noEntendidos } = testsFueraDeLaCadena({ raiz: semilla });

    assert.deepEqual(universo, ["sub/gate.test.mjs"], "el universo dejo de ver el disco sembrado");
    assert.deepEqual(
      ejecutados,
      ["sub/gate.test.mjs"],
      "la cadena SI corre esa prueba, por un `npm run` de otro package.json: no seguir el `cd` la da por huerfana",
    );
    assert.deepEqual(fuera, [], "reporto como fuera de la cadena algo que la cadena corre");
    assert.deepEqual(
      noEntendidos,
      [],
      "nombro un script como inexistente porque lo busco en la raiz en vez del dir del `cd`",
    );
  } finally {
    rmSync(semilla, { recursive: true, force: true });
  }
});

test("un `cd <dir>` hacia una carpeta sin package.json se DENUNCIA, no se calla", () => {
  // La direccion simetrica: seguir el `cd` no puede volverse una forma de tragar
  // silencio. Si el paso apunta a un dir sin package.json, no hay nada que correr.
  const semilla = mkdtempSync(join(tmpdir(), "onia-cadena-sin-pkg-"));
  try {
    mkdirSync(join(semilla, "sub"), { recursive: true });
    writeFileSync(
      join(semilla, "package.json"),
      JSON.stringify({ scripts: { test: "cd sub && npm run prebuild" } }),
    );
    writeFileSync(join(semilla, "sub", "gate.test.mjs"), "");

    const { noEntendidos } = testsFueraDeLaCadena({ raiz: semilla });

    assert.ok(
      noEntendidos.some((n) => n.includes("sub")),
      `un paso que apunta a un dir sin package.json tiene que salir nombrado; salio: ${JSON.stringify(noEntendidos)}`,
    );
  } finally {
    rmSync(semilla, { recursive: true, force: true });
  }
});
