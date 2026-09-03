#!/usr/bin/env node
/**
 * Recorrido de cliente — camina el producto de punta a punta como lo haría un negocio real
 * y dice HASTA QUÉ PASO llegó, con una captura por paso.
 *
 * POR QUÉ EXISTE: el canario visual mira diez pantallas SUELTAS. Diez pantallas verdes y un
 * camino partido al medio es exactamente la forma que tiene un producto de perder plata sin
 * que salte una alarma. Un cliente no mira pantallas: entra, pide acceso, entra, elige su
 * rubro, carga un dato, intenta pagar y abre la bandeja. Ese camino no lo recorría nadie.
 *
 * Uso:
 *   node scripts/recorrido_cliente.mjs              # recorrido completo, SIN escribir en la base
 *   node scripts/recorrido_cliente.mjs --escribir   # además ENVÍA el alta (crea fila zz-qa- real)
 *
 * Escribe hermes-content/docs/recorrido/capturas/paso-NN-<nombre>.png y un resumen.json.
 *
 * 🔴 ESTE SCRIPT TOCA LA BASE DE PRODUCCIÓN. No hay ambiente de prueba: `access_requests`
 * guarda el único lead real que entró por Instagram. Por eso `--escribir` es OPT-IN y está
 * apagado por defecto — el loop corre 8 veces por día y no puede dejar ocho filas diarias de
 * basura en la misma tabla donde vive ese lead. Todo lo que se crea lleva prefijo `zz-qa-`,
 * que es lo único que hace el borrado seguro después (un DELETE sin `zz-qa-` en el WHERE está
 * prohibido).
 *
 * 🔴 NUNCA se completa un pago. El paso 7 llega a la pantalla de cobro, la MIRA y FRENA.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const OUT = process.env.RECORRIDO_OUT || join(RAIZ, 'hermes-content', 'docs', 'recorrido', 'capturas');
const ESCRIBIR = process.argv.includes('--escribir');

const LANDING = 'https://onia.com.bo';
const APP = 'https://app.onia.com.bo';
const TIMEOUT = 45_000;

/**
 * La marca de todo lo que este script crea. Es lo único que después hace que el borrado sea
 * seguro: sin prefijo, la fila es indistinguible de un lead real y ya no se puede tocar.
 * Lleva la fecha para poder identificar de qué vuelta salió sin abrir un log.
 */
// 🔴 Lleva la HORA, no sólo la fecha. Con `zz-qa-<fecha>` a secas, dos corridas del mismo día
// chocan con el correo ya registrado — y ese choque no se ve: el alta devuelve 200, la pantalla
// no muestra NI éxito NI error, y el login siguiente rebota con "Invalid login credentials".
// Medido el 2026-09-03: el recorrido diagnosticaba un login roto sobre una colisión suya.
// El alta es la puerta de entrada del producto: cada corrida tiene que ejercerla de verdad.
const HOY = new Date().toISOString().slice(0, 10);
const SELLO = `${HOY}-${new Date().toISOString().slice(11, 16).replace(':', '')}`;
const QA = {
  nombre: `zz-qa-${SELLO}`,
  negocio: `zz-qa-${SELLO}-negocio`,
  email: `zz-qa-${SELLO}@onia.com.bo`,
  whatsapp: '59170000000',
  ciudad: 'zz-qa-ciudad',
  password: `zz-qa-${HOY}-Passw0rd!`,
  // El dato del rubro que carga el paso 6. Va con prefijo como todo lo demás: es una fila más
  // en la base de PRODUCCIÓN y hay que poder borrarla sin dudar de cuál es.
  paciente: `zz-qa-${SELLO}-paciente`,
};

/**
 * Credenciales de una cuenta YA EXISTENTE. Son el ÚLTIMO recurso, no el primero: con
 * `--escribir` el recorrido entra con la cuenta que acaba de crear, que es lo que hace un
 * cliente de verdad. Sin ellas y sin `--escribir`, los pasos 4-8 se reportan NO MEDIDOS.
 */
const SESION = {
  user: process.env.RECORRIDO_USER || '',
  pass: process.env.RECORRIDO_PASS || '',
};

/**
 * Con qué binario se saca la foto. NO es un detalle de arranque.
 *
 * `chromium.launch()` sin `channel` resuelve a `chromium_headless_shell`, el rasterizador que
 * durante tres días le hizo reportar al canario visual texto roto que nunca existió
 * ("Ent regamos t u sist ema"). Se pide el Chromium COMPLETO a propósito.
 * Y como root (el VPS) Chromium no arranca con su sandbox: sin `--no-sandbox` no abre y la
 * vuelta se pierde creyendo que el sitio está caído.
 */
const OPCIONES_CHROMIUM = {
  channel: 'chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
};

/**
 * Revela la página y la captura.
 *
 * `screenshot({fullPage:true})` MIENTE en onia.com.bo: las secciones se revelan con
 * IntersectionObserver y fullPage no dispara el scroll, así que devuelve tiras en blanco.
 * Ya estuvo a punto de costar un reporte de "hay un hueco gigante en la pantalla" sobre una
 * pantalla perfecta. Acá se hace el scroll de verdad primero, y recién después la foto.
 *
 * Y como una captura tampoco se puede auditar sola, se devuelve además la medida del DOM:
 * cuánto texto quedó visible y cuántas secciones siguen invisibles. Si la foto sale vacía
 * pero el DOM tiene texto, el que miente es el instrumento.
 */
async function mirar(page, archivo) {
  const alto = page.viewportSize()?.height || 900;
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += Math.round(alto * 0.9)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(350);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const dom = await page.evaluate(() => {
    const secciones = [...document.querySelectorAll('section, main > div, header, footer')];
    const invisibles = secciones.filter((s) => {
      const st = getComputedStyle(s);
      return st.opacity === '0' || st.visibility === 'hidden';
    }).length;
    return {
      textoVisible: (document.body.innerText || '').trim().length,
      secciones: secciones.length,
      seccionesInvisibles: invisibles,
      titulo: document.title,
    };
  });

  const ruta = join(OUT, archivo);
  await page.screenshot({ path: ruta, fullPage: true });
  return { captura: `hermes-content/docs/recorrido/capturas/${archivo}`, dom };
}

/**
 * Qué está TAPANDO la pantalla, si hay algo.
 *
 * 🔴 Nace del segundo falso verde de este carril (2026-09-03): los pasos 6, 7 y 8 cantaron
 * "pantalla a la vista" sobre una pantalla cubierta por el modal "Primeros pasos" —1440×900,
 * `fixed inset-0 z-[60]`, el 100 % del viewport—. `llegar()` comparaba la URL y ahí se detenía,
 * así que estar en `/billing` y no ver un solo píxel de `/billing` daba OK igual.
 *
 * Es el mismo pecado del falso verde anterior, una capa más arriba: antes no se miraba DÓNDE se
 * estaba; ahora no se miraba SI SE VE ALGO. Comparar la URL no dice que la pantalla se vea.
 *
 * Se cuenta como tapa sólo lo `fixed` que cubre ≥50 % del viewport: los `sticky` (cabecera, menú
 * lateral) son parte del producto y no tapan nada.
 */
async function queTapa(page) {
  return page.evaluate(() => {
    const tapas = [];
    for (const el of document.querySelectorAll('body *')) {
      const st = getComputedStyle(el);
      if (st.position !== 'fixed') continue;
      if (st.visibility === 'hidden' || st.opacity === '0' || st.display === 'none') continue;
      const r = el.getBoundingClientRect();
      const cubre = (r.width * r.height) / (innerWidth * innerHeight);
      if (cubre < 0.5) continue;
      tapas.push({
        cubre: Math.round(cubre * 100),
        clase: (el.className || '').toString().slice(0, 60),
        texto: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      });
    }
    return tapas[0] || null;
  });
}

/**
 * Cierra lo que el producto pone encima de una cuenta recién creada.
 *
 * El modal "Primeros pasos" NO es un bug: `GuiaInicio.tsx:69` lo abre una vez por usuario y al
 * cerrarlo queda cerrado (`localStorage`). Pero este script arranca un contexto de navegador
 * limpio en cada corrida, así que lo ve SIEMPRE. Un cliente lo cierra y sigue; el instrumento
 * tiene que hacer lo mismo antes de fotografiar, o fotografía el modal ocho veces.
 *
 * Se aprieta el botón que ofrece el propio producto ("Cerrar por ahora"), no se borra el nodo
 * por JS: esconder el overlay a mano probaría que sé usar `display:none`, no que el cliente
 * pueda salir de ahí.
 */
async function despejar(page) {
  const salidas = [/Cerrar por ahora/i, /^Cerrar$/i];
  for (const nombre of salidas) {
    const b = page.getByRole('button', { name: nombre });
    if (!(await b.count().catch(() => 0))) continue;
    await b.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(900);
    if (!(await queTapa(page))) return true;
  }
  return false;
}

