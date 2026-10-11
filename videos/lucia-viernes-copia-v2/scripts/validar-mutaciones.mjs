// Prueba negativa sin tocar fuentes ni contenido: ejecuta build.mjs con lecturas interceptadas y escrituras BLOQUEADAS. Cada alteración (cifra, frase, orden, aro, pie, voz) tiene que ser rechazada por el motivo esperado.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import crypto from 'node:crypto';import {fileURLToPath,pathToFileURL} from 'node:url';
import {P,plan,check,save} from './qa-dom.mjs';import {cronograma} from './voz.mjs';
const src=fs.readFileSync(path.join(P,'scripts/build.mjs'),'utf8').replace(/^import .*;\r?$/gm,'').replaceAll('import.meta.url',JSON.stringify(pathToFileURL(path.join(P,'scripts/build.mjs')).href));
const pie0=fs.readFileSync(path.join(P,'pie.txt'),'utf8');
const F=s=>{if(!pie0.includes(s))throw Error('mutación mal escrita: el pie no contiene «'+s.slice(0,50)+'»');return s};
const swap=(p,a,b)=>{const x=p.eventos.find(e=>e.selector===a&&e.entrada),y=p.eventos.find(e=>e.selector===b&&e.entrada);[x.t,y.t]=[y.t,x.t]};
const pieSin=s=>['pie.txt',t=>t.replace(F(s),'')];
const pieCambia=(a,b)=>['pie.txt',t=>t.replace(F(a),b)];
const txt=(k,v)=>p=>{p.textos[k]=v};
const evSel=(p,sel,pred=e=>true)=>p.eventos.find(e=>e.selector===sel&&pred(e));
const cases=[
 // ── cifras de las fuentes (PROCEDENCIA l.97, la medición sin refs de entrada y face-gate-v31.json)
 ['0,83: promedio de las 8 distinto de la fuente',p=>{p.datos.promedio8=0.84},null,/datos del plan/],
 ['0,93: parecido con R3 distinto de la fuente',p=>{p.datos.por_foto.R3=0.9},null,/datos del plan/],
 ['0,74: promedio de las 4 que nadie recibió distinto de la fuente',p=>{p.datos.sin_recibidas_4=0.76},null,/datos del plan/],
 ['0,73: parecido con R7 distinto de la fuente',p=>{p.datos.por_foto.R7=0.75},null,/datos del plan/],
 ['0,56: parecido con R4 distinto de la fuente',p=>{p.datos.por_foto.R4=0.5},null,/datos del plan/],
 ['créditos de la imagen distintos de PROCEDENCIA',p=>{p.datos.creditos=1},null,/datos del plan/],
 ['cara de 677 px distinta de la medición',p=>{p.datos.cara_px=600},null,/datos del plan/],
 ['otras escenas del mismo motor distintas (0,79)',p=>{p.datos.otras_escenas.K1=0.8},null,/otras escenas/],
 ['fotos recibidas distintas de la advertencia (R1, R3, R6, R7)',p=>{p.datos.recibidas=['R1','R2','R6','R7']},null,/fotos recibidas/],
 ['fotos que nadie recibió distintas (R2, R4, R5, R8)',p=>{p.datos.no_recibidas=['R2','R4','R5','R7']},null,/fotos que nadie recibió/],
 ['la foto copiada deja de ser la más parecida',p=>{p.datos.foto_copiada='R4'},null,/debe ser la foto con mayor parecido/],
 ['piso de identidad cambiado',p=>{p.datos.piso=0.65},null,/piso de identidad/],
 ['escala oficial: mínimo entre fotos (0,51) distinto de face-gate-v31.json',p=>{p.datos.pares_oficiales.min=0.5},null,/escala de las fotos oficiales/],
 ['escala oficial: máximo entre fotos (0,72) distinto de face-gate-v31.json',p=>{p.datos.pares_oficiales.max=0.75},null,/escala de las fotos oficiales/],
 ['escala oficial: promedio entre fotos (0,64) distinto de face-gate-v31.json',p=>{p.datos.pares_oficiales.media=0.7},null,/escala de las fotos oficiales/],
 ['SHA-256 de K4 distinto',p=>{p.fotos.k4.sha256='0'.repeat(64)},null,/SHA-256/],
 ['tamaño de R3 distinto',p=>{p.fotos.r3.ancho=1000},null,/tamaño del PNG/],
 // ── textos de pantalla
 ['título con otra cifra (0,84)',txt('titulo','Casi publico este 0,84.'),null,/textos\/cifras/],
 ['título «Era copia, no identidad.» (sobreafirma: sin el «casi» ni el «no prueba»)',txt('titulo','Era copia, no identidad.'),null,/textos\/cifras/],
 ['dato sin el nombre de la herramienta',txt('dato','Parecido 0,83'),null,/textos\/cifras/],
 ['dato con otra cifra',txt('dato','Kling O1 Image · parecido 0,82'),null,/textos\/cifras/],
 ['beat A con 0,92',txt('beat_a','Con esa foto: 0,92'),null,/textos\/cifras/],
 ['beat B con 0,74 en el tope del rango',txt('beat_b','Con las otras 7: 0,56–0,74'),null,/textos\/cifras/],
 ['beat B con «a» en vez de guion (7 palabras, no cabe en su ventana)',txt('beat_b','Con las otras 7: 0,56 a 0,73'),null,/textos\/cifras/],
 ['v2: un DATO EXTRA en el beat A (dos números a la vez)',txt('beat_a','Con esa foto: 0,93 · promedio 0,83'),null,/textos\/cifras/],
 ['v2: un DATO EXTRA en el beat B (el 0,74 de las 4 junto al rango)',txt('beat_b','Con las otras 7: 0,56–0,73 · 0,74'),null,/textos\/cifras/],
 ['v2: reaparece «Promedio de las 4 que no recibió: 0,74» como texto en pantalla',p=>{p.textos.fila_c='Promedio de las 4 que no recibió: 0,74'},null,/textos\/cifras/],
 ['v2: reaparece «piso 0,70» como texto en pantalla',p=>{p.textos.escala_piso='piso 0,70'},null,/textos\/cifras/],
 ['v2: reaparece la leyenda «Fotos oficiales entre sí: 0,51 a 0,72»',p=>{p.textos.leyenda_oficiales='Fotos oficiales entre sí: 0,51 a 0,72'},null,/textos\/cifras|Ya no hay gráfico/],
 ['v2: la lección «Mirá el parecido foto por foto.» vuelve a la pantalla (queda en el pie)',p=>{p.textos.leccion='Mirá el parecido foto por foto.'},null,/textos\/cifras/],
 ['v2: «promedio» dentro del beat C',txt('beat_c','Casi copia: no prueba el promedio.'),null,/textos\/cifras/],
 ['v2: beat C «Casi copia ≠ misma persona» (afirma que NO es ella; lo medido no lo sostiene)',txt('beat_c','Casi copia ≠ misma persona'),null,/textos\/cifras/],
 ['beat C «Era copia, no identidad.»',txt('beat_c','Era copia, no identidad.'),null,/textos\/cifras/],
 ['CTA distinto del exacto',txt('cta','Seguime: cada semana, una prueba más.'),null,/textos\/cifras/],
 ['rótulo sin «IA»',txt('rotulo','Lucía Antelo · personaje de Onia'),null,/textos\/cifras/],
 ['H3: rótulo de K4 sin «una sola toma.»',txt('cap_k4b',''),null,/textos\/cifras/],
 ['«el mejor» en el beat B',txt('beat_b','Con las otras 7: el mejor'),null,/textos\/cifras/],
 ['«≈ 0,03» en el dato',txt('dato','Kling O1 Image · parecido 0,83 ≈ 0,03'),null,/textos\/cifras/],
 ['v2: el gráfico vuelve al plan (piso_en)',p=>{p.piso_en=['fila-c']},null,/Ya no hay gráfico/],
 ['v2: el gráfico vuelve al plan (barras)',p=>{p.barras=[{sel:'#fila-a .fill'}]},null,/Ya no hay gráfico/],
 // ── v2: tipografía (nada bajo 40 px; rótulo, título y dato ≥ 44; subtítulos, beats y CTA ≥ 48; etiqueta del beat ≥ 56)
 ['v2: etiqueta del beat a 40 px (no se lee en el celular)',p=>{p.layout.beat_px=40},null,/beat_px: 40 px/],
 ['v2: etiqueta del beat a 52 px (cabe a 56)',p=>{p.layout.beat_px=52},null,/beat_px: 52 px/],
 ['v2: beat C a 44 px',p=>{p.layout.beat_c_px=44},null,/beat_c_px: 44 px/],
 ['v2: subtítulos de la escena 2 a 42 px (los de la v1.1)',p=>{p.layout.cap_px=42},null,/cap_px: 42 px/],
 ['v2: «misma pose, ventana, taza» a 44 px (el de la v1.1)',p=>{p.layout.tile2_px=44},null,/tile2_px: 44 px/],
 ['v2: CTA a 44 px',p=>{p.layout.cta_px=44},null,/cta_px: 44 px/],
 ['v2: rótulo de IA a 40 px (cabe a 44)',p=>{p.layout.rotulo_px=40},null,/rotulo_px: 40 px/],
 ['v2: rótulo de IA a 36 px (nunca bajo 40)',p=>{p.layout.rotulo_px=36},null,/rotulo_px: 36 px/],
 // ── v2: la cara de Lucía a la vista más de la mitad del tiempo (≥ 85 %)
 ['v2: la escena 3 sin foto (fondo negro de 8 a 15 s)',p=>{p.escenas[2].fotos=[]},null,/fotos por escena|Cara visible/],
 ['v2: las escenas 2 y 3 sin foto (cara visible ≤ 50 %)',p=>{p.escenas[1].fotos=[];p.escenas[2].fotos=[]},null,/fotos por escena|Cara visible/],
 ['v2: ninguna cara llega a 700 px en el lienzo (0 % de muestras con cara)',p=>{p.cara_visible.min_px=700},null,/Cara visible 0\/30/],
 ['v2: el objetivo de cara visible baja (el plan no puede aflojar la regla del 85 %)',p=>{p.cara_visible.objetivo=0.4;p.cara_visible.min_px=700},null,/Cara visible 0\/30/],
 // ── pie
 ['pie sin la apertura de IA',()=>{},['pie.txt',t=>t.replace('Personaje hecho con IA','Personaje digital')],/Pie debe abrir/],
 ['pie con la apertura de IA en otra posición',()=>{},['pie.txt',t=>t.replace('Personaje hecho con IA: Lucía Antelo, de @oniahq. ','')+' Personaje hecho con IA: Lucía Antelo, de @oniahq.'],/Pie debe abrir/],
 ['pie sin «Una escena, una toma»',()=>{},pieSin('Una escena, una toma: es una prueba, no una regla. '),/falta «Una escena, una toma/],
 ['H4: «Una escena, una toma» pasada a la segunda mitad del pie',()=>{},['pie.txt',t=>t.replace(F('Una escena, una toma: es una prueba, no una regla. '),'').replace('Cada semana hago una prueba.','Una escena, una toma: es una prueba, no una regla. Cada semana hago una prueba.')],/pie y cifras|primeros ~500/],
 ['pie con 0,92 en vez de 0,93',()=>{},pieCambia('con la R3 sola da 0,93','con la R3 sola da 0,92'),/falta el parecido foto por foto/],
 ['pie con 0,84 en vez de 0,83 (cara promedio de las 8)',()=>{},pieCambia('El 0,83 es el parecido de ArcFace','El 0,84 es el parecido de ArcFace'),/faltan las 8 fotos oficiales/],
 ['pie sin «cara promedio» (el 0,83 es contra la cara promedio de las 8)',()=>{},pieCambia('contra la cara promedio de las 8 fotos oficiales','contra las 8 fotos oficiales'),/faltan las 8 fotos oficiales/],
 ['H4: pie con 0,75 en vez de 0,74 («Sin esas 4 fotos baja a 0,74», igual que C2)',()=>{},pieCambia('Sin esas 4 fotos baja a 0,74','Sin esas 4 fotos baja a 0,75'),/falta «Sin esas 4 fotos baja a 0,74»/],
 ['pie sin «no la media de sus cifras»',()=>{},pieCambia(', no la media de sus cifras','' ),/falta «Sin esas 4 fotos baja a 0,74»/],
 ['pie sin las fotos recibidas (R1, R3, R6 y R7)',()=>{},pieCambia('R1, R3, R6 y R7 (cuatro de las 8 con que se compara)','cuatro fotos'),/falta decir que recibió R1, R3, R6 y R7/],
 ['pie sin la historia de la copia de R3',()=>{},pieCambia('Pero es casi una copia de la R3, una foto que recibió como entrada','Pero se parece a una foto'),/casi una copia de R3/],
 ['H4: pie sin la taza blanca de más al frente ni el «no es pixel a pixel»',()=>{},pieCambia(' y una taza blanca de más al frente; no es pixel a pixel.','.'),/casi una copia de R3/],
 ['pie sin las otras dos escenas (0,79 y 0,35)',()=>{},pieSin('El mismo motor dio 0,79 en otra escena y 0,35 en una tercera, donde perdió la cara. '),/faltan las otras dos escenas/],
 ['pie sin «el piso de 0,70 lo elegí yo y es de la cara promedio de las 8»',()=>{},pieSin('El piso de 0,70 lo elegí yo y es de la cara promedio de las 8 fotos: no se compara con el parecido de una sola foto. '),/aclarar que el piso/],
 ['v2: el pie vuelve a hablar del gráfico («por eso en el gráfico lo dibujé solo junto al promedio de las 4»)',()=>{},pieCambia('no se compara con el parecido de una sola foto.','no se compara con el parecido de una sola foto, por eso en el gráfico lo dibujé solo junto al promedio de las 4.'),/gráfico|falta aclarar que el piso/],
 ['H4: pie sin la escala de las fotos oficiales entre sí (0,51 a 0,72, promedio 0,64)',()=>{},pieSin('Para tener escala: entre las propias fotos oficiales de Lucía, de a dos, el parecido va de 0,51 a 0,72 (promedio 0,64; ninguna de las 28 parejas pasa de 0,72). El 0,56 a 0,73 de esta imagen con las otras siete es casi ese mismo rango; el 0,93 con la R3, no. '),/falta la escala de las fotos oficiales/],
 ['H4: pie con el mínimo de la escala en 0,52',()=>{},pieCambia('el parecido va de 0,51 a 0,72','el parecido va de 0,52 a 0,72'),/falta la escala de las fotos oficiales/],
 ['H4: pie con el promedio de la escala en 0,65',()=>{},pieCambia('(promedio 0,64;','(promedio 0,65;'),/falta la escala de las fotos oficiales/],
 ['pie sin «Nombro lo que uso»',()=>{},pieSin('Nombro lo que uso; no es una recomendación pagada. '),/falta «Nombro/],
 ['pie sin el ruido de ±0,03',()=>{},pieSin('Ruido de ±0,03. '),/falta el ruido/],
 ['pie sin el tamaño de la cara',()=>{},pieSin('La cara mide 677 px en la imagen original (bajo 200 px sería poco fiable). '),/tamaño de la cara/],
 ['pie sin la lección (que ya no está en pantalla)',()=>{},pieSin('Lección: mirá el parecido foto por foto, no solo el promedio. '),/falta la lección/],
 ['pie sin el cierre y los hashtags',()=>{},pieCambia('Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia','Seguime.'),/cierre/],
 ['pie sin decir que casi copia no prueba identidad',()=>{},pieSin('Una casi copia no prueba que el motor conserve la identidad. '),/no prueba identidad/],
 ['pie sin aclarar que con 4 fotos todo baja (el 0,74 no mide por sí solo la fuga)',()=>{},pieCambia('así que esa baja no mide por sí sola cuánto es fuga.','así que corrige el 0,83.'),/falta «Sin esas 4 fotos baja a 0,74»/],
 ['pie con «≈ 0,03»',()=>{},pieCambia('Nombro lo que uso;','Efecto ≈ 0,03. Nombro lo que uso;'),/pie y cifras|Cifra retirada/],
 ['pie con «dentro del ruido»',()=>{},pieCambia('Nombro lo que uso;','Todo dentro del ruido. Nombro lo que uso;'),/pie y cifras|Cifra retirada/],
 ['pie con «ventaja»',()=>{},pieCambia('Nombro lo que uso;','Kling tiene ventaja. Nombro lo que uso;'),/pie y cifras|Cifra retirada/],
 ['pie con «el mejor»',()=>{},pieCambia('Nombro lo que uso;','Es el mejor motor. Nombro lo que uso;'),/pie y cifras|Frase prohibida/],
 ['pie de más de 2.200 caracteres',()=>{},['pie.txt',t=>t+' '+'x'.repeat(400)],/pie y cifras|tope 2\.200/],
 // ── voz (≤ 255 caracteres, sin dígitos, una línea por beat)
 ['voz con cifras habladas',()=>{},['guion-voz.txt',s=>s.replace('Con esa foto, sale más alto.','Con esa foto, 0,93.')],/voz: las cifras/],
 ['voz con «dentro del ruido»',()=>{},['guion-voz.txt',s=>s.replace('mucho menos','dentro del ruido')],/Cifra retirada/],
 ['voz que pasa el cronograma (línea más larga)',()=>{},['guion-voz.txt',s=>s.replace('Parecido alto.','Parecido alto, de verdad, parecía ella.')],/voz y cifras/],
 ['v2: L5 vuelve a decir «mucho más alto» (compara 0,93 con 0,83, no con nada «mucho»)',()=>{},['guion-voz.txt',s=>s.replace('Con esa foto, sale más alto.','Con esa foto, mucho más alto.')],/voz y cifras/],
 ['v2: la voz vuelve a hablar de la lección «Mirá el parecido foto por foto.»',()=>{},['guion-voz.txt',s=>s.replace('Con las otras siete, mucho menos.','Mirá el parecido foto por foto.')],/voz y cifras/],
 ['v2: la voz sin su línea del beat B (7 líneas)',()=>{},['guion-voz.txt',s=>s.replace('Con las otras siete, mucho menos.\n','')],/voz y cifras/],
 ['H7: la voz vuelve a decir «Parecía Lucía.» (insinúa un engaño que la medición no respalda)',()=>{},['guion-voz.txt',s=>s.replace('Parecido alto.','Parecía Lucía.')],/voz y cifras/],
 ['plan: último tramo de voz distinto (el CTA ya no cierra a 15 s)',p=>{p.voz.ultimo_tramo_cuadros=75},null,/el cronograma da/],
 ['entrada de «Mirá la foto…» a 4 s: 1,25 s después de su línea de voz',p=>{evSel(p,'#cap-r3',e=>e.entrada).t=4},null,/voz: #cap-r3/],
 ['el beat C entra a 11,5 s: lejos de su línea de voz',p=>{evSel(p,'#beat-c',e=>e.entrada).t=11.5},null,/voz: #beat-c/],
 // ── eventos, orden, una idea por vez y zona segura
 ['el primer número entra a 3,5 s (después de los 3 s)',p=>{evSel(p,'#dato',e=>e.entrada).t=3.5},null,/primer número/],
 ['v2: el beat B llega 0,25 s después de la escena 3',p=>{evSel(p,'#beat-b',e=>e.voz).t=8.375},null,/el beat B llega con la escena 3/],
 ['v2: orden de los beats alterado (C antes que A)',p=>swap(p,'#beat-a','#beat-c'),null,/orden de los beats|voz: #beat/],
 ['orden de entrada de la escena 2 alterado',p=>swap(p,'#cap-r3','#tile2'),null,/voz: #cap-r3|orden de entrada de la escena 2/],
 ['v2: dos ideas a la vez: el beat B sale DESPUÉS de que entra el C',p=>{evSel(p,'#beat-b',e=>e.salida).t=10.25},null,/una idea por vez/],
 ['v2: aire entre ideas: el beat B sale 3 cuadros antes de que entre el C',p=>{evSel(p,'#beat-b',e=>e.salida).t=10.0833333333333},null,/una idea por vez|no cae en un cuadro/],
 ['v2: los textos de la escena 2 no ceden el lugar al beat A (sin salida del «misma pose»)',p=>{p.eventos=p.eventos.filter(e=>!(e.selector==='#tile2'&&e.salida))},null,/falta la salida de #tile2/],
 ['v2: falta la salida del beat C (el CTA se encimaría)',p=>{p.eventos=p.eventos.filter(e=>!(e.selector==='#beat-c'&&e.salida))},null,/falta la salida de #beat-c/],
 ['v2: el CTA entra a 12,5 s y queda 2,5 s en pantalla',p=>{evSel(p,'#cta',e=>e.entrada).t=12.5;evSel(p,'#beat-c',e=>e.salida).t=12.4583333333333},null,/CTA: entra a|no cae en un cuadro/],
 ['cola de más de 2 s sin evento (sin el acento del CTA ni el del beat C)',p=>{p.eventos=p.eventos.filter(e=>!(e.selector==='#cta'&&!e.entrada)&&!(e.selector==='#beat-c'&&!e.entrada&&!e.salida))},null,/hueco entre eventos/],
 ['un evento fuera de cuadro (t = 6,6 s)',p=>{evSel(p,'#aro-taza-k4,#aro-taza-r3').t=6.6},null,/no cae en un cuadro/],
 ['tile fuera de la zona segura (beats a y 1600)',p=>{p.layout.beat=1600},null,/zona segura/],
 ['tile fuera de la zona segura (CTA a y 1600)',p=>{p.layout.cta=1600},null,/zona segura/],
 ['costura que no coincide con las escenas',p=>{p.costuras[0].t=3.5},null,/no coincide|escenas contra costuras|voz:/],
 ['v2: segunda costura que no coincide con las escenas (el beat B ya no llega con ella)',p=>{p.costuras[1].t=8.5},null,/escenas contra costuras|el beat B llega|voz:/],
 ['aro que se sale del panel de R3',p=>{p.aros[0].r3.cx=2000},null,/sale del panel/],
 ['panel de R3 con un recorte que no alcanza a cubrir su ancho',p=>{p.paneles.r3.ox=300},null,/no alcanza a cubrir/],
 // ── H5: los aros se trazan (no aparecen en 2 cuadros) y quedan ≥ 1 s a la vista
 ['H5: aro de la taza entra a 7,5 s (queda 0,375 s a la vista antes del empuje)',p=>{p.aros[2].t=7.5;evSel(p,'#aro-taza-k4,#aro-taza-r3').t=7.5},null,/queda a la vista/],
 ['H5: aro que se dibuja en 0,1 s (aparece en 2-3 cuadros)',p=>{p.aros[0].dibujo=0.1;evSel(p,'#aro-pose-k4,#aro-pose-r3').dur=0.1},null,/se dibuja en 0\.1 s/],
 ['H5: aro con pathLength=1 (GSAP redondea el offset a enteros)',p=>{p.aro_len=1},null,/aro_len debe ser 1000/],
 ['H5: aro cuya hora del plan no coincide con su evento',p=>{p.aros[1].t=5.0},null,/aro ventana: plan\.aros/],
 ['H5: aros fuera de orden (la taza antes que la pose)',p=>{p.aros[0].t=7.5;evSel(p,'#aro-pose-k4,#aro-pose-r3').t=7.5},null,/los aros entran en orden|queda a la vista/],
 ['CTA sin text-wrap: balance («prueba.» huérfana)',()=>{},['scripts/estilos.css',s=>s.replace('#cta{border-color:#ffbc94;text-wrap:balance}','#cta{border-color:#ffbc94}')],/text-wrap: balance/]
];
let lines=[];for(const [name,mutate,rewrite,pattern] of cases){const p=structuredClone(plan);mutate(p);const fake=Object.create(fs);
 for(const w of ['writeFileSync','mkdirSync','copyFileSync','linkSync','unlinkSync'])fake[w]=()=>{throw Error('ESCRITURA BLOQUEADA (la alteración no fue rechazada antes de escribir)')};
 fake.readFileSync=(file,...args)=>{if(path.resolve(file)===path.join(P,'plan.json'))return JSON.stringify(p);const value=fs.readFileSync(file,...args);return rewrite&&path.resolve(file)===path.join(P,rewrite[0])?rewrite[1](value):value};
 let message='';try{vm.runInNewContext(src,{fs:fake,path,fileURLToPath,crypto,cronograma,process:{argv:[]},console},{timeout:20000})}catch(e){message=e.message}check(pattern.test(message),`${name}: no rechazado por el motivo esperado: ${message}`);lines.push(`${name}: RECHAZADO correctamente (${message.slice(0,90)})`);}
lines.push(`${cases.length} alteraciones rechazadas`);
save('validar-mutaciones.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
