// ONIA — ¿las frases que onia.com.bo MANDA HOY tienen campaña publicada?
//
// El agujero que este gate tapa. Ya existe un guardia de las frases de campaña
// (`bot/campanas-web.test.mjs`), y es bueno: extrae los literales en vez de hardcodearlos.
// Pero los extrae de `web-factory/apps/onia-platform/src/` — o sea del REPO. Producción se
// sirve de un build, no del working tree, y los dos carriles son distintos: el día que
// web-factory despliegue un cambio que este repo todavia no tiene (o al reves), el test
// queda VERDE mientras el desconocido recibe el saludo generico. Hoy coinciden; que
// coincidan es suerte, no una medicion.
//
// Es el mismo molde que `chatwoot-marca-publica.mjs`: lo que vale es la cara que ve el
// desconocido, y se mide desde afuera. Esto es un GET y nada mas — sin VPS, sin docker, sin
// token. Corre desde cualquier maquina:
//
//   npm run campanas:documento
//
// ⚠️ SU ALCANCE, y es la mitad de la pregunta: coteja la web VIVA contra el documento del
// REPO. Su `exit 0` NO dice que un lead reciba la respuesta que califica — el contenedor
// puede correr una version anterior de ese mismo archivo. Eso lo mide el hermano,
// `bot/campanas-vivas.mjs` (`npm run campanas:bot-vivo`), y `npm run campanas:vivas` corre
// los dos porque la pregunta completa necesita los dos.
//
// Nace de haber cometido del otro lado el error que la cabecera de arriba denuncia. El
// 2026-09-26, el mismo minuto y sobre el mismo destino: este instrumento dijo `exit 0`
// ("toda frase viva tiene campaña") mientras el hermano decia `exit 1` ("2 de 3 frases que
// la web viva manda no las escucha el bot vivo"). Los dos tenian razon — este leia la
// version 2026-09-25.1 del repo, el bot corria la 2026-09-24.1. Y la fila S18 de la cola se
// habia cerrado el dia anterior citando justamente este `exit 0` como *"medido contra el
// sitio VIVO y no contra el arbol"*: cierto para la web, falso para el documento.
//
// Sale 0 si toda frase viva tiene campaña EN EL DOCUMENTO, 1 nombrando las que no. No
// escribe nada: quien publica es S9 (el `scp` del documento al VPS), este solo mira.
//
// Env opcional: ONIA_WEB_URL (default https://onia.com.bo).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { campanaExacta } from "./bot/recepcionista.mjs";
import { normalize } from "./bot/guardrails.mjs";

/** Las paginas que hoy renderizan un link de WhatsApp. Si aparece una nueva, se agrega aca. */
export const PAGINAS = [
  "/", "/precios", "/empezar", "/contacto", "/nosotros", "/facturacion",
  "/chatbot", "/v1/chatbot", "/v1/empezar",
  "/servicios/consultoria", "/servicios/marketing-ia",
];

// El documento que el DEPLOY publica. Hasta el 2026-09-24 esto apuntaba a
// `docs/chatbot/campanas-onia.knowledge.json`, un archivo hermano que ningun deploy copiaba: las
// 9 campañas estaban 100% verdes aca y 0% vivas para un lead. `knowledge.onia.json` es el que
// `deploy-bot.sh` instala en el contenedor como `knowledge.json`.
export const DOC_PATH = fileURLToPath(new URL("./bot/knowledge.onia.json", import.meta.url));

/**
 * Clase POSITIVA a proposito: exactamente lo que produce `encodeURIComponent` (alfanumerico,
 * `%XX` y los no-reservados). Una clase negativa parece mas simple y es una trampa — la
 * primera version de esta medicion escribio `[^"\s<>]` con un backslash de menos, terminó
 * excluyendo la letra `s`, corto "Quiero " antes de "saber" y reporto las cinco frases vivas
 * como huerfanas. Ademas asi corta sola donde tiene que cortar: en el `"` del href suelto y
 * en el `\` del payload RSC de Next, que no estan en la clase.
 */
