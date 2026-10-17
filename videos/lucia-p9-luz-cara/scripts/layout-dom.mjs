// Medida DOM (Chromium real, fuentes de marca locales) de cada bloque de texto de P9: top, alto, borde inferior y ancho de cada línea.
// Escribe qa/layout-dom.txt. Sustituye a scripts/estimar-tipografia.py (necesita fontTools, que no se instala).
import {P,plan,save,check,open} from './qa-dom.mjs';
const {browser,page}=await open();
try{
 const rows=await page.evaluate(()=>{
  const out=[];
  const medir=(id,t)=>{window.__timelines.main.time(t,false);const e=document.getElementById(id),q=e.getBoundingClientRect();
   // líneas por palabra (un <span> dentro del bloque parte los rectángulos de texto): ancho de cada línea = de la primera a la última palabra
   const tw=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),ln={};let nd;while(nd=tw.nextNode()){for(const m of nd.textContent.matchAll(/\S+/g)){const r=document.createRange();r.setStart(nd,m.index);r.setEnd(nd,m.index+m[0].length);const c=r.getBoundingClientRect(),k=Math.round(c.top/10);(ln[k]??={a:1e9,b:-1e9});ln[k].a=Math.min(ln[k].a,c.left);ln[k].b=Math.max(ln[k].b,c.right)}}
   const lines=Object.fromEntries(Object.entries(ln).map(([k,v])=>[k,v.b-v.a]));
   return {id,t,y:q.y,h:q.height,b:q.y+q.height,lineas:e.classList.contains('fila')?'(fila)':JSON.stringify(Object.values(lines).map(Math.round)),interior:e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)}};
  for(const id of ['fila-m1','fila-m4','nota-ast','toma','limite-cara','brillo','cta'])out.push(medir(id,15));
  for(const id of ['rotulo','titulo','dato-m1'])out.push(medir(id,3));
  for(const id of ['dato-m4','reencuadre','aviso-refs'])out.push(medir(id,8));
  return out;});
 const g=(a,b)=>(rows.find(r=>r.id===b).y-rows.find(r=>r.id===a).b).toFixed(1);
 const lines=['Medida DOM (Chromium real, fuentes de marca locales) de cada bloque de texto de P9 v3.1: top, alto, borde inferior y ancho de cada línea de texto (interior disponible 866 px; la nota del asterisco va a 38 px, el resto a 40-66 px).',''];
 for(const r of rows)lines.push(`${r.id.padEnd(12)} (t=${r.t}s) y ${String(+r.y.toFixed(1)).padStart(7)} → ${String(+r.b.toFixed(1)).padStart(7)}  alto ${String(+r.h.toFixed(1)).padStart(6)}  líneas ${r.lineas}`);
 lines.push('',`Huecos verticales de la placa: fila-m1→fila-m4 ${g('fila-m1','fila-m4')} · fila-m4→nota del asterisco ${g('fila-m4','nota-ast')} · nota→toma ${g('nota-ast','toma')} · toma→límite ${g('toma','limite-cara')} · límite→brillo ${g('limite-cara','brillo')} · brillo→CTA ${g('brillo','cta')}`);
 lines.push(`Huecos de m4: dato→reencuadre ${g('dato-m4','reencuadre')} · reencuadre→aviso ${g('reencuadre','aviso-refs')}`);
 const max=Math.max(...rows.map(r=>r.b)),min=Math.min(...rows.map(r=>r.y));
 lines.push(`Borde inferior máximo: ${max.toFixed(1)} (tope 1490) · borde superior mínimo: ${min.toFixed(1)} (mínimo 292)`);
 check(max<=1490&&min>=292,'Layout fuera de la zona segura 292-1490');
 // H6 (revisión 3): ninguna línea queda huérfana en el CTA, el aviso, el límite ni la nota (la última línea, al menos 30 % de la más larga) y el CTA tiene dos líneas (la segunda ≥ 40 % de la primera)
 for(const id of ['cta','aviso-refs','limite-cara','nota-ast']){const w=JSON.parse(rows.find(r=>r.id===id).lineas);const huerfana=w.length>1&&w.at(-1)<0.3*Math.max(...w);lines.push(`Líneas de ${id}: ${w.join(' / ')} px${huerfana?' · HUÉRFANA':''}`);check(!huerfana,`${id}: última línea huérfana (${w.join('/')})`);}
 const wc=JSON.parse(rows.find(r=>r.id==='cta').lineas);check(wc.length===2&&Math.min(...wc)>=0.4*Math.max(...wc),'CTA: debe partirse en dos líneas con la segunda de dos palabras («Seguime: cada semana, / una prueba.»), no «prueba.» sola');
 save('layout-dom.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
}finally{await browser.close()}
