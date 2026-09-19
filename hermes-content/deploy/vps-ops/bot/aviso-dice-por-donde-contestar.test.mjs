import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { construirAviso } from "./aviso-telegram.mjs";
import { nombreDelCanal, viaDelCanal } from "./config.mjs";

// ---------------------------------------------------------------------------
// CIERRE DE CLASE: todo aviso que le pide a un humano que CONTESTE dice por DONDE.
//
// El caso que lo origino vivia en `webhook-server.mjs` (el handoff en vivo) y su hermano
// `postdemo-run.mjs` tenia la MITAD de la cura desde antes — nombraba `state.channel`, que vale
// "chatwoot" para WhatsApp y para el widget por igual. O sea que arreglar la instancia no cerraba
// nada: el universo se camina del DISCO, no de la lista de llamadores que uno se acuerda.
// ---------------------------------------------------------------------------

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Los .mjs de produccion de la carpeta. Se CAMINA el disco: `git ls-files` no ve el archivo nuevo sin commitear. */
function modulosDeProduccion() {
  return readdirSync(AQUI)
    .filter((f) => f.endsWith(".mjs") && !f.endsWith(".test.mjs"))
    .sort();
}

/**
 * El cuerpo de la llamada a `construirAviso(` — parentesis balanceados desde el de apertura.
 *
 * Saltea la DEFINICION (`export function construirAviso({...})`): su lista de parametros trae la
 * palabra `canal` y absolveria al archivo donde vive, que es justo el que no debe ser sujeto.
 */
function llamadasAConstruirAviso(fuente) {
  const llamadas = [];
  const marca = "construirAviso(";
  let desde = 0;
  for (;;) {
    const i = fuente.indexOf(marca, desde);
    if (i === -1) break;
    if (/\bfunction\s+$/.test(fuente.slice(Math.max(0, i - 20), i))) {
      desde = i + marca.length;
      continue;
    }
    let profundidad = 0;
    let j = i + marca.length - 1;
    for (; j < fuente.length; j += 1) {
      const c = fuente[j];
      if (c === "(") profundidad += 1;
      else if (c === ")") {
        profundidad -= 1;
        if (profundidad === 0) break;
      }
    }
    llamadas.push(fuente.slice(i, j + 1));
    desde = j + 1;
  }
  return llamadas;
}

test("el universo sale del disco y contiene los llamadores conocidos", () => {
  const conLlamada = modulosDeProduccion().filter((f) =>
    llamadasAConstruirAviso(readFileSync(join(AQUI, f), "utf8")).length > 0,
  );
  // Caso ancla: si el detector deja de ver estos dos, el gate se apago solo y hay que mirarlo
  // A EL antes que al producto. `aviso-telegram.mjs` queda fuera: ahi se DEFINE, no se llama.
  for (const esperado of ["webhook-server.mjs", "postdemo-run.mjs"]) {
    assert.ok(conLlamada.includes(esperado), `el universo perdio a ${esperado}: mirar el detector, no el producto`);
  }
});

test("todo llamador de construirAviso le pasa el CANAL: sin eso el humano no sabe por donde contestar", () => {
  const sinCanal = [];
  for (const archivo of modulosDeProduccion()) {
    const fuente = readFileSync(join(AQUI, archivo), "utf8");
    for (const llamada of llamadasAConstruirAviso(fuente)) {
      if (!/\bcanal\s*:/.test(llamada)) sinCanal.push(`${archivo}: ${llamada.slice(0, 90).replace(/\s+/g, " ")}`);
    }
  }
  assert.deepEqual(
    sinCanal,
    [],
    `estos avisos le piden a un humano que conteste y no dicen por que via entro el mensaje:\n  ${sinCanal.join("\n  ")}`,
  );
});

test("la via que se le PROMETE al prospecto y el canal que se le NOMBRA al humano salen de la misma decision", () => {
  // Tautologia evitada a proposito: no se comparan dos textos, se cruza que las DOS funciones
  // cambien de rama con la MISMA entrada. Si alguien le suma un canal a una sola, esto cae.
  for (const tipo of ["Channel::Whatsapp", "Channel::WebWidget", "Channel::Api", "", null]) {
    const esWhatsapp = nombreDelCanal(tipo) === "WhatsApp";
    const prometeNumero = viaDelCanal(tipo) === "desde este mismo número";
    assert.equal(
      prometeNumero,
      esWhatsapp,
      `con ${JSON.stringify(tipo)} el bot promete una via y el aviso nombra otro canal`,
    );
  }
});

test("un canal desconocido se nombra crudo, no se descarta: el aviso nunca se calla por eso", () => {
  const aviso = construirAviso({
    notify: [{ kind: "handoff", reason: "pidio_hablar_con_humano", text: "hola" }],
    conversationId: 90,
    canal: "Channel::Telegram",
  });
  assert.match(aviso.texto, /Telegram/, "un canal nuevo tiene que verse feo, no desaparecer");
});
