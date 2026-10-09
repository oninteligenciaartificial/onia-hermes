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
// FRENOS (nace de la nota del VSL: un clic en «Aprobar» puede mandar un mensaje de verdad). Revisados por un
// subagente independiente el 9-oct: el primer borrador dejaba pasar <input type=submit value="Aprobar">, «Aprobá»
// (voseo) y un --base ajeno. Por eso NO se adivina qué botón es peligroso por su texto:
//  1. TODO clic declara "envio": true y solo corre con ONIA_GRABAR_PERMITE_ENVIO=1 (se pone DESPUÉS de verificar en
//     G-01 a quién le llega). El plan entero se revisa ANTES de abrir el navegador.
//  2. El selector de un clic tiene que dar EXACTAMENTE un elemento, y el clic cae sobre él (Playwright comprueba
//     que nada lo tape); el texto del botón queda en el .log.json.
//  3. La cuenta tiene que ser de prueba (correo con qa, demo, prueba o test como palabra); si no, no entra.
//  4. Solo se navega a rutas del propio sitio (nada de //otro-host, @ ni /api/): un GET puede mutar datos.
//  5. --base solo acepta app.onia.com.bo, 127.0.0.1 y localhost; la contraseña no viaja a otro host.
//  6. No hay «escribir» en formularios: la grabación mira, no carga datos.
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
for (const a of args) {
  if (a.startsWith("--") && !["--sin-login", "--base"].includes(a)) { console.error(`opción desconocida: ${a} (la forma es «--base URL», sin «=»)`); process.exit(2); }
}
const flag = (n) => args.includes(n);
const valor = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const pos = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && ["--base"].includes(args[i - 1])));
const [planPath, out] = pos;
if (!planPath || !out) { console.error("uso: node grabar-captura.mjs <plan.json> <carpeta_salida> [--sin-login] [--base URL]"); process.exit(2); }

const BASE = valor("--base") || process.env.ONIA_APP_URL || "https://app.onia.com.bo";
let urlBase;
try { urlBase = new URL(BASE); } catch { console.error(`--base no es una URL: ${BASE}`); process.exit(2); }
if (!["app.onia.com.bo", "127.0.0.1", "localhost"].includes(urlBase.hostname) || !/^https?:$/.test(urlBase.protocol)) {
  console.error(`--base ${urlBase.hostname}: solo app.onia.com.bo, 127.0.0.1 o localhost. La contraseña no viaja a otro host.`); process.exit(4);
}
const esLocal = ["127.0.0.1", "localhost"].includes(urlBase.hostname);
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const nombre = (plan.nombre || "captura").replace(/[^a-z0-9_-]+/gi, "_");
const [W, H] = plan.vista || [1366, 900];
const permiteEnvio = process.env.ONIA_GRABAR_PERMITE_ENVIO === "1";

// ---- Frenos que se revisan ANTES de abrir nada ----
const pasos = plan.pasos || [];
const claves = new Set(["ir", "esperar", "mover", "anillo", "sin_anillos", "foto", "clic", "pausa", "envio"]);
for (const [i, p] of pasos.entries()) {
  const mal = Object.keys(p).filter((k) => !claves.has(k));
  if (mal.length) { console.error(`paso ${i + 1}: clave desconocida (${mal.join(", ")}). No hay «escribir»: esto mira, no carga datos.`); process.exit(4); }
  if (p.clic !== undefined) {
    if (p.envio !== true) { console.error(`paso ${i + 1}: todo clic declara "envio": true (un clic puede mandar un mensaje de verdad, y por el texto no se adivina cuál).`); process.exit(4); }
    if (!permiteEnvio) { console.error(`paso ${i + 1}: clic con "envio": true y falta ONIA_GRABAR_PERMITE_ENVIO=1. Antes: G-01, a quién le llega «Aprobar».`); process.exit(4); }
  }
  if (p.ir !== undefined && !(typeof p.ir === "string" && /^\/(?![\/\\])/.test(p.ir) && !/[@\\]|^\/api\//i.test(p.ir))) {
    console.error(`paso ${i + 1}: «ir» solo acepta una ruta del sitio que empiece con una sola «/» (sin @, sin barras invertidas y sin /api/).`); process.exit(4);
  }
}

const sinLogin = flag("--sin-login");
const email = process.env.ONIA_QA_EMAIL, password = process.env.ONIA_QA_PASSWORD;
if (sinLogin && !esLocal) { console.error("--sin-login solo con un --base local (127.0.0.1 o localhost)"); process.exit(4); }
if (!sinLogin) {
  if (!email || !password) { console.error("faltan ONIA_QA_EMAIL y ONIA_QA_PASSWORD en el entorno"); process.exit(2); }
  if (!/(^|[._+-])(qa|demo|prueba|test)\d*([._+-]|@)/i.test(email)) { console.error("el correo no parece de una cuenta de prueba: no se graba con una cuenta real ni con la de superadmin"); process.exit(4); }
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
const spki = esLocal ? null : spkiDeLaNube();
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
const page = await ctx.newPage();
const tCtx = Date.now(); // el video empieza con la página: lo que pasa antes del primer paso (el login) se recorta
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

// Todo lo que deja el login (el .webm trae el correo y puntos por la clave) se borra si algo falla antes de grabar.
async function abortar(codigo, mensaje) {
  console.error(mensaje);
  await ctx.close().catch(() => {}); await browser.close().catch(() => {});
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(codigo);
}
if (!sinLogin) {
  try {
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#login-email", email);
    await page.fill("#login-password", password);
    await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/login") || u.pathname.startsWith("/login/2fa"), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
  } catch (e) {
    // el «Call log» de Playwright puede traer el valor que se estaba escribiendo: solo la primera línea
    await abortar(3, `el login falló: ${String(e.message).split("\n")[0].replace(password, "***")}`);
  }
  if (page.url().includes("/login")) await abortar(3, "no entró o pide 2FA: usar una cuenta de prueba sin 2FA");
  log.entro = new URL(page.url()).pathname;
}
log.t0_ms = null;

for (const [i, p] of pasos.entries()) {
  const t = Date.now();
  if (log.t0_ms === null) log.t0_ms = t - tCtx;
  const paso = { n: i + 1, ...p };
  try {
    if (p.ir) { const r = await page.goto(`${BASE}${p.ir}`, { waitUntil: "networkidle", timeout: 45000 }); paso.status = r ? r.status() : 0; await page.waitForTimeout(600); }
    else if (p.esperar !== undefined) await page.waitForTimeout(Number(p.esperar) || 0);
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
    else if (p.clic !== undefined) {
      const n = await page.locator(p.clic).count();
      if (n !== 1) throw new Error(`el selector del clic da ${n} elementos y tiene que dar exactamente 1: acótelo a la tarjeta`);
      const { loc, b } = await caja(p.clic);
      paso.boton = ((await loc.evaluate((e) => (e.innerText || e.value || e.title || e.getAttribute("aria-label") || e.tagName))).slice(0, 60));
      await mover(p.clic, p.pausa ?? 400);
      // el clic cae donde está la punta del cursor, sobre el mismo elemento, y Playwright falla si algo lo tapa
      await loc.click({ position: { x: b.width * 0.8, y: b.height * 0.65 }, timeout: 5000 });
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
