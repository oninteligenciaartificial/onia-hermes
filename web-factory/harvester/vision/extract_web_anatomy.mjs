#!/usr/bin/env node
/**
 * extract_web_anatomy — la anatomia COMPLETA de una web, medida.
 *
 * Por que existe: `capture_reference_bank.mjs` saca titulares, CTAs y paleta.
 * Con eso se describe una web, no se REPRODUCE. Y el esquema de learned models
 * (data/references/reels/models/) nace de MIRAR un reel, asi que es cualitativo
 * ("serif editorial", "sans limpia"): sirve para elegir direccion, no para
 * copiar una mecanica. Cuando la web esta VIVA se puede medir todo, y eso es lo
 * que hace este script.
 *
 * Las 15 capas que extrae estan especificadas en docs/ANATOMIA_DE_UNA_WEB.md.
 * Ese doc es el contrato; este archivo lo implementa. Si agregas una capa alla,
 * agregala aca o el doc miente.
 *
 *   node harvester/vision/extract_web_anatomy.mjs --url https://ejemplo.com [--slug ejemplo]
 *     -> data/references/design-sources/anatomia/<slug>.json   (maquina)
 *     -> data/references/design-sources/anatomia/<slug>.md     (humano)
 *
 * REGLAS DE LA CASA QUE ESTE SCRIPT RESPETA (harvester/vision/README.md):
 * - NO guarda HTML ni CSS crudo de terceros. Guarda INVENTARIOS y AGREGADOS:
 *   cuantos radios distintos hay, que duraciones se repiten, que contraste da
 *   cada par. Eso es aprendizaje; una copia del CSS es otra cosa.
 * - Las capturas pesadas van fuera del repo.
 * - Los colores se guardan con su ROL para retokenizar, nunca para pegarlos.
 *
 * Lo que este script NO puede medir, y por eso lo declara en el reporte en vez
 * de inventarlo: intencion de diseno, calidad del copy, y cualquier cosa detras
 * de un login o un muro de cookies que no se pudo cerrar.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const DESTINO = path.join(RAIZ, "data", "references", "design-sources", "anatomia");
const CAPTURAS = "C:/Users/PC/.codex/design-stack/screenshots/anatomia";

const VISTAS = [
  { id: "movil", width: 390, height: 844 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "escritorio", width: 1440, height: 900 },
];

function arg(nombre, defecto) {
  const i = process.argv.indexOf(nombre);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : defecto;
}

function slugificar(url) {
  return url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

/** Top-N de un mapa de frecuencias, que es como se ve un sistema de diseno. */
function top(mapa, n = 14) {
  return Object.entries(mapa)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([valor, veces]) => ({ valor, veces }));
}

// ---------------------------------------------------------------- red y peso

/**
 * El peso se mide por lo que el navegador BAJA, no por lo que dice el bundler.
 * Se agrupa por tipo porque el presupuesto de la casa es por tipo (150 KB de JS,
 * 30 KB de CSS en una landing).
 */
function engancharRed(page, estado) {
  page.on("response", async (res) => {
    try {
      const url = res.url();
      if (url.startsWith("data:")) return;
      const tipo = res.request().resourceType();
      const largo = Number(res.headers()["content-length"] || 0);
      let bytes = largo;
      if (!bytes && ["stylesheet", "script", "document"].includes(tipo)) {
        bytes = (await res.body().catch(() => Buffer.alloc(0))).length;
      }
      estado.peso[tipo] = (estado.peso[tipo] || 0) + bytes;
      estado.pedidos[tipo] = (estado.pedidos[tipo] || 0) + 1;
      const host = new URL(url).host;
      estado.hosts[host] = (estado.hosts[host] || 0) + 1;
      // El CSS se guarda SOLO en memoria para contar patrones; nunca se escribe.
      if (tipo === "stylesheet" && estado.css.length < 12) {
        const texto = await res.text().catch(() => "");
        if (texto) estado.css.push(texto);
      }
    } catch {
      /* una respuesta que no se puede leer no invalida la medicion */
    }
  });
}

