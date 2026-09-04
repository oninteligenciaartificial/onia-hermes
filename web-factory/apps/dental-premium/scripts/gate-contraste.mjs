/**
 * GATE DE CONTRASTE DE BOTONES — todo `.btn` de la página tiene que LEERSE
 * sobre el fondo que de verdad tiene debajo.
 *
 * Por qué existe: el 2026-09-03, medido sobre el bundle de producción, el
 * segundo botón del hero ("Ver tratamientos") era ilegible. No era la
 * animación —`opacity:1`, el gate del pliegue en verde— era el COLOR:
 * `.btn--ghost` heredaba `color: var(--ink)` (#172420, tinta casi negra) y
 * `border: var(--line)` (tinta al 12%) de los tokens de superficie CLARA, y el
 * hero es la única superficie oscura donde ese botón se usa. Sobre el degradado
 * verde profundo daba 1,26:1 de texto y 1,04:1 de borde: el botón prácticamente
 * no existía al lado del sólido.
 *
 * Dos decisiones de método, las dos por un modo de falla ya pagado en este repo:
 *
 * 1. **Los sujetos salen del DOM, no de una lista.** Mide TODOS los `.btn` que
 *    la página renderice. Un gate que enumera sus sujetos a mano falla ABIERTO:
 *    el día que alguien pone un ghost en una superficie oscura nueva, nadie lo
 *    mira. Así, un botón nuevo nace cubierto.
 * 2. **El fondo se SAMPLEA de la captura, no se deduce del CSS.** Detrás del
 *    ghost del hero no hay un color: hay tres degradados y un scrim
 *    superpuestos. Calcularlo a mano es inventarlo. Se decodifica el PNG y se
 *    lee el píxel.
 *
 * Uso:  node scripts/gate-contraste.mjs            (sirve el standalone ya buildeado)
 *       BASE_URL=http://127.0.0.1:4353 node scripts/gate-contraste.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT_GATE || 4355);
const CAPTURAS = path.join(APP, "capturas");

// Pisos WCAG: 4,5:1 para texto normal (1.4.3) y 3:1 para el límite visible de
// un control (1.4.11). El borde importa de verdad acá: un ghost es transparente,
// así que si el borde no se ve, el botón no tiene forma.
const PISO_TEXTO = 4.5;
const PISO_BORDE = 3;

const VIEWPORTS = [
  [1440, 800],
  [1440, 900],
  [390, 844],
];

/* ---------- PNG: decodificador mínimo (8 bits, RGB o RGBA, sin entrelazar) ----------
   Playwright emite tipo 2 (RGB) cuando la captura no tiene transparencia y
   tipo 6 (RGBA) cuando sí. Los dos entran acá: aceptar sólo uno hacía explotar
   el gate contra su propio instrumento. */
function leerPng(buf) {
  let off = 8;
  let ancho = 0;
  let alto = 0;
  let prof = 0;
  let tipo = 0;
  let entrelazado = 0;
  const idat = [];
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const tag = buf.toString("ascii", off + 4, off + 8);
    const datos = buf.subarray(off + 8, off + 8 + len);
    if (tag === "IHDR") {
      ancho = datos.readUInt32BE(0);
      alto = datos.readUInt32BE(4);
      prof = datos[8];
      tipo = datos[9];
      entrelazado = datos[12];
    } else if (tag === "IDAT") {
      idat.push(datos);
    } else if (tag === "IEND") {
      break;
    }
    off += 12 + len;
  }
  if (prof !== 8 || (tipo !== 2 && tipo !== 6) || entrelazado !== 0) {
    throw new Error(`PNG no soportado (prof=${prof} tipo=${tipo} entrelazado=${entrelazado})`);
  }
  const bpp = tipo === 6 ? 4 : 3;
  const crudo = zlib.inflateSync(Buffer.concat(idat));
  const pix = Buffer.alloc(ancho * alto * bpp);
  const paso = ancho * bpp;
  let p = 0;
  for (let y = 0; y < alto; y++) {
    const filtro = crudo[p++];
    const linea = crudo.subarray(p, p + paso);
    p += paso;
    const dest = y * paso;
    for (let x = 0; x < paso; x++) {
      const a = x >= bpp ? pix[dest + x - bpp] : 0;
      const b = y > 0 ? pix[dest - paso + x] : 0;
      const c = x >= bpp && y > 0 ? pix[dest - paso + x - bpp] : 0;
      let v = linea[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filtro !== 0) {
        throw new Error(`filtro PNG desconocido: ${filtro}`);
      }
      pix[dest + x] = v & 0xff;
    }
  }
  return {
    ancho,
    alto,
    en(x, y) {
      const i =
        (Math.min(alto - 1, Math.max(0, y)) * ancho + Math.min(ancho - 1, Math.max(0, x))) * bpp;
      return [pix[i], pix[i + 1], pix[i + 2]];
    },
  };
}

