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
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import {
  selfCheck,
  juzgar,
  rutasAMirar,
  paginasDelWeb,
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
  // El caso es la deriva real (repo en 30, producción en 20), así que su código es el 3: rojo
  // cuyo remedio es publicar. Lo que este caso cuida es que NUNCA sea 0, con cualquier remedio.
  assert.notEqual(v.exit, 0, "una frase que la web manda y el bot no escucha no puede salir verde");
  assert.equal(v.exit, 3);
  assert.match(v.lineas.join("\n"), /saludo genérico/, "el rojo tiene que decir qué recibe el lead");

  // Y la otra clase de rotura, para que el caso no se apoye en un solo código de salida.
  const sinNadaQueDesplegar = juzgar({
    repo: ["Quiero la demo de 30 minutos."],
    web: new Set(["Quiero la demo de 30 minutos."]),
    bot: { frases: new Set(["Hola, vengo de una pauta"]), fuente: "archivo" },
  });
  assert.notEqual(sinNadaQueDesplegar.exit, 0);
  assert.equal(sinNadaQueDesplegar.exit, 1, "sin versión vieja en producción el trabajo es de este carril");
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

test("una ruta sin medir no puede TAPAR una frase rota: primero el rojo", () => {
  // Con el universo entero (21 rutas en vez de 8) una caída suelta pasa a ser corriente, y
  // devolver NO MEDIDO antes de juzgar dejaría que cualquier 503 esconda el rojo que le
  // cuesta el lead. El rojo se dice igual, y lo que no se pudo medir se nombra al lado.
  const v = juzgar({
    repo: ["Quiero la demo de 30 minutos."],
    web: new Set(["Quiero la demo de 30 minutos."]),
    bot: { frases: new Set(["Quiero la demo de 20 minutos."]), fuente: "archivo" },
    noMedidas: [{ ruta: "/agentes", motivo: "HTTP 503" }],
  });
  assert.notEqual(v.exit, 2, "hay una frase rota medida: eso es rojo, no NO MEDIDO");
  assert.equal(v.exit, 3, "y el rojo conserva su clase: el repo ya está bien, falta publicar");
  assert.match(v.lineas.join("\n"), /saludo genérico/);
  assert.match(v.lineas.join("\n"), /\/agentes/, "y la ruta que no se pudo medir se nombra igual");
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

test("el universo de rutas es TODO `src/app`, nunca un subdirectorio", () => {
  // Medido el 2026-09-26: el medidor caminaba sólo `(sitio)` y encima filtraba por "esta
  // page.tsx nombra una constante exportada de site.ts". Las dos cosas juntas lo dejaban
  // mirando 8 de las 21 rutas vivas que le escriben un WhatsApp al lead.
  assert.match(
    CODIGO_QUE_MIDE,
    /"src",\s*"app"\s*\)/,
    "la caminata arranca en src/app: anclarla en un subdirectorio deja afuera rutas vivas con botón",
  );
  assert.doesNotMatch(
    CODIGO_QUE_MIDE,
    /\(sitio\)/,
    "nombrar `(sitio)` como raíz es el recorte que hizo invisible a /servicios/consultoria y /v1/chatbot",
  );
});

test("una ruta viva con botón entra al universo AUNQUE no nombre ninguna constante", () => {
  // `/servicios/consultoria` arma su frase con `waServiciosLink("…")` en la propia página, y
  // `/v1/empezar` la arma en un módulo que importa. Filtrar por "nombra una constante de
  // site.ts" las deja afuera a las dos, y entonces su par rota se reporta como AVISO benigno
  // ("¿pauta, o quedó huérfana?") en vez de ROJO. Medido en vivo el 2026-09-26: las 4 frases
  // que el medidor llamaba huérfanas las manda la web publicada, con HTTP 200.
  const { visitables, sinMedir } = rutasAMirar([
    { ruta: "/", archivo: "a" },
    { ruta: "/servicios/consultoria", archivo: "b" },
    { ruta: "/v1/empezar", archivo: "c" },
  ]);
  assert.deepEqual(visitables, ["/", "/servicios/consultoria", "/v1/empezar"]);
  assert.deepEqual(sinMedir, [], "sin segmentos dinámicos no hay nada que declarar sin medir");
});

test("una ruta con segmento dinámico se NOMBRA sin medir, no se descarta muda", () => {
  const { visitables, sinMedir } = rutasAMirar([
    { ruta: "/blog/[slug]", archivo: "a" },
    { ruta: "/precios", archivo: "b" },
  ]);
  assert.deepEqual(visitables, ["/precios"]);
  assert.equal(sinMedir.length, 1, "no se puede visitar sin un valor: eso se dice, no se omite");
  assert.match(sinMedir[0].motivo, /dinámico/);
});

test("la caminata salta lo que Next no publica y no confunde carpeta con ruta", () => {
  const raiz = mkdtempSync(join(tmpdir(), "onia-campanas-"));
  for (const p of ["(sitio)", "(sitio)/contacto", "servicios/consultoria", "_interno", "api/algo"]) {
    mkdirSync(join(raiz, p), { recursive: true });
  }
  for (const f of ["(sitio)/page.tsx", "(sitio)/contacto/page.tsx", "servicios/consultoria/page.tsx", "_interno/page.tsx"]) {
    writeFileSync(join(raiz, f), "x");
  }
  writeFileSync(join(raiz, "api/algo/route.ts"), "x");

  const rutas = paginasDelWeb(raiz).map((p) => p.ruta).sort();
  assert.deepEqual(rutas, ["/", "/contacto", "/servicios/consultoria"]);
  rmSync(raiz, { recursive: true, force: true });
});

test("los derivadores leen lo que importa y nada más", () => {
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

// ── las DOS clases de rotura, que tienen dueños distintos ────────────────────────────────
//
// Nace del 2026-09-26/27: este medidor entró a la medición de arranque del carril y salió
// `exit 1` en TODAS las vueltas por una causa que él mismo ya sabía nombrar en su salida —el
// deploy del bot esperando la firma de Sergio Urcullo, con el repo en 30 y producción en 20 y
// 45—. Un rojo permanente por una causa conocida se lee como "el de siempre" y se saltea: el
// día que alguien rompa una frase EN EL REPO, el gate dice lo mismo y nadie lo distingue. Es
// el patrón que ya costó vueltas en este repo con los `exit 2` ambientales.
//
// Las dos clases piden trabajo OPUESTO, y por eso se separan por código de salida:
//   · el bot tiene la versión VIEJA de la frase (difieren sólo en los números) → no hay nada
//     que escribir: hay que DESPLEGAR. Sigue siendo rojo para el lead, pero no es del carril.
//   · el bot no tiene ninguna versión de la frase → nadie escribió la respuesta. Es del carril.

test("rotura que sólo espera el deploy no se cuenta igual que una rotura del repo", () => {
  const v = juzgar({
    repo: ["Quiero agendar la demo de 30 minutos."],
    web: new Set(["Quiero agendar la demo de 30 minutos."]),
    bot: { frases: new Set(["Quiero agendar la demo de 45 minutos."]), fuente: "archivo" },
  });
  assert.equal(v.exit, 3, "el repo ya dice lo correcto: el remedio es desplegar, no escribir código");
  assert.match(v.veredicto, /deploy/i, "el veredicto tiene que NOMBRAR el remedio, no sólo que difiere");
  assert.notEqual(v.exit, 0, "que el remedio sea un deploy no lo vuelve verde: el lead HOY recibe el saludo genérico");
});

test("rotura sin versión vieja en el bot sigue siendo rojo del carril (1)", () => {
  const v = juzgar({
    repo: ["Quiero agendar la demo de 30 minutos."],
    web: new Set(["Quiero agendar la demo de 30 minutos."]),
    bot: { frases: new Set(["Hola, vengo de una pauta"]), fuente: "archivo" },
  });
  assert.equal(v.exit, 1, "nadie escribió la respuesta: el deploy no la va a inventar");
});

test("con una rotura de cada clase gana la del carril: el deploy no puede tapar trabajo", () => {
  const v = juzgar({
    repo: ["Quiero la demo de 30 minutos.", "Quiero la consulta nueva."],
    web: new Set(["Quiero la demo de 30 minutos.", "Quiero la consulta nueva."]),
    bot: { frases: new Set(["Quiero la demo de 45 minutos."]), fuente: "archivo" },
  });
  assert.equal(v.exit, 1, "una rota que el deploy NO arregla manda: si no, queda escondida detrás del pedido");
  assert.match(v.veredicto, /deploy/i, "y el veredicto igual nombra la parte que sí arregla el deploy");
});
