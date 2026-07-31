// editor-videos — ESTILO DE ILUSTRACIÓN: la capa que hace que 155 videos parezcan una serie.
//
// El reel de @human___academy genera los recortes "ya en el estilo correcto" pidiéndoselo al
// modelo. Probado 2026-07-30 con recraft_v4_1: pedir "1960s newspaper photograph, coarse
// halftone" devuelve una foto en blanco y negro LIMPIA, sin retícula. Un modelo obedece el
// estilo "más o menos", y ese "más o menos" cambia entre una imagen y la siguiente — con 155
// videos eso ya no es una serie, es un collage.
//
// Entonces: el MODELO pone el CONTENIDO (qué se ve) y el CÓDIGO pone el ESTILO (cómo se ve).
// Este script aplica el tratamiento de la casa a CUALQUIER imagen —venga de Higgsfield, de un
// modelo gratis o de una foto del celular— y siempre sale igual. Determinista: misma entrada,
// mismos flags, mismo PNG.
//
// Uso:
//   node illustration-style.mjs --image bruta.png --out assets/ilu.png [--preset diario]
//        [--dot 4] [--mix 0.78] [--contrast 1.35] [--grain 6] [--dry-run]
//
// Presets:
//   onia      — EL DE LA SERIE. Duotono a la paleta de marca (ink #0A0F0D → surface #F4F5F2,
//               que NO son negro y blanco puros) y el verde #00D26A en la TINTA. El dibujo
//               comparte color con la etiqueta de la tarjeta: se lee como un sistema.
//   oniaClaro — igual pero más suave, para cuando el apoyo va sobre fondo claro.
//   diario / grabado / limpio — neutros, SIN marca. Para material que no va en la serie.
import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const argv = process.argv.slice(2);
const has = (n) => argv.includes("--" + n);
const flag = (n, d) => {
  const i = argv.indexOf("--" + n);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : d;
};
const fail = (m) => {
  console.error("illustration-style: " + m);
  process.exit(1);
};

// Paleta de marca (hermes-content/brand/ONIA_BRAND_IDENTITY.md §2).
// El Ink NO es negro puro: es un verde-negro cálido. Ese matiz es la identidad.
export const MARCA = {
  ink: [0x0a, 0x0f, 0x0d], // #0A0F0D  sombras
  surface: [0xf4, 0xf5, 0xf2], // #F4F5F2  luces
  verde: [0x00, 0xd2, 0x6a], // #00D26A  acento de la serie
};

export const PRESETS = {
  // ---- el look de la CASA -------------------------------------------------
  // Duotono ink→surface (no blanco y negro: el negro cálido de marca) + el verde
  // SOLO en las luces altas. La marca manda 60-30-10 y dice literal que "el verde
  // es acento de alto contraste, no relleno": por eso `accentFrom` arranca alto
  // (0.80) y la mezcla no llega a 1 — el verde toca ~10% del cuadro, no lo tiñe.
  // accent 0.45 = ELEGIDO por Sergio (2026-07-31) como estandar de la serie: los trazos
  // mas densos se quedan en tinta y el resto vira a verde, que es mas fiel a "verde =
  // acento" que teñir el dibujo entero.
  onia: { dot: 3, mix: 0.72, contrast: 1.4, brightness: 0.0, grain: 4, duotone: true, accent: 0.45, accentSide: "sombras", accentTo: 0.3 },
  // para cuando una pieza necesita gritar la marca (portada, hito, remate)
  oniaFuerte: { dot: 3, mix: 0.72, contrast: 1.4, brightness: 0.0, grain: 4, duotone: true, accent: 0.9, accentSide: "sombras", accentTo: 0.3 },
  oniaClaro: { dot: 3, mix: 0.6, contrast: 1.3, brightness: 0.06, grain: 3, duotone: true, accent: 0.6, accentSide: "sombras", accentTo: 0.22 },
  // ---- neutros (sin marca): para material que NO va en la serie ------------
  diario: { dot: 4, mix: 0.78, contrast: 1.35, brightness: 0.02, grain: 6 },
  grabado: { dot: 3, mix: 0.92, contrast: 1.6, brightness: 0.0, grain: 4 },
  limpio: { dot: 0, mix: 0, contrast: 1.25, brightness: 0.03, grain: 3 },
};

// Duotono + acento: cada canal se interpola de ink a surface segun la luminancia,
// y las luces por encima de `from` se empujan hacia el verde. Todo en UNA pasada
// de geq para no encadenar filtros que redondean dos veces.
export function duotoneExpr(canal, p, marca = MARCA) {
  const i = { r: 0, g: 1, b: 2 }[canal];
  const lo = marca.ink[i];
  const hi = marca.surface[i];
  const ac = marca.verde[i];
  const k = Math.max(0, Math.min(1, Number(p.accent ?? 0)));
  // OJO: geq sobre RGB no expone lum() — solo r()/g()/b(). A esta altura la imagen
  // ya viene en gris (los tres canales iguales), asi que r(X,Y) ES la luminancia.
  const l = "(r(X,Y)/255)";
  const base = `(${lo}+(${hi - lo})*${l})`;
  if (!k) return base;
  // El acento va en la TINTA (las sombras), no en las luces. Medido 2026-07-31: en un
  // grabado —linea sobre papel— las luces son el FONDO y ocupan el 85-91% del cuadro,
  // asi que acentuar ahi pintaba de verde casi todo y rompia el 60-30-10 de la marca.
  // Los trazos oscuros son ~10-20%: ese es el 10% que la marca deja para el verde.
  const side = String(p.accentSide ?? "sombras");
  const to = Math.max(0.01, Math.min(1, Number(p.accentTo ?? 0.35)));
  const t =
    side === "luces"
      ? `clip((${l}-${1 - to})/${to}\\,0\\,1)`
      : `clip((${to}-${l})/${to}\\,0\\,1)`;
  return `(${base}*(1-${t}*${k})+${ac}*${t}*${k})`;
}

