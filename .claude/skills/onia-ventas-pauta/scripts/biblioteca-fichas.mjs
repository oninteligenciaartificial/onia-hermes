#!/usr/bin/env node
// Genera una ficha por anunciante desde el JSON de la Biblioteca + las lecturas escritas a mano.
//   node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs [json] [carpeta-de-salida]
// Por defecto: BIBLIOTECA-10OCT.json y hermes-content/research/competencia/anuncios/fichas/.
// Las cifras salen del JSON; el texto de LECTURAS.json se conserva al regenerar con un corte nuevo (p. ej. el del 24-oct).
// La edad de un anuncio NO es rendimiento: lo dice cada ficha.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const jsonRuta = process.argv[2] || "hermes-content/research/competencia/anuncios/BIBLIOTECA-10OCT.json";
const salida = process.argv[3] || "hermes-content/research/competencia/anuncios/fichas";
const d = JSON.parse(readFileSync(jsonRuta, "utf8"));
const lect = JSON.parse(readFileSync(path.join(salida, "LECTURAS.json"), "utf8"));
const capturasRuta = path.join(salida, "CAPTURAS-11OCT.json");
const capturas = existsSync(capturasRuta) ? JSON.parse(readFileSync(capturasRuta, "utf8")) : {};
const corte = d.meta.fecha;

// página(s) del JSON → ficha
const MAPA = {
  doctocliq: ["Doctocliq"], citapro: ["CitaPro"], dtdental: ["Dt.Dental Software Odontologico"], agendapro: ["AgendaPro"],
  dentalink: ["Dentalink"], calu: ["Calu"], reservo: ["Reservo Software", "Reservo"], huli: ["Huli México"], karbonna: ["Karbonna"],
  doctorpro: ["DoctorPro"], wa7pro: ["Wa7pro"], balance: ["Balance Aesthetic Software"], alegra: ["Alegra - Contabilidad Inteligente"],
  jelou: [], medizona: [], nativecode: [], calendico: [], ultrapack: [],
};
const ORDEN = ["doctocliq", "citapro", "dtdental", "agendapro", "dentalink", "calu", "reservo", "huli", "karbonna", "doctorpro", "wa7pro", "balance", "alegra", "jelou", "medizona", "nativecode", "calendico", "ultrapack"];
const primero = (t) => t.split("|")[0].trim();
const esc = (s) => String(s).replace(/\|/g, "\\|");
const rango = (v) => (Math.min(...v) === Math.max(...v) ? `${v[0]} d` : `${Math.min(...v)}-${Math.max(...v)} d`);

function agrupar(ads) {
  const m = new Map();
  for (const a of ads) {
    const k = primero(a.titulo) || "(sin titular)";
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(a);
  }
  return [...m.entries()].map(([titulo, v]) => ({ titulo, copias: v.length, dias: v.map((a) => a.dias), ids: v.map((a) => a.id) }));
}

