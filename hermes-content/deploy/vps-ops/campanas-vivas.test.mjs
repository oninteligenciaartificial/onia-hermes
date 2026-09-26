// ONIA — el gate que mira las frases de campaña DESDE LA CALLE.
//
// Correr:  node --test hermes-content/deploy/vps-ops/campanas-vivas.test.mjs
//
// No pega a la red: `frasesDelHtml` y `cotejar` son puras, y el HTML de los casos es del
// mismo molde que sirve onia.com.bo hoy (href suelto y el mismo link dentro del payload RSC
// de Next, que viene con las comillas escapadas).

import test from "node:test";
import assert from "node:assert/strict";
import { frasesDelHtml, cotejar, lineasDelVeredicto, INSTRUMENTO_VIVO } from "./campanas-vivas.mjs";

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

// ─────────────────────────────────────────────────────────────────────────────
// El veredicto tiene que declarar su ALCANCE. Nace del 2026-09-26.
//
// Medido ese dia, el mismo minuto, sobre el mismo destino: este instrumento salio `exit 0`
// diciendo "toda frase viva tiene campaña", y su hermano `bot/campanas-vivas.mjs` salio
// `exit 1`: "2 de 3 frases que la web viva manda no las escucha el bot vivo". Los dos tenian
// razon. Este lee `knowledge.onia.json` del REPO (version 2026-09-25.1); el bot vivo corria
// la 2026-09-24.1, con las frases de "20 minutos" y "45 minutos" que la web ya no manda.
//
// Lo que hace el fallo caro es la asimetria de autoridad: el nombre canonico
// (`npm run campanas:vivas`), el lugar en la cadena `npm test` y las citas de los docs son
// de ESTE, el que no mira produccion. Un ítem cerrado de la cola cita como prueba
// *"campanas-vivas contra onia.com.bo EN VIVO: 7 frases vivas, 7 con campaña"* — y ese "en
// vivo" es el de este instrumento, que del bot no sabe nada. Su propia cabecera denuncia el
// mismo error en un tercero ("produccion se sirve de un build, no del working tree") y lo
// comete del otro lado.
//
// La propiedad que se exige no es un texto: es que la linea de exito NO pueda leerse como
// "el bot vivo las escucha". Dos anclas comprobables — la version del documento que miro, y
// el nombre del instrumento que si mide produccion.
const DOC_CON_VERSION = { ...DOC, version: "2026-09-25.1" };

test("el exito declara que mira el DOCUMENTO DEL REPO, no el bot vivo", () => {
  const v = lineasDelVeredicto({
    base: "https://onia.com.bo",
    vivas: new Map([[FRASE, ["/"]]]),
    cubiertas: [{ frase: FRASE, paginas: ["/"], campana: DOC.campanas[0] }],
    sinCampana: [],
    sinFraseViva: [],
    doc: DOC_CON_VERSION,
  });
  assert.equal(v.exit, 0);
  assert.equal(v.alcance, "documento-del-repo");
  const exito = v.salida.join("\n");
  assert.match(exito, /DOCUMENTO DEL REPO/, "el exito no dice contra QUE cotejo");
  assert.ok(exito.includes(DOC_CON_VERSION.version), "el exito no nombra la version del documento que miro");
  assert.ok(
    exito.includes(INSTRUMENTO_VIVO),
    "el exito no manda al instrumento que SI le pregunta al bot vivo: se lee como via libre",
  );
});

// El rojo no cambia de dueño: sigue siendo un fallo del documento, y sigue mandando a desplegar.
test("el fallo nombra las frases huerfanas y sigue pidiendo el deploy del bot", () => {
  const huerfana = "Hola, vengo de la web de Onia. Quiero un demo.";
  const v = lineasDelVeredicto({
    base: "https://onia.com.bo",
    vivas: new Map([[huerfana, ["/precios"]]]),
    cubiertas: [],
    sinCampana: [{ frase: huerfana, paginas: ["/precios"] }],
    sinFraseViva: [],
    doc: DOC_CON_VERSION,
  });
  assert.equal(v.exit, 1);
  assert.match(v.error.join("\n"), /DESPLEGAR: bot/);
  assert.match(v.error.join("\n"), /Quiero un demo/);
});