/**
 * Del CSS crudo solo salen CUENTAS. Que unidad usa el sitio para el ritmo
 * vertical es el dato que mas delata si hay sistema o improvisacion: Fanvue
 * tiene 98 `em` contra 0 `clamp()`, y esa proporcion es la ley que copiamos.
 */
function analizarCss(hojas) {
  const todo = hojas.join("\n");
  const cuenta = (re) => (todo.match(re) || []).length;
  // Los breakpoints tambien vienen en `rem` y en sintaxis de rango
  // (`@media (width >= 48rem)`), que es lo que emite Tailwind v4. Buscar solo `px`
  // devolvia "no detectados" en sitios que SI tienen breakpoints — un falso negativo
  // que se lee como si el sitio no tuviera ninguno. Se normaliza rem a px (1rem=16px).
  const breakpoints = [...todo.matchAll(/@media[^{]*?(\d+(?:\.\d+)?)(px|rem)/g)].map((m) =>
    Math.round(Number(m[1]) * (m[2] === "rem" ? 16 : 1)),
  );
  const conteo = {};
  for (const b of breakpoints) conteo[b] = (conteo[b] || 0) + 1;
  return {
    hojasLeidas: hojas.length,
    unidades: {
      em: cuenta(/\d+(\.\d+)?em\b/g),
      rem: cuenta(/\d+(\.\d+)?rem\b/g),
      px: cuenta(/\d+px\b/g),
      clamp: cuenta(/clamp\(/g),
      vw: cuenta(/\d+(\.\d+)?vw\b/g),
    },
    keyframesDeclarados: cuenta(/@keyframes/g),
    transitionAll: cuenta(/transition:\s*all\b/g),
    tieneReducedMotion: /prefers-reduced-motion/.test(todo),
    breakpointsPx: Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([px, veces]) => ({ px: Number(px), veces })),
  };
}

// -------------------------------------------------- medicion dentro del DOM

/**
 * Todo lo que se puede leer del documento vivo. Va en UN evaluate para no pagar
 * 15 viajes al navegador y para que todas las capas vean el MISMO estado.
 */
const MEDIR_EN_PAGINA = () => {
  const lim = (s, n = 160) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);
  const nodos = [...document.querySelectorAll("body *")].slice(0, 4000);

  // Normalizador de color a sRGB. Chrome NO convierte: `getComputedStyle` devuelve
  // `lab(98.26 0 0)` / `oklch(...)` / `color(srgb ...)` tal como los escribio el autor,
  // y leerles los numeros con una regex da basura — `lab(98.26 0 0)` es casi BLANCO y
  // parseado como RGB(98,26,0) sale marron oscuro. Asi se reprobo a shadcn con 1.5:1
  // cuando su texto sobre blanco da ~19:1. La unica lectura confiable es PINTAR el
  // color en un canvas y leer el pixel: sale sRGB + alpha sea cual sea la sintaxis.
  const lienzo = document.createElement("canvas");
  lienzo.width = 1;
  lienzo.height = 1;
  const pincel = lienzo.getContext("2d", { willReadFrequently: true });
  const aRgba = (c) => {
    try {
      pincel.clearRect(0, 0, 1, 1);
      pincel.fillStyle = c;
      pincel.fillRect(0, 0, 1, 1);
      const d = pincel.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], Math.round((d[3] / 255) * 1000) / 1000];
    } catch {
      return null;
    }
  };

  const freq = () => ({});
  const tipografia = freq();
  const colores = freq();
  const fondos = freq();
  const espaciado = freq();
  const radios = freq();
  const sombras = freq();
  const transiciones = freq();
  const familias = freq();
  const zIndex = freq();
  const pegados = [];
  let objetivosChicos = 0;
  let interactivos = 0;

  const sumar = (m, k) => {
    if (k) m[k] = (m[k] || 0) + 1;
  };

  for (const el of nodos) {
    const cs = getComputedStyle(el);
    const texto = el.textContent && el.textContent.trim().length > 0;
    const hijosTexto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

    if (hijosTexto) {
      // La escala tipografica REAL: tamano + interlineado + tracking + peso
      // juntos. Separados no dicen nada; juntos son el sistema.
      sumar(
        tipografia,
        `${Math.round(parseFloat(cs.fontSize))}px / lh ${
          cs.lineHeight === "normal" ? "normal" : (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2)
        } / ls ${cs.letterSpacing} / w ${cs.fontWeight}`,
      );
      sumar(colores, cs.color);
      sumar(familias, cs.fontFamily.split(",")[0].replace(/["']/g, ""));
    }
    if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)") sumar(fondos, cs.backgroundColor);
    for (const p of [cs.paddingTop, cs.paddingLeft, cs.marginTop, cs.gap]) {
      if (p && p !== "0px" && p !== "normal") sumar(espaciado, p);
    }
    if (cs.borderRadius && cs.borderRadius !== "0px") sumar(radios, cs.borderRadius);
    if (cs.boxShadow && cs.boxShadow !== "none") sumar(sombras, lim(cs.boxShadow, 60));
    // Solo cuenta como transicion si DURA. Un elemento sin ninguna transicion
    // serializa el atajo como `"all"` (property `all`, duracion `0s`), asi que
    // filtrar por el string dejaba pasar el DEFAULT del navegador y lo contaba
    // como decision de diseno: de ahi salieron los "889 elementos con
    // transition: all" de Fanvue, que en realidad no transicionan nada.
    if (parseFloat(cs.transitionDuration) > 0) sumar(transiciones, lim(cs.transition, 70));
    if (cs.zIndex && cs.zIndex !== "auto") sumar(zIndex, cs.zIndex);

    if (["sticky", "fixed"].includes(cs.position)) {
      const r = el.getBoundingClientRect();
      pegados.push({
        etiqueta: el.tagName.toLowerCase(),
        clase: lim(el.className?.toString?.() || "", 60),
        posicion: cs.position,
        alto: Math.round(r.height),
        top: cs.top,
      });
    }

    if (el.matches("a,button,input,select,textarea,[role=button]")) {
      interactivos += 1;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) objetivosChicos += 1;
    }
    void texto;
  }

  // Arquitectura de la pagina: el ORDEN y el TRABAJO de cada seccion.
  const secciones = [...document.querySelectorAll("body > *, main > *, body > div > *")]
    .filter((el) => el.getBoundingClientRect().height > 200)
    .slice(0, 40)
    .map((el, i) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        orden: i,
        etiqueta: el.tagName.toLowerCase(),
        clase: lim(el.className?.toString?.() || "", 70),
        altoPx: Math.round(r.height),
        altoPantallas: Math.round((r.height / window.innerHeight) * 10) / 10,
        fondo: cs.backgroundColor,
        titular: lim(el.querySelector("h1,h2")?.textContent || "", 90),
        cta: lim(el.querySelector("a[href],button")?.textContent || "", 40),
        imagenes: el.querySelectorAll("img,video,canvas,svg").length,
      };
    });

  const encabezados = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    nivel: Number(h.tagName[1]),
    texto: lim(h.textContent, 100),
  }));

  // Salto de nivel: h1 -> h3 rompe la navegacion del lector de pantalla.
  let saltos = 0;
  for (let i = 1; i < encabezados.length; i += 1) {
    if (encabezados[i].nivel - encabezados[i - 1].nivel > 1) saltos += 1;
  }

  const imgs = [...document.querySelectorAll("img")];
  const fuentes = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style}`);

  const formularios = [...document.querySelectorAll("form")].map((f) => ({
    accion: lim(f.getAttribute("action") || "", 80),
    campos: [...f.querySelectorAll("input,select,textarea")]
      .filter((c) => c.type !== "hidden")
      .map((c) => ({ tipo: c.type || c.tagName.toLowerCase(), nombre: c.name, requerido: c.required })),
    boton: lim(f.querySelector("button,[type=submit]")?.textContent || "", 40),
  }));

  const ctas = [...document.querySelectorAll("a[href],button")]
    .map((n) => lim(n.textContent, 40))
    .filter(Boolean);
  const ctaFreq = {};
  for (const c of ctas) ctaFreq[c] = (ctaFreq[c] || 0) + 1;

  // Cada color visto, resuelto a sRGB+alpha. Es lo que hace medible el contraste
  // sin importar en que sintaxis lo escribio el sitio.
  const rgbaPorColor = {};
  for (const c of [...Object.keys(colores), ...Object.keys(fondos)]) {
    if (!(c in rgbaPorColor)) rgbaPorColor[c] = aRgba(c);
  }

  return {
    tipografia,
    colores,
    fondos,
    rgbaPorColor,
    espaciado,
    radios,
    sombras,
    transiciones,
    familias,
    zIndex,
    pegados: pegados.slice(0, 12),
    secciones,
    arquitectura: {
      alturaTotalPx: document.documentElement.scrollHeight,
      alturaPantallas: Math.round((document.documentElement.scrollHeight / window.innerHeight) * 10) / 10,
      anchoBody: Math.round(document.body.getBoundingClientRect().width),
      desbordeHorizontal: document.documentElement.scrollWidth > window.innerWidth + 1,
      seccionesDetectadas: secciones.length,
    },
    encabezados: { total: encabezados.length, h1: encabezados.filter((h) => h.nivel === 1).length, saltos, lista: encabezados.slice(0, 25) },
    accesibilidad: {
      imagenes: imgs.length,
      sinAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      altVacio: imgs.filter((i) => i.getAttribute("alt") === "").length,
      sinDimensiones: imgs.filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).length,
      lazy: imgs.filter((i) => i.getAttribute("loading") === "lazy").length,
      conSrcset: imgs.filter((i) => i.hasAttribute("srcset")).length,
      interactivos,
      objetivosMenores44px: objetivosChicos,
      idioma: document.documentElement.lang || null,
      landmarks: {
        header: document.querySelectorAll("header").length,
        nav: document.querySelectorAll("nav").length,
        main: document.querySelectorAll("main").length,
        footer: document.querySelectorAll("footer").length,
      },
    },
    fuentesCargadas: [...new Set(fuentes)].slice(0, 20),
    conversion: {
      formularios,
      dialogos: document.querySelectorAll("dialog").length,
      ctasDistintos: Object.keys(ctaFreq).length,
      ctasTop: Object.entries(ctaFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t, n]) => ({ texto: t, veces: n })),
    },
    seo: {
      titulo: lim(document.title, 120),
      descripcion: lim(document.querySelector('meta[name=description]')?.content || "", 200),
      canonical: document.querySelector('link[rel=canonical]')?.href || null,
      og: document.querySelectorAll('meta[property^="og:"]').length,
      datosEstructurados: document.querySelectorAll('script[type="application/ld+json"]').length,
    },
    tecnologia: {
      next: !!document.querySelector("#__next, #__NEXT_DATA__"),
      webflow: !!document.querySelector("[data-wf-page], html.w-mod-js"),
      react: !!document.querySelector("[data-reactroot]") || !!window.React,
      gsap: !!window.gsap,
      swiper: !!document.querySelector(".swiper-initialized"),
      framer: !!document.querySelector("[data-framer-name]"),
    },
  };
};

/**
 * Arquitectura de SCROLL: es lo que no se ve en una captura. Se muestrea el
 * transform de una serie de elementos en varias posiciones de scroll — si
 * cambia, algo esta atado al dedo del scroll (parallax o scrub), y eso es una
 * decision cara que hay que saber ANTES de copiar la seccion.
 */
async function medirScroll(page) {
  const muestras = [0, 0.25, 0.5, 0.75, 1];
  const lecturas = [];
  for (const f of muestras) {
    await page.evaluate((frac) => window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * frac), f);
    await page.waitForTimeout(450);
    lecturas.push(
      await page.evaluate(() => {
        const els = [...document.querySelectorAll("body *")].slice(0, 900);
        const movidos = els
          .map((el) => getComputedStyle(el).transform)
          .filter((t) => t && t !== "none");
        return {
          y: Math.round(window.scrollY),
          conTransform: movidos.length,
          firma: movidos.slice(0, 60).join("|").slice(0, 4000),
          navFija: [...document.querySelectorAll("header,nav")].some((n) =>
            ["fixed", "sticky"].includes(getComputedStyle(n).position),
          ),
        };
      }),
    );
  }
  const firmas = new Set(lecturas.map((l) => l.firma));
  return {
    muestras: lecturas.map(({ y, conTransform, navFija }) => ({ y, conTransform, navFija })),
    // Si la firma de transforms cambia entre posiciones, hay movimiento atado
    // al scroll. Si no cambia nunca, el sitio anima al ENTRAR (que es la receta
    // que adoptamos: mas barata y no marea).
    hayMovimientoLigadoAlScroll: firmas.size > 1,
    posicionesDistintas: firmas.size,
  };
}

/**
 * Que hace el sitio con prefers-reduced-motion. No alcanza con que la media
 * query EXISTA: se vuelve a medir con la preferencia puesta y se compara.
 */
async function medirReducedMotion(page, url) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const els = [...document.querySelectorAll("body *")].slice(0, 2000);
    let conAnimacion = 0;
    let conTransicion = 0;
    for (const el of els) {
      const cs = getComputedStyle(el);
      if (cs.animationName && cs.animationName !== "none" && parseFloat(cs.animationDuration) > 0) conAnimacion += 1;
      if (parseFloat(cs.transitionDuration) > 0.05) conTransicion += 1;
    }
    return { conAnimacion, conTransicion };
  });
  await page.emulateMedia({ reducedMotion: null });
  return r;
}

/** Contraste WCAG real de los pares texto/fondo que mas se repiten. */
function contraste(rgb1, rgb2) {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = lum(rgb1);
  const b = lum(rgb2);
  return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
}

/** Un texto translucido SI se puede juzgar: se compone sobre su fondo. */
const componer = (fg, bg) => [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3])));

async function extraer(url, slug) {
  const { chromium } = await import("@playwright/test");
  const navegador = await chromium.launch();
  const resultado = { url, slug, medidoEl: new Date().toISOString(), vistas: {}, noSePudoMedir: [] };

  for (const vista of VISTAS) {
    const estado = { peso: {}, pedidos: {}, hosts: {}, css: [] };
    const ctx = await navegador.newContext({ viewport: { width: vista.width, height: vista.height } });
    const page = await ctx.newPage();
    engancharRed(page, estado);

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    } catch {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      } catch (e) {
        resultado.noSePudoMedir.push(`${vista.id}: la pagina no cargo (${String(e).slice(0, 120)})`);
        await ctx.close();
        continue;
      }
    }
    await page.waitForTimeout(1500);

    const dom = await page.evaluate(MEDIR_EN_PAGINA);
    const scroll = vista.id === "escritorio" ? await medirScroll(page) : null;

    // Pares texto/fondo mas frecuentes -> contraste real.
    // Un fondo TRANSLUCIDO no se puede juzgar aislado (no se sabe que hay detras),
    // asi que se descarta y se declara cuantos se descartaron. Antes se colaban y
    // producian filas de "1:1" que parecian un defecto del sitio y eran del script.
    const rgba = (s) => dom.rgbaPorColor?.[s] || null;
    const fondosOpacos = top(dom.fondos, 14)
      .map((x) => x.valor)
      .filter((v) => (rgba(v)?.[3] ?? 0) >= 0.95);
    const colorTop = top(dom.colores, 4).map((x) => x.valor);
    const fondoTop = fondosOpacos.slice(0, 3);
    const contrastes = [];
    for (const c of colorTop) {
      for (const f of fondoTop) {
        const a = rgba(c);
        const b = rgba(f);
        if (a && b) contrastes.push({ texto: c, fondo: f, ratio: contraste(componer(a, b), b.slice(0, 3)) });
      }
    }
    const fondosTranslucidosOmitidos = top(dom.fondos, 14).length - fondosOpacos.length;

    const totalPeso = Object.values(estado.peso).reduce((a, b) => a + b, 0);

    resultado.vistas[vista.id] = {
      viewport: `${vista.width}x${vista.height}`,
      arquitecturaPagina: dom.arquitectura,
      secciones: dom.secciones,
      encabezados: dom.encabezados,
      tokens: {
        escalaTipografica: top(dom.tipografia, 16),
        familias: top(dom.familias, 6),
        coloresTexto: top(dom.colores, 8),
        fondos: top(dom.fondos, 8),
        escalaEspaciado: top(dom.espaciado, 16),
        radios: top(dom.radios, 10),
        radiosDistintos: Object.keys(dom.radios).length,
        sombras: top(dom.sombras, 6),
        sombrasDistintas: Object.keys(dom.sombras).length,
        zIndex: top(dom.zIndex, 8),
      },
      movimiento: {
        transiciones: top(dom.transiciones, 12),
        transicionesDistintas: Object.keys(dom.transiciones).length,
        ...analizarCss(estado.css),
      },
      scroll: scroll ? { ...scroll, pegados: dom.pegados } : { pegados: dom.pegados },
      conversion: dom.conversion,
      accesibilidad: { ...dom.accesibilidad, contrastes, fondosTranslucidosOmitidos },
      rendimiento: {
        pesoTotalKb: kb(totalPeso),
        porTipoKb: Object.fromEntries(Object.entries(estado.peso).map(([k, v]) => [k, kb(v)])),
        pedidos: estado.pedidos,
        hostsDistintos: Object.keys(estado.hosts).length,
        terceros: Object.entries(estado.hosts)
          .filter(([h]) => !url.includes(h))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([host, n]) => ({ host, pedidos: n })),
        fuentesCargadas: dom.fuentesCargadas,
      },
      seo: dom.seo,
      tecnologia: dom.tecnologia,
    };

    if (vista.id === "escritorio") {
      resultado.reducedMotion = await medirReducedMotion(page, url);
      await mkdir(CAPTURAS, { recursive: true }).catch(() => {});
      await page
        .screenshot({ path: path.join(CAPTURAS, `${slug}-escritorio.png`), fullPage: false })
        .catch(() => resultado.noSePudoMedir.push("no se pudo guardar la captura de escritorio"));
    }

    await ctx.close();
  }

  await navegador.close();

  // Lo que ninguna medicion automatica alcanza. Se declara, no se simula.
  resultado.requiereOjoHumano = [
    "Intencion de diseno: por que eligieron ESTA direccion visual y no otra.",
    "Calidad del copy: si la promesa es creible y si los numeros estan respaldados.",
    "Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).",
    "Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.",
  ];
  return resultado;
}

// ------------------------------------------------------------ reporte legible

function reporte(r) {
  const e = r.vistas.escritorio;
  const m = r.vistas.movil;
  if (!e) return `# Anatomia de ${r.url}\n\nNo se pudo medir escritorio.\n\n${r.noSePudoMedir.join("\n")}\n`;

  const tabla = (filas) => filas.map((f) => `| ${f.join(" | ")} |`).join("\n");
  const u = e.movimiento.unidades;

  return `# Anatomia medida — ${r.url}

> Generado por \`harvester/vision/extract_web_anatomy.mjs\` el ${r.medidoEl.slice(0, 10)}.
> Criterios y por que cada uno importa: \`docs/ANATOMIA_DE_UNA_WEB.md\`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: ${e.arquitecturaPagina.alturaPantallas} pantallas en escritorio${m ? ` · ${m.arquitecturaPagina.alturaPantallas} en movil` : ""}
- **Secciones**: ${e.arquitecturaPagina.seccionesDetectadas}
- **Desborde horizontal**: ${e.arquitecturaPagina.desbordeHorizontal ? "SI (falla)" : "no"}${m ? ` · movil: ${m.arquitecturaPagina.desbordeHorizontal ? "SI (falla)" : "no"}` : ""}
- **Encabezados**: ${e.encabezados.total} (${e.encabezados.h1} h1, ${e.encabezados.saltos} saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
${e.secciones.slice(0, 14).map((s) => `| ${s.orden} | ${s.altoPantallas} | ${s.titular || "-"} | ${s.cta || "-"} | ${s.imagenes} |`).join("\n")}

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
${tabla(e.tokens.escalaTipografica.slice(0, 10).map((t) => [t.valor, t.veces]))}

**Familias**: ${e.tokens.familias.map((f) => `${f.valor} (${f.veces})`).join(" · ")}

**Espaciado** (los que de verdad se repiten): ${e.tokens.escalaEspaciado.slice(0, 10).map((s) => `${s.valor}×${s.veces}`).join(" · ")}

**Radios**: ${e.tokens.radiosDistintos} valores distintos${e.tokens.radiosDistintos > 8 ? " (contar valores finales NO mide el sistema: shadcn tiene 19 y todos salen de un `--radius` con calc())" : ""} · **Sombras**: ${e.tokens.sombrasDistintas} distintas

**Unidad del ritmo**: ${u.em} \`em\` · ${u.rem} \`rem\` · ${u.px} \`px\` · ${u.clamp} \`clamp()\` · ${u.vw} \`vw\`
${u.em > u.rem && u.em > u.clamp * 5 ? "→ sistema anclado a `em`: cambia un font-size y reescala la pagina entera en proporcion." : "→ ritmo mixto o en px/rem: cada token escala por su cuenta."}

**Breakpoints reales** (de las media queries): ${e.movimiento.breakpointsPx.map((b) => `${b.px}px`).join(" · ") || "no detectados"}

## 3. Movimiento

- **Transiciones distintas**: ${e.movimiento.transicionesDistintas} · **@keyframes declarados**: ${e.movimiento.keyframesDeclarados}
- **\`transition: all\`**: ${e.movimiento.transitionAll} veces${e.movimiento.transitionAll > 0 ? " ⚠️ anima todo, incluido layout" : ""}
- **prefers-reduced-motion en el CSS**: ${e.movimiento.tieneReducedMotion ? "si" : "NO"}
- **Con la preferencia PUESTA**: ${r.reducedMotion ? `${r.reducedMotion.conAnimacion} elementos siguen animando, ${r.reducedMotion.conTransicion} con transicion > 50ms` : "no medido"}
- **Movimiento atado al scroll**: ${e.scroll?.hayMovimientoLigadoAlScroll ? `SI (${e.scroll.posicionesDistintas} estados distintos en 5 posiciones)` : "no — anima al entrar, no al dedo del scroll"}

Transiciones mas usadas:
${e.movimiento.transiciones.slice(0, 6).map((t) => `- \`${t.valor}\` (${t.veces})`).join("\n")}

