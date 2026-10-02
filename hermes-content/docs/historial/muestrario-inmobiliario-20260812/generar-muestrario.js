#!/usr/bin/env node
/**
 * Muestrario del Modulo Inmobiliario de Onia Platform.
 *
 * Catalogo de PRODUCTO, sin precios. No es una propuesta comercial: el
 * generador de propuestas (hermes-content/propuestas/generador) es otra cosa
 * y no se toca desde aca. De ahi solo se reusa la tecnica de impresion.
 *
 * Fuentes del contenido (toda afirmacion sale de estos archivos):
 *   - docs/platform/ONIA_MODULO_INMOBILIARIO_SPEC_20260808.md
 *   - docs/research/ONIA_MODULO_INMOBILIARIO_ALCANCE_20260806.md
 *   - docs/platform/ONIA_MAPA_MODULOS_Y_FUNCIONES_20260810.md
 * Direccion visual: web-factory/data/references/reels/models/
 *   find-realestate-editorial.json + lecercle-realestate.json (roles de color
 *   mapeados a tokens Onia de hermes-content/brand/tokens.css).
 *
 * Uso:  node generar-muestrario.js          # HTML + PDF
 *       node generar-muestrario.js --no-pdf # solo HTML
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIR = __dirname;
const FONTS = path.join(DIR, '..', '..', 'brand', 'fonts');
const PRINT_FONTS = path.join(DIR, 'fonts');
const OUT_HTML = path.join(DIR, 'muestrario-inmobiliario-onia.html');
const OUT_PDF = path.join(DIR, 'muestrario-inmobiliario-onia.pdf');

// Chrome NO embebe fuentes variables al imprimir a PDF: el documento sale con
// Times/Segoe UI (verificado 2026-08-12 — un .ttf estatico si se embebe). Asi
// que las woff2 variables de marca se instancian a TTF estaticos, con TODOS
// los ejes fijados (dejar `opsz` vivo devuelve otra vez un variable).
// Los TTF quedan cacheados en ./fonts y se versionan; esto corre una sola vez.
const PRINT_CUTS = [
  ['BricolageGrotesque-var-latin.woff2', 'onia-display-500.ttf', { opsz: 30, wght: 500 }],
  ['BricolageGrotesque-var-latin.woff2', 'onia-display-600.ttf', { opsz: 30, wght: 600 }],
  ['BricolageGrotesque-var-latin.woff2', 'onia-display-700.ttf', { opsz: 30, wght: 700 }],
  ['DMSans-var-latin.woff2', 'onia-body-400.ttf', { opsz: 14, wght: 400 }],
  ['DMSans-var-latin.woff2', 'onia-body-500.ttf', { opsz: 14, wght: 500 }],
  ['SplineSansMono-var-latin.woff2', 'onia-mono-400.ttf', { wght: 400 }],
  ['SplineSansMono-var-latin.woff2', 'onia-mono-500.ttf', { wght: 500 }],
];

function ensurePrintFonts() {
  fs.mkdirSync(PRINT_FONTS, { recursive: true });
  const missing = PRINT_CUTS.filter(([, out]) => !fs.existsSync(path.join(PRINT_FONTS, out)));
  if (!missing.length) return;

  const jobs = missing.map(([src, out, axes]) =>
    [path.join(FONTS, src).replace(/\\/g, '/'), path.join(PRINT_FONTS, out).replace(/\\/g, '/'),
      JSON.stringify(axes)]);
  const py = `
import json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
for src, out, axes in json.loads(sys.argv[1]):
    f = TTFont(src)
    # updateFontNames=False: la tabla STAT no declara valores para el opsz que
    # fijamos y el renombrado explota. El nombre interno no importa: el CSS las
    # referencia por el font-family del @font-face.
    st = instancer.instantiateVariableFont(f, json.loads(axes), inplace=False)
    st.flavor = None
    st.save(out)
    print("[fonts]", out)
`;
  console.log(`[Onia] Instanciando ${missing.length} corte(s) estatico(s) para impresion...`);
  execFileSync('python', ['-c', py, JSON.stringify(jobs)], { stdio: 'inherit' });
}

const BROWSERS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

const font = (file) =>
  `data:font/ttf;base64,${fs.readFileSync(path.join(PRINT_FONTS, file)).toString('base64')}`;

// --- Paginas -----------------------------------------------------------------

const TOTAL = 10;

function page(n, { tone = 'light', kicker, body }) {
  const num = String(n).padStart(2, '0');
  return `
<section class="page ${tone}" id="p${n}">
  <header class="rule">
    <span class="kicker">${kicker}</span>
    <span class="num">${num} <i>/</i> ${TOTAL}</span>
  </header>
  <main class="body">${body}</main>
  <footer class="foot">
    <span class="mark">${LOGOMARK}<b>Onia</b> Platform</span>
    <span>Muestrario de producto &middot; Modulo Inmobiliario</span>
  </footer>
</section>`;
}

const LOGOMARK = `<svg viewBox="0 0 240 240" class="logo" aria-hidden="true">
  <circle cx="120" cy="120" r="86" stroke="currentColor" stroke-width="26" fill="none"/>
  <path d="M120 34 A86 86 0 0 1 196 86" stroke="#10C26B" stroke-width="26" fill="none" stroke-linecap="round"/>
  <circle cx="196" cy="86" r="22" fill="#10C26B"/><circle cx="196" cy="86" r="9" fill="currentColor"/>
</svg>`;

// 01 -------------------------------------------------------------------------
const P1 = `
<section class="page dark cover" id="p1">
  <header class="rule">
    <span class="kicker">${LOGOMARK} Onia Platform &middot; Santa Cruz de la Sierra</span>
    <span class="num">Agosto 2026</span>
  </header>
  <main class="body cover-body">
    <p class="eyebrow">Muestrario de producto</p>
    <h1 class="display-xl">M&oacute;dulo<br>Inmobiliario</h1>
    <p class="lead">El agente que atiende cada consulta, la califica y la persigue
      &mdash; y que nunca escribe una sola palabra sin que un humano la apruebe.</p>
    <div class="cover-meta">
      <div><i>Qu&eacute; es esto</i><b>Cat&aacute;logo del m&oacute;dulo dentro de Onia Platform.
        No es una cotizaci&oacute;n ni un desarrollo a medida.</b></div>
      <div><i>C&oacute;mo leerlo</i><b>Cada l&aacute;mina separa lo que ya existe de lo que
        todav&iacute;a no. Lo que se ve como pantalla o mensaje es maqueta.</b></div>
    </div>
  </main>
  <footer class="foot">
    <span class="mark">Fase 1 implementada, sin verificar en producci&oacute;n &middot; Fase 2 no construida</span>
    <span>business@onia.com.bo</span>
  </footer>
</section>`;

// 02 -------------------------------------------------------------------------
const P2 = page(2, {
  tone: 'light',
  kicker: 'Antes de mostrar nada',
  body: `
  <h2 class="display-l">En qu&eacute; punto est&aacute;<br>el m&oacute;dulo, hoy.</h2>
  <p class="intro">Un muestrario que exagera se descubre en la primera reuni&oacute;n de trabajo.
    As&iacute; que esto va primero, no al final.</p>

  <div class="phases">
    <article class="phase now">
      <span class="tag tag-now">Implementada</span>
      <h3>Fase 1 &mdash; El agente captador</h3>
      <p>Lee las consultas que entran, las califica y deja el mensaje escrito en una cola
        para que el asesor lo apruebe. El c&oacute;digo est&aacute; escrito e integrado al producto,
        con la suite de pruebas en verde. <b>Falta el paso de verificarlo con una oficina
        real us&aacute;ndolo</b> &mdash; eso todav&iacute;a no pas&oacute;.</p>
    </article>
    <article class="phase spec">
      <span class="tag tag-spec">No construida</span>
      <h3>Fase 2 &mdash; La ficha de propiedad</h3>
      <p>Cartera con anticr&eacute;tico de primera clase y precio con moneda, tipo de cambio y
        fecha. Est&aacute; dise&ntilde;ada al detalle. <b>No existe todav&iacute;a.</b></p>
    </article>
    <article class="phase wait">
      <span class="tag tag-wait">En espera</span>
      <h3>Fase 3 &mdash; Cruce, mini-web, portales</h3>
      <p>Se construye cuando el uso real lo justifique, no antes. La condici&oacute;n est&aacute;
        escrita y es medible.</p>
    </article>
  </div>

  <div class="split">
    <div class="note ok">
      <i>Lo que s&iacute; corre en producci&oacute;n</i>
      <p>Onia Platform, con seis rubros disponibles: dental, comercio, importadora,
        est&eacute;tica, veterinaria y servicios profesionales. El m&oacute;dulo inmobiliario se
        monta sobre esa plataforma, no sobre una promesa.</p>
    </div>
    <div class="note warn">
      <i>Lo que todav&iacute;a no est&aacute; probado</i>
      <p>El agente pas&oacute; las pruebas autom&aacute;ticas del producto, pero <b>no fue verificado
        con una oficina real</b>. Y el env&iacute;o autom&aacute;tico por WhatsApp espera una
        habilitaci&oacute;n de Meta que todav&iacute;a no est&aacute; dada &mdash; eso afecta a los seis
        rubros por igual, no solo a este.</p>
    </div>
  </div>`,
});

// 03 -------------------------------------------------------------------------
const P3 = page(3, {
  tone: 'light',
  kicker: 'D&oacute;nde entra',
  body: `
  <p class="statement">Onia vende <b>una</b> plataforma con m&oacute;dulos por rubro.
    Lo inmobiliario es uno de esos m&oacute;dulos &mdash; no un sistema hecho a medida
    para una oficina.</p>

  <div class="stack">
    <article class="row">
      <span class="idx">01</span>
      <div>
        <h3>La oficina se da de alta como Servicios Profesionales</h3>
        <p>Es un rubro que la plataforma ya tiene. No se abre una versi&oacute;n paralela ni
          una rama aparte para un cliente: eso es lo que despu&eacute;s nadie mantiene.</p>
      </div>
    </article>
    <article class="row">
      <span class="idx">02</span>
      <div>
        <h3>Lo inmobiliario se enciende como complemento</h3>
        <p>Un solo interruptor abre las tres capas a la vez: el men&uacute; que ve el asesor,
          la puerta de datos y el agente. Encendido o apagado, nunca a medias. Un negocio
          de otro rubro no ve este agente ni sabe que existe.</p>
      </div>
    </article>
    <article class="row">
      <span class="idx">03</span>
      <div>
        <h3>Lo que mejora, mejora para todos</h3>
        <p>Cada correcci&oacute;n al m&oacute;dulo llega a toda oficina que lo tenga encendido.
          Un desarrollo a medida envejece solo; un m&oacute;dulo de producto no.</p>
      </div>
    </article>
    <article class="row">
      <span class="idx">04</span>
      <div>
        <h3>Lo que la oficina carga sigue siendo de la oficina</h3>
        <p>Es la posici&oacute;n con la que Onia contrata: los interesados, los contactos y las
          conversaciones cargadas en el sistema son de la oficina. Onia los trata por
          encargo suyo y bajo confidencialidad rec&iacute;proca.</p>
      </div>
    </article>
  </div>

  <div class="diagram">
    <div class="d-core"><b>Onia Platform</b><span>agenda &middot; contactos &middot; tareas &middot; cola de aprobaci&oacute;n &middot; agentes</span></div>
    <div class="d-arrow"></div>
    <div class="d-mods">
      <span>Dental</span><span>Comercio</span><span>Importadora</span>
      <span>Est&eacute;tica</span><span>Veterinaria</span><span>Servicios prof.</span>
      <span class="on">+ Inmobiliario</span>
    </div>
  </div>`,
});

// 04 -------------------------------------------------------------------------
const P4 = page(4, {
  tone: 'dark',
  kicker: 'El agente captador',
  body: `
  <h2 class="display-l">Cuatro momentos<br>en los que act&uacute;a.</h2>
  <p class="intro">Revisa la bandeja cada media hora. No espera a que alguien se acuerde.</p>

  <div class="stack tight">
    <article class="row">
      <span class="idx">T1</span>
      <div>
        <h3>Entra una consulta y nadie la contest&oacute;</h3>
        <p>Escribe la respuesta y, dentro de la misma respuesta, la calificaci&oacute;n:
          pregunta lo que falta para saber si sirve.</p>
      </div>
    </article>
    <article class="row">
      <span class="idx">T2</span>
      <div>
        <h3>Pasaron 24 horas y sigue sin responder</h3>
        <p>Abre una tarea para el asesor con el nombre y el motivo. Si dej&oacute; tel&eacute;fono,
          adem&aacute;s deja el mensaje escrito listo para aprobar.</p>
      </div>
    </article>
    <article class="row">
      <span class="idx">T3</span>
      <div>
        <h3>El interesado no volvi&oacute;</h3>
        <p>Segundo toque a los tres d&iacute;as. Tercero y &uacute;ltimo, un cierre educado que le
          devuelve la salida. Despu&eacute;s de eso no escribe m&aacute;s.</p>
      </div>
    </article>
    <article class="row">
      <span class="idx">T4</span>
      <div>
        <h3>Hay visita agendada y no la confirmaron</h3>
        <p><b>Tarea interna para el asesor, nunca un mensaje.</b> El recordatorio autom&aacute;tico
          de la cita ya sali&oacute;; un segundo mensaje del agente le llegar&iacute;a duplicado
          al interesado. El hueco real no es recordar: es que alguien llame.</p>
      </div>
    </article>
  </div>

  <div class="sources">
    <i>De d&oacute;nde salen las consultas que lee</i>
    <div class="chips">
      <span>Formulario de la web</span><span>Tel&eacute;fono o mostrador, cargado a mano</span>
      <span>Correo compartido</span><span>WhatsApp, por la bandeja de conversaciones</span>
    </div>
    <p>Si la misma persona vuelve a escribir por el mismo canal dentro del d&iacute;a, no se abre
      un caso nuevo: se suma al que ya existe. Y cada consulta se reparte entre los asesores
      por carga, no por orden de llegada. <b>No hay conector de Instagram ni de los portales,
      y no se promete</b> &mdash; el m&oacute;dulo trabaja con lo que entra por los canales de la
      oficina.</p>
  </div>`,
});

// 05 -------------------------------------------------------------------------
const P5 = page(5, {
  tone: 'light',
  kicker: 'C&oacute;mo lee una consulta',
  body: `
  <h2 class="display-m">De un mensaje suelto<br>a un lead calificado.</h2>

  <div class="read">
    <div class="raw">
      <i>Llega esto</i>
      <p class="quote">&ldquo;hola, busco depto en anticr&eacute;tico en el Urub&oacute;,
        3 dorm, urgente&rdquo;</p>
    </div>
    <div class="fields">
      <i>Sale esto</i>
      <ul>
        <li><span>operaci&oacute;n</span><b>anticr&eacute;tico</b></li>
        <li><span>tipo</span><b>departamento</b></li>
        <li><span>zona</span><b>Urub&oacute;</b></li>
        <li><span>ambientes</span><b>3</b></li>
        <li><span>urgencia</span><b>alta</b></li>
        <li class="miss"><span>presupuesto</span><b>&mdash; falta</b></li>
        <li class="miss"><span>financiamiento</span><b>&mdash; falta</b></li>
      </ul>
    </div>
  </div>

  <p class="statement sm">Lo que el interesado no dijo <b>no se completa por su cuenta</b>:
    se convierte en la pregunta del mensaje. M&aacute;ximo tres preguntas por mensaje.</p>

  <div class="buckets">
    <div><b>Caliente</b><span>Sabe qu&eacute; busca, dej&oacute; tel&eacute;fono y tiene apuro o
      presupuesto. El agente propone la visita y avisa al asesor en el acto.</span></div>
    <div><b>Tibio</b><span>Sabe qu&eacute; busca y dej&oacute; tel&eacute;fono. El agente pregunta
      lo que falta antes de hacerle perder tiempo a nadie.</span></div>
    <div><b>Fr&iacute;o</b><span>Sin tel&eacute;fono no hay mensaje: queda una tarea para el
      asesor. Sin tel&eacute;fono <b>nunca</b> es caliente.</span></div>
  </div>

  <div class="note accent wide auto">
    <i>El anticr&eacute;tico no es una casilla m&aacute;s</i>
    <p>Es una operaci&oacute;n de primera clase desde la primera l&iacute;nea de c&oacute;digo, al mismo
      nivel que venta y alquiler: el agente la reconoce con tilde, sin tilde y hasta
      cuando el interesado la abrevia. Es la figura boliviana que los sistemas importados no
      modelan &mdash; y sin ella, media cartera cruce&ntilde;a no entra al sistema.</p>
  </div>`,
});

// 06 -------------------------------------------------------------------------
const P6 = page(6, {
  tone: 'dark',
  kicker: 'Los mensajes que propone',
  body: `
  <div class="head-row">
    <h2 class="display-m">As&iacute; escribe.</h2>
    <span class="tag tag-mock">Maqueta &middot; nombres de ejemplo</span>
  </div>
  <p class="intro">Cruce&ntilde;o, de vos, corto. Ninguno de estos mensajes sale sin que
    el asesor lo lea y lo apruebe.</p>

  <div class="chats">
    <article class="chat">
      <span class="chip">Consulta nueva &middot; falta informaci&oacute;n</span>
      <p>Hola Andrea, soy del equipo de la oficina. Vi tu consulta que lleg&oacute; por el
        formulario. Para pasarte solo lo que te sirve, contame tres cositas: &iquest;es para
        alquiler, anticr&eacute;tico o compra?, &iquest;en qu&eacute; zona la necesit&aacute;s? y &iquest;en qu&eacute; rango
        te est&aacute;s manejando? Con eso te mando opciones hoy mismo.</p>
      <span class="state">Borrador &middot; espera aprobaci&oacute;n</span>
    </article>
    <article class="chat">
      <span class="chip">Lead caliente &middot; propone la visita</span>
      <p>Hola Andrea, tengo opciones que entran en lo que busc&aacute;s (anticr&eacute;tico, Urub&oacute;,
        3 dormitorios). &iquest;Te viene bien verlas el jueves 16:00 o prefer&iacute;s el s&aacute;bado por
        la ma&ntilde;ana? Me confirm&aacute;s y te paso la ubicaci&oacute;n exacta.</p>
      <span class="state">Borrador &middot; espera aprobaci&oacute;n</span>
    </article>
    <article class="chat">
      <span class="chip">Tercer toque &middot; cierre educado</span>
      <p>Hola Andrea, te escribo por &uacute;ltima vez para no llenarte de mensajes. Si m&aacute;s
        adelante retom&aacute;s la b&uacute;squeda, quedo a mano. &iexcl;Que te vaya bien!</p>
      <span class="state">Borrador &middot; espera aprobaci&oacute;n</span>
    </article>
  </div>

  <div class="hardline">
    <i>Reglas duras del texto</i>
    <p>Sin precios. Sin metros cuadrados. Sin disponibilidad. Sin condiciones de contrato
      ni de anticr&eacute;tico. Sin comisi&oacute;n. Sin &ldquo;te garantizo&rdquo;.
      <b>El mensaje solo repite lo que el interesado escribi&oacute;</b> &mdash; cualquier dato
      del inmueble que el agente agregara hoy ser&iacute;a inventado, y un dato inventado a un
      interesado lo paga el asesor en la visita.</p>
  </div>`,
});

// 07 -------------------------------------------------------------------------
const P7 = page(7, {
  tone: 'light',
  kicker: 'El circuito y sus l&iacute;mites',
  body: `
  <h2 class="display-m">Propone. No manda.</h2>

  <div class="flow">
    <div><span>01</span><b>Detecta</b><p>Encuentra la consulta sin responder o el interesado que se enfri&oacute;.</p></div>
    <div><span>02</span><b>Escribe</b><p>Redacta el mensaje completo y lo deja en una cola.</p></div>
    <div class="human"><span>03</span><b>Un humano aprueba</b><p>El asesor lee el texto exacto que va a salir y decide.</p></div>
    <div><span>04</span><b>Sale</b><p>Reci&eacute;n ah&iacute; se env&iacute;a, una sola vez.</p></div>
  </div>
  <p class="fine">Mientras la habilitaci&oacute;n de Meta no est&eacute; dada, el paso 04 no puede
    disparar solo: el mensaje aprobado queda visible en la cola para copiarlo y mandarlo
    desde el WhatsApp de la oficina. El resto del circuito funciona igual.</p>

  <h3 class="sub">Lo que el agente <b>nunca</b> hace por su cuenta</h3>
  <div class="never">
    <div><b>Nunca manda un mensaje sin aprobaci&oacute;n.</b> No es una opci&oacute;n de
      configuraci&oacute;n que alguien pueda apagar: todo lo que contacta a una persona pasa
      por la cola.</div>
    <div><b>Nunca da precio, superficie, disponibilidad, condici&oacute;n legal ni comisi&oacute;n.</b>
      No tiene de d&oacute;nde sacarlos, y por eso no los dice.</div>
    <div><b>Nunca escribe a quien no dej&oacute; tel&eacute;fono.</b> Ah&iacute; abre una tarea para el
      asesor y se detiene.</div>
    <div><b>M&aacute;ximo tres toques por interesado</b>, con tres d&iacute;as de espera entre uno y
      otro, y un tope diario de mensajes para toda la oficina.</div>
    <div><b>Nunca reabre un caso cerrado</b> ni ve datos de otra oficina.</div>
    <div><b>Nunca duplica el recordatorio de la visita</b> que ya sale autom&aacute;tico.</div>
    <div><b>Nunca inventa un dato del inmueble.</b> Si no est&aacute; en lo que el interesado
      escribi&oacute;, no aparece en el mensaje.</div>
    <div><b>Nunca cambia una configuraci&oacute;n ni borra datos.</b> Solo puede redactar un
      mensaje o abrir una tarea; el resto le est&aacute; prohibido por dise&ntilde;o.</div>
  </div>

  <div class="note accent wide">
    <i>Qu&eacute; ve el asesor antes de aprobar</i>
    <p>El texto exacto que va a salir, a qui&eacute;n va dirigido y, si el canal no puede
      enviarlo, el motivo. Aprobar dos veces no manda dos veces: el env&iacute;o es &uacute;nico
      por dise&ntilde;o, no por cuidado del que aprueba.</p>
  </div>`,
});

// 08 -------------------------------------------------------------------------
const P8 = page(8, {
  tone: 'light',
  kicker: 'Fase 2',
  body: `
  <div class="head-row">
    <h2 class="display-m">La ficha de propiedad.</h2>
    <span class="tag tag-spec">Dise&ntilde;ada &middot; todav&iacute;a no existe</span>
  </div>
  <p class="intro">Est&aacute; especificada campo por campo para que el d&iacute;a que se construya
    sea ejecuci&oacute;n y no discusi&oacute;n. Se muestra para que se vea el criterio, no para
    vender algo que hoy no se puede abrir.</p>

  <div class="spec-grid">
    <div>
      <i>Operaci&oacute;n</i>
      <p>Venta, alquiler y <b>anticr&eacute;tico</b>, los tres al mismo nivel. El anticr&eacute;tico
        lleva su capital y su plazo, con el tope legal de cinco a&ntilde;os del C&oacute;digo Civil
        (art. 1435) validado por el sistema.</p>
    </div>
    <div>
      <i>Precio</i>
      <p>Nunca un n&uacute;mero suelto: siempre moneda, tipo de cambio y fecha del tipo de
        cambio. Despu&eacute;s de la flotaci&oacute;n del boliviano, un precio &ldquo;en d&oacute;lares&rdquo; sin
        esos tres datos es un dato podrido. Las expensas van en su propio campo.</p>
    </div>
    <div>
      <i>Ubicaci&oacute;n</i>
      <p>Con la nomenclatura que Santa Cruz usa de verdad: zona o condominio, anillo,
        unidad vecinal y direcci&oacute;n. No un campo &ldquo;ciudad&rdquo; gen&eacute;rico importado.</p>
    </div>
    <div>
      <i>El inmueble</i>
      <p>Metros construidos y de terreno, dormitorios, ba&ntilde;os, parqueos y c&oacute;digo
        interno del asesor. El propietario se guarda como contacto de la oficina, no
        como una lista aparte que despu&eacute;s nadie actualiza.</p>
    </div>
    <div>
      <i>Estado</i>
      <p>Disponible, reservada, cerrada o retirada. Un estado expl&iacute;cito es lo que evita
        la cartera fantasma: la propiedad que se sigue ofreciendo semanas despu&eacute;s de
        haberse cerrado.</p>
    </div>
    <div>
      <i>La pantalla</i>
      <p>Una lista con filtros por operaci&oacute;n, zona y estado, y el alta de la propiedad.
        Nada m&aacute;s: sin volumen real, un buscador de veinte filtros es una pantalla que
        nadie termina de llenar.</p>
    </div>
  </div>

  <div class="note accent wide">
    <i>Lo que a prop&oacute;sito NO es un campo todav&iacute;a</i>
    <p>Amenidades, fotos y recorridos, checklist de documentos y comisi&oacute;n pactada.
      No es olvido: son campos de <b>contrato y de expediente</b>, y modelarlos antes de
      ver a un asesor us&aacute;ndolos es exactamente c&oacute;mo se construyen los sistemas que
      despu&eacute;s nadie llena. Entran cuando haya un asesor pidi&eacute;ndolos con nombre.</p>
  </div>`,
});

// 09 -------------------------------------------------------------------------
const P9 = page(9, {
  tone: 'dark',
  kicker: 'L&iacute;mites declarados',
  body: `
  <h2 class="display-l">Lo que este<br>m&oacute;dulo no hace.</h2>
  <p class="intro">Est&aacute; ac&aacute; para que nadie lo descubra despu&eacute;s de firmar.</p>

  <div class="nots">
    <div><b>No publica en portales.</b> UltraCasas est&aacute; en pausa e InfoCasas no expone
      una interfaz p&uacute;blica. Prometer sincronizaci&oacute;n autom&aacute;tica ser&iacute;a prometer un
      raspado fr&aacute;gil que se rompe sin aviso.</div>
    <div><b>No da asesor&iacute;a legal ni notarial.</b> El anticr&eacute;tico no se constituye sino
      por documento p&uacute;blico (C&oacute;digo Civil, art. 1430) y lo que lo hace oponible es la
      inscripci&oacute;n en Derechos Reales. Cualquier texto que salga del sistema es un
      borrador para el abogado, no un contrato.</div>
    <div><b>No declara impuestos por nadie.</b> El RC-IVA del anticr&eacute;tico lo declaran
      las dos partes sobre un ingreso presunto (DS 21531, art. 7). El sistema puede
      calcularlo y recordarlo; garantizar el cumplimiento, no.</div>
    <div><b>No verifica grav&aacute;menes ni tasa inmuebles.</b> Eso lo dice un folio real y
      lo firma un tasador.</div>
    <div><b>No custodia dinero de clientes.</b> Desde 2023 la actividad inmobiliaria es
      sujeto obligado ante la UIF; esos deberes son de la oficina y Onia no los asume
      por ella.</div>
    <div><b>No otorga licencia ni certificaci&oacute;n de asesor.</b> El sector no est&aacute;
      regulado en Bolivia y el proyecto de ley sigue sin aprobarse.</div>
    <div><b>No capta desde Instagram ni desde los portales.</b> Ese conector no existe.
      El m&oacute;dulo trabaja con las consultas que entran por los canales de la oficina.</div>
    <div><b>No reemplaza el sistema con el que la oficina ya trabaja.</b> Se sienta al
      lado, en el punto exacto donde una consulta entra y nadie la contesta.</div>
    <div><b>No publica un precio en d&oacute;lares sin tipo de cambio y fecha.</b> Es una regla
      del producto, no una preferencia de estilo.</div>
    <div><b>No promete mensajer&iacute;a autom&aacute;tica todav&iacute;a.</b> Hasta que Meta habilite el
      env&iacute;o, el mensaje aprobado sale de la mano del asesor.</div>
  </div>`,
});

// 10 -------------------------------------------------------------------------
const P10 = `
<section class="page dark closing" id="p10">
  <header class="rule">
    <span class="kicker">${LOGOMARK} Onia Platform</span>
    <span class="num">10 <i>/</i> ${TOTAL}</span>
  </header>
  <main class="body closing-body">
    <p class="statement big">Un CRM es un sistema m&aacute;s que alguien tiene que operar.<br>
      <b>Esto es un empleado que propone y espera el visto bueno.</b></p>

    <div class="steps">
      <div><span>01</span><p>El agente ya est&aacute; escrito. El paso que falta es verlo correr
        con consultas reales de una oficina &mdash; no con capturas.</p></div>
      <div><span>02</span><p>Una oficina lo usa con su propio flujo de consultas y dice
        d&oacute;nde molesta. Ese uso es el que decide qu&eacute; se construye despu&eacute;s.</p></div>
      <div><span>03</span><p>La ficha de propiedad se construye si el uso lo justifica.
        No se construye por si acaso.</p></div>
    </div>

    <p class="fine soft">Este muestrario no incluye precios a prop&oacute;sito: es un
      cat&aacute;logo de producto. La propuesta econ&oacute;mica se arma aparte y por escrito.</p>
  </main>
  <footer class="foot">
    <span class="mark">${LOGOMARK}<b>Onia</b> &mdash; Sistemas, automatizaci&oacute;n y contenido para negocios</span>
    <span>business@onia.com.bo</span>
  </footer>
</section>`;

// --- Documento ---------------------------------------------------------------

function buildHtml() {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Modulo Inmobiliario &mdash; Onia Platform</title>
<style>
@font-face{font-family:'Onia Display';src:url('${font('onia-display-500.ttf')}') format('truetype');font-weight:500;font-display:block}
@font-face{font-family:'Onia Display';src:url('${font('onia-display-600.ttf')}') format('truetype');font-weight:600;font-display:block}
@font-face{font-family:'Onia Display';src:url('${font('onia-display-700.ttf')}') format('truetype');font-weight:700;font-display:block}
@font-face{font-family:'Onia Body';src:url('${font('onia-body-400.ttf')}') format('truetype');font-weight:400;font-display:block}
@font-face{font-family:'Onia Body';src:url('${font('onia-body-500.ttf')}') format('truetype');font-weight:500;font-display:block}
@font-face{font-family:'Onia Mono';src:url('${font('onia-mono-400.ttf')}') format('truetype');font-weight:400;font-display:block}
@font-face{font-family:'Onia Mono';src:url('${font('onia-mono-500.ttf')}') format('truetype');font-weight:500;font-display:block}

:root{
  --green:#10C26B; --green-deep:#0B8F4F; --green-soft:#D6F5E5;
  --ink:#0A0F0D; --ink-2:#1C2622; --surface:#F4F5F2; --white:#fff;
  --muted:#6B756F; --muted-dark:#9FB0A8;
}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Onia Body',system-ui,sans-serif;font-weight:400;background:#8a8a8a}

.page{position:relative;width:210mm;height:296.6mm;padding:15mm 16mm 12mm;
  display:flex;flex-direction:column;overflow:hidden}
.page + .page{page-break-before:always}
.light{background:var(--surface);color:var(--ink);--fg:var(--ink);--dim:var(--muted);--acc:var(--green-deep);--card:#fff;--line:rgba(10,15,13,.13)}
.dark{background:var(--ink);color:var(--surface);--fg:var(--surface);--dim:var(--muted-dark);--acc:var(--green);--card:var(--ink-2);--line:rgba(244,245,242,.15)}

/* --- furniture --- */
.rule{display:flex;justify-content:space-between;align-items:center;
  padding-bottom:4mm;border-bottom:1px solid var(--line);flex:0 0 auto}
