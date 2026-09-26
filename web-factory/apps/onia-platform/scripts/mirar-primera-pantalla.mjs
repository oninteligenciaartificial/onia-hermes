/**
 * Saca la PRIMERA PANTALLA de las dos rutas que ve un lead, en escritorio y en
 * telefono, sobre el sitio buildeado. Existe porque el carril se verifica
 * MIRANDO, y las tres trampas de instrumento que ya nos costaron una vuelta
 * cada una estan tapadas aca:
 *
 *  1. chunk 404 -> la pagina sale en blanco y parece un bug del sitio. Se
 *     escucha `response` y cualquier >=400 sale en el informe (2026-09-03).
 *  2. scroll suave -> `scrollTo` ANIMA y la foto sale a mitad de camino. Se
 *     apaga `scroll-behavior` antes de mover nada (2026-09-03).
 *  3. Reveal -> el nodo que anima es el ABUELO del titulo, asi que mirar la
 *     opacidad del propio h1 da 1 con la pantalla todavia vacia. Se recorre la
 *     cadena de ancestros hasta body y se espera al MINIMO (2026-09-03/04).
 *
 * Y desde el 2026-09-05, la cuarta — que es la que hacia inutiles a las otras
 * tres: ESTO NO SALIA ROJO NUNCA. Media bien y no juzgaba. Ese dia imprimio
 * cuatro veces `!! 429 …/widget?website_token=…` —el chat de produccion caido en
 * las dos pantallas y en los dos tamanos— y salio con codigo 0. Un reporter no
 * es un gate: el defecto quedaba esperando que un humano leyera la salida.
 *
 * Lo veia SOLO este script, y por eso el arreglo va aca: el widget no es un
 * `<a href>` (no lo alcanzan `enlaces-vivos.mjs` ni el barrido de CTA), la
 * pagina responde 200 (no lo ve el chequeo de rutas) y no es un literal (no lo
 * tocan los tests de codigo fuente). Solo lo ve quien ABRE la pagina y escucha
 * lo que pide.
 *
 * El veredicto vive en `veredicto()`, que es pura y esta cubierta por
 * `mirar-primera-pantalla.test.ts`. Sale 0 si las pantallas pintaron y no
 * pidieron nada roto, y 1 si algo fallo — incluido el caso en que no llego a
 * medir: un recorrido cortado es instrumento roto, no sitio sano.
 *
 * Uso: node scripts/mirar-primera-pantalla.mjs [https://onia.com.bo]
 *      OUT_DIR=/tmp/x node scripts/mirar-primera-pantalla.mjs
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const PANTALLAS = [
  { id: "escritorio", width: 1366, height: 900 },
  { id: "telefono", width: 390, height: 844 },
];
const RUTAS = [
  { id: "portada", path: "/" },
  { id: "empezar", path: "/empezar" },
];

/**
 * Cuantas pantallas tiene que haber medido el recorrido para que el verde
 * signifique algo. Son las cuatro que declara mirar; menos que eso es un
 * recorrido cortado, y "ninguna pantalla fallo" sobre cero pantallas es el modo
 * en que esta familia de gates falla ABIERTO.
 */
export const MINIMO_PANTALLAS = PANTALLAS.length * RUTAS.length;

/**
 * El umbral con el que se JUZGA que el titulo llego a pintarse.
 */
export const OPACIDAD_PINTADA = 0.99;

/**
 * El valor al que se ESPERA antes de medir, y que NO es el que juzga.
 *
 * Esperar al umbral del veredicto parece prolijo y es justo el bug: la curva
 * real del reveal de `/empezar` es `0.989 @5ms -> 0.997 @128ms -> 1 @250ms`,
 * asi que `>= 0.99` se cumple a los 5 ms y se mide con la animacion todavia
 * corriendo. Que el valor caiga arriba o abajo del umbral es una moneda al
 * aire, y de ahi salia el rojo intermitente de `telefono /empezar`.
 *
 * Se espera al FIN y se juzga con `OPACIDAD_PINTADA`: el hueco entre los dos
 * es la tolerancia. Una pantalla que de verdad no pinta no se cuela, porque la
 * espera vence a los 8 s y el veredicto la juzga con el valor en que quedo.
 */
export const OPACIDAD_TERMINADA = 1;

/**
 * El predicado con el que `waitForFunction` espera el fin del reveal.
 *
 * Es una FUNCION y no una cadena a proposito. `waitForFunction` con cadena la
 * evalua DENTRO de la pagina con `eval`, y la CSP que la landing estreno el
 * 24-sep no permite 'unsafe-eval' (la de produccion es la misma): la espera
 * moria en 18 ms con `EvalError`, el `catch` se la tragaba muda y la linea
 * siguiente media a mitad del reveal. Con una funcion de verdad Playwright no
 * usa `eval` y la espera retiene — medido: 160-175 ms y opacidad 1, tres de
 * tres. `leer` solo se inyecta desde el test; en la pagina llega `undefined`.
 */
