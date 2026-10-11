// Gates DOM de la pieza (Chromium real, cuadro por cuadro; sin red ni render). Heredados de P9 v3.1 y adaptados a fotos fijas y aros: sin clips de video, tiles dentro de cada escena.
import fs from 'node:fs';import path from 'node:path';
import {P,plan,save,check,open,samples,readings} from './qa-dom.mjs';
import {auditarDom} from './auditar-dom.mjs';
export async function run(gate){
 let browser,page,lines=[];
 try{
 ({browser,page}=await open());
 const tiles=JSON.parse(fs.readFileSync(path.join(P,'qa/tiles.json'),'utf8'));
 const rows=await samples(page),reads=readings(rows);
 const T=plan.lienzo.duracion;
 if(gate==='ventanas'){
  for(const r of reads){lines.push(`${r.id}: ${r.duration.toFixed(3)} s / mínimo ${r.min.toFixed(3)} s; ${r.a.toFixed(3)}–${r.b.toFixed(3)}`);check(r.duration+1e-6>=r.min,`Lectura corta ${r.id}`)}
  check(reads.length===tiles.length,`Faltan textos: ${tiles.filter(t=>!reads.some(r=>r.id===t.id)).map(t=>t.id)}`);
  const placa=reads.filter(r=>tiles.find(t=>t.id===r.id)?.clip==='placa'),est=placa.reduce((s,r)=>s+r.min,0),disp=T-plan.costuras[1].t;
  lines.push(`Lectura en orden estricto de la placa: ${placa.map(r=>r.min.toFixed(2)).join(' + ')} = ${est.toFixed(1)} s contra ${disp.toFixed(1)} s disponibles (${(placa.reduce((s,r)=>s+r.text.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length,0)/disp).toFixed(1)} palabras/s); cada ventana individual se cumple, la voz cubre el resto`);
  save('lectura-tarjetas.json',reads);
 }else if(gate==='hueco-tarjetas'){
  const empty=rows.filter(r=>!r.boxes.some(b=>b.card&&Math.min(1080,b.x+b.w)-Math.max(0,b.x)>=b.w*.25));
  lines.push(`${empty.length} cuadros sin tarjeta de ${rows.length}`);check(!empty.length,'Hueco de tarjeta: cuadros '+empty.slice(0,10).map(r=>r.f));
 }else if(gate==='costuras'){
  for(const c of plan.costuras){let max=0,maxTile=0;for(let i=0;i<=6;i++){
   const t=c.t-.25+i/24;const v=await page.evaluate(({t,c})=>{window.__timelines.main.time(t,false);const box=id=>document.getElementById(id).getBoundingClientRect();const a=box(c.sale),b=box(c.entra);
    let dev=0;for(const id of [c.sale,c.entra]){const sc=box(id);for(const e of document.getElementById(id).querySelectorAll('.texto')){const q=e.getBoundingClientRect();dev=Math.max(dev,Math.abs((q.left-sc.left)-parseFloat(getComputedStyle(e).left)))}}
    return {gap:b.left-a.right,ax:a.left,bx:b.left,dev};},{t,c});
   max=Math.max(max,Math.abs(v.gap));maxTile=Math.max(maxTile,v.dev);check(Math.abs(v.gap)<.5,'Costura despegada');check(v.dev<.5,'Un tile no viaja con su escena');if(i===0)check(Math.abs(v.ax)<.5&&Math.abs(v.bx-1080)<.5,'Inicio empuje');if(i===6)check(Math.abs(v.ax+1080)<.5&&Math.abs(v.bx)<.5,'Fin empuje');
  }lines.push(`${c.sale} → ${c.entra} a ${c.t} s: 6 cuadros, separación máxima ${max.toFixed(3)} px; los tiles viajan con su escena (desviación máxima ${maxTile.toFixed(3)} px)`);}
 }else if(gate==='eventos'){
  const evs=plan.eventos;let max=0,prev=0;
  for(const ev of evs){check(ev.t-prev<=2+1e-6,`Hueco de eventos >2 s antes de ${ev.que}`);max=Math.max(max,ev.t-prev);prev=ev.t;
   const sig=async t=>page.evaluate(({t,sel})=>{window.__timelines.main.time(t,false);const out=[];for(const e of document.querySelectorAll(sel)){let o=1,n=e;while(n&&n!==document.body){const s=getComputedStyle(n);o*=+s.opacity;if(s.display==='none'||s.visibility==='hidden')o=0;n=n.parentElement}
     const q=e.getBoundingClientRect(),cs=getComputedStyle(e);const fill=e.querySelector('.fill,.rango');out.push({o:Math.round(o*100)/100,r:[q.left,q.top,q.width,q.height].map(v=>Math.round(v*2)/2),b:cs.borderLeftColor,g:cs.backgroundColor,d:cs.strokeDashoffset,w:fill?Math.round(fill.getBoundingClientRect().width):0})}return out},{t,sel:ev.selector});
   if(ev.t===0){const s0=await sig(0);check(s0.length&&s0.every(s=>s.o>=.9&&s.r[0]>=0&&s.r[0]<1080),`Evento de gancho no visible en el cuadro 0: ${ev.que}`);lines.push(`${ev.t.toFixed(3)}: ${ev.que}`);continue}
   const t0=ev.empuje?ev.t-.25:ev.t-1/24,a=await sig(t0),b=await sig(ev.t+.12);check(a.length&&b.length,`Evento sin elemento: ${ev.selector}`);
   check(JSON.stringify(a)!==JSON.stringify(b),`Evento sin cambio visible ${ev.que}`);
   if(ev.entrada)check(a.every(s=>s.o<.5)&&b.every(s=>s.o>=.5),`Entrada que no se ve entrar: ${ev.que}`);
   if(ev.aro)check(a.every(s=>+s.d>=.99)&&b.every(s=>+s.d<1),`Aro que no se dibuja: ${ev.que}`);
   lines.push(`${ev.t.toFixed(3)}: ${ev.que}`)}
  max=Math.max(max,T-prev);check(T-prev<=2,'Cola sin evento');lines.push(`${evs.length} eventos, hueco máximo ${max.toFixed(3)} s`);
 }else if(gate==='aire'){
  // Firma de geometría/color/opacidad de los tiles; las fotos son fijas (sin exención de video): solo cuenta la lectura y los eventos.
  let run=0,max=0,raw=0,rawMax=0,prev='',maxAt=0;
  for(const r of rows){const sig=JSON.stringify(r.boxes.map(b=>[b.id,...[b.x,b.y,b.opacity].map(x=>Math.round(x*100)),b.border]));const identical=sig===prev;const reading=reads.some(x=>r.t>=x.a&&r.t<x.a+x.min);
   raw=identical?raw+1:0;rawMax=Math.max(rawMax,raw);run=identical&&!reading?run+1:0;if(run>max){max=run;maxAt=r.t}prev=sig;}
  lines.push(`Mayor tramo DOM quieto fuera de lectura: ${(max/24).toFixed(3)} s (tope 0,3; termina en ${maxAt.toFixed(3)} s); sin exención de lectura: ${(rawMax/24).toFixed(3)} s. Fotos fijas: sin movimiento de fuente asumido; los píxeles se miden en el master.`);check(max/24<=.3,'Aire fuera de lectura');save('lectura-tarjetas.json',reads);
 }else if(gate==='medir-dom'){
  const faces=JSON.parse(fs.readFileSync(path.join(P,'qa/caras-lienzo.json'),'utf8'));
  const audit=auditarDom(rows,reads,faces,plan);
  const loaded=await page.evaluate(()=>Array.from(document.fonts,f=>({familia:f.family.replaceAll('"',''),estado:f.status})));
  for(const family of ['Bricolage Grotesque','DM Sans','Spline Sans Mono'])if(!loaded.some(f=>f.familia===family&&f.estado==='loaded'))audit.fallos.push({regla:'fuente de marca no cargada',id:family,cuadro:null,tiempo:null,valor:loaded,limite:'fuente local loaded; sin fallback'});
  save('medir-dom-fallos.json',audit);
  lines.push(`${audit.cajas} cajas / ${rows.length} cuadros; ${audit.fallos.length} fallos. Margen mínimo mentón-texto ${audit.margen_minimo_menton} px; dato ${audit.primer_dato}s; CTA ${audit.cta_duracion}s. Caras: SCRFD sobre las dos fotos (qa/caras-fotos.json).`);
  for(const f of audit.fallos)lines.push(`${f.regla}: id=${f.id} cuadro=${f.cuadro} tiempo=${f.tiempo} valor=${JSON.stringify(f.valor)} límite=${f.limite}`);
  check(!audit.fallos.length,`${audit.fallos.length} fallos DOM; lista completa en qa/medir-dom.txt y qa/medir-dom-fallos.json`);
 }else throw Error('Gate desconocido '+gate);
 save(gate+'.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
 }catch(e){save(gate+'.txt',lines.join('\n')+'\nFAIL: '+e.message+'\nEXIT 1\n');throw e}finally{if(browser)await browser.close()}
}
