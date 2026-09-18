/**
 * Lee del catálogo PUBLICADO de onia-platform las dos tablas que deciden la promesa de inclusión:
 * qué plan trae el chatbot pagado adentro (`whatsappIncluded`) y cómo se llama cada plan para el
 * cliente (`PLAN_LABELS`).
 *
 * POR QUE EXISTE COMO MODULO Y NO DENTRO DEL TEST. Estos dos parsers vivían adentro de
 * `promesa-inclusion.test.mjs`, y por eso el cruce capacidad↔promesa sólo se podía hacer desde
 * ahí — o sea contra `knowledge.onia.json`, EL ARCHIVO DEL REPO. Y el archivo del repo no es lo
 * que el lead recibe: el motor sirve el documento EFECTIVO, que es la fila del panel mergeada
 * por campo sobre el artefacto (`knowledge.mjs`, `mergePanelKnowledge`). Medido el 2026-09-18 en
 * producción: `/health` del webhook declara `source:"panel"` y la fila viva trae hoy una sola
 * FAQ (`negocio`), que no habla de planes — así que HOY el cruce da lo mismo. El día que alguien
 * escriba desde el panel una respuesta de precios (que es exactamente para lo que el panel
 * existe), esa frase GANA sobre el archivo, se la manda a todos los inboxes, y el gate del repo
 * sigue verde porque mide el archivo. Es la misma familia que ya mordió acá: «un artefacto
 * gitignoreado que producción sirve es invisible para todo gate de repo».
 *
 * Sacándolos a este módulo los importan LOS DOS lados con una sola fuente: el test (que ata el
 * archivo, sin red, y puede vivir en la cadena) y `precios-vivos.mjs` (que ata el documento vivo
 * y habla con producción). Copiarlos en vez de importarlos sería el falso verde clásico: dos
 * copias que coinciden mientras la realidad les dé la razón a las dos.
 *
 * TIRA en vez de devolver vacío a propósito: quien lo llama decide si eso es un rojo o un
 * NO MEDIDO, y un catálogo que no se pudo leer no puede absolver a nadie.
 */

/** Índice del próximo `export` de nivel superior, para acotar el bloque de una tabla. */
function indiceDelSiguienteExport(fuente, desde) {
  const siguiente = fuente.indexOf("\nexport ", desde + 1);
  return siguiente === -1 ? undefined : siguiente;
}

function bloqueDe(fuente, declaracion) {
  const desde = fuente.indexOf(declaracion);
  if (desde === -1) {
    throw new Error(`no existe «${declaracion}» — lo renombraron o lo borraron`);
  }
  return fuente.slice(desde, indiceDelSiguienteExport(fuente, desde));
}

/**
 * `PLAN_LIMITS` del catálogo publicado → `{ [planId]: whatsappIncluded }`. Derivado, no a mano:
 * una lista de planes tipeada acá se queda sin el plan nuevo y el cruce lo absuelve callado (así
 * entró la escalera C).
 *
 * @param {string} fuente contenido de `lib/plan-catalogo.ts`
 * @returns {Record<string, boolean>}
 */
export function incluidoPorPlanDelCatalogo(fuente) {
  const bloque = bloqueDe(fuente, "export const PLAN_LIMITS");

  const porPlan = {};
  for (const m of bloque.matchAll(/^ {2}(\w+): \{([\s\S]*?)^ {2}\},/gm)) {
    const incluido = /whatsappIncluded:\s*(true|false)/.exec(m[2]);
    if (!incluido) {
      throw new Error(`el plan "${m[1]}" no declara whatsappIncluded: el gate no puede juzgarlo`);
    }
    porPlan[m[1]] = incluido[1] === "true";
  }
  if (Object.keys(porPlan).length < 4) {
    throw new Error(`lei ${Object.keys(porPlan).length} planes de PLAN_LIMITS, es muy poco`);
  }
  return porPlan;
}

/**
 * `PLAN_LABELS` de `pricing.ts` → `{ [planId]: "nombre que lee el cliente" }`.
 *
 * @param {string} fuente contenido de `lib/pricing.ts`
 * @returns {Record<string, string>}
 */
export function labelsDelProducto(fuente) {
  const bloque = bloqueDe(fuente, "export const PLAN_LABELS");
  const labels = {};
  for (const m of bloque.matchAll(/^ {2}(\w+): "([^"]+)",/gm)) labels[m[1]] = m[2];
  if (Object.keys(labels).length < 4) {
    throw new Error(`lei ${Object.keys(labels).length} labels de PLAN_LABELS, es muy poco`);
  }
  return labels;
}

/**
 * Las dos tablas juntas, leídas del ref PUBLICADO del repo hermano.
 *
 * Tri-estado y sin excepciones hacia afuera: `null` = no se pudo preguntar (falta el repo, el ref
 * no se pudo leer, la tabla cambió de forma), y viene con el motivo para que el que lo imprime no
 * tenga que adivinar cuál de las tres fue. Nunca devuelve tablas a medias: media tabla absuelve
 * a los planes que faltan, que es el modo de falla caro.
 *
 * @returns {{incluidoPorPlan:Record<string,boolean>, labels:Record<string,string>, motivo:null}
 *          |{incluidoPorPlan:null, labels:null, motivo:string}}
 */
export function leerCatalogoDeInclusion({ repoPlataforma, fuenteDePlataforma } = {}) {
  try {
    const repo = repoPlataforma();
    if (!repo) return { incluidoPorPlan: null, labels: null, motivo: "no encontre el repo onia-platform" };
    // Ojo: `fuenteDePlataforma` ya arma el `lib/` — pasarle la ruta completa pide `lib/lib/...`
    // y el error se lee como "el catálogo no existe" cuando lo que está mal es la llamada.
    const catalogo = fuenteDePlataforma(repo, "plan-catalogo.ts");
    const pricing = fuenteDePlataforma(repo, "pricing.ts");
    if (!catalogo || !pricing) {
      return {
        incluidoPorPlan: null,
        labels: null,
        motivo: "no pude leer lib/plan-catalogo.ts y/o lib/pricing.ts del ref publicado",
      };
    }
    return {
      incluidoPorPlan: incluidoPorPlanDelCatalogo(catalogo),
      labels: labelsDelProducto(pricing),
      motivo: null,
    };
  } catch (error) {
    return { incluidoPorPlan: null, labels: null, motivo: String(error?.message || error).slice(0, 200) };
  }
}
