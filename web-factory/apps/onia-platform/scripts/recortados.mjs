/**
 * Qué falla declara una vista cuando encuentra texto recortado — y con qué
 * IDENTIDAD, que es la parte que importa.
 *
 * Vive en su propio archivo, y no dentro de `mirar-venta.mjs`, por el mismo
 * motivo que `rutas-de-venta.mjs`: ese script corre su medición en el
 * top-level, así que importarlo para probar esta decisión levantaría un
 * Chromium contra producción y un `process.exit()` que mata al proceso que lo
 * importó. Acá no hay efectos: son funciones puras con su test al lado.
 *
 * ⚠️ **HISTORIA, porque la regla sin ella se desobedece.** Hasta el 2026-09-17
 * `mirar-venta.mjs` declaraba UNA falla por vista y la nombraba con
 * `recortados[0].txt` — el PRIMERO de la lista. Medido ese día contra
 * producción: el informe registraba CINCO textos recortados en
 * `home @ tablet-768` («Contabilidad», «WhatsApp del negocio», «Para aprobar»,
 * «Recordar citas de mañana», «Avisar los pagos vencidos») y la línea que el
 * carril lee decía una sola: *"texto recortado — «Contabilidad»"*.
 *
 * Eso no es sólo un informe corto. La identidad de una falla es su `clave`
 * (`${id} | ${clase}`), y `--comparar-con` decide con ella la única pregunta
 * que este carril no puede contestar de otra forma: **¿producción está rota
 * porque el código está mal, o porque falta el deploy?** Con la clase pelada
 * `recortado`, los cinco textos de producción y el único que sobrevive en la
 * rama comparten clave, así que la comparación contesta *"esto sí es código"*
 * y manda a re-arreglar una cura que ya está escrita y verificada.
 *
 * Y la dirección simétrica, que es peor: un texto NUEVO que se empiece a
 * recortar en una vista que ya tenía uno no cambia ni la línea ni la clave.
 * El defecto nuevo nace invisible detrás del viejo.
 *
 * La regla que queda: **el sujeto es el TEXTO, no la vista.** Una falla por
 * texto recortado, con el texto dentro de la clave.
 */

/**
 * Cuántos textos recortados se nombran por vista.
 *
 * Hay tope porque la lista viaja al informe y de ahí a la consola, y una
 * pantalla con el CSS roto de verdad puede recortar decenas. Pero el tope
 * **habla**: lo que no entra se declara con su cuenta (ver `fallasDeRecortados`),
 * nunca se descarta en silencio. El `slice(0, 5)` mudo que esto reemplaza era
 * la otra mitad del mismo agujero — con seis textos recortados, el sexto no
 * existía para nadie.
 */
export const TOPE_RECORTADOS = 20;

