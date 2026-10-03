#!/usr/bin/env node
// Un test con su propio instante (`const T0 = "2026-…"`) le pasa ESE instante a toda funcion que,
// sin reloj, juzga con el de la maquina. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/test-con-fecha-fija-pasa-el-reloj.test.mjs
//
// ORIGEN (3-oct-2026). La suite del bot se puso roja sola, sin que nadie tocara el bot, por
// SEGUNDA vez en dos dias — y `deploy-bot.sh` corre `node --test` como gate, asi que el carril no
// se podia desplegar:
//   · 2-oct: cinco archivos de la pauta armaban la config con horarios del 2 y 3-oct y
//     `buildConfig` (simulate.mjs) los juzgaba con el reloj real: cayeron dentro de las 24 h de
//     anticipacion y cambiaron de rama. El arreglo (e57e1e28b) paso `now: T0` en esos cinco.
//   · 3-oct 12:00Z: `entrega-viva.test.mjs` usa `T0 = 2026-09-19T12:00Z` y llamaba a
//     `juzgarEntregas` sin `ahoraMs`. A los 14 dias exactos (`DIAS_PARA_DESUSO`) la regla de
//     «desuso» empezo a absolver el canal y tres casos que esperaban «rojo» dieron «ok».
// El arreglo del 2-oct anoto la trampa en la skill y barrio una sola funcion. Leer a mano no
// alcanza: esto lo mira por el que escribe el proximo test.
//
// LA REGLA: en un archivo que fija su instante (`const T0` con una fecha literal), cada llamada a
// una de estas funciones lleva el reloj A LA VISTA — en la llamada o en la constante que se le
// pasa (`SIN_AMBIENTE = { …, now: Date.parse(T0) }`). Un archivo sin T0 literal (los que derivan
// sus horarios de `Date.now()`, como simulate.test.mjs) no entra: ahi el reloj real ES el instante.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

// Funcion → modulos de donde importarla la vuelve peligrosa, y el nombre del reloj que acepta.
// `buildConfig` existe tambien en run-turn.mjs y followup-run.mjs con OTRA firma (sin reloj
// inyectable): por eso la lista es por modulo, no por nombre.
const CON_RELOJ_DE_LA_MAQUINA = Object.freeze({
  juzgarEntregas: { modulos: ["./entrega-viva.mjs"], reloj: "ahoraMs" },
  buildConfig: { modulos: ["./simulate.mjs"], reloj: "now" },
  parseSlotsSpec: { modulos: ["./config.mjs", "./followup-run.mjs"], reloj: "now" },
  slotsElegibles: { modulos: ["./config.mjs"], reloj: "now" },
});

