// ONIA — LOS TEXTOS QUE CADA ANUNCIO DE LA PAUTA PRECARGA en el WhatsApp del lead.
//
// Son el otro emisor de frases de campaña (el primero es la web: `wa.me?text=`). Acá el texto lo
// escribe Meta por el lead al tocar "Enviar mensaje", y la fuente de qué texto lleva cada anuncio es
// la especificación de la campaña: `ONIA_ADQUISICION_Y_PAUTA.md` §5.8, columna «Texto precargado».
//
// Se LEEN del doc, no se copian a un test: el par se rompe exactamente el día que alguien cambia el
// texto de un anuncio en un carril (Ventas y pauta) y la campaña del bot sigue esperando el viejo
// en otro (chatbot). Es el mismo motivo por el que `campanas-web.test.mjs` extrae las frases del
// código de la web en vez de hardcodearlas.
//
// Lo usan SOLO los tests (el motor no lee docs). Se planta con un motivo legible si el doc no está
// o ya no trae precargados: un arreglo vacío haría pasar el cruce en verde sin medir nada.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const DOC_PAUTA = fileURLToPath(new URL("../../../docs/ONIA_ADQUISICION_Y_PAUTA.md", import.meta.url));

/** Todo literal entre backticks del doc que arranca como un precargado de anuncio. */
export function precargadosDeLaPauta(docPath = DOC_PAUTA) {
  let texto;
  try {
    texto = readFileSync(docPath, "utf8");
  } catch (error) {
    throw new Error(`no pude leer el doc de la pauta (${docPath}): ${error?.code || error?.message}. Sin él, este cruce no mide nada.`);
  }
  const precargados = new Set();
  for (const m of texto.matchAll(/`(Hola, vi el anuncio de Onia \([^`]*)`/g)) {
    // Una MENCION abreviada («…» o «...») es prosa del doc que cita el texto, no el texto que Meta
    // escribe por el lead: contarla duplicaba D1 y ponia rojo el gate (2026-10-02, §5.9 paso 4).
    if (/(?:…|\.\.\.)\s*$/.test(m[1])) continue;
    precargados.add(m[1]);
  }
  if (precargados.size === 0) {
    throw new Error(
      `${docPath} ya no trae ningún precargado «Hola, vi el anuncio de Onia (…)» entre backticks: ` +
        "o cambió la frase de la pauta (y la campaña del bot hay que moverla con ella) o cambió el formato del doc.",
    );
  }
  return [...precargados];
}
