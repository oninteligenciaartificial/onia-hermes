// ONIA — pruebas PROPIAS de recepcionista.mjs (el bot de un CLIENTE de Onia).
//
// POR QUE EXISTE ESTE ARCHIVO. Estuvo COMMITEADO CON 0 BYTES desde `3e3841aa`: `node --test`
// lo cargaba, no encontraba ningun caso, y lo contaba como exito. O sea que sumaba silencio a
// la cuenta de verdes — la enfermedad exacta que este carril tiene medida (7 de 15 pendientes
// heredados eran fantasma). Un test que no puede fallar es peor que ninguno.
//
// QUE CUBRE Y QUE NO. El GUION del recepcionista (saludo, precio->humano, opt-out, botones,
// handoff, FAQ del negocio de punta a punta) ya lo prueba `bot-engine.test.mjs` §8/§8b por el
// motor REAL, que es mas señal que cualquier stub: eso NO se duplica aca.
// Aca van los huecos que quedaron sin una sola prueba, verificados por grep antes de escribir:
//   - `faqNegocioVigente`  — cero apariciones en toda la suite. Es la FAQ que EDITA EL DUEÑO,
//     asi que su matcher es la superficie que un cliente cambia sin que nadie revise el regex.
//   - `catalogoCliente`    — cero apariciones. Su string vacio es lo que decide R_NO_DATO.
//   - `botonesRecepcion`   — el tope de 20 caracteres es un limite DE META, no nuestro: si se
//     pasa, WhatsApp rechaza el interactivo y el cliente se queda sin menu, en silencio.
//
// Determinista igual que el motor: cero Date.now(), cero I/O, cero red.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";

import { botonesRecepcion, catalogoCliente, faqNegocioVigente } from "./recepcionista.mjs";
import { normalize } from "./guardrails.mjs";

const AHORA = "2026-08-31T14:00:00Z";
const faqDe = (extra) => ({
  faq: [{ id: "negocio", title: "Garantía", body: "Traé tu factura.", status: "publicado", ...extra }],
});
/** Busca como el motor: el mensaje siempre llega normalizado (`msg.norm`). */
const buscar = (conocimiento, texto, nowIso = AHORA) => faqNegocioVigente(conocimiento, normalize(texto), nowIso);

// ---------------------------------------------------------------------------
// 1. faqNegocioVigente — vigencia
// ---------------------------------------------------------------------------

test("faqNegocioVigente: publicada y vigente contesta por su tag", () => {
  const k = faqDe({ tags: ["garantia"] });
  assert.equal(buscar(k, "¿tienen garantía?")?.body, "Traé tu factura.");
});

test("faqNegocioVigente: FAIL-CLOSED — con vencimiento y SIN fecha de mensaje no se sirve", () => {
  // El motor es determinista (cero Date.now()), asi que la fecha la trae `msg.receivedAt`. Un
  // canal que no la mande no puede convertir una FAQ con vencimiento en una FAQ eterna: eso
  // afirmaria al cliente algo que quiza ya no es cierto.
  // OJO: se llama la funcion DIRECTO, no el helper — pasarle `undefined` a un parametro con
  // valor por defecto dispara el default, y el test verificaria justo lo contrario en verde.
  const k = faqDe({ tags: ["garantia"], vigenteHasta: "2030-01-01" });
  assert.equal(faqNegocioVigente(k, normalize("garantia")), null);
  assert.ok(buscar(k, "garantia", AHORA), "con fecha, la misma FAQ vigente SI se sirve");
});

test("faqNegocioVigente: vencida no se sirve; una fecha sola vale hasta el final de ese dia", () => {
  const tags = ["garantia"];
  assert.equal(buscar(faqDe({ tags, vigenteHasta: "2026-08-30" }), "garantia"), null);
  assert.ok(buscar(faqDe({ tags, vigenteHasta: "2026-08-31" }), "garantia"), "vence HOY: hoy todavia vale");
});

test("faqNegocioVigente: en borrador no se sirve", () => {
  assert.equal(buscar(faqDe({ tags: ["garantia"], status: "borrador" }), "garantia"), null);
});

// ---------------------------------------------------------------------------
// 2. faqNegocioVigente — que se mira y que no
// ---------------------------------------------------------------------------

test("faqNegocioVigente: solo mira id 'negocio' — las FAQ de Onia no son las del cliente", () => {
  // El mismo documento puede traer FAQ con otro id; servirlas como respuesta del negocio seria
  // poner palabras de Onia en boca de la ferreteria.
  const k = { faq: [{ id: "onia", title: "Precios", body: "Onia cuesta X.", status: "publicado", tags: ["garantia"] }] };
  assert.equal(buscar(k, "garantia"), null);
});

test("faqNegocioVigente: sin faq, con faq que no es lista, o sin texto: null (nunca explota)", () => {
  assert.equal(buscar({}, "garantia"), null);
  assert.equal(buscar({ faq: "garantia" }, "garantia"), null);
  assert.equal(buscar(faqDe({ tags: ["garantia"] }), ""), null);
  assert.equal(faqNegocioVigente(null, "garantia", AHORA), null);
});

test("faqNegocioVigente: recorre TODAS las FAQ, no solo la primera", () => {
  const k = {
    faq: [
      { id: "negocio", title: "A", body: "Primera.", status: "publicado", tags: ["envios"] },
      { id: "negocio", title: "B", body: "Segunda.", status: "publicado", tags: ["garantia"] },
    ],
  };
  assert.equal(buscar(k, "¿tienen garantía?")?.body, "Segunda.");
});