// Retícula de medios tonos REAL: el punto crece con la oscuridad, no es una trama fija
// encima. El umbral sube hacia el centro de cada celda, así que en las zonas claras solo
// sobrevive un punto chico en el centro y en las oscuras el punto se come la celda.
export function halftoneExpr(dot) {
  const s = Math.max(2, Number(dot));
  return `255*gt(lum(X,Y)\\,255*(0.5+0.45*sin(PI*X/${s})*sin(PI*Y/${s})))`;
}

export function buildFilter(p) {
  const base = `format=gray,eq=contrast=${p.contrast}:brightness=${p.brightness}`;
  const grain = p.grain > 0 ? `,noise=alls=${p.grain}:allf=t+u:all_seed=1312` : "";
  // El duotono va DESPUES de la retícula: si se tiñe primero, el punto de medios
  // tonos se calcula sobre el verde y la trama sale de otro color en cada zona.
  const marca = p.duotone
    ? `,format=rgb24,geq=r='${duotoneExpr("r", p)}':g='${duotoneExpr("g", p)}':b='${duotoneExpr("b", p)}'`
    : "";
  if (!(p.dot > 0) || !(p.mix > 0)) return `[0:v]${base}${grain}${marca},format=rgb24[out]`;
  // split → una rama con la retícula, otra sin ella, y se mezclan: 100% de trama se ve
  // durísimo en un video, y mezclada con el gris conserva la lectura de la imagen.
  return (
    `[0:v]${base},split[a][b];` +
    `[b]geq=lum='${halftoneExpr(p.dot)}'[ht];` +
    `[a][ht]blend=all_mode=normal:all_opacity=${p.mix}${grain}${marca},format=rgb24[out]`
  );
}

// ---- CLI --------------------------------------------------------------------
const isMain = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("illustration-style.mjs");
if (isMain) {
  const IMAGE = flag("image");
  const OUT = flag("out");
  const PRESET = flag("preset", "diario");
  if (!IMAGE) fail("falta --image <bruta.png>");
  if (!OUT) fail("falta --out <tratada.png>");
  if (!existsSync(IMAGE)) fail(`no existe la imagen: ${IMAGE}`);
  if (!PRESETS[PRESET]) fail(`--preset desconocido "${PRESET}" (usá: ${Object.keys(PRESETS).join(" | ")})`);

  const p = { ...PRESETS[PRESET] };
  if (flag("dot") !== undefined) p.dot = Number(flag("dot"));
  if (flag("mix") !== undefined) p.mix = Number(flag("mix"));
  if (flag("contrast") !== undefined) p.contrast = Number(flag("contrast"));
  if (flag("grain") !== undefined) p.grain = Number(flag("grain"));
  if (!(p.mix >= 0 && p.mix <= 1)) fail("--mix va de 0 a 1");
  if (p.dot && p.dot < 2) fail("--dot mínimo 2 (más chico no imprime punto, ensucia)");

  const filter = buildFilter(p);
  // Tambien trata VIDEO: un clip generado (Higgsfield) tiene que pasar por el MISMO
  // tratamiento que las imagenes, o el plano generado desentona con los demas.
  const esVideo = /\.(mp4|mov|webm|mkv|m4v)$/i.test(OUT);
  const args = esVideo
    ? ["-y", "-i", IMAGE, "-filter_complex", filter, "-map", "[out]", "-map", "0:a?",
       "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
       "-c:a", "copy", "-movflags", "+faststart", OUT]
    : ["-y", "-i", IMAGE, "-filter_complex", filter, "-map", "[out]", "-frames:v", "1", OUT];

  console.log(`\nESTILO DE ILUSTRACIÓN — preset "${PRESET}"`);
  console.log(`  retícula: ${p.dot > 0 ? `punto ${p.dot}px, mezcla ${Math.round(p.mix * 100)}%` : "sin retícula"}`);
  console.log(`  contraste ${p.contrast} · grano ${p.grain}`);
  console.log(`  ${IMAGE} → ${OUT}\n`);
  console.log("filter_complex:\n" + filter + "\n");

  if (has("dry-run")) {
    console.error("--dry-run: no se escribió nada.");
    process.exit(0);
  }
  mkdirSync(dirname(resolve(OUT)), { recursive: true });
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.error) fail(`no pude ejecutar ffmpeg: ${r.error.message}`);
  if (r.status !== 0) fail(`ffmpeg falló: ${String(r.stderr || "").split("\n").slice(-6).join("\n")}`);
  console.log(`illustration-style: listo → ${OUT}`);
  console.log(`siguiente: meterla en el marco de papel →`);
  console.log(`  node make-mockup.mjs --template custom --html-file ../assets/html/recorte-diario.html --image ${OUT} --out assets/recorte.png --title "…" --label "…"`);
}