function fichaDe(slug) {
  const L = lect[slug];
  if (!L) throw new Error(`falta la lectura de ${slug} en LECTURAS.json`);
  const paginas = MAPA[slug].map((n) => [n, d.software[n]]).filter(([, s]) => s);
  const ads = paginas.flatMap(([, s]) => s.anuncios);
  const out = [];
  out.push(`# ${L.nombre}: ficha de la Biblioteca (corte ${corte})`);
  out.push("");
  out.push(`> Datos del conector \`Meta_ads\` (solo anuncios activos); lecturas a mano de \`LECTURAS.json\`. **La edad de un anuncio no es rendimiento.** Estudio completo y límites: \`references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md\`.`);
  out.push("");
  if (!ads.length) {
    out.push(L.sin_datos_10oct ? `**Sin datos del corte ${corte}.** Solo capturas del 1-3 oct (\`CAPTURAS-HECHAS.md\`).` : `**Sin anuncios en el JSON** (ver \`volumen_sin_detalle\`).`);
  } else {
    const largos = ads.filter((a) => a.dias > 30);
    const completa = paginas.every(([, s]) => s.lista_completa);
    out.push("| | |");
    out.push("|---|---|");
    out.push(`| Páginas | ${paginas.map(([n, s]) => `${n} (\`${s.page_id}\`)`).join(" · ")} |`);
    const est = paginas.map(([, s]) => s.activos_estimados_por_la_biblioteca);
    const sumEst = est.every((e) => e != null) ? est.reduce((x, y) => x + y, 0) : null;
    const textoVistos = sumEst == null ? `${ads.length} (la Biblioteca no dio el total de activos)` : ads.length > sumEst ? `${ads.length} (una consulta dio ${sumEst} activos estimados: la cifra no es exacta)` : `${ads.length} de ${sumEst} activos estimados`;
    const incompleta11 = paginas.some(([, s]) => s.re_medicion_11oct?.lista_incompleta);
    out.push(`| Anuncios vistos | ${textoVistos} · lista ${completa ? "**completa**" : "**PARCIAL** (tope de 50, más nuevos primero)"}${incompleta11 ? " · **el 11-oct la Biblioteca devolvió más (ver `../TANDA-11OCT.md` §2): esta lista NO es completa**" : ""} |`);
    out.push(`| Más viejo | ${Math.max(...ads.map((a) => a.dias))} d |`);
    out.push(`| Con más de 30 d | ${largos.length} |`);
    out.push(`| Titulares distintos | ${new Set(ads.map((a) => primero(a.titulo))).size} |`);
    out.push(`| Moneda del anuncio | ${[...new Set(ads.map((a) => a.moneda))].join(", ")} |`);
  }
  out.push("");
  out.push("## Qué vende y cómo lo muestra");
  out.push("");
  out.push(`- **Qué vende:** ${L.que_vende}`);
  out.push(`- **Formato:** ${L.formato}`);
  out.push(`- **Oferta y botón:** ${L.oferta_cta}`);
  out.push(`- **Patrón:** ${L.patron}`);
  out.push("");
  out.push("## Qué copiar y qué no (catálogo §7 y §8)");
  out.push("");
  out.push(`- **Copiar:** ${L.copiar}`);
  out.push(`- **No copiar:** ${L.no_copiar}`);
  out.push("");
  if (ads.length) {
    const largos = ads.filter((a) => a.dias > 30);
    out.push("## Anuncios que pasan de 30 días");
    out.push("");
    if (!largos.length) out.push("Ninguno.");
    else {
      out.push("| Titular | Copias | Días | Ids |");
      out.push("|---|---|---|---|");
      for (const g of agrupar(largos).sort((a, b) => Math.max(...b.dias) - Math.max(...a.dias))) {
        out.push(`| ${esc(g.titulo.slice(0, 90))} | ${g.copias} | ${rango(g.dias)} | ${g.ids.slice(0, 3).map((i) => `\`${i}\``).join(" ")}${g.ids.length > 3 ? " …" : ""} |`);
      }
    }
    out.push("");
    const nuevos = ads.filter((a) => a.dias <= 30);
    if (nuevos.length) {
      out.push("## Titulares de los de 30 días o menos (los 8 más repetidos)");
      out.push("");
      out.push("| Titular | Copias | Días |");
      out.push("|---|---|---|");
      for (const g of agrupar(nuevos).sort((a, b) => b.copias - a.copias || a.titulo.localeCompare(b.titulo)).slice(0, 8)) {
        out.push(`| ${esc(g.titulo.slice(0, 90))} | ${g.copias} | ${rango(g.dias)} |`);
      }
      out.push("");
    }
  }
  if (capturas[slug]?.length) {
    out.push("## Capturas del 11-oct");
    out.push("");
    out.push("Fuente: `../CAPTURAS-50D-11OCT.md`; días del corte 10-oct. La antigüedad no es rendimiento; las afirmaciones del anuncio no están verificadas.");
    out.push("");
    out.push("| Id | Días al aire (fuente) | Formato que se ve | Texto principal | Llamado (titular · botón) | Ruta |");
    out.push("|---|---|---|---|---|---|");
    for (const c of capturas[slug]) {
      out.push(`| \`${c.id}\` | ${esc(c.dias ?? "no observable")} | ${esc(c.formato ?? "no observable")} | ${esc(c.texto_principal ?? "no observable")} | ${esc(c.llamado ?? "no observable")} | \`${c.ruta}\` |`);
    }
    out.push("");
  }
  out.push("## Límites");
  out.push("");
  out.push(`- ${L.notas}`);
  out.push("- El conector no trae formato, texto principal, botón, público ni gasto; lo marcado «(observado)» sale de los titulares o de las capturas del 1-3 oct.");
  out.push("- Se regenera con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` sobre un JSON nuevo (re-medición del 24-oct).");
  out.push("");
  return out.join("\n");
}

