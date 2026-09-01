#!/usr/bin/env node
/**
 * Mide el CIRCUITO de una cuenta de Instagram, pieza por pieza:
 *
 *   publicada -> alcance -> comentarios -> cuantos con la palabra clave
 *
 * Existe porque sin esto "perfeccionar el contenido" es adivinar: no sabiamos que
 * molde funcionaba porque no mediamos ninguno. Es a la vez la herramienta interna y,
 * el dia que haya clientes, el argumento que evita que den de baja el abono
 * ("tu contenido trajo N leads este mes").
 *
 * Uso:
 *   node ig_circuito_medir.mjs --token <IG_TOKEN> [--palabras SISTEMA,HUMO,LISTA]
 *                              [--limite 25] [--json salida.json]
 *   node ig_circuito_medir.mjs --self-check
 *
 * El token NUNCA se escribe al repo: se pasa por argumento. En el VPS lo entrega
 * `/opt/onia/ig-dm-token.sh peek [integration_id]`.
 *
 * ⚠️ Limitacion medida el 2026-08-23, no es un bug nuestro: la API devuelve
 * `username: undefined` en los comentarios de terceros (solo identifica los de la
 * propia cuenta). Se puede CONTAR quien comento la palabra, no saber quien es desde
 * aca — el DM automatico si lo resuelve, porque responde al comentario en su hilo.
 */

const API = "https://graph.instagram.com/v21.0";
const argv = process.argv.slice(2);
const has = (n) => argv.includes("--" + n);
const flag = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };

// Metricas que la cuenta devuelve hoy. Si Meta agrega o quita una, el script no
// muere: pide y reporta lo que llega (ver pedirInsights).
const METRICAS = ["reach", "saved", "shares", "total_interactions", "profile_visits", "follows"];

/** Normaliza para comparar: sin acentos, minusculas, sin signos. */
export function normalizar(s) {
  return String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** ¿El comentario pide una palabra clave? Compara por PALABRA COMPLETA. */
export function palabraEn(texto, palabras) {
  const t = " " + normalizar(texto) + " ";
  return palabras.find((p) => t.includes(" " + normalizar(p) + " ")) || null;
}

async function get(url) {
  const r = await fetch(url);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}

async function pedirInsights(id, token) {
  // Se piden de a una: si UNA metrica no aplica al tipo de medio, Meta rechaza la
  // llamada entera. Pedirlas sueltas hace que una falla no tape a las demas.
  const out = {};
  for (const m of METRICAS) {
    try {
      const j = await get(`${API}/${id}/insights?metric=${m}&access_token=${token}`);
      out[m] = j.data?.[0]?.values?.[0]?.value ?? null;
    } catch { out[m] = null; }
  }
  return out;
}

async function main() {
  const token = flag("token");
  if (!token) throw new Error("falta --token");
  const palabras = String(flag("palabras", "SISTEMA,HUMO,LISTA")).split(",").map((s) => s.trim()).filter(Boolean);
  const limite = Number(flag("limite", "25"));

  const yo = await get(`${API}/me?fields=id,username,followers_count,media_count&access_token=${token}`);
  const medios = await get(`${API}/me/media?fields=id,caption,media_type,timestamp,permalink,comments_count,like_count&limit=${limite}&access_token=${token}`);

  const filas = [];
  for (const m of medios.data || []) {
    const ins = await pedirInsights(m.id, token);
    let comentarios = [];
    try {
      const c = await get(`${API}/${m.id}/comments?fields=id,text,username,timestamp&access_token=${token}`);
      comentarios = c.data || [];
    } catch { /* un medio puede tener los comentarios cerrados */ }

    // Los comentarios de la PROPIA cuenta no cuentan: suelen ser los hashtags.
    const ajenos = comentarios.filter((c) => c.username !== yo.username);
    const conPalabra = ajenos.map((c) => ({ c, p: palabraEn(c.text, palabras) })).filter((x) => x.p);

    filas.push({
      id: m.id, fecha: m.timestamp?.slice(0, 10), tipo: m.media_type, permalink: m.permalink,
      alcance: ins.reach, interacciones: ins.total_interactions, visitasPerfil: ins.profile_visits,
      seguidas: ins.follows, guardados: ins.saved, compartidos: ins.shares,
      likes: m.like_count, comentarios: ajenos.length,
      conPalabra: conPalabra.length,
      palabras: conPalabra.map((x) => x.p),
      titulo: String(m.caption || "").replace(/\s+/g, " ").slice(0, 48),
    });
  }

  console.log(`\nCUENTA @${yo.username} · ${yo.followers_count} seguidores · ${yo.media_count} posts`);
  console.log("─".repeat(104));
  console.log(["fecha", "alcance", "inter", "visitas", "sigue", "coment", "PALABRA"].map((h, i) => h.padEnd([12, 8, 7, 8, 6, 7, 8][i])).join("") + "titulo");
  console.log("─".repeat(104));
  for (const f of filas) {
    console.log(
      String(f.fecha).padEnd(12) + String(f.alcance ?? "-").padEnd(8) + String(f.interacciones ?? "-").padEnd(7) +
      String(f.visitasPerfil ?? "-").padEnd(8) + String(f.seguidas ?? "-").padEnd(6) + String(f.comentarios).padEnd(7) +
      String(f.conPalabra || "").padEnd(8) + f.titulo);
  }
  const tot = (k) => filas.reduce((a, f) => a + (Number(f[k]) || 0), 0);
  console.log("─".repeat(104));
  console.log(`TOTAL  alcance=${tot("alcance")}  comentarios=${tot("comentarios")}  con palabra=${tot("conPalabra")}  visitas al perfil=${tot("visitasPerfil")}  seguidas=${tot("seguidas")}`);
  if (tot("conPalabra") > 0) {
    const usadas = [...new Set(filas.flatMap((f) => f.palabras))];
    console.log(`\n🔑 Palabras pedidas por gente real: ${usadas.join(", ")} — cada una deberia haber disparado un DM.`);
  }
  const salida = flag("json");
  if (salida) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(salida, JSON.stringify({ cuenta: yo.username, seguidores: yo.followers_count, piezas: filas }, null, 2));
    console.log(`\njson -> ${salida}`);
  }
}

if (has("self-check")) {
  const assert = (c, m) => { if (!c) { console.error("FALLA: " + m); process.exit(1); } };
  // El caso real que motiva el normalizado: la gente comenta en minuscula y sin acentos.
  assert(palabraEn("sistema", ["SISTEMA"]) === "SISTEMA", "debe matchear en minuscula");
  assert(palabraEn("Quiero SISTEMA!", ["SISTEMA"]) === "SISTEMA", "debe matchear con signos alrededor");
  assert(palabraEn("informacion", ["SISTEMA"]) === null, "no debe matchear otra palabra");
  // Palabra COMPLETA: si no, "LISTA" matchearia dentro de "listaste" y contariamos de mas.
  assert(palabraEn("ya listaste todo", ["LISTA"]) === null, "no debe matchear dentro de otra palabra");
  assert(palabraEn("mandame la LISTA porfa", ["LISTA"]) === "LISTA", "debe matchear como palabra suelta");
  console.log("self-check ok");
} else {
  main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
}
