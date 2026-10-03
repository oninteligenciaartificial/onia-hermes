// pedido-respuesta.test.mjs — la respuesta de Claude a un pedido vuelve a Telegram por la aduana.
//
// POR QUÉ EXISTE. El pedido sale de Hermes a una rutina de Claude en la nube (pedido-claude.sh). Desde
// el 2-oct la respuesta vuelve SIN ningún token de Actions: la sesión la deja como el mensaje de un
// commit sin archivos en la rama `respuesta/<id>`, y respuestas-pedidos.sh (cron del VPS) la busca y
// la entrega por la aduana. Estos casos fijan que:
//   - solo se responden pedidos que salieron de Hermes, una vez por estado, y por la aduana;
//   - lo que llega es texto: escapado para el HTML de Telegram, nunca ejecutado, con tope;
//   - el VPS baja SOLO el commit, nunca archivos, y rechaza un commit con archivos o con historia;
//   - cada commit se mira una vez, y la rama se borra al entregarla.
// Contra un origin local (file://) con los filtros activados, como GitHub.
//
// Se corre con: node --test scripts/loops/pedido-respuesta.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(AQUI, "respuestas-pedidos.sh");
const ID = "p_1a2b3c4d";
// Un link con el largo de los de verdad (session_ + 24): con uno de juguete («session_01XYZ») la
// prueba de los 90 bytes pasaba y en producción el link de «necesita tu ok» quedaba cortado.
const SESION = "session_01AbCdEfGhIjKlMnOpQrStUv";
const URL_REAL = `https://claude.ai/code/${SESION}`;
const VACIO = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

function banco({ tgFalla = false, horasAtras = 1, url = URL_REAL, ids = [ID] } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "respuesta-"));
  const gitconfig = join(dir, "gitconfig");
  writeFileSync(gitconfig, "[user]\n\tname = Prueba\n\temail = prueba@example.com\n[commit]\n\tgpgsign = false\n[init]\n\tdefaultBranch = main\n");
  const env = { ...process.env, GIT_CONFIG_GLOBAL: gitconfig, GIT_CONFIG_NOSYSTEM: "1" };
  const git = (cwd, args, input) => {
    const r = spawnSync("git", args, { cwd, env, input, encoding: "utf8" });
    if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr}`);
    return r.stdout.trim();
  };
  const origin = join(dir, "origin.git");
  git(dir, ["init", "-q", "--bare", origin]);
  git(origin, ["config", "uploadpack.allowFilter", "true"]);
  const nube = join(dir, "nube"); // el clon de la sesión de la rutina
  git(dir, ["init", "-q", nube]);
  writeFileSync(join(nube, "grande.bin"), Buffer.alloc(512 * 1024, 7));
  git(nube, ["add", "grande.bin"]);
  git(nube, ["commit", "-qm", "base"]);
  git(nube, ["remote", "add", "origin", origin]);
  git(nube, ["push", "-q", "origin", "HEAD:refs/heads/main"]);

  const estado = join(dir, "pedidos");
  mkdirSync(estado);
  const ts = Math.floor(Date.now() / 1000) - horasAtras * 3600;
  writeFileSync(
    join(estado, "pedidos.tsv"),
    ids.map((i) => `${ts}\t${i}\tplataforma\tabc123\t${SESION}\t${url}\n`).join(""),
  );
  const tg = join(dir, "tg.sh");
  writeFileSync(
    tg,
    `#!/usr/bin/env bash
