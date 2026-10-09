// Graba la app de Onia (video + fotos) con un cursor grande y anillos, desde un plan en JSON.
// Sirve para dos cosas: las capturas C1-C7 del VSL dental y mirar una fila de ONIA_PROMESA_VS_PRODUCTO.md.
//
// Uso (cuenta de PRUEBA en el entorno, nunca en el chat):
//   ONIA_QA_EMAIL=... ONIA_QA_PASSWORD=... node grabar-captura.mjs <plan.json> <carpeta_salida>
//   node grabar-captura.mjs <plan.json> <carpeta_salida> --sin-login --base http://127.0.0.1:8765   (probar el guion en un mock)
//
// Plan (ver grabar-captura.ejemplo.json): { nombre, vista:[1366,900], pasos:[ ... ] }. Pasos:
//   {ir:"/agenda"} · {esperar:ms} · {mover:"selector", pausa:ms} · {anillo:"selector"} · {sin_anillos:true}
//   {foto:"C1-agenda"} · {clic:"selector", envio:true}
// Selectores = los del locator de Playwright ("text=Sin confirmar", "button:has-text('Aprobar')").
//
// FRENOS (nace de la nota del VSL: un clic en «Aprobar» puede mandar un mensaje de verdad):
//  1. La cuenta tiene que parecer de prueba (correo con qa, demo, prueba o test); si no, no entra.
//  2. Un clic en algo que diga aprobar, enviar, confirmar, pagar, cobrar, eliminar o borrar tiene que declarar
//     "envio": true, y aun así solo corre con ONIA_GRABAR_PERMITE_ENVIO=1 (se pone DESPUÉS de verificar en G-01
//     a quién le llega). Se revisa el plan entero ANTES de abrir el navegador y el texto real del botón antes del clic.
//  3. No hay «escribir» en formularios: la grabación mira, no carga datos.
// Salida: <nombre>.mp4 (H.264, sin audio), las fotos en PNG y <nombre>.log.json con URL final y tiempos por paso.
// En la nube, Chromium no confía en la CA del proxy: se le pasa la huella SPKI, igual que auditar-app.mjs.
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = createRequire("/opt/node-tools/node_modules/")("playwright"); }
const { chromium } = playwright;

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const valor = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const pos = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && ["--base"].includes(args[i - 1])));
const [planPath, out] = pos;
if (!planPath || !out) { console.error("uso: node grabar-captura.mjs <plan.json> <carpeta_salida> [--sin-login] [--base URL]"); process.exit(2); }

const BASE = valor("--base") || process.env.ONIA_APP_URL || "https://app.onia.com.bo";
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const nombre = (plan.nombre || "captura").replace(/[^a-z0-9_-]+/gi, "_");
const [W, H] = plan.vista || [1366, 900];
const PELIGROSO = /aprobar|enviar|confirmar|pagar|cobrar|eliminar|borrar|cancelar cita|guardar/i;
const permiteEnvio = process.env.ONIA_GRABAR_PERMITE_ENVIO === "1";

// ---- Frenos que se revisan ANTES de abrir nada ----
const pasos = plan.pasos || [];
const claves = new Set(["ir", "esperar", "mover", "anillo", "sin_anillos", "foto", "clic", "pausa", "envio"]);
for (const [i, p] of pasos.entries()) {
  const mal = Object.keys(p).filter((k) => !claves.has(k));
  if (mal.length) { console.error(`paso ${i + 1}: clave desconocida (${mal.join(", ")}). No hay «escribir»: esto mira, no carga datos.`); process.exit(4); }
  if (p.clic) {
    const dice = PELIGROSO.test(p.clic);
    if (dice && !p.envio) { console.error(`paso ${i + 1}: el clic «${p.clic}» suena a enviar o cambiar algo. Declare "envio": true o quítelo.`); process.exit(4); }
    if (p.envio && !permiteEnvio) { console.error(`paso ${i + 1}: clic con "envio": true y falta ONIA_GRABAR_PERMITE_ENVIO=1. Antes: G-01, a quién le llega «Aprobar».`); process.exit(4); }
  }
}

