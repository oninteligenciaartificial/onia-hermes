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
  // Detrás de sesión: sin sesión se reporta "no medida", NUNCA "OK". `requiereSesion` no es
  // decorativo — es lo que hace que el canario intente entrar y que, si no puede, lo DIGA.
  { nombre: 'panel-chatbot', url: 'https://app.onia.com.bo/settings/chatbot', cola: 'hermes-content/docs/cola/chatbot.md', duenio: 'chatbot-cola', requiereSesion: true },
];

/**
 * Credenciales de sólo lectura para las pantallas detrás de sesión. Sin ellas el canario no
 * se queda pensando: mide lo que puede y marca la pantalla NO MEDIDA con el motivo.
 * Enchufarlas es un `env`, no un cambio de código.
 */
const SESION = { user: process.env.ONIA_CANARIO_USER || '', pass: process.env.ONIA_CANARIO_PASS || '' };

/**
 * ¿La página que quedó abierta es la que pedí, o me desviaron?
 *
 * Nace del 2026-09-02: `panel-chatbot` redirige a `/login` y el canario venía imprimiendo
 * `status=200 … sin disparo mecanico (comparada)` — daba por buena una pantalla que nunca
 * vio, comparándola encima contra una baseline que era la del login. Verde con cara de
 * éxito, dentro del vigilante mismo.
 *
 * Se compara host + camino: el query string y la barra final no son desvíos.
 */
/**
 * Con qué binario se saca la foto. NO es un detalle de arranque: es lo que decide qué
 * defectos ve el canario.
 *
 * `chromium.launch()` **sin `channel`** resuelve a `chromium_headless_shell`, un rasterizador
 * que dibuja un espacio DESPUÉS DE CADA `t` en los pesos finos de la fuente Archivo:
 * *"Ent regamos t u sist ema … puest a … con t us dat os"*. Eso **no lo ve ningún cliente** —
 * es del binario que captura, no del sitio.
 *
 * Lo que costó antes de arreglarse (2026-09-02): un ítem abierto tres días contra una pantalla
 * impecable, una bisección entera que culpó a la fuente ("roto en pesos ≤500, limpio en 600"),
 * y una decisión escalada a Sergio que nunca existió (radar §19). Ninguna de esas pruebas podía
 * acertar, porque **ninguna cambió el motor**.
 *
 * Medido dos veces, misma URL y mismo instante, con los dos binarios que ya están bajados en el
 * VPS (`chromium-1223` y `chromium_headless_shell-1223`, ambos rev 1223 = la que pide el
 * Playwright 1.60 de `/root/node_modules`): el shell rompe el texto, el Chromium completo lo
 * dibuja perfecto. No hay que instalar nada.
 *
 * Regla para leer un reporte futuro: si TODOS los cortes caen pegados a una `t`, es este
 * artefacto y no un defecto del producto.
 */
function opcionesDeChromium(esRoot) {
  return {
    // Pedir el Chromium COMPLETO. Sin esto el canario inventa defectos de texto en cada corrida.
    channel: 'chromium',
    // Como root (el VPS) Chromium NO arranca con su sandbox: falla en la primera pantalla.
    // En Windows/usuario normal se deja el sandbox puesto, que es lo correcto.
    ...(esRoot ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {}),
  };
}

function llegoALaPantalla(urlPedida, urlFinal) {
  try {
    const a = new URL(urlPedida), b = new URL(urlFinal);
    const camino = (u) => u.pathname.replace(/\/+$/, '') || '/';
    return a.host === b.host && camino(a) === camino(b);
  } catch { return false; }
}

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
  // Una pantalla a la que no llegué no se juzga: no es un ítem (gritaría en CADA vuelta hasta
  // que alguien apague el canario) pero tampoco puede salir como "sin disparo". Y sobre todo
  // no se compara contra su baseline: la de `panel-chatbot` guardaba los bytes del login, así
  // que el día que la sesión funcione el panel real dispararía un fantasma de peso.
  if (datos.medida === false) {
    return { motivos, noMedida: true, baseline: `NO MEDIDA — ${datos.motivoNoMedida || 'no se llegó a la pantalla'}` };
  }
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

