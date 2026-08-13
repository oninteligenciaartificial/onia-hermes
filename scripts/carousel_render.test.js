#!/usr/bin/env node
/* Tests for the carousel render engine. Run: node scripts/carousel_render.test.js */
const assert = require('node:assert');
const { roleFor, slideHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, brightRetailHtml, emph, ACCOUNTS, BRANDS, PACKS, FORMATS } = require('./carousel_render');

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
  assert.ok(html.includes('@oniahq'));
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
test('accounts configured (onia/arthur/sergio/nuvia/lucia)', () => {
  assert.deepStrictEqual(Object.keys(ACCOUNTS).sort(), ['arthur', 'lucia', 'nuvia', 'onia', 'sergio']);
});

// dark-product pack
test('emph turns *word* into green span, escaping first', () => {
  assert.strictEqual(emph('a *b* <c>'), 'a <span class="g">b</span> &lt;c&gt;');
});
test('packs list includes all packs (incl. dark-neon + bright-retail)', () => {
  assert.deepStrictEqual(PACKS, ['typographic', 'dark-product', 'dark-neon', 'editorial-photo', 'bright-retail']);
});
test('nuvia account + brand kit configured', () => {
  assert.strictEqual(ACCOUNTS.nuvia.handle, '@nuvia.bo');
  assert.ok(BRANDS.nuvia.accents.length >= 3);
});
test('bright-retail cover uses brand accent + handle + green-keyword', () => {
  const html = brightRetailHtml({ role: 'cover', pill: 'Ya llegó', headline: 'Todo para *todos*', body: '' }, 0, 5, 'nuvia', {});
  assert.ok(html.includes('@nuvia.bo'));
  assert.ok(html.includes('#00A7A0'));
  assert.ok(html.includes('<span class="g">todos</span>'));
});
test('bright-retail rotates accent color by slide index', () => {
  const s0 = brightRetailHtml({ role: 'cover', headline: 'A' }, 0, 4, 'nuvia', {});
  const s1 = brightRetailHtml({ role: 'point', headline: 'B' }, 1, 4, 'nuvia', {});
  assert.ok(s0.includes('--accent:#00A7A0'));
  assert.ok(s1.includes('--accent:#FF6B6B'));
});
test('editorial-photo uses photo bg, serif-italic accent, pill caption', () => {
  const html = editorialPhotoHtml({ role: 'cover', pill: 'Generá con IA', headline: 'Create *Ads*', body: 'x' }, 0, 5, 'sergio', { bg: '/tmp/sergio.jpg' });
  assert.ok(html.includes('class="photo"'));
  assert.ok(html.includes('sergio.jpg'));
  assert.ok(html.includes('Fraunces'));
  assert.ok(html.includes('<span class="g">Ads</span>'));
  assert.ok(html.includes('class="captop"'));
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

// formatos: portrait (default) + square + story en los 5 packs
test('FORMATS expone portrait/square/story con los tamaños de IG', () => {
  assert.deepStrictEqual(FORMATS.portrait, { w: 1080, h: 1350 });
  assert.deepStrictEqual(FORMATS.square, { w: 1080, h: 1080 });
  assert.deepStrictEqual(FORMATS.story, { w: 1080, h: 1920 });
});
test('sin --format todos los packs siguen en 1080x1350', () => {
  const builders = [
    (a) => slideHtml({ headline: 'H' }, 1, 3, 'onia', '', a),
    (a) => darkProductHtml({ headline: 'H' }, 1, 3, 'onia', a),
    (a) => darkNeonHtml({ headline: 'H' }, 1, 3, 'onia', a),
    (a) => editorialPhotoHtml({ headline: 'H' }, 1, 3, 'onia', a),
    (a) => brightRetailHtml({ headline: 'H' }, 1, 3, 'nuvia', a),
  ];
  for (const b of builders) {
    const html = b({});
    assert.ok(html.includes('width:1080px; height:1350px'), 'slide 1080x1350');
    assert.ok(html.includes('--canvas-h:1350px'));
  }
});
test('--format square|story cambia el lienzo en los 5 packs', () => {
  const cases = [
    ['square', 1080], ['story', 1920],
  ];
  for (const [format, h] of cases) {
    const builders = [
      slideHtml({ headline: 'H' }, 1, 3, 'onia', '', { format }),
      darkProductHtml({ headline: 'H' }, 1, 3, 'onia', { format }),
      darkNeonHtml({ headline: 'H' }, 1, 3, 'onia', { format }),
      editorialPhotoHtml({ headline: 'H' }, 1, 3, 'onia', { format }),
      brightRetailHtml({ headline: 'H' }, 1, 3, 'nuvia', { format }),
    ];
    for (const html of builders) {
      assert.ok(html.includes(`width:1080px; height:${h}px`), `${format}: slide 1080x${h}`);
      assert.ok(html.includes(`--canvas-h:${h}px`), `${format}: token canvas`);
      assert.ok(!html.includes('height:1350px') || h === 1350, `${format}: sin restos de 1350`);
    }
  }
});
test('la curva/ribbon escalan su viewBox y su geometría al alto real', () => {
  const dp = darkProductHtml({ headline: 'H' }, 1, 3, 'onia', { format: 'story' });
  assert.ok(dp.includes('viewBox="0 0 1080 1920"'));
  assert.ok(dp.includes('M -60 600'), 'story no estira la curva: banda absoluta');
  const sq = darkProductHtml({ headline: 'H' }, 1, 3, 'onia', { format: 'square' });
  assert.ok(sq.includes('M -60 480'), 'square comprime: 600*1080/1350 => 480');
  const br = brightRetailHtml({ headline: 'H' }, 1, 3, 'nuvia', { format: 'square' });
  assert.ok(br.includes('viewBox="0 0 1080 1080"'));
});

console.log(`\n${passed} passed`);
