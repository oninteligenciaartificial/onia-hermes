// ---------------------------------------------------------------------------
// concordancia-con-el-humano.test.mjs
//
// QUE FIJA. Ningun texto del guion TIPEA el genero de la persona que atiende.
// `{{humano}}` lo escribe el DUEÑO del negocio desde el panel, asi que su genero
// —y hasta su numero— es un dato del cliente: no se puede clavar un pronombre al
// lado.
//
// POR QUE EXISTE, medido el 2026-09-19 sobre el guion publicado. Tres entradas del
// handoff —el momento mas caro del embudo, el unico en que alguien pidio hablar con
// una persona— decian "Te escribe EL":
//
//     M5[2]               "... Te escribe él {{via_humano}}, en horario de oficina ..."
//     M5_URGENTE[?]       "Te escribe él {{via_humano}}. Si es fuera de horario ..."
//     M0_SIN_HORARIOS[4]  "... {{humano}} te coordina uno personalmente — te escribe él."
//
// Y los TRES valores que el propio sistema propone para `{{humano}}` rompen esa
// concordancia:
//
//     - el panel (`AsistenteChatbot.tsx`, paso 2) propone «Dra. Ana Ríos»  -> femenino
//     - el motor cae a «el equipo` cuando el dueño no lo carga
//       (`knowledge.mjs`, `conBaseDelArchivo`)                             -> colectivo
//     - el simulador siembra «doña Marta»                                  -> femenino
//
// O sea que el bot de una clinica cuya encargada es la Dra. Ana Rios le dice al
// paciente «la Dra. Ana Ríos te coordina uno personalmente — te escribe él», y el
// que no cargo a nadie recibe «el equipo ... te escribe él».
//
// POR QUE NO LO VEIA NINGUN GATE. No mueve una cifra, no nombra un plan, no promete
// una capacidad y no ata un canal: esas son las cuatro familias que los gates del
// bot ya vigilan. El eje es GENERO x TEXTO. Y lo escondia el hermano sano: el
// default del funnel de VENTA de Onia es `humanName: "Sergio"`, con el que la frase
// queda bien — y el bot de Onia es el unico que se prueba todos los dias.
//
// ES LA MITAD QUE FALTO DE DOS CURAS ANTERIORES, las dos en estas mismas lineas:
//   - 2026-08-29 neutralizo el VALOR (de "Sergio" a "el equipo") y dejo el pronombre.
//   - 2026-09-18 derivo la VIA ({{via_humano}}) y dejo el pronombre a dos palabras.
// Por eso el sujeto del gate es la CLASE (todo el guion), no las tres entradas.
//
// LA CURA NO ES ADIVINAR EL GENERO. `{{humano}}` puede ser «Dra. Ana Ríos»,
// «el equipo», «Recepción» o «Marta y Juan»: no hay heuristica que acierte, y
// equivocarse es el mismo defecto al reves. Se quita el pronombre, que es la forma
// cierta para todos — el mismo criterio con el que se cerro la via: fallar hacia la
// promesa que SIEMPRE se puede cumplir.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_CONFIG, renderTemplate } from "./config.mjs";
import { varsFor } from "./reply-builder.mjs";
import { entradasDelGuion } from "./guion-del-bot.mjs";

/**
 * Pronombres de tercera persona: los que se refieren a la persona que atiende y
 * por lo tanto concuerdan con un dato del cliente.
 *
 * Van con tilde a proposito. «el» sin tilde es articulo y aparece en todos lados
 * ("el equipo", "el sistema"); «él» es inequivocamente el pronombre. Buscar la
 * forma sin tilde acusaria a la mitad del guion y apagaria el gate por ruido.
 *
 * ⚠️ El limite NO puede ser `\b`: en JavaScript `\b` se define sobre [A-Za-z0-9_],
 * y «é» no es una letra para esa clase, asi que `/\bél\b/` NO matchea «escribe él»
 * — el espacio y la «é» son los dos "non-word" y ahi no hay frontera. Escrito con
 * `\b`, este gate paso VERDE con las tres entradas rotas delante (medido al
 * correrlo antes del arreglo). Los limites van con propiedades Unicode.
 */
