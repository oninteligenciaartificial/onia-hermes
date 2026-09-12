#!/usr/bin/env node
// Ata lo que el bot DICE de plata a los dos archivos que CLAUDE.md declara fuente unica. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/precios-publicos.test.mjs
//
// ORIGEN (medido el 2026-09-03, tarea t_0651707c). El guardrail `declara_precio` estaba al reves y
// nadie lo habia mirado de frente:
//   - DEJABA PASAR  "Bs 999 por mes, oferta especial"   <- cifra inventada + descuento
//   - DEJABA PASAR  "Te lo dejo en Bs 250 con descuento"
//   - RECHAZABA     "cuesta poco" y "el precio es accesible"  <- inofensivas
// La causa: su unico patron con cifra exigia <numero><moneda> ("320 Bs") y jamas veia
// <moneda><numero> ("Bs 320") — que es como escribe el propio pricing.ts ("Bs 390/mes"), o sea la
// unica forma que un texto real iba a traer. Durante meses se creyo que ese guardrail bloqueaba
// toda cifra de plata; se uso ese motivo para no cargarle precios al bot, y era falso.
//
// Este archivo guarda las dos mitades del arreglo:
//   1. el candado: fuera del allowlist no pasa NADA, y un monto correcto tampoco habilita ofertas;
//   2. la correa: cada cifra del allowlist se vuelve a leer de onia-platform y salta si cambio.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { checkGuardrails } from "./guardrails.mjs";
import { isPriceQuestion } from "./intents.mjs";
import { applyKnowledge, validateKnowledge } from "./knowledge.mjs";
import {
  MONTOS_PERMITIDOS,
  PRECIOS_PUBLICOS,
  montosEnTexto,
  parsearMonto,
  soloPreciosPublicos,
} from "./precios-publicos.mjs";

// ---------------------------------------------------------------------------
// 1. El candado
// ---------------------------------------------------------------------------

test("los precios PUBLICOS pasan, en las dos formas de escribirlos", () => {
  const permitidos = [
    "los planes van de bs 320/mes el basico a bs 1.290/mes el completo",
    "el chatbot de whatsapp es un add-on de bs 390/mes",
    "el plan basico son 320 bs por mes",
    "bs 3.900 al año si lo pagas anual",
    "usuario extra bs 70 y agenda publica bs 150",
  ];
  for (const texto of permitidos) {
    assert.ok(
      !checkGuardrails(texto, { preciosPublicos: true }).includes("declara_precio"),
      `deberia poder decir un precio publico: ${texto}`,
    );
  }
});

test("una cifra que NO esta en los dos archivos se rechaza, escriba como escriba", () => {
  const inventados = [
    "bs 999 por mes",                    // el que pasaba: moneda adelante
    "999 bs por mes",                    // el que ya caia: moneda atras
    "te sale bs 1.200 mensuales",
    "son usd 45 al mes",
    "el plan basico son bs 321 por mes", // a un boliviano del real: no se aproxima
  ];
  for (const texto of inventados) {
    assert.ok(
      checkGuardrails(texto, { preciosPublicos: true }).includes("declara_precio"),
      `una cifra inventada tiene que caer: ${texto}`,
    );
  }
});

test("un monto correcto NO habilita un descuento: la oferta cae igual", () => {
  const ofertas = [
    "bs 320 al mes con descuento",
    "te lo dejo en bs 320",
    "bs 390/mes, oferta solo por hoy",
    "el primer mes gratis y despues bs 320",
    "bs 750 al mes, precio especial para vos",
  ];
  for (const texto of ofertas) {
    assert.ok(
      checkGuardrails(texto, { preciosPublicos: true }).includes("declara_precio"),
      `un descuento tiene que caer aunque la cifra sea real: ${texto}`,
    );
  }
});

test("modo ESTRICTO (el del LLM): ninguna cifra pasa, ni siquiera una real", () => {
  // El agujero que se cierra hoy. "bs 320" es un precio REAL y aun asi tiene que caer cuando el
  // texto lo improvisa el modelo: su contexto no lleva numeros por contrato, asi que un numero ahi
  // solo puede ser alucinacion. Antes de este arreglo los tres primeros PASABAN.
  for (const texto of [
    "bs 320 al mes",
    "el plan pro cuesta bs 750 al mes",
    "bs 999 por mes, oferta especial",
    "el plan pro cuesta 750 bs al mes",
  ]) {
    assert.ok(
      checkGuardrails(texto).includes("declara_precio"),
      `sin preciosPublicos NADA con cifra puede pasar: ${texto}`,
    );
  }
});

