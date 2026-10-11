// P9 v3.1 (revisión 3, 11-oct-2026): plan → fuentes → validación → HTML determinista; sin red.
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
const f=n=>String(n).replace('.',','),f2=n=>n.toFixed(2).replace('.',','),f1=n=>n.toFixed(1).replace('.',','),minus=n=>String(n).replace('-','−');
const lista=(a,y)=>y&&a.length===2?`${a[0]} y ${a[1]}`:a.join(', ');
const wc=s=>s.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
const row=JSON.parse(fs.readFileSync(path.join(V4,'PROCEDENCIA.jsonl'),'utf8').split(/\r?\n/)[96]);
const datos=row.video_misma_foto_K1_misma_orden;
const luz=fs.readFileSync(path.join(PM,'medicion-luz-movimiento-20261011.txt'),'utf8');
const SR=fs.readFileSync(path.join(PM,'medicion-sin-refs-entrada-20261011.txt'),'utf8');
// Cifra retirada el 11-oct (revisión 2, hecho 4): no hay control limpio, así que ningún texto (pantalla, pie, voz) puede traer un «efecto» o «ventaja» estimados.
const RETIRADO=/efecto estimado|ventaja|dentro del ruido|≈\s*0,03/i;
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
 // H4 (revisión 2): la fila de la placa muestra la medición con un decimal (156,0 → 155,1 · 145,5 → 111,8) y SIN delta; la pastilla lleva el delta en entero (−1 · −34 = −33,7 redondeado)
 const [b0,b1,bd]=c.brillo;if(Math.abs((b1-b0)-bd)>0.11)fail(`${c.id} brillo: ${b1} − ${b0} no cuadra con el delta publicado ${bd}`);
 c.delta=Math.round(bd);if(Math.abs(bd-c.delta)>0.5)fail(`${c.id} brillo: delta entero ${c.delta} lejos de ${bd}`);
 if(c.cara_px){const m=d.nota.match(/cara de (\d+) a (\d+) px/);if(!m)fail('Falta tamaño cara en PROCEDENCIA');same(c.cara_px,m.slice(1).map(Number),'m4 cara px');}
}
const [k,s]=p.clips;
// Medición sin las fotos recibidas (11-oct-2026; método .claude/skills/lucia/scripts/parecido_sin_refs.py): tamaño de cara por punto, fotos recibidas por Seedance y PRUEBA ESTRICTA (R2, R4, R5, R8)
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
const recList=mRec[1].split(', '),rec=recList.length,tot=rec+Number(mRec[2]);
if(tot!==8)fail(`Seedance: recibidas + no recibidas = ${tot}, deben ser las 8 fotos oficiales`);
const mHead=SR.match(/dd2d7c91\): start_image K1 \(4afffb96\) \+ ([^.]*)\./);
if(!mHead||(mHead[1].match(/\b[0-9a-f]{8}\b/g)??[]).length!==3)fail('medición sin refs: Seedance debe tener 3 imágenes de referencia');
// Hechos 1-3 del 11-oct (PRUEBA ESTRICTA): ambas tomas parten de la foto de arranque K1, que se hizo con R1, R3, R6 y R7; Seedance recibió además R1 y R3 directo;
// contra el centroide de SOLO las 4 fotos que nadie recibió (R2, R4, R5, R8) el sentido de las dos tomas no cambia. No hay control limpio: no se estima ningún «efecto» ni «ventaja».
const iE=SR.indexOf('== PRUEBA ESTRICTA');if(iE<0)fail('medición sin refs: falta la sección PRUEBA ESTRICTA');
const SE=SR.slice(iE);
const mEs=SE.match(/^== PRUEBA ESTRICTA: solo las (\d+) fotos que ningún clip ni K1 recibió \(((?:R\d(?:, )?)+)\) ==/);
if(!mEs)fail('medición sin refs: la cabecera de la PRUEBA ESTRICTA no lista las fotos que nadie recibió');
const fotosE=mEs[2].split(', ');
const mK1=SE.match(/K1 \(4afffb96\) se generó con ([^;\n]+); todos los clips con start_image K1 descienden de ((?:R\d(?:, | y )?)+)/);
if(!mK1)fail('medición sin refs: falta el hecho de la foto de arranque K1 (con qué fotos oficiales se generó)');
const fotosK1=[...mK1[2].matchAll(/R\d/g)].map(m=>m[0]);
const mDir=SE.match(/Seedance\+refs recibió además (R\d) y (R\d) directo/);
if(!mDir||mDir.slice(1).join()!==recList.join())fail(`medición sin refs: Seedance debe haber recibido directo exactamente ${recList.join(' y ')}`);
if(fotosE.length!==Number(mEs[1])||new Set([...fotosE,...fotosK1]).size!==tot||fotosE.some(r=>fotosK1.includes(r)))fail('medición sin refs: las fotos de K1 y las que nadie recibió deben sumar las 8 oficiales sin repetirse');
// Revisión 3 (H5): el centroide de las 4 fotos puntúa más bajo que el de las 8 en TODOS los clips medidos (B* − A < 0 en los 41 puntos de los 6 clips), por eso el 0,72 final de Kling con las 8 fotos no es el 0,72 inicial con las 4.
const nClips=(SE.match(/\n== /g)??[]).length,dBA=[...SE.matchAll(/^\s+[\d.]+\s+\d+\s+\d\.\d{3}\s+\d\.\d{3}\s+[+-]\d\.\d{3}\s+\d\.\d{3}\s+([+-]\d\.\d{3})\s/gm)].map(m=>+m[1]);
if(nClips!==6||dBA.length!==41||!dBA.every(d=>d<0))fail(`medición sin refs: el centroide de las 4 fotos debe puntuar más bajo en los 6 clips (${nClips} clips, ${dBA.length} puntos, máximo B*−A ${Math.max(...dBA)})`);
const estr=n=>{const i=SE.indexOf('\n== '+n+'\n');if(i<0)fail(`medición sin refs (prueba estricta): falta «${n}»`);const j=SE.indexOf('\n== ',i+3);
 const r=[...SE.slice(i,j<0?SE.length:j).matchAll(/^\s+([\d.]+)\s+(\d+)\s+(\d\.\d{3})\s+(\d\.\d{3})\s+[+-]\d\.\d{3}\s+(\d\.\d{3})\s+[+-]\d\.\d{3}\s/gm)].map(m=>({t:+m[1],px:+m[2],A:+m[3],B:+m[5]}));
 if(r.length!==7)fail(`medición sin refs (prueba estricta): ${n} debe traer 7 puntos`);return [r[0],r.at(-1)]};
