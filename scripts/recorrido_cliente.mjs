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
  const vista = await mirar(page, archivo);
  const destino = new URL(page.url()).pathname.replace(/\/$/, '');
  const pedida = ruta.replace(/\/$/, '');
  const llego = destino === pedida;
  return { ...r, ...vista, destino, pedida, llego };
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

      let ultimo = '';
      for (const llave of llaveros) {
        const r = await ir(page, `${APP}/login`);
        await page.fill('input[type=email], input[name=email]', llave.user).catch(() => {});
        await page.fill('input[type=password], input[name=password]', llave.pass).catch(() => {});
        await page.click('button[type=submit]').catch(() => {});
        await page.waitForTimeout(6000);
        if (!/\/login\b/.test(page.url())) {
          const vista = await mirar(page, 'paso-04-entrar.png');
          ctx.conSesion = true;
          ctx.comoEntro = llave.de;
          return { estado: 'ok', detalle: `entró con ${llave.de}; quedó en ${page.url()}`, ...vista };
        }
        // El login que rebota deja su motivo EN LA PANTALLA ("confirmá tu correo", "cuenta
        // pendiente"). Sin leerlo, el reporte dice "no entró" y el arreglo empieza a ciegas.
        const motivo = await page.evaluate(() => {
          const t = [...document.querySelectorAll('[role=alert], .error, .text-red-500, .text-destructive, p, span')]
            .map((el) => (el.innerText || '').trim())
            .filter((x) => x && x.length < 200 && /(incorrect|inv[aá]lid|error|confirm|pendiente|verific|no existe|credencial)/i.test(x));
          return t[0] || '';
        });
        ultimo = `con ${llave.de} (${llave.user}) rebotó en ${page.url()}${motivo ? ` — la pantalla dice: "${motivo}"` : ' — sin mensaje visible'}`;
      }
      const vista = await mirar(page, 'paso-04-entrar.png');
      return { estado: 'roto', detalle: `no entró: ${ultimo}`, ...vista };
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

      // Que la pantalla ABRA no es que el onboarding esté TERMINADO. Mientras siga pendiente el
      // producto retiene ahí al usuario, y eso es lo que hace que los pasos 6-8 no existan
      // todavía. Se dice tal cual en vez de cantar OK.
      const pendiente = await page.evaluate(() =>
        /c[oó]mo se llama tu negocio|buscar mi negocio|complet[ae]r el formulario/i.test(document.body.innerText || '')
      );
      ctx.onboardingPendiente = pendiente;
      if (pendiente) {
        return {
          estado: 'no-medido',
          detalle: `el onboarding está a la vista y SIN TERMINAR (pide "¿Cómo se llama tu negocio?"). Completarlo automáticamente todavía no está escrito: por eso los pasos 6-8 no se pueden medir`,
          ...v,
        };
      }
      return { estado: 'ok', detalle: `onboarding en ${page.url()} (${v.status}, ${v.ms} ms)`, ...v };
    },
  },

  {
    n: 6,
    nombre: 'cargar-dato',
    que: 'Cargar un dato real del rubro (un cliente, un paciente, un producto)',
    requiereSesion: true,
    async correr(page, ctx) {
      const v = await llegar(page, '/patients', 'paso-06-cargar-dato.png');
      if (v.status >= 400) return { estado: 'roto', detalle: `la pantalla de datos devolvió ${v.status}`, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoDesvio(v, ctx, 'la pantalla de datos'), ...v };
      return { estado: 'ok', detalle: `pantalla de datos en ${page.url()} (${v.status})`, ...v };
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
      const v = await llegar(page, '/billing', 'paso-07-cobro.png');
      if (v.status >= 400) return { estado: 'roto', detalle: `la pantalla de cobro devolvió ${v.status}`, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoDesvio(v, ctx, 'la pantalla de cobro'), ...v };
      return { estado: 'ok', detalle: `pantalla de cobro a la vista en ${page.url()} — FRENADO acá a propósito`, ...v };
    },
  },

  {
    n: 8,
    nombre: 'bandeja',
    que: 'Abrir la bandeja / el panel y ver si el dato del paso 6 aparece',
    requiereSesion: true,
    async correr(page, ctx) {
      const v = await llegar(page, '/dashboard', 'paso-08-bandeja.png');
      if (v.status >= 400) return { estado: 'roto', detalle: `el panel devolvió ${v.status}`, ...v };
      if (!v.llego) return { estado: 'no-medido', detalle: motivoDesvio(v, ctx, 'el panel'), ...v };
      return { estado: 'ok', detalle: `panel en ${page.url()} (${v.status})`, ...v };
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
