import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PAGINAS_WEB = ['home.txt', 'precios.txt', 'chatbot.txt', 'rubros.txt', 'contacto.txt', 'comparativa.txt', 'servicios-webs.txt', 'nosotros.txt'];
export const PAGINAS = [...PAGINAS_WEB, 'app-register-paso2.txt'];
const RUTAS = {
  'home.txt': '/', 'precios.txt': '/precios', 'chatbot.txt': '/chatbot',
  'rubros.txt': '/rubros', 'contacto.txt': '/contacto',
  'comparativa.txt': '/comparativa', 'servicios-webs.txt': '/servicios/webs',
  'nosotros.txt': '/nosotros',
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

const CICLOS = [['monthly', 'mensual'], ['annual', 'anual'], ['weekly', 'semanal']];
const PLANES = [['basic', 'Básico'], ['crece', 'Crece'], ['professional', 'Profesional'], ['clinic', 'Completo'], ['enterprise', 'Grupo']];
const TOPES_PLANES = [['basic', 'Básico'], ['crece', 'Crece'], ['professional', 'Profesional'], ['clinic', 'Completo']];

function errorMedicion(detalle) {
  return { detalle, bloqueaVerde: true };
}

function parseNumero(value) {
  return Number(value.replaceAll('.', ''));
}

function capturar(regex, texto, contexto) {
  const match = texto.match(regex);
  if (!match) throw new Error(`no se pudo leer ${contexto}`);
  const value = parseNumero(match[1]);
  if (!Number.isFinite(value)) throw new Error(`número inválido en ${contexto}`);
  return value;
}

function bloqueDe(source, nombre) {
  const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`export\\s+const\\s+${escaped}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as\\s+const\\s*;`));
  if (!match) throw new Error(`no se encontró ${nombre} en lib/pricing.ts`);
  return match[1];
}

