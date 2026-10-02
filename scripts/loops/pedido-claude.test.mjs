// pedido-claude.test.mjs — Hermes le pasa un pedido de Sergio Urcullo a Claude en la nube.
//
// POR QUÉ EXISTE. Sergio Urcullo, 2026-10-01: «que ya podamos manejar todo desde ahí» (Hermes).
// El 30-sep eligió que Hermes también ejecute; la forma acordada es que Hermes NO programe: le
// pasa el pedido exacto a una rutina de Claude Code en la nube, con su confirmación
// (hermes-content/docs/TELEGRAM_COMMAND_CENTER.md). La revisión de la sesión madre (1-oct) mostró
// que un «sí» que solo pasa por Hermes no frena nada: vista previa y --si en el mismo turno salían
// sin que él dijera nada. Ahora el sí es un código que le llega a ÉL directo, y estos casos lo fijan;
// también que el texto no pasa por la shell, que el token nunca se imprime y que un envío dudoso no
// se reintenta a ciegas.
//
// Se corre con: node --test scripts/loops/pedido-claude.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, "pedido-claude.sh");
const URL_RUTINA = "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef234/fire";
const TOKEN = "sk-ant-oat01-NO-SE-IMPRIME-NUNCA";
const OK = JSON.stringify({
  type: "routine_fire",
  claude_code_session_id: "session_01XYZ",
  claude_code_session_url: "https://claude.ai/code/session_01XYZ",
});

// curl: { rc, http, cuerpo } — lo que contesta la rutina
function banco({ configurado = true, curl = { rc: 0, http: "200", cuerpo: OK }, tgFalla = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "pedido-"));
  const estado = join(dir, "estado");
  const conf = join(dir, "pedidos.env");
  if (configurado) writeFileSync(conf, `ONIA_RUTINA_URL=${URL_RUTINA}\nONIA_RUTINA_TOKEN=${TOKEN}\n`);
  writeFileSync(join(dir, "respuesta.json"), curl.cuerpo ?? "");
  const fakeCurl = join(dir, "curl.sh");
  writeFileSync(
    fakeCurl,
    `#!/usr/bin/env bash
n=$(cat ${dir}/llamadas 2>/dev/null || echo 0); echo $((n + 1)) > ${dir}/llamadas
prev=""; salida=""
for a in "$@"; do
  case "$prev" in
    --data-binary) cp "\${a#@}" ${dir}/cuerpo.json ;;
    -o) salida="$a" ;;
    -H) case "$a" in @*) cp "\${a#@}" ${dir}/encabezado-token ;; *) echo "$a" >> ${dir}/encabezados ;; esac ;;
  esac
  case "$a" in https://*) echo "$a" > ${dir}/url ;; esac
  prev="$a"
done
[ -n "$salida" ] && cp ${dir}/respuesta.json "$salida"
printf '%s' "${curl.http}"
exit ${curl.rc}
`,
  );
  chmodSync(fakeCurl, 0o755);
  const tg = join(dir, "tg.sh");
  writeFileSync(
    tg,
    `#!/usr/bin/env bash
printf '%s|%s|%s\\n' "$ONIA_AVISO" "$ONIA_AVISO_AHORA" "$ONIA_AVISO_EMISOR" > ${dir}/tg-env
printf '%s' "$1" > ${dir}/tg-msg
${tgFalla ? "exit 1" : "exit 0"}
`,
  );
  chmodSync(tg, 0o755);
  const env = { ...process.env, ONIA_PEDIDOS_CONF: conf, ONIA_PEDIDOS_ESTADO: estado, ONIA_PEDIDOS_CURL: fakeCurl, ONIA_TG: tg };
  // El pedido va por la entrada estándar, como lo manda la skill.
  const correr = (args, texto, extra = {}) =>
    spawnSync("bash", [SCRIPT, ...args], { env: { ...env, ...extra }, input: texto ?? "", encoding: "utf8" });
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  const codigo = () => (leer("tg-msg").match(/código <b>(\d{6})<\/b>/) || [])[1];
  const llamadas = () => Number(leer("llamadas") || 0);
  return { dir, estado, env, correr, leer, codigo, llamadas };
}

