#!/usr/bin/env node
/* Verifica el hero YA PORTADO, mirando la HOME de verdad — no el HTML suelto.
 *
 * `verificar-pliegue.js` (al lado) mide la pieza sola. Esto mide lo que ve el
 * cliente: la home con su header sticky de 60px, su nav y el resto de la
 * página debajo. Los dos números no son el mismo y confundirlos fue el error
 * que este archivo existe para evitar.
 *
 * Qué chequea:
 *   · CERO capturas del sistema en el hero (img/svg/video/canvas/background-image)
 *     — Sergio, 2026-09-01: "no coloques capturas literales del sistema".
 *   · CERO sombras (box y text): la profundidad sale de color, solape y escala.
 *   · CERO scroll horizontal y cero desbordes, con el día sangrando a la derecha.
 *   · La proporción 9:15 sigue siendo ESPACIAL a los dos lados del corte.
 *   · Qué entra arriba del pliegue en teléfono (informativo por viewport).
 *
 * Uso: levantar la home y correr
 *   cd web-factory/apps/onia-platform && npx next dev -p 3411
 *   node hermes-content/references/ui-patterns/hero-onia/resultado/verificar-home.js
 *   node .../verificar-home.js --capturas   (además guarda los PNG)
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require(require.resolve("playwright", {
  paths: [
    process.cwd(),
    path.join(__dirname, "..", "..", "..", "..", "..", "web-factory"),
  ],
}));

const URL = process.env.HOME_URL || "http://127.0.0.1:3411/";
const OUT = path.join(__dirname, "capturas-home");
const GUARDAR = process.argv.includes("--capturas");

/* viewport REAL de navegador (la barra de direcciones ya descontada) */
const VISTAS = [
  ["1920", 1920, 1080],
  ["1440", 1440, 900],
  ["1280", 1280, 800],
  ["1024", 1024, 800],
  ["768", 768, 900],
  ["390", 390, 664],
  ["375", 375, 667],
  ["360", 360, 640],
  ["320", 320, 640],
];

const medir = () => {
  const hero = document.querySelector("section");
  const caja = (el) => {
    const r = el.getBoundingClientRect();
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), right: +r.right.toFixed(1), bottom: +r.bottom.toFixed(1) };
  };
  const clase = (el) => el.className.toString().slice(0, 40);
  const todo = [...hero.querySelectorAll("*")];
  const puerta = [...hero.querySelectorAll("p")].find((p) => p.textContent.includes("es la puerta"));
  return {
    media: hero.querySelectorAll("img,svg,video,canvas,picture").length,
    fondos: todo.filter((e) => getComputedStyle(e).backgroundImage !== "none").map(clase),
    sombras: todo.filter((e) => {
      const c = getComputedStyle(e);
      return c.boxShadow !== "none" || c.textShadow !== "none";
    }).map(clase),
    desbordes: todo.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.right > innerWidth + 0.6 || r.left < -0.6;
    }).map((e) => `${clase(e)} right=${e.getBoundingClientRect().right.toFixed(1)}`),
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    fold: innerHeight,
    h1: caja(hero.querySelector("h1")).bottom,
    btn: Math.max(...[...hero.querySelectorAll('a[class*="btn"]')].map((b) => b.getBoundingClientRect().bottom)),
    puerta: puerta ? +puerta.getBoundingClientRect().bottom.toFixed(1) : null,
    dia: caja(hero.querySelector('[class*="_day_"]')),
    slabs: [...hero.querySelectorAll('[class*="slab"]')].map(caja),
    marcas: [...hero.querySelectorAll('[class*="track"]')].map((t) => ({
      n: t.children.length,
      px: +t.firstElementChild.getBoundingClientRect().width.toFixed(1),
    })),
  };
};

(async () => {
  if (GUARDAR) fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  let roto = 0;
  for (const [nombre, w, h] of VISTAS) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    if (GUARDAR) {
      await page.screenshot({ path: path.join(OUT, `home-${nombre}-pliegue.png`) });
      await page.screenshot({
        path: path.join(OUT, `home-${nombre}-hero.png`),
        clip: { x: 0, y: 0, width: w, height: Math.min(h * 2.6, 8000) },
      });
    }
    const d = await page.evaluate(medir);
    const falla = (cond, texto) => {
      if (!cond) roto++;
      return `${cond ? "  ✓" : "  ✗"} ${texto}`;
    };
    // 9:15 es espacial: en escritorio manda el ANCHO, en teléfono el ALTO (el día gira)
    const [a, b] = d.slabs;
    const prop = w > 700 ? a.w / b.w : a.h / b.h;
    console.log(`\n${nombre}  (${w}x${h})`);
    console.log(falla(d.media === 0, `cero capturas en el hero (img/svg/video/canvas: ${d.media})`));
    console.log(falla(d.fondos.length === 0, `cero background-image (${d.fondos.length})`));
    console.log(falla(d.sombras.length === 0, `cero sombras (${d.sombras.length})`));
    console.log(falla(d.scrollW <= d.clientW, `sin scroll horizontal (${d.scrollW}/${d.clientW})`));
    console.log(falla(d.desbordes.length === 0, `sin desbordes${d.desbordes.length ? ` → ${d.desbordes.join(", ")}` : ""}`));
    console.log(falla(Math.abs(prop - 0.6) < 0.01, `proporción 9:15 = ${prop.toFixed(3)}`));
    console.log(falla(d.dia.right >= (w > 700 ? w - 1 : 0), `el día sangra hasta el borde (right=${d.dia.right} de ${w})`));
    console.log(`    pliegue ${d.fold}: titular=${d.h1} · botones=${d.btn.toFixed(1)} · asistente=${d.puerta}` +
      `  [${["titular", "botones", "asistente"].filter((_, i) => [d.h1, d.btn, d.puerta][i] > d.fold).join(", ") || "los tres entran"}${[d.h1, d.btn, d.puerta].some((v) => v > d.fold) ? " abajo del pliegue" : ""}]`);
    console.log(`    marcas: ${d.marcas.map((m) => `${m.n}x${m.px}px`).join(" | ")}`);
    await page.close();
  }
  await browser.close();
  console.log(roto === 0 ? "\nOK — el hero portado cumple sus invariantes en los nueve anchos." : `\nROTO — ${roto} chequeo(s) en rojo.`);
  process.exit(roto === 0 ? 0 : 1);
})();
