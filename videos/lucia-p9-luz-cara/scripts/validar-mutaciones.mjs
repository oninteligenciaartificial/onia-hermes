// Prueba negativa sin tocar fuentes ni contenido: ejecuta build con lecturas interceptadas.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {fileURLToPath,pathToFileURL} from 'node:url';
import {P,plan,check,save} from './qa-dom.mjs';import {cronograma} from './voz.mjs';
const src=fs.readFileSync(path.join(P,'scripts/build.mjs'),'utf8').replace(/^import .*;\r?$/gm,'').replaceAll('import.meta.url',JSON.stringify(pathToFileURL(path.join(P,'scripts/build.mjs')).href));
const PIE_KLING='En el clip original (720p), la cara de Kling 3.0 std queda bajo 200 px todo el clip; la de Seedance 2.0 Mini, solo al inicio (pasa de 139 a 347 px porque el encuadre se acerca).';
const PIE_DIRECTAS='Seedance 2.0 Mini + referencias recibió como entrada 2 de las 8 fotos con que se mide el parecido (R1 y R3). ';
const PIE_K1='Ambas tomas parten de la misma foto de arranque, que se hizo con 4 de esas 8 (R1, R3, R6, R7), así que ninguna es independiente. ';
const PIE_ESTRICTA='Midiendo solo con las 4 fotos que nadie recibió (R2, R4, R5, R8), Kling 3.0 std baja de 0,72 a 0,67 y Seedance sube de 0,64 a 0,73: el sentido no cambia. ';
const PIE_LETRERO='Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe. Lo difuminé en el video. ';
const LIMITE_VIEJO='El parecido es indicativo: bajo 200 px la cara es poco confiable (Seedance parte de 139 px). Ruido de ±0,03.';
const swap=(p,a,b)=>{const x=p.eventos.find(e=>e.selector===a&&e.entrada),y=p.eventos.find(e=>e.selector===b&&e.entrada);[x.t,y.t]=[y.t,x.t]};
const cases=[
 ['parecido',p=>p.clips[0].parecido[1]=.75,null,/m1 parecido/],
 ['créditos',p=>p.clips[1].creditos=7,null,/m4 créditos/],
 ['brillo',p=>p.clips[1].brillo[2]=-32,null,/m4 brillo/],
 ['cara 139',p=>p.clips[1].cara_px[0]=138,null,/m4 cara px/],
 ['cara 347',p=>p.clips[1].cara_px[1]=348,null,/m4 cara px/],
 ['todas las caras <200',p=>p.textos.limite_cara='Todas las caras miden menos de 200 px.',null,/textos\/cifras/],
 ['H1 rev.1: «Seedance parte de 139 px» como única mención de tamaño (pantalla)',p=>p.textos.limite_cara=LIMITE_VIEJO,null,/textos\/cifras/],
 ['H1 rev.1: «Seedance parte de 139 px» como única mención de tamaño (pie)',()=>{},['pie.txt',s=>s.replace(PIE_KLING,'(en Seedance 2.0 Mini parte de 139 px) y el ruido es de ±0,03.')],/Kling debe nombrarse/],
 ['H1 rev.1: etiqueta sin «del clip original»',p=>p.textos.reencuadre='Cara: 139 → 347 px · reencuadra',null,/textos\/cifras/],
 ['H5 rev.2: límite de cara sin «(clip original)»',p=>p.textos.limite_cara='Bajo 200 px la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.',null,/textos\/cifras/],
 ['H3 rev.1: titular afirmativo',p=>p.textos.titulo='La cara o la escena.',null,/textos\/cifras/],
 ['H6 rev.1: delta de brillo con decimal en la pastilla',p=>p.textos.m1=p.textos.m1.replace('brillo −1','brillo −1,0'),null,/textos\/cifras/],
 ['cifra pantalla',p=>p.textos.m1=p.textos.m1.replace('0,72','0,73'),null,/textos\/cifras/],
 ['cifra pie',()=>{},['pie.txt',s=>s.replace('0,72','0,73')],/pie y cifras/],
 ['declaración IA pie',()=>{},['pie.txt',s=>s.replace('Personaje hecho con IA','Personaje digital')],/Pie debe abrir/],
 ['H1 rev.2: aviso de la toma de Seedance borrado de la pantalla',p=>p.textos.aviso_refs='',null,/textos\/cifras/],
 ['H1 rev.2: «fotos de puntaje» en vez de «fotos con que se mide» (pastilla)',p=>p.textos.aviso_refs='Seedance recibió 2 de las 8 fotos de puntaje.',null,/textos\/cifras/],
 ['H1 rev.2: nota del asterisco borrada de la placa',p=>p.textos.nota_refs='',null,/textos\/cifras/],
 ['H1 rev.2: nota del asterisco con otra cantidad de fotos',p=>p.textos.nota_refs=p.textos.nota_refs.replace('2 de','3 de'),null,/textos\/cifras/],
 ['H1 rev.2: fila de Seedance sin asterisco',p=>{p.clips[1].asterisco=false},null,/asterisco/],
 ['H1 rev.2: asterisco también en la fila de Kling',p=>{p.clips[0].asterisco=true},null,/asterisco/],
 ['H2 rev.2: pie sin el dato de las 2 fotos que Seedance recibió como entrada',()=>{},['pie.txt',s=>s.replace(PIE_DIRECTAS,'')],/recibió como entrada/],
 ['H2 rev.2: pie sin el hecho de la foto de arranque K1',()=>{},['pie.txt',s=>s.replace(PIE_K1,'')],/foto de arranque/],
 ['H2 rev.2: pie con «Kling no recibió ninguna» (imprecisa)',()=>{},['pie.txt',s=>s.replace(PIE_K1,PIE_K1+'Kling no recibió ninguna. ')],/pie y cifras/],
 ['H3 rev.2: pie con el sentido invertido («el sentido cambia»)',()=>{},['pie.txt',s=>s.replace('el sentido no cambia','el sentido cambia')],/prueba estricta/],
 ['H3 rev.2: pie con otra cifra de la prueba estricta',()=>{},['pie.txt',s=>s.replace('0,64 a 0,73','0,64 a 0,69')],/prueba estricta/],
 ['H3 rev.2: plan con otra cifra de la prueba estricta',p=>{p.prueba_estricta.kling=[0.72,0.7]},null,/prueba estricta/],
 ['H3 rev.2: plan con otras fotos que nadie recibió',p=>{p.prueba_estricta.fotos=['R2','R4','R5','R7']},null,/prueba estricta/],
 ['Retirada: «efecto estimado ≈ 0,03» en la pastilla de Seedance',p=>p.textos.aviso_refs='Seedance recibió 2 de las 8 fotos con que se mide: efecto estimado ≈ 0,03.',null,/Cifra retirada/],
 ['Retirada: «ventaja ≈ 0,03» en la pastilla de Seedance',p=>p.textos.aviso_refs='Seedance recibió 2 de las 8 fotos con que se mide: ventaja ≈ 0,03.',null,/Cifra retirada/],
 ['Retirada: «ventaja» en la nota del asterisco',p=>p.textos.nota_refs='* Seedance recibió 2 de las 8 fotos con que se mide: ventaja.',null,/Cifra retirada/],
 ['Retirada: «≈ 0,03» en el pie',()=>{},['pie.txt',s=>s.replace('así que ninguna es independiente.','así que ninguna es independiente; el efecto es de ≈ 0,03.')],/Cifra retirada/],
 ['Retirada: «dentro del ruido» en el pie',()=>{},['pie.txt',s=>s.replace('el sentido no cambia.','el sentido no cambia, dentro del ruido.')],/Cifra retirada/],
 ['Retirada: «ventaja» en el pie',()=>{},['pie.txt',s=>s.replace('el sentido no cambia.','el sentido no cambia y Seedance tiene ventaja.')],/Cifra retirada/],
 ['Retirada: «dentro del ruido» en la voz',()=>{},['guion-voz.txt',s=>s.replace('la cara baja un poco','la cara baja dentro del ruido')],/Cifra retirada/],
 ['H6 rev.2: orden de entrada con el límite de cara antes de «Una toma cada uno»',p=>swap(p,'#toma','#limite-cara'),null,/orden de entrada/],
 ['H6 rev.2: la nota del asterisco entra después del brillo',p=>swap(p,'#nota-ast','#brillo'),null,/orden de entrada/],
 ['H5 rev.1: letrero inventado ausente del pie',()=>{},['pie.txt',s=>s.replace(PIE_LETRERO,'')],/letrero/],
 ['H5 rev.1: scrim del letrero ausente',p=>{delete p.scrim_m4},null,/scrim/],
 ['H4 rev.1: la voz habla decimales',()=>{},['guion-voz.txt',s=>s.replace('la cara baja un poco','la cara baja de 0,79 a 0,72')],/voz/],
 ['H4 rev.1: L3 vuelve a cruzar el corte («Kling 3.0 std»)',()=>{},['guion-voz.txt',s=>s.replace('Kling: brillo','Kling 3.0 std: brillo')],/voz/]
];
let lines=[];for(const [name,mutate,rewrite,pattern] of cases){const p=structuredClone(plan);mutate(p);const fake=Object.create(fs);fake.readFileSync=(file,...args)=>{if(path.resolve(file)===path.join(P,'plan.json'))return JSON.stringify(p);const value=fs.readFileSync(file,...args);return rewrite&&path.resolve(file)===path.join(P,rewrite[0])?rewrite[1](value):value};
 let message='';try{vm.runInNewContext(src,{fs:fake,path,fileURLToPath,cronograma,process:{argv:[]},console},{timeout:2000})}catch(e){message=e.message}check(pattern.test(message),`${name}: no rechazado por el motivo esperado: ${message}`);lines.push(`${name}: RECHAZADO correctamente`);}
save('validar-mutaciones.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
