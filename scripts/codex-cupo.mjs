#!/usr/bin/env node
// Muestra el cupo de Codex: % usado y reinicio (UTC y La Paz) por ventana.
// Fuente: ultimo evento con rate_limits en ~/.codex/sessions/**/*.jsonl. Solo lectura, sin dependencias.
// Uso: node scripts/codex-cupo.mjs [--json] | --self-test
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const fmt = (d, tz) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: tz, dateStyle: 'short', timeStyle: 'short' }).format(d);

function* walk(dir) {
  let ents;
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.jsonl')) yield p;
  }
}

// Ultima linea con rate_limits no nulo de un texto JSONL.
export function lastRateLimits(text) {
  let best = null;
  for (const line of text.split('\n')) {
    if (!line.includes('rate_limits')) continue;
    try {
      const o = JSON.parse(line);
      const rl = o?.payload?.rate_limits;
      if (rl && (rl.primary || rl.secondary)) best = { ts: o.timestamp, rl };
    } catch { /* linea truncada: se ignora */ }
  }
  return best;
}

const label = (m) => (m >= 10080 ? 'semanal' : m <= 360 ? 'corta' : `${m} min`);

export function describe(found, now = Date.now()) {
  const wins = ['primary', 'secondary']
    .map((k) => found.rl[k] && { slot: k, ...found.rl[k] })
    .filter(Boolean)
    .map((w) => {
      const at = new Date(w.resets_at * 1000);
      const stale = at.getTime() <= now; // ventana ya reinició: el % medido es viejo
      return {
        ventana: label(w.window_minutes), slot: w.slot, usado_pct: w.used_percent,
        reinicio_utc: fmt(at, 'UTC'), reinicio_la_paz: fmt(at, 'America/La_Paz'),
        reinicio_pasado: stale,
      };
    });
  return { medido_utc: found.ts, plan: found.rl.plan_type, limite_alcanzado: found.rl.rate_limit_reached_type, ventanas: wins };
}

function selfTest() {
  const line = (ts, p, s) => JSON.stringify({ timestamp: ts, payload: { type: 'token_count', rate_limits: { plan_type: 'x', primary: p, secondary: s } } });
  const txt = [
    line('2026-10-10T10:00:00Z', { used_percent: 10, window_minutes: 300, resets_at: 1791950000 }, null),
    'basura {', line('2026-10-10T11:00:00Z', { used_percent: 20, window_minutes: 300, resets_at: 1791950000 }, { used_percent: 58, window_minutes: 10080, resets_at: 1791950261 }),
    JSON.stringify({ timestamp: 'z', payload: { rate_limits: null } }),
  ].join('\n');
  const f = lastRateLimits(txt);
  assert.equal(f.ts, '2026-10-10T11:00:00Z');
  const d = describe(f, 0);
  assert.equal(d.ventanas.length, 2);
  assert.equal(d.ventanas[1].ventana, 'semanal');
  assert.equal(d.ventanas[1].usado_pct, 58);
  assert.equal(d.ventanas[1].reinicio_utc, '2026-10-14 03:57');
  assert.equal(d.ventanas[1].reinicio_la_paz, '2026-10-13 23:57');
  assert.match(d.ventanas[1].reinicio_la_paz, /^\d{4}-\d\d-\d\d \d\d:\d\d$/);
  assert.equal(lastRateLimits('nada'), null);
  console.log('self-test OK');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();
  const root = join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'sessions');
  let best = null;
  const files = [...walk(root)].map((p) => [p, statSync(p).mtimeMs]).sort((a, b) => b[1] - a[1]);
  for (const [p] of files) {
    const f = lastRateLimits(readFileSync(p, 'utf8'));
    if (f && (!best || f.ts > best.ts)) best = { ...f, file: p };
    if (best && files.length > 40 && best.file !== p && Date.parse(best.ts) > statSync(p).mtimeMs) break; // ya no hay nada mas nuevo
  }
  if (!best) { console.log('UNKNOWN: sin eventos rate_limits en ' + root); process.exit(2); }
  const d = describe(best);
  if (args.includes('--json')) return console.log(JSON.stringify(d, null, 2));
  console.log(`Codex cupo (medido ${d.medido_utc} UTC, plan ${d.plan}${d.limite_alcanzado ? ', LIMITE: ' + d.limite_alcanzado : ''})`);
  for (const w of d.ventanas)
    console.log(`- ${w.ventana}: ${w.usado_pct}% usado | reinicia ${w.reinicio_utc} UTC / ${w.reinicio_la_paz} La Paz${w.reinicio_pasado ? ' (YA REINICIO: dato viejo)' : ''}`);
  if (!d.ventanas.some((w) => w.ventana === 'corta')) console.log('- corta: UNKNOWN (el ultimo evento no la trae)');
}
main();