## 4. Scroll

- **Pegados** (sticky/fixed): ${e.scroll?.pegados?.length || 0}
${(e.scroll?.pegados || []).slice(0, 6).map((p) => `  - ${p.etiqueta}.${p.clase} — ${p.posicion}, alto ${p.alto}px, top ${p.top}`).join("\n")}
- **Nav fija al scrollear**: ${e.scroll?.muestras?.some((s) => s.navFija) ? "si" : "no"}

## 5. Conversion

- **CTAs distintos**: ${e.conversion.ctasDistintos} · **Formularios**: ${e.conversion.formularios.length} · **\`<dialog>\`**: ${e.conversion.dialogos}
- **CTA mas repetido**: ${e.conversion.ctasTop.slice(0, 4).map((c) => `"${c.texto}" ×${c.veces}`).join(" · ")}
${e.conversion.formularios.map((f) => `- Formulario → ${f.campos.length} campos (${f.campos.map((c) => c.tipo + (c.requerido ? "*" : "")).join(", ")}) · boton "${f.boton}"`).join("\n")}

## 6. Rendimiento

- **Peso total**: ${e.rendimiento.pesoTotalKb} KB en ${Object.values(e.rendimiento.pedidos).reduce((a, b) => a + b, 0)} pedidos
- **Por tipo**: ${Object.entries(e.rendimiento.porTipoKb).map(([k, v]) => `${k} ${v} KB`).join(" · ")}
- **Terceros**: ${e.rendimiento.hostsDistintos} hosts · ${e.rendimiento.terceros.map((t) => t.host).slice(0, 5).join(", ")}
- **Fuentes cargadas**: ${e.rendimiento.fuentesCargadas.length} (${e.rendimiento.fuentesCargadas.slice(0, 5).join(" · ")})

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS ${e.rendimiento.porTipoKb.script || 0} KB · CSS ${e.rendimiento.porTipoKb.stylesheet || 0} KB**.

## 7. Accesibilidad

- **Imagenes**: ${e.accesibilidad.imagenes} · sin \`alt\`: ${e.accesibilidad.sinAlt} · sin dimensiones: ${e.accesibilidad.sinDimensiones} · lazy: ${e.accesibilidad.lazy} · con \`srcset\`: ${e.accesibilidad.conSrcset}
- **Objetivos tactiles < 44px**: ${e.accesibilidad.objetivosMenores44px} de ${e.accesibilidad.interactivos} interactivos
- **Idioma**: ${e.accesibilidad.idioma || "SIN declarar"} · **Landmarks**: ${JSON.stringify(e.accesibilidad.landmarks)}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
${e.accesibilidad.contrastes.slice(0, 6).map((c) => `  - ${c.texto} sobre ${c.fondo} → **${c.ratio}:1**${c.ratio < 4.5 ? " ⚠️ bajo el minimo AA para texto normal" : ""}`).join("\n")}
  - _(${e.accesibilidad.fondosTranslucidosOmitidos ?? 0} fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: ${e.seo.titulo || "SIN title"}
- description: ${e.seo.descripcion ? `${e.seo.descripcion.length} caracteres` : "SIN description"}
- canonical: ${e.seo.canonical || "NO"} · OG: ${e.seo.og} · datos estructurados: ${e.seo.datosEstructurados}

## 9. Tecnologia detectada

${Object.entries(e.tecnologia).filter(([, v]) => v).map(([k]) => `- ${k}`).join("\n") || "- no detectada"}

## 10. Lo que NO se pudo medir

${(r.noSePudoMedir.length ? r.noSePudoMedir : ["nada: las tres vistas cargaron"]).map((x) => `- ${x}`).join("\n")}

Y lo que ninguna medicion automatica alcanza:
${r.requiereOjoHumano.map((x) => `- ${x}`).join("\n")}
`;
}

const url = arg("--url");
if (!url) {
  console.error("uso: node harvester/vision/extract_web_anatomy.mjs --url https://ejemplo.com [--slug ejemplo]");
  process.exit(1);
}
const slug = arg("--slug", slugificar(url));

await mkdir(DESTINO, { recursive: true });
const datos = await extraer(url, slug);
await writeFile(path.join(DESTINO, `${slug}.json`), JSON.stringify(datos, null, 2), "utf8");
await writeFile(path.join(DESTINO, `${slug}.md`), reporte(datos), "utf8");
console.log(`${path.join(DESTINO, `${slug}.md`)}\n${Object.keys(datos.vistas).length} vistas medidas · ${datos.noSePudoMedir.length} problemas`);
