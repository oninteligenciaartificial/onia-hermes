#!/usr/bin/env node
/**
 * Canario visual — abre las pantallas que ve un cliente, las MIRA (captura full-page)
 * y mide peso real y tiempo real.
 *
 * Un 200 no es verificación: el login de producción mostró durante días los NOMBRES de
 * los iconos como texto, "verificado" con HTTP 200 y grep. Por eso acá se captura y se
 * pesa. La captura la mira un humano (o el agente); el script solo la produce.
 *
 * Uso:
 *   node scripts/canario_visual.mjs                 # todas las pantallas
 *   node scripts/canario_visual.mjs login-plataforma
 *
 * Escribe <out>/<pantalla>.png y <out>/<pantalla>.json (peso, ms, y qué se ve).
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * LA LISTA — fuente única. El prompt del loop NO la copia: la nombra.
 *
 * Dos copias de la misma lista es exactamente cómo se llega a vigilar una pantalla que no
 * existe (o a no vigilar una que sí). Por eso el carril dueño y su cola viven acá adentro,
 * como campos, y no en una tabla paralela en el prompt.
 *
 * Orden = cuánto acerca la venta, no cuánto cuesta mirarla. Un desconocido entra por la
 * home, mira el precio, y recién después se registra.
 *
 * Ampliada el 2026-09-01: eran 5 y se quedó corta. Las 5 nuevas se verificaron vivas antes
 * de listarlas (200 medido desde el VPS, no supuesto).
 */
const PANTALLAS = [
  // --- Lo que ve un desconocido antes de decidir (onia.com.bo, contenedor `onia-landing`) ---
  { nombre: 'home', url: 'https://onia.com.bo/', cola: 'hermes-content/docs/COLA.md', duenio: 'sin dueño declarado' },
  // El precio es el dato que más se contradice en el proyecto: llegó a haber CUATRO precios
  // vivos del mismo chatbot. Si una cifra se rompe acá, se rompe la venta entera.
  { nombre: 'precios', url: 'https://onia.com.bo/precios', cola: 'hermes-content/docs/COLA.md', duenio: 'sin dueño declarado' },
  { nombre: 'empezar', url: 'https://onia.com.bo/empezar', cola: 'hermes-content/docs/COLA.md', duenio: 'sin dueño declarado' },
  // "No se le vende sólo a clínicas": son 7 rubros. Y es la banda donde ya aparecieron CINCO
  // "muy pronto" en una pantalla de venta.
  { nombre: 'rubros', url: 'https://onia.com.bo/rubros', cola: 'hermes-content/docs/COLA.md', duenio: 'sin dueño declarado' },
  { nombre: 'chatbot-landing', url: 'https://onia.com.bo/chatbot', cola: 'hermes-content/docs/COLA.md', duenio: 'sin dueño declarado' },
  { nombre: 'contacto', url: 'https://onia.com.bo/contacto', cola: 'hermes-content/docs/COLA.md', duenio: 'sin dueño declarado' },

  // --- El último clic antes de que exista una cuenta (app.onia.com.bo) ---
  // `/register` ya dejó de crear cuentas una vez y el arreglo se hizo en `/empezar`; la home
  // no se enteró y quedó prometiendo un alta que no existía. Nadie la estaba mirando.
  { nombre: 'register', url: 'https://app.onia.com.bo/register', cola: 'hermes-content/docs/COLA.md', duenio: 'onia-cola' },
  { nombre: 'login-plataforma', url: 'https://app.onia.com.bo/login', cola: 'hermes-content/docs/COLA.md', duenio: 'onia-cola' },

  // --- Chatbot ---
  { nombre: 'login-chat', url: 'https://chat.onia.com.bo/app/login', cola: 'hermes-content/docs/cola/chatbot.md', duenio: 'chatbot-cola' },
  // Detrás de sesión: sin sesión se reporta "no medida", NUNCA "OK".
  { nombre: 'panel-chatbot', url: 'https://app.onia.com.bo/settings/chatbot', cola: 'hermes-content/docs/cola/chatbot.md', duenio: 'chatbot-cola' },
];

const OUT = process.env.CANARIO_OUT || join(process.cwd(), '.canario-out');
const TIMEOUT = 60_000;
const BASE = join(process.cwd(), 'hermes-content', 'references', 'canario-visual');