.kicker,.num{font-family:'Onia Mono',monospace;font-size:7pt;font-weight:500;
  letter-spacing:.19em;text-transform:uppercase;color:var(--dim);
  display:flex;align-items:center;gap:2.2mm}
.num i{opacity:.4;font-style:normal}
.logo{width:3.6mm;height:3.6mm;flex:0 0 auto}
.foot{display:flex;justify-content:space-between;align-items:center;flex:0 0 auto;
  padding-top:3.5mm;border-top:1px solid var(--line);
  font-family:'Onia Mono',monospace;font-size:6.6pt;letter-spacing:.1em;color:var(--dim)}
.mark{display:flex;align-items:center;gap:2mm}
.mark b{font-family:'Onia Display',sans-serif;font-weight:600;letter-spacing:-.01em;color:var(--fg)}
.body{flex:1 1 auto;padding-top:11mm;display:flex;flex-direction:column}

/* --- type --- */
.display-xl{font-family:'Onia Display',sans-serif;font-weight:600;font-size:58pt;
  line-height:.94;letter-spacing:-.032em}
.display-l{font-family:'Onia Display',sans-serif;font-weight:600;font-size:33pt;
  line-height:1.02;letter-spacing:-.026em}
.display-m{font-family:'Onia Display',sans-serif;font-weight:600;font-size:26pt;
  line-height:1.05;letter-spacing:-.022em}
