// pedido-rama.test.mjs — el hook Stop (git-autosync.js) nunca mete trabajo sin revisar a main.
//
// POR QUÉ EXISTE (2026-10-02). Un pedido de Sergio Urcullo corre en una rutina de Claude en la nube
// que clona onia-hermes y carga su hook Stop: `node scripts/git-autosync.js`. Ese hook pushea la rama
// y, si main es ancestro, hacía FAST-FORWARD de main. El cambio de un pedido —que tiene que quedar en
// un PR en borrador hasta que él lo apruebe— entraba a main al terminar el turno, y main alimenta el
// deploy del VPS y el de Vercel. La primera guarda miraba el NOMBRE de la rama (`pedido/*`,
// `respuesta/*`): el tercer MEDIUM de la revisión de la madre v2 (3-oct).
//
// 5-oct: Sergio Urcullo eligió que main avance SOLO por PR revisado. Medido ese día: desde el 28-sep,
// 48 de los 78 avances de main entraron por el fast-forward del autosync, 23 desde sesiones de la
// nube (Lucía y Marca personal; #82 entró así con «Hoy soy odontóloga»). Ahora el hook pushea la rama
// y no toca main, salvo con permiso: `ONIA_AUTOSYNC_MAIN=1` (la madre, en la PC) u
// `ONIA_LOOP_ID=onia-cola` (el integrador). Ya no depende del nombre de la rama.
//
// Se corre con: node --test scripts/loops/pedido-rama.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const AUTOSYNC = resolve(AQUI, "..", "git-autosync.js");
const SESION = "session_01AbCdEfGhIjKlMnOpQrStUv";

// El entorno de la prueba no hereda los permisos de quien la corre: en la PC de la madre
// ONIA_AUTOSYNC_MAIN=1 está puesto, y con él los casos «sin permiso» darían verde por error.
function entorno(gitconfig, extra) {
  const env = { ...process.env, GIT_CONFIG_GLOBAL: gitconfig, GIT_CONFIG_NOSYSTEM: "1" };
  for (const k of ["ONIA_AUTOSYNC_MAIN", "ONIA_LOOP_ID", "CLAUDE_CODE_REMOTE_SESSION_ID", "CLAUDE_CODE_SESSION_ID"]) delete env[k];
  return { ...env, CLAUDE_CODE_REMOTE_SESSION_ID: SESION, ...extra };
}

