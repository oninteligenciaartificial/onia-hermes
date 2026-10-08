// Auditoría de app.onia.com.bo por dentro: SOLO LECTURA (navega y captura; no crea ni cambia datos).
//
// Uso (desde la PC o desde la nube con las variables cargadas en el entorno, nunca en el chat):
//   ONIA_QA_EMAIL=... ONIA_QA_PASSWORD=... node auditar-app.mjs <carpeta_salida> [ruta ...]
// Sin rutas, recorre las de PANTALLAS. Por cada una deja <slug>_d.png (1366 px), <slug>_m.png (390 px)
// y <slug>.txt (status, URL final, ms, errores de consola y texto visible). Si la ruta redirige
// (login, plan, 404), la URL final lo dice: eso ya es un resultado.
//
// En la nube, Chromium no confía en la CA del proxy de la sesión: se le pasa el proxy y la huella
// (SPKI) de las CA de intercepción declaradas en /root/.ccr/ca-bundle.crt. En la PC no hace falta.
// Nace del 8-oct (auditoría promesa contra lo que funciona, pedido de la madre).
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = createRequire("/opt/node-tools/node_modules/")("playwright"); }
const { chromium } = playwright;

const BASE = process.env.ONIA_APP_URL || "https://app.onia.com.bo";
const PANTALLAS = [
  "/dashboard", "/agenda", "/appointments", "/patients", "/patients/new", "/treatments", "/billing",
  "/billing/recurring", "/inventory", "/pending", "/agents", "/reports", "/contabilidad", "/rrhh",
  "/empresa", "/empresa/gastos", "/requerimientos", "/inbox", "/communications", "/settings",
  "/settings/chatbot", "/team", "/team/roles", "/checkout", "/help", "/mi-web", "/onboarding",
];

function spkiDeLaNube() {
  const bundle = "/root/.ccr/ca-bundle.crt";
  if (!process.env.HTTPS_PROXY || !fs.existsSync(bundle)) return null;
  const pem = fs.readFileSync(bundle, "utf8");
  const certs = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || [];
  const huellas = new Set();
  for (const c of certs) {
    const subj = execFileSync("openssl", ["x509", "-noout", "-subject"], { input: c }).toString();
    if (!/O = Anthropic/.test(subj) || !/production/.test(subj)) continue;
    const pub = execFileSync("openssl", ["x509", "-pubkey", "-noout"], { input: c });
    const der = execFileSync("openssl", ["pkey", "-pubin", "-outform", "der"], { input: pub });
    const h = execFileSync("openssl", ["dgst", "-sha256", "-binary"], { input: der });
    huellas.add(h.toString("base64"));
  }
  return [...huellas].join(",");
}

const [out, ...rutas] = process.argv.slice(2);
if (!out) { console.error("uso: node auditar-app.mjs <carpeta_salida> [ruta ...]"); process.exit(2); }
const email = process.env.ONIA_QA_EMAIL, password = process.env.ONIA_QA_PASSWORD;
if (!email || !password) { console.error("faltan ONIA_QA_EMAIL y ONIA_QA_PASSWORD en el entorno"); process.exit(2); }
fs.mkdirSync(out, { recursive: true });

const spki = spkiDeLaNube();
const opciones = spki
  ? { executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", proxy: { server: process.env.HTTPS_PROXY }, args: [`--ignore-certificate-errors-spki-list=${spki}`] }
  : {};
const browser = await chromium.launch(opciones);
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();

await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.fill("#login-email", email);
await page.fill("#login-password", password);
await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/login") || u.pathname.startsWith("/login/2fa"), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
if (page.url().includes("/login/2fa")) { console.error("la cuenta pide 2FA: usar una cuenta de prueba sin 2FA"); await browser.close(); process.exit(3); }
if (page.url().includes("/login")) { console.error("no entró: revisar las credenciales"); await page.screenshot({ path: path.join(out, "login-fallo.png") }); await browser.close(); process.exit(3); }
console.log("entró:", page.url());

for (const ruta of rutas.length ? rutas : PANTALLAS) {
  const slug = ruta.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "raiz";
  const errores = [];
  const oyente = (m) => { if (m.type() === "error") errores.push(m.text().slice(0, 200)); };
  page.on("console", oyente);
  const t0 = Date.now();
  let status = 0;
  try { const r = await page.goto(`${BASE}${ruta}`, { waitUntil: "networkidle", timeout: 45000 }); status = r ? r.status() : 0; }
  catch (e) { status = `ERR ${e.message.split("\n")[0]}`; }
  const ms = Date.now() - t0;
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, `${slug}_d.png`), fullPage: true }).catch(() => {});
  const texto = await page.evaluate(() => document.body?.innerText || "").catch(() => "");
  fs.writeFileSync(path.join(out, `${slug}.txt`), `RUTA: ${ruta}\nSTATUS: ${status}\nFINAL: ${page.url()}\nMS: ${ms}\nERRORES_CONSOLA: ${errores.length}\n${errores.join("\n")}\n\n${texto}`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(out, `${slug}_m.png`), fullPage: true }).catch(() => {});
  await page.setViewportSize({ width: 1366, height: 900 });
  page.off("console", oyente);
  console.log(`${ruta} -> ${status} ${new URL(page.url()).pathname} ${ms}ms errores=${errores.length}`);
}
await browser.close();
