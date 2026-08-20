#!/usr/bin/env node
/**
 * emit_design_md.mjs — DESIGN.md de un cliente como VISTA generada desde la anatomía medida.
 *
 * No es una tercera fuente de verdad: lee data/references/design-sources/anatomia/<slug>.json
 * (lo que midió extract_web_anatomy.mjs contra el sitio real) y lo re-escribe como contrato
 * visual prescriptivo ("construí una página que se vea así"). Si el sitio cambia, se re-mide
 * y se re-emite; nunca se edita a mano.
 *
 * Uso:
 *   node harvester/vision/extract_web_anatomy.mjs --url http://localhost:4519 --slug cliente
 *   node harvester/vision/emit_design_md.mjs --slug cliente [--direccion "texto"] [--nota "texto"] [--out ruta] [--force]
 *
 * Salida por defecto: data/clients/<slug>.design.md
 * Se niega a pisar un archivo sin el marcador "design-md v1" (p.ej. una receta de
 * auto-design pre-build) salvo --force.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MARCADOR = "design-md v1";

function arg(nombre) {
  const i = process.argv.indexOf(nombre);
  return i > -1 ? process.argv[i + 1] : undefined;
}
const slug = arg("--slug");
if (!slug) {
  console.error('uso: node harvester/vision/emit_design_md.mjs --slug <slug> [--direccion "..."] [--nota "..."] [--out ruta] [--force]');
  process.exit(1);
}
const direccion = arg("--direccion");
const nota = arg("--nota");
const force = process.argv.includes("--force");
const rutaAnatomia = path.join(RAIZ, "data", "references", "design-sources", "anatomia", `${slug}.json`);
const rutaSalida = arg("--out") ?? path.join(RAIZ, "data", "clients", `${slug}.design.md`);

// ---------- helpers de color ----------
function parseRgb(s) {
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/.exec(s);
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
}
function hex(s) {
  const c = parseRgb(s);
  if (!c) return s;
  const h = (n) => n.toString(16).padStart(2, "0");
  const base = `#${h(c.r)}${h(c.g)}${h(c.b)}`;
  return c.a < 1 ? `${base} al ${Math.round(c.a * 100)}%` : base;
}
const lum = (c) => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
const croma = (c) => Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);

function rolFondo(s) {
  const c = parseRgb(s);
  if (!c) return "";
  if (croma(c) > 60) return "acento";
  if (lum(c) < 0.2) return "fondo oscuro";
  if (lum(c) > 0.97) return "fondo base";
  return "superficie alterna";
}
function rolTexto(s) {
  const c = parseRgb(s);
  if (!c) return "";
  if (c.a < 1) return lum(c) < 0.5 ? "cuerpo (tinte de marca)" : "cuerpo sobre oscuro";
  return lum(c) < 0.5 ? "texto principal" : "texto sobre oscuro";
}
function rolTipo(entrada) {
  const px = parseFloat(entrada);
  const peso = +(/w (\d+)/.exec(entrada)?.[1] ?? 400);
  const ls = parseFloat(/ls (-?[\d.]+)px/.exec(entrada)?.[1] ?? "0");
  // tracking positivo + peso alto en tamano chico = etiqueta/boton en mayusculas
  if (px <= 13 && ls > 0.3 && peso >= 600) return "etiqueta / botón (mayúsculas + tracking)";
  if (px >= 32) return "display";
  if (px >= 18) return "heading";
  if (px >= 13) return "cuerpo";
  return "etiqueta";
}

// ---------- carga ----------
if (!existsSync(rutaAnatomia)) {
  console.error(`No existe ${rutaAnatomia}. Primero medí el sitio:\n  node harvester/vision/extract_web_anatomy.mjs --url <url> --slug ${slug}`);
  process.exit(1);
}
const d = JSON.parse(await readFile(rutaAnatomia, "utf8"));
if (existsSync(rutaSalida) && !force) {
  const previo = await readFile(rutaSalida, "utf8");
  if (!previo.slice(0, 300).includes(MARCADOR)) {
    console.error(`${rutaSalida} existe y NO es un design-md generado (¿receta de auto-design?). Usá --force para pisarlo a propósito.`);
    process.exit(1);
  }
}

const esc = d.vistas.escritorio;
const t = esc.tokens;
const m = esc.movimiento;
const rutaAnatomiaRel = path.relative(RAIZ, rutaAnatomia).replaceAll("\\", "/");

// secciones reales: fuera los wrappers de página entera
const secciones = esc.secciones.filter((s) => s.etiqueta !== "div" || s.altoPantallas <= 3);

// duración máxima de transición medida
let durMax = 0;
for (const tr of m.transiciones) for (const mm of tr.valor.matchAll(/([\d.]+)s/g)) durMax = Math.max(durMax, +mm[1]);

const unidadesTotal = Object.values(m.unidades).reduce((a, b) => a + b, 0);
const pctUnidad = (k) => `${m.unidades[k]} (${Math.round((m.unidades[k] / unidadesTotal) * 100)}%)`;

const filas = (arr, fn) => arr.map(fn).join("\n");
const L = [];

L.push(`<!-- ${MARCADOR} · generado por harvester/vision/emit_design_md.mjs desde ${rutaAnatomiaRel} · NO EDITAR A MANO: re-medir y re-emitir -->`);
L.push(`# DESIGN.md — ${slug}`);
L.push("");
L.push(`> Contrato visual **medido** del sitio entregado. Sirve como único contexto de estilo`);
L.push(`> para construir una página nueva que se vea de esta familia. Todo número sale de`);
L.push(`> \`getComputedStyle\`/CSSOM/red contra ${d.url} (${d.medidoEl?.slice(0, 10) ?? "s/f"}),`);
L.push(`> vistas ${Object.keys(d.vistas).join(" / ")}. Detalle crudo: \`${rutaAnatomiaRel}\`.`);
L.push(`>`);
L.push(`> Regenerar: \`node harvester/vision/extract_web_anatomy.mjs --url <url> --slug ${slug}\``);
L.push(`> y luego \`node harvester/vision/emit_design_md.mjs --slug ${slug}\`.`);
L.push("");
L.push(`## Dirección visual`);
L.push(direccion ?? "*(pendiente de ojo humano — la capa 1 de la anatomía no se infiere sola)*");
if (nota) L.push(`\n> ${nota}`);
L.push("");
L.push(`## Paleta (medida, rol sugerido por frecuencia y croma)`);
L.push("");
L.push(`| Rol | Hex | Usos medidos |`);
L.push(`|---|---|---|`);
L.push(filas(t.fondos.slice(0, 6), (c) => `| ${rolFondo(c.valor)} | \`${hex(c.valor)}\` | ${c.veces}× como fondo |`));
L.push(filas(t.coloresTexto.slice(0, 6), (c) => `| ${rolTexto(c.valor)} | \`${hex(c.valor)}\` | ${c.veces}× como texto |`));
L.push("");
L.push(`## Tipografía`);
L.push("");
L.push(`- Familias medidas: ${t.familias.map((f) => `**${f.valor}** (${f.veces}×)`).join(", ")}${t.familias.length === 1 ? " — una sola familia, sin pareja tipográfica." : ""}`);
L.push(`- Pesos cargados: ${esc.rendimiento.fuentesCargadas.join(", ") || "no medido"}`);
L.push("");
L.push(`| Rol | Escalón medido (tamaño / interlineado / tracking / peso) | Usos |`);
L.push(`|---|---|---|`);
L.push(filas(t.escalaTipografica.slice(0, 10), (e) => `| ${rolTipo(e.valor)} | \`${e.valor}\` | ${e.veces}× |`));
const displays = t.escalaTipografica.filter((e) => parseFloat(e.valor) >= 32);
if (displays.length) {
  const pesoMax = Math.max(...displays.map((e) => +(/w (\d+)/.exec(e.valor)?.[1] ?? 0)));
  L.push("");
  L.push(`Leyes del display: peso máximo medido **${pesoMax}** (el impacto sale del tamaño y del tracking negativo, no del bold); el interlineado comprime al crecer el tamaño.`);
}
L.push("");
L.push(`## Ritmo y espaciado`);
L.push("");
L.push(`- Unidades del CSS: em ${pctUnidad("em")} · rem ${pctUnidad("rem")} · px ${pctUnidad("px")} · clamp ${pctUnidad("clamp")} · vw ${pctUnidad("vw")}.`);
L.push(`- Escala de espaciado medida (los que se repiten SON la escala): ${t.escalaEspaciado.slice(0, 8).map((e) => `${e.valor} (${e.veces}×)`).join(" · ")}.`);
L.push(`- Breakpoints reales de las media queries: ${m.breakpointsPx.map((b) => `${b.px}px`).join(", ")} — usar ESTOS, no los supuestos.`);
L.push(`- Desborde horizontal: ${Object.entries(d.vistas).map(([k, v]) => `${k} ${v.arquitecturaPagina.desbordeHorizontal ? "SÍ ⚠️" : "no"}`).join(" · ")}.`);
L.push("");
L.push(`## Radios, sombras y capas`);
L.push("");
L.push(`- Radios distintos: ${t.radiosDistintos}${t.radiosDistintos <= 3 ? " (sistema contenido)" : " ⚠️ (¿hay sistema?)"}${t.radios.length ? ` — ${t.radios.slice(0, 5).map((r) => r.valor).join(", ")}` : ""}.`);
L.push(`- Sombras distintas: ${t.sombrasDistintas}.`);
L.push(`- z-index en uso: ${t.zIndex.map((z) => z.valor).join(", ") || "ninguno"} — no inventar niveles nuevos.`);
L.push("");
L.push(`## Movimiento`);
L.push("");
L.push(`| Transición medida | Usos |`);
L.push(`|---|---|`);
L.push(filas(m.transiciones.slice(0, 8), (tr) => `| \`${tr.valor}\` | ${tr.veces}× |`));
L.push("");
L.push(`- ${m.transicionesDistintas} transiciones distintas y ${m.keyframesDeclarados} \`@keyframes\`${m.transicionesDistintas <= 12 ? " — es un sistema, no decisiones sueltas" : ""}.`);
L.push(`- Duración máxima medida: **${durMax}s**. Nada más lento que eso.`);
L.push(`- \`transition: all\`: ${m.transitionAll} elementos${m.transitionAll === 0 ? " — prohibido introducirlo" : " ⚠️ (deuda: estrechar)"}.`);
L.push(`- \`prefers-reduced-motion\`: media query ${m.tieneReducedMotion ? "presente" : "AUSENTE ⚠️"}; ejecutado con la preferencia activa quedan ${d.reducedMotion.conAnimacion} animando y ${d.reducedMotion.conTransicion} con transición.`);
L.push(`- Movimiento ligado al scroll: ${esc.scroll.hayMovimientoLigadoAlScroll ? "sí (muestreado en 5 posiciones)" : "no"}.`);
if (esc.scroll.pegados.length) {
  L.push(`- Pegados: ${esc.scroll.pegados.map((p) => `\`${p.etiqueta}\` ${p.posicion} (${p.clase.split(" ").slice(0, 3).join(" ")})`).join(" · ")}.`);
}
L.push("");
L.push(`## Gramática de secciones (escritorio, en orden)`);
L.push("");
L.push(`| # | Fondo | Alto | Titular | CTA |`);
L.push(`|---|---|---|---|---|`);
L.push(filas(secciones, (s) => `| ${s.orden} | \`${hex(s.fondo)}\` | ${s.altoPantallas} pant. | ${s.titular?.slice(0, 60) ?? ""} | ${s.cta?.slice(0, 40) ?? ""} |`));
L.push("");
L.push(`El ritmo claro/oscuro de la página: ${secciones.map((s) => { const c = parseRgb(s.fondo); return c && lum(c) < 0.2 ? "■" : "□"; }).join(" ")} (■ oscuro, □ claro).`);
L.push("");
L.push(`## Conversión`);
L.push("");
const escalonBoton = t.escalaTipografica.find((e) => rolTipo(e.valor).startsWith("etiqueta / botón"));
if (escalonBoton) {
  L.push(`- Tratamiento de botón/control: el escalón \`${escalonBoton.valor}\` en MAYÚSCULAS con su tracking — los CTAs no usan el cuerpo, usan la etiqueta.`);
}
L.push(`- CTAs distintos: ${esc.conversion.ctasDistintos}. Los que más se repiten: ${esc.conversion.ctasTop.slice(0, 5).map((c) => `"${c.texto}" (${c.veces}×)`).join(", ")}.`);
for (const f of esc.conversion.formularios.slice(0, 3)) {
  L.push(`- Formulario: ${f.campos.length} campos (${f.campos.map((c) => c.tipo + (c.requerido ? "*" : "")).join(", ")}) → botón "${f.boton}".`);
}
L.push("");
L.push(`## Presupuesto (el peso medido es el TECHO, no la meta)`);
L.push("");
L.push(`- Total ${esc.rendimiento.pesoTotalKb} KB · ${Object.entries(esc.rendimiento.porTipoKb).map(([k, v]) => `${k} ${v} KB`).join(" · ")}.`);
L.push(`- ${Object.values(esc.rendimiento.pedidos).reduce((a, b) => a + b, 0)} pedidos (${Object.entries(esc.rendimiento.pedidos).map(([k, v]) => `${k} ${v}`).join(", ")}) · ${esc.rendimiento.hostsDistintos} hosts · terceros: ${esc.rendimiento.terceros.length ? esc.rendimiento.terceros.map((x) => `${x.host} (${x.pedidos})`).join(", ") : "ninguno"}.`);
L.push("");
L.push(`## Contrastes medidos (pares más frecuentes)`);
L.push("");
L.push(`| Texto | Fondo | Ratio | AA |`);
L.push(`|---|---|---|---|`);
L.push(filas(esc.accesibilidad.contrastes.slice(0, 6), (c) => `| \`${hex(c.texto)}\` | \`${hex(c.fondo)}\` | ${c.ratio} | ${c.ratio >= 4.5 ? "✓" : "✗"} |`));
L.push("");
L.push(`Los pares ✗ que aparezcan pueden ser artefactos del muestreo (texto sobre imagen o capa intermedia): verificar mirando antes de heredarlos como defecto.`);
L.push("");
L.push(`## Qué NO dice este archivo`);
L.push("");
L.push(`- ${d.requiereOjoHumano.join("\n- ")}`);
if (d.noSePudoMedir.length) L.push(`- No se pudo medir: ${d.noSePudoMedir.join("; ")}.`);
L.push("");

await mkdir(path.dirname(rutaSalida), { recursive: true });
await writeFile(rutaSalida, L.join("\n"), "utf8");
console.log(rutaSalida);