/** Abre una URL midiendo tiempo real. Un 200 que tarda dos minutos es un fallo con cara de éxito. */
async function ir(page, url) {
  const t0 = Date.now();
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
  await page.waitForLoadState('networkidle', { timeout: TIMEOUT }).catch(() => {});
  return { status: resp?.status() ?? 0, ms: Date.now() - t0, urlFinal: page.url() };
}

/**
 * Abre una ruta y EXIGE haber llegado a ella.
 *
 * 🔴 Nace del falso verde del 2026-09-03, y es el peor que tuvo este carril: los pasos 5 a 8
 * pedían /onboarding, /patients, /billing y /dashboard, el producto redirigía las cuatro a
 * /onboarding —porque el onboarding es obligatorio y estaba sin terminar— y como las cuatro
 * respondían 200, el script cantó "RECORRIDO COMPLETO: los 8 pasos". Vio UNA pantalla cuatro
 * veces y la contó como cuatro. Ese mensaje estuvo a un paso de irse a Telegram como la
 * noticia del carril.
 *
 * Un 200 no dice DÓNDE estás. Comparar la URL final con la pedida sí, y es la diferencia entre
 * "recorrí el producto" y "me quedé en la puerta cuatro veces".
 */
async function llegar(page, ruta, archivo) {
  const r = await ir(page, `${APP}${ruta}`);
  // Primero se despeja lo que el producto puso encima, y RECIÉN entonces se fotografía. Al
  // revés, la foto es del modal y no de la pantalla que este paso dice haber visto.
  const despejo = await despejar(page);
  const tapa = await queTapa(page);
  const vista = await mirar(page, archivo);
  const destino = new URL(page.url()).pathname.replace(/\/$/, '');
  const pedida = ruta.replace(/\/$/, '');
  const llego = destino === pedida && !tapa;
  return { ...r, ...vista, destino, pedida, llego, tapa, despejo };
}

/**
 * Abre el enlace de confirmación del correo, que es el paso que el cliente hace en su buzón.
 *
 * POR QUÉ EXISTE: el alta crea la cuenta pero NO deja entrar hasta confirmar el correo
 * (`GOTRUE_MAILER_AUTOCONFIRM=false`); el primer login rebota con `email_not_confirmed`. Sin
 * esto el recorrido moría en el paso 4 para siempre y los pasos 5-8 nunca se medían — no por
 * un fallo del producto, sino porque al instrumento le falta un buzón.
 *
 * QUÉ NO HACE: no toca `email_confirmed_at`. Poner esa columna a mano sería fingir justo el
 * paso que se está midiendo — y dejaría de avisar el día que el correo NO salga. Acá se usa el
 * mismo token que viajó en el mail, y se abre en el mismo navegador, igual que el cliente.
 * El WHERE lleva el prefijo zz-qa- y es un SELECT: no escribe nada.
 */
async function confirmarComoElCliente(page, email) {
  if (!email.startsWith('zz-qa-')) return { ok: false, detalle: 'sólo se confirma una cuenta zz-qa-' };
  let token = '';
  try {
    token = execFileSync('docker', [
      'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc',
      `SELECT confirmation_token FROM auth.users WHERE email = '${email}' AND email LIKE 'zz-qa-%'`,
    ], { encoding: 'utf8', timeout: 20_000 }).trim();
  } catch (e) {
    return { ok: false, detalle: `no se pudo leer el token de confirmación: ${e.message}` };
  }
  if (!token) return { ok: false, detalle: 'la cuenta no tiene token de confirmación pendiente' };

  // El enlace del mail, tal cual lo arma GoTrue (GOTRUE_MAILER_URLPATHS_CONFIRMATION).
  //
  // ⚠️ Va `token=`, NO `token_hash=`. Medido con curl contra el endpoint real: con `token_hash`
  // contesta 400 "Verify requires a token or a token hash" —que se lee como si el proxy comiera
  // la query, y NO es eso—; con `token` procesa y redirige. Un nombre de parámetro mal elegido
  // acusaba de roto un enlace de confirmación que funciona.
  const enlace = `${APP}/supabase/auth/v1/verify?token=${encodeURIComponent(token)}&type=signup&redirect_to=${encodeURIComponent(APP + '/')}`;
  await page.goto(enlace, { waitUntil: 'domcontentloaded', timeout: TIMEOUT }).catch(() => {});
  await page.waitForTimeout(4000);
  await mirar(page, 'paso-04a-confirmar-correo.png');

  let confirmado = false;
  try {
    confirmado = execFileSync('docker', [
      'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc',
      `SELECT email_confirmed_at IS NOT NULL FROM auth.users WHERE email = '${email}' AND email LIKE 'zz-qa-%'`,
    ], { encoding: 'utf8', timeout: 20_000 }).trim() === 't';
  } catch { /* si no se puede releer, manda el login siguiente */ }

  return {
    ok: confirmado,
    detalle: confirmado
      ? `correo confirmado abriendo el enlace del mail; quedó en ${page.url()}`
      : `el enlace de confirmación no confirmó la cuenta; quedó en ${page.url()}`,
    url: page.url(),
  };
}

/**
 * Por qué un `llegar()` no llegó. Separa las dos causas, que piden arreglos distintos: o el
 * producto te mandó a otro lado (desvío), o estás en la pantalla correcta y no se ve (tapada).
 */
function motivoNoLlego(v, ctx, comoSeLlama) {
  if (v.tapa) {
    return `se llegó a ${v.destino} pero la pantalla NO se ve: "${v.tapa.texto}" la cubre al ${v.tapa.cubre} % y no se pudo cerrar`;
  }
  return motivoDesvio(v, ctx, comoSeLlama);
}

/**
 * Traduce un desvío a una frase que se pueda leer sin abrir el código, y —sobre todo— que NO
 * culpe al producto de algo que no hizo. Que /billing te mande al onboarding no es "el cobro
 * está roto": es "todavía no llegaste al cobro". La diferencia es un ítem de cola falso.
 */
function motivoDesvio(v, ctx, comoSeLlama) {
  if (/onboarding/.test(v.destino)) {
    return `no se llegó hasta ${comoSeLlama}: pedí ${v.pedida} y el producto redirigió a ${v.destino}. El onboarding es obligatorio y sigue sin completarse — NO es que la pantalla esté rota, es que el camino no llega hasta ahí`;
  }
  if (/login/.test(v.destino)) return `no se llegó hasta ${comoSeLlama}: pedí ${v.pedida} y volvió al login — la sesión se cayó a mitad del recorrido`;
  return `no se llegó hasta ${comoSeLlama}: pedí ${v.pedida} y terminé en ${v.destino}`;
}

/**
 * El menú que el producto le muestra a ESTE rubro, leído de la pantalla.
 *
 * POR QUÉ EXISTE: el producto se vende como "se adapta a tu rubro: pantallas, vocabulario y
 * agentes a tu medida". Si eso es cierto, un comercio no ve las mismas pantallas que una
 * clínica — y un recorrido que navega a rutas fijas mide el rubro con el que se lo escribió,
 * no el que está probando. Lo único que un cliente puede usar es lo que el menú le ofrece.
 */
async function descubrirMenu(page) {
  await llegar(page, '/dashboard', 'paso-06-menu.png');
  return page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/"]')]
      .map((a) => ({
        ruta: new URL(a.href).pathname.replace(/\/$/, ''),
        texto: (a.innerText || '').replace(/\s+/g, ' ').trim(),
      }))
      .filter((x) => x.texto && x.ruta && x.ruta !== '/dashboard' && !/^\/(login|logout|onboarding)/.test(x.ruta))
      .filter((x, i, arr) => arr.findIndex((y) => y.ruta === x.ruta) === i)
  );
}

/**
 * De todo el menú, cuál es la pantalla donde este rubro carga el dato central de su negocio.
 *
 * Se elige por lo que el enlace DICE, no por la ruta: el vocabulario por rubro es una promesa
 * del producto (`lib/onboarding/vocabulario.ts`), así que un comercio debería decir "Productos"
 * o "Clientes" donde una clínica dice "Pacientes". Si ninguna coincide, el paso sale rojo con
 * el menú completo — que es el dato que sirve para decidir si falta la pantalla o falta el mapa.
 */
function pantallaDelDato(menu, rubro) {
  const PORRUBRO = {
    'Clínica dental': [/paciente/i],
    'Comercio / tienda': [/producto|cat[áa]logo|art[íi]culo/i, /cliente/i],
    'Importadora / distribuidora': [/producto|cat[áa]logo|art[íi]culo/i, /cliente/i],
    'Estética y spa': [/client[ae]/i, /paciente/i],
    'Servicios profesionales': [/client[ae]/i, /paciente/i],
  };
  // El genérico va SIEMPRE al final: si el mapa del rubro falla, todavía se puede cargar algo,
  // pero el detalle va a decir por cuál pantalla se entró y eso queda a la vista en el informe.
  const patrones = [...(PORRUBRO[rubro] || []), /paciente|client[ae]|producto|cat[áa]logo/i];
  for (const p of patrones) {
    const hit = menu.find((m) => p.test(m.texto));
    if (hit) return hit;
  }
  return null;
}

