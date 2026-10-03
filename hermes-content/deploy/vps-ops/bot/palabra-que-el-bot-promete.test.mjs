// ---------------------------------------------------------------------------
// palabra-que-el-bot-promete.test.mjs
//
// QUE FIJA. Cuando el guion le dice al prospecto que escriba una palabra
// ("decime \"urgente\"", "decinos \"no gracias\""), esa palabra es un CONTRATO:
// el motor de intenciones TIENE que reconocerla. Una palabra clave muerta es
// peor que ninguna — el prospecto hace exactamente lo que se le pidio y el bot
// sigue como si nada.
//
// POR QUE EXISTE. Medido el 2026-09-18 contra el guion vivo. `R_SEGUIMIENTO`
// —el texto del barrido de insistencia, el UNICO de los cuatro que venia
// mandando de verdad— cierra con:
//
//   "Y si preferis que no te escribamos, decinos \"no gracias\" y listo."
//
// y `intents.isOptOut("no gracias")` daba **false**. Ninguna de las 26
// intenciones del motor reconocia la frase, asi que el prospecto que pedia la
// baja con las palabras que el propio bot le dicto caia en el router como un
// mensaje cualquiera y le seguiamos escribiendo. Encima el 2026-09-17 se
// encendieron los otros tres barridos (02505ade), o sea que el volumen de
// mensajes no solicitados subio justo cuando la salida no funcionaba: eso no es
// una molestia de UX, es el quality rating de la linea de WhatsApp.
//
// Las otras dos instrucciones del guion (`decime "urgente"`, en M7 y M8) SI
// estaban honradas, por `needsHumanNow`. O sea que el defecto no era una
// omision de diseño sino la instruccion que se agrego sin su mitad.
//
// LA CLASE. Esto NO se cierra agregando "no gracias" al regex: se cierra
// obligando a que toda instruccion NUEVA traiga su deteccion. El universo se
// deriva del DISCO —los textos de `SCRIPT`, no una lista a mano— y se cruza
// contra el motor real (`intents.mjs`), que es una fuente independiente: el dia
// que alguien escriba "poné \"CANCELAR\"" en un mensaje, este gate se pone rojo
// hasta que el motor lo entienda.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";

import { SCRIPT } from "./config.mjs";
import * as intents from "./intents.mjs";

/**
 * Una instruccion de palabra clave: un verbo de DECIR/ESCRIBIR en imperativo
 * seguido de la palabra entre comillas. Se busca sobre el DATO ya importado
 * (no sobre el fuente), asi que las comillas llegan sin escapar.
 *
 * Reconoce el voseo y el usted («decime» / «dígame», «escribime» / «escríbame»): desde el 3-oct
 * Onia le habla de usted al prospecto, y sin eso el universo quedaba vacio.
 *
 * El verbo se pide explicito a proposito: una comilla suelta en un texto
 * ("el plan \"Completo\"") no es una instruccion, y acusarla convertiria el
 * gate en ruido — que es como se apaga un gate sin que nadie lo apague.
 */
const RE_INSTRUCCION =
  /\b(?:dec[iíl]\w*|d[ií]g[ae]\w*|escr[ií]b\w*|respond[aeé]\w*|contest[aáe]\w*|mand[aáe]\w*|pon[eég]\w*|tipe[aáe]\w*)\s+"([^"]{1,40})"/gi;

/** Aplana SCRIPT a pares [clave, texto]: los valores pueden ser string o lista. */
function textosDelGuion(script = SCRIPT) {
  const out = [];
  for (const [clave, valor] of Object.entries(script)) {
    if (typeof valor === "string") out.push([clave, valor]);
    else if (Array.isArray(valor)) {
      for (const parte of valor) if (typeof parte === "string") out.push([clave, parte]);
    }
  }
  return out;
}

/** Las palabras que el guion le PIDE al prospecto que escriba, con su origen. */
function palabrasPrometidas(script = SCRIPT) {
  const encontradas = new Map();
  for (const [clave, texto] of textosDelGuion(script)) {
    for (const m of texto.matchAll(RE_INSTRUCCION)) {
      const palabra = m[1].trim();
      // Un placeholder no es una palabra que el prospecto pueda escribir.
      if (!palabra || palabra.includes("{{")) continue;
      if (!encontradas.has(palabra)) encontradas.set(palabra, clave);
    }
  }
  return encontradas;
}