/**
 * UMBRALES — cuándo el peso o el tiempo dejan de ser un dato y pasan a ser un ítem.
 *
 * Un 200 lento es un fallo con cara de éxito. El caso que originó este carril: la fuente de
 * iconos del login pesaba 3,9 MB y tardaba 117 s, y TODOS los chequeos daban verde.
 *
 * Los números salen de medir las 11 pantallas vivas desde el VPS el 2026-09-01, no de la
 * intuición: peso entre 0,3 y 2,1 MB, `msMirable` entre 170 y 293 ms.
 *
 * Se comparan a máquina y no a ojo A PROPÓSITO: diez pantallas × cuatro comparaciones es
 * justo el trabajo que una vuelta apurada saltea, y saltearlo devuelve un verde falso.
 */
const UMBRAL = {
  // Un asset gordo que entra sin querer mueve el peso MUY por encima de +40 %. Debajo de eso
  // es variación normal de la red y del CDN.
  derivaPeso: 1.4,
  // El múltiplo agarra el degrade; el piso mata el ruido. El piso NO es de intuición: tres
  // corridas seguidas de la misma home dieron 1382, 395 y 261 ms (la primera fría, las otras
  // con el CDN caliente). Con un piso de 1 s, esa corrida fría se reportaba como "el tiempo se
  // duplicó" cada vez que el canario arrancaba — un fantasma por vuelta, que es peor que no
  // medir. 2,5 s deja pasar el arranque en frío y sigue agarrando cualquier degrade real.
  derivaTiempo: 2,
  pisoTiempoMs: 2_500,
  // Techos absolutos: valen aunque no haya baseline, y son el corte que habría agarrado el bug
  // de los 3,9 MB / 117 s. Ninguna pantalla nuestra pasa hoy de 2,1 MB ni de 300 ms.
  techoPesoBytes: 4 * 1024 * 1024,
  techoTiempoMs: 8_000,
};

/**
 * Compara contra la baseline versionada. Devuelve los motivos por los que ESTO es un ítem.
 * `baseInyectada` existe sólo para el `--self-check`: en la corrida real se lee de disco.
 */
function juzgar(datos, baseInyectada) {
  const motivos = [];
  if (datos.fallo) motivos.push(`no abrió: ${datos.fallo}`);
  if (datos.status !== null && datos.status >= 400) motivos.push(`status ${datos.status}`);
  if (datos.bytes > UMBRAL.techoPesoBytes) {
    motivos.push(`techo de peso: ${(datos.bytes / 1048576).toFixed(1)} MB > 4 MB`);
  }
  if (datos.msMirable > UMBRAL.techoTiempoMs) {
    motivos.push(`techo de tiempo: ${datos.msMirable} ms > ${UMBRAL.techoTiempoMs} ms`);
  }

  let base = baseInyectada ?? null;
  if (!base) {
    try { base = JSON.parse(readFileSync(join(BASE, datos.nombre, 'baseline.json'), 'utf8')); }
    catch { return { motivos, baseline: 'sin baseline — esta vuelta la creás; una baseline nueva NO es una verificación' }; }
  }

  if (base.bytes > 0 && datos.bytes > base.bytes * UMBRAL.derivaPeso) {
    const pct = Math.round(((datos.bytes / base.bytes) - 1) * 100);
    motivos.push(`peso +${pct} % vs baseline (${(base.bytes / 1024).toFixed(0)} → ${(datos.bytes / 1024).toFixed(0)} KB)`);
  }
  if (base.msMirable > 0 && datos.msMirable > base.msMirable * UMBRAL.derivaTiempo && datos.msMirable > UMBRAL.pisoTiempoMs) {
    motivos.push(`tiempo ×${(datos.msMirable / base.msMirable).toFixed(1)} vs baseline (${base.msMirable} → ${datos.msMirable} ms)`);
  }
  const erroresViejos = new Set(base.erroresConsola || []);
  const nuevos = (datos.erroresConsola || []).filter((e) => !erroresViejos.has(e));
  if (nuevos.length) motivos.push(`error de consola nuevo: ${nuevos[0]}`);

  return { motivos, baseline: 'comparada' };
}

