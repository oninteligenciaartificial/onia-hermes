// Variante a11y: además de los textos, descarta los atributos aria-* y role de JSX. Si dos versiones dan lo mismo, la diferencia es SOLO texto y atributos de accesibilidad.
// Si dos versiones dan el mismo resultado, la diferencia es SOLO texto.
const ts = require("/opt/node22/lib/node_modules/typescript");
const { execSync } = require("node:child_process");
const [,, repo, base, head, ...archivos] = process.argv;
function normalizar(nombre, codigo) {
  const sf = ts.createSourceFile(nombre, codigo, ts.ScriptTarget.Latest, true, nombre.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const f = ts.factory;
  const tr = (ctx) => (root) => {
    const visit = (n) => {
      if (ts.isStringLiteral(n)) return f.createStringLiteral("§");
      if (ts.isNoSubstitutionTemplateLiteral(n)) return f.createNoSubstitutionTemplateLiteral("§", "§");
      if (ts.isTemplateHead(n)) return f.createTemplateHead("§", "§");
      if (ts.isTemplateMiddle(n)) return f.createTemplateMiddle("§", "§");
      if (ts.isTemplateTail(n)) return f.createTemplateTail("§", "§");
      if (ts.isJsxAttributes(n)) {
        const keep = n.properties.filter((a) => !(ts.isJsxAttribute(a) && /^(aria-|role$)/.test(a.name.getText())));
        return ts.visitEachChild(f.createJsxAttributes(keep), visit, ctx);
      }
      if (ts.isJsxText(n)) return f.createJsxText(n.containsOnlyTriviaWhiteSpaces ? "" : "§", n.containsOnlyTriviaWhiteSpaces);
      return ts.visitEachChild(n, visit, ctx);
    };
    return ts.visitNode(root, visit);
  };
  const out = ts.transform(sf, [tr]);
  const printer = ts.createPrinter({ removeComments: true });
  const txt = printer.printFile(out.transformed[0]);
  // JSX: dos textos pegados a una expresión pueden fundirse distinto; se compara sin espacios en blanco
  return txt.replace(/\s+/g, " ").replace(/§(\s*§)+/g, "§");
}
const resultado = { soloTexto: [], estructura: [], nuevos: [], borrados: [] };
for (const a of archivos) {
  let antes = null, despues = null;
  try { antes = execSync(`git -C ${repo} show ${base}:${JSON.stringify(a)}`, { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1e8 }).toString(); } catch {}
  try { despues = execSync(`git -C ${repo} show ${head}:${JSON.stringify(a)}`, { stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1e8 }).toString(); } catch {}
  if (antes === null) { resultado.nuevos.push(a); continue; }
  if (despues === null) { resultado.borrados.push(a); continue; }
  if (!/\.(ts|tsx)$/.test(a)) continue;
  const A = normalizar(a, antes), B = normalizar(a, despues);
  if (A === B) resultado.soloTexto.push(a); else resultado.estructura.push(a);
}
console.log(JSON.stringify(resultado, null, 1));
