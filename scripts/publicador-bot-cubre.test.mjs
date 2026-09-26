// Todo archivo del bot que el proceso vivo pueda cargar tiene que poder VIAJAR.
//
// POR QUÉ EXISTE. `hermes-content/deploy/vps-ops/bot/deploy-bot.sh` no copia una
// lista derivada: copia por GLOBS DE SHELL PLANOS. La línea es
//
//     PATRONES=("*.mjs" "*.sh" "knowledge.example.json" ...)
//     cd "$REPO_DIR"; for patron in "${PATRONES[@]}"; do for f in $patron; do
//
// y `$REPO_DIR` es la carpeta del bot. Un glob de shell **no recurre**: `*.mjs`
// no ve `evals/evals.test.mjs`. Medido el 2026-09-26: la carpeta tiene 150 `.mjs`
// versionados, uno de ellos en un subdirectorio, y `/opt/onia/bot/evals/` NO
// EXISTE en producción (`ls` → "No such file or directory"; 145 `.mjs` planos
// allá). Hoy el huérfano es un test y no rompe nada. Lo que rompe es lo que viene
// después: con 150 archivos en una carpeta plana, el primer refactor que agrupe
// runtime en un subdirectorio deja ese código FUERA de producción, y `deploy-bot.sh`
// canta éxito igual — el paso de copia es `cp -p "$f" "$DEST/$f"` sin `mkdir -p`,
// así que un archivo en subdirectorio ni siquiera puede llegar.
//
// LA CLASE, que es lo que este gate cuida y no el archivo: **una lista blanca
// escrita a mano defiende exactamente el hueco que existe para impedir.** Ya se
// pagó dos veces en este mismo carril:
//   · el publicador SIAT dejó `run-fase1-volumen.sh` huérfano con un motivo
//     escrito y verdadero (ver `scripts/publicador-siat-cubre.test.mjs`, que es
//     el hermano de este y el molde que sigue);
//   · las 9 campanas del bot vivieron 24 días en un archivo que NINGÚN deploy
//     copiaba, con su gate en 17/17 verde, porque el gate validaba un archivo y
//     no preguntaba cuál instala el deploy.
//
// Por eso acá NADA se copia del publicador: los patrones se LEEN de su fuente y
// los sujetos se DERIVAN de `git ls-files`. Si el publicador deja de declarar
// `PATRONES`, esto TIRA en vez de dar verde — un gate que no encuentra a su
// sujeto no puede aprobarlo.
//
// NO se mide contra /opt: desde el nodo de casa no existe, y un gate de la cadena
// del integrador que dependa del VPS se pone rojo por ambiente y traba el merge
// de todos los carriles. Acá alcanza el fuente: la pregunta es si el publicador
// PUEDE alcanzar el archivo, no si hoy ya lo alcanzó.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUB = "hermes-content/deploy/vps-ops/bot";
const PUBLICADOR = join(RAIZ, SUB, "deploy-bot.sh");

/** Los archivos versionados del subárbol, relativos a él. */
function archivosDelSubarbol() {
  const salida = execFileSync("git", ["-C", RAIZ, "ls-files", "--", SUB], {
    encoding: "utf8",
  }).trim();
  return salida
    .split("\n")
    .filter(Boolean)
    .map((ruta) => ruta.slice(SUB.length + 1));
}

/**
 * Los patrones del publicador, LEÍDOS de su fuente.
 *
 * Duplicarlos acá es como se desincronizan: el día que alguien agregue un
 * patrón, este gate tiene que enterarse sin que nadie lo edite.
 */
export function patronesDeDeployBot(fuente) {
  const m = fuente.match(/^PATRONES=\(([^)]*)\)/m);
  if (!m) {
    throw new Error(
      "deploy-bot.sh ya no declara `PATRONES=(...)`: este gate no puede saber qué " +
        "viaja, así que no puede aprobarlo. Actualizá el lector, no borres el gate.",
    );
  }
  const patrones = [...m[1].matchAll(/"([^"]+)"/g)].map((p) => p[1]);
  if (patrones.length === 0) {
    throw new Error("deploy-bot.sh declara `PATRONES` vacío: nada viajaría.");
  }
  return patrones;
}

/** Un glob de shell PLANO: `*` no cruza `/`, igual que `for f in *.mjs`. */
function alcanza(patron, ruta) {
  if (ruta.includes("/")) return false; // ningún glob plano entra a un subdirectorio
  const rx = new RegExp(
    "^" +
      patron.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*") +
      "$",
  );
  return rx.test(ruta);
}

/**
 * Un archivo que no viaja sólo es aceptable si el proceso vivo NO puede cargarlo.
 * La exención se DERIVA del nombre y se re-mide en cada corrida: no hay lista de
 * rutas perdonadas, que es como una exención se vuelve permanente sin que nadie
 * la audite.
 */
function noLoCargaElBot(ruta) {
  const base = ruta.split("/").pop();
  if (base.endsWith(".test.mjs")) return "es un test: corre desde el repo, no dentro del bot";
  if (base.startsWith(".")) return "es un dotfile de git, no código del bot";
  if (base.endsWith(".md")) return "es documentación";
  if (base.endsWith(".example") || base.includes(".example.")) return "es una plantilla de ejemplo";
  return null;
}

/**
 * Los tres hallazgos posibles, en una sola pasada. Función PURA: los tests de
 * abajo la alimentan con fixtures para verla en ROJO, que es la única forma de
 * saber que su verde de hoy significa algo.
 */
