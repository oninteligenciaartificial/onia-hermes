// First Load JS por ruta desde .next (webpack build). Uso: node firstload.js <dir .next>
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const NEXT = process.argv[2];
const bm = JSON.parse(fs.readFileSync(path.join(NEXT, 'build-manifest.json')));
const root = bm.rootMainFiles;
const gz = {};
const size = f => {
  if (gz[f]) return gz[f];
  const p = path.join(NEXT, f);
  if (!fs.existsSync(p)) return (gz[f] = { raw: 0, gz: 0 });
  const b = fs.readFileSync(p);
  return (gz[f] = { raw: b.length, gz: zlib.gzipSync(b, { level: 6 }).length });
};
const out = [];
const walk = d => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'page_client-reference-manifest.js') {
      const src = fs.readFileSync(p, 'utf8');
      const g = { globalThis: {} };
      new Function('globalThis', src)(g.globalThis);
      const man = g.globalThis.__RSC_MANIFEST;
      const key = Object.keys(man)[0];
      const files = new Set(root);
      for (const m of Object.values(man[key].clientModules || {})) for (const c of (m.chunks || [])) if (typeof c === 'string' && c.endsWith('.js')) files.add(c.startsWith('static/') ? c : c.replace(/^\/?_next\//, ''));
      const css = new Set();
      for (const k of Object.keys(man[key].entryCSSFiles || {})) for (const c of man[key].entryCSSFiles[k]) css.add(c.path || c);
      let r = 0, z = 0, cr = 0, cz = 0;
      for (const f of files) { const s = size(f); r += s.raw; z += s.gz; }
      for (const f of css) { const s = size(f); cr += s.raw; cz += s.gz; }
      out.push({ route: key, n: files.size, js_raw_kb: +(r / 1024).toFixed(1), js_gz_kb: +(z / 1024).toFixed(1), css_gz_kb: +(cz / 1024).toFixed(1) });
    }
  }
};
walk(path.join(NEXT, 'server', 'app'));
out.sort((a, b) => b.js_gz_kb - a.js_gz_kb);
const rootGz = root.reduce((s, f) => s + size(f).gz, 0);
console.log('rootMainFiles gz KB', (rootGz / 1024).toFixed(1), root.map(f => `${path.basename(f)}=${(size(f).gz / 1024).toFixed(1)}`).join(' '));
const want = process.argv[3] ? new RegExp(process.argv[3]) : null;
for (const o of out) if (!want || want.test(o.route)) console.log(`${o.js_gz_kb}\t${o.js_raw_kb}\t${o.n}\t${o.css_gz_kb}\t${o.route}`);