export const REVEAL_TERMINADO = ({ sel, hasta, leer }) => {
  const medir =
    leer ||
    ((s) => {
      const el = document.querySelector(s);
      if (!el) return -1;
      let min = 1;
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const o = parseFloat(getComputedStyle(n).opacity);
        if (!Number.isNaN(o) && o < min) min = o;
      }
      return min;
    });
  return medir(sel) >= hasta;
};

/**
 * El unico estado que este instrumento NO puede atribuir, y por que.
 *
 * 429 significa literalmente "estas preguntando demasiado seguido". Este script
 * abre cuatro pantallas, asi que le pega cuatro veces a cada recurso de la
 * pagina — es, por construccion, un violador de limites de frecuencia. Medido el
 * 2026-09-05 contra el widget de Chatwoot: corta al CUARTO pedido por IP
 * (`1:200 2:200 3:200 4:429 …`) y no se suelta ni esperando cuatro minutos, asi
 * que dos corridas seguidas se apilan y la segunda arranca ya castigada.
 *
 * Se probo reintentar con espera y no alcanza: la ventana dura mas de lo que
 * ningun gate puede esperar sin volverse inutil. Entonces, sobre un tercero, un
 * 429 sale como AVISO y NO como rojo — no porque no importe, sino porque este
 * instrumento no puede distinguir "el servicio esta caido" de "lo tumbe yo", y
 * un gate que grita sin poder distinguir es el vigia al que Sergio dejo de
 * creerle, con razon.
 *
 * Sobre nuestro PROPIO origen no hay tal duda: los limites de onia.com.bo los
 * ponemos nosotros, y que nuestro sitio nos frene a las cuatro visitas es un
 * defecto de verdad. Ahi el 429 sale rojo como cualquier otro.
 */
export const ESTADO_DE_LIMITE = 429;

/**
 * Cuanto puede separarse el punto verde del rotulo de su etiqueta, medido en
 * multiplos del tamano de fuente DEL ROTULO (no en px: el rotulo es 0.8em del
 * bloque y cambia entre pantallas).
 *
 * El CSS pide `0.6em` de separacion. El tope es el doble, asi que un cambio de
 * espaciado razonable no pinta rojo y el defecto real —44 px sobre una fuente
 * de 12,8 px, o sea 3.4em— queda muy afuera.
 *
 * POR QUE EXISTE. La portada centra su rotulo, y el punto era un `::before`,
 * o sea un item flex hermano del texto: cuando "UN SOLO SISTEMA PARA TODO EL
 * NEGOCIO" parte en dos lineas en telefono, el texto se centraba dentro de su
 * caja y el punto se quedaba contra el borde izquierdo, a 44 px de su propia
 * etiqueta, en la primera pantalla que ve un lead. Un `::before` no tiene caja
 * consultable, asi que esto no lo podia medir NINGUN gate: el mismo rotulo ya
 * se habia arreglado antes en el eje vertical, y las dos veces lo encontro un
 * ojo. Por eso el punto es hoy un `<span data-kicker-dot>`.
 */
export const SEPARACION_MAXIMA_DEL_PUNTO = 1.2;

/**
 * Cuanto puede quedar VACIO dentro de la tarjeta dibujada, como fraccion de su
 * alto util (el alto menos su propio padding). Cero seria absurdo —los `gap`
 * declarados entre cabecera, cuerpo y remate son aire a proposito—, asi que el
 * tope deja pasar el espaciado normal y corta el hueco estructural.
 *
 * POR QUE EXISTE. Medido el 2026-09-26 contra produccion (Chromium 1440x900 y
 * 1920x1080, animaciones apagadas), el MISMO panel «Tu cuenta» en las dos
 * pantallas que ve un lead:
 *
 *   onia.com.bo/          3 pastillas · grid de  74px · contenido == caja
 *   onia.com.bo/empezar   4 pastillas · grid de 222px · 68px de pastillas
 *
 * En `/empezar` la tarjeta medía 347px para 193px de contenido: 154px de vacio
 * partidos en DOS bandas de 77px, una bajo el titulo y otra sobre el remate. La
 * ultima pantalla antes de registrarse dibujaba su unico mock de producto como
 * una tarjeta a medio cargar.
 *
 * LA CAUSA. El mat (`.shape`) conserva `aspect-ratio: 4/3` en escritorio —es la
 * forma de la columna— y la tarjeta blanca, al ser item de ese grid, se ESTIRA
 * para llenarlo. Mientras la lista de modulos era larga no sobraba nada; se
 * achico dos veces este mes por motivos correctos («Facturacion» salio porque la
 * homologacion sigue en tramite, «Inventario» porque servicios profesionales no
 * tiene esa pantalla) y el hueco aparecio sin que nadie tocara el layout. En
 * telefono no se veia porque ahi el ratio se suelta y el mat crece con el panel.
 *
 * POR QUE NINGUN GATE LO VEIA, que es lo que hace nueva a esta clase. El gate
 * hermano `grilla-que-crece-no-reparte.test.ts` (2026-09-25) curo la mitad de
 * esto —que el cuerpo REPARTIERA sus filas por el alto sobrante— y escribio su
 * propio limite: «esto mira el CSS, no la pantalla; una caja que reciba alto de
 * mas por otro camino no es sujeto de nadie aca». El alto de mas venia por ese
 * otro camino: el ratio del padre. Y este script abria las dos pantallas desde
 * semanas antes, pero solo preguntaba si PINTABAN, no si lo pintado llenaba su
 * caja. Un hueco estructural no rompe nada medible: no hay pedido fallido, no
 * hay opacidad baja, no hay monto fuera de fuente. Solo se ve mirando.
 *
 * El tope es 0.18: el caso sano de la portada mide ~0.10 (los dos `gap` de
 * 0.8em sobre una tarjeta corta) y el defecto medido 0.44.
 */
