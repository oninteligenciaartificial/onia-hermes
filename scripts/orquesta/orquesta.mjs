#!/usr/bin/env node
// Orquestador de ONIA. Un programa fijo reparte; los modelos solo trabajan.
//
// Cola: GitHub Issues de `repo_cola` con label `orquesta` + `carril:<nombre>`.
// Por cada carril toma la tarea abierta más vieja, elige motor y modelo según
// carriles.json y el `nivel:` del pedido, corre el agente en un worktree aislado,
// comprueba el "hecho" (archivo de salida + check opcional) y deja rama, PR y un
// comentario en el issue. Lo que falla queda con label `bloqueada` y el motivo.
//
// Uso:
//   node scripts/orquesta/orquesta.mjs                una pasada (1 tarea por carril)
//   node scripts/orquesta/orquesta.mjs --dry          qué correría y con qué modelo
//   node scripts/orquesta/orquesta.mjs --carril marca solo ese carril
//   ORQUESTA_TELEGRAM=1 ...                           manda el resumen al Telegram de Hermes
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
// El mismo programa corre en la PC y en GitHub Actions: allá los repos viven en ORQUESTA_RAIZ, el trabajo
// en ORQUESTA_TRABAJO, y no hay carpetas de la PC (dirs_extra).
export function ajustarAlEntorno(conf, env) {
  const raiz = env.ORQUESTA_RAIZ;
  const carriles = Object.fromEntries(Object.entries(conf.carriles).map(([k, c]) => [k,
    raiz ? { ...c, repo: path.join(raiz, path.posix.basename(c.repo)), dirs_extra: [] } : c]));
  return { ...conf, carpeta_trabajo: env.ORQUESTA_TRABAJO || conf.carpeta_trabajo, carriles };
}

export const CONF = ajustarAlEntorno(JSON.parse(fs.readFileSync(path.join(AQUI, 'carriles.json'), 'utf8')), process.env);
const ESTADO = path.join(os.homedir(), '.onia-orquesta');
const NIVELES = ['rapido', 'normal', 'profundo'];
const CAMPOS = /^(nivel|motor|modelo|salida|check|base|ok|donde)\s*:\s*(.+)$/i;

// ---------- lógica pura (probada en orquesta.test.mjs) ----------

export function leerPedido(body = '') {
  const campos = {};
  const lineas = body.replace(/\r/g, '').split('\n');
  let i = 0;
  for (; i < lineas.length; i++) {
    if (!lineas[i].trim() && !Object.keys(campos).length) continue;
    const m = lineas[i].match(CAMPOS);
    if (!m) break;
    campos[m[1].toLowerCase()] = m[2].trim();
  }
  return { ...campos, pedido: lineas.slice(i).join('\n').trim() };
}

const nombresDe = (issue) => (issue.labels || []).map((l) => l.name || l);

export function carrilDe(issue) {
  const l = nombresDe(issue).find((n) => n.startsWith('carril:'));
  return l ? l.slice('carril:'.length) : null;
}

// Dónde corre la tarea: `donde:` del pedido, o el del carril. Lo que pide sesiones o archivos de Sergio
// Urcullo es «pc» (su regla de credenciales); el resto puede ir a la nube (GitHub Actions con su Max).
export function dondeDe(issue, conf = CONF) {
  const pedido = leerPedido(issue.body).donde;
  return ['pc', 'nube'].includes(pedido) ? pedido : conf.carriles[carrilDe(issue)]?.donde || 'pc';
}

export function elegirTareas(issues, conf = CONF, soloCarril = null) {
  // `necesita-ok`: lo pone Hermes (scripts/loops/orquesta-hermes.sh) a lo que publica, gasta, contacta,
  // toca producción o mergea; arranca recién cuando Sergio Urcullo le saca el label.
  const frenadas = new Set(['en-curso', 'bloqueada', 'espera-ok', 'necesita-ok']);
  const porCarril = {};
  const orden = [...issues].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const it of orden) {
    const carril = carrilDe(it);
    if (!carril || !conf.carriles[carril]) continue;
    if (soloCarril && carril !== soloCarril) continue;
    if (!conf.autores.includes(it.author?.login)) continue; // la cola solo acepta pedidos del dueño
    if (nombresDe(it).some((n) => frenadas.has(n))) continue;
    // Lo que salió por silencio salió como nivel B: si después alguien editó el cuerpo (donde: pc, check: cmd, ok:…), ya no.
    if (nombresDe(it).includes('salio-por-silencio') && !nivelBDe(it, conf)) continue;
    porCarril[carril] ??= it;
  }
  return Object.entries(porCarril).map(([carril, issue]) => ({ carril, issue }));
}

export function rutear(carril, pedido, conf = CONF) {
  const c = conf.carriles[carril];
  const nivel = NIVELES.includes(pedido.nivel) ? pedido.nivel : 'normal';
  const motor = ['claude', 'codex'].includes(pedido.motor) ? pedido.motor : c.motor;
  const tabla = motor === c.motor ? c.modelos : Object.values(conf.carriles).find((x) => x.motor === motor).modelos;
  return { motor, nivel, modelo: pedido.modelo || tabla[nivel] };
}

// Un juez LLM favorece lo que generó el mismo modelo: si el trabajador usó el revisor de siempre, revisa el alterno.
// Se compara por familia: un `modelo:` escrito a mano («sonnet», «claude-sonnet-5-5[1m]») sigue siendo Sonnet.
const familia = (m) => (/haiku|sonnet|opus|fable/i.exec(String(m)) || [String(m)])[0].toLowerCase();
// En orden: el primero que no sea de la familia del trabajador; los demás, por si ese se queda sin cupo.
export function revisoresPara(modeloTrabajador, conf = CONF) {
  const todos = [conf.revisor, conf.revisor_alterno, conf.revisor_respaldo].filter(Boolean);
  return todos.filter((m) => familia(m) !== familia(modeloTrabajador));
}

export function rutaSalida(c, pedido, numero) {
  const s = (pedido.salida || `${c.salida}/${numero}.md`).replace(/\\/g, '/');
  if (path.isAbsolute(s) || /^[a-z]:/i.test(s) || s.split('/').includes('..')) throw new Error(`salida inválida: ${s}`);
  return s;
}

// `base:` en el pedido: trabajar sobre otra rama (p. ej. la de un PR) y entregar el PR contra ella.
export function baseDe(c, pedido) {
  const b = pedido.base || c.base;
  if (!/^\w[\w./-]*$/.test(b) || b.includes('..')) throw new Error(`base inválida: ${b}`);
  return b;
}

// El hilo del issue es la conversación con Sergio Urcullo, y los dos escriben desde la MISMA cuenta.
// El orquestador firma con una marca invisible que dice cuántos comentarios había visto al empezar:
// lo que Sergio escribió mientras la tarea trabajaba cuenta como respuesta a esa entrega.
const MARCA = /^<!-- orquesta(?: vistos:(\d+))? -->\s*/;
const FIRMAS = /^(✅ Hecho|✅ Aprobada|⛔ No se cerró|👀 Listo para tu OK)/u; // comentarios de antes de la marca
export const firmar = (vistos, texto) => `<!-- orquesta vistos:${vistos} -->\n${texto}`;