const TEXTO = "Arreglá el botón «Confirmar» de la agenda";

test("la vista previa le manda el texto y un código DIRECTO a él, y a Hermes no le dice el código", () => {
  const b = banco();
  const r = b.correr(["plataforma"], TEXTO);
  assert.equal(r.status, 3, r.stderr);
  assert.equal(b.leer("tg-env").trim(), "interrumpe|1|pedidos", "directo, aunque esté en un bloque: él está chateando");
  assert.match(b.leer("tg-msg"), /«Arreglá el botón «Confirmar» de la agenda»/);
  const c = b.codigo();
  assert.match(c, /^\d{6}$/);
  assert.doesNotMatch(r.stdout + r.stderr, new RegExp(c), "el código no aparece en lo que lee Hermes");
  assert.equal(b.llamadas(), 0, "una vista previa no llama a la rutina");
});

test("--si sin código, con código equivocado, o reusado: no sale (66)", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  const c = b.codigo();
  assert.equal(b.correr(["plataforma", "--si"], TEXTO).status, 66);
  assert.equal(b.correr(["plataforma", "--si", c === "000000" ? "111111" : "000000"], TEXTO).status, 66);
  assert.equal(b.llamadas(), 0);
  assert.equal(b.correr(["plataforma", "--si", c], TEXTO).status, 0);
  assert.equal(b.correr(["plataforma", "--si", c], TEXTO).status, 66, "un código sirve una sola vez");
  assert.equal(b.llamadas(), 1);
});

test("el código es de ESE texto: con otro texto no sale", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  assert.equal(b.correr(["plataforma", "--si", b.codigo()], TEXTO + " y borrá la base").status, 66);
  assert.equal(b.llamadas(), 0);
});

test("tres códigos equivocados anulan el pedido", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  const c = b.codigo();
  const malo = c === "123456" ? "654321" : "123456";
  b.correr(["plataforma", "--si", malo], TEXTO);
  b.correr(["plataforma", "--si", malo], TEXTO);
  const r = b.correr(["plataforma", "--si", malo], TEXTO);
  assert.match(r.stderr, /equivocado 3 veces: el pedido se anuló/);
  assert.equal(b.correr(["plataforma", "--si", c], TEXTO).status, 66, "ni con el bueno, después de anulado");
});

test("un código de más de una hora no vale", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  const previas = join(b.estado, "previas");
  const f = join(previas, readdirSync(previas)[0]);
  const [, c, e] = readFileSync(f, "utf8").trim().split(" ");
  writeFileSync(f, `${Math.floor(Date.now() / 1000) - 3700} ${c} ${e}\n`);
  assert.equal(b.correr(["plataforma", "--si", c], TEXTO).status, 66);
});

test("con el código: dispara la rutina con el texto palabra por palabra y devuelve el link", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  const r = b.correr(["plataforma", "--si", b.codigo()], TEXTO);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /✅ Lo tomó Claude \(pedido p_[0-9a-f]{8}\)\. Lo podés seguir acá: https:\/\/claude\.ai\/code\/session_01XYZ/);
  assert.equal(b.leer("url").trim(), URL_RUTINA);
  const cuerpo = JSON.parse(b.leer("cuerpo.json"));
  assert.match(cuerpo.text, /^PEDIDO p_[0-9a-f]{8} · carril: plataforma · \d{4}-\d{2}-\d{2} \d{2}:\d{2} \(La Paz\)\n/);
  assert.match(cuerpo.text, /confirmó con un código después de ver este texto exacto:\n«Arreglá el botón «Confirmar» de la agenda»$/);
  assert.match(b.leer("encabezados"), /anthropic-beta: experimental-cc-routine-2026-04-01/);
  const fila = readFileSync(join(b.estado, "pedidos.tsv"), "utf8").trim().split("\t");
  assert.deepEqual([fila.length, fila[2], fila[4], fila[5]], [6, "plataforma", "session_01XYZ", "https://claude.ai/code/session_01XYZ"]);
});