export const HUECO_MAXIMO_DE_LA_TARJETA = 0.18;

/** Si el recurso sale del mismo origen que la pagina que estamos mirando. */
export function esNuestro(url, base) {
  try {
    return new URL(url).origin === new URL(base).origin;
  } catch {
    return false;
  }
}

/**
 * La regla, aparte para poder probarla: que cuenta como defecto de la pantalla.
 */
export function esDefecto(fallida, base) {
  if (fallida.status !== ESTADO_DE_LIMITE) return true;
  return esNuestro(fallida.url, base);
}

/**
 * Si la base es un servidor de esta maquina. Importa para UNA cosa: contra un
 * `next start` local lo que se mide ES el arbol, asi que el build vivo no puede
 * estar atrasado y nombrar el deploy mandaria al lugar equivocado.
 *
 * Se pregunta por el host y no por "empieza con http://": un dominio servido
 * por HTTP sigue siendo remoto.
 */
export function esBaseLocal(base) {
  try {
    const h = new URL(base).hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]";
  } catch {
    return false;
  }
}

/**
 * La base se valida en vez de tomarse cruda de `argv[2]`, porque asi
 * `mirar-primera-pantalla.mjs --out=/tmp/x` tomaba la BANDERA como URL. Y el
 * defecto por defecto era peor: sin argumento apuntaba a `127.0.0.1:3111`, que
 * es justo el `next start` local que el 2026-09-04 sirvio un build viejo sin
 * avisar. Un script cuyo trabajo es mirar produccion mira produccion por
 * defecto; el servidor local se pide a mano.
 */