export function leerHilo(issue, conf = CONF) {
  const cs = (issue.comments || []).map((x, i) => {
    const crudo = String(x.body || '').trim();
    const m = crudo.match(MARCA);
    const body = crudo.replace(MARCA, '');
    const orq = Boolean(m) || FIRMAS.test(body);
    return { i, body, orq, autor: x.author?.login, vistos: m?.[1] != null ? Number(m[1]) : i + 1, entrega: orq && /^(✅ Hecho|👀 Listo)/u.test(body) };
  });
  // Las indicaciones mandan sobre el pedido: solo valen las del dueño de la cola, como los issues.
  const deSergio = cs.filter((c) => !c.orq && c.body && conf.autores.includes(c.autor));
  const ultimaEntrega = cs.findLast((c) => c.entrega);
  const ultimoOrq = cs.findLast((c) => c.orq);
  const ultimoSergio = deSergio.at(-1);
  const fallas = cs.filter((c) => c.orq && c.body.startsWith('⛔') && c.i > Math.max(ultimaEntrega?.i ?? -1, ultimoSergio?.i ?? -1));
  const primeraOrq = cs.find((c) => c.orq)?.i ?? Infinity; // el primer comentario firmado marca el momento en que se decidió la opción
  return {
    deSergio: deSergio.map((c) => c.body), // todos, del más viejo al más nuevo: las respuestas a las opciones (silencioVencido)
    antesDeLaOrquesta: deSergio.filter((c) => c.i < primeraOrq).map((c) => c.body),
    despuesDeLaOrquesta: deSergio.filter((c) => c.i > primeraOrq).map((c) => c.body),
    indicaciones: deSergio.filter((c) => c.i >= (ultimaEntrega?.vistos ?? 0)).map((c) => c.body),
    fallasSeguidas: fallas.length, // una indicación nueva de Sergio Urcullo vuelve a cero
    motivo: fallas.at(-1)?.body.match(/^Motivo: (.+)$/m)?.[1] ?? null, // reintentar sin el motivo repite el error
    respuesta: ultimoOrq && ultimoSergio && ultimoSergio.i >= ultimoOrq.vistos ? ultimoSergio.body : null,
  };
}

export const motivoAnterior = (issue) => leerHilo(issue).motivo;

// Aprueba solo un mensaje hecho entero de palabras de aprobación: «Me gusta, agregá el precio» es una indicación.
const PALABRAS_OK = new Set(['ok', 'okey', 'okay', 'sí', 'si', 'dale', 'listo', 'aprobado', 'aprobada', 'perfecto', 'bien',
  'genial', 'excelente', 'me', 'gusta', 'gustó', 'gusto', 'encanta', 'encantó', 'continúa', 'continua', 'seguí', 'segui',
  'sigue', 'adelante', 'muy', 'todo', 'está', 'esta', '👍']);
export function esOk(texto) {
  const palabras = texto.trim().toLowerCase().split(/[\s,.;:!¡?¿]+/u).filter(Boolean);
  return palabras.length > 0 && palabras.every((p) => PALABRAS_OK.has(p));
}

const primeraPalabra = (t) => String(t).trim().match(/^[\p{L}\p{N}_]+/u)?.[0].toLowerCase();
const esNo = (t) => primeraPalabra(t) === 'no';

// Qué hacer con un issue frenado al que Sergio Urcullo le contestó: «ok» lo cierra, cualquier otra cosa lo hace seguir.
// Salvo un «no» a lo que ya salió por silencio: eso se vuelve a frenar (necesita-ok y frenada), no sigue.
export function decidirRespuesta(issue) {
  const labels = nombresDe(issue);
  const { respuesta } = leerHilo(issue);
  if (!respuesta) return null;
  const frenada = labels.includes('espera-ok') || labels.includes('bloqueada');
  if (frenada && labels.includes('salio-por-silencio') && esNo(respuesta)) return 'frenar';
  if (labels.includes('espera-ok')) return esOk(respuesta) ? 'cerrar' : 'seguir';
  if (labels.includes('bloqueada')) return 'seguir';
  return null;
}

// ---------- la recomendada por silencio (Sergio Urcullo, 27-oct-2026) ----------
// Hermes de la PC le da opciones, con una recomendada. Si no contesta en `silencio_horas` (6 como mínimo), sale la
// recomendada, SOLO en el nivel B, y queda medido con el label `salio-por-silencio` (--silencio-informe). Fuera del
// nivel B no hay silencio nunca: corre cuando él saca `necesita-ok`. AGENTS.md §1.
export const MIN_SILENCIO_HORAS = 6;
const CARRILES_SIN_SILENCIO = ['plataforma', 'video'];
const LIBERAR = ['necesita-ok', 'ok-por-silencio'];

export function horasDeSilencio(conf = CONF) {
  const h = conf.silencio_horas;
  if (!Number.isFinite(h) || h < MIN_SILENCIO_HORAS) {
    throw new Error(`silencio_horas inválido (${h}): tiene que ser un número de ${MIN_SILENCIO_HORAS} o más (Sergio Urcullo, 27-oct-2026)`);
  }
  return h;
}

// Nivel B: TODO junto. Lo calcula el código con los campos del pedido; Hermes no lo elige. Nada que ver con `nivel:`
// del pedido (rapido|normal|profundo), que solo elige el modelo. `check === 'urls'` y no «no empieza con cmd»: un
// pedido escrito a mano sin check, o con uno raro, tampoco sale por silencio. Cualquier línea `ok:` (no solo «sergio»:
// «Sergio» en mayúscula también) lo saca del nivel B.
export function esNivelB({ carril, donde, check, ok }, conf = CONF) {
  return Boolean(conf.carriles[carril]) && !CARRILES_SIN_SILENCIO.includes(carril)
    && donde === 'nube' && check === 'urls' && ok == null;
}

// El nivel B de un issue, con el cuerpo de AHORA (no el de cuando se cargó): se recalcula al soltarlo y al correrlo.
function nivelBDe(issue, conf) {
  const pedido = leerPedido(issue.body);
  return esNivelB({ carril: carrilDe(issue), donde: dondeDe(issue, conf), check: pedido.check, ok: pedido.ok }, conf);
}

