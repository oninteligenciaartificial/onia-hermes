// Viernes «El error de la semana» v2 (11-oct-2026): placa simplificada por la madre marketing — una idea por vez, con una cara a la vista, sin gráfico: plan → fuentes → validación → HTML determinista; sin red.
// Dos fotos ya pagadas (K4 de Kling O1 Image y R3, la foto de entrada), 0 créditos nuevos, MUDO. Estructura y validaciones heredadas de P9 v3.1.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {cronograma} from './voz.mjs';
const P=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const R=path.resolve(P,'../..'), V4=path.join(R,'hermes-content/references/modelos/lucia/v4');
const PM=path.join(V4,'prueba-motores-20261008');
const FG=path.join(R,'videos/lucia-p9-luz-cara/qa/face-gate-v31.json'); // escala: parecido foto contra foto de las 8 oficiales (refs_internal)
const FONTS=path.join(R,'hermes-content/brand/fonts');
const p=JSON.parse(fs.readFileSync(path.join(P,'plan.json'),'utf8'));
const read=n=>fs.readFileSync(path.join(P,n),'utf8').trim();
const fail=s=>{throw Error(s)};
const same=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))fail(`${label}: ${JSON.stringify(a)} ≠ fuente ${JSON.stringify(b)}`)};
const round=n=>Math.round(n*100+1e-7)/100;
const f2=n=>n.toFixed(2).replace('.',','),f3=n=>n.toFixed(3);
const lista=(a,y)=>y&&a.length===2?`${a[0]} y ${a[1]}`:a.length>2&&y?`${a.slice(0,-1).join(', ')} y ${a.at(-1)}`:a.join(', ');
const wc=s=>s.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
// Cifra retirada el 11-oct (P9, revisión 2): no hay control limpio, así que ningún texto (pantalla, pie, voz) puede traer un «efecto» o «ventaja» estimados.
const RETIRADO=/efecto estimado|ventaja|dentro del ruido|≈\s*0,03/i;

