#!/usr/bin/env node
/**
 * Mirar las dos pantallas de venta — `onia.com.bo/` y `/empezar`.
 *
 * POR QUE EXISTE. El objetivo de este carril tiene dos mitades: que las dos pantallas no
 * tengan un defecto visible **y que un gate las cubra**. Los tests de al lado
 * (`forma.test.ts`, `cierre.test.ts`, `hero.test.ts`, `alta.test.ts`) leen el CODIGO
 * FUENTE: son rapidos y corren en cada build, pero no abren nada. La franja clara bajo el
 * pie negro del 2026-09-02 no la encontro ninguno de ellos — la encontro una captura.
 * Y el test que la guarda hoy verifica la CAUSA de ese dia (una barra fija que ya no
 * existe): si la franja vuelve por otro camino, pasa en verde igual.
 *
 * Esto mide el SINTOMA, no la causa: abre las dos paginas de verdad y pregunta que hay
 * pintado al pie del ultimo viewport. Sobrevive a que cambie la implementacion.
 *
 * NO se cablea en `prebuild`: el deploy real corre `pnpm --filter onia-platform build`
 * (scripts/deploy-onia-landing.sh) y meterle un navegador al camino del deploy es
 * cambiar un gate por un riesgo. Esto se corre a mano, cada vuelta del loop.
 *
 * Uso:
 *   node scripts/mirar-venta.mjs                          # produccion (lo que ve un lead)
 *   node scripts/mirar-venta.mjs --base=http://127.0.0.1:3987   # el build de esta rama
 *   node scripts/mirar-venta.mjs --out=/tmp/venta         # donde deja las capturas
 *   node scripts/mirar-venta.mjs --comparar-con=/tmp/rama/informe.json  # de quien es el trabajo
 *
 * Sale 0 si las dos pasan, 1 si alguna falla, y 3 si con `--comparar-con` resulta
 * que produccion esta rota SOLO por falta de deploy (ver el bloque del final). Las capturas quedan en `--out` para MIRARLAS:
 * este script descarta lo medible, el ojo sigue haciendo falta para lo demas.
 */
import { existsSync } from 'node:fs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

/**
 * `playwright` no es dependencia de esta app a proposito: es una herramienta de
 * verificacion, no del producto, y no tiene que viajar al contenedor que sirve el sitio.
 * Por eso se busca donde ya esta instalado en vez de sumarlo al `package.json`.
 *
 * Y no alcanza con que el paquete RESUELVA: en este worktree resuelve una copia que pide
 * un Chromium que nadie bajo (`chromium-1228`), mientras la de `/root` tiene el binario
 * puesto. Por eso se elige por el que ARRANCA, no por el que importa.
 */
const CANDIDATOS = [
  'playwright',
  '/root/node_modules/playwright/index.js',
  join(process.cwd(), '..', '..', '..', 'node_modules', 'playwright', 'index.js'),
];