/** Lo que dice el botón que GUARDA un alta. Se usa para encontrar el formulario y para enviarlo. */
const GUARDAR = /guardar|crear|registrar|a[ñn]adir|agregar/i;
/** El selector del formulario ya acotado. Marcarlo en el DOM es lo que permite no salirse de él. */
const EN_FORM = '[data-recorrido-form] input:not([type=hidden]), [data-recorrido-form] textarea';

/**
 * Acota el formulario de alta al pedazo de pantalla que lo contiene, y lo marca en el DOM.
 *
 * 🔴 NACE DEL FALSO ROJO DEL 2026-09-03, y es el peor que tuvo este paso: en comercio el alta
 * es un modal encima de la lista, y detrás del modal sigue visible el buscador
 * («Buscar productos…»). Llenar "el primer campo de texto de la PÁGINA" escribía el dato en el
 * BUSCADOR —se ve en `paso-06b-alta-dato.png`, con el `zz-qa-…` arriba, en la lupa— y el
 * formulario se enviaba vacío. El informe salía "el Catálogo no tiene botón de guardar" con
 * «Guardar producto» a la vista: una acusación falsa al producto, firmada por el instrumento.
 *
 * La raíz se deduce del BOTÓN DE GUARDAR hacia arriba, no de una clase CSS ni de `role=dialog`
 * (medido: este modal no lo declara). Es la única definición que sirve en los 7 rubros: el
 * formulario es lo que está alrededor del botón que lo envía.
 */
