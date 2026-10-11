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
   const raiz=e.querySelector('.et')??e,tw=document.createTreeWalker(raiz,NodeFilter.SHOW_TEXT),ln={};let nd;while(nd=tw.nextNode()){for(const m of nd.textContent.matchAll(/\S+/g)){const r=document.createRange();r.setStart(nd,m.index);r.setEnd(nd,m.index+m[0].length);const c=r.getBoundingClientRect(),k=Math.round(c.top/10);(ln[k]??={a:1e9,b:-1e9});ln[k].a=Math.min(ln[k].a,c.left);ln[k].b=Math.max(ln[k].b,c.right)}}
   const ley=e.querySelector('.leyenda'),filas=[...e.querySelectorAll('.leyenda,.escala')].map(x=>{const r=x.getBoundingClientRect();return {clase:x.className,w:Math.round(r.width),h:Math.round(r.height)}});
   const leyW=ley?Math.max(...[...ley.childNodes].map(n=>{const r=document.createRange();r.selectNodeContents(n);return r.getBoundingClientRect().right})) - ley.getBoundingClientRect().left:0;
   out.push({id:tl.id,clip:tl.clip,t:T[tl.clip],x:q.x,w:q.width,y:q.y,h:q.height,b:q.y+q.height,lineas:Object.values(ln).map(v=>Math.round(v.b-v.a)),filas,leyW:Math.round(leyW)});}
  window.__timelines.main.time(14.9,false);
  const barras=[];for(const [sel,fila] of [['#fila-a .fill','a'],['#fila-b .banda','b'],['#fila-c .fill','c']]){const el=document.querySelector(sel),tr=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();barras.push({fila,izq:(r.left-tr.left)/tr.width,ancho:r.width/tr.width});}
  const pts=[...document.querySelectorAll('#fila-b .pt')].map(el=>{const tr=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();return {foto:el.title,x:((r.left+r.right)/2-tr.left)/tr.width}});
  const pisos=[...document.querySelectorAll('.piso')].map(el=>{const tr=el.parentElement.getBoundingClientRect(),r=el.getBoundingClientRect();return {fila:el.closest('.fila')?.id,x:((r.left+r.right)/2-tr.left)/tr.width}});
  return {out,barras,pts,pisos};},{tiles,T:T_ESCENA});
 const g=(a,b)=>(rows.out.find(r=>r.id===b).y-rows.out.find(r=>r.id===a).b).toFixed(1);
 const lines=['Medida DOM (Chromium real, fuentes de marca locales) de cada tile: top, alto, borde inferior y ancho de cada línea de texto (interior 866 px).',''];
 for(const r of rows.out)lines.push(`${r.id.padEnd(11)} (${r.clip} t=${r.t}s) x ${String(Math.round(r.x)).padStart(4)} w ${String(Math.round(r.w)).padStart(4)}  y ${String(+r.y.toFixed(1)).padStart(7)} → ${String(+r.b.toFixed(1)).padStart(7)}  alto ${String(+r.h.toFixed(1)).padStart(6)}  líneas ${JSON.stringify(r.lineas)}`);
 lines.push('',`Huecos de s1: rótulo→título ${g('rotulo','titulo')} · título→dato ${g('titulo','dato')}`);
 lines.push(`Huecos de s2: cap→tile2 ${g('cap-r3','tile2')}`);
 lines.push(`Huecos de la placa: A→B ${g('fila-a','fila-b')} · B→casi copia ${g('fila-b','nota-copia')} · casi copia→C ${g('nota-copia','fila-c')} · C→lección ${g('fila-c','leccion')} · lección→CTA ${g('leccion','cta')}`);
 const max=Math.max(...rows.out.map(r=>r.b)),min=Math.min(...rows.out.map(r=>r.y));
 lines.push(`Borde inferior máximo: ${max.toFixed(1)} (tope 1490) · borde superior mínimo: ${min.toFixed(1)} (mínimo 292)`);
 check(max<=1490&&min>=292,'Layout fuera de la zona segura 292-1490');
 // ninguna línea queda huérfana (la última, al menos 30 % de la más larga) en los tiles de varias líneas
 for(const r of rows.out){if(r.lineas.length>1){const huerfana=r.lineas.at(-1)<0.3*Math.max(...r.lineas);lines.push(`Líneas de ${r.id}: ${r.lineas.join(' / ')} px${huerfana?' · HUÉRFANA':''}`);check(!huerfana,`${r.id}: última línea huérfana (${r.lineas.join('/')})`);}}
 const cta=rows.out.find(r=>r.id==='cta').lineas;check(cta.length===2&&Math.min(...cta)>=0.4*Math.max(...cta),'CTA: debe partirse en dos líneas parejas («Seguime: cada semana, / una prueba.»), no «prueba.» sola');
 // la etiqueta de cada fila del gráfico cabe en UNA línea y la leyenda de las fotos oficiales también (interior 866 px)
 for(const r of rows.out.filter(r=>r.id.startsWith('fila-'))){lines.push(`Etiqueta de ${r.id}: ${r.lineas.join(' / ')} px${r.leyW?` · leyenda ${r.leyW} px`:''}`);check(r.lineas.length===1&&r.lineas[0]<=866,`${r.id}: la etiqueta debe caber en una línea de 866 px (${r.lineas.join('/')})`);if(r.leyW)check(r.leyW<=866,`${r.id}: la leyenda no cabe en una línea (${r.leyW} px)`)}
 // las barras y los puntos dicen lo que dicen los datos (posición = valor × ancho de la pista; ±0,004)
 const D=plan.datos,por=D.por_foto,otras=Object.entries(por).filter(([n])=>n!==D.foto_copiada),vals=otras.map(([,v])=>v),PO=D.pares_oficiales;
 const esp={a:[0,por[D.foto_copiada]],b:[PO.min,PO.max-PO.min],c:[0,D.sin_recibidas_4]};
 for(const b of rows.barras){const [i,a]=esp[b.fila];lines.push(`Barra ${b.fila}: izq ${b.izq.toFixed(4)} ancho ${b.ancho.toFixed(4)} (datos ${i.toFixed(3)} / ${a.toFixed(3)})`);check(Math.abs(b.izq-i)<0.004&&Math.abs(b.ancho-a)<0.004,`barra ${b.fila} no coincide con los datos`);}
 for(const [foto,x] of rows.pts.map(p=>[p.foto,p.x])){lines.push(`Punto ${foto}: x ${x.toFixed(4)} (dato ${por[foto]})`);check(Math.abs(x-por[foto])<0.004,`punto ${foto} no coincide con el dato`);}
 check(rows.pts.length===7,'deben ser 7 puntos (las otras siete fotos)');
 // H1 (revisión 1): el piso 0,70 es del promedio; solo puede haber UNA marca, en la fila del promedio de las 4. Ninguna sobre cosenos de una sola foto (fila de R3, fila de las otras siete).
 check(rows.pisos.length===1&&rows.pisos[0].fila==='fila-c',`marcas del piso: ${JSON.stringify(rows.pisos)}; debe haber una sola, en fila-c`);
 for(const m of rows.pisos)check(Math.abs(m.x-D.piso)<0.004,`marca del piso en ${m.x.toFixed(4)}, debe estar en ${D.piso}`);
 lines.push(`Marca del piso: ${rows.pisos.length} marca (${rows.pisos.map(m=>m.fila).join(', ')}) en ${D.piso}; ninguna sobre las filas por foto`);
 // la banda de las fotos oficiales y sus siete puntos comparten la escala: los puntos quedan sobre/junto a la banda
 lines.push(`Banda de las fotos oficiales entre sí: ${PO.min} a ${PO.max} (promedio ${PO.media}); puntos de K4 con las otras siete: ${Math.min(...vals)} a ${Math.max(...vals)}`);
 save('layout-dom.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
}finally{await browser.close()}
