/**
 * Gates de `canal-whatsapp-vivo.mjs` — el medidor del canal donde llegan los leads.
 *
 * El caso que importa es el ULTIMO (`el SQL pide el telefono`). El 12-sep, en el módulo
 * hermano, el núcleo puro estaba probado y aun así el gate fallaba EN VERDE porque su LECTOR
 * no pedía `ct.phone_number`: sacarle la columna al SQL dejaba los 38 tests en verde. Por eso
 * acá el `docker` falso se comporta como psql de verdad — devuelve **las columnas que el SQL
 * pide**, ni una más — y así la mutación "sacale el teléfono al SELECT" es roja. Un falso que
 * devolviera siempre la fila completa sería una copia benévola del producto.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  CANAL_WHATSAPP,
  SQL_CONVERSACIONES,
  clasificar,
  canalHabloDespues,
  diagnosticar,
  medir,
  normalizarFila,
} from "./canal-whatsapp-vivo.mjs";

const DUEÑO = { inbox: 5, id: 11, contacto: "Sergio", telefono: "+59171654992", entrantes: 11, salientes: 15, ultimoEntranteAt: "2026-09-10 20:17:26" };
const MUDO_F = { inbox: 5, id: 35, contacto: "F", telefono: "+59173232758", entrantes: 1, salientes: 0, ultimoEntranteAt: "2026-08-25 21:53:25" };
const MUDO_MARIO = { inbox: 5, id: 37, contacto: "mariohassen", telefono: "+59173021804", entrantes: 1, salientes: 0, ultimoEntranteAt: "2026-08-28 02:58:14" };
const CONTESTADO = { inbox: 5, id: 60, contacto: "Ana Lopez", telefono: "+59176543210", entrantes: 2, salientes: 2, ultimoEntranteAt: "2026-09-13 10:00:00" };

const SALIENTE_POSTERIOR = new Map([[5, "2026-09-10 20:17:26"]]);
const DOC_OK = new Map([[5, true]]);

test("el dueño no es un desconocido, aunque escriba por el inbox de los leads", () => {
  const { nuestras, contestados, mudos } = clasificar([DUEÑO, MUDO_F]);
  assert.deepEqual(nuestras.map((c) => c.id), [11]);
  assert.deepEqual(contestados.map((c) => c.id), []);
  assert.deepEqual(mudos.map((c) => c.id), [35]);
});

test("el canal sale pero nunca contesto a un desconocido: ok que lo DICE, no verde mudo", () => {
  const d = diagnosticar({
    filas: [DUEÑO, MUDO_F, MUDO_MARIO],
    ultimaSalientePorInbox: SALIENTE_POSTERIOR,
    documentoPorInbox: DOC_OK,
  });
  assert.equal(d.codigo, 0);
  assert.match(d.mensaje, /NUNCA le contesto a un desconocido/i);
  // El pasivo se nombra con persona y fecha: un numero suelto no manda a nadie a ningun lado.
  assert.match(d.mensaje, /#35 F \(2026-08-25\)/);
  assert.match(d.mensaje, /#37 mariohassen \(2026-08-28\)/);
});

test("un mudo SIN saliente posterior por ese inbox es el canal, no un caso propio: ROJO", () => {
  const d = diagnosticar({
    filas: [MUDO_F],
    ultimaSalientePorInbox: new Map([[5, "2026-08-01 00:00:00"]]),
    documentoPorInbox: DOC_OK,
  });
  assert.equal(d.codigo, 1);
  assert.match(d.mensaje, /PUEDE ESTAR MUDO/i);
});

test("con un desconocido contestado el veredicto es verde de verdad", () => {
  const d = diagnosticar({ filas: [DUEÑO, CONTESTADO], ultimaSalientePorInbox: SALIENTE_POSTERIOR, documentoPorInbox: DOC_OK });
  assert.equal(d.codigo, 0);
  assert.match(d.mensaje, /el bot contesta por WhatsApp/i);
});

test("si el bot no resuelve documento para el inbox, el lead no recibe lo que se le promete", () => {
  const d = diagnosticar({ filas: [CONTESTADO], ultimaSalientePorInbox: SALIENTE_POSTERIOR, documentoPorInbox: new Map([[5, false]]) });
  assert.equal(d.codigo, 1);
  assert.match(d.mensaje, /NO RESUELVE DOCUMENTO/i);
});

test("no poder preguntar NO es un veredicto: tri-estado en cada insumo", () => {
  assert.equal(diagnosticar({ filas: null }).codigo, 2);
  assert.equal(diagnosticar({ filas: [] }).codigo, 2, "sin inbox de WhatsApp no hay nada que concluir");
  assert.equal(
    diagnosticar({ filas: [CONTESTADO], ultimaSalientePorInbox: SALIENTE_POSTERIOR, documentoPorInbox: new Map([[5, null]]) }).codigo,
    2,
    "documento no medido",
  );
  assert.equal(
    diagnosticar({ filas: [MUDO_F], ultimaSalientePorInbox: new Map(), documentoPorInbox: DOC_OK }).codigo,
    2,
    "sin la fecha de la ultima saliente no se puede atribuir el silencio",
  );
  assert.equal(canalHabloDespues(MUDO_F, new Map()), null);
});

test("una conversacion que abrimos nosotros (sin entrantes) no cuenta como lead que espero", () => {
  const { contestados, mudos } = clasificar([{ ...CONTESTADO, entrantes: 0, salientes: 1 }]);
  assert.deepEqual([...contestados, ...mudos], []);
});

test("normalizarFila descarta basura y no inventa filas", () => {
  assert.equal(normalizarFila(""), null);
  assert.equal(normalizarFila("x|y|z"), null);
  assert.equal(normalizarFila("5|35|F|+59173232758|1|0|2026-08-25 21:53:25").id, 35);
});

/**
 * EL CABLEADO. Un psql falso que respeta el contrato: devuelve SOLO las columnas del SELECT.
 * Con el SQL de hoy reconoce al dueño por teléfono; sin esa columna lo cuenta como un
 * desconocido contestado y el veredicto se vuelve un falso verde ("el bot contesta por
 * WhatsApp"). Es el bug real del 12-sep, acá en rojo.
 */
