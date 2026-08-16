// Pieza A6 (hermes-content/references/video-intake/PROMPTS_POR_SESION.md linea 705):
// 3 clips verticales que muestran los patrones de ui-patterns/ funcionando de verdad,
// + el dato de oficio concreto que los hizo bien.
//
// Receta base: Bloque A de hermes-content/docs/ONIA_MANUAL_DE_FORMATOS_20260813.md
// (~linea 305, P05): "una captura por pantalla -> clip de 1,00 s con deriva de 80 px
// -> placas de apertura/cierre -> concat -c copy". Adaptada: en vez de 9 sitios
// distintos, son 3 ESTADOS REALES de un mismo patron (idle -> accion -> resultado),
// capturados con Playwright interactuando de verdad con el componente (clic, espera
// los tiempos reales del propio archivo), no una animacion fabricada.
//
// Reusa scripts/resolve-playwright.mjs de la skill editor-videos (ya resuelve
// chromium desde cualquier ubicacion del repo) en vez de declarar playwright de nuevo.
// NO se toca ningun archivo de ui-patterns/: el "stage" (fondo de marca + centrado)
// se inyecta en vivo con page.addStyleTag(), nunca se escribe en el .html original.
//
// Fases (node build.mjs <fase>; default "all"): capture -> clips -> plates -> concat
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveChromium, launchChromium } from "../../../.claude/skills/editor-videos/scripts/resolve-playwright.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");
const PATTERNS_DIR = join(HERE, "..", "ui-patterns");
const RAW = join(HERE, "raw");
mkdirSync(RAW, { recursive: true });

// Fuente y colores: hermes-content/brand/tokens.css (unica fuente de verdad de marca).
// BricolageGrotesque-Bold.ttf esta explicitamente destinada a "subtitulos quemados"
// (hermes-content/brand/fonts/README.md) -- es la fuente correcta para esto.
// Ruta RELATIVA a REPO_ROOT a proposito: una ruta absoluta con "C:" rompe el filtro
// drawtext (nota Windows del manual, seccion 7).
const FONT = "hermes-content/brand/fonts/BricolageGrotesque-Bold.ttf";
const INK = "0x0A0F0D"; // --onia-ink
const GREEN = "0x10C26B"; // --onia-green
const W = 1080, H = 1920, FPS = 30;

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", ...args], { cwd: REPO_ROOT, stdio: "inherit" });
}

