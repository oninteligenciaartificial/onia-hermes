#!/usr/bin/env node
/**
 * La viñeta tiene que estar PEGADA a su texto.
 *
 * 🔴 POR QUE EXISTE. Medido el 2026-09-27 sobre `onia.com.bo/` SERVIDA, recorriendo la home
 * entera a 390px (20 capturas, MIRADAS una por una). En las cuatro tarjetas de plan —la
 * pantalla donde el lead decide— el punto verde de cada renglon quedaba a la izquierda del
 * todo y su texto CENTRADO en el resto del ancho. El peor caso, «Todo lo del Básico»:
 * el punto en x=49 y su texto arrancando en x=145, o sea **73px de aire** entre la viñeta
 * y lo que nombra, en una pantalla de 390. Con 18 renglones asi, la lista no se lee como
 * una lista: se lee como puntos sueltos al margen.
 *
 * NO es una decision de diseño, y eso se puede probar sin opinar: `.planList li` esta
 * escrito como `grid-template-columns: 1.1em 1fr` —una columna PARA el marcador y otra
 * para el texto—, forma que solo tiene sentido con el texto al inicio de su columna. Y la
 * MISMA clase se pinta bien en las otras dos pantallas que la usan: medido en vivo,
 * `/precios` (23 renglones) y `/chatbot` (11) dan `text-align: start` y hueco −1px. La
 * home era la unica centrada, porque su banda de precios va dentro del envoltorio
 * `.centro` de la portada y `text-align` SE HEREDA: la clase de la lista nunca dijo lo
 * suyo, asi que cualquier ancestro centrado se lo decide.
 *
 * Por eso el arreglo no es un rediseño: es completar el patron que las otras dos pantallas
 * ya shippean, declarando la alineacion en la lista en vez de dejarla a merced del
 * envoltorio.
 *
 * QUE MIDE ESTO. El SINTOMA, no la causa: abre las superficies de venta y pregunta, por
 * cada renglon con marcador, cuanto aire hay entre donde EMPIEZA su columna de texto y
 * donde empieza el texto de verdad. Sobrevive a que cambie el porque (otro envoltorio,
 * otro `text-align`, un `justify-items`): si la viñeta se vuelve a soltar, esto lo dice.
 *
 * Se mide a 390px porque es el ancho donde mas duele —el lead que llega de Instagram—,
 * pero el defecto NO depende del ancho: a 1366 el mismo renglon daba 45px de hueco. Un
 * solo ancho alcanza para atraparlo.
 *
 * Los sujetos se derivan del DISCO (`superficiesDeVenta`), no de una lista escrita a mano:
 * una pantalla nueva que reuse la lista nace cubierta.
 *
 * Uso:
 *   node scripts/vineta-pegada-a-su-texto.mjs                       # produccion
 *   node scripts/vineta-pegada-a-su-texto.mjs --base=http://127.0.0.1:3987
 *
 * Sale 0 si todas las viñetas estan pegadas, 1 si alguna se solto, 2 si no pudo medir.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { superficiesDeVenta } from "./rutas-de-venta.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);

/**
 * Tope de aire, en px, entre el inicio de la columna de texto y el texto.
 *
 * No es cero por dos motivos medidos, no por cautela: `Range.getBoundingClientRect()`
 * arranca en el primer glifo y deja fuera el espacio en blanco del markup, y las columnas
 * en `em` caen en fracciones de pixel. En las dos pantallas SANAS el valor real es −1.
 * Con 6px, un renglon sano nunca acusa y el defecto de la home (73px) no pasa ni cerca.
 */
export const TOPE_HUECO = 6;

/**
 * El criterio, puro. Recibe lo que se vio y devuelve la lista de fallas en castellano.
 *
 * `hueco` es px entre donde EMPIEZA la columna del texto y donde empieza el texto. Un
 * negativo chico es sano (el glifo monta sobre el borde de su columna); lo que acusa es el
 * aire positivo, que es siempre lo mismo: el texto se fue al centro y dejo al marcador solo.
 */
export function fallasDeVinetaSuelta(renglones, tope = TOPE_HUECO) {
  const sueltos = renglones.filter((r) => Number.isFinite(r.hueco) && r.hueco > tope);
  const porRuta = new Map();
  for (const r of sueltos) {
    const antes = porRuta.get(r.ruta);
    if (!antes || r.hueco > antes.hueco) porRuta.set(r.ruta, r);
  }
  return [...porRuta.entries()].map(([ruta, peor]) => {
    const cuantos = sueltos.filter((r) => r.ruta === ruta).length;
    return (
      `${ruta}: ${cuantos} viñeta(s) sueltas de su texto. La peor, «${peor.texto}»: ` +
      `${Math.round(peor.hueco)}px de aire entre el punto y lo que nombra ` +
      `(tope ${tope}px). El texto esta ${peor.align}, heredado del envoltorio.`
    );
  });
}

/**
 * La mitad estatica: que la lista DECLARE su alineacion en vez de heredarla.
 *
 * Existe porque el sintoma de arriba solo se mide con un navegador, y un gate que solo
 * corre a mano es un gate que un dia no corre. Esto si entra a `npm test`: si alguien
 * borra la linea, el envoltorio vuelve a decidir por la lista y esto se pone rojo en el
 * build, sin abrir nada.
 */