// Como lo corre Hermes (skill pedir-a-claude): un heredoc entre comillas, dentro de bash -c.
const HEREDOC = "FIN_PEDIDO_ONIA_7f3c";
const conHeredoc = (args, texto) => `${SCRIPT} ${args} <<'${HEREDOC}'\n${texto}\n${HEREDOC}\n`;

test("el texto no pasa por la shell: $(…), backticks, comillas y $390 llegan idénticos y no ejecutan nada", () => {
  const b = banco();
  const raro = `Cobrale $390 a "la Dra." y 'Pérez' $(touch ${b.dir}/HACKEADO) \`touch ${b.dir}/HACKEADO2\` \\n fin`;
  const guion = (extra) => conHeredoc(`ventas ${extra}`, raro);
  spawnSync("bash", ["-c", guion("")], { env: b.env, encoding: "utf8" });
  const r = spawnSync("bash", ["-c", guion(`--si ${b.codigo()}`)], { env: b.env, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(existsSync(join(b.dir, "HACKEADO")) || existsSync(join(b.dir, "HACKEADO2")), false);
  assert.ok(JSON.parse(b.leer("cuerpo.json")).text.endsWith(`«${raro}»`));
  assert.ok(b.leer("tg-msg").includes(raro.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")));
});

test("el token va por un archivo de encabezado, nunca como argumento ni en la salida", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  const r = b.correr(["plataforma", "--si", b.codigo()], TEXTO);
  assert.equal(b.leer("encabezado-token").trim(), `Authorization: Bearer ${TOKEN}`);
  assert.doesNotMatch(b.leer("encabezados"), /Bearer/);
  assert.doesNotMatch(r.stdout + r.stderr, /NO-SE-IMPRIME/);
});

test("sin conexión (curl 6/7) o rechazado (4xx): NO salió, no registra, y el mismo código sirve para reintentar", () => {
  for (const curl of [{ rc: 7, http: "000", cuerpo: "" }, { rc: 0, http: "401", cuerpo: '{"error":{"type":"authentication_error"}}' }]) {
    const b = banco({ curl });
    b.correr(["plataforma"], TEXTO);
    const c = b.codigo();
    const r = b.correr(["plataforma", "--si", c], TEXTO);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /El pedido NO salió/);
    assert.doesNotMatch(r.stdout + r.stderr, /NO-SE-IMPRIME/);
    assert.equal(existsSync(join(b.estado, "pedidos.tsv")), false);
    assert.equal(readdirSync(join(b.estado, "previas")).length, 1, "el código sigue vigente");
  }
});

test("ambiguo (se cortó, 5xx o 2xx sin link): se registra, se anula el código y dice que NO lo reintente", () => {
  for (const curl of [{ rc: 28, http: "000", cuerpo: "" }, { rc: 0, http: "502", cuerpo: "" }, { rc: 0, http: "200", cuerpo: "{}" }]) {
    const b = banco({ curl });
    b.correr(["plataforma"], TEXTO);
    const r = b.correr(["plataforma", "--si", b.codigo()], TEXTO);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Puede haber salido.*NO lo reintentes/);
    const fila = readFileSync(join(b.estado, "pedidos.tsv"), "utf8").split("\n")[0].split("\t");
    assert.deepEqual([fila[2], fila[4], fila[5]], ["plataforma", "", ""]);
    assert.equal(readdirSync(join(b.estado, "previas")).length, 0);
    assert.match(b.correr(["--lista"]).stdout, /\(sin confirmar\)/);
  }
});

test("el mismo pedido dos veces en una hora: el segundo no sale", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  b.correr(["plataforma", "--si", b.codigo()], TEXTO);
  b.correr(["plataforma"], TEXTO);
  const r = b.correr(["plataforma", "--si", b.codigo()], TEXTO);
  assert.equal(r.status, 75);
  assert.match(r.stderr, /ya salió hace menos de una hora: https:\/\/claude\.ai\/code\/session_01XYZ/);
  assert.equal(b.llamadas(), 1);
});

