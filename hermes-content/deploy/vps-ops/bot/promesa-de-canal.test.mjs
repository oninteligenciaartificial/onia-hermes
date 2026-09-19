// ---------------------------------------------------------------------------
// promesa-de-canal.test.mjs
//
// QUE FIJA. Ningun texto del guion TIPEA por que via le va a escribir el humano.
// La via se DERIVA del canal por el que entro la conversacion, y cuando no se
// sabe cual es, se dice la forma que es cierta en TODOS ("por este mismo chat").
//
// POR QUE EXISTE, medido el 2026-09-18 en la base de Chatwoot de produccion:
//
//     inbox 3 (ONIA Demo)   8 convs | con telefono 0
//     inbox 4 (Onia Web)   11 convs | con telefono 0     <- los leads del widget
//     inbox 5 (WhatsApp)    4 convs | con telefono 4
//     inbox 7 (ZZ QA)      13 convs | con telefono 0
//
// El 100% de los que escriben por el widget de onia.com.bo llega SIN numero:
// Chatwoot les da un nombre de fantasia y ningun telefono. Y los tres textos del
// HANDOFF —el momento en que alguien pide hablar con una persona, el mas caro del
// embudo— les prometian "Te escribe el desde este mismo numero":
//
//     M5          "Te escribe el desde este mismo numero, en horario de oficina"
//     M5_URGENTE  "Te escribe el desde este mismo numero."
//     M8_SOPORTE  "Te responde desde este mismo numero en horario de oficina"
//
// Para el lead del widget esa frase es imposible de cumplir: no hay numero al que
// escribirle. Cierra la pestana esperando un mensaje que no existe, y del otro
// lado Sergio Urcullo solo puede contestarle por el mismo widget. Es una promesa
// rota encima de la unica accion que pedia una persona de verdad.
//
// POR QUE NINGUN GATE LO VEIA. No mueve una cifra, no nombra un plan y no promete
// una capacidad: las tres familias de gates del bot miran eso. El eje es
// CANAL x TEXTO, y el catalogo de textos no sabia de canales — `grep -E
// "inbox|canal|channel"` sobre la zona del guion de `config.mjs` daba CERO.
//
// LA MITAD QUE HACE FALTA, y por que el gate no es "prohibir la palabra numero".
// En WhatsApp "desde este mismo numero" es CIERTO y ademas informativo: le avisa
// que el mensaje llega por ahi y no por correo. Lo que esta mal no es la frase,
// es TIPEARLA en un catalogo que sirve a los dos canales. Por eso el sujeto del
// gate es el catalogo global, la cura es derivar, y el default cuando el canal no
// se conoce es la forma canal-agnostica: falla hacia la promesa que SIEMPRE se
// puede cumplir.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_CONFIG, renderTemplate, viaDelCanal } from "./config.mjs";
import { varsFor } from "./reply-builder.mjs";

/**
 * El universo se deriva del DISCO: TODAS las entradas del guion publicado, no una
 * lista de las tres que hoy sabemos rotas. Una lista a mano falla abierto en el
 * texto que alguien escriba manana.
 */
function entradasDelGuion() {
  return Object.entries(DEFAULT_CONFIG.script)
    .flatMap(([clave, valor]) =>
      typeof valor === "string"
        ? [[clave, valor]]
        : Array.isArray(valor)
          ? valor.map((linea, i) => [`${clave}[${i}]`, String(linea)])
          : [],
    )
    .filter(([, texto]) => texto.length > 0);
}

/**
 * Formas atadas a UN canal. "este mismo numero" solo es cierto donde hay numero;
 * "por aca"/"este mismo chat" es cierto en los dos y no necesita derivarse.
 */
const ATADA_A_UN_CANAL = /\b(este|ese)\s+mismo\s+n[uú]mero\b/i;

// El canal se deriva del `channel_type` que manda Chatwoot, NUNCA del numero de
// inbox: esa regla ya la fija `canal-whatsapp-vivo.test.mjs`. Un id es un dato de
// instalacion — se renumera al recrear un inbox y no dice nada del medio.
const estadoCon = (channelType) => ({ qualification: {}, slotsOffered: [], channelType });

test("el guion no tipea por que via escribe el humano: se deriva", () => {
  const tipeadas = entradasDelGuion()
    .filter(([, texto]) => ATADA_A_UN_CANAL.test(texto))
    .map(([clave]) => clave);

  assert.deepStrictEqual(
    tipeadas,
    [],
    `Estas entradas del guion TIPEAN una via atada a un canal: ${tipeadas.join(", ")}.\n` +
      `Se sirven igual al widget web (inbox 4: 11 conversaciones, CERO con telefono),\n` +
      `donde prometen un mensaje a un numero que no existe. Usá {{via_humano}}, que\n` +
      `deriva la via del canal y cae en la forma canal-agnostica si no lo sabe.`,
  );
});

test("la via se deriva del canal: con numero lo nombra, sin numero no lo inventa", () => {
  const conNumero = varsFor(estadoCon("Channel::Whatsapp"), DEFAULT_CONFIG).via_humano;
  const sinNumero = varsFor(estadoCon("Channel::WebWidget"), DEFAULT_CONFIG).via_humano;

  assert.match(conNumero, /n[uú]mero/i, "en WhatsApp la via SI nombra el numero: es cierto y ubica");
  assert.doesNotMatch(sinNumero, /n[uú]mero/i, "en el widget web no hay numero: nombrarlo es una promesa imposible");
  assert.ok(sinNumero.trim().length > 0, "la via nunca queda vacia: dejaria la oracion colgando");
});

test("canal desconocido cae en la forma que es cierta en TODOS, nunca en la del numero", () => {
  for (const canal of [null, undefined, "", "Channel::Api", "Channel::Email", "Channel::Telegram"]) {
    const via = varsFor(estadoCon(canal), DEFAULT_CONFIG).via_humano;
    assert.doesNotMatch(
      via,
      /n[uú]mero/i,
      `con channel_type ${JSON.stringify(canal)} no hay numero garantizado: la via tiene que fallar hacia ` +
        `la promesa que siempre se puede cumplir, no hacia la que necesita un telefono`,
    );
  }
});

test("los tres textos del handoff quedan bien en LOS DOS canales", () => {
  for (const clave of ["M5", "M5_URGENTE", "M8_SOPORTE"]) {
    for (const [canal, esperaNumero] of [
      ["Channel::Whatsapp", true],
      ["Channel::WebWidget", false],
    ]) {
      const texto = renderTemplate(
        DEFAULT_CONFIG.script[clave],
        varsFor(estadoCon(canal), DEFAULT_CONFIG),
      );
      assert.doesNotMatch(texto, /\{\{/, `${clave} dejó un hueco sin rellenar a la vista del prospecto`);
      assert.strictEqual(
        /n[uú]mero/i.test(texto),
        esperaNumero,
        `${clave} en ${canal}: ${esperaNumero ? "tiene" : "NO tiene"} que hablar de un número`,
      );
    }
  }
});

test("viaDelCanal es pura y no conoce numeros de inbox", () => {
  assert.match(viaDelCanal("Channel::Whatsapp"), /n[uú]mero/i);
  assert.doesNotMatch(viaDelCanal("Channel::WebWidget"), /n[uú]mero/i);
  // Un id de inbox NO es un canal: pasarlo tiene que caer en el default seguro,
  // no adivinar. Asi el dia que alguien le pase `5` por error no reaparece la
  // promesa imposible.
  for (const idSuelto of [5, "5", 4, "4"]) {
    assert.doesNotMatch(viaDelCanal(idSuelto), /n[uú]mero/i);
  }
});