const PRONOMBRE_CON_GENERO = /(?<![\p{L}\p{N}_])(ellos|ellas|ella|él)(?![\p{L}\p{N}_])/iu;

/** Los que interpolan al humano: son los unicos donde el pronombre lo nombra a él. */
const NOMBRA_AL_HUMANO = /\{\{\s*humano\s*\}\}/i;

/**
 * Las entradas sujetas son las del BLOQUE del handoff y sus vecinas: una entrada
 * puede nombrar al humano en una linea y pronominalizarlo en la siguiente, asi que
 * el sujeto es la entrada ENTERA, no el renglon. Se agrupa por la clave base.
 */
function entradasQueHablanDelHumano() {
  const porClave = new Map();
  for (const [clave, texto] of entradasDelGuion(DEFAULT_CONFIG.script)) {
    const base = clave.replace(/\[\d+\]$/, "");
    porClave.set(base, `${porClave.get(base) ?? ""}\n${texto}`);
  }
  return [...porClave].filter(([, texto]) => NOMBRA_AL_HUMANO.test(texto));
}

test("el universo sale del guion y contiene las entradas del handoff que se midieron", () => {
  const claves = entradasQueHablanDelHumano().map(([clave]) => clave);

  // Caso ancla: sin esto el gate puede quedarse sin sujetos (un cambio de forma en
  // el guion, una clave renombrada) y firmar verde sin haber mirado nada.
  for (const conocida of ["M5", "M5_URGENTE", "M0_SIN_HORARIOS"]) {
    assert.ok(
      claves.includes(conocida),
      `${conocida} interpola {{humano}} y tiene que estar en el universo del gate; ` +
        `si no esta, el universo dejo de derivarse del guion`,
    );
  }
});

test("ningun texto del guion clava el genero de la persona que atiende", () => {
  const tipeadas = entradasQueHablanDelHumano()
    .filter(([, texto]) => PRONOMBRE_CON_GENERO.test(texto))
    .map(([clave, texto]) => `${clave} (${PRONOMBRE_CON_GENERO.exec(texto)[0]})`);

  assert.deepStrictEqual(
    tipeadas,
    [],
    `Estas entradas del guion nombran a {{humano}} y clavan su genero: ${tipeadas.join(", ")}.\n` +
      `El nombre lo carga el dueño desde el panel —que propone «Dra. Ana Ríos»— y el motor\n` +
      `cae a «el equipo» cuando no lo carga: con los dos, el pronombre queda mal delante del\n` +
      `cliente final. Sacá el pronombre; no hay heuristica que adivine el genero de un nombre.`,
  );
});

test("con los tres valores que el propio sistema propone, el handoff se lee bien", () => {
  // No alcanza con mirar la plantilla: lo que recibe el cliente es el RENDER, y es
  // ahi donde el nombre y el pronombre quedan pegados en la misma oracion.
  const estado = { qualification: {}, slotsOffered: [], channelType: "Channel::WebWidget" };

  for (const humano of ["Dra. Ana Ríos", "el equipo", "doña Marta"]) {
    const config = { ...DEFAULT_CONFIG, identity: { ...DEFAULT_CONFIG.identity, humanName: humano } };
    for (const clave of ["M5", "M5_URGENTE", "M0_SIN_HORARIOS"]) {
      const texto = renderTemplate(DEFAULT_CONFIG.script[clave], varsFor(estado, config));

      assert.ok(
        texto.includes(humano),
        `${clave} tiene que nombrar a «${humano}»: si no lo interpola, el sujeto del gate es otro`,
      );
      assert.doesNotMatch(
        texto,
        PRONOMBRE_CON_GENERO,
        `${clave} con humano=«${humano}» le queda al cliente final asi:\n${texto}`,
      );
      // Sacar el pronombre obliga a poner algo en su lugar ({{via_humano}}), y una
      // variable que el estado no provea se renderiza LITERAL: el cliente leeria
      // "te escribe {{via_humano}}". Vale para toda cura que meta una interpolacion.
      assert.doesNotMatch(
        texto,
        /\{\{/,
        `${clave} dejo un placeholder sin resolver delante del cliente:\n${texto}`,
      );
    }
  }
});
