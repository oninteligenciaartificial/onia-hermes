/**
 * frases_de_cola.mjs — reconstruye las FRASES de una cola en markdown con wrap duro.
 *
 * Extraido de `bloqueo_citado_vivo.mjs` el 2026-09-26, cuando `en_vuelo_vencido.mjs` necesito lo
 * mismo. No se copio: se movio. El wrap de estas colas es un problema de la COLA, no de lo que
 * cada gate busca adentro, y dos copias del mismo parser es garantizar que una de las dos vuelva
 * a medir renglones — que es el falso verde que lo origino (ver `frases()`).
 *
 * POR QUE ES UN MODULO Y NO UN IMPORT DEL HERMANO. Porque el hermano NO es importable: su bloque
 * `--self-check` termina en `process.exit`, y su CLI corre a nivel de modulo. Medido el
 * 2026-09-26: `en_vuelo_vencido.mjs --self-check` imprimio *"self-check: ok — 45 casos"*, que son
 * los casos DEL HERMANO — el self-check propio nunca corrio y el gate nuevo nacio en falso verde.
 * Un modulo con CLI al que alguien importa ejecuta el CLI del importado; este archivo no tiene.
 */

/**
 * Un renglon que ARRANCA bloque nuevo: nada se pega a traves de el. Renglon vacio, bullet,
 * item numerado, titulo, fila de tabla, cerca de codigo o cita. Sin esto, reconstruir frases
 * pegaria el final de un item con el principio del siguiente.
 */
const ABRE_BLOQUE = /^\s*$|^\s*[-*+]\s|^\s*\d+\.\s|^\s*#|^\s*\||^\s*```|^\s*>/;

/**
 * Cuantos renglones puede abarcar una frase antes de cerrarla por las malas. El wrap duro de
 * estas colas es de ~95 columnas, asi que una frase real entra en dos o tres renglones; el tope
 * existe para que una prosa sin puntuacion no acumule medio item en una sola ventana.
 */
const TOPE_RENGLONES = 6;

/**
 * UNA NOTA DE CORRECCION NO AFIRMA LO QUE CITA.
 *
 * Estas colas corrigen en el lugar, con la convencion de `CLAUDE.md`: se deja el texto viejo
 * entre comillas y al lado se explica por que estaba mal. Sin esta guarda, un gate muerde justo
 * la linea que arreglo el problema: le pide borrar la correccion para ponerse verde, o sea premia
 * que el sujeto se borre en vez de arreglarse.
 *
 * ⚠️ SU RIESGO, dicho de frente: suprime la frase ENTERA, asi que una nota de correccion que
 * ademas afirme algo nuevo y falso no se ve. Se acepta porque el lado barato de equivocarse es
 * este: una correccion fechada es legible para el que la lee, mientras que un gate que grita
 * sobre ella se apaga y deja de mirar todo lo demas.
 */
export const NOTA_DE_CORRECCION =
  /ac[aá] dec[ií]a|esto (?:es|era) historia|estaban? VENCID|vencidas?, corregido|corregido el \d|ya no es cierto|se corrigi[oó]|YA DESPLEGADO|YA ENTREGADO|[Ee]ntregado hoy al remoto|citaba/i;

/** Un renglon que ARRANCA un item de cola, abierto (`- [ ]`) o cerrado (`- [x]`). */
const ITEM = /^(\s*)- \[([ x])\]/;

/**
 * Devuelve el markdown con los items CERRADOS (`- [x]`) blanqueados, y todo lo demas intacto.
 *
 * POR QUE (medido el 2026-09-26 sobre las dos colas de este carril): `en_vuelo_vencido.mjs` daba
 * 7 sujetos y 6 eran falsos; CINCO vivian dentro de un item `- [x]`. Un item cerrado es historia
 * **por construccion** —su prosa cuenta lo que ya paso: "el commit estaba en vuelo", "no estaba
 * en ningun remoto"— y ninguna lista de palabras alcanza para distinguir ese pasado del presente,
 * porque el tiempo verbal no esta en las palabras, esta en el ESTADO DEL ITEM. Ese estado es un
 * dato que la cola ya escribe, gratis, en la casilla.
 *
 * Blanquea en vez de recortar para que el renglon reportado siga siendo el del ARCHIVO: en una
 * cola de 9.000 renglones, el numero de renglon es la mitad del arreglo. Y como el renglon vacio
 * es `ABRE_BLOQUE`, blanquear tambien corta las frases que cruzarian el borde del item.
 *
 * ⚠️ Un item ANIDADO abierto dentro de uno cerrado SI se mide: la casilla de adentro es la que
 * habla de ese trabajo. Por eso el item se cierra en el siguiente `- [` de cualquier nivel.
 */
