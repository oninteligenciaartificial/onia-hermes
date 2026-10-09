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
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync, chmodSync } from "node:fs";
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
function sesion(rama, { env: extra = {}, sinCommitear = false, sinCambio = false, sinMarca = false } = {}) {
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
  // La marca del checkout de la madre (9-oct): sin ella, ONIA_AUTOSYNC_MAIN=1 no vale. Los casos «sin permiso»
  // no ponen la variable, así que la marca no les cambia nada.
  if (!sinMarca) writeFileSync(join(git(clon, "rev-parse", "--absolute-git-dir"), "onia-autosync-main"), "");
  const base = git(clon, "rev-parse", "HEAD");
  if (rama !== "main") git(clon, "switch", "-q", "-c", rama);
  if (!sinCambio) writeFileSync(join(clon, "cambio.md"), "el cambio que pidió Sergio Urcullo\n");
  if (!sinCommitear && !sinCambio) {
    git(clon, "add", ".");
    git(clon, "commit", "-qm", "feat: el cambio");
  }
  const correr = (mas = {}) => spawnSync("node", [AUTOSYNC], { cwd: clon, env: { ...env, ...mas }, encoding: "utf8" });
  const r = correr();
  const remota = (ref) =>
    spawnSync("git", ["rev-parse", "--verify", "-q", `refs/heads/${ref}`], { cwd: origin, env, encoding: "utf8" }).stdout.trim();
  return { r, base, dir, clon, git, correr, remota, cabeza: () => git(clon, "rev-parse", "HEAD"), mainRemoto: () => remota("main"),
    ramaLocal: () => git(clon, "symbolic-ref", "--short", "HEAD") };
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

// ── Revisión fuerte del 5-oct (dos revisores independientes) ──────────────────────────────────────

test("lo rescatado sale de main: una corrida CON permiso después, en el mismo clon, no lo publica", () => {
  const s = sesion("main", { sinCommitear: true });
  assert.equal(s.remota(RESCATE), s.cabeza());
  assert.equal(s.ramaLocal(), RESCATE, "la sesión quedó parada en su rama de rescate");
  assert.equal(s.git(s.clon, "rev-parse", "refs/heads/main"), s.base, "el main local volvió a origin/main");
  // Lo que no puede pasar es que el commit viaje SOLO, desde el main local, en la primera corrida con
  // permiso en ese clon (antes del arreglo seguía en el main local y se publicaba sin PR).
  const s2 = sesion("main", { sinCommitear: true });
  s2.git(s2.clon, "switch", "-q", "main");
  const r2 = s2.correr({ ONIA_AUTOSYNC_MAIN: "1" });
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.equal(s2.mainRemoto(), s2.base, "el main local no tenía el commit rescatado: no hay nada que publicar");
});

test("si la sesión reescribe su rama de rescate (rebase o amend), no se fuerza ni se pierde: va a otra rama", () => {
  const s = sesion("main", { sinCommitear: true });
  const primero = s.cabeza();
  writeFileSync(join(s.clon, "cambio.md"), "reescrito\n");
  s.git(s.clon, "commit", "-qa", "--amend", "-m", "feat: el cambio, reescrito");
  const r = s.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const sha = s.git(s.clon, "rev-parse", "--short=8", "HEAD");
  assert.equal(s.remota(`${RESCATE}-${sha}`), s.cabeza(), "el trabajo reescrito quedó en el remoto");
  assert.equal(s.remota(RESCATE), primero, "la rama de antes no se forzó");
  assert.equal(s.mainRemoto(), s.base);
  // La vuelta siguiente sigue en esa rama nueva: no crea otra por turno.
  assert.equal(s.ramaLocal(), `${RESCATE}-${sha}`);
  writeFileSync(join(s.clon, "otro.md"), "más\n");
  assert.equal(s.correr().status, 0);
  assert.equal(s.remota(`${RESCATE}-${sha}`), s.cabeza());
  const ramas = s.git(join(s.clon, "..", "origin.git"), "for-each-ref", "--format=%(refname)", "refs/heads/claude/");
  assert.equal(ramas.split("\n").length, 2, ramas);
});

test("un nombre de rama con $(…) es dato: no se ejecuta", () => {
  const rama = "claude/x$(touch${IFS}PWNED)";
  const s = sesion(rama);
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(existsSync(join(s.clon, "PWNED")), false);
  assert.equal(existsSync(join(s.dir, "PWNED")), false);
  assert.equal(s.remota(rama), s.cabeza(), "la rama se pusheó con su nombre tal cual");
  assert.equal(s.mainRemoto(), s.base);
});

test("con un tag llamado `main`, parada en main sin permiso, main del remoto no se mueve", () => {
  const dir = sesion("main", { sinCambio: true });
  dir.git(dir.clon, "tag", "main");
  writeFileSync(join(dir.clon, "cambio.md"), "con un tag ambiguo\n");
  const r = dir.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(dir.mainRemoto(), dir.base);
  assert.equal(dir.remota(RESCATE), dir.cabeza());
});

// Tercera pasada de revisión (5-oct): el hook NUNCA mueve el checkout de quien tiene permiso. El
// integrador corre en /root/loops/onia-hermes parado en main y aborta si no lo está (onia-loop.sh):
// sacarlo de main lo frenaba para siempre. El tsc de la app no se le exige en main: tiene sus gates.
test("con permiso y parada en main, el hook nunca la saca de main (el integrador aborta si no está ahí)", () => {
  const s = sesion("main", { env: { ONIA_LOOP_ID: "onia-cola" }, sinCambio: true });
  const bin = join(s.dir, "bin");
  mkdirSync(bin);
  writeFileSync(join(bin, "npx"), "#!/usr/bin/env bash\necho 'error TS2307' ; exit 2\n");
  chmodSync(join(bin, "npx"), 0o755);
  mkdirSync(join(s.clon, "web-factory", "apps", "site"), { recursive: true });
  writeFileSync(join(s.clon, "web-factory", "apps", "site", "pagina.ts"), "export const x = 1;\n");
  const r = s.correr({ ONIA_LOOP_ID: "onia-cola", PATH: `${bin}:${process.env.PATH}` });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(s.ramaLocal(), "main");
  assert.equal(s.mainRemoto(), s.cabeza(), "como antes de este cambio: el integrador publica main");
  assert.equal(s.remota(RESCATE), "");
});

test("una rama de rescate local con commits que HEAD no tiene no se pisa: se usa otra con el sha", () => {
  const s = sesion("main", { sinCommitear: true }); // A quedó en origin/<rescate>; la sesión, parada ahí
  const A = s.cabeza();
  writeFileSync(join(s.clon, "d.md"), "D, sin pushear\n");
  s.git(s.clon, "add", ".");
  s.git(s.clon, "commit", "-qm", "D");
  const D = s.cabeza();
  // En el mismo turno: vuelve a main, trae A por un merge (como un PR mergeado) y commitea E.
  s.git(s.clon, "switch", "-q", "main");
  s.git(s.clon, "merge", "-q", "--no-ff", A, "-m", "merge del PR de rescate");
  writeFileSync(join(s.clon, "e.md"), "E\n");
  s.git(s.clon, "add", ".");
  s.git(s.clon, "commit", "-qm", "E");
  const r = s.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(s.git(s.clon, "rev-parse", `refs/heads/${RESCATE}`), D, "D sigue en su rama local");
  const sha = s.git(s.clon, "rev-parse", "--short=8", "HEAD");
  assert.equal(s.remota(`${RESCATE}-${sha}`), s.cabeza(), "E quedó en el remoto con otro nombre");
  assert.equal(s.ramaLocal(), `${RESCATE}-${sha}`);
  assert.equal(s.mainRemoto(), s.base);
});

test("la rama de rescate queda con upstream: el `git push` de la sesión funciona sin argumentos", () => {
  const s = sesion("main", { sinCommitear: true });
  assert.equal(s.git(s.clon, "rev-parse", "--abbrev-ref", "@{u}"), `origin/${RESCATE}`);
});

test("ningún settings.local.json está versionado, en ninguna carpeta", () => {
  const r = spawnSync("git", ["ls-files", "--", "*settings.local.json"], { cwd: RAIZ, encoding: "utf8" });
  assert.equal(r.stdout.trim(), "");
  const sub = spawnSync("git", ["check-ignore", "-q", "web-factory/apps/onia-platform/.claude/settings.local.json"], { cwd: RAIZ, encoding: "utf8" });
  assert.equal(sub.status, 0, "también en las subcarpetas con su propio .claude/");
});

// Revisiones de la madre al #138 y al #173 (9-oct): ONIA_AUTOSYNC_MAIN lo heredan los procesos hijos de la madre,
// también los subagentes que trabajan en otros worktrees; y la madre misma corre en un worktree (`claude -w`).
// Por eso el permiso exige además una MARCA en el git-dir del checkout, que no se versiona ni se hereda.
test("con la variable pero sin la marca de su checkout, el permiso no vale", () => {
  const s = sesion("claude/un-carril", { env: { ONIA_AUTOSYNC_MAIN: "1" }, sinMarca: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.match(s.r.stdout, /permiso de main ignorado: este checkout no tiene la marca/);
  assert.equal(s.mainRemoto(), s.base);
});

test("el permiso de la madre no vale en el worktree de un subagente; en un worktree con SU marca, sí", () => {
  const s = sesion("main", { env: { ONIA_AUTOSYNC_MAIN: "1" }, sinCambio: true }); // el clon tiene la marca
  const env = entorno(join(s.dir, "gitconfig"), { ONIA_AUTOSYNC_MAIN: "1" });
  const enWt = (wt) => spawnSync("node", [AUTOSYNC], { cwd: wt, env, encoding: "utf8" });
  // Un subagente: hereda la variable, trabaja en su worktree, no tiene marca.
  const sub = join(s.dir, "worktree-subagente");
  s.git(s.clon, "worktree", "add", "-q", "-b", "claude/subagente", sub);
  writeFileSync(join(sub, "a-medias.md"), "trabajo de un subagente a medias\n");
  const r = enWt(sub);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /permiso de main ignorado/);
  assert.equal(s.mainRemoto(), s.base, "main no se movió");
  assert.equal(s.remota("claude/subagente"), s.git(sub, "rev-parse", "HEAD"), "la rama del subagente sí se pusheó");
  // La madre, como corre hoy: en su propio worktree (claude -w), con la marca en SU git-dir.
  const madre = join(s.dir, "worktree-madre");
  s.git(s.clon, "worktree", "add", "-q", "-b", "claude/madre", madre);
  writeFileSync(join(s.git(madre, "rev-parse", "--absolute-git-dir"), "onia-autosync-main"), "");
  writeFileSync(join(madre, "de-la-madre.md"), "revisado\n");
  const r2 = enWt(madre);
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.equal(s.mainRemoto(), s.git(madre, "rev-parse", "HEAD"), "en el checkout marcado el permiso vale");
});
