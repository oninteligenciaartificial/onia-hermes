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

// ---------------------------------------------------------------------------
// EL SEGUNDO BUG, y lo encontro el test que lo tapaba
//
// Los casos de arriba cuidan que el dato VENZA. Ninguno miraba si el dato era CIERTO, y el caso
// que vivia aca exigia textualmente /30 de septiembre/ — o sea el gate del 2026-09-05 cemento la
// fecha equivocada: se escribio mirando el vencimiento y nadie verifico la fecha en si.
//
// El plazo real es el **1 de octubre de 2026** (RND 102600000007, grupos 9° al 12° de
// contribuyentes), que es lo que onia.com.bo/facturacion publica con la resolucion citada. El bot
// decia el 30 de septiembre: un dia antes, o sea le contaba al dueno de un negocio que ya estaba
// en falta cuando todavia no lo estaba. Dos superficies de cliente con dos fechas distintas sobre
// un plazo legal — que es justo lo que "una promesa se barre en TODA la superficie" existe para
// evitar; el barrido de web-venta del 2026-09-06 alcanzo la web y no llego al bot.
//
// Por eso el sujeto de esta guarda es el DOCUMENTO PUBLICADO (`knowledge.onia.json`, el que
// produccion carga), no el default: el default ya estaba sano y el defecto vivia en la variante
// hermana, que es como nacen estos bugs en este carril.
// ---------------------------------------------------------------------------

// La fecha canonica y su respaldo. Si la norma cambia se edita ACA, y el caso de abajo obliga a
// que el documento publicado la siga.
const PLAZO_SIAT = "1 de octubre de 2026"; // RND 102600000007, grupos 9° al 12°
const RE_PLAZO_CANONICO = /\b1\.º? de octubre de 2026\b|\b1 de octubre de 2026\b|\b0?1-10-2026\b/i;
// Cualquier OTRA forma de nombrar el arranque del plazo es una fecha que contradice a la canonica.
const RE_PLAZO_EQUIVOCADO = /\b30 de septiembre\b|\b30-09-2026\b|\b29 de septiembre\b/i;

const faqSiatDe = (know) => (know.faq ?? []).find((f) => f.id === "siat");

test("el documento PUBLICADO nombra el plazo fiscal con la fecha canonica", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const faq = faqSiatDe(know);
  assert.ok(faq, "la FAQ `siat` tiene que existir en el documento publicado");
  assert.match(
    faq.body,
    RE_PLAZO_CANONICO,
    `el plazo es el ${PLAZO_SIAT} (RND 102600000007). El bot decia otra cosa: ${faq.body}`,
  );
  assert.doesNotMatch(
    faq.body,
    RE_PLAZO_EQUIVOCADO,
    `una fecha distinta a la canonica le dice al cliente que esta en falta cuando no lo esta: ${faq.body}`,
  );
});

test("la guarda REALMENTE detecta la fecha equivocada (si no, pasaria por no mirar nada)", () => {
  const viejo = "desde el 30 de septiembre es obligatoria y el SIN tiene un portal gratuito";
  assert.match(viejo, RE_PLAZO_EQUIVOCADO, "la guarda tiene que ver la fecha que el bot servia");
  assert.doesNotMatch(viejo, RE_PLAZO_CANONICO, "y no puede confundirla con la canonica");
});

test("la FAQ vigente SI puede tener la fecha: es la que vence", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const hoy = asRecepcionista(applyKnowledge(DEFAULT_CONFIG, know, { nowIso: "2026-09-05T14:00:00Z" }), know);
  assert.match(
    hoy.script.M_SIAT_BODY,
    RE_PLAZO_CANONICO,
    "mientras la FAQ esta vigente el prospecto tiene que recibir el dato concreto, y correcto",
  );
});

test("el plazo se dice en PRESENTE sobre la norma, no en futuro que caduque", () => {
  // Nace del barrido de web-venta del 2026-09-06: un texto en futuro sobre una fecha ("solo
  // PODRAN facturar", "si no migras ANTES DEL...") es cierto hoy y falso el mes que viene, y
  // ningun instrumento lo ve porque mira el sitio de HOY. La redaccion durable enuncia la norma
  // en presente conservando la fecha, asi que es verdadera antes y despues.
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const faq = faqSiatDe(know);
  assert.doesNotMatch(
    faq.body,
    /\b(ser[aá]|sera|pasar[aá]|podr[aá]n?|deber[aá]n?|entrar[aá]|deja(?:r[aá]n?) de)\b/i,
    `el plazo escrito en futuro se vuelve falso solo el ${PLAZO_SIAT}: ${faq.body}`,
  );
});

test("vencida la FAQ, el bot ya NO afirma la fecha — por lejos que se mire", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  // Los relojes se DERIVAN del propio `vigenteHasta`. Escritos a mano (estaban en 2026-10-15 y
  // 2027-06-01) el caso se vuelve rojo en cuanto alguien extiende la vigencia, que es un cambio
  // legitimo — y un test que se rompe al hacer lo correcto termina "arreglado" bajandole la
  // vigencia al dato, o sea el test manejando al producto en vez de cuidarlo.
  const vence = new Date(`${faqSiatDe(know).vigenteHasta}T00:00:00Z`);
  const masTarde = (dias) => new Date(vence.getTime() + dias * 86400_000).toISOString();
  for (const nowIso of [masTarde(1), masTarde(15), masTarde(365)]) {
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
