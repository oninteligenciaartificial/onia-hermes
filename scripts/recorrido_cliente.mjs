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
const HOY = new Date().toISOString().slice(0, 10);
const QA = {
  nombre: `zz-qa-${HOY}`,
  negocio: `zz-qa-${HOY}-negocio`,
  email: `zz-qa-${HOY}@onia.com.bo`,
  whatsapp: '59170000000',
  ciudad: 'zz-qa-ciudad',
  password: `zz-qa-${HOY}-Passw0rd!`,
};

/**
 * Credenciales de una cuenta YA EXISTENTE, para los pasos que viven detrás de sesión.
 * Sin ellas los pasos 4-8 se reportan NO MEDIDOS con el motivo — nunca OK.
 * El alta del producto hoy no crea cuentas (ver paso 3), así que sin esto el recorrido
 * no puede pasar del 3, y eso es un dato del producto, no una falla del script.
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

/** Abre una URL midiendo tiempo real. Un 200 que tarda dos minutos es un fallo con cara de éxito. */
async function ir(page, url) {
  const t0 = Date.now();
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
  await page.waitForLoadState('networkidle', { timeout: TIMEOUT }).catch(() => {});
  return { status: resp?.status() ?? 0, ms: Date.now() - t0, urlFinal: page.url() };
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
      if ((await leerCampos()).length === 0) {
        const rubro = process.env.RECORRIDO_RUBRO || 'Clínica dental';
        await page.getByText(rubro).first().click({ timeout: 10_000 }).catch(() => {});
        await page.waitForTimeout(2500);
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
      return {
        estado: crearCuenta ? 'ok' : 'no-medido',
        detalle: crearCuenta
          ? `enviado; la URL pasó de ${antes} a ${page.url()}`
          : `enviado: quedó una SOLICITUD (${QA.email}), no una cuenta. El recorrido no puede seguir solo`,
        campos,
        altaCreaCuenta: crearCuenta,
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
      if (!SESION.user || !SESION.pass) {
        return {
          estado: 'no-medido',
          detalle: ctx.altaCreaCuenta === false
            ? 'el alta no crea cuenta, y no hay credenciales en RECORRIDO_USER/RECORRIDO_PASS: no hay con qué entrar'
            : 'faltan credenciales en RECORRIDO_USER/RECORRIDO_PASS',
        };
      }
      const r = await ir(page, `${APP}/login`);
      await page.fill('input[type=email], input[name=email]', SESION.user).catch(() => {});
      await page.fill('input[type=password], input[name=password]', SESION.pass).catch(() => {});
      await page.click('button[type=submit]').catch(() => {});
      await page.waitForTimeout(6000);
      const vista = await mirar(page, 'paso-04-entrar.png');
      const dentro = !/\/login/.test(page.url());
      ctx.conSesion = dentro;
      return {
        estado: dentro ? 'ok' : 'roto',
        detalle: dentro ? `entró; quedó en ${page.url()}` : `no entró: sigue en ${page.url()} (login devolvió ${r.status})`,
        ...vista,
      };
    },
  },

  {
    n: 5,
    nombre: 'elegir-rubro',
    que: 'Elegir rubro y terminar el onboarding',
    requiereSesion: true,
    async correr(page) {
      const r = await ir(page, `${APP}/onboarding`);
      const vista = await mirar(page, 'paso-05-elegir-rubro.png');
      if (r.status >= 400) return { estado: 'roto', detalle: `el onboarding devolvió ${r.status}`, ...vista };
      return { estado: 'ok', detalle: `onboarding en ${page.url()} (${r.status}, ${r.ms} ms)`, ...vista };
    },
  },

  {
    n: 6,
    nombre: 'cargar-dato',
    que: 'Cargar un dato real del rubro (un cliente, un paciente, un producto)',
    requiereSesion: true,
    async correr(page) {
      const r = await ir(page, `${APP}/patients`);
      const vista = await mirar(page, 'paso-06-cargar-dato.png');
      if (r.status >= 400) return { estado: 'roto', detalle: `la pantalla de datos devolvió ${r.status}`, ...vista };
      return { estado: 'ok', detalle: `pantalla de datos en ${page.url()} (${r.status})`, ...vista };
    },
  },

  {
    n: 7,
    nombre: 'cobro',
    // 🔴 Se MIRA y se FRENA. No se escanea un QR, no se confirma una transferencia, no se
    // mete una tarjeta. Que el botón exista y se vea es todo lo que hay que reportar.
    que: 'Llegar a la pantalla de cobro y MIRARLA. Frenar ahí',
    requiereSesion: true,
    async correr(page) {
      const r = await ir(page, `${APP}/billing`);
      const vista = await mirar(page, 'paso-07-cobro.png');
      if (r.status >= 400) return { estado: 'roto', detalle: `la pantalla de cobro devolvió ${r.status}`, ...vista };
      return { estado: 'ok', detalle: `pantalla de cobro a la vista en ${page.url()} — FRENADO acá a propósito`, ...vista };
    },
  },

  {
    n: 8,
    nombre: 'bandeja',
    que: 'Abrir la bandeja / el panel y ver si el dato del paso 6 aparece',
    requiereSesion: true,
    async correr(page) {
      const r = await ir(page, `${APP}/dashboard`);
      const vista = await mirar(page, 'paso-08-bandeja.png');
      if (r.status >= 400) return { estado: 'roto', detalle: `el panel devolvió ${r.status}`, ...vista };
      return { estado: 'ok', detalle: `panel en ${page.url()} (${r.status})`, ...vista };
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
    else if (!corte) corte = r;
  }

  await navegador.close();

  const resumen = {
    cuando: new Date().toISOString(),
    escribio: ESCRIBIR,
    llegoHasta: ultimoOk,
    deCuantos: PASOS.length,
    corte: corte ? { paso: corte.n, nombre: corte.nombre, estado: corte.estado, detalle: corte.detalle } : null,
    datosQA: ESCRIBIR ? QA : null,
    pasos: resultados,
  };
  writeFileSync(join(OUT, 'resumen.json'), JSON.stringify(resumen, null, 2));

  console.log('');
  if (ultimoOk === PASOS.length) {
    console.log(`RECORRIDO COMPLETO: los ${PASOS.length} pasos. Eso es la noticia.`);
  } else {
    console.log(`LLEGÓ HASTA EL PASO ${ultimoOk} de ${PASOS.length}.`);
    if (corte) console.log(`CORTE en el paso ${corte.n} (${corte.nombre}) — ${corte.estado}: ${corte.detalle}`);
  }
  if (ESCRIBIR) console.log(`\n⚠️  Se escribió en producción con ${QA.email}. HAY QUE BORRARLO EN ESTA MISMA VUELTA.`);

  // Salida 0 siempre: "el recorrido se corta en el paso 3" es el REPORTE, no un fallo del
  // script. Un exit distinto de cero haría que el corredor lo confunda con una caída.
  process.exit(0);
}

main().catch((e) => {
  console.error('el recorrido no pudo arrancar:', e.message);
  process.exit(1);
});
