/**
 * GATE DEL PLIEGUE — el CTA del hero tiene que estar DENTRO del primer viewport
 * y VISIBLE, sin que nadie scrollee.
 *
 * Por qué existe: el 2026-09-03, medido sobre el bundle de producción, el botón
 * que convierte de esta app estaba **dentro del pliegue y aun así invisible** a
 * 1440x800 (bottom 757) y a 1440x900 (bottom 849): `opacity:0` y
 * `translateY(24px)` porque su `whileInView` con `margin: 0 0 -12%` nunca
 * disparaba — el CTA nace por debajo de la línea de trigger, así que no entra
 * "en viewport" hasta que el visitante scrollea. Ningún gate del repo miraba
 * esta app (`playwright.config.ts` apunta a `out/<slug>`, el `.next` a
 * `apps/site`).
 *
 * Por eso mide GEOMETRÍA y VISIBILIDAD por separado. **Acá la geometría siempre
 * estuvo bien**: un gate que sólo mirara el pliegue habría dado VERDE con el
 * botón invisible, que es exactamente como este bug sobrevivió.
 *
 * Uso:  node scripts/gate-pliegue.mjs            (sirve el standalone ya buildeado)
 *       BASE_URL=http://127.0.0.1:4353 node scripts/gate-pliegue.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT_GATE || 4354);

// Alturas de laptop y de teléfono reales. 1440x900 va aunque la geometría le
// sobre: es la que atrapó el bug de opacidad.
const VIEWPORTS = [
  [1440, 800],
  [1440, 900],
  [1366, 768],
  [1280, 720],
  [390, 844],
];

function servir() {
  const raiz = path.join(APP, ".next", "standalone", "apps", "dental-premium");
  if (!existsSync(path.join(raiz, "server.js"))) {
    console.error("✗ No hay build standalone. Corré `npm run build` primero.");
    process.exit(2);
  }
  if (!existsSync(path.join(raiz, ".next", "static"))) {
    console.error(
      "✗ Falta .next/static dentro del standalone: la página sale SIN CSS y el\n" +
        "  gate mide una pantalla que no existe. Copialo con:\n" +
        `  rm -rf ${path.join(raiz, ".next", "static")} && cp -r ${path.join(APP, ".next", "static")} ${path.join(raiz, ".next", "static")}`,
    );
    process.exit(2);
  }
  return spawn("node", ["server.js"], {
    cwd: raiz,
    env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1" },
    stdio: "ignore",
  });
}

async function esperar(url) {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* todavía no levanta */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`el servidor no respondió en ${url}`);
}

const base = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;
const proc = process.env.BASE_URL ? null : servir();
let fallos = 0;

try {
  await esperar(base);

  // Si el CSS no resuelve, todo lo demás mide una página sin estilos y da
  // números que no son del sitio. Se chequea ANTES de creerle a una medición.
  const html = await (await fetch(base)).text();
  const css = html.match(/\/_next\/static\/css\/[^"\\]+\.css/)?.[0];
  if (!css || !(await fetch(base + css)).ok) {
    console.error(`✗ La hoja de estilos no resuelve (${css ?? "no declarada"}).`);
    process.exit(2);
  }

  const navegador = await chromium.launch();
  for (const reduced of ["no-preference", "reduce"]) {
    for (const [width, height] of VIEWPORTS) {
      const ctx = await navegador.newContext({
        viewport: { width, height },
        reducedMotion: reduced,
      });
      const page = await ctx.newPage();
      await page.goto(base, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      const m = await page.evaluate(() => {
        const acciones = document.querySelector(".hero .actions");
        if (!acciones) return null;
        const caja = acciones.getBoundingClientRect();
        const wrap = getComputedStyle(acciones.parentElement);
        const btn = acciones.querySelector("a").getBoundingClientRect();
        const encima = document.elementFromPoint(
          btn.left + btn.width / 2,
          btn.top + btn.height / 2,
        );
        return {
          bottom: Math.round(caja.bottom),
          opacity: Number(wrap.opacity),
          desplazado: wrap.transform !== "none",
          alcanzable: !!(encima && encima.closest(".actions")),
        };
      });

      const etiqueta = `${width}x${height} (${reduced})`;
      if (!m) {
        console.error(`✗ ${etiqueta}: no existe .hero .actions`);
        fallos++;
        continue;
      }
      const problemas = [];
      if (m.bottom > height) problemas.push(`cae ${m.bottom - height}px BAJO el pliegue`);
      if (m.opacity !== 1) problemas.push(`opacity=${m.opacity} (invisible sin scrollear)`);
      if (m.desplazado) problemas.push("quedó con transform: la animación no terminó");
      if (!m.alcanzable) problemas.push("algo lo tapa: no es clickeable");

      if (problemas.length) {
        console.error(`✗ ${etiqueta}: ${problemas.join(" · ")}`);
        fallos++;
      } else {
        console.log(`✓ ${etiqueta}: CTA entero y visible (sobran ${height - m.bottom}px)`);
      }
      await ctx.close();
    }
  }
  await navegador.close();
} finally {
  proc?.kill();
}

if (fallos) {
  console.error(`\n✗ GATE DEL PLIEGUE EN ROJO: ${fallos} medición(es) fallaron.`);
  process.exit(1);
}
console.log("\n✓ Gate del pliegue verde.");