.eyebrow{font-family:'Onia Mono',monospace;font-size:8pt;font-weight:500;
  letter-spacing:.28em;text-transform:uppercase;color:var(--green);margin-bottom:9mm}
.intro{font-size:11pt;line-height:1.5;color:var(--dim);max-width:118mm;margin-top:5mm}
.statement{font-family:'Onia Display',sans-serif;font-weight:500;font-size:19pt;
  line-height:1.24;letter-spacing:-.018em;max-width:150mm}
.statement b{font-weight:700;color:var(--acc)}
.statement.sm{font-size:13.5pt;margin:8mm 0 0;max-width:150mm}
.statement.big{font-size:23pt;line-height:1.22;max-width:none}
.head-row{display:flex;align-items:flex-end;justify-content:space-between;gap:8mm}
.sub{font-family:'Onia Display',sans-serif;font-weight:500;font-size:13pt;
  letter-spacing:-.01em;margin:9mm 0 4mm}
.sub b{font-weight:700;color:var(--acc)}
.fine{font-size:8.6pt;line-height:1.5;color:var(--dim);margin-top:4mm;max-width:160mm}
.fine.soft{padding-top:8mm;border-top:1px solid var(--line);max-width:none}

/* --- tags --- */
.tag{display:inline-block;font-family:'Onia Mono',monospace;font-size:6.6pt;
  font-weight:500;letter-spacing:.15em;text-transform:uppercase;
  padding:1.4mm 2.6mm;border-radius:1.2mm;white-space:nowrap}
