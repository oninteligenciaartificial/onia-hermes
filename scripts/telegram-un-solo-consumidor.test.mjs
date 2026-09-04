// Un SEGUNDO lector del mismo bot de Telegram le roba a Sergio sus respuestas.
//
// Telegram entrega cada update UNA sola vez, al que lo pida primero, y devuelve
// `409 Conflict` al segundo que llame `getUpdates` sobre el mismo token. No hay
// reparto ni cola: es una carrera. Con dos consumidores vivos, "ok t_ab12cd34"
// cae en uno o en el otro segun quien llegue antes — o sea, las decisiones de
// Sergio se pierden A VECES, que es peor que perderse siempre, porque el
// circuito parece andar.
//
// MEDIDO el 2026-09-03 19:36 UTC, y el diagnostico salio al reves de lo que
// parecia. `scripts/kanban/telegram-entrada.py` esta desplegado en
// /root/bin/onia-tg-entrada.py desde el 2026-09-02 21:06, su log pesa 0 bytes y
// no tiene cron, ni unit de systemd, ni proceso. Todo eso decia "el circuito de
// entrada esta muerto, hay que cablearlo". Era falso:
//
//   ss -tnp | grep 149.154   ->  ESTAB ... users:(("hermes",pid=4063867))
//
// El gateway de Hermes (`hermes_cli.main gateway run`) YA es el consumidor, y
// anda: la sesion `agent:main:telegram:dm:6830070978` intercambio mensajes hasta
// las 18:56 de ese mismo dia, la tarea t_13eaa0ae nacio de un mensaje suyo
// ("Pedido de Sergio por Telegram: ...") y t_04baed70 se desbloqueo a las
// 18:42:55 con su veredicto. Enchufarle el cron que el propio script pedia en su
// docstring ("Corre por cron cada 2 minutos") no habria arreglado nada: habria
// ROTO lo unico que funcionaba.
//
// Por eso la guarda no mira si el script corre, sino que ningun script del repo
// vuelva a pedir que lo corran. Los sujetos salen del DISCO, no de una lista de
// inclusion: un lector NUEVO nace cubierto y hay que excluirlo a mano, a la
// vista. (La leccion de `compartir.test.ts`, que sacaba sus rutas del sitemap y
// fallaba abierto en cuanto una ruta salia de ahi.)

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
/** Esta guarda CITA las frases que prohibe, para explicarlas. Se excluye a si
 *  misma y a nadie mas: la exclusion es de un solo archivo y esta a la vista. */
const YO = relative(raiz, fileURLToPath(import.meta.url));

/** Todo archivo bajo scripts/, recursivo. Sin lista de inclusion. */
function archivosDeScripts(dir = join(raiz, "scripts"), acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      archivosDeScripts(p, acc);
    } else if (statSync(p).size < 2_000_000) {
      acc.push(p);
    }
  }
  return acc;
}

/** Los que hablan con la API de updates de Telegram: los unicos que compiten. */
function lectoresDeTelegram() {
  return archivosDeScripts()
    .map((p) => ({ ruta: relative(raiz, p), texto: readFileSync(p, "utf8") }))
    .filter((f) => f.ruta !== YO)
    .filter((f) => f.texto.includes("getUpdates"));
}

test("hay al menos un lector para vigilar (si no, la guarda perdio sentido)", () => {
  const lectores = lectoresDeTelegram();
  assert.ok(
    lectores.length > 0,
    "ningun script menciona getUpdates: o se borraron todos, o esta guarda quedo mirando al vacio",
  );
});

test("ningun lector de Telegram pide que lo corran por cron", () => {
  // El texto que importa es la INSTRUCCION, no la palabra suelta: un script
  // puede nombrar el cron para explicar por que NO va, y eso es exactamente lo
  // que queremos que diga.
  const pedidos = /corre\s+por\s+cron|correr\s+por\s+cron|cablear\s+el\s+cron|agregar(?:lo)?\s+al\s+cron|poner(?:lo)?\s+en\s+el\s+cron/i;

  const culpables = lectoresDeTelegram()
    .filter((f) => pedidos.test(f.texto))
    .map((f) => f.ruta);

  assert.deepEqual(
    culpables,
    [],
    `estos scripts leen Telegram y piden que los programen: ${culpables.join(", ")}.\n` +
      "El consumidor del token es el gateway de Hermes (hermes_cli.main gateway run).\n" +
      "Un segundo lector no suma: compite, y las respuestas de Sergio se pierden a veces.\n" +
      "Se ve con: ss -tnp | grep 149.154   (el socket vivo contra api.telegram.org)",
  );
});

test("todo lector de Telegram nombra al gateway y contempla el 409", () => {
  // Sin esto, el dia que alguien lo corra igual, muere con un traceback crudo de
  // urllib en un log que nadie abre. Un fallo mudo cuesta mas que uno ruidoso:
  // el loop `investigacion` estuvo muerto dias por exactamente eso.
  const faltantes = lectoresDeTelegram()
    .filter((f) => !(f.texto.includes("409") && /gateway/i.test(f.texto)))
    .map((f) => f.ruta);

  assert.deepEqual(
    faltantes,
    [],
    `estos scripts leen Telegram y no explican que el token ya tiene dueno: ${faltantes.join(", ")}.\n` +
      "Tienen que nombrar al gateway y manejar el 409 Conflict, que es lo que Telegram\n" +
      "devuelve al segundo que pollea. Morir con un traceback ahi es fallar mudo.",
  );
});