// «## Opciones» con 2 o 3 renglones «- A: …», «- B: …» y exactamente UNO que termina en «(recomendada)».
const RENGLON_OPCION = /^\s*[-*]\s*([A-Z])\s*:\s*(.*?)\s*$/;
const RECOMENDADA = /\(recomendada\)\s*$/i;
export function opcionesDe(texto = '') {
  const malo = (motivo) => ({ ok: false, motivo: `la sección «## Opciones» ${motivo}` });
  const lineas = String(texto).replace(/\r/g, '').split('\n');
  let i = lineas.findIndex((l) => /^##\s+Opciones\s*$/i.test(l.trim())) + 1;
  if (i === 0) return malo('falta: va como «## Opciones» y renglones «- A: …», «- B: …», una «(recomendada)»');
  while (i < lineas.length && !lineas[i].trim()) i++;
  const opciones = [];
  for (let m; i < lineas.length && (m = lineas[i].match(RENGLON_OPCION)); i++) {
    opciones.push({ letra: m[1], texto: m[2].replace(RECOMENDADA, '').trim(), recomendada: RECOMENDADA.test(m[2]) });
  }
  if (opciones.length < 2 || opciones.length > 3) return malo(`tiene que traer 2 o 3 renglones «- A: …» (hay ${opciones.length})`);
  if (opciones.some((o, k) => o.letra !== 'ABC'[k])) return malo('va con las letras A, B (y C) en orden');
  if (opciones.some((o) => !o.texto)) return malo('tiene una opción sin texto');
  const reco = opciones.filter((o) => o.recomendada);
  if (reco.length !== 1) return malo(`tiene que marcar UNA sola opción con «(recomendada)» al final (hay ${reco.length})`);
  return { ok: true, opciones, recomendada: reco[0].letra };
}

// «b», «B: pero más corto», «a, y agregá el precio»: la letra va primero, sola o con texto. «no» frena. Un mensaje
// hecho solo de palabras de aprobación («ok», «dale», «sí»: esOk) es aceptar la recomendada.
// shortcut: un «a» suelto seguido de texto («a ver…») se lee como la opción A; upgrade si Sergio Urcullo lo sufre.
function decisionDe(texto, letras) {
  if (esNo(texto)) return { no: true };
  const w = primeraPalabra(texto);
  if (w?.length === 1 && letras.includes(w.toUpperCase())) return { letra: w.toUpperCase() };
  return esOk(String(texto)) ? { ok: true } : null;
}

// Lo último que decidió Sergio Urcullo con una letra, «no» u «ok» (un comentario neutro después no lo borra) y si
// escribió algo. Valen los de un autor de carriles.json, no los del orquestador, un bot ni otra cuenta: leerHilo.
// shortcut: Hermes y Sergio Urcullo comparten cuenta de GitHub; un comentario de Hermes por esa cuenta pasa por suyo.
function respuestaA(issue, letras, conf) {
  const suyos = leerHilo(issue, conf).deSergio;
  return { decision: suyos.map((t) => decisionDe(t, letras)).findLast(Boolean) ?? null, escribio: suyos.length > 0 };
}

// Qué hacer con un issue con `necesita-ok` y `ok-por-silencio`: null (nada) o { accion, letra?, quitar, poner, comentario }.
// Se recalcula TODO acá (nivel B, opciones, autor): una etiqueta puesta a mano no basta.
export function silencioVencido(issue, ahora, conf = CONF) {
  const horas = horasDeSilencio(conf);
  const labels = nombresDe(issue);
  if (LIBERAR.some((l) => !labels.includes(l))) return null;
  if (!nivelBDe(issue, conf) || !conf.autores.includes(issue.author?.login)) return null;
  const o = opcionesDe(leerPedido(issue.body).pedido);
  if (!o.ok) return null;
  const opcion = (letra) => o.opciones.find((x) => x.letra === letra);
  const { decision, escribio } = respuestaA(issue, o.opciones.map((x) => x.letra), conf);
  if (decision?.letra || decision?.ok) {
    const letra = decision.letra ?? o.recomendada;
    return { accion: 'elegir', letra, quitar: [...LIBERAR], poner: [], comentario: `Elegiste ${letra}${decision.ok ? ' (la recomendada)' : ''}: ${opcion(letra).texto}\nArranca con esa opción.` };
  }
  if (decision?.no) {
    return { accion: 'frenar', quitar: ['ok-por-silencio'], poner: ['frenada'], comentario: 'Frenada: contestaste «no». Sigue con `necesita-ok`; si querés correrla igual, sacale el label.' };
  }
  // Escribió algo que no es una letra, «no» ni «ok»: no se sabe qué quiso, así que no sale por silencio (y tampoco se libera).
  if (escribio || !(Number(ahora) - Date.parse(issue.createdAt) >= horas * 3_600_000)) return null;
  const reco = opcion(o.recomendada);
  return { accion: 'silencio', letra: reco.letra, quitar: [...LIBERAR], poner: ['salio-por-silencio'], comentario: `Salió la recomendada (${reco.letra}) por silencio, a las ${horas} h.\nOpción: ${reco.texto}` };
}

// Lo que el trabajador hace y el revisor comprueba. Queda FIJADO cuando se decide (el primer comentario firmado de la
// orquesta es ese momento): vale la última letra (o «ok» = la recomendada) que escribió Sergio Urcullo antes, o la
// recomendada si salió por silencio. Después solo la cambia un comentario que sea EXACTAMENTE una letra («a», «A.»,
// «b)»), y ese gana sobre la etiqueta; «A la tabla…» o «a ver…» no. Sin «## Opciones» válidas, nada.
const LETRA_SOLA = /^([a-c])[.!)]?$/i;
export function lineaOpcion(issue, pedido, conf = CONF) {
  const o = opcionesDe(pedido.pedido);
  if (!o.ok) return '';
  const opcion = (letra) => o.opciones.find((x) => x.letra === letra);
  const reco = opcion(o.recomendada);
  const letras = o.opciones.map((x) => x.letra);
  const { antesDeLaOrquesta, despuesDeLaOrquesta } = leerHilo(issue, conf);
  const alDecidir = antesDeLaOrquesta.map((t) => decisionDe(t, letras)).findLast(Boolean);
  const despues = despuesDeLaOrquesta.map((t) => t.trim().match(LETRA_SOLA)?.[1].toUpperCase()).filter((l) => letras.includes(l)).at(-1);
  const letra = despues ?? alDecidir?.letra ?? (alDecidir?.ok ? reco.letra : undefined);
  if (letra) return `OPCIÓN ELEGIDA POR SERGIO URCULLO: ${letra} - ${opcion(letra).texto}`;
  if (nombresDe(issue).includes('salio-por-silencio')) {
    return `OPCIÓN ELEGIDA POR SILENCIO (Sergio Urcullo no contestó a tiempo; sale la recomendada): ${reco.letra} - ${reco.texto}`;
  }
  return `OPCIÓN: la recomendada, ${reco.letra} - ${reco.texto}`;
}

// La medición: de los issues que salieron por silencio, cuántos PR se mergearon y cuántos se cerraron sin mergear.
// Con varios PR de la misma rama manda el mergeado, después el abierto.
export function resumirSilencio(issues, prs) {
  const filas = issues.map((it) => {
    const carril = carrilDe(it);
    const suyos = prs.filter((p) => p.headRefName === `orquesta/${carril}-${it.number}`);
    const pr = ['MERGED', 'OPEN', 'CLOSED'].map((s) => suyos.find((p) => p.state === s)).find(Boolean) ?? null;
    return { numero: it.number, titulo: it.title, carril, pr, estado: pr ? { MERGED: 'mergeado', OPEN: 'abierto', CLOSED: 'cerrado' }[pr.state] : 'sinPr' };
  });
  const cuenta = (e) => filas.filter((f) => f.estado === e).length;
  return { total: filas.length, mergeados: cuenta('mergeado'), cerrados: cuenta('cerrado'), abiertos: cuenta('abierto'), sinPr: cuenta('sinPr'), filas };
}

// Lo que GitHub corre al abrir el PR (workflows, con secrets) o git al commitear (hooks) no lo cambia un
// trabajador, y lo que parece un secreto no se sube nunca (el avance se sube sin revisión).
// Tampoco lo que carga el intento siguiente (que sigue desde la rama subida sin revisión) ni el propio orquestador.
// Tampoco lo que el sincronizador del VPS copia como root a /root/bin ni lo que `aplicar` le instala a Hermes
// (scripts/loops, hermes-content/deploy y skills): revisión de seguridad del PR #252, 20-oct.
export const PROTEGIDAS = /^(\.github|\.githooks|\.husky)\/|(^|\/)\.env($|\.)|\.(pem|key|p12|pfx)$|(^|\/)id_(rsa|ed25519)|credentials\.json$|^\.claude\/settings[^/]*\.json$|(^|\/)\.mcp\.json$|^scripts\/orquesta\/|^hermes-content\/docs\/ONIA_CRITERIOS\.md$|^scripts\/loops\/|^hermes-content\/(deploy|skills)\//i;