// ── 1. Fuentes: PROCEDENCIA l.97 y la medición «sin refs de entrada» (PRUEBA ESTRICTA PARA LOS MOTORES DE IMAGEN, fila Kling O1 Image K4)
const proc=JSON.parse(fs.readFileSync(path.join(V4,'PROCEDENCIA.jsonl'),'utf8').split(/\r?\n/)[96]);
const imgs=proc.imagen_misma_escena_K1_mismas_6_refs;
const kProc=id=>{const k=Object.keys(imgs).find(k=>k.includes(id));if(!k)fail(`PROCEDENCIA l.97: falta ${id}`);return imgs[k]};
const pK4=kProc('dad464de'),pK1=kProc('c3706d45'),pK2=kProc('9f4b5172');
const SR=fs.readFileSync(path.join(PM,'medicion-sin-refs-entrada-20261011.txt'),'utf8');
const iH=SR.indexOf('== PRUEBA ESTRICTA PARA LOS MOTORES DE IMAGEN');if(iH<0)fail('medición: falta la sección PRUEBA ESTRICTA PARA LOS MOTORES DE IMAGEN');
const iT=SR.indexOf('TABLA POR IMAGEN',iH);if(iT<0)fail('medición: falta la TABLA POR IMAGEN de la prueba estricta de motores de imagen');
const iS=SR.indexOf('RESUMEN por motor',iT);if(iS<0)fail('medición: falta el RESUMEN por motor');
const TAB=SR.slice(iT,iS);
const filas=[...TAB.matchAll(/^\s+(\S.*?)\s+(\d+)\s+(\d\.\d{3})\s+(\d\.\d{3})\s+([+-]\d\.\d{3})\s+(\d\.\d{3})\s+([+-]\d\.\d{3})\s+((?:\d\.\d{3}\s+){7}\d\.\d{3})/gm)].map(m=>({motor:m[1],px:+m[2],A:+m[3],proc:+m[4],B:+m[6],dBA:+m[7],fotos:m[8].trim().split(/\s+/).map(Number)}));
if(filas.length!==10)fail(`medición: se esperaban 10 imágenes en la tabla y hay ${filas.length}`);
const fK4=filas.find(r=>r.motor==='Kling O1 Image K4');if(!fK4)fail('medición: falta la fila «Kling O1 Image K4»');
const fotoN=['R1','R2','R3','R4','R5','R6','R7','R8'];
const porFoto=Object.fromEntries(fotoN.map((n,i)=>[n,fK4.fotos[i]]));
// 1a. el promedio de las 8 de la medición es el de PROCEDENCIA (0,831 → «0,83») y el costo el de PROCEDENCIA (0,5 cr)
if(Math.abs(fK4.A-pK4.id)>0.0011)fail(`medición: A de Kling O1 Image K4 (${fK4.A}) ≠ PROCEDENCIA (${pK4.id})`);
// 1b. cifras del plan contra la fuente
const D=p.datos;
same({promedio8:D.promedio8,por_foto:D.por_foto,sin_recibidas_4:D.sin_recibidas_4,creditos:D.creditos,cara_px:D.cara_px},{promedio8:pK4.id,por_foto:porFoto,sin_recibidas_4:fK4.B,creditos:pK4.cr,cara_px:fK4.px},'datos del plan contra PROCEDENCIA l.97 y la medición');
same(D.otras_escenas,{K1:pK1.id,K2cafe:pK2.id},'otras escenas del mismo motor (PROCEDENCIA l.97)');
if(!/perdio la cara/.test(pK2.nota??''))fail('PROCEDENCIA l.97: la K2 café del mismo motor debe decir que perdió la cara');
if(D.piso!==0.7)fail('el piso de identidad es 0,70');
// 1c. qué recibió la imagen: R1, R3, R6 y R7 (están entre las 8); R2, R4, R5 y R8 no los recibió ningún motor
const iA=SR.indexOf('ADVERTENCIA DE ENTRADAS',iH);if(iA<0)fail('medición: falta la ADVERTENCIA DE ENTRADAS');
const ADV=SR.slice(iA,SR.indexOf('# MÉTODO',iA)>0?SR.indexOf('# MÉTODO',iA):iA+1400);
const recibidas=[...ADV.matchAll(/\bR(\d) \([0-9a-f]{8}\)/g)].map(m=>'R'+m[1]);
const mNo=ADV.match(/Las únicas (\d+) fotos que ningún motor recibió son ((?:R\d(?:, | y )?)+)/);
if(!mNo)fail('medición: la advertencia no lista las fotos que ningún motor recibió');
const noRecibidas=[...mNo[2].matchAll(/R\d/g)].map(m=>m[0]);
if(!/LAS MISMAS seis imágenes/.test(ADV)||!/688d63a7/.test(ADV)||!/abe2e6bd/.test(ADV)||!/no es de las 8/.test(ADV))fail('medición: faltan las seis entradas (selfie y referencia de ropa que no son de las 8)');
same(D.recibidas,recibidas,'fotos recibidas (plan contra la advertencia de entradas)');same(D.no_recibidas,noRecibidas,'fotos que nadie recibió');
if(new Set([...recibidas,...noRecibidas]).size!==8)fail('recibidas + no recibidas deben sumar las 8 fotos oficiales sin repetirse');
// 1d. la historia: R3 es la foto más cercana y no hay otra comparación como esa en las 80
const otras7=fotoN.filter(n=>n!==D.foto_copiada).map(n=>porFoto[n]);
const top=Math.max(...otras7),bot=Math.min(...otras7),r3=porFoto[D.foto_copiada];
if(D.foto_copiada!=='R3'||!(r3>top))fail(`R3 (${r3}) debe ser la foto con mayor parecido (las otras siete llegan a ${top})`);
const todas=filas.flatMap(r=>r.fotos.map((v,i)=>({motor:r.motor,foto:fotoN[i],v}))).sort((a,b)=>b.v-a.v);
if(todas.length!==80||todas[0].motor!=='Kling O1 Image K4'||todas[0].foto!=='R3')fail('medición: la comparación más alta de las 80 debe ser Kling O1 Image K4 con R3');
const siguiente=todas[1].v;
if(!filas.every(r=>r.dBA<0))fail('medición: el promedio de 4 fotos debe puntuar más bajo que el de 8 en las 10 imágenes (B*−A < 0)');
const bajaMin=Math.min(...filas.map(r=>-r.dBA)),bajaMax=Math.max(...filas.map(r=>-r.dBA));
if(Math.abs((fK4.B-fK4.A)-fK4.dBA)>0.0011)fail('medición: B* − A de K4 no cuadra');
if(!(fK4.B>=D.piso))fail('K4 sin las fotos recibidas debe seguir sobre el piso 0,70 (el pie dice «sigue sobre el piso»)');
if(fK4.px<200)fail('la cara de K4 debe medir 200 px o más para que el número sea confiable');
// 1f. escala de las fotos oficiales entre sí (revisión 1, H1): cada cifra sale de refs_internal de face-gate-v31.json, no de la memoria
const fgj=JSON.parse(fs.readFileSync(FG,'utf8')).refs_internal,fgK=Object.keys(fgj.matrix);
if(fgK.length!==8||!fotoN.every((n,i)=>fgK[i].startsWith(n+'_')))fail('face-gate-v31.json: la matriz debe traer R1 a R8 en orden');
const pares=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++){const a=fgj.matrix[fgK[i]][fgK[j]],b=fgj.matrix[fgK[j]][fgK[i]];if(Math.abs(a-b)>1e-9)fail(`face-gate-v31.json: la matriz no es simétrica en ${fotoN[i]}-${fotoN[j]}`);pares.push(a)}
const fuera=Math.max(...fgK.flatMap(a=>fgK.filter(b=>b!==a).map(b=>fgj.matrix[a][b])));
const pwMin=Math.min(...pares),pwMax=Math.max(...pares),pwMed=pares.reduce((x,y)=>x+y,0)/pares.length;
if(Math.abs(pwMin-fgj.pairwise_min)>1e-9||Math.abs(pwMax-fuera)>1e-9||Math.abs(pwMed-fgj.pairwise_mean)>0.0011)fail('face-gate-v31.json: pairwise_min / pairwise_mean / máximo fuera de la diagonal no cuadran con la matriz');
same(D.pares_oficiales,{fuente:D.pares_oficiales?.fuente,n:pares.length,min:fgj.pairwise_min,max:fuera,media:fgj.pairwise_mean},'escala de las fotos oficiales entre sí (plan contra face-gate-v31.json)');
if(!(r3>pwMax+0.1))fail(`R3 (${r3}) debe quedar muy por encima de cualquier pareja de fotos oficiales (máximo ${pwMax})`);
if(bot<pwMin||top-pwMax>0.03)fail(`las otras siete (${bot} a ${top}) deben quedar en el rango de las parejas oficiales (${pwMin} a ${pwMax}; ±0,03)`);
// 1e. las fotos: existen, tienen el SHA y el tamaño del plan (los PNG originales no van a git; se recuperan a 0 cr con job_display)
const fotosOk={};
for(const [k,f] of Object.entries(p.fotos)){
 const src=path.join(R,f.origen);if(!fs.existsSync(src))fail(`Falta ${k}: ${src}`);
 if(sha(src)!==f.sha256)fail(`${k}: SHA-256 de ${f.origen} ≠ ${f.sha256}`);
 const b=fs.readFileSync(src);if(b.readUInt32BE(16)!==f.ancho||b.readUInt32BE(20)!==f.alto)fail(`${k}: tamaño del PNG ≠ ${f.ancho}×${f.alto}`);
 fotosOk[k]=src;
}
// ── 2. Textos de pantalla: deben salir de las cifras (no se escriben a mano) ─────────────────────────────────────────────────────────────────────────────
const A=round(D.promedio8),r3n=round(r3),Bn=round(fK4.B),pisoN=round(D.piso);
const otras7n=fotoN.length-1;
const esperado={rotulo:'Lucía Antelo · personaje IA de Onia',titulo:`Casi publico este ${f2(A)}.`,dato:`Kling O1 Image · parecido ${f2(A)}`,cap_k4:'Kling O1 Image',cap_k4b:'una sola toma.',cap_r3:'Mirá una foto suya que recibió.',tile2:'Misma pose, ventana, taza.',
 beat_a:`Con esa foto: ${f2(r3n)}`,beat_b:`Con sus otras ${otras7n} fotos: ${f2(round(bot))}–${f2(round(top))}`,beat_c:'Casi copia: no prueba identidad.',cta:'Seguime: cada semana, una prueba.'};
