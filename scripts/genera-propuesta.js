#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ─── Catálogo de productos ONIA ───────────────────────────────────────────────

const PRODUCTOS = {
  dentalgest: {
    id: 'dentalgest',
    nombre: 'DentalGest',
    tagline: 'Sistema de gestión para clínicas dentales',
    descripcion: 'Pacientes, citas, tratamientos, pagos y seguimiento operativo en un solo sistema.',
    industrias: ['dental', 'clinica', 'salud'],
    planes: [
      { nombre: 'Básico',       precio: 'Bs. 320/mes',   descripcion: 'Hasta 2 doctores, funciones esenciales' },
      { nombre: 'Profesional',  precio: 'Bs. 750/mes',   descripcion: 'Equipo completo, reportes avanzados' },
      { nombre: 'Clínica',      precio: 'Bs. 1.500/mes', descripcion: 'Multi-sede, acceso ilimitado, soporte prioritario' },
    ],
    beneficios: [
      'Agenda digital con recordatorios automáticos',
      'Odontograma SVG interactivo por paciente',
      'Facturación y seguimiento de pagos',
      'Seguimiento ordenado de consultas y citas',
      'Reportes de ingresos y ocupación por período',
    ],
  },
  gestios: {
    id: 'gestios',
    nombre: 'GestiOS',
    tagline: 'Sistema operativo para PYMEs bolivianas',
    descripcion: 'Inventario, clientes, ventas, pedidos y reportes — sin Excel, sin caos.',
    industrias: ['retail', 'comercio', 'pyme', 'negocio', 'tienda', 'restaurant', 'servicio'],
    planes: [
      { nombre: 'Básico',      precio: 'Bs. 350/mes',   descripcion: '150 productos, 50 clientes, 1 staff' },
      { nombre: 'Crecer',      precio: 'Bs. 530/mes',   descripcion: '500 productos, 300 clientes, 3 staff' },
      { nombre: 'Pro',         precio: 'Bs. 800/mes',   descripcion: 'Productos y clientes ilimitados, 10 staff' },
      { nombre: 'Empresarial', precio: 'Bs. 1.250/mes', descripcion: 'Todo ilimitado, multi-sucursal' },
    ],
    beneficios: [
      'POS completo con variantes y carrito',
      'Inventario en tiempo real con alertas de stock',
      'CRM de clientes con puntos de lealtad',
      'Reportes de ingresos, margen y productos top',
      'Emails automáticos para clientes y pedidos',
    ],
  },
  web_landing: {
    id: 'web_landing',
    nombre: 'Landing de Captación',
    tagline: 'Página diseñada para convertir visitantes en leads',
    descripcion: 'Una página profesional enfocada en generar contactos calificados para tu negocio.',
    industrias: ['*'],
    planes: [
      { nombre: 'Landing de Captación', precio: 'Bs. 790', descripcion: 'Precio único, entrega en 7-10 días' },
    ],
    beneficios: [
      'Diseño profesional alineado a tu marca',
      'Optimizada para móvil y carga rápida',
      'Formulario de contacto conectado a WhatsApp',
      'SEO básico configurado',
      'Hosting y dominio primer año incluido',
    ],
  },
  web_negocio: {
    id: 'web_negocio',
    nombre: 'Web Profesional',
    tagline: 'Presencia digital completa para tu empresa',
    descripcion: 'Web multi-sección, portafolio, servicios y contacto — lista para posicionar tu marca.',
    industrias: ['*'],
    planes: [
      { nombre: 'Web Profesional', precio: 'Bs. 1.500', descripcion: 'Precio único, entrega en 15-20 días' },
    ],
    beneficios: [
      'Diseño a medida sin plantillas genéricas',
      'Portafolio, servicios, equipo y blog',
      'Formularios y WhatsApp integrado',
      'Panel de administración simple',
      'Cuidado web básico incluido 1 mes',
    ],
  },
  web_pro: {
    id: 'web_pro',
    nombre: 'Web Pro ONIA',
    tagline: 'Sitio web premium enfocado en captacion y seguimiento',
    descripcion: 'Web de alto nivel con estructura comercial, formularios, seguimiento y automatizacion ligera.',
    industrias: ['premium', 'audiovisual', 'productora', 'arquitecto', 'constructora', 'corporativo'],
    planes: [
      { nombre: 'Web Pro ONIA', precio: 'Bs. 2.900', descripcion: 'Precio único, entrega en 20-30 días' },
    ],
    beneficios: [
      'Diseño editorial premium sin plantillas',
      'Estructura comercial clara por servicio u oferta',
      'Portafolio multimedia con galerías avanzadas',
      'Captación y seguimiento de leads calificados',
      'Integración con WhatsApp, CRM y calendarios',
    ],
  },
  consultoria: {
    id: 'consultoria',
    nombre: 'Consultoría ONIA',
    tagline: 'Diagnóstico y plan de acción para digitalizar tu operación',
    descripcion: 'Auditamos tu negocio, identificamos cuellos de botella y entregamos un plan concreto.',
    industrias: ['*'],
    planes: [
      { nombre: 'Auditoría Express',         precio: 'Bs. 250',         descripcion: 'Revisión puntual con 3 problemas y 3 acciones' },
      { nombre: 'Diagnóstico + Plan',         precio: 'Bs. 690',         descripcion: 'Análisis completo y hoja de ruta' },
      { nombre: 'Implementación Operativa',   precio: 'desde Bs. 4.900', descripcion: 'Ejecución con acompañamiento' },
    ],
    beneficios: [
      'Identificación de procesos automatizables',
      'Mapa digital de tu operación actual vs ideal',
      'Recomendación de herramientas y prioridades',
      'Plan de acción por fases con estimados',
      'Sesión de seguimiento incluida',
    ],
  },
};

