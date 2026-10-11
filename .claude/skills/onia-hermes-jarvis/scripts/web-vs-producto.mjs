import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGINAS = ['home.txt', 'precios.txt', 'chatbot.txt', 'rubros.txt', 'contacto.txt', 'comparativa.txt', 'servicios-webs.txt', 'nosotros.txt', 'app-register-paso2.txt'];
const RUTAS = {
  'home.txt': '/', 'precios.txt': '/precios', 'chatbot.txt': '/chatbot',
  'rubros.txt': '/rubros', 'contacto.txt': '/contacto',
  'comparativa.txt': '/comparativa', 'servicios-webs.txt': '/servicios/webs',
  'nosotros.txt': '/nosotros', 'app-register-paso2.txt': '/register',
};

export const PROMESAS = [
  { id: 'whatsapp-24h', pagina: 'chatbot.txt', frase: /responde las 24 horas/i },
  { id: 'tratamiento-a-medias', pagina: 'rubros.txt', frase: /tratamiento a medias/i },
  { id: 'agente-incluido', pagina: 'precios.txt', frase: /Agente conversacional de WhatsApp incluido/i },
  { id: 'competidores', pagina: 'comparativa.txt', frase: /Dentiqa|Doctocliq/i },
  { id: 'webs-desde-2000', pagina: 'servicios-webs.txt', frase: /Bs\s*2\.000/i },
  { id: 'usuarios-extra', pagina: 'precios.txt', frase: /en Crece y Profesional, las que necesites/i },
  { id: 'demo-30-min', pagina: 'contacto.txt', frase: /30 MINUTOS/i },
  { id: 'registro-nombre', pagina: 'app-register-paso2.txt', frase: /Nombre de tu/i },
  { id: 'catalogo-contradictorio', pagina: 'ONIA_CATALOGO_DE_VENTA.md', manual: true },
];

const ADDON_EXTRACTORS = [
  ['Agente WhatsApp mensual', /entryMonthly\s*:\s*(\d[\d.]*)/],
  ['Agente WhatsApp anual', /annualTotal\s*:\s*(\d[\d.]*)/],
  ['Recarga 200 conversaciones', /precio\s*:\s*(\d[\d.]*)/],
  ['Reservas online', /BOOKING_ADDON_PRICE\s*=\s*\{[^}]*monthly\s*:\s*(\d[\d.]*)/s],
  ['Usuario extra', /EXTRA_USER_ADDON_PRICE\s*=\s*\{[^}]*monthly\s*:\s*(\d[\d.]*)/s],
  ['Implementación Grupo', /setupFrom\s*:\s*(\d[\d.]*)/],
];

function parseNumero(value) {
  return Number(value.replaceAll('.', ''));
}

function capturar(regex, texto, contexto) {
  const match = texto.match(regex);
  if (!match) throw new Error(`no se pudo leer ${contexto}`);
  return parseNumero(match[1]);
}

