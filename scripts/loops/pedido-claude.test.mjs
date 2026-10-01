// pedido-claude.test.mjs — Hermes le pasa un pedido de Sergio Urcullo a Claude en la nube.
//
// POR QUÉ EXISTE. Sergio Urcullo, 2026-10-01: «que ya podamos manejar todo desde ahí» (Hermes).
// El 30-sep eligió que Hermes también ejecute; la forma acordada es que Hermes NO programe: le
// muestra el pedido exacto y, con su sí, dispara una rutina de Claude Code en la nube
// (hermes-content/docs/TELEGRAM_COMMAND_CENTER.md). Estos casos fijan lo que no se puede romper:
// sin vista previa no sale nada, lo que sale es palabra por palabra lo que él vio, el token nunca
// aparece en una salida, y un modelo con prisa no puede mandar diez veces lo mismo.
//
// Se corre con: node --test scripts/loops/pedido-claude.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, "pedido-claude.sh");
const URL_RUTINA = "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef234/fire";
const TOKEN = "sk-ant-oat01-NO-SE-IMPRIME-NUNCA";

function banco({ configurado = true, curlFalla = false, respuesta } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "pedido-"));
  const estado = join(dir, "estado");
  const conf = join(dir, "pedidos.env");
  if (configurado) writeFileSync(conf, `ONIA_RUTINA_URL=${URL_RUTINA}\nONIA_RUTINA_TOKEN=${TOKEN}\n`);
  const r =
    respuesta ??
    JSON.stringify({
      type: "routine_fire",
      claude_code_session_id: "session_01XYZ",
      claude_code_session_url: "https://claude.ai/code/session_01XYZ",
    });
  writeFileSync(join(dir, "respuesta.json"), r);
  const curl = join(dir, "curl.sh");
  writeFileSync(
    curl,
    `#!/usr/bin/env bash
n=$(cat ${dir}/llamadas 2>/dev/null || echo 0); echo $((n + 1)) > ${dir}/llamadas
prev=""
for a in "$@"; do
  case "$prev" in
    --data-binary) printf '%s' "$a" > ${dir}/cuerpo.json ;;
    -H) case "$a" in @*) cp "\${a#@}" ${dir}/encabezado-token ;; *) echo "$a" >> ${dir}/encabezados ;; esac ;;
    -X) : ;;
  esac
  case "$a" in https://*) echo "$a" > ${dir}/url ;; esac
  prev="$a"
done
${curlFalla ? 'echo "curl: (22) The requested URL returned error: 401" >&2; exit 22' : `cat ${dir}/respuesta.json`}
`,
  );
  chmodSync(curl, 0o755);
  const correr = (args, env = {}) =>
    spawnSync("bash", [SCRIPT, ...args], {
      env: {
        ...process.env,
        ONIA_PEDIDOS_CONF: conf,
        ONIA_PEDIDOS_ESTADO: estado,
        ONIA_PEDIDOS_CURL: curl,
        ...env,
      },
      encoding: "utf8",
    });
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  const llamadas = () => Number(leer("llamadas") || 0);
  return { dir, estado, correr, leer, llamadas };
}

const PEDIDO = ["plataforma", "Arreglá", "el", "botón", "«Confirmar»", "de", "la", "agenda"];

test("sin --si no manda nada: muestra el texto exacto y sale 3", () => {
  const b = banco();
  const r = b.correr(PEDIDO);
  assert.equal(r.status, 3);
  assert.match(r.stdout, /Esto le mando a Claude \(carril plataforma\):\n«Arreglá el botón «Confirmar» de la agenda»/);
  assert.equal(b.llamadas(), 0, "una vista previa no puede llamar a la rutina");
});

test("--si sin vista previa de ESE texto no sale (66)", () => {
  const b = banco();
  b.correr(["plataforma", "otro pedido distinto"]);
  const r = b.correr([...PEDIDO, "--si"]);
  assert.equal(r.status, 66);
  assert.match(r.stderr, /Primero mostrale el pedido/);
  assert.equal(b.llamadas(), 0);
});

test("una vista previa vieja (más de una hora) no vale", () => {
  const b = banco();
  b.correr(PEDIDO);
  const previas = join(b.estado, "previas");
  const hash = spawnSync("ls", [previas], { encoding: "utf8" }).stdout.trim();
  writeFileSync(join(previas, hash), String(Math.floor(Date.now() / 1000) - 3700) + "\n");
  assert.equal(b.correr([...PEDIDO, "--si"]).status, 66);
  assert.equal(b.llamadas(), 0);
});

test("con vista previa y --si: dispara la rutina con el texto palabra por palabra y devuelve el link", () => {
  const b = banco();
  b.correr(PEDIDO);
  const r = b.correr([...PEDIDO, "--si"]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /✅ Lo tomó Claude \(pedido p_[0-9a-f]{8}\)\. Lo podés seguir acá: https:\/\/claude\.ai\/code\/session_01XYZ/);
  assert.equal(b.leer("url").trim(), URL_RUTINA);
  const cuerpo = JSON.parse(b.leer("cuerpo.json"));
  assert.match(cuerpo.text, /^PEDIDO p_[0-9a-f]{8} · carril: plataforma · \d{4}-\d{2}-\d{2} \d{2}:\d{2} \(La Paz\)\n/);
  assert.match(cuerpo.text, /confirmó con un «sí» después de ver este texto exacto:\n«Arreglá el botón «Confirmar» de la agenda»$/);
  assert.match(b.leer("encabezados"), /anthropic-beta: experimental-cc-routine-2026-04-01/);
  assert.match(b.leer("encabezados"), /anthropic-version: 2023-06-01/);
  const fila = readFileSync(join(b.estado, "pedidos.tsv"), "utf8").trim().split("\t");
  assert.equal(fila.length, 6);
  assert.equal(fila[2], "plataforma");
  assert.equal(fila[4], "session_01XYZ");
  assert.equal(fila[5], "https://claude.ai/code/session_01XYZ");
});

