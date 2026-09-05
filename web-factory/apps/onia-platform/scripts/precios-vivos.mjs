#!/usr/bin/env node
/**
 * Los precios que ve un lead DESPUES de responder, seguidos contra produccion.
 *
 * POR QUE EXISTE. `precios.test.ts` y `precios-addons.test.ts` leen el codigo fuente y
 * exigen que ninguna pantalla escriba un monto a mano. Son buenos gates y estan verdes.
 * Y aun asi, el 2026-09-04 produccion le cotizaba la web al cliente a **Bs 790** —menos
 * de la mitad de la linea 2.000/4.500/7.500 que Sergio ratifico el 2026-08-23— doce dias
 * despues del cambio, y otra vez despues de arreglado.
 *
 * Dos agujeros distintos, y este script cierra los dos:
 *
 * 1. **El precio no esta en el HTML.** El bloque «Lo que te falta» de `/v1/empezar` se
 *    pinta del lado del CLIENTE, recien al terminar el cuestionario. `curl` + `grep`
 *    sobre la ruta salen los dos VACIOS y dan verde. Todo instrumento que mire la
 *    respuesta del servidor es ciego a esta superficie.
 *
 * 2. **Nadie respondia el formulario.** Es el mismo defecto que dejo pasar que agendar
 *    una cita no funcionaba: los instrumentos *miraban y frenaban*. El primer paso casi
 *    siempre esta bien; el precio vencido vivia en el TERCERO.
 *
 * QUE MIDE. Recorre el cuestionario de verdad (Playwright), llega a la pantalla de
 * resultado y junta CADA monto en Bs que quedo pintado. Todos tienen que pertenecer al
 * conjunto que declaran las fuentes (`lib/pricing.ts`, `content/webs.ts`,
 * `content/chatbot-precios.ts`). Uno que sobre es un precio despegado de su fuente.
 *
 * QUE DIAGNOSTICA, y es la mitad que ahorra la vuelta siguiente. Un monto que sobra
 * tiene dos causas y se arreglan en lugares opuestos:
 *   - si el numero **tampoco** aparece en el arbol de fuentes de esta rama, el codigo ya
 *     esta bien y lo que falta es DESPLEGAR → sale 3;
 *   - si el numero **si** esta escrito en el codigo, el defecto es nuestro → sale 1.
 * Sin esa distincion, la vuelta siguiente vuelve a "arreglar" un archivo ya arreglado.
 * Misma convencion de salida que `mirar-venta.mjs`.
 *
 * COMO NO FALLA EN VERDE. Es la trampa de esta familia de gates y ya nos costo dos
 * veces: si el wizard no avanza (un selector que cambio, un clic que no prende) no se ve
 * NINGUN precio, y "ninguno esta fuera de la fuente" se lee como exito. Por eso el exito
 * exige haber LLEGADO al resultado y haber visto al menos `MINIMO_MONTOS` montos: un
 * recorrido que se corta sale rojo como instrumento roto, no verde como sitio sano.
 *
 * NO se cablea en `prebuild` — necesita red y produccion en pie, igual que
 * `mirar-venta.mjs` y `enlaces-vivos.mjs`. Colgarlo del build ata el deploy a que el
 * sitio ya este arriba. Se corre cada vuelta del loop.
 *
 * Uso:
 *   node scripts/precios-vivos.mjs
 *   node scripts/precios-vivos.mjs --base=http://127.0.0.1:3987
 *   node scripts/precios-vivos.mjs --out=/tmp/precios     # capturas para MIRAR
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(RAIZ, 'src');

const arg = (n, def) => {
  const m = process.argv.find((a) => a.startsWith(`--${n}=`));
  return m ? m.slice(n.length + 3) : def;
};
const BASE = arg('base', 'https://onia.com.bo').replace(/\/$/, '');
const OUT = arg('out', '/tmp/precios-vivos');

/**
 * Cuantos montos tiene que haber visto el recorrido para que el verde signifique algo.
 * Medido el 2026-09-04 sobre produccion: la pantalla de resultado pinta 6 (los tres
 * planes con su semanal, el chatbot y la web). Se pide bastante menos que eso para que
 * un cambio de copy no lo ponga rojo de mentira, pero mas que cero — que es como este
 * gate se romperia en silencio.
 */
