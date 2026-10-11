// Medida DOM (Chromium real, fuentes de marca locales) de cada bloque de texto de P9: top, alto, borde inferior y ancho de cada línea.
// Escribe qa/layout-dom.txt. Sustituye a scripts/estimar-tipografia.py (necesita fontTools, que no se instala).
import {P,plan,save,check,open} from './qa-dom.mjs';
const {browser,page}=await open();
try{
 const rows=await page.evaluate(()=>{
  const out=[];
  const medir=(id,t)=>{window.__timelines.main.time(t,false);const e=document.getElementById(id),q=e.getBoundingClientRect();
   const r=document.createRange();r.selectNodeContents(e);const lines={};for(const c of r.getClientRects()){const k=Math.round(c.top);lines[k]=Math.max(lines[k]||0,c.right-c.left)}
   return {id,t,y:q.y,h:q.height,b:q.y+q.height,lineas:e.classList.contains('fila')?'(fila)':JSON.stringify(Object.values(lines).map(Math.round)),interior:e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)}};
  for(const id of ['fila-m1','fila-m4','toma','limite-cara','nota-ast','brillo','cta'])out.push(medir(id,15));
  for(const id of ['rotulo','titulo','dato-m1'])out.push(medir(id,3));
  for(const id of ['dato-m4','reencuadre','aviso-refs'])out.push(medir(id,8));
  return out;});
 const g=(a,b)=>(rows.find(r=>r.id===b).y-rows.find(r=>r.id===a).b).toFixed(1);
 const lines=['Medida DOM (Chromium real, fuentes de marca locales) de cada bloque de texto de P9 v3: top, alto, borde inferior y ancho de cada línea de texto (interior disponible 866 px; la nota del asterisco va a 38 px, el resto a 40-66 px).',''];
 for(const r of rows)lines.push(`${r.id.padEnd(12)} (t=${r.t}s) y ${String(+r.y.toFixed(1)).padStart(7)} → ${String(+r.b.toFixed(1)).padStart(7)}  alto ${String(+r.h.toFixed(1)).padStart(6)}  líneas ${r.lineas}`);
 lines.push('',`Huecos verticales de la placa: fila-m1→fila-m4 ${g('fila-m1','fila-m4')} · fila-m4→toma ${g('fila-m4','toma')} · toma→límite ${g('toma','limite-cara')} · límite→nota del asterisco ${g('limite-cara','nota-ast')} · nota→brillo ${g('nota-ast','brillo')} · brillo→CTA ${g('brillo','cta')}`);
 lines.push(`Huecos de m4: dato→reencuadre ${g('dato-m4','reencuadre')} · reencuadre→aviso ${g('reencuadre','aviso-refs')}`);
 const max=Math.max(...rows.map(r=>r.b)),min=Math.min(...rows.map(r=>r.y));
 lines.push(`Borde inferior máximo: ${max.toFixed(1)} (tope 1490) · borde superior mínimo: ${min.toFixed(1)} (mínimo 292)`);
 check(max<=1490&&min>=292,'Layout fuera de la zona segura 292-1490');
 save('layout-dom.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
}finally{await browser.close()}