same(p.textos,esperado,'textos/cifras autorizados');
const T=p.textos;
if(RETIRADO.test(Object.values(T).join(' ')))fail(`Cifra retirada en pantalla: ${Object.values(T).join(' ').match(RETIRADO)[0]}`);
if(/el mejor|garantiz|Sergio Urcullo|odont[oó]loga|mis pacientes|muy pronto|pr[oó]ximamente/i.test(Object.values(T).join(' ')))fail('Frase prohibida en pantalla');
if(!/^Casi copia: no prueba identidad\.$/.test(T.beat_c))fail('El beat C debe decir «Casi copia: no prueba identidad.» (no «Casi copia ≠ misma persona» ni «era copia, no identidad»: afirmarían que la imagen NO es ella y lo medido no lo sostiene: sin las 4 fotos recibidas sigue en 0,74 y las otras siete caen en el rango de fotos reales entre sí)');
// v2: no hay gráfico. El promedio de las 4, el piso 0,70, la banda de las fotos oficiales, las barras y los puntos viven SOLO en el pie.
for(const k of ['piso_en','barras','puntos','leyenda_oficiales'])if(k in p||k in p.textos)fail(`Ya no hay gráfico: «${k}» no puede volver al plan (vive solo en el pie)`);
if(/promedio|piso|oficiales|leyenda|gr[aá]fico|barra|banda/i.test(Object.values(T).join(' ')))fail(`Pantalla: «${Object.values(T).join(' ').match(/promedio|piso|oficiales|leyenda|gr[aá]fico|barra|banda/i)[0]}» vive solo en el pie (ya no hay gráfico)`);
// Cada beat: una sola idea («etiqueta: afirmación»), ≤ 6 palabras con el contador del repo (numerales cuentan), y un solo dato visible
for(const k of ['beat_a','beat_b','beat_c']){const t=T[k];if(wc(t)>6)fail(`${k}: ${wc(t)} palabras (máximo 6 por beat)`);if((t.match(/:/g)||[]).length!==1)fail(`${k}: debe tener una sola idea «etiqueta: afirmación»`)}
if(!/^[^:]+: \d,\d\d$/.test(T.beat_a)||!/^[^:]+: \d,\d\d–\d,\d\d$/.test(T.beat_b))fail('Los beats A y B llevan un solo dato: «Con esa foto: 0,93» y «Con las otras 7: 0,56–0,73» (el rango es una sola afirmación)');
if(wc(T.titulo)<3||wc(T.titulo)>7)fail('El título debe tener de 3 a 7 palabras');
// ── 3. Pie: sale de las cifras, abre con la declaración de IA y se compara con pie.txt ─────────────────────────────────────────────────────────────────────
const pieTxt=read('pie.txt'),voz=read('guion-voz.txt');
const pF={
 ia:'Personaje hecho con IA: Lucía Antelo, de @oniahq.',
 historia:`El error de la semana: casi publico este ${f2(A)} como un buen resultado de Kling O1 Image (Higgsfield, ${String(D.creditos).replace('.',',')} créditos).`,
 copia:`Pero es casi una copia de la ${D.foto_copiada}, una foto que recibió como entrada: misma pose (cabeza en la mano), ventana, laptop y taza de barro, con otra ropa y una taza blanca de más al frente; no es pixel a pixel.`,
 nocopia:'Una casi copia no prueba que el motor conserve la identidad.',
 unaescena:'Una escena, una toma: es una prueba, no una regla.',
 oficiales:`El ${f2(A)} es el parecido de ArcFace contra la cara promedio de las ${fotoN.length} fotos oficiales de Lucía (R1 a R${fotoN.length}, de 0 a 1).`,
 porfoto:`Foto por foto: con la ${D.foto_copiada} sola da ${f2(r3n)} y con las otras siete, de ${f2(round(bot))} a ${f2(round(top))} (${fotoN.filter(n=>n!==D.foto_copiada).map(n=>`${n} ${f2(round(porFoto[n]))}`).join(' · ')}); de las ${todas.length} comparaciones por foto en las ${filas.length} imágenes de la prueba, la siguiente más alta es ${f2(round(siguiente))}.`,
 escala:`Para tener escala: entre las propias fotos oficiales de Lucía, de a dos, el parecido va de ${f2(round(pwMin))} a ${f2(round(pwMax))} (promedio ${f2(round(pwMed))}; ninguna de las ${pares.length} parejas pasa de ${f2(round(pwMax))}). El ${f2(round(bot))} a ${f2(round(top))} de esta imagen con las otras siete es casi ese mismo rango; el ${f2(r3n)} con la ${D.foto_copiada}, no.`,
 entradas:`Kling O1 Image recibió seis imágenes como entrada: ${lista(recibidas,true)} (cuatro de las 8 con que se compara), una selfie y una referencia de ropa; por eso el ${f2(A)} sale inflado, y no hay un control sin entradas para decir cuánto.`,
 estricta:`Sin esas ${recibidas.length} fotos baja a ${f2(Bn)}: es el parecido con la cara promedio de solo las ${noRecibidas.length} que ningún motor recibió (${lista(noRecibidas)}), no la media de sus cifras, y sigue sobre el piso de ${f2(pisoN)}. Con solo ${noRecibidas.length} fotos todas las imágenes de la prueba bajan de ${f2(round(bajaMin))} a ${f2(round(bajaMax))} (esta, ${f2(round(-fK4.dBA))}), así que esa baja no mide por sí sola cuánto es fuga.`,
 piso:`El piso de ${f2(pisoN)} lo elegí yo y es de la cara promedio de las ${fotoN.length} fotos; no se aplica a una sola foto.`,
 otras:`El mismo motor dio ${f2(round(D.otras_escenas.K1))} en otra escena y ${f2(round(D.otras_escenas.K2cafe))} en una tercera, donde perdió la cara.`,
 ruido:'Ruido de ±0,03.',
 cara:`La cara mide ${D.cara_px} px en la imagen original (bajo 200 px sería poco fiable).`,
 leccion:'Lección: mirá el parecido foto por foto, no solo el promedio.',
 nombro:'Nombro lo que uso; no es una recomendación pagada.',
 cierre:'Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia'};
