// Para los archivos que cambian SOLO texto: ¿alguna cadena que cambió parece una llave de lógica (sin espacios, ruta, constante)?
const ts = require("/opt/node22/lib/node_modules/typescript");
const { execSync } = require("node:child_process");
const [,, repo, base, head, ...archivos] = process.argv;
function literales(nombre, codigo) {
  const sf = ts.createSourceFile(nombre, codigo, ts.ScriptTarget.Latest, true, nombre.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  (function v(n) {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push(n.text);
    else if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) out.push(n.text);
    ts.forEachChild(n, v);
  })(sf);
  return out;
}
const git = (r) => { try { return execSync(r, { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1e8 }).toString(); } catch { return null; } };
let marcados = 0;
for (const a of archivos) {
  const A = git(`git -C ${repo} show ${base}:${JSON.stringify(a)}`), B = git(`git -C ${repo} show ${head}:${JSON.stringify(a)}`);
  if (A === null || B === null) continue;
  const la = literales(a, A), lb = literales(a, B);
  const cuenta = (xs) => xs.reduce((m, x) => (m.set(x, (m.get(x) || 0) + 1), m), new Map());
  const ca = cuenta(la), cb = cuenta(lb);
  const quitadas = [...ca].filter(([k, n]) => n > (cb.get(k) || 0)).map(([k]) => k);
  const puestas = [...cb].filter(([k, n]) => n > (ca.get(k) || 0)).map(([k]) => k);
  // «parece lógica»: una sola palabra/token sin espacios, o ruta, o MAYÚSCULAS_CON_GUION, o un código/clave
  const sospechosa = (s) => s.length > 0 && (!/\s/.test(s)) && !/^[¿¡]?[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+[.,:;!?»)]*$/.test(s);
  const sq = quitadas.filter(sospechosa), sp = puestas.filter(sospechosa);
  if (sq.length || sp.length) { marcados++; console.log(`\n${a}\n   quitadas: ${JSON.stringify(sq)}\n   puestas : ${JSON.stringify(sp)}`); }
}
console.log(`\narchivos con alguna cadena de un solo token cambiada: ${marcados} de ${archivos.length}`);
