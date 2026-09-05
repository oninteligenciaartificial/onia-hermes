// ONIA — lo que la plantilla le promete al operador tiene que LLEGAR al proceso.
//
// EL AGUJERO QUE ESTE TEST EXISTE PARA TAPAR. `webhook-server.sh` no arranca el bot con el
// entorno del shell: lo arranca con `docker exec -d` y una LISTA BLANCA de `-e VAR=...`. Todo lo
// que no este en esa lista no existe para el proceso, aunque este escrito en `webhook.env` y
// documentado en `webhook.env.example`. Y no falla: falla MUDO.
//
// Medido el 2026-09-04 en produccion. El aviso a Sergio (`aviso-telegram.mjs`) estaba escrito,
// desplegado y CORRIENDO — el log mostraba `[aviso] skipped (...): aviso por Telegram apagado
// (ONIA_BOT_TG_AVISO)` sobre handoffs reales (conversaciones 53 y 55). La plantilla nombraba las
// cinco variables desde el commit anterior. Pero el lanzador no pasaba NINGUNA de las cinco, asi
// que el camino documentado —"copia el token a webhook.env y pone el flag en true"— no habria
// encendido nada: el proceso hubiera seguido diciendo "apagado", y el operador habria concluido
// que el codigo esta roto. Confirmado leyendo el entorno del proceso vivo:
//   docker exec onia-center sh -c "tr '\0' '\n' < /proc/<pid>/environ" | grep TG_
//
// POR QUE LOS SUJETOS SALEN DE LA PLANTILLA Y NO DE UNA LISTA A MANO. Una lista escrita a mano
// falla ABIERTO: la variable que alguien agregue manana no esta en ella, y nada se pone rojo.
// `webhook.env.example` es el contrato con el operador — si algo se documenta ahi, es porque se
// espera que lo pueda configurar. Derivando de ahi, una variable nueva nace cubierta y hay que
// eximirla A LA VISTA, con su motivo.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/lanzador-pasa-env.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const AQUI = path.dirname(fileURLToPath(import.meta.url));

const leer = (nombre) => readFileSync(path.join(AQUI, nombre), "utf8");

/**
 * Variables que la plantilla documenta y que el lanzador NO tiene que pasar, con el motivo
 * medido. Cada exencion es una promesa: "esta llega al proceso por otro camino".
 */
export const EXENTAS = Object.freeze({
  // `aviso-telegram.mjs:57-58` acepta los dos nombres del par a proposito. Con que el lanzador
  // pase `TG_BOT_TOKEN`/`TG_CHAT_ID` alcanza; estos son el alias documentado para quien tenga
  // el valor con el otro nombre en `/root/.hermes/.env`.
  TELEGRAM_BOT_TOKEN: "alias de TG_BOT_TOKEN — con pasar uno del par alcanza",
  TELEGRAM_CHAT_ID: "alias de TG_CHAT_ID — con pasar uno del par alcanza",
});