function dockerFalso() {
  return (cmd, args) => {
    if (cmd === "docker" && args[0] === "ps") return "onia-chatbot_chatwoot-db.1.abc\nonia-platform";
    const sql = String(args[args.length - 1]);
    if (/count\(\*\) filter/.test(sql)) {
      // Como psql: SOLO lo que el SELECT pide. Si el modulo deja de pedir el telefono o el
      // nombre, esta fila sale sin ellos — y el veredicto cambia, que es el punto.
      // ⚠️ Se mira la LISTA DEL SELECT, no el SQL entero: `ct.phone_number` tambien aparece en
      // el `group by`, y preguntarle al string completo dejaba pasar la mutacion que saca la
      // columna del SELECT — medido acá el 2026-09-13, con los 10 casos en verde.
      const lista = sql.slice(0, sql.search(/\bfrom\b/i));
      const pideTelefono = /phone_number/.test(lista);
      const pideNombre = /ct\.name/.test(lista);
      return [DUEÑO, MUDO_F]
        .map((c) =>
          [c.inbox, c.id, pideNombre ? c.contacto : "-", pideTelefono ? c.telefono : "", c.entrantes, c.salientes, c.ultimoEntranteAt].join("|"),
        )
        .join("\n");
    }
    if (/message_type = 1/.test(sql)) return "5|2026-09-10 20:17:26";
    return '{"knowledge":{"source":"panel","path":"/tmp/onia-bot/knowledge.json"}}';
  };
}

test("el SQL pide el telefono: sin esa columna el dueño pasa por lead y el gate firma verde", () => {
  // El falso responde al SQL que el MODULO le pasa. Sacarle `ct.phone_number` al SELECT de
  // `canal-whatsapp-vivo.mjs` hace que el dueño (11 entrantes / 15 salientes) se cuente como
  // un desconocido CONTESTADO y el veredicto pase a "el bot contesta por WhatsApp": el falso
  // verde exacto. Este caso es lo unico que lo agarra — el nucleo puro no se entera.
  const d = diagnosticar(medir({ sh: dockerFalso() }));
  assert.equal(d.codigo, 0);
  assert.match(d.mensaje, /NUNCA le contesto a un desconocido/i, "el dueño no puede contar como lead contestado");
  assert.match(d.mensaje, /desconocidos contestados 0\/1/);
  assert.match(d.mensaje, /nuestras 1/);
});

test("el canal se deriva por channel_type, nunca por el numero de inbox", () => {
  assert.equal(CANAL_WHATSAPP, "Channel::Whatsapp");
  assert.match(SQL_CONVERSACIONES, /channel_type = 'Channel::Whatsapp'/);
  assert.doesNotMatch(SQL_CONVERSACIONES, /inbox_id\s*=\s*5/, "un 5 clavado falla abierto en el inbox del cliente nuevo");
});