// Sin cupo de Max o sin login no es culpa de la tarea: no se comenta ni se cuenta como falla (si no, todo queda `bloqueada`).
const SIN_MOTOR = /usage limit|limit will reset|hit your (usage )?limit|invalid api key|oauth token (has )?(expired|been revoked)|authentication_error|not logged in|please run \/login/i;
export function sinMotor(r) {
  let res = '';
  try { const d = JSON.parse(r.out); if (d.is_error) res = String(d.result); } catch { /* codex: texto plano */ }
  return SIN_MOTOR.test(`${r.err}\n${res}`);
}

export function revisarSalida(texto) {
  if (texto == null) return 'no escribió el archivo de salida';
  if (texto.trim().length < 300) return 'la salida es muy corta (menos de 300 caracteres)';
  if (/^\s*BLOQUEADO/i.test(texto)) return texto.trim().split('\n')[0].slice(0, 300);
  return null;
}

export function urlsDe(texto = '') {
  const crudas = texto.match(/https?:\/\/[^\s)\]>"'`|]+/g) || [];
  return [...new Set(crudas.map((u) => u.replace(/[.,;:*]+$/, '')))];
}

// El "cuartito" del carril: lo que su trabajador lee antes de empezar y dónde deja lo que aprende.
export function armarCuartito(c) {
  if (!c.leer?.length) return '';
  const [primero, ...resto] = c.leer;
  const aprende = c.aprende_en
    ? `\nAl terminar, si aprendiste un método, una trampa o un dato medido, agregalo con la fecha a ${c.aprende_en}.`
    : '';
  return `\nTU CUARTITO (el método de tu área). Leé ${primero} antes de empezar; de estos, solo los que apliquen a la tarea:\n${resto.map((p) => `- ${p}`).join('\n')}${aprende}\n`;
}

export function armarPrompt({ carril, issue, pedido, salida, rama, sigue = false, criterios = '' }, conf = CONF) {
  const hilo = leerHilo(issue);
  const dir = path.posix.dirname(salida);
  const opcion = lineaOpcion(issue, pedido, conf);
  return `Sos el trabajador del carril "${carril}" de ONIA (${conf.carriles[carril].que}).
Trabajás SOLO en esta carpeta: es un worktree aislado en la rama ${rama}.
${armarCuartito(conf.carriles[carril])}${criterios ? `\nCRITERIOS DE SERGIO URCULLO (lo que aprueba y rechaza: aplicá «Siempre» y la sección de tu área; si uno choca con las REGLAS DURAS de abajo, mandan ellas):\n${criterios.trim()}\n` : ''}
TAREA #${issue.number}: ${issue.title}
${pedido.pedido}
${opcion ? `\n${opcion}\nHacé solo esa opción: las otras del pedido quedan descartadas.\n` : ''}${sigue ? '\nYA HAY TRABAJO HECHO en esta rama (intentos o vueltas anteriores): seguí desde ahí, no empieces de cero.\n' : ''}${hilo.indicaciones.length ? `\nINDICACIONES DE SERGIO URCULLO (mandan sobre el pedido; la última es la más nueva):\n${hilo.indicaciones.map((x) => `- ${x}`).join('\n')}\n` : ''}${hilo.motivo ? `\nINTENTO ANTERIOR RECHAZADO: ${hilo.motivo}\nCorregí eso primero.\n` : ''}${pedido.ok === 'sergio' ? `\nSergio Urcullo mira esto desde el celular antes de seguir. Si tiene algo visual, guardá capturas PNG a 390 y 1440 de ancho en ${dir}/${issue.number}-390.png y ${dir}/${issue.number}-1440.png.\n` : ''}
ENTREGA OBLIGATORIA: escribí el resultado completo en ${salida} (creá las carpetas que falten).
Lo lee Sergio Urcullo: arrancá con 3 líneas (qué hiciste · qué encontraste · qué sigue) y después el detalle.
Si no podés terminar, escribí igual ${salida} empezando con "BLOQUEADO: <motivo concreto>" y lo que sí hiciste.

REGLAS DURAS: no publiques en redes, no gastes dinero ni créditos, no le escribas a nadie, no toques producción ni el VPS. NO hagas commit, push ni merge: el orquestador commitea y entrega tus cambios (si no podés commitear, no es un bloqueo). Usá las skills del carril cuando apliquen.`;
}

export function armarRevision({ issue, pedido, salida, cambios, criterios = '' }) {
  const opcion = lineaOpcion(issue, pedido);
  return `Sos el REVISOR de ONIA. Otro agente hizo este trabajo: vos lo juzgás con contexto limpio y no lo corregís.

TAREA #${issue.number}: ${issue.title}
${pedido.pedido}
${opcion ? `\n${opcion}\n(El trabajador tenía que hacer solo esa opción: comprobá que no hizo otra.)\n` : ''}${leerHilo(issue).indicaciones.length ? `\nINDICACIONES DE SERGIO URCULLO (deben estar aplicadas):\n${leerHilo(issue).indicaciones.map((x) => `- ${x}`).join('\n')}\n` : ''}
ENTREGA: ${salida}
ARCHIVOS CAMBIADOS:
${cambios}

Leé la entrega (y los archivos cambiados que haga falta) y comprobá:
1. Hace lo que pide la tarea y cumple su "Hecho cuando".
2. No inventa: cada cifra, precio, nombre, ruta o afirmación sobre el repo tiene fuente o se puede comprobar acá.
3. Arranca con 3 líneas para Sergio Urcullo (qué hizo · qué encontró · qué sigue).
4. No publica, gasta, escribe a terceros ni toca producción.
${criterios ? `5. Respeta los CRITERIOS DE SERGIO URCULLO de abajo que apliquen a la tarea (los puntos 1 a 4 mandan sobre ellos). Si choca con uno, RECHAZADO nombrando cuál.\n\nCRITERIOS DE SERGIO URCULLO:\n${criterios.trim()}\n` : ''}
Respondé SOLO así. Primera línea: APROBADO, o RECHAZADO: <qué falla, en una frase>. Después, hasta 5 observaciones cortas.`;
}