/** Las variables que `webhook.env.example` le promete al operador. */
export function variablesDocumentadas(plantilla) {
  const nombres = [...plantilla.matchAll(/^\s*#?\s*([A-Z][A-Z0-9_]{2,})=/gm)].map((m) => m[1]);
  return [...new Set(nombres)];
}

/** Las variables que `webhook-server.sh` realmente le inyecta al `docker exec`. */
export function variablesPasadas(lanzador) {
  return new Set([...lanzador.matchAll(/^\s*-e\s+([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]));
}

test("toda variable que la plantilla documenta llega al proceso (o esta eximida con motivo)", () => {
  const documentadas = variablesDocumentadas(leer("webhook.env.example"));
  const pasadas = variablesPasadas(leer("webhook-server.sh"));

  assert.ok(documentadas.length > 10, `la plantilla se leyo mal: ${documentadas.length} variables`);
  assert.ok(pasadas.size > 10, `el lanzador se leyo mal: ${pasadas.size} variables`);

  const huerfanas = documentadas.filter((v) => !pasadas.has(v) && !(v in EXENTAS));

  assert.deepEqual(
    huerfanas,
    [],
    `webhook.env.example las promete y webhook-server.sh no las pasa al 'docker exec', ` +
      `asi que configurarlas no hace NADA y no falla: ${huerfanas.join(", ")}. ` +
      `Agregalas al bloque -e del lanzador, o eximilas en EXENTAS con el motivo.`,
  );
});

test("el aviso a Sergio: el flag y las credenciales llegan al proceso", () => {
  // Caso concreto del bug de arriba, anclado aparte: si alguien recorta la derivacion desde la
  // plantilla, este sigue en rojo. Es el que le costo a Onia dos handoffs reales sin avisar.
  const pasadas = variablesPasadas(leer("webhook-server.sh"));
  for (const v of ["ONIA_BOT_TG_AVISO", "TG_BOT_TOKEN", "TG_CHAT_ID"]) {
    assert.ok(pasadas.has(v), `el lanzador no pasa ${v}: el aviso a Sergio no se puede encender`);
  }
});

/**
 * Con que valor arranca el bot una variable cuando el operador no configuro NADA.
 *
 * Se EVALUA la linea real del lanzador en un `sh` con el entorno vacio, en vez de leerla como
 * texto: asi el test mide el comportamiento y sigue valiendo si el default se escribe con una
 * variable intermedia (que es justo lo que pasa hoy con `TG_AVISO`). Un test que casa un patron
 * de texto se pone verde/rojo por como esta ESCRITA la linea, no por lo que hace.
 */
export function defectoEfectivo(lanzador, asignacion) {
  const m = lanzador.match(new RegExp(`^\\s*(${asignacion}=.*)$`, "m"));
  assert.ok(m, `no encontre la asignacion ${asignacion}= en webhook-server.sh`);
  return execFileSync("/bin/sh", ["-c", `${m[1]}; printf %s "$${asignacion}"`], {
    env: {},
    encoding: "utf8",
  });
}

test("el aviso a Sergio viene ENCENDIDO de fabrica", () => {
  // POR QUE ESTE TEST EXISTE, y por que no alcanza con el de arriba.
  //
  // Que el lanzador PASE la variable no la enciende: la pasa con un valor por defecto. Y el
  // unico lugar donde podria estar en `true` es `/opt/onia/bot/webhook.env`, que NO esta en git
  // y que ningun deploy toca. Medido el 2026-09-04: `grep -c ONIA_BOT_TG_AVISO
  // /opt/onia/bot/webhook.env` = 0. O sea que con el default en `false` la cadena entera queda
  // asi: se despliega el lanzador arreglado, el bot arranca, y el log sigue diciendo
  // "aviso por Telegram apagado" para siempre, sin que nada se ponga rojo.
  //
  // Sergio ya decidio que si (tablero t_b18ca430, opcion (c): "aviso por Telegram sin
  // calendario YA"). Una decision tomada no puede quedar dependiendo de que alguien se acuerde
  // de editar a mano un archivo fuera de git — eso es como este aviso lleva un dia en cero
  // con el codigo escrito, probado y corriendo en produccion.
  //
  // Apagarlo sigue siendo posible y es una linea en `webhook.env`, que gana por el `:-`.
  const lanzador = leer("webhook-server.sh");
  const defecto = defectoEfectivo(lanzador, "TG_AVISO");
  assert.equal(
    defecto,
    "true",
    `el lanzador arranca el bot con el aviso en "${defecto}". Como /opt/onia/bot/webhook.env ` +
      `no define la variable y no esta en git, desplegar NO enciende el aviso: los handoff y las ` +
      `demos agendadas se siguen perdiendo en silencio.`,
  );

  // Y que el valor calculado sea el que REALMENTE viaja al proceso. Sin esto, alguien podria
  // dejar `TG_AVISO` en true y seguir pasandole otra cosa al `docker exec`.
  assert.match(
    lanzador,
    /^\s*-e\s+ONIA_BOT_TG_AVISO="\$TG_AVISO"/m,
    "el `-e ONIA_BOT_TG_AVISO` no usa el valor de TG_AVISO: el default calculado no llega al bot",
  );
});

test("la guarda de credenciales mira el MISMO default que se le pasa al bot", () => {
  // El bug que casi entra con el cambio de default: la guarda evaluaba `${ONIA_BOT_TG_AVISO:-}`
  // (vacio) mientras el `docker exec` recibia `true`. Resultado: con el operador sin configurar
  // nada —el caso normal— el aviso quedaba ENCENDIDO y la advertencia de "falta el token" MUDA,
  // que es la combinacion exacta que este archivo existe para impedir.
  // Se barre el CODIGO, no los comentarios: el comentario de al lado cita el patron malo para
  // explicar por que existe esta guarda, y un barrido literal lo pondria rojo — obligando a
  // borrar la bitacora del bug para que el test pase.
  const codigo = leer("webhook-server.sh")
    .split("\n")
    .filter((l) => !/^\s*#/.test(l))
    .join("\n");
  assert.doesNotMatch(
    codigo,
    /\$\{ONIA_BOT_TG_AVISO:-\}/,
    "la guarda usa `${ONIA_BOT_TG_AVISO:-}` (default vacio) en vez de TG_AVISO: se calla justo " +
      "cuando el aviso esta encendido y falta la credencial",
  );
});

test("una exencion sin motivo escrito no vale", () => {
  for (const [nombre, motivo] of Object.entries(EXENTAS)) {
    assert.ok(
      typeof motivo === "string" && motivo.trim().length > 15,
      `la exencion de ${nombre} no explica por que`,
    );
  }
});