const MINIMO_MONTOS = 3;

/* ── El conjunto de montos que las FUENTES declaran ───────────────────────────────── */

/**
 * Los numeros no se copian aca: se extraen de los archivos que mandan. Si algun dia esta
 * lista y la fuente se despegan, el que gana es el archivo — que es la regla de la casa.
 *
 * Y no se enumeran los NOMBRES de campo, se toma todo `campo: <numero>`. La primera
 * version de este script si los enumeraba, y en su primera corrida dio rojo sobre
 * `Bs 3.500` —que es `GRUPO.implementacionDesde`, un precio perfectamente declarado y
 * leido de la fuente— solo porque ese nombre no estaba en la lista. Un vigia que grita
 * mal no molesta: se lo deja de mirar. Derivado del archivo, un campo de precio nuevo
 * nace cubierto.
 *
 * El costo de derivar: entran tambien numeros que no son plata (`includedConversations:
 * 500`, `operationalMonthlyLimit: 200`), asi que un precio equivocado que valiera
 * exactamente 500 o 200 pasaria. Es un agujero mucho mas chico que el que cierra —un
 * monto vencido rara vez coincide con una constante ajena— y se paga a cambio de que el
 * gate no envejezca con cada campo nuevo.
 *
 * Se parsea con expresiones sobre el texto en vez de importar los modulos porque son TS
 * y este script es node pelado (el resto de las sondas del carril tambien lo son). El
 * riesgo de un parser es que un cambio de forma lo deje sin encontrar nada y el gate
 * apruebe cualquier cosa; por eso cada fuente declara cuantos montos MINIMO espera y el
 * script se muere si alguna trae menos.
 */
const FUENTES = [
  { archivo: 'lib/pricing.ts', minimo: 10 },
  { archivo: 'content/webs.ts', minimo: 5 },
  { archivo: 'content/chatbot-precios.ts', minimo: 2 },
];

/** `algo: 1234` — el valor numerico de cualquier propiedad, con 2 digitos o mas. */
const RE_CAMPO_NUMERICO = /\b[A-Za-z_$][\w$]*\s*:\s*(\d{2,7})\b/g;

function montosDeclarados() {
  const set = new Set();
  const detalle = [];
  for (const { archivo, minimo } of FUENTES) {
    const ruta = join(SRC, archivo);
    if (!existsSync(ruta)) {
      throw new Error(`fuente de precios ausente: ${archivo}. Sin ella este gate aprobaria cualquier monto.`);
    }
    // Sin comentarios: los tres archivos NARRAN los precios viejos que ya se retiraron
    // (el 790, los 1.500+550 del chatbot). Contarlos como declarados dejaria pasar en
    // verde justo al precio vencido que este gate busca.
    const txt = readFileSync(ruta, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    const encontrados = new Set();
    for (const m of txt.matchAll(RE_CAMPO_NUMERICO)) encontrados.add(Number(m[1]));
    if (encontrados.size < minimo) {
      throw new Error(
        `${archivo}: se esperaban al menos ${minimo} montos y se extrajeron ${encontrados.size}. ` +
          `Cambio la forma del archivo y el parser quedo ciego — arreglar el parser, NO bajar el minimo.`,
      );
    }
    encontrados.forEach((n) => set.add(n));
    detalle.push(`${archivo}: ${encontrados.size}`);
  }
  return { set, detalle };
}

/**
 * ¿El monto que sobra esta escrito en ALGUN lado del arbol de fuentes de esta rama?
 *
 * Se busca con limites de digito, no por substring: `includes("790")` tambien da
 * verdadero dentro de `7900` o `17901`, y con eso el diagnostico se invierte —diria
 * "esta en el codigo, arreglalo aca" sobre un archivo ya arreglado, que es justo la
 * vuelta perdida que este script existe para evitar.
 */
function apareceEnElCodigo(monto) {
  const formas = [String(monto), monto.toLocaleString('es-BO')].map(
    (f) => new RegExp(`(?<![\\d.])${f.replace('.', '\\.')}(?![\\d.])`),
  );
  const vistos = [];
  const recorrer = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) recorrer(p);
      else if (/\.(ts|tsx)$/.test(e.name) && !e.name.includes('.test.')) {
        const txt = readFileSync(p, 'utf8');
        // Solo el codigo: un numero citado en un comentario que NARRA el bug viejo
        // (y hay varios) no es un precio publicado.
        const sinComentarios = txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
        if (formas.some((f) => f.test(sinComentarios))) vistos.push(p.slice(RAIZ.length + 1));
      }
    }
  };
  recorrer(SRC);
  return vistos;
}