function extraerPlanes(source) {
  const block = source.match(/DEFAULT_PLAN_AMOUNTS\s*:[^{=]+(?:=\s*)?\{([\s\S]*?)\n\};?/);
  if (!block) throw new Error('no se pudo leer DEFAULT_PLAN_AMOUNTS');
  const plans = {};
  for (const [key, label] of [['basic', 'Básico'], ['crece', 'Crece'], ['professional', 'Profesional'], ['clinic', 'Completo'], ['enterprise', 'Grupo']]) {
    const entry = block[1].match(new RegExp(`\\b${key}\\s*:\\s*\\{([^}]+)\\}`));
    if (!entry) throw new Error(`no se pudo leer DEFAULT_PLAN_AMOUNTS.${key}`);
    plans[label] = {};
    for (const cycle of ['monthly', 'annual', 'weekly']) {
      const cycleMatch = entry[1].match(new RegExp(`\\b${cycle}\\s*:\\s*(\\d[\\d.]*)`));
      if (cycleMatch) plans[label][cycle] = parseNumero(cycleMatch[1]);
      else if (cycle !== 'weekly' && !(key === 'enterprise' && cycle === 'annual')) throw new Error(`no se pudo leer DEFAULT_PLAN_AMOUNTS.${key}.${cycle}`);
    }
  }
  return plans;
}

function extraerCodigo(platform) {
  const plansSource = platform.subscriptionPlans;
  const pricingSource = platform.pricing;
  const plans = extraerPlanes(plansSource);
  const addons = {};
  for (const [label, regex] of ADDON_EXTRACTORS) addons[label] = capturar(regex, pricingSource, `lib/pricing.ts (${label})`);
  return { plans, addons };
}

function encontrarPrecioPlan(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pos = text.search(new RegExp(`(?:^|\\n)${escaped}\\s*(?:\\n|$)`, 'i'));
  if (pos < 0) throw new Error(`no se pudo leer el precio web de ${label}`);
  const tail = text.slice(pos);
  const monthly = tail.match(/\n\s*(\d[\d.]*)\s*\n\s*Bs\s*\/\s*mes/i);
  if (!monthly) throw new Error(`no se pudo leer el precio mensual web de ${label}`);
  const annual = tail.match(/(\d[\d.]*)\s*Bs\s*\/\s*año/i);
  const weekly = tail.match(/(\d[\d.]*)\s*Bs\s*\/\s*sem/i);
  return { monthly: parseNumero(monthly[1]), ...(annual && { annual: parseNumero(annual[1]) }), ...(weekly && { weekly: parseNumero(weekly[1]) }) };
}

function buscarMonto(text, regex, contexto) {
  return capturar(regex, text, `precios.txt (${contexto})`);
}

function compararPrecios(pages, code) {
  const text = pages['precios.txt'];
  const diferencias = [];
  const pagePlans = { 'Básico': 'Básico', Crece: 'Crece', Profesional: 'Profesional', Completo: 'Completo' };
  for (const [webName, codeName] of Object.entries(pagePlans)) {
    const web = encontrarPrecioPlan(text, webName);
    for (const [cycle, cycleName] of [['monthly', 'mensual'], ['annual', 'anual'], ['weekly', 'semanal']]) {
      if (web[cycle] === undefined && code.plans[codeName][cycle] === undefined) continue;
      if (web[cycle] === undefined || code.plans[codeName][cycle] === undefined) throw new Error(`ciclo ${cycleName} incompleto para ${webName}`);
      if (web[cycle] !== code.plans[codeName][cycle]) diferencias.push(`${webName} · ${cycleName}: web ${web[cycle]}, código ${code.plans[codeName][cycle]}`);
    }
  }
  const grupoMonthly = buscarMonto(text, /(?:^|\n)\s*(\d[\d.]*)\s*Bs\s*\/\s*mes,\s*con implementación desde/i, 'Grupo mensual');
  if (grupoMonthly !== code.plans.Grupo.monthly) diferencias.push(`Grupo · mensual: web ${grupoMonthly}, código ${code.plans.Grupo.monthly}`);
  const webAddons = [
    ['Agente WhatsApp mensual', text, /ADD-ON\s*·\s*WHATSAPP[\s\S]*?\n\s*(\d[\d.]*)\s*\n\s*Bs\s*\/\s*mes/i],
    ['Agente WhatsApp anual', text, /O\s*Bs\s*(\d[\d.]*)\s*al\s*año/i],
    ['Recarga 200 conversaciones', pages['chatbot.txt'], /sumar\s+200\s+más\s+por\s+Bs\s*(\d[\d.]*)/i],
    ['Reservas online', text, /Reservas online\s*\n\s*Bs\s*(\d[\d.]*)\s*\/\s*mes/i],
    ['Usuario extra', text, /Usuario adicional\s*\n\s*Bs\s*(\d[\d.]*)\s*\/\s*mes/i],
    ['Implementación Grupo', text, /implementación\s+desde\s+(\d[\d.]*)\s+Bs/i],
  ];
  for (const [label, source, regex] of webAddons) {
    const webValue = buscarMonto(source, regex, label);
    if (webValue !== code.addons[label]) diferencias.push(`${label}: web ${webValue}, código ${code.addons[label]}`);
  }
  const tops = [
    ['Básico', /Topes:\s*300 fichas\s*·\s*2 usuarios[^\n]*·\s*200 recordatorios/i],
    ['Crece', /Topes:\s*800 fichas\s*·\s*4 usuarios\s*·\s*400 recordatorios/i],
    ['Profesional', /Topes:\s*1\.500 fichas\s*·\s*5 usuarios\s*·\s*800 recordatorios/i],
    ['Completo', /Fichas y usuarios sin tope[^\n]*recordatorios por email sin tope/i],
  ];
  for (const [plan, regex] of tops) if (!regex.test(text)) throw new Error(`no se pudo confirmar el texto de topes web de ${plan}`);
  return { diferencias, topes: tops.map(([plan]) => ({ plan, estado: 'web coincide con referencia manual §3.1' })) };
}

function detectarObra(pages) {
  const regex = /muy pronto|pr[óo]ximamente|en construcci[óo]n|\bbeta\b|\[CONFIRMAR/gi;
  const hallazgos = [];
  for (const [file, text] of Object.entries(pages)) {
    for (const [index, line] of text.split(/\r?\n/).entries()) {
      if (regex.test(line)) hallazgos.push({ archivo: file, linea: index + 1, texto: line.trim() });
      regex.lastIndex = 0;
    }
  }
  return hallazgos;
}

function evaluarPromesas(pages) {
  return PROMESAS.map((item) => item.manual
    ? { id: item.id, pagina: item.pagina, estado: 'manual' }
    : { id: item.id, pagina: item.pagina, estado: item.frase.test(pages[item.pagina] ?? '') ? 'sigue' : 'no está' });
}

export function auditar({ pages, platform }) {
  const code = extraerCodigo(platform);
  const priceResult = compararPrecios(pages, code);
  const obra = detectarObra(pages);
  const promesas = evaluarPromesas(pages);
  return { diferenciasPrecio: priceResult.diferencias, topes: priceResult.topes, obra, promesas, resumen: { diferenciasPrecio: priceResult.diferencias.length, textosObra: obra.length, promesasSiguen: promesas.filter((p) => p.estado === 'sigue').length, promesasNoEstan: promesas.filter((p) => p.estado === 'no está').length } };
}

export function auditarSeguro(input) {
  try {
    const data = auditar(input);
    return { data, codigoSalida: data.resumen.diferenciasPrecio || data.resumen.textosObra ? 1 : 0 };
  } catch (error) {
    return { data: { noMedido: [error.message] }, codigoSalida: 2 };
  }
}

export function htmlATexto(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<(?:br|hr)\b[^>]*>/gi, '\n')
    .replace(/<\/(?:p|div|section|article|li|h[1-6]|tr|header|footer|main|ul|ol)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').trim();
}

async function leerPaginas({ textoDir, base }) {
  const pages = {};
  for (const name of PAGINAS) {
    if (base) {
      const response = await fetch(new URL(RUTAS[name], base));
      if (!response.ok) throw new Error(`falló ${RUTAS[name]}: HTTP ${response.status}`);
      pages[name] = htmlATexto(await response.text());
    } else {
      if (!textoDir) throw new Error('indique --texto-dir o --base');
      pages[name] = await fs.readFile(path.join(textoDir, name), 'utf8');
    }
  }
  return pages;
}

async function main(argv) {
  const args = Object.fromEntries(argv.reduce((out, value, index) => {
    if (value.startsWith('--')) out.push([value.slice(2), argv[index + 1] && !argv[index + 1].startsWith('--') ? argv[index + 1] : true]);
    return out;
  }, []));
  let data;
  let failures = [];
  try {
    const pages = await leerPaginas({ textoDir: args['texto-dir'], base: args.base });
    const platformDir = args.platform ?? path.join(__dirname, 'fixtures', 'platform');
    let platform;
    try {
      const [subscriptionPlans, pricing] = await Promise.all([
        fs.readFile(path.join(platformDir, 'lib', 'subscription-plans.ts'), 'utf8'),
        fs.readFile(path.join(platformDir, 'lib', 'pricing.ts'), 'utf8'),
      ]);
      platform = { subscriptionPlans, pricing };
    } catch (error) { throw new Error(`NO MEDIDO: ${error.message}`); }
    const outcome = auditarSeguro({ pages, platform });
    if (outcome.codigoSalida === 2) throw new Error(`NO MEDIDO: ${outcome.data.noMedido.join('; ')}`);
    data = outcome.data;
  } catch (error) { failures.push(error.message); data = { noMedido: failures }; }
  const code = failures.length ? 2 : data.resumen.diferenciasPrecio || data.resumen.textosObra ? 1 : 0;
  if (args.json) console.log(JSON.stringify({ ...data, codigoSalida: code }, null, 2));
  else if (failures.length) console.log(`NO MEDIDO: ${failures.join('; ')}`);
  else {
    console.log('PRECIOS');
    console.log(data.diferenciasPrecio.length ? data.diferenciasPrecio.join('\n') : '0 diferencias de precio');
    for (const top of data.topes) console.log(`Tope ${top.plan}: ${top.estado}`);
    console.log('\nOBRA');
    console.log(data.obra.length ? data.obra.map((x) => `${x.archivo}:${x.linea}: ${x.texto}`).join('\n') : '0 textos de obra');
    console.log('\nPROMESAS');
    for (const p of data.promesas) console.log(`${p.id} · ${p.pagina}: ${p.estado}`);
    console.log(`\n${data.resumen.diferenciasPrecio} diferencias de precio · ${data.resumen.textosObra} textos de obra · ${data.resumen.promesasSiguen} promesas siguen · ${data.resumen.promesasNoEstan} no están`);
  }
  return code;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main(process.argv.slice(2));