export function leerVeredicto(salida) {
  let texto = salida;
  try { texto = JSON.parse(salida).result ?? ''; } catch { /* texto plano */ }
  texto = String(texto).trim();
  const primera = texto.split('\n')[0].replace(/[*_`#]/g, '').trim();
  if (/^APROBADO\s*[.!]?$/i.test(primera)) return { ok: true, notas: texto.split('\n').slice(1).join('\n').trim() };
  const m = primera.match(/^RECHAZADO\s*:?\s*(.*)$/i);
  return { ok: false, motivo: m ? m[1] || 'sin motivo' : `el revisor no dio veredicto: ${primera.slice(0, 120)}` };
}

export function argsAgente({ motor, modelo }, carril, wt, ultimo, conf = CONF) {
  const c = conf.carriles[carril];
  if (motor === 'codex') {
    return ['exec', '-m', modelo, '-s', 'workspace-write', '-C', wt, '--skip-git-repo-check',
      '-c', 'sandbox_workspace_write.network_access=true', '-o', ultimo, '-'];
  }
  const args = ['-p', '--model', modelo, '--output-format', 'json', '--permission-mode', 'acceptEdits',
    '--max-turns', '80', '--settings', path.join(AQUI, 'trabajador.settings.json')];
  for (const d of c.dirs_extra || []) args.push('--add-dir', d);
  args.push('--allowedTools', ...conf.herramientas_claude, ...(c.herramientas_extra || []));
  return args;
}

// ---------- efectos ----------

// Un corte de red con GitHub no es una tarea fallida: se reintenta (medido el 18-oct: 4 de 5 cayeron así).
const RED = /TLS handshake timeout|unexpected EOF|connectex|ECONNRESET|ETIMEDOUT|i\/o timeout|Could not resolve host|HTTP 50[234]|returned error: 50[234]|Failed to connect|Connection was reset|SSL_read|schannel|RPC failed|hung up unexpectedly|early EOF/i;
const esperar = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function reintentar(fn) {
  for (let intento = 1; ; intento++) {
    try { return fn(); } catch (e) {
      if (intento >= 4 || !RED.test(String(e.stderr || e.message))) throw e;
      esperar(intento * 10_000);
    }
  }
}
// Con timeout: un git o gh colgado congela el event loop y con él los relojes de las otras tareas.
// Sin hooks: el orquestador tiene GH_TOKEN, y un hook plantado por un trabajador correría con él (ningún repo usa hooks hoy).
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, '-c', `core.hooksPath=${os.devNull}`, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600_000 }).trim();
const gh = (...a) => reintentar(() => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 180_000 }).trim());
const leerSiExiste = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
// Lo que Sergio Urcullo aprueba y rechaza, de origin/main del repo de la orquesta: la copia revisada, que no tocan ni
// un trabajador (ni su rama, si la tarea sigue) ni un cambio a medio hacer en la PC. Sirve también a plataforma, que
// trabaja en otro repo, y a la nube, cuyo clon solo tiene scripts/orquesta a la vista: git show baja el texto igual.
export const RUTA_CRITERIOS = 'hermes-content/docs/ONIA_CRITERIOS.md';
export function leerCriterios(raiz = path.join(AQUI, '..', '..')) {
  try {
    return git(raiz, 'show', `origin/main:${RUTA_CRITERIOS}`);
  } catch {
    console.error(`[orquesta] sin ${RUTA_CRITERIOS} en origin/main: trabajador y revisor corren sin los criterios de Sergio Urcullo`);
    return '';
  }
}
const intentar = (fn) => { try { return fn(); } catch (e) { console.error(`[orquesta] ${String(e.stderr || e.message).trim().slice(0, 200)}`); return null; } };

function ejecutable(motor) {
  const npm = path.join(process.env.APPDATA || '', 'npm', 'node_modules');
  if (motor === 'claude') {
    const exe = path.join(npm, '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
    return fs.existsSync(exe) ? [exe] : ['claude'];
  }
  const js = path.join(npm, '@openai', 'codex', 'bin', 'codex.js');
  return fs.existsSync(js) ? [process.execPath, js] : ['codex'];
}

function matar(pid) {
  try {
    if (process.platform === 'win32') execFileSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
    else process.kill(pid, 'SIGKILL');
  } catch { /* ya terminó */ }
}

// El que habla con GitHub es el orquestador: los agentes y los checks corren sin su token (en la nube es
// GH_TOKEN), así un pedido inyectado desde una web no tiene con qué escribir en el repo.
const { GH_TOKEN, GITHUB_TOKEN, ...ENV_AGENTE } = process.env;
// El `check: cmd` corre código que dejó el trabajador, fuera de todo sandbox: ni el token de Max le llega.
const { CLAUDE_CODE_OAUTH_TOKEN, ...ENV_CHECK } = ENV_AGENTE;

function correr(cmd, args, { cwd, entrada = '', minutos, shell = false, env = ENV_AGENTE }) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd, windowsHide: true, shell, env });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (err += d));
    p.stdin.on('error', () => { /* el CLI murió al arrancar: lo dice el código de salida */ });
    const reloj = setTimeout(() => { err += `\n[orquesta] tiempo agotado (${minutos} min)`; matar(p.pid); }, minutos * 60_000);
    p.on('close', (code) => { clearTimeout(reloj); resolve({ code, out, err }); });
    p.on('error', (e) => { clearTimeout(reloj); resolve({ code: -1, out, err: String(e) }); });
    p.stdin.end(entrada);
  });
}

// git no aguanta dos `worktree add`/`fetch` a la vez sobre el mismo repo: se encolan por repo.
const filaPorRepo = new Map();
function enFila(repo, fn) {
  const turno = (filaPorRepo.get(repo) || Promise.resolve()).then(fn);
  filaPorRepo.set(repo, turno.catch(() => {}));
  return turno;
}

// Si la rama de la tarea ya existe (un intento cortado, o una vuelta con indicaciones), se sigue desde ella.
export function prepararWorktree(c, base, carril, numero, conf = CONF) {
  const rama = `orquesta/${carril}-${numero}`;
  const wt = path.join(conf.carpeta_trabajo, `${carril}-${numero}`);
  const sigue = reintentar(() => git(c.repo, 'ls-remote', '--heads', 'origin', rama)) !== '';
  reintentar(() => git(c.repo, 'fetch', '--quiet', 'origin', base, ...(sigue ? [rama] : [])));
  if (fs.existsSync(wt)) {
    try { git(c.repo, 'worktree', 'remove', '--force', wt); } catch { fs.rmSync(wt, { recursive: true, force: true }); }
  }
  git(c.repo, 'worktree', 'prune');
  const desde = sigue ? `origin/${rama}` : `origin/${base}`;
  if (process.env.ORQUESTA_SIN_MEDIA === '1') {
    // En la nube cada copia baja solo texto: de 5,5 GB, 4,1 son videos e imágenes de referencias (medido 19-oct).
    git(c.repo, 'worktree', 'add', '--quiet', '--no-checkout', '-B', rama, wt, desde);
    git(wt, 'sparse-checkout', 'set', '--no-cone', ...conf.sin_media);
    git(wt, 'checkout', '--quiet');
  } else git(c.repo, 'worktree', 'add', '--quiet', '-B', rama, wt, desde);
  return { wt, rama, sigue, inicio: git(wt, 'rev-parse', 'HEAD') };
}

// Contra el punto donde nació la rama, no contra la punta de la base: lo que otros cambiaron en la base no es de la tarea.
// --sparse: sin él, una captura PNG nueva en un worktree sin media hace salir `git add` con 1 y se pierde la tarea.
export function cambiosDe(wt, base) {
  git(wt, 'add', '-A', '--sparse');
  const desde = git(wt, 'merge-base', 'HEAD', `origin/${base}`);
  return git(wt, 'diff', '--cached', '--name-only', '--no-renames', '-z', desde).split('\0').filter(Boolean);
}

// Lo hecho en un intento que no cerró se sube a su rama: el próximo sigue desde ahí en vez de empezar de cero.
function guardarAvance(base, wt, rama, carril, issue) {
  if (cambiosDe(wt, base).some((x) => PROTEGIDAS.test(x))) return;
  if (git(wt, 'status', '--porcelain') !== '') git(wt, 'commit', '-m', `orquesta(${carril}): avance de #${issue.number}`);
  if (git(wt, 'rev-list', '--count', `origin/${base}..HEAD`) !== '0') reintentar(() => git(wt, 'push', '--force-with-lease', '-u', 'origin', rama));
}

const repoDe = (c) => git(c.repo, 'remote', 'get-url', 'origin').replace(/^https:\/\/github\.com\/|\.git$/g, '');

async function urlsRotas(urls) {
  const rotas = [];
  for (const u of urls.slice(0, 60)) {
    try {
      const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(15_000), headers: { 'user-agent': 'Mozilla/5.0 (orquesta-onia)' } });
      if (r.status === 404 || r.status === 410) rotas.push(`${u} (${r.status})`);
    } catch (e) {
      if (e.name !== 'TimeoutError') rotas.push(`${u} (no resuelve)`); // un sitio lento no es un enlace inventado
    }
  }
  return rotas;
}