const RX_WA = /wa\.me\/\d+\?text=([A-Za-z0-9%._~!*'()-]+)/g;

/** Los textos que la pagina precarga en un link de WhatsApp, ya decodificados. */
export function frasesDelHtml(html) {
  const frases = new Set();
  for (const m of html.matchAll(RX_WA)) {
    try { frases.add(decodeURIComponent(m[1])); } catch { /* %XX roto: no es una frase */ }
  }
  return frases;
}

/**
 * Coteja las frases vivas contra el documento. El match NO se reimplementa: lo decide
 * `campanaExacta`, la misma funcion del motor — incluida la regla del prefijo. Un gate con su
 * propia idea de que matchea sale verde sobre un match que en produccion ya no ocurre.
 *
 * @param {Map<string, string[]>} vivas  frase -> paginas que la mandan
 * @param {{campanas?: Array<{frase: string}>}} doc  el documento de campañas
 */
export function cotejar(vivas, doc) {
  const cubiertas = [];
  const sinCampana = [];
  const usadas = new Set();
  for (const [frase, paginas] of vivas) {
    const campana = campanaExacta(doc, normalize(frase));
    if (campana) { cubiertas.push({ frase, paginas, campana }); usadas.add(campana); }
    else sinCampana.push({ frase, paginas });
  }
  const sinFraseViva = (doc?.campanas || []).filter((c) => !usadas.has(c));
  return { cubiertas, sinCampana, sinFraseViva };
}

/** Baja las paginas y arma el mapa frase -> paginas. Una pagina caida es un fallo, no un cero. */
export async function frasesVivas(base, paginas = PAGINAS) {
  const vivas = new Map();
  for (const pagina of paginas) {
    const respuesta = await fetch(base + pagina);
    if (!respuesta.ok) throw new Error(`${base}${pagina} respondio ${respuesta.status}`);
    for (const frase of frasesDelHtml(await respuesta.text())) {
      if (!vivas.has(frase)) vivas.set(frase, []);
      vivas.get(frase).push(pagina);
    }
  }
  return vivas;
}

/**
 * El instrumento HERMANO que sí le pregunta al bot VIVO. Este de acá coteja la web viva
 * contra el documento del REPO; ese coteja la web viva contra el `knowledge.json` que el
 * proceso del bot tiene CARGADO. Son preguntas distintas y pueden contestar al revés.
 */
export const INSTRUMENTO_VIVO = "hermes-content/deploy/vps-ops/bot/campanas-vivas.mjs";

/**
 * El veredicto, como dato y sin red, para que el gate pueda exigirle propiedades.
 *
 * Lo que mide este instrumento es **web viva ↔ documento del repo**, y la salida tiene que
 * decirlo: el `exit 0` de acá NO significa que un lead reciba la respuesta que califica.
 * @returns {{salida: string[], error: string[], exit: 0|1, alcance: string}}
 */
export function lineasDelVeredicto({ base, vivas, cubiertas, sinCampana, sinFraseViva, doc }) {
  const version = doc?.version || "sin version";
  const salida = [
    `[campanas-vivas] ${base} — ${vivas.size} frases vivas, ${cubiertas.length} con campaña (documento ${version})`,
    ...sinFraseViva.map((c) => `[campanas-vivas]   campaña sin frase viva (no es un fallo): ${JSON.stringify(c.frase)}`),
  ];
  if (sinCampana.length === 0) {
    salida.push(
      `[campanas-vivas] toda frase viva tiene campaña en el DOCUMENTO DEL REPO (${version}).`,
      `[campanas-vivas] ALCANCE: esto NO prueba que el bot VIVO las escuche — el contenedor puede`,
      `[campanas-vivas]   correr una version anterior de ese mismo archivo. Eso lo mide ${INSTRUMENTO_VIVO}.`,
    );
    return { salida, error: [], exit: 0, alcance: "documento-del-repo" };
  }
  return {
    salida,
    error: [
      `[campanas-vivas] SIN CAMPAÑA ${sinCampana.length}/${vivas.size} — el desconocido recibe el saludo generico:`,
      ...sinCampana.map(({ frase, paginas }) => `[campanas-vivas]   ${JSON.stringify(frase)}  <- ${paginas.join(", ")}`),
      `[campanas-vivas] agregala a ${DOC_PATH} y desplega el bot (DESPLEGAR: bot).`,
    ],
    exit: 1,
    alcance: "documento-del-repo",
  };
}

// `process.exitCode` y NUNCA `process.exit()`: en Windows, matar el proceso con los sockets
// keep-alive de `fetch` abiertos revienta libuv y devuelve 127 en vez del 1. Un gate que no
// puede decir su veredicto por el codigo de salida no lo lee ningun cron.
if (process.argv[1]?.endsWith("campanas-vivas.mjs")) {
  const base = process.env.ONIA_WEB_URL || "https://onia.com.bo";
  const doc = JSON.parse(readFileSync(DOC_PATH, "utf8"));
  try {
    const vivas = await frasesVivas(base, PAGINAS);
    const { cubiertas, sinCampana, sinFraseViva } = cotejar(vivas, doc);
    const v = lineasDelVeredicto({ base, vivas, cubiertas, sinCampana, sinFraseViva, doc });
    for (const linea of v.salida) console.log(linea);
    for (const linea of v.error) console.error(linea);
    if (v.exit !== 0) process.exitCode = v.exit;
  } catch (e) {
    console.error(`[campanas-vivas] no se pudo medir: ${e.message}`);
    process.exitCode = 1;
  }
}
