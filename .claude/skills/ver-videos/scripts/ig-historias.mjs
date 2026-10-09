#!/usr/bin/env node
// Historias de Instagram de otras cuentas (pedido de Marca, 8-oct: «historias de @eriktaveras, @sanmunoz.ia…»).
// Con la sesión de IG de la PC (la misma de fetch-video.mjs), sin abrir el navegador:
//   node ig-historias.mjs --cuentas a,b,c --out DIR [--destacadas N] [--videos DIR_VIDEOS]
// Por cuenta deja en DIR/<usuario>/: NN.jpg (cuadro de cada historia, también de las de video) y meta.json
// (fecha, tipo, duración, stickers: link, encuesta, pregunta, mención, música; y destacadas con su título).
// Los mp4 van a --videos (fuera del repo: pesan). Solo LEE: no ve como "visto" en la app, no reacciona.
// Pocas llamadas y 5 s entre cuentas: IG marca las sesiones que piden mucho; con 429, cortar y reintentar mañana.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { cookieHeader } from './ig-carousel.mjs';

const RAIZ = process.env.ONIA_RAIZ ?? import.meta.dirname.split(/[\\/]\.claude[\\/]/)[0];
const JAR = path.join(RAIZ, '.hermes', 'ig-session', 'cookies.txt');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i === -1 ? d : args[i + 1]; };
const out = opt('--out');
const dirVideos = opt('--videos');
const nDestacadas = Number(opt('--destacadas', 0));
if (!out) throw new Error('falta --out DIR');

const cookie = cookieHeader(JAR);
const H = {
  cookie, 'x-ig-app-id': '936619743392459', 'x-csrftoken': /csrftoken=([^;]+)/.exec(cookie)?.[1] ?? '',
  'x-requested-with': 'XMLHttpRequest', referer: 'https://www.instagram.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
  'sec-fetch-site': 'same-origin', 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty',
};
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url) {
  const r = await fetch(url, { headers: H });
  if (r.status === 429) throw new Error('429: IG pide frenar; reintentar mañana');
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${new URL(url).pathname}`);
  return r.json();
}

async function bajar(url, archivo) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} bajando ${path.basename(archivo)}`);
  writeFileSync(archivo, Buffer.from(await r.arrayBuffer()));
}

// Lo que importa para copiar la estructura: qué pide cada historia y con qué sticker.
function stickers(it) {
  return {
    link: (it.story_link_stickers ?? []).map((s) => s.story_link?.url ?? s.story_link?.display_url).filter(Boolean),
    encuesta: (it.story_polls ?? []).map((s) => s.poll_sticker?.question).filter((q) => q !== undefined),
    pregunta: (it.story_questions ?? []).map((s) => s.question_sticker?.question).filter(Boolean),
    slider: (it.story_sliders ?? []).map((s) => s.slider_sticker?.question).filter(Boolean),
    quiz: (it.story_quizs ?? []).map((s) => s.quiz_sticker?.question).filter(Boolean),
    mencion: (it.reel_mentions ?? []).map((s) => s.user?.username).filter(Boolean),
    hashtag: (it.story_hashtags ?? []).map((s) => s.hashtag?.name).filter(Boolean),
    cuenta_regresiva: (it.story_countdowns ?? []).map((s) => s.countdown_sticker?.text).filter(Boolean),
    musica: it.story_music_stickers?.[0]?.music_asset_info?.title ?? null,
    post_compartido: it.story_feed_media?.[0]?.media_code ?? null,
  };
}

async function guardar(items, dir, prefijo, usuario) {
  const meta = [];
  for (const [i, it] of items.entries()) {
    const n = `${prefijo}${String(i + 1).padStart(2, '0')}`;
    const img = it.image_versions2?.candidates?.[0]?.url;
    if (img) await bajar(img, path.join(dir, `${n}.jpg`));
    const vid = it.video_versions?.[0]?.url;
    if (vid && dirVideos) {
      mkdirSync(path.join(dirVideos, usuario), { recursive: true });
      await bajar(vid, path.join(dirVideos, usuario, `${n}.mp4`));
    }
    meta.push({
      archivo: `${n}.jpg`, fecha: new Date(it.taken_at * 1000).toISOString(),
      tipo: it.media_type === 2 ? 'video' : 'foto', duracion_s: it.video_duration ?? null, ...stickers(it),
    });
  }
  return meta;
}

for (const u of opt('--cuentas', '').split(',').map((s) => s.trim().replace(/^@/, '')).filter(Boolean)) {
  const dir = path.join(out, u);
  mkdirSync(dir, { recursive: true });
  try {
    const id = (await api(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(u)}`)).data?.user?.id;
    if (!id) throw new Error('sin id de usuario');
    const reels = await api(`https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${id}`);
    const activas = await guardar(reels.reels?.[id]?.items ?? reels.reels_media?.[0]?.items ?? [], dir, 'h', u);
    const destacadas = [];
    if (nDestacadas > 0) {
      await espera(2000);
      const tray = (await api(`https://www.instagram.com/api/v1/highlights/${id}/highlights_tray/`)).tray ?? [];
      for (const [j, h] of tray.slice(0, nDestacadas).entries()) {
        await espera(2000);
        const r = await api(`https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(h.id)}`);
        const items = r.reels?.[h.id]?.items ?? [];
        destacadas.push({ titulo: h.title, total: h.media_count, items: await guardar(items, dir, `d${j + 1}-`, u) });
      }
    }
    writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ usuario: u, leido: new Date().toISOString(), activas, destacadas }, null, 2));
    console.log(`@${u}: ${activas.length} activas, ${destacadas.length} destacadas`);
  } catch (e) {
    console.log(`@${u}: ${e.message}`);
    if (e.message.startsWith('429')) break;
  }
  await espera(5000);
}