const [eK0,eK1]=estr('Kling 3.0 std (e470ef4f)'),[eS0,eS1]=estr('Seedance Mini + refs (dd2d7c91)');
same([round(eK0.A),round(eK1.A)],k.parecido,'prueba estricta: A de Kling contra PROCEDENCIA');same([round(eS0.A),round(eS1.A)],s.parecido,'prueba estricta: A de Seedance contra PROCEDENCIA');
const estK=[round(eK0.B),round(eK1.B)],estS=[round(eS0.B),round(eS1.B)];
same({fotos:p.prueba_estricta?.fotos,arranque_k1:p.prueba_estricta?.arranque_k1,directas_seedance:p.prueba_estricta?.directas_seedance,kling:p.prueba_estricta?.kling,seedance:p.prueba_estricta?.seedance},{fotos:fotosE,arranque_k1:fotosK1,directas_seedance:recList,kling:estK,seedance:estS},'prueba estricta del plan');
if(!(estK[1]<estK[0]&&k.parecido[1]<k.parecido[0]&&estS[1]>estS[0]&&s.parecido[1]>s.parecido[0]))fail('prueba estricta: el sentido de alguna toma cambió; el pie no puede decir «el sentido no cambia»');
// H5 (revisión 3): el pie aclara que el 0,72 de «0,79 a 0,72» (8 fotos) y el 0,72 de «0,72 a 0,67» (4 fotos) son números distintos; solo tiene sentido mientras coincidan
if(round(k.parecido[1])!==round(estK[0]))fail(`H5: el 0,72 final con las 8 fotos (${k.parecido[1]}) ya no coincide con el 0,72 inicial con las 4 (${estK[0]}): reescribir la aclaración del pie`);
// Hecho 4: la cifra de «efecto/ventaja» está retirada de TODA superficie (pantalla, pie, voz)
const pieTxt=read('pie.txt'),voz=read('guion-voz.txt');
for(const [donde,t] of [['pantalla',Object.values(p.textos).join(' ')],['pie',pieTxt],['voz',voz]])if(RETIRADO.test(t))fail(`Cifra retirada en ${donde}: no hay control limpio, no se estima ningún efecto ni ventaja (${t.match(RETIRADO)[0]})`);
const esperado={rotulo:'Lucía Antelo · personaje IA de Onia',titulo:'¿La cara o la escena?',m1:'Kling 3.0 std · brillo −1 · parecido 0,79 → 0,72',m4:'Seedance 2.0 Mini + referencias · brillo −34 · parecido 0,71 → 0,80',reencuadre:`Cara: ${s.cara_px[0]} → ${s.cara_px[1]} px del clip original · reencuadra`,aviso_refs:`Seedance recibió ${rec} de las ${tot} fotos con que se compara.`,nota_refs:`* Seedance recibió ${rec} de las ${tot} fotos con que se compara.`,toma:'Una toma cada uno: prueba, no regla.',brillo:'Brillo: cuadro entero, mezcla luz y encuadre.',limite_cara:'Cara bajo 200 px (clip original): poco confiable. Kling siempre; Seedance al inicio. Ruido ±0,03.',cta:'Seguime: cada semana, una prueba.'};
same(p.textos,esperado,'textos/cifras autorizados');
if(!p.textos.m1.includes('brillo '+minus(k.delta))||!p.textos.m4.includes('brillo '+minus(s.delta)))fail('Las pastillas deben llevar el delta de brillo en entero');
if(!/Kling siempre.*Seedance al inicio/.test(p.textos.limite_cara))fail('Límite de cara: Kling debe nombrarse (siempre = todo el clip) junto con Seedance (al inicio)');
// H1 (revisión 3): el límite de cara se comprimió de 19 a 15 palabras; sigue diciendo «clip original» y «Ruido ±0,03», y no puede volver a crecer
if(!p.textos.limite_cara.includes('(clip original)')||!p.textos.limite_cara.includes('Ruido ±0,03'))fail('H1 rev.3: el límite de cara debe conservar «(clip original)» y «Ruido ±0,03»');
if(wc(p.textos.limite_cara)>16)fail(`H1 rev.3: límite de cara de ${wc(p.textos.limite_cara)} palabras (máximo 16)`);
// H3 (revisión 3): «fotos con que se compara», nunca «con que se mide» en pantalla (el parecido se COMPARA con las fotos)
if(/con que se mide/.test(Object.values(p.textos).join(' ')))fail('H3 rev.3: «fotos con que se mide» ya no se usa en pantalla: «fotos con que se compara»');
// H1 (revisión 2): el 0,80 de Seedance lleva su asterisco en la fila de la placa y la nota del asterisco entra en la placa (junto con «fotos con que se compara»)
if(s.asterisco!==true||k.asterisco)fail('H1: solo la fila de Seedance lleva el asterisco (0,80*) y su nota en la placa');
if(wc(p.textos.aviso_refs)>13)fail('Aviso de fotos recibidas: máximo 13 palabras (4,85 s de lectura en una ventana de 5,5 s)');
const TOPE_PLACA=40; // v2: 34; pedido ≈ 36; v3: 44; v3.1: 40 = límite 15 + toma 7 + nota del asterisco 11 + brillo 7 (H1 rev.3). La exigencia real son las ventanas por texto (ventanas.mjs).
const nuevas=wc(p.textos.limite_cara)+wc(p.textos.toma)+wc(p.textos.nota_refs)+wc(p.textos.brillo);
if(nuevas>TOPE_PLACA)fail(`Lectura nueva de la placa: ${nuevas} palabras (tope ${TOPE_PLACA})`);
// H2 (revisión 3): orden de entrada en la placa nota del asterisco (con la fila) → toma → límite de cara → brillo → CTA, y la pila vertical sigue el mismo orden
const entra=sel=>{const e=p.eventos.find(e=>e.selector===sel&&e.entrada);if(!e)fail(`H2: falta la entrada de ${sel}`);return e.t};
const orden=['#nota-ast','#toma','#limite-cara','#brillo','#cta'].map(entra);
if(orden.some((t,i)=>i&&t<=orden[i-1]))fail(`H2: orden de entrada de la placa: nota del asterisco → toma → límite de cara → brillo → CTA (llegó ${orden.join(' → ')})`);
const ys=['nota_refs','toma','limite','brillo','cta'].map(n=>p.layout[n]);
if(ys.some((y,i)=>i&&y<=ys[i-1]))fail('H2: la pila vertical de la placa debe seguir el orden de entrada');
// H2 (revisión 3): el 0,80* no queda sin su nota (la nota entra con la fila, ≤ 0,2 s tras el fin del empuje) ni el 0,80 de la pastilla sin su aviso (el aviso entra con el dato, ≤ 0,2 s tras el fin del empuje a Seedance)
const tFila=p.costuras[1].t,tNota=entra('#nota-ast'),tM4=p.costuras[0].t,tAviso=entra('#aviso-refs');
if(tNota<tFila-1e-6||tNota-tFila>0.2)fail(`H2 rev.3: la nota del asterisco entra a ${tNota} s y la fila a ${tFila.toFixed(3)} s (deben coincidir, hasta 0,2 s después)`);
if(tAviso<tM4-1e-6||tAviso-tM4>0.2)fail(`H2 rev.3: el aviso de la pastilla entra a ${tAviso} s y el dato de Seedance a ${tM4} s (el 0,80 no puede quedar más de 0,2 s sin aviso)`);
if(!/#cta\{[^}]*text-wrap:\s*balance/.test(read('scripts/estilos.css')))fail('H6 rev.3: #cta debe llevar text-wrap: balance (sin «prueba.» huérfana)');
if(!p.scrim_m4||!Array.isArray(p.scrim_m4.caja)||!Array.isArray(p.scrim_m4.centro)||!Array.isArray(p.scrim_m4.radios))fail('H5: falta el scrim que tapa el letrero inventado de la torre (plan.scrim_m4)');
if(!pieTxt.startsWith('Personaje hecho con IA'))fail('Pie debe abrir con Personaje hecho con IA');
const pieFrases={
 kling:`la cara de ${k.nombre} queda bajo 200 px todo el clip; la de Seedance 2.0 Mini, solo al inicio (pasa de ${s.cara_px[0]} a ${s.cara_px[1]} px porque el encuadre se acerca)`,
 oficiales:`ArcFace contra las ${tot} fotos oficiales de Lucía, R1 a R${tot}, de 0 a 1`,
 cuentas8:`Esos números (${f2(k.parecido[0])} a ${f2(k.parecido[1])} y ${f2(s.parecido[0])} a ${f2(s.parecido[1])}) se calcularon con las ${tot} fotos.`,
 directas:`Seedance 2.0 Mini + referencias recibió como entrada ${rec} de las ${tot} fotos con que se compara el parecido (${lista(recList,true)}).`,
 k1:`Ambas tomas parten de la misma foto de arranque, que se hizo con ${fotosK1.length} de esas ${tot} (${lista(fotosK1)}), así que ninguna es independiente.`,
 estricta:`Midiendo solo con las ${fotosE.length} fotos que nadie recibió (${lista(fotosE)}), ${k.nombre} baja de ${f2(estK[0])} a ${f2(estK[1])} y Seedance sube de ${f2(estS[0])} a ${f2(estS[1])}: el sentido no cambia.`,
 escala:`Con solo ${fotosE.length} fotos el parecido sale más bajo que con las ${tot} en los seis clips que medí (estos dos y otros cuatro); por eso el ${f2(k.parecido[1])} de «${f2(k.parecido[0])} a ${f2(k.parecido[1])}» (con las ${tot}) no es el ${f2(estK[0])} de «${f2(estK[0])} a ${f2(estK[1])}» (con las ${fotosE.length}).`,
 letrero:'Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe.'};
if(!pieTxt.includes(pieFrases.kling))fail('Pie y límite de cara: Kling debe nombrarse bajo 200 px todo el clip (Seedance no puede ser el único con tamaño de cara)');
if(!pieTxt.includes(pieFrases.oficiales))fail('Pie: falta definir las 8 fotos oficiales de Lucía, R1 a R8 (H5 rev.3)');
if(!pieTxt.includes(pieFrases.cuentas8))fail('Pie: falta aclarar que 0,79 a 0,72 y 0,71 a 0,80 se calcularon con las 8 fotos (H5 rev.3)');
if(!pieTxt.includes(pieFrases.directas))fail('Pie: falta decir que Seedance recibió como entrada 2 de las 8 fotos con que se compara (R1 y R3)');
if(!pieTxt.includes(pieFrases.k1))fail('Pie: falta el hecho de la foto de arranque (K1): ambas tomas parten de ella y se hizo con 4 de las 8 fotos');
if(!pieTxt.includes(pieFrases.estricta))fail('Pie: falta la prueba estricta (solo las 4 fotos que nadie recibió) con sus cifras y «el sentido no cambia»');
if(!pieTxt.includes(pieFrases.escala))fail('Pie: falta aclarar que el centroide de 4 fotos puntúa más bajo en los seis clips (el 0,72 de las 8 fotos no es el 0,72 de las 4; H5 rev.3)');
if(!pieTxt.includes(pieFrases.letrero))fail('Pie: falta decir que el letrero de la torre es inventado');
if(/con que se mide/.test(pieTxt))fail('H3 rev.3: «fotos con que se mide» ya no se usa en el pie: «fotos con que se compara»');
if(pieTxt.length>2200)fail(`Pie de ${pieTxt.length} caracteres (tope 2.200)`);
const dif=[k,s].map(c=>f2(Math.abs(c.parecido[1]-c.parecido[0])));
const pie=`Personaje hecho con IA: Lucía Antelo, de @oniahq. Hice dos clips con la misma foto y la misma orden en Higgsfield y medí dos cosas en cada uno: cuánto cambia el brillo del cuadro (de 0 a 255) y cuánto se parece la cara a la de ella (${pieFrases.oficiales}). ${k.nombre} (${f(k.creditos)} créditos): el brillo casi no cambia (${minus(k.delta)}) y la cara baja de ${f2(k.parecido[0])} a ${f2(k.parecido[1])}. Seedance 2.0 Mini con referencias (${f(s.creditos)} créditos): la cara sube de ${f2(s.parecido[0])} a ${f2(s.parecido[1])}, pero el brillo baja ${-s.delta} puntos y el encuadre cambia. ${pieFrases.cuentas8} ${pieFrases.directas} ${pieFrases.k1} ${pieFrases.estricta} ${pieFrases.escala} ${pieFrases.letrero} Lo difuminé en el video. Una toma cada uno: es una prueba, no una regla. El brillo es el promedio del cuadro entero y mezcla luz con lo que entra al plano; el parecido es indicativo: bajo 200 px la cara es poco confiable. En el clip original (720p), ${pieFrases.kling}. El ruido es de ±0,03: las dos diferencias con las ${tot} fotos (${dif[0]} y ${dif[1]}) lo superan, pero son una toma cada una. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia`;
same(pieTxt,pie,'pie y cifras contra fuentes');
const all=Object.values(p.textos).join(' ')+' '+pie+' '+voz;
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
// Fila de resultados: brillo con un decimal (la medición, sin delta: H4 rev. 2) y parecido con 2 decimales, una barra por medida y la escala de cada barra debajo; la fila de Seedance marca su 0,80 con un asterisco (H1 rev. 2)
const ast='<b class="ast">*</b>';
const rowHTML=c=>`<div class="fila texto card" id="fila-${c.id}"><div>${e(c.nombre)}</div><div class="numeros">brillo ${f1(c.brillo[0])} ${flecha} ${f1(c.brillo[1])}</div><div class="barra"><i style="width:${c.brillo[1]/255*100}%"></i></div><div class="numeros">parecido ${f2(c.parecido[0])} ${flecha} ${f2(c.parecido[1])}${c.asterisco?ast:''}</div><div class="barra cara"><i style="width:${c.parecido[1]*100}%"></i></div><div class="escala"><b class="v">brillo 0 a 255</b> · <b class="n">parecido 0 a 1</b></div></div>`;
const sc=p.scrim_m4,[sx,sy,sw,sh]=sc.caja,[cx,cy]=sc.centro,[rx,ry]=sc.radios;
const mask=`radial-gradient(ellipse ${rx}px ${ry}px at ${cx-sx}px ${cy-sy}px,#000 0%,#000 58%,transparent 100%)`;
// Desenfoque (backdrop-filter) con máscara radial: el letrero queda como mancha borrosa y oscura, sin borde duro; viaja con #overlay-m4
const scrim=`<div id="scrim-m4" style="left:${sx}px;top:${sy}px;width:${sw}px;height:${sh}px;-webkit-backdrop-filter:blur(${sc.desenfoque_px}px) brightness(${sc.brillo});backdrop-filter:blur(${sc.desenfoque_px}px) brightness(${sc.brillo});-webkit-mask-image:${mask};mask-image:${mask}"></div>`;
// Nota del asterisco (H1 rev. 2): pie de la placa, con el asterisco naranja del 0,80; se escribe en su sitio de la pila, 38 px para que quepa en una línea
const notaAst=`<div id="nota-ast" class="texto nota" style="top:${L.nota_refs}px;font-size:${L.nota_refs_px}px">${ast} ${e(p.textos.nota_refs.replace(/^\* /,'')).replace(/de las (\d+)/,'<span class="nb">de las $1</span>')}</div>`;
// H6 (revisión 3): con text-wrap: balance el CTA solo se parte «Seguime: cada / semana, una prueba.»; «cada semana,» no se corta, así que el corte queda después de «semana,» (el texto no cambia)
const cta=txt('cta',p.textos.cta,L.cta,66,'card titular').replace('cada semana,','<span class="nb">cada semana,</span>');
if(!cta.includes('class="nb"'))fail('H6 rev.3: el CTA debe contener «cada semana,» para el corte balanceado');
const html=`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><title>Lucía P9</title><style>${read('scripts/estilos.css')}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="20" data-width="1080" data-height="1920" data-fps="24">
${video(k,'m1.mp4')}${video(s,draft?'m4-proxy.mp4':'m4-full.mp4')}
<div id="placa" class="clip escena" data-start="11.541666" data-duration="8.458334" data-track-index="2"><div id="comparacion">${rowHTML(k)}${rowHTML(s)}</div>${txt('toma',p.textos.toma,L.toma,44,'nota')}${txt('limite-cara',p.textos.limite_cara,L.limite,L.limite_px,'nota')}${notaAst}${txt('brillo',p.textos.brillo,L.brillo,44,'nota')}${cta}</div>
<div id="overlay-m1" class="clip escena transparente" data-start="0" data-duration="6" data-track-index="3">${txt('rotulo',p.textos.rotulo,300,40)}${txt('titulo',p.textos.titulo,760,66,'card titular')}${txt('dato-m1',p.textos.m1,1030,42,'card dato')}</div>
<div id="overlay-m4" class="clip escena transparente" data-start="5.75" data-duration="6.041667" data-track-index="4">${scrim}${txt('dato-m4',p.textos.m4,L.dato_m4,42,'card dato')}${txt('reencuadre',p.textos.reencuadre,L.reencuadre,42,'dato')}${txt('aviso-refs',p.textos.aviso_refs,L.aviso_refs,42,'card dato')}</div>
</div><script src="assets-fijos/vendor/gsap.min.js"></script><script>window.PLAN=${JSON.stringify({...p,draft})};window.__timelines=window.__timelines||{};${read('scripts/timeline.js')}</script></body></html>\n`;
fs.writeFileSync(path.join(P,'index.html'),html);fs.writeFileSync(path.join(P,'qa/build-status.json'),JSON.stringify({borrador:draft,apto_master:!draft,m4:src4,voz:cr},null,2));
console.log(`OK datos/pie/voz: ${cr.chars} caracteres (cupo ${p.voz.max_caracteres}), cronograma ${cr.cuadros}/24 s; lienzo 480 cuadros/20 s; fotos recibidas por Seedance ${rec} de ${tot}; prueba estricta Kling ${estK.join(' → ')} · Seedance ${estS.join(' → ')}; palabras nuevas de la placa ${nuevas}. ${draft?'NO APTO PARA MASTER':'fuentes completas'}`);
const rp=path.join(P,'README.md');if(fs.existsSync(rp)){let r=fs.readFileSync(rp,'utf8');r=r.replace(/<!-- ESTADO -->[\s\S]*?<!-- FIN ESTADO -->/,m=>!draft&&!/BORRADOR/.test(m)?m:`<!-- ESTADO -->\n${draft?'**BORRADOR · NO APTO PARA MASTER. m4 usa proxy 360p; solo gates estáticos.**':'Fuentes completas presentes; falta render y QA del master.'}\n<!-- FIN ESTADO -->`);fs.writeFileSync(rp,r);}