async function verificar(wt, base, inicio, sigue, salida, pedido, r) {
  const texto = leerSiExiste(path.join(wt, salida));
  if (r.code !== 0) return { texto, falla: `el agente no terminó bien (código ${r.code}): ${r.err.trim().slice(-300)}` };
  const tocada = git(wt, 'status', '--porcelain', '--', salida) !== ''
    || git(wt, 'diff', '--name-only', `${inicio}..HEAD`, '--', salida) !== '';
  // Al seguir una tarea, una vuelta puede arreglar solo código: que la salida no cambie ahí no es falla (lo juzga el revisor).
  if (texto != null && !tocada && !sigue) return { texto, falla: 'la salida ya existía y el agente no la cambió' };
  let falla = revisarSalida(texto);
  const rutas = cambiosDe(wt, base);
  const prohibidas = rutas.filter((x) => PROTEGIDAS.test(x));
  if (!falla && prohibidas.length) falla = `tocó archivos que solo cambia una persona: ${prohibidas.join(', ')}`;
  if (!falla && pedido.check === 'urls') {
    const rotas = await urlsRotas(urlsDe(texto));
    if (rotas.length) falla = `enlaces que no abren: ${rotas.join(' · ')}`;
  }
  if (!falla && pedido.check?.startsWith('cmd ')) {
    // ponytail: corre fuera del sandbox el código que dejó el trabajador (tests, scripts de npm); aislarlo si la plataforma lee contenido ajeno.
    const k = await correr(pedido.check.slice(4), [], { cwd: wt, minutos: 15, shell: true, env: ENV_CHECK });
    if (k.code !== 0) falla = `el check "${pedido.check.slice(4)}" falló: ${(k.err || k.out).trim().slice(-300)}`;
  }
  return { texto, falla, rutas };
}

function entregar(c, base, wt, rama, carril, issue) {
  if (git(wt, 'status', '--porcelain') !== '') {
    git(wt, 'add', '-A', '--sparse');
    git(wt, 'commit', '-m', `orquesta(${carril}): ${issue.title}`);
  }
  if (git(wt, 'rev-list', '--count', `origin/${base}..HEAD`) === '0') throw new Error('el agente no dejó cambios para entregar');
  reintentar(() => git(wt, 'push', '--force-with-lease', '-u', 'origin', rama)); // no pisa lo que alguien sumó al PR mientras tanto
  const repo = repoDe(c);
  try {
    return gh('pr', 'create', '-R', repo, '--base', base, '--head', rama, '--title', `orquesta(${carril}): ${issue.title}`,
      '--body', `Tarea ${CONF.repo_cola}#${issue.number}, hecha por el orquestador (carril ${carril}).`);
  } catch {
    // Sin «Allow GitHub Actions to create … pull requests» no hay PR, pero la rama ya está subida: se entrega el enlace igual.
    return intentar(() => gh('pr', 'view', rama, '-R', repo, '--json', 'url', '-q', '.url'))
      ?? `https://github.com/${repo}/compare/${base}...${rama}?expand=1`;
  }
}

async function revisar(wt, issue, pedido, salida, rutas, revisor, criterios) {
  const cambios = rutas.slice(0, 40).join('\n') || salida;
  const [cmd, ...pre] = ejecutable('claude');
  // --restricted: solo lee, confinado al worktree, y no carga settings ni MCP que haya dejado el trabajador.
  const args = [...pre, '-p', '--restricted', '--tools', 'Read,Grep,Glob', '--strict-mcp-config', '--model', revisor,
    '--output-format', 'json', '--max-turns', '20', '--settings', path.join(AQUI, 'trabajador.settings.json')];
  const r = await correr(cmd, args, { cwd: wt, entrada: armarRevision({ issue, pedido, salida, cambios, criterios }), minutos: 10 });
  if (r.code !== 0) return { ok: false, infra: sinMotor(r), motivo: `no se pudo revisar (código ${r.code}): ${r.err.trim().slice(-200)}` };
  return { ...leerVeredicto(r.out), infra: sinMotor(r), usd: costoDe(r, { motor: 'claude' }).usd };
}

function costoDe(r, ruta) {
  if (ruta.motor !== 'claude') return {};
  try { const d = JSON.parse(r.out); return { usd: d.total_cost_usd, turnos: d.num_turns, fin: d.subtype }; } catch { return {}; }
}

async function trabajar(c, carril, issue, pedido, ruta) {
  const salida = rutaSalida(c, pedido, issue.number);
  const base = baseDe(c, pedido);
  const { wt, rama, sigue, inicio } = await enFila(c.repo, () => prepararWorktree(c, base, carril, issue.number));
  const ultimo = path.join(ESTADO, `ultimo-${carril}-${issue.number}.txt`);
  const [cmd, ...pre] = ejecutable(ruta.motor);
  const criterios = leerCriterios();
  const prompt = armarPrompt({ carril, issue, pedido, salida, rama, sigue, criterios });
  const r = await correr(cmd, [...pre, ...argsAgente(ruta, carril, wt, ultimo)], { cwd: wt, entrada: prompt, minutos: CONF.minutos_max });
  const fallar = async (falla, extra) => {
    await enFila(c.repo, () => intentar(() => guardarAvance(base, wt, rama, carril, issue)));
    return { ok: false, falla, salida, texto, wt, ...extra };
  };
  const { texto, falla, rutas } = await verificar(wt, base, inicio, sigue, salida, pedido, r);
  if (falla) return fallar(falla, { ...costoDe(r, ruta), infra: sinMotor(r) });
  // El que revisa nunca es el que hizo. Sin cupo de uno, revisa el siguiente: si no, la tarea vuelve en bucle.
  let rev; let revisor;
  for (revisor of revisoresPara(ruta.modelo)) {
    rev = await revisar(wt, issue, pedido, salida, rutas, revisor, criterios);
    if (!rev.infra) break;
  }
  const extra = { ...costoDe(r, ruta), usd_revision: rev.usd, revisor };
  if (!rev.ok) return fallar(`el revisor lo rechazó: ${rev.motivo}`, { ...extra, infra: rev.infra });
  const pr = await enFila(c.repo, () => entregar(c, base, wt, rama, carril, issue));
  await enFila(c.repo, () => intentar(() => git(c.repo, 'worktree', 'remove', '--force', wt))); // si Windows lo tiene tomado, queda para la próxima
  const capturas = rutas.filter((x) => /\.png$/i.test(x)).map((x) => `https://github.com/${repoDe(c)}/blob/${rama}/${x}?raw=true`);
  return { ok: true, esperaOk: pedido.ok === 'sergio', pr, salida, texto, capturas, notas: rev.notas, ...extra };
}

