// ---------------------------------------------------------------------------
// aviso-nombra-todo-lo-que-el-motor-emite.test.mjs
//
// QUE FIJA. Todo `kind` que el motor puede emitir en un `notify_sergio` tiene su
// linea en `ETIQUETAS` (aviso-telegram.mjs), que es lo que Sergio Urcullo LEE en
// negrita arriba del aviso. Sin entrada, `construirAviso` cae al motivo crudo y
// el aviso encabeza con el slug interno ("quiere_comprar") en vez de decirle que
// tiene que hacer.
//
// POR QUE EXISTE, y por que este y no el que ya estaba. `ETIQUETAS` es una lista
// escrita A MANO y su universo lo produce el motor: es la familia de gates que
// falla ABIERTO en el sujeto nuevo — el kind que entre manana no es sujeto de
// nadie. Ya mordio una vez (el comentario de `handoff_urgente` lo cuenta: sin
// etiqueta propia Sergio recibia el slug), y de ahi salio un caso en
// `urgencia-en-el-handoff.test.mjs:146` que exige la etiqueta de ESE kind
// corriendo ESE guion. Eso cierra la instancia y deja la clase abierta: de los
// CINCO kinds que el motor emite hoy, ese caso mira uno. Los otros cuatro
// (`handoff`, `demo_agendada`, `sin_horarios`, `descarte_tras_agendar`) no los
// cruza nadie, y el sexto tampoco.
//
// COMO DERIVA EL UNIVERSO. Del DISCO: se lee el texto de `bot-engine.mjs`, se
// blanquean los comentarios (un `kind:` citado en prosa no es una emision) y se
// extrae el `kind` de cada payload de `notify_sergio`. No se importa una lista
// ni se enumera a mano: una lista de sujetos tipeada convierte a este gate en el
// mismo defecto que viene a cazar.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { ETIQUETAS, construirAviso } from "./aviso-telegram.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const MOTOR = join(AQUI, "bot-engine.mjs");

/**
 * Comentarios en BLANCO conservando los saltos de linea: los comentarios acusan
 * (un ejemplo citado se leeria como emision) y absuelven (una emision comentada
 * se contaria como viva). Se conservan los saltos para que los indices sigan
 * apuntando al mismo renglon.
 */