const ARGS_LAUNCH = { channel: 'chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] };

/** Devuelve el primer navegador que efectivamente abre, con su modulo. */
async function abrirNavegador() {
  const problemas = [];
  for (const ruta of CANDIDATOS) {
    const espec = ruta === 'playwright' ? ruta : existsSync(ruta) ? pathToFileURL(ruta).href : null;
    if (!espec) continue;
    try {
      const mod = await import(espec);
      // Importado por ruta, playwright llega como CJS: los nombres cuelgan de `default`.
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (!chromium) throw new Error('el modulo no expone `chromium`');
      return await chromium.launch(ARGS_LAUNCH);
    } catch (e) {
      problemas.push(`${ruta}: ${String(e.message).split('\n')[0]}`);
    }
  }
  console.error('No se pudo abrir Chromium con ningun playwright disponible:');
  for (const p of problemas) console.error(`  · ${p}`);
  process.exit(2);
}

const arg = (nombre, porDefecto) => {
  const hit = process.argv.find((a) => a.startsWith(`--${nombre}=`));
  return hit ? hit.slice(nombre.length + 3) : porDefecto;
};

const BASE = arg('base', 'https://onia.com.bo').replace(/\/$/, '');
const OUT = arg('out', '/tmp/mirar-venta');

/** Las dos pantallas del carril. Si se suma una tercera, va acá y en el prompt del loop. */
const PANTALLAS = [
  { nombre: 'home', ruta: '/' },
  { nombre: 'empezar', ruta: '/empezar' },
];

/**
 * 320 es el iPhone SE (el mas angosto que sigue vivo) y 390 el iPhone mas comun.
 * 1920 esta porque la tarjeta de rubros ya salio cortada en pantallas anchas.
 */
const VISTAS = [
  { nombre: 'movil-320', width: 320, height: 568, movil: true },
  { nombre: 'movil-390', width: 390, height: 844, movil: true },
  { nombre: 'tablet-768', width: 768, height: 1024, movil: false },
  { nombre: 'ancha-1440', width: 1440, height: 900, movil: false },
  { nombre: 'ancha-1920', width: 1920, height: 1080, movil: false },
];

const UA_IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

/**
 * Lo que se mide dentro de la pagina, ya scrolleada hasta el fondo.
 *
 * `alPie` es el corazon de esto: en el fondo del documento, a tres alturas de x, que
 * elemento esta pintado. Si es BODY o HTML, lo que se ve abajo de todo es el fondo de la
 * pagina y no el pie — que es exactamente como se veia la franja clara bajo el pie negro.
 * Se sortean tres x porque el globo del chat es fijo y vive en la esquina derecha.
 */
function sonda(vw) {
  const doc = document.documentElement;
  const desborde = doc.scrollWidth - vw;
  const puntos = [0.2, 0.5, 0.8].map((f) => {
    const el = document.elementFromPoint(Math.floor(vw * f), window.innerHeight - 2);
    return { x: f, tag: el?.tagName ?? 'NINGUNO' };
  });
  const recortados = [];
  for (const e of document.querySelectorAll('body *')) {
    if (e.children.length || !e.textContent?.trim()) continue;
    const st = getComputedStyle(e);
    if (st.overflow === 'visible') continue;
    if (e.scrollWidth > e.clientWidth + 2) {
      recortados.push({ tag: e.tagName, txt: e.textContent.trim().slice(0, 60) });
    }
  }
  return {
    desborde,
    alPie: puntos,
    recortados: recortados.slice(0, 5),
    scrolleable: doc.scrollHeight > window.innerHeight + 2,
    // Cuanto falta para el fondo real. Si esto no es ~0, la sonda de arriba midio a
    // mitad de la pagina y NO vio el pie: ver `bajarHastaElFondo`.
    faltaParaElFondo: Math.max(0, doc.scrollHeight - (window.scrollY + window.innerHeight)),
  };
}

/**
 * Bajar hasta el fondo DE VERDAD, y decir si se llego.
 *
 * Un solo `window.scrollTo(0, scrollHeight)` no alcanza, y el falso verde que eso produjo
 * es el motivo por el que existe esta funcion. Medido el 2026-09-03 contra produccion, en
 * la home a 390px: `scrollHeight` = 14569, y despues del scrollTo + 700ms la pagina quedaba
 * en `scrollY` = 11299 — a 2426px del fondo. Ahi `elementFromPoint` devuelve el DIV de una
 * seccion cualquiera en vez de BODY, asi que el gate daba VERDE con la franja clara viva
 * abajo (73px, el mismo numero que ya se habia medido a mano el dia anterior). El gate era
 * ciego justo en la pantalla mas importante del sitio: la home.
 *
 * Dos causas, y se cubren las dos:
 *  - `globals.css` tiene `scroll-behavior: smooth`, asi que el scrollTo ANIMA; 14569px de
 *    animacion no entran en 700ms. Por eso `behavior: 'instant'`.
 *  - la pagina puede crecer al revelar contenido, asi que el destino se corre mientras se
 *    baja. Por eso se repite hasta que `scrollY` deja de moverse.
 */
async function bajarHastaElFondo(page) {
  await page.evaluate(async () => {
    let anterior = -1;
    for (let i = 0; i < 40; i++) {
      const y = window.scrollY;
      if (y === anterior) break;
      anterior = y;
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 250));
    }
  });
  await page.waitForTimeout(700);
}

