#!/usr/bin/env node
// Costuras RÍGIDAS de 6 cuadros, medidas en el DOM: en cada empuje, de T−6 a T cuadros, el medio que entra y el que sale tienen que ir pegados borde con borde
// (izquierda del que entra = derecha del que sale, ±0,5 px), recorrer exactamente 1080 px cada uno, y cada tarjeta que viaja tiene que ir con su imagen
// (misma posición x que el medio que entra o sale, salvo su propio margen). Sale con 1 si algo no cierra.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const FPS = plan.lienzo.fps, PUSH = plan.empuje.cuadros;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
let malos = 0;
console.log('empuje rígido: 6 cuadros, el que entra pegado al que sale (borde con borde), 1080 px cada uno');
for (const c of plan.costuras.filter((x) => x.tipo === 'empuje')) {
  const T = Math.round(c.t * FPS);
  const filas = await pg.evaluate(([T, PUSH, FPS, sale, entra, ts, te]) => {
    const tl = window.__timelines.main; tl.pause();
    const x = (id) => { const e = document.getElementById(id); const q = e.getBoundingClientRect(); return [q.left, q.right]; };
    const out = [];
    for (let f = T - PUSH; f <= T; f++) { tl.time(f / FPS); out.push({ f, sale: x(sale), entra: x(entra), ts: x(ts), te: x(te) }); }
    return out;
  }, [T, PUSH, FPS, c.sale[0], c.entra[0], c.tarjetas.sale, c.tarjetas.entra]);
  const pegado = Math.max(...filas.map((r) => Math.abs(r.entra[0] - r.sale[1])));
  const recorrido = [filas.at(-1).entra[0] - filas[0].entra[0], filas.at(-1).sale[0] - filas[0].sale[0]];
  const ok = pegado <= 0.5 && Math.abs(recorrido[0] + 1080) <= 0.5 && Math.abs(recorrido[1] + 1080) <= 0.5 && Math.abs(filas.at(-1).entra[0]) <= 0.5 && Math.abs(filas[0].sale[0]) <= 0.5;
  // la tarjeta que sale/entra viaja con su imagen: su desplazamiento total es el mismo que el del medio (1080 px)
  const t_sale = filas.at(-1).ts[0] - filas[0].ts[0], t_entra = filas.at(-1).te[0] - filas[0].te[0];
  const okT = Math.abs(t_sale + 1080) <= 0.5 && Math.abs(t_entra + 1080) <= 0.5;
  if (!ok || !okT) malos++;
  console.log(`  ${c.t.toFixed(3)} s  ${c.sale[0]} → ${c.entra[0]}: separación máx ${pegado.toFixed(2)} px · recorren ${(-recorrido[0]).toFixed(0)} y ${(-recorrido[1]).toFixed(0)} px · tarjetas ${c.tarjetas.sale} ${(-t_sale).toFixed(0)} / ${c.tarjetas.entra} ${(-t_entra).toFixed(0)} px  ${ok && okT ? 'ok' : '✖'}`);
}
await b.close();
if (malos) { console.error(`✖ ${malos} costura(s) no rígida(s)`); process.exit(1); }
console.log(`✔ ${plan.costuras.length} costuras rígidas de ${PUSH} cuadros (0,25 s): sin tiras de fondo y con las tarjetas viajando con la imagen`);
