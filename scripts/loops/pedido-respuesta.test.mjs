// pedido-respuesta.test.mjs — la respuesta de Claude a un pedido vuelve a Telegram por la aduana.
//
// POR QUÉ EXISTE. El pedido sale de Hermes a una rutina de Claude en la nube (pedido-claude.sh). Desde
// el 2-oct la respuesta vuelve SIN ningún token de Actions: la sesión la deja como el mensaje de un
// commit sin archivos en la rama `respuesta/<id>`, y respuestas-pedidos.sh (cron del VPS) la busca y
// la entrega por la aduana. Estos casos fijan que:
//   - solo se responden pedidos que salieron de Hermes, una vez por estado, y por la aduana;
//   - lo que llega es texto: escapado para el HTML de Telegram, nunca ejecutado, con tope;
//   - el VPS baja SOLO el commit, nunca archivos, y rechaza un commit con archivos o con historia;
//   - cada commit se mira una vez, y la rama se borra al entregarla;
//   - (5-oct, los MEDIUM de la madre v2) solo se entrega la respuesta FIRMADA con el sello de ese
//     pedido, y una respuesta enorme se corta mientras baja, no después.
// Contra un origin local (file://) con los filtros activados, como GitHub. La sesión responde con el
// script real que le pide el prompt de la rutina (responder-pedido.sh).
//
// Se corre con: node --test scripts/loops/pedido-respuesta.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync, utimesSync, readdirSync, statSync } from "node:fs";
import { createHmac, randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(AQUI, "respuestas-pedidos.sh");
const RESPONDER = resolve(AQUI, "responder-pedido.sh");
const ID = "p_1a2b3c4d";
// Un link con el largo de los de verdad (session_ + 24): con uno de juguete («session_01XYZ») la
// prueba de los 90 bytes pasaba y en producción el link de «necesita tu ok» quedaba cortado.
const SESION = "session_01AbCdEfGhIjKlMnOpQrStUv";
const URL_REAL = `https://claude.ai/code/${SESION}`;
const VACIO = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

// La firma de una respuesta, igual que responder-pedido.sh y respuestas-pedidos.sh: HMAC-SHA256 con el
// sello (32 hex) de "respuesta <id> <estado>\n" + el texto sin los espacios ASCII de las puntas.
const ASCII_ESPACIO = new Set([0x20, 0x09, 0x0a, 0x0d, 0x0b, 0x0c]);
function recortar(buf) {
  let a = 0, z = buf.length;
  while (a < z && ASCII_ESPACIO.has(buf[a])) a++;
  while (z > a && ASCII_ESPACIO.has(buf[z - 1])) z--;
  return buf.subarray(a, z);
}
const firmar = (sello, id, est, texto) =>
  createHmac("sha256", Buffer.from(sello, "hex"))
    .update(Buffer.concat([Buffer.from(`respuesta ${id} ${est}\n`), recortar(Buffer.from(texto))]))
    .digest("hex");

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
  // El sello de cada pedido, como lo deja pedido-claude.sh al mandarlo.
  mkdirSync(join(estado, "sellos"), { mode: 0o700 });
  const sellos = {};
  for (const i of ids) {
    sellos[i] = randomBytes(16).toString("hex");
    writeFileSync(join(estado, "sellos", i), `${sellos[i]}\n`, { mode: 0o600 });
  }
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

  // Lo que hace la sesión del pedido, tal cual lo pide el prompt de la rutina (TELEGRAM_COMMAND_CENTER.md
  // §5): el texto en un archivo y responder-pedido.sh con el id, el estado y el sello del pedido.
  const responder = (id, est, texto, { sello = sellos[id] } = {}) => {
    const r = spawnSync("bash", [RESPONDER, id, est, sello], { cwd: nube, env, input: texto, encoding: "utf8" });
    if (r.status !== 0) throw new Error(`responder-pedido.sh ${r.status}: ${r.stdout}${r.stderr}`);
    return git(origin, ["rev-parse", `refs/heads/respuesta/${id}`]);
  };
  // Lo que podría hacer otro, a mano: cualquier primera línea, cualquier rama, cualquier sello.
  const responderCrudo = (id, est, texto, { rama = id, sello = sellos[id] ?? "0".repeat(32), primera } = {}) => {
    const f = join(dir, "respuesta.txt");
    writeFileSync(f, `${primera ?? `respuesta ${id} ${est} ${firmar(sello, id, est, texto)}`}\n\n${texto}\n`);
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
  return { dir, estado, nube, git, env, sellos, responder, responderCrudo, empujarCommit, commitCrudo, correr, ramas, leer, objetos,
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
    `tree ${VACIO}\nauthor Claude <noreply@anthropic.com> 1790946558 +0000\ncommitter Claude <noreply@anthropic.com> 1790946558 +0000\n${firma}\n\nrespuesta ${ID} listo ${firmar(b.sellos[ID], ID, "listo", "Firmado y entregado.")}\n\nFirmado y entregado.\n`,
  );
  b.empujarCommit(ID, c);
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(b.leer("tg-msg.txt"), /Firmado y entregado\.$/);
});