// ─── Mapeo industria → productos ──────────────────────────────────────────────

const INDUSTRIA_PRODUCTOS = {
  dental:       ['dentalgest', 'web_landing', 'consultoria'],
  clinica:      ['dentalgest', 'web_negocio', 'consultoria'],
  salud:        ['dentalgest', 'web_negocio', 'consultoria'],
  audiovisual:  ['web_pro',    'web_negocio', 'consultoria'],
  productora:   ['web_pro',    'web_negocio', 'consultoria'],
  arquitecto:   ['web_pro',    'web_negocio', 'consultoria'],
  constructora: ['web_pro',    'gestios',     'consultoria'],
  retail:       ['gestios',    'web_landing', 'consultoria'],
  comercio:     ['gestios',    'web_landing', 'consultoria'],
  restaurant:   ['gestios',    'web_landing', 'consultoria'],
  pyme:         ['gestios',    'web_negocio', 'consultoria'],
  servicio:     ['web_negocio','gestios',     'consultoria'],
  default:      ['web_negocio','consultoria', 'web_landing'],
};

// ─── Dolores por industria ────────────────────────────────────────────────────

const DOLORES = {
  dental:       'Las clínicas dentales pierden pacientes por falta de seguimiento, agenda desorganizada y sin sistema de recordatorios.',
  clinica:      'Sin sistema centralizado, los datos de pacientes se pierden, las citas se superponen y la facturación es un caos.',
  audiovisual:  'Las productoras pierden clientes potenciales por no tener presencia digital que refleje la calidad de su trabajo.',
  productora:   'Un portafolio desactualizado o una web genérica desacredita el trabajo audiovisual antes de que el cliente vea un proyecto.',
  arquitecto:   'Los estudios de arquitectura con páginas web anticuadas o sin web pierden credibilidad frente a clientes premium.',
  constructora: 'Las constructoras con operaciones manuales no pueden escalar: proyectos, materiales y equipos sin trazabilidad.',
  retail:       'El inventario en Excel, los pedidos por WhatsApp y las ventas sin registro crean caos operativo y pérdidas invisibles.',
  comercio:     'Sin sistema de ventas, los negocios comerciales no saben qué venden, qué les falta ni cuáles son sus clientes frecuentes.',
  restaurant:   'La operación de un restaurante sin sistema centralizado produce errores en pedidos, stock descontrolado y clientes perdidos.',
  pyme:         'Las PYMEs que operan con herramientas dispersas pierden tiempo, cometen errores y no pueden crecer con orden.',
  servicio:     'Los negocios de servicios sin presencia digital clara dependen solo del boca a boca y pierden oportunidades cada día.',
  default:      'Los negocios sin sistema digital organizado dependen de procesos manuales que no escalan y generan errores costosos.',
};