async function medir(browser, { nombre, url, cola, duenio }) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  let bytes = 0;
  const pesajes = [];
  const errores = [];
  // `sizes()` da bytes DE LA RED (ya comprimidos) para TODA respuesta: una sola unidad.
  //
  // Antes acá se sumaba `content-length` cuando estaba (bytes comprimidos) y el largo de
  // `body()` cuando no (bytes DESCOMPRIMIDOS). Dos unidades en el mismo total, y encima el
  // handler era `async` sin que nadie esperara sus promesas: el contexto se cerraba con
  // pesajes a medio resolver, así que el resultado dependía de cuántos alcanzaban a llegar.
  //
  // Medido el 2026-09-01 sobre la MISMA home sin cambios (el contenedor `onia-landing`
  // llevaba 4 días arriba): la baseline decía 2310 KB y tres corridas seguidas dieron
  // 582, 509 y 500 KB. Un umbral de peso sobre ese número habría disparado al azar — el
  // canario existe justamente para no reportar verde con cara de éxito.
  page.on('response', (r) => {
    pesajes.push(
      r.request().sizes()
        .then((s) => { bytes += (s.responseBodySize || 0) + (s.responseHeadersSize || 0); })
        .catch(() => { /* redirect, o request abortado: no pesa */ }),
    );
  });
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text().slice(0, 200)); });

  const t0 = Date.now();
  let status = null, fallo = null;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    status = resp?.status() ?? null;
  } catch (e) {
    fallo = String(e.message).split('\n')[0];
  }
  const msMirable = Date.now() - t0;

  // red quieta: mejor esfuerzo — una página con polling nunca la alcanza, y eso no es un fallo
  try { await page.waitForLoadState('networkidle', { timeout: 15_000 }); } catch { /* sigue */ }
  const msTotal = Date.now() - t0;

  // Recorrer la página entera antes de capturar. Sin esto, todo lo que aparece al
  // scrollear (IntersectionObserver, opacity:0) sale como bloques de color VACÍOS y la
  // captura miente en la dirección peor: parece rota una página que está sana.
  await page.evaluate(async () => {
    const paso = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  const png = join(OUT, `${nombre}.png`);
  await page.screenshot({ path: png, fullPage: true });

  const visto = {
    titulo: await page.title().catch(() => null),
    urlFinal: page.url(),
    // el texto es para DESCARTAR (p.ej. nombres de iconos crudos), nunca para confirmar
    texto: (await page.evaluate(() => document.body?.innerText || '').catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 1200),
  };

  // Esperar los pesajes pendientes ANTES de cerrar el contexto. Sin esto el total es una
  // carrera: se pierde lo que no alcanzó a resolver, y la misma página da un número distinto
  // en cada corrida.
  await Promise.all(pesajes);

  await ctx.close();
  const datos = { nombre, url, cola, duenio, status, fallo, bytes, msMirable, msTotal, erroresConsola: errores.slice(0, 10), visto };
  const veredicto = juzgar(datos);
  datos.baseline = veredicto.baseline;
  // `motivos` son las razones MECÁNICAS por las que esto ya es un ítem. Vacío NO significa
  // "OK": significa "nada que la máquina pueda ver". El ojo sigue siendo obligatorio — el
  // diff no ve un icono que dice "credit_card_off" ni un botón que promete algo falso.
  datos.motivos = veredicto.motivos;
  writeFileSync(join(OUT, `${nombre}.json`), JSON.stringify(datos, null, 2));
  return datos;
}

const filtro = process.argv.slice(2);

// `node scripts/canario_visual.mjs --self-check` — no abre ningún navegador.
// Los umbrales son la parte del canario que decide si algo es un ítem: si se rompen en
// silencio, el carril reporta verde para siempre y nadie se entera. Por eso tienen su prueba.
if (filtro.includes('--self-check')) {
  const base = { bytes: 1_000_000, msMirable: 200, erroresConsola: ['viejo'] };
  const caso = (extra) => ({ nombre: 'x', bytes: 1_000_000, msMirable: 200, status: 200, fallo: null, erroresConsola: ['viejo'], ...extra });
  const motivosDe = (extra) => juzgar(caso(extra), base).motivos;
  const afirmar = (cond, que) => { if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  afirmar(motivosDe({}).length === 0, 'una pantalla igual a su baseline no dispara nada');
  afirmar(motivosDe({ bytes: 1_390_000 }).length === 0, '+39 % de peso es ruido, no un item');
  afirmar(motivosDe({ bytes: 1_410_000 }).some((m) => m.includes('peso')), '+41 % de peso SI es un item');
  afirmar(motivosDe({ msMirable: 900 }).length === 0, '900 ms no llega al piso aunque sea 4,5x');
  // El arranque en frio medido: 1382 ms contra una baseline caliente de 261 ms. Es 5x, y NO
  // puede ser un item — si lo fuera, el canario escribiria un fantasma en cada vuelta.
  afirmar(motivosDe({ msMirable: 1_382 }).length === 0, 'el arranque en frio (1382 ms) NO es un item');
  afirmar(motivosDe({ msMirable: 3_000 }).some((m) => m.includes('tiempo')), '3 s (15x y sobre el piso) SI es un item');
  afirmar(motivosDe({ bytes: 5 * 1024 * 1024 }).some((m) => m.includes('techo de peso')), '5 MB cruza el techo absoluto');
  afirmar(motivosDe({ msMirable: 9_000 }).some((m) => m.includes('techo de tiempo')), '9 s cruza el techo absoluto');
  afirmar(motivosDe({ erroresConsola: ['viejo', 'nuevo'] }).some((m) => m.includes('consola')), 'un error de consola nuevo es un item');
  afirmar(motivosDe({ erroresConsola: ['viejo'] }).length === 0, 'un error que YA estaba en la baseline no se repite como item');
  afirmar(motivosDe({ status: 500 }).some((m) => m.includes('status')), 'un 500 es un item');
  afirmar(motivosDe({ fallo: 'timeout' }).some((m) => m.includes('no abrió')), 'una pantalla que no abre es un item');
  // El caso que originó el carril: 3,9 MB y 117 s con status 200.
  afirmar(juzgar(caso({ bytes: 3_900_000, msMirable: 117_000 }), null).motivos.length > 0, 'el bug de 3,9 MB / 117 s se agarra SIN baseline');

  // La lista de pantallas ES la cola de este carril, así que le corresponde el mismo gate que a
  // las demás: nada entra sin evidencia de que existe. `verificar_cola.js` no aplica acá (no hay
  // sección "## Ahora"), así que la parte que sí se puede comprobar en frío se comprueba acá:
  // que la cola a la que cada pantalla manda su ítem exista de verdad. Una cola mal escrita manda
  // el hallazgo a un archivo fantasma, y el ítem se pierde en silencio.
  const vistos = new Set();
  for (const p of PANTALLAS) {
    afirmar(/^https:\/\//.test(p.url), `${p.nombre}: la url tiene que ser https`);
    afirmar(!vistos.has(p.nombre), `nombre repetido en PANTALLAS: ${p.nombre}`);
    vistos.add(p.nombre);
    afirmar(Boolean(p.cola) && existsSync(p.cola), `${p.nombre}: su cola no existe -> ${p.cola}`);
    afirmar(Boolean(p.duenio), `${p.nombre}: sin dueño declarado`);
  }

  console.log(process.exitCode ? 'self-check: FALLO' : `self-check: ok — 13 casos de umbral + ${PANTALLAS.length} pantallas con cola existente`);
  process.exit(process.exitCode ?? 0);
}

const lista = filtro.length ? PANTALLAS.filter((p) => filtro.includes(p.nombre)) : PANTALLAS;
if (!lista.length) { console.error('sin pantallas que coincidan:', filtro.join(', ')); process.exit(1); }

mkdirSync(OUT, { recursive: true });
// Como root (el VPS) Chromium NO arranca con su sandbox: falla en la primera pantalla.
// En Windows/usuario normal se deja el sandbox puesto, que es lo correcto.
const esRoot = process.getuid?.() === 0;
const browser = await chromium.launch(
  esRoot ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {},
);
for (const p of lista) {
  const d = await medir(browser, p);
  const veredicto = d.motivos.length
    ? `ITEM -> ${d.cola} :: ${d.motivos.join(' | ')}`
    : `sin disparo mecanico (${d.baseline}) — MIRA la captura igual`;
  console.log(`${d.nombre}\tstatus=${d.status ?? 'X'}\t${(d.bytes / 1024).toFixed(0)} KB\t${d.msMirable} ms\t${veredicto}`);
}
await browser.close();
console.log(`\ncapturas en ${OUT}`);
