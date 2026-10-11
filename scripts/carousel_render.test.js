#!/usr/bin/env node
/* Tests for the carousel render engine. Run: node scripts/carousel_render.test.js */
const assert = require('node:assert');
const { roleFor, slideHtml, communityEditorialHtml, referentesHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, editorialCleanHtml, brightRetailHtml, bloqueSolidoHtml, emph, ACCOUNTS, BRANDS, PACKS, FORMATS, setFormat } = require('./carousel_render');

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
test('packs list includes all packs (incl. bloque-solido)', () => {
  // Rojo desde el 2026-08-20 hasta el 08-23: `editorial-clean` se agrego al motor y
  // nadie actualizo esta lista. Una suite roja por una razon vieja tapa las regresiones
  // nuevas — que es justo lo que un test existe para evitar.
  //
  // Volvio a pasar el 2026-09-02, con CUATRO packs de una: el merge del carril de Lucia
  // los agrego al motor y no toco esta linea. Ver el test de abajo: esta comparacion sola
  // no alcanzaba — es un changelog, no un guard.
  assert.deepStrictEqual(PACKS, ['community-editorial', 'referentes', 'dark-product', 'dark-neon', 'editorial-photo', 'editorial-clean', 'bright-retail', 'bloque-solido']);
});
test('todo pack listado RENDERIZA (no solo figura en la lista)', () => {
  // El guard que faltaba. La comparacion de arriba mira el PRIMER paso —que el nombre
  // este— y no ve el sistema morir en el SEGUNDO: el 2026-09-02 entraron a PACKS
  // `papel-subrayado`, `dato-ilustrado` y `tarjeta-empleado` sin sus modulos
  // (`carousel_pack_papel/dato/empleado.js` viven solo en `claude/ads-creatividades-publicos`).
  // La lista quedaba coherente consigo misma y el CLI aceptaba `--pack dato-ilustrado`
  // para reventar recien al renderar: "Pack no disponible". Los packs se cargan PEREZOSO,
  // asi que solo llamarlos lo destapa — importar el motor no basta.
  const RENDER = {
    'community-editorial': communityEditorialHtml,
    referentes: referentesHtml,
    'dark-product': darkProductHtml,
    'dark-neon': darkNeonHtml,
    'editorial-photo': editorialPhotoHtml,
    'editorial-clean': editorialCleanHtml,
    'bright-retail': brightRetailHtml,
    'bloque-solido': bloqueSolidoHtml,
  };
  for (const pack of PACKS) {
    const fn = RENDER[pack];
    assert.ok(fn, `${pack} esta en PACKS pero este test no sabe renderizarlo: agregalo a RENDER`);
    const html = fn({ role: 'cover', headline: 'H', body: 'b', pill: 'P' }, 0, 5, 'onia', {});
    assert.ok(html && html.includes('</html>'), `${pack} no devolvio HTML completo`);
  }
});
test('referentes: cada layout renderiza y uno desconocido falla claro', () => {
  for (const layout of ['logos', 'analogia', 'ensayo', 'ilustrado', 'lista', 'inventario', 'dato', 'captura', 'cierre']) {
    const html = referentesHtml({ layout, headline: 'H *x*', body: 'b', items: [{ label: 'L', text: 't' }] }, 1, 3, 'sergio', {});
    assert.ok(html.includes('</html>') && html.includes(`l-${layout}`), layout);
  }
  assert.throws(() => referentesHtml({ layout: 'nope' }, 0, 1, 'sergio', {}), /layout desconocido/);
  for (const theme of ['blanco', 'verde', 'negro']) assert.ok(referentesHtml({ layout: 'ensayo', body: 'b' }, 0, 1, 'sergio', { theme }).includes(`t-${theme}`), theme);
  assert.throws(() => referentesHtml({ layout: 'ensayo', theme: 'rosa' }, 0, 1, 'sergio', {}), /theme desconocido/);
});
test('referentes cierre: «Buscá» por defecto; `pre` y `kicker` cambian el verbo y suman una frase (10-oct)', () => {
  // Antes el verbo por defecto era «Comentá» (DM automático sin probar). Ahora es «Buscá»; «Comentá» sólo si el brief lo pide.
  const base = referentesHtml({ layout: 'cierre', keyword: 'DISEÑO', body: 'en Avisos · link en mi perfil' }, 0, 1, 'sergio', {});
  assert.ok(base.includes('<p class="pre">Buscá</p>') && !base.includes('class="kick"') && !base.includes('Comentá'));
  const viejo = referentesHtml({ layout: 'cierre', pre: 'Comentá', keyword: 'HOOK', body: 'y te paso el link' }, 0, 1, 'sergio', {});
  assert.ok(viejo.includes('<p class="pre">Comentá</p>') && !viejo.includes('Buscá'));
  const nuevo = referentesHtml({ layout: 'cierre', pre: 'Buscá', kicker: 'La IA también necesita *límites*.', keyword: 'ARCHIVOS', body: 'en Avisos · link en mi perfil' }, 0, 1, 'sergio', {});
  assert.ok(nuevo.includes('<p class="pre">Buscá</p>') && nuevo.includes('class="kick"') && !nuevo.includes('Comentá'));
});
test('referentes ensayo: grande y fit ancho son opt-in; sin ellos el marcado no cambia (P2, 11-oct)', () => {
  const base = referentesHtml({ layout: 'ensayo', headline: 'Hola', body: 'Texto.' }, 1, 3, 'sergio', {});
  assert.ok(base.includes('class="c-ensayo"') && !base.includes('c-ensayo grande'), 'sin grande, la clase no cambia');
  assert.ok(!base.includes('getComputedStyle(h)'), 'sin fit no hay script de ajuste');
  const grande = referentesHtml({ layout: 'ensayo', grande: true, headline: 'Hola', body: 'Texto.' }, 1, 3, 'sergio', {});
  assert.ok(grande.includes('class="c-ensayo grande"'));
  const ancho = referentesHtml({ layout: 'ensayo', fit: 'ancho', headline: '*HERRAMIENTAS*' }, 9, 10, 'sergio', {});
  assert.ok(ancho.includes('clientWidth-2*84') && ancho.includes('f+=4'), 'el título crece hasta el margen de 84 px');
  assert.ok(!referentesHtml({ layout: 'ensayo', fit: 'ancho' }, 9, 10, 'sergio', {}).includes('getComputedStyle(h)'), 'sin título no hay nada que medir');
});
test('referentes captura: logo opcional delante del título, sin él igual que antes (P2, 11-oct)', () => {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, '..', 'hermes-content/references/brand-claude');
  const logo = 'hermes-content/references/brand-claude/' + fs.readdirSync(dir).find((f) => /\.(png|svg)$/.test(f));
  const con = referentesHtml({ layout: 'captura', headline: 'Claude Code', logo }, 1, 3, 'sergio', {});
  assert.ok(/<h2 class="t"><img class="title-logo"/.test(con), 'el logo va dentro del título, antes del texto');
  const sin = referentesHtml({ layout: 'captura', headline: 'Claude Code' }, 1, 3, 'sergio', {});
  assert.ok(sin.includes('<h2 class="t">Claude Code</h2>') && !/<img class="title-logo"/.test(sin));
});
test('referentes inventario: 5, 3 y 2 filas en la MISMA grilla; sin tarjetas ni título; números continuos (10-oct)', () => {
  const fila = (n) => ({ label: `Nombre ${n}`, text: `Línea ${n}.` });
  const topes = (html) => [...html.matchAll(/class="inv-row" style="top:([\d.]+)%"/g)].map((m) => Number(m[1]));
  const cinco = referentesHtml({ layout: 'inventario', items: [1, 2, 3, 4, 5].map(fila) }, 1, 5, 'sergio', {});
  assert.ok(cinco.includes('l-inventario') && !cinco.includes('<h2'), 'sin título si falta headline');
  // la grilla: centros a 13 % + 4 % y paso de 16,5 %
  assert.deepStrictEqual(topes(cinco), [17, 33.5, 50, 66.5, 83]);
  assert.deepStrictEqual([...cinco.matchAll(/class="inv-mark">(\d+)</g)].map((m) => m[1]), ['1', '2', '3', '4', '5']);
  // la numeración sigue en la lámina siguiente (start) y `n` de la fila gana
  const tres = referentesHtml({ layout: 'inventario', start: 6, center: true, items: [fila(6), fila(7), fila(8)] }, 2, 5, 'sergio', {});
  assert.deepStrictEqual([...tres.matchAll(/class="inv-mark">(\d+)</g)].map((m) => m[1]), ['6', '7', '8']);
  // sin center la primera fila de 3 queda en la misma y que la de 5; centrada, el bloque de 3 filas (41 %) queda en el medio
  assert.deepStrictEqual(topes(referentesHtml({ layout: 'inventario', start: 6, items: [fila(6), fila(7), fila(8)] }, 2, 5, 'sergio', {})), [17, 33.5, 50]);
  assert.deepStrictEqual(topes(tres), [33.5, 50, 66.5]);
  assert.ok(tres.includes('centrada'));
  // remate: 2 filas, la última aislada con aire y con la flecha; `ask` en texto suma la palabra junto a la flecha
  const dos = referentesHtml({ layout: 'inventario', ask: true, items: [fila(1), fila(2)] }, 3, 5, 'sergio', {});
  assert.deepStrictEqual(topes(dos), [17, 33.5 + 7]);
  assert.ok(dos.includes('class="inv-ask"') && !dos.includes('<span>undefined'));
  assert.ok(referentesHtml({ layout: 'inventario', ask: 'así', items: [fila(1), fila(2)] }, 3, 5, 'sergio', {}).includes('<span>así</span>'));
  assert.ok(!cinco.includes('class="inv-ask"'), 'sin ask no hay flecha');
  // sin cajas: ni borde ni tarjeta en las filas del inventario
  assert.ok(!/\.inv-row\{[^}]*(border|background)/.test(cinco));
  // el logo oficial reemplaza al número
  const logo = referentesHtml({ layout: 'inventario', items: [{ icon: 'hermes-content/references/brand-claude/' + require('fs').readdirSync(require('path').join(__dirname, '..', 'hermes-content/references/brand-claude')).find((f) => /\.(png|svg)$/.test(f)), label: 'Claude', text: 'x' }] }, 1, 3, 'sergio', {});
  assert.ok(logo.includes('class="inv-icon"') && !/class="inv-mark">\d/.test(logo));
  // la grilla es fija: más de 5 filas no entran
  assert.throws(() => referentesHtml({ layout: 'inventario', items: [1, 2, 3, 4, 5, 6].map(fila) }, 1, 3, 'sergio', {}), /hasta 5 filas/);
  // el título es opcional y, si está, se dibuja
  assert.ok(referentesHtml({ layout: 'inventario', headline: 'Hola', items: [fila(1)] }, 1, 3, 'sergio', {}).includes('class="inv-t"'));
});
test('referentes logos: UNA palabra conserva su marcado de siempre, sin script ni línea nueva (10-oct)', () => {
  // Los 10 briefs viejos con `logos` llevan una palabra («Claude», «Worktree»…) y su aspecto no puede cambiar:
  // se comparó pixel a pixel antes/después (74 láminas, 0 diferencias). Acá se fija el marcado, no el CSS: la hoja
  // de estilos también contiene `word multi`, `wl` y `solo-nombres`, así que buscar la clase suelta daría falsos positivos.
  const logo = 'hermes-content/references/brand-logos/git-color.svg';
  const una = referentesHtml({ layout: 'logos', headline: 'Worktree', logos: [{ file: logo, label: 'git' }], body: 'b' }, 2, 8, 'sergio', {});
  assert.ok(una.includes('<h1 class="word">Worktree</h1>'), 'el h1 histórico, sin span ni clase multi');
  assert.ok(!una.includes('<span class="wl">') && !una.includes('class="word multi"'));
  assert.ok(!una.includes('<script>'), 'sin ajuste por medición: el camino de una palabra no se toca');
  assert.ok(una.includes('<div class="logo-row">') && una.includes('class="logo-img"') && una.includes('<figcaption>git</figcaption>'));
});
test('referentes logos: VARIAS palabras van una por línea, sin asteriscos, y el navegador las mide con 84 px de margen (10-oct)', () => {
  // P2 «7 herramientas. / 4 son gratis.»: antes «HERRAMIENTAS.» sola medía ~1.600 px contra ~912 útiles y se cortaba.
  const dos = referentesHtml({ layout: 'logos', headline: '7 herramientas.\n4 son gratis.', logos: [{ label: 'n8n' }] }, 0, 10, 'sergio', { theme: 'verde' });
  assert.ok(dos.includes('<h1 class="word multi"><span class="wl">7 herramientas.</span><span class="wl">4 son gratis.</span></h1>'), 'dos líneas');
  assert.ok(dos.includes('<script>') && dos.includes('document.fonts.ready') && dos.includes('2*84'), 'mide con la fuente cargada y 84 px por lado');
  assert.ok(dos.includes("querySelector('.c-logos .word')") && dos.includes('f-=3'), 'achica de a 3 px, como cierreHtml');
  // el título no pasa por emph(): un asterisco no se vuelve énfasis (el spec pide el título sin asteriscos)
  const ast = referentesHtml({ layout: 'logos', headline: 'A *b* c', logos: [] }, 0, 1, 'sergio', {});
  assert.ok(ast.includes('<span class="wl">A *b* c</span>') && !ast.includes('<span class="g">b</span>'));
  // varias palabras sin `\n` quedan en UNA línea medida; el HTML se escapa
  const una = referentesHtml({ layout: 'logos', headline: 'Dos <palabras>', logos: [] }, 0, 1, 'sergio', {});
  assert.strictEqual(una.split('<span class="wl">').length - 1, 1);
  assert.ok(una.includes('Dos &lt;palabras&gt;'));
});
test('referentes logos: sin `file` en ninguna marca van solo con su nombre; con un `file`, la fila de siempre (10-oct)', () => {
  const marcas = ['Claude Code · pago', 'Codex · pago', 'Higgsfield · pago', 'HyperFrames', 'Buffer', 'n8n', 'faster-whisper'].map((label) => ({ label }));
  const solo = referentesHtml({ layout: 'logos', headline: '7 herramientas.\n4 son gratis.', logos: marcas }, 0, 10, 'sergio', {});
  assert.ok(solo.includes('<div class="logo-row solo-nombres">'));
  assert.ok(!solo.includes('<img class="logo-img"'), 'sin tejas de logo');
  assert.strictEqual(solo.split('<figure class="logo">').length - 1, 7);
  for (const m of marcas) assert.ok(solo.includes(`<figcaption>${m.label}</figcaption>`), m.label);
  const mixta = referentesHtml({ layout: 'logos', headline: 'Tres palabras acá', logos: [{ label: 'a' }, { file: 'hermes-content/references/brand-logos/git-color.svg', label: 'b' }] }, 0, 1, 'sergio', {});
  assert.ok(mixta.includes('<div class="logo-row">') && !mixta.includes('solo-nombres"'), 'un solo file basta para no ser «solo nombres»');
  assert.ok(referentesHtml({ layout: 'logos', headline: 'X', logos: [] }, 0, 1, 'sergio', {}).includes('<div class="logo-row"></div>'), 'sin marcas no hay modo solo-nombres');
});
test('community-editorial usa la cuenta elegida y CTA directo para pauta', () => {
  const html = communityEditorialHtml({
    role: 'cta',
    headline: 'Probá ONIA',
    cta: 'CREÁ TU CUENTA',
  }, 0, 1, 'onia', { serie: 'DENTAL' });
  assert.ok(html.includes('ONIA / DENTAL'));
  assert.ok(!html.includes('SERGIO URCULLO'));
  assert.ok(html.includes('cta-line cta-direct'));
  assert.ok(!html.includes('Comentá'));
  assert.ok(!html.includes('01 / 01'));
});
test('community-editorial puede incrustar una captura real', () => {
  const html = communityEditorialHtml({
    role: 'point',
    headline: 'Producto real',
    visual: { type: 'screenshot', file: __filename, label: 'TENANT DEMO', fit: 'cover' },
  }, 1, 3, 'onia', { serie: 'DENTAL' });
  assert.ok(html.includes('visual-screenshot'));
  assert.ok(html.includes('data:image/png;base64,'));
  assert.ok(html.includes('class="fit-cover"'));
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
test('dark-product cover renders pills, footer, green keyword', () => {
  const html = darkProductHtml({ role: 'cover', pill: 'Automatización', headline: 'Invertí en *captar*', body: 'x' }, 0, 5, 'onia', {});
  assert.ok(html.includes('class="pills"'));
  // Aca exigia `class="curve"`. La curva de continuacion la mando sacar Sergio el
  // 2026-08-27 ("cambia ese fondo con las lineas por detras"): cruzaba por detras del
  // texto y se leia como tachado. El motor la borro y esta assertion quedo pidiendo un
  // adorno que el dueno del producto rechazo — un test que defiende lo que ya se decidio
  // tirar frena el merge sin proteger nada.
  assert.ok(html.includes('<span class="g">captar</span>'));
  assert.ok(html.includes('Automatización'));
});
test('dark-product save slide shows FRAMEWORK guardá tag', () => {
  const html = darkProductHtml({ role: 'save', headline: 'Checklist', body: 'x', save_worthy: true }, 3, 5, 'onia', {});
  assert.ok(html.includes('FRAMEWORK'));
  assert.ok(html.includes('Guardá esto'));
});
// Aca vivia `curve: first slide exit-only, middle has both, last entry-only`, que contaba
// los <path> de la curva de continuacion segun la posicion de la lamina. Se borro junto con
// la curva: Sergio la mando sacar el 2026-08-27 ("cambia ese fondo con las lineas por
// detras") porque cruzaba por detras del texto y se leia como un tachado. `continuationCurve()`
// ya no existe en el motor, asi que el test media un elemento ausente y devolvia 0 paths.
// Si la curva revive, vuelve del historial junto con esta prueba.
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
// Estos dos tests exigian el viewBox y los <path> de la curva de continuacion, borrada por
// pedido de Sergio el 2026-08-27 (ver arriba). Lo que median de VERDAD —que el lienzo de
// dark-product escale con el formato— sigue vivo y se conserva aca; lo que se cayo con la
// curva era el `viewBox="0 0 1080 1920"` y el `M -60 853` de su SVG, que ya no se dibuja.
test('dark-product story: el lienzo escala con el formato', () => {
  setFormat('story');
  const html = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(html.includes('width:1080px; height:1920px'));
  setFormat('feed');
});
test('dark-product sin formato conserva el lienzo feed historico', () => {
  const html = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(html.includes('width:1080px; height:1350px'));
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
  // Confirmado por Sergio Urcullo el 2026-09-06: SIN guion bajo.
  // Este campo ya estuvo mal dos veces y el test lo siguio la segunda: decia
  // '@sergio' (inventado), se corrigio a '@sergio_urcullo' con Graph API del
  // 2026-08-23 —cierto ENTONCES—, y despues el renombro la cuenta. El motor se
  // arreglo (75 usos en 13 generadores contra 1) y este caso quedo afirmando el
  // valor viejo: un gate escrito sobre un DATO ancla su valor a la fuente con
  // respaldo y su fecha, no al valor que el codigo ya tenia, o lo cementa.
  assert.strictEqual(ACCOUNTS.sergio.handle, '@sergiourcullo');
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
