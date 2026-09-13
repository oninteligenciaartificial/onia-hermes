/**
 * Recorre una pantalla de venta ENTERA, de arriba a abajo, y guarda una foto
 * por viewport. Existe porque `mirar-primera-pantalla.mjs` sólo mira lo que
 * entra sin scrollear, y todo lo que está bajo el pliegue —los precios, la
 * banda de rubros, el pie— no lo mira NADIE: los tests leen archivos fuente y
 * el canario visual está congelado.
 *
 * Las trampas de instrumento que ya nos costaron una vuelta cada una están
 * tapadas acá, y son las mismas de `mirar-primera-pantalla.mjs`:
 *
 *  1. scroll suave -> `scrollTo` ANIMA y la foto sale a mitad de camino, con
 *     la tarjeta cortada: la misma firma que un bug real. Se apaga
 *     `scroll-behavior` ANTES de mover nada y se espera el scroll de verdad
 *     con `waitForFunction`, no con un timeout (2026-09-03).
 *  2. fullPage congela un fotograma distinto en cada corrida sobre secciones
 *     `sticky`, así que un defecto "reproducido" puede ser el instrumento. Se
 *     va por viewport (2026-09-03).
 *  3. chunk 404 -> la página sale en blanco y parece un bug del sitio. Se
 *     escucha `response` y cualquier >=400 sale en el informe (2026-09-03).
 *
 * Uso: node scripts/recorrer-portada.mjs [http://127.0.0.1:4321] [/ruta]
 *      OUT_DIR=/tmp/x CHROME_PATH=/ruta/al/chrome node scripts/recorrer-portada.mjs
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] || "http://127.0.0.1:4321";
const ruta = process.argv[3] || "/";
const out = process.env.OUT_DIR || "/tmp/wv-recorrido";
const ancho = Number(process.env.ANCHO || 1366);
const alto = Number(process.env.ALTO || 900);

mkdirSync(out, { recursive: true });

const navegador = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
// reducedMotion: el recorrido va sacando capturas mientras baja, o sea justo
// cuando las animaciones estan corriendo. Ver
// scripts/navegador-sin-animacion.test.ts (Bs 364 fantasma, 2026-09-12).
const pagina = await navegador.newPage({
  viewport: { width: ancho, height: alto },
  reducedMotion: "reduce",
});

const rotos = [];
pagina.on("response", (r) => {
  if (r.status() >= 400) rotos.push(`${r.status()} ${r.url()}`);
});

await pagina.goto(base + ruta, { waitUntil: "networkidle", timeout: 60_000 });
// (1) el scroll suave anima: sin esto la foto sale a mitad de camino.
await pagina.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

const total = await pagina.evaluate(() => document.documentElement.scrollHeight);
const pasos = Math.ceil(total / alto);
console.log(`${base}${ruta} · ${total}px de alto · ${pasos} pantallas de ${ancho}x${alto}`);

const nombre = ruta === "/" ? "portada" : ruta.replace(/\//g, "-").replace(/^-/, "");
for (let i = 0; i < pasos; i++) {
  const y = i * alto;
  await pagina.evaluate((y) => window.scrollTo(0, y), y);
  // (1) esperar el scroll REAL, no un timeout.
  await pagina.waitForFunction((y) => Math.abs(window.scrollY - y) < 3 || window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3, y, { timeout: 10_000 });
  await pagina.waitForTimeout(700); // que terminen los reveal
  await pagina.screenshot({ path: `${out}/${nombre}-${String(i + 1).padStart(2, "0")}.png` });
}

await navegador.close();

if (rotos.length) {
  console.log(`\n!! ${rotos.length} pedido(s) con error — la página puede verse rota por esto, no por su código:`);
  for (const r of new Set(rotos)) console.log(`   ${r}`);
} else {
  console.log("\nNingún pedido falló. Las capturas siguen necesitando ojo.");
}
