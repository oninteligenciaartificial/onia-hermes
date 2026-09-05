import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { DEFAULT_CONFIG } from "./config.mjs";
import { applyKnowledge, asRecepcionista } from "./knowledge.mjs";

// ---------------------------------------------------------------------------
// EL BUG QUE ESTOS CASOS CIERRAN
//
// El conocimiento del bot tiene `vigenteHasta` justamente para que una afirmacion con fecha deje
// de servirse cuando caduca, y `faqVigente()` lo respeta: la FAQ `siat` vence el 2026-09-30 y a
// partir del 1-oct el motor ya no instala su texto.
//
// Pero al vencer NO queda en blanco: el guion cae al DEFAULT de `config.mjs`, y ese default decia
// LA MISMA afirmacion con fecha, sin vencimiento ninguno. Medido el 2026-09-05 corriendo el motor
// con tres relojes distintos: el 2026-10-15 y el 2027-06-01 el bot seguia contestando "desde el
// 30 de septiembre es obligatoria" — en futuro, sobre algo que para el prospecto ya paso.
//
// O sea el vencimiento era DECORATIVO: el mecanismo disparaba (el texto cambiaba de la version
// curada a la del default) y el prospecto recibia igual la frase que el vencimiento existia para
// callar. Es la familia de fallo que ya mordio en este carril: una guarda cuyo fallback vuelve a
// meter el defecto del que protege.
//
// La regla que queda: una afirmacion que caduca vive en la FAQ, donde `vigenteHasta` la gobierna.
// El default es el fallback de "no tengo respuesta curada vigente" y por eso no puede afirmar una
// fecha — tiene que decir lo durablemente cierto y derivar el detalle al humano.
//
// La guarda mira TODO `script`, no solo `M_SIAT_BODY`: atarla a una clave dejaria el mismo bug
// vivo en la proxima plantilla que alguien escriba con una fecha adentro.
// ---------------------------------------------------------------------------

const MESES = "enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre";
// Un mes con nombre o un año con siglo es lo que envejece. Los horarios ("lun-vie, 9:00-18:00")
// y los montos no matchean: se verifico contra el guion entero, que da cero.
const RE_FECHA_QUE_CADUCA = new RegExp(`\\b(?:${MESES})\\b|\\b20\\d{2}\\b`, "i");

const textoDe = (valor) => (Array.isArray(valor) ? valor.join("\n") : String(valor ?? ""));

test("ningun texto por defecto del guion afirma una fecha que caduca", () => {
  const culpables = Object.entries(DEFAULT_CONFIG.script)
    .filter(([, valor]) => RE_FECHA_QUE_CADUCA.test(textoDe(valor)))
    .map(([clave, valor]) => `${clave}: ${textoDe(valor).slice(0, 120)}`);

  assert.deepEqual(
    culpables,
    [],
    `un default con fecha se sirve para siempre, sin que ningun vigenteHasta lo pueda callar:\n${culpables.join("\n")}`,
  );
});

test("la guarda REALMENTE detecta una fecha metida en un default", () => {
  // Sin este caso, la guarda de arriba podria pasar por no mirar nada.
  const conFecha = { ...DEFAULT_CONFIG.script, M_PRUEBA: "rige desde el 30 de septiembre" };
  const culpables = Object.entries(conFecha).filter(([, v]) => RE_FECHA_QUE_CADUCA.test(textoDe(v)));
  assert.equal(culpables.length, 1, "la guarda tiene que ver la fecha que acabamos de meter");
  assert.equal(culpables[0][0], "M_PRUEBA");
});

test("la FAQ vigente SI puede tener la fecha: es la que vence", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const hoy = asRecepcionista(applyKnowledge(DEFAULT_CONFIG, know, { nowIso: "2026-09-05T14:00:00Z" }), know);
  assert.match(
    hoy.script.M_SIAT_BODY,
    /30 de septiembre/i,
    "mientras la FAQ esta vigente el prospecto tiene que recibir el dato concreto",
  );
});

test("vencida la FAQ, el bot ya NO afirma la fecha — ni en 2027", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  for (const nowIso of ["2026-10-15T14:00:00Z", "2027-06-01T14:00:00Z"]) {
    const cfg = asRecepcionista(applyKnowledge(DEFAULT_CONFIG, know, { nowIso }), know);
    assert.doesNotMatch(
      cfg.script.M_SIAT_BODY,
      RE_FECHA_QUE_CADUCA,
      `el ${nowIso.slice(0, 10)} el bot todavia afirmaba una fecha vencida: ${cfg.script.M_SIAT_BODY}`,
    );
    // Y no se cae en mudo: sigue contestando algo util sobre facturacion.
    assert.match(cfg.script.M_SIAT_BODY, /factura/i, "vencida la FAQ el bot igual tiene que contestar");
  }
});
