#!/usr/bin/env node
// Repo Pulse — resumen diario de actividad de onia-hermes para los bots que arman
// el plan diario (Briefing + Reporte Sergio/Arthur): cuantos commits hubo, en que
// carril (mapeo de CLAUDE.md seccion "Desarrollo en paralelo — carriles"), que tipo
// (conventional commits) y que carriles llevan dias sin actividad. Corre en GitHub
// Actions (checkout completo + todas las ramas); el JSON resultante se sube al VPS
// por SSH para que n8n lo lea con un simple `cat` (sin tocar el repo desde el VPS).
// Mantener LANES en sync si la tabla de carriles de CLAUDE.md cambia.
import { execFileSync } from 'node:child_process';

const LOOKBACK_HOURS = Number(process.env.REPO_PULSE_LOOKBACK_HOURS || 72);
const STALE_DAYS = Number(process.env.REPO_PULSE_STALE_DAYS || 3);
const MAX_RECENT_COMMITS = 30;
const OTHER_LANE = 'otros (raiz/docs)';

// Orden = especificidad: los prefijos mas especificos van antes que los generales
// (B "web-factory/apps/site/src/app" es prefijo de A "...src/app/onia-center", por
// eso A va primero; J "hermes-content/scripts/content-engine" antes que el catch-all
// de H "hermes-content/scripts"). Rutas verificadas contra la estructura real del repo
// (2026-07-06), no contra los nombres literales de la tabla de carriles en CLAUDE.md
// (quedo desactualizada tras mover todo bajo web-factory/apps/site). Los buckets sin
// letra (meta-ads, video-factory, coordinacion) no estan en la tabla de CLAUDE.md pero
// existen en la practica (ver memoria del proyecto) — sin forzar una letra que no les
// corresponde.
const LANES = [
  { lane: 'A onia-center-saneamiento', paths: ['web-factory/apps/site/src/app/onia-center', 'web-factory/apps/site/src/app/api/onia-center'] },
  { lane: 'I research-estrategia', paths: ['hermes-content/docs/research'] },
  { lane: 'C propuestas-v2', paths: ['hermes-content/propuestas'] },
  { lane: 'G infra-deploy-n8n', paths: ['hermes-content/deploy', 'scripts/deploy-onia-center.sh', 'scripts/onia-feed.js', 'scripts/repo-pulse.mjs', '.github/workflows'] },
  { lane: 'meta-ads', paths: ['hermes-content/integrations'] },
  { lane: 'J video-remotion', paths: ['scripts/remotion', 'apps/video', 'hermes-content/scripts/content-engine'] },
  { lane: 'H contenido-higgsfield', paths: ['hermes-content/references', '.hermes/video-lab', 'hermes-content/scripts'] },
  { lane: 'video-factory (motor Higgsfield)', paths: ['video-factory'] },
  { lane: 'Core onia-core', paths: ['onia-core'] },
  { lane: 'coordinacion (docs/skills)', paths: ['hermes-content/docs', 'hermes-content/skills', 'docs', '.claude'] },
  { lane: 'B wf-landing-dentalgest', paths: ['web-factory/apps/site/src/app', 'web-factory/data', 'web-factory/design', 'web-factory/harvester', 'web-factory/generate', 'web-factory/packages', 'web-factory/docs', 'web-factory/tests', 'web-factory/experiments', 'web-factory/scripts'] },
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
}

function classify(filePath) {
  for (const { lane, paths } of LANES) {
    if (paths.some((p) => filePath === p || filePath.startsWith(p + '/'))) return lane;
  }
  return OTHER_LANE;
}

function parseType(subject) {
  const m = /^([a-z]+)(\([\w./-]+\))?!?:\s*/.exec(subject);
  return m ? m[1] : 'other';
}

const sinceISO = new Date(Date.now() - LOOKBACK_HOURS * 3600 * 1000).toISOString();

let log = '';
try {
  log = git(['log', '--all', '--since=' + sinceISO, '--date=iso-strict', '--pretty=format:%H%x1f%ad%x1f%an%x1f%s']);
} catch (e) {
  log = '';
}
const commits = log
  ? log.split('\n').map((line) => {
      const [sha, date, author, subject] = line.split('\x1f');
      return { sha, date, author, subject };
    })
  : [];

const byLane = new Map();
const byType = {};
const recentCommits = [];

for (const c of commits) {
  let files = [];
  try {
    const out = git(['show', '--name-only', '--pretty=format:', c.sha]);
    files = out.split('\n').filter(Boolean);
  } catch (e) {
    files = [];
  }
  const lanesTouched = new Set(files.map(classify));
  if (lanesTouched.size === 0) lanesTouched.add(OTHER_LANE);
  const type = parseType(c.subject);
  byType[type] = (byType[type] || 0) + 1;
  for (const lane of lanesTouched) {
    if (!byLane.has(lane)) byLane.set(lane, { lane, commits: 0, messages: [] });
    const entry = byLane.get(lane);
    entry.commits += 1;
    if (entry.messages.length < 5) entry.messages.push(c.subject);
  }
  recentCommits.push({ sha: c.sha.slice(0, 7), date: c.date, author: c.author, type, subject: c.subject, lanes: [...lanesTouched] });
}

const staleLanes = [];
for (const { lane, paths } of LANES) {
  let lastDate = '';
  try {
    lastDate = git(['log', '--all', '-1', '--format=%cI', '--', ...paths]);
  } catch (e) {
    lastDate = '';
  }
  if (!lastDate) {
    staleLanes.push({ lane, daysSinceLastCommit: null });
    continue;
  }
  const days = Math.floor((Date.now() - new Date(lastDate).getTime()) / (24 * 3600 * 1000));
  if (days >= STALE_DAYS) staleLanes.push({ lane, daysSinceLastCommit: days });
}

const result = {
  generatedAt: new Date().toISOString(),
  sinceISO,
  lookbackHours: LOOKBACK_HOURS,
  totalCommits: commits.length,
  byLane: [...byLane.values()].sort((a, b) => b.commits - a.commits),
  byType,
  staleLanes: staleLanes.sort((a, b) => (b.daysSinceLastCommit ?? 999) - (a.daysSinceLastCommit ?? 999)),
  recentCommits: recentCommits.slice(0, MAX_RECENT_COMMITS),
};

process.stdout.write(JSON.stringify(result, null, 2));
