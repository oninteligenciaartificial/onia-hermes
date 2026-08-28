#!/usr/bin/env node
/* Tests for the carousel render engine. Run: node scripts/carousel_render.test.js */
const assert = require('node:assert');
const {
  papelSubrayadoHtml, datoIlustradoHtml, tarjetaEmpleadoHtml, roleFor, slideHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, editorialCleanHtml, brightRetailHtml, emph, ACCOUNTS, BRANDS, PACKS, FORMATS, setFormat } = require('./carousel_render');

let passed = 0;
process.on('exit', () => console.log(`
${passed} passed`));
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
  assert.deepStrictEqual(PACKS, ['typographic', 'dark-product', 'dark-neon', 'editorial-photo',
    'editorial-clean', 'bright-retail', 'papel-subrayado', 'dato-ilustrado', 'tarjeta-empleado']);
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
test('dark-product cover renders pills, footer, green keyword — y YA NO la curva', () => {
  const html = darkProductHtml({ role: 'cover', pill: 'Automatización', headline: 'Invertí en *captar*', body: 'x' }, 0, 5, 'onia', {});
  assert.ok(html.includes('class="pills"'));
  // Sergio la mando sacar el 2026-08-27: cruzaba por detras del texto y a la opacidad
  // que hacia falta para no leerse como tachado, ya no aportaba nada.
  assert.ok(!html.slice(html.indexOf('<body>')).includes('class="curve"'), 'sin curva de fondo');
  assert.ok(html.includes('<span class="g">captar</span>'));
  assert.ok(html.includes('Automatización'));
});
test('dark-product save slide shows FRAMEWORK guardá tag', () => {
  const html = darkProductHtml({ role: 'save', headline: 'Checklist', body: 'x', save_worthy: true }, 3, 5, 'onia', {});
  assert.ok(html.includes('FRAMEWORK'));
  assert.ok(html.includes('Guardá esto'));
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
test('dark-product story: el lienzo escala con --format', () => {
  // Antes este test verificaba tambien el viewBox de la curva de fondo, que se borro
  // el 2026-08-27. Lo que sigue importando es que el lienzo cambie con el formato:
  // ese bug ya estuvo vivo meses sin que nadie lo viera.
  setFormat('story');
  const html = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(html.includes('width:1080px; height:1920px'), 'story = 1080x1920');
  setFormat('feed');
  const feed = darkProductHtml({ role: 'point', headline: 'H' }, 1, 3, 'onia', {});
  assert.ok(feed.includes('width:1080px; height:1350px'), 'feed = 1080x1350');
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

test('anotacion: el pie va FUERA de la figura, nunca encima de la captura', () => {
  // Se intento con la etiqueta flotando sobre la imagen y tapaba justo el dato que
  // señalaba: los recortes utiles son chatos (170 px) y adentro no hay ningun
  // "afuera". Se vio mirando el PNG, dos renders seguidos.
  const html = darkProductHtml({ headline: 'H', object: 'x.png',
    marks: [{ type: 'box', x: 10, y: 20, w: 30, h: 15, label: 'el dato esta aca' }] }, 1, 5, 'onia', {});
  const mk = html.slice(html.indexOf('<body>'));
  assert.ok(mk.includes('el dato esta aca'), 'la etiqueta se dibuja');
  assert.ok(mk.indexOf('mk-pie') > mk.indexOf('</figure>'), 'y va despues de cerrar la figura');
});

test('anotacion: el badge es HTML, no SVG', () => {
  // En SVG con preserveAspectRatio="none" un circulo sale elipse: los badges
  // quedaban deformados y diminutos sobre recortes apaisados.
  const mk = darkProductHtml({ headline: 'H', object: 'x.png',
    marks: [{ type: 'badge', x: 50, y: 50, n: 2 }] }, 1, 5, 'onia', {});
  const body = mk.slice(mk.indexOf('<body>'));
  assert.ok(body.includes('class="mk-badge"'), 'el badge es un span posicionado');
  assert.ok(!/<circle[^>]*class="mk/.test(body), 'y no un circle de SVG');
});

test('anotacion: spot oscurece con fill-opacity, no con rgba()', () => {
  // SVG no acepta rgba() en el atributo fill de forma confiable: el primer
  // spotlight se dibujaba sin oscurecer nada.
  const mk = darkProductHtml({ headline: 'H', object: 'x.png',
    marks: [{ type: 'spot', x: 20, y: 70, w: 60, h: 25 }] }, 1, 5, 'onia', {});
  const body = mk.slice(mk.indexOf('<body>'));
  assert.ok(body.includes('fill-opacity'), 'usa fill-opacity');
  assert.ok(!body.includes('fill="rgba('), 'no usa rgba() en fill');
});

test('anotacion: sin marks no ensucia el marcado', () => {
  const mk = darkProductHtml({ headline: 'H', object: 'x.png' }, 1, 5, 'onia', {});
  const body = mk.slice(mk.indexOf('<body>'));
  assert.ok(!body.includes('mk-pie'), 'sin marks no hay pie');
  assert.ok(!body.includes('class="marks"'), 'ni capa svg');
});


test('papel-subrayado: la grilla sale con 4 items y el trazo rota de color', () => {
  const html = papelSubrayadoHtml({
    letra: 'O', headline: 'Ordenar', items: [
      { rotulo: 'El catalogo', nota: 'con precio' }, { rotulo: 'La caja' },
      { rotulo: 'Los fiados' }, { rotulo: 'Quien compro' }],
  }, 1, 7, 'onia');
  const mk = html.slice(html.indexOf('<body>'));
  assert.ok(mk.includes('class="grilla"'), 'dibuja la grilla');
  assert.strictEqual((mk.match(/class="celda"/g) || []).length, 4, 'exactamente 4 celdas');
  assert.ok(mk.includes('con precio'), 'la nota del item se dibuja');
  // Dos trazos seguidos con el mismo color delatan la plantilla: tienen que rotar.
  const colores = [...mk.matchAll(/stroke="(#[0-9A-F]{6})"/gi)].map((m) => m[1]);
  assert.ok(new Set(colores).size > 1, 'los subrayados rotan de color');
});

test('papel-subrayado: mas de 4 items se recortan, la grilla es 2x2 siempre', () => {
  const mk = papelSubrayadoHtml({ letra: 'N', headline: 'H',
    items: ['a', 'b', 'c', 'd', 'e', 'f'] }, 2, 7, 'onia');
  const body = mk.slice(mk.indexOf('<body>'));
  assert.strictEqual((body.match(/class="celda"/g) || []).length, 4, 'recorta a 4');
  assert.ok(!body.includes('>e<'), 'el quinto no entra');
});

test('papel-subrayado: sin items no dibuja grilla vacia', () => {
  const mk = papelSubrayadoHtml({ headline: 'Cierre' }, 6, 7, 'onia');
  const body = mk.slice(mk.indexOf('<body>'));
  assert.ok(!body.includes('class="grilla"'), 'sin items, sin grilla');
});


test('chip de dato: se estiliza en TODOS los packs, no solo en dos', () => {
  // Estaba definido solo en typographic y editorial-clean, asi que un {{Bs 285}}
  // escrito en un brief de dark-product salia como texto pelado: el brief lo pedia
  // y el pack lo ignoraba en silencio (visto en O04 y O06, 2026-08-27).
  const conDato = { headline: 'H', body: 'sube a {{34 %}} hoy' };
  for (const [nombre, fn] of [['dark-product', darkProductHtml], ['dark-neon', darkNeonHtml]]) {
    const html = fn(conDato, 1, 5, 'onia', {});
    assert.ok(html.slice(html.indexOf('<body>')).includes('class="dato"'), nombre + ': marca el dato');
    assert.ok(html.includes('.dato { background'), nombre + ': y lo estiliza');
  }
});

test('dato-ilustrado: una cifra SIN fuente no se dibuja', () => {
  // No es validacion de forma: es la regla del catalogo. Con cero clientes pagando,
  // una cifra sin fuente en material de cliente es fabricar. El motor lo impide.
  const sin = datoIlustradoHtml({ headline: 'H', dato: '99 %' }, 1, 7, 'onia', {});
  assert.ok(!sin.slice(sin.indexOf('<body>')).includes('class="cifra"'), 'sin fuente no hay cifra');
  const con = datoIlustradoHtml({ headline: 'H', dato: '65 %', fuente: 'Management Science (2008)' }, 1, 7, 'onia', {});
  const b = con.slice(con.indexOf('<body>'));
  assert.ok(b.includes('class="cifra"'), 'con fuente si');
  assert.ok(b.includes('Management Science'), 'y la fuente se dibuja');
});

test('dato-ilustrado: la imagen es FONDO, nunca objeto flotante', () => {
  // "colocas imagenes sin sentido sobre imagenes" — Sergio, 2026-08-27. En este pack
  // hay UNA sola imagen por lamina y ocupa el lienzo entero.
  const h = datoIlustradoHtml({ headline: 'H', bg: 'x.png' }, 1, 7, 'onia', {});
  const b = h.slice(h.indexOf('<body>'));
  assert.ok(b.includes('class="foto"'), 'la imagen va de fondo');
  assert.ok(b.includes('class="scrim"'), 'con su scrim');
  assert.ok(!b.includes('class="object"'), 'y no hay objeto flotante');
});

test('dato-ilustrado: el CTA rompe el patron y va sin imagen', () => {
  const h = datoIlustradoHtml({ role: 'cta', headline: 'H', bg: 'x.png' }, 6, 7, 'onia', {});
  const b = h.slice(h.indexOf('<body>'));
  assert.ok(!b.includes('class="foto"'), 'el cierre no lleva foto aunque el brief la declare');
});

test('dato-ilustrado: titular serif y cuerpo sans, con salto de escala real', () => {
  // La regla: un salto de jerarquia cambia MUCHO un eje, no un poco cinco ejes.
  const h = datoIlustradoHtml({ role: 'cover', headline: 'H', body: 'b' }, 0, 7, 'onia', {});
  const tit = Number(/\.tit\{[^}]*font-size:(\d+)px/.exec(h)[1]);
  const cuerpo = Number(/\.cuerpo\{font-size:(\d+)px/.exec(h)[1]);
  assert.ok(h.includes(".tit{font-family:'Fraunces',serif"), 'titular serif');
  assert.ok(tit / cuerpo >= 2, `la portada debe doblar al cuerpo (era ${tit}/${cuerpo})`);
});

test('dato-ilustrado: la lamina de solucion dibuja los items', () => {
  // Sergio, 2026-08-27: "no dice exactamente que problema vas a solucionar... con Onia
  // Platform solucionas esto, esto, esto". Las piezas planteaban el problema y nunca
  // nombraban el producto: en la cuenta de la empresa eso es medio trabajo sin hacer.
  const h = datoIlustradoHtml({ headline: 'Con *Onia Platform*',
    solucion: ['Se descuenta solo', 'Te avisa antes', 'Queda registrada'] }, 4, 7, 'onia', {});
  const b = h.slice(h.indexOf('<body>'));
  assert.ok(b.includes('class="solucion"'), 'dibuja la lista');
  assert.strictEqual((b.match(/<li>/g) || []).length, 3, 'un item por entrada');
  assert.ok(b.includes('Te avisa antes'), 'con su texto');
});

test('dato-ilustrado: sin solucion no deja lista vacia', () => {
  const h = datoIlustradoHtml({ headline: 'H', body: 'b' }, 1, 7, 'onia', {});
  assert.ok(!h.slice(h.indexOf('<body>')).includes('class="solucion"'));
});

test('dark-product: tambien dibuja la lamina de solucion', () => {
  // El arco aprobado exige "Con Onia Platform" en toda pieza de @oniahq. dark-product
  // es el molde de producto (capturas anotadas) y tambien la necesita: forzar O04 al
  // molde ilustrado le habria sacado justamente su prueba.
  const h = darkProductHtml({ headline: 'Con *Onia Platform*',
    solucion: ['Revisan solos', 'Dejan la propuesta', 'Nada sale sin vos'] }, 4, 8, 'onia', {});
  const b = h.slice(h.indexOf('<body>'));
  assert.strictEqual((b.match(/<li>/g) || []).length, 3);
  assert.ok(b.includes('Nada sale sin vos'));
  assert.ok(h.includes('.solucion li::before'), 'con su marca de verificacion');
});

test('tarjeta-empleado: la ficha lleva numero, nombre, cargo y a quien reemplaza', () => {
  const h = tarjetaEmpleadoHtml({ headline: 'H', n: 1, nombre: 'n8n',
    cargo: 'Jefe de operaciones', hace: 'Corre los flujos', reemplaza: 'Zapier' }, 1, 9, 'sergio');
  const b = h.slice(h.indexOf('<body>'));
  for (const t of ['class="ficha"', 'n8n', 'Jefe de operaciones', 'Corre los flujos', 'Zapier']) {
    assert.ok(b.includes(t), 'falta ' + t);
  }
});

test('tarjeta-empleado: respeta la grafia del nombre, no lo pasa a mayusculas', () => {
  // n8n y ffmpeg van en minuscula SIEMPRE. El uppercase forzado escribia "N8N", y en
  // una pieza que enseña herramientas eso resta la credibilidad que la pieza busca.
  const h = tarjetaEmpleadoHtml({ headline: 'H', nombre: 'n8n', hace: 'x' }, 1, 9, 'sergio');
  assert.ok(!/\.nombre\{[^}]*text-transform:uppercase/.test(h), 'sin uppercase en el nombre');
});

test('tarjeta-empleado: no comparte NADA del sistema visual de Onia', () => {
  // El defecto principal de las piezas de Sergio era verse identicas a las de @oniahq.
  const h = tarjetaEmpleadoHtml({ headline: 'H', nombre: 'x', hace: 'y' }, 1, 9, 'sergio');
  assert.ok(h.includes('#101828'), 'azul noche, no el negro verdoso de Onia');
  assert.ok(h.includes('#00D26A'), 'verde: Sergio lo pidio el 2026-08-28');
  assert.ok(!h.includes("'Fraunces'"), 'sin la serif de Onia');
});

test('tarjeta-empleado: sin nombre no dibuja ficha vacia', () => {
  const h = tarjetaEmpleadoHtml({ headline: 'Cierre', body: 'b' }, 8, 9, 'sergio');
  assert.ok(!h.slice(h.indexOf('<body>')).includes('class="ficha"'));
});

test('tarjeta-empleado: `creia` dibuja el tachado con su propia etiqueta', () => {
  // El molde de empleados sirve igual para el expediente de un error: mismo tachado
  // ambar, pero la etiqueta cambia de "reemplaza a" a "yo creia". Es lo que permite
  // que S07 use el mismo objeto visual sin forzar la semantica de "reemplaza".
  const h = tarjetaEmpleadoHtml(
    { headline: 'H', nombre: 'El DM', cargo: 'commit abc', hace: 'x', creia: 'que funcionaba' },
    1, 8, 'sergio');
  assert.ok(h.includes('yo creía'), 'la ficha de error dice "yo creia"');
  assert.ok(h.includes('que funcionaba'), 'y muestra lo que se daba por cierto');
  assert.ok(!h.includes('reemplaza a'), 'sin `reemplaza` no dibuja esa etiqueta');
});

test('tarjeta-empleado: el body respeta los parrafos', () => {
  // Un doble salto se dibujaba como un bloque unico, y la linea de fuente terminaba
  // pegada al argumento — dejaba de leerse como fuente.
  const h = tarjetaEmpleadoHtml(
    { headline: 'H', body: 'El argumento.\n\nBanco Central de Bolivia.' }, 1, 8, 'sergio');
  const parrafos = h.split('class="sub"').length - 1;
  assert.strictEqual(parrafos, 2, 'dos parrafos, dos <p>');
  assert.ok(h.includes('.sub + .sub'), 'y con separacion entre ellos');
});

test('Lucia va en el verde de Onia, no en terracota', () => {
  // Sergio, 2026-08-28: "usa color verde siempre". Deroga el §1-quater de LUCIA.md.
  // El mecanismo `acentoDe()` se conserva: sirve para cualquier cuenta que si necesite
  // color propio, y hoy ninguna lo declara.
  const h = editorialPhotoHtml({ headline: 'H', bg: 'x.jpg' }, 0, 7, 'lucia');
  assert.ok(!h.includes('#E4714E'), 'sin terracota');
});