const pie=[pF.ia,pF.historia,pF.copia,pF.nocopia,pF.unaescena,pF.oficiales,pF.porfoto,pF.escala,pF.piso,pF.entradas,pF.estricta,pF.otras,pF.ruido,pF.cara,pF.leccion,pF.nombro,pF.cierre].join(' ');
if(process.argv.includes('--escribir-pie'))fs.writeFileSync(path.join(P,'pie.txt'),pie);
if(!pieTxt.startsWith(pF.ia))fail('Pie debe abrir EXACTAMENTE con «Personaje hecho con IA: Lucía Antelo, de @oniahq.»');
const PIE_FRASES=[['historia','falta la historia: casi publico este 0,83 como un buen resultado de Kling O1 Image'],['copia','falta decir que la imagen es casi una copia de R3 (misma pose, ventana, laptop y taza de barro, con otra ropa y la taza blanca de más; no pixel a pixel)'],['nocopia','falta decir que una casi copia no prueba identidad'],
 ['unaescena','falta «Una escena, una toma: es una prueba, no una regla.»'],['oficiales','faltan las 8 fotos oficiales (R1 a R8) y que el 0,83 es contra su promedio'],
 ['porfoto','falta el parecido foto por foto (R3 0,93 y las otras siete con sus cifras)'],['escala','falta la escala de las fotos oficiales entre sí (0,51 a 0,72, promedio 0,64)'],['entradas','falta decir que recibió R1, R3, R6 y R7 (por eso el 0,83 sale inflado)'],
 ['estricta','falta «Sin esas 4 fotos baja a 0,74» (igual que C2) con su aclaración'],['piso','falta definir el piso de 0,70 (lo elegí yo; es de la cara promedio de las 8; no se aplica a una sola foto) ANTES de usarlo'],
 ['otras','faltan las otras dos escenas del mismo motor (0,79 y 0,35: perdió la cara)'],['ruido','falta el ruido de ±0,03'],['cara','falta el tamaño de la cara (677 px)'],['leccion','falta la lección'],
 ['nombro','falta «Nombro lo que uso; no es una recomendación pagada.»'],['cierre','falta el cierre «Cada semana hago una prueba. Seguime.» con los hashtags']];
for(const [k,msg] of PIE_FRASES)if(!pieTxt.includes(pF[k]))fail(`Pie: ${msg}`);
same(pieTxt,pie,'pie y cifras contra fuentes');
if(pieTxt.indexOf(pF.unaescena)+pF.unaescena.length>520)fail(`Pie: «Una escena, una toma» debe quedar en los primeros ~500 caracteres (termina en ${pieTxt.indexOf(pF.unaescena)+pF.unaescena.length})`);
if(pieTxt.length>2200)fail(`Pie de ${pieTxt.length} caracteres (tope 2.200)`);
// el piso se DEFINE donde se nombra por primera vez (revisión 2, B4): ninguna mención de «piso» antes de su definición
if(pieTxt.indexOf('piso')!==pieTxt.indexOf(pF.piso)+pF.piso.indexOf('piso'))fail(`Pie: «piso» se nombra (carácter ${pieTxt.indexOf('piso')}) antes de definirlo (carácter ${pieTxt.indexOf(pF.piso)}): la definición va en la primera mención`);
if(/gr[aá]fico|barra|banda|leyenda|en pantalla/i.test(pieTxt))fail(`Pie: «${pieTxt.match(/gr[aá]fico|barra|banda|leyenda|en pantalla/i)[0]}»: ya no hay gráfico en el video (v2); el pie no lo menciona`);
if(RETIRADO.test(pieTxt)||RETIRADO.test(voz))fail('Cifra retirada en el pie o la voz (no hay control limpio: no se estima ningún efecto ni ventaja)');
if(/el mejor|garantiz|Sergio Urcullo/i.test(pieTxt+voz))fail('Frase prohibida en pie o voz');
// ── 4. Voz: no habla cifras, cabe en 360 cuadros y cada entrada cae con su línea ──────────────────────────────────────────────────────────────────────────
const vozEsperada=['Casi publico esta imagen.','Parecido alto.','Mirá una foto suya.','Misma pose, ventana y taza.','Con esa foto, sale más alto.','Con las otras siete, baja el parecido.','Casi copia: no prueba identidad.','Seguime: cada semana, una prueba.'].join('\n');
if(/\d/.test(voz))fail('voz: las cifras y los decimales no se hablan (están en pantalla)');
same(voz,vozEsperada,'voz y cifras');
const cr=cronograma(voz,p.voz.ultimo_tramo_cuadros);
if(cr.chars>p.voz.max_caracteres||cr.tramos.some(t=>!t.ultimo&&(t.hueco<0||t.hueco>0.3)))fail('Voz supera cupo o pausas');
if(cr.cuadros!==p.lienzo.cuadros)fail(`Voz: el cronograma da ${cr.cuadros} cuadros y la pieza tiene ${p.lienzo.cuadros}`);
if(cr.chars>255)fail(`Voz: ${cr.chars} caracteres; a 17 car/s la pieza de 15 s admite ≈ 255`);
const Ln=n=>cr.tramos[n-1];
for(const ev of p.eventos)if(ev.voz){const d=ev.t-Ln(ev.voz).a;if(d<-0.05||d>0.5)fail(`voz: ${ev.selector} entra a ${ev.t} s y su línea ${ev.voz} empieza a ${Ln(ev.voz).a.toFixed(2)} s (deben coincidir a ±0,5 s)`)}
const lastL=cr.tramos.at(-1),colaCta=p.lienzo.duracion-lastL.a;
if(colaCta<2.4)fail(`CTA: ${colaCta.toFixed(3)} s de exposición con la voz; mínimo 2,4 s`);
// ── 5. Eventos, orden de los beats, tipografía, zona segura y lienzo ──────────────────────────────────────────────────────────────────────────────────────
const entra=sel=>{const e=p.eventos.find(e=>e.selector===sel&&e.entrada);if(!e)fail(`falta la entrada de ${sel}`);return e.t};
const sale=sel=>{const e=p.eventos.find(e=>e.selector===sel&&e.salida);if(!e)fail(`falta la salida de ${sel}`);return e.t};
const tDato=entra('#dato'),tCta=entra('#cta');
if(tDato>=3)fail(`El primer número («parecido 0,83») debe estar antes de 3 s (entra a ${tDato} s)`);
if(p.lienzo.cuadros!==360||p.lienzo.fps!==24||p.empuje.cuadros!==6||p.lienzo.duracion!==15)fail('Lienzo/costuras fuera de contrato (360 cuadros, 24 fps, 15 s, empuje de 6 cuadros)');
const FR=1/24,PUSH=p.empuje.cuadros/24,T1=p.costuras[0].t,T2=p.costuras[1].t;
const ordenEsc2=['#cap-r3','#tile2'].map(entra);if(ordenEsc2.some((t,i)=>i&&t<=ordenEsc2[i-1]))fail('orden de entrada de la escena 2: «mirá la foto» → «misma pose, ventana, taza»');
// Beats (v2): A «con esa foto» (escena 2, sobre las dos caras) → B «con las otras 7» (llega con la escena 3, K4 a pantalla completa) → C «casi copia» → CTA. Un solo beat por vez.
const tA=entra('#beat-a'),tC=entra('#beat-c'),evB=p.eventos.find(e=>e.selector==='#beat-b'&&!e.entrada&&!e.salida&&e.voz);
if(!evB||evB.t!==T2)fail('el beat B llega con la escena 3: debe tener su evento (con voz) en el mismo instante que el segundo empuje');
if(!(tA<T2-PUSH&&T2<tC&&tC<tCta))fail(`orden de los beats: A (${tA} s) antes del segundo empuje (${T2-PUSH} s) → B llega a ${T2} s → C (${tC} s) → CTA (${tCta} s)`);
for(const [salida,entrada,que] of [[['#cap-k4','#cap-r3','#tile2'].map(sale),tA,'los textos de la escena 2 ceden el lugar al beat A'],[[sale('#beat-b')],tC,'el beat B cede el lugar al beat C'],[[sale('#beat-c')],tCta,'el beat C cede el lugar al CTA']])
 for(const t of salida){const d=Math.round((entrada-t)/FR);if(d<1||d>2)fail(`una idea por vez: ${que} (la salida debe empezar 1 o 2 cuadros ANTES de la entrada; hay ${d})`)}
