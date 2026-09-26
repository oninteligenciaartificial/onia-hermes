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
 *   node scripts/recorrido_cliente.mjs --escribir   # además ENVÍA el alta, carga un paciente y
 *                                                   # agenda una cita (filas zz-qa- reales) y las
 *                                                   # BORRA al terminar, contando lo que queda
 *   node scripts/recorrido_cliente.mjs --solo-limpiar  # SIN navegador: sólo barre lo `zz-qa-`
 *                                                   # propio que haya quedado vivo. Correrlo AL
 *                                                   # ARRANCAR cada vuelta, antes del recorrido
 *                                                   # completo — así un huérfano de una corrida
 *                                                   # que se cortó antes de terminar (el recorrido
 *                                                   # completo tarda 3-30 min) no sobrevive ni un
 *                                                   # ciclo. Ver t_f52601e2, 2026-09-06.
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
 * 🔴 NUNCA se completa un pago. El paso 8 llega a la pantalla de cobro, la MIRA y FRENA. Es lo
 * ÚNICO que se mira sin enviar: el alta, el paciente y la cita se ENVÍAN, porque un recorrido que
 * rellena y frena no mide nada — así pasó una semana sin ver que "Agendar Cita" no andaba.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const OUT = process.env.RECORRIDO_OUT || join(RAIZ, 'hermes-content', 'docs', 'recorrido', 'capturas');
const ESCRIBIR = process.argv.includes('--escribir');
const SOLO_LIMPIAR = process.argv.includes('--solo-limpiar');
// El recorrido corría SIEMPRE en 1440x900. Una pantalla mirada en un viewport queda mirada
// para ESE viewport (aprendido por onia-cola el 2026-09-07 con el FAB de /billing en el
// mismo icono duplicado que sólo se ve <sm): RECORRIDO_MOVIL=1 repite el camino completo en
// un viewport de teléfono real, que es como la mayoría de los dueños de negocio en Bolivia
// va a usar esto la primera vez.
const MOVIL = process.env.RECORRIDO_MOVIL === '1';
const VIEWPORT = MOVIL ? { width: 390, height: 844 } : { width: 1440, height: 900 };
// Pregunta que estuvo abierta desde 2026-09-04 hasta el 2026-09-13 (ver ULTIMO_RECORRIDO.md):
// si el dueño aprieta "Saltar por ahora" en la pantalla de equipo (sin cargar ningún
// profesional), ¿puede agendar después? Medido en producción (dental): SÍ — el desplegable
// de "profesional" del paso 7 ofrece al DUEÑO mismo (su propio nombre) como opción por
// defecto, y la cita entra con 201 usando su `doctorId`. RECORRIDO_SALTAR_EQUIPO=1 reproduce
// ese camino incluso con --escribir, para volver a medirlo si el onboarding cambia.
const SALTAR_EQUIPO = process.env.RECORRIDO_SALTAR_EQUIPO === '1';
// La recuperación de contraseña ya se había probado hasta "pedí el enlace, la pantalla dijo que
// lo mandó" (2026-09-13 05:09), pero nunca con un TOKEN real: quedaba anotado como hueco
// ("no se pudo verificar... el flujo de /update-password con un token real"). RECORRIDO_PROBAR_RECOVERY=1
// cierra ese hueco reusando el mismo patrón que confirmarComoElCliente() — leer el token de la
// base con un SELECT acotado a zz-qa- y abrir el enlace real, nunca escribir la columna a mano.
const PROBAR_RECOVERY = process.env.RECORRIDO_PROBAR_RECOVERY === '1';
// Escalón 3: invitar y sacar a un coadministrador desde /team (ver `probarCoadministrador`).
// Sube el plan de la org zz-qa- a `clinic` por SQL para poder ejercer una capacidad que el
// onboarding real no deja elegir — opt-in, corre DESPUÉS del recorrido de 9 pasos.
const PROBAR_COADMIN = process.env.RECORRIDO_PROBAR_COADMIN === '1';

/**
 * La ruta con la que se REPORTA una captura en `resumen.json`, relativa a la raíz del repo.
 *
 * 🔴 Acá estaba escrita a mano la carpeta de DENTAL. Con `RECORRIDO_OUT` apuntando a otro rubro
 * la captura se GUARDABA en la carpeta del rubro y el informe la REPORTABA en la de dental —
 * donde vive un PNG con el mismo nombre. Así que la ruta de la evidencia resolvía, se abría, y
 * mostraba la pantalla de OTRO rubro: medido el 2026-09-04, 17 de 17 rutas de los dos rubros ya
 * corridos (comercio y estética) apuntaban al archivo equivocado, y las 17 existían.
 *
 * Por eso no alcanza con chequear que el archivo exista: una prueba que abre y miente es peor
 * que una que falta, porque nadie la vuelve a mirar. La ruta se DERIVA de dónde se guardó.
 */
export function rutaRelativa(out, archivo, raiz = RAIZ) {
  return join(relative(raiz, out) || '.', archivo).split(sep).join('/');
}

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
  // El primer miembro del equipo (paso 5) y las notas de la cita (paso 7). La cita no tiene
  // nombre: sus NOTAS son la única marca zz-qa- que la hace borrable sin dudar.
  profesional: `zz-qa-${SELLO}-profesional`,
  cita: `zz-qa-${SELLO}-cita`,
  // El ítem manual de la factura del paso 8. Va en la DESCRIPCIÓN del ítem, no en un campo propio
  // de la factura — es lo único de la factura que lleva el prefijo, y por eso la limpieza busca
  // la organización dueña, no la factura por su propio texto.
  itemFactura: `zz-qa-${SELLO}-item`,
};

/** La fecha en hora de Bolivia (UTC-4, sin horario de verano). El VPS vive en UTC: a las 21:00 de La Paz "mañana" ya es otro día. */
const enBolivia = (ms) => new Date(ms - 4 * 3600 * 1000);
const hoyEnBolivia = () => enBolivia(Date.now()).toISOString().slice(0, 10);
/** Mañana, corrido al lunes si cae en fin de semana: los horarios que carga el paso 5 son lun-vie. */
function mananaHabil() {
  let d = enBolivia(Date.now() + 86_400_000);
  while ([0, 6].includes(d.getUTCDay())) d = new Date(d.getTime() + 86_400_000);
  return d.toISOString().slice(0, 10);
}

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
  return { captura: rutaRelativa(OUT, archivo), dom };
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
      // 🔴 Acá se medía `r.width * r.height` sin cruzarlo contra el viewport, así que un
      // drawer de MÓVIL escondido con `transform: translateX(-100%)` (fuera de pantalla,
      // técnica normal para un sidebar de escritorio que un breakpoint angosto no muestra)
      // contaba su ancho ENTERO como si tapara, aunque 0 px cayeran dentro de lo visible.
      // Medido el 2026-09-08: el sidebar (`w-64 fixed left-0 top-0`) de onia-platform daba
      // "cubre 66%" en los pasos 5/6/8/9 en viewport de 390px, y la CAPTURA de la misma
      // corrida salía limpia las cuatro veces — la prueba que este script mismo guarda
      // contradecía su propio veredicto. Se mide la INTERSECCIÓN con el viewport, no el
      // rectángulo crudo.
      const visX = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
      const visY = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      const cubre = (visX * visY) / (innerWidth * innerHeight);
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
  // "Cerrar la guía" es el ícono X de GuiaInicio.tsx:164 (aria-label, sin texto visible);
  // los otros dos son botones de texto. Probar los tres: el 2026-09-06 el click normal en
  // "Cerrar por ahora" fallaba callado (catch(()=>{})) sin decir por qué, y el paso 5 salía
  // "roto" con /dashboard ya alcanzado — el modal simplemente no se había podido cerrar.
  const salidas = [/Cerrar por ahora/i, /Cerrar la guía/i, /^Cerrar$/i];
  for (const nombre of salidas) {
    const b = page.getByRole('button', { name: nombre });
    if (!(await b.count().catch(() => 0))) continue;
    const err = await b.first().click({ timeout: 5000 }).then(() => null).catch((e) => String(e.message || e).split('\n').slice(0, 4).join(' | '));
    if (err) {
      // El click normal exige que el botón esté libre de algo encima; si algo lo tapa
      // (p.ej. otro overlay fixed), forzamos UNA vez y lo dejamos anotado en vez de tragarlo.
      const bb = await b.first().boundingBox().catch(() => null);
      const enElPunto = bb
        ? await page.evaluate(({ x, y }) => {
          const el = document.elementFromPoint(x, y);
          return el ? `${el.tagName}.${(el.className || '').toString().slice(0, 40)}` : '(nada)';
        }, { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 })
        : '(sin boundingBox)';
      console.log(`        · despejar(): "${nombre}" no se pudo clickear normal (${err}) — en ese punto hay: ${enElPunto}, reintento con force`);
      const err2 = await b.first().click({ timeout: 5000, force: true }).then(() => null).catch((e2) => String(e2.message || e2).split('\n').slice(0, 4).join(' | '));
      if (err2) console.log(`        · despejar(): "${nombre}" tampoco con force (${err2})`);
      else console.log(`        · despejar(): "${nombre}" click con force NO tiró error`);
    }
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
  let tapa = await queTapa(page);
  // Una tapa detectada acá puede ser la hidratación de Next todavía en vuelo (el sidebar de
  // escritorio se pinta primero en el server y el cliente recién después le aplica la clase
  // responsive que lo esconde en un viewport angosto) y no un overlay real: medido el
  // 2026-09-08 en móvil, `tapa` daba el sidebar (w-64 fixed) cubriendo 66 % en los pasos 5,
  // 6, 8 y 9, y la CAPTURA tomada acto seguido salía LIMPIA las cuatro veces — la propia
  // prueba que se guarda contradecía el veredicto. Se re-mide una vez tras una pausa antes de
  // creerle a una tapa que la foto no sostiene.
  if (tapa) {
    await page.waitForTimeout(700);
    const tapaDespues = await queTapa(page);
    if (!tapaDespues) tapa = null;
    else tapa = tapaDespues;
  }
  const vista = await mirar(page, archivo);
  const destino = new URL(page.url()).pathname.replace(/\/$/, '');
  const pedida = ruta.replace(/\/$/, '');
  const llego = destino === pedida && !tapa;
  return { ...r, ...vista, destino, pedida, llego, tapa, despejo };
}

/**
 * Crea una factura `zz-qa-` de verdad para el paciente del paso 6 y llega a la pantalla que
 * pide la plata — no al listado vacío. Frena ahí: nunca marca la factura como pagada.
 *
 * POR QUÉ EXISTE: el paso 8 llegaba a `/billing` y esa pantalla siempre decía "0 facturas ·
 * Cobrado Bs 0,00", así que "OK" no probaba que cobrar funcione — sólo que la pantalla abra.
 * `hermes-content/docs/cola/recorrido-cliente.md` lo dejó anotado como el escalón siguiente.
 * El ítem lleva el prefijo en la DESCRIPCIÓN (la factura en sí no tiene campo para eso); la
 * limpieza no la busca por su propio texto, la organización a la que cuelga cae con el resto
 * de las ~70 tablas de la organización (`invoices.organizationId` es `onDelete: Cascade`,
 * `prisma/schema.prisma:832`).
 */
