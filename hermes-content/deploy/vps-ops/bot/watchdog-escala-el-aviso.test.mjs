// ONIA — el watchdog tiene que SEGUIR avisando mientras el bot siga caido.
//
// LO QUE PASO: el motor del chatbot estuvo muerto del 19-sep 19:00 UTC al 21-sep 19:34 —
// dos dias sin contestar WhatsApp. El watchdog lo DETECTO desde el primer minuto y escribio
// 800 KB de log gritando cada 2 minutos. Y mando su aviso de Telegram: UNO, un viernes a las
// 19:00, a un Telegram donde Sergio Urcullo ya tiene decenas de tareas abiertas. Despues se
// callo 1.440 ciclos, porque el marcador que evita el spam ("un incidente = un aviso")
// evitaba tambien el segundo aviso — para siempre.
//
// O sea: no faltaba una sonda. La sonda funcionaba. Faltaba INSISTIR.
//
// LO QUE ESTE TEST CUIDA es la escalada: 0 (inmediato), 15 min, 1 h, 6 h y despues uno por
// dia. Y cuida la otra mitad, que es igual de importante: una caida corta tiene que seguir
// costando UN SOLO mensaje. Un watchdog que manda 30 mensajes por hora se silencia, y
// entonces volvemos al mismo lugar por el camino contrario.
//
// Las funciones se EXTRAEN del script real y se corren de verdad en sh — probar aritmetica
// de shell leyendola es como verificar una pantalla con grep.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/watchdog-escala-el-aviso.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = readFileSync(path.join(AQUI, "webhook-watchdog.sh"), "utf8");

/** Rutas para sh: backslash de Windows fuera. */
const aPosix = (p) => p.split(path.sep).join("/");

/**
 * Extrae el bloque de funciones de escalada del watchdog REAL. Si alguien las renombra o las
 * borra, esto explota — que es exactamente lo que queremos: el test no debe poder quedar
 * verde midiendo una copia vieja de la logica.
 */
function funcionesDelWatchdog() {
  const desde = SCRIPT.indexOf("hito_alcanzado()");
  const hasta = SCRIPT.indexOf("# 1. ¿Existe el contenedor?");
  assert.ok(desde > 0, "no encontre hito_alcanzado() en webhook-watchdog.sh");
  assert.ok(hasta > desde, "no encontre el final del bloque de funciones de escalada");
  return SCRIPT.slice(desde, hasta);
}

/**
 * Corre un guion de sh con las funciones reales y un `tg_error` de mentira que solo apila
 * mensajes. Devuelve los mensajes "enviados".
 */
