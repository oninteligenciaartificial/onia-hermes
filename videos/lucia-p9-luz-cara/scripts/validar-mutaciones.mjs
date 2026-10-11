// Prueba negativa sin tocar fuentes ni contenido: ejecuta build con lecturas interceptadas.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {fileURLToPath,pathToFileURL} from 'node:url';
import {P,plan,check,save} from './qa-dom.mjs';import {cronograma} from './voz.mjs';
const src=fs.readFileSync(path.join(P,'scripts/build.mjs'),'utf8').replace(/^import .*;\r?$/gm,'').replaceAll('import.meta.url',JSON.stringify(pathToFileURL(path.join(P,'scripts/build.mjs')).href));
const PIE_KLING='En el clip original (720p), la cara de Kling 3.0 std queda bajo 200 px todo el clip; la de Seedance 2.0 Mini, solo al inicio (pasa de 139 a 347 px porque el encuadre se acerca).';
const PIE_REFS='Seedance recibió 3 imágenes de referencia y 2 de ellas están entre las 8 fotos oficiales con que se mide el parecido; descontando eso, el efecto estimado es de ≈ 0,03 (dentro del ruido de ±0,03). Kling no recibió ninguna. ';
const PIE_LETRERO='Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe. Lo difuminé en el video. ';
const LIMITE_VIEJO='El parecido es indicativo: bajo 200 px la cara es poco confiable (Seedance parte de 139 px). Ruido de ±0,03.';
const cases=[
 ['parecido',p=>p.clips[0].parecido[1]=.75,null,/m1 parecido/],
 ['créditos',p=>p.clips[1].creditos=7,null,/m4 créditos/],
 ['brillo',p=>p.clips[1].brillo[2]=-32,null,/m4 brillo/],
 ['cara 139',p=>p.clips[1].cara_px[0]=138,null,/m4 cara px/],
 ['cara 347',p=>p.clips[1].cara_px[1]=348,null,/m4 cara px/],
 ['todas las caras <200',p=>p.textos.limite_cara='Todas las caras miden menos de 200 px.',null,/textos\/cifras/],
 ['H1: «Seedance parte de 139 px» como única mención de tamaño (pantalla)',p=>p.textos.limite_cara=LIMITE_VIEJO,null,/textos\/cifras/],
 ['H1: «Seedance parte de 139 px» como única mención de tamaño (pie)',()=>{},['pie.txt',s=>s.replace(PIE_KLING,'(en Seedance 2.0 Mini parte de 139 px) y el ruido es de ±0,03.')],/Kling debe nombrarse/],
 ['H1: etiqueta sin «del clip original»',p=>p.textos.reencuadre='Cara: 139 → 347 px · reencuadra',null,/textos\/cifras/],
 ['H3: titular afirmativo',p=>p.textos.titulo='La cara o la escena.',null,/textos\/cifras/],
 ['H6: brillo con decimal en pantalla',p=>p.textos.m1=p.textos.m1.replace('brillo −1','brillo −1,0'),null,/textos\/cifras/],
 ['cifra pantalla',p=>p.textos.m1=p.textos.m1.replace('0,72','0,73'),null,/textos\/cifras/],
 ['cifra pie',()=>{},['pie.txt',s=>s.replace('0,72','0,73')],/pie y cifras/],
 ['declaración IA pie',()=>{},['pie.txt',s=>s.replace('Personaje hecho con IA','Personaje digital')],/Pie debe abrir/],
 ['aviso de fotos recibidas: borrado de la pantalla',p=>p.textos.aviso_refs='',null,/textos\/cifras/],
 ['aviso de fotos recibidas: efecto distinto en pantalla',p=>p.textos.aviso_refs=p.textos.aviso_refs.replace('0,03','0,05'),null,/textos\/cifras/],
 ['aviso de fotos recibidas: borrado del pie',()=>{},['pie.txt',s=>s.replace(PIE_REFS,'')],/aviso de las fotos de referencia/],
 ['aviso de fotos recibidas: efecto distinto en el pie',()=>{},['pie.txt',s=>s.replace('≈ 0,03','≈ 0,05')],/aviso de las fotos de referencia/],
 ['H5: letrero inventado ausente del pie',()=>{},['pie.txt',s=>s.replace(PIE_LETRERO,'')],/letrero/],
 ['H5: scrim del letrero ausente',p=>{delete p.scrim_m4},null,/scrim/],
 ['H4: la voz habla decimales',()=>{},['guion-voz.txt',s=>s.replace('la cara baja un poco','la cara baja de 0,79 a 0,72')],/voz/],
 ['H4: L3 vuelve a cruzar el corte («Kling 3.0 std»)',()=>{},['guion-voz.txt',s=>s.replace('Kling: brillo','Kling 3.0 std: brillo')],/voz/]
];
let lines=[];for(const [name,mutate,rewrite,pattern] of cases){const p=structuredClone(plan);mutate(p);const fake=Object.create(fs);fake.readFileSync=(file,...args)=>{if(path.resolve(file)===path.join(P,'plan.json'))return JSON.stringify(p);const value=fs.readFileSync(file,...args);return rewrite&&path.resolve(file)===path.join(P,rewrite[0])?rewrite[1](value):value};
 let message='';try{vm.runInNewContext(src,{fs:fake,path,fileURLToPath,cronograma,process:{argv:[]},console},{timeout:2000})}catch(e){message=e.message}check(pattern.test(message),`${name}: no rechazado por el motivo esperado: ${message}`);lines.push(`${name}: RECHAZADO correctamente`);}
save('validar-mutaciones.txt',lines.join('\n')+'\nEXIT 0\n');console.log(lines.join('\n'));