mkdirSync(salida, { recursive: true });
const indice = [];
for (const slug of ORDEN) {
  writeFileSync(path.join(salida, `${slug}.md`), fichaDe(slug));
  const paginas = MAPA[slug].map((n) => d.software[n]).filter(Boolean);
  const ads = paginas.flatMap((s) => s.anuncios);
  indice.push({ slug, nombre: lect[slug].nombre, vistos: ads.length, largos: ads.filter((a) => a.dias > 30).length, viejo: ads.length ? Math.max(...ads.map((a) => a.dias)) : null, completa: paginas.length ? paginas.every((s) => s.lista_completa) && !paginas.some((s) => s.re_medicion_11oct?.lista_incompleta) : null, incompleta11: paginas.some((s) => s.re_medicion_11oct?.lista_incompleta), sin: !ads.length });
}

// Bolivia: clínicas con anuncios de más de 30 días (sin páginas personales de profesionales ni ruido)
const RUIDO = /century 21|gooddental|medilink|global medical|fundepi|colegio de odont|academia|formación|cursos|posgrado/i;
const PERSONAL = /(^|\s)(dra?\.?|odont\.?)\s/i;
const bo = d.bolivia_rubro_mas_de_30_dias;
const porAnunciante = new Map();
let personales = 0, ruido = 0;
for (const a of bo) {
  if (PERSONAL.test(a.anunciante)) { personales++; continue; }
  if (RUIDO.test(a.anunciante)) { ruido++; continue; }
  if (!porAnunciante.has(a.anunciante)) porAnunciante.set(a.anunciante, []);
  porAnunciante.get(a.anunciante).push(a);
}
const lb = [];
lb.push(`# Clínicas dentales con alcance en Bolivia y anuncios de más de 30 días (corte ${corte})`);
lb.push("");
lb.push("> **Es una señal, no una lista de contacto.** Quien paga anuncios hace más de 30 días probablemente recibe mensajes de pacientes (inferencia: la Biblioteca no dice a dónde lleva el botón); **no prueba que tenga el problema de confirmar citas.** **Contactar a cualquiera requiere el OK escrito de Sergio Urcullo**; no se contactó a nadie. Lista y cruce con los prospectos de agosto: `ONIA_PROSPECTOS_DENTAL_SCZ.md` §5 y `ONIA_ADQUISICION_Y_PAUTA.md` §3.");
lb.push("");
lb.push(`${bo.length} anuncios de ${new Set(bo.map((a) => a.anunciante)).size} anunciantes; se omiten ${personales} anuncios de páginas personales de profesionales y ${ruido} de ruido (inmobiliaria, ofertas de empleo, equipos médicos, cursos). ${bo.filter((a) => !a.titulo.trim() || a.titulo.trim() === "{{product.name}}").length} no traen titular (el texto va en la imagen o el cuerpo, que el conector no trae).`);
lb.push("");
lb.push("| Clínica | Anuncios | Días | Titulares |");
lb.push("|---|---|---|---|");
for (const [n, v] of [...porAnunciante.entries()].sort((a, b) => Math.max(...b[1].map((x) => x.dias)) - Math.max(...a[1].map((x) => x.dias)))) {
  const t = [...new Set(v.map((a) => primero(a.titulo)).filter(Boolean))].slice(0, 3).map((x) => `«${esc(x.slice(0, 60))}»`).join(" · ") || "—";
  lb.push(`| ${esc(n.trim())} | ${v.length} | ${rango(v.map((a) => a.dias))} | ${t} |`);
}
lb.push("");
writeFileSync(path.join(salida, "bolivia-clinicas.md"), lb.join("\n"));

const ix = [];
ix.push(`# Fichas por anunciante de la Biblioteca de anuncios (corte ${corte})`);
ix.push("");
ix.push("Una ficha por anunciante, generada con `.claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` desde `../BIBLIOTECA-10OCT.json` y las lecturas a mano de `LECTURAS.json`. **La antigüedad no es rendimiento.** Qué dice y qué no dice la evidencia: `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md` y la skill `onia-ventas-pauta` §8.3.");
ix.push("");
ix.push("| Anunciante | Vistos | Con más de 30 d | Más viejo | Lista |");
ix.push("|---|---|---|---|---|");
for (const f of indice) ix.push(`| [${f.nombre}](${f.slug}.md) | ${f.sin ? "—" : f.vistos} | ${f.sin ? "—" : f.largos} | ${f.viejo ? f.viejo + " d" : "—"} | ${f.sin ? "sin datos del corte" : f.incompleta11 ? "**incompleta** (11-oct)" : f.completa ? "completa" : "parcial"} |`);
ix.push("");
ix.push("Además: [clínicas bolivianas con anuncios de más de 30 días](bolivia-clinicas.md) (señal, no lista de contacto).");
ix.push("");
writeFileSync(path.join(salida, "README.md"), ix.join("\n"));
console.log(`${indice.length} fichas + bolivia-clinicas.md + README.md en ${salida}`);
