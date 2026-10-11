// P9 v2 (revisión 1, 11-oct-2026): plan → fuentes → validación → HTML determinista; sin red.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cronograma} from './voz.mjs';
const P=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const R=path.resolve(P,'../..'), V4=path.join(R,'hermes-content/references/modelos/lucia/v4');
const KIT=path.join(V4,'kit'), PM=path.join(V4,'prueba-motores-20261008');
const FONTS=path.join(R,'hermes-content/brand/fonts');
const p=JSON.parse(fs.readFileSync(path.join(P,'plan.json'),'utf8'));
const read=n=>fs.readFileSync(path.join(P,n),'utf8').trim();
const fail=s=>{throw Error(s)};
const same=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))fail(`${label}: ${JSON.stringify(a)} ≠ fuente ${JSON.stringify(b)}`)};
const round=n=>Math.round(n*100+1e-7)/100;
const f=n=>String(n).replace('.',','),f2=n=>n.toFixed(2).replace('.',','),minus=n=>String(n).replace('-','−');
const wc=s=>s.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
const row=JSON.parse(fs.readFileSync(path.join(V4,'PROCEDENCIA.jsonl'),'utf8').split(/\r?\n/)[96]);
const datos=row.video_misma_foto_K1_misma_orden;
const luz=fs.readFileSync(path.join(PM,'medicion-luz-movimiento-20261011.txt'),'utf8');
const SR=fs.readFileSync(path.join(PM,'medicion-sin-refs-entrada-20261011.txt'),'utf8');
same(p.clips.map(({id,nombre,fuente,a,b})=>({id,nombre,fuente,a,b})),[
 {id:'m1',nombre:'Kling 3.0 std',fuente:'kit/k1-clip-mira-camara-e470ef4f.mp4',a:0,b:6},
 {id:'m4',nombre:'Seedance 2.0 Mini + referencias',fuente:'prueba-motores-20261008/seedance-mini-refs-dd2d7c91.mp4',a:5.75,b:11.791666666666666}
],'IDs, nombres, fuentes y cortes autorizados');
for(const c of p.clips){
 const key=Object.keys(datos).find(k=>k.includes(c.id==='m1'?'e470ef4f':'dd2d7c91'));
 if(!key)fail(`PROCEDENCIA l.97: falta ${c.id}`);
 const d=datos[key];same(c.parecido,[round(d.id[0]),round(d.id.at(-1))],`${c.id} parecido`);same(c.creditos,d.cr,`${c.id} créditos`);
 const m=luz.match(new RegExp(`${c.id}\\.mp4:.*?luma ini ([\\d.]+) fin ([\\d.]+) \\(Δ([+−-]?[\\d.]+)\\)`));
 if(!m)fail(`medición de brillo: falta ${c.id}`);same(c.brillo,m.slice(1).map(Number),`${c.id} brillo (Δ publicado)`);
 // H6: en pantalla el brillo va en enteros y la resta tiene que cuadrar a simple vista (156 → 155 = −1; 146 → 112 = −34)
 const [b0,b1,bd]=c.brillo.map(Math.round);if(b1-b0!==bd)fail(`${c.id} brillo en enteros no cuadra: ${b0} → ${b1} ≠ ${bd}`);
 c.entero=[b0,b1,bd];
 if(c.cara_px){const m=d.nota.match(/cara de (\d+) a (\d+) px/);if(!m)fail('Falta tamaño cara en PROCEDENCIA');same(c.cara_px,m.slice(1).map(Number),'m4 cara px');}
}
const [k,s]=p.clips;
// Medición sin las fotos recibidas (11-oct-2026; método .claude/skills/lucia/scripts/parecido_sin_refs.py): tamaño de cara por punto, fotos recibidas y efecto estimado
const bloque=n=>{const i=SR.indexOf('== '+n);if(i<0)fail(`medición sin refs: falta «${n}»`);const j=SR.indexOf('\n== ',i+3);return SR.slice(i,j<0?SR.length:j)};
const pxs=b=>[...b.matchAll(/^\s+[\d.]+\s+(\d+)\s+\d\.\d{3}\s+\d\.\d{3}\s+[+-]\d\.\d{3}/gm)].map(m=>+m[1]);
const bS=bloque('Seedance Mini + refs (dd2d7c91)'),bK=bloque('Kling 3.0 std control (e470ef4f)');
const pxS=pxs(bS),pxK=pxs(bK);
if(pxS.length!==7||pxK.length!==7)fail('medición sin refs: se esperaban 7 puntos de cara_px por clip');
if(!pxK.every(n=>n<200))fail('Kling debe estar bajo 200 px en todos los puntos («todo el clip»)');
if(!(pxS[0]<200&&pxS[1]<200&&pxS.slice(2).every(n=>n>=200)))fail('Seedance debe estar bajo 200 px solo al inicio («el inicio»)');
same([pxS[0],pxS.at(-1)],s.cara_px,'m4 cara px (medición sin refs)');
const mRec=bS.match(/recibió: ((?:R\d(?:, )?)+)\s+·\s+no recibió \((\d+)\)/);
if(!mRec)fail('medición sin refs: faltan las fotos recibidas por Seedance');
const rec=mRec[1].split(',').length,tot=rec+Number(mRec[2]);
if(tot!==8)fail(`Seedance: recibidas + no recibidas = ${tot}, deben ser las 8 fotos oficiales`);
const mHead=SR.match(/dd2d7c91\): start_image K1 \(4afffb96\) \+ ([^.]*)\./);
if(!mHead||(mHead[1].match(/\b[0-9a-f]{8}\b/g)??[]).length!==3)fail('medición sin refs: Seedance debe tener 3 imágenes de referencia');
const mEx=SR.match(/EXCESO sobre los controles en B-A: Seedance\+refs [−-](\d,\d+)/);
if(!mEx)fail('medición sin refs: falta el exceso de Seedance');
const efecto=f2(Math.abs(Number(mEx[1].replace(',','.'))));
const esperado={rotulo:'Lucía Antelo · personaje IA de Onia',titulo:'¿La cara o la escena?',m1:'Kling 3.0 std · brillo −1 · parecido 0,79 → 0,72',m4:'Seedance 2.0 Mini + referencias · brillo −34 · parecido 0,71 → 0,80',reencuadre:`Cara: ${s.cara_px[0]} → ${s.cara_px[1]} px del clip original · reencuadra`,aviso_refs:`Seedance recibió ${rec} de las ${tot} fotos de puntaje: efecto estimado ≈ ${efecto}.`,toma:'Una toma cada uno: prueba, no regla.',brillo:'Brillo: cuadro entero, mezcla luz y encuadre.',limite_cara:'Parecido indicativo. Bajo 200 px la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.',cta:'Seguime: cada semana, una prueba.'};
same(p.textos,esperado,'textos/cifras autorizados');
if(!p.textos.m1.includes('brillo '+minus(k.entero[2]))||!p.textos.m4.includes('brillo '+minus(s.entero[2])))fail('Las pastillas deben llevar el brillo en enteros');
if(!/Kling, todo el clip.*Seedance, el inicio/.test(p.textos.limite_cara))fail('Límite de cara: Kling debe nombrarse (todo el clip) junto con Seedance (el inicio)');
if(wc(p.textos.aviso_refs)>12)fail('Aviso de fotos recibidas: máximo 12 palabras');
const nuevas=wc(p.textos.limite_cara)+wc(p.textos.toma)+wc(p.textos.brillo);
if(nuevas>34)fail(`Lectura nueva de la placa: ${nuevas} palabras (tope ≈ 34)`);
if(!p.scrim_m4||!Array.isArray(p.scrim_m4.caja)||!Array.isArray(p.scrim_m4.centro)||!Array.isArray(p.scrim_m4.radios))fail('H5: falta el scrim que tapa el letrero inventado de la torre (plan.scrim_m4)');
const pieTxt=read('pie.txt');
if(!pieTxt.startsWith('Personaje hecho con IA'))fail('Pie debe abrir con Personaje hecho con IA');
const pieFrases={
 kling:`la cara de ${k.nombre} queda bajo 200 px todo el clip; la de Seedance 2.0 Mini, solo al inicio (pasa de ${s.cara_px[0]} a ${s.cara_px[1]} px porque el encuadre se acerca)`,
 refs:`Seedance recibió 3 imágenes de referencia y ${rec} de ellas están entre las ${tot} fotos oficiales con que se mide el parecido; descontando eso, el efecto estimado es de ≈ ${efecto} (dentro del ruido de ±0,03). Kling no recibió ninguna.`,
 letrero:'Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe.'};