test("tope del día: después de N pedidos no sale ninguno más", () => {
  const b = banco();
  const x = { ONIA_PEDIDOS_TOPE: "2" };
  for (const n of [1, 2]) {
    b.correr(["consulta"], `pregunta ${n}`, x);
    assert.equal(b.correr(["consulta", "--si", b.codigo()], `pregunta ${n}`, x).status, 0);
  }
  b.correr(["consulta"], "pregunta 3", x);
  const r = b.correr(["consulta", "--si", b.codigo()], "pregunta 3", x);
  assert.equal(r.status, 75);
  assert.match(r.stderr, /Ya van 2 pedidos hoy \(tope 2\)/);
  assert.equal(b.llamadas(), 2);
});

test("lo que necesita la PC no va a la nube; carril desconocido, vacío o larguísimo: no sale", () => {
  const b = banco();
  for (const c of ["pc", "madre"]) {
    const r = b.correr([c], "grabá el video de hoy");
    assert.equal(r.status, 65);
    assert.match(r.stderr, /necesita la PC de Sergio Urcullo/);
  }
  assert.equal(b.correr(["cualquiera"], "algo").status, 65);
  assert.equal(b.correr(["ventas"], "   ").status, 65);
  assert.equal(b.correr(["ventas"], "x".repeat(2001)).status, 65);
  assert.equal(b.leer("tg-msg"), "", "nada de eso le llega a él");
});

test("sin configurar o sin poder avisarle: no hay código ni pedido", () => {
  const sin = banco({ configurado: false });
  assert.equal(sin.correr(["plataforma"], TEXTO).status, 69);
  assert.equal(sin.leer("tg-msg"), "");
  assert.equal(sin.correr(["--estado"]).status, 69);
  const mudo = banco({ tgFalla: true });
  const r = mudo.correr(["plataforma"], TEXTO);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /No le pude mandar el código/);
  assert.equal(existsSync(join(mudo.estado, "previas")) && readdirSync(join(mudo.estado, "previas")).length, 0);
});

test("una URL que no es la de una rutina de claude.ai no se usa", () => {
  const b = banco();
  writeFileSync(join(b.dir, "pedidos.env"), `ONIA_RUTINA_URL=https://evil.example/fire\nONIA_RUTINA_TOKEN=${TOKEN}\n`);
  assert.equal(b.correr(["plataforma"], TEXTO).status, 69);
  assert.equal(b.llamadas(), 0);
});

test("--estado y --lista son de solo lectura: no crean nada en el disco", () => {
  const b = banco();
  b.correr(["--estado"]);
  b.correr(["--lista"]);
  assert.equal(existsSync(b.estado), false);
});

test("--lista: los pedidos del día con su estado; sin respuesta hasta que Claude conteste", () => {
  const b = banco();
  b.correr(["plataforma"], TEXTO);
  b.correr(["plataforma", "--si", b.codigo()], TEXTO);
  const antes = b.correr(["--lista"]).stdout.trim().split("\t");
  assert.deepEqual([antes[2], antes[3]], ["plataforma", "sin respuesta"]);
  writeFileSync(join(b.estado, "respuestas.tsv"), `${Math.floor(Date.now() / 1000)}\t${antes[1]}\tlisto\n`);
  assert.equal(b.correr(["--lista"]).stdout.trim().split("\t")[3], "listo");
  assert.equal(b.correr(["--lista", "2020-01-01"]).stdout, "");
});

// ── Revisión de la madre, 2-oct ─────────────────────────────────────────────────

