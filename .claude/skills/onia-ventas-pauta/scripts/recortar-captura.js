#!/usr/bin/env node
// Recorta una captura real del producto para una lámina, sin PIL ni ImageMagick.
// Uso: node recortar-captura.js <src.png> <out.png> x y ancho alto escala [mx my mw mh]
//   x y ancho alto: región en px de la captura original (1x).
//   escala: 3 para que un recorte de ~320 px se lea en el celular (ver SKILL.md §4).
//   mx my mw mh (opcional): rectángulo, en px del recorte, que se tapa con blanco
//   (solo para borrar una letra de otra línea que se cuela en el borde; nunca texto de la pantalla).
// Necesita playwright (`npm i playwright` en una carpeta temporal y NODE_PATH apuntando ahí) y el
// Chromium de /opt/pw-browsers.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [src, out, x, y, w, h, scale, mx, my, mw, mh] = process.argv.slice(2);
  if (!scale) { console.error('uso: recortar-captura.js src out x y ancho alto escala [mx my mw mh]'); process.exit(1); }
  const b64 = fs.readFileSync(src).toString('base64');
  const mask = mw ? `<div style="position:absolute;left:${mx}px;top:${my}px;width:${mw}px;height:${mh}px;background:#fff"></div>` : '';
  const html = `<html><body style="margin:0"><div style="width:${w}px;height:${h}px;overflow:hidden;position:relative"><img src="data:image/png;base64,${b64}" style="position:absolute;left:-${x}px;top:-${y}px">${mask}</div></body></html>`;
  const exe = fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)[0];
  const br = await chromium.launch({ executablePath: exe });
  const p = await br.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale });
  await p.setContent(html);
  await p.screenshot({ path: out, clip: { x: 0, y: 0, width: +w, height: +h } });
  await br.close();
  console.log(out);
})();
