#!/usr/bin/env node
/* Tests for the carousel render engine. Run: node scripts/carousel_render.test.js */
const assert = require('node:assert');
const { roleFor, slideHtml, darkProductHtml, editorialPhotoHtml, emph, ACCOUNTS, PACKS } = require('./carousel_render');

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

// roleFor: position-derived roles (the 5-rule structure)
test('first slide is cover', () => {
  assert.strictEqual(roleFor({}, 0, 5), 'cover');
});
test('second slide is stakes', () => {
  assert.strictEqual(roleFor({}, 1, 5), 'stakes');
});
test('last slide is cta', () => {
  assert.strictEqual(roleFor({}, 4, 5), 'cta');
});
test('save_worthy middle slide becomes save', () => {
  assert.strictEqual(roleFor({ save_worthy: true }, 2, 5), 'save');
});
test('plain middle slide is point', () => {
  assert.strictEqual(roleFor({}, 2, 5), 'point');
});
test('explicit role overrides position', () => {
  assert.strictEqual(roleFor({ role: 'save' }, 0, 5), 'save');
});

// slideHtml: structure + escaping + branding
test('cover renders hook headline and account name', () => {
  const html = slideHtml({ headline: 'Perdés clientes', body: '' }, 0, 5, 'onia', '');
  assert.ok(html.includes('class="slide cover"'));
  assert.ok(html.includes('Perdés clientes'));
  assert.ok(html.includes('@oniaagency'));
});
test('save slide shows FRAMEWORK + Guardá bar', () => {
  const html = slideHtml({ headline: 'Checklist', body: 'x', save_worthy: true }, 2, 5, 'onia', '');
  assert.ok(html.includes('FRAMEWORK'));
  assert.ok(html.includes('Guardá esto'));
});
test('headline HTML is escaped', () => {
  const html = slideHtml({ headline: '<script>', body: '' }, 0, 3, 'onia', '');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});
test('personal account uses bg photo layer', () => {
  const html = slideHtml({ headline: 'H', body: '' }, 0, 3, 'sergio', '/tmp/foto.jpg');
  assert.ok(html.includes('bgphoto'));
  assert.ok(html.includes('foto.jpg'));
});
test('last slide omits continuation cue', () => {
  const html = slideHtml({ headline: 'CTA', body: 'comentá AUTO' }, 2, 3, 'onia', '');
  assert.ok(!html.includes('class="cue"'));
});
test('all 3 accounts are configured', () => {
  assert.deepStrictEqual(Object.keys(ACCOUNTS).sort(), ['arthur', 'onia', 'sergio']);
});

// dark-product pack
test('emph turns *word* into green span, escaping first', () => {
  assert.strictEqual(emph('a *b* <c>'), 'a <span class="g">b</span> &lt;c&gt;');
});
test('packs list has all three packs', () => {
  assert.deepStrictEqual(PACKS, ['typographic', 'dark-product', 'editorial-photo']);
});
test('editorial-photo uses photo bg, serif-italic accent, pill caption', () => {
  const html = editorialPhotoHtml({ role: 'cover', pill: 'Generá con IA', headline: 'Create *Ads*', body: 'x' }, 0, 5, 'sergio', { bg: '/tmp/sergio.jpg' });
  assert.ok(html.includes('class="photo"'));
  assert.ok(html.includes('sergio.jpg'));
  assert.ok(html.includes('Fraunces'));
  assert.ok(html.includes('<span class="g">Ads</span>'));
  assert.ok(html.includes('class="cap"'));
});
test('editorial-photo without bg still renders (ink fallback)', () => {
  const html = editorialPhotoHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(!html.includes('class="photo"'));
  assert.ok(html.includes('class="slide point"'));
});
test('dark-product cover renders pills, curve, footer, green keyword', () => {
  const html = darkProductHtml({ role: 'cover', pill: 'Automatización', headline: 'Invertí en *captar*', body: 'x' }, 0, 5, 'onia', {});
  assert.ok(html.includes('class="pills"'));
  assert.ok(html.includes('class="curve"'));
  assert.ok(html.includes('<span class="g">captar</span>'));
  assert.ok(html.includes('Automatización'));
});
test('dark-product save slide shows FRAMEWORK guardá tag', () => {
  const html = darkProductHtml({ role: 'save', headline: 'Checklist', body: 'x', save_worthy: true }, 3, 5, 'onia', {});
  assert.ok(html.includes('FRAMEWORK'));
  assert.ok(html.includes('Guardá esto'));
});
test('curve: first slide exit-only, middle has both, last entry-only', () => {
  const curvePaths = (html) => {
    const svg = html.slice(html.indexOf('class="curve"'), html.indexOf('</svg>'));
    return (svg.match(/<path /g) || []).length;
  };
  assert.strictEqual(curvePaths(darkProductHtml({ role: 'cover', headline: 'H' }, 0, 3, 'onia', {})), 1);
  assert.strictEqual(curvePaths(darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {})), 2);
  assert.strictEqual(curvePaths(darkProductHtml({ role: 'cta', headline: 'H' }, 2, 3, 'onia', {})), 1);
});
test('dark-product object slot rendered when provided', () => {
  const html = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', { object: '/tmp/panel.png' });
  assert.ok(html.includes('class="object"'));
  assert.ok(html.includes('panel.png'));
});

console.log(`\n${passed} passed`);