export function baseValida(arg) {
  if (arg === undefined || arg === "") return "https://onia.com.bo";
  let url;
  try {
    url = new URL(arg);
  } catch {
    throw new Error(
      `Base invalida: ${JSON.stringify(arg)}. Se espera una URL http(s), p. ej. https://onia.com.bo`,
    );
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Base invalida: ${arg} no es http(s).`);
  }
  return arg.replace(/\/$/, "");
}

/**
 * El juicio, separado de la medicion para poder probarlo sin navegador ni red.
 * Devuelve `{ codigo, lineas }` con la MISMA convencion que el resto de los
 * gates del carril: 0 verde, 1 rojo.
 */
export function veredicto(informe, base = "https://onia.com.bo", { arreglosVarados } = {}) {
  const lineas = [];
  let codigo = 0;
  // Se separa el defecto DEL SITIO (lo que el lead ve) del defecto DEL
  // INSTRUMENTO (este script dejo de medir). Solo el primero puede venir de un
  // build viejo; decirle al segundo "esperá el deploy" seria mandar a esperar
  // un arreglo que nadie escribio.
  let defectoDeSitio = false;

  for (const r of informe) {
    lineas.push(
      `${r.pantalla.padEnd(10)} ${r.ruta.padEnd(10)} opacidad=${r.opacidadH1} 4xx/5xx=${r.fallidas.length} punto=${r.kicker ? (r.kicker.medible ? `${r.kicker.dx}px` : "sin caja") : "sin rotulo"} tarjetas=${(r.tarjetas ?? []).map((t) => `${Math.round(t.fraccion * 100)}%`).join(",") || "ninguna"} resalte=${(r.resaltes ?? []).map((e) => (e.medible ? `${e.renglones}reng` : "sin caja")).join(",") || "ninguno"} h1="${r.h1}"`,
    );
    for (const f of r.fallidas) {
      const marca = esDefecto(f, base) ? "" : "  (limite de un tercero, no atribuible)";
      lineas.push(`   !! ${f.status} ${f.url}${marca}`);
    }
  }

  // Un recurso que no carga es un defecto de la pantalla, sea nuestro o de un
  // tercero: el lead ve lo mismo en los dos casos. No hay lista de perdonados
  // —una lista de inclusion es como estos gates fallan abiertos—; si algun dia
  // hace falta exceptuar algo, se nombra aca, a la vista.
  //
  // Lo unico que se descuenta es lo que este instrumento no puede atribuir: el
  // 429 de un tercero, que este script se provoca solo abriendo cuatro
  // pantallas. Ver `ESTADO_DE_LIMITE` para la medicion y el porque.
  const conDefecto = informe.filter((r) => r.fallidas.some((f) => esDefecto(f, base)));
  const noAtribuibles = informe.flatMap((r) => r.fallidas.filter((f) => !esDefecto(f, base)));
  if (conDefecto.length > 0) {
    codigo = 1;
    defectoDeSitio = true;
    lineas.push(
      "",
      `ROJO: ${conDefecto.length} de ${informe.length} pantallas cargaron con un recurso roto.`,
      "  El lead abre la pagina y algo que le prometimos no esta.",
    );
  }
  // No se calla lo que no supo clasificar: quedarse mudo es la otra forma de
  // fallar abierto.
  if (noAtribuibles.length > 0) {
    lineas.push(
      "",
      `AVISO: ${noAtribuibles.length} pedidos toparon el limite de frecuencia de un tercero.`,
      "  Este barrido pide 4 veces lo que un lead pide 1, asi que no se le puede",
      "  atribuir al sitio. Para saber si un lead lo ve, pedirlo en frio:",
      ...[...new Set(noAtribuibles.map((f) => `  curl -o /dev/null -w '%{http_code}\\n' '${f.url}'`))],
    );
  }

  // El punto del rotulo, pegado a su etiqueta. Ver SEPARACION_MAXIMA_DEL_PUNTO.
  // Tres estados y no dos, a proposito: "no pude medirlo" no es "esta bien".
  const puntoLejos = informe.filter(
    (r) => r.kicker?.medible && r.kicker.dx > r.kicker.fontSize * SEPARACION_MAXIMA_DEL_PUNTO,
  );
  if (puntoLejos.length > 0) {
    codigo = 1;
    defectoDeSitio = true;
    lineas.push(
      "",
      `ROJO: en ${puntoLejos.length} pantallas el punto del rotulo quedo suelto, lejos de su etiqueta.`,
      ...puntoLejos.map(
        (r) =>
          `  ${r.pantalla} ${r.ruta} -> ${r.kicker.dx} px de hueco (tope ${Math.round(r.kicker.fontSize * SEPARACION_MAXIMA_DEL_PUNTO)} px) en "${r.kicker.texto}"`,
      ),
    );
  }

  // `null` es "esta pantalla no tiene rotulo" y se acepta; `undefined` es "no
  // se pregunto", que es como esta familia de gates falla abierto: el campo se
  // cae de la medicion y el juicio sigue dando verde sobre un dato que no
  // existe. Por eso se separan.
  const sinPreguntar = informe.filter((r) => r.kicker === undefined);
  if (sinPreguntar.length > 0) {
    codigo = 1;
    lineas.push(
      "",
      `ROJO: ${sinPreguntar.length} pantallas llegaron sin la medicion del rotulo.`,
      "  No es el sitio: es este instrumento, que dejo de preguntar y seguiria",
      "  dando verde sobre un dato que no tomo.",
    );
  }

  const sinMedirPunto = informe.filter((r) => r.kicker && r.kicker.medible === false);
  if (sinMedirPunto.length > 0 && codigo === 0) codigo = 2;
  if (sinMedirPunto.length > 0) {
    lineas.push(
      "",
      `NO MEDIDO: en ${sinMedirPunto.length} pantallas no hay punto con caja que medir.`,
      "  La causa esperada es que ahi corre un build anterior al 2026-09-24, donde el",
      "  punto era un `::before` y `getBoundingClientRect` no lo alcanza. Para",
      "  distinguirlo de un rotulo roto, mirar si el punto esta pintado en la captura:",
      ...sinMedirPunto.map((r) => `  ${r.pantalla} ${r.ruta} -> ${r.archivo}`),
    );
  }

  // La tarjeta dibujada es el UNICO mock de producto de estas pantallas (cero
  // <img>, cero capturas: la regla del 2026-09-01). Si se lee a medio llenar, el
  // lead no ve un panel: ve algo que no cargo. Ver HUECO_MAXIMO_DE_LA_TARJETA.
  const conHueco = informe.flatMap((r) =>
    (r.tarjetas ?? [])
      .filter((t) => t.fraccion > HUECO_MAXIMO_DE_LA_TARJETA)
      .map((t) => ({ ...t, pantalla: r.pantalla, ruta: r.ruta, archivo: r.archivo })),
  );
  if (conHueco.length > 0) {
    codigo = 1;
    defectoDeSitio = true;
    lineas.push(
      "",
      `ROJO: ${conHueco.length} tarjeta(s) dibujada(s) quedaron a medio llenar (hueco > ${Math.round(HUECO_MAXIMO_DE_LA_TARJETA * 100)}% del alto util).`,
      ...conHueco.map(
        (t) =>
          `  ${t.pantalla} ${t.ruta} -> ${t.hueco}px de ${t.util}px vacios (${Math.round(t.fraccion * 100)}%) en "${t.rotulo}" — ${t.archivo}`,
      ),
      "  El mock es lo unico que ese lead ve del producto: medio vacio se lee como",
      "  una pantalla que no termino de cargar.",
    );
  }

  // Un selector que deja de encontrar sujetos es como esta familia falla en
  // verde: si NINGUNA pantalla trajo tarjeta, no se midio nada.
  const conTarjeta = informe.filter((r) => (r.tarjetas ?? []).length > 0);
  if (informe.length > 0 && conTarjeta.length === 0) {
    codigo = 1;
    lineas.push(
      "",
      "ROJO: ninguna de las pantallas trajo una tarjeta dibujada que medir.",
      "  No es el sitio: es este instrumento. `[role=img][class*=panel]` dejo de",
      "  encontrar sujetos y el juicio seguiria dando verde sin haber medido.",
    );
  }

  // El resalte del titular, entero en un renglon. Ver RESALTE_DEL_TITULAR.
  const resaltePartido = informe.flatMap((r) =>
    (r.resaltes ?? [])
      .filter((e) => e.medible && e.renglones > 1)
      .map((e) => ({ ...e, pantalla: r.pantalla, ruta: r.ruta, archivo: r.archivo })),
  );
  if (resaltePartido.length > 0) {
    codigo = 1;
    defectoDeSitio = true;
    lineas.push(
      "",
      `ROJO: en ${resaltePartido.length} pantalla(s) el resalte del titular quedo partido en dos renglones.`,
      ...resaltePartido.map(
        (e) =>
          `  ${e.pantalla} ${e.ruta} -> "${e.texto}" cae en ${e.renglones} renglones — ${e.archivo}`,
      ),
      "  El verde marca la promesa: partido al medio, el lead lee dos pedazos que",
      "  no forman una frase.",
    );
  }

  // Mismo motivo que en las tarjetas: un selector que deja de encontrar sujetos
  // es como esta familia falla EN VERDE. Estas dos pantallas resaltan algo en su
  // titular; ninguna medicion de resalte significa que dejo de preguntarse.
  const sinResalte = informe.filter((r) => r.resaltes === undefined);
  if (sinResalte.length > 0) {
    codigo = 1;
    lineas.push(
      "",
      `ROJO: ${sinResalte.length} pantallas llegaron sin la medicion del resalte del titular.`,
      "  No es el sitio: es este instrumento, que dejo de preguntar.",
    );
  }
  const sinMedirResalte = informe.flatMap((r) =>
    (r.resaltes ?? [])
      .filter((e) => e.medible === false)
      .map((e) => `  ${r.pantalla} ${r.ruta} -> "${e.texto}" sin caja que medir`),
  );
  if (sinMedirResalte.length > 0) {
    if (codigo === 0) codigo = 2;
    lineas.push("", "NO MEDIDO: hay resaltes sin caja que medir.", ...sinMedirResalte);
  }

  const sinPintar = informe.filter((r) => !(r.opacidadH1 >= OPACIDAD_PINTADA));
  if (sinPintar.length > 0) {
    codigo = 1;
    defectoDeSitio = true;
    lineas.push(
      "",
      `ROJO: ${sinPintar.length} pantallas no llegaron a pintar el titulo (opacidad < ${OPACIDAD_PINTADA}).`,
      ...sinPintar.map((r) => `  ${r.pantalla} ${r.ruta} -> opacidad=${r.opacidadH1}`),
    );
  }

  if (informe.length < MINIMO_PANTALLAS) {
    codigo = 1;
    lineas.push(
      "",
      `ROJO: se midieron ${informe.length} pantallas y se esperaban ${MINIMO_PANTALLAS}.`,
      "  Un recorrido cortado es instrumento roto, no sitio sano.",
    );
  }

  // Un defecto visto en produccion tiene DOS causas que se arreglan en lugares
  // OPUESTOS: el codigo esta mal, o produccion corre un build viejo. Este gate
  // mira las dos igual, asi que sin esto su rojo nombra una sola —el layout— y
  // manda a re-abrir un CSS que puede estar ya arreglado.
  //
  // Paso el 2026-09-26: el rojo de las dos tarjetas a medio llenar (`/` 22%,
  // `/empezar` 69%) era CIERTO (el lead lo veia) y su explicacion FALSA: el
  // commit 36228167 ya las habia cerrado y estaba en origin/main; el publicador
  // habia corrido veinte minutos antes de ese commit. Buildeando el arbol y
  // midiendo contra localhost, el mismo gate dio 4% y 4%.
  //
  // Por eso no se toca el codigo de salida —el lead lo ve igual— y si el texto:
  // un rojo por el motivo equivocado es un verde futuro.
  if (defectoDeSitio && !esBaseLocal(base)) {
    if (arreglosVarados === null || arreglosVarados === undefined) {
      lineas.push(
        "",
        "NO MEDIDO: no pude preguntar cuantos arreglos quedaron sin llegar al build vivo.",
        "  Eso NO es 'produccion esta al dia': puede que este rojo ya este arreglado",
        "  en el arbol. Antes de tocar el layout, medir las dos causas por separado:",
        `    npm run deploy:vivo`,
      );
    } else if (arreglosVarados > 0) {
      lineas.push(
        "",
        `OJO: ${arreglosVarados} arreglo(s) varado(s) — el build vivo es anterior a ellos.`,
        "  Este rojo puede ser de los DOS lados: el codigo, o un build viejo. Antes de",
        "  tocar el layout, medir el ARBOL (si ahi sale verde, lo que falta es el deploy):",
        "    npm run build && npx next start -p 3311 &",
        "    node scripts/mirar-primera-pantalla.mjs http://localhost:3311",
      );
    }
  }

  if (codigo === 0) {
    lineas.push(
      "",
      `Las ${informe.length} pantallas pintaron, no pidieron nada roto y el punto de los ${informe.filter((r) => r.kicker?.medible).length} rotulos esta pegado a su etiqueta. Las capturas siguen necesitando ojo.`,
    );
  }
  return { codigo, lineas };
}

/**
 * La distancia horizontal entre el punto del rotulo y la primera linea de su
 * etiqueta. Se agarra de `data-kicker`, no de la clase: el hash de CSS Modules
 * cambia en cada build.
 *
 * Devuelve `null` si la pantalla no tiene rotulo, y `{medible:false}` si lo
 * tiene pero sin punto consultable (el `::before` de los builds viejos). Los
 * dos casos los separa `veredicto`: uno no se juzga, el otro sale NO MEDIDO.
 */
const PUNTO_DEL_ROTULO = `() => {
  const p = document.querySelector('[data-kicker]');
  if (!p) return null;
  const punto = p.querySelector('[data-kicker-dot]');
  const texto = (p.innerText || '').replace(/\\s+/g, ' ').trim();
  const fontSize = parseFloat(getComputedStyle(p).fontSize);
  if (!punto) return { medible: false, texto, fontSize };
  const nodos = [...p.childNodes].filter((n) => n !== punto);
  if (nodos.length === 0) return { medible: false, texto, fontSize };
  const rango = document.createRange();
  rango.setStartBefore(nodos[0]);
  rango.setEndAfter(nodos[nodos.length - 1]);
  const lineas = [...rango.getClientRects()].filter((r) => r.width > 0);
  if (lineas.length === 0) return { medible: false, texto, fontSize };
  const caja = punto.getBoundingClientRect();
  return {
    medible: true,
    texto,
    fontSize,
    lineas: lineas.length,
    dx: Math.round((lineas[0].left - caja.right) * 10) / 10,
  };
}`;

/**
 * Cuanto de cada tarjeta dibujada quedo VACIO. Se agarra de `role="img"`, que es
 * lo que declara `PanelDibujado`, y no de la clase: el hash de CSS Modules
 * cambia en cada build.
 *
 * Devuelve `[]` si la pantalla no dibuja ninguna tarjeta —hay rutas que no
 * tienen mock— y eso NO es verde ni rojo: `veredicto` exige que al menos una de
 * las pantallas barridas haya tenido tarjeta que medir, porque un selector que
 * deja de encontrar sujetos es como esta familia de gates falla en verde.
 *
 * El hueco se mide contra el alto UTIL (sin el padding propio de la tarjeta) y
 * el contenido es el tramo del primer hijo al ultimo: lo que sobra es hueco
 * estructural, no espaciado.
 */
const TARJETAS_DIBUJADAS = `() => {
  // El hueco NO esta necesariamente entre los hijos de la tarjeta: el cuerpo que
  // CRECE (\`flex: 1 1 auto\`) se come el alto sobrante y el vacio queda adentro
  // suyo. Medido el 2026-09-26 en /empezar: los tres hijos de la tarjeta llenaban
  // sus 308px utiles al milimetro mientras el grid del medio media 222px para
  // 68px de pastillas. Mirar solo el primer nivel daba 0% sobre el defecto — o
  // sea, verde. Por eso se recorre la tarjeta Y sus cajas de contenido, y se
  // reporta la PEOR.
  const medirCaja = (el) => {
    const hijos = [...el.children].filter((c) => c.getBoundingClientRect().height > 0);
    if (hijos.length === 0) return null;
    const caja = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const util = caja.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (!(util > 1)) return null;
    const arriba = Math.min(...hijos.map((c) => c.getBoundingClientRect().top));
    const abajo = Math.max(...hijos.map((c) => c.getBoundingClientRect().bottom));
    const contenido = abajo - arriba;
    return {
      util: Math.round(util),
      contenido: Math.round(contenido),
      hueco: Math.round((util - contenido) * 10) / 10,
      fraccion: Math.round(((util - contenido) / util) * 1000) / 1000,
    };
  };
  const out = [];
  for (const card of document.querySelectorAll('[role="img"][class*="panel"]')) {
    const cajas = [card, ...card.children]
      .map((el) => {
        const m = medirCaja(el);
        return m && { ...m, caja: el === card ? 'tarjeta' : (el.className || el.tagName).toString().replace(/sitio_|__[A-Za-z0-9_-]+/g, '').trim() };
      })
      .filter(Boolean);
    if (cajas.length === 0) continue;
    const peor = cajas.reduce((a, b) => (b.fraccion > a.fraccion ? b : a));
    out.push({
      rotulo: (card.getAttribute('aria-label') || '').slice(0, 48),
      alto: Math.round(card.getBoundingClientRect().height),
      ...peor,
    });
  }
  return out;
}`;

/**
 * En cuantos RENGLONES cae el resalte del titular.
 *
 * El titular de estas dos pantallas resalta una frase en verde (`<em>`), y esa
 * frase es la promesa: "usalo <em>de verdad</em> 14 dias". Cuando el salto de
 * linea cae ADENTRO del resalte, el lead no lee una frase pintada: lee "y usalo
 * de" y abajo "verdad 14 dias", con el verde partido en dos pedazos que no
 * forman nada. Lo vio el ojo el 2026-09-26 en las DOS vistas de `/empezar`.
 *
 * Se mide con `getClientRects()`, que devuelve UNA caja por renglon ocupado:
 * es el unico dato que distingue "entra justo" de "se partio", y ningun grep
 * del HTML lo ve —el markup es identico en los dos casos, lo decide el ancho
 * del renglon en el navegador—. Por eso vive aca y no en un test de fuente.
 *
 * Los `top` se agrupan con tolerancia: dentro de un mismo renglon los rects de
 * un inline pueden diferir por decimas de pixel, y contar eso como dos lineas
 * seria un rojo falso permanente.
 */
const RESALTE_DEL_TITULAR = `() => {
  const h1 = document.querySelector('h1');
  if (!h1) return null;
  const out = [];
  for (const em of h1.querySelectorAll('em')) {
    const texto = (em.innerText || em.textContent || '').replace(/\\s+/g, ' ').trim();
    const cajas = [...em.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
    if (cajas.length === 0) { out.push({ texto, medible: false }); continue; }
    const renglones = [];
    for (const r of cajas) {
      if (!renglones.some((t) => Math.abs(t - r.top) <= 2)) renglones.push(r.top);
    }
    out.push({ texto, medible: true, renglones: renglones.length });
  }
  return out;
}`;

/**
 * La opacidad EFECTIVA de un elemento: el minimo de su cadena hasta body.
 * Devuelve -1 si el selector no encontro nada, que el veredicto lee como rojo.
 * Es una funcion, como `REVEAL_TERMINADO`, por el mismo motivo.
 */
const REVEAL_MEDIDO = ({ sel }) => {
  const el = document.querySelector(sel);
  if (!el) return -1;
  let min = 1;
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const o = parseFloat(getComputedStyle(n).opacity);
    if (!Number.isNaN(o) && o < min) min = o;
  }
  return min;
};

async function mirar(base, out) {
  const require = createRequire("/root/.npm/_npx/e41f203b7505f1fb/");
  const { chromium } = require(
    "/root/.npm/_npx/e41f203b7505f1fb/node_modules/playwright",
  );

  mkdirSync(out, { recursive: true });

  /*
   * El Chromium se nombra a mano: el playwright que resuelve el `require` de
   * arriba pide la revision 1243 y el nodo tiene bajada la 1228, asi que
   * `launch()` a secas muere con "Executable doesn't exist" — un fallo de
   * INSTRUMENTO con la misma cara que un sitio caido.
   */
  const CHROME =
    process.env.CHROME_PATH ||
    "/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome";
  const navegador = await chromium.launch({ executablePath: CHROME });
  const informe = [];

  for (const pantalla of PANTALLAS) {
    // reducedMotion: una captura tomada a mitad de animacion congela un frame
    // que el cliente nunca ve —numeros a medio contar incluidos—. Ver
    // scripts/navegador-sin-animacion.test.ts (Bs 364 fantasma, 2026-09-12).
    const contexto = await navegador.newContext({
      viewport: { width: pantalla.width, height: pantalla.height },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    for (const ruta of RUTAS) {
      const pagina = await contexto.newPage();
      const fallidas = [];
      pagina.on("response", (r) => {
        if (r.status() >= 400) {
          fallidas.push({ status: r.status(), url: r.url() });
        }
      });
      await pagina.goto(base + ruta.path, { waitUntil: "networkidle" });
      // 2 — que scrollTo salte en vez de animar (no scrolleamos, pero el sitio si)
      await pagina.addStyleTag({
        content: "html{scroll-behavior:auto !important}",
      });
      // 3 — esperar a que el Reveal del titulo TERMINE, mirando sus ancestros
      let opacidad = -1;
      try {
        await pagina.waitForFunction(
          REVEAL_TERMINADO,
          { sel: "h1", hasta: OPACIDAD_TERMINADA },
          { timeout: 8000 },
        );
      } catch (e) {
        /*
         * Que VENZA es un resultado: la pantalla no llego a pintar y el
         * veredicto la juzga abajo con el valor en que quedo (falla cerrado).
         * Cualquier OTRO error es el instrumento roto, y no puede salir mudo:
         * el `catch` pelado que habia aca hizo que un `EvalError` de la CSP
         * se leyera durante dias como "la espera vencio".
         */
        if (!/Timeout.*exceeded/i.test(String(e?.message ?? e))) throw e;
      }
      opacidad = await pagina.evaluate(REVEAL_MEDIDO, { sel: "h1" });

      const archivo = `${out}/${ruta.id}-${pantalla.id}.png`;
      await pagina.screenshot({ path: archivo });
      const kicker = await pagina.evaluate(`(${PUNTO_DEL_ROTULO})()`);
      const tarjetas = await pagina.evaluate(`(${TARJETAS_DIBUJADAS})()`);
      const resaltes = await pagina.evaluate(`(${RESALTE_DEL_TITULAR})()`);
      const h1 = await pagina
        .locator("h1")
        .first()
        .innerText()
        .catch(() => "(sin h1)");
      informe.push({
        ruta: ruta.path,
        pantalla: pantalla.id,
        archivo,
        h1: h1.replace(/\s+/g, " ").trim(),
        opacidadH1: opacidad,
        kicker,
        tarjetas,
        resaltes,
        fallidas,
      });
      // El barrido HABLA mientras barre. Mudo no se distingue de colgado, y un
      // barrido que se mata deja la pantalla SIN MIRAR con la linea `OBJETIVO:`
      // igual de verde. Ver scripts/barrido-que-habla.test.ts (2026-09-25).
      process.stderr.write(
        `[${pantalla.id}] ${ruta.path} — h1 "${h1.replace(/\s+/g, " ").trim().slice(0, 40)}"` +
          `${fallidas.length ? ` · ${fallidas.length} pedido(s) fallido(s)` : ""}\n`,
      );
      await pagina.close();
    }
    await contexto.close();
  }

  await navegador.close();
  return informe;
}

/**
 * Cuantos arreglos de la zona ya estan en `origin/main` y todavia NO llegaron al
 * build que sirve produccion. Es el dato que le falta al veredicto para no
 * acusar al layout cuando la causa es el deploy.
 *
 * Se reusa `deploy-vivo.mjs` en vez de re-medir: ahi vive el metodo (la cadena
 * `--first-parent`, y `llegaAlCliente` para no contar commits que solo tocan
 * herramientas). Dos instrumentos midiendo lo mismo por caminos distintos es
 * como nacen dos verdades.
 *
 * Devuelve `null` —NO MEDIDO— ante cualquier tropiezo, a proposito: este numero
 * matiza un rojo, nunca lo crea, asi que no puede tumbar la medicion de las
 * pantallas por no haber podido preguntarle a git o al VPS.
 */
export async function arreglosVarados(base) {
  if (esBaseLocal(base)) return 0; // contra el arbol no hay atraso posible
  try {
    const { fechaBuildVivo, commitsDesde, llegaAlCliente } = await import("./deploy-vivo.mjs");
    const ms = fechaBuildVivo();
    if (typeof ms !== "number") return null;
    const commits = commitsDesde(ms);
    if (commits === null) return null;
    return commits.filter((c) => llegaAlCliente(c.archivos)).length;
  } catch {
    return null;
  }
}

async function main() {
  const base = baseValida(process.argv[2]);
  const out = process.env.OUT_DIR || "/tmp/wv-mirar";
  const informe = await mirar(base, out);
  const r = veredicto(informe, base, { arreglosVarados: await arreglosVarados(base) });
  console.log(`Base: ${base}  ·  capturas: ${out}`);
  for (const l of r.lineas) console.log(l);
  process.exit(r.codigo);
}

/*
 * La guarda: sin esto, importar el modulo dispara la medicion entera. Lo probo
 * el propio test el 2026-09-05 — el `import` lanzo Chromium y navego a
 * `127.0.0.1:3111` antes de correr un solo caso.
 */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
