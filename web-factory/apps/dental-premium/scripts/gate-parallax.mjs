/**
 * GATE DEL PARALLAX — la animación del hero SIGUE VIVA después de sacar GSAP
 * del bundle inicial.
 *
 * Por qué existe, y por qué no alcanza con `gate:peso`: el 2026-09-03 la home
 * bajó de 187 kB a 143 kB moviendo `gsap` + `ScrollTrigger` a un `import()`
 * dinámico. **El gate del peso habría dado el MISMO verde si en vez de eso
 * hubiera borrado la animación** — o si el chunk dinámico fallara al bajar, que
 * es un modo de falla mudo: la página se ve entera, no hay error visible, y la
 * imagen del hero simplemente se queda quieta. Un gate que sólo mira kilobytes
 * premia borrar cosas. Verificado en `ferreteria-sur` bloqueando los chunks de
 * GSAP: el de peso quedaba verde, éste se pone rojo.
 *
 * Mide que después de scrollear la capa `.hero-media` se haya movido (yPercent
 * 18) Y escalado (1.08), y el otro lado: con `prefers-reduced-motion: reduce` el
 * trigger no se registra y la capa tiene que quedarse QUIETA.
 *
 * Uso:  node scripts/gate-parallax.mjs
 *       BASE_URL=http://127.0.0.1:4354 node scripts/gate-parallax.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT_GATE || 4364);

// 1440 = laptop, 390 = teléfono. Las dos que pide la definición de hecho.
const VIEWPORTS = [
  [1440, 900],
  [390, 844],
];

// Cuánto scroll hace falta para que el scrub tenga algo que interpolar.
const SCROLL = 400;

function servir() {
  const raiz = path.join(APP, ".next", "standalone", "apps", "dental-premium");
  if (!existsSync(path.join(raiz, "server.js"))) {
    console.error("✗ No hay build standalone. Corré `npm run build` primero.");
    process.exit(2);
  }
  if (!existsSync(path.join(raiz, ".next", "static"))) {
    console.error(
      "✗ Falta .next/static dentro del standalone: sin los chunks, el import()\n" +
        "  dinámico de GSAP da 404 y el gate mediría 'animación muerta' por culpa\n" +
        "  del instrumento. Copialo con:\n" +
        `  cp -r ${path.join(APP, ".next", "static")} ${path.join(raiz, ".next", "static")}`,
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
      if ((await fetch(url)).ok) return;
    } catch {
      /* todavía no levanta */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`el servidor no respondió en ${url}`);
}

/** Desplazamiento y escala de la capa. `none` = no se movió nunca. */
function leerMedia() {
  const el = document.querySelector(".hero-media");
  if (!el) return null;
  const t = getComputedStyle(el).transform;
  if (!t || t === "none") return { y: 0, escala: 1 };
  const m = new DOMMatrixReadOnly(t);
  return { y: m.m42, escala: m.a };
}

const base = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;
const proc = process.env.BASE_URL ? null : servir();
let fallos = 0;

try {
  await esperar(base);
  const navegador = await chromium.launch();

  for (const [width, height] of VIEWPORTS) {
    for (const reduced of ["no-preference", "reduce"]) {
      const ctx = await navegador.newContext({
        viewport: { width, height },
        reducedMotion: reduced,
      });
      const page = await ctx.newPage();

      // Un chunk que da 404 deja la animación muerta con la página intacta:
      // es la misma firma que un bug del sitio. Se escucha ANTES de medir.
      const caidos = [];
      page.on("response", (r) => {
        if (r.status() >= 400) caidos.push(`${r.status()} ${r.url()}`);
      });

      await page.goto(base, { waitUntil: "networkidle" });
      // `html { scroll-behavior: smooth }` (globals.css:49) haría que scrollTo
      // ANIME: la medición saldría a mitad de camino y el veredicto dependería
      // del timing.
      await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

      const antes = await page.evaluate(leerMedia);
      await page.evaluate((y) => window.scrollTo(0, y), SCROLL);
      await page.waitForFunction((y) => Math.abs(window.scrollY - y) < 3, SCROLL, {
        timeout: 5000,
      });
      // scrub: 0.6 → el lerp tarda; sin esta espera se mide el fotograma cero.
      await page.waitForTimeout(1500);
      const despues = await page.evaluate(leerMedia);

      const etiqueta = `${width}x${height} (${reduced})`;

      if (caidos.length) {
        console.error(`✗ ${etiqueta}: recursos caídos → ${caidos.join(", ")}`);
        fallos++;
        await ctx.close();
        continue;
      }
      if (!antes || !despues) {
        console.error(`✗ ${etiqueta}: no existe .hero-media`);
        fallos++;
        await ctx.close();
        continue;
      }

      const dY = despues.y - antes.y;
      const dEscala = despues.escala - antes.escala;

      if (reduced === "reduce") {
        if (Math.abs(dY) > 1 || Math.abs(dEscala) > 0.005) {
          console.error(
            `✗ ${etiqueta}: con reduced-motion la capa se movió (y ${dY.toFixed(1)}px, escala ${dEscala.toFixed(3)})`,
          );
          fallos++;
        } else {
          console.log(`✓ ${etiqueta}: quieta, como corresponde`);
        }
        await ctx.close();
        continue;
      }

      if (Math.abs(dY) < 1 && Math.abs(dEscala) < 0.005) {
        console.error(
          `✗ ${etiqueta}: el parallax NO corre — la capa quedó quieta.\n` +
            "  Es el fallo mudo del import() dinámico de GSAP: la página se ve\n" +
            "  entera y el hero no respira. El peso puede estar en verde igual.",
        );
        fallos++;
      } else {
        console.log(
          `✓ ${etiqueta}: parallax vivo — y ${dY.toFixed(1)}px, escala ${dEscala.toFixed(3)}`,
        );
      }
      await ctx.close();
    }
  }
  await navegador.close();
} finally {
  proc?.kill();
}

process.exit(fallos ? 1 : 0);