n=$(cat ${dir}/envios 2>/dev/null || echo 0); echo $((n + 1)) > ${dir}/envios
printf '%s|%s|%s|%s\\n' "$ONIA_AVISO" "$ONIA_AVISO_CLAVE" "$ONIA_AVISO_EMISOR" "\${ONIA_AVISO_AHORA:-}" > ${dir}/tg-env.txt
printf '%s' "$1" > ${dir}/tg-msg.txt
[ -f ${dir}/tg-falla ] && exit 1
exit 0
`,
  );
  chmodSync(tg, 0o755);
  if (tgFalla) writeFileSync(join(dir, "tg-falla"), "");

  // Lo que hace la sesión del pedido, tal cual lo pide el prompt de la rutina (TELEGRAM_COMMAND_CENTER.md §5).
  const responder = (id, est, texto, { rama = id, primera = `respuesta ${id} ${est}` } = {}) => {
    const f = join(dir, "respuesta.txt");
    writeFileSync(f, `${primera}\n\n${texto}\n`);
    const arbol = git(nube, ["mktree"], "");
    const c = git(nube, ["commit-tree", arbol, "-F", f]);
    git(nube, ["push", "-q", "-f", "origin", `${c}:refs/heads/respuesta/${rama}`]);
    return c;
  };
  // Lo que podría hacer mal: commitear sobre el repo entero, o empujar un objeto armado a mano.
  const empujarCommit = (rama, c) => git(nube, ["push", "-q", "-f", "origin", `${c}:refs/heads/respuesta/${rama}`]);
  const commitCrudo = (texto) => git(nube, ["hash-object", "-t", "commit", "-w", "--stdin"], texto);

  const correr = (args = [], extra = {}) =>
    spawnSync("bash", [SCRIPT, ...args], {
      env: { ...env, ONIA_PEDIDOS_ESTADO: estado, ONIA_TG: tg, ONIA_PEDIDOS_REPO_URL: `file://${origin}`, ...extra },
      encoding: "utf8",
    });
  const ramas = () => git(origin, ["for-each-ref", "--format=%(refname)", "refs/heads/respuesta/"]);
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  const objetos = () => git(join(estado, "respuestas.git"), ["cat-file", "--batch-all-objects", "--batch-check"]);
  return { dir, estado, nube, git, responder, empujarCommit, commitCrudo, correr, ramas, leer, objetos,
    envios: () => Number(leer("envios") || 0) };
}

test("la respuesta de un pedido de Hermes sale por la aduana, como interrupción con clave propia", () => {
  const b = banco();
  b.responder(ID, "listo", "Listo: el botón ya confirma. PR #91 abierto en borrador.");
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /✅ p_1a2b3c4d: respuesta «listo» entregada/);
  assert.equal(b.leer("tg-env.txt").trim(), `interrumpe|pedido-${ID}-listo|claude|`);
  const msg = b.leer("tg-msg.txt");
  assert.match(msg, new RegExp(`^✅ Listo · p_1a2b3c4d · ${reEsc(URL_REAL)}\\n<b>Claude terminó tu pedido</b> \\(plataforma\\)\\n\\nListo: el botón ya confirma\\.`));
  assert.match(b.leer("pedidos/respuestas.tsv"), new RegExp(`\\t${ID}\\tlisto\\n$`));
  assert.equal(b.ramas(), "", "al entregarla, la rama respuesta/<id> se borra");
});

test("respeta la noche y sus bloques: nunca pide ONIA_AVISO_AHORA", () => {
  const b = banco();
  b.responder(ID, "necesita-ok", "¿Lo mergeo?");
  b.correr();
  assert.ok(b.leer("tg-env.txt").trim().endsWith("|"), "ONIA_AVISO_AHORA tiene que ir vacío");
  assert.match(b.leer("tg-msg.txt"), /^🙋 Falta tu ok · p_1a2b3c4d · /);
});

test("baja SOLO el commit: aunque la rama traiga el repo entero, ningún archivo llega al VPS", () => {
  const b = banco();
  // El error posible de la sesión: commitear la respuesta encima de main, con sus archivos.
  const c = b.git(b.nube, ["commit-tree", "HEAD^{tree}", "-p", "HEAD", "-m", `respuesta ${ID} listo\n\nHola`]);
  b.empujarCommit(ID, c);
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /forma inválida \(el commit trae archivos/);
  assert.equal(b.envios(), 0);
  assert.doesNotMatch(b.objetos(), / blob /, "no se bajó ningún archivo");
  assert.doesNotMatch(b.objetos(), / tree /, "ni siquiera el árbol");
});

