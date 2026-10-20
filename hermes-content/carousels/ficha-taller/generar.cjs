// Carruseles del taller «No pierdas clientes» en el estilo «Ficha» (elegido por Sergio Urcullo el 20-oct-2026).
// Mismo sistema que la página /taller: papel #F1F2EE, tinta #101318, un solo verde #047857,
// Big Shoulders Display + Hanken Grotesk. Fotos: Higgsfield fotobn (galeria/fotos-bn/taller-20261020-*).
// Uso: node hermes-content/carousels/ficha-taller/generar.cjs <brief.json> <carpeta-salida>
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

function playwrightCore() {
  const root = path.join(process.env.LOCALAPPDATA || "", "npm-cache", "_npx");
  const hit = fs.readdirSync(root)
    .map((d) => path.join(root, d, "node_modules", "playwright-core"))
    .filter((p) => fs.existsSync(p))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
  if (!hit) throw new Error("No hay playwright-core en la cache de npx");
  return require(hit);
}

const REPO = path.resolve(__dirname, "../../..");
const foto = (n) => pathToFileURL(path.join(REPO, "hermes-content/galeria/fotos-bn", n)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
// *palabra* = énfasis en verde (solo títulos)
const enf = (s) => esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");

const CSS = `*{box-sizing:border-box}html,body{margin:0}
body{width:1080px;height:1350px;overflow:hidden;background:#F1F2EE;color:#101318;font-family:'Hanken Grotesk',Arial,sans-serif;position:relative}
.cuad{position:absolute;inset:0;background-image:linear-gradient(#10131810 1px,transparent 1px),linear-gradient(90deg,#10131810 1px,transparent 1px);background-size:36px 36px}
.kick{font-weight:700;font-size:26px;letter-spacing:.12em;text-transform:uppercase;color:#047857;margin:0}
h1,h2{font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;margin:0;line-height:.88;letter-spacing:-.005em}
h1 em,h2 em{font-style:normal;color:#047857}
.pie{position:absolute;left:72px;right:72px;bottom:52px;display:flex;justify-content:space-between;font-weight:700;font-size:24px;letter-spacing:.1em;text-transform:uppercase;color:#4F5A55}
.ej{display:inline-block;align-self:flex-start;font-weight:700;font-size:22px;letter-spacing:.14em;text-transform:uppercase;border:3px solid #101318;border-radius:6px;padding:6px 14px;transform:rotate(-4deg);background:#FBFBF9}
.sub{font-size:46px;line-height:1.3;margin:0;color:#101318}
.gris{color:#4F5A55}
/* portada */
.portada .foto{position:absolute;left:0;right:0;top:0;height:720px;background-size:cover;background-position:center;border-bottom:3px solid #101318}
.portada .tx{position:absolute;left:72px;right:72px;top:780px}
.portada h1{font-size:132px;margin-top:18px}
/* número */
.numero .tx{position:absolute;left:72px;right:72px;top:110px;bottom:150px;display:flex;flex-direction:column}
.numero .n{font-family:'Big Shoulders Display';font-weight:900;font-size:640px;line-height:.78;margin:36px 0 26px;letter-spacing:-.02em}
.numero h2{font-size:128px}
.numero .sub{margin-top:auto;max-width:24ch;color:#4F5A55}
.numero .ej{position:absolute;right:72px;top:120px}
/* cuenta */
.cuenta .tx{position:absolute;left:72px;right:72px;top:110px;bottom:150px;display:flex;flex-direction:column}
.cuenta h2{font-size:150px;margin:30px 0 44px}
.tabla{border:3px solid #101318;border-radius:12px;background:#FBFBF9}
.tabla div{display:flex;justify-content:space-between;align-items:baseline;padding:34px 34px;border-top:2px solid #C9CFCC;font-size:42px}
.tabla div:first-child{border-top:0}
.tabla b{font-family:'Big Shoulders Display';font-weight:900;font-size:80px;line-height:1}
.tabla .total{background:#101318;color:#F1F2EE;border-radius:0 0 9px 9px}
.tabla .total b{color:#F1F2EE;font-size:108px}
.cuenta .sub{margin-top:auto}
/* frase con foto */
.frase .foto{position:absolute;left:0;right:0;bottom:130px;height:600px;border-bottom:3px solid #101318;background-size:cover;background-position:center;border-top:3px solid #101318}
.frase .tx{position:absolute;left:72px;right:72px;top:120px}
.frase h2{font-size:150px;margin-top:22px}
/* chat */
.chat-l .tx{position:absolute;left:72px;right:72px;top:100px;bottom:140px;display:flex;flex-direction:column}
.chat-l .num{font-family:'Big Shoulders Display';font-weight:900;font-size:120px;line-height:.8;color:#047857}
.chat-l h2{font-size:112px;margin:14px 0 50px}
.chat{position:relative;border:3px solid #101318;border-radius:22px;background:#E9ECE9;padding:40px 30px 26px}
.chat .ej{position:absolute;top:-24px;left:28px}
.msg{max-width:82%;background:#FBFBF9;border-radius:20px;padding:22px 26px;font-size:40px;line-height:1.28;margin:16px 0}
.msg small{display:block;text-align:right;font-size:24px;color:#5E6863;margin-top:4px}
.msg.yo{margin-left:auto;background:#D3EFE0}
.msg.auto{margin-left:auto;background:#D3EFE0;border:2.5px dashed #047857}
.sep{text-align:center;font-weight:700;font-size:24px;letter-spacing:.12em;text-transform:uppercase;color:#6B756F;margin:18px 0}
.chat-l .sub{margin-top:auto}
.atajos{display:flex;flex-direction:column;gap:14px}
.atajo{display:block;background:#FBFBF9;border-radius:18px;padding:22px 26px;font-size:40px;line-height:1.3}
.atajo b{display:block;font-size:30px;letter-spacing:.06em;text-transform:uppercase;color:#047857;margin-bottom:4px}
/* filtro */
.filtro .tx{position:absolute;left:72px;right:72px;top:110px}
.filtro h2{font-size:150px;margin:10px 0 40px}
.col{border-top:6px solid #101318;padding-top:22px;margin-bottom:36px}
.col.no{border-top-color:#C9CFCC}
.filtro .foto{position:absolute;left:0;right:0;bottom:130px;height:250px;background-size:cover;background-position:center 40%;border-top:3px solid #101318;border-bottom:3px solid #101318}
.col h3{font-size:52px;margin:0 0 14px}
.col li{font-size:44px;line-height:1.28;margin:8px 0}
.col ul{margin:0;padding-left:40px}
/* cierre */
.cierre{background:#101318;color:#F1F2EE}
.cierre .tx{position:absolute;left:72px;right:72px;top:130px}
.cierre .kick{color:#7FD3AE}
.cierre h2{font-size:140px;margin:24px 0 60px;color:#F1F2EE}
.cierre h2 em{color:#7FD3AE}
.ficha{display:grid;grid-template-columns:repeat(3,auto);border:3px solid #F1F2EE66;border-radius:12px;width:fit-content}
.ficha div{padding:20px 28px;border-left:2px solid #F1F2EE33}.ficha div:first-child{border:0}
.ficha small{display:block;font-weight:700;font-size:20px;letter-spacing:.12em;text-transform:uppercase;color:#B9C2BE}
.ficha strong{font-size:42px}
.cta{position:absolute;left:72px;right:72px;bottom:150px;background:#047857;color:#F7FAF8;border-radius:16px;padding:34px 40px;font-weight:700;font-size:52px;text-align:center}
.cierre .pie{color:#B9C2BE}`;

const LAMINAS = {
  portada: (l) => `<div class="portada"><div class="foto" style="background-image:url('${foto(l.foto)}')"></div>
    <div class="tx"><p class="kick">${esc(l.kicker)}</p><h1>${enf(l.titulo)}</h1></div></div>`,
  numero: (l) => `<div class="cuad"></div><div class="numero">${l.ejemplo ? '<span class="ej">Ejemplo</span>' : ""}<div class="tx">
    <p class="kick">${esc(l.kicker)}</p><div class="n">${esc(l.n)}</div><h2>${enf(l.titulo)}</h2><p class="sub">${esc(l.sub)}</p></div></div>`,
  cuenta: (l) => `<div class="cuad"></div><div class="cuenta"><div class="tx"><span class="ej">Ejemplo</span><h2>${enf(l.titulo)}</h2>
    <div class="tabla">${l.filas.map(([a, b], i) => `<div class="${i === l.filas.length - 1 ? "total" : ""}"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join("")}</div>
    <p class="sub gris">${esc(l.sub)}</p></div></div>`,
  frase: (l) => `<div class="frase"><div class="tx"><p class="kick">${esc(l.kicker)}</p><h2>${enf(l.titulo)}</h2></div>
    <div class="foto" style="background-image:url('${foto(l.foto)}')"></div></div>`,
  chat: (l) => `<div class="cuad"></div><div class="chat-l"><div class="tx"><div class="num">${esc(l.num)}</div><h2>${enf(l.titulo)}</h2>
    <div class="chat"><span class="ej">Ejemplo</span>${l.chat.map((m) => m.sep ? `<div class="sep">${esc(m.sep)}</div>`
      : `<div class="msg ${esc(m.de || "")}">${esc(m.t)}<small>${esc(m.h)}</small></div>`).join("")}</div>
    <p class="sub gris">${esc(l.sub)}</p></div></div>`,
  atajos: (l) => `<div class="cuad"></div><div class="chat-l"><div class="tx"><div class="num">${esc(l.num)}</div><h2>${enf(l.titulo)}</h2>
    <div class="chat"><span class="ej">Ejemplo</span><div class="atajos">${l.atajos.map(([a, b]) => `<div class="atajo"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div></div>
    <p class="sub gris">${esc(l.sub)}</p></div></div>`,
  filtro: (l) => `<div class="cuad"></div><div class="filtro"><div class="tx"><h2>${enf(l.titulo)}</h2>
    <div class="col"><h3>Sí, si…</h3><ul>${l.si.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="col no"><h3>No, si…</h3><ul>${l.no.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>${l.foto ? `<div class="foto" style="background-image:url('${foto(l.foto)}')"></div>` : ""}</div>`,
  cierre: (l) => `<div class="tx"><p class="kick">${esc(l.kicker)}</p><h2>${enf(l.titulo)}</h2>
    <div class="ficha">${l.ficha.map(([a, b]) => `<div><small>${esc(a)}</small><strong>${esc(b)}</strong></div>`).join("")}</div></div>
    <div class="cta">${esc(l.cta)}</div>`,
};

(async () => {
  const [briefPath, outArg] = process.argv.slice(2);
  if (!briefPath || !outArg) { console.error("Uso: node generar.cjs <brief.json> <carpeta-salida>"); process.exit(2); }
  const out = path.resolve(outArg);
  const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
  fs.mkdirSync(out, { recursive: true });
  const { chromium } = playwrightCore();
  const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    for (const [i, l] of brief.laminas.entries()) {
      const hacer = LAMINAS[l.tipo];
      if (!hacer) throw new Error(`Lámina ${i + 1}: tipo desconocido «${l.tipo}»`);
      const total = brief.laminas.length;
      const pie = l.tipo === "cierre" ? "" : `<div class="pie"><span>Sergio Urcullo</span><span>${i + 1}/${total}${i < total - 1 ? " · seguí →" : ""}</span></div>`;
      const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Hanken+Grotesk:wght@400;700&display=swap">
<style>${CSS}</style></head><body class="${l.tipo === "cierre" ? "cierre" : ""}">${hacer(l)}${pie}</body></html>`;
      const f = path.join(out, `lamina-${String(i + 1).padStart(2, "0")}.html`);
      fs.writeFileSync(f, html);
      await page.goto("file:///" + f.replace(/\\/g, "/"), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: f.replace(/\.html$/, ".png") });
    }
  } finally { await browser.close(); }
  console.log(`ok ${brief.laminas.length} láminas en ${out}`);
})().catch((e) => { console.error("FALLO", e.message); process.exit(1); });
