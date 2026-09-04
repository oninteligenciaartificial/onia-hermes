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

test("una exencion sin motivo escrito no vale", () => {
  for (const [nombre, motivo] of Object.entries(EXENTAS)) {
    assert.ok(
      typeof motivo === "string" && motivo.trim().length > 15,
      `la exencion de ${nombre} no explica por que`,
    );
  }
});