test("un commit con historia (con padre) no se entrega, aunque su árbol esté vacío", () => {
  const b = banco();
  const vacio = b.git(b.nube, ["mktree"], "");
  const c = b.git(b.nube, ["commit-tree", vacio, "-p", "HEAD", "-m", `respuesta ${ID} listo\n\nHola`]);
  b.empujarCommit(ID, c);
  const r = b.correr();
  assert.match(r.stdout, /forma inválida \(el commit tiene padre/);
  assert.equal(b.envios(), 0);
});

test("la firma de la sesión (gpgsig) no estorba", () => {
  const b = banco();
  const firma = "gpgsig -----BEGIN SSH SIGNATURE-----\n U1NIU0lHAAAAAQAAADMAAAALc3NoLWVkMjU1MTk\n -----END SSH SIGNATURE-----";
  const c = b.commitCrudo(
    `tree ${VACIO}\nauthor Claude <noreply@anthropic.com> 1790946558 +0000\ncommitter Claude <noreply@anthropic.com> 1790946558 +0000\n${firma}\n\nrespuesta ${ID} listo\n\nFirmado y entregado.\n`,
  );
  b.empujarCommit(ID, c);
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(b.leer("tg-msg.txt"), /Firmado y entregado\.$/);
});

test("un pedido que no salió de Hermes no le escribe nada, y su rama no se toca", () => {
  const b = banco();
  b.responder("p_ffffffff", "listo", "hola");
  b.responder(ID, "necesita-ok", "¿Sigo?"); // hay un pedido abierto: el script sí consulta
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(b.envios(), 1);
  assert.doesNotMatch(b.leer("tg-msg.txt"), /p_ffffffff/);
  assert.equal(b.ramas(), "refs/heads/respuesta/p_ffffffff", "lo que no es nuestro no se borra");
});

test("ramas con otra forma, o un id distinto adentro del mensaje: no le escribe nada", () => {
  const b = banco();
  b.responder(ID, "listo", "x", { rama: "otra-cosa" });
  b.responder(ID, "listo", "x", { rama: "p_1A2B3C4D" });
  assert.equal(b.correr().status, 0);
  assert.equal(b.envios(), 0);
  b.responder(ID, "listo", "x", { primera: "respuesta p_00000000 listo" });
  assert.match(b.correr().stdout, /el id del mensaje no es el de la rama/);
  b.responder(ID, "listo", "x", { primera: `respuesta ${ID} cualquiera` });
  assert.match(b.correr().stdout, /la primera línea no es/);
  b.responder(ID, "listo", "   ");
  assert.match(b.correr().stdout, /respuesta vacía/);
  assert.equal(b.envios(), 0);
});

test("cada commit se mira una vez: uno inválido no se vuelve a bajar en cada vuelta", () => {
  const b = banco({ ids: [ID, "p_0000000a"] });
  const c = b.git(b.nube, ["commit-tree", "HEAD^{tree}", "-m", `respuesta ${ID} listo\n\nHola`]);
  b.empujarCommit(ID, c);
  assert.match(b.correr([], { ONIA_RESPUESTAS_BORRAR: "0" }).stdout, /forma inválida/);
  const otra = b.correr([], { ONIA_RESPUESTAS_BORRAR: "0" });
  assert.equal(otra.stdout, "", "la segunda vuelta no lo vuelve a mirar");
});

test("la misma respuesta dos veces no suena dos veces, y después de cerrado no suena nada", () => {
  const b = banco({ ids: [ID, "p_0000000a"] }); // el otro abierto hace que el script siga consultando
  b.responder(ID, "necesita-ok", "¿Lo mergeo?");
  b.correr();
  b.responder(ID, "necesita-ok", "¿Lo mergeo? (otra vez)");
  assert.match(b.correr().stdout, /ya tenía una respuesta «necesita-ok»/);
  assert.equal(b.envios(), 1);
  b.responder(ID, "listo", "Listo.");
  b.correr();
  assert.equal(b.envios(), 2, "de «necesita-ok» a «listo» sí suena");
  b.responder(ID, "no-se-pudo", "algo más");
  assert.match(b.correr().stdout, /ya se cerró/);
  assert.equal(b.envios(), 2);
  assert.equal(b.ramas(), "", "la rama del pedido cerrado también se limpia");
});

test("un pedido de más de 48 h no suena, y sin pedidos abiertos ni se consulta GitHub", () => {
  const b = banco({ horasAtras: 49 });
  b.responder(ID, "listo", "Listo, tarde.");
  const r = b.correr([], { ONIA_PEDIDOS_REPO_URL: "file:///no/existe" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.stdout, "");
  assert.equal(b.envios(), 0);
  assert.equal(existsSync(join(b.estado, "respuestas.git")), false, "no tocó nada");
});

test("si no llega a GitHub lo dice y sale 1; --probar dice si llega", () => {
  const b = banco();
  b.responder(ID, "listo", "Listo.");
  const caido = b.correr([], { ONIA_PEDIDOS_REPO_URL: "file:///no/existe" });
  assert.equal(caido.status, 1);
  assert.match(caido.stdout, /no pude consultar GitHub/);
  const p = b.correr(["--probar"]);
  assert.equal(p.status, 0, p.stdout + p.stderr);
  assert.match(p.stdout, /✅ llego a GitHub: 1 respuesta\(s\) esperando/);
  assert.equal(b.envios(), 0, "--probar no entrega nada");
  assert.equal(b.correr(["--probar"], { ONIA_PEDIDOS_REPO_URL: "file:///no/existe" }).status, 1);
  assert.equal(b.correr(["--otra"]).status, 64);
});

// La aduana guarda la primera línea, sin HTML, cortada con `cut -c1-90` (onia-tg.sh, titulo_de):
// GNU cut cuenta BYTES, y un emoji son 3 a 6. Verificación del 1-oct: «🙋 Necesita tu ok» con un
// link real sumaba 92 bytes y lo retenido quedaba «…session_…SuJp3», sin las dos últimas letras.
const loQueGuardaLaAduana = (linea) => Buffer.from(linea).subarray(0, 90).toString("utf8");

for (const estado of ["listo", "necesita-ok", "no-se-pudo"]) {
  test(`«${estado}»: la primera línea alcanza sola con un link real (id y link enteros en 90 bytes)`, () => {
    const b = banco();
    b.responder(ID, estado, "Detalle de la respuesta.");
    b.correr();
    const primera = b.leer("tg-msg.txt").split("\n")[0];
    assert.ok(Buffer.byteLength(primera) <= 90, `${Buffer.byteLength(primera)} bytes: ${primera}`);
    assert.doesNotMatch(primera, /</);
    assert.match(loQueGuardaLaAduana(primera), new RegExp(`p_1a2b3c4d · ${reEsc(URL_REAL)}$`));
  });
}

test("con un link más largo que los de hoy, queda solo el emoji: el id y el link no se cortan", () => {
  const largo = `https://claude.ai/code/session_${"x".repeat(36)}`; // 67: los de hoy tienen 55
  const b = banco({ url: largo });
  b.responder(ID, "no-se-pudo", "No pude: hace falta la PC.");
  b.correr();
  const primera = b.leer("tg-msg.txt").split("\n")[0];
  assert.ok(Buffer.byteLength(primera) <= 90, `${Buffer.byteLength(primera)} bytes: ${primera}`);
  assert.equal(primera, `⚠️ p_1a2b3c4d · ${largo}`);
});

test("el texto es texto: se escapa para Telegram y no se ejecuta", () => {
  const b = banco();
  b.responder(ID, "listo", "<b>ojo</b> & $(touch HACKEADO) `touch HACKEADO2` ; rm -rf /");
  b.correr();
  const msg = b.leer("tg-msg.txt");
  assert.match(msg, /&lt;b&gt;ojo&lt;\/b&gt; &amp; \$\(touch HACKEADO\) `touch HACKEADO2` ; rm -rf \/$/);
  for (const f of ["HACKEADO", "HACKEADO2"]) {
    assert.equal(existsSync(join(b.dir, f)), false);
    assert.equal(existsSync(f), false);
  }
});

test("una respuesta larguísima se corta en 1500 caracteres sin romper un acento", () => {
  const b = banco();
  b.responder(ID, "listo", "á".repeat(2000));
  b.correr();
  const cuerpo = b.leer("tg-msg.txt").split("\n\n")[1];
  assert.equal([...cuerpo].length, 1500);
  assert.doesNotMatch(cuerpo, /�/);
});

test("un commit de más de 16 KB no se entrega", () => {
  const b = banco();
  b.responder(ID, "listo", "x".repeat(20000));
  assert.match(b.correr().stdout, /pesa más de 16384 bytes/);
  assert.equal(b.envios(), 0);
});

test("si la aduana no la acepta, no la da por respondida y la reintenta en la vuelta siguiente", () => {
  const b = banco({ tgFalla: true });
  b.responder(ID, "listo", "Listo.");
  const r = b.correr();
  assert.match(r.stdout, /la aduana no la aceptó/);
  assert.equal(existsSync(join(b.estado, "respuestas.tsv")), false);
  assert.equal(b.ramas(), `refs/heads/respuesta/${ID}`, "la rama queda para el reintento");
  spawnSync("rm", ["-f", join(b.dir, "tg-falla")]);
  assert.match(b.correr().stdout, /✅ p_1a2b3c4d: respuesta «listo» entregada/);
  assert.equal(b.ramas(), "");
});