// ---------------------------------------------------------------------------
// 3. faqNegocioVigente — el matcher, que es lo que edita el dueño
// ---------------------------------------------------------------------------

test("faqNegocioVigente: PALABRA ENTERA — 'iva' no salta dentro de 'activa'", () => {
  const k = faqDe({ tags: ["iva"] });
  assert.equal(buscar(k, "ya esta activa la promo?"), null);
  assert.ok(buscar(k, "¿cobran IVA?"), "la palabra suelta si dispara");
});

test("faqNegocioVigente: un tag de menos de 3 letras NUNCA dispara", () => {
  // Sin este piso, un tag de dos letras matchearia media conversacion.
  assert.equal(buscar(faqDe({ tags: ["ok"] }), "ok"), null);
});

test("faqNegocioVigente: los metacaracteres del tag se escapan — no se vuelven comodines", () => {
  // Lo escribe el dueño en un input libre. Sin escapar, un tag "2.5" matchearia "245" y uno
  // con "." solo contestaria CUALQUIER mensaje: una FAQ que responde a todo.
  const k = faqDe({ tags: ["2.5"] });
  assert.equal(buscar(k, "quiero 245 tornillos"), null, "el punto es un punto, no un comodin");
  assert.ok(buscar(k, "el de 2.5 pulgadas"), "el tag literal si matchea");
  assert.equal(buscar(faqDe({ tags: ["c++"] }), "hacen cursos de c++?")?.body, "Traé tu factura.");
});

test("faqNegocioVigente: el tag se normaliza igual que el mensaje (tildes y mayusculas)", () => {
  assert.ok(buscar(faqDe({ tags: ["Garantía"] }), "tienen garantia?"), "tag con tilde vs mensaje sin tilde");
});

test("faqNegocioVigente: tags que no son lista no rompen la busqueda", () => {
  assert.equal(buscar({ faq: [{ id: "negocio", body: "x", status: "publicado", tags: "garantia" }] }, "garantia"), null);
});

// ---------------------------------------------------------------------------
// 4. catalogoCliente — su string vacio es lo que decide R_NO_DATO
// ---------------------------------------------------------------------------

test("catalogoCliente: lista los productos de la org, uno por linea", () => {
  const texto = catalogoCliente({ productos: [{ nombre: "Tornillos", queResuelve: "por unidad o por caja" }] });
  assert.equal(texto, "• *Tornillos* — por unidad o por caja");
});

test("catalogoCliente: sin queResuelve NO deja el guion colgando", () => {
  assert.equal(catalogoCliente({ productos: [{ nombre: "Tornillos" }] }), "• *Tornillos*");
});

test("catalogoCliente: descarta lo que no tiene nombre (una viñeta vacia es peor que nada)", () => {
  const texto = catalogoCliente({ productos: [{ queResuelve: "sin nombre" }, null, { nombre: "Clavos" }] });
  assert.equal(texto, "• *Clavos*");
});

test("catalogoCliente: sin productos devuelve '' — lo que hace que el motor derive a R_NO_DATO", () => {
  assert.equal(catalogoCliente({}), "");
  assert.equal(catalogoCliente({ productos: [] }), "");
  assert.equal(catalogoCliente({ productos: "Tornillos" }), "");
  assert.equal(catalogoCliente(null), "");
});

// ---------------------------------------------------------------------------
// 5. botonesRecepcion — los topes son de META, no nuestros
// ---------------------------------------------------------------------------

test("botonesRecepcion: 3 botones, titulos <=20 chars y values estables", () => {
  // 3 opciones y 20 caracteres son limites de Meta: pasarse no da error visible, WhatsApp
  // rechaza el interactivo y el cliente se queda sin menu.
  for (const nombre of ["", "Marta", "Maria Fernanda de los Angeles"]) {
    const botones = botonesRecepcion({ identity: { humanName: nombre } });
    assert.equal(botones.length, 3);
    for (const b of botones) assert.ok(b.title.length <= 20, `"${b.title}" (${b.title.length}) se pasa del tope de Meta`);
    assert.deepEqual(botones.map((b) => b.value), ["horarios", "servicios", "hablar con una persona"]);
  }
});

test("botonesRecepcion: un nombre que NO entra cae al generico — jamas truncado a la vista", () => {
  const largo = botonesRecepcion({ identity: { humanName: "Maria Fernanda de los Angeles" } });
  assert.equal(largo[2].title, "Hablar con alguien");
  assert.equal(botonesRecepcion({ identity: { humanName: "Marta" } })[2].title, "Hablar con Marta");
});

test("botonesRecepcion: sin config no explota (el menu es el ultimo recurso del cliente)", () => {
  assert.equal(botonesRecepcion(undefined)[2].title, "Hablar con alguien");
  assert.equal(botonesRecepcion({})[2].title, "Hablar con alguien");
});

test("botonesRecepcion: el value del humano es texto que wantsHuman ya entiende", () => {
  // No es casual: si un canal manda el VALUE en vez del titulo, ese texto cae igual en el
  // intent de humano sin agregar una regla nueva.
  assert.equal(botonesRecepcion({}).at(-1).value, "hablar con una persona");
});