/* ---------- Contraste WCAG 2.1 ---------- */
const aLineal = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminancia = ([r, g, b]) => 0.2126 * aLineal(r) + 0.7152 * aLineal(g) + 0.0722 * aLineal(b);
function contraste(x, y) {
  const a = luminancia(x);
  const b = luminancia(y);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}
// Un color con alfa no se compara: se compone primero sobre lo que tiene debajo.
function componer([r, g, b, a], fondo) {
  if (a >= 1) return [r, g, b];
  return [0, 1, 2].map((i) => Math.round([r, g, b][i] * a + fondo[i] * (1 - a)));
}
const rgba = (css) => {
  const n = css.match(/[\d.]+/g)?.map(Number) ?? [];
  return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0, n[3] ?? 1];
};
const hex = ([r, g, b]) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

/* ---------- Servidor ---------- */
function servir() {
  const raiz = path.join(APP, ".next", "standalone", "apps", "dental-premium");
  if (!existsSync(path.join(raiz, "server.js"))) {
    console.error("✗ No hay build standalone. Corré `npm run build` primero.");
    process.exit(2);
  }
  if (!existsSync(path.join(raiz, ".next", "static"))) {
    console.error(
      "✗ Falta .next/static dentro del standalone: la página sale SIN CSS y el\n" +
        "  gate mide colores que no son los del sitio. Copialo con:\n" +
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
const avisos = [];

try {
  await esperar(base);

  // Sin CSS todo lo demás mide una página que no existe. Se descarta ANTES.
  const html = await (await fetch(base)).text();
  const css = html.match(/\/_next\/static\/css\/[^"\\]+\.css/)?.[0];
  if (!css || !(await fetch(base + css)).ok) {
    console.error(`✗ La hoja de estilos no resuelve (${css ?? "no declarada"}).`);
    process.exit(2);
  }

  mkdirSync(CAPTURAS, { recursive: true });
  const navegador = await chromium.launch();

  for (const [width, height] of VIEWPORTS) {
    const ctx = await navegador.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    // Un chunk 404 deja la página sin JS y las secciones animadas vacías: la
    // misma firma que un bug del sitio. Se escucha antes de creerle a nada.
    const caidos = [];
    page.on("response", (r) => {
      if (r.status() >= 400) caidos.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(base, { waitUntil: "networkidle" });
    // El sitio declara `scroll-behavior: smooth`, así que scrollear ANIMA: la
    // captura sale disparada a mitad del viaje y recorta coordenadas viejas —
    // un botón verde sólido se leía como el papel de atrás. Se apaga ANTES de
    // mover nada.
    await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
    await page.waitForTimeout(1500);
    if (caidos.length) {
      console.error(`✗ ${width}x${height}: recursos caídos, la medición no vale — ${caidos[0]}`);
      fallos++;
      await ctx.close();
      continue;
    }

    const botones = await page.$$(".btn");
    if (!botones.length) {
      console.error(`✗ ${width}x${height}: no hay ningún .btn en la página`);
      fallos++;
      await ctx.close();
      continue;
    }

    for (const [i, btn] of botones.entries()) {
      // Los botones entran con `Reveal` (whileInView). Fotografiarlos apenas
      // Playwright los scrollea captura un fotograma A MITAD de la animación:
      // el sólido verde salía leído como #eaede6 —el papel de atrás— y el gate
      // acusaba al sitio de un defecto que era del instrumento. Se espera a que
      // la entrada TERMINE; si no termina, eso sí es un fallo del sitio.
      //
      // Y se mira TODA la cadena de ancestros, no el padre: `Reveal` envuelve a
      // sus hijos en un `motion.div`, así que el nodo animado es el ABUELO del
      // botón. Mirar sólo `parentElement` leía `.actions` —que nunca se anima,
      // opacidad 1 siempre— y daba por asentado un botón todavía invisible.
      // Al CENTRO, no "si hace falta": el scroll mínimo deja la última sección
      // pegada al borde inferior, por debajo de la línea de disparo de
      // `whileInView` (margin -12%), y el reveal no arranca nunca. Eso hacía
      // fallar el gate a 1440x900 y no a las otras dos — un rojo del
      // instrumento, no del sitio.
      await btn.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "auto" }));
      let asentado = true;
      try {
        await btn.waitForElementState("stable", { timeout: 5000 });
        await page.waitForFunction(
          (el) => {
            for (let n = el; n && n !== document.body; n = n.parentElement) {
              const cs = getComputedStyle(n);
              if (Number(cs.opacity) !== 1 || cs.transform !== "none") return false;
            }
            return true;
          },
          btn,
          { timeout: 5000 },
        );
      } catch {
        asentado = false;
      }

      const meta = await btn.evaluate((el) => {
        const cs = getComputedStyle(el);
        const seccion = el.closest("section, header, footer, .hero");
        return {
          texto: el.textContent.trim(),
          clases: el.className,
          zona: seccion ? seccion.className || seccion.tagName.toLowerCase() : "?",
          color: cs.color,
          anchoBorde: parseFloat(cs.borderTopWidth) || 0,
          tam: parseFloat(cs.fontSize),
          peso: cs.fontWeight,
        };
      });
      const caja = await btn.boundingBox();
      if (!caja || caja.width < 8 || caja.height < 8) continue;

      const png = leerPng(await btn.screenshot());
      const medio = Math.round(png.alto / 2);
      // El relleno horizontal del .btn es de 26px: a 8px del borde estamos
      // dentro del botón, fuera del borde y lejos del texto.
      const fondo = png.en(8, medio);
      // El borde de arriba, al centro, es recto: ahí el píxel es el borde y no
      // la curva antialiaseada de la píldora.
      const borde = meta.anchoBorde > 0 ? png.en(Math.round(png.ancho / 2), 0) : null;

      const tinta = componer(rgba(meta.color), fondo);
      const cTexto = contraste(tinta, fondo);
      // Un borde de 1px cae en un píxel FRACCIONARIO: la fila 0 puede salir
      // casi toda fondo y dar 1,00:1 sobre un borde que sí existe. Se busca en
      // las primeras filas la de MAYOR contraste — la pregunta real es "¿hay
      // algún límite visible?", no "¿qué hay exactamente en la fila 0?".
      const dentro = png.en(Math.round(png.ancho / 2), 8);
      let cBorde = null;
      if (meta.anchoBorde > 0) {
        for (let y = 0; y <= 3; y++) {
          const c = contraste(png.en(Math.round(png.ancho / 2), y), dentro);
          if (cBorde === null || c > cBorde) cBorde = c;
        }
      }

      const etiqueta = `${width}x${height} · «${meta.texto}» (${meta.clases} en .${String(meta.zona).split(" ")[0]})`;
      const problemas = [];
      if (!asentado) {
        problemas.push("su animación de entrada nunca terminó: el visitante lo ve a medias");
      }
      if (cTexto < PISO_TEXTO) {
        problemas.push(
          `texto ${cTexto.toFixed(2)}:1 (piso ${PISO_TEXTO}) — tinta ${hex(tinta)} sobre ${hex(fondo)}`,
        );
      }
      // El borde flojo se AVISA, no tumba el gate — y se cuenta, así que nunca
      // puede leerse como "todo verde". El corte no es de gusto: si el texto ya
      // pasa 4,5:1 el control se identifica igual y subirle el borde es un
      // cambio VISIBLE de diseño, de los que mira Sergio antes. Si el texto NO
      // pasa, el botón directamente no existe y eso sí es defecto.
      if (cBorde !== null && cBorde < PISO_BORDE && String(meta.clases).includes("btn--ghost")) {
        avisos.push(
          `⚠ ${width}x${height} · «${meta.texto}»: borde ${cBorde.toFixed(2)}:1 (piso ${PISO_BORDE}) sobre ${hex(fondo)} — el texto se lee, el contorno casi no`,
        );
      }

      if (problemas.length) {
        console.error(`✗ ${etiqueta}: ${problemas.join(" · ")}`);
        writeFileSync(
          path.join(CAPTURAS, `contraste-ROJO-${width}x${height}-${i}.png`),
          await btn.screenshot(),
        );
        fallos++;
      } else {
        console.log(
          `✓ ${etiqueta}: texto ${cTexto.toFixed(2)}:1` +
            (cBorde !== null ? ` · borde ${cBorde.toFixed(2)}:1` : ""),
        );
      }
    }

    // La captura del hero es la que se MIRA: un número que da verde con el
    // botón feo sigue siendo un botón feo.
    const hero = await page.$(".hero");
    if (hero) {
      writeFileSync(path.join(CAPTURAS, `hero-${width}x${height}.png`), await hero.screenshot());
    }
    await ctx.close();
  }
  await navegador.close();
} finally {
  proc?.kill();
}

if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s) — no tumban el gate, pero no están arreglados:`);
  for (const a of avisos) console.log(`  ${a}`);
}

if (fallos) {
  console.error(`\n✗ GATE DE CONTRASTE EN ROJO: ${fallos} botón(es) no se leen sobre su fondo.`);
  process.exit(1);
}
console.log(`\n✓ Gate de contraste verde. Capturas del hero en ${CAPTURAS}`);
