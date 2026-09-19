// ---------------------------------------------------------------------------
// guion-del-bot.mjs
//
// El universo de sujetos que comparten los gates que auditan el TEXTO del guion.
//
// Vive afuera de los tests a proposito. Estaba adentro de `promesa-de-canal.test.mjs`,
// y donde VIVE un helper decide QUE puede medir: encerrado en un test, el gate
// siguiente que necesita el mismo universo lo re-escribe, las dos copias divergen y
// la que se queda vieja es la que deja pasar el texto nuevo.
// ---------------------------------------------------------------------------

/**
 * TODAS las entradas de texto del guion, derivadas del DISCO (el objeto publicado),
 * nunca una lista a mano de las que hoy sabemos rotas: una lista de inclusion falla
 * abierto justo en el texto que alguien escriba manana.
 *
 * Devuelve pares `[clave, texto]`. Las entradas que son arreglo de lineas se abren
 * en una entrada por linea (`M5[2]`) para que el rojo nombre el renglon exacto.
 */
export function entradasDelGuion(script) {
  return Object.entries(script ?? {})
    .flatMap(([clave, valor]) =>
      typeof valor === "string"
        ? [[clave, valor]]
        : Array.isArray(valor)
          ? valor.map((linea, i) => [`${clave}[${i}]`, String(linea)])
          : [],
    )
    .filter(([, texto]) => texto.length > 0);
}
