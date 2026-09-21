// ONIA — el watchdog tiene que SEGUIR avisando mientras el bot siga caido.
//
// LO QUE PASO: el motor del chatbot estuvo muerto del 19-sep 19:00 UTC al 21-sep 19:34 — dos dias
// sin contestar WhatsApp. Y la version que circulo en los handoffs ("el watchdog no avisa a
// nadie") es FALSA, lo cual importa porque manda a construir la cosa equivocada: el watchdog
// detecto la caida al primer minuto, tenia Telegram cableado y las credenciales cargadas, y mando
// su alarma. UNA. Un viernes a las 19:00, a un Telegram donde Sergio Urcullo ya tiene decenas de
// tareas abiertas. Despues se callo 1.440 ciclos seguidos mientras el bot seguia muerto, porque el
// mismo marcador que evita el spam evitaba tambien el segundo aviso, para siempre.
//
// O sea: no faltaba una sonda. Las tres sondas andaban. Faltaba INSISTIR.
//
// LO QUE ESTE ARCHIVO CUIDA son las dos mitades, que se rompen en direcciones opuestas:
//   1. Una caida larga tiene que VOLVER a avisar: 15 min, 1 h, 6 h y despues una vez por dia.
//   2. Una caida corta tiene que seguir costando UN SOLO mensaje. Un watchdog que manda 30
//      mensajes por hora se silencia, y se termina en el mismo lugar por el camino contrario.
//      (Este archivo no inventa esa preocupacion: los strikes de `webhook-watchdog.sh` existen
//      por lo mismo, y su comentario cuenta los tres falsos positivos que los motivaron.)
//
// Las funciones se EXTRAEN del script real y se corren de verdad en sh. Probar aritmetica de
// shell leyendola es el equivalente a verificar una pantalla con `grep`.
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

/** Rutas para sh: los backslash de Windows fuera. */
const aPosix = (p) => p.split(path.sep).join("/");

/**
 * Extrae el bloque de escalada del watchdog REAL. Si alguien renombra o borra las funciones,
 * esto explota — que es lo que queremos: el test no debe poder quedar verde midiendo una copia
 * vieja de la logica, que es exactamente como nacen las guardas huecas.
 */
function funcionesDelWatchdog() {
  const desde = SCRIPT.indexOf("hito_alcanzado()");
  const hasta = SCRIPT.indexOf("# 1. ¿Existe el contenedor?");
  assert.ok(desde > 0, "no encontre hito_alcanzado() en webhook-watchdog.sh");
  assert.ok(hasta > desde, "no encontre el final del bloque de funciones de escalada");
  return SCRIPT.slice(desde, hasta);
}

