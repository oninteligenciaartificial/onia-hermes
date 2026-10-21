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

function diagnosticoModelo({ jobs, raw, cron = [], scripts = {}, codigoCron = 0, texto = seccion, config } = {}) {
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
    if (config !== undefined) writeFileSync(join(hermes, "config.yaml"), config);
    for (const [nombre, texto] of Object.entries(scripts)) {
      const ruta = join(bin, nombre);
      writeFileSync(ruta, texto.startsWith("#!") ? texto : `#!/usr/bin/env bash\n${texto}`);
      chmodSync(ruta, 0o755);
    }
    const ejecutable = (nombre, texto) => {
      const ruta = join(dobles, nombre);
      writeFileSync(ruta, `#!/usr/bin/env bash\n${texto}\n`);
      chmodSync(ruta, 0o755);
    };
    ejecutable("crontab", `cat <<'CRON'\n${cron.join("\n").replaceAll("/root/bin", bin)}\nCRON\nexit ${codigoCron}`);
    for (const nombre of ["curl", "wget", "hermes", "codex", "claude"]) {
      ejecutable(nombre, `printf '%s\\n' '${nombre}' >> '${marcador}'\nexit 1`);
    }
    const local = texto.replaceAll("/root/.hermes", hermes).replaceAll("/root/bin", bin);
    assert.doesNotMatch(local, /\/root\//, "ninguna ruta real del VPS en la sección ejecutada");
    const comun = readFileSync(new URL("comun.sh", DIR), "utf8").replaceAll("\r\n", "\n").replaceAll("/root", dir);
    const guion = "REDACTAR_SED='s/a^//'\n" + comun + "\n" + local;
    const r = spawnSync("bash", ["-s"], { input: guion, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
    assert.equal(existsSync(marcador), false, "se llamó a un modelo o comando de red");
    assert.equal(r.status, 0, r.error?.message || r.stdout + r.stderr);
    assert.ok(r.stdout.split("\n").includes(nube), r.stdout);
    assert.doesNotMatch(r.stdout, /SECRETO-DE-PRUEBA/);
    // Restaurar las rutas solo en la salida facilita comparar también el aviso fijo de crontab vacío.
    return r.stdout.replaceAll(bin, "/root/bin");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const trabajos = [
  { name: "resumen", schedule_display: "cada mañana", schedule: "NO ELEGIR", model: "gpt-5-mini", enabled: true, prompt: "SECRETO-DE-PRUEBA" },
  { name: "agenda", schedule_display: "", schedule: "0 9 * * *", cron: "NO ELEGIR", prompt: "SECRETO-DE-PRUEBA" },
  { name: "pausado", cron: "*/5 * * * *", expr: "NO ELEGIR", model: "claude-sonnet-4-5", enabled: false },
];

// No replicar ejemplos del contrato: si aplicar cambia su formato, esta extracción debe fallar.
const aplicar = readFileSync(new URL("aplicar.sh", DIR), "utf8").replaceAll("\r\n", "\n");
function cronDeAplicar(texto = aplicar, latido = "/root/bin/onia-latido.sh") {
  const inicio = texto.indexOf("# Los seis trabajos de este bloque");
  assert.ok(inicio >= 0, "falta el bloque real de latidos de aplicar.sh");
  const fin = texto.indexOf("\n):", inicio);
  assert.ok(fin > inicio, "no pude delimitar el bloque real de latidos");
  const bloque = texto.slice(inicio, fin);
  assert.match(bloque, /^LAT = "\/root\/bin\/onia-latido\.sh"$/m);
  const lineas = bloque.split("\n").filter((l) => l.includes("LAT +"));
  assert.equal(lineas.length, 6, "aplicar debe declarar los seis trabajos envueltos");
  return lineas.map((l) => {
    const m = l.match(/^\s*("(?:\\.|[^"\\])*") \+ LAT \+ ("(?:\\.|[^"\\])*"),$/);
    assert.ok(m, `no pude leer la línea real: ${l}`);
    return JSON.parse(m[1]) + latido + JSON.parse(m[2]);
  });
}
const scriptsReales = {
  "onia-latido.sh": "#!/bin/bash\nclaude\n", // Trampa: tampoco se ejecuta el envoltorio.
  "onia-jarvis-resumen.sh": 'MODELO="${ONIA_JARVIS_MODELO:-gpt-5-mini}"\nclaude\n',
  "onia-tg.sh": "#!/bin/bash\nclaude\n",
  "onia-agenda.sh": "#!/bin/bash\nclaude\n",
  "onia-respuestas-pedidos.sh": "#!/bin/bash\nclaude\n",
  "onia-qa-release.sh": "#!/bin/bash\nclaude\n",
};
const nombresReales = ["resumen-manana", "resumen-noche", "aduana-soltar", "agenda-bloques", "respuestas-pedidos", "qa-release"];
function revisarNombres(salida) {
  const filas = salida.split("\n").filter((l) => l.includes(" → "));
  assert.deepEqual(filas.map((l) => l.split(" → ")[0]), nombresReales);
  assert.ok(filas.every((l) => / → .*\/onia-[A-Za-z0-9._-]+\.sh \| cada /.test(l)), salida);
}
function revisarModelos(salida) {
  for (const nombre of nombresReales) {
    const fila = salida.split("\n").find((l) => l.startsWith(`${nombre} → `));
    assert.ok(fila, `falta ${nombre}`);
    assert.ok(fila.endsWith(` | modelo ${nombre.startsWith("resumen-") ? "gpt-5-mini" : "sin modelo declarado"}`), fila);
  }
}
function revisarSinLatido(salida) {
  assert.doesNotMatch(salida, /onia-latido\.sh \| cada/);
}

test("extracción: las seis líneas salen de aplicar y un formato desconocido falla", () => {
  assert.equal(cronDeAplicar().length, 6);
  assert.throws(() => cronDeAplicar(aplicar.replaceAll(" + LAT + ", " + OTRA + ")));
});

test("cron real de aplicar: seis nombres, scripts interiores y modelos", () => {
  const salida = diagnosticoModelo({ jobs: [], cron: cronDeAplicar(), scripts: scriptsReales });
  revisarNombres(salida);
  revisarModelos(salida);
  revisarSinLatido(salida);
  const esperados = ["onia-jarvis-resumen.sh", "onia-jarvis-resumen.sh", "onia-tg.sh", "onia-agenda.sh", "onia-respuestas-pedidos.sh", "onia-qa-release.sh"];
  nombresReales.forEach((nombre, i) => {
    const fila = salida.split("\n").find((l) => l.startsWith(`${nombre} → `));
    assert.ok(fila.includes(`/${esperados[i]} | cada `), fila);
  });
});

test("mutación: ignorar el latido rompe nombres, modelos y la ausencia del envoltorio", () => {
  const antes = "if palabras[indice] == base + 'onia-latido.sh':";
  assert.ok(seccion.includes(antes), "debe desactivar el desenvolvimiento real");
  const mutado = seccion.replace(antes, "if False:");
  const sana = diagnosticoModelo({ jobs: [], cron: cronDeAplicar(), scripts: scriptsReales });
  const rota = diagnosticoModelo({ jobs: [], cron: cronDeAplicar(), scripts: scriptsReales, texto: mutado });
  for (const revisar of [revisarNombres, revisarModelos, revisarSinLatido]) {
    revisar(sana);
    assert.throws(() => revisar(rota), `la mutación debe romper ${revisar.name}`);
  }
});

test("latido: conserva asignaciones interiores y combina overrides exteriores", () => {
  const aduana = cronDeAplicar().find((l) => l.includes(" aduana-soltar "));
  assert.ok(aduana.includes("'ONIA_AVISO_SOLTAR=1 /root/bin/onia-tg.sh'"));
  const interior = aduana.replace("ONIA_AVISO_SOLTAR=1 ", "ONIA_AVISO_SOLTAR=1 ONIA_X_MODELO=otro ");
  const exterior = aduana.replace("/root/bin/onia-latido.sh", "ONIA_X_MODELO=externo /root/bin/onia-latido.sh");
  const combinado = interior.replace("/root/bin/onia-latido.sh", "ONIA_X_MODELO=externo /root/bin/onia-latido.sh");
  const salida = diagnosticoModelo({ cron: [interior, exterior, combinado], scripts: {
    "onia-tg.sh": 'MODELO="${ONIA_X_MODELO:-gpt-default}"',
  } });
  const filas = salida.split("\n").filter((l) => l.startsWith("aduana-soltar → "));
  assert.deepEqual(filas.map((l) => l.split(" | modelo ")[1]), ["otro", "externo", "otro"]);
});

test("latido: script interior ausente, comando ilegible y nombre inválido", () => {
  const resumen = cronDeAplicar()[0];
  const salida = diagnosticoModelo({ cron: [resumen], scripts: {} });
  assert.match(salida, /resumen-manana → .*\/onia-jarvis-resumen\.sh \| cada 30 10 \* \* \* \| modelo no instalado/);
  const ilegible = resumen.replace("'/root/bin/onia-jarvis-resumen.sh manana'", "'echo fixture'");
  const invalido = ilegible.replace("resumen-manana", "'nombre inválido'");
  const corto = resumen.slice(0, resumen.indexOf(" resumen-manana")) + " sin-comando 86400";
  const malComando = resumen.replace("'/root/bin/onia-jarvis-resumen.sh manana'", `'"sin cierre'`);
  const out = diagnosticoModelo({ cron: [ilegible, invalido, corto, malComando] });
  assert.match(out, /resumen-manana → \(no pude leer el comando\) \| cada 30 10 \* \* \*/);
  assert.match(out, /\(sin nombre\) → \(no pude leer el comando\)/);
  assert.match(out, /sin-comando → \(no pude leer el comando\)/);
});

test("gateway: estructuras no se vuelcan y los tres campos se cortan a 80 caracteres", () => {
  const salida = diagnosticoModelo({ jobs: [
    { name: { dato: "SECRETO-DE-PRUEBA" }, schedule: { kind: "cron", expr: "0 6 * * *" }, model: { dato: "SECRETO-DE-PRUEBA" }, prompt: "SECRETO-DE-PRUEBA" },
    { name: "n".repeat(200), schedule: "s".repeat(200), model: "g".repeat(200) },
  ] });
  const filas = salida.split("\n").filter((l) => l.includes(" | habilitado:"));
  assert.equal(filas[0], "(estructura) | cada (estructura) | modelo (estructura) | habilitado: ?");
  assert.equal(filas[1], `${"n".repeat(80)} | cada ${"s".repeat(80)} | modelo ${"g".repeat(80)} | habilitado: ?`);
  assert.doesNotMatch(salida, /kind|expr|0 6 \* \* \*/);
});

test("sin trabajos o crontab ilegible: el diagnóstico lo dice explícitamente", () => {
  for (const jobs of [[], {}, { jobs: [] }, [null, "no es trabajo"]]) {
    assert.ok(diagnosticoModelo({ jobs }).includes("(el archivo no trae trabajos)"));
  }
  for (const opciones of [{}, { cron: ["0 * * * * /fixture/fuera.sh"] }, { cron: cronDeAplicar(), codigoCron: 1 }]) {
    const salida = diagnosticoModelo(opciones);
    assert.ok(salida.includes("(el crontab no trae trabajos con un script de /root/bin)"));
    if (!opciones.cron || opciones.codigoCron) assert.ok(salida.includes("(crontab ilegible o vacío)"));
    else assert.doesNotMatch(salida, /crontab ilegible o vacío/);
  }
});
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

test("sección 16: dice cuál es «el del gateway» (model.default y provider), sin las llaves de config.yaml", () => {
  // 21-oct: Sergio Urcullo pasa todo Hermes a gpt-6.1-sol; los trabajos sin modelo propio usan este.
  const config = "toolsets: [web]\nmodel:\n  default: gpt-6.1-sol\n  provider: openai-codex\n  api_key: SECRETO-DE-PRUEBA\n" +
    "fallback:\n  default: SECRETO-DE-PRUEBA\n";
  const salida = diagnosticoModelo({ jobs: trabajos, config });
  assert.match(salida, /^el del gateway: default: gpt-6\.1-sol provider: openai-codex $/m);
  assert.match(diagnosticoModelo({ jobs: trabajos }), /^el del gateway: \(no encontré model\.default en config\.yaml\)$/m);
});