mkdirSync(OUT, { recursive: true });

/** `channel: 'chromium'` (en ARGS_LAUNCH) a proposito: sin eso Playwright cae en
 *  `chromium_headless_shell`, que dibuja mal el texto e inventa defectos que no existen
 *  (costo medido: 3 dias de un item abierto contra una pantalla que se veia perfecta). */
const navegador = await abrirNavegador();

/**
 * Una falla se guarda con su CLASE, no sólo con su texto.
 *
 * El texto lleva medidas del día (píxeles, rutas de captura) y cambia entre dos
 * corridas de la MISMA pantalla rota. La clase es lo que se puede comparar:
 * `home @ movil-390 | franja` es la misma falla ayer y hoy, en producción y en
 * la rama. Sin eso, `--comparar-con` no puede decidir nada.
 */
const fallas = [];
const falla = (id, clase, texto) => fallas.push({ id, clase, texto, clave: `${id} | ${clase}` });
const avisos = [];
const informe = [];

for (const vista of VISTAS) {
  const ctx = await navegador.newContext({
    viewport: { width: vista.width, height: vista.height },
    deviceScaleFactor: vista.movil ? 2 : 1,
    isMobile: vista.movil,
    hasTouch: vista.movil,
    userAgent: vista.movil ? UA_IPHONE : undefined,
  });

  for (const pantalla of PANTALLAS) {
    const url = `${BASE}${pantalla.ruta}`;
    const page = await ctx.newPage();
    const errores = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errores.push(m.text().slice(0, 140));
    });

    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    const ms = Date.now() - t0;
    await page.waitForTimeout(900);
    await bajarHastaElFondo(page);

    const m = await page.evaluate(sonda, vista.width);
    const captura = join(OUT, `${pantalla.nombre}-${vista.nombre}-pie.png`);
    await page.screenshot({ path: captura });

    const id = `${pantalla.nombre} @ ${vista.nombre}`;
    const status = resp?.status() ?? 0;
    if (status !== 200) falla(id, 'status', `${id}: respondio ${status}`);
    if (m.desborde > 0) falla(id, 'desborde', `${id}: desborde horizontal de ${m.desborde}px`);
    if (m.recortados.length) {
      falla(id, 'recortado', `${id}: texto recortado — "${m.recortados[0].txt}"`);
    }
    if (m.scrolleable) {
      /**
       * Antes de creerle a la sonda, exigirle que haya mirado el fondo. Sin esto el gate
       * miente por OMISION: mide a mitad de pagina, no ve el pie, y como ahi hay contenido
       * y no BODY, canta verde. Eso ya paso — es el bug que arreglo esta funcion. Una falla
       * del INSTRUMENTO se reporta como falla, nunca como verde: si el gate no pudo mirar,
       * no sabe, y "no sé" no es "está bien".
       */
      if (m.faltaParaElFondo > 2) {
        falla(
          id,
          'no-llego-al-fondo',
          `${id}: el gate no llego al fondo (faltaron ${m.faltaParaElFondo}px) — no pudo mirar el pie, ` +
            `asi que este resultado NO dice que la pantalla este bien`,
        );
      }
      const fondo = m.alPie.filter((p) => p.tag === 'BODY' || p.tag === 'HTML');
      if (fondo.length) {
        falla(
          id,
          'franja',
          `${id}: al pie del ultimo viewport se ve el fondo de la pagina (${fondo
            .map((p) => `x=${p.x}`)
            .join(', ')}), no el pie — franja bajo el footer. Captura: ${captura}`,
        );
      }
    }
    /**
     * El 429 del widget de chat NO cuenta como falla de estas pantallas, y esta decidido
     * con la medicion: los bloqueos de Rack::Attack de las ultimas 24 h vienen TODOS de
     * dos IPs — el VPS y los propios loops. O sea, quien agota la cuota es este mismo
     * monitoreo, y el limite vive en el contenedor de Chatwoot, que es de otro carril
     * (esta anotado en la cola). Se avisa igual: callarlo seria esconderlo. Pero un gate
     * que queda rojo para siempre por algo que no puede arreglar es un gate que nadie lee.
     */
    const esRuidoDelWidget = (t) => t.includes('429');
    const propios = errores.filter((t) => !esRuidoDelWidget(t));
    const ajenos = errores.filter(esRuidoDelWidget);
    if (propios.length) {
      falla(id, 'consola', `${id}: ${propios.length} error(es) de consola — ${propios[0]}`);
    }
    if (ajenos.length) avisos.push(`${id}: widget de chat con 429 (limite de Chatwoot, otro carril)`);

    informe.push({ pantalla: pantalla.nombre, vista: vista.nombre, status, ms, ...m, errores });
    await page.close();
  }
  await ctx.close();
}