const sinLogin = flag("--sin-login");
const email = process.env.ONIA_QA_EMAIL, password = process.env.ONIA_QA_PASSWORD;
if (!sinLogin) {
  if (!email || !password) { console.error("faltan ONIA_QA_EMAIL y ONIA_QA_PASSWORD en el entorno"); process.exit(2); }
  if (!/(qa|demo|prueba|test)/i.test(email)) { console.error("el correo no parece de una cuenta de prueba: no se graba con una cuenta real ni con la de superadmin"); process.exit(4); }
}
fs.mkdirSync(out, { recursive: true });

// ---- Navegador (en la nube: Chromium completo + proxy + huella SPKI) ----
function spkiDeLaNube() {
  const bundle = "/root/.ccr/ca-bundle.crt";
  if (!process.env.HTTPS_PROXY || !fs.existsSync(bundle)) return null;
  const certs = fs.readFileSync(bundle, "utf8").match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || [];
  const huellas = new Set();
  for (const c of certs) {
    const subj = execFileSync("openssl", ["x509", "-noout", "-subject"], { input: c }).toString();
    if (!/O = Anthropic/.test(subj) || !/production/.test(subj)) continue;
    const pub = execFileSync("openssl", ["x509", "-pubkey", "-noout"], { input: c });
    const der = execFileSync("openssl", ["pkey", "-pubin", "-outform", "der"], { input: pub });
    huellas.add(execFileSync("openssl", ["dgst", "-sha256", "-binary"], { input: der }).toString("base64"));
  }
  return [...huellas].join(",");
}
const local = /^https?:\/\/(127\.0\.0\.1|localhost)/.test(BASE);
const spki = local ? null : spkiDeLaNube();
const opciones = spki
  ? { executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", proxy: { server: process.env.HTTPS_PROXY }, args: [`--ignore-certificate-errors-spki-list=${spki}`] }
  : { executablePath: fs.existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome") ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" : undefined };
const browser = await chromium.launch(opciones);
const tmp = path.join(out, `.video-${nombre}`);
fs.mkdirSync(tmp, { recursive: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: tmp, size: { width: W, height: H } } });

// Cursor grande (flecha de 44 px, borde claro y sombra para que se lea sobre cualquier fondo) que sigue al mouse de Playwright.
await ctx.addInitScript(() => {
  const poner = () => {
    if (document.getElementById("__cursor")) return;
    const c = document.createElement("div");
    c.id = "__cursor";
    c.style.cssText = "position:fixed;left:0;top:0;width:44px;height:44px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);filter:drop-shadow(0 3px 5px rgba(0,0,0,.45))";
    c.innerHTML = '<svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 2l16 9.2-7.1 1.6L9.4 20z" fill="#0C110F" stroke="#ECEFED" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    // Cada página nueva es un documento nuevo: sin esto el cursor desaparece al navegar. La última posición viaja en sessionStorage.
    try { const g = JSON.parse(sessionStorage.getItem("__cur") || "null"); if (g) c.style.transform = `translate(${g[0]}px,${g[1]}px)`; } catch {}
    addEventListener("mousemove", (e) => {
      c.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      try { sessionStorage.setItem("__cur", JSON.stringify([e.clientX, e.clientY])); } catch {}
    }, true);
  };
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", poner); else poner();
});
const tCtx = Date.now(); // el video empieza aquí: lo que pasa antes del primer paso (el login) se recorta
const page = await ctx.newPage();
const log = { nombre, base: BASE, vista: [W, H], pasos: [] };
let mx = W / 2, my = H / 2;

