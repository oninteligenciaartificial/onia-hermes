// ¿Lo que el servidor entregó es la PANTALLA que se pidió, o una página de error
// con su URL puesta?
//
// POR QUÉ EXISTE, con fecha (2026-09-17). `mirar_bandeja_dueno.mjs` es el
// instrumento canónico de «abrir y MIRAR» una pantalla del cliente — la regla que
// nació del login que mostró los NOMBRES de los iconos días enteros «verificado»
// con HTTP 200 y grep. Pidiéndole `/dev/shell` con sesión real imprimió:
//
//     URL final: https://app.onia.com.bo/dev/shell
//     respuestas >=400: ninguna
//
// y la captura era un 404 de cuerpo entero («ERROR 404 · Página no encontrada»).
// Esas dos líneas son exactamente las que un carril lee para concluir que la
// pantalla existe y está sana. El guard del script tampoco lo tapaba: compara
// PATHNAME contra PATHNAME y Next sirve el 404 en la MISMA URL que se pidió.
//
// Las DOS mitades hacen falta, y ninguna alcanza sola:
//
//  · El STATUS, que el script tiraba: `goto()` devuelve la respuesta del documento
//    principal, y el listener `page.on("response")` que ya había mide subrecursos
//    (nació para cazar un chunk 404, otro problema).
//  · El TEXTO, porque un `notFound()` que cae después de que empezó el stream llega
//    con el status ya enviado: la pantalla dice 404 y el HTTP dice 200. Preguntar
//    sólo por el status deja pasar justo ese caso.

/** Lo que una página de error propia grita, en el idioma en que lo grita. */
const MARCAS_DE_ERROR = [
  "página no encontrada",
  "pagina no encontrada",
  "error 404",
  "404: this page could not be found",
  "this page could not be found",
];

/**
 * @param {{status: number|null|undefined, textoVisible?: string|null}} medida
 *   `status` null = no se pudo leer (navegación same-document): eso es NO MEDIDO,
 *   nunca 200. Inventar un 200 es la falla que este módulo existe para impedir.
 * @returns {{sirve: boolean|null, motivo: string}}
 *   `sirve` null = no medido; el llamador sale 2, no 0.
 */
export function veredictoDePantalla({ status, textoVisible } = {}) {
  if (status === null || status === undefined) {
    return {
      sirve: null,
      motivo: "no se pudo leer el status del documento principal (navegación same-document)",
    };
  }
  if (typeof status !== "number" || !Number.isFinite(status)) {
    return { sirve: null, motivo: `status ilegible: ${JSON.stringify(status)}` };
  }
  if (status >= 400) {
    return { sirve: false, motivo: `el servidor contestó HTTP ${status}` };
  }

  // Soft 404: el status ya salió 200 y la pantalla igual es un error.
  const texto = (textoVisible ?? "").toLowerCase();
  const marca = MARCAS_DE_ERROR.find((m) => texto.includes(m));
  if (marca) {
    return {
      sirve: false,
      motivo: `HTTP ${status} pero la pantalla dice ${JSON.stringify(marca)}: es una página de error con la URL pedida`,
    };
  }

  return { sirve: true, motivo: `HTTP ${status}` };
}

export { MARCAS_DE_ERROR };
