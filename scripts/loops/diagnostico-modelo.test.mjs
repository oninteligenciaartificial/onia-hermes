// Se corre únicamente la sección nueva, con archivos locales y comandos trampa para detectar llamadas.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, chmodSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DIR = new URL("../../hermes-content/deploy/hermes-jarvis/", import.meta.url);
const diag = readFileSync(new URL("diagnostico.sh", DIR), "utf8").replaceAll("\r\n", "\n");
const inicio = diag.indexOf('sec "16.');
assert.ok(inicio >= 0, "falta la sección 16");
const fin = diag.indexOf('\nsec "', inicio + 1);
assert.ok(fin > inicio, "falta la sección siguiente");
const seccion = diag.slice(inicio, fin);
const nube = "sesión de la nube de Hermes-Jarvis: modelo no medible desde el VPS (lo lee la madre en la consola de la sesión)";

function diagnosticoModelo({ jobs, raw, cron = [], scripts = {} } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "diag-modelo-"));
  try {
    const hermes = join(dir, "hermes");
    const bin = join(dir, "bin");
    const dobles = join(dir, "dobles");
    const marcador = join(dir, "llamada-prohibida");
    for (const ruta of [join(hermes, "cron"), bin, dobles]) mkdirSync(ruta, { recursive: true });
    if (jobs !== undefined || raw !== undefined) {
      writeFileSync(join(hermes, "cron", "jobs.json"), raw ?? JSON.stringify(jobs));
    }
    for (const [nombre, texto] of Object.entries(scripts)) writeFileSync(join(bin, nombre), texto);
    const ejecutable = (nombre, texto) => {
      const ruta = join(dobles, nombre);
      writeFileSync(ruta, `#!/usr/bin/env bash\n${texto}\n`);
      chmodSync(ruta, 0o755);
    };
    ejecutable("crontab", `cat <<'CRON'\n${cron.join("\n").replaceAll("/root/bin", bin)}\nCRON`);
    for (const nombre of ["curl", "wget", "hermes", "codex", "claude"]) {
      ejecutable(nombre, `printf '%s\\n' '${nombre}' >> '${marcador}'\nexit 1`);
    }
    const local = seccion.replaceAll("/root/.hermes", hermes).replaceAll("/root/bin", bin);
    assert.doesNotMatch(local, /\/root\//, "ninguna ruta real del VPS en la sección ejecutada");
    const comun = readFileSync(new URL("comun.sh", DIR), "utf8").replaceAll("\r\n", "\n").replaceAll("/root", dir);
    const guion = "REDACTAR_SED='s/a^//'\n" + comun + "\n" + local;
    const r = spawnSync("bash", ["-s"], { input: guion, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
    assert.equal(existsSync(marcador), false, "se llamó a un modelo o comando de red");
    assert.equal(r.status, 0, r.error?.message || r.stdout + r.stderr);
    assert.ok(r.stdout.split("\n").includes(nube), r.stdout);
    assert.doesNotMatch(r.stdout, /SECRETO-DE-PRUEBA/);
    return r.stdout;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const trabajos = [
  { name: "resumen", schedule_display: "cada mañana", schedule: "NO ELEGIR", model: "gpt-5-mini", enabled: true, prompt: "SECRETO-DE-PRUEBA" },
  { name: "agenda", schedule_display: "", schedule: "0 9 * * *", cron: "NO ELEGIR", prompt: "SECRETO-DE-PRUEBA" },
  { name: "pausado", cron: "*/5 * * * *", expr: "NO ELEGIR", model: "claude-sonnet-4-5", enabled: false },
];
for (const [nombre, jobs] of [["lista", trabajos], ["jobs", { jobs: trabajos }], ["diccionario", Object.fromEntries(trabajos.map((j, i) => [`id-${i}`, j]))]]) {
  test(`gateway como ${nombre}: solo nombre, horario, modelo y habilitación`, () => {
    const salida = diagnosticoModelo({ jobs });
    const filas = salida.split("\n").filter((l) => l.includes(" | habilitado:"));
    assert.deepEqual(filas, [
      "resumen | cada cada mañana | modelo gpt-5-mini | habilitado: sí",
      "agenda | cada 0 9 * * * | modelo (el del gateway) | habilitado: ?",
      "pausado | cada */5 * * * * | modelo claude-sonnet-4-5 | habilitado: no",
    ]);
    assert.doesNotMatch(salida, /NO ELEGIR|prompt/);
  });
}

test("gateway: expr, modelo vacío y otra clave de modelo no se adivina", () => {
  const salida = diagnosticoModelo({ jobs: [{ name: "expr", expr: "@daily", model: "", model_name: "NO ELEGIR" }] });
  assert.match(salida, /expr \| cada @daily \| modelo \(el del gateway\) \| habilitado: \?/);
  assert.doesNotMatch(salida, /NO ELEGIR/);
});

for (const [nombre, opciones] of [["ausente", {}], ["inválido", { raw: '{"prompt": "SECRETO-DE-PRUEBA"' }], ["forma inválida", { jobs: 42 }]]) {
  test(`jobs.json ${nombre}: avisa sin datos privados y sigue con B y C`, () => {
    const salida = diagnosticoModelo({ ...opciones, cron: ["30 10 * * * /root/bin/diario.sh"], scripts: { "diario.sh": "#!/bin/bash\n" } });
    assert.match(salida, /no pude leer .*jobs\.json: \w+Error/);
    assert.match(salida, /--- B\./);
    assert.match(salida, /diario\.sh \| cada 30 10 \* \* \* \| modelo sin modelo declarado/);
  });
}

test("cron: default, override, sin declaración y no instalado; no ejecuta scripts", () => {
  const salida = diagnosticoModelo({
    jobs: [],
    cron: [
      "SHELL=/bin/bash",
      "# 0 * * * * /root/bin/pausado.sh",
      "30 10 * * * /root/bin/onia-jarvis-resumen.sh >> /fixture/log",
      "0 11 * * * ONIA_JARVIS_MODELO=gpt-5 /root/bin/onia-jarvis-resumen.sh",
      "0 12 * * * /root/bin/sin-modelo.sh",
      "0 13 * * * /root/bin/no-existe.sh",
    ],
    scripts: {
      "onia-jarvis-resumen.sh": '#!/bin/bash\nOTRA="${OTRA:-ignorar}"\nMODELO="${ONIA_JARVIS_MODELO:-gpt-5-mini}"\nSEGUNDO="${OTRO_MODEL:-claude-otro}"\nclaude\n',
      "sin-modelo.sh": "#!/bin/bash\ncurl\n",
    },
  });
  const filas = salida.split("\n").filter((l) => l.includes(".sh | cada"));
  assert.equal(filas.length, 4);
  assert.match(filas[0], /onia-jarvis-resumen\.sh \| cada 30 10 \* \* \* \| modelo gpt-5-mini$/);
  assert.match(filas[1], /onia-jarvis-resumen\.sh \| cada 0 11 \* \* \* \| modelo gpt-5$/);
  assert.match(filas[2], /sin-modelo\.sh \| cada 0 12 \* \* \* \| modelo sin modelo declarado$/);
  assert.match(filas[3], /no-existe\.sh \| cada 0 13 \* \* \* \| modelo no instalado$/);
  assert.doesNotMatch(salida, /pausado|SHELL|claude-otro|ignorar/);
});

test("cron: alias, override entre comillas y expresiones no se expanden", () => {
  const salida = diagnosticoModelo({ cron: [
    '@daily ONIA_MODEL="gpt-5" /root/bin/modelo.sh',
    '0 * * * * ONIA_MODEL=$TOKEN /root/bin/modelo.sh',
    '0 2 * * * /root/bin/modelo.sh ONIA_MODEL=claude-otro',
  ], scripts: { "modelo.sh": 'MODELO="${ONIA_MODEL:-gpt-5-mini}"' } });
  assert.match(salida, /modelo\.sh \| cada @daily \| modelo gpt-5$/m);
  assert.match(salida, /modelo\.sh \| cada 0 \* \* \* \* \| modelo sin modelo declarado$/m);
  assert.match(salida, /modelo\.sh \| cada 0 2 \* \* \* \| modelo gpt-5-mini$/m);
  assert.doesNotMatch(salida, /\$TOKEN|claude-otro/);
});

test("sección 16: no contiene herramientas, bibliotecas ni destinos de red", () => {
  assert.doesNotMatch(seccion, /curl|wget|urllib|requests|http:\/\/|https:\/\/|api\.openai|LITELLM|hermes cron/);
  assert.match(seccion, /\}\s*\| redactar\s*$/);
});