test("sin ninguna cifra, los patrones de siempre siguen vigentes", () => {
  // La exencion pide al menos un monto: si no, "el precio es X" se colaria por vacio.
  for (const texto of ["el precio es accesible", "cuesta poco", "desde bs lo que necesites"]) {
    assert.ok(checkGuardrails(texto, { preciosPublicos: true }).includes("declara_precio"), `deberia seguir cayendo: ${texto}`);
  }
});

test("mezclar un precio real con uno inventado cae por el inventado", () => {
  const veredicto = soloPreciosPublicos("el plan basico bs 320 y la instalacion bs 800");
  assert.deepEqual(veredicto.intrusos, [800]);
  assert.equal(veredicto.ok, false);
  assert.ok(
    checkGuardrails("el plan basico bs 320 y la instalacion bs 800", { preciosPublicos: true }).includes("declara_precio"),
  );
});

test("los separadores bolivianos se leen bien (el punto es de miles, no decimal)", () => {
  assert.equal(parsearMonto("1.290"), 1290);
  assert.equal(parsearMonto("29.000"), 29000);
  assert.equal(parsearMonto("0,11"), 0.11);
  assert.equal(parsearMonto("320"), 320);
  // Si "1.290" se leyera como 1,29 el allowlist lo tomaria por intruso y el bot se quedaria mudo.
  assert.deepEqual(montosEnTexto("bs 1.290 y bs 3.900"), [1290, 3900]);
});

test("el guardrail no se rompe con texto raro ni es stateful", () => {
  // Con /g, .exec() recuerda donde quedo: dos llamadas seguidas con el MISMO texto tienen que
  // dar lo mismo. Es el bug que guardrails.mjs documenta para .test() y que aca revive con .exec().
  const texto = "bs 320 y bs 390";
  assert.deepEqual(montosEnTexto(texto), montosEnTexto(texto));
  assert.deepEqual(montosEnTexto(""), []);
  assert.deepEqual(montosEnTexto(null), []);
});

// ---------------------------------------------------------------------------
// 2. La correa: cada cifra vuelve a leerse de onia-platform
// ---------------------------------------------------------------------------

/**
 * onia-platform es OTRO repo. Se busca por env var y despues en las rutas del VPS.
 * Si no aparece, este test FALLA — no se saltea. Un gate que se apaga solo cuando no encuentra a
 * su sujeto falla ABIERTO, y el dia que alguien cambie un precio nadie se entera.
 *
 * Esto devuelve la CARPETA. Lo que se lee de adentro sale de `fuenteDePlataforma`, nunca del
 * working tree — ver el porque ahi abajo.
 */
function repoPlataforma() {
  const candidatos = [
    process.env.ONIA_PLATFORM_DIR,
    "/root/loops/onia-platform-chatbot",
    "/root/loops/onia-platform",
    path.join(process.cwd(), "..", "onia-platform"),
  ].filter(Boolean);
  const encontrado = candidatos.find((dir) => existsSync(path.join(dir, "lib", "subscription-plans.ts")));
  assert.ok(
    encontrado,
    `no encontre onia-platform (probe: ${candidatos.join(", ")}). ` +
      "Pasa ONIA_PLATFORM_DIR=<ruta>. NO se saltea: sin leer la fuente, este gate no vale nada.",
  );
  return encontrado;
}

/**
 * Lee un archivo de onia-platform desde `origin/master`. NO del working tree, y esa es toda la
 * diferencia entre un gate y un adorno.
 *
 * POR QUE, medido el 2026-09-12: este gate paso VERDE mientras el bot le cotizaba a los leads
 * "Bs 750 el Profesional y Bs 1.500 el Completo" y la fuente ya decia 890 y 1.290 (escalera C,
 * commit 4bff903). La causa no fue el gate en si: leia `<repo>/lib/subscription-plans.ts` del
 * disco, y los DOS clones del nodo estaban atras de origin/master (1 y 15 commits). O sea
 * comparaba la copia del bot contra un FOSIL del mismo dia en que se copio — y dos fotos del
 * mismo pasado coinciden siempre.
 *
 * Un worktree atrasado es el estado NORMAL de un carril, no una anomalia que se pueda pedir que
 * no ocurra: por eso el sujeto es el ref publicado y no la carpeta donde uno esta parado.
 */
