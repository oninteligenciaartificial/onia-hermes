#!/usr/bin/env node
// Radar de Instagram (Sergio Urcullo, 8-oct: «un cron que lea las nuevas tendencias, scrapee IG y aprendas»).
// Lista los posts NUEVOS de dos fuentes, con la sesión de IG de la PC (la misma de fetch-video.mjs):
//   --feed            lo que Instagram le muestra a Sergio Urcullo en su inicio (1 página)
//   --cuentas a,b,c   las últimas publicaciones de esas cuentas (sus referentes)
// Opciones: --dias N (solo posts de los últimos N días, default 3) · --max N (por cuenta, default 4)
//           --marcar (guarda lo listado en .hermes/ig-radar/vistos.json para no repetirlo mañana)
// Sale: una línea JSON por post nuevo {fuente,usuario,url,fecha,tipo,likes,comentarios,caption}.
// Pocas llamadas y 2 s entre cuentas: IG marca las sesiones que piden mucho (Sergio Urcullo: «no quiero que me baneen»).
// Solo LEE: no da like, no comenta, no sigue.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { cookieHeader } from './ig-carousel.mjs';

// La sesión vive en el checkout principal (no se copian cookies entre worktrees). Sin `git` ni procesos hijos:
// el sandbox de Codex no deja lanzarlos (spawn EPERM), y Codex es el fallback de este radar.
const RAIZ = process.env.ONIA_RAIZ ?? import.meta.dirname.split(/[\\/]\.claude[\\/]/)[0];
const JAR = path.join(RAIZ, '.hermes', 'ig-session', 'cookies.txt');
const VISTOS = path.join(RAIZ, '.hermes', 'ig-radar', 'vistos.json');
const APP = '936619743392459';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i === -1 ? d : args[i + 1]; };
const dias = Number(opt('--dias', 3));
const max = Number(opt('--max', 4));
const desde = Date.now() / 1000 - dias * 86400;

const cookie = cookieHeader(JAR);
const csrf = /csrftoken=([^;]+)/.exec(cookie)?.[1] ?? '';
// Medido el 8-oct: sin las cabeceras sec-fetch IG responde 400 «SecFetch Policy violation». Con varias pruebas
// seguidas responde 429: una corrida por día, como mucho.
const H = {
  cookie, 'x-ig-app-id': APP, 'x-csrftoken': csrf, 'x-requested-with': 'XMLHttpRequest',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
  referer: 'https://www.instagram.com/', 'sec-fetch-site': 'same-origin', 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty',
};
const vistos = new Set(existsSync(VISTOS) ? JSON.parse(readFileSync(VISTOS, 'utf8')) : []);
const salida = [];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

function agregar(fuente, m) {
  const code = m.code ?? m.shortcode;
  const fecha = m.taken_at ?? m.taken_at_timestamp;
  if (!code || vistos.has(code) || fecha < desde) return;
  const caption = (m.caption?.text ?? m.edge_media_to_caption?.edges?.[0]?.node?.text ?? '').replace(/\s+/g, ' ');
  salida.push({
    fuente,
    usuario: m.user?.username ?? m.owner?.username ?? '',
    url: `https://www.instagram.com/p/${code}/`,
    fecha: new Date(fecha * 1000).toISOString().slice(0, 10),
    tipo: m.product_type === 'clips' ? 'reel' : m.carousel_media_count || m.edge_sidecar_to_children ? 'carrusel' : m.is_video || m.media_type === 2 ? 'video' : 'foto',
    likes: m.like_count ?? m.edge_liked_by?.count ?? null,
    comentarios: m.comment_count ?? m.edge_media_to_comment?.count ?? null,
    caption: caption.slice(0, 300),
  });
}

if (args.includes('--feed')) {
  const r = await fetch('https://www.instagram.com/api/v1/feed/timeline/', {
    method: 'POST',
    headers: { ...H, 'content-type': 'application/x-www-form-urlencoded' },
    body: 'reason=cold_start_fetch&is_pull_to_refresh=0',
  });
  if (!r.ok) throw new Error(`feed: HTTP ${r.status}`);
  const d = await r.json();
  for (const it of d.feed_items ?? d.items ?? []) {
    const m = it.media_or_ad ?? it.media ?? it;
    if (m && !m.ad_id && !m.injected) agregar('feed', m);
  }
}

for (const u of (opt('--cuentas', '') || '').split(',').map((s) => s.trim().replace(/^@/, '')).filter(Boolean)) {
  const r = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(u)}`, { headers: H });
  // 429 = sesión limitada: seguir pidiendo la alarga (SKILL.md, «se para hasta mañana»).
  if (r.status === 429) { console.error(`${u}: HTTP 429, corto el radar hasta mañana`); break; }
  if (!r.ok) { console.error(`${u}: HTTP ${r.status}`); await espera(2000); continue; }
  const edges = (await r.json()).data?.user?.edge_owner_to_timeline_media?.edges ?? [];
  for (const e of edges.slice(0, max)) agregar(`@${u}`, e.node);
  await espera(5000);
}

for (const p of salida) console.log(JSON.stringify(p));
if (args.includes('--marcar')) {
  mkdirSync(path.dirname(VISTOS), { recursive: true });
  writeFileSync(VISTOS, JSON.stringify([...vistos, ...salida.map((p) => p.url.split('/')[4])].slice(-3000)));
}
console.error(`ig-radar: ${salida.length} posts nuevos (últimos ${dias} días)`);