async function hacerTarea({ carril, issue }) {
  const c = CONF.carriles[carril];
  const pedido = leerPedido(issue.body);
  const ruta = rutear(carril, pedido);
  const inicio = Date.now();
  let res;
  try {
    intentar(() => gh('issue', 'edit', String(issue.number), '-R', CONF.repo_cola, '--add-label', 'en-curso'));
    res = await trabajar(c, carril, issue, pedido, ruta);
  } catch (e) {
    res = { ok: false, falla: String(e.stderr || e.message || e).trim().slice(0, 400) };
  }
  res = { ...res, carril, issue: issue.number, titulo: issue.title, ...ruta, minutos: Math.round((Date.now() - inicio) / 60_000) };
  cerrarIssue(issue, res);
  intentar(() => fs.appendFileSync(path.join(ESTADO, 'registro.jsonl'), JSON.stringify({ ...res, texto: undefined, fecha: new Date().toISOString() }) + '\n'));
  return res;
}

// Primera falla: se reintenta sola en la próxima pasada, desde donde quedó. Segunda seguida: se frena y se avisa.
export function cuerpoCierre(res, fallasPrevias, vistos = 0) {
  const cabeza = (res.texto || '').split('\n').slice(0, 12).join('\n');
  const datos = `${res.motor} · ${res.modelo} · ${res.minutos} min${res.usd ? ` · US$ ${res.usd.toFixed(2)} equiv.` : ''}`;
  const revision = res.notas ? `\n\nRevisión (${res.revisor || CONF.revisor}):\n${res.notas}` : '';
  if (res.ok && res.esperaOk) {
    const fotos = (res.capturas || []).map((u) => `![captura](${u})`).join('\n');
    return { bloquea: false, cuerpo: firmar(vistos, `👀 Listo para tu OK (${datos})\n\n${fotos ? `${fotos}\n\n` : ''}Entrega: ${res.pr}\nArchivo: \`${res.salida}\`\n\n${cabeza}${revision}\n\n**Respondé acá:** «ok» la cierra; si querés cambios, escribilos y sigue desde donde quedó.`) };
  }
  if (res.ok) return { bloquea: false, cuerpo: firmar(vistos, `✅ Hecho y revisado (${datos})\n\nEntrega: ${res.pr}\nArchivo: \`${res.salida}\`\n\n${cabeza}${revision}`) };
  const bloquea = fallasPrevias >= 1;
  const sigue = bloquea
    ? 'Dos intentos seguidos sin cerrar: la frené. Para seguir, escribí acá qué cambiar (o sacá `bloqueada`).'
    : 'Lo reintento solo en la próxima pasada, desde donde quedó y con este motivo.';
  return { bloquea, cuerpo: firmar(vistos, `⛔ No se cerró (${datos})\n\nMotivo: ${res.falla}\n\n${sigue}`) };
}

function cerrarIssue(issue, res) {
  const n = String(issue.number);
  const R = CONF.repo_cola;
  // Lo hecho ya quedó en la rama: se suelta y la próxima pasada sigue desde ahí, sin gastar el reintento.
  if (res.infra) return intentar(() => gh('issue', 'edit', n, '-R', R, '--remove-label', 'en-curso'));
  const vistos = (issue.comments || []).length;
  const { bloquea, cuerpo } = cuerpoCierre(res, leerHilo(issue).fallasSeguidas, vistos);
  // Sin el comentario no hay hilo que leer: ni el «ok» de Sergio Urcullo se atendería ni las fallas se contarían.
  const comentado = intentar(() => gh('issue', 'comment', n, '-R', R, '--body', cuerpo)) !== null;
  // Un solo cambio de labels: si la red cae en el medio, el issue no queda suelto para que la próxima pasada lo rehaga.
  if (res.ok && !res.esperaOk) {
    if (intentar(() => gh('issue', 'close', n, '-R', R)) !== null) intentar(() => gh('issue', 'edit', n, '-R', R, '--remove-label', 'en-curso'));
  } else if (res.ok && comentado) intentar(() => gh('issue', 'edit', n, '-R', R, '--add-label', 'espera-ok', '--remove-label', 'en-curso'));
  else if (bloquea || !comentado) intentar(() => gh('issue', 'edit', n, '-R', R, '--add-label', 'bloqueada', '--remove-label', 'en-curso'));
  else intentar(() => gh('issue', 'edit', n, '-R', R, '--remove-label', 'en-curso'));
}

// `gh issue edit` NO es atómico: cada --add-label y cada --remove-label es una mutación aparte, y corren en paralelo
// (gh 2.92). Un solo edit con las dos cosas puede sacar los frenos y fallar al agregar (un label que no existe en el
// repo), y el issue saldría sin la marca de la medición. Por eso van en dos edits, en este orden: PRIMERO lo que se
// agrega (la marca; o el freno que se vuelve a poner) y SOLO si salió bien, lo que se saca. Si falla uno no se sigue: el
// issue queda frenado y la próxima pasada lo reintenta. La memoria (it.labels) refleja cada paso que salió bien.
function editarLabels(correrGh, conf, it, { poner, quitar }) {
  for (const [flag, nombres] of [['--add-label', poner], ['--remove-label', quitar]]) {
    if (!nombres.length) continue;
    const args = ['issue', 'edit', String(it.number), '-R', conf.repo_cola, ...nombres.flatMap((l) => [flag, l])];
    if (intentar(() => correrGh(...args)) === null) return false;
    const sin = (it.labels || []).filter((l) => !nombres.includes(l.name || l));
    it.labels = flag === '--add-label' ? [...sin, ...nombres.map((name) => ({ name }))] : sin;
  }
  return true;
}

// Lo que Sergio Urcullo contestó desde la última pasada: «ok» cierra, una indicación destraba; un «no» a lo que ya salió
// por silencio lo vuelve a frenar (necesita-ok y frenada).
export function atenderRespuestas(issues, { gh: correrGh = gh, conf = CONF } = {}) {
  const R = conf.repo_cola;
  return issues.filter((it) => {
    const d = decidirRespuesta(it);
    if (!d) return true;
    const n = String(it.number);
    if (d === 'cerrar') {
      const cerrado = intentar(() => correrGh('issue', 'close', n, '-R', R, '--comment', firmar((it.comments || []).length, '✅ Aprobada por Sergio Urcullo.'))) !== null;
      if (cerrado) intentar(() => correrGh('issue', 'edit', n, '-R', R, '--remove-label', 'espera-ok'));
      return false; // cerrado o no, en esta pasada no se trabaja
    }
    if (d === 'frenar') {
      const quitar = ['espera-ok', 'bloqueada'].filter((l) => nombresDe(it).includes(l));
      const frenada = editarLabels(correrGh, conf, it, { poner: ['necesita-ok', 'frenada'], quitar });
      if (frenada) intentar(() => correrGh('issue', 'comment', n, '-R', R, '--body', firmar((it.comments || []).length, 'Frenada: contestaste «no» a lo que había salido por silencio. Vuelve a esperar `necesita-ok`; si querés correrla igual, sacale el label.')));
      return false;
    }
    intentar(() => correrGh('issue', 'edit', n, '-R', R, '--remove-label', 'espera-ok', '--remove-label', 'bloqueada'));
    it.labels = (it.labels || []).filter((l) => !['espera-ok', 'bloqueada'].includes(l.name || l));
    return true;
  });
}

