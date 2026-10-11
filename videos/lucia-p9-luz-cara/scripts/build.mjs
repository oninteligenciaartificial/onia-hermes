// G5 v2: plan → fuentes → validación → HTML determinista; sin red.
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
const row=JSON.parse(fs.readFileSync(path.join(V4,'PROCEDENCIA.jsonl'),'utf8').split(/\r?\n/)[96]);
const datos=row.video_misma_foto_K1_misma_orden;
const luz=fs.readFileSync(path.join(PM,'medicion-luz-movimiento-20261011.txt'),'utf8');
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
 if(c.cara_px){const m=d.nota.match(/cara de (\d+) a (\d+) px/);if(!m)fail('Falta tamaño cara en PROCEDENCIA');same(c.cara_px,m.slice(1).map(Number),'m4 cara px');}
}
const esperado={rotulo:'Lucía Antelo · personaje IA de Onia',titulo:'La cara o la escena.',m1:'Kling 3.0 std · brillo −1,0 · parecido 0,79 → 0,72',m4:'Seedance 2.0 Mini + referencias · brillo −34 · parecido 0,71 → 0,80',reencuadre:`Cara: ${p.clips[1].cara_px[0]} → ${p.clips[1].cara_px[1]} px · reencuadra`,toma:'Una toma cada uno: es una prueba, no una regla.',brillo:'El brillo es el promedio del cuadro entero: mezcla luz y encuadre.',limite_cara:'El parecido es indicativo: bajo 200 px la cara es poco confiable (Seedance parte de 139 px). Ruido de ±0,03.',cta:'Seguime: cada semana, una prueba.'};
same(p.textos,esperado,'textos/cifras autorizados');
const f=n=>String(n).replace('.',','),f2=n=>n.toFixed(2).replace('.',',');
const [k,s]=p.clips;
const pie=`Personaje hecho con IA: Lucía Antelo, de @oniahq. Hice dos clips con la misma foto y la misma orden en Higgsfield y medí dos cosas en cada uno: cuánto cambia el brillo del cuadro (de 0 a 255) y cuánto se parece la cara a la de ella (ArcFace contra ocho fotos oficiales, de 0 a 1). ${k.nombre} (${f(k.creditos)} créditos): el brillo casi no cambia (${String(Math.round(k.brillo[2])).replace('-','−')}) y la cara baja de ${f2(k.parecido[0])} a ${f2(k.parecido[1])}. Seedance 2.0 Mini con referencias (${f(s.creditos)} créditos): la cara sube de ${f2(s.parecido[0])} a ${f2(s.parecido[1])}, pero el brillo baja ${Math.round(-s.brillo[2])} puntos y el encuadre cambia. Una toma cada uno: es una prueba, no una regla. El brillo es el promedio del cuadro entero y mezcla luz con lo que entra al plano; el parecido es indicativo: bajo 200 px la cara es poco confiable (en Seedance 2.0 Mini parte de ${s.cara_px[0]} px) y el ruido es de ±0,03. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia`;
if(!read('pie.txt').startsWith('Personaje hecho con IA'))fail('Pie debe abrir con Personaje hecho con IA');same(read('pie.txt'),pie,'pie y cifras contra fuentes');
const voz=read('guion-voz.txt'),all=Object.values(p.textos).join(' ')+' '+pie+' '+voz;
if(/(?:las|todas las|ambas) caras.{0,65}(?:menos de|<|bajo)\s*200/i.test(all))fail('Prohibido afirmar que TODAS las caras son <200 px');
if(/la luz cambia cuando la cara se sostiene|la foto sola pierde la cara|el mejor/i.test(all))fail('Afirmación general/prohibida');
const vozEsperada=`La cara o la escena.\nDos clips, misma foto y misma orden.\nKling 3.0 std: brillo casi igual, cara de ${f2(k.parecido[0])} a ${f2(k.parecido[1])}.\nSeedance Mini con referencias: cara a ${f2(s.parecido[1])}, pero la imagen se oscurece.\nUna toma cada uno: prueba, no regla.\nBrillo del cuadro entero: mezcla luz y encuadre.\nSeguime: cada semana, una prueba.`;
same(voz,vozEsperada,'voz y cifras');
const cr=cronograma(voz,p.voz.ultimo_tramo_cuadros);
if(cr.chars>305||cr.tramos.some(t=>!t.ultimo&&(t.hueco<0||t.hueco>0.3)))fail('Voz supera cupo o pausas');
if(cr.cuadros>480)fail('Voz no cabe en 20 s');
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
const txt=(id,text,y,size=42,extra='')=>`<div id="${id}" class="texto ${extra}" style="top:${y}px;font-size:${size}px">${e(text)}</div>`;
const video=(c,file)=>`<video id="${c.id}" class="clip media" src="assets/${file}" muted playsinline preload="auto" data-start="${Math.floor(c.a*1e6)/1e6}" data-duration="${Math.ceil((c.b-c.a)*1e6)/1e6}" data-media-start="0" data-track-index="${c.id==='m1'?0:1}"></video>`;
const rowHTML=c=>`<div class="fila texto" id="fila-${c.id}"><div>${e(c.nombre)}</div><div class="numeros">brillo ${f(c.brillo[0])} → ${f(c.brillo[1])} (${c.id==='m1'?'−1,0':'−34'})</div><div class="barra"><i style="width:${c.brillo[1]/255*100}%"></i></div><div class="numeros">parecido ${f2(c.parecido[0])} → ${f2(c.parecido[1])}</div><div class="barra cara"><i style="width:${c.parecido[1]*100}%"></i></div></div>`;
const html=`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><title>Lucía P9</title><style>${read('scripts/estilos.css')}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="20" data-width="1080" data-height="1920" data-fps="24">
${video(k,'m1.mp4')}${video(s,draft?'m4-proxy.mp4':'m4-full.mp4')}
<div id="placa" class="clip escena" data-start="11.541666" data-duration="8.458334" data-track-index="2"><div id="comparacion">${rowHTML(k)}${rowHTML(s)}</div>${txt('toma',p.textos.toma,720,44,'card nota')}${txt('brillo',p.textos.brillo,855,44,'nota')}${txt('limite-cara',p.textos.limite_cara,1040,44,'nota')}${txt('cta',p.textos.cta,1280,66,'card titular')}</div>
<div id="overlay-m1" class="clip escena transparente" data-start="0" data-duration="6" data-track-index="3">${txt('rotulo',p.textos.rotulo,300,40)}${txt('titulo',p.textos.titulo,760,66,'card titular')}${txt('dato-m1',p.textos.m1,1030,42,'card dato')}</div>
<div id="overlay-m4" class="clip escena transparente" data-start="5.75" data-duration="6.041667" data-track-index="4">${txt('dato-m4',p.textos.m4,1090,42,'card dato')}${txt('reencuadre',p.textos.reencuadre,1270,42,'dato')}</div>
</div><script src="assets-fijos/vendor/gsap.min.js"></script><script>window.PLAN=${JSON.stringify({...p,draft})};window.__timelines=window.__timelines||{};${read('scripts/timeline.js')}</script></body></html>\n`;
fs.writeFileSync(path.join(P,'index.html'),html);fs.writeFileSync(path.join(P,'qa/build-status.json'),JSON.stringify({borrador:draft,apto_master:!draft,m4:src4,voz:cr},null,2));
console.log(`OK datos/pie/voz: ${cr.chars} caracteres, cronograma ${cr.cuadros}/24 s; lienzo 480 cuadros/20 s. ${draft?'NO APTO PARA MASTER':'fuentes completas'}`);
const rp=path.join(P,'README.md');if(fs.existsSync(rp)){let r=fs.readFileSync(rp,'utf8');r=r.replace(/<!-- ESTADO -->[\s\S]*?<!-- FIN ESTADO -->/,m=>!draft&&!/BORRADOR/.test(m)?m:`<!-- ESTADO -->\n${draft?'**BORRADOR · NO APTO PARA MASTER. m4 usa proxy 360p; solo gates estáticos.**':'Fuentes completas presentes; falta render y QA del master.'}\n<!-- FIN ESTADO -->`);fs.writeFileSync(rp,r);}
