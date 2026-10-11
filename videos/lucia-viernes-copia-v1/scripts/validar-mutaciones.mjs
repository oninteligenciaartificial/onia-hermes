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
const cases=[
 // ── cifras de las fuentes (PROCEDENCIA l.97 y la medición sin refs de entrada)
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
 ['fila de R3 con 0,92',txt('fila_a','Con esa foto: 0,92'),null,/textos\/cifras/],
 ['fila de las otras siete con 0,74',txt('fila_b','Con las otras siete: 0,56 a 0,74'),null,/textos\/cifras/],
 ['fila de las 4 con 0,75',txt('fila_c','Promedio de las 4 que no recibió: 0,75'),null,/textos\/cifras/],
 ['H2: fila de las 4 sin decir «Promedio» (un promedio puesto debajo de cosenos por foto)',txt('fila_c','Con las 4 que no recibió: 0,74'),null,/textos\/cifras/],
 ['H3: rótulo de K4 sin «una sola toma.» (la escena única vive solo en el pie)',txt('cap_k4b',''),null,/textos\/cifras/],
 ['H3: rótulo de K4 con otra frase',txt('cap_k4b','la mejor toma.'),null,/textos\/cifras/],
 ['H1: leyenda de las fotos oficiales con otra cifra (0,75)',txt('leyenda_oficiales','Fotos oficiales entre sí: 0,51 a 0,75'),null,/textos\/cifras/],
 ['H1: leyenda de las fotos oficiales ausente',txt('leyenda_oficiales',''),null,/textos\/cifras/],
 ['piso 0,75 en la escala',txt('escala_piso','piso 0,75'),null,/textos\/cifras/],
 ['nota «Era copia, no identidad.»',txt('nota_copia','Era copia, no identidad.'),null,/textos\/cifras/],
 ['CTA distinto del exacto',txt('cta','Seguime: cada semana, una prueba más.'),null,/textos\/cifras/],
 ['rótulo sin «IA»',txt('rotulo','Lucía Antelo · personaje de Onia'),null,/textos\/cifras/],
 ['«el mejor» en la lección',txt('leccion','Mirá el parecido foto por foto: el mejor método.'),null,/textos\/cifras/],
 ['«≈ 0,03» en el dato',txt('dato','Kling O1 Image · parecido 0,83 ≈ 0,03'),null,/textos\/cifras/],
 // ── pie
 ['pie sin la apertura de IA',()=>{},['pie.txt',t=>t.replace('Personaje hecho con IA','Personaje digital')],/Pie debe abrir/],
 ['pie con la apertura de IA en otra posición',()=>{},['pie.txt',t=>t.replace('Personaje hecho con IA: Lucía Antelo, de @oniahq. ','')+' Personaje hecho con IA: Lucía Antelo, de @oniahq.'],/Pie debe abrir/],
 ['pie sin «Una escena, una toma»',()=>{},pieSin('Una escena, una toma: es una prueba, no una regla. '),/falta «Una escena, una toma/],
 ['pie con 0,92 en vez de 0,93',()=>{},pieCambia('con la R3 sola da 0,93','con la R3 sola da 0,92'),/falta el parecido foto por foto/],
 ['pie con 0,84 en vez de 0,83 (promedio de las 8)',()=>{},pieCambia('El 0,83 es el parecido de ArcFace','El 0,84 es el parecido de ArcFace'),/faltan las 8 fotos oficiales/],
 ['H4: pie con 0,75 en vez de 0,74 («Sin esas 4 fotos baja a 0,74», igual que C2)',()=>{},pieCambia('Sin esas 4 fotos baja a 0,74','Sin esas 4 fotos baja a 0,75'),/falta «Sin esas 4 fotos baja a 0,74»/],
 ['pie sin las fotos recibidas (R1, R3, R6 y R7)',()=>{},pieCambia('R1, R3, R6 y R7 (cuatro de las 8 con que se compara)','cuatro fotos'),/falta decir que recibió R1, R3, R6 y R7/],
 ['pie sin la historia de la copia de R3',()=>{},pieCambia('Pero es casi una copia de la R3, una foto que recibió como entrada','Pero se parece a una foto'),/casi una copia de R3/],
 ['H4: pie sin la taza blanca de más al frente ni el «no es pixel a pixel»',()=>{},pieCambia(' y una taza blanca de más al frente; no es pixel a pixel.','.'),/casi una copia de R3/],
 ['pie sin las otras dos escenas (0,79 y 0,35)',()=>{},pieSin('El mismo motor dio 0,79 en otra escena y 0,35 en una tercera, donde perdió la cara. '),/faltan las otras dos escenas/],
 ['pie sin la aclaración de que el piso es del promedio de las 8 (y que en el gráfico va solo con el promedio de las 4)',()=>{},pieSin('El piso de 0,70 es del promedio de las 8 fotos: no se compara con el parecido de una sola foto, por eso en el gráfico lo dibujé solo junto al promedio de las 4. '),/aclarar que el piso/],
 ['H4: pie sin la escala de las fotos oficiales entre sí (0,51 a 0,72, promedio 0,64)',()=>{},pieSin('Para tener escala: entre las propias fotos oficiales de Lucía, de a dos, el parecido va de 0,51 a 0,72 (promedio 0,64; ninguna de las 28 parejas pasa de 0,72). El 0,56 a 0,73 de esta imagen con las otras siete es casi ese mismo rango; el 0,93 con la R3, no. '),/falta la escala de las fotos oficiales/],
 ['H4: pie con el mínimo de la escala en 0,52',()=>{},pieCambia('el parecido va de 0,51 a 0,72','el parecido va de 0,52 a 0,72'),/falta la escala de las fotos oficiales/],
 ['H4: pie con el promedio de la escala en 0,65',()=>{},pieCambia('(promedio 0,64;','(promedio 0,65;'),/falta la escala de las fotos oficiales/],
 ['H4: «Una escena, una toma» pasada a la segunda mitad del pie',()=>{},['pie.txt',t=>t.replace(F('Una escena, una toma: es una prueba, no una regla. '),'').replace('Cada semana hago una prueba.','Una escena, una toma: es una prueba, no una regla. Cada semana hago una prueba.')],/pie y cifras|primeros ~500/],
 ['pie sin «Nombro lo que uso»',()=>{},pieSin('Nombro lo que uso; no es una recomendación pagada. '),/falta «Nombro/],
 ['pie sin el ruido de ±0,03',()=>{},pieSin('Ruido de ±0,03. '),/falta el ruido/],
 ['pie sin el tamaño de la cara',()=>{},pieSin('La cara mide 677 px en la imagen original (bajo 200 px sería poco confiable). '),/tamaño de la cara/],
 ['pie sin la lección',()=>{},pieSin('Lección: mirá el parecido foto por foto, no solo el promedio. '),/falta la lección/],
 ['pie sin el cierre y los hashtags',()=>{},pieCambia('Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia','Seguime.'),/cierre/],
 ['pie sin decir que casi copia no prueba identidad',()=>{},pieSin('Una casi copia no prueba que el motor conserve la identidad. '),/no prueba identidad/],
 ['pie sin aclarar que con 4 fotos todo baja (el 0,74 no mide por sí solo la fuga)',()=>{},pieCambia('así que esa baja no mide por sí sola cuánto es fuga.','así que corrige el 0,83.'),/falta «Sin esas 4 fotos baja a 0,74»/],
 ['pie con «≈ 0,03»',()=>{},pieCambia('Nombro lo que uso;','Efecto ≈ 0,03. Nombro lo que uso;'),/pie y cifras|Cifra retirada/],
 ['pie con «dentro del ruido»',()=>{},pieCambia('Nombro lo que uso;','Todo dentro del ruido. Nombro lo que uso;'),/pie y cifras|Cifra retirada/],
 ['pie con «ventaja»',()=>{},pieCambia('Nombro lo que uso;','Kling tiene ventaja. Nombro lo que uso;'),/pie y cifras|Cifra retirada/],
 ['pie con «el mejor»',()=>{},pieCambia('Nombro lo que uso;','Es el mejor motor. Nombro lo que uso;'),/pie y cifras|Frase prohibida/],
 ['pie de más de 2.200 caracteres',()=>{},['pie.txt',t=>t+' '+'x'.repeat(400)],/pie y cifras|tope 2\.200/],
 // ── voz
 ['voz con cifras habladas',()=>{},['guion-voz.txt',s=>s.replace('Con esa foto, mucho más alto.','Con esa foto, 0,93.')],/voz: las cifras/],
 ['voz con «dentro del ruido»',()=>{},['guion-voz.txt',s=>s.replace('mucho más alto','dentro del ruido')],/Cifra retirada/],
 ['voz que pasa el cronograma (línea más larga)',()=>{},['guion-voz.txt',s=>s.replace('Parecido alto.','Parecido alto, de verdad, parecía ella.')],/voz y cifras/],
 ['H7: la voz vuelve a decir «Parecía Lucía.» (insinúa un engaño que la medición no respalda)',()=>{},['guion-voz.txt',s=>s.replace('Parecido alto.','Parecía Lucía.')],/voz y cifras/],
 ['H7: la voz sin su segunda línea (queda 1,3 s en silencio antes del empuje)',()=>{},['guion-voz.txt',s=>s.replace('Parecido alto.\n','')],/voz y cifras/],
 ['plan: último tramo de voz distinto (el CTA ya no cierra a 15 s)',p=>{p.voz.ultimo_tramo_cuadros=70},null,/el cronograma da/],
 ['entrada de «Mirá la foto…» a 4 s: 1,25 s después de su línea de voz',p=>{p.eventos.find(e=>e.selector==='#cap-r3'&&e.entrada).t=4},null,/voz: #cap-r3/],
 ['la lección entra a 11,5 s: lejos de su línea de voz',p=>{p.eventos.find(e=>e.selector==='#leccion'&&e.entrada).t=11.5},null,/voz: #leccion/],
 // ── eventos, orden y zona segura
 ['el primer número entra a 3,5 s (después de los 3 s)',p=>{p.eventos.find(e=>e.selector==='#dato'&&e.entrada).t=3.5},null,/primer número/],
 ['orden de entrada de la placa alterado (fila de las 4 antes que la de las otras siete)',p=>swap(p,'#fila-b','#fila-c'),null,/orden de entrada de la placa/],
 ['orden de entrada de la escena 2 alterado',p=>swap(p,'#cap-r3','#tile2'),null,/voz: #cap-r3|orden de entrada de la escena 2/],
 ['pila vertical de la placa fuera de orden (casi copia sobre la fila de las otras siete)',p=>{p.layout.nota_copia=300},null,/orden vertical de la placa/],
 ['pila vertical de la placa fuera de orden (fila de las 4 sobre la casi copia)',p=>{p.layout.fila_c=700},null,/orden vertical de la placa/],
 // ── H1: el piso 0,70 es del PROMEDIO; sobre cosenos de una sola foto hace leer «5 de 7 fotos no pasan»
 ['H1: el piso 0,70 de vuelta sobre la fila por foto de las otras siete',p=>{p.piso_en=['fila-b','fila-c']},null,/dónde va el piso/],
 ['H1: el piso 0,70 sobre la barra de una sola foto (R3)',p=>{p.piso_en=['fila-a','fila-c']},null,/dónde va el piso/],
 ['H1: el piso 0,70 sobre las tres filas (como en la v1)',p=>{p.piso_en=['fila-a','fila-b','fila-c']},null,/dónde va el piso/],
 ['H1: el piso 0,70 sin ninguna fila (o solo en una fila por foto)',p=>{p.piso_en=['fila-b']},null,/dónde va el piso/],
 // ── H5: los aros se trazan (no aparecen en 2 cuadros) y quedan ≥ 1 s a la vista
 ['H5: aro de la taza entra a 5,75 s (queda 0,625 s a la vista antes del empuje)',p=>{p.aros[2].t=5.75;p.eventos.find(e=>e.selector==='#aro-taza-k4,#aro-taza-r3').t=5.75},null,/queda a la vista/],
 ['H5: aro que se dibuja en 0,1 s (aparece en 2-3 cuadros)',p=>{p.aros[0].dibujo=0.1;p.eventos.find(e=>e.selector==='#aro-pose-k4,#aro-pose-r3').dur=0.1},null,/se dibuja en 0\.1 s/],
 ['H5: aro con pathLength=1 (GSAP redondea el offset a enteros)',p=>{p.aro_len=1},null,/aro_len debe ser 1000/],
 ['H5: aro cuya hora del plan no coincide con su evento',p=>{p.aros[1].t=5.0},null,/aro ventana: plan\.aros/],
 ['H5: aros fuera de orden (la taza antes que la pose)',p=>{p.aros[0].t=5.5;p.eventos.find(e=>e.selector==='#aro-pose-k4,#aro-pose-r3').t=5.5},null,/los aros entran en orden|queda a la vista/],
 ['la fila de R3 deja de llegar con la placa',p=>{p.eventos.find(e=>e.selector==='#fila-a').t=7},null,/voz: #fila-a|llega con la placa/],
 ['cola de más de 2 s sin evento (sin el acento del CTA)',p=>{p.eventos=p.eventos.filter(e=>e.selector!=='#cta'||e.entrada)},null,/hueco entre eventos/],
 ['un evento fuera de cuadro (t = 6,6 s)',p=>{p.eventos.find(e=>e.selector==='#aro-taza-k4,#aro-taza-r3').t=6.6},null,/no cae en un cuadro/],
 ['tile fuera de la zona segura (CTA a y 1600)',p=>{p.layout.cta=1600},null,/zona segura/],
 ['costura que no coincide con las escenas',p=>{p.costuras[0].t=3.5},null,/no coincide|escenas contra costuras|voz:/],
 ['aro que se sale del panel de R3',p=>{p.aros[0].r3.cx=2000},null,/sale del panel/],
 ['panel de R3 con un recorte que no alcanza a cubrir su ancho',p=>{p.paneles.r3.ox=300},null,/no alcanza a cubrir/],
 ['CTA sin text-wrap: balance («prueba.» huérfana)',()=>{},['scripts/estilos.css',s=>s.replace('#cta{border-color:#ffbc94;text-wrap:balance}','#cta{border-color:#ffbc94}')],/text-wrap: balance/]
];
let lines=[];for(const [name,mutate,rewrite,pattern] of cases){const p=structuredClone(plan);mutate(p);const fake=Object.create(fs);
 for(const w of ['writeFileSync','mkdirSync','copyFileSync','linkSync','unlinkSync'])fake[w]=()=>{throw Error('ESCRITURA BLOQUEADA (la alteración no fue rechazada antes de escribir)')};
 fake.readFileSync=(file,...args)=>{if(path.resolve(file)===path.join(P,'plan.json'))return JSON.stringify(p);const value=fs.readFileSync(file,...args);return rewrite&&path.resolve(file)===path.join(P,rewrite[0])?rewrite[1](value):value};
 let message='';try{vm.runInNewContext(src,{fs:fake,path,fileURLToPath,crypto,cronograma,process:{argv:[]},console},{timeout:20000})}catch(e){message=e.message}check(pattern.test(message),`${name}: no rechazado por el motivo esperado: ${message}`);lines.push(`${name}: RECHAZADO correctamente (${message.slice(0,90)})`);}
lines.push(`${cases.length} alteraciones rechazadas`);
save('validar-mutaciones.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