function fuenteDePlataforma(repo, archivo) {
  try {
    execFileSync("git", ["fetch", "origin", "--quiet"], { cwd: repo, stdio: "ignore", timeout: 60_000 });
  } catch {
    // Sin red se sigue con el ref que ya este en disco: refrescar es deseable, no imprescindible,
    // y este gate corre en la cadena `npm test` de todos los carriles. Lo que NO se hace nunca es
    // caer al working tree — que es, exactamente, el bug que este bloque existe para no repetir.
  }
  try {
    return execFileSync("git", ["show", `origin/master:lib/${archivo}`], {
      cwd: repo,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (error) {
    assert.fail(
      `no pude leer lib/${archivo} desde origin/master en ${repo}: ${error.message}. ` +
        "Sin la fuente publicada este gate no vale nada, asi que cae en ROJO en vez de mirar el " +
        "archivo del disco (que es el fosil que dejo pasar la escalera C).",
    );
  }
}

/** Lee un simbolo tipo "DEFAULT_PLAN_AMOUNTS.basic.monthly" del texto de un .ts. */
function leerSimbolo(fuente, simbolo) {
  const [raiz, ...camino] = simbolo.split(".");
  const desde = fuente.indexOf(`export const ${raiz}`);
  assert.notEqual(desde, -1, `no existe "export const ${raiz}" — lo renombraron o lo borraron`);
  const siguiente = fuente.indexOf("\nexport const ", desde + 1);
  let bloque = fuente.slice(desde, siguiente === -1 ? undefined : siguiente);

  // Los tramos intermedios acotan a su sub-objeto ({ monthly: 320, ... }).
  for (const tramo of camino.slice(0, -1)) {
    const match = new RegExp(String.raw`\b${tramo}\s*:\s*\{([^}]*)\}`).exec(bloque);
    assert.ok(match, `no encontre "${tramo}" dentro de ${raiz}`);
    bloque = match[1];
  }
  const hoja = camino[camino.length - 1];
  const match = new RegExp(String.raw`\b${hoja}\s*:\s*(\d+)`).exec(bloque);
  assert.ok(match, `no encontre "${hoja}" en ${simbolo}`);
  return Number(match[1]);
}

test("cada monto del allowlist sigue siendo el que dice onia-platform", () => {
  const repo = repoPlataforma();
  const fuentes = {
    "subscription-plans.ts": fuenteDePlataforma(repo, "subscription-plans.ts"),
    "pricing.ts": fuenteDePlataforma(repo, "pricing.ts"),
  };
  for (const precio of PRECIOS_PUBLICOS) {
    const enElCodigo = leerSimbolo(fuentes[precio.fuente], precio.simbolo);
    assert.equal(
      precio.monto,
      enElCodigo,
      `${precio.simbolo} vale ${enElCodigo} en ${precio.fuente} y el bot dice ${precio.monto} ` +
        `(${precio.concepto}). Actualiza precios-publicos.mjs y volve a desplegar el conocimiento.`,
    );
  }
});

// ---------------------------------------------------------------------------
// 3. Lo que de verdad importa: que el prospecto RECIBA la cifra
// ---------------------------------------------------------------------------

test("el conocimiento que se despliega contesta el precio en modo VENTA, y en el 2do turno", () => {
  // El allowlist verde no prueba nada solo: mide que el bot PUEDA decir un precio, no que lo diga.
  // Esto corre el motor igual que el webhook (inbox 4 web / 5 WhatsApp) y mira el texto que sale.
  // Y lo pregunta en el SEGUNDO turno a proposito: ahi es donde este bot se murio dos veces.
  const data = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const veredicto = validateKnowledge(data);
  assert.deepEqual(veredicto.errors, [], "knowledge.onia.json no publicaria");

  const config = applyKnowledge(DEFAULT_CONFIG, data, { nowIso: "2026-09-04T01:30:00Z" });
  const recibidos = [];
  let turno = step(
    createState({ channel: "web", contactRef: "gate-precio" }),
    { text: "hola, quiero informacion", receivedAt: "2026-09-04T01:30:00Z" },
    { config },
  );
  turno = step(turno.nextState, { text: "cuanto cuesta el sistema?", receivedAt: "2026-09-04T01:30:00Z" }, { config });
  for (const reply of turno.replies) recibidos.push(reply.text);
  const texto = recibidos.join("\n");

  assert.ok(texto.includes("320"), `el prospecto tiene que ver el precio del Basico. Salio:\n${texto}`);
  assert.ok(texto.includes("390"), "y el del chatbot, que es el add-on que se vende");
  assert.match(texto, /onia\.com\.bo\/precios/, "siempre con la lista completa, que es la que manda");
  // Que no se cuele una cifra que no sea publica: el texto entero contra el mismo candado.
  const { intrusos } = soloPreciosPublicos(texto.toLowerCase());
  assert.deepEqual(intrusos, [], `el bot dijo montos que no son publicos: ${intrusos.join(", ")}`);
});

test("las formas naturales de preguntar por plata llegan al precio, no al LLM", () => {
  // "que planes tienen" caia en el texto seguro: el prospecto preguntaba por plata y se iba sin
  // una cifra. El LLM nunca puede contestar esto — su contexto no lleva numeros por contrato.
  for (const frase of ["cuanto cuesta", "cuanto me sale", "que planes tienen", "cuanto seria", "precios?", "es caro?"]) {
    assert.ok(isPriceQuestion(frase), `"${frase}" tiene que ser pregunta de precio`);
  }
  // Y lo que NO es precio sigue sin serlo: "plan" suelto es una palabra comun.
  for (const frase of ["mi plan es abrir otra sucursal", "el plan que tengo con mi contador"]) {
    assert.ok(!isPriceQuestion(frase), `"${frase}" NO es una pregunta de precio`);
  }
});

test("la correa lee la fuente PUBLICADA, no el archivo del disco", () => {
  // La baranda del instrumento, no del producto. Sin esto, el arreglo del 2026-09-12 dura hasta
  // que alguien vuelva a poner un readFileSync "porque es mas simple" — y el gate se apaga en
  // verde otra vez, que es como un worktree 15 commits atras dejo al bot cotizando Bs 750.
  // Se mide sobre el codigo con los comentarios EN BLANCO: este mismo archivo NOMBRA la ruta
  // prohibida varias veces al explicar el bug, y un detector que lea prosa se acusa solo.
  const propio = readFileSync(new URL(import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (bloque) => bloque.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (linea) => linea.replace(/./g, " "));

  assert.equal(
    /readFileSync\s*\(\s*path\.join\s*\(\s*repo/.test(propio),
    false,
    "este gate volvio a leer lib/ del working tree: ahi es donde vive el fosil. Va por " +
      "fuenteDePlataforma(), que lee de origin/master.",
  );
  assert.match(
    propio,
    /execFileSync\([^)]*"git"[\s\S]{0,200}origin\/master:lib\//,
    "fuenteDePlataforma tiene que sacar el texto de origin/master con git show",
  );
});

test("un plan nuevo en el catalogo no puede quedar fuera del allowlist", () => {
  // La direccion que casi nadie chequea. Sin esto, agregar un plan deja al bot citando una lista
  // incompleta y el gate en verde: el allowlist envejece en silencio.
  const repo = repoPlataforma();
  const fuente = fuenteDePlataforma(repo, "subscription-plans.ts");
  const desde = fuente.indexOf("export const DEFAULT_PLAN_AMOUNTS");
  const bloque = fuente.slice(desde, fuente.indexOf("};", desde));
  const faltantes = [];
  for (const [, plan, cuerpo] of bloque.matchAll(/(\w+)\s*:\s*\{([^}]*)\}/g)) {
    for (const [, ciclo, monto] of cuerpo.matchAll(/(\w+)\s*:\s*(\d+)/g)) {
      if (!MONTOS_PERMITIDOS.has(Number(monto))) faltantes.push(`${plan}.${ciclo} = ${monto}`);
    }
  }
  assert.deepEqual(faltantes, [], `montos del catalogo que el bot no puede decir: ${faltantes.join(", ")}`);
});