function encFlags(dur) {
  return ["-t", String(dur), "-r", String(FPS), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an"];
}

function rel(absPath) {
  return absPath.replace(REPO_ROOT, "").replace(/^[\\/]/, "").replace(/\\/g, "/");
}

// Estados = interacciones REALES tomadas de la tabla del manual (ONIA_MANUAL_DE_FORMATOS
// linea ~251) y verificadas leyendo cada index.html. espera = ms desde el paso anterior.
const PIEZAS = [
  {
    slug: "upload-button",
    fuente: "https://www.instagram.com/p/Dbx6AWGz_av/",
    estados: [
      { n: "1-idle", clic: null, espera: 250 }, // reposo: "Upload"
      { n: "2-busy", clic: ".ub", espera: 1400 }, // clic -> "Uploading...", barra a ~54% (busy dura 2600ms)
      { n: "3-done", clic: null, espera: 1800 }, // total 3200ms desde el clic: 600ms despues del setTimeout de 2600ms, para que termine el crossfade de opacidad (.45s) de la etiqueta y no queden "Uploading..." y "Completed" superpuestos
    ],
    why: ["El original usa", "React + framer-motion.", "Acá: CSS puro, 0 kB."],
    cta: ["¿Tu web pesa de más?"],
    keyword: "Escribí SISTEMA",
  },
  {
    slug: "floating-cart",
    fuente: "https://www.instagram.com/p/DbDjpLuTnKK/",
    estados: [
      { n: "1-catalogo", clic: null, espera: 250 }, // fab oculto, 0 items
      { n: "2-fab", clic: ".fc-add", espera: 700 }, // 1er "Agregar" -> fab entra (transicion .75s)
      { n: "3-modal", clic: "#fc-fab", espera: 900 }, // <dialog> abre + estado de envio se resuelve (timer 900ms)
    ],
    why: ["El modal es un", "<dialog> nativo:", "Escape, foco atrapado", "y devolución de foco,", "gratis del navegador."],
    cta: ["¿Tu carrito hace esto?"],
    keyword: "Escribí SISTEMA",
  },
  {
    slug: "chat-widget",
    fuente: "https://www.instagram.com/p/DbsUAxCgA3W/",
    estados: [
      { n: "1-landing", clic: null, espera: 250 }, // burbuja lanzadora, panel cerrado
      { n: "2-panel", clic: "#cw-launcher", espera: 800 }, // popover abre (top layer, transicion .75s)
      { n: "3-bot", clic: "#cw-chips button", espera: 1500 }, // 1er chip -> bot responde a los 1200ms
    ],
    why: ["Con transition: 0.01ms", "el panel queda abierto", "e invisible.", "Va: transition: none."],
    cta: ["El detalle que", "nadie prueba."],
    keyword: "Escribí SISTEMA",
  },
];

async function capturar() {
  const chromium = resolveChromium("piezas-ui-patterns/build");
  const browser = await launchChromium("piezas-ui-patterns/build", chromium, { headless: true });
  // Viewport angosto y alto: estos patrones son tarjetas autocontenidas, no sitios
  // completos -- capturar en formato retrato evita el crop/pan de una pantalla
  // panoramica (eso es lo que resuelve capture-web.mjs para sitios reales en P05;
  // aca no hace falta, el viewport YA nace vertical).
  // 720x1360 @1.5x -> PNG de 1080x2040: 1080 ancho final + 120px de sobra vertical
  // para la deriva de 80px del recorte (misma mecanica del Bloque A, ver clips()).
  const context = await browser.newContext({ viewport: { width: 720, height: 1360 }, deviceScaleFactor: 1.5 });
  const page = await context.newPage();

  for (const pieza of PIEZAS) {
    const archivo = join(PATTERNS_DIR, pieza.slug, "index.html").replace(/\\/g, "/");
    await page.goto("file:///" + archivo);
    // Stage inyectado EN VIVO (no se escribe en el .html original): fondo de marca
    // + centrado del fragmento. display:grid + place-items:center en el <body> no
    // crea containing block para position:fixed, asi que el FAB/launcher/dialog de
    // floating-cart y chat-widget se siguen anclando al viewport real, como en produccion.
    await page.addStyleTag({
      content: `html,body{height:100%;margin:0;background:${INK.replace("0x", "#")};}body{display:grid;place-items:center;}`,
    });
    for (const estado of pieza.estados) {
      if (estado.clic) await page.locator(estado.clic).first().click();
      await page.waitForTimeout(estado.espera);
      await page.screenshot({ path: join(RAW, `${pieza.slug}-${estado.n}.png`) });
      console.log(`capturado ${pieza.slug}-${estado.n}`);
    }
  }
  await browser.close();
}

function clips() {
  for (const pieza of PIEZAS) {
    for (const estado of pieza.estados) {
      const img = join(RAW, `${pieza.slug}-${estado.n}.png`);
      const out = join(RAW, `${pieza.slug}-${estado.n}-clip.mp4`);
      // Receta Bloque A verbatim: 1 imagen -> clip de 1.00s con deriva de 80px/s.
      // Comillas simples + "\," son sintaxis de ffmpeg (protegen la coma del parser
      // de filtros), no del shell -- van igual con execFileSync (sin shell).
      ffmpeg([
        "-loop", "1", "-framerate", String(FPS), "-i", img,
        "-vf", `crop=${W}:${H}:0:'min(t*80\\,ih-${H})'`,
        ...encFlags(1), out,
      ]);
    }
  }
}

function plate({ outName, dur, lines }) {
  const txt = join(RAW, `${outName}.txt`);
  writeFileSync(txt, lines.join("\n"), "utf8");
  const out = join(RAW, `${outName}.mp4`);
  ffmpeg([
    "-f", "lavfi", "-i", `color=c=${INK}:s=${W}x${H}:r=${FPS}`,
    "-vf", `drawtext=fontfile=${FONT}:textfile=${rel(txt)}:fontcolor=white:fontsize=54:line_spacing=18:x=(w-text_w)/2:y=(h-text_h)/2`,
    ...encFlags(dur), out,
  ]);
}

function plateCta({ outName, dur, lines, keyword }) {
  const txt1 = join(RAW, `${outName}-1.txt`);
  const txt2 = join(RAW, `${outName}-2.txt`);
  writeFileSync(txt1, lines.join("\n"), "utf8");
  writeFileSync(txt2, keyword, "utf8");
  const out = join(RAW, `${outName}.mp4`);
  // Dos drawtext encadenados: la pregunta (blanco) ancla arriba, la keyword (verde
  // marca) ancla abajo. y=<ancla>-text_h/2 centra CADA bloque en su propia ancla sin
  // importar si son 1 o 2 lineas -- evita hardcodear una y distinta por caso.
  const vf = [
    `drawtext=fontfile=${FONT}:textfile=${rel(txt1)}:fontcolor=white:fontsize=54:line_spacing=18:x=(w-text_w)/2:y=780-text_h/2`,
    `drawtext=fontfile=${FONT}:textfile=${rel(txt2)}:fontcolor=${GREEN}:fontsize=76:x=(w-text_w)/2:y=1180-text_h/2`,
  ].join(",");
  ffmpeg([
    "-f", "lavfi", "-i", `color=c=${INK}:s=${W}x${H}:r=${FPS}`,
    "-vf", vf,
    ...encFlags(dur), out,
  ]);
}

function plates() {
  for (const pieza of PIEZAS) {
    plate({ outName: `${pieza.slug}-why`, dur: 5, lines: pieza.why }); // banda 3-8s
    plateCta({ outName: `${pieza.slug}-cta`, dur: 4, lines: pieza.cta, keyword: pieza.keyword }); // banda 8-12s
  }
}

function concat() {
  for (const pieza of PIEZAS) {
    const archivos = [
      ...pieza.estados.map((e) => join(RAW, `${pieza.slug}-${e.n}-clip.mp4`)),
      join(RAW, `${pieza.slug}-why.mp4`),
      join(RAW, `${pieza.slug}-cta.mp4`),
    ];
    const list = join(RAW, `${pieza.slug}-list.txt`);
    writeFileSync(list, archivos.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"), "utf8");
    const out = join(HERE, `${pieza.slug}.mp4`);
    ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out]);
    console.log(`listo ${out}`);
  }
}

const fase = process.argv[2] || "all";
if (fase === "capture" || fase === "all") await capturar();
if (fase === "clips" || fase === "all") clips();
if (fase === "plates" || fase === "all") plates();
if (fase === "concat" || fase === "all") concat();
