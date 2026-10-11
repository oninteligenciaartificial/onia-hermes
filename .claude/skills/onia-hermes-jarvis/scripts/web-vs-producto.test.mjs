import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditar, ejecutar, htmlATexto } from './web-vs-producto.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const textoDir = path.join(root, 'hermes-content/docs/research/promesas-web/2026-10-11/texto');
const htmlDir = path.join(root, 'hermes-content/docs/research/promesas-web/2026-10-11/html');
const fixtureRoot = path.join(here, 'fixtures/platform');
const fixtureLib = path.join(fixtureRoot, 'lib');
const pageNames = ['home.txt', 'precios.txt', 'chatbot.txt', 'rubros.txt', 'contacto.txt', 'comparativa.txt', 'servicios-webs.txt', 'nosotros.txt', 'app-register-paso2.txt'];
const webPaths = new Map([
  ['/', 'home.txt'], ['/precios', 'precios.txt'], ['/chatbot', 'chatbot.txt'], ['/rubros', 'rubros.txt'],
  ['/contacto', 'contacto.txt'], ['/comparativa', 'comparativa.txt'], ['/servicios/webs', 'servicios-webs.txt'], ['/nosotros', 'nosotros.txt'],
]);

async function loadExample() {
  const pages = Object.fromEntries(await Promise.all(pageNames.map(async (name) => [name, await fs.readFile(path.join(textoDir, name), 'utf8')])));
  const [subscriptionPlans, pricing, planCatalogo] = await Promise.all([
    fs.readFile(path.join(fixtureLib, 'subscription-plans.ts'), 'utf8'),
    fs.readFile(path.join(fixtureLib, 'pricing.ts'), 'utf8'),
    fs.readFile(path.join(fixtureLib, 'plan-catalogo.ts'), 'utf8'),
  ]);
  return { pages, platform: { subscriptionPlans, pricing, planCatalogo } };
}

async function tempPlatform() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'web-vs-producto-'));
  const platform = path.join(dir, 'platform');
  await fs.cp(fixtureRoot, platform, { recursive: true });
  return { dir, platform, lib: path.join(platform, 'lib') };
}

async function withServer(handler, callback) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  try { return await callback(`http://127.0.0.1:${address.port}`); }
  finally {
    server.closeAllConnections?.();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

async function responderHtml({ notFoundPath, hang, reemplazos = {} } = {}) {
  return async (request, response) => {
    if (request.url === notFoundPath) { response.writeHead(404).end('missing'); return; }
    if (hang) return;
    const name = webPaths.get(request.url);
    if (!name) { response.writeHead(404).end('missing'); return; }
    const htmlName = name.replace('.txt', '.html');
    let html = await fs.readFile(path.join(htmlDir, htmlName), 'utf8');
    for (const [antes, despues] of Object.entries(reemplazos)) html = html.replaceAll(antes, despues);
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  };
}

function responder(pages, { notFoundPath, hang } = {}) {
  return async (request, response) => {
    if (request.url === notFoundPath) { response.writeHead(404).end('missing'); return; }
    if (hang) return;
    const name = webPaths.get(request.url);
    if (!name) { response.writeHead(404).end('missing'); return; }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(`<main>${pages[name].split(/\r?\n/).map((line) => `<p>${line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>`).join('')}</main>`);
  };
}

test('las páginas del 11-oct coinciden con precios, topes, textos y promesas', async () => {
  const result = auditar(await loadExample());
  assert.equal(result.codigoSalida, 0);
  assert.equal(result.resumen.diferenciasPrecio, 0);
  assert.equal(result.resumen.textosObra, 0);
  assert.equal(result.resumen.promesasSiguen, 8);
  assert.equal(result.resumen.promesasNoEstan, 0);
  assert.equal(result.promesas.filter((p) => p.estado === 'manual').length, 1);
  assert.deepEqual(result.topes.map((x) => [x.plan, x.web, x.codigo, x.estado]), [
    ['Básico', '300/2/200', '300/2/200', 'coincide'],
    ['Crece', '800/4/400', '800/4/400', 'coincide'],
    ['Profesional', '1500/5/800', '1500/5/800', 'coincide'],
    ['Completo', '-1/-1/-1', '-1/-1/-1', 'coincide'],
  ]);
});

test('sin --platform el comando devuelve NO MEDIDO 2 y no usa fixtures por defecto', async () => {
  const result = await ejecutar(['--texto-dir', textoDir]);
  assert.equal(result.codigoSalida, 2);
  assert.ok(result.noMedido.some((item) => item.detalle.startsWith('falta --platform')));
});

test('una mutación temporal de precio informa valor web y código y sale 1', async () => {
  const temp = await tempPlatform();
  try {
    const file = path.join(temp.lib, 'subscription-plans.ts');
    const original = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, original.replace('crece: { monthly: 550', 'crece: { monthly: 560'));
    const result = await ejecutar(['--texto-dir', textoDir, '--platform', temp.platform]);
    assert.equal(result.codigoSalida, 1);
    assert.ok(result.diferenciasPrecio.includes('Crece · mensual: web 550, código 560'));
  } finally { await fs.rm(temp.dir, { recursive: true, force: true }); }
});

test('una mutación temporal del tope Crece se compara contra PLAN_LIMITS y sale 1', async () => {
  const temp = await tempPlatform();
  try {
    const file = path.join(temp.lib, 'plan-catalogo.ts');
    const original = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, original.replace('crece: { patients: 800, users: 4', 'crece: { patients: 800, users: 5'));
    const result = await ejecutar(['--texto-dir', textoDir, '--platform', temp.platform]);
    assert.equal(result.codigoSalida, 1);
    assert.ok(result.topes.some((x) => x.plan === 'Crece' && x.web === '800/4/400' && x.codigo === '800/5/400' && x.estado === 'DIFIERE'));
  } finally { await fs.rm(temp.dir, { recursive: true, force: true }); }
});