function correr(guion) {
  const dir = mkdtempSync(path.join(tmpdir(), "onia-wd-"));
  const d = aPosix(dir);
  try {
    const f = path.join(dir, "caso.sh");
    writeFileSync(
      f,
      [
        "set -u",
        `INCIDENTE="${d}/incidente"`,
        `ENVIADOS="${d}/enviados"`,
        ': > "$ENVIADOS"',
        `tg_error() { printf '%s\\n===FIN===\\n' "$1" >> "$ENVIADOS"; }`,
        funcionesDelWatchdog(),
        guion,
        'cat "$ENVIADOS"',
        "",
      ].join("\n")
    );
    const out = execFileSync("bash", [aPosix(f)], { encoding: "utf8" });
    return out
      .split("===FIN===")
      .map((x) => x.trim())
      .filter(Boolean);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Deja el marcador como si el bot estuviera caido hace N segundos, con el hito ya avisado. */
const caidoDesdeHace = (segundos, hitoYaAvisado) =>
  `printf '%s %s\\n' "$(( $(date +%s) - ${segundos} ))" "${hitoYaAvisado}" > "$INCIDENTE"`;

test("la primera caida avisa una sola vez, aunque el cron corra muchas veces", () => {
  const enviados = correr(
    ['avisar_caida "CAIDO"', 'avisar_caida "CAIDO"', 'avisar_caida "CAIDO"', 'avisar_caida "CAIDO"'].join("\n")
  );
  assert.equal(
    enviados.length,
    1,
    "una caida corta tiene que costar UN mensaje: el cron corre cada 2 min y 30 mensajes/hora se silencian"
  );
  assert.match(enviados[0], /CAIDO/);
});

test("a los 15 minutos re-avisa, y el mensaje dice hace cuanto", () => {
  const enviados = correr([caidoDesdeHace(910, 0), 'avisar_caida "CAIDO"', 'avisar_caida "CAIDO"'].join("\n"));
  assert.equal(enviados.length, 1, "el hito de 15 min tiene que producir exactamente un aviso mas");
  assert.match(enviados[0], /Caido hace/, "un re-aviso sin la antiguedad se lee como el mismo mensaje repetido");
  assert.match(enviados[0], /15 min/);
});

test("escala 15min -> 1h -> 6h -> un dia, sin repetir hitos ya avisados", () => {
  const casos = [
    { seg: 3700, ultimo: 900, espera: /1h/ },
    { seg: 22000, ultimo: 3600, espera: /6h/ },
    { seg: 90000, ultimo: 21600, espera: /1d/ },
  ];
  for (const c of casos) {
    const enviados = correr([caidoDesdeHace(c.seg, c.ultimo), 'avisar_caida "CAIDO"', 'avisar_caida "CAIDO"'].join("\n"));
    assert.equal(enviados.length, 1, `el hito de ${c.seg}s tiene que avisar exactamente una vez`);
    assert.match(enviados[0], c.espera, `el aviso de ${c.seg}s tiene que nombrar su duracion`);
  }
});

test("dos dias caido = dos avisos diarios, no uno para siempre (el bug de septiembre)", () => {
  // Al segundo dia el hito pasa de 86400 a 172800: el watchdog NO puede quedarse callado.
  const enviados = correr([caidoDesdeHace(180000, 86400), 'avisar_caida "CAIDO"'].join("\n"));
  assert.equal(enviados.length, 1, "pasado el segundo dia tiene que volver a avisar");
  assert.match(enviados[0], /2d/);
});

test("dentro de un mismo hito el watchdog se calla", () => {
  const enviados = correr(
    [caidoDesdeHace(90000, 86400), 'avisar_caida "CAIDO"', 'avisar_caida "CAIDO"', 'avisar_caida "CAIDO"'].join("\n")
  );
  assert.equal(enviados.length, 0, "repetir el mismo hito es el spam que silencia el canal");
});

test("la recuperacion avisa una sola vez y dice cuanto duro la caida", () => {
  const enviados = correr(
    [caidoDesdeHace(7500, 3600), 'avisar_recuperacion "RECUPERADO."', 'avisar_recuperacion "RECUPERADO."'].join("\n")
  );
  assert.equal(enviados.length, 1, "la recuperacion avisa una vez y borra el marcador");
  assert.match(enviados[0], /Estuvo caido/);
  assert.match(enviados[0], /2h/);
});

test("sin incidente abierto, la recuperacion NO manda nada", () => {
  const enviados = correr('avisar_recuperacion "RECUPERADO."');
  assert.equal(enviados.length, 0, "un bot que nunca se cayo no puede anunciar que se recupero");
});

test("un marcador del formato viejo (touch vacio) no rompe ni se traga el aviso", () => {
  // Antes el marcador era un archivo vacio. Tras el deploy pueden convivir los dos formatos.
  const enviados = correr([': > "$INCIDENTE"', 'avisar_caida "CAIDO"'].join("\n"));
  assert.equal(enviados.length, 1, "un marcador viejo se trata como incidente nuevo, nunca como silencio");
});

test("el watchdog sigue distinguiendo 'no arranca' de 'no responde'", () => {
  // Reiniciar no devuelve un archivo que no esta: ante un modulo faltante hay que re-sincronizar.
  assert.match(
    SCRIPT,
    /MODULE_NOT_FOUND|Cannot find module/,
    "el watchdog tiene que reconocer un arbol roto dentro del contenedor"
  );
  assert.match(
    SCRIPT,
    /rm -rf \/tmp\/onia-bot/,
    "ante un modulo faltante tiene que borrar el arbol del contenedor y forzar un re-sync limpio"
  );
});