.tag-now{background:var(--green);color:#04240f}
.tag-spec{background:rgba(10,15,13,.08);color:var(--muted);border:1px solid var(--line)}
.tag-wait{background:transparent;color:var(--dim);border:1px dashed var(--line)}
.tag-mock{background:rgba(244,245,242,.1);color:var(--muted-dark);border:1px dashed rgba(244,245,242,.35)}

/* --- cover --- */
.cover-body{justify-content:flex-end;padding-bottom:4mm}
.cover .lead{font-size:13pt;line-height:1.45;color:var(--muted-dark);
  max-width:132mm;margin-top:9mm}
.cover-meta{display:grid;grid-template-columns:1fr 1fr;gap:9mm;margin-top:18mm;
  padding-top:7mm;border-top:1px solid var(--line)}
.cover-meta i{display:block;font-family:'Onia Mono',monospace;font-size:6.8pt;
  font-style:normal;letter-spacing:.2em;text-transform:uppercase;color:var(--green);margin-bottom:2.5mm}
.cover-meta b{font-weight:400;font-size:9.4pt;line-height:1.5;color:var(--muted-dark)}

/* --- fases --- */
.phases{margin-top:10mm;display:flex;flex-direction:column;gap:0}
.phase{padding:6.5mm 0;border-top:1px solid var(--line);
  display:grid;grid-template-columns:44mm 1fr;gap:2.5mm 8mm;align-items:start}
.phase:last-child{border-bottom:1px solid var(--line)}
.phase h3{grid-column:2;font-family:'Onia Display',sans-serif;font-weight:600;
  font-size:13pt;letter-spacing:-.015em;margin-bottom:2.5mm}
.phase p{grid-column:2;font-size:9.6pt;line-height:1.5;color:var(--dim);max-width:112mm}
.phase p b{color:var(--fg);font-weight:500}
.phase .tag{grid-row:1 / span 2;grid-column:1;justify-self:start}
.phase.now h3{color:var(--green-deep)}

/* --- notes --- */
.split{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:auto;padding-top:9mm}
.note{padding:6mm;border-radius:2mm;background:var(--card);border:1px solid var(--line);
  border-left:3px solid var(--acc)}
.note.warn{border-left-color:#B4761E}
.note.accent{border-left-color:var(--acc);background:var(--green-soft);border-color:transparent}
.dark .note.accent{background:var(--card);border-color:var(--line)}
.note.wide{margin-top:9mm}
.note.auto{margin-top:auto}
.note i{display:block;font-family:'Onia Mono',monospace;font-size:6.8pt;font-style:normal;
  letter-spacing:.17em;text-transform:uppercase;color:var(--dim);margin-bottom:3mm}
.note p{font-size:9.4pt;line-height:1.52}
.note.ok i{color:var(--green-deep)}
.note.warn i{color:#8A5A12}

/* --- stack (listas editoriales) --- */
.stack{margin-top:11mm;display:flex;flex-direction:column}
.stack.tight{margin-top:9mm}
.row{display:grid;grid-template-columns:20mm 1fr;gap:4mm;padding:6mm 0;
  border-top:1px solid var(--line)}
.row:last-child{border-bottom:1px solid var(--line)}
.idx{font-family:'Onia Mono',monospace;font-size:9pt;font-weight:500;
  letter-spacing:.1em;color:var(--acc)}
.row h3{font-family:'Onia Display',sans-serif;font-weight:600;font-size:12.5pt;
  letter-spacing:-.015em;margin-bottom:2.5mm}
.row p{font-size:9.6pt;line-height:1.5;color:var(--dim);max-width:126mm}
.row p b{color:var(--fg);font-weight:500}

/* --- diagrama --- */
.diagram{margin-top:auto;padding-top:10mm}
.d-core{background:var(--ink);color:var(--surface);border-radius:2mm;padding:5mm 6mm}
.d-core b{font-family:'Onia Display',sans-serif;font-weight:600;font-size:11pt;display:block}
.d-core span{font-family:'Onia Mono',monospace;font-size:7pt;letter-spacing:.12em;
  color:var(--muted-dark);display:block;margin-top:1.8mm}
.d-arrow{height:6mm;width:1px;background:var(--line);margin:0 auto}
.d-mods{display:flex;flex-wrap:wrap;gap:2mm}
.d-mods span{font-family:'Onia Mono',monospace;font-size:7.4pt;letter-spacing:.08em;
  padding:2.2mm 3.4mm;border:1px solid var(--line);border-radius:1.4mm;color:var(--dim)}
.d-mods .on{background:var(--green);border-color:var(--green);color:#04240f;font-weight:500}

/* --- lectura del lead --- */
.read{display:grid;grid-template-columns:1fr 1fr;gap:7mm;margin-top:9mm;align-items:stretch}
.read i{display:block;font-family:'Onia Mono',monospace;font-size:6.8pt;font-style:normal;
  letter-spacing:.17em;text-transform:uppercase;color:var(--dim);margin-bottom:3.5mm}
.raw{display:flex;flex-direction:column}
.quote{font-family:'Onia Display',sans-serif;font-weight:500;font-size:15pt;line-height:1.35;
  letter-spacing:-.012em;padding:7mm;background:var(--card);border-radius:2mm;
  border:1px solid var(--line)}
.fields ul{list-style:none;border-top:1px solid var(--line)}
.fields li{display:flex;justify-content:space-between;align-items:baseline;
  padding:2.7mm 0;border-bottom:1px solid var(--line)}
.fields span{font-family:'Onia Mono',monospace;font-size:7.4pt;letter-spacing:.13em;
  text-transform:uppercase;color:var(--dim)}
.fields b{font-size:9.6pt;font-weight:500;color:var(--acc)}
.fields .miss b{color:var(--dim);font-weight:400}
.buckets{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;margin-top:10mm}
.buckets div{border-top:2px solid var(--line);padding-top:4mm}
.buckets div:first-child{border-top-color:var(--acc)}
.buckets > div > b{font-family:'Onia Display',sans-serif;font-weight:600;font-size:10pt;display:block}
.buckets span{font-size:8.8pt;line-height:1.45;color:var(--dim)}

/* --- fuentes de intake (p4) --- */
.sources{margin-top:auto;padding-top:9mm;border-top:1px solid var(--line)}
.sources i{display:block;font-family:'Onia Mono',monospace;font-size:6.8pt;font-style:normal;
  letter-spacing:.17em;text-transform:uppercase;color:var(--acc);margin-bottom:4mm}
.chips{display:flex;flex-wrap:wrap;gap:2.5mm;margin-bottom:5mm}
.chips span{font-size:8.8pt;padding:2.4mm 4mm;border:1px solid var(--line);
  border-radius:1.4mm;color:var(--fg)}
.sources p{font-size:9.2pt;line-height:1.55;color:var(--dim);max-width:168mm}
.sources p b{color:var(--fg);font-weight:500}

/* --- chats --- */
.chats{margin-top:9mm;display:flex;flex-direction:column;gap:5mm}
.chat{background:var(--card);border-radius:2.4mm;padding:5mm 6mm;
  border:1px solid var(--line);border-left:3px solid var(--green);max-width:150mm}
.chat:nth-child(2){margin-left:14mm}
.chat:nth-child(3){margin-left:28mm}
.chip{font-family:'Onia Mono',monospace;font-size:6.6pt;letter-spacing:.16em;
  text-transform:uppercase;color:var(--green);display:block;margin-bottom:3mm}
.chat p{font-size:10pt;line-height:1.52}
.state{font-family:'Onia Mono',monospace;font-size:6.6pt;letter-spacing:.14em;
  text-transform:uppercase;color:var(--dim);display:block;margin-top:3.5mm}
.hardline{margin-top:auto;padding-top:8mm;border-top:1px solid var(--line)}
.hardline i{display:block;font-family:'Onia Mono',monospace;font-size:6.8pt;font-style:normal;
  letter-spacing:.17em;text-transform:uppercase;color:var(--green);margin-bottom:3mm}
.hardline p{font-size:9.4pt;line-height:1.55;color:var(--dim);max-width:165mm}
.hardline b{color:var(--fg);font-weight:500}

/* --- flujo --- */
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:9mm}
.flow div{padding:5mm;border-radius:2mm;background:var(--card);border:1px solid var(--line)}
.flow .human{background:var(--green-soft);border-color:var(--green);border-width:1.5px}
.flow span{font-family:'Onia Mono',monospace;font-size:7pt;letter-spacing:.16em;
  color:var(--acc);display:block;margin-bottom:2.5mm}
.flow b{font-family:'Onia Display',sans-serif;font-weight:600;font-size:10.5pt;
  display:block;margin-bottom:2mm;letter-spacing:-.012em}
.flow p{font-size:8.6pt;line-height:1.45;color:var(--dim)}
.never{display:grid;grid-template-columns:1fr 1fr;gap:5mm 7mm}
.never div{font-size:9.4pt;line-height:1.5;color:var(--dim);
  padding-left:4mm;border-left:2px solid var(--line)}
.never div:first-child{border-left-color:var(--acc)}
.never b{color:var(--fg);font-weight:500}

/* --- fase 2 --- */
.spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:7mm 9mm;margin-top:10mm}
.spec-grid i{display:block;font-family:'Onia Mono',monospace;font-size:7pt;font-style:normal;
  letter-spacing:.18em;text-transform:uppercase;color:var(--acc);margin-bottom:3mm;
  padding-bottom:2.5mm;border-bottom:1px solid var(--line)}
.spec-grid p{font-size:9.6pt;line-height:1.52;color:var(--dim)}
.spec-grid b{color:var(--fg);font-weight:500}

/* --- no hace --- */
.nots{margin-top:10mm;display:grid;grid-template-columns:1fr 1fr;gap:6mm 8mm}
.nots div{font-size:9.5pt;line-height:1.5;color:var(--dim);padding-top:4mm;
  border-top:1px solid var(--line)}
.nots b{font-family:'Onia Display',sans-serif;font-weight:600;color:var(--fg);
  font-size:10.5pt;letter-spacing:-.01em}

/* --- cierre --- */
.closing-body{padding-top:24mm;padding-bottom:2mm}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;margin-top:auto;
  padding-top:8mm;border-top:1px solid var(--line)}
.closing-body .fine.soft{margin-top:12mm}
.steps span{font-family:'Onia Mono',monospace;font-size:7.4pt;letter-spacing:.18em;
  color:var(--green);display:block;margin-bottom:3mm}
.steps p{font-size:9.6pt;line-height:1.5;color:var(--muted-dark)}
</style></head>
<body>
${P1}${P2}${P3}${P4}${P5}${P6}${P7}${P8}${P9}${P10}
</body></html>`;
}

// --- Main --------------------------------------------------------------------

function main() {
  ensurePrintFonts();
  fs.writeFileSync(OUT_HTML, buildHtml(), 'utf8');
  console.log(`[Onia] HTML -> ${OUT_HTML}`);

  if (process.argv.includes('--no-pdf')) return;
  const browser = BROWSERS.find((p) => fs.existsSync(p));
  if (!browser) {
    console.warn('[Onia] No se encontro Edge/Chrome — solo se genero el HTML.');
    return;
  }
  const ud = path.join(require('os').tmpdir(), `onia-muestrario-${Date.now()}`);
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', `--user-data-dir=${ud}`,
    // Sin este presupuesto de tiempo, print-to-pdf dispara antes de que las
    // woff2 embebidas terminen de cargar y el PDF sale con Times/Segoe UI.
    '--virtual-time-budget=8000',
    `--print-to-pdf=${OUT_PDF}`, '--no-pdf-header-footer', OUT_HTML,
  ], { stdio: 'ignore' });
  console.log(`[Onia] PDF  -> ${OUT_PDF}`);

  // Gate: si las fuentes de marca no quedaron embebidas, el PDF no sirve.
  const pdf = fs.readFileSync(OUT_PDF).toString('latin1');
  const fonts = [...new Set([...pdf.matchAll(/\/BaseFont\s*\/[A-Z]{6}\+([A-Za-z0-9\-]+)/g)]
    .map((m) => m[1]))];
  // Cualquier fuente ajena a la marca = un glifo que se cayo del subset latin
  // (paso con U+2011). No es cosmetico: el PDF sale con dos tipografias mezcladas.
  const intrusas = fonts.filter((f) => !/Bricolage|DMSans|SplineSansMono/i.test(f));
  console.log(`[Onia] Fuentes en el PDF: ${fonts.join(', ') || '(ninguna)'}`);
  if (fonts.length < 3 || intrusas.length) {
    console.error(`[Onia] ERROR: el PDF cayo a fuentes del sistema (${intrusas.join(', ')}).`);
    console.error('[Onia] Suele ser un caracter fuera del subset latin. Revisar el texto.');
    process.exitCode = 1;
  }
}

main();