test('los extractores de add-ons se anclan a su constante, no a coincidencias anteriores', async () => {
  const sample = await loadExample();
  sample.platform.pricing = sample.platform.pricing.replace('export const ENTERPRISE_PLAN_PRICE', 'export const CAMPO_AJENO = { setupFrom: 9999 } as const;\nexport const ENTERPRISE_PLAN_PRICE');
  const result = auditar(sample);
  assert.equal(result.codigoSalida, 0);
  assert.equal(result.resumen.diferenciasPrecio, 0);
});

test('si falta ENTERPRISE_PLAN_PRICE, sale 2 como NO MEDIDO y no toma SERVER_DEPLOYMENT_ADDON_PRICE', async () => {
  const temp = await tempPlatform();
  try {
    const file = path.join(temp.lib, 'pricing.ts');
    const source = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, source.replace(/export const ENTERPRISE_PLAN_PRICE = \{[\s\S]*?\} as const;\n?/, ''));
    const result = await ejecutar(['--texto-dir', textoDir, '--platform', temp.platform]);
    assert.equal(result.codigoSalida, 2);
    assert.ok(result.noMedido.some((item) => item.detalle === 'no se encontró ENTERPRISE_PLAN_PRICE en lib/pricing.ts'));
  } finally { await fs.rm(temp.dir, { recursive: true, force: true }); }
});

test('una página viva con 404 no corta la medición de las otras siete', async () => {
  const sample = await loadExample();
  await withServer(responder(sample.pages, { notFoundPath: '/nosotros' }), async (baseWeb) => {
    const data = await ejecutar(['--base-web', baseWeb, '--base-app', 'http://127.0.0.1:1', '--platform', fixtureRoot]);
    assert.equal(data.codigoSalida, 2);
    assert.ok(data.noMedido.some((item) => item.detalle === '/nosotros — HTTP 404'));
    assert.equal(data.resumen.promesasSiguen, 7);
    assert.equal(data.promesas.find((p) => p.id === 'registro-nombre').estado, 'no medible sin navegador');
    assert.equal(data.resumen.diferenciasPrecio, 0);
    assert.equal(Object.keys(data.promesas).length, 9);
  });
});

test('una página que no responde se marca NO MEDIDO al vencer el timeout corto', async () => {
  const started = Date.now();
  const originalTimeout = process.env.WVP_TIMEOUT_MS;
  process.env.WVP_TIMEOUT_MS = '250';
  try {
    await withServer(responder({}, { hang: true }), async (baseWeb) => {
      const data = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
      assert.equal(data.codigoSalida, 2);
      assert.ok(data.noMedido.some((item) => item.detalle.includes('tiempo agotado')));
    });
  } finally {
    if (originalTimeout === undefined) delete process.env.WVP_TIMEOUT_MS;
    else process.env.WVP_TIMEOUT_MS = originalTimeout;
  }
  assert.ok(Date.now() - started < 5000);
});

test('registro se omite en modo web y se comprueba con --texto-dir', async () => {
  const sample = await loadExample();
  await withServer(responder(sample.pages), async (baseWeb) => {
    const live = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
    assert.equal(live.codigoSalida, 0, JSON.stringify(live.noMedido));
    assert.equal(live.promesas.find((p) => p.id === 'registro-nombre').estado, 'no medible sin navegador');
  });
  const local = await ejecutar(['--texto-dir', textoDir, '--platform', fixtureRoot]);
  assert.equal(local.codigoSalida, 0);
  assert.equal(local.promesas.find((p) => p.id === 'registro-nombre').estado, 'sigue');
});

test('las mutaciones L1 conservan su resultado: precio, obra y frase de promesa', async () => {
  const sample = await loadExample();
  sample.pages['precios.txt'] = sample.pages['precios.txt'].replace(/(Profesional\r?\n)890(\r?\nBs \/ mes)/, '$1' + '900' + '$2');
  const price = auditar(sample);
  assert.equal(price.codigoSalida, 1);
  assert.ok(price.diferenciasPrecio.includes('Profesional · mensual: web 900, código 890'));

  const work = await loadExample();
  work.pages['home.txt'] += '\nMuy pronto\n';
  assert.equal(auditar(work).obra[0].archivo, 'home.txt');

  const promise = await loadExample();
  promise.pages['rubros.txt'] = promise.pages['rubros.txt'].replace(/tratamiento a medias/gi, 'tratamiento incompleto');
  const changed = auditar(promise);
  assert.equal(changed.promesas.find((p) => p.id === 'tratamiento-a-medias').estado, 'no está');
  assert.equal(changed.codigoSalida, 0);
});

