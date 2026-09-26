// Gate de `campanas-vivas.mjs` — el medidor que compara la web VIVA con el bot VIVO.
//
// POR QUÉ ESTE ARCHIVO EXISTE APARTE DEL MEDIDOR. La medición viva necesita el VPS y la web
// publicada: en la cadena eso sería un rojo ambiental, y un rojo ambiental se archiva como
// "el de siempre" hasta que deja de mirarse. Así que se parten las dos mitades, como ya hace
// la casa: acá va el self-check PURO (juzga con datos de mentira, sin tocar nada), y la
// medición viva se corre a mano en la medición de arranque del carril, donde su `exit 2`
// significa NO MEDIDO y no "está bien".
//
// Lo que este gate cuida, más allá de que la lógica ande: que el medidor siga DERIVANDO sus
// sujetos del disco. Una lista de rutas escrita a mano adentro del medidor lo deja ciego a la
// próxima página con botón de WhatsApp, y esa ceguera se ve idéntica a un verde.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  selfCheck,
  juzgar,
  constantesDeFrase,
  rutasQueMandanFrases,
  frasesDeHtml,
  campanasDelRepo,
} from "./campanas-vivas.mjs";

const FUENTE = readFileSync(fileURLToPath(new URL("./campanas-vivas.mjs", import.meta.url)), "utf8");

/**
 * La mitad del medidor que MIDE, sin comentarios y sin los fixtures del self-check.
 *
 * Dos recortes, y los dos los pidió un rojo por el motivo equivocado —que es un verde
 * futuro—: el self-check usa "/contacto" como ruta de MENTIRA y los comentarios la nombran al
 * contar el caso real, así que un grep sobre el archivo entero acusa de hardcodeo justo al
 * archivo que deriva bien. El ancla se ASERTA: si alguien renombra el self-check, este
 * recorte se quedaría con el archivo entero y el gate volvería a acusar de más.
 */
const ANCLA_SELF_CHECK = "export function selfCheck(";
const CODIGO_QUE_MIDE = (() => {
  assert.ok(FUENTE.includes(ANCLA_SELF_CHECK), `el medidor tiene que seguir teniendo "${ANCLA_SELF_CHECK}": sin ese ancla este gate mide el archivo entero`);
  return FUENTE.slice(0, FUENTE.indexOf(ANCLA_SELF_CHECK))
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
})();

test("el self-check del medidor pasa entero", () => {
  assert.equal(selfCheck(), 0, "el self-check de campanas-vivas.mjs tiene que salir 0");
});

