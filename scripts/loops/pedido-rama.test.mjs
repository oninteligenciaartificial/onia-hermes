// pedido-rama.test.mjs — el trabajo de un pedido de Hermes nunca entra solo a main.
//
// POR QUÉ EXISTE (2026-10-02). Un pedido de Sergio Urcullo corre en una rutina de Claude en la nube
// que clona onia-hermes y carga su hook Stop: `node scripts/git-autosync.js`. Ese hook pushea la rama
// y, si main es ancestro, hace FAST-FORWARD de main. El cambio de un pedido —que tiene que quedar en
// un PR en borrador hasta que él lo apruebe— entraba a main al terminar el turno, y main alimenta el
// deploy del VPS y el de Vercel. Estos casos fijan que una rama `pedido/*` o `respuesta/*` se pushea
// pero nunca adelanta main, y que una rama cualquiera lo sigue haciendo (la prueba distingue).
//
// Se corre con: node --test scripts/loops/pedido-rama.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const AUTOSYNC = resolve(AQUI, "..", "git-autosync.js");

function sesionEnLaNube(rama) {
  const dir = mkdtempSync(join(tmpdir(), "pedido-rama-"));
  const gitconfig = join(dir, "gitconfig");
  writeFileSync(gitconfig, "[user]\n\tname = Prueba\n\temail = prueba@example.com\n[commit]\n\tgpgsign = false\n[init]\n\tdefaultBranch = main\n");
  const env = { ...process.env, GIT_CONFIG_GLOBAL: gitconfig, GIT_CONFIG_NOSYSTEM: "1" };
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
  git(clon, "switch", "-q", "-c", rama);
  writeFileSync(join(clon, "cambio.md"), "el cambio que pidió Sergio Urcullo\n");
  git(clon, "add", ".");
  git(clon, "commit", "-qm", "feat: el cambio del pedido");
  const r = spawnSync("node", [AUTOSYNC], { cwd: clon, env, encoding: "utf8" });
  return { r, base, cabeza: git(clon, "rev-parse", "HEAD"), mainRemoto: git(origin, "rev-parse", "main"),
    ramaRemota: spawnSync("git", ["rev-parse", "--verify", "-q", `refs/heads/${rama}`], { cwd: origin, env, encoding: "utf8" }).stdout.trim() };
}

for (const rama of ["pedido/p_1a2b3c4d", "respuesta/p_1a2b3c4d", "orquesta/marca-12"]) {
  test(`una rama ${rama.split("/")[0]}/* se pushea pero NO adelanta main`, () => {
    const s = sesionEnLaNube(rama);
    assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
    assert.match(s.r.stdout, /rama de pedido: se pushea, main NO se toca/);
    assert.equal(s.ramaRemota, s.cabeza, "la rama del pedido queda en el remoto, para su PR");
    assert.equal(s.mainRemoto, s.base, "main sigue donde estaba");
  });
}

test("control: una rama cualquiera sí adelanta main (por eso hace falta la guarda)", () => {
  const s = sesionEnLaNube("claude/pedido-p_1a2b3c4d");
  assert.equal(s.r.status, 0, s.r.stdout + s.r.stderr);
  assert.equal(s.mainRemoto, s.cabeza, "con el prefijo viejo, el pedido entraba solo a main");
});