test('evidencia con una página no medida conserva exit 1 y reporta ambos estados', async () => {
  const sample = await loadExample();
  delete sample.pages['nosotros.txt'];
  sample.pages['home.txt'] += '\nMuy pronto\n';
  const result = auditar({ ...sample, noMedidoInicial: [{ detalle: '/nosotros — HTTP 404', bloqueaVerde: true }] });
  assert.equal(result.codigoSalida, 1);
  assert.equal(result.obra.length, 1);
  assert.ok(result.noMedido.some((item) => item.detalle === '/nosotros — HTTP 404'));
});

test('un bloque DEFAULT_PLAN_AMOUNTS ausente queda NO MEDIDO y sale 2', async () => {
  const sample = await loadExample();
  sample.platform.subscriptionPlans = await fs.readFile(path.join(fixtureLib, 'subscription-plans.sin-bloque.ts'), 'utf8');
  const result = auditar(sample);
  assert.equal(result.codigoSalida, 2);
  assert.ok(result.noMedido.some((item) => item.detalle.includes('DEFAULT_PLAN_AMOUNTS')));
});

test('htmlATexto quita script y style, separa bloques y decodifica entidades', () => {
  assert.equal(htmlATexto('<h1>Hola &amp; adiós</h1><script>malo()</script><p>Bs&nbsp;320</p><style>.x{}</style>'), 'Hola & adiós\nBs 320');
});


test('el HTML real del sitio da la misma auditoría que el texto guardado', async () => {
  const local = await loadExample();
  const expected = auditar(local);
  await withServer(await responderHtml(), async (baseWeb) => {
    const actual = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
    assert.equal(actual.codigoSalida, 0, JSON.stringify(actual.noMedido));
    assert.deepEqual(actual.diferenciasPrecio, expected.diferenciasPrecio);
    assert.deepEqual(actual.topes, expected.topes);
    assert.deepEqual(actual.obra, expected.obra);
    assert.deepEqual(actual.promesas.slice(0, 7), expected.promesas.slice(0, 7));
    assert.equal(actual.promesas[7].estado, 'no medible sin navegador');
    assert.equal(actual.promesas[8].estado, 'manual');
  });
});

test('mutar HTML real detecta precio y frase ausente sin confundirla con página no medida', async () => {
  const precioOriginal = await fs.readFile(path.join(htmlDir, 'precios.html'), 'utf8');
  const precioMutado = precioOriginal.replace(/(<span class=\"sitio_planNum__[^\"]+\">)320(<\/span>)/, '$1330$2');
  assert.notEqual(precioMutado, precioOriginal);
  await withServer(await responderHtml({ reemplazos: { '<span class=\"sitio_planNum__Fuah1\">320</span>': '<span class=\"sitio_planNum__Fuah1\">330</span>' } }), async (baseWeb) => {
    const result = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
    assert.equal(result.codigoSalida, 1);
    assert.ok(result.diferenciasPrecio.includes('Básico · mensual: web 330, código 320'), JSON.stringify({ diff: result.diferenciasPrecio, noMedido: result.noMedido }));
  });

  const chatbotOriginal = await fs.readFile(path.join(htmlDir, 'chatbot.html'), 'utf8');
  const phrase = 'responde las <em>24 horas</em>';
  assert.ok(chatbotOriginal.toLowerCase().includes(phrase));
  await withServer(await responderHtml({ reemplazos: { [phrase]: 'responde durante el día' } }), async (baseWeb) => {
    const result = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
    assert.equal(result.codigoSalida, 0);
    assert.equal(result.promesas.find((item) => item.id === 'whatsapp-24h').estado, 'no está');
  });
});

test('HTML real con espacios y ancla ausente se normaliza o queda NO MEDIDO', async () => {
  await withServer(await responderHtml({ reemplazos: { 'Básico': 'Básico\n', '320': ' 320 ', 'Bs / mes': 'Bs&nbsp;/&nbsp;mes' } }), async (baseWeb) => {
    const result = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
    assert.equal(result.codigoSalida, 0, JSON.stringify(result.noMedido));
  });

  await withServer(await responderHtml({ reemplazos: { 'Planes': 'hola' } }), async (baseWeb) => {
    const result = await ejecutar(['--base-web', baseWeb, '--platform', fixtureRoot]);
    assert.equal(result.codigoSalida, 2);
    assert.ok(result.noMedido.some((item) => item.detalle.includes('precios.txt: falta frase ancla')));
    assert.ok(result.topes.every((item) => item.estado === 'no medida'), JSON.stringify({ topes: result.topes, noMedido: result.noMedido }));
    assert.equal(result.promesas.find((item) => item.id === 'agente-incluido').estado, 'no medida');
    assert.notEqual(result.promesas.find((item) => item.id === 'agente-incluido').estado, 'no está');
  });
});
