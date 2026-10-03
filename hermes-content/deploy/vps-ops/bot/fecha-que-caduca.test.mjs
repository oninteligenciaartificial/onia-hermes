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
//
// EL TERCER BUG (2026-10-03): la fecha canonica dejo de ser verdad SOLA. El 30-sep-2026 la RND
// 102600000038 abrogo las RND que designaban a los grupos 9° al 12° y dejo sin efecto el plazo del
// 1-oct. Este caso EXIGIA que el bot dijera «desde el 1 de octubre de 2026 los grupos 9.º al 12.º
// emiten con facturacion en linea (RND 102600000007)»: corregir el conocimiento lo ponia en rojo.
// Un gate que fija como canonica la afirmacion de un TERCERO cementa el dato el dia que el tercero
// lo cambia. Lo que se exige ahora es lo que la norma vigente sostiene, y que la vieja no vuelva.
// Texto de la norma: hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md §2.6.
// ---------------------------------------------------------------------------

// La norma vigente y su respaldo. Si el SIN vuelve a cambiarla se edita ACA, y el caso de abajo
// obliga a que el documento publicado la siga.
const NORMA_VIGENTE = "RND 102600000038"; // 30-sep-2026: dejo sin efecto el plazo del 1-oct
const RE_NORMA_VIGENTE = /102600000038/;
const RE_SIN_EFECTO = /sin efecto|abrog/i;
// La obligacion vieja dicha como vigente: nombra el plazo o la RND 7 y lo afirma en presente.
const RE_PLAZO_VIEJO = /\b0?1(\.º)? de octubre\b|\b0?1-10-2026\b|102600000007|grupos? 9/i;
const RE_LO_AFIRMA = /\bemiten\b|\bfacturan\b|\bdeben\b|\brige\b|\bobligad[oa]s?\b|\bobligatori[oa]\b|[uú]nicamente|\bsolo pueden\b/i;
// El 30-sep tampoco se nombra: suelto se leia como el arranque del plazo, y hoy es ademas el dia de
// la RND que lo dejo sin efecto. En una respuesta de chat no hay lugar para el matiz.
const RE_PLAZO_EQUIVOCADO = /\b30 de septiembre\b|\b30-09-2026\b|\b29 de septiembre\b/i;

/** Las oraciones que dan por vigente el plazo viejo sin decir que quedo sin efecto. */
const afirmanElPlazoViejo = (texto) =>
  texto
    .split(/(?<=[.?!;])\s+/)
    .filter((o) => RE_PLAZO_VIEJO.test(o) && RE_LO_AFIRMA.test(o) && !RE_SIN_EFECTO.test(o));

const faqSiatDe = (know) => (know.faq ?? []).find((f) => f.id === "siat");

test("el documento PUBLICADO cuenta la norma vigente y no da por vivo el plazo viejo", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const faq = faqSiatDe(know);
  assert.ok(faq, "la FAQ `siat` tiene que existir en el documento publicado");
  assert.match(faq.body, RE_NORMA_VIGENTE, `la norma vigente es la ${NORMA_VIGENTE}: ${faq.body}`);
  assert.match(faq.body, RE_SIN_EFECTO, `tiene que decir que el plazo del 1-oct quedo sin efecto: ${faq.body}`);
  assert.deepEqual(
    afirmanElPlazoViejo(faq.body),
    [],
    `la ${NORMA_VIGENTE} dejo sin efecto el plazo del 1-oct de los grupos 9° al 12°: ${faq.body}`,
  );
  assert.doesNotMatch(
    faq.body,
    RE_PLAZO_EQUIVOCADO,
    `el 30 de septiembre suelto se lee como el arranque de un plazo: ${faq.body}`,
  );
});

test("la guarda REALMENTE detecta el plazo viejo (si no, pasaria por no mirar nada)", () => {
  const servido =
    "desde el 1 de octubre de 2026 los grupos 9.º al 12.º de contribuyentes emiten con facturación en línea (RND 102600000007)";
  assert.equal(afirmanElPlazoViejo(servido).length, 1, "la guarda tiene que ver lo que el bot servia hasta el 3-oct");
  const viejo = "desde el 30 de septiembre es obligatoria y el SIN tiene un portal gratuito";
  assert.match(viejo, RE_PLAZO_EQUIVOCADO, "y la fecha del 30-sep que servia antes del 6-sep");
  const sano = "la RND 102600000038 dejó sin efecto el plazo del 1 de octubre de 2026 de los grupos 9.º al 12.º.";
  assert.deepEqual(afirmanElPlazoViejo(sano), [], "decir que quedo sin efecto no es afirmarlo");
});

test("la FAQ vigente SI puede tener el dato con fecha: es la que vence", () => {
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const hoy = asRecepcionista(applyKnowledge(DEFAULT_CONFIG, know, { nowIso: "2026-10-03T14:00:00Z" }), know);
  assert.match(
    hoy.script.M_SIAT_BODY,
    RE_NORMA_VIGENTE,
    "mientras la FAQ esta vigente el prospecto tiene que recibir el dato concreto, y correcto",
  );
  assert.deepEqual(afirmanElPlazoViejo(hoy.script.M_SIAT_BODY), []);
});

test("el plazo se dice en PRESENTE sobre la norma, no en futuro que caduque", () => {
  // Nace del barrido de web-venta del 2026-09-06: un texto en futuro sobre una fecha ("solo
  // PODRAN facturar", "si no migras ANTES DEL...") es cierto hoy y falso el mes que viene, y
  // ningun instrumento lo ve porque mira el sitio de HOY. La redaccion durable enuncia la norma
  // en presente conservando la fecha, asi que es verdadera antes y despues. El futuro de la RND
  // 102600000038 («asignara periodicamente») va citado: «esa norma DICE que…» sigue siendo cierto.
  const know = JSON.parse(readFileSync(new URL("./knowledge.onia.json", import.meta.url), "utf8"));
  const faq = faqSiatDe(know);
  assert.doesNotMatch(
    faq.body,
    /\b(ser[aá]|sera|pasar[aá]|podr[aá]n?|deber[aá]n?|entrar[aá]|deja(?:r[aá]n?) de)\b/i,
    `un plazo escrito en futuro se vuelve falso solo el dia que pasa: ${faq.body}`,
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