if(p.lienzo.duracion-tCta<2.4-1e-9)fail(`CTA: entra a ${tCta} s y queda ${(p.lienzo.duracion-tCta).toFixed(3)} s en pantalla; mínimo 2,4 s`);
for(const c of p.costuras)if(Math.abs(c.t*24-Math.round(c.t*24))>1e-9)fail(`la costura ${c.t} no cae en un cuadro`);
for(const e of p.eventos)if(Math.abs(e.t*24-Math.round(e.t*24))>1e-9)fail(`el evento ${e.selector} a ${e.t} s no cae en un cuadro`);
{let prev=0,max=0;for(const e of [...p.eventos].sort((a,b)=>a.t-b.t)){max=Math.max(max,e.t-prev);prev=e.t}max=Math.max(max,p.lienzo.duracion-prev);if(max>2+1e-6)fail(`hueco entre eventos de ${max.toFixed(3)} s (máximo 2,0 s)`)}
same(p.escenas.map(e=>[e.id,e.a,e.b]),[['s1',0,T1],['s2',T1-PUSH,T2],['s3',T2-PUSH,p.lienzo.duracion]],'escenas contra costuras (cada escena arranca en T−6 cuadros y la saliente dura hasta T)');
same(p.escenas.map(e=>e.fotos),[['k4'],['k4','r3'],['k4']],'fotos por escena (K4 a pantalla completa · K4|R3 lado a lado · K4 a pantalla completa): la cara de Lucía está a la vista en toda la pieza, no un fondo negro');
// Tipografía (v2): nada bajo 40 px; rótulo, título y dato ≥ 44; subtítulos de la escena 2, beats y CTA ≥ 48 (la etiqueta del beat ≥ 56, que cabe)
const L=p.layout,TY=p.tipografia;
for(const [k,min] of Object.entries({rotulo_px:TY.general,titulo_px:TY.general,dato_px:TY.general,cap_px:TY.grandes,tile2_px:TY.grandes,beat_px:56,beat_c_px:56,cta_px:56})){
 if(!(L[k]>=TY.absoluto))fail(`${k}: ${L[k]} px; nunca bajo ${TY.absoluto} px`);
 if(!(L[k]>=min))fail(`${k}: ${L[k]} px; mínimo ${min} px a 1080 de ancho (texto < 48 px: no se lee en el celular)`)}
