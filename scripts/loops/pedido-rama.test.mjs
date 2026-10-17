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
// nube (Lucía y Marca personal; #82 entró así con «Hoy soy odontóloga»). Entonces quedaron dos permisos
// (`ONIA_AUTOSYNC_MAIN=1` + marca para la madre, `ONIA_LOOP_ID=onia-cola` para el integrador).
//
// 17-oct (hallazgo P1 de Codex en #226): la regla nueva (AGENTS.md §4 «Quién mueve main») es que a main
// solo se llega por PR con CI verde y revisión de Codex, también desde la PC. Los dos permisos se
// quitaron, junto con el fast-forward de otras ramas. El hook pushea la rama ACTUAL y nada más: estas
// pruebas fijan que ni la variable, ni la marca, ni la identidad retirada habilitan main.
//
// Se corre con: node --test scripts/loops/pedido-rama.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
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
  // Por defecto se simula la nube (un contenedor por sesión: `add -A` como siempre). Las pruebas del checkout
  // compartido de la PC pasan CLAUDE_CODE_REMOTE: "false".
  return { ...env, CLAUDE_CODE_REMOTE: "true", CLAUDE_CODE_REMOTE_SESSION_ID: SESION, ...extra };
}

// Un origin y un clon con main en un commit base; la sesión trabaja en `rama` y suelta el turno.
// `sinCommitear`: el cambio queda en el árbol, como lo deja una sesión, y lo commitea el hook.
// `agregado`: un archivo que la sesión agregó al índice a mano antes de soltar el turno.
function sesion(rama, { env: extra = {}, sinCommitear = false, sinCambio = false, agregado = false } = {}) {
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
  // La marca que la madre ponía en su checkout hasta el 16-oct: se deja puesta a propósito, para probar que
  // ni con ella (y con la variable) el hook mueve main.
  writeFileSync(join(git(clon, "rev-parse", "--absolute-git-dir"), "onia-autosync-main"), "");
  const base = git(clon, "rev-parse", "HEAD");
  if (rama !== "main") git(clon, "switch", "-q", "-c", rama);
  if (!sinCambio) writeFileSync(join(clon, "cambio.md"), "el cambio que pidió Sergio Urcullo\n");
  if (!sinCommitear && !sinCambio) {
    git(clon, "add", ".");
    git(clon, "commit", "-qm", "feat: el cambio");
  }
  if (agregado) {
    writeFileSync(join(clon, "agregado.md"), "lo que la sesión agregó a mano\n");
    git(clon, "add", "agregado.md");
  }
  const correr = (mas = {}) => spawnSync("node", [AUTOSYNC], { cwd: clon, env: { ...env, ...mas }, encoding: "utf8" });
  const r = correr();
  const remota = (ref) =>
    spawnSync("git", ["rev-parse", "--verify", "-q", `refs/heads/${ref}`], { cwd: origin, env, encoding: "utf8" }).stdout.trim();
  return { r, base, dir, clon, git, correr, remota, cabeza: () => git(clon, "rev-parse", "HEAD"), mainRemoto: () => remota("main"),
    ramaLocal: () => git(clon, "symbolic-ref", "--short", "HEAD") };
}

const RESCATE = `claude/autosync-${SESION}`;

// Todo lo que alguna vez habilitó main: la variable de la madre (con y sin marca en el git-dir), la identidad
// retirada del integrador y valores parecidos. Ninguno hace nada.
const PERMISOS_VIEJOS = [
  ["ONIA_AUTOSYNC_MAIN=1 con la marca de la madre", { ONIA_AUTOSYNC_MAIN: "1" }],
  ["ONIA_LOOP_ID=onia-cola (integrador retirado)", { ONIA_LOOP_ID: "onia-cola" }],
  ["las dos a la vez", { ONIA_AUTOSYNC_MAIN: "1", ONIA_LOOP_ID: "onia-cola" }],
  ["ONIA_AUTOSYNC_MAIN=true", { ONIA_AUTOSYNC_MAIN: "true" }],
  ["ONIA_LOOP_ID=web-venta", { ONIA_LOOP_ID: "web-venta" }],
];

test("una rama de trabajo se pushea y main NO avanza", () => {
  const s = sesion("claude/un-carril");
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.remota("claude/un-carril"), s.cabeza(), "la rama queda en el remoto, para su PR");
  assert.equal(s.mainRemoto(), s.base, "main sigue donde estaba");
  assert.match(s.r.stdout, /push -> origin\/claude\/un-carril/);
});

test("un pedido con el prefijo `claude/` tampoco adelanta main", () => {
  const s = sesion("claude/pedido-p_1a2b3c4d");
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.mainRemoto(), s.base);
});

// (a)+(c) en una rama de trabajo: ningún permiso viejo habilita main ni un fast-forward.
for (const [nombre, env] of PERMISOS_VIEJOS) {
  test(`en una rama claude/*, ${nombre} ya no habilita nada: se pushea la rama y main no avanza`, () => {
    const s = sesion("claude/un-carril", { env });
    assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
    assert.equal(s.remota("claude/un-carril"), s.cabeza(), "la rama sí se pushea");
    assert.equal(s.mainRemoto(), s.base, "main sigue donde estaba");
    assert.doesNotMatch(s.r.stdout, /fast-forward|main al día|permiso/);
  });
}

