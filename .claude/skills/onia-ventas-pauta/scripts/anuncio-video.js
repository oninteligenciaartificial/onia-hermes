#!/usr/bin/env node
// Anuncio en MOVIMIENTO (9:16, sin audio) con la misma pieza y los mismos píxeles reales del anuncio estático.
//
//   node .claude/skills/onia-ventas-pauta/scripts/anuncio-video.js --brief <brief.json> --out <dir> [--fps 30]
//
// Sale <dir>/<id>.mp4 (1080×1920, H.264, ~12 s) y <dir>/frames/ se borra. Necesita ffmpeg y Chromium (los de la nube sirven).
// Por qué: los anuncios de software que SOBREVIVEN en la Biblioteca son casi todos video (ONIA_ADQUISICION_Y_PAUTA.md §2.5).
// Sin gasto de IA: es HTML animado cuadro a cuadro con el reloj de la página fijado, así que cada cuadro es determinista.
// Solo plantilla "bloques". Nada se publica desde acá: el video pasa por Sergio Urcullo antes (diseño nuevo).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { html } = require('./anuncio-render.js');

const a = process.argv.slice(2);
const o = { fps: 30 };
for (let i = 0; i < a.length; i += 2) o[a[i].replace(/^--/, '')] = a[i + 1];
if (!o.brief || !o.out) { console.error('Uso: anuncio-video.js --brief <brief.json> --out <dir> [--fps 30]'); process.exit(1); }
const b = JSON.parse(fs.readFileSync(o.brief, 'utf8'));
if (b.plantilla !== 'bloques') { console.error('El video solo existe para la plantilla "bloques"'); process.exit(1); }
const fps = Number(o.fps) || 30;
const DUR = b.video?.duracion || 11; // segundos

// Guion: cuándo entra cada pieza (s). Se lee en voz alta: gancho → la hora → el mensaje → el toque → la llamada.
const T = Object.assign({ hora: 1.4, flecha: 3.0, tile: 3.4, anillos: 5.0, boton: 6.6, txt: 7.0, cta: 8.4 }, b.video?.tiempos || {});

(async () => {
  fs.mkdirSync(o.out, { recursive: true });
  const frames = path.join(o.out, 'frames');
  fs.mkdirSync(frames, { recursive: true });
  const exe = process.env.CHROMIUM_PATH || fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d))
    .map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)[0];
  const br = await chromium.launch({ executablePath: exe });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const file = path.join(o.out, '_video.html');
  fs.writeFileSync(file, html(b, 'story'));
  await p.goto('file://' + path.resolve(file));
  await p.evaluate(() => document.fonts.ready);
  // Se arma la línea de tiempo con la Web Animations API; luego se fija el reloj en cada cuadro.
  await p.evaluate((T) => {
    const q = (s) => document.querySelector(s);
    const all = (s) => [...document.querySelectorAll(s)];
    const ease = 'cubic-bezier(.2,.8,.2,1)';
    const entra = (el, t, { y = 36, dur = 0.7, x = 0 } = {}) => el && el.animate(
      [{ opacity: 0, transform: `translate(${x}px,${y}px)` }, { opacity: 1, transform: 'none' }],
      { duration: dur * 1000, delay: t * 1000, easing: ease, fill: 'both' });
    // el titular está desde el cuadro 0: es la miniatura que Meta muestra antes de que arranque el video
    const panel = q('.panel');
    panel.animate([{ transform: 'translateY(70px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 800, delay: (T.hora - 0.2) * 1000, easing: ease, fill: 'both' });
    const orden = ['.hora', '.flecha', '.tile', '.ley', '.txt', '.cta'];
    const when = { '.hora': T.hora, '.flecha': T.flecha, '.tile': T.tile, '.ley': T.tile + 0.4, '.txt': T.txt, '.cta': T.cta };
    for (const s of orden) {
      const el = q(s);
      if (!el) continue;
      entra(el, when[s], { y: s === '.tile' ? 60 : 30, dur: s === '.tile' ? 0.9 : 0.6 });
    }
    // anillos: se dibujan después de que se vea la pantalla; el del botón late dos veces (el toque)
    all('.ring').forEach((r, i) => {
      const t = T.anillos + i * 0.5;
      r.animate([{ opacity: 0, transform: 'scale(1.12)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 450, delay: t * 1000, easing: ease, fill: 'both' });
    });
    const boton = all('.ring').pop();
    if (boton) {
      for (let k = 0; k < 2; k++) {
        boton.animate([{ transform: 'scale(1)', boxShadow: '0 0 0 3px rgba(12,17,15,.55)' }, { transform: 'scale(1.1)', boxShadow: '0 0 0 14px rgba(77,189,140,.0)' }, { transform: 'scale(1)' }],
          { duration: 700, delay: (T.boton + k * 0.9) * 1000, easing: 'ease-out', fill: 'none' });
      }
    }
  }, T);
  const total = Math.round(DUR * fps);
  for (let i = 0; i < total; i++) {
    const t = (i / fps) * 1000;
    await p.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), t);
    await p.screenshot({ path: path.join(frames, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 94 });
  }
  await br.close();
  fs.unlinkSync(file);
  const mp4 = path.join(o.out, `${b.id}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(frames, 'f%04d.jpg'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', mp4]);
  fs.rmSync(frames, { recursive: true, force: true });
  console.log(mp4, `${DUR}s · ${fps} fps`);
})();