for(const [id,v] of Object.entries({rotulo:L.rotulo,titulo:L.titulo,dato:L.dato,cap:L.cap,tile2:L.tile2,beat:L.beat,cta:L.cta}))if(v<292||v>1490)fail(`${id}: y ${v} fuera de la zona segura 292-1490`);
if(!/#cta\{[^}]*text-wrap:\s*balance/.test(read('scripts/estilos.css')))fail('#cta debe llevar text-wrap: balance (sin «prueba.» huérfana)');
// ── 6. Geometría: encuadre de cada foto, caras y aros llevados al lienzo ────────────────────────────────────────────────────────────────────────────────────
const PN=p.paneles,sK=PN.w/p.fotos.k4.ancho,sR=PN.h/p.fotos.r3.alto;
// Las fotos se colocan con ancho y alto ENTEROS (el panel de K4 de 540x956, el de R3 de 657x880): así el cuadro del master se compara pixel a pixel con la foto escalada por ffmpeg (psnr-fotos)
const geo={k4:{s:sK,w:PN.w,h:Math.round(p.fotos.k4.alto*sK),left:-PN.k4.ox,x0:0},r3:{s:sR,w:Math.round(p.fotos.r3.ancho*sR),h:PN.h,left:-PN.r3.ox,x0:PN.w}};
if(PN.k4.ajuste!=='ancho'||PN.r3.ajuste!=='alto')fail('encuadre de los paneles: K4 ajustada al ancho y R3 al alto');
if(geo.k4.h<PN.h)fail('el panel de K4 es más alto que la foto');if(geo.r3.w-PN.r3.ox<PN.w)fail('el panel de R3 no alcanza a cubrir su ancho (reducir ox)');
const sCover=Math.max(p.lienzo.w/p.fotos.k4.ancho,p.lienzo.h/p.fotos.k4.alto),dxCover=(p.fotos.k4.ancho*sCover-p.lienzo.w)/2,dyCover=(p.fotos.k4.alto*sCover-p.lienzo.h)/2;
const carasPath=path.join(P,'qa/caras-fotos.json');if(!fs.existsSync(carasPath))fail('Falta qa/caras-fotos.json: correr scripts/caras-fotos.py (venv del face-gate)');
const caras=JSON.parse(fs.readFileSync(carasPath,'utf8')).fotos;
if(caras.k4.cara_px!==D.cara_px)fail(`cara de K4: ${caras.k4.cara_px} px medidos ≠ ${D.cara_px} de la medición publicada`);
const R1=n=>Math.round(n*10)/10;
const cajaCover=caras.k4.caja.map((v,i)=>R1(i%2?v*sCover-dyCover:v*sCover-dxCover));
const cajasPanel=[caras.k4.caja.map((v,i)=>R1(i%2?v*geo.k4.s+PN.y:v*geo.k4.s+geo.k4.left+geo.k4.x0)),caras.r3.caja.map((v,i)=>R1(i%2?v*geo.r3.s+PN.y:v*geo.r3.s+geo.r3.left+geo.r3.x0))];
const caraLienzo=Object.fromEntries(p.escenas.map(sc=>[sc.id,sc.fotos.length===0?[]:sc.fotos.length===1?[cajaCover]:cajasPanel]));
for(const b of cajasPanel){if(b[0]<0||b[2]>1080||b[1]<PN.y||b[3]>PN.y+PN.h)fail('la cara de un panel queda cortada por el encuadre')}
// v2: la cara de Lucía a la vista MÁS DE LA MITAD del tiempo (muestreo cada 0,5 s, cara ≥ 200 px en el lienzo; objetivo ≥ 85 %). Predicción del plan: una escena cuenta cuando está en reposo (fuera de los empujes);
// el gate cara-visible.mjs lo MIDE después en el master con SCRFD.
const CV=p.cara_visible,caraFraccion=(()=>{const N=Math.floor(p.lienzo.duracion/CV.muestreo+1e-9),reposo=[[0,T1-PUSH,'s1'],[T1,T2-PUSH,'s2'],[T2,p.lienzo.duracion,'s3']];let con=0;
 for(let k=0;k<N;k++){const t=k*CV.muestreo,r=reposo.find(([a,b])=>t>=a-1e-9&&t<=b+1e-9);if(r&&(caraLienzo[r[2]]??[]).some(c=>c[2]-c[0]>=CV.min_px))con++}return {con,N,f:con/N}})();
if(!(caraFraccion.f>CV.minimo))fail(`Cara visible ${caraFraccion.con}/${caraFraccion.N} muestras (${(caraFraccion.f*100).toFixed(0)} %): debe ser MÁS de la mitad del tiempo (mínimo ${CV.minimo*100} %)`);
if(caraFraccion.f<CV.objetivo)fail(`Cara visible ${caraFraccion.con}/${caraFraccion.N} muestras (${(caraFraccion.f*100).toFixed(0)} %): el objetivo es ≥ ${CV.objetivo*100} %`);
const aroBox=(a,foto)=>{const g=geo[foto],q=a[foto],X=v=>R1(v*g.s+g.left),Y=v=>R1(v*g.s);return q.tipo==='elipse'?[X(q.cx-q.rx),Y(q.cy-q.ry),X(q.cx+q.rx),Y(q.cy+q.ry)]:[X(q.x),Y(q.y),X(q.x+q.w),Y(q.y+q.h)]};
const aroSvg=(a,foto)=>{const g=geo[foto],q=a[foto],px=v=>R1(v*g.s),X=v=>R1(v*g.s+g.left),Y=v=>R1(v*g.s);
 const id=`aro-${a.id}-${foto}`,ds=`pathLength="${p.aro_len}"`;
 const shape=q.tipo==='elipse'?`<ellipse id="${id}" cx="${X(q.cx)}" cy="${Y(q.cy)}" rx="${px(q.rx)}" ry="${px(q.ry)}" ${ds}/>`:`<rect id="${id}" x="${X(q.x)}" y="${Y(q.y)}" width="${px(q.w)}" height="${px(q.h)}" rx="14" ${ds}/>`;
 const box=aroBox(a,foto);
 if(box[0]<2||box[1]<2||box[2]>PN.w-2||box[3]>PN.h-2)fail(`aro ${id} sale del panel (${box.join(', ')}): ajustar plan.aros`);return shape};
for(const a of p.aros)for(const f of ['k4','r3'])aroSvg(a,f); // valida cada aro contra su panel antes de escribir nada
// Revisión 2 (B2): el aro de «pose» rodea la MANO y el PELO, no la mandíbula: chico (≤ 130×150 px en el panel), sin cubrir la zona de la mandíbula de la cara detectada (mitad derecha y cuarto inferior de su caja) y a ≥ 8 px del aro de la taza
{const pose=p.aros.find(a=>a.id==='pose'),taza=p.aros.find(a=>a.id==='taza');
 for(const [foto,i] of [['k4',0],['r3',1]]){const b=aroBox(pose,foto),t=aroBox(taza,foto),c=cajasPanel[i].map((v,k)=>k%2?v-PN.y:v-geo[foto].x0),w=b[2]-b[0],h=b[3]-b[1];
  if(w>130||h>150)fail(`aro de pose en ${foto}: ${Math.round(w)}×${Math.round(h)} px; debe ser chico (≤ 130×150) y rodear la mano y el pelo, no media cara`);
  const mandibula=[(c[0]+c[2])/2,c[3]-(c[3]-c[1])/4,c[2],c[3]];
  if(b[0]<mandibula[2]&&b[2]>mandibula[0]&&b[1]<mandibula[3]&&b[3]>mandibula[1])fail(`aro de pose en ${foto}: toca la mandíbula (zona ${mandibula.map(Math.round).join(', ')}); debe quedar hacia la mano y el pelo`);
  if(!(b[2]+8<=t[0]||b[0]>=t[2]+8||b[3]+8<=t[1]||b[1]>=t[3]+8))fail(`aro de pose en ${foto}: toca el aro de la taza (a menos de 8 px)`)}}
// H5 (revisión 1): los aros se DIBUJAN (no aparecen en 2 cuadros) y cada uno queda a la vista ≥ 1 s antes del empuje a la placa
{const ARO=p.aro_len,finEscena=p.costuras[1].t-p.empuje.cuadros/24;if(ARO!==1000)fail('aro_len debe ser 1000 (GSAP redondea strokeDashoffset a enteros: con pathLength=1 el trazo saltaba de 1 a 0 en 2 cuadros)');
 for(const a of p.aros){const ev=p.eventos.find(e=>e.selector===`#aro-${a.id}-k4,#aro-${a.id}-r3`&&e.aro);if(!ev)fail(`falta el evento del aro ${a.id}`);
  if(ev.t!==a.t||ev.dur!==a.dibujo)fail(`aro ${a.id}: plan.aros (${a.t} s, ${a.dibujo} s) ≠ su evento (${ev.t} s, ${ev.dur} s)`);
  if(a.dibujo<0.5)fail(`aro ${a.id}: se dibuja en ${a.dibujo} s (mínimo 0,5 s: tiene que verse trazar)`);
  if(finEscena-a.t<1)fail(`aro ${a.id}: queda a la vista ${(finEscena-a.t).toFixed(3)} s antes del empuje (mínimo 1 s)`);
  if(a.t+a.dibujo>finEscena)fail(`aro ${a.id}: termina de dibujarse después del empuje`)}
 if(p.aros.some((a,i)=>i&&a.t<=p.aros[i-1].t))fail('los aros entran en orden: pose → ventana → taza (como lo dice el texto)')}
// ── 7. Salida: copiar fuentes locales y fotos (se ignoran en git), construir el HTML ──────────────────────────────────────────────────────────────────────────
fs.mkdirSync(path.join(P,'assets/fonts'),{recursive:true});fs.mkdirSync(path.join(P,'qa'),{recursive:true});
for(const name of ['BricolageGrotesque-var-latin.woff2','DMSans-var-latin.woff2']){
 const source=path.join(FONTS,name),dest=path.join(P,'assets/fonts',name);
 if(!fs.existsSync(source))fail(`Falta fuente local de marca ${source}; no se descarga.`);
 fs.copyFileSync(source,dest);
}
// K4 se usa tres veces (pantalla completa de la escena 1, panel de la escena 2 y pantalla completa de la escena 3): cada uso lleva su propio nombre, enlace al mismo archivo, para que HyperFrames no marque <img> iguales (duplicate_media_discovery_risk)
const K4S3='assets/k4-s3.png';
for(const [k,f,dest] of [['k4',p.fotos.k4,p.fotos.k4.archivo],['k4',p.fotos.k4,'assets/k4-panel.png'],['k4',p.fotos.k4,K4S3],['r3',p.fotos.r3,p.fotos.r3.archivo]]){const out=path.join(P,dest);if(!fs.existsSync(out)||sha(out)!==f.sha256){try{if(fs.existsSync(out))fs.unlinkSync(out);fs.linkSync(fotosOk[k],out)}catch{fs.copyFileSync(fotosOk[k],out)}}}
const e=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const tiles=[],ocultos=[];
const entradas=new Set(p.eventos.filter(x=>x.entrada).map(x=>x.selector.slice(1)));
// los textos que se CRUZAN con otro durante 2-3 cuadros al ceder el lugar (fundido de 0,1 s) se marcan: el cruce es intencional, no un solape
const cruzan=new Set(p.eventos.filter(x=>x.salida||['#beat-a','#beat-c','#cta'].includes(x.selector)&&x.entrada).map(x=>x.selector.slice(1)));
const tile=({id,clip,y,size,cls,html,text,x=80,w=920,extra=''})=>{tiles.push({id,text,y,size,card:cls.includes('card'),clip,x,w});const oc=entradas.has(id);if(oc)ocultos.push(id);
 return `<div id="${id}"${cruzan.has(id)?' data-layout-allow-overlap':''} class="texto ${cls}${oc?' oculto':''}" style="top:${y}px;${x!==80||w!==920?`left:${x}px;width:${w}px;`:''}font-size:${size}px${extra}">${html}</div>`};
const plano=(id,clip,text,y,size,cls)=>tile({id,clip,y,size,cls,html:e(text),text});
// Un beat de datos: UNA idea («etiqueta: afirmación») a pantalla ancha; la afirmación va al doble de la etiqueta (Bricolage). Todos ocupan la misma casilla (L.beat) debajo de la foto.
const beat=(id,clip,txt,cls)=>{const i=txt.indexOf(': '),lb=txt.slice(0,i+1),num=txt.slice(i+2);return tile({id,clip,y:L.beat,size:L.beat_px,cls:`card beat ${cls}`,html:`<span class="lb">${e(lb)}</span><b class="num">${e(num)}</b>`,text:txt})};
const fotoCompleta=(sc,src)=>sc.fotos.length===1?`<img id="foto-${sc.id}" class="foto-completa" src="${src}" alt="Imagen de Kling O1 Image (café con teclado)" data-layout-allow-overflow>`:'';
const [sc1,sc2,sc3]=p.escenas;
// Escena 1: el error en el cuadro 0 sobre la imagen a pantalla completa; la pila de texto va bajo el mentón (K4: mentón en y 803)
const s1=fotoCompleta(sc1,'assets/k4.png')+plano('rotulo','s1',T.rotulo,L.rotulo,L.rotulo_px,'')+plano('titulo','s1',T.titulo,L.titulo,L.titulo_px,'card titular')+plano('dato','s1',T.dato,L.dato,L.dato_px,'card dato');
// Escena 2: comparación lado a lado (K4 | R3) con los aros, y al final el beat A sobre las dos caras
const ca=(id,txt,x,txt2)=>tile({id,clip:'s2',y:L.cap,size:L.cap_px,cls:'card dato cap',html:txt2?`${e(txt)}<br>${e(txt2)}`:e(txt),text:txt2?`${txt} ${txt2}`:txt,x,w:440,extra:`;min-height:${Math.ceil(L.cap_px*1.1*2+24)}px`});
const panel=(foto,src)=>`<div id="panel-${foto}" class="panel" style="left:${geo[foto].x0}px;top:${PN.y}px;width:${PN.w}px;height:${PN.h}px"><img id="foto-${foto}" src="${src}" alt="${foto==='k4'?'Imagen de Kling O1 Image (café con teclado)':'R3, la foto de entrada'}" data-layout-allow-overflow style="left:${R1(geo[foto].left)}px;top:0px;width:${geo[foto].w}px;height:${geo[foto].h}px"><svg class="aro" id="aros-${foto}" width="${PN.w}" height="${PN.h}" viewBox="0 0 ${PN.w} ${PN.h}" aria-hidden="true">${p.aros.map(a=>aroSvg(a,foto)).join('')}</svg></div>`;
const s2=panel('k4','assets/k4-panel.png')+panel('r3','assets/r3.png')+`<div id="divisor" style="left:${PN.w-3}px;top:${PN.y}px;width:6px;height:${PN.h}px"></div>`
 +ca('cap-k4',T.cap_k4,80,T.cap_k4b)+ca('cap-r3',T.cap_r3,560)+plano('tile2','s2',T.tile2,L.tile2,L.tile2_px,'card nota')+beat('beat-a','s2',T.beat_a,'a');
// Escena 3: K4 a pantalla completa con el beat B (llega con la escena), el beat C y el CTA. El CTA no parte «cada semana,»: con text-wrap: balance queda «Seguime: cada semana, / una prueba.» (P9 H6)
const cta=tile({id:'cta',clip:'s3',y:L.cta,size:L.cta_px,cls:'card titular',html:e(T.cta).replace('cada semana,','<span class="nb">cada semana,</span>'),text:T.cta});
if(!cta.includes('class="nb"'))fail('el CTA debe contener «cada semana,» para el corte balanceado');
const s3=fotoCompleta(sc3,K4S3)+beat('beat-b','s3',T.beat_b,'b')+tile({id:'beat-c',clip:'s3',y:L.beat,size:L.beat_c_px,cls:'card beat c',html:e(T.beat_c).replace('no prueba identidad.','<span class="nb">no prueba identidad.</span>'),text:T.beat_c})+cta;
if(!s3.includes('<span class="nb">no prueba identidad.</span>'))fail('el beat C debe partirse «Casi copia: / no prueba identidad.» (no «Casi copia: no / prueba identidad.»)');
const sc=p.escenas,win=(x)=>`data-start="${Math.floor(x.a*1e6)/1e6}" data-duration="${Math.ceil((x.b-x.a)*1e6)/1e6}"`;
const plan2={...p,ocultos,deslizan:ocultos.filter(i=>!['dato','cta'].includes(i)),aros_sel:p.aros.flatMap(a=>['k4','r3'].map(f=>`#aro-${a.id}-${f}`)).join(',')};
const html=`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><title>Lucía viernes copia</title><style>${read('scripts/estilos.css')}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${p.lienzo.duracion}" data-width="1080" data-height="1920" data-fps="24">
<div id="s1" class="clip escena" ${win(sc[0])} data-track-index="0">${s1}</div>
<div id="s2" class="clip escena" ${win(sc[1])} data-track-index="1">${s2}</div>
<div id="s3" class="clip escena" ${win(sc[2])} data-track-index="2">${s3}</div>
</div><script src="assets-fijos/vendor/gsap.min.js"></script><script>window.PLAN=${JSON.stringify(plan2)};window.__timelines=window.__timelines||{};${read('scripts/timeline.js')}</script></body></html>\n`;
fs.writeFileSync(path.join(P,'index.html'),html);
fs.writeFileSync(path.join(P,'qa/tiles.json'),JSON.stringify(tiles,null,1));
fs.writeFileSync(path.join(P,'qa/caras-lienzo.json'),JSON.stringify({nota:'caja de la cara en el lienzo de 1080x1920 por escena: [x1,y1,x2,y2]; s1 y s3 = K4 a pantalla completa (cover), s2 = paneles K4 y R3',...caraLienzo},null,1));
fs.writeFileSync(path.join(P,'qa/build-status.json'),JSON.stringify({borrador:false,apto_master:true,fuentes:{...Object.fromEntries(Object.entries(p.fotos).map(([k,f])=>[k,{archivo:f.archivo,sha256:f.sha256}])),escala_oficiales:{archivo:path.relative(R,FG),sha256:sha(FG),pairwise_min:fgj.pairwise_min,pairwise_mean:fgj.pairwise_mean,max_fuera_diagonal:fuera}},voz:cr},null,2));
console.log(`OK datos/pie/voz: ${cr.chars} caracteres de voz (cupo ${p.voz.max_caracteres}), cronograma ${cr.cuadros} cuadros = ${(cr.cuadros/24).toFixed(3)} s; CTA ${colaCta.toFixed(3)} s; parecido ${f2(A)} · con R3 ${f2(r3n)} · otras siete ${f2(round(bot))} a ${f2(round(top))} · sin las recibidas ${f2(Bn)} · oficiales entre sí ${f2(round(pwMin))} a ${f2(round(pwMax))} (promedio ${f2(round(pwMed))}); pie ${pieTxt.length} caracteres; cara visible ${caraFraccion.con}/${caraFraccion.N} muestras (${(caraFraccion.f*100).toFixed(1)} %, predicción del plan); ${tiles.length} tiles de texto`);
const rp=path.join(P,'README.md');if(fs.existsSync(rp)){let r=fs.readFileSync(rp,'utf8');r=r.replace(/<!-- ESTADO -->[\s\S]*?<!-- FIN ESTADO -->/,m=>!/BORRADOR/.test(m)?m:'<!-- ESTADO -->\nFuentes completas presentes; falta render y QA del master.\n<!-- FIN ESTADO -->');fs.writeFileSync(rp,r);}