// (a)+(c) parado EN main: nunca se pushea main; el trabajo va a la rama de rescate.
for (const [nombre, env] of [["sin ningún permiso", {}], ...PERMISOS_VIEJOS]) {
  test(`parada EN main, ${nombre}: main no se pushea y el trabajo queda en claude/autosync-<sesión>`, () => {
    const s = sesion("main", { env, sinCommitear: true });
    assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
    assert.equal(s.mainRemoto(), s.base, "main del remoto no se toca");
    assert.equal(s.remota(RESCATE), s.cabeza(), "el commit del hook quedó a salvo en la rama de rescate");
    assert.equal(s.git(s.clon, "rev-parse", "refs/heads/main"), s.base, "el main local volvió a origin/main");
    assert.match(s.r.stdout, /main solo por PR/);
    assert.ok(s.r.stdout.includes(`quedaron en origin/${RESCATE}`), s.r.stdout);
  });
}

test("la vuelta siguiente, parada en la rama de rescate, la sigue sin forzar nada", () => {
  const s = sesion("main", { sinCommitear: true });
  writeFileSync(join(s.clon, "otro.md"), "más trabajo\n");
  const r2 = s.correr();
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.equal(s.remota(RESCATE), s.cabeza());
  assert.equal(s.mainRemoto(), s.base);
});