// ─── Utils ────────────────────────────────────────────────────────────────────

function normalizarIndustria(str) {
  if (!str) return 'default';
  const s = str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const key of Object.keys(INDUSTRIA_PRODUCTOS)) {
    if (s.includes(key)) return key;
  }
  return 'default';
}

function slug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parsearArgs(args) {
  if (args[0] && args[0].endsWith('.json')) {
    return JSON.parse(fs.readFileSync(args[0], 'utf8'));
  }
  const datos = {};
  for (const arg of args) {
    const m = arg.match(/^--([^=]+)=(.+)$/);
    if (m) datos[m[1]] = m[2];
  }
  return datos;
}

// ─── Generador HTML (Reveal.js) ───────────────────────────────────────────────

function generarHTML(datos) {
  const {
    empresa = 'Tu empresa',
    industria = '',
    necesidad = '',
    contacto = '',
    ciudad = '',
    notas = '',
    fecha = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }),
    productos_forzados = null,
  } = datos;

  const ind = normalizarIndustria(industria || necesidad);
  const productoIds = productos_forzados
    ? (Array.isArray(productos_forzados) ? productos_forzados : productos_forzados.split(',').map(s => s.trim()))
    : (INDUSTRIA_PRODUCTOS[ind] || INDUSTRIA_PRODUCTOS.default);

  const productos     = productoIds.map(id => PRODUCTOS[id]).filter(Boolean);
  const dolor         = DOLORES[ind] || DOLORES.default;
  const principal     = productos[0];
  const secundarios   = productos.slice(1);

  const DARK      = '#080e1a';
  const HERO_GRAD = 'radial-gradient(ellipse at 18% 65%, #0d2952 0%, #080e1a 55%, #071a10 100%)';
  const CTA_GRAD  = 'radial-gradient(ellipse at 82% 35%, #0d2952 0%, #080e1a 55%, #071a10 100%)';

  function sec(content, bg) {
    const attr = bg.startsWith('#')
      ? `data-background-color="${bg}"`
      : `data-background-gradient="${bg}"`;
    return `<section ${attr}>\n${content}\n</section>`;
  }

  const slides = [];

  // ── Slide 1: Portada ───────────────────────────────────────────────────────
  slides.push(sec(`
  <div class="o-cover">
    <div class="o-logo">ONIA <span class="o-dot">●</span></div>
    <div class="o-eyebrow">Propuesta personalizada · ${fecha}</div>
    <h1 class="o-cover-headline">
      <span class="o-blue">${empresa},</span><br>
      esto construimos<br>para vos.
    </h1>
    ${necesidad ? `<p class="o-cover-need">Basado en: <strong>${necesidad}</strong></p>` : ''}
    <div class="o-cover-meta">
      ${contacto ? `<span>${contacto}</span>` : ''}
      ${ciudad ? `<span>📍 ${ciudad}</span>` : ''}
    </div>
    <div class="o-cover-footer">onia.com.bo · +591 75470140</div>
  </div>`, HERO_GRAD));

  // ── Slide 2: El problema ───────────────────────────────────────────────────
  slides.push(sec(`
  <div class="o-slide">
    <div class="o-kicker">El problema</div>
    <h2 class="o-title">Lo que frena a negocios<br>como el tuyo</h2>
    <p class="o-body fragment fade-up">${dolor}</p>
    ${necesidad ? `<blockquote class="o-quote fragment fade-up">"${necesidad}"</blockquote>` : ''}
    <div class="o-pain-grid fragment fade-up">
      <div class="o-pain"><span>⚠️</span><p>Procesos manuales que no escalan</p></div>
      <div class="o-pain"><span>📉</span><p>Clientes perdidos sin seguimiento</p></div>
      <div class="o-pain"><span>🔀</span><p>Datos dispersos sin visibilidad</p></div>
      <div class="o-pain"><span>⏳</span><p>Tiempo en tareas automatizables</p></div>
    </div>
  </div>`, DARK));

  // ── Slide 3: ONIA ──────────────────────────────────────────────────────────
  slides.push(sec(`
  <div class="o-slide">
    <div class="o-kicker">La solución</div>
    <h2 class="o-title">ONIA construye sistemas<br>que trabajan para vos</h2>
    <div class="o-pillars">
      <div class="o-pillar fragment fade-up">
        <span class="o-pillar-icon">🌐</span>
        <h3>Presencia Digital</h3>
        <p>Webs premium que convierten visitantes en clientes reales.</p>
      </div>
      <div class="o-pillar fragment fade-up">
        <span class="o-pillar-icon">⚙️</span>
        <h3>Automatización</h3>
        <p>Flujos n8n, CRMs y chatbots que eliminan el trabajo manual.</p>
      </div>
      <div class="o-pillar fragment fade-up">
        <span class="o-pillar-icon">🤖</span>
        <h3>IA Aplicada</h3>
        <p>Automatizaciones simples, asistentes y sistemas inteligentes para tu negocio.</p>
      </div>
    </div>
    <div class="o-badge fragment fade-up">Empresa boliviana · Equipo local · Soporte real</div>
  </div>`, DARK));

  // ── Slide 4: Producto principal ────────────────────────────────────────────
  if (principal) {
    slides.push(sec(`
  <div class="o-slide">
    <div class="o-kicker">Recomendación principal</div>
    <h2 class="o-title">${principal.nombre}</h2>
    <p class="o-tagline">${principal.tagline}</p>
    <div class="o-product-grid">
      <div class="fragment fade-right">
        <div class="o-label">Lo que incluye:</div>
        <ul class="o-checklist">
          ${principal.beneficios.map(b => `<li>${b}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="fragment fade-left">
        <div class="o-label">Planes disponibles:</div>
        ${principal.planes.map((p, i) => `
        <div class="o-plan${i === 1 ? ' o-plan--star' : ''}">
          ${i === 1 ? '<div class="o-plan-badge">Más popular</div>' : ''}
          <div class="o-plan-name">${p.nombre}</div>
          <div class="o-plan-price">${p.precio}</div>
          <div class="o-plan-desc">${p.descripcion}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>`, DARK));
  }

  // ── Slide 5: Complementos ──────────────────────────────────────────────────
  if (secundarios.length > 0) {
    slides.push(sec(`
  <div class="o-slide">
    <div class="o-kicker">Complementos recomendados</div>
    <h2 class="o-title">Sistema completo para ${empresa}</h2>
    <div class="o-comps">
      ${secundarios.map(p => `
      <div class="o-comp fragment fade-up">
        <div class="o-comp-name">${p.nombre}</div>
        <p class="o-comp-tagline">${p.tagline}</p>
        <ul class="o-comp-list">
          ${p.beneficios.slice(0, 3).map(b => `<li>${b}</li>`).join('\n          ')}
        </ul>
        <div class="o-comp-price">${p.planes[0].precio}</div>
      </div>`).join('')}
    </div>
  </div>`, DARK));
  }

  // ── Slide 6: Proceso ───────────────────────────────────────────────────────
  slides.push(sec(`
  <div class="o-slide">
    <div class="o-kicker">Cómo trabajamos</div>
    <h2 class="o-title">Proceso claro, entregas reales</h2>
    <div class="o-process">
      <div class="o-step fragment fade-up">
        <div class="o-step-num">01</div>
        <div>
          <h4>Reunión de descubrimiento</h4>
          <p>Entendemos tu negocio, dolores y objetivos. Sin supuestos.</p>
        </div>
      </div>
      <div class="o-step fragment fade-up">
        <div class="o-step-num">02</div>
        <div>
          <h4>Propuesta y acuerdo</h4>
          <p>Precio fijo, alcance definido y fecha comprometida.</p>
        </div>
      </div>
      <div class="o-step fragment fade-up">
        <div class="o-step-num">03</div>
        <div>
          <h4>Construcción con revisiones</h4>
          <p>Mostramos avances. Ajustamos con feedback. Sin sorpresas.</p>
        </div>
      </div>
      <div class="o-step fragment fade-up">
        <div class="o-step-num">04</div>
        <div>
          <h4>Entrega y activación</h4>
          <p>Sistema en vivo, equipo capacitado, soporte garantizado.</p>
        </div>
      </div>
    </div>
  </div>`, DARK));

  // ── Slide 7: CTA ───────────────────────────────────────────────────────────
  slides.push(sec(`
  <div class="o-cta">
    <div class="o-kicker" style="text-align:center">Próximo paso</div>
    <h2 class="o-cta-title">¿Agendamos<br>una llamada?</h2>
    <p class="o-cta-sub fragment fade-up">Sin compromiso. Te mostramos en detalle cómo quedaría para ${empresa} específicamente.</p>
    <div class="o-cta-btns fragment fade-up">
      <a href="https://wa.me/59175470140" class="o-btn o-btn-primary">💬 WhatsApp directo</a>
      <a href="mailto:oninteligenciaartificial@gmail.com" class="o-btn o-btn-ghost">📧 Email</a>
    </div>
    <p class="o-cta-contact fragment fade-up">onia.com.bo · Santa Cruz, Bolivia · +591 75470140</p>
    ${notas ? `<div class="o-cta-note fragment fade-up">${notas}</div>` : ''}
  </div>`, CTA_GRAD));

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ONIA × ${empresa}</title>
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.1.0/dist/reveal.css">
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.1.0/dist/theme/black.css">
  <style>
    /* ── Variables ───────────────────────────────────── */
    :root {
      --blue:   #3b82f6;
      --green:  #10b981;
      --muted:  rgba(255,255,255,.55);
      --line:   rgba(255,255,255,.08);
      --glass:  rgba(255,255,255,.04);
    }

    /* ── Base overrides ──────────────────────────────── */
    .reveal,
    .reveal-viewport       { background: #080e1a; }
    .reveal                { font-family: Aptos, "Segoe UI", Arial, sans-serif; }
    .reveal h1, .reveal h2,
    .reveal h3, .reveal h4 {
      font-family: Aptos, "Segoe UI", Arial, sans-serif;
      text-transform: none;
      letter-spacing: -0.025em;
      color: #fff;
      margin: 0;
    }
    .reveal p               { margin: 0; }
    .reveal ul              { list-style: none; padding: 0; margin: 0; }
    .reveal .slides section { text-align: left; top: 0 !important; }
    .reveal .progress       { color: var(--blue); }
    .reveal .controls       { color: var(--blue); }
    .reveal .slide-number   { font-size: .45em; background: none; color: rgba(255,255,255,.25); }

    /* ── Layout shells ───────────────────────────────── */
    .o-cover, .o-slide, .o-cta {
      width: 100%;
      height: 100%;
      min-height: 720px;
      padding: 52px 64px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    .o-slide { justify-content: center; }
    .o-cover { justify-content: center; }
    .o-cta   { justify-content: center; align-items: center; text-align: center; }

    /* ── Kicker ──────────────────────────────────────── */
    .o-kicker {
      font-size: .4em;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--blue);
      margin-bottom: .9em;
    }

    /* ── Cover ───────────────────────────────────────── */
    .o-logo {
      font-size: .52em;
      font-weight: 900;
      letter-spacing: .16em;
      color: #fff;
      margin-bottom: 28px;
    }
    .o-dot              { color: var(--blue); }
    .o-eyebrow {
      font-size: .38em;
      font-weight: 600;
      color: rgba(255,255,255,.3);
      text-transform: uppercase;
      letter-spacing: .07em;
      margin-bottom: 14px;
    }
    .o-cover-headline {
      font-size: 1.55em;
      font-weight: 900;
      line-height: 1.07;
      color: #fff;
      margin-bottom: 20px;
    }
    .o-blue             { color: var(--blue); }
    .o-cover-need {
      font-size: .45em;
      color: rgba(255,255,255,.5);
      line-height: 1.65;
      max-width: 540px;
      margin-bottom: 10px;
    }
    .o-cover-need strong { color: rgba(255,255,255,.82); font-weight: 600; }
    .o-cover-meta {
      display: flex;
      gap: 14px;
      font-size: .36em;
      color: rgba(255,255,255,.28);
      margin-top: 6px;
    }
    .o-cover-footer {
      font-size: .34em;
      color: rgba(255,255,255,.15);
      margin-top: auto;
    }

    /* ── Slide titles ─────────────────────────────────── */
    .o-title   { font-size: .95em; font-weight: 800; line-height: 1.14; margin-bottom: .45em; }
    .o-tagline { font-size: .45em; font-weight: 600; color: var(--blue); margin-bottom: .6em; }
    .o-body    { font-size: .45em; color: var(--muted); line-height: 1.65; max-width: 620px; margin-bottom: .5em; }
    .o-quote {
      font-size: .43em;
      background: rgba(59,130,246,.1);
      border: 1px solid rgba(59,130,246,.24);
      padding: .6em 1em;
      color: rgba(255,255,255,.72);
      border-radius: 8px;
      margin: .35em 0 .6em;
      font-style: normal;
    }
    .o-label {
      font-size: .38em;
      font-weight: 700;
      color: rgba(255,255,255,.32);
      text-transform: uppercase;
      letter-spacing: .07em;
      margin-bottom: .7em;
    }

    /* ── Pain grid ────────────────────────────────────── */
    .o-pain-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .o-pain {
      background: rgba(239,68,68,.07);
      border: 1px solid rgba(239,68,68,.18);
      border-radius: 10px;
      padding: 12px 14px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .o-pain span { font-size: .9em; flex-shrink: 0; line-height: 1.5; }
    .o-pain p    { font-size: .39em; color: rgba(255,255,255,.65); line-height: 1.45; margin: 0; }

    /* ── Pillars ──────────────────────────────────────── */
    .o-pillars {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
      margin: .55em 0;
    }
    .o-pillar {
      background: var(--glass);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 22px 20px;
    }
    .o-pillar-icon { font-size: 1.35em; margin-bottom: 10px; display: block; }
    .o-pillar h3   { font-size: .45em; font-weight: 700; margin-bottom: 6px; }
    .o-pillar p    { font-size: .39em; color: var(--muted); line-height: 1.5; margin: 0; }
    .o-badge {
      display: inline-block;
      font-size: .37em;
      font-weight: 600;
      color: #93c5fd;
      background: rgba(59,130,246,.1);
      border: 1px solid rgba(59,130,246,.25);
      padding: .5em 1.3em;
      border-radius: 999px;
      margin-top: .45em;
    }

    /* ── Product slide ────────────────────────────────── */
    .o-product-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 38px;
    }
    .o-checklist            { display: flex; flex-direction: column; gap: 7px; }
    .o-checklist li {
      font-size: .43em;
      color: rgba(255,255,255,.7);
      padding-left: 1.3em;
      position: relative;
      line-height: 1.4;
    }
    .o-checklist li::before { content: "✓"; position: absolute; left: 0; color: var(--green); font-weight: 700; }
    .o-plan {
      background: var(--glass);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 11px 13px;
      margin-bottom: 7px;
      position: relative;
    }
    .o-plan--star            { background: rgba(59,130,246,.11); border-color: rgba(59,130,246,.4); }
    .o-plan-badge {
      position: absolute;
      top: -9px; right: 10px;
      font-size: .3em;
      font-weight: 700;
      background: var(--blue);
      color: #fff;
      padding: 2px 9px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .o-plan-name  { font-size: .36em; font-weight: 700; color: rgba(255,255,255,.33); text-transform: uppercase; letter-spacing: .06em; }
    .o-plan-price { font-size: .55em; font-weight: 800; color: #fff; margin: 3px 0; }
    .o-plan--star .o-plan-price { color: #93c5fd; }
    .o-plan-desc  { font-size: .35em; color: rgba(255,255,255,.38); }

    /* ── Complementos ─────────────────────────────────── */
    .o-comps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
      gap: 14px;
      margin-top: .55em;
    }
    .o-comp          { background: var(--glass); border: 1px solid var(--line); border-radius: 12px; padding: 18px 16px; }
    .o-comp-name     { font-size: .47em; font-weight: 700; margin-bottom: 3px; }
    .o-comp-tagline  { font-size: .37em; color: var(--muted); margin-bottom: .65em; }
    .o-comp-list     { display: flex; flex-direction: column; gap: 5px; margin-bottom: .55em; }
    .o-comp-list li  { font-size: .36em; color: rgba(255,255,255,.55); padding-left: 1em; position: relative; }
    .o-comp-list li::before { content: "→"; position: absolute; left: 0; color: var(--blue); }
    .o-comp-price    { font-size: .45em; font-weight: 800; color: var(--green); border-top: 1px solid var(--line); padding-top: .55em; }

    /* ── Proceso ──────────────────────────────────────── */
    .o-process {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: .55em;
    }
    .o-step {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      background: var(--glass);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 16px;
    }
    .o-step-num    { font-size: .82em; font-weight: 900; color: var(--blue); opacity: .65; min-width: 30px; line-height: 1; }
    .o-step h4     { font-size: .43em; font-weight: 700; margin-bottom: 4px; }
    .o-step p      { font-size: .37em; color: var(--muted); line-height: 1.5; margin: 0; }

    /* ── CTA ──────────────────────────────────────────── */
    .o-cta-title   { font-size: 1.6em; font-weight: 900; line-height: 1.07; margin-bottom: .45em; }
    .o-cta-sub     { font-size: .46em; color: rgba(255,255,255,.58); max-width: 460px; line-height: 1.65; margin-bottom: .75em; }
    .o-cta-btns    { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: .55em; }
    .o-btn {
      display: inline-block;
      padding: .65em 1.4em;
      border-radius: 10px;
      font-size: .47em;
      font-weight: 700;
      text-decoration: none;
      font-family: Aptos, "Segoe UI", Arial, sans-serif;
      transition: transform .15s, opacity .15s;
    }
    .o-btn:hover        { transform: translateY(-2px); opacity: .9; }
    .o-btn-primary      { background: var(--blue); color: #fff; }
    .o-btn-ghost        { background: rgba(255,255,255,.1); color: #fff; border: 1px solid rgba(255,255,255,.22); }
    .o-cta-contact      { font-size: .35em; color: rgba(255,255,255,.2); margin: 0; }
    .o-cta-note {
      font-size: .36em;
      background: rgba(255,255,255,.06);
      border-radius: 8px;
      padding: .6em .9em;
      color: rgba(255,255,255,.42);
      max-width: 460px;
      margin-top: .75em;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slides.join('\n')}
    </div>
  </div>
  <script src="https://unpkg.com/reveal.js@5.1.0/dist/reveal.js"></script>
  <script>
    Reveal.initialize({
      width: 1280,
      height: 720,
      margin: 0,
      minScale: 0.1,
      maxScale: 2.5,
      hash: true,
      transition: 'fade',
      transitionSpeed: 'default',
      backgroundTransition: 'fade',
      controls: true,
      controlsLayout: 'bottom-right',
      controlsTutorial: false,
      progress: true,
      slideNumber: 'c/t',
      center: false,
      fragments: true,
      keyboard: true,
    });
  </script>
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Uso: node scripts/genera-propuesta.js [opciones]

Opciones:
  <archivo.json>             JSON con datos del cliente
  --empresa="Nombre"         Nombre de la empresa cliente
  --industria="audiovisual"  Industria o rubro del cliente
  --necesidad="..."          Necesidad o problema del cliente
  --contacto="..."           Nombre del contacto principal
  --ciudad="..."             Ciudad del cliente
  --notas="..."              Notas adicionales
  --productos="id1,id2"      Forzar productos (dentalgest|gestios|web_landing|web_negocio|web_pro|consultoria)
  --output="ruta/archivo"    Ruta de salida personalizada

Ejemplos:
  node scripts/genera-propuesta.js --empresa="Epic Motion Group" --industria="audiovisual"
  node scripts/genera-propuesta.js data/cliente.json
`);
    process.exit(0);
  }

  const datos = parsearArgs(args);

  if (!datos.empresa) {
    console.error('Error: --empresa requerida');
    process.exit(1);
  }

  if (datos.productos) {
    datos.productos_forzados = datos.productos.split(',').map(s => s.trim());
    delete datos.productos;
  }

  const html = generarHTML(datos);

  const isVps = __dirname.includes('/.hermes/') || __dirname.includes('\\.hermes\\');
  const outputDir = isVps
    ? path.join(__dirname, '..', 'propuestas')
    : path.join(__dirname, '..', 'hermes-content', 'propuestas');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = datos.output
    ? path.resolve(datos.output)
    : path.join(outputDir, `propuesta-${slug(datos.empresa)}-${Date.now()}.html`);

  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✓ Propuesta generada: ${outputPath}`);
  console.log(`  Empresa: ${datos.empresa}`);
  console.log(`  Industria: ${datos.industria || datos.necesidad || 'sin especificar'}`);
  console.log(`  Slides: ${(html.match(/<section /g) || []).length}`);
}

main();