/* ── El navegador ─────────────────────────────────────────────────────────────────── */

/**
 * Misma busqueda que `mirar-venta.mjs`: playwright NO es dependencia de esta app a
 * proposito (es herramienta de verificacion, no producto, y no viaja al contenedor), y
 * no alcanza con que RESUELVA — en este worktree resuelve una copia sin su Chromium.
 * Se elige por el que ARRANCA.
 */
const CANDIDATOS = [
  'playwright',
  '/root/node_modules/playwright/index.js',
  join(RAIZ, '..', '..', '..', 'node_modules', 'playwright', 'index.js'),
];

async function abrirNavegador() {
  const problemas = [];
  for (const ruta of CANDIDATOS) {
    const espec = ruta === 'playwright' ? ruta : existsSync(ruta) ? pathToFileURL(ruta).href : null;
    if (!espec) continue;
    try {
      const mod = await import(espec);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (!chromium) continue;
      const nav = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
      return nav;
    } catch (e) {
      problemas.push(`${ruta}: ${String(e).split('\n')[0]}`);
    }
  }
  throw new Error(`ningun playwright arranca:\n  ${problemas.join('\n  ')}`);
}

/* ── El recorrido ─────────────────────────────────────────────────────────────────── */

const RE_MONTO = /Bs\.?\s?(\d{1,3}(?:\.\d{3})*|\d+)/g;

/** Todo monto pintado en la pantalla, como numero. */
function montosVisibles(texto) {
  const out = new Set();
  for (const m of texto.matchAll(RE_MONTO)) out.add(Number(m[1].replace(/\./g, '')));
  return out;
}

/**
 * Responde el cuestionario eligiendo, en cada paso, la opcion `cual` (0 = la primera,
 * -1 = la ultima). Dos recorridos distintos tocan ramas distintas de `recommend.ts`.
 */
async function recorrer(nav, cual, etiqueta) {
  const pag = await nav.newPage({ viewport: { width: 1280, height: 1000 } });
  const rotos = [];
  pag.on('response', (r) => {
    if (r.status() >= 400) rotos.push(`${r.status()} ${r.url()}`);
  });
  await pag.goto(`${BASE}/v1/empezar`, { waitUntil: 'networkidle', timeout: 60000 });
  // El sitio trae scroll-behavior:smooth: sin esto una captura sale a mitad de camino.
  await pag.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });

  let llego = false;
  for (let paso = 1; paso <= 8; paso++) {
    const opciones = pag.locator('input[type=radio], input[type=checkbox]');
    const n = await opciones.count();
    if (n > 0) {
      const i = cual < 0 ? n - 1 : Math.min(cual, n - 1);
      try {
        await opciones.nth(i).check({ force: true, timeout: 4000 });
      } catch {
        /* un paso sin eleccion obligatoria: se sigue */
      }
    }
    const seguir = pag.getByRole('button', { name: /continuar|siguiente|ver mi|listo/i });
    if ((await seguir.count()) === 0) break;
    const boton = seguir.first();
    if (await boton.isDisabled()) break;
    await boton.click();
    await pag.waitForTimeout(800);
    const t = await pag.locator('body').innerText();
    if (/Lo que te falta|te falta/i.test(t) && RE_MONTO.test(t)) {
      llego = true;
      break;
    }
    RE_MONTO.lastIndex = 0;
  }

  await pag.waitForTimeout(800);
  const texto = await pag.locator('body').innerText();
  mkdirSync(OUT, { recursive: true });
  await pag.screenshot({ path: join(OUT, `wizard-${etiqueta}.png`) });
  await pag.close();
  return { llego, texto, montos: montosVisibles(texto), rotos };
}

