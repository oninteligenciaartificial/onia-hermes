/**
 * Saca la PRIMERA PANTALLA de las dos rutas que ve un lead, en escritorio y en
 * telefono, sobre el sitio buildeado. Existe porque el carril se verifica
 * MIRANDO, y las tres trampas de instrumento que ya nos costaron una vuelta
 * cada una estan tapadas aca:
 *
 *  1. chunk 404 -> la pagina sale en blanco y parece un bug del sitio. Se
 *     escucha `response` y cualquier >=400 sale en el informe (2026-09-03).
 *  2. scroll suave -> `scrollTo` ANIMA y la foto sale a mitad de camino. Se
 *     apaga `scroll-behavior` antes de mover nada (2026-09-03).
 *  3. Reveal -> el nodo que anima es el ABUELO del titulo, asi que mirar la
 *     opacidad del propio h1 da 1 con la pantalla todavia vacia. Se recorre la
 *     cadena de ancestros hasta body y se espera al MINIMO (2026-09-03/04).
 *
 * Uso: node scripts/mirar-primera-pantalla.mjs [http://127.0.0.1:3111]
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire("/root/.npm/_npx/e41f203b7505f1fb/");
const { chromium } = require(
  "/root/.npm/_npx/e41f203b7505f1fb/node_modules/playwright",
);

const BASE = process.argv[2] || "http://127.0.0.1:3111";
const OUT = process.env.OUT_DIR || "/tmp/wv-mirar";
const PANTALLAS = [
  { id: "escritorio", width: 1366, height: 900 },
  { id: "telefono", width: 390, height: 844 },
];
const RUTAS = [
  { id: "portada", path: "/" },
  { id: "empezar", path: "/empezar" },
];

/** La opacidad EFECTIVA de un elemento: el minimo de su cadena hasta body. */
const OPACIDAD_HEREDADA = `(sel) => {
  const el = document.querySelector(sel);
  if (!el) return -1;
  let min = 1;
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const o = parseFloat(getComputedStyle(n).opacity);
    if (!Number.isNaN(o)) min = Math.min(min, o);
  }
  return min;
}`;

mkdirSync(OUT, { recursive: true });

/*
 * El Chromium se nombra a mano: el playwright que resuelve el `require` de
 * arriba pide la revision 1243 y el nodo tiene bajada la 1228, asi que
 * `launch()` a secas muere con "Executable doesn't exist" — un fallo de
 * INSTRUMENTO con la misma cara que un sitio caido.
 */
const CHROME =
  process.env.CHROME_PATH ||
  "/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome";
const navegador = await chromium.launch({ executablePath: CHROME });
const informe = [];

for (const pantalla of PANTALLAS) {
  const contexto = await navegador.newContext({
    viewport: { width: pantalla.width, height: pantalla.height },
    deviceScaleFactor: 2,
  });
  for (const ruta of RUTAS) {
    const pagina = await contexto.newPage();
    const fallidas = [];
    pagina.on("response", (r) => {
      if (r.status() >= 400) fallidas.push(`${r.status()} ${r.url()}`);
    });
    await pagina.goto(BASE + ruta.path, { waitUntil: "networkidle" });
    // 2 — que scrollTo salte en vez de animar (no scrolleamos, pero el sitio si)
    await pagina.addStyleTag({
      content: "html{scroll-behavior:auto !important}",
    });
    // 3 — esperar a que el Reveal del titulo TERMINE, mirando sus ancestros
    let opacidad = -1;
    try {
      await pagina.waitForFunction(
        `(${OPACIDAD_HEREDADA})('h1') >= 0.99`,
        null,
        { timeout: 8000 },
      );
    } catch {
      /* se reporta abajo con el valor que quedo */
    }
    opacidad = await pagina.evaluate(`(${OPACIDAD_HEREDADA})('h1')`);

    const archivo = `${OUT}/${ruta.id}-${pantalla.id}.png`;
    await pagina.screenshot({ path: archivo });
    const h1 = await pagina
      .locator("h1")
      .first()
      .innerText()
      .catch(() => "(sin h1)");
    informe.push({
      ruta: ruta.path,
      pantalla: pantalla.id,
      archivo,
      h1: h1.replace(/\s+/g, " ").trim(),
      opacidadH1: opacidad,
      fallidas,
    });
    await pagina.close();
  }
  await contexto.close();
}

await navegador.close();
for (const r of informe) {
  console.log(
    `${r.pantalla.padEnd(10)} ${r.ruta.padEnd(10)} opacidad=${r.opacidadH1} 4xx/5xx=${r.fallidas.length} h1="${r.h1}"`,
  );
  for (const f of r.fallidas) console.log(`   !! ${f}`);
}