test("una línea que dice solo «PEDIDO» no corta el heredoc: no ejecuta nada y el texto llega completo", () => {
  const b = banco();
  // Con el delimitador viejo (<<'PEDIDO') esta línea cerraba el heredoc y lo que seguía se ejecutaba.
  const texto = `Revisá esto:\nPEDIDO\ntouch ${b.dir}/HACKEADO\nfin`;
  spawnSync("bash", ["-c", conHeredoc("ventas", texto)], { env: b.env, encoding: "utf8" });
  const r = spawnSync("bash", ["-c", conHeredoc(`ventas --si ${b.codigo()}`, texto)], { env: b.env, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(existsSync(join(b.dir, "HACKEADO")), false, "nada se ejecutó");
  assert.ok(JSON.parse(b.leer("cuerpo.json")).text.endsWith(`«${texto}»`), "llegó entero, con la línea PEDIDO");
  // Lo que escribe Hermes sale de su skill: tiene que usar ESE cierre, y nunca el viejo.
  const skill = readFileSync(join(AQUI, "..", "..", "hermes-content", "skills", "pedir-a-claude.md"), "utf8");
  assert.equal((skill.match(new RegExp(`<<'${HEREDOC}'`, "g")) || []).length, 2, "vista previa y --si");
  assert.doesNotMatch(skill, /<<'PEDIDO'/);
});

test("el texto como argumento no se acepta (64): pasaría por la shell", () => {
  const b = banco();
  for (const args of [["ventas", "arreglá", "el", "botón"], ["ventas", "--si", "123456", "otra cosa"]]) {
    const r = b.correr(args, "");
    assert.equal(r.status, 64, r.stderr);
    assert.match(r.stderr, /entrada estándar/);
  }
  assert.equal(b.leer("tg-msg"), "", "no le llegó nada a él");
  assert.equal(b.llamadas(), 0);
});

test("la sangría de adentro llega idéntica: solo se recortan el principio y el final del texto", () => {
  const b = banco();
  const adentro = "Lista:\n  - uno\n      - uno.a\n\tcon tab\n  - dos";
  b.correr(["plataforma"], `\n\n   ${adentro}   \n\n`);
  assert.equal(b.correr(["plataforma", "--si", b.codigo()], `  ${adentro}\n`).status, 0, "el código es del mismo texto recortado");
  assert.ok(JSON.parse(b.leer("cuerpo.json")).text.endsWith(`«${adentro}»`));
});

test("una entrada que nunca se cierra no lo cuelga, y un texto a medias no sale", () => {
  const b = banco();
  const r = spawnSync("bash", ["-c", `{ echo 'arreglá el botón'; sleep 5; } | ${SCRIPT} plataforma`], {
    env: { ...b.env, ONIA_PEDIDOS_ESPERA_ENTRADA: "1" },
    encoding: "utf8",
  });
  assert.equal(r.status, 65, r.stderr);
  assert.match(r.stderr, /no pude leer el pedido completo/);
  assert.equal(b.leer("tg-msg"), "");
});

test("un --si sin código vigente no muestra la ruta del código (en esa ruta está guardado)", () => {
  const b = banco();
  const r = b.correr(["plataforma", "--si", "123456"], TEXTO);
  assert.equal(r.status, 66);
  assert.doesNotMatch(r.stdout + r.stderr, /previas\//);
  assert.doesNotMatch(r.stdout + r.stderr, new RegExp(b.estado.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")));
});

test("tope de vistas previas: la cuarta en una hora no le suena (75) y no le llega nada", () => {
  const b = banco();
  for (const n of [1, 2, 3]) assert.equal(b.correr(["consulta"], `pregunta ${n}`).status, 3);
  const antes = b.leer("tg-msg");
  const r = b.correr(["consulta"], "pregunta 4");
  assert.equal(r.status, 75);
  assert.match(r.stderr, /Ya le mandé 3 códigos a Sergio Urcullo en la última hora/);
  assert.equal(b.leer("tg-msg"), antes, "la cuarta no le llegó");
  // Las de hace más de una hora no cuentan.
  writeFileSync(join(b.estado, "vistas.log"), [1, 2, 3].map(() => Math.floor(Date.now() / 1000) - 3700).join("\n") + "\n");
  assert.equal(b.correr(["consulta"], "pregunta 4").status, 3);
});

test("un token con espacios no se usa (la llave mal cargada no rompe el encabezado)", () => {
  const b = banco();
  writeFileSync(join(b.dir, "pedidos.env"), `ONIA_RUTINA_URL=${URL_RUTINA}\nONIA_RUTINA_TOKEN='sk-ant mal pegado'\n`);
  assert.equal(b.correr(["plataforma"], TEXTO).status, 69);
  assert.equal(b.leer("tg-msg"), "");
});