// Un origin y un clon con main en un commit base; la sesión trabaja en `rama` y suelta el turno.
// `sinCommitear`: el cambio queda en el árbol, como lo deja una sesión, y lo commitea el hook.
function sesion(rama, { env: extra = {}, sinCommitear = false, sinCambio = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "autosync-main-"));
  const gitconfig = join(dir, "gitconfig");
  writeFileSync(gitconfig, "[user]\n\tname = Prueba\n\temail = prueba@example.com\n[commit]\n\tgpgsign = false\n[init]\n\tdefaultBranch = main\n");
  const env = entorno(gitconfig, extra);
  const git = (cwd, ...args) => {
    const r = spawnSync("git", args, { cwd, env, encoding: "utf8" });
    if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr}`);
    return r.stdout.trim();
  };
  const origin = join(dir, "origin.git");
  git(dir, "init", "-q", "--bare", origin);
  const clon = join(dir, "clon");
  git(dir, "init", "-q", clon);
  writeFileSync(join(clon, "LEEME.md"), "base\n");
  git(clon, "add", ".");
  git(clon, "commit", "-qm", "base");
  git(clon, "remote", "add", "origin", origin);
  git(clon, "push", "-q", "-u", "origin", "main");
  const base = git(clon, "rev-parse", "HEAD");
  if (rama !== "main") git(clon, "switch", "-q", "-c", rama);
  if (!sinCambio) writeFileSync(join(clon, "cambio.md"), "el cambio que pidió Sergio Urcullo\n");
  if (!sinCommitear && !sinCambio) {
    git(clon, "add", ".");
    git(clon, "commit", "-qm", "feat: el cambio");
  }
  const correr = () => spawnSync("node", [AUTOSYNC], { cwd: clon, env, encoding: "utf8" });
  const r = correr();
  const remota = (ref) =>
    spawnSync("git", ["rev-parse", "--verify", "-q", `refs/heads/${ref}`], { cwd: origin, env, encoding: "utf8" }).stdout.trim();
  return { r, base, clon, git, correr, remota, cabeza: () => git(clon, "rev-parse", "HEAD"), mainRemoto: () => remota("main") };
}

const RESCATE = `claude/autosync-${SESION}`;

test("sin permiso, una rama de trabajo se pushea pero main NO avanza", () => {
  const s = sesion("claude/un-carril");
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.remota("claude/un-carril"), s.cabeza(), "la rama queda en el remoto, para su PR");
  assert.equal(s.mainRemoto(), s.base, "main sigue donde estaba");
  assert.match(s.r.stdout, /main no se toca: entra por PR revisado/);
});

test("ya no depende del nombre: un pedido con el prefijo viejo `claude/` tampoco adelanta main", () => {
  const s = sesion("claude/pedido-p_1a2b3c4d");
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.mainRemoto(), s.base);
});

for (const [nombre, env] of [
  ["la madre (ONIA_AUTOSYNC_MAIN=1)", { ONIA_AUTOSYNC_MAIN: "1" }],
  ["el integrador (ONIA_LOOP_ID=onia-cola)", { ONIA_LOOP_ID: "onia-cola" }],
]) {
  test(`con permiso de ${nombre}, main sí avanza por fast-forward (como antes)`, () => {
    const s = sesion("claude/un-carril", { env });
    assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
    assert.equal(s.mainRemoto(), s.cabeza(), "main al día con la rama");
    assert.match(s.r.stdout, /main al día \(fast-forward\)/);
  });
}

for (const env of [{ ONIA_AUTOSYNC_MAIN: "true" }, { ONIA_AUTOSYNC_MAIN: "0" }, { ONIA_LOOP_ID: "web-venta" }]) {
  test(`un permiso que no es exactamente el pactado no habilita main (${JSON.stringify(env)})`, () => {
    const s = sesion("claude/un-carril", { env });
    assert.equal(s.mainRemoto(), s.base);
  });
}

for (const rama of ["pedido/p_1a2b3c4d", "respuesta/p_1a2b3c4d"]) {
  test(`una rama ${rama.split("/")[0]}/* nunca adelanta main, ni con permiso`, () => {
    const s = sesion(rama, { env: { ONIA_AUTOSYNC_MAIN: "1" } });
    assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
    assert.match(s.r.stdout, /rama de pedido: se pushea, main NO se toca/);
    assert.equal(s.remota(rama), s.cabeza(), "la rama del pedido queda en el remoto, para su PR");
    assert.equal(s.mainRemoto(), s.base, "main sigue donde estaba");
  });
}

test("parada EN main y sin permiso: no pushea main; el trabajo queda en claude/autosync-<sesión>", () => {
  const s = sesion("main", { sinCommitear: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.mainRemoto(), s.base, "main del remoto no se toca");
  assert.equal(s.remota(RESCATE), s.cabeza(), "el commit del hook quedó a salvo en la rama de rescate");
  assert.match(s.r.stdout, new RegExp(`quedaron en origin/${RESCATE.replace(/[/]/g, "\\/")}`));
  // La vuelta siguiente sigue en la misma rama de rescate, sin forzar nada.
  writeFileSync(join(s.clon, "otro.md"), "más trabajo\n");
  const r2 = s.correr();
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.equal(s.remota(RESCATE), s.cabeza());
  assert.equal(s.mainRemoto(), s.base);
});

test("parada en main sin permiso y sin nada nuevo: no crea ninguna rama", () => {
  const s = sesion("main", { sinCambio: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.remota(RESCATE), "");
  assert.equal(s.mainRemoto(), s.base);
});

test("en la PC (sin id de sesión de la nube) la rama de rescate lleva el nombre de la máquina", () => {
  const s = sesion("main", { env: { CLAUDE_CODE_REMOTE_SESSION_ID: "" } });
  assert.equal(s.mainRemoto(), s.base);
  const ramas = s.git(join(s.clon, "..", "origin.git"), "for-each-ref", "--format=%(refname:short)", "refs/heads/claude/");
  assert.match(ramas, /^claude\/autosync-[A-Za-z0-9_-]+$/);
});

test("parada en main CON permiso: pushea main como antes", () => {
  const s = sesion("main", { env: { ONIA_AUTOSYNC_MAIN: "1" } });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.mainRemoto(), s.cabeza());
  assert.equal(s.remota(RESCATE), "");
});

// El permiso de mover main es de UNA máquina (la PC de la madre) y vive fuera del repo. Si entrara a la
// configuración versionada, el autosync se lo daría a todas las sesiones, también a las de la nube.
const RAIZ = resolve(AQUI, "..", "..");
test("el permiso de mover main no está en la configuración versionada", () => {
  const compartida = readFileSync(join(RAIZ, ".claude", "settings.json"), "utf8");
  assert.doesNotMatch(compartida, /ONIA_AUTOSYNC_MAIN|ONIA_LOOP_ID/);
  const r = spawnSync("git", ["check-ignore", "-q", ".claude/settings.local.json"], { cwd: RAIZ, encoding: "utf8" });
  assert.equal(r.status, 0, "settings.local.json (la config de cada máquina) tiene que estar en .gitignore");
});