test("un pedido que no salió de Hermes no le escribe nada, y su rama no se toca", () => {
  const b = banco();
  b.responderCrudo("p_ffffffff", "listo", "hola");
  b.responder(ID, "necesita-ok", "¿Sigo?"); // hay un pedido abierto: el script sí consulta
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(b.envios(), 1);
  assert.doesNotMatch(b.leer("tg-msg.txt"), /p_ffffffff/);
  assert.equal(b.ramas(), "refs/heads/respuesta/p_ffffffff", "lo que no es nuestro no se borra");
});

test("ramas con otra forma, o un id distinto adentro del mensaje: no le escribe nada", () => {
  const b = banco();
  b.responderCrudo(ID, "listo", "x", { rama: "otra-cosa" });
  b.responderCrudo(ID, "listo", "x", { rama: "p_1A2B3C4D" });
  assert.equal(b.correr().status, 0);
  assert.equal(b.envios(), 0);
  b.responderCrudo(ID, "listo", "x", { primera: `respuesta p_00000000 listo ${firmar(b.sellos[ID], "p_00000000", "listo", "x")}` });
  assert.match(b.correr().stdout, /el id del mensaje no es el de la rama/);
  b.responderCrudo(ID, "listo", "x", { primera: `respuesta ${ID} cualquiera ${firmar(b.sellos[ID], ID, "cualquiera", "x")}` });
  assert.match(b.correr().stdout, /la primera línea no es/);
  b.responderCrudo(ID, "listo", "   ");
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
  b.responderCrudo(ID, "listo", "x".repeat(20000)); // se comprime: baja entero y lo frena el tope de 16 KB
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

// ── Primer MEDIUM de la madre v2 (3-oct): la respuesta tiene que estar ATADA al pedido ─────────────
// Antes, cualquiera que pudiera pushear al repo dejaba la respuesta de un pedido abierto y le llegaba a
// Sergio Urcullo como si fuera de Claude.

test("una respuesta firmada con otro sello no se entrega: es de alguien que no tiene el del pedido", () => {
  const b = banco();
  b.responderCrudo(ID, "necesita-ok", "Entrá a este link y poné tu clave", { sello: randomBytes(16).toString("hex") });
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /forma inválida \(la firma no es la del sello de este pedido\)/);
  assert.equal(b.envios(), 0);
  assert.equal(b.ramas(), "", "la falsa se limpia");
  assert.equal(b.correr().stdout, "", "y no se vuelve a mirar");
  // La de verdad, que llega después, sí se entrega.
  b.responder(ID, "listo", "Listo de verdad.");
  assert.match(b.correr().stdout, /✅ p_1a2b3c4d: respuesta «listo» entregada/);
});

test("la firma cubre el estado y el texto: cambiar cualquiera de los dos la invalida", () => {
  const b = banco();
  const buena = firmar(b.sellos[ID], ID, "listo", "Texto A");
  b.responderCrudo(ID, "listo", "Texto B", { primera: `respuesta ${ID} listo ${buena}` });
  assert.match(b.correr().stdout, /la firma no es la del sello/);
  b.responderCrudo(ID, "necesita-ok", "Texto A", { primera: `respuesta ${ID} necesita-ok ${buena}` });
  assert.match(b.correr().stdout, /la firma no es la del sello/);
  assert.equal(b.envios(), 0);
});

test("la forma vieja, sin firma, ya no se entrega", () => {
  const b = banco();
  b.responderCrudo(ID, "listo", "Hola", { primera: `respuesta ${ID} listo` });
  assert.match(b.correr().stdout, /la primera línea no es «respuesta <id> <estado> <firma>»/);
  assert.equal(b.envios(), 0);
});

test("sin el sello del pedido en el VPS, nada se entrega (ni con una firma que parezca buena)", () => {
  const b = banco();
  b.responder(ID, "listo", "Listo.");
  spawnSync("rm", ["-f", join(b.estado, "sellos", ID)]);
  assert.match(b.correr().stdout, /este pedido no tiene sello en el VPS/);
  assert.equal(b.envios(), 0);
});

test("el sello vive mientras el pedido está abierto: sigue tras «necesita-ok» y se borra al cerrarse", () => {
  const b = banco();
  b.responder(ID, "necesita-ok", "¿Lo mergeo?");
  b.correr();
  assert.ok(existsSync(join(b.estado, "sellos", ID)), "con «necesita-ok» el pedido sigue abierto");
  b.responder(ID, "listo", "Mergeado.");
  b.correr();
  assert.equal(b.envios(), 2);
  assert.equal(existsSync(join(b.estado, "sellos", ID)), false, "cerrado: el sello no sirve más");
});

test("los sellos de más de 48 h se borran solos, aunque no haya pedidos abiertos", () => {
  const b = banco({ horasAtras: 49 });
  const viejo = (Date.now() - 49 * 3600 * 1000) / 1000;
  utimesSync(join(b.estado, "sellos", ID), viejo, viejo);
  writeFileSync(join(b.estado, "sellos", "p_0000000b"), "f".repeat(32) + "\n"); // uno de hoy queda
  const r = b.correr([], { ONIA_PEDIDOS_REPO_URL: "file:///no/existe" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(readdirSync(join(b.estado, "sellos")), ["p_0000000b"]);
});

test("responder-pedido.sh rechaza lo mal armado sin pushear nada", () => {
  const b = banco();
  const correr = (args, input = "Hola") =>
    spawnSync("bash", [RESPONDER, ...args], { cwd: b.nube, env: b.env, input, encoding: "utf8" });
  const sello = b.sellos[ID];
  assert.equal(correr(["p_XYZ", "listo", sello]).status, 64);
  assert.equal(correr([ID, "terminado", sello]).status, 64);
  assert.equal(correr([ID, "listo", "corto"]).status, 64);
  assert.equal(correr([ID, "listo"]).status, 64);
  assert.equal(correr([ID, "listo", sello], "   \n ").status, 65);
  assert.equal(correr([ID, "listo", sello], "x".repeat(12001)).status, 65);
  assert.equal(b.ramas(), "", "nada llegó al repo");
});

test("el sello nunca entra al repo: el commit de la respuesta lleva la firma, no el sello", () => {
  const b = banco();
  const c = b.responder(ID, "listo", "Listo.");
  const commit = b.git(b.nube, ["cat-file", "-p", c]);
  assert.doesNotMatch(commit, new RegExp(b.sellos[ID]));
  assert.match(commit, new RegExp(`^respuesta ${ID} listo [0-9a-f]{64}$`, "m"));
});

// ── Segundo MEDIUM de la madre v2 (3-oct): el tope se medía DESPUÉS de bajar el commit entero ──────
test("una respuesta enorme se corta MIENTRAS baja: el VPS no se la traga entera", () => {
  const b = banco({ ids: [ID, "p_0000000a"] });
  b.responderCrudo(ID, "listo", randomBytes(1536 * 1024).toString("hex")); // 3 MB que no se comprimen
  const r = b.correr();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /❌ p_1a2b3c4d: la respuesta pasa de 64 KB; corté la descarga y no la entrego/);
  assert.equal(b.envios(), 0);
  const repo = join(b.estado, "respuestas.git");
  const pesado = spawnSync("du", ["-sk", repo], { encoding: "utf8" }).stdout.split("\t")[0];
  assert.ok(Number(pesado) < 512, `el repo del VPS pesa ${pesado} KB (bajarla entera serían 3.072)`);
  assert.deepEqual(readdirSync(join(repo, "objects", "pack")).filter((f) => f.startsWith("tmp_pack_")), [], "sin restos a medias");
  assert.equal(b.ramas(), "", "se limpia");
  assert.equal(b.correr().stdout, "", "y no se reintenta en cada vuelta");
  // Una normal, después, sigue llegando.
  b.responder("p_0000000a", "listo", "Esta sí.");
  assert.match(b.correr().stdout, /✅ p_0000000a: respuesta «listo» entregada/);
});

test("una falla de red no es el tope: se reintenta en la vuelta siguiente", () => {
  const b = banco();
  b.responder(ID, "listo", "Listo.");
  // El listado llega, pero la descarga no: un git que falla solo en fetch.
  const falso = join(b.dir, "bin");
  mkdirSync(falso);
  const gitReal = spawnSync("bash", ["-c", "command -v git"], { encoding: "utf8" }).stdout.trim();
  writeFileSync(join(falso, "git"), `#!/usr/bin/env bash\nfor a in "$@"; do [ "$a" = fetch ] && exit 128; done\nexec ${gitReal} "$@"\n`);
  chmodSync(join(falso, "git"), 0o755);
  const r = b.correr([], { PATH: `${falso}:${process.env.PATH}` });
  assert.match(r.stdout, /no pude bajar la respuesta \(reintento en la próxima vuelta\)/);
  assert.equal(b.envios(), 0);
  assert.match(b.correr().stdout, /✅ p_1a2b3c4d: respuesta «listo» entregada/, "sin la falla, llega");
});

test("el prompt de la rutina manda a firmar con responder-pedido.sh y avisa del sello", () => {
  const doc = readFileSync(resolve(AQUI, "..", "..", "hermes-content", "docs", "TELEGRAM_COMMAND_CENTER.md"), "utf8");
  const ini = doc.indexOf("## 5. El prompt de la rutina");
  const prompt = doc.slice(ini, doc.indexOf("## 6.", ini));
  assert.match(prompt, /bash scripts\/loops\/responder-pedido\.sh p_xxxxxxxx listo <sello> < \/tmp\/respuesta\.txt/);
  assert.match(prompt, /una línea «Sello:» con 32\s+caracteres hexadecimales/);
  assert.doesNotMatch(prompt, /commit-tree/, "la forma vieja, sin firma, ya no se entrega");
});

// ── Revisión fuerte del 5-oct (segundo revisor) ───────────────────────────────────────────────────
// El repo del VPS se arma DE CERO en cada vuelta. Con uno que duraba, el gc automático de git heredaba
// el `ulimit -f`, moría y dejaba un `tmp_pack_*` de 64 KB que hacía pasar una falla de red por «pasa de
// 64 KB» (y la respuesta buena se descartaba); y el `shallow` crecía con cada respuesta hasta que el
// fetch mismo chocaba con el tope y dejaba `shallow.lock`, trabando todo para siempre.
test("un resto de 64 KB de una vuelta anterior no hace pasar una falla de red por «demasiado grande»", () => {
  const b = banco();
  b.responder(ID, "listo", "Listo.");
  const pack = join(b.estado, "respuestas.git", "objects", "pack");
  mkdirSync(pack, { recursive: true });
  writeFileSync(join(pack, "tmp_pack_viejo"), Buffer.alloc(65536, 1));
  const falso = join(b.dir, "bin");
  mkdirSync(falso);
  const gitReal = spawnSync("bash", ["-c", "command -v git"], { encoding: "utf8" }).stdout.trim();
  writeFileSync(join(falso, "git"), `#!/usr/bin/env bash\nfor a in "$@"; do [ "$a" = fetch ] && exit 128; done\nexec ${gitReal} "$@"\n`);
  chmodSync(join(falso, "git"), 0o755);
  const r = b.correr([], { PATH: `${falso}:${process.env.PATH}` });
  assert.doesNotMatch(r.stdout, /pasa de 64 KB/);
  assert.match(r.stdout, /no pude bajar la respuesta \(reintento en la próxima vuelta\)/);
  assert.match(b.correr().stdout, /✅ p_1a2b3c4d: respuesta «listo» entregada/, "la buena llega en la vuelta siguiente");
});

test("cada vuelta arranca con el repo vacío: no se acumulan refs, shallow ni gc", () => {
  const b = banco({ ids: [ID, "p_0000000a"] });
  b.responder(ID, "necesita-ok", "¿Sigo?");
  b.correr();
  b.responder("p_0000000a", "listo", "Hecho.");
  b.correr();
  const repo = join(b.estado, "respuestas.git");
  assert.equal(b.git(repo, ["for-each-ref", "--format=%(refname)", "refs/respuestas/"]), "refs/respuestas/p_0000000a");
  assert.equal(readFileSync(join(repo, "shallow"), "utf8").trim().split("\n").length, 1);
  assert.equal(b.git(repo, ["config", "gc.auto"]), "0");
});

test("responder-pedido.sh no firma un texto que no es UTF-8 válido (git lo reescribiría y la firma no cerraría)", () => {
  const b = banco();
  const r = spawnSync("bash", [RESPONDER, ID, "listo", b.sellos[ID]], { cwd: b.nube, env: b.env, input: Buffer.from([0x48, 0x6f, 0x6c, 0xe1, 0x0a]) });
  assert.equal(r.status, 65, String(r.stderr));
  assert.match(String(r.stderr), /no es UTF-8 válido/);
  assert.equal(b.ramas(), "");
});