/* ── Veredicto ────────────────────────────────────────────────────────────────────── */

const { set: declarados, detalle } = montosDeclarados();
console.log(`fuentes leidas → ${detalle.join(' · ')} · ${declarados.size} montos declarados`);
console.log(`base: ${BASE}`);

const nav = await abrirNavegador();
const recorridos = [];
try {
  recorridos.push(await recorrer(nav, 0, 'primera-opcion'));
  recorridos.push(await recorrer(nav, -1, 'ultima-opcion'));
} finally {
  await nav.close();
}

const vistos = new Set();
let alguienLlego = false;
const rotos = [];
for (const r of recorridos) {
  if (r.llego) alguienLlego = true;
  r.montos.forEach((m) => vistos.add(m));
  rotos.push(...r.rotos);
}

const sobran = [...vistos].filter((m) => !declarados.has(m)).sort((a, b) => a - b);

console.log(`recorridos que llegaron al resultado: ${recorridos.filter((r) => r.llego).length}/${recorridos.length}`);
console.log(`montos vistos: ${[...vistos].sort((a, b) => a - b).join(', ') || '(ninguno)'}`);
if (rotos.length) console.log(`respuestas >=400 durante el recorrido: ${[...new Set(rotos)].slice(0, 5).join(' · ')}`);

// Instrumento roto ANTES que veredicto: un recorrido que no llego no puede decir nada
// del sitio, y "no vi precios fuera de la fuente" seria un verde de mentira.
if (!alguienLlego || vistos.size < MINIMO_MONTOS) {
  console.error(
    `\nROJO (instrumento): el recorrido no llego a la pantalla de resultado ` +
      `(llego=${alguienLlego}, montos=${vistos.size}, minimo=${MINIMO_MONTOS}).\n` +
      `Esto NO dice que el sitio este sano: dice que no se pudo medir. Mirar ${OUT}/wizard-*.png.`,
  );
  process.exit(1);
}

if (sobran.length === 0) {
  console.log(`\nVERDE: los ${vistos.size} montos que ve un lead salen de la fuente.`);
  process.exit(0);
}

const informe = [];
let soloFaltaDesplegar = true;
for (const monto of sobran) {
  const donde = apareceEnElCodigo(monto);
  if (donde.length) soloFaltaDesplegar = false;
  informe.push({ monto, enElCodigo: donde });
  console.error(
    `\nROJO: Bs ${monto.toLocaleString('es-BO')} pintado en el resultado y NO declarado por ninguna fuente.` +
      (donde.length
        ? `\n  Escrito a mano en: ${donde.join(', ')} → el defecto es del CODIGO, arreglarlo aca.`
        : `\n  No esta en el codigo de esta rama → produccion corre un build viejo. Falta DESPLEGAR.`),
  );
}

writeFileSync(join(OUT, 'informe.json'), JSON.stringify({ base: BASE, vistos: [...vistos], sobran: informe }, null, 2));
process.exit(soloFaltaDesplegar ? 3 : 1);
