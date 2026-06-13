#!/usr/bin/env node
/**
 * Tests del generador de propuestas. Sin dependencias.
 * Uso: node generar-propuestas.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { buildHtml, validateCliente } = require('./generar-propuestas');

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

test('clientes.json es válido y todos cumplen requeridos', () => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'clientes.json'), 'utf8'));
  assert.ok(Array.isArray(data) && data.length > 0);
  data.forEach((c, i) => validateCliente(c, i));
});

test('escapa HTML en campos de texto plano (XSS)', () => {
  const c = { ...base, nombre: '<script>x</script>' };
  assert.ok(!buildHtml(c).includes('<script>x</script>'));
});

console.log(`\n${pass} tests OK`);