export function sinHistoria(md) {
  const renglones = md.split(/\r?\n/);
  let dentroDeCerrado = false;
  return renglones
    .map((linea) => {
      const m = ITEM.exec(linea);
      if (m) dentroDeCerrado = m[2] === 'x';
      else if (/^#{1,6} |^---\s*$/.test(linea)) dentroDeCerrado = false;
      return dentroDeCerrado ? '' : linea;
    })
    .join('\n');
}

/**
 * Un TITULO que declara su seccion cerrada. Es el hermano de `sinHistoria()` un nivel arriba: lo
 * mismo que la casilla `- [x]` hace por un item, el `✅` / `CERRADO` del titulo lo hace por una
 * seccion entera.
 *
 * POR QUE HACE FALTA aunque ya exista `sinHistoria()` (medido el 2026-09-27 sobre `cola/chatbot.md`):
 * los items grandes de esta cola se cierran promoviendolos a `## ✅ T11 — CERRADO el …`, y su prosa
 * entera pasa a ser narracion en pasado SIN una sola casilla. Ahi vive, por ejemplo, *"El pedido
 * `t_94b9955d` (creado 02:46 UTC de hoy) listaba en su cuerpo los 5 archivos"* — cierto, fechado, y
 * sobre una tarea hoy archivada. Un gate que mire el presente y no sepa leer ese titulo acusa
 * historia fechada, y un gate que acusa historia se apaga.
 *
 * `🔴` NO cierra: es la marca de lo REABIERTO (`## 🔴 T10 — REABIERTO el …`), o sea lo mas vivo del
 * archivo. Se pregunta por el marcador, no por el numero del item.
 */
const TITULO_CERRADO = /^#{1,6} .*(?:✅|\bCERRAD[OA]\b)/;

/**
 * Devuelve el markdown con las SECCIONES cerradas blanqueadas, igual que `sinHistoria()` hace con
 * los items: se blanquea, no se recorta, para que el numero de renglon siga siendo el del archivo.
 *
 * Una seccion cerrada va desde su titulo hasta el proximo titulo de nivel igual o superior. Un
 * subtitulo mas profundo NO la reabre — sigue contando lo mismo.
 */
export function sinSeccionesCerradas(md) {
  let nivelCerrado = 0;
  return md
    .split(/\r?\n/)
    .map((linea) => {
      const m = /^(#{1,6}) /.exec(linea);
      if (m) {
        const nivel = m[1].length;
        if (nivelCerrado && nivel <= nivelCerrado) nivelCerrado = 0;
        if (!nivelCerrado && TITULO_CERRADO.test(linea)) nivelCerrado = nivel;
      }
      return nivelCerrado ? '' : linea;
    })
    .join('\n');
}

/**
 * ¿Este renglon CIERRA la frase? Se miran los adornos de markdown del final: `t_76cdb5dc`**
 * no cierra nada, y `(tarea `t_X`, depende de Sergio Urcullo).` si.
 */
export function cierraFrase(linea) {
  return /[.!?:;]$/.test(linea.replace(/[\s*_`)\]»”"']+$/u, ''));
}

/**
 * Reconstruye las FRASES de un markdown de wrap duro, con los renglones donde cae cada token.
 *
 * ⚠️ POR QUE EXISTE, y es el hueco mas caro que tuvo `bloqueo_citado_vivo.mjs`. Medir de a
 * renglones parecia gratis y no lo era: estas colas se escriben con wrap duro a ~95 columnas, asi
 * que una frase cualquiera cae partida en dos renglones — y con ella, el par que un gate necesita
 * ver JUNTO. Medido el 2026-09-26 en `cola/chatbot.md`:
 *
 *   1246  **Deploy:** el arreglo ... ya esta commiteado y espera el `ok` de Sergio
 *   1247  Urcullo en **`t_76cdb5dc`** ("Publicar el bot..."). No se creo un pedido nuevo.
 *
 * El lenguaje de freno esta en 1246 y el id en 1247. Ningun renglon tiene los dos, asi que
 * ninguna lista blanca de frases —por larga que sea— podia morderlo: no era una redaccion que
 * faltara, era la UNIDAD DE MEDIDA equivocada. La unidad de significado es la frase.
 *
 * Y la contracara es la que mantiene vivo al gate: la frase se corta en el terminador y en el
 * arranque de bloque, asi que "…espera el `ok`." seguido de "CERRADO en `t_X`" NO se pegan. Un
 * ensanche que griteara en falso sobre la historia fechada terminaria apagado.
 *
 * `patron` es OBLIGATORIO y sin default a proposito: cada gate busca un token distinto (ids del
 * tablero, shas) y un default silencioso haria que un llamador nuevo mida el token del otro y
 * salga verde por no encontrar nada.
 */
export function frases(md, patron) {
  if (!(patron instanceof RegExp) || !patron.global) {
    throw new TypeError('frases(md, patron): el patron es obligatorio y tiene que ser una RegExp con /g');
  }
  const salida = [];
  let actual = null;
  let bloque = 0;
  const cerrar = () => { if (actual) salida.push(actual); actual = null; };

  md.split(/\r?\n/).forEach((linea, i) => {
    if (ABRE_BLOQUE.test(linea)) { cerrar(); bloque++; }
    if (!linea.trim()) return;
    actual ??= { texto: '', ocurrencias: [], renglones: 0, bloque };
    actual.texto += (actual.texto ? ' ' : '') + linea.trim();
    actual.renglones++;
    for (const id of linea.match(patron) ?? []) actual.ocurrencias.push({ id, linea: i + 1 });
    if (cierraFrase(linea) || actual.renglones >= TOPE_RENGLONES) cerrar();
  });
  cerrar();
  return salida;
}
