import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = 'C:/dev/proyectos/onia-hermes/.claude/worktrees/hero-mecanica/hermes-content/references/ui-patterns/hero-onia/mecanica';
const OUT  = 'C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674/389a5ae4-f411-4460-a69b-a6b700aeed10/scratchpad/shots';

const srv = http.createServer((req,res)=>{
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(p,(e,d)=>{ if(e){res.writeHead(404);res.end('nf');return;} res.writeHead(200,{'Content-Type': p.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'}); res.end(d); });
});
await new Promise(r=>srv.listen(4321,r));

const b = await chromium.launch();
const results = {};

async function shot(name, w, h, opts={}) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' });
  const pg = await ctx.newPage();
  await pg.goto('http://127.0.0.1:4321/index.html', {waitUntil:'networkidle'});
  await pg.waitForTimeout(1200);
  if (opts.t !== undefined) {
    await pg.evaluate((t)=>{ document.getAnimations().forEach(a=>{ a.pause(); a.currentTime = t; }); }, opts.t);
    await pg.waitForTimeout(200);
  }
  await pg.screenshot({ path: path.join(OUT, name+'.png'), fullPage: !!opts.full });
  const m = await pg.evaluate(()=>{
    const q=s=>document.querySelector(s);
    const r=s=>{const e=q(s); if(!e) return null; const b=e.getBoundingClientRect(); return {t:Math.round(b.top),b:Math.round(b.bottom),l:Math.round(b.left),r:Math.round(b.right),w:Math.round(b.width),h:Math.round(b.height)};};
    const est=[...document.querySelectorAll('.estacion')].map(e=>{const b=e.getBoundingClientRect();return{top:Math.round(b.top),bot:Math.round(b.bottom)}});
    const v=q('.viajero'); const cs=v?getComputedStyle(v):null;
    return {
      docW: document.documentElement.scrollWidth, innerW: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      panel: r('.panel'), display: r('.display'), nota: r('.nota'), acciones: r('.acciones'),
      estaciones: est,
      viajero: cs? {y: Math.round(v.getBoundingClientRect().top), bg: cs.backgroundColor, br: cs.borderRadius, op: cs.opacity} : null,
      rotuloFin: (()=>{const e=q('.estacionFin .rotulo'); if(!e)return null; const c=getComputedStyle(e); return {fs:c.fontSize, text:e.textContent.trim(), scrollW:e.scrollWidth, clientW:e.clientWidth};})(),
      rotulos: [...document.querySelectorAll('.rotulo')].map(e=>({t:e.textContent.trim(), fs:getComputedStyle(e).fontSize, trunc: e.scrollWidth>e.clientWidth+1})),
      textoVisible: document.body.innerText.replace(/\n+/g,' | ')
    };
  });
  results[name]=m;
  await ctx.close();
}

await shot('c-1440', 1440, 900, {t:0});
await shot('c-1440-mid', 1440, 900, {t:2400});
await shot('c-1440-fin', 1440, 900, {t:5200});
await shot('c-1440-reduced', 1440, 900, {reduced:true});
await shot('c-375', 375, 812, {t:0});
await shot('c-375-fin', 375, 812, {t:5200});
await shot('c-375-full', 375, 812, {t:0, full:true});
await shot('c-320', 320, 780, {t:0, full:true});
await shot('c-768', 768, 1024, {t:0});
await shot('c-1920', 1920, 1080, {t:0});
await shot('c-1000', 1000, 800, {t:0});

console.log(JSON.stringify(results,null,1));
await b.close(); srv.close();
