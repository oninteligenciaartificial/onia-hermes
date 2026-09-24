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
 * El umbral con el que se juzga que el titulo TERMINO de aparecer. Es el mismo
 * con el que `waitForFunction` espera, a proposito: si el script esperara una
 * cosa y juzgara otra, una pantalla a medio pintar pasaria en verde.
 */
export const OPACIDAD_PINTADA = 0.99;

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
export function veredicto(informe, base = "https://onia.com.bo") {
  const lineas = [];
  let codigo = 0;

  for (const r of informe) {
    lineas.push(
      `${r.pantalla.padEnd(10)} ${r.ruta.padEnd(10)} opacidad=${r.opacidadH1} 4xx/5xx=${r.fallidas.length} punto=${r.kicker ? (r.kicker.medible ? `${r.kicker.dx}px` : "sin caja") : "sin rotulo"} h1="${r.h1}"`,
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

  const sinPintar = informe.filter((r) => !(r.opacidadH1 >= OPACIDAD_PINTADA));
  if (sinPintar.length > 0) {
    codigo = 1;
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

/** La opacidad EFECTIVA de un elemento: el minimo de su cadena hasta body. */
const OPACIDAD_HEREDADA = `(sel) => {
  const el = document.querySelector(sel);
  if (!el) return -1;
  let min = 1;
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const o = parseFloat(getComputedStyle(n).opacity);
    if (!Number.isNaN(o) && o < min) min = o;
  }
  return min;
}`;

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
          `(${OPACIDAD_HEREDADA})('h1') >= ${OPACIDAD_PINTADA}`,
          null,
          { timeout: 8000 },
        );
      } catch {
        /* se reporta abajo con el valor que quedo */
      }
      opacidad = await pagina.evaluate(`(${OPACIDAD_HEREDADA})('h1')`);

      const archivo = `${out}/${ruta.id}-${pantalla.id}.png`;
      await pagina.screenshot({ path: archivo });
      const kicker = await pagina.evaluate(`(${PUNTO_DEL_ROTULO})()`);
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
        fallidas,
      });
      await pagina.close();
    }
    await contexto.close();
  }

  await navegador.close();
  return informe;
}

async function main() {
  const base = baseValida(process.argv[2]);
  const out = process.env.OUT_DIR || "/tmp/wv-mirar";
  const informe = await mirar(base, out);
  const r = veredicto(informe, base);
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
