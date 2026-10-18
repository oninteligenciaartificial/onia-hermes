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
export const CONF = JSON.parse(fs.readFileSync(path.join(AQUI, 'carriles.json'), 'utf8'));
const ESTADO = path.join(os.homedir(), '.onia-orquesta');
const NIVELES = ['rapido', 'normal', 'profundo'];
const CAMPOS = /^(nivel|motor|modelo|salida|check)\s*:\s*(.+)$/i;

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

export function elegirTareas(issues, conf = CONF, soloCarril = null) {
  const frenadas = new Set(['en-curso', 'bloqueada']);
  const porCarril = {};
  const orden = [...issues].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const it of orden) {
    const carril = carrilDe(it);
    if (!carril || !conf.carriles[carril]) continue;
    if (soloCarril && carril !== soloCarril) continue;
    if (!conf.autores.includes(it.author?.login)) continue; // la cola solo acepta pedidos del dueño
    if (nombresDe(it).some((n) => frenadas.has(n))) continue;
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

export function rutaSalida(c, pedido, numero) {
  const s = (pedido.salida || `${c.salida}/${numero}.md`).replace(/\\/g, '/');
  if (path.isAbsolute(s) || /^[a-z]:/i.test(s) || s.split('/').includes('..')) throw new Error(`salida inválida: ${s}`);
  return s;
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

export function armarPrompt({ carril, issue, pedido, salida, rama }, conf = CONF) {
  return `Sos el trabajador del carril "${carril}" de ONIA (${conf.carriles[carril].que}).
Trabajás SOLO en esta carpeta: es un worktree aislado en la rama ${rama}.

TAREA #${issue.number}: ${issue.title}
${pedido.pedido}

ENTREGA OBLIGATORIA: escribí el resultado completo en ${salida} (creá las carpetas que falten).
Lo lee Sergio Urcullo: arrancá con 3 líneas (qué hiciste · qué encontraste · qué sigue) y después el detalle.
Si no podés terminar, escribí igual ${salida} empezando con "BLOQUEADO: <motivo concreto>" y lo que sí hiciste.

REGLAS DURAS: no publiques en redes, no gastes dinero ni créditos, no le escribas a nadie, no toques producción ni el VPS, no hagas push ni merge (eso lo hace el orquestador). Usá las skills del carril cuando apliquen. Al terminar, hacé commit de tus cambios con el mensaje "orquesta(${carril}): ${issue.title}".`;
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

const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const leerSiExiste = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
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

function correr(cmd, args, { cwd, entrada = '', minutos, shell = false }) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd, windowsHide: true, shell });
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

function prepararWorktree(c, carril, numero) {
  const rama = `orquesta/${carril}-${numero}`;
  const wt = path.join(CONF.carpeta_trabajo, `${carril}-${numero}`);
  git(c.repo, 'fetch', '--quiet', 'origin', c.base);
  if (fs.existsSync(wt)) {
    try { git(c.repo, 'worktree', 'remove', '--force', wt); } catch { fs.rmSync(wt, { recursive: true, force: true }); }
  }
  git(c.repo, 'worktree', 'prune');
  git(c.repo, 'worktree', 'add', '--quiet', '-B', rama, wt, `origin/${c.base}`);
  return { wt, rama };
}

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

async function verificar(wt, base, salida, pedido, r) {
  const texto = leerSiExiste(path.join(wt, salida));
  if (r.code !== 0) return { texto, falla: `el agente no terminó bien (código ${r.code}): ${r.err.trim().slice(-300)}` };
  const tocada = git(wt, 'status', '--porcelain', '--', salida) !== ''
    || git(wt, 'diff', '--name-only', `origin/${base}...HEAD`, '--', salida) !== '';
  if (texto != null && !tocada) return { texto, falla: 'la salida ya existía y el agente no la cambió' };
  let falla = revisarSalida(texto);
  if (!falla && pedido.check === 'urls') {
    const rotas = await urlsRotas(urlsDe(texto));
    if (rotas.length) falla = `enlaces que no abren: ${rotas.join(' · ')}`;
  }
  if (!falla && pedido.check?.startsWith('cmd ')) {
    const k = await correr(pedido.check.slice(4), [], { cwd: wt, minutos: 15, shell: true });
    if (k.code !== 0) falla = `el check "${pedido.check.slice(4)}" falló: ${(k.err || k.out).trim().slice(-300)}`;
  }
  return { texto, falla };
}

function entregar(c, wt, rama, carril, issue) {
  if (git(wt, 'status', '--porcelain') !== '') {
    git(wt, 'add', '-A');
    git(wt, 'commit', '-m', `orquesta(${carril}): ${issue.title}`);
  }
  if (git(wt, 'rev-list', '--count', `origin/${c.base}..HEAD`) === '0') throw new Error('el agente no dejó cambios para entregar');
  git(wt, 'push', '--force', '-u', 'origin', rama); // `orquesta/*` es solo del orquestador
  const repo = git(c.repo, 'remote', 'get-url', 'origin').replace(/^https:\/\/github\.com\/|\.git$/g, '');
  try {
    return gh('pr', 'create', '-R', repo, '--base', c.base, '--head', rama, '--title', `orquesta(${carril}): ${issue.title}`,
      '--body', `Tarea ${CONF.repo_cola}#${issue.number}, hecha por el orquestador (carril ${carril}).`);
  } catch {
    return gh('pr', 'view', rama, '-R', repo, '--json', 'url', '-q', '.url');
  }
}

function costoDe(r, ruta) {
  if (ruta.motor !== 'claude') return {};
  try { const d = JSON.parse(r.out); return { usd: d.total_cost_usd, turnos: d.num_turns, fin: d.subtype }; } catch { return {}; }
}

async function trabajar(c, carril, issue, pedido, ruta) {
  const salida = rutaSalida(c, pedido, issue.number);
  const { wt, rama } = await enFila(c.repo, () => prepararWorktree(c, carril, issue.number));
  const ultimo = path.join(ESTADO, `ultimo-${carril}-${issue.number}.txt`);
  const [cmd, ...pre] = ejecutable(ruta.motor);
  const prompt = armarPrompt({ carril, issue, pedido, salida, rama });
  const r = await correr(cmd, [...pre, ...argsAgente(ruta, carril, wt, ultimo)], { cwd: wt, entrada: prompt, minutos: CONF.minutos_max });
  const { texto, falla } = await verificar(wt, c.base, salida, pedido, r);
  if (falla) return { ok: false, falla, salida, texto, wt, ...costoDe(r, ruta) };
  const pr = await enFila(c.repo, () => entregar(c, wt, rama, carril, issue));
  intentar(() => git(c.repo, 'worktree', 'remove', '--force', wt)); // si Windows lo tiene tomado, queda para la próxima
  return { ok: true, pr, salida, texto, ...costoDe(r, ruta) };
}

async function hacerTarea({ carril, issue }) {
  const c = CONF.carriles[carril];
  const pedido = leerPedido(issue.body);
  const ruta = rutear(carril, pedido);
  const inicio = Date.now();
  let res;
  try {
    gh('issue', 'edit', String(issue.number), '-R', CONF.repo_cola, '--add-label', 'en-curso');
    res = await trabajar(c, carril, issue, pedido, ruta);
  } catch (e) {
    res = { ok: false, falla: String(e.stderr || e.message || e).trim().slice(0, 400) };
  }
  res = { ...res, carril, issue: issue.number, titulo: issue.title, ...ruta, minutos: Math.round((Date.now() - inicio) / 60_000) };
  cerrarIssue(String(issue.number), res);
  intentar(() => fs.appendFileSync(path.join(ESTADO, 'registro.jsonl'), JSON.stringify({ ...res, texto: undefined, fecha: new Date().toISOString() }) + '\n'));
  return res;
}

function cerrarIssue(n, res) {
  const cabeza = (res.texto || '').split('\n').slice(0, 12).join('\n');
  const datos = `${res.motor} · ${res.modelo} · ${res.minutos} min${res.usd ? ` · US$ ${res.usd.toFixed(2)} equiv.` : ''}`;
  const cuerpo = res.ok
    ? `✅ Hecho (${datos})\n\nEntrega: ${res.pr}\nArchivo: \`${res.salida}\`\n\n${cabeza}`
    : `⛔ No se cerró (${datos})\n\nMotivo: ${res.falla}${res.wt ? `\nLo que dejó el agente: \`${res.wt}\`` : ''}\n\nPara reintentar: sacá el label \`bloqueada\`.`;
  const R = CONF.repo_cola;
  intentar(() => gh('issue', 'comment', n, '-R', R, '--body', cuerpo));
  intentar(() => gh('issue', 'edit', n, '-R', R, '--remove-label', 'en-curso'));
  if (res.ok) intentar(() => gh('issue', 'close', n, '-R', R));
  else intentar(() => gh('issue', 'edit', n, '-R', R, '--add-label', 'bloqueada'));
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
  const lineas = resultados.map((r) => (r.ok
    ? `✅ ${r.carril}: ${r.titulo} (${r.modelo}, ${r.minutos} min) ${r.pr}`
    : `⛔ ${r.carril}: ${r.titulo} — ${r.falla}`));
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
  const soloCarril = argv.includes('--carril') ? argv[argv.indexOf('--carril') + 1] : null;
  const listar = () => JSON.parse(gh('issue', 'list', '-R', CONF.repo_cola, '-l', 'orquesta', '--state', 'open',
    '--limit', '200', '--json', 'number,title,body,labels,author,createdAt'));
  if (argv.includes('--dry')) {
    for (const t of elegirTareas(listar(), CONF, soloCarril)) {
      console.log(`${t.carril}\t#${t.issue.number}\t${JSON.stringify(rutear(t.carril, leerPedido(t.issue.body)))}\t${t.issue.title}`);
    }
    return;
  }
  const candado = tomarCandado();
  if (!candado) return console.log('Orquesta ONIA: ya hay una pasada corriendo.');
  const soltar = () => fs.rmSync(candado, { force: true });
  process.once('SIGINT', () => { soltar(); process.exit(130); });
  try {
    const issues = listar();
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