async function facturarZzQa(page, ctx) {
  const nuevo = await ir(page, `${APP}/billing/new`);
  if (nuevo.status >= 400) return { estado: 'no-medido', detalle: `/billing/new devolvió ${nuevo.status}` };
  await despejar(page);

  const selectPaciente = page.locator('select').first();
  if (!(await selectPaciente.count().catch(() => 0))) {
    const vista = await mirar(page, 'paso-08b-factura.png');
    return { estado: 'no-medido', detalle: `/billing/new no ofrece el formulario esperado (sin desplegable de cliente)`, ...vista };
  }
  const opciones = await selectPaciente.locator('option').allTextContents();
  if (!opciones.some((t) => t.trim() === ctx.datoCargado)) {
    const vista = await mirar(page, 'paso-08b-factura.png');
    return {
      estado: 'roto',
      detalle: `el paciente "${ctx.datoCargado}" del paso 6 NO aparece en el desplegable de la factura. Ofrece: ${opciones.map((t) => t.trim()).filter(Boolean).join(' · ') || '(nada)'}`,
      ...vista,
    };
  }
  await selectPaciente.selectOption({ label: ctx.datoCargado });

  // El bloque "Ítem manual" es la única tarjeta con esa cabecera: 1 input de texto (descripción)
  // y 2 de número (cantidad, precio), más el botón "Agregar" al lado. No hay `htmlFor` que
  // relacione label↔input (getByLabel no sirve acá), así que se ubica por el contenedor.
  //
  // 🔴 `hasText` sobre el DIV entero agarra la tarjeta EQUIVOCADA: la del catálogo dice "Podés
  // cobrar igual con un ítem manual, abajo" en un párrafo, y esa frase matchea primero porque
  // aparece antes en el DOM. El filtro tiene que mirar el <h3>, no el texto de cualquier hijo.
  const bloque = page.locator('div.bg-surface-container-lowest')
    .filter({ has: page.locator('h3', { hasText: 'Ítem manual' }) }).first();
  const nBloque = await bloque.count().catch(() => 0);
  if (!nBloque) {
    const vista = await mirar(page, 'paso-08b-factura.png');
    return { estado: 'no-medido', detalle: '/billing/new no ofrece el ítem manual esperado', ...vista };
  }
  await bloque.locator('input[type=text]').first().fill(QA.itemFactura);
  await bloque.locator('input[type=number]').nth(0).fill('1');
  await bloque.locator('input[type=number]').nth(1).fill('10');
  await bloque.locator('button', { hasText: 'Agregar' }).click();

  const submit = page.locator('button[type=submit]');
  const items = await page.locator('text=Subtotal').count().catch(() => 0);
  if (!items) {
    const vista = await mirar(page, 'paso-08b-factura.png');
    return { estado: 'roto', detalle: `"Agregar" no cargó el ítem "${QA.itemFactura}" en el resumen`, ...vista };
  }
  await submit.click();
  // 🔴 `/\/billing\/[^/]+$/` también matchea `/billing/new` (`new` es `[^/]+`), así que
  // esperar ESE patrón resolvía al instante (0 s) sin haber navegado, y la línea de abajo
  // comparaba la URL de PARTIDA — firmaba "roto" sobre un envío que seguía en vuelo.
  // Medido 2026-09-07, ver hermes-content/docs/cola/plataforma-v1.md. La espera tiene que
  // EXCLUIR el origen explícitamente.
  await page.waitForURL((u) => {
    const p = new URL(u).pathname;
    return /^\/billing\/[^/]+$/.test(p) && p !== '/billing/new';
  }, { timeout: 10_000 }).catch(() => {});
  await despejar(page);
  const vista = await mirar(page, 'paso-08c-factura-creada.png');
  const destino = new URL(page.url()).pathname;
  if (!/^\/billing\/[^/]+$/.test(destino) || destino === '/billing/new') {
    return { estado: 'roto', detalle: `enviar la factura no llevó a su pantalla de cobro: quedó en ${destino}`, ...vista };
  }
  const texto = await page.evaluate(() => document.body.innerText || '');
  const tieneElItem = texto.includes(QA.itemFactura);
  ctx.facturaCreada = { url: page.url(), item: QA.itemFactura };
  return {
    estado: 'ok',
    detalle: `factura zz-qa- creada (${destino}) con el ítem "${QA.itemFactura}"${tieneElItem ? ' visible en su pantalla de cobro' : ' — el ítem no aparece en el texto de la pantalla'} — FRENADO acá a propósito, sin marcarla pagada`,
    facturaUrl: page.url(),
    itemVisible: tieneElItem,
    ...vista,
  };
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
 * Recuperación de contraseña, con un TOKEN REAL — no sólo "la pantalla dijo que mandó el
 * correo" (eso ya se había medido el 2026-09-13 05:09 y quedó anotado como hueco).
 *
 * Pide el link desde /login ("Olvidé mi contraseña"), lee `recovery_token` de la base con un
 * SELECT acotado a zz-qa- (nunca escribe la columna a mano — sería fingir el paso que se mide,
 * igual que confirmarComoElCliente), abre el enlace real de GoTrue, define una contraseña nueva
 * en /update-password y verifica ENTRANDO con la contraseña nueva — la única prueba de que el
 * cambio quedó vivo, no sólo que el formulario mandó un 200.
 *
 * 🔴 Corre en un CONTEXTO DE NAVEGADOR APARTE, nunca en `page` (la de los pasos 1-9). La
 * primera versión reusaba `page` y borraba sus cookies para poder ver el formulario de
 * "Olvidé mi contraseña" (con sesión activa, /login redirige antes de renderizarlo) — y un
 * fallo a mitad de esta prueba dejaba `page` deslogueada, tumbando los pasos 5-9 que siguen
 * después. La cuenta zz-qa- del recorrido es un efecto secundario, no el sujeto: si esto
 * rompe, no puede llevarse puesto el recorrido que la creó.
 */
async function probarRecuperacionDeContrasena(navegador, email, passwordOriginal) {
  if (!email.startsWith('zz-qa-')) return { ok: false, detalle: 'sólo se prueba con una cuenta zz-qa-' };

  const contexto = await navegador.newContext({ viewport: VIEWPORT, locale: 'es-BO' });
  const page = await contexto.newPage();
  try {
    await ir(page, `${APP}/login`);
    const abrirOlvide = page.getByText(/olvid[eé]|recuperar/i).first();
    if (!(await abrirOlvide.count())) return { ok: false, detalle: 'no se encontró el botón/enlace "Olvidé mi contraseña" en /login' };
    await abrirOlvide.click().catch(() => {});
    await page.waitForTimeout(500);
    // El formulario de recuperación se despliega EN LA MISMA pantalla, con su propio input de
    // correo (medido 2026-09-13 05:09) — no reusar el input de la password del login de al lado.
    const campoCorreo = page.locator('input[type=email], input[name=email]').last();
    await campoCorreo.fill(email).catch(() => {});
    await mirar(page, 'extra-recovery-00-formulario.png');
    const submit = page.locator('button[type=submit]').last();
    await submit.click().catch(() => {});
    await page.waitForTimeout(3000);
    await mirar(page, 'extra-recovery-01-pedido.png');

    const nuevaPass = `Zzqa!${Date.now()}x`;
    let token = '';
    try {
      token = execFileSync('docker', [
        'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc',
        `SELECT recovery_token FROM auth.users WHERE email = '${email}' AND email LIKE 'zz-qa-%'`,
      ], { encoding: 'utf8', timeout: 20_000 }).trim();
    } catch (e) {
      return { ok: false, detalle: `no se pudo leer el recovery_token: ${e.message}` };
    }
    if (!token) return { ok: false, detalle: 'la cuenta no tiene recovery_token pendiente — el pedido de recuperación no lo generó' };

    const enlace = `${APP}/supabase/auth/v1/verify?token=${encodeURIComponent(token)}&type=recovery&redirect_to=${encodeURIComponent(APP + '/update-password')}`;
    await page.goto(enlace, { waitUntil: 'domcontentloaded', timeout: TIMEOUT }).catch(() => {});
    await page.waitForTimeout(3000);
    await mirar(page, 'extra-recovery-02-update-password.png');
    const destino = new URL(page.url()).pathname;
    if (!/update-password/i.test(destino)) {
      return { ok: false, detalle: `el enlace de recuperación no llevó a /update-password: quedó en ${destino}` };
    }

    const campos = page.locator('input[type=password]');
    const nCampos = await campos.count();
    if (!nCampos) return { ok: false, detalle: `/update-password no tiene ningún input de contraseña (quedó en ${destino})` };
    for (let i = 0; i < nCampos; i++) await campos.nth(i).fill(nuevaPass).catch(() => {});
    await page.locator('button[type=submit]').first().click().catch(() => {});
    await page.waitForTimeout(4000);
    await mirar(page, 'extra-recovery-03-contrasena-cambiada.png');

    // La única prueba real: ENTRAR con la contraseña nueva. Un 200 en el submit no dice que la
    // columna haya cambiado — GoTrue puede rechazar la nueva password en silencio.
    await ir(page, `${APP}/login`);
    await page.fill('input[type=email], input[name=email]', email).catch(() => {});
    await page.fill('input[type=password], input[name=password]', nuevaPass).catch(() => {});
    await page.click('button[type=submit]').catch(() => {});
    await page.waitForTimeout(6000);
    const entroConNueva = !/\/login\b/.test(page.url());
    await mirar(page, 'extra-recovery-04-login-con-nueva.png');

    return {
      ok: entroConNueva,
      detalle: entroConNueva
        ? 'token real de recuperación funcionó de punta a punta: se cambió la contraseña en /update-password y se entró con la nueva'
        : `se cambió la contraseña pero el login con la nueva password rebotó en ${page.url()}`,
      url: page.url(),
      // GoTrue invalida la sesión vieja cuando la contraseña cambia (correcto por seguridad),
      // así que la `page` PRINCIPAL del recorrido —que entró con la password original antes de
      // llamar a esta prueba— queda deslogueada apenas esto corre, aunque corra en un contexto
      // aparte. El llamador tiene que re-loguear `page` con la contraseña NUEVA para poder
      // seguir con los pasos 5-9.
      nuevaPass,
      contrasenaCambiada: true,
    };
  } finally {
    await contexto.close().catch(() => {});
  }
}

/**
 * Escalón 3, nunca probado por este carril: invitar y sacar a un coadministrador desde
 * `/team`. DG-043 (2026-09-17) empezó a cobrar el rol ADMIN por plan
 * (`multiAdminIncluido`, `lib/subscription/coadministradores.ts`) — sin un plan que lo
 * traiga, el modal ni ofrece esa opción. El onboarding real no deja elegir un plan que
 * gatea una capacidad (`TRIAL_PLAN='professional'`, que no la trae), así que primero se
 * sube el plan de la organización `zz-qa-` a `clinic` por SQL directo — no es fingir el
 * paso que se mide, es poner al sujeto en la posición donde SÍ debería poder medirse — y
 * recién ahí se invita, se confirma en pantalla, y se vuelve a sacar: el camino de vuelta
 * que hasta el 2026-09-17 no existía para NINGÚN rol (`t_...` quitar-administrador).
 *
 * Corre en un CONTEXTO APARTE, igual que `probarRecuperacionDeContrasena`: si algo rompe
 * acá no se lleva puesto el resto del recorrido, que ya terminó cuando esto corre.
 */
async function probarCoadministrador(navegador, email, password, negocio) {
  if (!negocio.startsWith('zz-qa-') || !negocio.endsWith('-negocio')) {
    return { ok: false, detalle: 'sólo se prueba con una organización zz-qa-...-negocio' };
  }
  const sello = negocio.replace(/^zz-qa-/, '').replace(/-negocio$/, '');
  // El correo lleva la forma `zz-qa-<fecha>-<hora>-coadmin`, la MISMA que `limpiarProduccion()`
  // reconoce como propia (`MIO`): si el sufijo fuera al revés (`zz-qa-coadmin-<sello>`) el
  // `auth.users` de la invitación sobreviviría a la limpieza sin que nada avisara.
  const nombreCoadmin = `zz-qa-${sello}-coadmin`;
  const emailCoadmin = `zz-qa-${sello}-coadmin@onia.com.bo`;

  let orgId = '';
  try {
    orgId = execFileSync('docker', [
      'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc',
      `SELECT id FROM organizations WHERE name = '${negocio}' AND name LIKE 'zz-qa-%'`,
    ], { encoding: 'utf8', timeout: 20_000 }).trim();
  } catch (e) {
    return { ok: false, detalle: `no se pudo leer el id de la organización: ${e.message}` };
  }
  if (!orgId) return { ok: false, detalle: 'no se encontró la organización zz-qa- por nombre' };

  try {
    execFileSync('docker', [
      'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-tAc',
      `UPDATE organizations SET plan = 'clinic' WHERE id = '${orgId}' AND name LIKE 'zz-qa-%'`,
    ], { encoding: 'utf8', timeout: 20_000 });
  } catch (e) {
    return { ok: false, detalle: `no se pudo subir el plan a 'clinic' (el que trae multiAdminIncluido): ${e.message}` };
  }

  const contexto = await navegador.newContext({ viewport: VIEWPORT, locale: 'es-BO' });
  const page = await contexto.newPage();
  try {
    await ir(page, `${APP}/login`);
    await page.fill('input[type=email], input[name=email]', email).catch(() => {});
    await page.fill('input[type=password], input[name=password]', password).catch(() => {});
    await page.click('button[type=submit]').catch(() => {});
    await page.waitForTimeout(5000);
    if (/\/login\b/.test(page.url())) {
      return { ok: false, detalle: `no se pudo volver a entrar para probar /team (quedó en ${page.url()})`, emailCoadmin };
    }

    await ir(page, `${APP}/team`);
    await mirar(page, 'extra-coadmin-00-team.png');

    const abrir = page.getByRole('button', { name: /invitar/i }).first();
    if (!(await abrir.count())) return { ok: false, detalle: 'no se encontró el botón "Invitar" en /team', emailCoadmin };
    await abrir.click().catch(() => {});
    await page.waitForTimeout(500);

    const radioAdmin = page.locator('input[type=radio][name=role][value=ADMIN]');
    if (!(await radioAdmin.count())) {
      await mirar(page, 'extra-coadmin-01-sin-admin.png');
      return {
        ok: false,
        detalle: 'con el plan "clinic" (multiAdminIncluido) el modal de /team NO ofrece el rol Administrador — la puerta de ENTRADA no reconoce la capacidad recién habilitada',
        emailCoadmin,
      };
    }
    await radioAdmin.check().catch(() => {});
    await page.fill('input[type=text][required]', nombreCoadmin).catch(() => {});
    await page.fill('input[type=email][required]', emailCoadmin).catch(() => {});
    await mirar(page, 'extra-coadmin-02-formulario.png');
    await page.click('button[type=submit]').catch(() => {});
    // El toast "invitación enviada" es TRANSITORIO: el modal se autocierra con router.refresh()
    // a los 2.5s (comentario de más abajo), así que leerlo a los 3000ms mide un estado que el
    // propio diseño ya reemplazó. Medido 2026-09-26: a los 3000ms el toast ya no estaba pero la
    // fila del coadministrador SÍ (extra-coadmin-03-invitado.png), y el chequeo viejo cortaba acá
    // dando un falso negativo. El toast queda como dato informativo, no como corte.
    await page.waitForTimeout(600);
    const cuerpoTrasEnviar = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
    const toastVisto = /invitaci[oó]n enviada/i.test(cuerpoTrasEnviar);

    await page.waitForTimeout(2400); // el modal se cierra solo con router.refresh(), tras 2.5s
    await ir(page, `${APP}/team`);
    await mirar(page, 'extra-coadmin-03-invitado.png');
    await mirar(page, 'extra-coadmin-04-team-con-coadmin.png');

    const fila = page.getByText(nombreCoadmin, { exact: false }).first();
    if (!(await fila.count())) {
      return { ok: false, detalle: `la invitación se confirmó pero "${nombreCoadmin}" no aparece en la lista de /team`, emailCoadmin };
    }
    let idCoadmin = '';
    const enlace = fila.locator('xpath=ancestor::a[1]');
    if (await enlace.count()) {
      const href = (await enlace.first().getAttribute('href').catch(() => '')) || '';
      idCoadmin = href.split('/team/')[1] || '';
    }
    if (!idCoadmin) {
      return { ok: false, detalle: `"${nombreCoadmin}" aparece en /team pero no se pudo seguir su enlace a /team/[id]`, emailCoadmin };
    }

    await ir(page, `${APP}/team/${idCoadmin}`);
    await mirar(page, 'extra-coadmin-05-ficha.png');
    const botonEliminar = page.getByRole('button', { name: /eliminar.*del equipo/i }).first();
    if (!(await botonEliminar.count())) {
      return {
        ok: false,
        detalle: `"${nombreCoadmin}" quedó como ADMIN y su ficha no tiene botón para sacarlo del equipo — el camino de VUELTA de un coadministrador está cerrado`,
        emailCoadmin,
        idCoadmin,
      };
    }
    await botonEliminar.click().catch(() => {});
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /s[ií], eliminar/i }).first().click().catch(() => {});
    await page.waitForTimeout(3000);
    await mirar(page, 'extra-coadmin-06-eliminado.png');

    const volvioATeam = /\/team$/.test(new URL(page.url()).pathname);
    const siguePresente = volvioATeam
      ? await page.getByText(nombreCoadmin, { exact: false }).first().count().then((n) => n > 0)
      : true;

    return {
      ok: volvioATeam && !siguePresente,
      detalle: !volvioATeam
        ? `tras "Sí, eliminar" no volvió a /team: quedó en ${page.url()}`
        : siguePresente
          ? `se apretó "Sí, eliminar" pero "${nombreCoadmin}" sigue en la lista de /team`
          : `invitado como Administrador (plan "clinic"), confirmado en /team, y sacado del equipo de punta a punta`,
      emailCoadmin,
      idCoadmin,
      toastVisto,
    };
  } finally {
    await contexto.close().catch(() => {});
  }
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
export function pantallaDelDato(menu, rubro) {
  const PORRUBRO = {
    'Clínica dental': [/paciente/i],
    'Comercio / tienda': [/producto|cat[áa]logo|art[íi]culo/i, /cliente/i],
    'Importadora / distribuidora': [/producto|cat[áa]logo|art[íi]culo/i, /cliente/i],
    'Estética y spa': [/client[ae]/i, /paciente/i],
    // 🔴 Este rubro NO tiene pantalla de clientes, y NO es un fallo del producto: medido el
    // 2026-09-04 en el menú vivo y confirmado en su fuente (`SERVICIOS_NAV_ITEMS`,
    // lib/platform/vertical-pack.ts), su catálogo `/comercio` se llama "Servicios" y el FAB del
    // propio producto ofrece "Nuevo servicio". Con el mapa viejo (sólo cliente/paciente) el
    // paso 6 salía ROJO acusando al producto de no tener dónde cargar un dato del negocio: el
    // falso rojo que este carril existe para NO producir. El patrón de clientes queda PRIMERO
    // igual, así que el día que esa pantalla aparezca, gana ella.
    'Servicios profesionales': [/client[ae]/i, /paciente/i, /servicio/i],
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
 * Carga cuándo atiende el negocio, como lo hace el dueño en el asistente: lun-vie de 09 a 13 y
 * de 15 a 19. Cada fila del editor es "<día> · Cerrado · Agregar horario"; al agregar aparecen
 * dos `<input type=time>` con aria-label "<día> — hora de apertura/cierre" y el botón "Otro
 * turno" para el segundo tramo. Se verifica CONTANDO los inputs que quedaron con el valor
 * pedido, no los clics: cinco días por dos tramos por dos horas son 20 campos.
 */
async function cargarHorarios(page) {
  const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  const TRAMOS = [['09:00', '13:00'], ['15:00', '19:00']];
  for (const dia of DIAS) {
    const fila = page.getByText(dia, { exact: true }).first().locator('..');
    await fila.getByRole('button', { name: /agregar horario/i }).click({ timeout: 8000 }).catch(() => {});
    await fila.getByRole('button', { name: /otro turno/i }).click({ timeout: 8000 }).catch(() => {});
    for (let i = 0; i < TRAMOS.length; i++) {
      await page.getByLabel(`${dia} — hora de apertura`).nth(i).fill(TRAMOS[i][0]).catch(() => {});
      await page.getByLabel(`${dia} — hora de cierre`).nth(i).fill(TRAMOS[i][1]).catch(() => {});
    }
  }
  await page.waitForTimeout(500);
  const cargados = await page.evaluate(() =>
    [...document.querySelectorAll('input[type=time]')].filter((i) => /^(09:00|13:00|15:00|19:00)$/.test(i.value)).length
  );
  return cargados === DIAS.length * TRAMOS.length * 2;
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
  let horariosCargados = false;
  let profesionalCargado = false;
  const cierre = (extra) => ({ traza, horariosCargados, profesionalCargado, ...extra });
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
      return cierre({ cerro: true });
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
      } else if (donde.cual === 'asistente-2') {
        // 🔴 Acá se apretaba "Saltar por ahora", y ese salto dejaba la AGENDA SIN NADIE: el
        // producto arma el horario del dueño a partir de estos tramos (`aplicar/route.ts`), así
        // que sin horarios no hay profesional y "Agendar Cita" no tiene con quién. Un cliente
        // real carga cuándo atiende; con --escribir el recorrido también.
        if (ESCRIBIR) {
          horariosCargados = await cargarHorarios(page);
          traza.push({ pantalla: 'horarios', vio: donde.h1, apreto: await apretar(/^continuar/i, `Continuar (${horariosCargados ? 'lun-vie 09-13 y 15-19 cargados' : 'NO se pudieron cargar los horarios'})`) });
        } else {
          traza.push({ pantalla: 'horarios', vio: donde.h1, apreto: await apretar(/saltar por ahora/i, 'Saltar por ahora') });
        }
      } else if (donde.cual === 'asistente-3') {
        // Servicios: no se inventan precios. Se salta como lo saltaría alguien apurado.
        traza.push({ pantalla: 'servicios', vio: donde.h1, apreto: await apretar(/saltar por ahora/i, 'Saltar por ahora') });
      } else if (donde.cual === 'asistente-4') {
        // El último paso es el que CIERRA el alta (manda el POST). Con --escribir se carga un
        // profesional zz-qa- —"con al menos una persona cargada ya podés agendar", dice la propia
        // pantalla—; sin él se salta, y el POST va sin miembro de equipo.
        if (ESCRIBIR && SALTAR_EQUIPO) {
          traza.push({ pantalla: 'equipo', vio: donde.h1, apreto: await apretar(/saltar por ahora/i, 'Saltar por ahora — SIN cargar profesional (cierra el alta)') });
        } else if (ESCRIBIR) {
          const nombre = page.getByLabel(/^Nombre/).first();
          await nombre.fill(QA.profesional).catch(() => {});
          await page.getByRole('button', { name: /profesional|veterinari/i }).first().click({ timeout: 5000 }).catch(() => {});
          profesionalCargado = (await nombre.inputValue().catch(() => '')) === QA.profesional;
          traza.push({ pantalla: 'equipo', vio: donde.h1, apreto: await apretar(/^terminar/i, `Terminar (${profesionalCargado ? `profesional ${QA.profesional}` : 'sin poder cargar el profesional'}; cierra el alta)`) });
        } else {
          traza.push({ pantalla: 'equipo', vio: donde.h1, apreto: await apretar(/saltar por ahora/i, 'Saltar por ahora (cierra el alta)') });
        }
        await page.waitForTimeout(4000);
      } else {
        traza.push({ pantalla: 'desconocida', vio: donde.h1 || '(sin título)', apreto: '—' });
        return cierre({ cerro: false, motivo: `el asistente mostró una pantalla que no sé leer: "${donde.h1 || 'sin título'}"` });
      }
    } catch (e) {
      traza.push({ pantalla: donde.cual, vio: donde.h1, apreto: `FALLÓ: ${e.message.split('\n')[0]}` });
      return cierre({ cerro: false, motivo: `se plantó en "${donde.h1 || donde.cual}": no pudo apretar el botón que sigue` });
    }
  }
  return cierre({ cerro: false, motivo: 'el asistente no terminó en 12 pantallas: puede estar en bucle' });
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
        // La tarjeta del rubro es su PROMESA DE VENTA, y es el único juez honesto de si el paso 7
        // (agendar) le corresponde a este rubro. "Clínica dental — Pacientes, citas, tratamientos
        // y cobros" y "Estética y spa — Agenda, clientas..." prometen agenda; "Comercio / tienda —
        // Catálogo, inventario, caja y clientes" no la nombra. Se LEE de la pantalla y no de una
        // tabla mía a propósito: una tabla escrita a mano se vence, y este carril terminaría
        // exigiéndole citas a una tienda para siempre (o peor: dejando de exigírselas a la clínica).
        // El crudo se guarda aparte porque el matcheo va contra él: limpiarlo podría comerse justo
        // la palabra que decide, y eso haría fallar ABIERTO al paso 7.
        ctx.rubroPromesaCruda = (await tarjeta.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
        ctx.rubroPromesa = ctx.rubroPromesaCruda
          .replace(/\s*Empezar aqu[íi]\s*arrow_forward\s*$/i, '')
          .trim();

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

      // 🔴 Este paso ya acusó DOS veces al producto de algo que el producto sí hace.
      //
      // Primero reportaba `la pantalla dice: "error"`, porque barría `p, span` y se quedaba con
      // la primera palabra que matcheara. Se cambió a escuchar /token, que trae el código exacto.
      //
      // Y el 2026-09-04 eso tampoco alcanzó: firmó «rebotó en /login — SIN MENSAJE VISIBLE» sobre
      // una pantalla con un cartel rojo que dice, entero, "Tu cuenta está creada, pero falta
      // verificar tu correo" (captura paso-04-entrar.png). Las dos sondas fallaron a la vez y por
      // motivos distintos: el login de la app entra por el SERVIDOR de Next —el 400 de Supabase
      // salió de 172.19.0.10, una IP interna—, así que la respuesta /token NUNCA pasa por el
      // navegador y `page.on('response')` no la puede ver; y el cartel no trae ninguna de las
      // clases que se buscaban. Un instrumento que se queda mudo miente en la dirección más cara:
      // "sin mensaje visible" manda a arreglar un login que está impecable.
      //
      // Por eso ahora hay una tercera sonda que no depende de adivinar clases CSS ni de que el
      // error viaje por el navegador: se guarda el texto de la pantalla ANTES de apretar y se
      // compara con el de después. Lo que apareció y no estaba es, por definición, lo que el
      // producto te contestó. Es lo que hace un humano: mirar.
      let errorApi = '';
      const oirToken = async (resp) => {
        if (!/\/token\b/.test(resp.url()) || resp.status() < 400) return;
        const j = await resp.json().catch(() => null);
        if (j) errorApi = j.error_code || j.error || j.msg || j.message || '';
      };
      page.on('response', oirToken);

      /** El texto visible, en líneas limpias. Sirve para el antes y para el después. */
      const lineasVisibles = () => page.evaluate(() => (document.body.innerText || '')
        .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean));

      const intentar = async (llave) => {
        errorApi = '';
        await ir(page, `${APP}/login`);
        await page.fill('input[type=email], input[name=email]', llave.user).catch(() => {});
        await page.fill('input[type=password], input[name=password]', llave.pass).catch(() => {});
        const antes = await lineasVisibles().catch(() => []);
        await page.click('button[type=submit]').catch(() => {});
        await page.waitForTimeout(6000);
        if (!/\/login\b/.test(page.url())) return { entro: true };

        // 1) Los contenedores que un formulario accesible usa para gritar un error.
        let motivo = await page.evaluate(() => {
          const t = [...document.querySelectorAll('[role=alert], [aria-live], .error, .text-red-500, .text-destructive')]
            .map((el) => (el.innerText || '').replace(/\s+/g, ' ').trim())
            .filter((x) => x && x.length < 300);
          return t[0] || '';
        }).catch(() => '');

        // 2) Si no hay ninguno: lo que apareció después de apretar. Se descartan las líneas que
        // ya estaban (el formulario entero) y las de un solo dato —el correo que acabo de
        // teclear reaparece— para no confundir un eco con un mensaje.
        if (!motivo) {
          const despues = await lineasVisibles().catch(() => []);
          const previas = new Set(antes);
          motivo = despues.find((l) => !previas.has(l) && l.length > 15 && l.length < 300 && /\s/.test(l)) || '';
        }
        return { entro: false, motivo, codigo: errorApi };
      };

      let ultimo = '';
      for (const llave of llaveros) {
        let r = await intentar(llave);

        // El alta pide confirmar el correo antes del primer login (medido: el mail SALE y el MX
        // lo acepta). El cliente hace clic en ese enlace; el instrumento no tiene buzón, así que
        // abre el MISMO enlace que se le mandó — mismo navegador, misma sesión, igual que el
        // cliente. No se toca `email_confirmed_at` a mano: eso sería fingir el paso que se mide.
        // El código viaja en TRES formas según por dónde salga —`error_code` de la API, el texto
        // `msg`, o el cartel en castellano que pinta la app— y se aceptan las tres. Buscar sólo
        // la de guiones bajos dejó el paso muerto una corrida; y el 2026-09-04, con el login
        // resuelto en el servidor, la única forma que llegó fue la tercera: "Tu cuenta está
        // creada, pero falta VERIFICAR tu correo". El patrón pedía "confirm" y no matcheaba
        // "verificar", así que el paso ni intentó la confirmación que ya sabía hacer.
        const sinConfirmar = /email[_ ]not[_ ]confirmed|(?:confirm|verific)[^"]{0,40}(?:tu |el |the )?(?:correo|cuenta|email)|correo[^"]*(?:no|sin)[^"]*(?:confirm|verific)/i
          .test(`${r.codigo || ''} ${r.motivo || ''}`);
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
          let extraRecovery = '';
          if (PROBAR_RECOVERY && llave.user === QA.email) {
            // Se prueba DESPUÉS de que el login normal ya funcionó (para no arriesgar el resto
            // del recorrido si la recuperación falla). Cambia la password de la cuenta zz-qa-
            // y vuelve a dejar la sesión abierta con la contraseña NUEVA — la limpieza al final
            // borra la cuenta entera, así que la password vieja no hace falta para nada más.
            const recovery = await probarRecuperacionDeContrasena(page.context().browser(), QA.email, QA.password);
            ctx.recoveryProbado = recovery;
            extraRecovery = ` — recuperación de contraseña con token real: ${recovery.ok ? 'OK' : 'ROTO'} (${recovery.detalle})`;
            if (recovery.contrasenaCambiada) {
              // La prueba de recuperación corrió en OTRO contexto pero cambió la password del
              // lado del servidor: GoTrue revoca la sesión vieja, así que esta `page` —que
              // entró antes, con la password original— quedó deslogueada. Hay que volver a
              // entrar con la NUEVA antes de seguir a los pasos 5-9, o el recorrido entero
              // corta ahí por una causa que no es del producto.
              await ir(page, `${APP}/login`);
              await page.fill('input[type=email], input[name=email]', QA.email).catch(() => {});
              await page.fill('input[type=password], input[name=password]', recovery.nuevaPass).catch(() => {});
              await page.click('button[type=submit]').catch(() => {});
              await page.waitForTimeout(6000);
              extraRecovery += `; re-logueado con la password nueva para seguir el recorrido: ${/\/login\b/.test(page.url()) ? 'FALLÓ' : 'OK'}`;
            }
          }
          return {
            estado: 'ok',
            detalle: `entró con ${llave.de}; quedó en ${page.url()}${ctx.confirmoCorreo?.ok ? ' — hizo falta confirmar el correo primero, como haría el cliente con el enlace del mail' : ''}${extraRecovery}`,
            confirmoCorreo: ctx.confirmoCorreo || null,
            recoveryProbado: ctx.recoveryProbado || null,
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
      const { traza, cerro, motivo, horariosCargados, profesionalCargado } = await completarOnboarding(page);
      ctx.trazaOnboarding = traza;
      ctx.horariosCargados = horariosCargados;
      for (const t of traza) console.log(`        · ${t.pantalla}: "${t.vio}" → ${t.apreto}`);
      const despues = await mirar(page, 'paso-05b-onboarding-listo.png');

      // 🔴 LA VERIFICACIÓN NO ES HABER APRETADO LOS BOTONES. Cuatro clics y una pantalla de
      // "listo" es exactamente la clase de evidencia que ya hizo cantar RECORRIDO COMPLETO a
      // este mismo script sobre un camino roto. Lo que prueba que el alta se cerró es el EFECTO:
      // el producto retiene en /onboarding a toda cuenta sin `onboardingCompletedAt`, así que
      // si /dashboard deja de rebotar, el gate se levantó. Se mide el efecto, no la acción.
      const prueba = await llegar(page, '/dashboard', 'paso-05c-gate-levantado.png');
      ctx.onboardingPendiente = !prueba.llego;
      // El EFECTO de los horarios, no el clic: cuántas filas de agenda dejó el alta. Cero acá es
      // exactamente el "no trabaja este día" con el que después se estrella el paso 7.
      const agendas = prueba.llego
        ? await page.evaluate(async () => {
          try { const j = await (await fetch('/api/doctor-schedules')).json(); return Array.isArray(j) ? j.length : -1; } catch { return -1; }
        })
        : null;
      if (!prueba.llego) {
        // 🔴 2026-09-17: /dashboard rebota a /profile?mfa=obligatorio (MFA_ENFORCE_FROM
        // vencido, b1247fb sin publicar — ver ULTIMO_RECORRIDO.md). Reportado y bloqueado
        // hace 4 vueltas seguidas SIN saber si es un muro de verdad o si hay una salida:
        // ¿el propio /profile deja ENROLAR el 2FA y seguir? Si no hay salida, la severidad
        // real es "todo cliente nuevo queda afuera del producto", no sólo "un aviso molesto".
        let escapatoria = null;
        if (/^\/profile/.test(prueba.destino)) {
          const sondaMfa = await page.evaluate(() => {
            const texto = (document.body.innerText || '').replace(/\s+/g, ' ');
            const botones = [...document.querySelectorAll('button, a[href]')]
              .map((el) => (el.innerText || '').replace(/\s+/g, ' ').trim())
              .filter(Boolean);
            return {
              textoVisible: texto.slice(0, 400),
              hayQr: !!document.querySelector('img[src*="qr" i], canvas'),
              hayInputCodigo: !!document.querySelector('input[inputmode="numeric"], input[maxlength="6"], input[autocomplete="one-time-code"]'),
              // El botón real (visto en captura 2026-09-17) dice "Activar" o "Activar ahora",
              // pegado al texto "Verificación en dos pasos" / "verificación en dos pasos es
              // obligatoria". Un regex ancho (que también matchee "Configuración") agarra el
              // primer botón del sidebar y clickea el link equivocado — falso negativo ya
              // medido: reportó "botón decorativo" cuando el real ni se tocó. Priorizar el
              // texto exacto ANTES de caer a algo más ancho.
              botonActivar:
                botones.find((b) => /^activar( ahora)?$/i.test(b.trim())) ||
                botones.find((b) => /\bhabilit\w*\s+(el\s+)?(2fa|verificaci[oó]n|autenticaci[oó]n)/i.test(b)) ||
                null,
              botones,
            };
          });
          const capturaMfa = await mirar(page, 'paso-05d-mfa-obligatorio.png');
          if (sondaMfa.botonActivar) {
            // Red y consola durante el clic: si el botón dispara un fetch que falla, eso
            // apunta al backend; si no dispara NADA, el handler del botón está roto o ausente.
            const pedidos = [];
            const erroresConsola = [];
            const onRequest = (req) => { if (/\/api\//.test(req.url())) pedidos.push({ url: req.url(), method: req.method() }); };
            const onResponse = (res) => { if (/\/api\//.test(res.url())) { const p = pedidos.find((x) => x.url === res.url() && !('status' in x)); if (p) p.status = res.status(); } };
            const onConsole = (msg) => { if (msg.type() === 'error') erroresConsola.push(msg.text().slice(0, 200)); };
            page.on('request', onRequest);
            page.on('response', onResponse);
            page.on('console', onConsole);
            const clicOk = await page.click(`text="${sondaMfa.botonActivar}"`, { timeout: 5000 }).then(() => true).catch(() => false);
            await page.waitForTimeout(1500);
            page.off('request', onRequest);
            page.off('response', onResponse);
            page.off('console', onConsole);
            const sondaTrasClic = await page.evaluate(() => ({
              hayQr: !!document.querySelector('img[src*="qr" i], canvas'),
              hayInputCodigo: !!document.querySelector('input[inputmode="numeric"], input[maxlength="6"], input[autocomplete="one-time-code"]'),
              // 🔴 [role="dialog"] SOLO, sin exigir visibilidad, dio un falso positivo medido
              // 2026-09-17: el widget del asistente ("Preguntá por tu negocio") vive en el DOM
              // con ese rol aunque esté cerrado, y "detectaba" un modal de MFA que la captura
              // de pantalla muestra que nunca se abrió. offsetParent !== null descarta lo oculto.
              hayModal: [...document.querySelectorAll('[role="dialog"]')].some((el) => el.offsetParent !== null),
            }));
            const capturaTrasClic = await mirar(page, 'paso-05e-mfa-tras-clic.png');
            escapatoria = {
              ofreceEnrolar: true,
              boton: sondaMfa.botonActivar,
              clicOk,
              // Sin poder decodificar un QR real ni generar un TOTP válido, lo que SÍ se puede
              // afirmar es si el producto entrega el material para enrolar (QR o secreto +
              // campo de código). Si ninguno aparece tras el clic, el botón es decorativo.
              entregaMaterialParaEnrolar: sondaTrasClic.hayQr || sondaTrasClic.hayInputCodigo || sondaTrasClic.hayModal,
              pedidosApi: pedidos,
              erroresConsola,
              captura: capturaTrasClic.captura,
            };
          } else {
            escapatoria = { ofreceEnrolar: false, botones: sondaMfa.botones, captura: capturaMfa.captura };
          }
        }
        return {
          estado: 'roto',
          detalle: `el onboarding NO quedó cerrado: ${motivo || 'el asistente dijo haber terminado'}, pero /dashboard sigue rebotando a ${prueba.destino}. Traza: ${traza.map((t) => t.pantalla).join(' → ')}${escapatoria ? ` — MFA: ${escapatoria.ofreceEnrolar ? `ofrece "${escapatoria.boton}" (clic ${escapatoria.clicOk ? 'OK' : 'FALLÓ'}), ${escapatoria.entregaMaterialParaEnrolar ? 'SÍ entrega QR/código para enrolar' : `NO entregó QR ni campo de código tras apretarlo — botón decorativo, camino sin salida (pedidos /api/ durante el clic: ${escapatoria.pedidosApi?.length ? escapatoria.pedidosApi.map((p) => `${p.method} ${p.url.replace(APP,'')} → ${p.status ?? 'sin respuesta'}`).join(', ') : 'NINGUNO — el botón no disparó ni un fetch'}${escapatoria.erroresConsola?.length ? `; consola: ${escapatoria.erroresConsola.join(' | ')}` : ''})`}` : `NO ofrece ningún botón para activar/enrolar (botones vistos: ${(escapatoria.botones || []).slice(0, 8).join(' | ') || 'ninguno'}) — callejón sin salida`}` : ''}`,
          traza, horariosCargados, profesionalCargado, agendas,
          capturaAsistente: despues.captura,
          escapatoriaMfa: escapatoria,
          ...prueba,
        };
      }
      return {
        estado: 'ok',
        detalle: `onboarding COMPLETADO en ${traza.length} pantallas (${traza.map((t) => t.pantalla).join(' → ')})${cerro ? '' : ' — el asistente no mostró el cierre, pero el gate se levantó igual'}; /dashboard ya no rebota${ESCRIBIR ? `; horarios ${horariosCargados ? 'cargados' : 'NO cargados'}, ${agendas === -1 ? 'la agenda no se pudo leer (este rubro puede no tenerla)' : `${agendas} fila(s) de agenda`}` : ''}`,
        traza, horariosCargados, profesionalCargado, agendas,
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
    nombre: 'cita',
    que: 'Agendar una cita zz-qa- con el paciente del paso 6 y VERLA en la agenda',
    requiereSesion: true,
    /**
     * 🔴 Este paso no existía, y por eso nadie vio que "Agendar Cita" fallaba en silencio en
     * producción (2026-09-03): el recorrido cargaba un paciente y saltaba al cobro. Agendar es
     * lo que un negocio hace el primer día, y es el primer POST del producto cuyo error la
     * pantalla NO muestra —el server contesta 400 "La cita debe ser futura" y el modal se queda
     * abierto, mudo—. Por eso acá el veredicto sale de la RESPUESTA DE RED, no de la pantalla:
     * status y body del POST /api/appointments, y después la cita buscada en la agenda recargada.
     */
    async correr(page, ctx) {
      if (!ESCRIBIR) return { estado: 'no-medido', detalle: 'sin --escribir no se agenda nada' };
      if (!ctx.datoCargado) return { estado: 'no-medido', detalle: 'el paso 6 no dejó ningún paciente con quien agendar' };

      // La agenda se busca en el menú de ESTE rubro, como el cobro: un comercio no tiene Citas.
      const menu = ctx.menu?.length ? ctx.menu : await descubrirMenu(page);
      let agenda = null;
      for (const p of [/\bcitas?\b/i, /agenda/i, /turnos?/i]) { agenda = menu.find((m) => p.test(m.texto)); if (agenda) break; }
      // 🔴 UN RUBRO SIN AGENDA NO ES UN PRODUCTO ROTO, Y CONFUNDIRLOS ROMPE ESTE CARRIL EN LAS DOS
      // DIRECCIONES. Medido el 2026-09-04: comercio salió 6/9 con el paso 7 en `no-medido` porque
      // una tienda no tiene citas — su menú ofrece Catálogo, Inventario y Caja, y está BIEN que sea
      // así. Contarlo como agujero deja a 2 de los 5 rubros que se venden hoy imposibilitados de
      // completar el recorrido para siempre, y manda a "arreglar" algo que no está roto.
      //
      // Pero el escape fácil —"si no hay agenda, no aplica"— es exactamente cómo este gate se
      // rendiría de gratis: el día que dental PIERDA su agenda saldría verde, que es el falso verde
      // que este carril existe para cazar. Así que quién debe tenerla no lo decide una tabla mía:
      // lo decide la PROMESA DE VENTA del propio rubro, leída de su tarjeta en /register.
      //   promete y no está  → ROJO, y del caro: la venta ofrece lo que el producto no entrega.
      //   no promete y no está → no-aplica: el producto es coherente con lo que vendió.
      //   no promete y SÍ está → se mide igual (abajo): probar de más nunca miente.
      // Y si la promesa no se pudo leer, se EXIGE la agenda: este paso falla CERRADO.
      const promesa = ctx.rubroPromesa || '';
      const prometeAgenda = !ctx.rubroPromesaCruda || /\bagenda\b|\bcitas?\b|\bturnos?\b/i.test(ctx.rubroPromesaCruda);
      if (!agenda) {
        const queOfrece = menu.map((m) => m.texto).join(' · ');
        const quien = ctx.rubroElegido || 'este rubro';
        if (prometeAgenda) {
          return {
            estado: 'roto',
            detalle: `/register le PROMETE agenda a "${quien}" (${promesa || 'no se pudo leer su tarjeta: se exige agenda'}) y el menú del producto NO ofrece ninguna: ${queOfrece}`,
            promesa, prometeAgenda,
          };
        }
        return {
          estado: 'no-aplica',
          detalle: `"${quien}" no vende agenda —su tarjeta de /register ofrece "${promesa}"— y el producto es coherente: su menú tampoco la tiene. No hay nada que agendar acá: ${queOfrece}`,
          promesa, prometeAgenda,
        };
      }

      const v = await llegar(page, agenda.ruta, 'paso-07-cita.png');
      if (v.status >= 400) return { estado: 'roto', detalle: `la agenda (${agenda.ruta}) devolvió ${v.status}`, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoNoLlego(v, ctx, 'la agenda'), ...v };

      // Se escucha la red ANTES de tocar nada: el POST es el único que dice la verdad.
      const red = { post: null, disponibilidad: null };
      const oir = async (resp) => {
        const url = resp.url();
        if (/\/api\/appointments\/availability/.test(url)) {
          const j = await resp.json().catch(() => null);
          const slots = Array.isArray(j?.slots) ? j.slots : null;
          red.disponibilidad = { status: resp.status(), slots: slots?.length ?? null, libres: slots?.filter((s) => s.available).length ?? null };
        } else if (/\/api\/appointments(\?|$)/.test(url) && resp.request().method() === 'POST') {
          red.post = { status: resp.status(), body: (await resp.text().catch(() => '')).slice(0, 300) };
        }
      };
      page.on('response', oir);
      const cerrar = (r) => { page.off('response', oir); return { ...r, agenda, red }; };

      // El botón de la cabecera parte su texto en dos <span> por breakpoint
      // (`app/(dashboard)/appointments/page.tsx:409-411`): "Nueva Cita" en escritorio,
      // "Cita" a secas debajo de `sm`. Buscar sólo el nombre largo deja el botón invisible
      // en móvil aunque esté ahí, clickeable, con el mismo handler — falso rojo del
      // instrumento, no del producto: medido el 2026-09-08 en viewport de 390px.
      // El botón de la cabecera (`app/(dashboard)/appointments/page.tsx:409`) es
      // `<span aria-hidden="true">add</span> <span class="hidden sm:inline">Nueva Cita</span>`:
      // en un viewport angosto (<sm) el ÚNICO texto queda oculto y el ícono está marcado
      // aria-hidden, así que no le queda NINGÚN nombre accesible — medido en producción el
      // 2026-09-08 (el `outerHTML` real sólo trae esos dos hijos, sin variante corta "Cita").
      // Eso es un hueco de accesibilidad real, pero no prueba que el CAMINO esté roto para
      // un usuario que ve: se cae al único botón "add" visible que vive dentro del <header>,
      // y si ESE clic abre el modal de agendar, el camino visual funciona y lo que falta es
      // el nombre accesible — dos hallazgos distintos, no uno.
      let boton = page.getByRole('button', { name: /nueva cita|agendar cita|^cita$/i }).first();
      let botonSinNombre = false;
      if (!(await boton.count().catch(() => 0))) {
        const fallback = page.locator('header button:has(span.material-symbols-outlined)', { hasText: 'add' }).last();
        if (await fallback.count().catch(() => 0)) {
          boton = fallback;
          botonSinNombre = true;
        } else {
          const nombres = await page.getByRole('button').allInnerTexts().catch(() => []);
          return cerrar({ estado: 'roto', detalle: `la agenda (${agenda.ruta}) no ofrece ningún botón para agendar — botones vistos: ${JSON.stringify(nombres)}`, ...v });
        }
      }
      await boton.click({ timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const dlg = page.locator('[role=dialog]').filter({ hasText: /agendar/i }).first();
      if (!(await dlg.isVisible().catch(() => false))) {
        const vista = await mirar(page, 'paso-07b-cita-formulario.png');
        return cerrar({ estado: 'roto', detalle: `apreté el botón de agendar y no se abrió el formulario de cita en ${page.url()}`, ...vista });
      }

      // Los desplegables se llenan por lo que OFRECEN: el paciente es el del paso 6 (si no está
      // en la lista, el producto no lo ofrece y eso es el hallazgo); profesional y motivo, la
      // primera opción real. Un select sin opciones reales es la agenda sin nadie que atienda.
      const elegido = {};
      const selects = dlg.locator('select');
      for (let i = 0; i < await selects.count(); i++) {
        const s = selects.nth(i);
        const opciones = await s.locator('option').evaluateAll((os) => os.map((o) => ({ v: o.value, t: o.textContent.trim() })));
        const paciente = opciones.find((o) => o.t === ctx.datoCargado);
        if (paciente) { await s.selectOption(paciente.v); elegido.paciente = paciente.t; continue; }
        if ((await s.getAttribute('id')) === 'cita-cliente') { elegido.pacientesOfrecidos = opciones.map((o) => o.t); continue; }
        const real = opciones.find((o) => o.v);
        if (!real) { elegido[/cat[áa]logo/i.test(opciones[0]?.t || '') ? 'motivo' : 'profesional'] = null; continue; }
        await s.selectOption(real.v);
        elegido[/cat[áa]logo/i.test(opciones[0]?.t || '') ? 'motivo' : 'profesional'] = real.t;
      }
      // 🔴 Un select vacío o sin el paciente del paso 6 no es "el producto no tiene con qué
      // llenarlo": desde ae2273d (2026-08-23) el modal ofrece alta inline, dos centímetros arriba
      // del desplegable — "+ Nuevo <cliente>" / "+ Nueva <cliente>", según el rubro. Medido
      // 2026-09-06 (t_b777fb4e): declarar roto ANTES de probar ese camino le costó dos vueltas de
      // otro carril investigando código sano. Se prueba acá; si el producto tampoco lo ofrece o
      // falla, RECIÉN entonces es un defecto real.
      let altaInline = null;
      if (!elegido.paciente) {
        const nuevoBtn = dlg.getByRole('button', { name: /^\+\s*(nuevo|nueva)\s/i }).first();
        if (await nuevoBtn.count().catch(() => 0)) {
          await nuevoBtn.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(400);
          const nombreInput = dlg.locator('input[type=text]').first();
          if (await nombreInput.isVisible().catch(() => false)) {
            await nombreInput.fill(ctx.datoCargado);
            const guardar = dlg.getByRole('button', { name: /guardar y seleccionar/i }).first();
            const creado = page.waitForResponse((r) => /\/api\/patients(\?|$)/.test(r.url()) && r.request().method() === 'POST', { timeout: 15_000 }).catch(() => null);
            await guardar.click({ timeout: 5000 }).catch(() => {});
            const resp = await creado;
            await page.waitForTimeout(1000);
            const selCliente = dlg.locator('#cita-cliente');
            const valor = await selCliente.inputValue().catch(() => '');
            const texto = valor
              ? await selCliente.locator(`option[value="${valor}"]`).innerText().catch(() => '')
              : '';
            altaInline = { intentado: true, statusPost: resp?.status ?? null, seleccionoAlPaciente: texto.trim() === ctx.datoCargado };
            if (texto.trim() === ctx.datoCargado) elegido.paciente = texto.trim();
          } else {
            altaInline = { intentado: true, detalle: 'apreté "+ Nuevo/a" y no apareció el campo de nombre' };
          }
        }
      }
      if (!elegido.paciente) {
        const vista = await mirar(page, 'paso-07b-cita-formulario.png');
        const conAlta = altaInline
          ? ` — probé el alta inline ("+ Nuevo/a") y ${altaInline.seleccionoAlPaciente === false ? `no dejó al paciente seleccionado (POST /api/patients → ${altaInline.statusPost})` : altaInline.detalle}`
          : ' — el modal tampoco ofrece un botón de alta inline ("+ Nuevo/a")';
        return cerrar({ estado: 'roto', detalle: `el paciente "${ctx.datoCargado}" del paso 6 NO aparece en el desplegable de la cita. Ofrece: ${(elegido.pacientesOfrecidos || []).join(' · ') || '(nada)'}${conAlta}`, elegido, altaInline, ...vista });
      }

      // Mañana, día hábil, en hora de Bolivia: el server rechaza toda hora ya pasada, y lo que
      // se mide acá es agendar, no el reloj del VPS.
      const fecha = mananaHabil();
      const disponibilidad = page.waitForResponse((r) => /\/api\/appointments\/availability/.test(r.url()), { timeout: 15_000 }).catch(() => null);
      await dlg.locator('input[type=date]').first().fill(fecha).catch(() => {});
      await disponibilidad;
      await dlg.getByText(/cargando/i).first().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
      await page.waitForTimeout(600);
      const horas = dlg.locator('button', { hasText: /^\d{2}:\d{2}$/ });
      if (!(await horas.count().catch(() => 0))) {
        const vista = await mirar(page, 'paso-07b-cita-formulario.png');
        const dice = ((await dlg.innerText().catch(() => '')).match(/no hay horarios[^.]*|no trabaja este d[íi]a[^.]*/i) || [''])[0].trim();
        return cerrar({
          estado: 'roto',
          detalle: `para el ${fecha} la cita no ofrece NINGÚN horario (profesional: ${elegido.profesional || 'ninguno en la lista'})${dice ? ` — la pantalla dice: "${dice}"` : ''}${red.disponibilidad ? ` — availability → ${red.disponibilidad.status}, ${red.disponibilidad.slots} slots, ${red.disponibilidad.libres} libres` : ''}${ctx.horariosCargados === false ? '. El onboarding NO pudo cargar horarios: la agenda quedó sin profesional' : ''}`,
          elegido, fecha, ...vista,
        });
      }
      elegido.hora = (await horas.first().innerText()).trim();
      await horas.first().click({ timeout: 5000 }).catch(() => {});
      await dlg.locator('textarea').first().fill(QA.cita).catch(() => {});
      await page.waitForTimeout(400);
      const lleno = await mirar(page, 'paso-07b-cita-formulario.png');

      const enviar = dlg.locator('button[type=submit]').first();
      if (await enviar.isDisabled().catch(() => true)) {
        return cerrar({ estado: 'roto', detalle: `con paciente, profesional, ${fecha} ${elegido.hora} y notas cargados, el botón "Agendar Cita" sigue deshabilitado`, elegido, fecha, ...lleno });
      }
      const respuesta = page.waitForResponse((r) => /\/api\/appointments(\?|$)/.test(r.url()) && r.request().method() === 'POST', { timeout: 20_000 }).catch(() => null);
      await enviar.click({ timeout: 10_000 }).catch(() => {});
      await respuesta;
      await page.waitForTimeout(2500);
      const modalAbierto = await dlg.isVisible().catch(() => false);
      const errorVisible = (await page.locator('[role=alert], .text-error').allInnerTexts().catch(() => [])).map((t) => t.trim()).filter(Boolean)[0] || '';
      const despues = await mirar(page, 'paso-07c-cita-enviada.png');

      if (!red.post) {
        // 🔴 "No salió el POST" no le sirve a nadie: no distingue un producto roto de un
        // instrumento que no llenó un campo. Se lo preguntamos al NAVEGADOR, que es quien frenó
        // el envío — su validación nativa sabe qué campo es inválido y por qué. Y en un select
        // se cuenta cuántas opciones OFRECE: cero opciones no es "no elegí", es que el producto
        // no tiene con qué llenarlo. Medido el 2026-09-04 en Servicios profesionales, que exige
        // "Seleccionar cliente" y no tiene ninguna pantalla donde crear un cliente.
        const frenan = await dlg.evaluate((raiz) => {
          const campos = [...raiz.querySelectorAll('input, select, textarea')];
          return campos
            .filter((c) => typeof c.checkValidity === 'function' && !c.checkValidity())
            .map((c) => {
              const etiqueta = (
                c.labels?.[0]?.innerText ||
                c.getAttribute('aria-label') ||
                c.name ||
                c.id ||
                c.tagName
              ).replace(/\s+/g, ' ').trim();
              const opciones =
                c.tagName === 'SELECT'
                  ? [...c.options].filter((o) => o.value !== '' && !o.disabled).length
                  : null;
              return { etiqueta, motivo: c.validationMessage, opciones };
            });
        }).catch(() => []);

        const porque = frenan.length
          ? `; el navegador frenó el envío en: ${frenan
              .map((f) => `"${f.etiqueta}" (${f.motivo}${f.opciones !== null ? `, ${f.opciones} opción(es) para elegir` : ''})`)
              .join(' · ')}`
          : '';
        return cerrar({
          estado: 'roto',
          detalle: `apreté "Agendar Cita" y no salió ningún POST a /api/appointments en 20 s${modalAbierto ? '; el formulario sigue abierto' : ''}${porque}`,
          camposQueFrenan: frenan,
          elegido,
          fecha,
          ...despues,
        });
      }
      if (red.post.status !== 201) {
        return cerrar({
          estado: 'roto',
          detalle: `POST /api/appointments → ${red.post.status} ${red.post.body} (paciente ${elegido.paciente}, ${fecha} ${elegido.hora})${errorVisible ? ` — la pantalla dice: "${errorVisible}"` : modalAbierto ? ' — y la pantalla NO mostró ningún error: el formulario quedó abierto, mudo' : ''}`,
          elegido, fecha, ...despues,
        });
      }
      // El body se guarda recortado (la cita entera pesa más de 300 caracteres): el id se lee
      // con una expresión, no parseando el JSON a medias.
      const cita = { id: (red.post.body.match(/"id":"([^"]+)"/) || [])[1] || null };
      ctx.citaCreada = { id: cita.id, notas: QA.cita, fecha, hora: elegido.hora };

      // La verificación es VERLA: se recarga la agenda y se busca al paciente en el mes. Si la
      // cita cayó en el mes siguiente, se pasa de mes una vez, como haría el cliente.
      const agendaRecargada = await llegar(page, agenda.ruta, 'paso-07d-cita-en-agenda.png');
      const buscar = () => page.evaluate((n) => (document.body.innerText || '').includes(n), ctx.datoCargado);
      let enLaAgenda = await buscar();
      if (!enLaAgenda && fecha.slice(0, 7) !== hoyEnBolivia().slice(0, 7)) {
        await page.locator('button', { hasText: 'chevron_right' }).first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1500);
        enLaAgenda = await buscar();
        await mirar(page, 'paso-07d-cita-en-agenda.png');
      }
      // La grilla del mes en un viewport angosto sólo pinta un PUNTO de color en el día, sin
      // texto (el nombre del paciente vive en el panel de detalle, que sólo se pinta con un
      // día SELECCIONADO — `app/(dashboard)/appointments/page.tsx:527`). Buscar el nombre en
      // `body.innerText` es la prueba correcta en escritorio y ciega en móvil: se hace lo que
      // haría el cliente, tocar el día, antes de declarar que el producto "la guardó y no la
      // muestra". Medido el 2026-09-08 en viewport de 390px.
      // El selector por `div.grid > div` + texto exacto NUNCA matcheó en vivo (2026-09-08,
      // 390px): la celda existe (el punto de color se VE en la captura) pero Playwright no la
      // encontró — instrumento roto, no producto. Se cambia a `getByText` sobre el span visible
      // del número, que es lo que un dedo real toca; el click burbujea al div.onClick igual.
      let clickeoDia = null;
      if (!enLaAgenda) {
        const dia = String(Number(fecha.slice(8, 10)));
        const celda = page.getByText(new RegExp(`^${dia}$`), { exact: true }).first();
        if (await celda.count().catch(() => 0)) {
          await celda.click({ timeout: 5000 }).catch((e) => { clickeoDia = String(e.message || e).split('\n')[0]; });
          await page.waitForTimeout(600);
          enLaAgenda = await buscar();
          await mirar(page, 'paso-07d-cita-en-agenda.png');
        } else {
          clickeoDia = 'no encontré una celda con el número de día en la grilla';
        }
      }
      if (!enLaAgenda) {
        return cerrar({ estado: 'roto', detalle: `la cita se creó (201, id ${cita?.id || '?'}) para el ${fecha} ${elegido.hora} y NO aparece en la agenda de ${page.url()}: el producto la guardó y no la muestra${clickeoDia ? ` (tocar el día tampoco sirvió: ${clickeoDia})` : ''}`, elegido, fecha, ...agendaRecargada });
      }
      return cerrar({
        estado: 'ok',
        detalle: `cita ${fecha} ${elegido.hora} con ${elegido.paciente} agendada (201, id ${cita?.id || '?'}) y VISTA en la agenda de ${page.url()}${altaInline?.seleccionoAlPaciente ? ' — el paciente se dio de alta INLINE, desde el propio modal' : ''}${botonSinNombre ? ' — OJO: el botón que lo abrió no tiene NINGÚN nombre accesible en este viewport (ícono aria-hidden + el único texto queda oculto por CSS bajo "sm"), hallazgo aparte' : ''}`,
        elegido, fecha, altaInline, botonSinNombre, capturaFormulario: lleno.captura, ...agendaRecargada,
      });
    },
  },

  {
    n: 8,
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
      //
      // 🔴 Y el 2026-09-03 volvió a pasar, con IMPORTADORA: su pack no tiene Caja NI Facturación
      // —verificado en el código del producto, `lib/platform/vertical-pack.ts:155-156`: ese rubro
      // trae "Créditos" (`/comercio/fiados`) y "Cotizaciones" (`/importadora/cotizaciones`)— así
      // que ningún nombre del patrón matcheaba, se cayó al `/billing` de dental, el producto
      // redirigió al panel y el paso salió no-medido. NO es un fallo del producto: es este patrón
      // que no conocía cómo se llama el cobro en ese rubro. Por eso los nombres se agregan acá,
      // en el orden en que un rubro cobra: primero donde entra la plata (caja, facturación,
      // créditos/fiados) y recién después el paso previo (cotización), que es cobro futuro.
      const menu = ctx.menu?.length ? ctx.menu : await descubrirMenu(page);
      const COBRO = [
        /caja|cobro|facturaci[óo]n|billing|pagos/i,   // dental, comercio, servicios, estética
        /cr[ée]ditos|fiados|cuentas por cobrar/i,     // importadora: la plata que le deben
        /cotizaciones|presupuestos/i,                 // importadora: el paso previo al cobro
      ];
      let cobro = null;
      for (const p of COBRO) { cobro = menu.find((m) => p.test(m.texto)); if (cobro) break; }
      const ruta = cobro?.ruta || '/billing';
      const v = await llegar(page, ruta, 'paso-08-cobro.png');
      const comoSeLlama = `la pantalla de cobro (${cobro?.texto?.replace(/^\S+\s/, '') || 'Facturación'})`;
      if (v.status >= 400) return { estado: 'roto', detalle: `${comoSeLlama} devolvió ${v.status} en ${ruta}`, menuCobro: cobro || null, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoNoLlego(v, ctx, comoSeLlama), menuCobro: cobro || null, ...v };

      // El listado vacío ("0 facturas") no prueba que cobrar funcione. El escalón siguiente:
      // crear una factura zz-qa- de verdad y llegar a SU pantalla de cobro. Sólo aplica si esta
      // pantalla es Facturación (dental/comercio/servicios/estética) y el paso 6 dejó un
      // paciente con quien facturar; si no (p.ej. importadora, que cobra por "Créditos"), el
      // listado que se vio es la medida real y se reporta como antes.
      if (ctx.datoCargado && ruta === '/billing') {
        const factura = await facturarZzQa(page, ctx);
        return { ...factura, menuCobro: cobro || null };
      }
      return { estado: 'ok', detalle: `${comoSeLlama} a la vista en ${page.url()} — FRENADO acá a propósito`, menuCobro: cobro || null, ...v };
    },
  },

  {
    n: 9,
    nombre: 'bandeja',
    que: 'Abrir la bandeja / el panel y ver si el dato del paso 6 aparece',
    requiereSesion: true,
    /**
     * Este paso pregunta si el dato del paso 6 APARECE. Mientras el paso 6 no cargaba nada, no
     * tenía nada que buscar y reportaba OK por abrir el panel: verde sobre el vacío.
     */
    async correr(page, ctx) {
      const v = await llegar(page, '/dashboard', 'paso-09-bandeja.png');
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

/**
 * Borra en producción TODO lo que este script crea, en la misma corrida — y cuenta lo que queda.
 *
 * Antes esto era una instrucción en un doc que cada vuelta tenía que ejecutar a mano, y dos
 * vueltas murieron por tiempo antes de hacerlo: tres cuentas zz-qa- quedaron en producción
 * (2026-09-03). Un instrumento que ensucia y no limpia solo deja basura cada vez que se corta.
 *
 * Cada DELETE lleva `zz-qa-` en el WHERE: la cita por sus notas, y todo lo que cuelga de una
 * organización por el nombre de ESA organización. No se borra por fecha, por rango ni por "los
 * últimos N": la basura sin prefijo es indistinguible de un cliente real y no se toca. Primero
 * las citas (y sus notificaciones, que las referencian por FK), después la organización con las
 * ~70 tablas que le cuelgan —en pasadas, porque las FK entre ellas no tienen un orden declarado—,
 * y al final la cuenta de auth. Las filas se IMPRIMEN antes de borrarlas: si el borrado sale mal,
 * esa impresión es lo único que queda. Todo en UNA transacción: o se va todo o no se va nada.
 */
function limpiarProduccion() {
  const psql = (q) => execFileSync('docker', [
    'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-tAc', q,
  ], { encoding: 'utf8', timeout: 90_000 }).trim();
  // 🔴 EL PREFIJO `zz-qa-` DEJÓ DE SER MÍO, Y MI LIMPIEZA BORRABA POR EL PREFIJO SUELTO.
  // Medido el 2026-09-04: apareció en producción la cita `zz-qa-recall-demo-1` — "zz-qa- control
  // anual (dato de prueba, agente Recall)", creada a las 08:37 UTC DENTRO de una organización
  // real— que otro carril sembró para probar su agente. Zafó de casualidad: puso el texto en
  // `reason` y yo borraba por `notes`. El día que un fixture ajeno use `notes`, un `DELETE FROM
  // appointments WHERE notes LIKE 'zz-qa-%'` se lo lleva puesto, sin aviso y sin forma de saber
  // que existió. Mi propia regla dice "lo que CREASTE lo borrás", no "todo lo que lleve el prefijo".
  //
  // Mis filas llevan siempre la forma fecha-hora (`zz-qa-2026-09-04-1022-paciente`), así que el
  // borrado va por esa FORMA. No por `QA.nombre` a secas: eso dejaría enterrados para siempre a
  // los huérfanos de una corrida mía anterior que se cayó a la mitad, que son justo los que hay
  // que barrer. Lo que lleva el prefijo y NO tiene mi forma se CUENTA y se informa, jamás se toca.
  const MIO = '^zz-qa-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{4}';
  const CUENTAS = {
    citas: `SELECT count(*) FROM appointments WHERE coalesce(notes,'') ~ '${MIO}' OR coalesce(reason,'') ~ '${MIO}'`,
    pacientes: `SELECT count(*) FROM patients WHERE name ~ '${MIO}'`,
    perfiles: `SELECT count(*) FROM profiles WHERE email ~ '${MIO}' OR name ~ '${MIO}'`,
    organizaciones: `SELECT count(*) FROM organizations WHERE name ~ '${MIO}'`,
    usuarios: `SELECT count(*) FROM auth.users WHERE email ~ '${MIO}'`,
  };
  // Lo ajeno con el mismo prefijo: se informa para que quede a la vista de su dueño y para que
  // nadie lea el `count(*) LIKE 'zz-qa-%'` de afuera como basura mía sin limpiar.
  const AJENAS = `SELECT 'appointments '||id||' '||coalesce(nullif(notes,''), reason) FROM appointments
      WHERE (notes LIKE 'zz-qa-%' OR reason LIKE 'zz-qa-%') AND coalesce(notes,'') !~ '${MIO}' AND coalesce(reason,'') !~ '${MIO}'
    UNION ALL SELECT 'organizations '||id||' '||name FROM organizations WHERE name LIKE 'zz-qa-%' AND name !~ '${MIO}'
    UNION ALL SELECT 'auth.users '||id||' '||email FROM auth.users WHERE email LIKE 'zz-qa-%' AND email !~ '${MIO}'`;
  const contar = () => Object.fromEntries(Object.entries(CUENTAS).map(([k, q]) => [k, Number(psql(q))]));
  try {
    const antes = {
      cuentas: contar(),
      filas: psql(`SELECT 'appointments '||id||' '||coalesce(nullif(notes,''), reason) FROM appointments WHERE coalesce(notes,'') ~ '${MIO}' OR coalesce(reason,'') ~ '${MIO}'
        UNION ALL SELECT 'patients '||id||' '||name FROM patients WHERE name ~ '${MIO}'
        UNION ALL SELECT 'organizations '||id||' '||name FROM organizations WHERE name ~ '${MIO}'
        UNION ALL SELECT 'auth.users '||id||' '||email FROM auth.users WHERE email ~ '${MIO}'
        UNION ALL SELECT 'invoices '||i.id||' '||i."invoiceNumber"||' '||i.total FROM invoices i JOIN organizations o ON o.id = i."organizationId" WHERE o.name ~ '${MIO}'`).split('\n').filter(Boolean),
      ajenas: psql(AJENAS).split('\n').filter(Boolean),
    };
    psql(`BEGIN;
      DELETE FROM notifications WHERE "appointmentId" IN (SELECT id FROM appointments WHERE coalesce(notes,'') ~ '${MIO}' OR coalesce(reason,'') ~ '${MIO}');
      DELETE FROM appointments WHERE coalesce(notes,'') ~ '${MIO}' OR coalesce(reason,'') ~ '${MIO}';
      DO $$
      DECLARE org record; t record; pasada int; trabadas int;
      BEGIN
        FOR org IN SELECT id FROM organizations WHERE name ~ '${MIO}' LOOP
          FOR pasada IN 1..6 LOOP
            trabadas := 0;
            FOR t IN SELECT table_name FROM information_schema.columns
                     WHERE table_schema = 'public' AND column_name = 'organizationId' AND table_name <> 'organizations' LOOP
              BEGIN
                EXECUTE format('DELETE FROM %I WHERE "organizationId" IN (SELECT id FROM organizations WHERE id = %L AND name ~ %L)', t.table_name, org.id, '${MIO}');
              EXCEPTION WHEN foreign_key_violation THEN trabadas := trabadas + 1;
              END;
            END LOOP;
            EXIT WHEN trabadas = 0;
          END LOOP;
          DELETE FROM organizations WHERE id = org.id AND name ~ '${MIO}';
        END LOOP;
      END $$;
      DELETE FROM auth.identities WHERE email ~ '${MIO}';
      DELETE FROM auth.users WHERE email ~ '${MIO}';
      COMMIT;`);
    const despues = contar();
    const restantes = Object.values(despues).reduce((a, b) => a + b, 0);
    const ajenas = psql(AJENAS).split('\n').filter(Boolean);
    return { ok: restantes === 0, antes, despues, restantes, ajenas };
  } catch (e) {
    return { ok: false, error: e.message.split('\n').slice(0, 3).join(' ').slice(0, 300) };
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const navegador = await chromium.launch(OPCIONES_CHROMIUM);
  // El reloj del cliente, no el del VPS: el VPS vive en UTC y la agenda calcula "hoy" y los
  // horarios con la hora del navegador. Sin esto, mañana a las 21:00 de La Paz ya es otro día.
  const page = await (await navegador.newContext({ viewport: VIEWPORT, timezoneId: 'America/La_Paz', locale: 'es-BO' })).newPage();

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
  corte = resultados.find((r) => r.estado !== 'ok' && r.estado !== 'no-aplica' && r.n > ultimoOk) || null;

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
  // `no-aplica` NO es un agujero: es un paso que este rubro no vende (ver paso 7). Se lo saca de
  // la cuenta, pero se lo ENUMERA aparte y se lo nombra en el veredicto: un paso que desaparece
  // en silencio es la otra forma de mentir, y ya pasó en este mismo script.
  const noAplican = resultados.filter((r) => r.estado === 'no-aplica');
  const agujeros = resultados.filter((r) => r.estado !== 'ok' && r.estado !== 'no-aplica');
  // Hasta dónde llegó DE CORRIDA: el primer agujero corta, haya verdes después o no.
  const seguidos = agujeros.length ? agujeros[0].n - 1 : PASOS.length;
  // Los TAPADOS son los agujeros que tienen un paso VERDE después: los únicos que el veredicto
  // viejo borraba. Los demás (la cola de "sin sesión" que arrastra un corte temprano) ya los
  // explica el corte, y enumerarlos sólo hace ruido. Acá se separa el agujero que engaña del
  // que se deduce.
  const tapados = agujeros.filter((a) => resultados.some((r) => r.estado === 'ok' && r.n > a.n));

  let coadminProbado = null;
  if (PROBAR_COADMIN && ESCRIBIR && ctx.conSesion) {
    const passwordVigente = ctx.recoveryProbado?.contrasenaCambiada ? ctx.recoveryProbado.nuevaPass : QA.password;
    coadminProbado = await probarCoadministrador(navegador, QA.email, passwordVigente, QA.negocio);
  }

  await navegador.close();

  // Lo creado se borra en la MISMA corrida, y se cuenta lo que queda: el 0 es parte del informe.
  const borrado = ESCRIBIR ? limpiarProduccion() : null;

  const resumen = {
    cuando: new Date().toISOString(),
    // 🔴 El veredicto tiene que NOMBRAR A SU SUJETO. Un resumen.json que dice "completo: true,
    // 9 de 9" sin decir de qué rubro es ilegible en cuanto existe más de uno: la corrida de
    // comercio pisaba el resultado de dental y nadie podía saber cuál se había medido.
    rubro: ctx.rubroElegido || process.env.RECORRIDO_RUBRO || 'Clínica dental',
    rubroPromesa: ctx.rubroPromesa || null,
    escribio: ESCRIBIR,
    saltoEquipo: SALTAR_EQUIPO,
    recoveryProbado: ctx.recoveryProbado || null,
    coadminProbado,
    borrado,
    zzQaRestantes: borrado ? (borrado.restantes ?? null) : 0,
    // Filas con el prefijo `zz-qa-` que NO son de este carril. Van al resumen para que el
    // `count(*) LIKE 'zz-qa-%'` de afuera no se lea como basura mía sin limpiar — y para que su
    // dueño las vea. Nunca se borran acá.
    zzQaAjenas: borrado?.ajenas ?? [],
    // `llegoHasta` es de CORRIDA: el primer agujero lo corta. `ultimoOkSuelto` queda al lado
    // sólo para que se vea la diferencia cuando hay un hueco en el medio — era el número que
    // hacía cantar completo a un recorrido incompleto.
    llegoHasta: seguidos,
    ultimoOkSuelto: ultimoOk,
    completo: agujeros.length === 0,
    deCuantos: PASOS.length,
    corte: corte ? { paso: corte.n, nombre: corte.nombre, estado: corte.estado, detalle: corte.detalle } : null,
    agujeros: agujeros.map((a) => ({ paso: a.n, nombre: a.nombre, estado: a.estado, detalle: a.detalle })),
    noAplican: noAplican.map((a) => ({ paso: a.n, nombre: a.nombre, detalle: a.detalle })),
    datosQA: ESCRIBIR ? QA : null,
    pasos: resultados,
  };
  writeFileSync(join(OUT, 'resumen.json'), JSON.stringify(resumen, null, 2));

  console.log('');
  if (!agujeros.length) {
    const salvo = noAplican.length
      ? ` — salvo el paso ${noAplican.map((a) => a.n).join(' y ')}, que este rubro no vende (${noAplican.map((a) => a.nombre).join(', ')})`
      : '';
    console.log(`RECORRIDO COMPLETO en "${resumen.rubro}": los ${PASOS.length - noAplican.length} pasos que le corresponden${salvo}. Eso es la noticia.`);
  } else {
    console.log(`LLEGÓ HASTA EL PASO ${seguidos} de ${PASOS.length} de corrida, en "${resumen.rubro}".`);
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
    if (ctx.citaCreada) creado.push(`cita ${ctx.citaCreada.fecha} ${ctx.citaCreada.hora} (notas ${ctx.citaCreada.notas})`);
    if (ctx.facturaCreada) creado.push(`factura con ítem ${ctx.facturaCreada.item}`);
    const ajenas = borrado?.ajenas?.length
      ? `\n   ⓘ  Hay ${borrado.ajenas.length} fila(s) con prefijo zz-qa- que NO son de este carril y NO se tocaron: ${borrado.ajenas.join(' | ')}`
      : '';
    if (borrado?.ok) {
      console.log(`\n🧹 Se escribió en producción (${creado.join(' · ')}) y se BORRÓ en esta misma corrida: quedan 0 filas mías.${ajenas}`);
    } else {
      const que = borrado?.error ? `FALLÓ: ${borrado.error}` : `dejó ${borrado?.restantes} fila(s) zz-qa-: ${JSON.stringify(borrado?.despues)}`;
      console.log(`\n⚠️  Se escribió en producción: ${creado.join(' · ')}. El borrado ${que}. HAY QUE BORRARLO A MANO EN ESTA MISMA VUELTA.`);
    }
  }

  // Salida 0 siempre: "el recorrido se corta en el paso 3" es el REPORTE, no un fallo del
  // script. Un exit distinto de cero haría que el corredor lo confunda con una caída.
  process.exit(0);
}

// 🔴 El guard NO es decoración: sin él, importar este archivo para probar una función pura
// LANZA el recorrido entero contra producción (crea cuenta, paciente y cita) y después mata al
// proceso que lo importó con su `process.exit(0)`. Ya le pasó a otro carril con un gate suyo.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // 🔴 SIN NAVEGADOR, SIN CTX: existe porque el recorrido completo tarda 3-30 minutos y una
  // vuelta puede soltar el turno antes de llegar a limpiarProduccion() (medido 2026-09-06,
  // t_f52601e2: 4 corridas de ~188s dejaron 4 organizaciones + usuarios vivos en producción
  // porque el recorrido nunca llegó al final). `--solo-limpiar` es la póliza: barre lo MÍO
  // (forma `zz-qa-AAAA-MM-DD-HHMM`) sin depender de que el recorrido entero termine. Se corre
  // SIEMPRE al arrancar la vuelta, antes del recorrido completo — así un huérfano de la vuelta
  // anterior no sobrevive ni un ciclo.
  if (SOLO_LIMPIAR) {
    const r = limpiarProduccion();
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  } else {
  main().catch((e) => {
    console.error('el recorrido no pudo arrancar:', e.message);
    process.exit(1);
  });
  }
}
