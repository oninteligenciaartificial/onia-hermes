#!/usr/bin/env node
/* Tests for the carousel render engine. Run: node scripts/carousel_render.test.js */
const assert = require('node:assert');
const { roleFor, slideHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, editorialCleanHtml, brightRetailHtml, emph, ACCOUNTS, BRANDS, PACKS, FORMATS, setFormat } = require('./carousel_render');

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
  // @oniahq no es nuestro (esta por reclamar); las piezas llevan el handle real.
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
test('accounts configured (onia/arthur/sergio/nuvia)', () => {
  assert.deepStrictEqual(Object.keys(ACCOUNTS).sort(), ['arthur', 'lucia', 'nuvia', 'onia', 'sergio']);
});

// dark-product pack
test('emph turns *word* into green span, escaping first', () => {
  assert.strictEqual(emph('a *b* <c>'), 'a <span class="g">b</span> &lt;c&gt;');
});
test('packs list includes all packs (incl. editorial-clean)', () => {
  // Rojo desde el 2026-08-20 hasta el 08-23: `editorial-clean` se agrego al motor y
  // nadie actualizo esta lista. Una suite roja por una razon vieja tapa las regresiones
  // nuevas — que es justo lo que un test existe para evitar.
  assert.deepStrictEqual(PACKS, ['typographic', 'dark-product', 'dark-neon', 'editorial-photo', 'editorial-clean', 'bright-retail']);
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
  // La pill de categoria vive arriba (patron del nicho ganador): topbar > captop.
  assert.ok(html.includes('class="topbar"'));
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

// formatos de salida (feed default, cuadrado, story)
test('FORMATS expone feed/cuadrado/story con sus dimensiones', () => {
  assert.deepStrictEqual(FORMATS.feed, { w: 1080, h: 1350 });
  assert.deepStrictEqual(FORMATS.square, { w: 1080, h: 1080 });   // se llamaba 'cuadrado'; el test quedo viejo tras el renombre
  assert.deepStrictEqual(FORMATS.story, { w: 1080, h: 1920 });
});
test('sin --formato el typographic sigue saliendo 1080x1350 (default intacto)', () => {
  const html = slideHtml({ headline: 'H', body: '' }, 0, 3, 'onia', '');
  assert.ok(html.includes('width:1080px; height:1350px'));
  assert.ok(!html.includes('1920px'));
});
test('typographic square y story cambian el lienzo', () => {
  // El test pasaba el formato como 6o argumento de slideHtml, que solo toma 5.
  // El formato se fija con setFormat() — la firma cambio y el test quedo viejo.
  setFormat('square');
  assert.ok(slideHtml({ headline: 'H', body: '' }, 0, 3, 'onia', '').includes('width:1080px; height:1080px'));
  setFormat('story');
  assert.ok(slideHtml({ headline: 'H', body: '' }, 0, 3, 'onia', '').includes('width:1080px; height:1920px'));
  setFormat('feed');   // dejarlo como estaba: setFormat muta estado del modulo
});
test('dark-product story: lienzo y viewBox de la curva escalan juntos', () => {
  setFormat('story');
  const html = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(html.includes('width:1080px; height:1920px'));
  assert.ok(html.includes('viewBox="0 0 1080 1920"'));
  // idx impar entra por la rama de y 600 (feed), escalada a story: 600*1920/1350 = 853
  assert.ok(html.includes('M -60 853'));
  setFormat('feed');
});
test('dark-product sin formato conserva el viewBox feed historico', () => {
  const html = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(html.includes('viewBox="0 0 1080 1350"'));
  assert.ok(html.includes('M -60 600'));
});
test('dark-neon y editorial-photo respetan el formato', () => {
  setFormat('square');
  const dn = darkNeonHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(dn.includes('width:1080px; height:1080px'));
  setFormat('story');
  const ed = editorialPhotoHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(ed.includes('width:1080px; height:1920px'));
});
test('bright-retail cuadrado: ribbon con viewBox del formato y alturas escaladas', () => {
  setFormat('square');
  const html = brightRetailHtml({ role: 'point', headline: 'H' }, 1, 4, 'nuvia', {});
  assert.ok(html.includes('width:1080px; height:1080px'));
  assert.ok(html.includes('viewBox="0 0 1080 1080"'));
  // yA impar (980 en feed) escalado: 980*1080/1350 = 784
  assert.ok(html.includes('M -120 784'));
});

console.log(`\n${passed} passed`);

// --- 2026-08-23: texto que la plantilla inventaba y el brief nunca declaraba ---

test('CTA sin comment_reward NO promete ningun regalo', () => {
  // Estaba hardcodeado: si la palabra no era SISTEMA prometia "la lista con los costos"
  // pasara lo que pasara. El carrusel de HUMO (que entrega un PDF de herramientas) le
  // prometia al lector una lista de costos que nadie iba a mandarle.
  const html = slideHtml({ role: 'cta', headline: 'Escribinos', body: 'Comentá HUMO' }, 4, 5, 'onia', '');
  assert.ok(!html.includes('la lista con los costos'), 'no debe inventar un regalo');
  assert.ok(html.includes('HUMO'), 'pero sigue pidiendo la palabra');
});

test('CTA con comment_reward muestra EL regalo declarado', () => {
  const html = slideHtml({ role: 'cta', headline: 'Escribinos', body: 'Comentá HUMO',
    comment_reward: 'el PDF de las 5 herramientas' }, 4, 5, 'onia', '');
  assert.ok(html.includes('el PDF de las 5 herramientas'));
});

test('sin regalo declarado no aparece la linea de "Gratis. Guardalo"', () => {
  const html = slideHtml({ role: 'cta', headline: 'Que opinas', body: 'Comentá SISTEMA' }, 4, 5, 'onia', '');
  assert.ok(!html.includes('Gratis. Guardalo'), 'sin regalo no hay "gratis"');
});

test('slide.bg vacio APAGA el fondo aunque haya --bg global', () => {
  // El cierre de typographic es verde con texto NEGRO: sobre una foto oscura queda ilegible.
  // OJO: 'bgphoto' aparece SIEMPRE en el CSS. Hay que mirar el MARCADO, no la hoja
  // de estilos — buscar la clase suelta da falso positivo (me paso al escribir esto).
  const DIV = '<div class="bgphoto"';
  const conFoto = slideHtml({ role: 'cover', headline: 'A', body: '' }, 0, 5, 'onia', '/tmp/x.png');
  assert.ok(conFoto.includes(DIV), 'el global si pinta la portada');
  const sinFoto = slideHtml({ role: 'cta', headline: 'A', body: 'Comentá HUMO', bg: '' }, 4, 5, 'onia', '/tmp/x.png');
  assert.ok(!sinFoto.includes(DIV), 'slide.bg vacio lo apaga');
});

test('handle real de Sergio, no el placeholder', () => {
  // Decia '@sergio', que no existe. Verificado por Graph API: @sergio_urcullo.
  assert.strictEqual(ACCOUNTS.sergio.handle, '@sergio_urcullo');
});

// --- 2026-08-24: marcador de serie en editorial-clean ---

test('marcador de serie: dibuja nombre y episodio cuando el brief los trae', () => {
  const html = editorialCleanHtml({ role: 'cover', headline: 'H', body: 'b', pill: 'P' }, 0, 5, 'onia',
    { serie: 'Tu negocio, de noche', episodio: '001' });
  assert.ok(html.includes('Tu negocio, de noche'), 'el nombre de serie va');
  assert.ok(html.includes('// 001'), 'el episodio va con las barras');
  assert.ok(html.includes(' has-serie"'), 'la slide se marca para que el kicker baje y no se pisen');
});

test('marcador de serie: sin datos no dibuja nada', () => {
  const html = editorialCleanHtml({ role: 'cover', headline: 'H', body: 'b', pill: 'P' }, 0, 5, 'onia', {});
  assert.ok(!html.includes('class="serie"'), 'sin serie no hay barra');
  // Ojo: 'has-serie' tambien aparece en la REGLA CSS, que se emite siempre. Hay que mirar
  // el atributo class del marcado. Mismo tropiezo que con 'bgphoto' — ya van dos.
  assert.ok(!html.includes(' has-serie"'), 'ni marca en el class de la slide');
});

test('marcador de serie: NO lo pisa la regla que fuerza position:relative', () => {
  // El bug real: `.slide > *:not(...)` forzaba position:relative en todo hijo no exceptuado,
  // y .serie no estaba en la lista, asi que la barra se renderizaba y no se VEIA.
  // Se encontro mirando el PNG, no leyendo el CSS.
  const html = editorialCleanHtml({ role: 'cover', headline: 'H', body: 'b' }, 0, 5, 'onia', { serie: 'S' });
  assert.ok(html.includes(':not(.serie)'), '.serie tiene que estar exceptuada de la regla');
});

test('chip de dato: {{x}} se vuelve span.dato, y convive con *verde*', () => {
  // Del research del 17-ago (ref Zenovent), senalado como aplicable directo y nunca
  // aplicado: las cifras eran texto corrido en el body de 4 de 5 packs.
  const out = emph('Perdes {{20 horas}} al mes en algo *repetido*');
  assert.ok(out.includes('<span class="dato">20 horas</span>'));
  assert.ok(out.includes('<span class="g">repetido</span>'));
});

test('chip de dato: escapa el HTML antes de convertir', () => {
  assert.ok(emph('{{<b>5</b>}}').includes('&lt;b&gt;5&lt;/b&gt;'), 'no debe inyectar HTML');
});

test('bright-retail: @oniahq usa el kit de Onia, no el de Nuvia', () => {
  // El bug real: BRANDS[account] caia a BRANDS.nuvia por defecto, asi que las piezas de
  // @oniahq salian con el logo, la paleta arcoiris y el tagline "EVERYTHING FOR EVERYONE"
  // de OTRA marca. Se vio mirando el PNG, no leyendo el codigo.
  const html = brightRetailHtml({ role: 'cover', headline: 'H', body: 'b' }, 0, 5, 'onia', {});
  assert.ok(!html.includes('EVERYTHING FOR EVERYONE'), 'no puede firmar con el tagline de Nuvia');
  assert.ok(html.includes('SISTEMAS PARA NEGOCIOS BOLIVIANOS'), 'firma con el tagline de Onia');
  assert.ok(BRANDS.onia && BRANDS.onia.handle === '@oniahq', 'el kit onia existe y trae su handle');
});

test('bright-retail: una cuenta sin kit propio sigue cayendo a Nuvia', () => {
  // El respaldo tiene que seguir vivo: agregar el kit de Onia no debe romper Nuvia.
  const html = brightRetailHtml({ role: 'cover', headline: 'H' }, 0, 5, 'nuvia', {});
  assert.ok(html.includes('EVERYTHING FOR EVERYONE'), 'nuvia conserva lo suyo');
});

test('dark-product: el objeto se puede dar por lamina', () => {
  // Sin esto la MISMA captura se repetia en las 7 laminas y el mockup dejaba de ser
  // prueba para ser relleno.
  const conSlide = darkProductHtml({ headline: 'H', object: 'a/uno.png' }, 1, 5, 'onia', { object: 'b/global.png' });
  assert.ok(conSlide.includes('uno.png'), 'gana el objeto de la lamina');
  assert.ok(!conSlide.includes('global.png'), 'no debe quedar tambien el global');
});

test('dark-product: sin objeto por lamina cae al global de --object', () => {
  const soloGlobal = darkProductHtml({ headline: 'H' }, 1, 5, 'onia', { object: 'b/global.png' });
  assert.ok(soloGlobal.includes('global.png'), 'el respaldo sigue funcionando');
  const ninguno = darkProductHtml({ headline: 'H' }, 1, 5, 'onia', {});
  assert.ok(!ninguno.includes('class="object"'), 'sin objeto no dibuja img');
});

test('dark-neon: hereda el objeto por lamina', () => {
  const html = darkNeonHtml({ headline: 'H', object: 'a/uno.png' }, 1, 5, 'onia', {});
  assert.ok(html.includes('uno.png'), 'el mismo arreglo aplica a dark-neon');
});
