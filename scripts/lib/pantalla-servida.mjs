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

/**
 * La app terminó en otra ruta: ¿qué dice ESO, exactamente?
 *
 * POR QUÉ EXISTE, con fecha (2026-09-18). `mirar_bandeja_dueno.mjs` imprimía
 * «La sesión NO entró: se pidió /inbox y la app terminó en /profile» — y las dos
 * mitades de esa frase eran falsas de un modo caro:
 *
 *  · Tiraba la QUERY del destino, que es donde el producto PUBLICA la causa. El
 *    destino real era `/profile?mfa=obligatorio`: el propio redirect venía diciendo
 *    por qué. Medido ese día pidiendo `/inbox` con sesión del dueño.
 *  · Afirmaba «la sesión NO entró» para cualquier rebote. En la misma corrida
 *    `/api/me` contestó 200 con el perfil entero: la sesión entró perfecto, y el
 *    que leía esa línea se iba a buscar el bug a la emisión de la sesión — el
 *    lugar equivocado. Sin sesión el proxy manda a `/login`; que te mande a otro
 *    lado PRUEBA que ya te identificó.
 *
 * No hay catálogo de causas acá a propósito: la causa se lee del destino, no de
 * una lista que envejece. Un motivo nuevo del producto aparece solo.
 *
 * @param {{rutaPedida: string, urlFinal: string}} medida
 * @returns {{reboto: boolean, destino: string, causa: string, sesion: boolean|null, motivo: string}}
 *   `sesion` null = el destino no dice nada sobre la sesión (no hubo rebote).
 */
export function porQueRebote({ rutaPedida, urlFinal } = {}) {
  let url;
  try {
    url = new URL(urlFinal);
  } catch {
    return {
      reboto: false,
      destino: "",
      causa: "",
      sesion: null,
      motivo: `URL final ilegible: ${JSON.stringify(urlFinal)}`,
    };
  }
  const destino = `${url.pathname}${url.search}`;
  if (url.pathname === rutaPedida) {
    return { reboto: false, destino, causa: "", sesion: null, motivo: `la app se quedó en ${destino}` };
  }
  const causa = url.search.replace(/^\?/, "");
  // `/login` pelado es el destino de "no hay sesión". `/login/2fa` NO lo es: ahí la
  // sesión existe y le falta confirmar el segundo factor — meterlos en la misma
  // bolsa es el mismo error de grano grueso que este módulo vino a arreglar.
  const sinSesion = url.pathname === "/login";
  const motivo = sinSesion
    ? `la sesión NO entró: se pidió ${rutaPedida} y la app mandó al login (${destino})`
    : `la sesión entró pero la app REDIRIGIÓ: se pidió ${rutaPedida} y terminó en ${destino}` +
      (causa
        ? `. La causa la publica el propio destino: \`${causa}\` — se destraba cumpliendo eso, no tocando la sesión`
        : ". El destino no trae causa en la query: mirar qué guard redirige esa ruta");
  return { reboto: true, destino, causa, sesion: !sinSesion, motivo };
}

export { MARCAS_DE_ERROR };
