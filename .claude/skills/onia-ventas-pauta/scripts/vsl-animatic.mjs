// Animatic del corto de 60 s del VSL: una lámina por segmento, con la pantalla marcada «Falta la captura aprobada».
// Sirve para que Sergio Urcullo vea el RITMO y qué toma o captura falta ANTES de grabar y de cortar (regla de oro de editor-videos).
// NO es el video: no tiene cámara, no tiene capturas, no se publica.
//   node vsl-animatic.mjs <tabla.json> <carpeta_salida>      → vsl-corto-preview-360p.mp4 + las láminas en PNG
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = createRequire("/opt/node-tools/node_modules/")("playwright"); }
const [tablaPath, out] = process.argv.slice(2);
if (!tablaPath || !out) { console.error("uso: node vsl-animatic.mjs <tabla.json> <carpeta_salida>"); process.exit(2); }
const tabla = JSON.parse(fs.readFileSync(tablaPath, "utf8"));
fs.mkdirSync(out, { recursive: true });
const abs = path.resolve(out); // el demuxer concat resuelve las rutas relativas contra la lista, no contra el cwd
const fuentes = path.join(path.dirname(fileURLToPath(import.meta.url)), "fonts");
const f = (n) => pathToFileURL(path.join(fuentes, n)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ESTADO = {
  se_graba_ya: ["SE GRABA YA", "#4DBD8C", "#0C110F"],
  espera_captura: ["FALTA LA CAPTURA APROBADA", "#F2C94C", "#0C110F"],
  espera_sergio: ["ESPERA UNA DECISIÓN DE SERGIO URCULLO", "#E08A5A", "#0C110F"],
};
const hex = (t) => String(t).replace(/\s+/g, " ");

function lamina(s, i, n) {
  const [etq, bg, fg] = ESTADO[s.estado] || ["—", "#8D9490", "#0C110F"];
  const caja = s.tipo === "pantalla"
    ? `<div class="pantalla"><b>Falta la captura aprobada</b><span>${esc(s.captura)} · ${esc(s.ve)}</span></div>`
    : `<div class="${s.tipo}"><span>${esc(s.ve)}</span></div>`;
  return `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Archivo;src:url(${f("archivo-latin.woff2")}) format("woff2");font-weight:100 900;font-stretch:62% 125%}
*{box-sizing:border-box;margin:0}body{width:720px;height:1280px;background:#0C110F;color:#ECEFED;font-family:Archivo,Arial,sans-serif;padding:56px 48px;display:flex;flex-direction:column;gap:26px}
.top{display:flex;justify-content:space-between;align-items:center;font-size:26px;color:#B3B9B5;letter-spacing:.04em}
.t{font-size:40px;font-weight:800;color:#ECEFED}
.dice{font-size:46px;line-height:1.16;font-weight:700;min-height:330px}
.dice.vacio{color:#8D9490;font-weight:500;font-size:34px}
.pantalla{flex:1;border:3px dashed #F2C94C;border-radius:22px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:16px;text-align:center;padding:28px}
.pantalla b{font-size:38px;color:#F2C94C}.pantalla span{font-size:26px;color:#B3B9B5;line-height:1.3}
.camara,.cartela{flex:1;border:3px solid #28302D;border-radius:22px;background:#151C19;display:flex;justify-content:center;align-items:center;text-align:center;padding:28px;font-size:28px;color:#B3B9B5;line-height:1.3}
.cartela{font-size:34px;color:#ECEFED}
.pie{display:flex;flex-direction:column;gap:12px}
.badge{align-self:flex-start;font-size:25px;font-weight:800;letter-spacing:.05em;background:${bg};color:${fg};border-radius:12px;padding:10px 18px}
.meta{font-size:22px;color:#8D9490;line-height:1.35}
</style><body>
<div class="top"><span class="t">${s.desde}–${s.hasta} s</span><span>${i + 1} / ${n} · ${esc(s.tipo)}</span></div>
<div class="dice ${s.dice ? "" : "vacio"}">${s.dice ? "«" + esc(s.dice) + "»" : "(sin voz)"}</div>
${caja}
<div class="pie"><div class="badge">${etq}</div><div class="meta">Toma: ${esc(s.toma || "—")} · Filas: ${esc(s.filas || "—")}</div></div>
</body>`;
}

const browser = await playwright.chromium.launch(fs.existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? { executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" } : {});
const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
const lista = [];
const segs = tabla.segmentos;
for (const [i, s] of segs.entries()) {
  await page.setContent(lamina(s, i, segs.length));
  await page.evaluate(() => document.fonts.ready);
  const png = path.join(abs, `lamina-${String(i + 1).padStart(2, "0")}.png`);
  await page.screenshot({ path: png });
  lista.push(`file '${png}'\nduration ${s.hasta - s.desde}`);
}
await browser.close();
lista.push(`file '${path.join(abs, `lamina-${String(segs.length).padStart(2, "0")}.png`)}'`);
const txt = path.join(abs, "lista.txt");
fs.writeFileSync(txt, lista.join("\n"));
const mp4 = path.join(out, "vsl-corto-preview-360p.mp4");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", txt, "-vf", "scale=360:640,fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "28", "-an", mp4]);
fs.unlinkSync(txt);
const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString().trim();
console.log(`listo: ${mp4} (${dur} s, 360x640)`);