async function acotarFormulario(page, guardarSrc) {
  return page.evaluate((src) => {
    const GUARDA = new RegExp(src, 'i');
    const visible = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
    document.querySelectorAll('[data-recorrido-form]').forEach((el) => el.removeAttribute('data-recorrido-form'));
    const botones = [...document.querySelectorAll('button, input[type=submit]')].filter(visible);
    const guardar = botones.find((b) => GUARDA.test((b.innerText || b.value || '').replace(/\s+/g, ' ').trim()));
    const nombres = botones.map((b) => (b.innerText || b.value || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (!guardar) return { hayGuardar: false, botones: nombres };
    const conCampos = (n) => [...n.querySelectorAll('input:not([type=hidden]), textarea')].some(visible);
    let raiz = guardar.closest('form');
    if (!raiz) {
      let n = guardar.parentElement;
      while (n && n !== document.body) {
        if (conCampos(n)) { raiz = n; break; }
        n = n.parentElement;
      }
    }
    (raiz || document.body).setAttribute('data-recorrido-form', '1');
    return {
      hayGuardar: true,
      acotado: !!raiz,
      guardarTexto: (guardar.innerText || guardar.value || '').replace(/\s+/g, ' ').trim(),
      botones: nombres,
    };
  }, guardarSrc);
}

/**
 * Llena el formulario YA ACOTADO descubriendo sus campos, y devuelve qué llenó.
 *
 * POR QUÉ NO SE HARDCODEA: cada rubro tiene su propio formulario. Un selector fijo
 * (`input[placeholder="Ej: Juan Carlos Mamani"]`) sólo existe en dental; en comercio no llena
 * nada y el envío sale vacío, que se parece muchísimo a un producto que no guarda. Los números
 * van en 1 y no en un precio inventado: acá no se fabrica un dato que después alguien lea como
 * real. El honeypot se saltea igual que en el alta.
 */
async function llenarFormulario(page, dato) {
  // ⚠️ El índice tiene que salir de la MISMA colección que después se localiza. Contar sobre
  // `input, textarea, select` y localizar sobre `input, textarea` corre los índices en cuanto
  // el formulario tiene un desplegable: se llena el campo de al lado y el informe dice otra cosa.
  // Por eso acá se indexa TODA la colección y se descarta al llenar, nunca al contar.
  const campos = await page.evaluate((sel) =>
    [...document.querySelectorAll(sel)].map((el, i) => ({
      i,
      tag: el.tagName.toLowerCase(),
      tipo: el.type || '',
      name: el.name || '',
      placeholder: el.placeholder || '',
      etiqueta: el.getAttribute('aria-label') || '',
      requerido: el.required,
      visible: el.offsetParent !== null || el.getClientRects().length > 0,
    })), EN_FORM
  );
  const HONEYPOT = /sitioweb|website|honey/i;
  // Un buscador es un campo de texto más, y en el modal de comercio está a un `nth()` de
  // distancia del nombre del producto. Escribir ahí no da error: filtra la lista y sigue.
  const BUSCADOR = /buscar|search|filtrar/i;
  let nombreCargado = false;
  for (const c of campos) {
    const seña = `${c.name} ${c.placeholder} ${c.etiqueta}`;
    if (!c.visible) continue;
    if (HONEYPOT.test(seña) || BUSCADOR.test(seña) || c.tipo === 'search') continue;
    if (['checkbox', 'radio', 'file', 'submit', 'button'].includes(c.tipo)) continue;
    const loc = page.locator(EN_FORM).nth(c.i);
    if (!(await loc.count().catch(() => 0))) continue;
    let valor = null;
    if (!nombreCargado && (c.tag === 'textarea' || ['text', ''].includes(c.tipo))) {
      valor = dato;
      nombreCargado = true;
    } else if (c.requerido && c.tipo === 'number') valor = '1';
    else if (c.requerido && c.tipo === 'email') valor = QA.email;
    else if (c.requerido && c.tipo === 'tel') valor = QA.whatsapp;
    else if (c.requerido && (c.tag === 'textarea' || ['text', ''].includes(c.tipo))) valor = dato;
    if (valor === null) continue;
    await loc.fill(valor).catch(() => {});
  }
  return { nombreCargado, campos };
}

/**
 * En qué pantalla del asistente de alta está parado, leído del DOM.
 *
 * El onboarding NO es una pantalla: es un asistente de seis (pregunta → buscando → negocio →
 * horarios → servicios → equipo → listo). Una secuencia de clics a ciegas contra posiciones
 * fijas se rompe el día que se agrega un paso, y encima miente: reporta "completado" porque
 * apretó cuatro botones. Se pregunta DÓNDE se está antes de cada clic.
 */
async function subPasoOnboarding(page) {
  return page.evaluate(() => {
    const texto = document.body.innerText || '';
    const h1 = (document.querySelector('h1')?.innerText || '').replace(/\s+/g, ' ').trim();
    const barra = document.querySelector('[role=progressbar]');
    const numero = barra ? Number(barra.getAttribute('aria-valuenow')) : 0;
    let cual = 'desconocido';
    if (/ya está en Onia/i.test(texto)) cual = 'listo';
    else if (/cómo se llama tu negocio/i.test(h1)) cual = 'pregunta';
    else if (/^buscando/i.test(h1)) cual = 'buscando';
    else if (numero >= 1) cual = `asistente-${numero}`;
    return { cual, h1, numero };
  });
}

/**
 * Completa el alta del negocio como lo haría su dueño, y devuelve la TRAZA de lo que hizo.
 *
 * 🔴 NO aprieta "Buscar mi negocio". Ese botón sale a internet a extraer el perfil del negocio
 * desde su web o sus redes, y este loop corre 8 veces por día: dispararlo sería gasto recurrente
 * buscando un negocio que no existe. Se toma el otro camino que el PRODUCTO ya ofrece
 * ("Completar el formulario"), que es el mismo asistente sin la búsqueda.
 *
 * 🔴 Y devuelve traza —una línea por pantalla, con qué vio y qué apretó— porque sin eso un
 * asistente que se planta en el sub-paso 3 se reporta igual que uno que nunca arrancó. Adivinar
 * cuál de los dos fue ya costó una semana en otro carril.
 */
async function completarOnboarding(page) {
  const traza = [];
  const apretar = async (patron, comoSeLlama) => {
    const boton = page.getByRole('button', { name: patron }).first();
    await boton.click({ timeout: 10_000 });
    await page.waitForTimeout(1800);
    return comoSeLlama;
  };

  // Tope de vueltas: el asistente tiene 6 pantallas; 12 deja margen para un reintento y corta
  // en seco si el producto entra en un bucle. Un instrumento colgado no reporta nada.
  for (let vuelta = 0; vuelta < 12; vuelta++) {
    const donde = await subPasoOnboarding(page);

    if (donde.cual === 'listo') {
      traza.push({ pantalla: 'listo', vio: donde.h1, apreto: '—' });
      return { traza, cerro: true };
    }

    try {
      if (donde.cual === 'pregunta') {
        traza.push({ pantalla: 'pregunta', vio: donde.h1, apreto: await apretar(/completar el formulario/i, 'Completar el formulario') });
      } else if (donde.cual === 'buscando') {
        // No debería pasar (nunca se aprieta buscar), pero si el producto entra solo, se sale.
        traza.push({ pantalla: 'buscando', vio: donde.h1, apreto: await apretar(/cancelar|completar/i, 'salir de la búsqueda') });
      } else if (donde.cual === 'asistente-1') {
        // "Continuar" sólo se habilita con un nombre de 2+ letras. Viene precargado del alta;
        // si no vino, se escribe, porque quedarse mirando un botón gris no es un hallazgo.
        const seguir = page.getByRole('button', { name: /^continuar/i }).first();
        if (await seguir.isDisabled().catch(() => false)) {
          await page.locator('input[type=text]').first().fill(QA.negocio).catch(() => {});
          await page.waitForTimeout(500);
        }
        traza.push({ pantalla: 'negocio', vio: donde.h1, apreto: await apretar(/^continuar/i, 'Continuar') });
      } else if (donde.cual === 'asistente-2' || donde.cual === 'asistente-3') {
        // Horarios y servicios son opcionales para el producto: se saltan igual que los saltaría
        // alguien apurado. Es el camino MÍNIMO hasta tener cuenta usable, que es lo que se mide.
        traza.push({ pantalla: donde.cual, vio: donde.h1, apreto: await apretar(/saltar por ahora/i, 'Saltar por ahora') });
      } else if (donde.cual === 'asistente-4') {
        // El último salto es el que CIERRA el alta (manda el POST sin miembro de equipo).
        traza.push({ pantalla: 'equipo', vio: donde.h1, apreto: await apretar(/saltar por ahora/i, 'Saltar por ahora (cierra el alta)') });
        await page.waitForTimeout(4000);
      } else {
        traza.push({ pantalla: 'desconocida', vio: donde.h1 || '(sin título)', apreto: '—' });
        return { traza, cerro: false, motivo: `el asistente mostró una pantalla que no sé leer: "${donde.h1 || 'sin título'}"` };
      }
    } catch (e) {
      traza.push({ pantalla: donde.cual, vio: donde.h1, apreto: `FALLÓ: ${e.message.split('\n')[0]}` });
      return { traza, cerro: false, motivo: `se plantó en "${donde.h1 || donde.cual}": no pudo apretar el botón que sigue` };
    }
  }
  return { traza, cerro: false, motivo: 'el asistente no terminó en 12 pantallas: puede estar en bucle' };
}

/**
 * LOS PASOS. En orden, y el recorrido FRENA en el primero que no sale bien: saber hasta dónde
 * llega un cliente es justamente el dato que este carril produce.
 *
 * Cada paso devuelve estado:
 *   'ok'        — pasó, se sigue
 *   'roto'      — el producto falla acá. Frena y este es el hallazgo.
 *   'no-medido' — no se pudo llegar por una razón conocida (falta cuenta). Frena, pero NO es
 *                 un fallo del producto: es el límite del recorrido y se dice tal cual.
 */
const PASOS = [
  {
    n: 1,
    nombre: 'home',
    que: 'Entrar a onia.com.bo y que se VEA',
    async correr(page, ctx) {
      const r = await ir(page, `${LANDING}/`);
      const vista = await mirar(page, 'paso-01-home.png');
      ctx.home = { ...r, ...vista };
      if (r.status !== 200) return { estado: 'roto', detalle: `la home devolvió ${r.status}`, ...vista };
      if (vista.dom.textoVisible < 200) {
        return { estado: 'roto', detalle: `la home cargó pero está casi vacía (${vista.dom.textoVisible} caracteres de texto)`, ...vista };
      }
      return { estado: 'ok', detalle: `cargó en ${r.ms} ms, ${vista.dom.textoVisible} caracteres visibles`, ...vista };
    },
  },

  {
    n: 2,
    nombre: 'camino-de-alta',
    que: 'Encontrar el camino de alta desde la home: qué botón promete qué',
    async correr(page, ctx) {
      // La promesa contra la entrega. Se leen TODOS los enlaces que un lead interpretaría como
      // "acá me doy de alta", con su texto exacto: un botón que dice "Probá 14 días gratis"
      // apuntando a un formulario de solicitud es la fricción más cara del sitio.
      const ctas = await page.evaluate(() => {
        const pinta = /\b(empez|registr|prob[aá]|gratis|acceso|crear cuenta|cuenta|demo|comenzar|arranc)/i;
        const destino = /\/(empezar|register|registro|signup|contacto|demo)/i;
        return [...document.querySelectorAll('a[href], button')]
          .map((el) => ({
            texto: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim(),
            href: el.getAttribute('href') || '',
          }))
          .filter((c) => c.texto && (pinta.test(c.texto) || destino.test(c.href)))
          .filter((c, i, a) => a.findIndex((o) => o.texto === c.texto && o.href === c.href) === i);
      });
      ctx.ctas = ctas;

      // La promesa: ¿alguno dice que te registrás y usás el sistema, cuando el destino es una
      // solicitud? Eso es un hallazgo aunque el camino "funcione".
      const prometenUso = ctas.filter((c) => /\b(prob[aá]|gratis|14 d[ií]as|registr|crear cuenta)/i.test(c.texto));
      ctx.prometenUso = prometenUso;

      const alta = ctas.find((c) => /\/empezar/.test(c.href)) || ctas.find((c) => /\/register/.test(c.href)) || ctas[0];
      if (!alta) return { estado: 'roto', detalle: 'la home no ofrece ningún camino de alta reconocible' };

      // 🔴 El camino de alta NO es una pantalla, es una CADENA — y por creer que era una sola
      // el recorrido se plantó (2026-09-02): tomó `/empezar` por el formulario, contó cero
      // campos y reportó "el alta no crea cuenta". `/empezar` es una landing intermedia; el
      // formulario real vive un clic más adelante, en otro host. Un recorrido que no sigue la
      // cadena entera miente sobre dónde termina el cliente.
      const cadena = [`${LANDING}/`, new URL(alta.href, LANDING).toString()];
      await ir(page, cadena[1]);
      const salto = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          .map((el) => ({ texto: (el.innerText || '').replace(/\s+/g, ' ').trim(), href: el.getAttribute('href') || '' }))
          .find((c) => /register|signup|registro/i.test(c.href))
      );
      if (salto) cadena.push(new URL(salto.href, cadena[1]).toString());
      ctx.cadena = cadena;
      ctx.urlAlta = cadena[cadena.length - 1];

      const vista = await mirar(page, 'paso-02-camino-de-alta.png');
      return {
        estado: 'ok',
        detalle: `${ctas.length} botones de alta; el camino es "${alta.texto}" y son ${cadena.length - 1} clics: ${cadena.join(' → ')}`,
        cadena,
        clicsHastaElFormulario: cadena.length - 1,
        ctas,
        prometenUso,
        ...vista,
      };
    },
  },

  {
    n: 3,
    nombre: 'pedir-acceso',
    que: 'Pedir acceso / registrarse con datos zz-qa-',
    async correr(page, ctx) {
      const r = await ir(page, ctx.urlAlta);
      if (r.status !== 200) {
        const vista = await mirar(page, 'paso-03-pedir-acceso.png');
        return { estado: 'roto', detalle: `el camino de alta devolvió ${r.status}`, ...vista };
      }

      // El alta es un asistente de DOS pasos: primero el rubro, después la cuenta. Si no hay
      // campos pero sí tarjetas de rubro, todavía no llegué al formulario: hay que elegir.
      // (Ojo al orden real del producto: el rubro se elige DENTRO del alta, no después.)
      const leerCampos = () => page.evaluate(() =>
        [...document.querySelectorAll('input, select, textarea')]
          .filter((el) => el.type !== 'hidden')
          .map((el) => ({ tag: el.tagName.toLowerCase(), tipo: el.type || '', name: el.name || '', id: el.id || '', placeholder: el.placeholder || '', requerido: el.required }))
      );
      // 🔴 Acá el clic del rubro se tragaba su propio error (`.catch(() => {})`) y seteaba
      // `ctx.rubroElegido` igual. Pedir un rubro que no existe daba RECORRIDO COMPLETO
      // "en comercio" habiendo recorrido dental: el falso verde exacto que este carril caza.
      // Ahora el rubro se elige contra la lista REAL que ofrece la pantalla, y si no está —
      // o si al elegirlo el asistente no avanza — el paso sale ROJO con los rubros que sí hay.
      if ((await leerCampos()).length === 0) {
        const rubro = process.env.RECORRIDO_RUBRO || 'Clínica dental';
        const ofrecidos = await page.evaluate(() =>
          [...document.querySelectorAll('button')]
            .map((el) => (el.innerText || '').trim().replace(/\s+/g, ' '))
            .filter((t) => t.length > 2)
        );
        const tarjeta = page.locator('button', { hasText: rubro }).first();
        if (!(await tarjeta.count().catch(() => 0))) {
          const vista = await mirar(page, 'paso-03-pedir-acceso.png');
          return {
            estado: 'roto',
            detalle: `el alta no ofrece el rubro "${rubro}". Los que ofrece: ${ofrecidos.map((t) => t.split(' ').slice(1, 4).join(' ')).join(' · ') || '(ninguno)'}`,
            rubrosOfrecidos: ofrecidos,
            ...vista,
          };
        }
        await tarjeta.click({ timeout: 10_000 }).catch(() => {});
        await page.waitForTimeout(2500);

        // Elegir el rubro tiene que ABRIR el formulario de cuenta. Si después del clic sigue
        // sin haber un solo campo, el asistente no avanzó y todo lo que venga después es humo.
        if ((await leerCampos()).length === 0) {
          const vista = await mirar(page, 'paso-03-pedir-acceso.png');
          return {
            estado: 'roto',
            detalle: `se eligió el rubro "${rubro}" y el alta NO avanzó al formulario de cuenta: sigue sin un solo campo en ${page.url()}`,
            ...vista,
          };
        }
        ctx.rubroElegido = rubro;
      }

      // Los campos se DESCUBREN, no se hardcodean: el día que el alta cambie de forma, el
      // script tiene que notarlo, no romperse contra un selector viejo.
      const campos = await page.evaluate(() =>
        [...document.querySelectorAll('input, select, textarea')]
          .filter((el) => el.type !== 'hidden')
          .map((el) => ({ tag: el.tagName.toLowerCase(), tipo: el.type || '', name: el.name || '', id: el.id || '', placeholder: el.placeholder || '', requerido: el.required }))
      );
      ctx.campos = campos;

      const crearCuenta = campos.some((c) => c.tipo === 'password');
      ctx.altaCreaCuenta = crearCuenta;

      // Se rellena con datos zz-qa- para poder MIRAR el formulario lleno y ver si valida bien.
      // Rellenar no escribe nada: escribir es el submit, y ese está detrás de --escribir.
      //
      // 🔴 Los campos REALES no tienen `name` ni `id`: sólo `placeholder`. El único que sí
      // tiene `name` es `sitioWeb`, que es el HONEYPOT anti-bots — está escondido y llenarlo
      // es declararse robot. Un relleno que busque por `name` llena exactamente la trampa y
      // nada más, y después culpa al producto por rechazar el alta. Se localiza por
      // placeholder y se SALTEA el honeypot a propósito.
      const HONEYPOT = /sitioweb|website|url|honey/i;
      for (let i = 0; i < campos.length; i++) {
        const c = campos[i];
        if (HONEYPOT.test(`${c.name} ${c.id}`)) continue;
        const pista = `${c.name} ${c.id} ${c.placeholder}`.toLowerCase();
        let valor = QA.nombre;
        if (c.tipo === 'password') valor = QA.password;
        else if (c.tipo === 'email' || /mail|@/.test(pista)) valor = QA.email;
        else if (/whats|phone|tel|celular|\d{6}/.test(pista)) valor = QA.whatsapp;
        else if (/negocio|empresa|business|cl[ií]nica|tienda|comercio/.test(pista)) valor = QA.negocio;
        else if (/city|ciudad/.test(pista)) valor = QA.ciudad;

        const campo = c.id
          ? page.locator(`#${CSS.escape(c.id)}`)
          : c.placeholder
            ? page.getByPlaceholder(c.placeholder, { exact: true }).first()
            : page.locator('input, select, textarea').nth(i);
        if (c.tag === 'select') {
          await campo.selectOption({ index: 1 }).catch(() => {});
        } else {
          await campo.fill(valor).catch(() => {});
        }
      }

      const vista = await mirar(page, 'paso-03-pedir-acceso.png');

      if (!ESCRIBIR) {
        return {
          estado: crearCuenta ? 'no-medido' : 'no-medido',
          detalle: crearCuenta
            ? `el alta pide contraseña (parece crear cuenta), pero no se envió: --escribir está apagado`
            : `el alta es un FORMULARIO DE SOLICITUD (${campos.length} campos, sin contraseña): no crea cuenta. No se envió: --escribir está apagado`,
          campos,
          altaCreaCuenta: crearCuenta,
          ...vista,
        };
      }

      // --escribir: acá sí entra una fila en la base de producción, marcada zz-qa-.
      const antes = page.url();
      await page.click('button[type=submit], form button:not([type=button])').catch(() => {});
      await page.waitForTimeout(4000);
      const despues = await mirar(page, 'paso-03b-pedir-acceso-enviado.png');
      ctx.enviado = true;

      // 🔴 Acá el estado era `crearCuenta ? 'ok' : 'no-medido'`: dependía de si el formulario ERA
      // de crear cuenta, NUNCA de si el envío funcionó. El paso 3 no podía salir rojo JAMÁS, y su
      // único detalle era la URL — que en este alta no se mueve ni cuando sale bien ni cuando sale
      // mal ("la URL pasó de /register a /register"). Resultado medido el 2026-09-03: verde
      // cantado sobre una captura que decía otra cosa. Un paso que no puede fallar no mide nada.
      //
      // Ahora se MIRA la pantalla, igual que hace el paso 4: el resultado del alta se anuncia ahí
      // y en ningún otro lado.
      const veredicto = await page.evaluate(() => {
        const texto = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
        const alerta = [...document.querySelectorAll('[role=alert], .text-destructive, .text-red-500, .text-red-600, .error')]
          .map((el) => (el.innerText || '').trim())
          .filter((t) => t && t.length < 300)[0] || '';
        return { texto: texto.slice(0, 600), alerta };
      });
      const dice = `${veredicto.alerta} ${veredicto.texto}`;
      const fallo = /error al crear|no se pudo|ya (existe|est[áa] registrad)|inv[aá]lid|intent[áa] de nuevo/i.test(dice);
      // La pantalla de éxito de este alta: "Verificá tu correo · Tu cuenta ya fue creada".
      const creada = /tu cuenta ya fue creada|verific[áa] tu correo|confirm[áa] tu cuenta/i.test(dice);
      const adentro = /app\.onia\.com\.bo/.test(page.url()) && !/\/(login|register)\b/.test(page.url());
      // El alta NO deja entrar sola: pide confirmar el correo antes del primer login. El paso 4
      // necesita saberlo para no diagnosticar "credenciales mal" sobre una cuenta sana.
      ctx.requiereConfirmacion = creada && !adentro;

      if (!crearCuenta) {
        return {
          estado: 'no-medido',
          detalle: `enviado: quedó una SOLICITUD (${QA.email}), no una cuenta. El recorrido no puede seguir solo`,
          campos, altaCreaCuenta: crearCuenta, urlTrasEnviar: page.url(), ...despues,
        };
      }
      if (fallo) {
        return {
          estado: 'roto',
          detalle: `el alta RECHAZÓ el registro de ${QA.email} — la pantalla dice: "${(veredicto.alerta || veredicto.texto).slice(0, 160)}"`,
          campos, altaCreaCuenta: crearCuenta, urlTrasEnviar: page.url(), ...despues,
        };
      }
      if (!creada && !adentro) {
        // Ni éxito ni error a la vista: el alta se comió el envío en silencio, que es el modo de
        // falla más caro de todos porque no deja rastro para el cliente NI para el que diagnostica.
        return {
          estado: 'roto',
          detalle: `envié el alta y la pantalla no dijo nada: sigue en ${page.url()} sin confirmación ni error visible. Arriba dice: "${veredicto.texto.slice(0, 160)}"`,
          campos, altaCreaCuenta: crearCuenta, urlTrasEnviar: page.url(), ...despues,
        };
      }
      return {
        estado: 'ok',
        detalle: adentro
          ? `cuenta ${QA.email} creada y con sesión abierta: quedó en ${page.url()}`
          : `cuenta ${QA.email} creada; el alta pide CONFIRMAR EL CORREO antes del primer login — la pantalla dice: "${veredicto.texto.slice(0, 120)}"`,
        campos,
        altaCreaCuenta: crearCuenta,
        requiereConfirmacionDeCorreo: ctx.requiereConfirmacion,
        urlTrasEnviar: page.url(),
        ...despues,
      };
    },
  },

  {
    n: 4,
    nombre: 'entrar',
    que: 'Entrar a la plataforma con esa cuenta',
    async correr(page, ctx) {
      // 🔴 Acá vivía el defecto que condenaba al recorrido a morir en el paso 3 PARA SIEMPRE,
      // aunque el alta funcionara perfecto: este paso exigía credenciales de entorno y no
      // miraba la cuenta que el paso 3 acababa de crear. El producto te deja adentro y el
      // instrumento pedía una llave aparte. Un cliente no tiene una segunda cuenta: entra con
      // la que se acaba de hacer. Orden correcto, del más real al menos real:
      //   1. la sesión que el alta YA dejó abierta  2. la cuenta recién creada  3. la de env.
      if (ctx.enviado && ctx.altaCreaCuenta) {
        const url = page.url();
        if (/app\.onia\.com\.bo/.test(url) && !/\/(login|register)\b/.test(url)) {
          const vista = await mirar(page, 'paso-04-entrar.png');
          ctx.conSesion = true;
          ctx.comoEntro = 'el alta dejó la sesión abierta';
          return { estado: 'ok', detalle: `el alta dejó la sesión abierta: quedó en ${url}`, ...vista };
        }
      }

      const llaveros = [];
      if (ctx.enviado && ctx.altaCreaCuenta) llaveros.push({ user: QA.email, pass: QA.password, de: 'la cuenta recién creada' });
      if (SESION.user && SESION.pass) llaveros.push({ user: SESION.user, pass: SESION.pass, de: 'RECORRIDO_USER/RECORRIDO_PASS' });
      if (!llaveros.length) {
        return {
          estado: 'no-medido',
          detalle: 'no hay con qué entrar: --escribir está apagado (no se creó cuenta) y faltan RECORRIDO_USER/RECORRIDO_PASS',
        };
      }

      // 🔴 El motivo REAL del rechazo lo dice la API, NO la pantalla. Medido el 2026-09-03: el
      // login rebotaba con `error_code: email_not_confirmed` (cuenta sana, correo sin confirmar)
      // y este paso reportaba `la pantalla dice: "error"` — porque barría `p, span` y se quedaba
      // con la primera palabra que matcheara. Un diagnóstico así manda a revisar el login, que
      // no tiene nada roto. Se escucha /token, que trae el código exacto.
      let errorApi = '';
      const oirToken = async (resp) => {
        if (!/\/token\b/.test(resp.url()) || resp.status() < 400) return;
        const j = await resp.json().catch(() => null);
        if (j) errorApi = j.error_code || j.error || j.msg || j.message || '';
      };
      page.on('response', oirToken);

      const intentar = async (llave) => {
        errorApi = '';
        await ir(page, `${APP}/login`);
        await page.fill('input[type=email], input[name=email]', llave.user).catch(() => {});
        await page.fill('input[type=password], input[name=password]', llave.pass).catch(() => {});
        await page.click('button[type=submit]').catch(() => {});
        await page.waitForTimeout(6000);
        if (!/\/login\b/.test(page.url())) return { entro: true };
        const motivo = await page.evaluate(() => {
          const t = [...document.querySelectorAll('[role=alert], .error, .text-red-500, .text-destructive')]
            .map((el) => (el.innerText || '').trim())
            .filter((x) => x && x.length < 200);
          return t[0] || '';
        });
        return { entro: false, motivo, codigo: errorApi };
      };

      let ultimo = '';
      for (const llave of llaveros) {
        let r = await intentar(llave);

        // El alta pide confirmar el correo antes del primer login (medido: el mail SALE y el MX
        // lo acepta). El cliente hace clic en ese enlace; el instrumento no tiene buzón, así que
        // abre el MISMO enlace que se le mandó — mismo navegador, misma sesión, igual que el
        // cliente. No se toca `email_confirmed_at` a mano: eso sería fingir el paso que se mide.
        // El código viaja en dos formas según por dónde salga (`error_code` o el texto `msg`):
        // se aceptan las dos. Buscar sólo la de guiones bajos dejó el paso muerto una corrida.
        const sinConfirmar = /email[_ ]not[_ ]confirmed|correo[^"]*no[^"]*confirm/i.test(`${r.codigo || ''} ${r.motivo || ''}`);
        if (!r.entro && sinConfirmar && llave.user === QA.email) {
          const enlace = await confirmarComoElCliente(page, llave.user);
          ctx.confirmoCorreo = enlace;
          if (enlace.ok) r = await intentar(llave);
        }

        if (r.entro) {
          const vista = await mirar(page, 'paso-04-entrar.png');
          ctx.conSesion = true;
          ctx.comoEntro = llave.de;
          page.off('response', oirToken);
          return {
            estado: 'ok',
            detalle: `entró con ${llave.de}; quedó en ${page.url()}${ctx.confirmoCorreo?.ok ? ' — hizo falta confirmar el correo primero, como haría el cliente con el enlace del mail' : ''}`,
            confirmoCorreo: ctx.confirmoCorreo || null,
            ...vista,
          };
        }
        ultimo = `con ${llave.de} (${llave.user}) rebotó en ${page.url()}`
          + (r.codigo ? ` — la API responde "${r.codigo}"` : '')
          + (r.motivo ? ` — la pantalla dice: "${r.motivo}"` : (r.codigo ? '' : ' — sin mensaje visible'))
          + (ctx.confirmoCorreo && !ctx.confirmoCorreo.ok ? ` — y la confirmación del correo tampoco pudo: ${ctx.confirmoCorreo.detalle}` : '');
      }
      page.off('response', oirToken);
      const vista = await mirar(page, 'paso-04-entrar.png');
      return { estado: 'roto', detalle: `no entró: ${ultimo}`, confirmoCorreo: ctx.confirmoCorreo || null, ...vista };
    },
  },

  {
    n: 5,
    nombre: 'elegir-rubro',
    que: 'Elegir rubro y terminar el onboarding',
    requiereSesion: true,
    async correr(page, ctx) {
      const v = await llegar(page, '/onboarding', 'paso-05-elegir-rubro.png');
      if (v.status >= 400) return { estado: 'roto', detalle: `el onboarding devolvió ${v.status}`, ...v };

      // Que la pantalla ABRA no es que el onboarding esté TERMINADO: mientras siga pendiente, el
      // producto retiene ahí al usuario y los pasos 6-8 no existen. Así que se COMPLETA.
      const { traza, cerro, motivo } = await completarOnboarding(page);
      ctx.trazaOnboarding = traza;
      for (const t of traza) console.log(`        · ${t.pantalla}: "${t.vio}" → ${t.apreto}`);
      const despues = await mirar(page, 'paso-05b-onboarding-listo.png');

      // 🔴 LA VERIFICACIÓN NO ES HABER APRETADO LOS BOTONES. Cuatro clics y una pantalla de
      // "listo" es exactamente la clase de evidencia que ya hizo cantar RECORRIDO COMPLETO a
      // este mismo script sobre un camino roto. Lo que prueba que el alta se cerró es el EFECTO:
      // el producto retiene en /onboarding a toda cuenta sin `onboardingCompletedAt`, así que
      // si /dashboard deja de rebotar, el gate se levantó. Se mide el efecto, no la acción.
      const prueba = await llegar(page, '/dashboard', 'paso-05c-gate-levantado.png');
      ctx.onboardingPendiente = !prueba.llego;
      if (!prueba.llego) {
        return {
          estado: 'roto',
          detalle: `el onboarding NO quedó cerrado: ${motivo || 'el asistente dijo haber terminado'}, pero /dashboard sigue rebotando a ${prueba.destino}. Traza: ${traza.map((t) => t.pantalla).join(' → ')}`,
          traza,
          capturaAsistente: despues.captura,
          ...prueba,
        };
      }
      return {
        estado: 'ok',
        detalle: `onboarding COMPLETADO en ${traza.length} pantallas (${traza.map((t) => t.pantalla).join(' → ')})${cerro ? '' : ' — el asistente no mostró el cierre, pero el gate se levantó igual'}; /dashboard ya no rebota`,
        traza,
        capturaAsistente: despues.captura,
        ...prueba,
      };
    },
  },

  {
    n: 6,
    nombre: 'cargar-dato',
    que: 'Cargar un dato real del rubro (un cliente, un paciente, un producto)',
    requiereSesion: true,
    /**
     * 🔴 Este paso se llamaba "cargar un dato" y lo único que hacía era ABRIR `/patients` y
     * sacarle una foto. Nunca creó nada — así que el paso 8 ("¿aparece el dato del paso 6?")
     * tampoco comprobaba nada, y los dos daban OK. Dos pasos de ocho, verdes y vacíos.
     *
     * Abrir una pantalla no prueba que el producto GUARDE. Lo que lo prueba es escribir un dato
     * y volver a encontrarlo, que es exactamente lo que hace un cliente el primer día.
     */
    async correr(page, ctx) {
      // 🔴 Este paso apuntaba fijo a `/patients`, que es la pantalla del rubro DENTAL. Con
      // cualquier otro rubro medía la pantalla equivocada: o rebotaba y culpaba al producto de
      // un fallo que no tiene, o —peor— encontraba pacientes en un comercio. La pantalla del
      // dato ahora se DESCUBRE del menú que el producto le muestra a ESTE rubro, que es lo
      // único que un cliente puede usar. Si el menú no ofrece ninguna, eso sí es un hallazgo.
      const menu = await descubrirMenu(page);
      ctx.menu = menu;
      const objetivo = pantallaDelDato(menu, ctx.rubroElegido);
      if (!objetivo) {
        const vista = await mirar(page, 'paso-06-cargar-dato.png');
        return {
          estado: 'roto',
          detalle: `el menú de "${ctx.rubroElegido || 'este rubro'}" no ofrece ninguna pantalla donde cargar un dato del negocio. Ofrece: ${menu.map((m) => `${m.texto} (${m.ruta})`).join(' · ') || '(el menú está vacío)'}`,
          menu,
          ...vista,
        };
      }
      ctx.pantallaDato = objetivo;

      const lista = await llegar(page, objetivo.ruta, 'paso-06-cargar-dato.png');
      if (lista.status >= 400) return { estado: 'roto', detalle: `la pantalla de datos (${objetivo.texto}, ${objetivo.ruta}) devolvió ${lista.status}`, menu, ...lista };
      if (!lista.llego) return { estado: 'no-medido', detalle: motivoNoLlego(lista, ctx, `la pantalla de datos (${objetivo.texto})`), menu, ...lista };

      if (!ESCRIBIR) {
        return { estado: 'no-medido', detalle: `pantalla de datos "${objetivo.texto}" a la vista en ${page.url()}, pero sin --escribir no se carga ningún dato`, menu, ...lista };
      }

      // Se entra por el camino que OFRECE la pantalla, no por una URL a mano: si el producto
      // mueve el botón, el que tiene que fallar es este paso, no un `goto` que siempre acierta.
      //
      // 🔴 Y ese camino NO tiene la misma forma en todos los rubros. En dental el alta es una
      // página (`<a href="/patients/new">`); en comercio es un `<button>` que abre un modal.
      // Buscar sólo `<a>` daba ROTO —"el Catálogo no ofrece ningún camino para cargar un
      // producto"— con el botón «Nuevo producto» a la vista en la captura. Era una acusación
      // falsa al producto, firmada por el instrumento. Se acepta enlace O botón.
      //
      // ⚠️ Y el orden importa: `a[href^="/patients/"]` también matchea `/patients/<id>` de un
      // registro que YA existe. Con la lista vacía acierta de casualidad y el día que hay un
      // dato entra a verlo en vez de crear uno — y el paso reporta "no guardó" sobre un alta
      // que nunca se abrió. Primero la ruta exacta de alta, después lo que diga "nuevo".
      const ALTA = /nuevo|nueva|agregar|a[ñn]adir|crear|registrar/i;
      let alta = page.locator(`a[href="${objetivo.ruta}/new"]`).first();
      if (!(await alta.count().catch(() => 0))) {
        alta = page.locator(`a[href^="${objetivo.ruta}/"]`).filter({ hasText: ALTA }).first();
      }
      if (!(await alta.count().catch(() => 0))) {
        alta = page.getByRole('button', { name: ALTA }).first();
      }
      if (!(await alta.count().catch(() => 0))) {
        return { estado: 'roto', detalle: `la pantalla "${objetivo.texto}" (${objetivo.ruta}) no ofrece ningún camino para cargar un dato: no hay enlace ni botón de alta`, menu, ...lista };
      }
      await alta.click({ timeout: 10_000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: TIMEOUT }).catch(() => {});
      await page.waitForTimeout(1200);

      // 🔴 Acá había un `despejar(page)`, y CERRABA EL FORMULARIO QUE ACABABA DE ABRIR. En
      // comercio el alta es un modal cuyo botón de cancelar se llama exactamente «Cerrar», que
      // es uno de los dos nombres que `despejar` aprieta para sacar el tour de encima. Medido en
      // vivo el 2026-09-03: tras el clic el modal trae sus campos y «Guardar producto»; después
      // de `despejar` no queda ni un campo. El paso reportaba entonces "no tiene botón de
      // guardar" — contra un producto que sí lo tiene. No hace falta despejar acá: el tour ya lo
      // sacó `llegar()` en esta misma pantalla, y apretar un botón no puede invocarlo de nuevo.

      // ⚠️ Los campos NO tienen `name` ni `id`: sólo `placeholder` (medido el 2026-09-03). Un
      // relleno que busque por `name` no llena nada y el formulario se envía vacío. Y como cada
      // rubro tiene su propio formulario, los campos se DESCUBREN y se llenan por tipo: el
      // primer texto lleva el dato zz-qa-, los números un 1, para que valide sin inventar nada.
      // Primero se ACOTA al formulario: fuera de él está el buscador de la lista, y llenarlo a
      // él manda el alta vacía (ver `acotarFormulario`).
      const forma = await acotarFormulario(page, GUARDAR.source);
      if (!forma.hayGuardar) {
        const vista = await mirar(page, 'paso-06b-alta-dato.png');
        return {
          estado: 'roto',
          detalle: `en "${objetivo.texto}" se apretó el camino de alta y no apareció ningún formulario con botón de guardar, en ${page.url()}. Los botones a la vista: ${forma.botones.join(' · ') || '(ninguno)'}`,
          botones: forma.botones,
          ...vista,
        };
      }
      const llenado = await llenarFormulario(page, QA.paciente);
      if (!llenado.nombreCargado) {
        const vista = await mirar(page, 'paso-06b-alta-dato.png');
        return {
          estado: 'roto',
          detalle: `el formulario de alta de "${objetivo.texto}" no tiene ni un campo de texto donde escribir el dato, en ${page.url()}`,
          campos: llenado.campos,
          ...vista,
        };
      }
      // El botón se busca DENTRO del formulario acotado: en la lista de atrás también hay un
      // «Nuevo producto», y `getByRole` a nivel página puede quedarse con ese y no enviar nada.
      const guardar = page.locator('[data-recorrido-form]').getByRole('button', { name: GUARDAR }).first();
      if (!(await guardar.count().catch(() => 0))) {
        const vista = await mirar(page, 'paso-06b-alta-dato.png');
        return { estado: 'roto', detalle: `el formulario de alta de "${objetivo.texto}" no tiene botón de guardar en ${page.url()}`, campos: llenado.campos, ...vista };
      }
      await guardar.click({ timeout: 10_000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: TIMEOUT }).catch(() => {});
      await page.waitForTimeout(2500);
      // Tampoco se despeja acá: si el alta falló, el formulario sigue abierto CON el error
      // adentro, y ésa es justo la foto que hay que traer. Cerrarlo antes de mirar deja una
      // captura de una lista vacía y un informe que no sabe explicar por qué está vacía.
      const guardado = await mirar(page, 'paso-06b-alta-dato.png');

      // La verificación NO es haber apretado "Guardar": es volver a la LISTA y encontrarlo.
      // Un formulario que se vacía y no dice nada se parece muchísimo a uno que guardó.
      const vuelta = await llegar(page, objetivo.ruta, 'paso-06c-dato-en-la-lista.png');
      const aparece = await page.evaluate((n) => (document.body.innerText || '').includes(n), QA.paciente);
      ctx.datoCargado = aparece ? QA.paciente : null;
      if (!aparece) {
        return {
          estado: 'roto',
          detalle: `se cargó "${QA.paciente}" en ${objetivo.texto} y NO aparece en la lista de ${page.url()}: el producto no lo guardó, o no lo muestra`,
          capturaAlta: guardado.captura,
          campos: llenado.campos,
          ...vuelta,
        };
      }
      return {
        estado: 'ok',
        detalle: `"${QA.paciente}" cargado en ${objetivo.texto} (${objetivo.ruta}) y encontrado de vuelta en la lista`,
        capturaAlta: guardado.captura,
        campos: llenado.campos,
        ...vuelta,
      };
    },
  },

  {
    n: 7,
    nombre: 'cobro',
    // 🔴 Se MIRA y se FRENA. No se escanea un QR, no se confirma una transferencia, no se
    // mete una tarjeta. Que el botón exista y se vea es todo lo que hay que reportar.
    que: 'Llegar a la pantalla de cobro y MIRARLA. Frenar ahí',
    requiereSesion: true,
    async correr(page, ctx) {
      // 🔴 Acá estaba `/billing` fijo, que es el cobro del rubro DENTAL. Un comercio no tiene
      // esa ruta: su cobro se llama "Caja" (`/comercio/caja`). Pedir /billing con una cuenta de
      // comercio rebota al panel, y el paso reportaba "no se llegó a la pantalla de cobro" como
      // si el producto no la tuviera — estaba ahí, en el menú, con otro nombre. La pantalla de
      // cobro se busca en el menú que ve ESTE rubro y sólo se cae a /billing si no hay ninguna.
      const menu = ctx.menu?.length ? ctx.menu : await descubrirMenu(page);
      const cobro = menu.find((m) => /caja|cobro|facturaci[óo]n|billing|pagos/i.test(m.texto));
      const ruta = cobro?.ruta || '/billing';
      const v = await llegar(page, ruta, 'paso-07-cobro.png');
      const comoSeLlama = `la pantalla de cobro (${cobro?.texto?.replace(/^\S+\s/, '') || 'Facturación'})`;
      if (v.status >= 400) return { estado: 'roto', detalle: `${comoSeLlama} devolvió ${v.status} en ${ruta}`, menuCobro: cobro || null, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoNoLlego(v, ctx, comoSeLlama), menuCobro: cobro || null, ...v };
      return { estado: 'ok', detalle: `${comoSeLlama} a la vista en ${page.url()} — FRENADO acá a propósito`, menuCobro: cobro || null, ...v };
    },
  },

  {
    n: 8,
    nombre: 'bandeja',
    que: 'Abrir la bandeja / el panel y ver si el dato del paso 6 aparece',
    requiereSesion: true,
    /**
     * Este paso pregunta si el dato del paso 6 APARECE. Mientras el paso 6 no cargaba nada, no
     * tenía nada que buscar y reportaba OK por abrir el panel: verde sobre el vacío.
     */
    async correr(page, ctx) {
      const v = await llegar(page, '/dashboard', 'paso-08-bandeja.png');
      if (v.status >= 400) return { estado: 'roto', detalle: `el panel devolvió ${v.status}`, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoNoLlego(v, ctx, 'el panel'), ...v };
      if (!ctx.datoCargado) {
        return { estado: 'no-medido', detalle: `el panel abrió en ${page.url()}, pero el paso 6 no dejó ningún dato que buscar`, ...v };
      }
      const enElPanel = await page.evaluate((n) => (document.body.innerText || '').includes(n), ctx.datoCargado);
      return {
        estado: 'ok',
        detalle: enElPanel
          ? `panel en ${page.url()}: el dato "${ctx.datoCargado}" del paso 6 aparece acá`
          : `panel en ${page.url()}: el dato "${ctx.datoCargado}" NO figura en el panel — sí quedó guardado y visible en ${ctx.pantallaDato?.texto || 'su lista'} (paso 6). El panel no lista ${(ctx.pantallaDato?.texto || 'esos datos').toLowerCase()}: no es un fallo, es lo que muestra`,
        datoEnElPanel: enElPanel,
        ...v,
      };
    },
  },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const navegador = await chromium.launch(OPCIONES_CHROMIUM);
  const page = await (await navegador.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

  const ctx = {};
  const resultados = [];
  let ultimoOk = 0;
  let corte = null;

  for (const paso of PASOS) {
    const etiqueta = `paso ${String(paso.n).padStart(2, '0')} — ${paso.que}`;
    if (paso.requiereSesion && !ctx.conSesion) {
      const r = { n: paso.n, nombre: paso.nombre, que: paso.que, estado: 'no-medido', detalle: 'sin sesión: el paso 4 no pudo entrar' };
      resultados.push(r);
      console.log(`  ·  ${etiqueta}: NO MEDIDO — ${r.detalle}`);
      continue;
    }
    let r;
    try {
      r = { n: paso.n, nombre: paso.nombre, que: paso.que, ...(await paso.correr(page, ctx)) };
    } catch (e) {
      r = { n: paso.n, nombre: paso.nombre, que: paso.que, estado: 'roto', detalle: `explotó: ${e.message}` };
    }
    resultados.push(r);
    const marca = r.estado === 'ok' ? '✔' : r.estado === 'roto' ? '✖' : '·';
    console.log(`  ${marca}  ${etiqueta}: ${r.estado.toUpperCase()} — ${r.detalle}`);
    if (r.estado === 'ok') ultimoOk = paso.n;
  }

  // El corte es el primero que frenó el AVANCE, no el primero que no salió OK. Con el paso 3
  // salteado a propósito (sin --escribir) y el 4 en verde, "corte en el paso 3" mandaba a mirar
  // donde no había nada roto.
  corte = resultados.find((r) => r.estado !== 'ok' && r.n > ultimoOk) || null;

  // 🔴 NACE DEL FALSO VERDE DEL 2026-09-03 EN IMPORTADORA, y es una recaída del mismo que este
  // script ya tuvo: `ultimoOk` guarda el ÚLTIMO paso que salió bien, NO hasta dónde se llegó de
  // corrida. En importadora el paso 7 salió `no-medido` (el producto redirige /billing a
  // /dashboard porque ese rubro no tiene Facturación) y el 8 salió verde, así que `ultimoOk`
  // valía 8, `ultimoOk === PASOS.length` daba verdadero y el script cantó "RECORRIDO COMPLETO:
  // los 8 pasos" sobre una pantalla de cobro que NUNCA se vio. Peor: `corte` también salió null,
  // porque busca un fallo con `n > ultimoOk` y no hay paso después del 8 — el agujero desapareció
  // hasta del resumen.json.
  //
  // Un agujero tapado por un verde POSTERIOR es invisible, y es exactamente la forma que tiene
  // este carril de no servir para nada: reportar en verde el camino que el cliente no puede hacer.
  // Por eso "completo" ahora exige que NO haya ni un paso fuera de OK, y los agujeros se enumeran
  // todos, estén donde estén.
  const agujeros = resultados.filter((r) => r.estado !== 'ok');
  // Hasta dónde llegó DE CORRIDA: el primer agujero corta, haya verdes después o no.
  const seguidos = agujeros.length ? agujeros[0].n - 1 : PASOS.length;
  // Los TAPADOS son los agujeros que tienen un paso VERDE después: los únicos que el veredicto
  // viejo borraba. Los demás (la cola de "sin sesión" que arrastra un corte temprano) ya los
  // explica el corte, y enumerarlos sólo hace ruido. Acá se separa el agujero que engaña del
  // que se deduce.
  const tapados = agujeros.filter((a) => resultados.some((r) => r.estado === 'ok' && r.n > a.n));

  await navegador.close();

  const resumen = {
    cuando: new Date().toISOString(),
    escribio: ESCRIBIR,
    // `llegoHasta` es de CORRIDA: el primer agujero lo corta. `ultimoOkSuelto` queda al lado
    // sólo para que se vea la diferencia cuando hay un hueco en el medio — era el número que
    // hacía cantar completo a un recorrido incompleto.
    llegoHasta: seguidos,
    ultimoOkSuelto: ultimoOk,
    completo: agujeros.length === 0,
    deCuantos: PASOS.length,
    corte: corte ? { paso: corte.n, nombre: corte.nombre, estado: corte.estado, detalle: corte.detalle } : null,
    agujeros: agujeros.map((a) => ({ paso: a.n, nombre: a.nombre, estado: a.estado, detalle: a.detalle })),
    datosQA: ESCRIBIR ? QA : null,
    pasos: resultados,
  };
  writeFileSync(join(OUT, 'resumen.json'), JSON.stringify(resumen, null, 2));

  console.log('');
  if (!agujeros.length) {
    console.log(`RECORRIDO COMPLETO: los ${PASOS.length} pasos. Eso es la noticia.`);
  } else {
    console.log(`LLEGÓ HASTA EL PASO ${seguidos} de ${PASOS.length} de corrida.`);
    if (corte) console.log(`CORTE en el paso ${corte.n} (${corte.nombre}) — ${corte.estado}: ${corte.detalle}`);
    // El agujero TAPADO por un verde posterior es el que nadie mira, y es el que hizo cantar
    // completo a un recorrido incompleto. Se nombra aunque el corte esté en otro lado.
    for (const a of tapados) {
      if (corte && a.n === corte.n) continue;
      console.log(`AGUJERO en el paso ${a.n} (${a.nombre}) — ${a.estado}: ${a.detalle}`);
    }
  }
  // El aviso enumera TODO lo creado, no sólo la cuenta: desde que el paso 6 carga un paciente,
  // un aviso que sólo nombre el correo deja basura anónima en producción — y basura anónima ya
  // no se puede borrar, porque no hay cómo distinguirla de un dato real.
  if (ESCRIBIR) {
    const creado = [`cuenta ${QA.email}`, `organización ${QA.negocio}`];
    if (ctx.datoCargado) creado.push(`paciente ${ctx.datoCargado}`);
    console.log(`\n⚠️  Se escribió en producción: ${creado.join(' · ')}. HAY QUE BORRARLO EN ESTA MISMA VUELTA.`);
  }

  // Salida 0 siempre: "el recorrido se corta en el paso 3" es el REPORTE, no un fallo del
  // script. Un exit distinto de cero haría que el corredor lo confunda con una caída.
  process.exit(0);
}

main().catch((e) => {
  console.error('el recorrido no pudo arrancar:', e.message);
  process.exit(1);
});