export function auditar({ archivos, patrones }) {
  const problemas = [];

  for (const patron of patrones) {
    if (patron.includes("/")) {
      problemas.push({
        clase: "patron-con-barra",
        sujeto: patron,
        porque:
          `el patrón "${patron}" tiene una barra, así que el modelo de glob plano de este ` +
          "gate ya no describe al publicador: revisá deploy-bot.sh antes de confiar en este verde",
      });
    }
    if (!patron.includes("*") && !archivos.some((a) => a === patron)) {
      problemas.push({
        clase: "entrada-muerta",
        sujeto: patron,
        porque:
          `la lista blanca nombra "${patron}" y ese archivo NO existe: si lo renombraron, ` +
          "dejó de viajar en silencio (es la falla exacta que tuvo muertas 24 días a las campanas)",
      });
    }
  }

  for (const ruta of archivos) {
    if (patrones.some((p) => alcanza(p, ruta))) continue;
    const exento = noLoCargaElBot(ruta);
    if (exento) continue;
    problemas.push({
      clase: "huerfano",
      sujeto: ruta,
      porque:
        `ningún patrón de deploy-bot.sh alcanza "${ruta}", así que NO viaja a producción` +
        (ruta.includes("/")
          ? " (está en un subdirectorio, y todos los patrones son globs planos)"
          : ""),
    });
  }

  return problemas;
}

const describir = (ps) =>
  ps.map((p) => `  [${p.clase}] ${p.sujeto}\n      ${p.porque}`).join("\n");

// ── el gate vivo: el subárbol de HOY ────────────────────────────────────────
test("todo archivo del bot que el proceso vivo pueda cargar puede VIAJAR", () => {
  const archivos = archivosDelSubarbol();
  assert.ok(
    archivos.length > 50,
    `esperaba el subárbol del bot y encontré ${archivos.length} archivos: el gate no halló a su sujeto`,
  );
  const patrones = patronesDeDeployBot(readFileSync(PUBLICADOR, "utf8"));
  const problemas = auditar({ archivos, patrones });
  assert.deepEqual(
    problemas,
    [],
    `el publicador del bot no cubre su propio subárbol:\n${describir(problemas)}`,
  );
});

// ── el verde probado al revés: sin esto, un gate ciego también da cero ──────
const PATRONES_REALES = ["*.mjs", "*.sh", "knowledge.onia.json"];

test("un .mjs de RUNTIME en un subdirectorio sale en rojo", () => {
  const problemas = auditar({
    archivos: ["run-turn.mjs", "knowledge.onia.json", "motor/agenda.mjs"],
    patrones: PATRONES_REALES,
  });
  assert.equal(problemas.length, 1);
  assert.equal(problemas[0].clase, "huerfano");
  assert.equal(problemas[0].sujeto, "motor/agenda.mjs");
  assert.match(problemas[0].porque, /subdirectorio/);
});

test("un TEST en un subdirectorio no es un hallazgo: no corre dentro del bot", () => {
  assert.deepEqual(
    auditar({
      archivos: ["run-turn.mjs", "knowledge.onia.json", "evals/evals.test.mjs"],
      patrones: PATRONES_REALES,
    }),
    [],
  );
});

test("un dato nuevo con extensión que nadie nombró sale en rojo", () => {
  // La falla de las campanas, en una línea: el archivo existe, el bot lo lee, y
  // ningún patrón lo alcanza.
  const problemas = auditar({
    archivos: ["run-turn.mjs", "knowledge.onia.json", "campanas.json"],
    patrones: PATRONES_REALES,
  });
  assert.equal(problemas.length, 1);
  assert.equal(problemas[0].clase, "huerfano");
  assert.equal(problemas[0].sujeto, "campanas.json");
});

test("una entrada literal de la lista blanca sin archivo sale en rojo", () => {
  const problemas = auditar({
    archivos: ["run-turn.mjs", "conocimiento.json"], // lo renombraron
    patrones: PATRONES_REALES,
  });
  assert.equal(problemas.length, 2, describir(problemas));
  assert.equal(problemas[0].clase, "entrada-muerta");
  assert.equal(problemas[0].sujeto, "knowledge.onia.json");
  // y el archivo nuevo tampoco viaja: el renombre rompe las dos puntas
  assert.equal(problemas[1].clase, "huerfano");
  assert.equal(problemas[1].sujeto, "conocimiento.json");
});

test("un patrón con barra no se aprueba en silencio: el modelo de este gate dejaría de aplicar", () => {
  const problemas = auditar({
    archivos: ["run-turn.mjs", "knowledge.onia.json", "motor/agenda.mjs"],
    patrones: [...PATRONES_REALES, "motor/*.mjs"],
  });
  assert.ok(problemas.some((p) => p.clase === "patron-con-barra"));
});

test("los docs y los dotfiles no viajan y está bien", () => {
  assert.deepEqual(
    auditar({
      archivos: [
        "run-turn.mjs",
        "knowledge.onia.json",
        ".gitignore",
        "N8N_WORKFLOW.md",
        "webhook.env.example",
      ],
      patrones: PATRONES_REALES,
    }),
    [],
  );
});

test("si deploy-bot.sh deja de declarar PATRONES, el gate TIRA en vez de aprobar", () => {
  assert.throws(() => patronesDeDeployBot("#!/bin/bash\nDEST=/opt/onia/bot\n"), /PATRONES/);
  assert.throws(() => patronesDeDeployBot("PATRONES=()\n"), /vacío/);
});

test("los patrones se leen de la fuente real, no de esta copia", () => {
  const patrones = patronesDeDeployBot(readFileSync(PUBLICADOR, "utf8"));
  assert.ok(patrones.includes("*.mjs"), `deploy-bot.sh ya no copia *.mjs: ${patrones.join(" ")}`);
  assert.ok(patrones.includes("knowledge.onia.json"), "el conocimiento del bot dejó de viajar");
});
