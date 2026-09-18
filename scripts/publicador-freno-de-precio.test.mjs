#!/usr/bin/env node
/**
 * El freno de precio del publicador mide si cambio un MONTO, no que archivo se toco.
 *
 * POR QUE EXISTE, medido el 2026-09-17 (tarea t_189a6037). `onia-publicar-solo.sh`
 * es el unico camino por el que un arreglo llega al cliente sin que Sergio Urcullo
 * apriete nada, y se detiene cuando un commit varado toca una fuente de precio. Ese
 * dia el criterio era el NOMBRE del archivo: `grep` sobre `git show --name-only`.
 * Con eso, los TRES destinos llevaban dias detenidos y el unico cambio real en
 * `lib/subscription-plans.ts` era `DEFAULT_PLAN_AMOUNTS[plan][cycle]` pasando a
 * `[plan]?.[cycle]`, mas comentarios: la tabla de montos, identica linea por linea.
 * Atras de ese freno esperaba el arreglo que dejaba afuera a todo cliente nuevo.
 *
 * QUE FIJA. Las dos direcciones, que es lo unico que hace util a este gate:
 *   · aflojar de mas — un cambio REAL de monto tiene que seguir deteniendo el
 *     destino, tambien cuando entra por un MERGE (un `git show` de un merge sale
 *     VACIO si no se le pide `-m --first-parent`, y los medidores de varados
 *     devuelven merges: el que trae la rama a main es un commit varado mas);
 *   · apretar de mas — un `?.`, un renombre o un comentario que CITA un precio
 *     viejo no son un monto nuevo y no pueden costarle la publicacion a nadie.
 *
 * COMO. No mira el texto del guion: lo EJECUTA (`--montos`) contra un repo git
 * sembrado por corrida, que es la unica forma de que el sujeto sea la funcion real.
 * Preguntar no publica nada y no necesita `/opt`, asi que el caso corre en cualquier
 * maquina — la de los carriles no tiene `/opt`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const GUION = join(AQUI, "loops/extras/publicar-solo.sh");
const ARCHIVO = "lib/subscription-plans.ts";

/** La tabla de montos tal como la escribe el producto, para poder mutarla. */
const tabla = (mensual, textoDelAddon) => `// Los montos de los planes. FUENTE UNICA: lo que valida el pago.
export const DEFAULT_PLAN_AMOUNTS = {
  basico: { monthly: ${mensual}, yearly: 7500 },
};
export const ADDON = { etiqueta: "Bs ${textoDelAddon}/mes" };
export function getPlanAmount(plan, cycle) {
  return DEFAULT_PLAN_AMOUNTS[plan][cycle];
}
`;

function git(repo, ...args) {
  const r = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr}`);
  return (r.stdout ?? "").trim();
}

/** Un repo con un commit base y el archivo de precios adentro. */
function repoSembrado() {
  const dir = mkdtempSync(join(tmpdir(), "onia-freno-precio-"));
  git(dir, "init", "--quiet", "-b", "main");
  git(dir, "config", "user.email", "gate@onia.test");
  git(dir, "config", "user.name", "gate");
  spawnSync("mkdir", ["-p", join(dir, "lib")]);
  writeFileSync(join(dir, ARCHIVO), tabla(320, "390"));
  git(dir, "add", "-A");
  git(dir, "commit", "--quiet", "-m", "base");
  return dir;
}

function commitear(dir, contenido, mensaje) {
  writeFileSync(join(dir, ARCHIVO), contenido);
  git(dir, "add", "-A");
  git(dir, "commit", "--quiet", "-m", mensaje);
  return git(dir, "rev-parse", "HEAD");
}

/** Le pregunta al guion REAL si esos commits cambian algun monto. */
function preguntar(repo, ...shas) {
  const r = spawnSync("bash", [GUION, "--montos", repo, ARCHIVO, ...shas], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return { codigo: r.status, salida: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
}

test("un `?.` y unos comentarios que CITAN precios no son un monto nuevo: publica", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      tabla(320, "390").replace(
        "DEFAULT_PLAN_AMOUNTS[plan][cycle];",
        "DEFAULT_PLAN_AMOUNTS[plan]?.[cycle];\n  // Antes cotizaba 890 y 1290 sin preguntar",
      ),
      "fix: getPlanAmount tiraba con un plan desconocido",
    );
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      0,
      "detuvo la publicacion por un cambio que no toca ningun monto. Eso es el freno " +
        "viejo (medir el NOMBRE del archivo) y dejo los tres destinos parados dias. " +
        "Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un comentario de bloque que NARRA precios viejos tampoco detiene", () => {
  // `lib/pricing.ts` tiene varios: parrafos `/** … */` que cuentan el bug de la
  // escalera vieja y citan Bs 890 y Bs 1.290. Son historia, no una promesa nueva.
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      `/**\n * Hasta el 2026-09-12 esto cotizaba 890 y 1290.\n * La escalera C metio el Crece de 550 en el medio.\n */\n${tabla(320, "390")}`,
      "docs: por que la tabla quedo asi",
    );
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      0,
      "conto los precios citados en un comentario como montos nuevos: con eso, documentar " +
        "por que un precio es el que es cuesta una publicacion. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("cambiar un monto de la tabla DETIENE, y el aviso dice QUE numero cambia", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, tabla(330, "390"), "el plan de entrada sube a 330");
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "publico un cambio de precio sin la firma. Salida: " + r.salida);
    assert.match(r.salida, /330/, "no nombro el monto nuevo: el aviso vuelve a ser 'toca una fuente de precio', que obliga a abrir el diff. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un monto que vive DENTRO de un texto tambien detiene", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, tabla(320, "420"), "el add-on pasa a Bs 420");
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "el precio del add-on viaja en un string, no en la tabla: igual es plata. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un MERGE que trae el cambio de monto tambien detiene — un merge sin `-m --first-parent` sale VACIO", () => {
  const dir = repoSembrado();
  try {
    git(dir, "checkout", "--quiet", "-b", "carril");
    commitear(dir, tabla(330, "390"), "el plan de entrada sube a 330");
    git(dir, "checkout", "--quiet", "main");
    git(dir, "merge", "--quiet", "--no-ff", "--no-edit", "carril");
    const merge = git(dir, "rev-parse", "HEAD");
    const r = preguntar(dir, merge);
    assert.equal(
      r.codigo,
      1,
      "el merge se leyo como si no cambiara nada: asi entra un precio nuevo en verde, " +
        "porque los medidores de varados devuelven merges. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("si no se puede mirar, NO dice que esta limpio: falla CERRADO", () => {
  const dir = repoSembrado();
  try {
    for (const caso of [["deadbeefdeadbeef"], []]) {
      const r = preguntar(dir, ...caso);
      assert.equal(
        r.codigo,
        2,
        `con ${caso.length ? "un sha ilegible" : "ningun sha"} contesto ${r.codigo} en vez de NO MEDIDO. ` +
          "'No pude preguntar' no es 'me dijeron que no cambia': publicaria un precio sin mirarlo. " +
          "Salida: " + r.salida,
      );
    }
    const r = preguntar("/no/existe/este/repo", "deadbeef");
    assert.equal(r.codigo, 2, "un repo que no existe tiene que salir NO MEDIDO. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