/** Corre un guion de sh con las funciones reales y un `tg_error` que solo apila mensajes. */
function correr(guion) {
  const dir = mkdtempSync(path.join(tmpdir(), "onia-wd-"));
  const d = aPosix(dir);
  try {
    const f = path.join(dir, "caso.sh");
    writeFileSync(
      f,
      [
        "set -u",
        `MARCADOR="${d}/incidente"`,
        `ENVIADOS="${d}/enviados"`,
        ': > "$ENVIADOS"',
        `tg_error() { printf '%s\\n===FIN===\\n' "$1" >> "$ENVIADOS"; }`,
        funcionesDelWatchdog(),
        guion,
        'cat "$ENVIADOS"',
        "",
      ].join("\n"),
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

/** Deja el marcador como si la falla llevara N segundos, con `hitoYaAvisado` ya notificado. */
const fallandoDesdeHace = (segundos, hitoYaAvisado) =>
  `printf '%s %s\\n' "$(( $(date +%s) - ${segundos} ))" "${hitoYaAvisado}" > "$MARCADOR"`;

test("la primera caida avisa una sola vez, aunque el cron corra muchas veces", () => {
  const enviados = correr(
    ['avisar_caida "$MARCADOR" "CAIDO"', 'avisar_caida "$MARCADOR" "CAIDO"', 'avisar_caida "$MARCADOR" "CAIDO"'].join(
      "\n",
    ),
  );
  assert.equal(
    enviados.length,
    1,
    "una caida corta tiene que costar UN mensaje: el cron corre cada 2 min y 30 mensajes/hora silencian el canal",
  );
  assert.match(enviados[0], /CAIDO/);
});

test("a los 15 minutos re-avisa, y el mensaje dice hace cuanto", () => {
  const enviados = correr(
    [fallandoDesdeHace(910, 0), 'avisar_caida "$MARCADOR" "CAIDO"', 'avisar_caida "$MARCADOR" "CAIDO"'].join("\n"),
  );
  assert.equal(enviados.length, 1, "el hito de 15 min tiene que producir exactamente un aviso mas");
  assert.match(enviados[0], /Lleva/, "un re-aviso sin la antiguedad se lee como el mismo mensaje repetido");
  assert.match(enviados[0], /15 min/);
});

test("escala 15min -> 1h -> 6h -> un dia, sin repetir hitos ya avisados", () => {
  const casos = [
    { seg: 3700, ultimo: 900, espera: /1h/ },
    { seg: 22000, ultimo: 3600, espera: /6h/ },
    { seg: 90000, ultimo: 21600, espera: /1d/ },
  ];
  for (const c of casos) {
    const enviados = correr(
      [fallandoDesdeHace(c.seg, c.ultimo), 'avisar_caida "$MARCADOR" "CAIDO"', 'avisar_caida "$MARCADOR" "CAIDO"'].join(
        "\n",
      ),
    );
    assert.equal(enviados.length, 1, `el hito de ${c.seg}s tiene que avisar exactamente una vez`);
    assert.match(enviados[0], c.espera, `el aviso de ${c.seg}s tiene que nombrar su duracion`);
  }
});

test("dos dias caido = dos avisos diarios, no uno para siempre (el bug de septiembre)", () => {
  // Al segundo dia el hito pasa de 86400 a 172800: el watchdog NO puede quedarse callado.
  const enviados = correr([fallandoDesdeHace(180000, 86400), 'avisar_caida "$MARCADOR" "CAIDO"'].join("\n"));
  assert.equal(enviados.length, 1, "pasado el segundo dia tiene que volver a avisar");
  assert.match(enviados[0], /2d/);
});

test("dentro de un mismo hito el watchdog se calla", () => {
  const enviados = correr(
    [
      fallandoDesdeHace(90000, 86400),
      'avisar_caida "$MARCADOR" "CAIDO"',
      'avisar_caida "$MARCADOR" "CAIDO"',
      'avisar_caida "$MARCADOR" "CAIDO"',
    ].join("\n"),
  );
  assert.equal(enviados.length, 0, "repetir el mismo hito es el spam que silencia el canal");
});

test("la recuperacion avisa una sola vez y dice cuanto duro", () => {
  const enviados = correr(
    [
      fallandoDesdeHace(7500, 3600),
      'avisar_recuperacion "$MARCADOR" "RECUPERADO."',
      'avisar_recuperacion "$MARCADOR" "RECUPERADO."',
    ].join("\n"),
  );
  assert.equal(enviados.length, 1, "la recuperacion avisa una vez y borra el marcador");
  assert.match(enviados[0], /Estuvo asi/);
  assert.match(enviados[0], /2h/);
});

test("sin incidente abierto, la recuperacion NO manda nada", () => {
  const enviados = correr('avisar_recuperacion "$MARCADOR" "RECUPERADO."');
  assert.equal(enviados.length, 0, "un bot que nunca se cayo no puede anunciar que se recupero");
});

test("un marcador del formato viejo (touch vacio) no rompe ni se traga el aviso", () => {
  // Antes el marcador era un archivo vacio. Tras el deploy pueden convivir los dos formatos, y el
  // caso peligroso es el silencioso: leerlo mal y NO avisar sobre una caida ya declarada.
  const enviados = correr([': > "$MARCADOR"', 'avisar_caida "$MARCADOR" "CAIDO"'].join("\n"));
  assert.equal(enviados.length, 1, "un marcador viejo se trata como incidente nuevo, nunca como silencio");
});

test("las tres sondas comparten la escalada: ninguna vuelve al 'touch' de un solo aviso", () => {
  // El bug estaba en las TRES ramas (contenedor, webhook, camino a Chatwoot) porque el patron
  // estaba escrito tres veces. Si alguien agrega una cuarta sonda copiando el patron viejo, esto
  // la caza — y esa es toda la razon de que la escalada sea una funcion y no tres copias.
  const sinComentarios = SCRIPT.split("\n")
    .filter((l) => !l.trim().startsWith("#"))
    .join("\n");
  assert.equal(
    /touch\s+"\$INCIDENTE/.test(sinComentarios),
    false,
    "una rama volvio a declarar el incidente con `touch`: eso avisa UNA vez y despues se calla para siempre",
  );
  for (const marcador of ["$INCIDENTE", "$INCIDENTE_CONT", "$INCIDENTE_CW"]) {
    assert.ok(
      sinComentarios.includes(`avisar_caida "${marcador}"`),
      `la sonda de ${marcador} no pasa por avisar_caida: se queda sin escalada`,
    );
    assert.ok(
      sinComentarios.includes(`avisar_recuperacion "${marcador}"`),
      `la sonda de ${marcador} no pasa por avisar_recuperacion: deja el marcador abierto o no dice cuanto duro`,
    );
  }
});

test("el watchdog distingue 'no arranca' de 'no responde'", () => {
  // Reiniciar no devuelve un archivo que no esta: del 19 al 21-sep se corrio 1.440 veces el mismo
  // arranque roto. Ante un modulo faltante hay que invalidar el arbol y forzar un re-sync limpio.
  assert.match(SCRIPT, /MODULE_NOT_FOUND|Cannot find module/, "no reconoce un arbol roto dentro del contenedor");
  assert.match(
    SCRIPT,
    /rm -rf \/tmp\/onia-bot \/tmp\/onia-bot\.new \/tmp\/onia-bot\.old/,
    "tiene que borrar tambien .new y .old: el sync hace el swap con esos dos y un resto viejo revive el problema",
  );
});
