import fs from 'node:fs'; import path from 'node:path';
const root = path.join(process.env.USERPROFILE || process.env.HOME, '.claude', 'projects');
const since = Date.now() - 24*3600e3; const seen = new Set(); const by = {};
let ctxLast = null; const me = process.argv[2] || '' // id de la sesión madre, para medir su contexto;
function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p = path.join(d,e.name);
  if (e.isDirectory()) walk(p); else if (p.endsWith('.jsonl') && fs.statSync(p).mtimeMs > since) scan(p); } }
function scan(p){ for (const line of fs.readFileSync(p,'utf8').split('\n')) { if (!line.includes('"usage"')) continue;
  let j; try { j = JSON.parse(line) } catch { continue }
  const m = j.message; if (!m?.usage || !m.id) continue; const t = Date.parse(j.timestamp); if (!(t > since)) continue;
  if (p.includes(me) && !p.includes('subagents')) { const u=m.usage; ctxLast = (u.input_tokens||0)+(u.cache_read_input_tokens||0)+(u.cache_creation_input_tokens||0); }
  if (seen.has(m.id)) continue; seen.add(m.id);
  const k = (m.model||'?').replace(/^claude-/,''); const u = m.usage; const o = by[k] ||= {in:0,cache:0,out:0,n:0};
  o.in += (u.input_tokens||0)+(u.cache_creation_input_tokens||0); o.cache += u.cache_read_input_tokens||0; o.out += u.output_tokens||0; o.n++; } }
walk(root);
const tot = Object.values(by).reduce((a,o)=>a+o.in+o.cache+o.out,0);
for (const [k,o] of Object.entries(by).sort((a,b)=>(b[1].in+b[1].cache)-(a[1].in+a[1].cache))) {
  const s=o.in+o.cache+o.out; console.log(`${k.padEnd(18)} ${(s/1e6).toFixed(1).padStart(7)} M (${(100*s/tot).toFixed(1)}%)  out ${(o.out/1e3).toFixed(0)}k  msgs ${o.n}`); }
console.log(`TOTAL 24h ${(tot/1e6).toFixed(1)} M · contexto actual madre v4 ≈ ${ctxLast?Math.round(ctxLast/1e3)+'k':'?'}`);