/**
 * ¿Este elemento le está cortando texto **a una persona**?
 *
 * Es la decisión entera del detector, en un solo lugar y con test al lado. La
 * sonda de `mirar-venta.mjs` corre dentro del navegador (`page.evaluate`
 * serializa la función, así que no puede importar nada), y por eso le manda
 * esta función como FUENTE y la reconstruye allá: una sola implementación, no
 * dos que coinciden mientras la realidad les dé la razón a las dos.
 *
 * ⚠️ **HISTORIA, porque la regla sin ella se desobedece.** Medido el
 * 2026-09-17 contra producción: `npm run mirar:venta` devolvía **56 fallas y
 * 55 eran falsas**. Once textos × cinco vistas, todos con la misma firma —
 * `clientWidth: 1, clientHeight: 1, scrollWidth: 274, white-space: nowrap`—,
 * o sea los `span.srOnly` de la comparativa del home, el del configurador de
 * `/v1/chatbot` y el `<legend>` del asistente de `/v1/empezar`: texto que
 * existe para el LECTOR DE PANTALLA y que ningún lead ve nunca. Son un patrón
 * de accesibilidad correcto; no se van a "arreglar" jamás.
 *
 * El daño no es el informe largo: es que la única falla real de esa corrida
 * —un desborde horizontal de 13px en `/v1/funciones/facturacion-electronica-siat`
 * a 320px— entraba al carril enterrada entre 55 líneas de ruido, y un
 * instrumento que grita todas las vueltas se deja de mirar. Un gate con 98% de
 * falsos positivos es un gate apagado con cara de encendido.
 *
 * El criterio NO es la clase `.srOnly` (eso sería una lista de inclusión
 * pegada al CSS module, que falla abierto con el sr-only del archivo de al
 * lado — ya son tres, con tres hashes distintos). Es geométrico y lo decide la
 * realidad: **una caja de 1px no muestra texto**. Un recorte que le importa a
 * un lead ocurre en una caja de decenas de px.
 *
 * ⚠️ **Dirección simétrica que esto NO cubre, y queda nombrada:** un bloque
 * que un bug de layout colapse a 1px también sale de acá en silencio. Hoy
 * salía igual de invisible —se reportaba como "recortado", ahogado entre los
 * 55—, así que esto no pierde cobertura; pero *"el texto que debería verse y
 * no se ve"* es otra clase y le falta su gate.
 *
 * @param {{clientWidth: number, clientHeight: number, scrollWidth: number, overflow: string}} caja
 */
export function textoRecortadoALaVista(caja) {
  const { clientWidth, clientHeight, scrollWidth, overflow } = caja;
  // `overflow: visible` no corta nada: el texto se pinta afuera y se lee.
  if (overflow === "visible") return false;
  // Nadie lee un texto metido en una caja de 1px: es sr-only, no un recorte.
  if (clientWidth <= 1 || clientHeight <= 1) return false;
  // +2 de tolerancia: el subpíxel del layout no es un defecto.
  return scrollWidth > clientWidth + 2;
}

/** Clase (y por lo tanto identidad) de la falla de un texto recortado. */
export const claseDeRecortado = (txt) => `recortado: ${txt}`;

/** Clase de la falla que declara los que no entraron en el tope. */
export const claseDeSinNombrar = (cuantos) => `recortado: +${cuantos} sin nombrar`;

/**
 * Las fallas que declara una vista por texto recortado: UNA por texto.
 *
 * @param {string} id        `home @ tablet-768` — la vista, para el texto humano.
 * @param {{tag?: string, txt: string}[]} recortados  los textos que la sonda alcanzó a nombrar.
 * @param {number} [total]   cuántos había en total (puede ser mayor que el tope).
 * @returns {{clase: string, texto: string}[]}
 */
export function fallasDeRecortados(id, recortados = [], total) {
  const nombrados = recortados.filter((r) => r && typeof r.txt === "string" && r.txt.trim());
  if (!nombrados.length) return [];

  // Orden estable: la clave no puede depender del orden en que el DOM devolvió
  // los nodos. Dos corridas de la MISMA pantalla rota tienen que dar la misma
  // clave, o `--comparar-con` inventa fallas nuevas en cada vuelta.
  const textos = [...new Set(nombrados.map((r) => r.txt.trim()))].sort();

  const salida = textos.map((txt) => ({
    clase: claseDeRecortado(txt),
    texto: `${id}: texto recortado — "${txt}"`,
  }));

  // Lo que el tope dejó afuera se DICE. Un tope mudo convierte un sujeto en
  // nada; uno que habla deja el rojo puesto hasta que alguien lo mire.
  const cuantos = Math.max(0, (total ?? nombrados.length) - nombrados.length);
  if (cuantos > 0) {
    salida.push({
      clase: claseDeSinNombrar(cuantos),
      texto:
        `${id}: hay ${cuantos} texto(s) recortado(s) más que este barrido no nombró ` +
        `(tope ${TOPE_RECORTADOS}) — subí el tope para verlos`,
    });
  }
  return salida;
}
