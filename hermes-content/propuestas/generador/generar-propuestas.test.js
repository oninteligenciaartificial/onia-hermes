#!/usr/bin/env node
/**
 * Tests del generador de propuestas. Sin dependencias.
 * Uso: node generar-propuestas.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { buildHtml, validateCliente, parseArgs } = require('./generar-propuestas');

let pass = 0;
const test = (name, fn) => {
  try { fn(); pass++; console.log(`  ok  ${name}`); }
  catch (e) { console.error(`  FAIL ${name}: ${e.message}`); process.exitCode = 1; }
};

const base = {
  slug: 't', nombre: 'T', titulo: 'Tit', subtitulo: 'Sub', problema: 'Prob',
  incluye: [{ tag: 'A', titulo: 'X', items: ['i'] }],
  pasos: [{ titulo: 'P', detalle: 'd' }],
  paquetes: [{ nombre: 'Uno', incluye: 'algo', precio: '100', recomendado: true }],
  notaPaquetes: 'nota', addons: [{ nombre: 'a', setup: '1', mensual: '2' }],
  terceros: 'terc',
};

test('validateCliente acepta cliente completo', () => {
  validateCliente(base, 0);
});

test('validateCliente rechaza campo faltante', () => {
  const bad = { ...base }; delete bad.titulo;
  assert.throws(() => validateCliente(bad, 0), /titulo/);
});

test('buildHtml genera HTML con título y precio', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('<!doctype html>'));
  assert.ok(html.includes('Tit'));
  assert.ok(html.includes('100'));
});

test('buildHtml marca el paquete recomendado con estrella', () => {
  assert.ok(buildHtml(base).includes('⭐'));
});

test('buildHtml renderiza sección valor solo si existe', () => {
  assert.ok(!buildHtml(base).includes('Por qué te conviene'));
  const conValor = { ...base, valor: [{ titulo: 'V', detalle: 'd' }] };
  assert.ok(buildHtml(conValor).includes('Por qué te conviene'));
});

test('buildHtml renderiza resultado del paquete', () => {
  const c = { ...base, paquetes: [{ ...base.paquetes[0], resultado: 'GANA' }] };
  assert.ok(buildHtml(c).includes('GANA'));
});

test('buildHtml renderiza plazoEntrega si existe', () => {
  assert.ok(!buildHtml(base).includes('Plazo de entrega'));
  assert.ok(buildHtml({ ...base, plazoEntrega: '2 semanas' }).includes('Plazo de entrega'));
});

test('buildHtml usa moneda para los headers de precio', () => {
  const html = buildHtml(base);
  assert.ok(html.includes('Precio (Bs)'));
  assert.ok(html.includes('Setup (Bs)'));
  const usd = buildHtml({ ...base, moneda: 'USD' });
  assert.ok(usd.includes('Precio (USD)'));
  assert.ok(usd.includes('Setup (USD)'));
  assert.ok(usd.includes('Mensual (USD)'));
});

test('buildHtml renderiza resumen ejecutivo solo si existe', () => {
  assert.ok(!buildHtml(base).includes('Resumen ejecutivo'));
  const c = { ...base, resumenEjecutivo: 'RESUMEN-X' };
  const html = buildHtml(c);
  assert.ok(html.includes('Resumen ejecutivo'));
  assert.ok(html.includes('RESUMEN-X'));
});

test('buildHtml renderiza imágenes solo si existen', () => {
  assert.ok(!buildHtml(base).includes('<figure'));
  const c = { ...base, imagenes: [{ src: 'assets/x.png', alt: 'ALT-X', caption: 'CAP-X' }] };
  const html = buildHtml(c);
  assert.ok(html.includes('assets/x.png'));
  assert.ok(html.includes('ALT-X'));
  assert.ok(html.includes('CAP-X'));
});

test('buildHtml renderiza casos solo si existen', () => {
  assert.ok(!buildHtml(base).includes('Resultados'));
  const c = { ...base, casos: [{ titulo: 'CASO-T', detalle: 'CASO-D' }] };
  const html = buildHtml(c);
  assert.ok(html.includes('CASO-T'));
  assert.ok(html.includes('CASO-D'));
});

test('buildHtml renderiza comparativa solo si existe', () => {
  assert.ok(!buildHtml(base).includes('class="comp"'));
  const c = { ...base, comparativa: {
    titulo: 'COMP-T', columnas: ['Ellos', 'ONIA'],
    filas: [['Costo', 'ALTO-X', 'BAJO-X']],
  } };
  const html = buildHtml(c);
  assert.ok(html.includes('COMP-T'));
  assert.ok(html.includes('Ellos'));
  assert.ok(html.includes('ALTO-X'));
  assert.ok(html.includes('BAJO-X'));
});

test('buildHtml renderiza próximos pasos y CTA solo si existen', () => {
  assert.ok(!buildHtml(base).includes('Próximos pasos'));
  const c = { ...base,
    proximosPasos: ['PASO-UNO', 'PASO-DOS'],
    ctaWhatsapp: { url: 'https://wa.me/59175470140?text=hola', texto: 'CTA-X' },
  };
  const html = buildHtml(c);
  assert.ok(html.includes('Próximos pasos'));
  assert.ok(html.includes('PASO-UNO'));
  assert.ok(html.includes('https://wa.me/59175470140?text=hola'));
  assert.ok(html.includes('CTA-X'));
});

test('buildHtml renderiza portada solo si existe', () => {
  assert.ok(!buildHtml(base).includes('class="cover"'));
  const c = { ...base, portada: { titulo: 'PORTADA-T', subtitulo: 'PORTADA-S', fecha: 'Julio 2026' } };
  const html = buildHtml(c);
  assert.ok(html.includes('class="cover"'));
  assert.ok(html.includes('PORTADA-T'));
  assert.ok(html.includes('Julio 2026'));
});

test('buildHtml inserta pixel de tracking solo con opts.trackUrl', () => {
  assert.ok(!buildHtml(base).includes('width="1" height="1"'));
  const html = buildHtml(base, { trackUrl: 'https://n8n.example/webhook/propuesta-abierta?t=tok1&s=t' });
  assert.ok(html.includes('https://n8n.example/webhook/propuesta-abierta?t=tok1&amp;s=t'));
  assert.ok(html.includes('width="1" height="1"'));
});

test('buildHtml renderiza límite del paquete solo si existe', () => {
  assert.ok(!buildHtml(base).includes('class="lim"'));
  const c = { ...base, paquetes: [{ ...base.paquetes[0], limite: 'LIMITE-X' }] };
  const html = buildHtml(c);
  assert.ok(html.includes('class="lim"'));
  assert.ok(html.includes('LIMITE-X'));
});

test('buildHtml: "El costo de esperar" solo con datos reales del cliente', () => {
  // sin el campo → no se imprime (regla: no fabricar)
  assert.ok(!buildHtml(base).includes('El costo de esperar'));
  // con el campo vacío o con items incompletos → tampoco
  assert.ok(!buildHtml({ ...base, costoDeEsperar: { items: [] } }).includes('El costo de esperar'));
  assert.ok(!buildHtml({ ...base, costoDeEsperar: { intro: 'solo intro' } }).includes('El costo de esperar'));
  assert.ok(!buildHtml({ ...base, costoDeEsperar: { items: [{ concepto: 'sin costo' }] } })
    .includes('El costo de esperar'));
  // con datos del cliente → se imprime con sus números
  const c = { ...base, costoDeEsperar: {
    items: [{ concepto: 'Tipeo manual', dato: 'DATO-X', costo: 'COSTO-X' }],
    total: 'TOTAL-X',
  } };
  const html = buildHtml(c);
  assert.ok(html.includes('El costo de esperar'));
  assert.ok(html.includes('DATO-X') && html.includes('COSTO-X') && html.includes('TOTAL-X'));
});

test('buildHtml: la línea SIAT exige el grupo confirmado del cliente', () => {
  const sinGrupo = { ...base, costoDeEsperar: {
    items: [{ concepto: 'c', costo: 'x' }], siat: {},
  } };
  const h1 = buildHtml(sinGrupo);
  assert.ok(h1.includes('El costo de esperar'));
  assert.ok(!h1.includes('1 de octubre de 2026'), 'no debe citar la fecha sin grupo confirmado');
  const conGrupo = { ...base, costoDeEsperar: { siat: { grupo: '10°' } } };
  const h2 = buildHtml(conGrupo);
  assert.ok(h2.includes('1 de octubre de 2026'));
  assert.ok(h2.includes('RND 102600000007'));
  assert.ok(h2.includes('Portal Web del SIN cumple gratis'), 'debe decir la verdad completa');
});

test('parseArgs: slug sin --track no se pierde', () => {
  const p = parseArgs(['dentalgest', '--pdf']);
  assert.deepStrictEqual(p.only, ['dentalgest']);
  assert.strictEqual(p.wantPdf, true);
  assert.strictEqual(p.trackToken, null);
});

test('parseArgs: --track consume su token y respeta slugs', () => {
  const p = parseArgs(['dentalgest', '--track', 'tok-1']);
  assert.deepStrictEqual(p.only, ['dentalgest']);
  assert.strictEqual(p.trackToken, 'tok-1');
  const p2 = parseArgs(['--track', 'tok-2', 'garabato', '--pdf']);
  assert.deepStrictEqual(p2.only, ['garabato']);
  assert.strictEqual(p2.trackToken, 'tok-2');
});

test('clientes.json es válido y todos cumplen requeridos', () => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'clientes.json'), 'utf8'));
  assert.ok(Array.isArray(data) && data.length > 0);
  data.forEach((c, i) => validateCliente(c, i));
});

test('escapa HTML en campos de texto plano (XSS)', () => {
  const c = { ...base, nombre: '<script>x</script>' };
  assert.ok(!buildHtml(c).includes('<script>x</script>'));
});

test('el HTML commiteado es exactamente lo que produce el generador', () => {
  // Un HTML corrido de clientes.json es una propuesta que le miente al cliente: el
  // 2026-08-15 se saco "Videos con IA" del generador por estar PAUSADO como producto,
  // y seis HTML lo siguieron cotizando a 2.200/mes. La fuente es clientes.json, nunca el HTML.
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'clientes.json'), 'utf8'));
  const norm = (t) => t.split('\r').join('');
  const corridos = data
    .filter((c) => {
      const f = path.join(__dirname, '..', `propuesta-${c.slug}.html`);
      return fs.existsSync(f) && norm(fs.readFileSync(f, 'utf8')) !== norm(buildHtml(c));
    })
    .map((c) => c.slug);
  assert.deepStrictEqual(corridos, [], `HTML corrido de clientes.json: ${corridos.join(', ')}. Regenerar con: node generar-propuestas.js <slug>`);
});

console.log(`\n${pass} tests OK`);