test("las rutas se DERIVAN del disco: ni una escrita a mano en el medidor", () => {
  // Si alguien resuelve un bug agregando "/contacto" a mano, el medidor deja de ver la
  // próxima página con botón. El sujeto se deriva o no se mide.
  const rutasALaMano = CODIGO_QUE_MIDE.match(/["'`]\/(contacto|precios|empezar|chatbot|facturacion|nosotros)["'`]/g);
  assert.equal(
    rutasALaMano,
    null,
    `el medidor no puede nombrar rutas del sitio a mano (encontré ${rutasALaMano?.join(", ")}): se derivan de (sitio)/**/page.tsx`,
  );
});

test("una frase rota NUNCA puede salir verde, y el rojo dice qué recibe el lead", () => {
  const v = juzgar({
    repo: ["Quiero la demo de 30 minutos."],
    web: new Set(["Quiero la demo de 30 minutos."]),
    bot: { frases: new Set(["Quiero la demo de 20 minutos."]), fuente: "archivo" },
  });
  assert.equal(v.exit, 1);
  assert.match(v.lineas.join("\n"), /saludo genérico/, "el rojo tiene que decir qué recibe el lead");
});

test("no poder preguntarle a un lado es NO MEDIDO (2), nunca verde ni rojo", () => {
  const sinBot = juzgar({ repo: ["x"], web: new Set(["x"]), bot: { frases: null, motivo: "sin docker" } });
  assert.equal(sinBot.exit, 2);

  const sinWeb = juzgar({
    repo: ["x"],
    web: new Set(),
    bot: { frases: new Set(["x"]) },
    noMedidas: [{ ruta: "/contacto", motivo: "HTTP 503" }],
  });
  assert.equal(sinWeb.exit, 2, "una ruta viva que no contesta no puede leerse como 'la web no manda nada'");
});

test("con una frase rota, la que sólo tiene el bot se nombra VIEJA — no se manda al remedio opuesto", () => {
  const v = juzgar({
    repo: ["Quiero la demo de 30 minutos."],
    web: new Set(["Quiero la demo de 30 minutos."]),
    bot: { frases: new Set(["Quiero la demo de 20 minutos."]), fuente: "archivo" },
  });
  assert.match(v.lineas.join("\n"), /versión VIEJA/);
  assert.doesNotMatch(
    v.lineas.join("\n"),
    /la borraría/,
    "con una frase rota el deploy es el ARREGLO: decir que borraría algo manda al revés",
  );
});

test("sin ninguna frase rota, una frase extra del bot sí es producción ADELANTE", () => {
  const v = juzgar({
    repo: ["x"],
    web: new Set(["x"]),
    bot: { frases: new Set(["x", "vengo de una pauta"]), fuente: "archivo" },
  });
  assert.equal(v.exit, 0);
  assert.match(v.lineas.join("\n"), /ADELANTE/);
});

test("una frase viva que ninguna campaña empareja no pone rojo el gate", () => {
  const v = juzgar({
    repo: ["x"],
    web: new Set(["x", "hola, cuánto sale?"]),
    bot: { frases: new Set(["x"]), fuente: "archivo" },
  });
  assert.equal(v.exit, 0, "el bot no tiene que tener respuesta propia para CUALQUIER mensaje");
});

test("los derivadores leen lo que importa y nada más", () => {
  const cs = constantesDeFrase('export const WA_URL = waLink("a");\nexport const AG = waServiciosLink("b");\nexport const SITE_URL = "https://x";');
  assert.deepEqual(cs, ["AG", "WA_URL"]);

  const rutas = rutasQueMandanFrases(
    [{ ruta: "/", archivo: "a" }, { ruta: "/terminos", archivo: "b" }],
    ["WA_URL"],
    (f) => (f === "a" ? "href={WA_URL}" : "sin botones"),
  );
  assert.deepEqual(rutas, ["/"]);

  assert.ok(
    frasesDeHtml('<a href="https://wa.me/591?text=Hola%2C%20soy%20yo">x</a>').has("Hola, soy yo"),
    "la frase se compara DECODIFICADA: el HTML la sirve con %20 y el bot matchea exacto",
  );
  assert.deepEqual(campanasDelRepo({ campanas: [{ frase: "a" }, { respuesta: "sin frase" }] }), ["a"]);
});

test("el knowledge del repo que este medidor lee es el que el deploy instala", () => {
  // `deploy-bot.sh` publica `knowledge.onia.json` y `webhook-server.sh knowledge` lo instala
  // como `knowledge.json` adentro del contenedor. Apuntar al hermano de `docs/` —que no viaja
  // a ninguna parte— es exactamente cómo el gate del repo estuvo verde sobre un archivo que
  // ningún deploy copiaba (medido el 2026-09-24).
  assert.match(FUENTE, /knowledge\.onia\.json/, "el lado REPO tiene que ser el archivo que el deploy instala");
  assert.match(FUENTE, /\/tmp\/onia-bot\/knowledge\.json/, "el lado VIVO tiene que ser el que el motor lee dentro del contenedor");
  assert.doesNotMatch(
    FUENTE,
    /docs\/chatbot\/campanas-onia\.knowledge\.json/,
    "ese hermano de docs/ no viaja en ningún deploy: leerlo es el falso verde que este gate evita",
  );
});
