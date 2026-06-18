#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outPath = path.join(root, "hermes-content/docs/MARA_VISUAL_REVIEW_BOARD_2026.html");

function toAssetUrl(filePath) {
  const relative = path.relative(path.dirname(outPath), filePath).replace(/\\/g, "/");
  return encodeURI(relative);
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function listFiles(dir, exts, limit = Infinity) {
  if (!exists(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (exts.includes(path.extname(entry.name).toLowerCase())) out.push(full);
    }
  }
  return out
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
    .slice(0, limit);
}

function label(filePath) {
  return path.basename(filePath)
    .replace(/\.(mp4|mov|jpg|jpeg|png|webp)$/i, "")
    .replace(/__/g, " | ")
    .replace(/_/g, " ")
    .slice(0, 140);
}

function assetCard(filePath, kind, note = "") {
  const rel = path.relative(root, filePath);
  const src = toAssetUrl(filePath);
  const isVideo = [".mp4", ".mov", ".webm"].includes(path.extname(filePath).toLowerCase());
  const media = isVideo
    ? `<video src="${src}" controls muted playsinline preload="metadata"></video>`
    : `<img src="${src}" alt="${escapeHtml(label(filePath))}">`;
  return `<article class="asset ${kind}">
    <div class="media">${media}</div>
    <div class="meta">
      <strong>${escapeHtml(label(filePath))}</strong>
      <span>${escapeHtml(note || rel)}</span>
    </div>
  </article>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function section(title, subtitle, cards) {
  return `<section>
    <div class="section-head">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
    </div>
    <div class="grid">${cards.join("\n")}</div>
  </section>`;
}

const wanAudit = path.join(root, "hermes-content/references/ai-ecommerce-model/comfyui/audits");
const identityDir = path.join(root, "hermes-content/references/ai-ecommerce-model/mara-identity-20260616");
const identityBankDir = path.join(root, "hermes-content/references/ai-ecommerce-model/identity-bank-50");
const productsDir = path.join(root, "hermes-content/references/ai-ecommerce-model/products");

const wanVideos = listFiles(wanAudit, [".mp4"]).filter((file) => /wan22/i.test(file));
const ltxVideos = listFiles(wanAudit, [".mp4"]).filter((file) => /ltx23/i.test(file)).slice(0, 8);
const contactSheets = listFiles(wanAudit, [".jpg", ".jpeg", ".png"]).filter((file) => /frames|8frames/i.test(file)).slice(0, 24);
const identityOriginals = listFiles(path.join(identityDir, "originals"), [".png", ".jpg", ".jpeg"]).reverse();
const identityCrops = listFiles(path.join(identityDir, "crops"), [".png", ".jpg", ".jpeg"]).slice(0, 64);
const primary = path.join(identityDir, "mara_20260616_primary_i2v_front_smile.png");
const productRefs = listFiles(productsDir, [".png", ".jpg", ".jpeg", ".webp"], 40);
const bodySheets = listFiles(identityBankDir, [".png", ".jpg", ".jpeg", ".webp"])
  .filter((file) => /sheet|body|commerce|beauty|resort|identity-bank/i.test(path.basename(file)))
  .slice(0, 12);
const bodyPhotos = listFiles(path.join(identityBankDir, "photos"), [".png", ".jpg", ".jpeg", ".webp"], 50)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mara / Lia Visual Review Board 2026</title>
  <style>
    :root {
      --bg: #f3f2ef;
      --panel: #ffffff;
      --text: #202522;
      --muted: #6f746f;
      --line: #ddd8cf;
      --accent: #14745f;
      --ink: #1f2e36;
      --warn: #a06031;
      font-family: Aptos, "Segoe UI", ui-sans-serif, system-ui, sans-serif;
      color: var(--text);
      letter-spacing: 0;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); }
    header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: end;
      padding: 22px 28px 18px;
      border-bottom: 1px solid var(--line);
      background: #fbfaf7;
      position: sticky;
      top: 0;
      z-index: 5;
    }
    h1, h2 { margin: 0; font-family: Georgia, Cambria, "Times New Roman", serif; }
    h1 { font-size: 25px; line-height: 1.1; }
    h2 { font-size: 18px; line-height: 1.2; }
    .sub { color: var(--muted); font-size: 13px; margin-top: 6px; max-width: 920px; }
    .pill {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 12px;
      color: var(--muted);
      white-space: nowrap;
    }
    main { padding: 22px 28px 38px; display: grid; gap: 22px; }
    section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
    }
    .section-head {
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      background: #fbfaf7;
    }
    .section-head p { margin: 5px 0 0; color: var(--muted); font-size: 13px; line-height: 1.45; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
      padding: 14px;
    }
    .asset {
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      min-width: 0;
    }
    .media {
      background: #111;
      aspect-ratio: 9 / 14;
      display: grid;
      place-items: center;
      overflow: hidden;
    }
    .asset.sheet .media,
    .asset.crop .media,
    .asset.product .media { aspect-ratio: 1 / 1; }
    img, video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      background: #111;
    }
    .meta { padding: 10px; display: grid; gap: 5px; }
    .meta strong { font-size: 12px; line-height: 1.25; overflow-wrap: anywhere; }
    .meta span { color: var(--muted); font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
    .priority { border-color: rgba(20, 116, 95, .45); box-shadow: 0 0 0 2px rgba(20, 116, 95, .08); }
    .note {
      border: 1px solid rgba(20, 116, 95, .28);
      border-radius: 8px;
      background: #f4fbf8;
      padding: 12px 14px;
      font-size: 13px;
      line-height: 1.45;
    }
    @media (max-width: 780px) {
      header { grid-template-columns: 1fr; }
      main { padding: 16px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Mara / Lia Visual Review Board</h1>
      <div class="sub">Tablero local para ver videos generados, contactos de frames, identidad, boca/cara/angulos y referencias visuales usadas en el pipeline Wan/UGC. Mara es la pelirroja; Lia es la brunette.</div>
    </div>
    <div class="pill">Actualizado: ${escapeHtml(new Date().toISOString())}</div>
  </header>
  <main>
    <div class="note">Prioridad actual: Wan2.2 TI2V 5B para video silencioso con identidad estable, despues Wan2.2 S2V o InfiniteTalk para lipsync. El mejor baseline actual es el job <strong>ec8fd6e3</strong>. LTX queda como comparacion de lo que no debemos escalar.</div>
    ${section("Videos Wan generados", "Los MP4 que ya puedes reproducir. Estos son los que importan ahora para decidir movimiento e identidad.", wanVideos.map((file, idx) => assetCard(file, idx === 0 ? "priority" : "video", idx === 0 ? "Mejor baseline visual actual o ultimo Wan descargado" : "Wan local descargado del pod")))}
    ${section("Producto ISDIN", "Referencia de producto para evitar que el modelo invente el envase. El logo/packshot se debe conservar como overlay o plano separado si Wan deforma la etiqueta.", productRefs.map((file, idx) => assetCard(file, idx === 0 ? "priority product" : "product", idx === 0 ? "Producto actual para el test UGC" : "Referencia de producto")))}
    ${section("Mara pelirroja cuerpo completo", "Banco de cuerpo/poses de Mara. No mezclar con Lia brunette como si fueran la misma identidad.", [...bodySheets, ...bodyPhotos].map((file, idx) => assetCard(file, idx < bodySheets.length ? "sheet" : "video", idx < bodySheets.length ? "Sheet de pose/body" : "Foto full-body o lifestyle")))}
    ${section("Frames y contactos", "Vista rapida de cara, parpadeo, expresion y drift entre inicio/medio/final.", contactSheets.map((file) => assetCard(file, "sheet", "contact sheet / 8 frames")))}
    ${section("Lia close-up brunette", "Sheets originales que definen la cara estable brunette antes de video.", [primary, ...identityOriginals].filter(exists).map((file, idx) => assetCard(file, idx === 0 ? "priority sheet" : "sheet", idx === 0 ? "Imagen primaria para image-to-video" : "Referencia visual original")))}
    ${section("Crops de control", "Banco de angulos, boca, ojos, piel y rasgos para bloquear identidad visual en prompts y QA.", identityCrops.map((file) => assetCard(file, "crop", "identity crop")))}
    ${section("Comparacion LTX", "Resultados anteriores para revisar por que no conviene escalar LTX como motor principal.", ltxVideos.map((file) => assetCard(file, "video", "LTX comparativo")))}
  </main>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, "utf8");
console.log(JSON.stringify({
  ok: true,
  out: outPath,
  counts: {
    wanVideos: wanVideos.length,
    ltxVideos: ltxVideos.length,
    contactSheets: contactSheets.length,
    identityOriginals: identityOriginals.length,
    identityCrops: identityCrops.length,
    productRefs: productRefs.length,
    bodySheets: bodySheets.length,
    bodyPhotos: bodyPhotos.length
  }
}, null, 2));