const T0_LITERAL = /^\s*const\s+T0\s*=\s*(?:Date\.parse\(\s*)?(?:["'`]\d{4}-\d\d-\d\d|Date\.UTC\()/m;

/** Los `*.test.mjs` del bot (y de evals/), con su texto. */
function archivosDeTest() {
  const out = [];
  for (const dir of [AQUI, join(AQUI, "evals")]) {
    let nombres = [];
    try {
      nombres = readdirSync(dir);
    } catch {
      continue;
    }
    for (const nombre of nombres) {
      if (nombre.endsWith(".test.mjs")) out.push({ nombre, texto: readFileSync(join(dir, nombre), "utf8") });
    }
  }
  return out;
}

/** El texto sin las lineas de comentario: un ejemplo en prosa no es una llamada. */
function sinComentarios(texto) {
  return texto
    .split("\n")
    .map((linea) => (/^\s*(\/\/|\*|\/\*)/.test(linea) ? "" : linea))
    .join("\n");
}

/** Lo que va entre el `(` de `desde` y su `)` de cierre. */
function entreParentesis(texto, desde) {
  let nivel = 0;
  for (let i = desde; i < texto.length; i += 1) {
    if (texto[i] === "(") nivel += 1;
    else if (texto[i] === ")") {
      nivel -= 1;
      if (nivel === 0) return texto.slice(desde + 1, i);
    }
  }
  return texto.slice(desde + 1);
}

/** El inicializador de `const NOMBRE = …` (balanceando llaves), o "". */
function inicializador(texto, nombre) {
  const m = new RegExp(`const\\s+${nombre}\\s*=\\s*`).exec(texto);
  if (!m) return "";
  const desde = m.index + m[0].length;
  let nivel = 0;
  for (let i = desde; i < texto.length; i += 1) {
    const c = texto[i];
    if (c === "{" || c === "(" || c === "[") nivel += 1;
    else if (c === "}" || c === ")" || c === "]") nivel -= 1;
    else if ((c === ";" || c === "\n") && nivel === 0) return texto.slice(desde, i);
  }
  return texto.slice(desde);
}

/** Las funciones de la lista que el archivo importa del modulo que las vuelve peligrosas. */
function importadas(texto) {
  const out = new Set();
  for (const m of texto.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
    const modulo = m[2];
    for (const pieza of m[1].split(",")) {
      const [original] = pieza.trim().split(/\s+as\s+/);
      const regla = CON_RELOJ_DE_LA_MAQUINA[original];
      if (regla && regla.modulos.includes(modulo)) out.add(pieza.trim().split(/\s+as\s+/).pop());
    }
  }
  return out;
}

/** Las llamadas SIN reloj de un archivo con T0 literal: `["archivo:linea  llamada(...)"]`. */
export function llamadasSinReloj({ nombre, texto }) {
  if (!T0_LITERAL.test(texto)) return [];
  const codigo = sinComentarios(texto);
  const faltas = [];
  for (const local of importadas(texto)) {
    for (const m of codigo.matchAll(new RegExp(`\\b${local}\\s*\\(`, "g"))) {
      const args = entreParentesis(codigo, m.index + m[0].length - 1);
      const conReloj = (fragmento) => /\b(now|ahoraMs)\b/.test(fragmento);
      if (conReloj(args)) continue;
      // El reloj puede venir en una constante del mismo archivo (`SIN_AMBIENTE`): se la mira.
      const identificadores = args.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || [];
      if (identificadores.some((id) => conReloj(inicializador(codigo, id)))) continue;
      const linea = codigo.slice(0, m.index).split("\n").length;
      faltas.push(`${nombre}:${linea}  ${local}(${args.replace(/\s+/g, " ").slice(0, 90)})`);
    }
  }
  return faltas;
}

test("el detector caza una llamada sin reloj en un archivo con T0 literal (si no, el gate no mide nada)", () => {
  const texto = [
    'import { juzgarEntregas } from "./entrega-viva.mjs";',
    'import { buildConfig } from "./simulate.mjs";',
    'const T0 = Date.parse("2026-09-19T12:00:00Z");',
    "const SIN_AMBIENTE = { env: {}, envFile: \"/no\" };",
    "const CON_RELOJ = { env: {}, now: T0 };",
    "juzgarEntregas({ salientes: [] });",
    "juzgarEntregas({ salientes: [], ahoraMs: T0 });",
    "buildConfig({ slots: X }, SIN_AMBIENTE);",
    "buildConfig({ slots: X }, CON_RELOJ);",
    "// buildConfig({}) en un comentario no cuenta",
  ].join("\n");
  const faltas = llamadasSinReloj({ nombre: "x.test.mjs", texto });
  assert.equal(faltas.length, 2, faltas.join("\n"));
  assert.match(faltas[0] + faltas[1], /x\.test\.mjs:6 {2}juzgarEntregas/);
  assert.match(faltas[0] + faltas[1], /x\.test\.mjs:8 {2}buildConfig/);
});

test("el detector no mira el buildConfig de run-turn (otra firma) ni un archivo sin T0 literal", () => {
  const deRunTurn = 'import { buildConfig } from "./run-turn.mjs";\nconst T0 = "2026-07-27T14:05:00Z";\nbuildConfig({});';
  assert.deepEqual(llamadasSinReloj({ nombre: "a.test.mjs", texto: deRunTurn }), []);
  const sinT0 = 'import { buildConfig } from "./simulate.mjs";\nconst ahora = Date.now();\nbuildConfig({});';
  assert.deepEqual(llamadasSinReloj({ nombre: "b.test.mjs", texto: sinT0 }), []);
});

test("ningun test con fecha fija juzga con el reloj de la maquina", () => {
  const faltas = archivosDeTest().flatMap(llamadasSinReloj);
  assert.deepEqual(
    faltas,
    [],
    `Estas llamadas usan Date.now() por defecto en un archivo que fija su instante: vencen solas.\n` +
      `Pasá el reloj del caso (\`ahoraMs\` / \`now\`), en la llamada o en la constante que recibe.\n${faltas.join("\n")}`,
  );
});