await navegador.close();
writeFileSync(join(OUT, 'informe.json'), JSON.stringify({ base: BASE, fallas, informe }, null, 2));

console.log(`Mirado: ${BASE} — ${PANTALLAS.length} pantallas x ${VISTAS.length} vistas`);
console.log(`Capturas y informe: ${OUT}`);
if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s) de fuera de esta zona:`);
  for (const a of avisos) console.log(`  · ${a}`);
}

/**
 * Sin referencia, un rojo contra produccion NO dice de quien es el trabajo.
 *
 * El 2026-09-03 este script salio rojo con las 6 mismas fallas de la franja bajo
 * el pie. Averiguar si habia que TOCAR CODIGO o solo faltaba PUBLICAR costo 25
 * minutos a mano: build, `next start` en un puerto libre y una segunda corrida.
 * La respuesta era "ya esta arreglado, falta el deploy de Sergio" — o sea, cero
 * codigo que tocar. Repetir esa investigacion cada vuelta es caro; y el error
 * caro de verdad es el otro: leer el rojo de produccion y "arreglar" algo que ya
 * estaba arreglado. Eso es el fantasma que la cola mide entre el 25% y el 46% de
 * los pendientes heredados.
 *
 * Con `--comparar-con` el veredicto lo escribe el script y no la sesion:
 *   node scripts/mirar-venta.mjs --base=http://127.0.0.1:3991 --out=/tmp/rama
 *   node scripts/mirar-venta.mjs --comparar-con=/tmp/rama/informe.json
 *
 * Una falla que esta en produccion y NO en la rama ya tiene su arreglo escrito:
 * es deploy, y el deploy es de Sergio. Una que esta en las DOS es codigo vivo, y
 * esa si es trabajo de este carril.
 */
const REF = arg('comparar-con', '');
if (REF && fallas.length) {
  const previas = new Set((JSON.parse(readFileSync(REF, 'utf8')).fallas ?? []).map((f) => f.clave));
  const deCodigo = fallas.filter((f) => previas.has(f.clave));
  const soloAca = fallas.filter((f) => !previas.has(f.clave));

  if (soloAca.length) {
    console.error(`\n${soloAca.length} falla(s) YA ARREGLADAS en la rama — falta PUBLICAR, no tocar codigo:`);
    for (const f of soloAca) console.error(`  · ${f.texto}`);
  }
  if (deCodigo.length) {
    console.error(`\n${deCodigo.length} falla(s) que TAMBIEN fallan en la rama — esto si es codigo:`);
    for (const f of deCodigo) console.error(`  · ${f.texto}`);
    process.exit(1);
  }
  // Produccion sigue rota para el lead, asi que no es un verde. Pero el trabajo
  // no es de este carril: un exit propio lo dice sin disfrazarlo de exito.
  console.error(`\nProduccion esta rota, y el arreglo YA esta en la rama. Falta el deploy (es de Sergio).`);
  process.exit(3);
}

if (fallas.length) {
  console.error(`\n${fallas.length} falla(s):`);
  for (const f of fallas) console.error(`  · ${f.texto}`);
  process.exit(1);
}
console.log('Sin defecto medible. Las capturas siguen necesitando ojo.');
