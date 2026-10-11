import fs from 'node:fs';import path from 'node:path';
import {P,plan,save,check,open,samples,readings,staticSamples} from './qa-dom.mjs';
import {auditarDom} from './auditar-dom.mjs';
export async function run(gate){
 let browser,page,model,lines=[];const staticMode=process.argv.includes('--estatico');
 try{
 if(staticMode){check(gate!=='medir-dom','medir-dom requiere Chromium real; no admite sustituto estático');model=staticSamples();lines.push('MODO ESTÁTICO: timeline GSAP real sobre objetos. No mide DOM/tipografía/render.');}else{({browser,page}=await open());}
 const rows=staticMode?model.rows:await samples(page),reads=readings(rows);
 if(gate==='ventanas'){
  for(const r of reads){lines.push(`${r.id}: ${r.duration.toFixed(3)} s / mínimo ${r.min.toFixed(3)} s; ${r.a.toFixed(3)}–${r.b.toFixed(3)}`);check(r.duration+1e-6>=r.min,`Lectura corta ${r.id}`)}
  check(reads.length===13,`Faltan textos: ${reads.map(r=>r.id)}`);save('lectura-tarjetas.json',reads);
 }else if(gate==='hueco-tarjetas'){
  const empty=rows.filter(r=>!r.boxes.some(b=>b.card&&Math.min(1080,b.x+b.w)-Math.max(0,b.x)>=b.w*.25));
  lines.push(`${empty.length} cuadros sin tarjeta de ${rows.length}`);check(!empty.length,'Hueco de tarjeta');
 }else if(gate==='costuras'){
  for(const c of plan.costuras){let max=0;for(let i=0;i<=6;i++){
   const t=c.t-.25+i/24;let v;if(staticMode){const a=model.frame(t),oa=c.sale==='placa'?'placa':'overlay-'+c.sale,ob=c.entra==='placa'?'placa':'overlay-'+c.entra;v={gap:a[c.entra].x-a[c.sale].x-1080,ax:a[c.sale].x,bx:a[c.entra].x,oa:a[oa].x,ob:a[ob].x};}else v=await page.evaluate(({t,c})=>{window.__timelines.main.time(t,false);const box=id=>document.getElementById(id).getBoundingClientRect();const a=box(c.sale),b=box(c.entra);const overlay=id=>id==='placa'?box('placa'):box('overlay-'+id);return {gap:b.left-a.right,ax:a.left,bx:b.left,oa:overlay(c.sale).left,ob:overlay(c.entra).left};},{t,c});
   max=Math.max(max,Math.abs(v.gap));check(Math.abs(v.gap)<.5,'Costura despegada');check(Math.abs(v.ax-v.oa)<.5&&Math.abs(v.bx-v.ob)<.5,'Tarjeta no viaja');if(i===0)check(Math.abs(v.ax)<.5&&Math.abs(v.bx-1080)<.5,'Inicio empuje');if(i===6)check(Math.abs(v.ax+1080)<.5&&Math.abs(v.bx)<.5,'Fin empuje');
  }lines.push(`${c.sale} → ${c.entra}: 6 cuadros, separación máxima ${max.toFixed(3)} px; tarjetas recorren 1080 px`);}
 }else if(gate==='eventos'){
  let max=0,prev=0;for(const ev of plan.eventos){check(ev.t-prev<=2+1e-6,'Hueco evento >2 s');max=Math.max(max,ev.t-prev);prev=ev.t;const f=Math.min(479,Math.ceil((ev.t+.12)*24));const b=rows[f].boxes.find(b=>'#'+b.id===ev.selector || ev.selector==='#comparacion'&&b.id==='fila-m1');check(b,`Evento no visible ${ev.que}`);if(ev.t>0&&ev.selector!=='#comparacion'){const before=rows[Math.max(0,Math.floor((ev.t-1/24)*24))].boxes.find(x=>x.id===b.id);check(!before||before.border!==b.border||Math.abs(before.opacity-b.opacity)>.05,`Evento sin cambio visible ${ev.que}`)}lines.push(`${ev.t.toFixed(3)}: ${ev.que}`)}max=Math.max(max,20-prev);check(20-prev<=2,'Cola sin evento');lines.push(`${plan.eventos.length} eventos, hueco máximo ${max.toFixed(3)} s`);
 }else if(gate==='aire'){
  // Como G5: firma de geometría/color/opacidad. Clips en movimiento no son pantalla quieta.
  let run=0,max=0,raw=0,rawMax=0,prev='';
  for(const r of rows){const sig=JSON.stringify(r.boxes.map(b=>[b.id,...[b.x,b.y,b.opacity].map(x=>Math.round(x*100)),b.border]));const identical=sig===prev;const video=plan.clips.some(c=>r.t>=c.a&&r.t<c.b);const reading=reads.some(x=>r.t>=x.a&&r.t<x.a+x.min);
   raw=identical?raw+1:0;rawMax=Math.max(rawMax,raw);run=identical&&!reading&&!video?run+1:0;max=Math.max(max,run);prev=sig;}
  lines.push(`Mayor tramo ${staticMode?'del timeline':'DOM'} quieto fuera de lectura/clip: ${(max/24).toFixed(3)} s (tope 0,3); sin exención: ${(rawMax/24).toFixed(3)} s. Clips: movimiento fuente asumido, píxeles PENDIENTE.`);check(max/24<=.3,'Aire fuera de lectura');save('lectura-tarjetas.json',reads);
 }else if(gate==='medir-dom'){
  const faces=JSON.parse(fs.readFileSync(path.resolve(P,'../lucia-g2-v2/qa/caras-por-clip.json'),'utf8')).clips;
  const audit=auditarDom(rows,reads,faces,plan);
  const loaded=await page.evaluate(()=>Array.from(document.fonts,f=>({familia:f.family.replaceAll('"',''),estado:f.status})));
  for(const family of ['Bricolage Grotesque','DM Sans','Spline Sans Mono'])if(!loaded.some(f=>f.familia===family&&f.estado==='loaded'))audit.fallos.push({regla:'fuente de marca no cargada',id:family,cuadro:null,tiempo:null,valor:loaded,limite:'fuente local loaded; sin fallback'});
  save('medir-dom-fallos.json',audit);
  lines.push(`${audit.cajas} cajas / ${rows.length} cuadros; ${audit.fallos.length} fallos. Margen mínimo mentón-texto ${audit.margen_minimo_menton} px; dato ${audit.primer_dato}s; CTA ${audit.cta_duracion}s. Caras heredadas G2; detección nueva PENDIENTE.`);
  for(const f of audit.fallos)lines.push(`${f.regla}: id=${f.id} cuadro=${f.cuadro} tiempo=${f.tiempo} valor=${JSON.stringify(f.valor)} límite=${f.limite}`);
  check(!audit.fallos.length,`${audit.fallos.length} fallos DOM; lista completa en qa/medir-dom.txt y qa/medir-dom-fallos.json`);
 }else throw Error('Gate desconocido '+gate);
 save(gate+'.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
 }catch(e){save(gate+'.txt',lines.join('\n')+'\nFAIL/PENDIENTE: '+e.message+'\nEXIT 1\n');throw e}finally{if(browser)await browser.close()}
}