async function caja(selector) {
  const loc = page.locator(selector).first();
  await loc.waitFor({ state: "visible", timeout: 15000 });
  await loc.scrollIntoViewIfNeeded();
  const b = await loc.boundingBox();
  if (!b) throw new Error(`sin caja visible: ${selector}`);
  return { loc, b };
}
async function mover(selector, pausa = 500) {
  const { b } = await caja(selector);
  // la punta cae al 80 % del ancho y al 65 % del alto: señala el elemento sin tapar su texto
  const x = Math.round(b.x + b.width * 0.8), y = Math.round(b.y + b.height * 0.65);
  await page.mouse.move(x, y, { steps: 35 });
  mx = x; my = y;
  await page.waitForTimeout(pausa);
}

if (!sinLogin) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/login") || u.pathname.startsWith("/login/2fa"), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
  if (page.url().includes("/login")) { console.error("no entró o pide 2FA: usar una cuenta de prueba sin 2FA"); await ctx.close(); await browser.close(); process.exit(3); }
  log.entro = new URL(page.url()).pathname;
}
log.t0_ms = null;

for (const [i, p] of pasos.entries()) {
  const t = Date.now();
  if (log.t0_ms === null) log.t0_ms = t - tCtx;
  const paso = { n: i + 1, ...p };
  try {
    if (p.ir) { const r = await page.goto(`${BASE}${p.ir}`, { waitUntil: "networkidle", timeout: 45000 }); paso.status = r ? r.status() : 0; await page.waitForTimeout(600); }
    else if (p.esperar) await page.waitForTimeout(p.esperar);
    else if (p.mover) await mover(p.mover, p.pausa ?? 500);
    else if (p.anillo) {
      const { b } = await caja(p.anillo);
      await page.evaluate(({ x, y, w, h }) => {
        const r = document.createElement("i");
        r.className = "__anillo";
        r.style.cssText = `position:fixed;left:${x - 6}px;top:${y - 6}px;width:${w + 12}px;height:${h + 12}px;border:3px solid #ECEFED;border-radius:12px;box-shadow:0 0 0 3px rgba(12,17,15,.55);pointer-events:none;z-index:2147483646`;
        document.documentElement.appendChild(r);
      }, { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) });
    }
    else if (p.sin_anillos) await page.evaluate(() => document.querySelectorAll(".__anillo").forEach((e) => e.remove()));
    else if (p.foto) await page.screenshot({ path: path.join(out, `${p.foto.replace(/[^a-z0-9_-]+/gi, "_")}.png`) });
    else if (p.clic) {
      const { loc } = await caja(p.clic);
      const dice = ((await loc.innerText().catch(() => "")) + " " + (await loc.getAttribute("aria-label").catch(() => "") || "")).trim();
      if (PELIGROSO.test(dice) && !(p.envio && permiteEnvio)) throw new Error(`el botón dice «${dice.slice(0, 40)}» y el paso no declaró envio con ONIA_GRABAR_PERMITE_ENVIO=1`);
      await mover(p.clic, p.pausa ?? 400);
      await page.mouse.down(); await page.waitForTimeout(90); await page.mouse.up();
      await page.waitForTimeout(900);
    }
    else throw new Error("paso sin acción reconocida");
    paso.ok = true;
  } catch (e) { paso.ok = false; paso.error = e.message.split("\n")[0]; }
  paso.ms = Date.now() - t;
  log.pasos.push(paso);
  console.log(`${paso.ok ? "ok " : "ERR"} ${i + 1}. ${JSON.stringify(p)}${paso.ok ? "" : "  → " + paso.error}`);
  if (!paso.ok) break;
}
log.url_final = page.url();
const video = page.video();
await ctx.close();
const webm = await video.path();
await browser.close();

const mp4 = path.join(out, `${nombre}.mp4`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(((log.t0_ms ?? 0) / 1000).toFixed(2)), "-i", webm, "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-r", "30", "-crf", "18", mp4]);
fs.unlinkSync(webm);
fs.rmdirSync(tmp);
fs.writeFileSync(path.join(out, `${nombre}.log.json`), JSON.stringify(log, null, 2));
console.log(`listo: ${mp4}`);
process.exit(log.pasos.every((p) => p.ok) ? 0 : 5);
