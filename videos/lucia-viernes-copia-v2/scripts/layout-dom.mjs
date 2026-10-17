// Medida DOM (Chromium real, fuentes de marca locales) de cada tile de texto, cada uno en un instante en que está en reposo (plan.layout.medir_t):
// top, alto, borde inferior, ancho de cada línea y TAMAÑO DE LETRA de cada nodo de texto (v2: tabla de tamaños en qa/tamanos.txt; ningún texto bajo el mínimo del plan).
// También exige que el gráfico de la v1.1 NO exista en el DOM (barras, puntos, banda, leyenda, marca de piso, escala).
import fs from 'node:fs';import path from 'node:path';import {P,plan,save,check,open} from './qa-dom.mjs';
const tiles=JSON.parse(fs.readFileSync(path.join(P,'qa/tiles.json'),'utf8'));
const TT=plan.layout.medir_t,TY=plan.tipografia,grandes=new Set(TY.grandes_ids);
const {browser,page}=await open();
try{
 const res=await page.evaluate(({tiles,TT})=>{
  const out=[];
  for(const tl of tiles){window.__timelines.main.time(TT[tl.id],false);const e=document.getElementById(tl.id),q=e.getBoundingClientRect(),op=+getComputedStyle(e).opacity;
   const lin={};const tw=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let nd;const sizes={};
   while(nd=tw.nextNode()){if(!/[\p{L}\p{N}]/u.test(nd.textContent))continue;const fs=parseFloat(getComputedStyle(nd.parentElement).fontSize),fam=getComputedStyle(nd.parentElement).fontFamily.split(',')[0].replaceAll('"','');sizes[`${fs} px · ${fam}`]=(sizes[`${fs} px · ${fam}`]||'')+nd.textContent.trim()+' ';
    for(const m of nd.textContent.matchAll(/\S+/g)){const r=document.createRange();r.setStart(nd,m.index);r.setEnd(nd,m.index+m[0].length);const c=r.getBoundingClientRect(),k=Math.round(c.top/10);(lin[k]??={a:1e9,b:-1e9});lin[k].a=Math.min(lin[k].a,c.left);lin[k].b=Math.max(lin[k].b,c.right)}}
   out.push({id:tl.id,clip:tl.clip,t:TT[tl.id],op,x:q.x,w:q.width,y:q.y,h:q.height,b:q.y+q.height,lineas:Object.values(lin).map(v=>Math.round(v.b-v.a)),tamanos:sizes});}
  const fotos=[['foto-s1',1],['foto-k4',5],['foto-r3',5],['foto-s3',9]].map(([id,t])=>{window.__timelines.main.time(t,false);const el=document.getElementById(id),r=el?.getBoundingClientRect(),cs=el&&getComputedStyle(el);return {id,t,w:r?.width??0,h:r?.height??0,x:r?.x??0,visible:!!el&&cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>0}});
  const grafico=[...document.querySelectorAll('.pista,.piso,.fill,.banda,.pt,.leyenda,.escala,.fila,.rango')].map(x=>x.className||x.tagName);
  const cuerpo=document.body.innerText.replace(/\s+/g,' ');
  return {out,grafico,cuerpo,fotos};},{tiles,TT});
 const R=id=>res.out.find(r=>r.id===id);
 const lines=['Medida DOM (Chromium real, fuentes de marca locales) de cada tile en reposo: top, alto, borde inferior y ancho de cada línea (interior 866 px).',''];
 for(const r of res.out)lines.push(`${r.id.padEnd(10)} (${r.clip} t=${r.t}s, opacidad ${r.op.toFixed(2)}) x ${String(Math.round(r.x)).padStart(4)} w ${String(Math.round(r.w)).padStart(4)}  y ${String(+r.y.toFixed(1)).padStart(7)} → ${String(+r.b.toFixed(1)).padStart(7)}  alto ${String(+r.h.toFixed(1)).padStart(6)}  líneas ${JSON.stringify(r.lineas)}`);
 for(const r of res.out)check(r.op>=.99,`${r.id}: no está en reposo a ${r.t} s (opacidad ${r.op})`);
 const max=Math.max(...res.out.map(r=>r.b)),min=Math.min(...res.out.map(r=>r.y));
 lines.push('',`Borde inferior máximo: ${max.toFixed(1)} (tope 1490) · borde superior mínimo: ${min.toFixed(1)} (mínimo 292)`);
 check(max<=1490&&min>=292,'Layout fuera de la zona segura 292-1490');
 // v2: la cara de Lucía a la vista: las tres escenas llevan su foto (K4 a pantalla completa, K4|R3, K4 a pantalla completa) visible y del tamaño que dice el plan
 for(const f of res.fotos){lines.push(`Foto ${f.id} a ${f.t} s: ${Math.round(f.w)}×${Math.round(f.h)} px, ${f.visible?'visible':'NO VISIBLE'}`);check(f.visible&&f.w>=500&&f.h>=800,`${f.id}: la foto debe estar visible (hay una cara a la vista en toda la pieza); mide ${Math.round(f.w)}×${Math.round(f.h)}`)}
 // v2: sin gráfico en el DOM, y ninguno de sus textos
 lines.push(`Elementos de gráfico en el DOM: ${res.grafico.length} (deben ser 0)`);
 check(res.grafico.length===0,`El gráfico de la v1.1 volvió al DOM: ${res.grafico.join(', ')}`);
 check(!/promedio|piso|oficiales|leyenda|gráfico/i.test(res.cuerpo),`Texto de gráfico en pantalla: ${res.cuerpo.match(/promedio|piso|oficiales|leyenda|gráfico/i)?.[0]}`);
 // los beats comparten casilla (misma y) y la etiqueta y la cifra caben en una línea cada una
 const ys=['beat-a','beat-b','beat-c','cta'].map(id=>R(id).y);
 lines.push(`Casilla de los beats: y ${ys.map(y=>+y.toFixed(1)).join(' · ')} (iguales)`);check(ys.every(y=>Math.abs(y-ys[0])<.5),'Los beats A, B, C y el CTA deben ocupar la misma casilla (y)');
 for(const id of ['beat-a','beat-b']){const r=R(id);lines.push(`Líneas de ${id}: ${r.lineas.join(' / ')} px`);check(r.lineas.length===2&&Math.max(...r.lineas)<=866,`${id}: etiqueta y cifra deben ir en una línea cada una dentro de 866 px (${r.lineas.join('/')})`)}
 for(const id of ['beat-c','cta','cap-r3']){const r=R(id);if(r.lineas.length>1){const huerfana=r.lineas.at(-1)<0.3*Math.max(...r.lineas);lines.push(`Líneas de ${id}: ${r.lineas.join(' / ')} px${huerfana?' · HUÉRFANA':''}`);check(!huerfana,`${id}: última línea huérfana (${r.lineas.join('/')})`)}}
 const cta=R('cta').lineas;check(cta.length===2&&Math.min(...cta)>=0.4*Math.max(...cta),'CTA: debe partirse en dos líneas parejas («Seguime: cada semana, / una prueba.»), no «prueba.» sola');
 check(R('cap-k4').h===R('cap-r3').h,'Los dos rótulos de la escena 2 deben tener la misma altura');
 // la pila de texto de cada escena no se pisa (alto + hueco)
 const g=(a,b)=>(R(b).y-R(a).b).toFixed(1);
 lines.push(`Huecos de s1: rótulo→título ${g('rotulo','titulo')} · título→dato ${g('titulo','dato')} · s2: rótulos→tile2 ${g('cap-r3','tile2')}`);
 check(+g('rotulo','titulo')>=12&&+g('titulo','dato')>=12&&+g('cap-r3','tile2')>=12,'Huecos entre tarjetas < 12 px');
 // tamaños de letra por texto (a 1080 px de ancho): cada nodo ≥ mínimo del plan
 const tab=['Tamaños de letra a 1080 px de ancho (cada nodo de texto medido en el DOM; el mínimo absoluto es 40 px, general 44 px y 48 px en los textos grandes: letra de beats ≥ 56 px).','','texto | nodo (tamaño · fuente) | contenido | mínimo exigido','---|---|---|---'];
 let menor=1e9;
 for(const r of res.out){const req=grandes.has(r.id)?TY.grandes:TY.general;for(const [k,v] of Object.entries(r.tamanos)){const px=parseFloat(k);menor=Math.min(menor,px);tab.push(`${r.id} | ${k} | ${v.trim()} | ${req}`);check(px>=TY.absoluto,`${r.id}: ${k} bajo el mínimo absoluto de ${TY.absoluto} px`);check(px>=req,`${r.id}: ${k}; mínimo ${req} px (${v.trim()})`)}}
 for(const id of ['beat-a','beat-b']){const px=Math.max(...Object.keys(R(id).tamanos).map(parseFloat));check(px>=100,`${id}: la cifra debe ir a ≥ 100 px (va a ${px})`)}
 tab.push('',`Letra más chica de toda la pieza: ${menor} px.`);
 save('tamanos.txt',tab.join('\n')+'\nEXIT 0\n');
 save('layout-dom.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));console.log(tab.join('\n'));
}finally{await browser.close()}