if(!pieTxt.includes(pieFrases.kling))fail('Pie y límite de cara: Kling debe nombrarse bajo 200 px todo el clip (Seedance no puede ser el único con tamaño de cara)');
if(!pieTxt.includes(pieFrases.refs))fail('Pie: falta el aviso de las fotos de referencia que recibió Seedance (y su efecto estimado)');
if(!pieTxt.includes(pieFrases.letrero))fail('Pie: falta decir que el letrero de la torre es inventado');
const dif=[k,s].map(c=>f2(Math.abs(c.parecido[1]-c.parecido[0])));
const pie=`Personaje hecho con IA: Lucía Antelo, de @oniahq. Hice dos clips con la misma foto y la misma orden en Higgsfield y medí dos cosas en cada uno: cuánto cambia el brillo del cuadro (de 0 a 255) y cuánto se parece la cara a la de ella (ArcFace contra ocho fotos oficiales, de 0 a 1). ${k.nombre} (${f(k.creditos)} créditos): el brillo casi no cambia (${minus(k.entero[2])}) y la cara baja de ${f2(k.parecido[0])} a ${f2(k.parecido[1])}. Seedance 2.0 Mini con referencias (${f(s.creditos)} créditos): la cara sube de ${f2(s.parecido[0])} a ${f2(s.parecido[1])}, pero el brillo baja ${-s.entero[2]} puntos y el encuadre cambia. ${pieFrases.refs} ${pieFrases.letrero} Lo difuminé en el video. Una toma cada uno: es una prueba, no una regla. El brillo es el promedio del cuadro entero y mezcla luz con lo que entra al plano; el parecido es indicativo: bajo 200 px la cara es poco confiable. En el clip original (720p), ${pieFrases.kling}. El ruido es de ±0,03: las dos diferencias (${dif[0]} y ${dif[1]}) lo superan, pero son una toma cada una. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia`;
same(pieTxt,pie,'pie y cifras contra fuentes');
const voz=read('guion-voz.txt'),all=Object.values(p.textos).join(' ')+' '+pie+' '+voz;
if(/(?:las|todas las|ambas) caras.{0,65}(?:menos de|<|bajo)\s*200/i.test(all))fail('Prohibido afirmar que TODAS las caras son <200 px');
if(/la luz cambia cuando la cara se sostiene|la foto sola pierde la cara|el mejor/i.test(all))fail('Afirmación general/prohibida');
// H4: la voz no habla decimales (están en pantalla), L1-L3 terminan antes del corte a Seedance, L4 empieza después y L5-L7 caen con la entrada de su nota
const vozEsperada=['¿La cara o la escena?','Misma foto, misma orden.','Kling: brillo casi igual, la cara baja un poco.','Seedance Mini con referencias: la cara sube, pero el encuadre se acerca y la imagen se oscurece.','Una toma cada uno: prueba, no regla.','Brillo del cuadro entero: mezcla luz y encuadre.','Seguime: cada semana, una prueba.'].join('\n');
if(/\d/.test(voz))fail('voz: las cifras y los decimales no se hablan (están en pantalla)');
same(voz,vozEsperada,'voz y cifras');
const cr=cronograma(voz,p.voz.ultimo_tramo_cuadros);
if(cr.chars>p.voz.max_caracteres||cr.tramos.some(t=>!t.ultimo&&(t.hueco<0||t.hueco>0.3)))fail('Voz supera cupo o pausas');
if(cr.cuadros!==480)fail(`Voz: el cronograma da ${cr.cuadros} cuadros y la pieza tiene 480`);
const Ln=n=>cr.tramos[n-1],cz=p.voz.cortes,fin1=Ln(cz.lineas_clip_1.at(-1)).a+Ln(cz.lineas_clip_1.at(-1)).voz_s;
if(fin1>cz.termina_antes_de)fail(`voz: la línea ${cz.lineas_clip_1.at(-1)} termina a ${fin1.toFixed(2)} s, después del corte a Seedance (${cz.termina_antes_de} s)`);
if(Ln(cz.linea_clip_2).a<cz.empieza_desde-1e-6)fail(`voz: la línea ${cz.linea_clip_2} empieza a ${Ln(cz.linea_clip_2).a.toFixed(2)} s, antes de ${cz.empieza_desde} s`);
for(const ev of p.eventos)if(ev.voz){const d=ev.t-Ln(ev.voz).a;if(d<-0.05||d>0.5)fail(`voz: ${ev.selector} entra a ${ev.t} s y su línea ${ev.voz} empieza a ${Ln(ev.voz).a.toFixed(2)} s (deben coincidir a ±0,5 s)`)}
if(p.lienzo.cuadros!==480||p.lienzo.fps!==24||p.empuje.cuadros!==6)fail('Lienzo/costuras fuera de contrato');
const full=path.join(PM,'seedance-mini-refs-dd2d7c91.mp4'),draft=!fs.existsSync(full);
if(draft&&!process.argv.includes('--borrador'))fail(`FALTA m4 completo: ${full}. No apto para master. Use --borrador explícito SOLO para gates estáticos (proxy 360p).`);
const src4=draft?path.join(V4,s.proxy):full;if(!fs.existsSync(src4))fail(`Falta ${src4}`);
if(draft)console.warn('AVISO VISIBLE: --borrador usa m4 PROXY 360p. BUILD NO APTO PARA MASTER; solo gates estáticos.');
fs.mkdirSync(path.join(P,'assets'),{recursive:true});
fs.mkdirSync(path.join(P,'assets/fonts'),{recursive:true});
for(const name of ['BricolageGrotesque-var-latin.woff2','DMSans-var-latin.woff2','SplineSansMono-var-latin.woff2']){
 const source=path.join(FONTS,name),dest=path.join(P,'assets/fonts',name);
 if(!fs.existsSync(source))fail(`Falta fuente local de marca ${source}; no se descarga.`);
 fs.copyFileSync(source,dest);
}
// Hardlinks para no duplicar clips; fallback copia solo los dos archivos si FS lo exige.
for(const [dest,src] of [['m1.mp4',path.join(KIT,'k1-clip-mira-camara-e470ef4f.mp4')],[draft?'m4-proxy.mp4':'m4-full.mp4',src4]]){const out=path.join(P,'assets',dest);if(!fs.existsSync(src))fail(`Falta ${src}`);if(!fs.existsSync(out)){try{fs.linkSync(src,out)}catch{fs.copyFileSync(src,out)}}}
const e=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const L=p.layout;
const txt=(id,text,y,size=42,extra='')=>`<div id="${id}" class="texto ${extra}" style="top:${y}px;font-size:${size}px">${e(text)}</div>`;
const video=(c,file)=>`<video id="${c.id}" class="clip media" src="assets/${file}" muted playsinline preload="auto" data-start="${Math.floor(c.a*1e6)/1e6}" data-duration="${Math.ceil((c.b-c.a)*1e6)/1e6}" data-media-start="0" data-track-index="${c.id==='m1'?0:1}"></video>`;
const flecha='<svg class="fl" viewBox="0 0 30 20" width="30" height="20" aria-hidden="true"><path d="M2 10H27M18 2L27 10L18 18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// Fila de resultados: brillo y parecido en enteros / 2 decimales, una barra por medida y la escala de cada barra debajo (H6, H7)
const rowHTML=c=>`<div class="fila texto card" id="fila-${c.id}"><div>${e(c.nombre)}</div><div class="numeros">brillo ${c.entero[0]} ${flecha} ${c.entero[1]} (${minus(c.entero[2])})</div><div class="barra"><i style="width:${c.brillo[1]/255*100}%"></i></div><div class="numeros">parecido ${f2(c.parecido[0])} ${flecha} ${f2(c.parecido[1])}</div><div class="barra cara"><i style="width:${c.parecido[1]*100}%"></i></div><div class="escala"><b class="v">brillo 0 a 255</b> · <b class="n">parecido 0 a 1</b></div></div>`;
const sc=p.scrim_m4,[sx,sy,sw,sh]=sc.caja,[cx,cy]=sc.centro,[rx,ry]=sc.radios;
const mask=`radial-gradient(ellipse ${rx}px ${ry}px at ${cx-sx}px ${cy-sy}px,#000 0%,#000 58%,transparent 100%)`;
// Desenfoque (backdrop-filter) con máscara radial: el letrero queda como mancha borrosa y oscura, sin borde duro; viaja con #overlay-m4
const scrim=`<div id="scrim-m4" style="left:${sx}px;top:${sy}px;width:${sw}px;height:${sh}px;-webkit-backdrop-filter:blur(${sc.desenfoque_px}px) brightness(${sc.brillo});backdrop-filter:blur(${sc.desenfoque_px}px) brightness(${sc.brillo});-webkit-mask-image:${mask};mask-image:${mask}"></div>`;
const html=`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><title>Lucía P9</title><style>${read('scripts/estilos.css')}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="20" data-width="1080" data-height="1920" data-fps="24">
${video(k,'m1.mp4')}${video(s,draft?'m4-proxy.mp4':'m4-full.mp4')}
<div id="placa" class="clip escena" data-start="11.541666" data-duration="8.458334" data-track-index="2"><div id="comparacion">${rowHTML(k)}${rowHTML(s)}</div>${txt('limite-cara',p.textos.limite_cara,L.limite,44,'nota')}${txt('toma',p.textos.toma,L.toma,44,'nota')}${txt('brillo',p.textos.brillo,L.brillo,44,'nota')}${txt('cta',p.textos.cta,L.cta,66,'card titular')}</div>
<div id="overlay-m1" class="clip escena transparente" data-start="0" data-duration="6" data-track-index="3">${txt('rotulo',p.textos.rotulo,300,40)}${txt('titulo',p.textos.titulo,760,66,'card titular')}${txt('dato-m1',p.textos.m1,1030,42,'card dato')}</div>
<div id="overlay-m4" class="clip escena transparente" data-start="5.75" data-duration="6.041667" data-track-index="4">${scrim}${txt('dato-m4',p.textos.m4,L.dato_m4,42,'card dato')}${txt('reencuadre',p.textos.reencuadre,L.reencuadre,42,'dato')}${txt('aviso-refs',p.textos.aviso_refs,L.aviso_refs,42,'card dato')}</div>
</div><script src="assets-fijos/vendor/gsap.min.js"></script><script>window.PLAN=${JSON.stringify({...p,draft})};window.__timelines=window.__timelines||{};${read('scripts/timeline.js')}</script></body></html>\n`;
fs.writeFileSync(path.join(P,'index.html'),html);fs.writeFileSync(path.join(P,'qa/build-status.json'),JSON.stringify({borrador:draft,apto_master:!draft,m4:src4,voz:cr},null,2));
console.log(`OK datos/pie/voz: ${cr.chars} caracteres (cupo ${p.voz.max_caracteres}), cronograma ${cr.cuadros}/24 s; lienzo 480 cuadros/20 s; efecto sin refs ≈ ${efecto}; fotos recibidas ${rec} de ${tot}. ${draft?'NO APTO PARA MASTER':'fuentes completas'}`);
const rp=path.join(P,'README.md');if(fs.existsSync(rp)){let r=fs.readFileSync(rp,'utf8');r=r.replace(/<!-- ESTADO -->[\s\S]*?<!-- FIN ESTADO -->/,m=>!draft&&!/BORRADOR/.test(m)?m:`<!-- ESTADO -->\n${draft?'**BORRADOR · NO APTO PARA MASTER. m4 usa proxy 360p; solo gates estáticos.**':'Fuentes completas presentes; falta render y QA del master.'}\n<!-- FIN ESTADO -->`);fs.writeFileSync(rp,r);}