/**
 * Entra por el formulario de `/login` de app.onia.com.bo. Devuelve null si entró, o el motivo
 * por el que no — que se escribe tal cual en el JSON: "no medida" sin motivo no se puede
 * arreglar. No lanza: una sesión que falla degrada la pantalla a NO MEDIDA, no rompe la vuelta.
 */
async function iniciarSesion(page, origen) {
  try {
    await page.goto(`${origen}/login`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.fill('input[type="email"]', SESION.user);
    await page.fill('input[type="password"]', SESION.pass);
    await Promise.all([
      page.waitForURL((u) => !/\/login/.test(u.pathname), { timeout: 30_000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    if (/\/login/.test(new URL(page.url()).pathname)) return 'las credenciales no entraron (sigue en /login)';
    return null;
  } catch (e) {
    return `no se pudo iniciar sesión: ${String(e.message).split('\n')[0]}`;
  }
}

async function medir(browser, { nombre, url, cola, duenio, requiereSesion }) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Sin credenciales NO se abandona la pantalla: se la mide igual (va a caer en el login) y el
  // desvío la marca NO MEDIDA con este motivo. El día que existan, es un `env` y nada más.
  let motivoNoMedida = null;
  if (requiereSesion) {
    motivoNoMedida = (SESION.user && SESION.pass)
      ? await iniciarSesion(page, new URL(url).origin)
      : 'faltan ONIA_CANARIO_USER / ONIA_CANARIO_PASS (credencial de sólo lectura, la da Sergio)';
  }

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

  // El chequeo que faltaba: ¿la página que capturé es la que pedí? Si me desviaron, la
  // captura y el peso son de OTRA pantalla y no valen para nada.
  // Si la página NO abrió, eso ya es un ítem (`fallo`) y manda: `null` para no degradarla a
  // NO MEDIDA, que taparía una caída real detrás de un veredicto tibio.
  const medida = fallo ? null : llegoALaPantalla(url, visto.urlFinal);
  if (medida === false && !motivoNoMedida) motivoNoMedida = `desviada a ${visto.urlFinal}`;

  const datos = { nombre, url, cola, duenio, status, fallo, bytes, msMirable, msTotal, medida, motivoNoMedida, erroresConsola: errores.slice(0, 10), visto };
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
  // Contadas, no escritas a mano: el número que se imprime dejó de coincidir con la realidad
  // en cuanto se agregaron casos, y un conteo que miente es la primera grieta de un gate.
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  // El MOTOR con el que se saca la foto decide qué defectos ve el canario, así que es un
  // umbral más y va acá. Sin `channel`, Playwright resuelve a `chromium_headless_shell`, que
  // dibuja un espacio DESPUÉS DE CADA `t` en los pesos finos de Archivo ("Ent regamos t u
  // sist ema"). Ningún cliente ve eso: es del binario que captura, no del sitio.
  afirmar(opcionesDeChromium(true).channel === 'chromium', 'como root pide el Chromium COMPLETO, no el headless shell');
  afirmar(opcionesDeChromium(false).channel === 'chromium', 'fuera de root TAMBIEN pide el Chromium completo');
  afirmar(opcionesDeChromium(true).args?.includes('--no-sandbox'), 'como root sigue arrancando sin sandbox');
  afirmar(opcionesDeChromium(false).args === undefined, 'fuera de root el sandbox queda puesto');

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

  // --- Llegué o no llegué a la pantalla que pedí ---
  // Medido el 2026-09-02: `panel-chatbot` redirige a /login y el canario imprimía
  // "sin disparo mecanico (comparada)" — o sea daba por buena una pantalla que nunca vio.
  afirmar(llegoALaPantalla('https://app.onia.com.bo/settings/chatbot', 'https://app.onia.com.bo/settings/chatbot'), 'misma url = llegué');
  afirmar(!llegoALaPantalla('https://app.onia.com.bo/settings/chatbot', 'https://app.onia.com.bo/login'), 'redirigido al login = NO llegué');
  afirmar(llegoALaPantalla('https://onia.com.bo/', 'https://onia.com.bo'), 'la barra final no es un desvío');
  afirmar(llegoALaPantalla('https://onia.com.bo/precios', 'https://onia.com.bo/precios?ref=x'), 'un query string no es un desvío');
  afirmar(!llegoALaPantalla('https://onia.com.bo/', 'https://onia.com.bo/empezar'), 'la home desviada a /empezar NO llegó');
  afirmar(!llegoALaPantalla('https://app.onia.com.bo/login', 'https://chat.onia.com.bo/login'), 'otro host = NO llegué');

  // Una pantalla no medida NO es un ítem (si lo fuera, gritaría en cada vuelta y alguien la
  // apagaría) pero TAMPOCO puede salir como "sin disparo": ésa es la mentira que se arregló.
  const noMedida = juzgar(caso({ medida: false, motivoNoMedida: 'sin credenciales' }), base);
  afirmar(noMedida.noMedida === true, 'una pantalla no medida se marca como tal');
  afirmar(noMedida.motivos.length === 0, 'no medida NO es un ítem mecánico');
  afirmar(/NO MEDIDA/.test(noMedida.baseline), 'el veredicto de una no medida dice NO MEDIDA');
  // Y no puede compararse contra la baseline de OTRA pantalla: la de `panel-chatbot` guardaba
  // los bytes del login, así que el día que la sesión funcione el panel real dispararía un
  // fantasma de peso. No se compara lo que no se midió.
  afirmar(juzgar(caso({ medida: false, bytes: 99_000_000 }), base).motivos.length === 0, 'no medida no compara peso contra una baseline ajena');

  // Una pantalla que NO ABRE sigue siendo un ítem: `medir` le pone `medida: null` justamente
  // para que el atajo de arriba no le tape la caída. Si esto se rompe, una caída real de
  // producción sale como un "no medida" tibio y nadie la mira.
  afirmar(juzgar(caso({ fallo: 'timeout', medida: null }), base).motivos.some((m) => m.includes('no abrió')), 'una pantalla caída es ITEM, no "no medida"');

  // La lista declara qué pantallas viven detrás de sesión: sin el campo, la de mañana se
  // agrega y vuelve a mentir en silencio.
  afirmar(PANTALLAS.some((p) => p.requiereSesion), 'al menos una pantalla se declara detrás de sesión');

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

  console.log(process.exitCode ? 'self-check: FALLO' : `self-check: ok — ${casos} casos sobre ${PANTALLAS.length} pantallas`);
  process.exit(process.exitCode ?? 0);
}

const lista = filtro.length ? PANTALLAS.filter((p) => filtro.includes(p.nombre)) : PANTALLAS;
if (!lista.length) { console.error('sin pantallas que coincidan:', filtro.join(', ')); process.exit(1); }

mkdirSync(OUT, { recursive: true });
// Como root (el VPS) Chromium NO arranca con su sandbox: falla en la primera pantalla.
// En Windows/usuario normal se deja el sandbox puesto, que es lo correcto.
const esRoot = process.getuid?.() === 0;
const browser = await chromium.launch(opcionesDeChromium(esRoot));
for (const p of lista) {
  const d = await medir(browser, p);
  const veredicto = d.motivos.length
    ? `ITEM -> ${d.cola} :: ${d.motivos.join(' | ')}`
    : d.medida === false
      ? `NO MEDIDA :: ${d.motivoNoMedida} — la captura es de OTRA pantalla, no la mires como si fuera esta`
      : `sin disparo mecanico (${d.baseline}) — MIRA la captura igual`;
  console.log(`${d.nombre}\tstatus=${d.status ?? 'X'}\t${(d.bytes / 1024).toFixed(0)} KB\t${d.msMirable} ms\t${veredicto}`);
}
await browser.close();
console.log(`\ncapturas en ${OUT}`);
