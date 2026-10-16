// Solo se ejecuta la guarda. Los pasos con la llave y SSH se inspeccionan como texto.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const workflow = readFileSync(new URL("../../.github/workflows/hermes-qa-diario.yml", import.meta.url), "utf8").replaceAll("\r\n", "\n");
function pasos(texto) {
  return [...texto.replaceAll("\r\n", "\n").matchAll(/^      - name: ([^\n]+)\n([\s\S]*?)(?=^      - name: |$(?![\s\S]))/gm)]
    .map((m) => ({ nombre: m[1].trim(), texto: m[0] }));
}
function run(paso) {
  const m = paso.texto.match(/^        run: \|\n((?:^          [^\n]*\n|^\s*\n)*)/m);
  assert.ok(m, `falta run: | en ${paso.nombre}`);
  return m[1].replace(/^          /gm, "");
}
function revisar(texto) {
  const lista = pasos(texto);
  const guardas = lista.filter((p) => p.nombre === "Solo desde main");
  const problemas = [];
  if (guardas.length !== 1) return ["debe existir una única guarda Solo desde main"];
  const guarda = guardas[0];
  const indice = lista.indexOf(guarda);
  // La comparación exacta y la salida deben pertenecer al run, no a un comentario.
  let guion = "";
  try { guion = run(guarda); } catch { problemas.push("la guarda no tiene run"); }
  if (!/\[ "\$GITHUB_REF" = refs\/heads\/main \] \|\| \{[^\n]*; exit 1; \}/.test(guion)) {
    problemas.push("la guarda no rechaza otras referencias con exit 1");
  }
  if (/^        (?:continue-on-error|if):/m.test(guarda.texto)) problemas.push("la guarda puede omitirse o ignorarse");
  const sensible = /secrets\.|\bssh\s|vps_key|ONIA_VPS_SSH_KEY|root@/;
  lista.forEach((p, i) => {
    if (sensible.test(p.texto) && i <= indice) problemas.push(`${p.nombre}: acceso sensible antes de superar la guarda`);
  });
  return problemas;
}

test("el workflow real guarda main antes de escribir la llave o conectarse", () => {
  assert.deepEqual(revisar(workflow), []);
});

const guarda = pasos(workflow).find((p) => p.nombre === "Solo desde main");
assert.ok(guarda, "falta hermes-qa-diario.yml con la guarda de #194");
for (const ref of ["refs/heads/otra-rama", "refs/heads/main", "refs/heads/main-2", "refs/heads/main/x", "refs/pull/7/merge", "refs/tags/v1", undefined, ""]) {
  test(`ejecutar guarda: GITHUB_REF=${ref === undefined ? "(ausente)" : JSON.stringify(ref)}`, () => {
    const env = { ...process.env };
    delete env.GITHUB_REF;
    if (ref !== undefined) env.GITHUB_REF = ref;
    const r = spawnSync("bash", ["-e", "-s"], { input: run(guarda), env, encoding: "utf8" });
    assert.equal(r.status, ref === "refs/heads/main" ? 0 : 1, r.error?.message || r.stdout + r.stderr);
    if (ref !== "refs/heads/main") {
      assert.equal(r.stdout.trim(), `el QA diario corre solo desde main (pediste ${ref ?? ""})`);
    }
  });
}

test("mutaciones: ausente, después de la llave, permisiva y continue-on-error", () => {
  const llave = pasos(workflow).find((p) => p.nombre === "Llave SSH del VPS");
  assert.ok(llave);
  const sinGuarda = workflow.replace(guarda.texto, "");
  const permisiva = guarda.texto.replace(/\|\| \{[^\n]*; exit 1; \}/, "|| true");
  assert.notEqual(permisiva, guarda.texto);
  const mutaciones = [
    sinGuarda,
    sinGuarda.replace(llave.texto, llave.texto + guarda.texto),
    workflow.replace(guarda.texto, permisiva),
    workflow.replace(guarda.texto, guarda.texto.replace("        run:", "        continue-on-error: true\n        run:")),
    workflow.replace(guarda.texto, guarda.texto.replace("        run:", "        if: false\n        run:")),
  ];
  for (const [i, texto] of mutaciones.entries()) {
    assert.notEqual(texto, workflow, `mutación ${i + 1} aplicada`);
    assert.ok(revisar(texto).length > 0, `mutación ${i + 1} sin detectar`);
  }
});

// E36 (16-oct): el diagnóstico sale 0 aunque haya vigías mudos; el job tiene que fallar si cuenta alguno.
test("el job falla cuando el diagnóstico cuenta vigías MUDOS, y queda verde con 0", () => {
  const paso = pasos(workflow).find((p) => p.nombre.startsWith("Ejecutar diagnostico"));
  assert.ok(paso, "falta el paso que ejecuta el diagnóstico");
  const m = run(paso).match(/if grep -Eq -- '([^']+)' /);
  assert.ok(m, "falta el chequeo de MUDA(S) sobre el log");
  const re = new RegExp(m[1].replace(/^\^/, "^"), "m");
  assert.ok(re.test("--- 12 línea(s): 2 MUDA(S), 0 sin log, 1 no medibles\n"), "2 mudos deben fallar");
  assert.ok(!re.test("--- 12 línea(s): 0 MUDA(S), 0 sin log, 1 no medibles\n"), "0 mudos debe quedar verde");
});