// (d) el fast-forward de otra rama no existe: con todos los permisos viejos puestos, el hook solo toca la rama actual.
test("no hace fast-forward de otra rama: la rama ajena y main siguen donde estaban", () => {
  const s = sesion("claude/un-carril", { env: { ONIA_AUTOSYNC_MAIN: "1", ONIA_LOOP_ID: "onia-cola" } });
  s.git(s.clon, "push", "-q", "origin", `${s.base}:refs/heads/claude/otra`);
  writeFileSync(join(s.clon, "mas.md"), "más trabajo en la rama actual\n");
  const r = s.correr({ ONIA_AUTOSYNC_MAIN: "1", ONIA_LOOP_ID: "onia-cola" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(s.remota("claude/un-carril"), s.cabeza(), "la rama actual sí avanza");
  assert.equal(s.remota("claude/otra"), s.base, "la otra rama no se adelanta");
  assert.equal(s.mainRemoto(), s.base, "main tampoco");
  assert.doesNotMatch(r.stdout, /fast-forward/);
});

for (const rama of ["pedido/p_1a2b3c4d", "respuesta/p_1a2b3c4d"]) {
  test(`una rama ${rama.split("/")[0]}/* se pushea y main no avanza, ni con los permisos viejos`, () => {
    const s = sesion(rama, { env: { ONIA_AUTOSYNC_MAIN: "1" } });
    assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
    assert.equal(s.remota(rama), s.cabeza(), "la rama del pedido queda en el remoto, para su PR");
    assert.equal(s.mainRemoto(), s.base, "main sigue donde estaba");
  });
}

test("parada en main y sin nada nuevo: no crea ninguna rama", () => {
  const s = sesion("main", { sinCambio: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.remota(RESCATE), "");
  assert.equal(s.mainRemoto(), s.base);
  assert.match(s.r.stdout, /main solo por PR/);
});

test("en la PC (sin id de sesión de la nube) la rama de rescate lleva el nombre de la máquina", () => {
  const s = sesion("main", { env: { CLAUDE_CODE_REMOTE_SESSION_ID: "" } });
  assert.equal(s.mainRemoto(), s.base);
  const ramas = s.git(join(s.clon, "..", "origin.git"), "for-each-ref", "--format=%(refname:short)", "refs/heads/claude/");
  assert.match(ramas, /^claude\/autosync-[A-Za-z0-9_-]+$/);
});

// Ningún permiso de mover main puede entrar a la configuración versionada: el hook ya no lee ninguno, y si
// alguien lo reintrodujera, vivir en .claude/settings.json se lo daría a todas las sesiones, también a las de la nube.
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
  // Lo que no puede pasar es que el commit viaje SOLO, desde el main local, en la corrida siguiente de ese
  // clon (antes del arreglo seguía en el main local y se publicaba sin PR). Ahora, además, ni con la variable.
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

test("con un tag llamado `main`, parada en main, main del remoto no se mueve", () => {
  const dir = sesion("main", { sinCambio: true });
  dir.git(dir.clon, "tag", "main");
  writeFileSync(join(dir.clon, "cambio.md"), "con un tag ambiguo\n");
  const r = dir.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(dir.mainRemoto(), dir.base);
  assert.equal(dir.remota(RESCATE), dir.cabeza());
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

// Revisiones de la madre al #138 y al #173 (9-oct) y hallazgo P1 de Codex en #226 (17-oct): la madre corre en
// un worktree (`claude -w`) y sus subagentes en otros. Con la variable heredada, la marca en SU git-dir y
// ninguna otra señal, ningún worktree mueve main: se pushea la rama de cada uno y nada más.
test("ni en el worktree de la madre (variable + marca en su git-dir) ni en el de un subagente se mueve main", () => {
  const s = sesion("main", { env: { ONIA_AUTOSYNC_MAIN: "1" }, sinCambio: true }); // el clon tiene la marca
  const env = entorno(join(s.dir, "gitconfig"), { ONIA_AUTOSYNC_MAIN: "1" });
  const enWt = (wt) => spawnSync("node", [AUTOSYNC], { cwd: wt, env, encoding: "utf8" });
  const sub = join(s.dir, "worktree-subagente");
  s.git(s.clon, "worktree", "add", "-q", "-b", "claude/subagente", sub);
  writeFileSync(join(sub, "a-medias.md"), "trabajo de un subagente a medias\n");
  const r = enWt(sub);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(s.remota("claude/subagente"), s.git(sub, "rev-parse", "HEAD"), "la rama del subagente sí se pusheó");
  const madre = join(s.dir, "worktree-madre");
  s.git(s.clon, "worktree", "add", "-q", "-b", "claude/madre", madre);
  writeFileSync(join(s.git(madre, "rev-parse", "--absolute-git-dir"), "onia-autosync-main"), "");
  writeFileSync(join(madre, "de-la-madre.md"), "revisado\n");
  const r2 = enWt(madre);
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.equal(s.remota("claude/madre"), s.git(madre, "rev-parse", "HEAD"), "la rama de la madre sí se pushea");
  assert.equal(s.mainRemoto(), s.base, "main no se movió, ni con la marca");
});

// P2 de Codex en #226 (17-oct): `add -A` en el hook Stop subía el trabajo de otras tareas cuando varias sesiones
// comparten el checkout principal de la PC (AGENTS.md §4 «Carriles»: rutas explícitas). En ese checkout
// (PC = CLAUDE_CODE_REMOTE distinto de "true"; principal = git-dir igual a git-common-dir) solo se commitea lo
// que la sesión ya agregó al índice. Un worktree enlazado de la PC y la nube siguen con `add -A`.
const PC = { CLAUDE_CODE_REMOTE: "false" };
const archivosDelCommit = (s, cwd, ref = "HEAD") => s.git(cwd, "show", "--name-only", "--format=", ref).split("\n").filter(Boolean);

test("PC + checkout principal + archivo sin agregar: no se commitea, y lo ya commiteado sí se pushea", () => {
  const s = sesion("claude/un-carril", { env: PC, sinCommitear: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.match(s.r.stdout, /checkout compartido, sin staging automático/);
  assert.equal(s.cabeza(), s.base, "no se creó ningún commit");
  assert.match(s.git(s.clon, "status", "--porcelain"), /\?\? cambio\.md/, "el archivo sigue sin agregar");
  assert.equal(s.remota("claude/un-carril"), s.base, "la rama igual se pushea (sin commits nuevos)");
  assert.equal(s.mainRemoto(), s.base);
});

test("PC + checkout principal + archivo agregado al índice: se commitea solo ese", () => {
  const s = sesion("claude/un-carril", { env: PC, sinCommitear: true, agregado: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.notEqual(s.cabeza(), s.base, "se creó el commit");
  assert.deepEqual(archivosDelCommit(s, s.clon), ["agregado.md"], "solo lo agregado a mano");
  assert.match(s.git(s.clon, "status", "--porcelain"), /\?\? cambio\.md/, "lo demás queda fuera");
  assert.equal(s.remota("claude/un-carril"), s.cabeza(), "y la rama se pushea");
  assert.doesNotMatch(s.r.stdout, /sin staging automático/);
});

test("PC + worktree enlazado: add -A como antes", () => {
  const s = sesion("claude/un-carril", { env: PC, sinCambio: true });
  const env = entorno(join(s.dir, "gitconfig"), PC);
  const wt = join(s.dir, "worktree-enlazado");
  s.git(s.clon, "worktree", "add", "-q", "-b", "claude/enlazado", wt);
  writeFileSync(join(wt, "sin-agregar.md"), "trabajo de una sola sesión\n");
  const r = spawnSync("node", [AUTOSYNC], { cwd: wt, env, encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(archivosDelCommit(s, wt), ["sin-agregar.md"], "se agregó solo, sin que la sesión lo pidiera");
  assert.equal(s.remota("claude/enlazado"), s.git(wt, "rev-parse", "HEAD"));
  assert.doesNotMatch(r.stdout, /sin staging automático/);
});

test("CLAUDE_CODE_REMOTE=true (nube): add -A como antes, aunque sea el checkout principal", () => {
  const s = sesion("claude/un-carril", { env: { CLAUDE_CODE_REMOTE: "true" }, sinCommitear: true });
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.deepEqual(archivosDelCommit(s, s.clon), ["cambio.md"], "el hook agregó y commiteó el archivo");
  assert.equal(s.remota("claude/un-carril"), s.cabeza());
  assert.doesNotMatch(s.r.stdout, /sin staging automático/);
});