export function sinComentarios(codigo) {
  let fuera = "";
  let i = 0;
  while (i < codigo.length) {
    const dos = codigo.slice(i, i + 2);
    if (dos === "//") {
      while (i < codigo.length && codigo[i] !== "\n") {
        fuera += " ";
        i += 1;
      }
    } else if (dos === "/*") {
      while (i < codigo.length && codigo.slice(i, i + 2) !== "*/") {
        fuera += codigo[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      fuera += "  ";
      i += 2;
    } else {
      fuera += codigo[i];
      i += 1;
    }
  }
  return fuera;
}

/**
 * Los `kind` que el motor puede mandarle a Sergio, derivados del codigo.
 *
 * La ventana de cada emision va desde su `type: "notify_sergio"` hasta la
 * siguiente (o el fin del archivo): el `kind` viaja en el MISMO objeto, a veces
 * en la misma linea y a veces tres renglones abajo, asi que no se puede buscar
 * por linea. Se devuelve tambien el indice para poder nombrar al culpable, y las
 * emisiones SIN kind, que son el otro modo de falla: `ETIQUETAS[undefined]` es
 * undefined y el aviso encabeza igual con el slug.
 */
export function emisionesDeAviso(codigo) {
  const limpio = sinComentarios(codigo);
  const marcas = [...limpio.matchAll(/type:\s*["']notify_sergio["']/g)].map((m) => m.index);
  return marcas.map((inicio, n) => {
    const fin = n + 1 < marcas.length ? marcas[n + 1] : limpio.length;
    const ventana = limpio.slice(inicio, fin);
    const kind = ventana.match(/kind:\s*["']([A-Za-z0-9_]+)["']/);
    return {
      kind: kind ? kind[1] : null,
      linea: limpio.slice(0, inicio).split("\n").length,
    };
  });
}

const CODIGO = readFileSync(MOTOR, "utf8");
const EMISIONES = emisionesDeAviso(CODIGO);

// ---------------------------------------------------------------------------
// 1. Caso ancla del INSTRUMENTO: la derivacion ve los kinds conocidos
// ---------------------------------------------------------------------------
// Sin esto el gate falla EN VERDE el dia que alguien reacomoda el motor y el
// regex deja de encontrar nada: cero sujetos es cero incumplimientos. Los cuatro
// que se nombran aca estan medidos en `bot-engine.mjs` (lineas 399, 465, 493 y
// 835 al 2026-09-17) y son justamente los que el caso de `urgencia-en-el-handoff`
// NO mira.

test("el detector encuentra las emisiones del motor, incluidas las que no mira nadie", () => {
  const kinds = EMISIONES.map((e) => e.kind);
  for (const conocido of ["handoff", "sin_horarios", "descarte_tras_agendar", "demo_agendada"]) {
    assert.ok(
      kinds.includes(conocido),
      `el detector no vio la emision de "${conocido}": el universo quedo vacio y este gate no puede cazar nada`,
    );
  }
  assert.ok(
    EMISIONES.length >= 5,
    `el motor emite 5 avisos y el detector vio ${EMISIONES.length}: la derivacion se rompio`,
  );
});

// ---------------------------------------------------------------------------
// 2. La clase: TODO kind emitido tiene etiqueta, y la etiqueta no es el slug
// ---------------------------------------------------------------------------

test("todo kind que el motor emite tiene su linea en ETIQUETAS", () => {
  const huerfanos = EMISIONES.filter((e) => e.kind && !ETIQUETAS[e.kind]);
  assert.deepEqual(
    huerfanos.map((e) => `${e.kind} (bot-engine.mjs:${e.linea})`),
    [],
    "el motor emite kinds que el aviso no sabe nombrar: Sergio Urcullo recibiria el slug interno en negrita",
  );
});

test("ninguna emision viaja SIN kind", () => {
  // `ETIQUETAS[undefined]` es undefined y cae al motivo crudo igual que un kind
  // desconocido: es la misma falla por el otro lado.
  const mudas = EMISIONES.filter((e) => !e.kind);
  assert.deepEqual(
    mudas.map((e) => `bot-engine.mjs:${e.linea}`),
    [],
    "hay un notify_sergio sin kind: el aviso no tiene con que elegir etiqueta",
  );
});

test("la etiqueta le dice a Sergio QUE hacer, no le repite el slug", () => {
  for (const [kind, etiqueta] of Object.entries(ETIQUETAS)) {
    assert.notEqual(
      String(etiqueta).trim(),
      kind,
      `la etiqueta de "${kind}" es el slug: tenerla escrita no alcanza si dice lo mismo que no tenerla`,
    );
    assert.ok(String(etiqueta).trim().length > 0, `la etiqueta de "${kind}" esta vacia`);
  }
});

// ---------------------------------------------------------------------------
// 3. Que la falta de etiqueta SE VEA en lo que Sergio lee
// ---------------------------------------------------------------------------
// El invariante de arriba compara dos listas; este ata la consecuencia. Sin el,
// alguien podria "arreglar" un rojo agregando la clave a ETIQUETAS sin que nadie
// haya comprobado nunca que ese mapa es el que decide el encabezado.

test("un kind sin etiqueta encabeza el aviso con el slug crudo", () => {
  const inventado = "zz_kind_que_nadie_nombro";
  assert.equal(ETIQUETAS[inventado], undefined, "el fixture eligio un kind que SI existe");

  const aviso = construirAviso({
    notify: [{ kind: inventado, text: "un prospecto esperando" }],
    conversationId: 77,
  });
  assert.ok(
    aviso.texto.includes(inventado),
    "un kind sin etiqueta deberia salir crudo en el aviso; si no sale, ETIQUETAS no es lo que decide el encabezado y este gate mide un mapa que no manda",
  );

  const conocido = Object.keys(ETIQUETAS)[0];
  const bueno = construirAviso({ notify: [{ kind: conocido, text: "x" }], conversationId: 77 });
  assert.ok(
    bueno.texto.includes(ETIQUETAS[conocido]) && !bueno.texto.includes(`<b>${conocido}</b>`),
    `con etiqueta, el aviso encabeza con la frase y no con "${conocido}"`,
  );
});