// Antes de elegir tareas: lo que Sergio Urcullo contestó a las opciones, o la recomendada si no contestó a tiempo.
// Los labels van por editarLabels (dos edits, la marca primero) y antes del comentario: sin el cambio no se suelta nada.
// Con `escribir: false` (--dry) solo lo cuenta y lo refleja en memoria.
export function atenderSilencio(issues, ahora, { escribir = true, gh: correrGh = gh, conf = CONF, log = console.log } = {}) {
  try { horasDeSilencio(conf); } catch (e) { console.error(`[orquesta] ${e.message}: no suelto nada por silencio`); return issues; }
  for (const it of issues) {
    const d = intentar(() => silencioVencido(it, ahora, conf));
    if (!d) continue;
    if (!escribir) log(`silencio\t#${it.number}\t${d.accion}\t${d.letra ?? ''}`);
    if (!editarLabels(escribir ? correrGh : () => '', conf, it, d)) continue; // falló: queda frenado y se reintenta
    if (escribir) intentar(() => correrGh('issue', 'comment', String(it.number), '-R', conf.repo_cola, '--body', firmar((it.comments || []).length, d.comentario)));
  }
  return issues;
}

// --silencio-informe: solo lee. Los carriles del nivel B (marca, comunidad, investigacion) abren su PR en el mismo repo de la cola.
export function informeSilencio(runGh = gh, conf = CONF) {
  const leer = (...args) => {
    try { return JSON.parse(runGh(...args)); } catch (e) {
      if (e.code === 'ENOENT') throw new Error('gh no está instalado o no está en el PATH: el informe lee los issues y los PR de GitHub con gh (https://cli.github.com)');
      throw e;
    }
  };
  // Con necesita-ok todavía no salió: le pusieron la marca y no alcanzó a sacarle el freno, o un «no» la volvió a frenar.
  const issues = leer('issue', 'list', '-R', conf.repo_cola, '-l', 'salio-por-silencio', '--state', 'all', '--limit', '200', '--json', 'number,title,state,labels')
    .filter((it) => !nombresDe(it).includes('necesita-ok'));
  const prs = issues.length ? leer('pr', 'list', '-R', conf.repo_cola, '--state', 'all', '--limit', '500', '--json', 'number,headRefName,state,mergedAt,url') : [];
  const r = resumirSilencio(issues, prs);
  const filas = r.filas.map((f) => `#${f.numero} ${f.carril} · ${f.titulo} · ${f.pr ? `PR ${f.estado} ${f.pr.url}` : 'sin PR'}`);
  return [`Salieron por silencio: ${r.total}`, `PR mergeados: ${r.mergeados}`, `PR cerrados sin mergear: ${r.cerrados}`,
    `PR abiertos: ${r.abiertos}`, `Sin PR: ${r.sinPr}`, ...(filas.length ? ['', ...filas] : [])].join('\n');
}

async function enParalelo(items, n, fn) {
  const res = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; res[k] = await fn(items[k]); }
  }));
  return res;
}

function resumen(resultados) {
  const lineas = resultados.map((r) => {
    if (r.ok && r.esperaOk) return `👀 ${r.carril}: ${r.titulo} — espera tu OK: https://github.com/${CONF.repo_cola}/issues/${r.issue}`;
    if (r.ok) return `✅ ${r.carril}: ${r.titulo} (${r.modelo}, ${r.minutos} min) ${r.pr}`;
    if (r.infra) return `⏸ ${r.carril}: ${r.titulo} — sin cupo o sin login, sigue en la próxima pasada: ${r.falla}`;
    return `⛔ ${r.carril}: ${r.titulo} — ${r.falla}`;
  });
  return `Orquesta ONIA · ${resultados.filter((r) => r.ok).length}/${resultados.length} hechas\n${lineas.join('\n')}`;
}

function avisarTelegram(texto) {
  const llave = path.join(os.homedir(), '.ssh', 'onia_hermes_vps_ed25519');
  execFileSync('ssh', ['-i', llave, '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', 'root@187.77.16.63',
    'ONIA_AVISO=resumen /root/bin/onia-tg.sh "$(cat)"'], { input: texto, stdio: ['pipe', 'ignore', 'ignore'] });
}

function vivo(pid) {
  try { process.kill(Number(pid), 0); return true; } catch { return false; }
}

function tomarCandado() {
  fs.mkdirSync(ESTADO, { recursive: true });
  const candado = path.join(ESTADO, 'candado');
  if (fs.existsSync(candado)) {
    const dueño = fs.readFileSync(candado, 'utf8').trim();
    const reciente = Date.now() - fs.statSync(candado).mtimeMs < 3 * 3600_000;
    if (reciente && vivo(dueño)) return null;
    fs.rmSync(candado, { force: true });
  }
  try { fs.writeFileSync(candado, String(process.pid), { flag: 'wx' }); return candado; } catch { return null; }
}

// Con el candado tomado nada más corre: un `en-curso` que quedó es de una pasada que murió.
function soltarHuerfanas(issues) {
  for (const it of issues.filter((x) => (x.labels || []).some((l) => (l.name || l) === 'en-curso'))) {
    intentar(() => gh('issue', 'edit', String(it.number), '-R', CONF.repo_cola, '--remove-label', 'en-curso'));
    it.labels = it.labels.filter((l) => (l.name || l) !== 'en-curso');
  }
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--silencio-informe')) {
    try { console.log(informeSilencio()); } catch (e) { console.error(`[orquesta] ${e.message}`); process.exitCode = 1; }
    return;
  }
  const soloCarril = argv.includes('--carril') ? argv[argv.indexOf('--carril') + 1] : null;
  // La PC y la nube corren a la vez con candados distintos: cada lado ve solo sus issues, así ninguno
  // suelta el `en-curso` ni contesta el «ok» de una tarea que está trabajando el otro.
  // Sin flag, cada lado es el suyo: una corrida a mano en la PC nunca toma una tarea de la nube.
  const donde = argv.includes('--donde') ? argv[argv.indexOf('--donde') + 1]
    : process.env.ORQUESTA_DONDE || (process.env.GITHUB_ACTIONS ? 'nube' : 'pc');
  if (!['pc', 'nube'].includes(donde)) throw new Error(`--donde inválido: ${donde} (pc | nube)`);
  const listar = () => JSON.parse(gh('issue', 'list', '-R', CONF.repo_cola, '-l', 'orquesta', '--state', 'open',
    '--limit', '200', '--json', 'number,title,body,labels,author,createdAt,comments')).filter((it) => dondeDe(it) === donde);
  if (argv.includes('--dry')) {
    for (const t of elegirTareas(atenderSilencio(listar(), Date.now(), { escribir: false }), CONF, soloCarril)) {
      console.log(`${t.carril}\t#${t.issue.number}\t${JSON.stringify(rutear(t.carril, leerPedido(t.issue.body)))}\t${t.issue.title}`);
    }
    return;
  }
  const candado = tomarCandado();
  if (!candado) return console.log('Orquesta ONIA: ya hay una pasada corriendo.');
  const soltar = () => fs.rmSync(candado, { force: true });
  process.once('SIGINT', () => { soltar(); process.exit(130); });
  try {
    const issues = atenderSilencio(atenderRespuestas(listar()), Date.now());
    soltarHuerfanas(issues);
    const tareas = elegirTareas(issues, CONF, soloCarril);
    if (!tareas.length) return console.log('Orquesta ONIA: no hay tareas pendientes.');
    const texto = resumen(await enParalelo(tareas, CONF.paralelo, hacerTarea));
    console.log(texto);
    if (process.env.ORQUESTA_TELEGRAM === '1') intentar(() => avisarTelegram(texto));
  } finally {
    soltar();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((e) => { console.error(`[orquesta] pasada caída: ${e.stack || e}`); process.exitCode = 1; });
}