function extraerPlanes(source) {
  const block = source.match(/DEFAULT_PLAN_AMOUNTS\s*:[^{=]+(?:=\s*)?\{([\s\S]*?)\n\};?/);
  if (!block) throw new Error('no se pudo leer DEFAULT_PLAN_AMOUNTS en lib/subscription-plans.ts');
  const plans = {};
  for (const [key, label] of PLANES) {
    const entry = block[1].match(new RegExp(`\\b${key}\\s*:\\s*\\{([^}]+)\\}`));
    if (!entry) throw new Error(`no se pudo leer DEFAULT_PLAN_AMOUNTS.${key}`);
    plans[key] = {};
    for (const [cycle] of CICLOS) {
      const cycleMatch = entry[1].match(new RegExp(`\\b${cycle}\\s*:\\s*(\\d[\\d.]*)`));
      if (cycleMatch) plans[key][cycle] = parseNumero(cycleMatch[1]);
      else if (cycle !== 'weekly' && !(key === 'enterprise' && cycle === 'annual')) throw new Error(`no se pudo leer DEFAULT_PLAN_AMOUNTS.${key}.${cycle}`);
    }
    plans[key].label = label;
  }
  return plans;
}

function extraerLimites(source) {
  const start = source.indexOf('export const PLAN_LIMITS');
  if (start < 0) throw new Error('no se encontró PLAN_LIMITS en lib/plan-catalogo.ts');
  const bodyStart = source.indexOf('{', start);
  const end = source.indexOf('\n};', bodyStart);
  if (bodyStart < 0 || end < 0) throw new Error('no se pudo delimitar PLAN_LIMITS en lib/plan-catalogo.ts');
  const block = source.slice(bodyStart + 1, end);
  const limits = {};
  for (const [key] of TOPES_PLANES) {
    const entry = block.match(new RegExp(`^\\s{2}${key}\\s*:\\s*\\{([^{}]*)\\}`, 'm'));
    if (!entry) throw new Error(`no se pudo leer PLAN_LIMITS.${key}`);
    const fields = {};
    for (const field of ['patients', 'users', 'emailsPerMonth']) {
      const value = entry[1].match(new RegExp(`\\b${field}\\s*:\\s*(-?\\d+)`));
      if (!value) throw new Error(`no se pudo leer PLAN_LIMITS.${key}.${field}`);
      fields[field] = Number(value[1]);
    }
    limits[key] = fields;
  }
  return limits;
}

function extraerAddons(source, noMedido) {
  const extractors = [
    ['Agente WhatsApp mensual', 'WHATSAPP_ADDON', /\bentryMonthly\s*:\s*(\d[\d.]*)/],
    ['Agente WhatsApp anual', 'WHATSAPP_ADDON', /\bannualTotal\s*:\s*(\d[\d.]*)/],
    ['Recarga 200 conversaciones', 'RECARGA_CONVERSACIONES', /\bprecio\s*:\s*(\d[\d.]*)/],
    ['Reservas online', 'BOOKING_ADDON_PRICE', /\bmonthly\s*:\s*(\d[\d.]*)/],
    ['Usuario extra', 'EXTRA_USER_ADDON_PRICE', /\bmonthly\s*:\s*(\d[\d.]*)/],
    ['Implementación Grupo', 'ENTERPRISE_PLAN_PRICE', /\bsetupFrom\s*:\s*(\d[\d.]*)/],
  ];
  const addons = {};
  for (const [label, constant, regex] of extractors) {
    try {
      addons[label] = capturar(regex, bloqueDe(source, constant), `${constant} (${label})`);
    } catch (error) { noMedido.push(errorMedicion(error.message)); }
  }
  return addons;
}

function parseCicloWeb(text, plan) {
  const escaped = plan.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pos = text.search(new RegExp(`(?:^|\\n)${escaped}\\s*(?:\\n|$)`, 'i'));
  if (pos < 0) throw new Error(`no se pudo ubicar el plan ${plan} en precios.txt`);
  const tail = text.slice(pos);
  const monthly = tail.match(/\n\s*(\d[\d.]*)\s*\n\s*Bs\s*\/\s*mes/i);
  if (!monthly) throw new Error(`no se pudo leer el precio mensual de ${plan} en precios.txt`);
  const annual = tail.match(/(\d[\d.]*)\s*Bs\s*\/\s*año/i);
  const weekly = tail.match(/(\d[\d.]*)\s*Bs\s*\/\s*sem/i);
  return { monthly: parseNumero(monthly[1]), ...(annual && { annual: parseNumero(annual[1]) }), ...(weekly && { weekly: parseNumero(weekly[1]) }) };
}

function seccionPlan(text, name) {
  const match = new RegExp(`(?:^|\\n)${name}\\s*(?:\\n|$)`, 'i').exec(text);
  if (!match) throw new Error(`no se pudo ubicar el plan ${name} en precios.txt`);
  const start = match.index + match[0].length;
  const next = /\n(?:Básico|Crece|Profesional|Completo)\s*\n/.exec(text.slice(start));
  return text.slice(start, next ? start + next.index : undefined);
}

function extraerTopesWeb(text, plan) {
  const section = seccionPlan(text, plan);
  if (plan === 'Completo') {
    if (!/Fichas y usuarios sin tope/i.test(section) || !/recordatorios por email sin tope/i.test(section)) throw new Error('no se pudo leer los topes de Completo en precios.txt');
    return { patients: -1, users: -1, emailsPerMonth: -1 };
  }
  const line = section.match(/Topes:\s*([\d.]+)\s*fichas\s*·\s*([\d.]+)\s*usuarios\b[^\n]*?·\s*([\d.]+)\s*recordatorios/i);
  if (!line) throw new Error(`no se pudo leer la línea Topes de ${plan} en precios.txt`);
  return { patients: parseNumero(line[1]), users: parseNumero(line[2]), emailsPerMonth: parseNumero(line[3]) };
}

function extraerPreciosWeb(pages, noMedido) {
  const text = pages['precios.txt'];
  if (text === undefined) noMedido.push(errorMedicion('precios.txt — no disponible'));
  const plans = {};
  const addons = {};
  if (text !== undefined) {
    for (const [, label] of PLANES.filter(([key]) => key !== 'enterprise')) {
      try { plans[label] = parseCicloWeb(text, label); }
      catch (error) { noMedido.push(errorMedicion(error.message)); }
    }
    try { plans['Grupo'] = { monthly: capturar(/(?:^|\n)\s*(\d[\d.]*)\s*Bs\s*\/\s*mes,\s*con implementación desde/i, text, 'Grupo mensual en precios.txt') }; }
    catch (error) { noMedido.push(errorMedicion(error.message)); }
  }
  const extractors = [
    ['Agente WhatsApp mensual', text, /ADD-ON\s*·\s*WHATSAPP[\s\S]*?\n\s*(\d[\d.]*)\s*\n\s*Bs\s*\/\s*mes/i],
    ['Agente WhatsApp anual', text, /O\s*Bs\s*(\d[\d.]*)\s*al\s*año/i],
    ['Recarga 200 conversaciones', pages['chatbot.txt'], /sumar\s+200\s+más\s+por\s+Bs\s*(\d[\d.]*)/i],
    ['Reservas online', text, /Reservas online\s*\n\s*Bs\s*(\d[\d.]*)\s*\/\s*mes/i],
    ['Usuario extra', text, /Usuario adicional\s*\n\s*Bs\s*(\d[\d.]*)\s*\/\s*mes/i],
    ['Implementación Grupo', text, /implementación\s+desde\s+(\d[\d.]*)\s+Bs/i],
  ];
  for (const [label, source, regex] of extractors) {
    if (source === undefined) { noMedido.push(errorMedicion(`${label} — falta el texto de su página`)); continue; }
    try { addons[label] = capturar(regex, source, `${label} en texto web`); }
    catch (error) { noMedido.push(errorMedicion(error.message)); }
  }
  return { plans, addons };
}

function compararPrecios(web, code, noMedido, codigoDisponible) {
  const diferencias = [];
  for (const [key, label] of PLANES) {
    const webPlan = web.plans[label];
    const codePlan = code.plans?.[key];
    if (!webPlan) continue;
    if (!codePlan) {
      if (codigoDisponible) noMedido.push(errorMedicion(`DEFAULT_PLAN_AMOUNTS.${key} — no disponible`));
      continue;
    }
    for (const [cycle, cycleName] of CICLOS) {
      // Grupo cobra el anual, pero la web dice expresamente que no se vende en línea.
      if (key === 'enterprise' && cycle === 'annual') continue;
      if (webPlan[cycle] === undefined && codePlan[cycle] === undefined) continue;
      if (webPlan[cycle] === undefined || codePlan[cycle] === undefined) {
        noMedido.push(errorMedicion(`${label} · ${cycleName} — ciclo incompleto`));
      } else if (webPlan[cycle] !== codePlan[cycle]) diferencias.push(`${label} · ${cycleName}: web ${webPlan[cycle]}, código ${codePlan[cycle]}`);
    }
  }
  for (const label of ['Agente WhatsApp mensual', 'Agente WhatsApp anual', 'Recarga 200 conversaciones', 'Reservas online', 'Usuario extra', 'Implementación Grupo']) {
    if (web.addons[label] === undefined) continue;
    if (code.addons?.[label] === undefined) {
      if (codigoDisponible) noMedido.push(errorMedicion(`${label} en lib/pricing.ts — no disponible`));
      continue;
    }
    if (web.addons[label] !== code.addons[label]) diferencias.push(`${label}: web ${web.addons[label]}, código ${code.addons[label]}`);
  }
  return diferencias;
}

function compararTopes(pages, limits, noMedido, codigoDisponible) {
  const text = pages['precios.txt'];
  const resultados = [];
  for (const [key, label] of TOPES_PLANES) {
    let web;
    let code = limits?.[key];
    if (text === undefined) noMedido.push(errorMedicion(`Tope ${label}: precios.txt — no disponible`));
    else {
      try { web = extraerTopesWeb(text, label); }
      catch (error) { noMedido.push(errorMedicion(`Tope ${label}: ${error.message}`)); }
    }
    if (!code && codigoDisponible) noMedido.push(errorMedicion(`Tope ${label}: PLAN_LIMITS.${key} — no disponible`));
    if (!web || !code) resultados.push({ plan: label, estado: 'no medida' });
    else {
      const vals = (x) => `${x.patients}/${x.users}/${x.emailsPerMonth}`;
      const coincide = web.patients === code.patients && web.users === code.users && web.emailsPerMonth === code.emailsPerMonth;
      resultados.push({ plan: label, web: vals(web), codigo: vals(code), estado: coincide ? 'coincide' : 'DIFIERE' });
    }
  }
  return resultados;
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

function evaluarPromesas(pages, noMedido, registroSoloInformativo = false) {
  return PROMESAS.map((item) => {
    if (item.manual) return { id: item.id, pagina: item.pagina, estado: 'manual' };
    if (item.id === 'registro-nombre' && registroSoloInformativo) return { id: item.id, pagina: item.pagina, estado: 'no medible sin navegador' };
    if (pages[item.pagina] === undefined) return { id: item.id, pagina: item.pagina, estado: 'no medida' };
    return { id: item.id, pagina: item.pagina, estado: item.frase.test(pages[item.pagina]) ? 'sigue' : 'no está' };
  });
}

export function auditar({ pages = {}, platform, noMedidoInicial = [], registroSoloInformativo = false }) {
  const noMedido = [...noMedidoInicial];
  const codigoDisponible = Boolean(platform);
  let plans;
  let addons = {};
  let limits;
  if (!platform) {
    if (!noMedido.some((item) => item.detalle.startsWith('falta --platform'))) noMedido.push(errorMedicion('falta --platform <carpeta con lib/pricing.ts, lib/subscription-plans.ts y lib/plan-catalogo.ts>'));
  } else {
    try {
      if (platform.subscriptionPlans === undefined) throw new Error('no se pudo leer lib/subscription-plans.ts');
      plans = extraerPlanes(platform.subscriptionPlans);
    }
    catch (error) { noMedido.push(errorMedicion(error.message)); }
    if (platform.pricing === undefined) noMedido.push(errorMedicion('no se pudo leer lib/pricing.ts'));
    else addons = extraerAddons(platform.pricing, noMedido);
    try {
      if (platform.planCatalogo === undefined) throw new Error('no se pudo leer lib/plan-catalogo.ts');
      limits = extraerLimites(platform.planCatalogo);
    }
    catch (error) { noMedido.push(errorMedicion(error.message)); }
  }
  const web = extraerPreciosWeb(pages, noMedido);
  const diferenciasPrecio = compararPrecios(web, { plans, addons }, noMedido, codigoDisponible);
  const topes = compararTopes(pages, limits, noMedido, codigoDisponible);
  const obra = detectarObra(pages);
  const promesas = evaluarPromesas(pages, noMedido, registroSoloInformativo);
  const textosObra = obra.length;
  const evidencia = diferenciasPrecio.length > 0 || textosObra > 0 || topes.some((tope) => tope.estado === 'DIFIERE');
  const pendientesBloqueantes = noMedido.filter((item) => item.bloqueaVerde).length;
  const codigoSalida = evidencia ? 1 : pendientesBloqueantes ? 2 : 0;
  return {
    diferenciasPrecio, topes, obra, promesas, noMedido,
    resumen: {
      diferenciasPrecio: diferenciasPrecio.length,
      textosObra,
      promesasSiguen: promesas.filter((p) => p.estado === 'sigue').length,
      promesasNoEstan: promesas.filter((p) => p.estado === 'no está').length,
      pendientesBloqueantes,
    },
    codigoSalida,
  };
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
    .replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n')
    .replace(/^[ \t]+/gm, '').trim();
}

async function leerTextoDir(textoDir) {
  const pages = {};
  const noMedido = [];
  await Promise.all(PAGINAS.map(async (name) => {
    try { pages[name] = await fs.readFile(path.join(textoDir, name), 'utf8'); }
    catch (error) { noMedido.push(errorMedicion(`${name} — ${error.code === 'ENOENT' ? 'archivo ausente' : error.message}`)); }
  }));
  return { pages, noMedido, registroSoloInformativo: false };
}

export async function leerPaginasVivas(baseWeb, { timeoutMs = Number(process.env.WVP_TIMEOUT_MS) || 20000, fetchImpl = fetch } = {}) {
  const pages = {};
  const noMedido = [];
  await Promise.all(PAGINAS_WEB.map(async (name) => {
    const route = RUTAS[name];
    try {
      const response = await fetchImpl(new URL(route, baseWeb), { signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      pages[name] = htmlATexto(await response.text());
    } catch (error) {
      const motivo = error.name === 'TimeoutError' || error.name === 'AbortError' ? 'tiempo agotado' : error.message;
      noMedido.push(errorMedicion(`${route} — ${motivo}`));
    }
  }));
  noMedido.push({ detalle: 'registro-nombre: no medible sin navegador (usar --texto-dir)', bloqueaVerde: false });
  return { pages, noMedido, registroSoloInformativo: true };
}

async function leerPlatform(platformDir) {
  if (!platformDir) throw new Error('falta --platform <carpeta con lib/pricing.ts, lib/subscription-plans.ts y lib/plan-catalogo.ts>');
  const lib = path.join(platformDir, 'lib');
  const noMedido = [];
  const read = async (file) => {
    try { return await fs.readFile(path.join(lib, file), 'utf8'); }
    catch (error) {
      noMedido.push(errorMedicion(`no se pudo leer lib/${file}: ${error.code === 'ENOENT' ? 'archivo ausente' : error.message}`));
      return undefined;
    }
  };
  const [pricing, subscriptionPlans, planCatalogo] = await Promise.all([
    read('pricing.ts'), read('subscription-plans.ts'), read('plan-catalogo.ts'),
  ]);
  return { platform: { pricing, subscriptionPlans, planCatalogo }, noMedido };
}

function argumentos(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) throw new Error(`argumento inesperado: ${key}`);
    if (key === '--json') { args.json = true; continue; }
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`falta valor para ${key}`);
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

export async function ejecutar(argv) {
  let args;
  let pages = {};
  let noMedido = [];
  let registroSoloInformativo = false;
  try { args = argumentos(argv); }
  catch (error) {
    return { diferenciasPrecio: [], topes: [], obra: [], promesas: [], noMedido: [errorMedicion(error.message)], resumen: { diferenciasPrecio: 0, textosObra: 0, promesasSiguen: 0, promesasNoEstan: 0, pendientesBloqueantes: 1 }, codigoSalida: 2 };
  }

  try {
    if (args['texto-dir'] && (args['base-web'] || args['base-app'])) throw new Error('--texto-dir y --base-web/--base-app son modos separados');
    if (args['texto-dir']) ({ pages, noMedido, registroSoloInformativo } = await leerTextoDir(args['texto-dir']));
    else if (args['base-web']) ({ pages, noMedido, registroSoloInformativo } = await leerPaginasVivas(args['base-web']));
    else noMedido.push(errorMedicion('indique --texto-dir <carpeta> o --base-web <url>'));
  } catch (error) { noMedido.push(errorMedicion(error.message)); }

  let platform;
  try {
    const loaded = await leerPlatform(args.platform);
    platform = loaded.platform;
    noMedido.push(...loaded.noMedido);
  }
  catch (error) { noMedido.push(errorMedicion(error.message)); }
  const data = auditar({ pages, platform, noMedidoInicial: noMedido, registroSoloInformativo });
  return data;
}

function imprimir(data, json) {
  if (json) { console.log(JSON.stringify(data, null, 2)); return; }
  console.log('PRECIOS');
  console.log(data.diferenciasPrecio.length ? data.diferenciasPrecio.join('\n') : data.resumen.pendientesBloqueantes ? 'precios no medidos por completo' : '0 diferencias de precio');
  for (const top of data.topes) console.log(`Tope ${top.plan}: web ${top.web ?? '—'}, código ${top.codigo ?? '—'} → ${top.estado}`);
  console.log('\nOBRA');
  console.log(data.obra.length ? data.obra.map((x) => `${x.archivo}:${x.linea}: ${x.texto}`).join('\n') : data.resumen.pendientesBloqueantes ? 'obra medida en las páginas disponibles' : '0 textos de obra');
  console.log('\nPROMESAS');
  for (const promise of data.promesas) console.log(`${promise.id} · ${promise.pagina}: ${promise.estado}`);
  for (const item of data.noMedido) console.log(`NO MEDIDO: ${item.detalle}${item.bloqueaVerde ? '' : ' (informativo; no cambia el exit)'}`);
  console.log(`\n${data.resumen.diferenciasPrecio} diferencias de precio · ${data.resumen.textosObra} textos de obra · ${data.resumen.promesasSiguen} promesas siguen · ${data.resumen.promesasNoEstan} no están`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = await ejecutar(process.argv.slice(2));
  imprimir(data, process.argv.includes('--json'));
  process.exitCode = data.codigoSalida;
}
