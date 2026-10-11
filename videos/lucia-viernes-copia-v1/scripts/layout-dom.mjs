// Medida DOM (Chromium real, fuentes de marca locales) de cada tile de texto: top, alto, borde inferior, huecos y ancho de cada línea.
// Escribe qa/layout-dom.txt y verifica las barras del gráfico contra los datos. Sustituye a scripts/estimar-tipografia.py (falta fontTools; no se instala).
import fs from 'node:fs';import path from 'node:path';import {P,plan,save,check,open} from './qa-dom.mjs';
const tiles=JSON.parse(fs.readFileSync(path.join(P,'qa/tiles.json'),'utf8'));
const T_ESCENA={s1:2.5,s2:6.0,placa:14.0};
const {browser,page}=await open();
try{
 const rows=await page.evaluate(({tiles,T})=>{
  const out=[];
  for(const tl of tiles){window.__timelines.main.time(T[tl.clip],false);const e=document.getElementById(tl.id),q=e.getBoundingClientRect();
   const tw=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),ln={};let nd;while(nd=tw.nextNode()){for(const m of nd.textContent.matchAll(/\S+/g)){const r=document.createRange();r.setStart(nd,m.index);r.setEnd(nd,m.index+m[0].length);const c=r.getBoundingClientRect(),k=Math.round(c.top/10);(ln[k]??={a:1e9,b:-1e9});ln[k].a=Math.min(ln[k].a,c.left);ln[k].b=Math.max(ln[k].b,c.right)}}
   out.push({id:tl.id,clip:tl.clip,t:T[tl.clip],x:q.x,w:q.width,y:q.y,h:q.height,b:q.y+q.height,lineas:Object.values(ln).map(v=>Math.round(v.b-v.a))});}
  window.__timelines.main.time(14.9,false);
  const barras=[];for(const [sel,fila] of [['#fila-a .fill','a'],['#fila-b .rango','b'],['#fila-c .fill','c']]){const el=document.querySelector(sel),tr=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();barras.push({fila,izq:(r.left-tr.left)/tr.width,ancho:r.width/tr.width});}
  const pts=[...document.querySelectorAll('#fila-b .pt')].map(el=>{const tr=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();return {foto:el.title,x:((r.left+r.right)/2-tr.left)/tr.width}});
  const pisos=[...document.querySelectorAll('.piso')].map(el=>{const tr=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();return ((r.left+r.right)/2-tr.left)/tr.width});
  return {out,barras,pts,pisos};},{tiles,T:T_ESCENA});
 const g=(a,b)=>(rows.out.find(r=>r.id===b).y-rows.out.find(r=>r.id===a).b).toFixed(1);
 const lines=['Medida DOM (Chromium real, fuentes de marca locales) de cada tile: top, alto, borde inferior y ancho de cada línea de texto (interior 866 px).',''];
 for(const r of rows.out)lines.push(`${r.id.padEnd(11)} (${r.clip} t=${r.t}s) x ${String(Math.round(r.x)).padStart(4)} w ${String(Math.round(r.w)).padStart(4)}  y ${String(+r.y.toFixed(1)).padStart(7)} → ${String(+r.b.toFixed(1)).padStart(7)}  alto ${String(+r.h.toFixed(1)).padStart(6)}  líneas ${JSON.stringify(r.lineas)}`);
 lines.push('',`Huecos de s1: rótulo→título ${g('rotulo','titulo')} · título→dato ${g('titulo','dato')}`);
 lines.push(`Huecos de s2: cap→tile2 ${g('cap-r3','tile2')}`);
 lines.push(`Huecos de la placa: A→B ${g('fila-a','fila-b')} · B→C ${g('fila-b','fila-c')} · C→casi copia ${g('fila-c','nota-copia')} · casi copia→lección ${g('nota-copia','leccion')} · lección→CTA ${g('leccion','cta')}`);
 const max=Math.max(...rows.out.map(r=>r.b)),min=Math.min(...rows.out.map(r=>r.y));
 lines.push(`Borde inferior máximo: ${max.toFixed(1)} (tope 1490) · borde superior mínimo: ${min.toFixed(1)} (mínimo 292)`);
 check(max<=1490&&min>=292,'Layout fuera de la zona segura 292-1490');
 // ninguna línea queda huérfana (la última, al menos 30 % de la más larga) en los tiles de varias líneas
 for(const r of rows.out){if(r.lineas.length>1){const huerfana=r.lineas.at(-1)<0.3*Math.max(...r.lineas);lines.push(`Líneas de ${r.id}: ${r.lineas.join(' / ')} px${huerfana?' · HUÉRFANA':''}`);check(!huerfana,`${r.id}: última línea huérfana (${r.lineas.join('/')})`);}}
 const cta=rows.out.find(r=>r.id==='cta').lineas;check(cta.length===2&&Math.min(...cta)>=0.4*Math.max(...cta),'CTA: debe partirse en dos líneas parejas («Seguime: cada semana, / una prueba.»), no «prueba.» sola');
 // las barras y los puntos dicen lo que dicen los datos (posición = valor × ancho de la pista; ±0,004)
 const D=plan.datos,por=D.por_foto,otras=Object.entries(por).filter(([n])=>n!==D.foto_copiada),vals=otras.map(([,v])=>v);
 const esp={a:[0,por[D.foto_copiada]],b:[Math.min(...vals),Math.max(...vals)-Math.min(...vals)],c:[0,D.sin_recibidas_4]};
 for(const b of rows.barras){const [i,a]=esp[b.fila];lines.push(`Barra ${b.fila}: izq ${b.izq.toFixed(4)} ancho ${b.ancho.toFixed(4)} (datos ${i.toFixed(3)} / ${a.toFixed(3)})`);check(Math.abs(b.izq-i)<0.004&&Math.abs(b.ancho-a)<0.004,`barra ${b.fila} no coincide con los datos`);}
 for(const [foto,x] of rows.pts.map(p=>[p.foto,p.x])){lines.push(`Punto ${foto}: x ${x.toFixed(4)} (dato ${por[foto]})`);check(Math.abs(x-por[foto])<0.004,`punto ${foto} no coincide con el dato`);}
 check(rows.pts.length===7,'deben ser 7 puntos (las otras siete fotos)');
 for(const x of rows.pisos)check(Math.abs(x-D.piso)<0.004,`marca del piso en ${x.toFixed(4)}, debe estar en ${D.piso}`);
 lines.push(`Marca del piso: ${rows.pisos.length} marcas en ${D.piso}`);
 save('layout-dom.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
}finally{await browser.close()}