export function declaraSuAlineacion(css, selector) {
  // Los comentarios se van ANTES de buscar la llave de cierre, y no es cautela: esta misma
  // regla explica en prosa que su gate vive en `vineta-pegada-a-su-texto.{mjs,test.ts}`, y
  // esa llave cerraba el bloque en la EXPLICACION — la declaracion quedaba del lado que no
  // se mide y el gate acusaba un defecto inexistente. Lo acuso de si mismo el 2026-09-27.
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const i = limpio.indexOf(`${selector} {`);
  if (i === -1) return { declarada: false, motivo: `no encontre la regla \`${selector}\`` };
  const bloque = limpio.slice(i, limpio.indexOf("}", i));
  const m = /text-align:\s*(left|start)\b/.exec(bloque);
  return m
    ? { declarada: true, valor: m[1] }
    : { declarada: false, motivo: `\`${selector}\` no declara \`text-align\`: lo hereda` };
}

/** Lee en la pagina abierta el aire de cada renglon con marcador. */
const renglonesConMarcador = (pagina, ruta) =>
  pagina.evaluate((ruta) => {
    const salida = [];
    for (const li of document.querySelectorAll("li")) {
      const cs = getComputedStyle(li);
      if (cs.display !== "grid") continue;
      const cols = cs.gridTemplateColumns.split(" ").map(parseFloat);
      // La forma "marcador + texto": dos columnas y la primera angosta.
      if (cols.length !== 2 || !Number.isFinite(cols[0]) || cols[0] > 60) continue;
      const marcador = getComputedStyle(li, "::before");
      if (!marcador || parseFloat(marcador.width) <= 0) continue;

      const caja = li.getBoundingClientRect();
      const rango = document.createRange();
      rango.selectNodeContents(li);
      const texto = rango.getBoundingClientRect();
      if (texto.width <= 0) continue;

      const inicioDeSuColumna =
        caja.left + parseFloat(cs.paddingLeft || 0) + cols[0] + parseFloat(cs.columnGap || 0);
      salida.push({
        ruta,
        texto: li.textContent.trim().slice(0, 40),
        align: cs.textAlign,
        hueco: texto.left - inicioDeSuColumna,
      });
    }
    return salida;
  }, ruta);

/**
 * `playwright` no es dependencia de esta app a proposito: es herramienta de verificacion,
 * no producto, y no tiene que viajar al contenedor que sirve el sitio. Y no alcanza con
 * que RESUELVA: se elige el que efectivamente ARRANCA (lección del 2026-09-02).
 */
const CANDIDATOS = [
  "playwright",
  "/root/node_modules/playwright/index.js",
  join(APP, "..", "..", "..", "node_modules", "playwright", "index.js"),
];

async function abrirNavegador() {
  for (const ruta of CANDIDATOS) {
    const espec = ruta === "playwright" ? ruta : existsSync(ruta) ? pathToFileURL(ruta).href : null;
    if (!espec) continue;
    try {
      const { chromium } = await import(espec);
      return await chromium.launch({ channel: "chromium", args: ["--no-sandbox"] });
    } catch {
      /* el que sigue */
    }
  }
  return null;
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split("=").slice(1).join("=");
  const base = arg("base", "https://onia.com.bo").replace(/\/$/, "");

  const navegador = await abrirNavegador();
  if (!navegador) {
    console.error("NO PUDE MEDIR: no hay un playwright que arranque en esta maquina.");
    process.exit(2);
  }

  const contexto = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    timezoneId: "America/La_Paz",
    reducedMotion: "reduce",
  });
  const pagina = await contexto.newPage();

  const rutas = superficiesDeVenta();
  console.log(`Base: ${base} · 390px · pantallas de venta a recorrer: ${rutas.length}`);

  const renglones = [];
  const noContestaron = [];
  let n = 0;
  for (const ruta of rutas) {
    // Una linea por pantalla, con su tiempo: un barrido mudo no se distingue de uno
    // colgado, y el que mira lo mata justo antes de que termine (gate `barrido-que-habla`).
    const t0 = Date.now();
    n += 1;
    try {
      await pagina.goto(`${base}${ruta}`, { waitUntil: "load", timeout: 60000 });
    } catch (e) {
      noContestaron.push(`${ruta} — ${e.message}`);
      console.log(`  [${n}/${rutas.length}] ${ruta} — no contesto (${Date.now() - t0} ms)`);
      continue;
    }
    const vistos = await renglonesConMarcador(pagina, ruta);
    renglones.push(...vistos);
    console.log(`  [${n}/${rutas.length}] ${ruta} — ${vistos.length} renglon(es) (${Date.now() - t0} ms)`);
  }
  await navegador.close();

  if (noContestaron.length) {
    console.error(`NO PUDE MEDIR: ${noContestaron.length} pantalla(s) no contestaron:`);
    for (const x of noContestaron) console.error(`  · ${x}`);
    process.exit(2);
  }

  const conLista = new Set(renglones.map((r) => r.ruta));
  console.log(
    `\nPantallas con lista de viñetas: ${conLista.size} de ${rutas.length} · ` +
      `renglones medidos: ${renglones.length}`,
  );
  if (!renglones.length) {
    console.error("NO PUDE MEDIR: no encontre ni un renglon con marcador. ¿Cambio la forma de la lista?");
    process.exit(2);
  }

  const fallas = fallasDeVinetaSuelta(renglones);
  if (fallas.length) {
    console.error(`\nROJO — la viñeta se solto de su texto en ${fallas.length} pantalla(s):`);
    for (const f of fallas) console.error(`  · ${f}`);
    process.exit(1);
  }
  const peor = Math.max(...renglones.map((r) => r.hueco));
  console.log(
    `\nVERDE: los ${renglones.length} renglones de ${conLista.size} pantalla(s) tienen su ` +
      `viñeta pegada al texto (el peor hueco es ${Math.round(peor)}px, tope ${TOPE_HUECO}px).`,
  );
}
