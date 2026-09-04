// ONIA — el gate que mira las frases de campaña DESDE LA CALLE.
//
// Correr:  node --test hermes-content/deploy/vps-ops/campanas-vivas.test.mjs
//
// No pega a la red: `frasesDelHtml` y `cotejar` son puras, y el HTML de los casos es del
// mismo molde que sirve onia.com.bo hoy (href suelto y el mismo link dentro del payload RSC
// de Next, que viene con las comillas escapadas).

import test from "node:test";
import assert from "node:assert/strict";
import { frasesDelHtml, cotejar } from "./campanas-vivas.mjs";

const FRASE = "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio.";
const ENCODED = "Hola%2C%20vengo%20de%20la%20web%20de%20Onia.%20Quiero%20saber%20si%20me%20sirve%20para%20mi%20negocio.";

test("saca la frase de un href suelto", () => {
  const html = `<a href="https://wa.me/59175414930?text=${ENCODED}" target="_blank">Escribir</a>`;
  assert.deepEqual([...frasesDelHtml(html)], [FRASE]);
});

test("saca la misma frase del payload RSC, donde las comillas van escapadas", () => {
  const html = `self.__next_f.push([1,"...\\"href\\":\\"https://wa.me/59175414930?text=${ENCODED}\\",\\"target\\":\\"_blank\\"..."])`;
  assert.deepEqual([...frasesDelHtml(html)], [FRASE]);
});

// REGRESION de la medicion del 2026-08-31: el primer extractor usaba una clase negativa
// (`[^"\s<>]`) que, por un backslash de menos, terminaba excluyendo la LETRA `s`. Cortaba
// "Quiero " justo antes de "saber" y reportaba las cinco frases vivas como SIN CAMPANA. Un
// gate que corta el dato de entrada acusa un rojo que no existe, y a un gate asi lo apaga
// alguien. Por eso el extractor usa una clase POSITIVA: lo que produce el percent-encoding.
test("NO corta la frase en la letra s (la clase de caracteres es positiva)", () => {
  const html = `<a href="https://wa.me/59175414930?text=${ENCODED}">x</a>`;
  const [salida] = [...frasesDelHtml(html)];
  assert.equal(salida, FRASE);
  assert.ok(salida.includes("saber si me sirve"), "se comio el texto despues de la primera s");
});

test("la misma frase en dos paginas se cuenta UNA vez", () => {
  const link = `<a href="https://wa.me/59175414930?text=${ENCODED}">x</a>`;
  assert.equal(frasesDelHtml(link + link).size, 1);
});

test("HTML sin un solo wa.me no inventa frases", () => {
  assert.equal(frasesDelHtml("<p>onia</p>").size, 0);
});

// --- cotejo -----------------------------------------------------------------

const DOC = {
  campanas: [
    { frase: FRASE, respuesta: "r1" },
    { frase: "Hola, mi rubro no está en la lista de Onia. Mi negocio es: ", respuesta: "r2", prefijo: true },
    { frase: "Hola, quiero conocer Onia", respuesta: "r3" },
  ],
};

test("una frase viva con campaña exacta queda cubierta", () => {
  const r = cotejar(new Map([[FRASE, ["/"]]]), DOC);
  assert.deepEqual(r.sinCampana, []);
  assert.equal(r.cubiertas.length, 1);
  assert.equal(r.cubiertas[0].campana.respuesta, "r1");
});

test("una frase viva cubierta por una campaña `prefijo: true` tambien queda cubierta", () => {
  const viva = "Hola, mi rubro no está en la lista de Onia. Mi negocio es: panadería";
  const r = cotejar(new Map([[viva, ["/v1/empezar"]]]), DOC);
  assert.deepEqual(r.sinCampana, []);
  assert.equal(r.cubiertas[0].campana.respuesta, "r2");
});

// El unico rojo que importa: la web manda algo que el bot no sabe contestar.
test("una frase viva SIN campaña se nombra, con las paginas que la mandan", () => {
  const huerfana = "Hola, vengo de la web de Onia. Quiero un demo.";
  const r = cotejar(new Map([[huerfana, ["/precios", "/"]]]), DOC);
  assert.equal(r.sinCampana.length, 1);
  assert.equal(r.sinCampana[0].frase, huerfana);
  assert.deepEqual(r.sinCampana[0].paginas, ["/precios", "/"]);
});

// No es un rojo: `WA_URL` es un export sin consumidor desde antes de este gate. Se informa
// porque una campaña que ya no matchea nada es basura que confunde al que la lee, pero
// fallar por esto seria un gate rojo por algo que no toca a ningun desconocido.
test("una campaña sin frase viva se informa y NO cuenta como fallo", () => {
  const r = cotejar(new Map([[FRASE, ["/"]]]), DOC);
  assert.ok(r.sinFraseViva.some((c) => c.frase === "Hola, quiero conocer Onia"));
  assert.deepEqual(r.sinCampana, []);
});

// El gate no puede tener su propia idea de que matchea: si copiara la logica, el dia que el
// motor cambie el gate seguiria verde sobre un match que en produccion ya no ocurre.
test("el match lo decide el MOTOR: los acentos y las mayusculas se normalizan igual", () => {
  const gritada = FRASE.toUpperCase().replace(/Á/g, "A");
  const r = cotejar(new Map([[gritada, ["/"]]]), DOC);
  assert.deepEqual(r.sinCampana, [], "el gate no esta usando campanaExacta del motor");
});

test("sin campañas publicadas, TODA frase viva es un fallo (no un verde hueco)", () => {
  const r = cotejar(new Map([[FRASE, ["/"]]]), { campanas: [] });
  assert.equal(r.sinCampana.length, 1);
});