test("el token va por un archivo de encabezado, nunca como argumento ni en la salida", () => {
  const b = banco();
  b.correr(PEDIDO);
  const r = b.correr([...PEDIDO, "--si"]);
  assert.equal(b.leer("encabezado-token").trim(), `Authorization: Bearer ${TOKEN}`);
  assert.doesNotMatch(b.leer("encabezados"), /Bearer/);
  assert.doesNotMatch(r.stdout + r.stderr, /NO-SE-IMPRIME/);
});

test("si la rutina no responde, lo dice, no registra nada y no filtra el token", () => {
  const b = banco({ curlFalla: true });
  b.correr(PEDIDO);
  const r = b.correr([...PEDIDO, "--si"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /el pedido NO salió/);
  assert.doesNotMatch(r.stdout + r.stderr, /NO-SE-IMPRIME|401/);
  assert.equal(existsSync(join(b.estado, "pedidos.tsv")), false);
});

test("una respuesta sin link de sesión no se da por mandada", () => {
  const b = banco({ respuesta: '{"error":{"type":"invalid_request_error"}}' });
  b.correr(PEDIDO);
  const r = b.correr([...PEDIDO, "--si"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /sin link de sesión/);
  assert.equal(existsSync(join(b.estado, "pedidos.tsv")), false);
});

test("el mismo pedido dos veces en una hora: el segundo no sale y devuelve el link del primero", () => {
  const b = banco();
  b.correr(PEDIDO);
  b.correr([...PEDIDO, "--si"]);
  b.correr(PEDIDO);
  const r = b.correr([...PEDIDO, "--si"]);
  assert.equal(r.status, 75);
  assert.match(r.stderr, /ya salió hace menos de una hora: https:\/\/claude\.ai\/code\/session_01XYZ/);
  assert.equal(b.llamadas(), 1);
});

test("tope del día: después de N pedidos no sale ninguno más", () => {
  const b = banco();
  for (const n of [1, 2]) {
    b.correr(["consulta", `pregunta ${n}`], { ONIA_PEDIDOS_TOPE: "2" });
    assert.equal(b.correr(["consulta", `pregunta ${n}`, "--si"], { ONIA_PEDIDOS_TOPE: "2" }).status, 0);
  }
  b.correr(["consulta", "pregunta 3"], { ONIA_PEDIDOS_TOPE: "2" });
  const r = b.correr(["consulta", "pregunta 3", "--si"], { ONIA_PEDIDOS_TOPE: "2" });
  assert.equal(r.status, 75);
  assert.match(r.stderr, /Ya van 2 pedidos hoy \(tope 2\)/);
  assert.equal(b.llamadas(), 2);
});

test("lo que necesita la PC no va a la nube: va al tablero para la madre", () => {
  const b = banco();
  for (const c of ["pc", "madre"]) {
    const r = b.correr([c, "grabá el video de hoy"]);
    assert.equal(r.status, 65);
    assert.match(r.stderr, /necesita la PC de Sergio Urcullo/);
  }
  assert.equal(b.correr(["cualquiera", "algo"]).status, 65);
  assert.equal(b.llamadas(), 0);
});

test("texto vacío o larguísimo: no sale", () => {
  const b = banco();
  assert.equal(b.correr(["ventas", "   "]).status, 65);
  assert.equal(b.correr(["ventas", "x".repeat(2001)]).status, 65);
});

test("sin configurar: la vista previa avisa que no va a poder, y --si sale 69 sin llamar", () => {
  const b = banco({ configurado: false });
  const v = b.correr(PEDIDO);
  assert.equal(v.status, 3);
  assert.match(v.stdout, /Todavía no está configurado/);
  assert.equal(b.correr([...PEDIDO, "--si"]).status, 69);
  assert.equal(b.correr(["--estado"]).status, 69);
  assert.equal(b.llamadas(), 0);
});

test("una URL que no es la de una rutina de claude.ai no se usa", () => {
  const b = banco();
  writeFileSync(join(b.dir, "pedidos.env"), `ONIA_RUTINA_URL=https://evil.example/fire\nONIA_RUTINA_TOKEN=${TOKEN}\n`);
  b.correr(PEDIDO);
  assert.equal(b.correr([...PEDIDO, "--si"]).status, 69);
  assert.equal(b.llamadas(), 0);
});

test("--lista: los pedidos del día con su estado; sin respuesta hasta que Claude conteste", () => {
  const b = banco();
  b.correr(PEDIDO);
  b.correr([...PEDIDO, "--si"]);
  const antes = b.correr(["--lista"]).stdout.trim().split("\t");
  assert.equal(antes[2], "plataforma");
  assert.equal(antes[3], "sin respuesta");
  const id = antes[1];
  writeFileSync(join(b.estado, "respuestas.tsv"), `${Math.floor(Date.now() / 1000)}\t${id}\tlisto\n`);
  assert.equal(b.correr(["--lista"]).stdout.trim().split("\t")[3], "listo");
  assert.equal(b.correr(["--lista", "2020-01-01"]).stdout, "");
});