/**
 * Los detectores del motor: TODA funcion exportada por `intents.mjs`. No se
 * filtran por la forma del nombre a proposito — el primer intento pidio el
 * prefijo `is|needs|wants|asks` y dejo afuera a `noSlotWorks`, que es la que
 * honra el «escribime "otro"` de M0: el gate acuso al producto por un sujeto
 * sano. Una lista de inclusion escrita a mano falla igual aunque el universo
 * de arriba se derive del disco.
 *
 * Lo que decide no es como se llama la funcion sino que CONTESTE que si: las
 * que devuelven un objeto, `null` o un string (detectSlotChoice, findIndustry,
 * parseQualification) quedan afuera solas por el `=== true`.
 */
function detectoresDelMotor(mod = intents) {
  return Object.entries(mod).filter(([, fn]) => typeof fn === "function");
}

/** Que intenciones reconocen `frase` como mensaje entero. */
function quienLaReconoce(frase, mod = intents, config = undefined) {
  const normalizada = frase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
  const hits = [];
  for (const [nombre, fn] of detectoresDelMotor(mod)) {
    // Algunas intenciones piden el config como 2.o argumento; se prueban las
    // dos formas porque cual de las dos es no lo decide este gate.
    for (const args of [[normalizada], [normalizada, config]]) {
      let r;
      try {
        r = fn(...args);
      } catch {
        continue;
      }
      if (r === true) {
        hits.push(nombre);
        break;
      }
    }
  }
  return hits;
}

test("el guion sigue dictandole palabras al prospecto (si no, este gate no mide nada)", () => {
  const palabras = palabrasPrometidas();
  assert.ok(
    palabras.size > 0,
    "SCRIPT no tiene ninguna instruccion de palabra clave: o el guion cambio de forma o " +
      "RE_INSTRUCCION dejo de reconocerla. Un universo vacio hace que este gate pase siempre.",
  );
});

test("CASO ANCLA: las instrucciones conocidas del guion estan en el universo", () => {
  const palabras = [...palabrasPrometidas().keys()].map((p) => p.toLowerCase());
  // Los TRES sujetos medidos el 2026-09-18. Si el detector deja de verlos, el
  // gate quedaria verde por no mirar, que es como falla esta familia.
  for (const conocida of ["urgente", "no gracias", "otro"]) {
    assert.ok(
      palabras.includes(conocida),
      `"${conocida}" salio del universo; hoy hay: ${palabras.join(" · ")}`,
    );
  }
});

test("CASO ANCLA: el lado del motor no se filtra por la forma del nombre", () => {
  // `noSlotWorks` es la que honra el «escribime "otro"» de M0 y NO empieza con
  // is/needs/wants/asks. El primer intento de este gate filtraba por ese
  // prefijo y acuso al producto por un sujeto sano: si alguien vuelve a poner
  // una lista de nombres, este caso se pone rojo.
  assert.ok(
    quienLaReconoce("otro").includes("noSlotWorks"),
    'el detector no ve a noSlotWorks: volvio un filtro por nombre y el gate acusa a "otro" sin razon',
  );
});

test("toda palabra que el bot promete, el motor la reconoce", () => {
  const rotas = [];
  for (const [palabra, clave] of palabrasPrometidas()) {
    if (quienLaReconoce(palabra).length === 0) rotas.push(`${clave}: "${palabra}"`);
  }
  assert.deepEqual(
    rotas,
    [],
    "El guion le dicta al prospecto una palabra que NINGUNA intencion de intents.mjs reconoce.\n" +
      "Eso es un contrato roto: el prospecto la escribe y el bot sigue de largo.\n" +
      `Rotas: ${rotas.join(" · ")}`,
  );
});

test("la baja prometida en R_SEGUIMIENTO apaga de verdad, en sus formas naturales", () => {
  // El texto dicta la frase; una persona la escribe como le sale.
  for (const forma of ["no gracias", "No gracias", "no, gracias", "no gracias!", "  no gracias  "]) {
    assert.equal(intents.isOptOut(forma.toLowerCase().trim()), true, `no detecta la baja en ${JSON.stringify(forma)}`);
  }
});

test("la baja no se come una respuesta que solo rechaza una opcion", () => {
  // "no gracias" seguido de contenido es una respuesta al guion, no una baja:
  // apagar ahi al prospecto le cuesta el lead a Sergio Urcullo.
  for (const frase of [
    "no gracias a esa hora, mejor el martes",
    "no gracias por ahora, la semana que viene te confirmo",
  ]) {
    assert.equal(intents.isOptOut(frase), false, `apago de mas en ${JSON.stringify(frase)}`);
  }
});
