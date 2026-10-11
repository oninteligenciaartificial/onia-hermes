import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditar, auditarSeguro, htmlATexto } from './web-vs-producto.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const textoDir = path.join(root, 'hermes-content/docs/research/promesas-web/2026-10-11/texto');
const fixture = path.join(here, 'fixtures/platform/lib');

async function loadExample() {
  const names = ['home.txt', 'precios.txt', 'chatbot.txt', 'rubros.txt', 'contacto.txt', 'comparativa.txt', 'servicios-webs.txt', 'nosotros.txt', 'app-register-paso2.txt'];
  const pages = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await fs.readFile(path.join(textoDir, name), 'utf8')])));
  const [subscriptionPlans, pricing] = await Promise.all([
    fs.readFile(path.join(fixture, 'subscription-plans.ts'), 'utf8'),
    fs.readFile(path.join(fixture, 'pricing.ts'), 'utf8'),
  ]);
  return { pages, platform: { subscriptionPlans, pricing } };
}

test('las páginas del 11-oct coinciden con precios, textos y promesas documentados', async () => {
  const result = auditar(await loadExample());
  assert.equal(result.resumen.diferenciasPrecio, 0);
  assert.equal(result.resumen.textosObra, 0);
  assert.equal(result.resumen.promesasSiguen, 8);
  assert.equal(result.resumen.promesasNoEstan, 0);
  assert.equal(result.promesas.filter((p) => p.estado === 'manual').length, 1);
  assert.equal(result.topes.length, 4);
});

test('una cifra mensual web distinta identifica la diferencia', async () => {
  const sample = await loadExample();
  sample.pages['precios.txt'] = sample.pages['precios.txt'].replace(/(Profesional\r?\n)890(\r?\nBs \/ mes)/, '$1' + '900' + '$2');
  const result = auditar(sample);
  assert.equal(result.resumen.diferenciasPrecio, 1);
  assert.ok(result.diferenciasPrecio.includes('Profesional · mensual: web 900, código 890'));
});

test('un texto de obra cita archivo y línea', async () => {
  const sample = await loadExample();
  sample.pages['home.txt'] += '\nMuy pronto\n';
  const result = auditar(sample);
  assert.equal(result.resumen.textosObra, 1);
  assert.deepEqual(result.obra[0], { archivo: 'home.txt', linea: sample.pages['home.txt'].split('\n').length - 1, texto: 'Muy pronto' });
});

test('si desaparece una frase, la promesa pasa a no está sin cambiar el código de salida', async () => {
  const sample = await loadExample();
  sample.pages['rubros.txt'] = sample.pages['rubros.txt'].replace(/tratamiento a medias/gi, 'tratamiento incompleto');
  const result = auditar(sample);
  assert.equal(result.promesas.find((p) => p.id === 'tratamiento-a-medias').estado, 'no está');
  assert.equal(result.resumen.diferenciasPrecio, 0);
  assert.equal(result.resumen.textosObra, 0);
});

test('un cambio de forma en subscription-plans devuelve error NO MEDIDO', async () => {
  const sample = await loadExample();
  sample.platform.subscriptionPlans = await fs.readFile(path.join(fixture, 'subscription-plans.sin-bloque.ts'), 'utf8');
  const result = auditarSeguro(sample);
  assert.equal(result.codigoSalida, 2);
  assert.match(result.data.noMedido[0], /DEFAULT_PLAN_AMOUNTS/);
});

test('htmlATexto quita script y style, separa bloques y decodifica entidades', () => {
  assert.equal(htmlATexto('<h1>Hola &amp; adiós</h1><script>malo()</script><p>Bs&nbsp;320</p><style>.x{}</style>'), 'Hola & adiós\n Bs 320');
});
