// ONIA — el deploy del bot no puede mentir en NINGUNA de las dos direcciones.
//
// El agujero que este test existe para tapar, medido el 2026-09-04 02:40 La Paz desplegando
// el arreglo del saludo (tarea t_46cd93bb): `deploy-bot.sh` terminaba con
//
//     if ! "$DEST/webhook-server.sh" health; then
//       echo "ERROR: el bot no responde tras el deploy..." >&2
//
// y `health` NO es un subcomando de `webhook-server.sh` — los que implementa son
// `start|stop|restart|status|logs|knowledge`. El script imprimia la linea de uso, salia
// distinto de cero y cantaba "el bot no responde tras el deploy" sobre un bot que respondia
// perfecto: el reinicio de la linea de arriba ya habia devuelto {"ok":true,...,"db":{"ok":true}}.
//
// POR QUE IMPORTA MAS DE LO QUE PARECE: un deploy sano que se reporta como fallido invita a
// deshacerlo. El script deja el backup en la pantalla justo ahi ("Backup en ..."), asi que el
// siguiente paso natural de quien lo lea es revertir un deploy bueno.
//
// Y el arreglo obvio -cambiar `health` por `status`- no alcanza, que es el segundo caso de
// abajo: `status` hace `wget ... || echo '{"ok":false,...}'` y despues `exit 0` SIEMPRE. Un
// `if ! ...` sobre eso no puede ponerse rojo nunca: es un gate que falla ABIERTO, la familia
// de bug que este repo ya pago varias veces. Verificar la salud del bot es mirar el JSON.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/deploy-bot.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEPLOY = readFileSync(path.join(HERE, "deploy-bot.sh"), "utf8");
const SERVER = readFileSync(path.join(HERE, "webhook-server.sh"), "utf8");

/** Los subcomandos que `webhook-server.sh` implementa de verdad, leidos de su `case`. */
function subcomandosImplementados(texto) {
  const encontrados = new Set();
  for (const linea of texto.split("\n")) {
    const m = /^\s{2,}([a-z|]+)\)/.exec(linea);
    if (m) m[1].split("|").forEach((s) => encontrados.add(s));
  }
  return encontrados;
}

/**
 * Los subcomandos que `deploy-bot.sh` le pide a `webhook-server.sh`.
 *
 * Se exige la comilla de cierre de `"$DEST/webhook-server.sh" <sub>` y se descartan los
 * comentarios: sin eso, la prosa del propio script ("webhook-server.sh es el que sincroniza...")
 * entra como si fuera una invocacion y el test acusa un subcomando `es` inexistente.
 */
function subcomandosInvocados(texto) {
  const invocados = [];
  const codigo = texto
    .split("\n")
    .filter((l) => !/^\s*#/.test(l))
    .join("\n");
  const re = /webhook-server\.sh"\s+([a-z]+)/g;
  let m;
  while ((m = re.exec(codigo)) !== null) invocados.push(m[1]);
  return invocados;
}

test("deploy-bot.sh solo invoca subcomandos que webhook-server.sh implementa", () => {
  const implementados = subcomandosImplementados(SERVER);
  // Guarda del propio test: si el parseo se rompe, que no apruebe por vacio.
  assert.ok(
    implementados.has("restart") && implementados.has("status"),
    `el parseo del case fallo: solo vi [${[...implementados].join(", ")}]`,
  );

  const invocados = subcomandosInvocados(DEPLOY);
  assert.ok(invocados.length > 0, "deploy-bot.sh deberia invocar webhook-server.sh al menos una vez");

  const inventados = invocados.filter((s) => !implementados.has(s));
  assert.deepEqual(
    inventados,
    [],
    `deploy-bot.sh invoca subcomandos que no existen: ${inventados.join(", ")}. ` +
      `webhook-server.sh implementa: ${[...implementados].sort().join("|")}`,
  );
});

test("la verificacion post-deploy mira el JSON, no el codigo de salida (status sale 0 siempre)", () => {
  // Premisa que hace necesario este test: `status` termina en `exit 0` pase lo que pase.
  const bloqueStatus = /status\)([\s\S]*?);;/.exec(SERVER);
  assert.ok(bloqueStatus, "no encontre el bloque `status)` en webhook-server.sh");
  assert.match(
    bloqueStatus[1],
    /exit 0/,
    "si `status` dejara de salir 0 siempre, este test sobra — revisalo",
  );

  // Por eso el deploy tiene que leer el cuerpo: un `if ! ...` a secas no puede ponerse rojo.
  const verificacion = DEPLOY.slice(DEPLOY.indexOf("-- /health"));
  assert.ok(verificacion.length > 0, "deploy-bot.sh ya no tiene el paso de verificacion /health");
  assert.match(
    verificacion,
    /ok"?\s*:\s*true/,
    'el paso de verificacion no busca `"ok":true` en la respuesta: ' +
      "confia en el codigo de salida de `status`, que es 0 aunque el bot este caido",
  );
});

test("el gate de tests y el backup siguen ANTES de copiar: un deploy no puede ser irreversible", () => {
  const posGate = DEPLOY.indexOf("node --test");
  const posBackup = DEPLOY.indexOf("mkdir -p \"$BACKUP\"");
  const posCopia = DEPLOY.indexOf("-- copiando");
  assert.ok(posGate > 0 && posBackup > 0 && posCopia > 0, "falta el gate, el backup o la copia");
  assert.ok(posGate < posCopia, "los tests tienen que correr ANTES de copiar a produccion");
  assert.ok(posBackup < posCopia, "el backup tiene que hacerse ANTES de pisar los archivos");
});
